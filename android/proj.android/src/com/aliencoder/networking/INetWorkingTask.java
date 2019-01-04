package com.aliencoder.networking;

import java.net.HttpURLConnection;

/**
 * Created by rockyl receive 16/2/17.
 */
public interface INetWorkingTask {
	String parseUrl(String url);
	void parseRequest(HttpURLConnection conn);
}
