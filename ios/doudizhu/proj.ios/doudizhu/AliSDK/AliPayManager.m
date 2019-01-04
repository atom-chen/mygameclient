//
//  AliPay.m
//  doudizhu
//
//  Created by 管理员 on 2017/9/6.
//  Copyright © 2017年 egret. All rights reserved.
//


#import "AliPayManager.h"
#import "Utils.h"
#import <AlipaySDK/AlipaySDK.h>


@implementation AliPayManager

static AliPayManager *instance;

/*
 9000	订单支付成功
 8000	正在处理中，支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
 4000	订单支付失败
 5000	重复请求
 6001	用户中途取消
 6002	网络连接出错
 6004	支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
 其它	其它支付错误
 */


+(instancetype)getInstance {
    @synchronized (self) {
        if(instance == nil){
            instance = [[AliPayManager alloc] init];
        }
    }
    return instance;
}

- (instancetype)init{
    if(self = [super init]){
        
    }
    
    return self;
}

//
//选中商品调用支付宝极简支付
//
- (void)doAlipayPay:(NSString*)signedString withCallback:(void(^)(int code))callback
{
    NSString *appScheme = [Utils getInfo:@"AppScheme"];
    // 实际支付应该只调用这一句，所有字符串加密工作应该在服务端做好，传给客户端，客户端只负责发送数据给第三方即可  以上做法出于安全考虑
    [[AlipaySDK defaultService] payOrder:signedString fromScheme:appScheme callback:^(NSDictionary *resultDic) {
        NSLog(@"reslut = %@",resultDic);
        [self onPayResult:resultDic withCallback:callback];
    }];
}

// pay result callback
- (void)onPayResult:(NSDictionary*)resultDic withCallback:(void(^)(int code))callback
{
    NSString* codeString = [resultDic objectForKey:@"resultStatus"];
    int code = [codeString intValue];
    int ret = 101; // failed
    if (code == 9000) { // succ
        ret = 0;
    } else if (code == 6001) { // cancel
        ret = 1;
        
        //NSString* retString = [[NSString alloc] initWithFormat:@"result:%@", [resultDic objectForKey:@"result"]];
        //[Utils alert:viewController withTitle:@"Result" withMessage:retString];
    } else { // other
        ret = code;
        
        //NSString* retString = [[NSString alloc] initWithFormat:@"result:%@", [resultDic objectForKey:@"result"]];
        //[Utils alert:viewController withTitle:@"Result" withMessage:retString];
    }
    
    if (callback != nil) {
        callback(ret);
    } else {
        // system alert
        
    }
}

@end
