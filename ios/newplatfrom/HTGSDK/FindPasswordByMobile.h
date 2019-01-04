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

@interface FindPasswordByMobile : NSObject <AuthenticateSubView>
@property (weak, nonatomic) IBOutlet UITextField *tiMobile;
@property (weak, nonatomic) IBOutlet UITextField *tiCode;
@property (weak, nonatomic) IBOutlet UITextField *tiPassword;
@property (weak, nonatomic) IBOutlet UIButton *btnGetCode;
- (IBAction)getCode:(id)sender;
- (IBAction)confirm:(id)sender;

- (instancetype)initWithManager:(HTGSDK*) manager withDelegate:(id<HTGSDKDelegate>) delegate;
- (void)show;
- (void)hide;
@end
