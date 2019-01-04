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

@protocol AuthenticateDelegate <NSObject>
- (void)onAuthticateResult:(NSDictionary *)result;
- (void)onAuthticateCancel;
@end
@protocol BindDelegate <NSObject>
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

@interface AuthenticateManager : UIViewController
- (instancetype)initWithViewController:(UIViewController*)vc withDelegate:(id<AuthenticateDelegate>)delegate;

@property (weak, nonatomic) IBOutlet UIView *bottomView;
@property (weak, nonatomic) IBOutlet NSLayoutConstraint *containerTop;
@property (weak, nonatomic) IBOutlet UILabel *labTitle;
@property (weak, nonatomic) IBOutlet UIView *viewContainer;
- (IBAction)close:(UIButton *)sender;
- (IBAction)onSelectThirdPart:(UIButton *)sender;

@property id<AuthenticateDelegate> authenticateDelegate;
@property id<BindDelegate> bindDelegate;
- (void)onLoginResult:(NSMutableDictionary*)response withAlertTitle:(NSString*)title;
- (void)onBindResult:(NSMutableDictionary*)response
			withAlertTitle:(NSString*)title
				withUserInfo:(NSDictionary*)userInfo;
- (void)showLoginByInput;
- (void)showLoginByRegister;
//- (void)showLoginByMobile;
- (void)showBindByMobile;
//- (void)loginByGuest;
- (void)showHUD:(NSString *)label;
- (void)hideHUD:(float)delay withLabel:(NSString*)label;
- (void)onWXAuthCallback:(SendAuthResp *)authResp;
- (void)onWXBindCallback:(SendAuthResp *)authResp;
@end
