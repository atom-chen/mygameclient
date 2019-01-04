//
//  NativeInterface.m
//  doudizhuhero
//
//  Created by 劳琪峰 on 16/5/27.
//  Copyright © 2016年 egret. All rights reserved.
//

#import <AudioToolbox/AudioToolbox.h>
#import <AFNetworking/AFNetworking.h>
#import "NativeInterface.h"
#import "EgretRuntime.h"
#import "ImagePicker.h"
#import "WebView.h"
#import "AuthenticateManager.h"
#import "WebService.h"
#import "Utils.h"
#import "StorePurchase.h"
#import "GameInfo.h"
#import <ShareSDK/ShareSDK.h>

@interface NativeInterface()
@property (nonatomic,strong) WebView *webView;
@end

@implementation NativeInterface

UIViewController *viewController;
NSMutableDictionary *callbacks;
ImagePicker *imagePicker;
AFHTTPSessionManager *manager;
NSString *authCallId, *bindCallId;
StorePurchase *storePurchase;
AuthenticateManager* authenticate;

- (instancetype)initWithViewController:(UIViewController *)vc {
	if (self = [super init]) {
		viewController = vc;
		
		[self setup];
	}
	return self;
}

- (void)setup{
	callbacks = [NSMutableDictionary dictionaryWithCapacity:10];
	imagePicker = [[ImagePicker alloc]initWithRoot:viewController];
	authenticate = [[AuthenticateManager alloc]initWithViewController:viewController withDelegate:self];
	self.webView = [WebView alloc];
	
	NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
	manager = [[AFHTTPSessionManager alloc] initWithSessionConfiguration:configuration];
	
	[[EgretRuntime getInstance] setRuntimeInterface:@"egretCall" block:^(NSString *message) {
		NSLog(@"%@", message);
		NSData *data = [message dataUsingEncoding:NSUTF8StringEncoding];
		NSError * error = nil;
		id paramsId = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:&error];
		NSDictionary *params = (NSDictionary *)paramsId;
		NSString *callId = [params valueForKey:@"id"];
		NSString *method = [params valueForKey:@"method"];
		NSDictionary *args = [params valueForKey:@"args"];
		
		NSDictionary *retArgs;
		if([method isEqualToString:@"getEnvInfo"]){
			retArgs = [self getEnvInfo:args callId:callId];
		}if([method isEqualToString:@"putInfo"]){
			retArgs = [self putInfo:args callId:callId];
		}else if([method isEqualToString:@"getDeviceUUID"]){
			retArgs = [self getDeviceUUID:args callId:callId];
		}else if([method isEqualToString:@"navigateToUrl"]){
			retArgs = [self navigateToUrl:args callId:callId];
		}else if([method isEqualToString:@"uploadImageFromDevice"]){
			retArgs = [self uploadImageFromDevice:args callId:callId];
		}else if([method isEqualToString:@"vibrate"]){
			retArgs = [self vibrate:args callId:callId];
		}else if([method isEqualToString:@"share"]){
			retArgs = [self share:args callId:callId];
		}else if([method isEqualToString:@"alert"]){
			retArgs = [self alert:args callId:callId];
		}else if([method isEqualToString:@"addWebView"]){
			retArgs = [self addWebView:args callId:callId];
		}else if([method isEqualToString:@"removeWebView"]){
			retArgs = [self removeWebView:args callId:callId];
		}else if([method isEqualToString:@"authenticate"]){
			retArgs = [self authenticate:args callId:callId];
		}else if([method isEqualToString:@"authThirdPart"]){
			retArgs = [self authThirdPart:args callId:callId];
		}else if([method isEqualToString:@"bindThirdPart"]){
			retArgs = [self bindThirdPart:args callId:callId];
		}else if([method isEqualToString:@"recharge"]){
			retArgs = [self recharge:args callId:callId];
		}
		
		[callbacks setValue:params forKey:callId];
		if(retArgs){
			[self returnCall:callId retArgs:retArgs];
		}
	}];
}

- (void)returnCall:(NSString *)callId retArgs:(NSDictionary *)retArgs{
	NSDictionary *params = callbacks[callId];
	[callbacks removeObjectForKey:callId];
	NSString *method = [params valueForKey:@"method"];
	NSDictionary * retObj = [NSDictionary dictionaryWithObjectsAndKeys:
													 callId, @"id",
													 method, @"method",
													 retArgs, @"args",
													 nil];
	NSError * error = nil;
	NSData * data = [NSJSONSerialization dataWithJSONObject:retObj options:kNilOptions error:&error];
	NSString *retMessage = [[NSString alloc]initWithData:data encoding:NSUTF8StringEncoding];
	[[EgretRuntime getInstance] callEgretInterface:@"nativeCall" value:retMessage];
}

#pragma implements
- (NSDictionary *)getEnvInfo:(NSDictionary * )args callId:(NSString *)callId{
	NSDictionary *ret = [NSDictionary dictionaryWithObjectsAndKeys:
											 [NSNumber numberWithInteger:2], @"channel_id",
											 nil];
	
	return ret;
}

- (NSDictionary *)putInfo:(NSDictionary * )args callId:(NSString *)callId{
	[[GameInfo getInstance]update:args];
	
	return nil;
}

- (NSDictionary *)getDeviceUUID:(NSDictionary * )args callId:(NSString *)callId{
	return @{@"uuid": [Utils getUUIDWithMD5]};
}

- (NSDictionary *)navigateToUrl:(NSDictionary *)args callId:(NSString *)callId{
	NSString * url = [args valueForKey:@"url"];
	[[UIApplication sharedApplication] openURL:[NSURL URLWithString:url]];
	
	return nil;
}

- (NSDictionary*)uploadImageFromDevice:(NSDictionary *)args callId:(NSString *)callId{
	NSString * title = [args valueForKey:@"title"];
	NSString * uploadUrl = [args valueForKey:@"uploadUrl"];
	NSDictionary *options =@{
													 @"title": title,
													 @"cancelButtonTitle": @"取消",
													 @"takePhotoButtonTitle": @"拍照",
													 @"chooseFromLibraryButtonTitle": @"从相册中选取",
													 @"allowsEditing" : @YES,
													 @"maxWidth": @300,
													 @"maxHeight": @300
													 };
	[imagePicker show:options callback:^(NSMutableDictionary *response){
		if(response){
			NSURL *url = [NSURL URLWithString:uploadUrl];
			NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
			[request setHTTPMethod:@"POST"];
			
			NSData *data = response[@"data"];
			NSURLSessionUploadTask *uploadTask = [manager uploadTaskWithRequest:request fromData:data progress:nil completionHandler:^(NSURLResponse *response, id responseObject, NSError *error) {
    if (error) {
			//NSLog(@"Error: %@", error);
			[self returnCall:callId retArgs:@{@"result": @2}];
		} else {
			//NSLog(@"Success: %@ %@", response, responseObject);
			int code = [responseObject[@"code"] intValue];
			switch(code){
				case 0:
				{
					NSString *path = responseObject[@"data"][@"file_path"];
					[self returnCall:callId retArgs:@{@"result": @0, @"url": path}];
				}
					break;
				default:
					[self returnCall:callId retArgs:@{@"result": @3}];
					break;
			}
			
		}
			}];
			[uploadTask resume];
		}else{
			[self returnCall:callId retArgs:@{@"result": @1}];
		}
	}];
	
	return nil;
}

- (NSDictionary*)vibrate:(NSDictionary *)args callId:(NSString *)callId{
	AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
	
	return nil;
}

- (NSDictionary*)share:(NSDictionary *)args callId:(NSString *)callId{
	NSString *type = args[@"type"];
	NSDictionary *params = args[@"params"];
	
	NSString *urlString = params[@"url"];
	NSString *title = params[@"title"];
	NSString *description = params[@"description"];
	
	//shareCallId = callId;
	
	SSDKPlatformType platfromType = SSDKPlatformTypeUnknown;
	
	if([type isEqualToString:@"wx_session"]){
		platfromType = SSDKPlatformSubTypeWechatSession;
	}else if([type isEqualToString:@"wx_timeline"]){
		platfromType = SSDKPlatformSubTypeWechatTimeline;
	}
	
	NSArray* imageArray = @[[UIImage imageNamed:@"ShareIcon.png"]];
	if (imageArray) {
		NSMutableDictionary *shareParams = [NSMutableDictionary dictionary];
		[shareParams SSDKSetupShareParamsByText:description
																		 images:imageArray
																				url:[NSURL URLWithString:urlString]
																			title:title
																			 type:SSDKContentTypeAuto];
		
		[ShareSDK share:platfromType parameters:shareParams onStateChanged:^(SSDKResponseState state, NSDictionary *userData, SSDKContentEntity *contentEntity, NSError *error) {
			
			switch (state) {
				case SSDKResponseStateSuccess:
				{
					[self returnCall:callId retArgs:@{@"code": @(0)}];
					break;
				}
				case SSDKResponseStateFail:
				{
					[self returnCall:callId retArgs:@{@"code": @(1)}];
					break;
				}
				default:
					break;
			}
		}];
	}
	
	return nil;
}

-(NSDictionary*)alert:(NSDictionary *)args callId:(NSString *)callId{
	NSString *title = args[@"title"];
	NSString *message = args[@"message"];
	NSArray *buttons = args[@"buttons"];
	
	UIAlertController *alertController = [UIAlertController alertControllerWithTitle:title message:message preferredStyle:UIAlertControllerStyleAlert];
	
	for(NSString *button in buttons){
		UIAlertAction *action = [UIAlertAction actionWithTitle:button style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
			NSUInteger index = [buttons indexOfObject:[action title]];
			[self returnCall:callId retArgs:@{@"index": [NSNumber numberWithUnsignedInteger:index]}];
		}];
		[alertController addAction:action];
	}
	
	[viewController presentViewController:alertController animated:YES completion:nil];
	
	return nil;
}

- (NSDictionary*)addWebView:(NSDictionary *)args callId:(NSString *)callId{
	NSString * url = [args valueForKey:@"url"];
	
	[_webView addTo: viewController.view];
	[_webView loadByUrl:url];
	
	return nil;
}

- (NSDictionary*)removeWebView:(NSDictionary *)args callId:(NSString *)callId{
	[_webView remove];
	
	return nil;
}

- (NSDictionary*)authenticate:(NSDictionary *)args callId:(NSString *)callId{
	[authenticate showLoginByInput];
	
	authCallId = callId;
	
	return nil;
}

- (NSDictionary*)authThirdPart:(NSDictionary *)args callId:(NSString *)callId{
	int type = [args[@"type"]intValue];
	switch(type){
		case 1: //weixin
			//[WXApiManager getInstance].delegate = self;
			//[[WXApiManager getInstance]doAuth:viewController withCallback:nil withType:1];
			break;
	}
	
	authCallId = callId;
	
	return nil;
}

- (NSDictionary*)bindThirdPart:(NSDictionary *)args callId:(NSString *)callId{
	int type = [args[@"type"]intValue];
	switch(type){
		case 0: //mobile
			[authenticate showBindByMobile];
			break;
		case 1: //weixin
			//[WXApiManager getInstance].delegate = self;
			//[[WXApiManager getInstance]doAuth:viewController withCallback:nil withType:2];
			break;
	}
	
	bindCallId = callId;
	
	return nil;
}

-(NSDictionary *)recharge:(NSDictionary *)args callId:(NSString *)callId{
	NSString *id = args[@"id"];
	
	[storePurchase doPruchase:id callback:^(int code, NSString *receiptData) {
		if(code == 0){
			[[WebService getInstance]payment:receiptData uid:[GameInfo getInstance].uid callback:^(NSMutableDictionary *response) {
				int code = [response[@"code"]intValue];
				[self returnCall:callId retArgs:@{@"code": @(code)}];
			}];
		}else{
			[self returnCall:callId retArgs:@{@"code": @(code)}];
		}
	}];
	return nil;
}

# pragma mark - AuthenticateDelegate

- (void)onAuthticateResult:(NSMutableDictionary *)result{
	[self returnCall:authCallId retArgs:result];
}

- (void)onAuthticateCancel{
	[self returnCall:authCallId retArgs:@{@"code": @(1)}];
}

# pragma mark - BindDelegate

- (void)onBindResult:(NSMutableDictionary *)result{
	[self returnCall:bindCallId retArgs:result];
}

- (void)onBindCancel{
	[self returnCall:bindCallId retArgs:@{@"code": @(1)}];
}

/*#pragma WXApiManagerDelegate
- (void)managerDidRecvAuthResponse:(SendAuthResp *)resp withType:(int)type{
	switch (resp.errCode) {
		case 0: //用户同意
		{
			NSLog(@"code: %@", resp.code);
			switch (type) {
				case 1:
					[[WebService getInstance]loginByWeiXinCode:resp.code callback:^(NSMutableDictionary *response) {
						NSLog(@"%@", response);
						[authenticate onLoginResult:response withAlertTitle:@"微信授权失败"];
					}];
					break;
				case 2:
					[[WebService getInstance]bindByWeiXin:resp.code uuid:[Utils getUUIDWithMD5] callback:^(NSMutableDictionary *response) {
						[self returnCall:bindId retArgs:response];
					}];
					break;
			}
		}
			break;
		case -4: //用户拒绝授权
			[self returnCall:bindId retArgs:@{@"code": @(1)}];
			break;
		case -2: //用户取消
			[self returnCall:bindId retArgs:@{@"code": @(2)}];
			break;
		default:
			[self returnCall:bindId retArgs:@{@"code": @(3)}];
			break;
	}
}*/


@end
