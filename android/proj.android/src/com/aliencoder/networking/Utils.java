package com.aliencoder.networking;

import java.util.Map;

/**
 * Created by rockyl on 16/6/12.
 */
public class Utils {
	public static String parameterStringify(Map<String, String> parameters){
		String ret = "";
		if (parameters != null && !parameters.isEmpty()) {
			int i = 0;
			for (Map.Entry<String, String> entry : parameters.entrySet()) {
				ret += (i > 0 ? "&" : "") + entry.getKey() + "=" + entry.getValue();
				i++;
			}
		}

		return ret;
	}
}
