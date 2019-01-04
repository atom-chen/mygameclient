//
//  KeyChainStore.h
//  QiPaiQuan
//
//  Created by ios on 16/6/22.
//  Copyright © 2016年 htgames. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface KeyChainStore : NSObject
+ (void)save:(NSString *)service data:(id)data;
+ (id)load:(NSString *)service;
+ (void)deleteKeyData:(NSString *)service;
@end
