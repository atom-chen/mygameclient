//
//  InAppPurchase.h
//  doudizhuhero
//
//  Created by 劳琪峰 on 16/7/6.
//  Copyright © 2016年 htgames. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface StorePurchase : NSObject
-(id)init;
-(void)doPruchase:(NSString *)productID callback:(void (^)(int code, NSString *receiptData))cb;
@end
