//
//  LoginByMobile.m
//  doudizhuhero
//
//  Created by 劳琪峰 on 2017/1/4.
//  Copyright © 2017年 htgames. All rights reserved.
//

#import "LoginByMobile.h"
#import "WebService.h"
#import "Utils.h"
#import "GameInfo.h"

@interface LoginByMobile()
@property UIView* nibView;
@property HTGSDK* manager;
@property id<HTGSDKDelegate> delegate;
@property NSTimer* timer;
@property int count;
@end

@implementation LoginByMobile

- (instancetype)initWithManager:(HTGSDK*) manager
													withDelegate:(id<HTGSDKDelegate>)delegate
{
	self = [super init];
	if (self) {
		_manager = manager;
		_delegate = delegate;
		_nibView =  [[[NSBundle mainBundle] loadNibNamed:@"LoginByMobile" owner:self options:nil]objectAtIndex:0];
	}
	return self;
}

- (IBAction)getCode:(id)sender {
	NSString* mobile = _tiMobile.text;
	if(mobile.length == 11){
		[_manager showHUD:nil];
		[[WebService getInstance]getYunCode:_tiMobile.text withAction:1 callback:^(NSMutableDictionary *response) {
			[_manager hideHUD:0 withLabel:nil];
            NSLog(@"response:%@",response);
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
	if(mobile.length == 0 || code.length == 0){
		[Utils alert:_manager withTitle:@"警告" withMessage:@"手机号或验证码不能为空"];
	}else{
		[_manager showHUD:nil];
        [[WebService getInstance]loginByPhone:mobile pcode:code callback:^(NSMutableDictionary *response) {
            [_manager onLoginResult:response withAlertTitle:NSLocalizedString(@"login_failed", nil) isDirect:NO];
//            _manager onLoginResult:<#(NSMutableDictionary *)#> withAlertTitle:<#(NSString *)#> isDirect:<#(BOOL)#>
//            [_manager onlogi:response withAlertTitle:@"手机号登陆失败" withUserInfo:@{@"phone": mobile, @"code": code} isDirect:NO];
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
	return @"手机号登录";
}

- (void)viewTapped{
	[_tiMobile resignFirstResponder];
	[_tiCode resignFirstResponder];
}

- (void)show{
	_tiMobile.text = @"";
	_tiCode.text = @"";
	
	CGRect frame = _manager.viewContainer.frame;
	frame.origin.y = 0;
	[_nibView setFrame:frame];
	[_manager.viewContainer addSubview:_nibView];
}

- (void)hide{
	[_nibView removeFromSuperview];
}
@end
