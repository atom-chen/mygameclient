package cn.htgames.doudizhu;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.FrameLayout;

import com.aliencoder.egret.UpgradeManager;
import com.aliencoder.notification.APNs;
import com.aliencoder.version.VersionCheck;
import com.igexin.sdk.PushManager;
import com.thirdplatform.ali.AliPayManager;
import com.thirdplatform.wechat.WeChatManager;
import com.umeng.analytics.MobclickAgent;
import com.umeng.analytics.game.UMGameAgent;

import org.egret.egretframeworknative.EgretRuntime;
import org.egret.egretframeworknative.engine.EgretGameEngine;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.util.HashMap;
import java.util.Timer;
import java.util.TimerTask;

@SuppressLint("HandlerLeak") 
public class doudizhu extends Activity {
	public static Activity mainActivity;

	private static final String EGRET_ROOT = "egret";
	private String EGRET_PUBLISH_ZIP;
	protected static final String TAG = "doudizhu";

	private EgretGameEngine gameEngine;
	private String egretRoot;
	private String gameId;
	private int mode;
	private String loaderUrl;
	private String updateUrl;

	private FrameLayout rootView;
	private FrameLayout gameLayer;

	UpgradeManager upgradeManager;
	NativeInterface nativeInterface;

	private Timer backgroundTaskTimer;
	private boolean backgroundTaskFlag;

	private static final boolean IS_UPGRADE_ON = true;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		mainActivity = this;
		
		// init sdk
		WeChatManager.getInstance().init(mainActivity);
		AliPayManager.getInstance().init(mainActivity);

		// url已经无效 所以直接关掉
//		InfoCollection.getInstance().start(this);

		requestWindowFeature(Window.FEATURE_NO_TITLE);
		getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
			WindowManager.LayoutParams.FLAG_FULLSCREEN);

		setContentView(rootView = new FrameLayout(this));
		rootView.addView(gameLayer = new FrameLayout(this));
		rootView.setBackgroundColor(Color.WHITE);

		versionCheck();
//		upgradeCheck();
		

		PushManager.getInstance().initialize(this.getApplicationContext(), APNs.class);
		PushManager.getInstance().registerPushIntentService(this.getApplicationContext(), IntentService.class);

		UMGameAgent.setDebugMode(false);
		UMGameAgent.init(this.getApplicationContext());
		MobclickAgent.setScenarioType(this.getApplicationContext(), MobclickAgent.EScenarioType.E_UM_GAME);
//		UMGameAgent.pay(1,3000,1);
//		UMGameAgent.onProfileSignIn("WX","12345");
//		当应用在后台运行超过30秒（默认）再回到前端，将被认为是两个独立的session(启动)，例如用户回到home，或进入其他程序，经过一段时间后再返回之前的应用。
// 		可通过接口：MobclickAgent.setSessionContinueMillis(long interval) 来自定义这个间隔（参数单位为毫秒）。
//		如果开发者调用Process.kill或者System.exit之类的方法杀死进程，请务必在此之前调用MobclickAgent.onKillProcess(Context context)方法，用来保存统计数据。
		MobclickAgent.setSessionContinueMillis(1000);

		//compile 'com.umeng.analytics:analytics:latest.integration'
//		UMGameAgent.pay
//		UMGameAgent.pay();
	}

	void versionCheck() {
//		ApplicationInfo appInfo = null;
//		try {
//			appInfo = this.getPackageManager()
//				.getApplicationInfo(getPackageName(),
//					PackageManager.GET_META_DATA);
//		} catch (PackageManager.NameNotFoundException e) {
//			e.printStackTrace();
//		}
		int channelId = Integer.parseInt(getString(R.string.install_channel));//appInfo.metaData.getInt("CHANNEL_ID");
		Environment.getInstance().channelId = channelId;

		new VersionCheck(this, new Handler() {
			@Override
			public void handleMessage(Message msg) {
				super.handleMessage(msg);

				Log.i(TAG, "check version result: " + msg.what);
				upgradeCheck();
			}
		}).check(channelId);
	}

	void upgradeCheck() {
//		ApplicationInfo appInfo = null;
//		try {
//			appInfo = this.getPackageManager()
//				.getApplicationInfo(getPackageName(),
//					PackageManager.GET_META_DATA);
//		} catch (PackageManager.NameNotFoundException e) {
//			e.printStackTrace();
//		}
		int channelId = Integer.parseInt(getString(R.string.install_channel));//appInfo.metaData.getInt("CHANNEL_ID");
		Environment.getInstance().channelId = channelId;

		EGRET_PUBLISH_ZIP = getString(R.string.publish_zip);
		int loadMode = Integer.parseInt(getString(R.string.load_mode));

		setLoaderUrl(loadMode);

		if (IS_UPGRADE_ON && mode == 0) {
			upgradeManager = new UpgradeManager(this, getString(R.string.check_url));
			upgradeManager.checkForUpgrade(new Handler() {
				@Override
				public void handleMessage(Message msg) {
					super.handleMessage(msg);

					int result = msg.what;
					JSONObject data = (JSONObject) msg.obj;
					if (result == 0) {
						try {
							loaderUrl = data.getString("game_code_url");
							updateUrl = data.getString("resource_url");
						} catch (JSONException e) {
							loaderUrl = EGRET_PUBLISH_ZIP;
							updateUrl = "";
							e.printStackTrace();
						}
					} else {
						loaderUrl = EGRET_PUBLISH_ZIP;
						updateUrl = "";
					}

					createEgretEngine();
				}
			});
		} else {
			createEgretEngine();
		}
	}

	private void createEgretEngine() {
		egretRoot = new File(getFilesDir(), EGRET_ROOT).getAbsolutePath();
		gameId = "local";

		gameEngine = new EgretGameEngine();
		// 设置游戏的选项  (set game options)
		HashMap<String, Object> options = getGameOptions();
		gameEngine.game_engine_set_options(options);
		// 设置加载进度条  (set loading progress bar)
		gameEngine.game_engine_set_loading_view(new EgretUpgradeView(this, this.upgradeManager));
		// 创建Egret<->Runtime的通讯 (create pipe between Egret and Runtime)

		nativeInterface = new NativeInterface(this, gameEngine, rootView);

		// 初始化并获得渲染视图 (initialize game engine and obtain rendering view)
		gameEngine.game_engine_init(this);
		View gameEngineView = gameEngine.game_engine_get_view();

		gameLayer.addView(gameEngineView);
	}

	private HashMap<String, Object> getGameOptions() {
		HashMap<String, Object> options = new HashMap<String, Object>();
		options.put(EgretRuntime.OPTION_EGRET_GAME_ROOT, egretRoot);
		options.put(EgretRuntime.OPTION_GAME_ID, gameId);
		options.put(EgretRuntime.OPTION_GAME_LOADER_URL, loaderUrl);
		options.put(EgretRuntime.OPTION_GAME_UPDATE_URL, updateUrl);
		return options;
	}

	private void setLoaderUrl(int mode) {
		this.mode = mode;
		switch (mode) {
			case 2:
				// local DEBUG mode
				// 本地DEBUG模式，发布请使用0本地zip，或者1网络获取zip
				loaderUrl = "";
				updateUrl = "";
				break;
			case 1:
				// http request zip RELEASE mode, use permission INTERNET
				// 请求网络zip包发布模式，需要权限 INTERNET
				loaderUrl = "http://www.example.com/" + EGRET_PUBLISH_ZIP;
				updateUrl = "http://www.example.com/";
				break;
			default:
				// local zip RELEASE mode, default mode, `egret publish -compile --runtime native`
				// 私有空间zip包发布模式, 默认模式, `egret publish -compile --runtime native`
				loaderUrl = EGRET_PUBLISH_ZIP;
				updateUrl = "";
				break;
		}
	}

	@Override
	public void onPause() {
		super.onPause();
		UMGameAgent.onPause(this.getApplicationContext());
		if (gameEngine != null) gameEngine.game_engine_onPause();

		this.startBackgroundTask("HEART_BEAT");
	}

	@Override
	protected void onDestroy(){
		MobclickAgent.onKillProcess(this.getApplicationContext());
		super.onDestroy();
		
		System.exit(0);
	}
	@Override
	public void onResume() {
		super.onResume();
		UMGameAgent.onResume(this.getApplicationContext());
		if (gameEngine != null) {
			gameEngine.game_engine_onResume();
			nativeInterface.callEgret(null, "active", null);
		}

		this.stopBackgroundTask();
	}

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		switch (keyCode) {
			case KeyEvent.KEYCODE_BACK:
				//if(gameEngine != null) gameEngine.callEgretInterface("back", "");
//				showExitDialog();
				return true;
			default:
				return super.onKeyDown(keyCode, event);
		}
	}
	
	private void showExitDialog() {
		// 退出游戏
		new AlertDialog.Builder(this).setTitle(R.string.exit_title).setMessage(R.string.exit_content)
		.setPositiveButton(R.string.exit_btn_ok, new DialogInterface.OnClickListener() {
			@Override
			public void onClick(DialogInterface dialog, int which) {
				finish();
			}
		})
		.setNegativeButton(R.string.exit_btn_cancel, new DialogInterface.OnClickListener() {
			@Override
			public void onClick(DialogInterface dialog, int which) {
				
			}
		}).create().show();
	}

	private void startBackgroundTask(final String method) {
		if (backgroundTaskTimer == null) {
			TimerTask task = new TimerTask() {
				@Override
				public void run() {
					if (backgroundTaskFlag) {
						if(gameEngine == null){
							return;
						}

						JSONObject retObj = new JSONObject();
						try {
							retObj.put("method", method);
						} catch (JSONException e) {
							e.printStackTrace();
						}

						String retMessage = retObj.toString();

						gameEngine.callEgretInterface("nativeCall", retMessage);

						Log.i("startBackgroundTask", method);
					}
				}
			};

			backgroundTaskTimer = new Timer();
			backgroundTaskTimer.schedule(task, 1000, 10000);
		}

		backgroundTaskFlag = true;
	}

	private void stopBackgroundTask() {
		backgroundTaskFlag = false;
	}

	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		nativeInterface.onActivityResult(requestCode, resultCode, data);
	}
}
