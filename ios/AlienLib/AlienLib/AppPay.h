//
//  AppPay.h
//  niuniu
//
//  Created by 劳琪峰 on 2017/2/14.
//  Copyright © 2017年 egret. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface AppPay : NSObject
- (instancetype)init;
- (void)pay:(NSString *)pid withType:(int)type withCallback:(void(^)(int code))callback;
@end
