#import "HotUpdate.h"
#import "SSZipArchive.h"
#import "ViewController.h"
#import "AsynDownloadTask.h"
#import "MBProgressHUD.h"
#import <AFNetworking.h>
#import "Utils.h"

MBProgressHUD *hud;
NSString *publishZipName;
AFHTTPSessionManager *manager;
NSDictionary *netVersion;


@property (nonatomic) UIProgressView* progressBar;
@property (nonatomic) ViewController* viewController;

@end

@implementation HotUpdate

- (instancetype)initWithGameId:(NSString *)gameId
                ViewController:(ViewController *)controller
{
    if (self = [super init])
    {
        _gameId = gameId;
        
        _jsonUrl = @"http://www.yourhost.com/egret.json";
        _zipPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)
                    objectAtIndex:0];
        _gamePath = [_zipPath stringByAppendingFormat:@"/%@/game", gameId];
        
        _viewController = controller;
    }
    return self;
}

- (void)doLoadGame
{
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        if ([self getGameJson])
        {
            dispatch_async(dispatch_get_main_queue(),^{
                [self downloadZip:^(BOOL isSuccess){
                    if(isSuccess){
                        // 下载完成，则开始解压缩更新文件，完成更新
                        [self unzip];
                    }
                    else{
                        // 下载失败
                        [self downLoadUpdateFailed];
                    }
                }];
            });
        }
        else
        {
            [self runGame];
        }
    });
}

- (void)runGame
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [_viewController runGameWithUpdateUrl:_updateUrl];
    });
}
- (void)checkVersion:(NSString*)publishZip
            callback:(void(^)(int result, NSString *codeUrl, NSString *resourceUrl))cb{
    publishZipName = publishZip;
    
    //显示更新检查进度
    hud = [MBProgressHUD showHUDAddedTo:_viewController.view animated:YES];
    hud.mode = MBProgressHUDModeIndeterminate;
    hud.labelText = NSLocalizedString(@"checking", nil);
    
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    NSString *bundleIdentifier = infoDictionary[@"CFBundleIdentifier"];
    NSString *checkVersionUrl = infoDictionary[@"CheckVersionUrl"];
    [manager GET:checkVersionUrl parameters:@{@"id": bundleIdentifier, @"platform": @"iOS", @"channel": @"2"} progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
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
                    [_viewController presentViewController:alertController animated:YES completion:nil];
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
}
- (BOOL)getGameJson
{
    
    
    // 比对本地配置的更新地址和此次获取的更新地址，如果变更则需要更新
    BOOL needUpdate = NO;
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    NSString* codeUrlSetting = [defaults stringForKey:@"code_url"];
    if (_loaderUrl && ![_loaderUrl isEqualToString:codeUrlSetting])
    {
        needUpdate = YES;
    }
    NSString* updateUrlSetting = [defaults stringForKey:@"update_url"];
    if (_updateUrl && ![_updateUrl isEqualToString:updateUrlSetting])
    {
        [defaults setObject:_updateUrl forKey:@"update_url"];
    }
    
    return needUpdate;
}

- (void)downloadZip:(void(^)(BOOL isSuccess))completionHandler
{
    @try {
        _zipFilePath = [_zipPath stringByAppendingPathComponent:@"temp.zip"];
        AsynDownloadTask* connection = [[AsynDownloadTask alloc] initWithDestPath:_zipFilePath completionHandler:completionHandler progressHandler:^(float progress) {
            dispatch_async(dispatch_get_main_queue(),^{
                //在主进程更新UI信息,下载进度代表了进度条前50%的流程
                [self.progressBar setProgress:0.5*progress];
            });
        }];
        NSURL *url = [NSURL URLWithString:_loaderUrl];
        NSURLRequest *theRequest = [NSURLRequest requestWithURL:url cachePolicy:NSURLRequestReloadIgnoringLocalCacheData timeoutInterval:60];
        [connection startRequest:theRequest];
    }
    @catch(NSException *exception) {
        NSLog(@"%@", exception.reason);
    }
}

- (void)unzip
{
    [SSZipArchive unzipFileAtPath:_zipFilePath toDestination:_gamePath progressHandler:^(NSString * _Nonnull entry, unz_file_info zipInfo, long entryNumber, long total) {
        dispatch_async(dispatch_get_main_queue(),^{
            //在主进程更新UI信息,开始解压缩则意味下载完成，所以进度从50%开始，如果需要更准确的显示下载进度，可使用NSConnection来进行下载
            [self.progressBar setProgress:0.5+0.5*entryNumber/total];
        });
    } completionHandler:^(NSString * _Nonnull path, BOOL succeeded, NSError * _Nonnull error) {
        //成功更新文件，更新本地的版本配置
        if(succeeded){
            NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
            [defaults setObject:_loaderUrl forKey:@"code_url"];
            [self runGame];
        }
    }];
}

- (void)downLoadUpdateFailed
{
    NSLog(@"更新失败");
}

@end
