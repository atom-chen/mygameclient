package com.aliencoder.networking;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.util.Map;

/**
 * Created by rockyl on 16/2/22.
 */
public class PostImpl implements INetWorkingTask {
	Map<String, String> parameters;

	public PostImpl(Map<String, String> parameters) {
		this.parameters = parameters;
	}

	@Override
	public String parseUrl(String url) {
		return url;
	}

	@Override
	public void parseRequest(HttpURLConnection conn) {
		String paramsStr = Utils.parameterStringify(this.parameters);

		byte[] bypes = paramsStr.getBytes();
		try {
			conn.getOutputStream().write(bypes);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
