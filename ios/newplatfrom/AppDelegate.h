//
//  AppDelegate.h
//  
//  Copyright (c) 2014-2015 egret. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "GeTuiSdk.h"

#if __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
#import <UserNotifications/UserNotifications.h>
#endif

#define kGtAppId           @"XmEfBUIBr39D1Gsz3Rd3R5"
#define kGtAppKey          @"ZgVlYZHKB16d0i4dNvTKI5"
#define kGtAppSecret       @"z2Aq7z4eVu9iJ0KdweRYt1"


@interface AppDelegate : UIResponder <UIApplicationDelegate, GeTuiSdkDelegate, UNUserNotificationCenterDelegate>

@property (strong, nonatomic) UIWindow *window;

@end

