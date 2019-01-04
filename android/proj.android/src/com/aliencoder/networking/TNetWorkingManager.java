package com.aliencoder.networking;

import java.io.File;
import java.io.IOException;
import java.util.Map;

/**
 * Created by rockyl on 16/2/17.
 */
public class TNetWorkingManager {
	public void upload(String url, File file, INetWorkingDelegate delegate) throws IOException {
		HttpRequest httpRequest = new HttpRequest(delegate);
		httpRequest.upload(url, file);
	}

	public void upload(String url, byte[] data, INetWorkingDelegate delegate) throws IOException {
		HttpRequest httpRequest = new HttpRequest(delegate);
		httpRequest.upload(url, data);
	}

	public void GET(String url, Map<String, String> params, INetWorkingDelegate delegate) throws IOException {
		GET(url, params, delegate, 2000);
	}

	public void GET(String url, Map<String, String> params, INetWorkingDelegate delegate, int timeout) throws IOException {
		HttpRequest httpRequest = new HttpRequest(delegate, timeout);
		httpRequest.GET(url, params);
	}

	public void POST(String url, Map<String, String> params, INetWorkingDelegate delegate) throws IOException {
		POST(url, params, delegate, 2000);
	}

	public void POST(String url, Map<String, String> params, INetWorkingDelegate delegate, int timeout) throws IOException {
		HttpRequest httpRequest = new HttpRequest(delegate, timeout);
		httpRequest.POST(url, params);
	}

	public void POSTWithHeader(String url, Map<String, String> params,String sn,String tm,String ds, INetWorkingDelegate delegate, int timeout) throws IOException {
		HttpRequest httpRequest = new HttpRequest(delegate, timeout);
		httpRequest.POSTWithHeader(url, params,sn,tm,ds);
	}

	private static TNetWorkingManager _instance;
	public static TNetWorkingManager getInstance(){
		if(_instance == null){
			_instance = new TNetWorkingManager();
		}
		return _instance;
	}
}
