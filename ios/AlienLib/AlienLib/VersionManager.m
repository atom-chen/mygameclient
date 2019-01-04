//
//  LoadingView.m
//  HelloEgret
//
//  Created by wei huang on 11/26/15.
//  Copyright © 2015 egret. All rights reserved.
//

#import "VersionManager.h"
#import <AFNetworking.h>
#import "SSZipArchive.h"
#import "Utils.h"
#import "AsynDownloadTask.h"

#import "MBProgressHUD.h"

@implementation VersionManager

AFHTTPSessionManager *manager;
UIViewController *viewController;
MBProgressHUD *hud;
NSDictionary *netVersion;
NSString * resourceUrl;
void (^callback)(int result, NSString *codeUrl, NSString *resourceUrl);
NSString *publishZipName;

- (instancetype)initWithViewController:(UIViewController *)vc {
	if (self = [super init]) {
		viewController = vc;
		
		NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
		manager = [[AFHTTPSessionManager alloc] initWithSessionConfiguration:configuration];
	}
	return self;
}

- (void)checkVersion:(NSString*)publishZip
						callback:(void(^)(int result, NSString *codeUrl, NSString *resourceUrl))cb{
	callback = cb;
	publishZipName = publishZip;
	
	//显示更新检查进度
	hud = [MBProgressHUD showHUDAddedTo:viewController.view animated:YES];
	hud.mode = MBProgressHUDModeIndeterminate;
	hud.labelText = NSLocalizedString(@"checking", nil);
	
	NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
	NSString *bundleIdentifier = infoDictionary[@"CFBundleIdentifier"];
	NSString *checkVersionUrl = infoDictionary[@"CheckVersionUrl"];
    NSString *channelId = infoDictionary[@"InstallChannel"];
    NSLog(@"bid:%@ cvu:%@", bundleIdentifier, checkVersionUrl);
	[manager GET:checkVersionUrl parameters:@{@"id": bundleIdentifier, @"platform": @"iOS", @"channel": channelId} progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
		int code = [responseObject[@"code"] intValue];
		switch(code){
			case 0:{
				NSString *currentVersion = infoDictionary[@"CFBundleShortVersionString"];
				int currentBuild = [infoDictionary[@"CFBundleVersion"] intValue];
				
				NSDictionary *data = responseObject[@"data"];
				NSString *latestVersion = data[@"version"];
				int latestBuild = [data[@"build"] intValue];
				
				NSArray *v1 = [currentVersion componentsSeparatedByString:@"."];
				NSArray *v2 = [latestVersion componentsSeparatedByString:@"."];
				
				bool needUpdate = false;
				for( int i=0; i<v1.count; i++){
					int num1 = [[v1 objectAtIndex:i] intValue];
					int num2 = [[v2 objectAtIndex:i] intValue];
					if(i < v2.count){
						if(num2 > num1){
							needUpdate = true;
							break;
						}
					}
				}
				if(!needUpdate && [currentVersion isEqualToString:latestVersion] && latestBuild > currentBuild){
					needUpdate = true;
				}
				
				if(needUpdate){
					[hud hide:YES];
					UIAlertController *alertController = [UIAlertController alertControllerWithTitle:NSLocalizedString(@"need update", nil) message:@"发现新版本可以更新，继续使用老版本可能无法登录游戏。" preferredStyle:UIAlertControllerStyleAlert];
					UIAlertAction *action = [UIAlertAction actionWithTitle:NSLocalizedString(@"version_update", nil) style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
						NSString * url = data[@"url"];
						[[UIApplication sharedApplication] openURL:[NSURL URLWithString:url]];
						[self checkUpgrade];
					}];
					[alertController addAction:action];
					action = [UIAlertAction actionWithTitle:NSLocalizedString(@"version_cancel", nil) style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
						[self checkUpgrade];
					}];
					[alertController addAction:action];
					[viewController presentViewController:alertController animated:YES completion:nil];
				}else{
					[self checkUpgrade];
				}
				
				break;
			}
			default:
				[self checkUpgrade];
				break;
		}
		
	} failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
		[self checkUpgrade];
	}];
}

- (void) checkUpgrade{
	NSUserDefaults *storage = [NSUserDefaults standardUserDefaults];
	if(storage){
		resourceUrl = [storage valueForKey:@"game_code_url"];
	}
	
	NSString *bundleIdentifier = [Utils getInfo:@"CFBundleIdentifier"];
	NSString *upgradeUrl = [Utils getInfo:@"UpgradeUrl"];
	NSDictionary *parameters = @{@"id": bundleIdentifier, @"platform": @"iOS", @"check": @"1"};
	[manager GET:upgradeUrl parameters:parameters progress:^(NSProgress * _Nonnull downloadProgress) {
		NSLog(@"%@", downloadProgress);
	} success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
		NSLog(@"%@", responseObject);
		int code = [responseObject[@"code"] intValue];
		//int code = 3;
		switch(code){
			case 0:
			{
				netVersion = responseObject[@"data"];
				NSString *netCodeUrl = netVersion[@"game_code_url"];
				
                NSRange range = [netCodeUrl rangeOfString:@"game_code"];
                NSString *str = @"";
                if (range.location != NSNotFound) {
                    str = [netCodeUrl substringToIndex:range.location];
                    resourceUrl = str;
                }
                
				NSDictionary *localVersion = [storage valueForKey:@"version"];
				if(localVersion){	//如果本地存有热更包
					NSString *localCodeUrl = localVersion[@"game_code_url"];
					
					if([self compareVersion:localCodeUrl url2:netCodeUrl]){
						NSLog(@"无需更新");
						callback(0, nil, resourceUrl);	//无需更新
					}else{
						NSLog(@"需要更新");
						[self upgrade:netCodeUrl];
					}
				}else{
					if([self compareVersion:publishZipName url2:netCodeUrl]){
						NSLog(@"无需更新");
						callback(3, nil, resourceUrl);	//无需更新
					}else{
						NSLog(@"需要更新");
						[self upgrade:netCodeUrl];
					}
				}
			}
				break;
			default:
				hud.labelText = NSLocalizedString(@"nothing", nil);//responseObject[@"message"];
				[hud hide:YES];
				callback(2, nil, resourceUrl);	//参数错误
				break;
		}
	} failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
		NSLog(@"%@", error);
		[hud hide:YES];
		callback(1, nil, resourceUrl);	//网络错误
	}];
}

-(NSString *)getFileName:(NSString*)path{
	NSError *error = nil;
	NSRegularExpression * reg = [NSRegularExpression regularExpressionWithPattern:@"game_code_.*?zip" options:NSRegularExpressionCaseInsensitive error:&error];
	NSTextCheckingResult *result = [reg firstMatchInString:path options:0 range:NSMakeRange(0, [path length])];
	
	return [path substringWithRange:result.range];
}

- (BOOL)compareVersion:(NSString*)url1 url2:(NSString*)url2{
	NSString *file1 = [self getFileName:url1];
	NSString *file2 = [self getFileName:url2];
	
	return [file1 isEqualToString:file2];
}

- (void) upgrade:(NSString *)codeUrl{
	NSLog(@"开始下载热更包");
	hud.mode = MBProgressHUDModeDeterminate;
	hud.labelText = NSLocalizedString(@"upgrading", nil);
	
	NSArray *paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
	NSString *path = [paths  objectAtIndex:0];
	NSString *destPath = [path stringByAppendingPathComponent:@"temp.zip"];
	destPath = [destPath stringByStandardizingPath];
    
    NSFileManager *filemanager = [NSFileManager defaultManager];
    // 文件是否存在
    //bool isExists = [filemanager fileExistsAtPath:destPath];
    // 删除文件
    BOOL isDele = [filemanager removeItemAtPath:destPath error:nil];
    if (isDele) {
        NSLog(@"删除成功");
    } else {
        NSLog(@"删除失败");
    }
    [self downloadzip:codeUrl destPath:destPath completion:^(BOOL isSuccess)
     {
         if(isSuccess){
             // 下载完成，则开始解压缩更新文件，完成更新
             [self unzip:destPath neturl:codeUrl];
         }
         else{
             // 下载失败
             callback(4, nil,nil);
             //[self downLoadUpdateFailed];
         }
     }];
    return;
	NSURLRequest* request = [NSURLRequest requestWithURL:[NSURL URLWithString:codeUrl]];
	NSURLSessionDownloadTask *downloadTask = [manager downloadTaskWithRequest:request progress:^(NSProgress * _Nonnull downloadProgress) {
		hud.progress = downloadProgress.completedUnitCount / downloadProgress.totalUnitCount * 0.8;
	} destination:^NSURL * _Nonnull(NSURL * _Nonnull targetPath, NSURLResponse * _Nonnull response) {
		return [NSURL fileURLWithPath:destPath];
	} completionHandler:^(NSURLResponse * _Nonnull response, NSURL * _Nullable filePath, NSError * _Nullable error) {
		NSLog(@"热更包下载完毕");
		[self unzipPackage:destPath];
	}];
	[downloadTask resume];
}
-(void) downloadzip:(NSString *)neturl destPath:(NSString *)destPath completion:(void(^)(BOOL isSuccess))completionHandler
{
    @try {
        AsynDownloadTask* connection = [[AsynDownloadTask alloc] initWithDestPath:destPath completionHandler:completionHandler progressHandler:^(float progress) {
            dispatch_async(dispatch_get_main_queue(),^{
                hud.progress = 0.8 + 0.2 * progress;
                //在主进程更新UI信息,下载进度代表了进度条前50%的流程
                //[self.progressBar setProgress:0.5*progress];
            });
        }];
        NSURL *url = [NSURL URLWithString:neturl];
        NSURLRequest *theRequest = [NSURLRequest requestWithURL:url cachePolicy:NSURLRequestReloadIgnoringLocalCacheData timeoutInterval:60];
        [connection startRequest:theRequest];
    }
    @catch(NSException *exception) {
        NSLog(@"%@", exception.reason);
    }
}
-(void) unzipPackage:(NSString*) dataPath{
	//NSString *resPath = [[NSBundle mainBundle] resourcePath];
	//NSString *gameCodePath = [resPath stringByAppendingString:@"/egret-game"];
	NSString* gameCodePath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
	gameCodePath = [gameCodePath stringByAppendingString:@"/local/game"];
	NSLog(@"开始解压热更包到：%@", gameCodePath);
	[SSZipArchive unzipFileAtPath:dataPath toDestination:gameCodePath progressHandler:^(NSString * _Nonnull entry, unz_file_info zipInfo, long entryNumber, long total) {
		dispatch_async(dispatch_get_main_queue(),^{
			hud.progress = 0.8 + 0.2 * entryNumber / total;
		});
	} completionHandler:^(NSString * _Nonnull path, BOOL succeeded, NSError * _Nonnull error) {
		if(succeeded){
			NSLog(@"热更包解压完毕");
			dispatch_async(dispatch_get_main_queue(),^{
				hud.labelText = NSLocalizedString(@"upgrade success", nil);
				[hud hide:YES afterDelay:1];
			});
			
			NSUserDefaults *storage = [NSUserDefaults standardUserDefaults];
			[storage setValue:netVersion forKey:@"version"];
			[storage synchronize];
			
			callback(0, nil, netVersion[@"resource_url"]);
		}else{
			callback(4, nil, resourceUrl);
		}
	}];
}

- (void)unzip:(NSString *)zipFilePath neturl:(NSString *)neturl
{
    NSString* gameCodePath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    gameCodePath = [gameCodePath stringByAppendingString:@"/local/game"];
    [SSZipArchive unzipFileAtPath:zipFilePath toDestination:gameCodePath progressHandler:^(NSString * _Nonnull entry, unz_file_info zipInfo, long entryNumber, long total) {
        dispatch_async(dispatch_get_main_queue(),^{
            //在主进程更新UI信息,开始解压缩则意味下载完成，所以进度从50%开始，如果需要更准确的显示下载进度，可使用NSConnection来进行下载
            //[self.progressBar setProgress:0.5+0.5*entryNumber/total];
        });
    } completionHandler:^(NSString * _Nonnull path, BOOL succeeded, NSError * _Nonnull error) {
        //成功更新文件，更新本地的版本配置
        if(succeeded){
            NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
            [defaults setObject:netVersion forKey:@"version"];
            callback(0, nil, resourceUrl);
            //[self runGame];
        } else {
            NSLog(@"资源解压失败!请查看原因!file:%@ codePath:%@", zipFilePath, gameCodePath);
            // 暂时什么都不做。游戏直接卡死，更容易发现问题
            //callback(4, nil, resourceUrl);
        }
    }];
}

@end
