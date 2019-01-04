//
//  Utils.m
//  doudizhuhero
//
//  Created by 劳琪峰 on 16/6/12.
//  Copyright © 2016年 egret. All rights reserved.
//

#import "Utils.h"
#import <CommonCrypto/CommonDigest.h>
#import "KeyChainStore.h"
#import <ifaddrs.h>
#import <arpa/inet.h>
#import <sys/utsname.h>
#import "ViewController.h"

static UIViewController *viewController;
static NSString *uuid;
@implementation Utils
+ (NSString *)getIpAddress{
	NSString *address = @"127.0.0.1";
	struct ifaddrs *interfaces = NULL;
	struct ifaddrs *temp_addr = NULL;
	int success = 0;
	// retrieve the current interfaces - returns 0 on success
	success = getifaddrs(&interfaces);
	if (success == 0)
	{
		// Loop through linked list of interfaces
		temp_addr = interfaces;
		while(temp_addr != NULL)
		{
			if(temp_addr->ifa_addr->sa_family == AF_INET)
			{
				// Check if interface is en0 which is the wifi connection on the iPhone
				if([[NSString stringWithUTF8String:temp_addr->ifa_name] isEqualToString:@"en0"])
				{
					// Get NSString from C String
					address = [NSString stringWithUTF8String:inet_ntoa(((struct sockaddr_in *)temp_addr->ifa_addr)->sin_addr)];
				}
			}
			temp_addr = temp_addr->ifa_next;
		}
	}
	// Free memory
	freeifaddrs(interfaces);
    return address;
}

+ (NSString *)getIPhoneType{
	struct utsname systemInfo;
	
	uname(&systemInfo);
	
	NSString *platform = [NSString stringWithCString:systemInfo.machine encoding:NSASCIIStringEncoding];
	
	if ([platform isEqualToString:@"iPhone1,1"]) return @"iPhone 2G";
	
	if ([platform isEqualToString:@"iPhone1,2"]) return @"iPhone 3G";
	
	if ([platform isEqualToString:@"iPhone2,1"]) return @"iPhone 3GS";
	
	if ([platform isEqualToString:@"iPhone3,1"]) return @"iPhone 4";
	
	if ([platform isEqualToString:@"iPhone3,2"]) return @"iPhone 4";
	
	if ([platform isEqualToString:@"iPhone3,3"]) return @"iPhone 4";
	
	if ([platform isEqualToString:@"iPhone4,1"]) return @"iPhone 4S";
	
	if ([platform isEqualToString:@"iPhone5,1"]) return @"iPhone 5";
	
	if ([platform isEqualToString:@"iPhone5,2"]) return @"iPhone 5";
	
	if ([platform isEqualToString:@"iPhone5,3"]) return @"iPhone 5c";
	
	if ([platform isEqualToString:@"iPhone5,4"]) return @"iPhone 5c";
	
	if ([platform isEqualToString:@"iPhone6,1"]) return @"iPhone 5s";
	
	if ([platform isEqualToString:@"iPhone6,2"]) return @"iPhone 5s";
	
	if ([platform isEqualToString:@"iPhone7,1"]) return @"iPhone 6 Plus";
	
	if ([platform isEqualToString:@"iPhone7,2"]) return @"iPhone 6";
	
	if ([platform isEqualToString:@"iPhone8,1"]) return @"iPhone 6s";
	
	if ([platform isEqualToString:@"iPhone8,2"]) return @"iPhone 6s Plus";
	
	if ([platform isEqualToString:@"iPhone8,4"]) return @"iPhone SE";
	
	if ([platform isEqualToString:@"iPhone9,1"]) return @"iPhone 7";
	
	if ([platform isEqualToString:@"iPhone9,2"]) return @"iPhone 7 Plus";
	
	if ([platform isEqualToString:@"iPod1,1"])   return @"iPod Touch 1G";
	
	if ([platform isEqualToString:@"iPod2,1"])   return @"iPod Touch 2G";
	
	if ([platform isEqualToString:@"iPod3,1"])   return @"iPod Touch 3G";
	
	if ([platform isEqualToString:@"iPod4,1"])   return @"iPod Touch 4G";
	
	if ([platform isEqualToString:@"iPod5,1"])   return @"iPod Touch 5G";
	
	if ([platform isEqualToString:@"iPad1,1"])   return @"iPad 1G";
	
	if ([platform isEqualToString:@"iPad2,1"])   return @"iPad 2";
	
	if ([platform isEqualToString:@"iPad2,2"])   return @"iPad 2";
	
	if ([platform isEqualToString:@"iPad2,3"])   return @"iPad 2";
	
	if ([platform isEqualToString:@"iPad2,4"])   return @"iPad 2";
	
	if ([platform isEqualToString:@"iPad2,5"])   return @"iPad Mini 1G";
	
	if ([platform isEqualToString:@"iPad2,6"])   return @"iPad Mini 1G";
	
	if ([platform isEqualToString:@"iPad2,7"])   return @"iPad Mini 1G";
	
	if ([platform isEqualToString:@"iPad3,1"])   return @"iPad 3";
	
	if ([platform isEqualToString:@"iPad3,2"])   return @"iPad 3";
	
	if ([platform isEqualToString:@"iPad3,3"])   return @"iPad 3";
	
	if ([platform isEqualToString:@"iPad3,4"])   return @"iPad 4";
	
	if ([platform isEqualToString:@"iPad3,5"])   return @"iPad 4";
	
	if ([platform isEqualToString:@"iPad3,6"])   return @"iPad 4";
	
	if ([platform isEqualToString:@"iPad4,1"])   return @"iPad Air";
	
	if ([platform isEqualToString:@"iPad4,2"])   return @"iPad Air";
	
	if ([platform isEqualToString:@"iPad4,3"])   return @"iPad Air";
	
	if ([platform isEqualToString:@"iPad4,4"])   return @"iPad Mini 2G";
	
	if ([platform isEqualToString:@"iPad4,5"])   return @"iPad Mini 2G";
	
	if ([platform isEqualToString:@"iPad4,6"])   return @"iPad Mini 2G";
	
	if ([platform isEqualToString:@"i386"])      return @"iPhone Simulator";
	
	if ([platform isEqualToString:@"x86_64"])    return @"iPhone Simulator";
	
	return platform;
}

+(NSString *)getUUID{
	if(uuid == nil){
		uuid = (NSString *)[KeyChainStore load:@"uuid"];
		
		if ([uuid isEqualToString:@""] || !uuid)
		{
			uuid = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
			
			[KeyChainStore save:@"uuid" data:uuid];
		}
	}
	
	return uuid;
}

+(NSString *)getUUIDWithMD5{
	return [self md5:[self getUUID]];
}

+(NSString *)md5:(NSString *)source{
	const char *cStr = [source UTF8String];
	unsigned char digest[CC_MD5_DIGEST_LENGTH];
	CC_MD5( cStr, (int)strlen(cStr), digest );
	NSMutableString *result = [NSMutableString stringWithCapacity:CC_MD5_DIGEST_LENGTH * 2];
	for(int i = 0; i < CC_MD5_DIGEST_LENGTH; i++)
		[result appendFormat:@"%02x", digest[i]];
	
	return result;
}

+ (NSString*)getInfo:(NSString*)key{
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    return infoDictionary[key];
}
+ (void)alert:(UIViewController*)parent
		withTitle:(NSString*)title
	withMessage:(NSString*)message
{
	UIAlertController *alertController = [UIAlertController alertControllerWithTitle:title message:message preferredStyle:UIAlertControllerStyleAlert];
	UIAlertAction *action = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:nil];
	[alertController addAction:action];
	
	[parent presentViewController:alertController animated:YES completion:nil];
}

+ (void)alertApiResult:(UIViewController*)parent
		withTitle:(NSString*)title
	withCode:(int)code
{
	NSString* key = [NSString stringWithFormat:@"api_result_%d", code];
	NSString* message = NSLocalizedString(key, nil);
	[self alert:parent withTitle:title withMessage:message];
}

// for debug alert, not called now
+ (void)setVc:(UIViewController *)vc {
    viewController = vc;
}

// for debug alert, not called now
+ (UIViewController *)getVc {
    return viewController;
}


@end
