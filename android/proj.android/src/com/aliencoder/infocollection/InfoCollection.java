package com.aliencoder.infocollection;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;

import com.aliencoder.networking.TNetWorkingManager;
import com.aliencoder.tools.Utils;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import cn.htgames.doudizhu.R;

/**
 * Created by rockyl on 16/6/12.
 */
public class InfoCollection {
	private static InfoCollection instance;
	public static InfoCollection getInstance(){
		if(instance == null){
			instance = new InfoCollection();
		}

		return instance;
	}

	private Activity activity;
	private TNetWorkingManager manager;

	public void start(Activity activity){
		this.activity = activity;
		checkInstall();
	}

	public InfoCollection() {
		manager = new TNetWorkingManager();
	}

	private void checkInstall(){
		SharedPreferences sharedPreferences = activity.getSharedPreferences("appData", Context.MODE_PRIVATE);
		int launchCount = sharedPreferences.getInt("launch_count", 0);
		launchCount ++;

		if(launchCount == 1){
			Map<String, String> parameters = new HashMap<String, String>(){{
				put("channel", activity.getString(R.string.install_channel));
				put("device_id", Utils.getUUIDWithMD5(activity));
			}};
			try {
				manager.POST(activity.getString(R.string.install_url), parameters, null);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		SharedPreferences.Editor editor = sharedPreferences.edit();
		editor.putInt("launch_count", launchCount);
		editor.apply();
	}
}
