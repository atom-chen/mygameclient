//
//  NativeInterface.h
//  doudizhuhero
//
//  Created by 劳琪峰 on 16/5/27.
//  Copyright © 2016年 egret. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
//#import "WXApiManager.h"
#import "HTGSDK.h"

@interface NativeInterface : NSObject<NSURLConnectionDataDelegate, HTGSDKDelegate>
- (instancetype)initWithViewController:(UIViewController *)viewController;
@end
