//
//  AppPay.m
//  niuniu
//
//  Created by 劳琪峰 on 2017/2/14.
//  Copyright © 2017年 egret. All rights reserved.
//

#import "AppPay.h"
#import "WebService.h"
#import "GameInfo.h"
#import "StorePurchase.h"
#import <UIKit/UIKit.h>
#import "AliPayManager.h"
#import "WXApiManager.h"

@interface AppPay()
@property StorePurchase *storePurchase;

@end

@implementation AppPay
- (instancetype)init{
	if(self = [super init]){
		[self setup];
	}
	return self;
}

- (void)setup{
	
}

- (void)pay:(NSString *)pid withType:(int)type withCallback:(void(^)(int code))callback{
	if(type == 0){
		if(!_storePurchase){
			_storePurchase = [[StorePurchase alloc]init];
		}
		
		[_storePurchase doPruchase:pid callback:^(int code, NSString *receiptData) {
			if(code == 0){
				[[WebService getInstance]payment:receiptData uid:[GameInfo getInstance].uid callback:^(NSMutableDictionary *response) {
					int code = [response[@"code"]intValue];
					NSLog(@"AppPay code: %d", code);
					callback(code);
				}];
			}else{
				NSLog(@"AppPay code: %d", code);
				callback(code);
			}
		}];
	}else{
        // [self testThirdPay:callback];
        // return ;
        NSString *reqAction = @"";
        switch (type) {
            case 1:
                reqAction = @"alipayOrder";
                break;
            case 2:
                reqAction = @"wechatpayOrder";
                break;
                
            default:
                break;
        }
        
        [[WebService getInstance]getPayOrderString:reqAction withType:[GameInfo getInstance].serverType withUid:[GameInfo getInstance].uid withProductID:pid callback:^(NSMutableDictionary *response) {
			NSLog(@"%@", response);
			
			int code = [response[@"code"]intValue];
			if(code == 0){
//				[self jumpToThirdPart:response[@"data"] withCallback:callback];
                switch (type) {
                    case 1: // alipay
                        NSLog(@"go alipay pay");
                        [[AliPayManager getInstance] doAlipayPay:response[@"data"] withCallback:callback];
                        break;
                    case 2: // wechat
                        //[[AliPayManager getInstance] doAlipayPay:response[@"data"] withCallback:callback];
                        NSLog(@"go wechat pay");
                        [[WXApiManager getInstance] doPay:response[@"data"] withCallback:callback];
                        break;
                        
                    default:
                        break;
                }
			}else{
				callback(code);
			}
		}];
	}
}

- (void)jumpToThirdPart:(NSString *)url withCallback:(void(^)(int code))callback{
	//应用注册scheme,在AliSDKDemo-Info.plist定义URL types
	//NSString *appScheme = @"alisdk";
	
	// NOTE: 调用支付结果开始支付
	/*[[AlipaySDK defaultService] payOrder:orderString fromScheme:appScheme callback:^(NSDictionary *resultDic) {
		NSLog(@"reslut = %@",resultDic);
	}];*/
    
    
    [[AliPayManager getInstance] doAlipayPay:url withCallback:callback];
    // callback(199);
//	[[UIApplication sharedApplication]openURL:[NSURL URLWithString:url]];
}

- (void)testThirdPay:(void(^)(int code))callback{
    /* AliPay Test
    NSString *param = @"alipay_sdk=alipay-sdk-php-20161101&app_id=2017090608582565&biz_content=%7B%22timeout_express%22%3A%2230m%22%2C%22product_code%22%3A%22QUICK_MSECURITY_PAY%22%2C%22total_amount%22%3A1%2C%22subject%22%3A%2210000%5Cu91d1%5Cu5e01%22%2C%22body%22%3A%22%5Cu542b10000%5Cu91d1%5Cu5e01%22%2C%22out_trade_no%22%3A%22DL_1000003_69d7ac1b5b7b9942%22%7D&charset=UTF-8&format=json&method=alipay.trade.app.pay&notify_url=http%3A%2F%2F120.27.162.46%3A8996%2FShop%2FalipayNotify&sign_type=RSA&timestamp=2017-09-07+14%3A22%3A13&version=1.0&sign=eywL9ZHE9FL%2FmEoJcMr4avTf%2BU0%2FS3cHOoN3XbNlpSYFV9iFks2miXNdsJVmysn5dbx2j%2BWaYvDhxDgDqJdo%2FzTzPLzM3AhGM3ElklOyUb1PUL%2BgS4xwrd0NwcSGJolbBV%2BY%2FDYWtfuU%2BiwgesIIB3U66oua1eSbY8cTUUJRWzy9Ptc9E1qYlFDqLVnU1z%2B3xY7GKeSZX7xUO4%2FV6A45lrD42aaGwR61LDvqLlClrKuFGCsbKcLQyXTF%2FKWGJCK67KBqokw%2FNzu9ueKOAc6z9ri7M6HkvhjLgJgVtvOfOXesFjpD872dPSz9sWt3woGaQnLo5b8XTy%2BCU5YmJQ%2BbGw%3D%3D";
    [[AliPayManager getInstance] doAlipayPay:param withCallback:callback];
     */
}

@end
