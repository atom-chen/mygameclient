//
//  WebView.m
//  doudizhu
//
//  Created by 劳琪峰 on 16/5/25.
//  Copyright © 2016年 egret. All rights reserved.
//

#import "WebView.h"

@implementation WebView

UIView *rootView;
UIView *container;
UIButton *btnBack;
UIWebView *webView;

- (instancetype)initWithViewConfig {
	if (self = [super init]) {
		
	}
	return self;
}

- (void)addTo:(UIView *) view{
	rootView = view;
	if(container == nil){
		CGRect frame = view.frame;
		container = [[UIView alloc]initWithFrame:frame];
		[container setBackgroundColor: [UIColor lightGrayColor]];
		
		[container addSubview: [self makeUIWebView]];
		
		btnBack = [UIButton buttonWithType:UIButtonTypeCustom];
		UIImage *imgNormal = [UIImage imageNamed:@"btn_back_n.png"];
		UIImage *imgDown = [UIImage imageNamed:@"btn_back_h.png"];
		btnBack.frame = CGRectMake(10, 10, 60, 30);
		[btnBack setImage:imgNormal forState:UIControlStateNormal];
		[btnBack setImage:imgDown forState:UIControlStateHighlighted];
		[btnBack addTarget:self action:@selector(onBack:) forControlEvents:UIControlEventTouchUpInside];
		
		UIImageView *imageView = [[UIImageView alloc ] init];
		imageView.image = [UIImage imageNamed:@"top_bar_bg.png"];
		imageView.frame = CGRectMake(0, 0, frame.size.width, 50);
		[container addSubview:imageView];
		[container addSubview:btnBack];
	}
	[webView loadHTMLString:@" " baseURL:nil];
	
	[rootView addSubview: container];
}

- (void)remove{
	if(container != nil){
		[container removeFromSuperview];
		//self.container = nil;
	}
}

- (void)loadByUrl:(NSString *)url{
	if(webView != nil){
		[webView loadRequest:[NSURLRequest requestWithURL:[ NSURL URLWithString:url]]];
	}
}

-(void)onBack:(id)sender {
	[self remove];
}

- (UIWebView *)makeUIWebView{
	CGRect frame = rootView.frame;
	frame.origin.y = 50;
	frame.size.height -= 50;
	webView = [[UIWebView alloc]initWithFrame:frame];
	
	return webView;
}

- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType{
	return true;
}

- (void)webViewDidStartLoad:(UIWebView *)webView{
	
}
- (void)webViewDidFinishLoad:(UIWebView *)webView{
	
}
- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error{
	
}

@end
