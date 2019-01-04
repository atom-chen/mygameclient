package com.thirdplatform.ali;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;

import com.alipay.sdk.app.PayTask;
import com.thirdplatform.platform.BasePay;
import com.thirdplatform.platform.IPay;
import com.thirdplatform.platform.PlatformConstants;

import android.annotation.SuppressLint;
import android.os.Handler;
import android.os.Message;
import android.util.Log;

@SuppressLint("HandlerLeak")
public class AliPayManager extends BasePay implements IPay {

	private static String TAG = "AliPayManager";
	
	private static AliPayManager sInstance = null;
	
	private Handler mCallbackHandler = null;
	private Handler mResultHandler = new Handler() {
		@SuppressWarnings("unchecked")
		@Override
		public void handleMessage(Message msg) {
			switch (msg.what) {
				case PlatformConstants.SDK_FLAG_PAY: {
					onAliPayResult((Map<String, String>)msg.obj);
					break;
				}
				default:
					Log.d(TAG, "not processed msg：" + msg.what);
					break;
			}
		}
	};
	
	private AliPayManager() {
		
	}
	
	public static AliPayManager getInstance() {
		if (sInstance == null) {
			sInstance = new AliPayManager();
		}
		
		return sInstance;
	}
	
	// pay
	@Override
	public boolean pay(String productId, String userId, String serverType, Handler callbackHandler) {
		if (mActivity == null) {
			Log.e(TAG, "Activity is null! Please call Pay.init first!");
			return false;
		}
		
		mCallbackHandler = callbackHandler;

		Map<String, String> paramMap = new HashMap<String, String>();
		paramMap.put(PRODUCT_ID, productId);
		paramMap.put(OS_TYPE, OS_ANDROID);
		paramMap.put(USER_ID, userId);
		paramMap.put(SERVER_TAIL, serverType);
		// call web service to make order
		makeOrder(getOrderActionString(), paramMap, new Handler() {
			@Override
			public void handleMessage(Message msg) {
				super.handleMessage(msg);
				
				JSONObject resp = (JSONObject)msg.obj;
				try {
					int code = resp.getInt("code");
	
					if(code == 0) {
						String orderInfo = resp.getString("data");
						doPay(orderInfo);
					} else {
						onPayResult(code, "Web service error! Make order failed!");
					}
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}
		});
		
		return true;
	}
	
	// result
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
		return "alipayOrder";
	}
	
	// alipay in ali sdk demo
	private void doPay(final String orderInfo) {
		new Thread(new Runnable() {
			
			@Override
			public void run() {
				// TODO Auto-generated method stub
				PayTask alipay = new PayTask(mActivity);
				Map<String, String> result = alipay.payV2(orderInfo, true);
				Log.d(TAG, "alipay v2 result:" + result.toString());

				Message msg = new Message();
				msg.what = PlatformConstants.SDK_FLAG_PAY;
				msg.obj = result;
				mResultHandler.sendMessage(msg);
			}
		}).start();
	}
	
	private void onAliPayResult(Map<String, String> result) {
		// get code and info
		String code = result.get("resultStatus");
		String msg = result.get("result");
		
		Log.d(TAG, "pay code:" + code + " result:" + msg);
		
		/*
9000	订单支付成功
8000	正在处理中，支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
4000	订单支付失败
5000	重复请求
6001	用户中途取消
6002	网络连接出错
6004	支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
其它	其它支付错误
		 */
		int resultCode = PlatformConstants.PAY_RESULT_CANCEL;
		if (code.equalsIgnoreCase("9000")) {
			resultCode = PlatformConstants.PAY_RESULT_SUCC;
		} else if (code.equalsIgnoreCase("6001")) {
			resultCode = PlatformConstants.PAY_RESULT_CANCEL;
		} else {
			resultCode = Integer.parseInt(code);
		}
		onPayResult(resultCode, msg);
	}

}
