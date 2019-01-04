package cn.htgames.doudizhu;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

/**
 * Created by rockyl on 2017/1/3.
 */

public class NotificationReceiver extends BroadcastReceiver {
	@Override
	public void onReceive(Context context, Intent intent) {
		Log.i("NotificationReceiver", "the app process is alive");
		Intent mainIntent = new Intent(context, doudizhu.class);
		mainIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

		context.startActivity(mainIntent);
	}
}
