package com.aliencoder.tools;

import cn.htgames.doudizhu.NotificationReceiver;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.support.v4.app.NotificationCompat;
import android.util.Log;


/**
 * Created by rockyl on 2017/1/3.
 */

public class NotificationUtil {
	public static String TAG = "NotificationUtil";

	public static void show(Context context, String title, String text, int iconID){
		Log.d(TAG, "ShowNotificationReceiver onReceive");
		//设置点击通知栏的动作为启动另外一个广播
		Intent broadcastIntent = new Intent(context, NotificationReceiver.class);
		PendingIntent pendingIntent = PendingIntent.
			getBroadcast(context, 0, broadcastIntent, PendingIntent.FLAG_UPDATE_CURRENT);

		Notification notification = new NotificationCompat.Builder(context)
			.setContentTitle(title)
			.setContentText(text)
			.setContentIntent(pendingIntent)
			.setSmallIcon(iconID)
			.build();
		notification.flags = Notification.FLAG_AUTO_CANCEL;

		Log.i(TAG, "showNotification");
		NotificationManager manager = (NotificationManager)context.getSystemService(Context.NOTIFICATION_SERVICE);
		manager.notify(2, notification);
	}
}
