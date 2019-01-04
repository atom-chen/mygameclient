//
//  GameInfo.m
//  doudizhuhero
//
//  Created by 劳琪峰 on 16/7/6.
//  Copyright © 2016年 htgames. All rights reserved.
//

#import "GameInfo.h"

static GameInfo *instance;
@implementation GameInfo
+(GameInfo *)getInstance{
	if(instance == nil){
		instance = [GameInfo alloc];
	}
	return instance;
}

-(void)update:(NSDictionary *)data{
	id value = data[@"uid"];
	if([value isKindOfClass:[NSNumber class]]){
		self.uid = [value stringValue];
	}else{
		self.uid = value;
	}
    self.serverType = data[@"serverType"];
    self.token = data[@"token"];
}
@end
