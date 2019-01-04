package com.thirdplatform.wechat;

import java.io.ByteArrayOutputStream;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Bitmap.CompressFormat;
import android.os.AsyncTask;
import android.os.Handler;
import android.os.Message;
import android.util.Log;

import cn.htgames.doudizhu.R;

import com.tencent.mm.sdk.constants.ConstantsAPI;
import com.tencent.mm.sdk.modelbase.BaseResp;
import com.tencent.mm.sdk.modelmsg.SendAuth;
import com.tencent.mm.sdk.modelmsg.SendMessageToWX;
import com.tencent.mm.sdk.modelmsg.WXImageObject;
import com.tencent.mm.sdk.modelmsg.WXMediaMessage;
import com.tencent.mm.sdk.modelmsg.WXWebpageObject;
import com.tencent.mm.sdk.modelpay.PayReq;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.WXAPIFactory;

import com.thirdplatform.platform.BasePay;
import com.thirdplatform.platform.IPay;
import com.thirdplatform.platform.IShare;
import com.thirdplatform.platform.IUser;
import com.thirdplatform.platform.PlatformConstants;

@SuppressLint("HandlerLeak")
public class WeChatManager extends BasePay implements IPay, IUser, IShare {
	public static final String WX_APPID = "wx44e54c235e4144c5";
	
	private static final String TAG = "WeChatManager";
	
	private static WeChatManager sInstance = null;
	
	private IWXAPI mWxApi = null;
	private Handler mCallbackHandler = null;
	private byte[] mShareThumb;
	
	private WeChatManager() {
		
	}
	
	public static WeChatManager getInstance() {
		if (sInstance == null) {
			sInstance = new WeChatManager();
		}
		
		return sInstance;
	}
	
	public void init(Activity activity) {
		super.init(activity);
		
		// wechat init
		mWxApi = WXAPIFactory.createWXAPI(mActivity, WX_APPID);
		mWxApi.registerApp(WX_APPID);
		
		makeThumbnail(mActivity);
	}
	
	private void makeThumbnail(Activity activity) {
		Bitmap bmp = BitmapFactory.decodeResource(activity.getResources(), R.drawable.share_icon);
		Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, 120, 120, true);
		bmp.recycle();
		
		mShareThumb = bmpToByteArray(thumbBmp, true);
	}
	
	private byte[] bmpToByteArray(final Bitmap bmp, final boolean needRecycle) {
		ByteArrayOutputStream output = new ByteArrayOutputStream();
		bmp.compress(CompressFormat.PNG, 100, output);
		if (needRecycle) {
			bmp.recycle();
		}
		
		byte[] result = output.toByteArray();
		try {
			output.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return result;
	}
	
	@Override
	public boolean pay(String productId, String userId, String serverType, Handler callbackHandler) {
		if (mActivity == null) {
			Log.e(TAG, "Activity is null! Please call Pay.init first!");
			return false;
		}
		
		mCallbackHandler = callbackHandler;
//		if (!mWxApi.isWXAppInstalled()) {
//			onPayResult(PlatformConstants.PAY_RESULT_CANCEL, "WeChat is not installed!");
//			return false;
//		}

		// call web service to make order
		Map<String, String> paramMap = new HashMap<String, String>();
		paramMap.put(PRODUCT_ID, productId);
		paramMap.put(OS_TYPE, OS_ANDROID);
		paramMap.put(USER_ID, userId);
		paramMap.put(SERVER_TAIL, serverType);
		paramMap.put(TRADE_TYPE, "APP");
		
		makeOrder(getOrderActionString(), paramMap, new Handler() {
			@Override
			public void handleMessage(Message msg) {
				super.handleMessage(msg);
				
				JSONObject resp = (JSONObject)msg.obj;
				if (resp == null) {
					onPayResult(PlatformConstants.PAY_RESULT_FAILED_BASE + 5000, "Web service no response!");
					return ;
				}
				
				try {
					int code = resp.getInt("code");
	
					if(code == 0) {
						JSONObject orderInfo = resp.getJSONObject("data");
						doPay(orderInfo);
					} else {
						onPayResult(PlatformConstants.PAY_RESULT_FAILED_BASE + code, "Web service error! Make order failed!");
					}
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}
		});
		
		return true;
	}

	@Override
	public void onPayResult(int code, String msg) {
		if (mCallbackHandler != null) {
			mCallbackHandler.sendEmptyMessage(code);
		} else {
			Log.e(TAG, "pay callback not found!");
		}
	}

	@Override
	public String getOrderActionString() {
		return "wechatpayOrder";
	}

	// real pay
	private void doPay(final JSONObject orderInfo) {
		final PayReq req = new PayReq();
		try {
			req.appId = orderInfo.getString("appid");
			req.partnerId = orderInfo.getString("partnerid");
			req.prepayId = orderInfo.getString("prepayid");
			req.nonceStr = orderInfo.getString("noncestr");
			req.timeStamp = orderInfo.getString("timestamp");
			req.packageValue = orderInfo.getString("package");
			req.sign = orderInfo.getString("sign");
			req.extData = "app data"; // optional
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		mWxApi.sendReq(req);
	}

	public void onWeChatResp(BaseResp resp) {
		if (resp == null) {
			Log.e(TAG, "resp == null!!!");
//			return;
		}
		int type = resp.getType();
		Log.d(TAG, "wechat resp type:" + type);
		Log.d(TAG, "wechat resp errCode:" + resp.errCode + " errStr:" + resp.errStr);
		
		//if (resp instanceof SendAuth.Resp) { // auth
		if (type == ConstantsAPI.COMMAND_SENDAUTH) { // auth
			if (mCallbackHandler != null) {
//				Message msg = new Message();
//				msg.what = resp.errCode;
//				msg.obj = resp.errStr;
//				mCallbackHandler.sendMessage(msg);
				Message msg = new Message();
				msg.obj = resp;
				mCallbackHandler.sendMessage(msg);
			}
		} else if (type == ConstantsAPI.COMMAND_SENDMESSAGE_TO_WX) { // share
			int code = PlatformConstants.SHARE_RESULT_FAILED_BASE;
			
			switch (resp.errCode) {
			case BaseResp.ErrCode.ERR_OK:
				code = PlatformConstants.SHARE_RESULT_SUCC;
				break;
			default:
				break;
			}
			onShareResult(code, resp.errStr);
		} else if (type == ConstantsAPI.COMMAND_PAY_BY_WX) { // pay
			int code = PlatformConstants.PAY_RESULT_FAILED_BASE;

			switch (resp.errCode) {
				case BaseResp.ErrCode.ERR_OK:
					code = PlatformConstants.PAY_RESULT_SUCC;
					break;
				case BaseResp.ErrCode.ERR_COMM:
					break;
				case BaseResp.ErrCode.ERR_USER_CANCEL:
					code = PlatformConstants.PAY_RESULT_CANCEL;
					break;
				case BaseResp.ErrCode.ERR_AUTH_DENIED:
					break;
				default:
					break;
			}

			onPayResult(code, resp.errStr);
		}
		
	}
	
	@Override
	public void login(Handler callbackHandler) {
		if (mWxApi == null) {
			init(mActivity);
		}
		
		mCallbackHandler = callbackHandler;
		
		final SendAuth.Req req = new SendAuth.Req();
		req.scope = "snsapi_userinfo";
		req.state = "htgames";
		
		boolean isSucc = mWxApi.sendReq(req);
		Log.d(TAG, "is wechat login called:" + isSucc);
	}

	@Override
	public void logout(Handler callbackHandler) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onLoginResult(int code, String msg) {
		
	}

	private String buildTransaction(final String type) {
		return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
	}
	
	@Override
	public void share(String url, String title, String description, int scene, Handler handler) {
		mCallbackHandler = handler;
		if (url.equalsIgnoreCase("img")) { // imgage
			shareUrlImage(title, 100, 100, scene);
		} else { // url
			shareUrl(url, title, description, scene);
		}
	}
	
	public void shareUrl(String url, String title, String description, int scene) {
		WXWebpageObject webpage = new WXWebpageObject();
		webpage.webpageUrl = url;

		WXMediaMessage msg = new WXMediaMessage(webpage);
		msg.title = title;
		msg.description = description;
		msg.thumbData = mShareThumb;

		SendMessageToWX.Req req = new SendMessageToWX.Req();
		req.transaction = buildTransaction("webpage");
		req.message = msg;
		req.scene = scene;// SendMessageToWX.Req.WXSceneTimeline : SendMessageToWX.Req.WXSceneSession;

		mWxApi.sendReq(req);
	}
	
	public void shareUrlImage(final String url, final int thumbW, final int thumbH, final int scene) {
		new AsyncTask<String, Integer, Bitmap>() {

			@Override
			protected Bitmap doInBackground(String... params) {
				try {
					Bitmap bmp = BitmapFactory.decodeStream(new URL(url).openStream());
					return bmp;
				} catch (Exception e) {
					e.printStackTrace();
				}
				return null;
			}
			
			@Override
			protected void onPostExecute(Bitmap result) {
				if (result == null) {
					onShareResult(20, "error image!");
					return ;
				}
				Bitmap thumbBmp = Bitmap.createScaledBitmap(result, thumbW, thumbH, true);
				WXImageObject imgObj = new WXImageObject(result);
				result.recycle();
				WXMediaMessage msg = new WXMediaMessage();
				msg.mediaObject = imgObj;
				msg.thumbData = bmpToByteArray(thumbBmp, true);
				
				SendMessageToWX.Req req = new SendMessageToWX.Req();
				req.transaction = buildTransaction("img");
				req.message = msg;
				req.scene = scene;
				mWxApi.sendReq(req);
				super.onPostExecute(result);
			}
		}.execute("");
	}

	@Override
	public void onShareResult(int code, String msg) {
		if (mCallbackHandler != null) {
			mCallbackHandler.sendEmptyMessage(code);
		} else {
			Log.e(TAG, "share callback not found!");
		}
	}
}
