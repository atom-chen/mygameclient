//
//  WebService.m
//  doudizhu
//
//  Created by 劳琪峰 on 2016/12/12.
//  Copyright © 2016年 egret. All rights reserved.
//

#import "WebService.h"
#import <AFNetworking/AFNetworking.h>
#import "Utils.h"
#import <AdSupport/AdSupport.h>

@implementation WebService
static WebService *instance;
NSString *ENCRYPY_KEY = @"SN6fvWKnYnQqjIJE0hKmFSnDnaWmUkL4";

AFHTTPSessionManager *manager;

int env = 2;

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
            //WEB_API_ROOT = @"http://192.168.0.86:8994";
			break;
		case 1:
			WEB_API_ROOT = @"http://test.pl.hero.htgames.cn:28998/";
			break;
		case 2:
			WEB_API_ROOT = @"http://pl.ddz.htgames.cn:18998/";
            //WEB_API_ROOT = @"http://leepuman.tunnel.wenzhoueyewear.cn/";
			break;
	}
	
	NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
	manager = [[AFHTTPSessionManager alloc] initWithSessionConfiguration:configuration];
    //manager.responseSerializer.acceptableContentTypes = [NSSet setWithObject:@"text/html"];
    manager.responseSerializer.acceptableContentTypes = [NSSet setWithObjects:@"application/json", @"text/html", nil];
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
 输入登录
 **/
- (void)loginByPhone:(NSString *)phone pcode:(NSString *)code callback:(void(^)(NSMutableDictionary *response))callback{
    [self
     callApi:@"user"
     action:@"login"
     params:@{@"phone": phone, @"code": code}
     callback:callback
     method: POST];
}

/**
 首次登陆
 **/
- (void)fisrtLaunchNotify:(NSString*) adid  callback:(void(^)(NSMutableDictionary *response))callback{
    
    [self
     callApi:@"record"
     action:@"firstlaunch"
     params:@{@"adid": adid, @"os":@"0"}
     callback:callback
     method: POST];
}

/**
 注册登录
 **/
- (void)loginByRegister:(NSString *)ID
							 password:(NSString *)password
							 callback:(void(^)(NSMutableDictionary *response))callback{
    NSString *adId = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
    if (adId == nil) {
        adId = [[NSUUID UUID] UUIDString];
    }
	[self
	 callApi:@"user"
	 action:@"register"
	 params:@{@"username": ID, @"password": password, @"adid":adId, @"os":@"0"}
	 callback:callback
	 method: POST];
}

/**
 游客登录
 **/
- (void)loginByGuest:(NSString *)uuid callback:(void(^)(NSMutableDictionary *response))callback{
    NSString* package = [Utils getInfo:@"CFBundleIdentifier"];
    NSLog(@"package:%@", package);
    NSString *adId = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
    if (adId == nil) {
        adId = [[NSUUID UUID] UUIDString];
    }
    [self
	 callApi:@"index"
	 action:@"guest"
	 params:@{@"device": uuid, @"adid":adId, @"os":@"0"}
	 callback:callback
	 method: POST];
}

/**
 微信登录
 **/
- (void)loginByWeiXinCode:(NSString *)code
								 callback:(void(^)(NSMutableDictionary *response))callback{
	NSString* package = [Utils getInfo:@"CFBundleIdentifier"];
	NSLog(@"package:%@", package);
    NSString *adId = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
    if (adId == nil) {
        adId = [[NSUUID UUID] UUIDString];
    }

    //NSString *paramString = [[NSString alloc] initWithFormat:@"code:%@ type:%@ package:%@ adid:%@ os:%@", code, @(1), package, adId, @"0"];
    //[Utils alert:[Utils getVc] withTitle:@"wechat login params" withMessage:paramString];
    //return;
	
    [self
	 callApi:@"index"
	 action:@"login"
	 params:@{@"code": code, @"type": @(1), @"package": package, @"adid":adId, @"os":@"0"}
	 callback:callback
	 method: POST];
}

/**
 微信绑定
 **/
/*- (void)bindByWeiXin:(NSString *)code
								uuid:(NSString *)uuid
						callback:(void(^)(NSMutableDictionary *response))callback{
	NSString* package = [Utils getInfo:@"CFBundleIdentifier"];
	[self
	 callApi:@"user"
	 action:@"bind"
	 params:@{@"device_id": uuid, @"wxcode": code, @"type": @(1), @"package": package}
	 callback:callback
	 method: POST];
}*/

/**
 手机绑定
 **/
/*- (void)bindByMobile:(NSString *)phone
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
}*/

/**
 通过手机号重置密码
 **/
- (void)resetPassword:(NSString *)phone
						 withCode:(NSString *)code
				 withPassword:(NSString *)password
				 withCallback:(void(^)(NSMutableDictionary *response))callback
{
	//[manager setResponseSerializer:[AFHTTPResponseSerializer alloc]];
	[self
	 callApi:@"user"
	 action:@"resetPassword"
	 params:@{@"password": password, @"code": code, @"phone": phone}
	 callback:callback
	 method: POST];
}

/**
 检查账号是否绑定过手机号
 **/
- (void)checkBind:(NSString *)userName
		 withCallback:(void(^)(NSMutableDictionary *response))callback{
	[self
	 callApi:@"user"
	 action:@"checkbind"
	 params:@{@"userName": userName}
	 callback:callback
	 method: POST];
}

/**
 支付
 **/
- (void)payment:(NSString *)receiptData uid:(NSString*)uid callback:(void(^)(NSMutableDictionary *response))callback{
	[self
	 callApi:@"shop"
	 action:@"payment"
	 params:@{@"receipt-data": receiptData, @"uid": uid}
	 callback:callback
	 method: POST];
}

/**
 获取验证码
 **/
- (void)getCode:(NSString *)phone
		 withAction:(int)action
			 callback:(void(^)(NSMutableDictionary *response))callback
{
	[self
	 callApi:@"user"
	 action:@"getCode"
	 params:@{@"phone": phone, @"action": @(action)}
	 callback:callback
	 method: GET];
}

/**
 获取验证码
 **/
- (void)getYunCode:(NSString *)phone
     withAction:(int)action
       callback:(void(^)(NSMutableDictionary *response))callback
{
    [self
     callApi:@"user"
     action:@"getYunCode"
     params:@{@"phone": phone, @"action": @(action)}
     callback:callback
     method: GET];
}

/**
 获取支付订单
 **/
- (void)getPayOrderString:(NSString *)action
                    withType:(NSString *)type
					 withUid:(NSString *)uid
               withProductID:(NSString *)pid
                    callback:(void(^)(NSMutableDictionary *response))callback
{
    //NSString *srcWebRoot = WEB_API_ROOT;
    //WEB_API_ROOT = @"http://leepuman.tunnel.wenzhoueyewear.cn/"; // for test url
    //WEB_API_ROOT = @"http://192.168.0.144/htgames/"; // for test url
    NSLog(@"action:%@ type:%@ uid:%@ pid:%@", action, type, uid, pid);
    //NSLog(@"srcWebRoot:%@", srcWebRoot);
    NSLog(@"WEB_API_ROOT:%@", WEB_API_ROOT);
    
	[self
	 callApi:@"shop"
	 action:action
	 params:@{@"type": type, @"uid": uid, @"product_id": pid, @"os": @(1), @"trade_type": @"APP"}
	 callback:callback
	 method: POST];
    
    //WEB_API_ROOT = srcWebRoot;
    //NSLog(@"WEB_API_ROOT:%@", WEB_API_ROOT);
}
/**
 微信绑定
 **/
- (void)bindByWeiXin:(NSString *)code uuid:(NSString *) uuid
            callback:(void(^)(NSMutableDictionary *response))callback
{
    	[self
    	 callApi:@"user"
    	 action:@"bind"
    	 params:@{@"device_id": uuid, @"wxcode": code, @"type": @(1)}
    	 callback:callback
    	 method: POST];
}
/**
 微信加密绑定
 **/
- (void)bindByWeiXinEncrpy:(NSString *)code
            callback:(void(^)(NSMutableDictionary *response))callback
{
    //	[self
    //	 callApi:@"user"
    //	 action:@"bind"
    //	 params:@{@"device_id": uuid, @"wxcode": code, @"type": @(1)}
    //	 callback:callback
    //	 method: POST];
    
    NSString *rand = [NSString stringWithFormat: @"%u", arc4random() ];
    UInt64 recordTime = [[NSDate date] timeIntervalSince1970]*1000;
    NSString *timeSp = [NSString stringWithFormat:@"%llu", recordTime];
    NSString *encry = @"";
    NSUserDefaults *mySettingData = [NSUserDefaults standardUserDefaults];
    NSString *token = [mySettingData objectForKey:@"apptoken"];
    NSString *uid = [mySettingData objectForKey:@"uid"];
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    NSString* package =  infoDictionary[@"CFBundleIdentifier"];
    if (token == nil) {
        return;
    }
    encry = [NSString stringWithFormat:@"package%@type%@uid%@wxcode%@%@%@%@%@", package, @(1), uid, code,  token, timeSp, rand, ENCRYPY_KEY];
    NSString* sn = [Utils md5:encry];
    
    [self
     callEncrpyApi:@"user"
     action:@"bindByUid"
     params:@{@"uid": uid, @"wxcode": code, @"type": @(1), @"package":package}
     callback:callback
     method: POST
     token:sn
     tm:timeSp
     ds:rand];
}

/**
 手机加密绑定
 **/
- (void)bindByMobileEncrpy:(NSString *)phone
            withCode:(NSString *)code
            withUID:(NSString *)uid
        withCallback:(void(^)(NSMutableDictionary *response))callback
{
    //	[self
    //	 callApi:@"user"
    //	 action:@"bind"
    //	 params:@{@"device_id": uuid, @"code": code, @"phone": phone}
    //	 callback:callback
    //	 method: POST];
    NSString *rand = [NSString stringWithFormat: @"%u", arc4random() ];
    UInt64 recordTime = [[NSDate date] timeIntervalSince1970]*1000;
    NSString *timeSp = [NSString stringWithFormat:@"%llu", recordTime];
    NSString *encry = @"";
    NSUserDefaults *mySettingData = [NSUserDefaults standardUserDefaults];
    NSString *token = [mySettingData objectForKey:@"apptoken"];
    if (token == nil) {
        return;
    }
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    NSString* package =  infoDictionary[@"CFBundleIdentifier"];
    encry = [NSString stringWithFormat:@"code%@package%@phone%@uid%@%@%@%@%@", code, package, phone, uid, token, timeSp, rand, ENCRYPY_KEY];
    NSString* sn = [Utils md5:encry];
    
    [self
     callEncrpyApi:@"user"
     action:@"bindByUid"
     params:@{@"uid": uid, @"code": code, @"phone": phone, @"package":package}
     callback:callback
     method: POST
     token:sn
     tm:timeSp
     ds:rand
     ];
}

/**
 手机绑定
 **/
- (void)bindByMobile:(NSString *)phone
            withCode:(NSString *)code
            withUUID:(NSString *)uuid
        withCallback:(void(^)(NSMutableDictionary *response))callback
{
    	[self
    	 callApi:@"user"
    	 action:@"bind"
    	 params:@{@"device_id": uuid, @"code": code, @"phone": phone}
    	 callback:callback
    	 method: POST];
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
    NSLog(@"params:%@", params);

	switch (method) {
  case POST:
		{
			//[manager setResponseSerializer:[AFHTTPResponseSerializer alloc]];
			[manager POST:url parameters:params progress:nil
						success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
							//NSString *response = [[NSString alloc]initWithData:responseObject encoding:NSUTF8StringEncoding];
							//NSLog(@"%@", response);
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

/**
 调用加密api接口
 **/
- (void)callEncrpyApi:(NSString *)module
               action:(NSString *)action
               params:(NSDictionary *)params
             callback:(void(^)(NSMutableDictionary *response))callback
               method:(METHOD)method
                token:(NSString *) token
                   tm:(NSString *)tm
                   ds:(NSString *)ds
{
    NSMutableDictionary *dic = [[NSMutableDictionary alloc]init];
    [dic setObject:@"tom" forKey:@"name"];
    
    NSString* url = [NSString stringWithFormat:@"%@%@/%@", WEB_API_ROOT, module, action];
    NSLog(@"call api: %@", url);
    
    //manager.responseSerializer = [AFHTTPResponseSerializer serializer];
    [manager.requestSerializer setValue:token forHTTPHeaderField:@"sn"];
    [manager.requestSerializer setValue:tm forHTTPHeaderField:@"tm"];
    [manager.requestSerializer setValue:ds forHTTPHeaderField:@"ds"];
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
