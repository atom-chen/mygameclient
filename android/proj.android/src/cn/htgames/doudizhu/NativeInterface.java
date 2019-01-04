package cn.htgames.doudizhu;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Handler;
import android.os.Message;
import android.os.Vibrator;
import android.util.Log;
import android.widget.FrameLayout;

import com.aliencoder.TWebView;
import com.aliencoder.imagepicker.IImagePickerDelegate;
import com.aliencoder.imagepicker.ImagePicker;
import com.aliencoder.networking.INetWorkingDelegate;
import com.aliencoder.networking.TNetWorkingManager;
import com.aliencoder.tools.Utils;
import com.aliencoder.um.UMXinPingTai;
import com.igexin.sdk.PushManager;
import com.tencent.mm.sdk.modelmsg.SendMessageToWX;
import com.thirdplatform.wechat.WeChatManager;

import org.egret.egretframeworknative.engine.EgretGameEngine;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import cn.htgames.doudizhu.authenticate.AuthenticateDelegate;
import cn.htgames.doudizhu.authenticate.AuthenticateManager;
import cn.htgames.doudizhu.authenticate.BindDelegate;

/**
 * Created by rockyl on 16/9/18.
 */
public class NativeInterface implements AuthenticateDelegate, BindDelegate {
	protected static final String TAG = "NativeInterface";

	private interface IRuntimeInterface {
		public void callback(String message);
		// 因为遗留问题 callBack 也是接受的
	}

	Activity activity;
	EgretGameEngine gameEngine;
	FrameLayout rootView;

	TWebView webView;
	Vibrator vibrator;
	TNetWorkingManager manager;
	HashMap<String, JSONObject> callbacks;
	ImagePicker imagePicker;

	String authCallId, bindCallId;

	AuthenticateManager authenticateManager;
	
	CallbackHandler mRechargeHandler = null;
	CallbackHandler mShareHandler = null;

	public NativeInterface(Activity activity, EgretGameEngine gameEngine, FrameLayout rootView){
		this.activity = activity;
		this.gameEngine = gameEngine;
		this.rootView = rootView;

		setup();
	}

	private void setup() {
		authenticateManager = new AuthenticateManager(activity, rootView);
		authenticateManager.authenticateDelegate = this;
		authenticateManager.bindDelegate = this;
		vibrator = (Vibrator)activity.getSystemService(Context.VIBRATOR_SERVICE);
		webView = new TWebView();
		manager = TNetWorkingManager.getInstance();
		callbacks = new HashMap<>();
		imagePicker = new ImagePicker(activity);

		// Egret（TypeScript）－Runtime（Java）通讯
		// setRuntimeInterface(String name, IRuntimeInterface interface) 用于设置一个runtime的目标接口
		// callEgretInterface(String name, String message) 用于调用Egret的接口，并传递消息
		gameEngine.setRuntimeInterface("egretCall", new IRuntimeInterface() {
			@Override
			public void callback(String message) {
				Log.d(TAG, message);

				try {
					JSONObject params = new JSONObject(message);
					String callId = params.getString("id");
					String method = params.getString("method");
					JSONObject args = params.getJSONObject("args");

					callbacks.put(callId, params);
					
					JSONObject retArgs = null;
					switch (method) {
						case "getEnvInfo":            //获取环境信息
							retArgs = getEnvInfo(args, callId);
							break;
						case "userLogin":             //当玩家登陆成功时
							retArgs = userLogin(args, callId);
							break;
						case "userLogout":            //当玩家注销时
							retArgs = userLogout(args, callId);
							break;
						case "getDeviceUUID":         //获取设备唯一码
							retArgs = getDeviceUUID(args, callId);
							break;
						case "closeApp":              //关闭app
							retArgs = closeApp(args, callId);
							break;
						case "navigateToUrl":         //用浏览器打开网址
							retArgs = navigateToUrl(args, callId);
							break;
						case "uploadImageFromDevice": //上传图片
							retArgs = uploadImageFromDevice(args, callId);
							break;
						case "vibrate":               //震动
							retArgs = vibrate(args, callId);
							break;
						case "addWebView":            //打开一个浏览器视图
							retArgs = addWebView(args, callId);
							break;
						case "removeWebView":         //移除浏览器视图
							retArgs = removeWebView(args, callId);
							break;
						case "alert":                 //弹出原生提示框
							retArgs = alert(args, callId);
							break;
						case "authenticate":          //授权sdk
							retArgs = authenticate(args, callId);
							break;
						case "authThirdPart":         //直接调用第三方授权
							retArgs = authThirdPart(args, callId);
							break;
						case "bindThirdPart":         //第三方绑定
							retArgs = bindThirdPart(args, callId);
							break;
						case "recharge":              //充值
							retArgs = recharge(args, callId);
							break;
						case "UMLoginStatistics":
							UMLoginStatistics(args,callId);
							break;
						case "share":               //分享
							retArgs = share(args, callId);
							break;
						case "toClipboard":               //剪切板
							retArgs = toClipboard(args, callId);
							break;
					}

					if (retArgs != null) {
						returnCall(callId, retArgs);
					}

				} catch (JSONException e) {
					e.printStackTrace();
				}

			}
		});
	}

	private void returnCall(String callId, JSONObject retArgs) {
		JSONObject params = callbacks.remove(callId);

		String method = null;
		if (params!=null) {
			try {
				method = params.getString("method");
			} catch (JSONException e) {
				e.printStackTrace();
			}

			callEgret(callId, method, retArgs);
		}
	}

	public void callEgret(String callId, String method, JSONObject retArgs){
		JSONObject retObj = new JSONObject();
		try {
			retObj.put("id", callId);
			retObj.put("method", method);
			retObj.put("args", retArgs);
		} catch (JSONException e) {
			e.printStackTrace();
		}

		String retMessage = retObj.toString();

		gameEngine.callEgretInterface("nativeCall", retMessage);
	}

	private JSONObject getEnvInfo(JSONObject args, String callId) {
		JSONObject ret = new JSONObject();

		Environment env = Environment.getInstance();
		try {
			ret.put("channel_id", env.channelId);
		} catch (JSONException e) {
			e.printStackTrace();
		}

		return ret;
	}
	
	private JSONObject toClipboard(JSONObject args, String callId) {
		JSONObject ret = new JSONObject();

		try {
			ClipboardManager cm = (ClipboardManager)activity.getSystemService(Context.CLIPBOARD_SERVICE);
	        // 将文本内容放到系统剪贴板里。
	        cm.setPrimaryClip(ClipData.newPlainText(args.getString("text"), args.getString("text")));
		} catch (Exception e) {
			e.printStackTrace();
		}

		return ret;
	}

	private JSONObject userLogin(JSONObject args, String callId) {
		GameInfo.getInstance().update(args);

		String uid = GameInfo.getInstance().uid;
		
		// 顺手上传用户信息
		submitLoginInfo();

		boolean result = PushManager.getInstance().bindAlias(activity, uid);
		Log.i(TAG, "绑定结果：" + result);
		return null;
	}

	private JSONObject userLogout(JSONObject args, String callId) {
		boolean result = PushManager.getInstance().unBindAlias(activity, GameInfo.getInstance().uid, true);
		Log.i(TAG, "解绑结果：" + result);

		return null;
	}

	private JSONObject getDeviceUUID(JSONObject args, String callId) {
		JSONObject ret = new JSONObject();

		String uuid = Utils.getUUIDWithMD5(activity);

		try {
			ret.put("uuid", uuid);
		} catch (JSONException e) {
			e.printStackTrace();
		}

		return ret;
	}

	private JSONObject closeApp(JSONObject args, String callId) {
		gameEngine.game_engine_onStop();
		activity.finish();

		return null;
	}

	private JSONObject navigateToUrl(JSONObject args, String callId) {
		try {
			String url = args.getString("url");
			Utils.openWithBrower(activity, url);
		} catch (JSONException e) {
			e.printStackTrace();
		}

		return null;
	}

	private JSONObject uploadImageFromDevice(JSONObject args, final String callId) {
		try {
			String title = args.getString("title");
			final String uploadUrl = args.getString("uploadUrl");

			imagePicker.show(title, new IImagePickerDelegate() {
				JSONObject ret = new JSONObject();

				@Override
				public void onPickImage(Bitmap image) {
					ByteArrayOutputStream stream = new ByteArrayOutputStream();
					image.compress(Bitmap.CompressFormat.JPEG, 100, stream);

					try {
						manager.upload(uploadUrl, stream.toByteArray(), new INetWorkingDelegate() {
							@Override
							public void receive(Object response) {
								JSONObject data = (JSONObject) response;
								try {
									int code = data.getInt("code");
									switch (code) {
										case 0:
											String url = data.getJSONObject("data").getString("file_path");
											ret.put("result", 0);
											ret.put("url", url);
											break;
										default:
											ret.put("result", 3);
											break;
									}
								} catch (JSONException e) {
									e.printStackTrace();
								}
								returnCall(callId, ret);
							}
						});
					} catch (IOException e) {
						e.printStackTrace();
						try {
							ret.put("result", 2);
						} catch (JSONException e1) {
							e1.printStackTrace();
						}
						returnCall(callId, ret);
					}
				}

				@Override
				public void onCancelPick() {
					try {
						ret.put("result", 1);
					} catch (JSONException e) {
						e.printStackTrace();
					}
					returnCall(callId, ret);
				}
			});
		} catch (JSONException e) {
			e.printStackTrace();
		}

		return null;
	}

	private JSONObject vibrate(JSONObject args, final String callId) {
		vibrator.vibrate(600);
		return null;
	}

	private JSONObject addWebView(JSONObject args, final String callId) {
		String url = null;
		try {
			url = args.getString("url");
		} catch (JSONException e) {
			e.printStackTrace();
		}

		webView.addTo(activity, rootView);
		webView.loadByUrl(url);
		return null;
	}

	private JSONObject removeWebView(JSONObject args, final String callId) {
		webView.remove();
		return null;
	}

	private JSONObject alert(JSONObject args, final String callId) {
		String title = null, message = null;
		String btn0 = null, btn1 = null;
		try {
			title = args.getString("title");
			message = args.getString("message");
			JSONArray buttons = args.getJSONArray("buttons");

			btn0 = buttons.getString(0);
			btn1 = buttons.getString(1);
		} catch (JSONException e) {
			e.printStackTrace();
		}

		final JSONObject retArgs = new JSONObject();

		AlertDialog alert;
		alert = new AlertDialog.Builder(activity).setTitle(title).setMessage(message)
			.setPositiveButton(btn0, new DialogInterface.OnClickListener() {
				@Override
				public void onClick(DialogInterface dialog, int which) {
					try {
						retArgs.put("index", 0);
					} catch (JSONException e) {
						e.printStackTrace();
					}
					returnCall(callId, retArgs);
				}
			})
			.setNegativeButton(btn1, new DialogInterface.OnClickListener() {
				@Override
				public void onClick(DialogInterface dialog, int which) {
					try {
						retArgs.put("index", 1);
					} catch (JSONException e) {
						e.printStackTrace();
					}
					returnCall(callId, retArgs);
				}
			})
			.create();

		alert.show();

		return null;
	}

	private JSONObject authenticate(JSONObject args, final String callId){
		/*Authenticate.getInstance().show(activity, new Handler(){
			@Override
			public void handleMessage(Message msg) {
				super.handleMessage(msg);

				returnCall(callId, (JSONObject) msg.obj);
			}
		});*/
		int type=1;
		try {
			type = args.getInt("type");
		}
		catch (JSONException e) {
			e.printStackTrace();
		}
		authCallId = callId;
		if (type==1)
			authenticateManager.showLoginByInput();
		if (type==2)
		{
			WebService.getInstance().loginByGuest(
					Utils.getUUID(activity),
					authenticateManager.onLoginResultHandler
			);
		}
		if (type==3)
			authenticateManager.showLoginByMobile();


		return null;
	}

	private JSONObject authThirdPart(JSONObject args, final String callId){
		int type = 0;
		try {
			type = args.getInt("type");
		} catch (JSONException e) {
			e.printStackTrace();
		}

		switch (type){
			case 0: //mobile

				break;
			case 1: //weixin
//				WXApiManager.getInstance().doAuth(activity, authenticateManager.onWXAuthCallback);
				WeChatManager.getInstance().login(authenticateManager.onWXAuthCallback);
				break;
		}

		authCallId = callId;

		return null;
	}

	private JSONObject bindThirdPart(JSONObject args, final String callId){
		int type = 0;
		try {
			type = args.getInt("type");
		} catch (JSONException e) {
			e.printStackTrace();
		}

		switch (type){
			case 0: //mobile
				authenticateManager.showBindByInput();
				break;
			case 1: //weixin
//				WXApiManager.getInstance().doAuth(activity, authenticateManager.onWXBindCallback);
				WeChatManager.getInstance().login(authenticateManager.onWXBindCallback);
				break;
		}

		bindCallId = callId;

		return null;
	}

	class CallbackHandler extends Handler {
		public String mCallId;

		public CallbackHandler(String callId) {
			mCallId = callId;
		}
		
		@Override
		public void handleMessage(Message msg) {
			super.handleMessage(msg);
			JSONObject retArgs = new JSONObject();
			try {
				retArgs.put("code", msg.what);
			} catch (JSONException e) {
				e.printStackTrace();
			}
			Log.i(TAG, "handleMessage：" + mCallId);
			returnCall(mCallId, retArgs);
		}
	}
	
	private JSONObject recharge(JSONObject args, final String callId){
		String pid = "";

		mRechargeHandler = new CallbackHandler(callId);
		
		try {
			pid = args.getString("id");
		} catch (JSONException e) {
			e.printStackTrace();
		}

		WeChatManager.getInstance().pay(pid, GameInfo.getInstance().uid,
				GameInfo.getInstance().serverType, mRechargeHandler);

		return null;
	}
	
	private JSONObject share(JSONObject args, final String callId){
		String title = "";
		String url = "";
		String desc = "";
		int scene = 0;

		mShareHandler = new CallbackHandler(callId);
		
		try {
			String shareScene = args.getString("type");
			scene = shareScene.equalsIgnoreCase("wx_timeline") ? 
					SendMessageToWX.Req.WXSceneTimeline : SendMessageToWX.Req.WXSceneSession;
			JSONObject params = args.getJSONObject("params");
			url = params.getString("url");
			desc = params.getString("description");
			title = params.getString("title");
		} catch (JSONException e) {
			e.printStackTrace();
		}

		WeChatManager.getInstance().share(url, title, desc, scene, mShareHandler);

		return null;
	}

	private void UMLoginStatistics(JSONObject args, final String callId) {
		String uid;
		int type;
		try {
			uid = args.getString("uid");
			type = args.getInt("type");
			if (type==0)
				UMXinPingTai.getInstance().onProfileSignIn(uid);
			else if (type==1)
				UMXinPingTai.getInstance().onProfileSignIn("WX",uid);
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}


	@Override
	public void onAuthenticateResult(JSONObject response) {
		returnCall(authCallId, response);
	}

	@Override
	public void onAuthenticateCancel() {
		JSONObject response = null;
		try {
			response = new JSONObject("{code: 1}");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		returnCall(authCallId, response);
	}

	@Override
	public void onBindResult(JSONObject response) {
		returnCall(bindCallId, response);
	}

	@Override
	public void onBindCancel() {
		JSONObject response = null;
		try {
			response = new JSONObject("{code: 1}");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		returnCall(bindCallId, response);
	}

	public void onActivityResult(int requestCode, int resultCode, Intent data) {
		imagePicker.onActivityResult(requestCode, resultCode, data);
	}
	
	private void submitLoginInfo() {
		String userToken = GameInfo.getInstance().token;
		String userId = GameInfo.getInstance().uid;
		String osType = "android";
		String channelId = activity.getString(R.string.install_channel);
		
		// 直接发送用户信息给web接口做统计
		Map<String, String> paramMap = new HashMap<String, String>();
		paramMap.put("uid", userId);
		paramMap.put("token", userToken);
		paramMap.put("os_type", osType);
		paramMap.put("channel_id", channelId);
		
		Log.d(TAG, "submitLoginInfo token:" + userToken 
				+ " uid:" + userId + " os_type:" + osType
				+ " channel_id:" + channelId);
		
		WebService.getInstance().callApi("user", "channel", paramMap, new Handler() {
				@Override
				public void handleMessage(Message msg) {
					JSONObject resp = (JSONObject)msg.obj;
					if (resp == null) {
						Log.e(TAG, "submitLoginInfo got no response!");
						return ;
					}
					
					try {
						int code = resp.getInt("code");
		
						if(code == 0) {
							Log.d(TAG, "submitLoginInfo success!");
						} else {
							Log.e(TAG, "submitLoginInfo failed!" + code);
						}
					} catch (JSONException e) {
						e.printStackTrace();
					}
					
					super.handleMessage(msg);
				}
			}, "POST", null, null, null);
	}
}
