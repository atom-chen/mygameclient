package com.aliencoder.tools;


import android.content.Context;
import android.graphics.Bitmap;
import android.os.Environment;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.DecimalFormat;

/**
* �ļ�������
* @author spring sky
*
*/
public class FileUtil {
    /**
     * ��ȡĿ¼����
     * @param url
     * @return FileName
     */
    public static String getFileName(String url)
    {
        int lastIndexStart = url.lastIndexOf("/");
        if(lastIndexStart!=-1)
        {
            return url.substring(lastIndexStart+1, url.length());
        }else{
            return new Timestamp(System.currentTimeMillis()).toString();
        }
    }
    /**
     * �ж�SD���Ƿ����
     * @return boolean
     */
    public static boolean checkSDCard() {
        if (Environment.getExternalStorageState().equals(
                Environment.MEDIA_MOUNTED)) {
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * ����Ŀ¼Ŀ¼��Ŀ¼
     * @param context
     * @return  Ŀ¼�����Ŀ¼
     */
    public static String setMkdir(Context context)
    {
        String filePath = null;
        if(checkSDCard())
        {
            filePath = Environment.getExternalStorageDirectory()+File.separator+"mangatown"+File.separator+"downloads";
//            Log.e("file", "����SDCD    ");
        }else{
            filePath = context.getCacheDir().getAbsolutePath()+File.separator+"mangatown"+File.separator+"downloads";
//            Log.e("file", "������SDCD    ");
        }
        File file = new File(filePath);
        if(!file.exists())
        {
            file.mkdirs();
//            Log.e("file", "Ŀ¼������   ����Ŀ¼    ");
        }else{
//            Log.e("file", "Ŀ¼����");
        }
        return filePath;
    }
    
    /**
     * ��ȡ·��
     * @return
     * @throws IOException
     */
    public static  String getPath(Context context,String url)
    {
        String path = null;
        try {
            path = FileUtil.setMkdir(context)+File.separator+url.substring(url.lastIndexOf("/")+1);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return path;
    }
    
    /**
     * ��ȡ�ļ��Ĵ�С
     * 
     * @param fileSize
     *            �ļ��Ĵ�С
     * @return
     */
    public static String FormetFileSize(int fileSize) {// ת���ļ���С
        DecimalFormat df = new DecimalFormat("#.00");
        String fileSizeString = "";
        if (fileSize < 1024) {
            fileSizeString = df.format((double) fileSize) + "B";
        } else if (fileSize < 1048576) {
            fileSizeString = df.format((double) fileSize / 1024) + "K";
        } else if (fileSize < 1073741824) {
            fileSizeString = df.format((double) fileSize / 1048576) + "M";
        } else {
            fileSizeString = df.format((double) fileSize / 1073741824) + "G";
        }
        return fileSizeString;
    }
    
    /**
     * ɾ���ļ����ļ��µ������ļ�
     * @param file
     */
	public static void deleteFile(File file) {
		if (file.isFile()) {
			file.delete();
			return;
		}

		if (file.isDirectory()) {
			File[] childFiles = file.listFiles();
			if (childFiles == null || childFiles.length == 0) {
				file.delete();
				return;
			}

			for (int i = 0; i < childFiles.length; i++) {
				deleteFile(childFiles[i]);
			}
			file.delete();
		}
	} 
	
	public static File saveMyBitmap(String bitName, Bitmap mBitmap) {
		File f = new File(bitName);
		try {
			f.createNewFile();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			// DebugMessage.put("�ڱ���ͼƬʱ����"+e.toString());
		}
		FileOutputStream fOut = null;
		try {
			fOut = new FileOutputStream(f);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		mBitmap.compress(Bitmap.CompressFormat.JPEG, 100, fOut);
		try {
			fOut.flush();
		} catch (IOException e) {
			e.printStackTrace();
		}
		try {
			fOut.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return f;
	}
	
	/** ɾ������ */
	public interface OnDeleteListener{
		public void end();
	}
    /**
     * ɾ���ļ����ļ��µ������ļ���������
     * @param file
     */
	public static void deleteFile(File file , OnDeleteListener listener) {
		OnDeleteListener mOnDeleteListener = listener;
		if (file.isFile()) {
			file.delete();
			mOnDeleteListener.end();
			return;
		}

		if (file.isDirectory()) {
			File[] childFiles = file.listFiles();
			if (childFiles == null || childFiles.length == 0) {
				file.delete();
				mOnDeleteListener.end();
				return;
			}

			for (int i = 0; i < childFiles.length; i++) {
				deleteFile(childFiles[i]);
			}
			file.delete();
			mOnDeleteListener.end();
		}
	} 
}