package com.aliencoder.imagepicker;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.widget.Toast;

import java.io.File;

import cn.htgames.doudizhu.R;

/**
 * Created by rockyl receive 16/2/16.
 */
public class ImagePicker {
	public static final int REQUEST_PICK_FROM_CAMERA = 200;
	public static final int REQUEST_PICK_FROM_ALBUM = 201;
	public static final int REQUEST_UPLOAD_DROP = 202;

	String[] items;

	Activity activity;
	IImagePickerDelegate delegate;
	AlertDialog alert;

	public ImagePicker(Activity activity) {
		this.activity = activity;
		this.items = new String[]{activity.getString(R.string.pick_from_camera), activity.getString(R.string.pick_from_album)};
	}

	public void show(String title, IImagePickerDelegate delegate) {
		this.delegate = delegate;
		if (alert == null) {
			alert = new AlertDialog.Builder(activity).setTitle(title)
				.setItems(items, new DialogInterface.OnClickListener() {
					@Override
					public void onClick(final DialogInterface dialog, final int which) {
						switch (which) {
							case 0:
								String state = Environment.getExternalStorageState();
								if (state.equals(Environment.MEDIA_MOUNTED)) {
									Intent intent = new Intent("android.media.action.IMAGE_CAPTURE");
									intent.putExtra(MediaStore.EXTRA_OUTPUT,
										Uri.fromFile(new File(Environment.getExternalStorageDirectory(), "/userhead.jpg")));
									activity.startActivityForResult(intent, REQUEST_PICK_FROM_ALBUM);
								} else {
									Toast.makeText(activity, "请确认已经插入SD卡", Toast.LENGTH_LONG).show();
								}
								break;
							case 1:
								Intent intent = new Intent(Intent.ACTION_PICK);
								intent.setType("image/*");//相片类型
								activity.startActivityForResult(intent, REQUEST_PICK_FROM_CAMERA);
								break;
						}
					}
				})
				.setPositiveButton(R.string.pick_cancel, new DialogInterface.OnClickListener() {
					@Override
					public void onClick(final DialogInterface dialog, final int which) {
						dialog.dismiss();
					}
				}).create();
		}
		alert.show();
	}

	public void onActivityResult(int requestCode, int resultCode, Intent data) {
		//拍照
		if (requestCode == REQUEST_PICK_FROM_ALBUM) {
			if (data == null) {
				File temp = new File(Environment.getExternalStorageDirectory(), "/userhead.jpg");
				startPhotoZoom(Uri.fromFile(temp));
			} else {
				Uri uri = data.getData();
				//to do find the path of pic by uri
				if (uri != null) {
					startPhotoZoom(uri);
				}
			}
		}
		//相册
		else if (requestCode == REQUEST_PICK_FROM_CAMERA) {
			if (data != null) {
				Uri uri = data.getData();
				if (uri == null) {
					File temp = new File(Environment.getExternalStorageDirectory(), "/userhead.jpg");
					startPhotoZoom(Uri.fromFile(temp));
				} else {
					startPhotoZoom(uri);
				}
			}
		} else if (requestCode == REQUEST_UPLOAD_DROP) {
			if (data != null) {
				uploadImage(data);
			}
		}
	}

	/**
	 * 裁剪图片方法实现
	 *
	 * @param uri
	 */
	void startPhotoZoom(Uri uri) {
		Intent intent = new Intent("com.android.camera.action.CROP");
		intent.setDataAndType(uri, "image/*");
		// 下面这个crop=true是设置在开启的Intent中设置显示的VIEW可裁剪
		intent.putExtra("crop", "true");
		// aspectX aspectY 是宽高的比例
		intent.putExtra("aspectX", 1);
		intent.putExtra("aspectY", 1);
		// outputX outputY 是裁剪图片宽高
		intent.putExtra("outputX", 100);
		intent.putExtra("outputY", 100);
		intent.putExtra("return-data", true);
		activity.startActivityForResult(intent, REQUEST_UPLOAD_DROP);
	}

	void uploadImage(Intent picdata) {
		Bundle extras = picdata.getExtras();

		if (extras != null) {
			Bitmap photo = extras.getParcelable("data");

			delegate.onPickImage(photo);
		}
	}
}
