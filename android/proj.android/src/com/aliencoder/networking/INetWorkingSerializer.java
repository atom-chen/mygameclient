package com.aliencoder.networking;

import java.io.InputStream;

/**
 * Created by rockyl receive 16/2/17.
 */
public interface INetWorkingSerializer {
	Object parse(InputStream inputStream);
}
