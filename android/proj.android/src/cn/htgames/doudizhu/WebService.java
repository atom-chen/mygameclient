package cn.htgames.doudizhu;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;

import com.aliencoder.networking.INetWorkingDelegate;
import com.aliencoder.networking.TNetWorkingManager;
import com.aliencoder.tools.Utils;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by rockyl on 16/9/10.
 */
public class WebService {
	public static String TAG = "WebService";

	private static int evn = 2;
	private String WEB_API_ROOT;

	private TNetWorkingManager manager;

	public WebService(){
		manager = TNetWorkingManager.getInstance();

		switch(evn){
			case 0:
				WEB_API_ROOT = "http://192.168.0.86:8998/";
				break;
			case 1:
				WEB_API_ROOT = "http://platform.zhen69.com:18998/";
				break;
			case 2:
//				WEB_API_ROOT = "http://pl.doudizhu.htgames.cn:8998/";
				WEB_API_ROOT = "http://pl.ddz.htgames.cn:18998/";
//				WEB_API_ROOT = "http://leepuman.tunnel.wenzhoueyewear.cn/";
				break;
		}
	}
	
	public String setTestAPIRoot(String testUrl) {
		String srcUrl = WEB_API_ROOT;
		WEB_API_ROOT = testUrl;
		
		return srcUrl;
	}

	public void callApi(final String module, String action, Map<String, String> params, final Handler handler, String method,String sn,String tm,String ds){
		String url = WEB_API_ROOT + module + "/" + action;

		Log.i(TAG, "callApi:" + url);

		final Message msg = new Message();

		final Bundle bundle = new Bundle();
		bundle.putString("module", module);
		bundle.putString("action", action);
		msg.setData(bundle);

		INetWorkingDelegate delegate = new INetWorkingDelegate() {
			@Override
			public void receive(Object response) {
				msg.obj = response;
				handler.sendMessage(msg);
			}
		};

		try {
			switch (method){
				case "POST":
					manager.POST(url, params, delegate, 5000);
					break;
				case "POSTWithHeader":
					manager.POSTWithHeader(url, params, sn,tm,ds,delegate, 5000);
					break;
				case "GET":
					manager.GET(url, params, delegate, 5000);
					break;
			}
		} catch (IOException e) {
			e.printStackTrace();
			handler.sendMessage(msg);
		}
	}

	public void loginByInput(String uuid,String id, String password, Handler handler){
		HashMap<String, String> params = new HashMap<>();
		params.put("adid", uuid);
		params.put("os", "1");
		params.put("username", id);
		params.put("password", password);

		callApi("index", "login", params, handler, "POST",null,null,null);
	}

	public void loginByMobile(String uuid,String phone, String code, Handler handler){
		HashMap<String, String> params = new HashMap<>();
//		params.put("adid", uuid);
//		params.put("os", "1");
		params.put("phone", phone);
		params.put("code", code);

		callApi("user", "login", params, handler, "POST",null,null,null);
	}

	public void loginByRegister(String uuid,String id, String password, Handler handler){
		HashMap<String, String> params = new HashMap<>();
		params.put("adid", uuid);
		params.put("os", "1");
		params.put("username", id);
		params.put("password", password);

		callApi("user", "register", params, handler, "POST",null,null,null);
	}

	public void loginByGuest(String uuid, Handler handler){
		HashMap<String, String> params = new HashMap<>();
		params.put("device", uuid);

		callApi("index", "guest", params, handler, "POST",null,null,null);
	}

	public void loginByWeiXinCode(String uuid,String code, String packageName, Handler handler){
		HashMap<String, String> params = new HashMap<>();
		params.put("adid", uuid);
		params.put("os", "1");
		params.put("code", code);
		params.put("type", "1");
		params.put("package", packageName);

		callApi("index", "login", params, handler, "POST",null,null,null);
	}

//	public void bindByWeiXin(String uuid, String code, String packageName, Handler handler){
//		HashMap<String, String> params = new HashMap<>();
//		params.put("wxcode", code);
//		params.put("device_id", uuid);
//		params.put("type", "1");
//		params.put("package", packageName);
//
//		callApi("user", "bind", params, handler, "POST",null,null,null);
//	}

	public void bindByWeiXin(Activity activity, String uuid, String code, String packageName, Handler handler){
		SharedPreferences user_info=activity.getSharedPreferences("user_info", Context.MODE_PRIVATE);
		String uid=user_info.getString("uid", null);
		String token=user_info.getString("token", null);
		if (uid==null || token==null)
			Utils.alert(activity, "抱歉", "请重新登录后再绑定");
		else {
			Date date = new Date();
			long tm = date.getTime();
			int ds = (int) (Math.random() * 100);
			String encrypy_key = activity.getString(R.string.encrypy_key);

			HashMap<String, String> params = new HashMap<>();
			params.put("wxcode", code);
			params.put("uid", uid);
			params.put("type", "1");
			params.put("package", packageName);

			String sn = "package"+packageName+"type"+"1"+"uid"+uid+"wxcode"+code + token + tm + ds + encrypy_key;
			sn = Utils.md5(sn);

			callApi("user", "bindByUid", params, handler, "POSTWithHeader", sn, tm + "", ds + "");
		}
	}
	public void bindByMobile(Activity activity,String phone, String code, String uuid, Handler handler){
		SharedPreferences user_info=activity.getSharedPreferences("user_info", Context.MODE_PRIVATE);
		String uid=user_info.getString("uid", null);
		String token=user_info.getString("token", null);
		if (uid==null || token==null)
			Utils.alert(activity, "抱歉", "请重新登录后再绑定");
		else {
			Date date = new Date();
			long tm = date.getTime();
			int ds = (int) (Math.random() * 100);
			String encrypy_key = activity.getString(R.string.encrypy_key);

			HashMap<String, String> params = new HashMap<>();
			params.put("phone", phone);
			params.put("code", code);
			params.put("uid", uid);

			String sn = "code" + code + "phone" + phone + "uid" + uid + token + tm + ds + encrypy_key;
			sn = Utils.md5(sn);

			callApi("user", "bindByUid", params, handler, "POSTWithHeader", sn, tm + "", ds + "");
		}
	}

	public void resetPassword(String phone, String code, String password, Handler handler){
		HashMap<String, String> params = new HashMap<>();
		params.put("phone", phone);
		params.put("code", code);
		params.put("password", password);

		callApi("user", "resetPassword", params, handler, "POST",null,null,null);
	}

	public void getPayOrderString(String type, String uid, String pid, Handler handler){
		HashMap<String, String> params = new HashMap<>();
		params.put("type", type);
		params.put("uid", uid);
		params.put("product_id", pid);
		params.put("os", "1");

		callApi("shop", "shOrder", params, handler, "POST",null,null,null);
	}

	public void getCode(String phone,String action, Handler handler){
		HashMap<String, String> params = new HashMap<>();
		params.put("phone", phone);
		params.put("action", action);

		callApi("user", "getYunCode", params, handler, "GET",null,null,null);
	}

	private static WebService _instance;
	public static WebService getInstance(){
		if(_instance == null){
			_instance = new WebService();
		}
		return _instance;
	}
}
