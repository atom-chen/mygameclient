//
//  AlienUnityBridge.m
//  Unity-iPhone
//
//  Created by 劳琪峰 on 2016/12/23.
//
//

#import "AlienUnityBridge.h"
#import "Utils.h"

@implementation AlienUnityBridge
const char *gameObject = "AlienUnityBridge";

void _GetUUID(){
	NSString *uuid = [Utils getUUIDWithMD5];
	UnitySendMessage(gameObject, "OnGetUUID", [uuid UTF8String]);
}
@end

