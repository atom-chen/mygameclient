//
//  LoginByMobile.h
//  doudizhuhero
//
//  Created by  on 2017/1/4.
//  Copyright © 2017年 htgames. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "HTGSDK.h"

@interface BindByMobile : NSObject <AuthenticateSubView>
@property (weak, nonatomic) IBOutlet UITextField *tiMobile;
@property (weak, nonatomic) IBOutlet UITextField *tiCode;
@property (weak, nonatomic) IBOutlet UIButton *btnGetCode;
- (IBAction)getCode:(id)sender;
- (IBAction)confirm:(id)sender;

- (instancetype)initWithManager:(HTGSDK*) manager withDelegate:(id<HTGSDKDelegate>) delegate;
- (void)show;
- (void)hide;
@end
