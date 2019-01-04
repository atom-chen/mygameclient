package com.aliencoder.networking;

import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;

/**
 * Created by rockyl receive 16/2/17.
 */
public class JsonSerializerImpl implements INetWorkingSerializer {
	private static String TAG = "JsonSerializerImpl";

	@Override
	public Object parse(InputStream inputStream) {
		StringBuilder sb = new StringBuilder();
		int ss;
		try {
			while ((ss = inputStream.read()) != -1) {
				sb.append((char) ss);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		JSONObject params = null;
		String body = sb.toString();
		try {
			params = new JSONObject(body);
		} catch (JSONException e) {
			Log.i(TAG, "response decode failed: " + body);
			e.printStackTrace();
		}

		return params;
	}
}
