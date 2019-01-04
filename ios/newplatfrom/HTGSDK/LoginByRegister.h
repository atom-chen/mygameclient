//
//  LoginByMobile.h
//  doudizhuhero
//
//  Created by 劳琪峰 on 2017/1/4.
//  Copyright © 2017年 htgames. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "HTGSDK.h"

@interface LoginByRegister : NSObject <AuthenticateSubView>

@property (weak, nonatomic) IBOutlet UITextField *tiID;
@property (weak, nonatomic) IBOutlet UITextField *tiPassword;
- (IBAction)confirm:(UIButton *)sender;
- (IBAction)toLogin:(UIButton *)sender;

- (instancetype)initWithManager:(HTGSDK*) manager withDelegate:(id<HTGSDKDelegate>)delegate;
- (void)show;
- (void)hide;
@end
