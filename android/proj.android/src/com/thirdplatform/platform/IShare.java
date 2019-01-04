package com.thirdplatform.platform;

import android.os.Handler;

public interface IShare {
	public void share(String url, String title, String description, int scene, Handler handler);
	
	public void onShareResult(int code, String msg);
}
