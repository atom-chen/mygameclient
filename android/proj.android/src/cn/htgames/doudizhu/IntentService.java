package cn.htgames.doudizhu;

import android.content.Context;
import android.util.Log;

import com.aliencoder.tools.NotificationUtil;
import com.igexin.sdk.GTIntentService;
import com.igexin.sdk.message.GTCmdMessage;
import com.igexin.sdk.message.GTTransmitMessage;

/**
 * Created by rockyl on 2017/1/3.
 */

public class IntentService extends GTIntentService {
	@Override
	public void onReceiveServicePid(Context context, int pid) {
	}

	@Override
	public void onReceiveMessageData(Context context, GTTransmitMessage msg) {
		String text = new String(msg.getPayload());
		NotificationUtil.show(context, context.getString(R.string.app_name), text, R.mipmap.ic_launcher);
	}

	@Override
	public void onReceiveClientId(Context context, String clientid) {
		Log.e(TAG, "onReceiveClientId -> " + "clientid = " + clientid);
	}

	@Override
	public void onReceiveOnlineState(Context context, boolean online) {
	}

	@Override
	public void onReceiveCommandResult(Context context, GTCmdMessage cmdMessage) {
	}
}
