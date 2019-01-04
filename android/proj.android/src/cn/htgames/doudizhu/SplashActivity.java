package cn.htgames.doudizhu;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;

@SuppressLint("HandlerLeak")
public class SplashActivity extends Activity {

	private static final int MSG_NEW_ACTIVITY = 0;
	private static final int MSG_FINISH_THIS = 1;
	
	private Handler mMainHandler = new Handler() {
		@Override
		public void handleMessage(Message msg) {
			switch (msg.what) {
			case MSG_FINISH_THIS:
				finish();
				break;
			case MSG_NEW_ACTIVITY:
			default:
				startGameActivity();
				break;
			}
			
			super.handleMessage(msg);
		}
	};

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.activity_splash);
		mMainHandler.sendEmptyMessageDelayed(MSG_NEW_ACTIVITY, 1000);
	}

	@Override
	public void onBackPressed() {
	}

	private void startGameActivity(){
		Intent intent = new Intent(this, doudizhu.class);
		this.startActivity(intent);
		mMainHandler.sendEmptyMessage(MSG_FINISH_THIS);
	}

}
