package cn.htgames.doudizhu.authenticate;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.Message;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.aliencoder.tools.Utils;
import com.kaopiz.kprogresshud.KProgressHUD;
import com.tencent.mm.sdk.modelmsg.SendAuth;
import com.thirdplatform.wechat.WeChatManager;

import org.json.JSONException;
import org.json.JSONObject;

import cn.htgames.doudizhu.R;
import cn.htgames.doudizhu.WebService;

/**
 * Created by rockyl on 2017/1/5.
 *
 * 授权管理
 */

public class AuthenticateManager extends View implements View.OnClickListener{
	private static String TAG = "AuthenticateManager";

	private Activity activity;
	private FrameLayout container;
	private RelativeLayout contentView;
	private RelativeLayout bottomView;
	private FrameLayout.LayoutParams lp;
	int[] thirdPartButtons;

	private FrameLayout viewContainer;
	private TextView labTitle;

	private LoginByInput loginByInput;
	private LoginByMobile loginByMobile;
	private LoginByRegister loginByRegister;
	private BindByMobile bindByMobile;
	private FindPasswordByMobile findPasswordByMobile;

	private AuthenticateSubView currentSubView;

	private String titlePrefix = "";

	public AuthenticateDelegate authenticateDelegate;
	public BindDelegate bindDelegate;

	KProgressHUD hud;

	public Handler onLoginResultHandler = new Handler(){
		@Override
		public void handleMessage(Message msg) {
			super.handleMessage(msg);
			hideWaiting();
			String title = "抱歉";
			if(msg.obj == null){
				authenticateDelegate.onAuthenticateResult(null);
				Utils.alert(activity, title, "网络错误，请稍后再试。");
				return;
			}
			JSONObject response = (JSONObject) msg.obj;
			int code = 0;
			try {
				code = response.getInt("code");
			} catch (JSONException e) {
				e.printStackTrace();
			}
			if(code == 0){
				JSONObject data =null ;
				try {
					data = response.getJSONObject("data");
				} catch (JSONException e) {
					e.printStackTrace();
				}
				if (data!=null) {
					try {
						String uid = data.getString("uid");
						String token = data.getString("token");
						SharedPreferences user_info=activity.getSharedPreferences("user_info", Context.MODE_PRIVATE);
						SharedPreferences.Editor editor = user_info.edit();
						editor.putString("uid", uid);
						editor.putString("token", token);
						editor.commit();

					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
				authenticateDelegate.onAuthenticateResult(response);
				hide();
			}else{
				authenticateDelegate.onAuthenticateResult(response);
				Utils.alertApiResult(activity, title, code);
			}
		}
	};

	public Handler onBindResultHandler = new Handler(){
		@Override
		public void handleMessage(Message msg) {
			super.handleMessage(msg);
			hideWaiting();
			String title = "抱歉";
			if(msg.obj == null){
				Utils.alert(activity, title, "网络错误，请稍后再试。");
				return;
			}
			JSONObject response = (JSONObject) msg.obj;
			int code = 0;
			try {
				code = response.getInt("code");
			} catch (JSONException e) {
				e.printStackTrace();
			}
			if(code == 0){
				Utils.alert(activity, "提示", "绑定成功");
				bindDelegate.onBindResult(response);
				hide();
			}else{
				Utils.alertApiResult(activity, title, code);
				bindDelegate.onBindResult(response);
			}
		}
	};

	public Handler onResetPasswordResultHandler = new Handler(){
		@Override
		public void handleMessage(Message msg) {
			super.handleMessage(msg);
			hideWaiting();
			String title = "抱歉";
			if(msg.obj == null){
				Utils.alert(activity, title, "网络错误，请稍后再试。");
				return;
			}
			JSONObject response = (JSONObject) msg.obj;
			int code = 0;
			try {
				code = response.getInt("code");
			} catch (JSONException e) {
				e.printStackTrace();
			}
			if(code == 0){
				Utils.alert(activity, "提示", "密码重置成功");
				currentSubView.hide();
				showLoginByInput();
				hide();
			}else{
				Utils.alertApiResult(activity, title, code);
			}
		}
	};

	public Handler onWXAuthCallback = new Handler(){
		@Override
		public void handleMessage(Message msg) {
			super.handleMessage(msg);

			SendAuth.Resp resp = (SendAuth.Resp)msg.obj;

			switch (resp.errCode) {
				case 0:
					//用户同意
					WebService.getInstance().loginByWeiXinCode(Utils.getUUID(activity),resp.code, activity.getPackageName(), onLoginResultHandler);
					break;
				case -4:
					//用户拒绝授权
					hud.setLabel("您拒绝了授权");
					authenticateDelegate.onAuthenticateResult(Utils.makeJsonObjectWithCode(2));
					break;
				case -2:
					//用户取消
					hud.setLabel("您取消了授权");
					authenticateDelegate.onAuthenticateCancel();
					break;
				default:
					hud.setLabel("未知错误：" + resp.errCode);
					authenticateDelegate.onAuthenticateResult(Utils.makeJsonObjectWithCode(99)); // 未知错误 具体参见ts代码
					break;
			}
		}
	};

	public Handler onWXBindCallback = new Handler(){
		@Override
		public void handleMessage(Message msg) {
			super.handleMessage(msg);

			SendAuth.Resp resp = (SendAuth.Resp)msg.obj;

			switch (resp.errCode) {
				case 0:
					//用户同意
					WebService.getInstance().bindByWeiXin(activity,Utils.getUUIDWithMD5(activity), resp.code, activity.getPackageName(), onBindResultHandler);
					break;
				case -4:
					//用户拒绝授权
					hud.setLabel("您拒绝了授权");
					bindDelegate.onBindResult(Utils.makeJsonObjectWithCode(2));
					break;
				case -2:
					//用户取消
					hud.setLabel("您取消了授权");
					bindDelegate.onBindCancel();
					break;
				default:
					break;
			}
		}
	};

	public AuthenticateManager(Activity activity, FrameLayout container) {
		super(activity);
		this.activity = activity;
		this.container = container;

		lp = new FrameLayout.LayoutParams(
			ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);

		LayoutInflater inflater = LayoutInflater.from(activity);
		contentView = (RelativeLayout)inflater.inflate(R.layout.authenticate, null);

		if(hud == null){
			hud = new KProgressHUD(activity).setStyle(KProgressHUD.Style.SPIN_INDETERMINATE);
		}

		Button btnBack = (Button)contentView.findViewById(R.id.btnBack);
		btnBack.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View view) {
				hide();
				if(currentSubView == bindByMobile){
					bindDelegate.onBindCancel();
				}else{
					authenticateDelegate.onAuthenticateCancel();
				}
			}
		});
		viewContainer = (FrameLayout) contentView.findViewById(R.id.viewContainer);
		bottomView = (RelativeLayout) contentView.findViewById(R.id.bottomView);
		labTitle = (TextView)contentView.findViewById(R.id.labTitle);

		thirdPartButtons = new int[]{
			R.id.btnThirdPart1
		};
		for(int i = 0, li = thirdPartButtons.length; i < li; i++){
			Button btn = (Button)contentView.findViewById(thirdPartButtons[i]);
			btn.setOnClickListener(this);
		}
	}

	@Override
	public void onClick(View view) {
		int tag = Integer.parseInt((String)view.getTag());
		switch (tag){
			case 1: //weixin
//				WXApiManager.getInstance().doAuth(activity, onWXAuthCallback);
				WeChatManager.getInstance().login(onWXAuthCallback);
				break;
		}
	}

	public void showLoginByInput(){
		if(loginByInput == null){
			loginByInput = new LoginByInput(activity, this, viewContainer);
		}
		currentSubView = loginByInput;
		show();
		bottomView.setVisibility(VISIBLE);
	}

	public void showLoginByMobile(){
		if(loginByMobile == null){
			loginByMobile = new LoginByMobile(activity, this, viewContainer);
		}
		currentSubView = loginByMobile;
		show();
		bottomView.setVisibility(VISIBLE);
	}

	public void showLoginByRegister(){
		if(loginByRegister == null){
			loginByRegister = new LoginByRegister(activity, this, viewContainer);
		}
		currentSubView = loginByRegister;
		show();
		bottomView.setVisibility(VISIBLE);
	}

	public void showBindByInput(){
		if(bindByMobile == null){
			bindByMobile = new BindByMobile(activity, this, viewContainer);
		}
		currentSubView = bindByMobile;
		show();
		bottomView.setVisibility(INVISIBLE);
	}

	public void showFindPasswordByMobile(){
		if(findPasswordByMobile == null){
			findPasswordByMobile = new FindPasswordByMobile(activity, this, viewContainer);
		}
		currentSubView = findPasswordByMobile;
		show();
		bottomView.setVisibility(INVISIBLE);
	}

	public void showWaiting(){
		hud.show();
	}

	public void hideWaiting(){
		hud.dismiss();
	}

	public void show(){
		if(contentView.getParent() == null){
			container.addView(contentView, lp);
		}

		currentSubView.show();
		labTitle.setText(titlePrefix + currentSubView.getTitle());
	}

	public void hide(){
		if(contentView.getParent() != null){
			container.removeView(contentView);
		}
		if(currentSubView != null){
			currentSubView.hide();
		}
	}
}
