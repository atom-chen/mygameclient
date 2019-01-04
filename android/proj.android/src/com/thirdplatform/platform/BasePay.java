package com.thirdplatform.platform;

import java.util.Map;

import android.app.Activity;
import android.os.Handler;

import cn.htgames.doudizhu.WebService;

public class BasePay {	
	// main method
	private static final String MAIN_METHOD = "shop";
	// link type
	private static final String HTTP_POST = "POST";
	private static final String HTTP_GET = "GET";
	
	protected Activity mActivity = null;
	
	public void init(Activity activity) {
		mActivity = activity;
	}
	
	public void makeOrder(String orderAction, Map<String, String> paramMap, Handler handler) {
//		String srcUrlString = WebService.getInstance().setTestAPIRoot("http://leepuman.tunnel.wenzhoueyewear.cn/");
		WebService.getInstance().callApi(MAIN_METHOD, orderAction, paramMap, handler, HTTP_POST, null, null, null);
//		WebService.getInstance().setTestAPIRoot(srcUrlString);
	}
}
