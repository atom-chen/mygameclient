package com.thirdplatform.platform;

import android.os.Handler;

public interface IUser {
	public void login(Handler callbackHandler);
	public void logout(Handler callbackHandler);
	
	public void onLoginResult(int code, String msg);
}
