package cn.htgames.doudizhu.authenticate;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;

import com.aliencoder.tools.Utils;

import cn.htgames.doudizhu.R;
import cn.htgames.doudizhu.WebService;

/**
 * Created by rockyl on 2017/1/5.
 */

public class LoginByRegister implements AuthenticateSubView {
	private Activity activity;
	private AuthenticateManager manager;
	private FrameLayout container;
	private RelativeLayout contentView;
	private FrameLayout.LayoutParams lp;

	private EditText inputID, inputPassword;
	private Button btnToLogin, btnConfirm;

	public LoginByRegister(final Activity activity, final AuthenticateManager manager, FrameLayout container) {
		this.activity = activity;
		this.container = container;
		this.manager = manager;

		lp = new FrameLayout.LayoutParams(
			ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);

		LayoutInflater inflater = LayoutInflater.from(activity);
		contentView = (RelativeLayout)inflater.inflate(R.layout.login_by_register, null);

		inputID = (EditText)contentView.findViewById(R.id.inputMobile);
		inputPassword = (EditText)contentView.findViewById(R.id.inputCode);
		btnConfirm = (Button)contentView.findViewById(R.id.btnConfirm);
		btnConfirm.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View view) {
				String uid = inputID.getText().toString();
				String password = inputPassword.getText().toString();
				if(uid.length() == 0 || password.length() == 0){
					Utils.alert(activity, "警告", "用户名或密码不能为空");
				}else{
					manager.showWaiting();
					WebService.getInstance().loginByRegister(
						Utils.getUUID(activity),
						inputID.getText().toString(),
						inputPassword.getText().toString(),
						manager.onLoginResultHandler
					);
				}
			}
		});
		btnToLogin = (Button)contentView.findViewById(R.id.btnToLogin);
		btnToLogin.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View view) {
				toRegister();
			}
		});
	}

	void toRegister(){
		hide();
		manager.showLoginByInput();
	}

	@Override
	public String getTitle() {
		return "通行证注册";
	}

	@Override
	public void show() {
		inputID.setText("");
		inputPassword.setText("");
		container.addView(contentView, lp);
	}

	@Override
	public void hide() {
		container.removeView(contentView);
	}
}
