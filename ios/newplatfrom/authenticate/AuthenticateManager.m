//
//  Authenticate.m
//  doudizhuhero
//
//  Created by 劳琪峰 on 2017/1/4.
//  Copyright © 2017年 htgames. All rights reserved.
//

#import "AuthenticateManager.h"
#import "LoginByInput.h"
#import "LoginByRegister.h"
#import "BindByMobile.h"
#import "WebService.h"
#import "Utils.h"
#import "MBProgressHUD.h"

@interface AuthenticateManager()
@property UIViewController* viewController;
@property LoginByInput* loginByInput;
@property LoginByRegister* loginByRegister;
@property BindByMobile* bindByMobile;
@property id<AuthenticateSubView> currentView;
@end

NSString* titlePrefix_V2 = @"%@";
NSString* apiResultFormat = @"api_result_%d";
BOOL visible;
MBProgressHUD* hud;
@implementation AuthenticateManager
- (instancetype)initWithViewController:(UIViewController*)vc withDelegate:(id<AuthenticateDelegate>)delegate{
	if(self = [super init]){
		_viewController = vc;
		_authenticateDelegate = delegate;
	}
	
	return self;
}

-(void)viewTapped:(UITapGestureRecognizer*)tapGr
{
	[_currentView viewTapped];
}

- (void)viewDidLoad {
	[super viewDidLoad];
	
	UITapGestureRecognizer *tapGr = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(viewTapped:)];
	tapGr.cancelsTouchesInView = NO;
	[self.view addGestureRecognizer:tapGr];
}

- (void)viewWillAppear:(BOOL)animated {
	_labTitle.text = [NSString stringWithFormat:titlePrefix_V2, [_currentView getTitle]];
	[_currentView show];
	
	[[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(openKeyboard:) name:UIKeyboardWillShowNotification object:nil];
	[[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(closeKeyboard:) name:UIKeyboardWillHideNotification object:nil];
}

- (void)viewDidDisappear:(BOOL)animated {
	[_currentView hide];
	
	[[NSNotificationCenter defaultCenter]removeObserver:self name:UIKeyboardWillShowNotification object:nil];
	[[NSNotificationCenter defaultCenter]removeObserver:self name:UIKeyboardWillHideNotification object:nil];
}

- (BOOL)shouldAutorotate {
	return NO;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
	return UIInterfaceOrientationMaskLandscape;
}

-(void)openKeyboard:(NSNotification *)notification{
	CGRect keyboardFrame = [notification.userInfo[UIKeyboardFrameEndUserInfoKey]CGRectValue];
	
	_containerTop.constant = 100 - keyboardFrame.size.height;
}

-(void)closeKeyboard:(NSNotification *)notification{
	_containerTop.constant = 8;
}

/**
 弹出通行证登录
 */
- (void)showLoginByInput{
	if(!_loginByInput){
		_loginByInput = [[LoginByInput alloc]initWithManager:self withDelegate:_authenticateDelegate];
	}
	
	_currentView = _loginByInput;
	[self show];
	_bottomView.hidden = NO;
}

/**
 弹出注册登录
 */
- (void)showLoginByRegister{
	if(!_loginByRegister){
		_loginByRegister = [[LoginByRegister alloc]initWithManager:self withDelegate:_authenticateDelegate];
	}
	
	_currentView = _loginByRegister;
	[self show];
	_bottomView.hidden = NO;
}

/**
 弹出绑定手机
 */
- (void)showBindByMobile{
	if(!_bindByMobile){
		_bindByMobile = [[BindByMobile alloc]initWithManager:self withDelegate:_bindDelegate];
	}
	
	_currentView = _bindByMobile;
	[self show];
	_bottomView.hidden = YES;
}

/**
 关闭
 */
- (IBAction)close:(UIButton *)sender {
	if(_currentView == _bindByMobile){
		[_bindDelegate onBindCancel];
	}else{
		[_authenticateDelegate onAuthticateCancel];
	}
	[self hide];
}

- (void)show{
	if(!visible){
		[_viewController presentViewController:self animated:YES completion:nil];
	}else{
		[self viewWillAppear:YES];
	}
	visible = YES;
}

- (void)hide{
	if(visible){
		[self dismissViewControllerAnimated:YES completion:nil];
	}
	visible = NO;
}

/**
 显示HUD
 */
- (void)showHUD:(NSString *)label{
	if(!hud){
		hud = [MBProgressHUD showHUDAddedTo:self.view animated:YES];
		hud.mode = MBProgressHUDModeIndeterminate;
	}
	if(label){
		hud.labelText = label;
	}else{
		hud.labelText = @"请稍候";
	}
}

/**
 隐藏HUD
 */
- (void)hideHUD:(float)delay withLabel:(NSString*)label{
	if(hud){
		if(label){
			hud.labelText = label;
		}
		[hud hide:YES afterDelay:delay];
	}
}

- (IBAction)onSelectThirdPart:(UIButton *)sender {
	[self showHUD: nil];
	long tag = sender.tag;
	switch(tag){
		case 1:	//weixin
			[[WXApiManager getInstance]doAuth:self withCallback:^(SendAuthResp *authResp) {
				[self onWXAuthCallback:authResp];
			} withState:@"auth"];
			break;
	}
}

- (void)onLoginResult:(NSMutableDictionary*)response withAlertTitle:(NSString*)title{
	[self hideHUD:0.5 withLabel:nil];
	if(!response){
		[Utils alert:self withTitle:title withMessage:@"网络错误，请稍后再试。"];
		return;
	}
	int code = [response[@"code"]intValue];
	NSLog(@"code: %d", code);
	if(code == 0){
		[_authenticateDelegate onAuthticateResult:response];
		[self hide];
	}else{
		NSString* key = [NSString stringWithFormat:apiResultFormat, code];
		NSString* message = NSLocalizedString(key, nil);
		[Utils alert:self withTitle:title withMessage:message];
	}
}

- (void)onBindResult:(NSMutableDictionary*)response
			withAlertTitle:(NSString*)title
				withUserInfo:(NSDictionary*)userInfo{
	[self hideHUD:0.5 withLabel:nil];
	if(!response){
		[Utils alert:self withTitle:title withMessage:@"网络错误，请稍后再试。"];
		return;
	}
	int code = [response[@"code"]intValue];
	if(code == 0){
		[_bindDelegate onBindResult:response withUserInfo:userInfo];
		[self hide];
	}else{
		NSString* key = [NSString stringWithFormat:apiResultFormat, code];
		NSString* message = NSLocalizedString(key, nil);
		[Utils alert:self withTitle:title withMessage:message];
	}
}
//wx44e54c235e4144c5://wapoauth?m=Kzg2MTM3NTcxMjgxNDI%3D&t=392287
- (void)onWXAuthCallback:(SendAuthResp *)authResp{
	switch (authResp.errCode) {
		case 0: //用户同意
		{
			NSLog(@"code: %@", authResp.code);
			[[WebService getInstance]loginByWeiXinCode:authResp.code callback:^(NSMutableDictionary *response) {
				NSLog(@"%@", response);
				[self onLoginResult:response withAlertTitle:@"微信授权失败"];
			}];
		}
			break;
		case -4: //用户拒绝授权
			[_authenticateDelegate onAuthticateResult:@{@"code": @(1)}];
			break;
		case -2: //用户取消
			[_authenticateDelegate onAuthticateCancel];
			break;
		default:
			[_authenticateDelegate onAuthticateResult:@{@"code": @(99)}];
			break;
	}
}

- (void)onWXBindCallback:(SendAuthResp *)authResp{
	switch (authResp.errCode) {
		case 0: //用户同意
		{
			NSLog(@"code: %@", authResp.code);
			[[WebService getInstance]loginByWeiXinCode:authResp.code callback:^(NSMutableDictionary *response) {
				NSLog(@"%@", response);
				[self onBindResult:response withAlertTitle:@"微信绑定失败" withUserInfo:nil];
			}];
		}
			break;
		case -4: //用户拒绝授权
			[_bindDelegate onBindResult:@{@"code": @(1)} withUserInfo:nil];
			break;
		case -2: //用户取消
			[_bindDelegate onBindCancel];
			break;
		default:
			[_bindDelegate onBindResult:@{@"code": @(3)} withUserInfo:nil];
			break;
	}
}
@end
