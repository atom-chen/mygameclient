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
#import "WebService.h"
#import "Utils.h"
#import "GameInfo.h"
#import "GeTuiSdk.h"
#import "AppPay.h"
#include <UMMobClick/MobClick.h>
#include <UMMobClick/MobClickGameAnalytics.h>

//#import "AliPayManager.h"



@interface NativeInterface()
@property (nonatomic,strong) WebView *webView;
@end

@implementation NativeInterface

UIViewController *viewController;
NSMutableDictionary *callbacks;
ImagePicker *imagePicker;
AFHTTPSessionManager *manager;
NSString *authCallId, *bindCallId;
HTGSDK* sdk;
AppPay* appPay;

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
	sdk = [[HTGSDK alloc]initWithViewController:viewController withDelegate:self];
	appPay = [[AppPay alloc]init];
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    NSString *wxappid = infoDictionary[@"Wxappid"];
	[[WXApiManager getInstance]setup:wxappid];
	self.webView = [WebView alloc];
    
    [Utils setVc:viewController];
	
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
		}if([method isEqualToString:@"userLogin"]){
			retArgs = [self onUserLogin:args callId:callId];
		}if([method isEqualToString:@"userLogout"]){
			retArgs = [self onUserLogout:args callId:callId];
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
        }else if([method isEqualToString:@"UMLoginStatistics"]){
			retArgs = [self UMLoginStatistics:args callId:callId];
        }else if([method isEqualToString:@"toClipboard"]){
            retArgs = [self toClipboard:args callId:callId];
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

- (NSDictionary *)onUserLogin:(NSDictionary * )args callId:(NSString *)callId{
    NSLog(@"userLogin args = %@",args);
	[[GameInfo getInstance]update:args];
    
    [self submitLoginInfo];
	
	NSString *uid = [GameInfo getInstance].uid;
	NSLog(@"[GTSdk bindAlias] %@", uid);
	[GeTuiSdk bindAlias:uid andSequenceNum:@"1234567890"];
	
	return nil;
}

- (NSDictionary *)onUserLogout:(NSDictionary * )args callId:(NSString *)callId{
	NSString *uid = [GameInfo getInstance].uid;
	NSLog(@"[GTSdk unbindAlias] %@", uid);
	[GeTuiSdk unbindAlias:uid andSequenceNum:@"1234567890"];
	
	return nil;
}

- (NSDictionary *)toClipboard:(NSDictionary * )args callId:(NSString *)callId{
    NSString * copyText = [args valueForKey:@"text"];
    NSLog(@"toClipboard:%@", copyText);
    
    UIPasteboard*pasteboard = [UIPasteboard generalPasteboard];
    pasteboard.string = copyText;
    
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
    [[WXApiManager getInstance]doShare:args withCallback:^(int code) {
        [self returnCall:callId retArgs:@{@"code": @(code)}];
    }];
	
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
    int type = [args[@"type"]intValue];
    if (type == 3) // 3 手机 1 通行证
    {
        [sdk showLoginByMobile];
    }
    if (type == 1) {
        [sdk showLoginByInput];
        
    }
    if (type == 2) {
        [sdk loginByGuest];
    }
	
    authCallId = callId;

	return nil;
}

- (NSDictionary*)authThirdPart:(NSDictionary *)args callId:(NSString *)callId{
	int type = [args[@"type"]intValue];
	switch(type){
		case 1: //weixin
           [[WXApiManager getInstance]doAuth:viewController withCallback:^(SendAuthResp *authResp) {
               [sdk onWXAuthCallback:authResp isDirect:YES];
           } withState:@"auth"];
			
			break;
	}
	
	authCallId = callId;
	
	return nil;
}

- (NSDictionary*)bindThirdPart:(NSDictionary *)args callId:(NSString *)callId{
	int type = [args[@"type"]intValue];
	switch(type){
		case 0: //mobile
			[sdk showBindByMobile];
			break;
		case 1: //weixin
                [[WXApiManager getInstance]doAuth:viewController withCallback:^(SendAuthResp *authResp) {
                    [sdk onWXBindCallback:authResp];
                } withState:@"auth"];
			break;
	}
	
	bindCallId = callId;
	
    
	return nil;
}
-(NSDictionary *)UMLoginStatistics:(NSDictionary *)args callId:(NSString *)callId{
    int type = [args[@"type"]intValue];
    NSString* uid = args[@"uid"];
    //NSString* struid = [uid stringvalue]
    if (type == 1) {
        [MobClick profileSignInWithPUID:uid provider:@"WX"];
    }
    else
    {
        [MobClick profileSignInWithPUID:uid];
    }
    
    return nil;
}
-(NSDictionary *)recharge:(NSDictionary *)args callId:(NSString *)callId{
	NSString *id = args[@"id"];
	int type = [args[@"type"]intValue];//0苹果 1 支付宝 2 微信
    // 默认type用1 此处直接在platform层修改，不影响原有native接口代码
    type = 2;
    int gold = [args[@"gold"]intValue];
    int money = [args[@"money"]intValue];
    int typeMob = 1;
    if (type == 1) {
        typeMob = 2;
    } else if (type == 2) {
        typeMob = 3;
    }
    [MobClickGameAnalytics pay:money source:typeMob coin:gold];
	//int type = 2;
	
	[appPay pay:id withType:type withCallback:^(int code) {
		[self returnCall:callId retArgs:@{@"code": @(code)}];
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

- (void)onBindResult:(NSMutableDictionary *)result
				withUserInfo:(NSDictionary*)userInfo{
	if(userInfo){
		id data = result[@"data"];
		if([data isKindOfClass:[NSString class]]){
			data = [[NSMutableDictionary alloc]initWithCapacity:10];
		}
		for (NSString *key in userInfo) {
			[data setValue:userInfo[key] forKey:key];
		}
		[result setValue:data forKey:@"data"];
	}
	[self returnCall:bindCallId retArgs:result];
}

- (void)onBindCancel{
	[self returnCall:bindCallId retArgs:@{@"code": @(1)}];
}

- (void)submitLoginInfo{
    [[WebService getInstance] callApi:@"user" action:@"channel"
     params:@{@"channel_id": [Utils getInfo:@"InstallChannel"], @"uid": [GameInfo getInstance].uid, @"token": [GameInfo getInstance].token, @"os_type": @"ios"}
     callback:^(NSMutableDictionary *response) {
         if (response) {
             int code = [response[@"code"]intValue];
             if (code == 0) {
                 NSLog(@"submitLoginInfo success!");
             } else {
                 NSLog(@"submitLoginInfo failed! %@", response[@"code"]);
             }
         }
     }
     method: POST];
}


@end
