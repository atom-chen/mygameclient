//
//  Authenticate.m
//  doudizhuhero
//
//  Created by 劳琪峰 on 2017/1/4.
//  Copyright © 2017年 htgames. All rights reserved.
//

#import "HTGSDK.h"
#import "LoginByInput.h"
#import "LoginByRegister.h"
#import "BindByMobile.h"
#import "FindPasswordByMobile.h"
#import "WebService.h"
#import "Utils.h"
#import "MBProgressHUD.h"
#import "LoginByMobile.h"
#import "UMMobClick/MobClick.h"

@interface HTGSDK()
@property UIViewController* viewController;
@property LoginByInput* loginByInput;
@property LoginByRegister* loginByRegister;
@property BindByMobile* bindByMobile;
@property LoginByMobile* loginByMobile;
@property FindPasswordByMobile* findPasswordByMobile;
@property id<AuthenticateSubView> currentView;
@end

NSString* titlePrefix = @"%@";
BOOL visible;
MBProgressHUD* hud;
@implementation HTGSDK
- (instancetype)initWithViewController:(UIViewController*)vc withDelegate:(id<HTGSDKDelegate>)delegate{
	if(self = [super init]){
		_viewController = vc;
		_delegate = delegate;
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
	_labTitle.text = [NSString stringWithFormat:titlePrefix, [_currentView getTitle]];
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
	
	_containerTop.constant = 110 - keyboardFrame.size.height;
}

-(void)closeKeyboard:(NSNotification *)notification{
	_containerTop.constant = 8;
}
/**
 游客登录
 */
- (void)loginByGuest{
    [[WebService getInstance]loginByGuest:[Utils getUUIDWithMD5] callback:^(NSMutableDictionary *response) {
        [self onLoginResult:response withAlertTitle:@"登陆失败" isDirect:false];
        //[self onLoginResult:response withAlertTitle:@"登录失败"];
    }];
}
/**
 弹出通行证登录
 */
- (void)showLoginByInput{
	if(!_loginByInput){
		_loginByInput = [[LoginByInput alloc]initWithManager:self withDelegate:_delegate];
	}
	
	_currentView = _loginByInput;
	[self show];
	_bottomView.hidden = NO;
}

/**
 弹出手机登录
 */
- (void)showLoginByMobile{
    if(!_loginByMobile){
        _loginByMobile = [[LoginByMobile alloc]initWithManager:self withDelegate:_delegate];
    }
    
    _currentView = _loginByMobile;
    [self show];
    _bottomView.hidden = NO;
}


/**
 弹出注册登录
 */
- (void)showLoginByRegister{
	if(!_loginByRegister){
		_loginByRegister = [[LoginByRegister alloc]initWithManager:self withDelegate:_delegate];
	}
	
	_currentView = _loginByRegister;
	[self show];
	_bottomView.hidden = NO;
}

/**
 弹出注册登录
 */
- (void)showFindPasswordByMobile{
	if(!_findPasswordByMobile){
		_findPasswordByMobile = [[FindPasswordByMobile alloc]initWithManager:self withDelegate:_delegate];
	}
	
	_currentView = _findPasswordByMobile;
	[self show];
	_bottomView.hidden = NO;
}

/**
 弹出绑定手机
 */
- (void)showBindByMobile{
	if(!_bindByMobile){
		_bindByMobile = [[BindByMobile alloc]initWithManager:self withDelegate:_delegate];
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
		[_delegate onBindCancel];
	}else{
		[_delegate onAuthticateCancel];
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
				[self onWXAuthCallback:authResp isDirect:NO];
			} withState:@"auth"];
			break;
	}
}

- (void)onLoginResult:(NSMutableDictionary*)response
			 withAlertTitle:(NSString*)title
						 isDirect:(BOOL)direct{
	UIViewController* parent = direct ? _viewController : self;
	
	[self hideHUD:0.5 withLabel:nil];
	if(!response){
		[Utils alert:parent withTitle:title withMessage:@"网络错误，请稍后再试。"];
		return;
	}
	int code = [response[@"code"]intValue];
	NSLog(@"code: %d", code);
	
	if(code != 0){
        [_delegate onAuthticateResult:response];
		[Utils alertApiResult:parent withTitle:title withCode:code];
	}
	if(direct){
		[_delegate onAuthticateResult:response];
	}else if(code == 0){
        
		[_delegate onAuthticateResult:response];
        NSString *token = response[@"data"][@"token"];
        NSUserDefaults *mySettingData = [NSUserDefaults standardUserDefaults];
        NSString *uid = response[@"data"][@"uid"];
        [mySettingData setObject:token forKey:@"apptoken"];
        [mySettingData setObject:uid forKey:@"uid"];
        NSString *struid = [NSString stringWithFormat:@"%@", uid];
        int type =[response[@"data"][@"type"] intValue];//4 微信， 1用户
        if (type == 4) {
            // 微信登陆
            [MobClick profileSignInWithPUID:struid provider:@"WX"];
        }
        else
        {
            //账号登陆
            [MobClick profileSignInWithPUID:struid];
        }
        
		[self hide];
	}
}

- (void)onBindResult:(NSMutableDictionary*)response
			withAlertTitle:(NSString*)title
				withUserInfo:(NSDictionary*)userInfo
						isDirect:(BOOL)direct{
	UIViewController* parent = direct ? _viewController : self;
	
	[self hideHUD:0.5 withLabel:nil];
	if(!response){
		[Utils alert:parent withTitle:title withMessage:@"网络错误，请稍后再试。"];
		return;
	}
	int code = [response[@"code"]intValue];
	
	if(code != 0){
		[Utils alertApiResult:parent withTitle:title withCode:code];
	}
	if(direct){
		[_delegate onBindResult:response withUserInfo:userInfo];
	}else if(code == 0){
		[_delegate onBindResult:response withUserInfo:userInfo];
		[self hide];
	}
}

- (void)onResetPasswordResult:(NSMutableDictionary*)response
			withAlertTitle:(NSString*)title{
	[self hideHUD:0.5 withLabel:nil];
	if(!response){
		[Utils alert:self withTitle:title withMessage:@"网络错误，请稍后再试。"];
		return;
	}
	int code = [response[@"code"]intValue];
	if(code == 0){
		[Utils alert:self withTitle:@"提示" withMessage:@"密码重置成功"];
		[_currentView hide];
		[self showLoginByInput];
	}else{
		[Utils alertApiResult:self withTitle:title withCode:code];
	}
}

- (void)onWXAuthCallback:(SendAuthResp *)authResp
								isDirect:(BOOL)direct{
	switch (authResp.errCode) {
		case 0: //用户同意
		{
			NSLog(@"code: %@", authResp.code);
			[[WebService getInstance]loginByWeiXinCode:authResp.code callback:^(NSMutableDictionary *response) {
				NSLog(@"%@", response);
				[self onLoginResult:response withAlertTitle:@"微信授权失败" isDirect:direct];
			}];
		}
			break;
		case -4: //用户拒绝授权
			[_delegate onAuthticateResult:@{@"code": @(1)}];
			break;
		case -2: //用户取消
			[_delegate onAuthticateCancel];
			break;
		default:
			[_delegate onAuthticateResult:@{@"code": @(3)}];
			break;
	}
}

- (void)onWXBindCallback:(SendAuthResp *)authResp{
	switch (authResp.errCode) {
		case 0: //用户同意
		{
            [[WebService getInstance]bindByWeiXinEncrpy:authResp.code  callback:^(NSMutableDictionary *response) {
                NSLog(@"%@", response);
                [self onBindResult:response withAlertTitle:@"微信绑定失败" withUserInfo:nil isDirect:YES];
            }];
		}
			break;
		case -4: //用户拒绝授权
			[_delegate onBindResult:@{@"code": @(1)} withUserInfo:nil];
			break;
		case -2: //用户取消
			[_delegate onBindCancel];
			break;
		default:
			[_delegate onBindResult:@{@"code": @(3)} withUserInfo:nil];
			break;
	}
}
@end
