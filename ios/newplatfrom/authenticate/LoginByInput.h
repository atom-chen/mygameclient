//
//  LoginByMobile.h
//  doudizhuhero
//
//  Created by 劳琪峰 on 2017/1/4.
//  Copyright © 2017年 htgames. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "AuthenticateManager.h"

@interface LoginByInput : NSObject <AuthenticateSubView>

@property (weak, nonatomic) IBOutlet UITextField *tiID;
@property (weak, nonatomic) IBOutlet UITextField *tiPassword;
- (IBAction)confirm:(UIButton *)sender;
- (IBAction)forget:(UIButton *)sender;
- (IBAction)register:(UIButton *)sender;

- (instancetype)initWithManager:(AuthenticateManager*) manager withDelegate:(id<AuthenticateDelegate>)delegate;
- (void)show;
- (void)hide;
@end
