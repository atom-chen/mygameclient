package com.aliencoder.tools;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Bitmap;
import android.net.Uri;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.telephony.TelephonyManager;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Enumeration;
import java.util.List;
import java.util.UUID;

import static android.content.Context.MODE_PRIVATE;

public class Utils {
	public static void openWithBrower(Activity activity, String url) {
		Intent intent = new Intent();
		intent.setAction("android.intent.action.VIEW");
		Uri content_url = Uri.parse(url);
		intent.setData(content_url);
		activity.startActivity(intent);
	}

	public static void goToGooglePlay(Activity activity, String packageName,
	                                  String downloadUrl, String appName) {
		String mAddress = "market://details?id=" + packageName;
		Intent marketIntent = new Intent("android.intent.action.VIEW");
		marketIntent.setData(Uri.parse(mAddress));
		if (isIntentAvailable(activity, marketIntent)) {
			activity.startActivity(marketIntent);
		}
	}

	public static boolean isIntentAvailable(Context context, Intent intent) {
		final PackageManager packageManager = context.getPackageManager();
		List<ResolveInfo> list = packageManager.queryIntentActivities(intent, PackageManager.GET_ACTIVITIES);
		return list.size() > 0;
	}

	public static void saveBitmap(String picName, Bitmap bitmap) {
		File f = new File("/sdcard/", picName);
		if (f.exists()) {
			f.delete();
		}
		try {
			FileOutputStream out = new FileOutputStream(f);
			bitmap.compress(Bitmap.CompressFormat.PNG, 90, out);
			out.flush();
			out.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public static final String md5(final String s) {
		try {
			// Create MD5 Hash
			MessageDigest digest = MessageDigest
				.getInstance("MD5");
			digest.update(s.getBytes());
			byte messageDigest[] = digest.digest();

			// Create Hex String
			StringBuffer hexString = new StringBuffer();
			for (int i = 0; i < messageDigest.length; i++) {
				String h = Integer.toHexString(0xFF & messageDigest[i]);
				while (h.length() < 2)
					h = "0" + h;
				hexString.append(h);
			}
			return hexString.toString();

		} catch (NoSuchAlgorithmException e) {

		}
		return "";
	}

	private static String uuid;

	public static String getUUID(Activity activity) {
		if (uuid == null) {
			UUID newUUID;

			String PREFS_FILE = "device_id.xml";
			String PREFS_DEVICE_ID = "device_id";
			SharedPreferences prefs = activity.getSharedPreferences(PREFS_FILE, MODE_PRIVATE);
			String id = prefs.getString(PREFS_DEVICE_ID, null);
			if (id != null) {
				newUUID = UUID.fromString(id);
			} else {
				final TelephonyManager tm = (TelephonyManager) activity.getBaseContext().getSystemService(Context.TELEPHONY_SERVICE);

				String tmDevice = "";
				String tmSerial = "";
				String androidId = "";

				try {
					tmDevice += tm.getDeviceId();
				} catch (Exception e) {
				}

				try {
					tmSerial += tm.getSimSerialNumber();
				} catch (Exception e) {
				}

				try {
					androidId = "" + android.provider.Settings.Secure.getString(activity.getContentResolver(), android.provider.Settings.Secure.ANDROID_ID);
				} catch (Exception e) {
				}

				if (tmDevice.equals("")) {
					newUUID = UUID.randomUUID();
				} else {
					newUUID = new UUID(androidId.hashCode(), ((long) tmDevice.hashCode() << 32) | tmSerial.hashCode());
				}

				SharedPreferences.Editor editor = prefs.edit();
				editor.putString(PREFS_DEVICE_ID, newUUID.toString());
				editor.apply();
			}

			uuid = newUUID.toString();
		}


		Log.i("Utils", "uuid:" + uuid);

		return uuid;
	}

	public static String getUUIDWithMD5(Activity activity) {
		return md5(getUUID(activity));
	}

	public static String getIpAddress(Activity activity) {
		String ipAddress = getWIFILocalIpAdress(activity);
		if(ipAddress == null){
			ipAddress = getGPRSLocalIpAddress();
		}

		return ipAddress;
	}

	public static String getWIFILocalIpAdress(Context mContext) {
		WifiManager wifiManager = (WifiManager) mContext.getSystemService(Context.WIFI_SERVICE);
		if (wifiManager.isWifiEnabled()) {
			WifiInfo wifiInfo = wifiManager.getConnectionInfo();
			int ipAddress = wifiInfo.getIpAddress();
			String ip = formatIpAddress(ipAddress);
			return ip;
		} else {
			return null;
		}
	}

	private static String formatIpAddress(int ipAdress) {
		return (ipAdress & 0xFF) + "." +
			((ipAdress >> 8) & 0xFF) + "." +
			((ipAdress >> 16) & 0xFF) + "." +
			(ipAdress >> 24 & 0xFF);
	}

	public static String getGPRSLocalIpAddress() {
		try {
			for (Enumeration<NetworkInterface> en = NetworkInterface
				.getNetworkInterfaces(); en.hasMoreElements();) {
				NetworkInterface intf = en.nextElement();
				for (Enumeration<InetAddress> enumIpAddr = intf
					.getInetAddresses(); enumIpAddr.hasMoreElements();) {
					InetAddress inetAddress = enumIpAddr.nextElement();
					if (!inetAddress.isLoopbackAddress()) {
						return inetAddress.getHostAddress().toString();
					}
				}
			}
		} catch (SocketException ex) {

		}
		return null;
	}

	public static void alert(Activity activity, String title, String message){
		AlertDialog alert;
		alert = new AlertDialog.Builder(activity).setTitle(title).setMessage(message)
			.setPositiveButton("确定", new DialogInterface.OnClickListener() {
				@Override
				public void onClick(DialogInterface dialog, int which) {

				}
			})
			.create();

		alert.setCancelable(false);
		alert.setCanceledOnTouchOutside(false);
		alert.show();
	}

	public static void alertApiResult(Activity activity, String title, int code){
		Log.i("alertApiResult", code + "");
		int resID = activity.getResources().getIdentifier("api_result_" + code, "string", activity.getPackageName());
		String message = activity.getString(resID);
		alert(activity, title, message);
	}

	public static void alertApiResult(Activity activity, String title, int code, String module, String action){
		Log.i("alertApiResult", code + "");
		int resID = activity.getResources().getIdentifier("api_result_" + code, "string", activity.getPackageName());
		if(resID == 0){
			resID = activity.getResources().getIdentifier("api_result_" + code + "_" + module + "_" + action, "string", activity.getPackageName());
		}
		String message = activity.getString(resID);
		alert(activity, title, message);
	}

	public static JSONObject makeJsonObjectWithCode(int code){
		JSONObject obj = new JSONObject();
		try {
			obj.put("code", code);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return obj;
	}
}
