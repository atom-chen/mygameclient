//
//  WebService.m
//  doudizhu
//
//  Created by 劳琪峰 on 2016/12/12.
//  Copyright © 2016年 egret. All rights reserved.
//

#import "WebService.h"
#import <AFNetworking/AFNetworking.h>

@implementation WebService
static WebService *instance;

AFHTTPSessionManager *manager;

int env = 0;

NSString *WEB_API_ROOT;

+ (instancetype)getInstance{
	@synchronized (self) {
		if(instance == nil){
			instance = [[WebService alloc]initWithConfig];
		}
	}
	
	return instance;
}

- (instancetype)initWithConfig{
	if(self = [super init]){
		[self setup];
	}
	
	return self;
}

- (void)setup{
	switch(env){
		case 0:
			WEB_API_ROOT = @"http://192.168.0.86:8998/";
			break;
		case 1:
			WEB_API_ROOT = @"http://test.pl.hero.htgames.cn:28998/";
			break;
		case 2:
			WEB_API_ROOT = @"http://pl.hero.htgames.cn:8996/";
			break;
	}
	
	NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
	manager = [[AFHTTPSessionManager alloc] initWithSessionConfiguration:configuration];
}

/**
 输入登录
 **/
- (void)loginByInput:(NSString *)ID password:(NSString *)password callback:(void(^)(NSMutableDictionary *response))callback{
	[self
	 callApi:@"index"
	 action:@"login"
	 params:@{@"username": ID, @"password": password}
	 callback:callback
	 method: POST];
}

/**
 注册登录
 **/
- (void)loginByRegister:(NSString *)ID
							 password:(NSString *)password
							 callback:(void(^)(NSMutableDictionary *response))callback{
	[self
	 callApi:@"user"
	 action:@"register"
	 params:@{@"username": ID, @"password": password}
	 callback:callback
	 method: POST];
}

/**
 游客登录
 **/
- (void)loginByGuest:(NSString *)uuid callback:(void(^)(NSMutableDictionary *response))callback{
	[self
	 callApi:@"index"
	 action:@"guest"
	 params:@{@"device": uuid}
	 callback:callback
	 method: POST];
}

/**
 微信登录
 **/
- (void)loginByWeiXinCode:(NSString *)code callback:(void(^)(NSMutableDictionary *response))callback{
	[self
	 callApi:@"index"
	 action:@"login"
	 params:@{@"code": code, @"type": @(1)}
	 callback:callback
	 method: POST];
}

/**
 微信绑定
 **/
- (void)bindByWeiXin:(NSString *)code uuid:(NSString *)uuid callback:(void(^)(NSMutableDictionary *response))callback{
	[self
	 callApi:@"user"
	 action:@"bind"
	 params:@{@"device_id": uuid, @"wxcode": code, @"type": @(1)}
	 callback:callback
	 method: POST];
}

/**
 手机绑定
 **/
- (void)bindByMobile:(NSString *)phone
						withCode:(NSString *)code
						withUID:(NSString *)uid
				withCallback:(void(^)(NSMutableDictionary *response))callback
{
	[self
	 callApi:@"user"
	 action:@"bindMobile"
	 params:@{@"uid": uid, @"code": code, @"phone": phone}
	 callback:callback
	 method: POST];
}

/**
 支付
 **/
- (void)payment:(NSString *)receiptData uid:(int)uid callback:(void(^)(NSMutableDictionary *response))callback{
	[self
	 callApi:@"shop"
	 action:@"payment"
	 params:@{@"receipt-data": receiptData, @"type": @(uid)}
	 callback:callback
	 method: POST];
}

/**
 获取验证码
 **/
- (void)getCode:(NSString *)phone
			 callback:(void(^)(NSMutableDictionary *response))callback
{
	[self
	 callApi:@"user"
	 action:@"getCode"
	 params:@{@"phone": phone, @"action": @(1)}
	 callback:callback
	 method: GET];
}

/**
 调用api接口
 **/
- (void)callApi:(NSString *)module
				 action:(NSString *)action
				 params:(NSDictionary *)params
			 callback:(void(^)(NSMutableDictionary *response))callback
				 method:(METHOD)method
{
	NSMutableDictionary *dic = [[NSMutableDictionary alloc]init];
	[dic setObject:@"tom" forKey:@"name"];
	
	NSString* url = [NSString stringWithFormat:@"%@%@/%@", WEB_API_ROOT, module, action];
	NSLog(@"call api: %@", url);
	
	switch (method) {
  case POST:
		{
			[manager POST:url parameters:params progress:nil
						success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
							callback([NSMutableDictionary dictionaryWithDictionary:responseObject]);
						} failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
							callback(nil);
						}];
		}
			break;
  case GET:
		{
			[manager GET:url parameters:params progress:nil
						success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
							callback([NSMutableDictionary dictionaryWithDictionary:responseObject]);
						} failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
							callback(nil);
						}];
		}
			break;
			
  default:
			NSLog(@"error method");
			break;
	}
}

@end
