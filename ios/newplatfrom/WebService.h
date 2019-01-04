//
//  WebService.h
//  doudizhu
//
//  Created by 劳琪峰 on 2016/12/12.
//  Copyright © 2016年 egret. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef enum{
	POST,
	GET
} METHOD;

@interface WebService : NSObject

+ (instancetype)getInstance;

- (instancetype)initWithConfig;


- (void)loginByInput:(NSString *)ID password:(NSString *)password callback:(void(^)(NSMutableDictionary *response))callback;
- (void)loginByPhone:(NSString *)phone pcode:(NSString *)code callback:(void(^)(NSMutableDictionary *response))callback;
- (void)fisrtLaunchNotify:(NSString*) adid callback:(void(^)(NSMutableDictionary *response))callback;

- (void)loginByRegister:(NSString *)ID password:(NSString *)password callback:(void(^)(NSMutableDictionary *response))callback;

- (void)loginByGuest:(NSString *)uuid callback:(void(^)(NSMutableDictionary *response))callback;

- (void)loginByWeiXinCode:(NSString *)code callback:(void(^)(NSMutableDictionary *response))callback;

- (void)bindByWeiXin:(NSString *)code uuid:(NSString *)uuid callback:(void(^)(NSMutableDictionary *response))callback;

- (void)bindByWeiXinEncrpy:(NSString *)code callback:(void(^)(NSMutableDictionary *response))callback;

- (void)bindByMobileEncrpy:(NSString *)phone withCode:(NSString *)code withUID:(NSString *)uid withCallback:(void(^)(NSMutableDictionary *response))callback;

- (void)bindByMobile:(NSString *)phone withCode:(NSString *)code withUID:(NSString *)uid withCallback:(void(^)(NSMutableDictionary *response))callback;

- (void)resetPassword:(NSString *)phone
						 withCode:(NSString *)code
				 withPassword:(NSString *)password
				 withCallback:(void(^)(NSMutableDictionary *response))callback;

- (void)checkBind:(NSString *)userName withCallback:(void(^)(NSMutableDictionary *response))callback;

- (void)payment:(NSString *)receiptData uid:(NSString*)uid callback:(void(^)(NSMutableDictionary *response))callback;

- (void)getCode:(NSString *)phone withAction:(int)action callback:(void(^)(NSMutableDictionary *response))callback;

- (void)getYunCode:(NSString *)phone withAction:(int)action callback:(void(^)(NSMutableDictionary *response))callback;

- (void)getPayOrderString:(NSString *)action
                 withType:(NSString *)type
				  withUid:(NSString *)uid
            withProductID:(NSString *)pid
                 callback:(void(^)(NSMutableDictionary *response))callback;

- (void)callApi:(NSString *)module action:(NSString *)action params:(NSDictionary *)params callback:(void(^)(NSMutableDictionary *response))callback method:(METHOD)method;
@end
