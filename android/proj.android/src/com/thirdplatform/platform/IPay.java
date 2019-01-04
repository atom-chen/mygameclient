package com.thirdplatform.platform;

import android.os.Handler;

public interface IPay {
	// params
	public static final String PRODUCT_ID = "product_id";
	public static final String OS_TYPE = "os";
	public static final String USER_ID = "uid";
	public static final String SERVER_TAIL = "type";
	public static final String TRADE_TYPE = "trade_type";
	
	// os type
	public static final String OS_ANDROID = "1";
//	public static final String OS_IOS = "1"; // ios ?
	
	public boolean pay(String productId, String userId, String serverType, Handler callbackHandler);
	public void onPayResult(int code, String msg);
	
	public String getOrderActionString();
}
