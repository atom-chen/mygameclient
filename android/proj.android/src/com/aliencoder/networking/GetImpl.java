package com.aliencoder.networking;

import java.net.HttpURLConnection;
import java.util.Map;

/**
 * Created by rockyl on 16/2/22.
 */
public class GetImpl implements INetWorkingTask {
	Map<String, String> parameters;

	public GetImpl(Map<String, String> parameters) {
		this.parameters = parameters;
	}

	@Override
	public String parseUrl(String url) {
		String paramsStr = Utils.parameterStringify(this.parameters);
		if (url.contains("?")) {
			url += paramsStr;
		} else {
			url += "?" + paramsStr;
		}

		return url;
	}

	@Override
	public void parseRequest(HttpURLConnection conn) {

	}
}
