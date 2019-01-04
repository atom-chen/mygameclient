//
//  LoginByMobile.m
//  doudizhuhero
//
//  Created by 劳琪峰 on 2017/1/4.
//  Copyright © 2017年 htgames. All rights reserved.
//

#import "FindPasswordByMobile.h"
#import "WebService.h"
#import "Utils.h"
#import "GameInfo.h"

@interface FindPasswordByMobile()
@property UIView* nibView;
@property HTGSDK* manager;
@property id<HTGSDKDelegate> delegate;
@property NSTimer* timer;
@property int count;
@end

@implementation FindPasswordByMobile

- (instancetype)initWithManager:(HTGSDK*) manager
													withDelegate:(id<HTGSDKDelegate>)delegate
{
	self = [super init];
	if (self) {
		_manager = manager;
		_delegate = delegate;
		_nibView =  [[[NSBundle mainBundle] loadNibNamed:@"FindPasswordByMobile" owner:self options:nil]objectAtIndex:0];
	}
	return self;
}

- (IBAction)getCode:(id)sender {
	NSString* mobile = _tiMobile.text;
	if(mobile.length == 11){
		[_manager showHUD:nil];
		[[WebService getInstance]getCode:_tiMobile.text withAction:0 callback:^(NSMutableDictionary *response) {
			[_manager hideHUD:0 withLabel:nil];
			int code = [response[@"code"]intValue];
			if(code == 0){
				[Utils alert:_manager withTitle:@"成功" withMessage:@"验证码已发送"];
				[self startCD];
			}else{
				[Utils alertApiResult:_manager withTitle:@"抱歉" withCode:code];
			}
		}];
	}else{
		[Utils alert:_manager withTitle:@"警告" withMessage:@"手机号格式有误"];
	}
}

- (IBAction)confirm:(id)sender {
	NSString *mobile = _tiMobile.text;
	NSString *code = _tiCode.text;
	NSString *password = _tiPassword.text;
	if(mobile.length == 0 || code.length == 0 || password.length == 0){
		[Utils alert:_manager withTitle:@"警告" withMessage:@"手机号或验证码或密码不能为空"];
	}else{
		[_manager showHUD:nil];
		[[WebService getInstance]resetPassword:mobile
																	withCode:code
															withPassword:password
															withCallback:^(NSMutableDictionary *response) {
			[_manager onResetPasswordResult:response withAlertTitle:@"重置密码失败"];
		}];
	}
}

- (void)startCD{
	[_btnGetCode setEnabled:NO];
	_count = 30;
	_timer = [NSTimer scheduledTimerWithTimeInterval:1 target:self selector:@selector(onTimer:) userInfo:nil repeats:YES];
}

- (void)onTimer:(id)userinfo{
	if(_count <= 0){
		[_btnGetCode setEnabled:YES];
		[_timer invalidate];
		[_btnGetCode setTitle:@"获取验证码" forState:UIControlStateNormal];
	}else{
		NSString* title = [NSString stringWithFormat:@"%ds重新获取", _count];
		[_btnGetCode setTitle:title forState:UIControlStateNormal];
		_count--;
	}
}

- (NSString*)getTitle{
	return @"密码找回";
}

- (void)viewTapped{
	[_tiMobile resignFirstResponder];
	[_tiCode resignFirstResponder];
	[_tiPassword resignFirstResponder];
}

- (void)show{
	_tiMobile.text = @"";
	_tiCode.text = @"";
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
