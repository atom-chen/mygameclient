//
//  InfoCollection.m
//  doudizhuhero
//
//  Created by 劳琪峰 on 16/6/12.
//  Copyright © 2016年 egret. All rights reserved.
//

#import "InfoCollection.h"
#import <AFNetworking.h>
#import "Utils.h"

#define INSTALL_URL @"http://qwadmin.htgames.cn/index.php/Qwadmin/Free/install.html"
#define CHANNEL @"2"

static InfoCollection *instance = nil;
@implementation InfoCollection

AFHTTPSessionManager *manager;

-(instancetype)init{
	if (self = [super init]) {
		NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
		manager = [[AFHTTPSessionManager manager] initWithSessionConfiguration:configuration];
		
		[self checkInstall];
		
	}
	return self;
}

-(void)checkInstall{
	NSUserDefaults *appData =[NSUserDefaults standardUserDefaults];
	long launchCount = [appData integerForKey:@"launch_count"];
	launchCount++;
	
	if(launchCount == 1){
		[manager POST:INSTALL_URL parameters:@{@"channel": CHANNEL, @"device_id": [Utils getUUIDWithMD5]} progress:nil success:nil failure:nil];
	};
	
	[appData setInteger:launchCount forKey:@"launch_count"];
}

+(InfoCollection*)getInstance{
	@synchronized (self)
	{
		if (instance == nil)
		{
			instance = [[self alloc] init];
		}
	}
	return instance;
}

@end
