//
//  WXApiManager.h
//  SDKSample
//
//  Created by Jeason on 16/07/2015.
//
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "WXApi.h"

@interface WXApiManager : NSObject<WXApiDelegate>

@property void (^callback)(SendAuthResp *authResp);
@property void (^payCallback)(int code);
@property void (^shareCallback)(int code);
@property int type;

+ (instancetype)getInstance;

- (instancetype)init;
- (void)setup:(NSString *)appid;
- (void)doAuth:(UIViewController *)vc withCallback:(void(^)(SendAuthResp *authResp))callback withState:(NSString*)state;
- (void)doPay:(NSDictionary*)payInfo withCallback:(void(^)(int code))callback;
- (void)doShare:(NSDictionary*)shareInfo withCallback:(void(^)(int code))callback;

- (void)shareUrl:(NSDictionary*)shareInfo;
- (void)shareImage:(NSDictionary*)shareInfo;

@end
