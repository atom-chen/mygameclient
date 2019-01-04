package cn.htgames.doudizhu.wxapi;

import com.tencent.mm.sdk.modelbase.BaseReq;
import com.tencent.mm.sdk.modelbase.BaseResp;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.sdk.openapi.WXAPIFactory;
import com.thirdplatform.wechat.WeChatManager;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler {
	public IWXAPI api;
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		api = WXAPIFactory.createWXAPI(this, WeChatManager.WX_APPID, false);
		api.handleIntent(getIntent(), this);
	}

	@Override
	protected void onNewIntent(Intent intent) {
		super.onNewIntent(intent);
		
		setIntent(intent);
        api.handleIntent(intent, this);
	}
	
	@Override
	public void onReq(BaseReq req) {
//		WXApiManager.getInstance().onReq(req);
	}

	@Override
	public void onResp(BaseResp resp) {
//		WXApiManager.getInstance().onResp(resp);

		WeChatManager.getInstance().onWeChatResp(resp);
		finish();
	}
}