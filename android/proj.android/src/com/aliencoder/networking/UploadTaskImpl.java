package com.aliencoder.networking;

import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;

/**
 * Created by rockyl receive 16/2/17.
 */
public class UploadTaskImpl implements INetWorkingTask {
	Object data;

	public UploadTaskImpl(Object data) {
		this.data = data;
	}

	@Override
	public String parseUrl(String url) {
		return url;
	}

	@Override
	public void parseRequest(HttpURLConnection conn) {
		try {
			DataOutputStream dos = new DataOutputStream(conn.getOutputStream());

			if (data instanceof File) {
				InputStream is = new FileInputStream((File) data);
				byte[] bytes = new byte[1024];
				int len = 0;
				while ((len = is.read(bytes)) != -1) {
					dos.write(bytes, 0, len);
				}
				is.close();
			} else {
				byte[] bytes = (byte[]) data;
				dos.write(bytes);
			}
			dos.flush();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}
}
