package com.aliencoder;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;

import cn.htgames.doudizhu.R;

/**
 * Created by rockyl on 16/5/26.
 *
 * 内嵌浏览器
 */

public class TWebView {
	Activity activity;
	FrameLayout container;
	View contentView;

	Button btnBack;
	WebView webView;

	FrameLayout.LayoutParams lp;

	public TWebView() {
		lp = new FrameLayout.LayoutParams(
			ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
	}

	public void addTo(Activity activity, FrameLayout container){
		this.activity = activity;
		this.container = container;

		if(contentView == null){
			LayoutInflater inflater = LayoutInflater.from(activity);
			contentView = inflater.inflate(R.layout.webview, null);

			btnBack = (Button)contentView.findViewById(R.id.btnBack);
			webView = (WebView)contentView.findViewById(R.id.webView);

			webView.setWebViewClient(new WebViewClient(){
				@Override
				public boolean shouldOverrideUrlLoading(WebView view, String url) {
					view.loadUrl(url);
					return true;
				}
			});
			WebSettings settings = webView.getSettings();
			settings.setJavaScriptEnabled(true);

			btnBack.setOnClickListener(new View.OnClickListener() {
				@Override
				public void onClick(View v) {
					remove();
				}
			});
		}

		webView.loadData("", "", "");
		container.addView(contentView, lp);
	}

	public void remove(){
		if(contentView != null){
			container.removeView(contentView);
		}
	}

	public void loadByUrl(String url){
		if(contentView != null) {
			webView.loadUrl(url);
		}
	}
}
