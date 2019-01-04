//
//  ViewController.m
//
//  Copyright (c) 2014-2015 egret. All rights reserved.
//

#import <sys/xattr.h>
#import "ViewController.h"
#import "VersionManager.h"
#import "NativeInterface.h"
#import "InfoCollection.h"
#import "EgretPublishData.h"

@interface ViewController ()

@property (nonatomic) BOOL landscape;
@property (nonatomic) NSMutableDictionary *options;

@end

@implementation ViewController

BOOL HOT_UPGRADE = YES;

BOOL created;
int loadMode;
dispatch_source_t heartBeatTimer;
VersionManager *versionManager;
NativeInterface * nativeInterface;

#pragma mark - LifeCycle

- (void)viewDidLoad {
	[super viewDidLoad];
	
	[InfoCollection getInstance];
	
	NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
	HOT_UPGRADE = [infoDictionary[@"UpgradeOn"]boolValue];
	
	created = false;
	
	// Do any additional setup after loading the view, typically from a nib.
	[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(enterBackground:) name:UIApplicationDidEnterBackgroundNotification object:nil];
	[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(enterForeground:) name:UIApplicationWillEnterForegroundNotification object:nil];
}

- (void)didReceiveMemoryWarning {
	[super didReceiveMemoryWarning];
	// Dispose of any resources that can be recreated.
}

- (void)viewWillAppear:(BOOL)animated {
	
}

- (void)viewDidAppear:(BOOL)animated {
	if(!created){
		[self checkVersion];
		created = true;
	}
}

- (void)enterBackground:(NSNotification *)notification {
	[self pauseEgretNative];
	[self callEgret:@"enterBackground"];
	[self startBackgroundTask];
}

- (void)enterForeground:(NSNotification *)notification {
	[self resumeEgretNative];
	[self callEgret:@"enterForeground"];
	[self stopBackgroundTask];
}

- (void)viewWillDisappear:(BOOL)animated {
	//[self destroyEgretNative];
}

- (void)viewDidDisappear:(BOOL)animated {
	
}

#pragma mark - Rotate

- (BOOL)shouldAutorotate {
	return YES;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
	return [self isLandscape] ? UIInterfaceOrientationMaskLandscape : UIInterfaceOrientationMaskPortrait;
}

- (void)checkVersion{
	_options = [NSMutableDictionary dictionaryWithCapacity:10];
	[self setLoaderUrl:0];
	
	if(HOT_UPGRADE){
		versionManager = [[VersionManager alloc]initWithViewController:self];
		[versionManager checkVersion:EGRET_PUBLISH_ZIP callback:^(int result, NSString *codeUrl, NSString *resourceUrl) {
			if(result == 0){
				_options[@OPTION_LOADER_URL] = @"";
				_options[@OPTION_UPDATE_URL] = resourceUrl;
			}
			[self createEgretNative];
		}];
	}else{	//直接开始游戏
		dispatch_async(dispatch_get_main_queue(),^{
			//[self createEgretNative];
            [self createEgretNative];
            //[self createEgretNative1];
		});
	}
}

#pragma mark - Egret Native

- (void)createEgretNative {
    [EgretRuntime createEgretRuntime];
    _egretRuntime = [EgretRuntime getInstance];
    [_egretRuntime initWithViewController:self];
    
    [self runGame];
}

- (void)pauseEgretNative {
	[_egretRuntime onPause];
}

- (void)resumeEgretNative {
	[_egretRuntime onResume];
	[self callEgret:@"active"];
}

- (void)callEgret:(NSString *)method{
	NSDictionary * retObj = @{@"method": method};
	NSError * error = nil;
	NSData * data = [NSJSONSerialization dataWithJSONObject:retObj options:kNilOptions error:&error];
	NSString *retMessage = [[NSString alloc]initWithData:data encoding:NSUTF8StringEncoding];
	[_egretRuntime callEgretInterface:@"nativeCall" value:retMessage];
}

- (void)destroyEgretNative {
	[_egretRuntime onDestroy];
	[EgretRuntime destroyEgretRuntime];
}

- (void)startBackgroundTask{
	NSTimeInterval period = 2.0; //设置时间间隔
	dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
	dispatch_source_t _timer = heartBeatTimer = dispatch_source_create(DISPATCH_SOURCE_TYPE_TIMER, 0, 0, queue);
	dispatch_source_set_timer(_timer, dispatch_walltime(NULL, 0), period * NSEC_PER_SEC, 0); //每秒执行
	dispatch_source_set_event_handler(_timer, ^{
		[self heartBeat];
		NSLog(@"%@", @"heartBeat");
	});
	dispatch_resume(_timer);
}

- (void)stopBackgroundTask{
	if(heartBeatTimer != nil){
		dispatch_cancel(heartBeatTimer);
	}
}

//心跳
- (void)heartBeat{
    NSLog(@"~~~~~~~~~~~~HEART_BEAT~~~~~~~~~~~");
	[self callEgret:@"HEART_BEAT"];
}

- (BOOL)addSkipBackupAttributeToItemAtPath:(NSString *) filePathString
{
	//ios version should be iOS 5.1 and later
	NSString *os5 = @"5.0.1";
	NSString *currSysVer = [[UIDevice currentDevice] systemVersion];
	if ([currSysVer compare:os5 options:NSNumericSearch] == NSOrderedSame) // 5.0.1
	{
		assert([[NSFileManager defaultManager] fileExistsAtPath: filePathString]);
		
		const char* filePath = [filePathString fileSystemRepresentation];
		
		const char* attrName = "com.apple.MobileBackup";
		u_int8_t attrValue = 1;
		
		int result = setxattr(filePath, attrName, &attrValue, sizeof(attrValue), 0, 0);
		return result == 0;
	}
	else if ([currSysVer compare:os5 options:NSNumericSearch] == NSOrderedDescending) //5.1 and above
	{
		NSURL* URL= [NSURL fileURLWithPath: filePathString];
		assert([[NSFileManager defaultManager] fileExistsAtPath: [URL path]]);
		
		NSError *error = nil;
		BOOL success = [URL setResourceValue: [NSNumber numberWithBool: YES]
																	forKey: NSURLIsExcludedFromBackupKey error: &error];
		if(!success){
			NSLog(@"Error excluding %@ from backup %@", [URL lastPathComponent], error);
		}
		return success;
	}
	else // lower 5.0
	{
		return false;
	}
}
- (void)runGameWithUpdateUrl:(NSString *)updateUrl {
    NSString *egretRoot = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    BOOL backupRet = [self addSkipBackupAttributeToItemAtPath: egretRoot];
    if(!backupRet )
    {
        egretRoot = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    }
    _options[@OPTION_EGRET_ROOT] = egretRoot;
    // 设置游戏的gameId，用于创建一个沙盒环境，该沙盒在应用的documents/egret/$gameId中，
    // 此时的documents/egret/local/
    _options[@OPTION_GAME_ID] = @"local";
    _options[@OPTION_LOADER_URL] = @"";
    _options[@OPTION_UPDATE_URL] = updateUrl;
    _options[@OPTION_PUBLISH_ZIP] = EGRET_PUBLISH_ZIP;
    
    // 设置加载进度条，请参考修改LoadingView即可，网络下载资源时打开
    //[EgretRuntime getInstance].egretRootView.progressViewDelegate = [[LoadingView alloc] initWithContainerFrame:self.view.frame];
    [[EgretRuntime getInstance] setOptions:_options];
    

    [[EgretRuntime getInstance] run];
}

- (void)runGame {
	NSString *egretRoot = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
	BOOL backupRet = [self addSkipBackupAttributeToItemAtPath: egretRoot];
	if(!backupRet )
	{
		egretRoot = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) objectAtIndex:0];
	}
    //egretRoot = [egretRoot stringByAppendingString:@"/local/game/"];
	_options[@OPTION_EGRET_ROOT] = egretRoot;
	// 设置游戏的gameId，用于创建一个沙盒环境，该沙盒在应用的documents/egret/$gameId中，
	// 此时的documents/egret/local/
	_options[@OPTION_GAME_ID] = @"local";
	_options[@OPTION_PUBLISH_ZIP] = EGRET_PUBLISH_ZIP;
    
    NSLog(@"%@", _options);
	[_egretRuntime setOptions:_options];
	nativeInterface = [[NativeInterface alloc]initWithViewController:self];
	[_egretRuntime run];
}
# pragma mark - Game Opitons

- (BOOL)isLandscape {
	// 横屏返回YES，竖屏返回NO
	return YES;
}

- (void)setLoaderUrl:(int)mode {
	loadMode = mode;
	
	switch (mode) {
		case 2:
			// 接入模式2：调试模式，直接使用本地游戏
			_options[@OPTION_LOADER_URL] = @"";
			_options[@OPTION_UPDATE_URL] = @"";
			break;
		case 1:
			// 接入模式2a: 发布模式，使用指定URL的zip
			_options[@OPTION_LOADER_URL] = @"http://www.yourhost.com/game_code.zip";
			_options[@OPTION_UPDATE_URL] = @"http://www.yourhost.com/update_url/";
			
			// 接入模式2b: 发布模式，使用指定的服务器脚本，返回的json参见项目中的egret.json
			// options[@OPTION_LOADER_URL] = @"http://www.yourhost.com/egret.json";
			break;
		default:
			// 接入模式0：发布模式，使用本地zip发布，推荐
			_options[@OPTION_LOADER_URL] = EGRET_PUBLISH_ZIP;
			break;
	}
}

@end
