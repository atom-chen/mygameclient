//
//  Authenticate.h
//  doudizhuhero
//
//  Created by 劳琪峰 on 2017/1/4.
//  Copyright © 2017年 htgames. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "WXApiManager.h"

@protocol HTGSDKDelegate <NSObject>
- (void)onAuthticateResult:(NSDictionary *)result;
- (void)onAuthticateCancel;

- (void)onBindResult:(NSDictionary *)result
				withUserInfo:(NSDictionary*)userInfo;
- (void)onBindCancel;
@end

@protocol AuthenticateSubView <NSObject>
- (NSString*)getTitle;
- (void)viewTapped;
- (void)show;
- (void)hide;
@end

@interface HTGSDK : UIViewController
- (instancetype)initWithViewController:(UIViewController*)vc withDelegate:(id<HTGSDKDelegate>)delegate;

@property (weak, nonatomic) IBOutlet UIView *bottomView;
@property (weak, nonatomic) IBOutlet NSLayoutConstraint *containerTop;
@property (weak, nonatomic) IBOutlet UILabel *labTitle;
@property (weak, nonatomic) IBOutlet UIView *viewContainer;
- (IBAction)close:(UIButton *)sender;
- (IBAction)onSelectThirdPart:(UIButton *)sender;

@property id<HTGSDKDelegate> delegate;
- (void)onLoginResult:(NSMutableDictionary*)response withAlertTitle:(NSString*)title isDirect:(BOOL)direct;
- (void)onBindResult:(NSMutableDictionary*)response
			withAlertTitle:(NSString*)title
				withUserInfo:(NSDictionary*)userInfo
						isDirect:(BOOL)direct;
- (void)onResetPasswordResult:(NSMutableDictionary*)response
			withAlertTitle:(NSString*)title;
- (void)showLoginByInput;
- (void)showLoginByMobile;
- (void)showLoginByRegister;
//- (void)showLoginByMobile;
- (void)showBindByMobile;
- (void)loginByGuest;
- (void)showFindPasswordByMobile;
- (void)showHUD:(NSString *)label;
- (void)hideHUD:(float)delay withLabel:(NSString*)label;
- (void)onWXAuthCallback:(SendAuthResp *)authResp isDirect:(BOOL)direct;
- (void)onWXBindCallback:(SendAuthResp *)authResp;
@end
