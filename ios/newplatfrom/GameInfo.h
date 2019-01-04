//
//  GameInfo.h
//  doudizhuhero
//
//  Created by 劳琪峰 on 16/7/6.
//  Copyright © 2016年 htgames. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface GameInfo : NSObject
+(GameInfo *)getInstance;
-(void)update:(NSDictionary *)data;

@property(nonatomic)NSString* uid;
@property(nonatomic)NSString* serverType;
@property(nonatomic)NSString* token;
@end
