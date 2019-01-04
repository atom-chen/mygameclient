package com.aliencoder.egret;

import android.app.Activity;
import android.content.Context;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.View;
import com.aliencoder.networking.INetWorkingDelegate;
import com.aliencoder.networking.TNetWorkingManager;
import com.kaopiz.kprogresshud.KProgressHUD;

import android.content.SharedPreferences;

import org.egret.egretframeworknative.engine.IGameZipUpdateListener;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import cn.htgames.doudizhu.R;

/**
 * Created by NGames on 2015/4/16.
 */
public class UpgradeManager extends View implements IGameZipUpdateListener {
	public static String TAG = "UpgradeManager";

	Activity activity;
	String checkUrl;

	private TNetWorkingManager manager;
	private Handler handler;
	private KProgressHUD hud;

	public UpgradeManager(Activity activity, String checkUrl){
		super(activity);

		this.activity = activity;
		this.checkUrl = checkUrl;

		manager = new TNetWorkingManager();

		hud = KProgressHUD.create(activity)
			.setStyle(KProgressHUD.Style.SPIN_INDETERMINATE)
			.setLabel(activity.getString(R.string.checking));
	}

	public void checkForUpgrade(Handler handler){
		this.handler = handler;

		hud.show();

		final String packageName = activity.getPackageName();
		Map<String, String> parameters = new HashMap<String, String>(){{
			put("id", packageName);
			put("platform", "Android");
			put("check", "1");
		}};
		try {
			manager.GET(checkUrl, parameters, new INetWorkingDelegate() {
				@Override
				public void receive(Object response) {
					JSONObject data = (JSONObject) response;
					onCheckResponse(data);
				}
			});
		} catch (IOException e) {
			e.printStackTrace();
			sendCheckResult(1, null);
		}
	}

	void onCheckResponse(JSONObject response){
		int result = 0;
		JSONObject data = null;
		if(response == null){
			onGameZipUpdateError();
			result = 2;
		}else{
			try {
				int code = response.getInt("code");
				if(code == 0){
					data = response.getJSONObject("data");

					SharedPreferences upgrade_info=activity.getSharedPreferences("upgrade_info", Context.MODE_PRIVATE);
					String local_game_code=upgrade_info.getString("game_code", null);
					String online_game_code=data.getString("game_code_url");
					result = 0;
					if (local_game_code!=null && local_game_code.equals(online_game_code))
					{
						hud.dismiss();
					}
					else {
						SharedPreferences.Editor editor = upgrade_info.edit();
						editor.putString("game_code", online_game_code);
						editor.commit();

						activity.runOnUiThread(new Runnable() {
							@Override
							public void run() {
								hud.setStyle(KProgressHUD.Style.PIE_DETERMINATE);
								hud.setLabel(activity.getString(R.string.upgrading));
								hud.setMaxProgress(100);
							}
						});
					}
				}else{
					onGameZipUpdateError();

					result = 2;
				}
			} catch (JSONException e) {
				e.printStackTrace();
				onGameZipUpdateError();

				result = 2;
			}
		}

		sendCheckResult(result, data);
	}

	void sendCheckResult(int result, JSONObject data){
		Message msg = new Message();
		msg.what = result;
		msg.obj = data;
		handler.sendMessage(msg);
	}

	public void onProgress(final float progress) {
	}

	@Override
	public void onGameZipUpdateSuccess() {
		activity.runOnUiThread(new Runnable() {
			@Override
			public void run() {
				hud.setLabel(activity.getString(R.string.upgrade_success));

				hud.dismiss();
			}
		});
	}

	@Override
	public void onGameZipUpdateError() {
		activity.runOnUiThread(new Runnable() {
			@Override
			public void run() {
				hud.setLabel(activity.getString(R.string.upgrade_error));

				hud.dismiss();
			}
		});
	}

	@Override
	public void onGameZipUpdateProgress(final float percent) {
		Log.i(TAG, "percent:" + percent);
		activity.runOnUiThread(new Runnable() {
			@Override
			public void run() {
				hud.setProgress((int) percent);
			}
		});
	}
}
