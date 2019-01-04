//
//  ApplePay.h
//  doudizhuhero
//
//  Created by 劳琪峰 on 16/7/5.
//  Copyright © 2016年 htgames. All rights reserved.
//

#import <Foundation/Foundation.h>
@import PassKit;

@interface ApplePay : NSObject
<PKPaymentAuthorizationViewControllerDelegate>

- (instancetype)initWithViewController:(UIViewController *)viewController;
- (BOOL)doPay:(NSString *)label decimal:(NSString *)decimal;
@end
