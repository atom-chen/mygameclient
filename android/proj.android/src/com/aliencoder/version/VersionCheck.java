package com.aliencoder.version;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Handler;
import android.util.Log;

import cn.htgames.doudizhu.R;

import com.aliencoder.networking.INetWorkingDelegate;
import com.aliencoder.networking.TNetWorkingManager;
import com.aliencoder.tools.Utils;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by rockyl on 2016/11/11.
 *
 * 版本检查
 */

public class VersionCheck {
	static final String TAG = "VersionCheck";

	private Activity activity;
	private Handler handler;

	private TNetWorkingManager manager;
	private String packageName;
	private PackageInfo packageInfo;
	private AlertDialog alert;

	public VersionCheck(Activity activity, Handler handler){
		this.activity = activity;
		this.handler = handler;
		manager = new TNetWorkingManager();

		packageName = activity.getPackageName();
		PackageManager packageManager = activity.getPackageManager();
		try {
			packageInfo = packageManager.getPackageInfo(packageName, PackageManager.GET_CONFIGURATIONS);
		} catch (PackageManager.NameNotFoundException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 开始版本检查
	 * @param channelId
	 */
	public void check(final int channelId){
		Map<String, String> parameters = new HashMap<String, String>();
		parameters.put("id", packageName);
		parameters.put("platform", "Android");
		parameters.put("channel", channelId + "");

		String checkUrl = activity.getString(R.string.check_version_url);
		Log.i(TAG, "load config from " + checkUrl);
		try {
			manager.GET(checkUrl, parameters, new INetWorkingDelegate() {
				@Override
				public void receive(Object response) {
					JSONObject data = (JSONObject) response;
					if (data == null) {
						handler.sendEmptyMessage(7);
						return;
					}
					
					try {
						int code = data.getInt("code");
						if(code == 0){
							compareVersion(data.getJSONObject("data"));
						}else{
							handler.sendEmptyMessage(6);
						}
					} catch (JSONException e) {
						e.printStackTrace();
						handler.sendEmptyMessage(5);
					}
				}
			});
		} catch (IOException e) {
			e.printStackTrace();

			Log.i(TAG, "load config error");
			handler.sendEmptyMessage(1);
		}
	}

	/**
	 * 版本对比
	 * @param data
	 */
	private void compareVersion(JSONObject data){
		Log.i(TAG, "loaded config");

		try {
			String[] latestVersion = data.getString("version").split("\\.");
			int latestBuild = data.getInt("build");
			String[] currentVersion = packageInfo.versionName.split("\\.");
			int currentBuild = packageInfo.versionCode;
			boolean needUpdate = false;
			for(int i = 0, li = currentVersion.length; i < li; i++){
				if(i < latestVersion.length){
					if(Integer.parseInt(latestVersion[i]) > Integer.parseInt(currentVersion[i])){
						needUpdate = true;
						break;
					}
				}
			}
			if(!needUpdate){
				if(latestBuild > currentBuild){
					needUpdate = true;
				}
			}

			if(needUpdate){
				showSuggestions(data.getString("url"));
			}else{
				handler.sendEmptyMessage(3);
			}
		} catch (JSONException e) {
			e.printStackTrace();
			handler.sendEmptyMessage(2);
		}
	}

	private void showSuggestions(final String url){
		activity.runOnUiThread(new Runnable() {
			@Override
			public void run() {
				if (alert == null) {
					alert = new AlertDialog.Builder(activity).setTitle(activity.getString(R.string.version_text))
						.setPositiveButton(R.string.version_update, new DialogInterface.OnClickListener() {
							@Override
							public void onClick(final DialogInterface dialog, final int which) {
								Utils.openWithBrower(activity, url);
								handler.sendEmptyMessage(0);
								dialog.dismiss();
							}
						})
						.setNegativeButton(R.string.version_cancel, new DialogInterface.OnClickListener() {
							@Override
							public void onClick(DialogInterface dialog, int which) {
								handler.sendEmptyMessage(4);
								dialog.dismiss();
							}
						}).create();
				}
				alert.setCancelable(false);
				alert.setCanceledOnTouchOutside(false);
				alert.show();
			}
		});
	}
}
