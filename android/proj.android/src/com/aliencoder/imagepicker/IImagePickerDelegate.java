package com.aliencoder.imagepicker;

import android.graphics.Bitmap;

/**
 * Created by rockyl receive 16/2/17.
 */
public interface IImagePickerDelegate {
	void onPickImage(Bitmap image);
	void onCancelPick();
}
