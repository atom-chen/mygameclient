package cn.htgames.doudizhu.authenticate;

import android.app.Activity;
import android.os.Handler;
import android.os.Message;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;

import com.aliencoder.tools.Utils;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Timer;
import java.util.TimerTask;

import cn.htgames.doudizhu.GameInfo;
import cn.htgames.doudizhu.R;
import cn.htgames.doudizhu.WebService;

/**
 * Created by rockyl on 2017/1/5.
 */

public class BindByMobile extends TimerTask implements AuthenticateSubView {
	private Activity activity;
	private AuthenticateManager manager;
	private FrameLayout container;
	private RelativeLayout contentView;
	private FrameLayout.LayoutParams lp;

	private EditText inputMobile, inputCode;
	private Button btnGetCode, btnConfirm;

	private String mobile, code;

	private Timer timer;
	private boolean timerPlaying;
	private int count;

	public BindByMobile(final Activity activity, final AuthenticateManager manager, FrameLayout container) {
		this.activity = activity;
		this.container = container;
		this.manager = manager;

		lp = new FrameLayout.LayoutParams(
			ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);

		LayoutInflater inflater = LayoutInflater.from(activity);
		contentView = (RelativeLayout)inflater.inflate(R.layout.bind_by_mobile, null);

		final Handler onGotCode = new Handler(){
			@Override
			public void handleMessage(Message msg) {
				super.handleMessage(msg);

				JSONObject response = (JSONObject)msg.obj;
				int code = 0;
				try {
					code = response.getInt("code");
				} catch (JSONException e) {
					e.printStackTrace();
				}
				if(code == 0){
					startCD();
				}else{
					Utils.alertApiResult(activity, "抱歉", code);
				}
			}
		};

		inputMobile = (EditText)contentView.findViewById(R.id.inputMobile);
		inputCode = (EditText)contentView.findViewById(R.id.inputCode);
		final Handler handler = new Handler(){
			@Override
			public void handleMessage(Message msg) {
				super.handleMessage(msg);

				if(msg.obj != null){
					JSONObject response = (JSONObject) msg.obj;
					Object data = null;
					try {
						data = response.getJSONObject("data");
					} catch (JSONException e) {
						data = new JSONObject();
					}

					JSONObject d = (JSONObject)data;
					try {
						d.put("phone", mobile);
						d.put("code", code);
						response.put("data", d);
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
				Message m = new Message();
				m.obj = msg.obj;
				manager.onBindResultHandler.sendMessage(m);
			}
		};

		btnConfirm = (Button)contentView.findViewById(R.id.btnConfirm);
		btnConfirm.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View view) {
				mobile = inputMobile.getText().toString();
				code = inputCode.getText().toString();
				if(mobile.length() == 0 || code.length() == 0){
					Utils.alert(activity, "警告", "手机号或验证码不能为空");
				}else {
					WebService.getInstance().bindByMobile(
						activity,
						mobile,
						code,
						GameInfo.getInstance().uid,
						handler
					);
				}
			}
		});
		btnGetCode = (Button)contentView.findViewById(R.id.btnGetCode);
		btnGetCode.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View view) {
				WebService.getInstance().getCode(inputMobile.getText().toString(),"1", onGotCode);
			}
		});

		timer = new Timer();
		timer.schedule(this, 0, 1000);
	}

	void startCD(){
		count = 30;
		btnGetCode.setEnabled(false);
		timerPlaying = true;
	}

	@Override
	public void run() {
		if(timerPlaying){
			if(count <= 0){
				activity.runOnUiThread(new Runnable() {
					@Override
					public void run() {
						btnGetCode.setEnabled(true);
						btnGetCode.setText(activity.getString(R.string.getCode));
					}
				});
				timerPlaying = false;
			}else{
				final String text = count + "s" + activity.getString(R.string.reGetCode);
				activity.runOnUiThread(new Runnable() {
					@Override
					public void run() {
						btnGetCode.setText(text);
					}
				});
				count--;
			}
		}
	}

	@Override
	public String getTitle() {
		return "手机号绑定";
	}

	@Override
	public void show() {
		inputMobile.setText("");
		inputCode.setText("");
		container.addView(contentView, lp);
	}

	@Override
	public void hide() {
		container.removeView(contentView);
	}
}
