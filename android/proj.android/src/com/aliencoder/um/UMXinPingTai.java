package com.aliencoder.um;

import android.nfc.Tag;
import android.util.Log;

import com.umeng.analytics.game.UMGameAgent;

/**
 * Created by 20151016 on 2017/3/13.
 */

public class UMXinPingTai {
    protected static final String TAG = "UMXinPingTai";
    private static UMXinPingTai _instance;
    public static UMXinPingTai getInstance() {
        if (_instance == null) {
            _instance = new UMXinPingTai();
        }
        return _instance;
    }

    public void pay(int type,int money,int gold)
    {
        int source=1;
        if (type==0)
            source=1;
        else if (type==1)
            source=2;
        else if (type==2)
            source=4;
        UMGameAgent.pay(money,gold,source);
        Log.e(TAG,"UMPay");
    }

    public void onProfileSignIn(String ID)
    {
        UMGameAgent.onProfileSignIn(ID);
        Log.e(TAG,"UMLogin");
    }
    public void onProfileSignIn(String Provider, String ID) {
        UMGameAgent.onProfileSignIn(Provider,ID);
        Log.e(TAG,"UMLoginWX");
    }
}