//
//  Utils.h
//  doudizhuhero
//
//  Created by 劳琪峰 on 16/6/12.
//  Copyright © 2016年 egret. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface Utils : NSObject
+ (NSString *)getIpAddress;
+ (NSString *)getIPhoneType;
+ (NSString *)getUUID;
+ (NSString *)getUUIDWithMD5;
+ (NSString *)md5:(NSString *)source;
+ (void)alert:(UIViewController*)parent withTitle:(NSString*)title withMessage:(NSString*)message;
+ (void)alertApiResult:(UIViewController*)parent withTitle:(NSString*)title withCode:(int)code;
+ (NSString*)getInfo:(NSString*)key;

+ (void)setVc:(UIViewController*)vc;
+ (UIViewController *)getVc;
@end
