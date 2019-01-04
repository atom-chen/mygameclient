//
//  AliPay.m
//  doudizhu
//
//  Created by 管理员 on 2017/9/6.
//  Copyright © 2017年 egret. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface AliPayManager : NSObject

+ (instancetype)getInstance;

- (instancetype)init;


- (void)doAlipayPay:(NSString*)signedString withCallback:(void(^)(int code))callback;
- (void)onPayResult:(NSDictionary*)resultDic withCallback:(void(^)(int code))callback;

@end
