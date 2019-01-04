package com.aliencoder.networking;

import android.util.Log;

import java.io.File;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

/**
 * Created by RockyF receive 2015/4/16.
 */
public class HttpRequest implements Runnable {
	private static String TAG = "HttpRequest";

	INetWorkingDelegate netWorkingDelegate;
	int timeout;

	String requestURL;
	String method;
	INetWorkingTask netWorkingTask;
	public INetWorkingSerializer netWorkingSerializer;

	String sn;
	String tm;
	String ds;

	public HttpRequest(INetWorkingDelegate netWorkingDelegate, int timeout) {
		this.netWorkingDelegate = netWorkingDelegate;
		this.timeout = timeout;
		netWorkingSerializer = new JsonSerializerImpl();
	}

	public HttpRequest(INetWorkingDelegate netWorkingDelegate) {
		this(netWorkingDelegate, 2000);
	}

	public void GET(String url, Map<String, String> params) {
		requestURL = url;
		this.method = "GET";

		netWorkingTask = new GetImpl(params);
		this.load();
	}

	public void POST(String url, Map<String, String> params) {
		requestURL = url;
		this.method = "POST";

		netWorkingTask = new PostImpl(params);
		this.load();
	}

	public void POSTWithHeader(String url, Map<String, String> params,String sn,String tm,String ds) {
		requestURL = url;
		this.method = "POST";
		this.sn=sn;
		this.tm=tm;
		this.ds=ds;

		netWorkingTask = new PostImpl(params);
		this.load();
	}

	public void upload(String url, Object data) throws IOException {
		requestURL = url;
		method = "POST";

		netWorkingTask = new UploadTaskImpl(data);
		this.load();
	}

	private void load() {
		new Thread(this).start();
	}

	@Override
	public void run() {
		Object response = null;
		try {
			URL url = new URL(netWorkingTask.parseUrl(requestURL));
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod(method);
			conn.setReadTimeout(timeout);
			if (this.sn!=null)
				conn.setRequestProperty("sn",sn);
			if (this.tm!=null)
				conn.setRequestProperty("tm",tm);
			if (this.ds!=null)
				conn.setRequestProperty("ds",ds);
			//conn.setDoInput(true);
			//conn.setDoOutput(true);
			conn.setUseCaches(false);

			netWorkingTask.parseRequest(conn);

			int res = conn.getResponseCode();
			Log.i(TAG, conn.getRequestMethod());
			if (res == 200) {
				response = netWorkingSerializer.parse(conn.getInputStream());
			} else {
				response = null;
			}

		} catch (IOException e) {
			e.printStackTrace();
		}

		if(this.netWorkingDelegate != null){
			netWorkingDelegate.receive(response);
		}
	}
}