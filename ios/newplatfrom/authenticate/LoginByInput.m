//
//  LoginByMobile.m
//  doudizhuhero
//
//  Created by 劳琪峰 on 2017/1/4.
//  Copyright © 2017年 htgames. All rights reserved.
//

#import "LoginByInput.h"
#import "WebService.h"
#import "Utils.h"

@interface LoginByInput()
@property UIView* nibView;
@property AuthenticateManager* manager;
@property id<AuthenticateDelegate> delegate;
@end

@implementation LoginByInput
- (instancetype)initWithManager:(AuthenticateManager*) manager
													withDelegate:(id<AuthenticateDelegate>)delegate
{
	self = [super init];
	if (self) {
		_manager = manager;
		_delegate = delegate;
		_nibView =  [[[NSBundle mainBundle] loadNibNamed:@"LoginByInput" owner:self options:nil]objectAtIndex:0];
	}
	return self;
}


- (IBAction)confirm:(UIButton *)sender {
	NSString *uid = _tiID.text;
	NSString *password = _tiPassword.text;
	if(uid.length == 0 || password.length == 0){
		[Utils alert:_manager withTitle:@"警告" withMessage:@"用户名或密码不能为空"];
	}else{
		[_manager showHUD:nil];
		[[WebService getInstance]loginByInput:uid password:password callback:^(NSMutableDictionary *response) {
			[_manager onLoginResult:response withAlertTitle:NSLocalizedString(@"login_failed", nil)];
		}];
	}
}

- (IBAction)register:(UIButton *)sender {
	[self hide];
	[_manager showLoginByRegister];
}

- (IBAction)forget:(UIButton *)sender {
}

- (NSString*)getTitle{
	return @"通行证登录";
}

- (void)viewTapped{
	[_tiID resignFirstResponder];
	[_tiPassword resignFirstResponder];
}

- (void)show{
	_tiID.text = @"";
	_tiPassword.text = @"";
	
	CGRect frame = _manager.viewContainer.frame;
	frame.origin.y = 0;
	[_nibView setFrame:frame];
	[_manager.viewContainer addSubview:_nibView];
}

- (void)hide{
	[_nibView removeFromSuperview];
}
@end
