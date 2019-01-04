//
//  WXApiManager.m
//  SDKSample
//
//  Created by Jeason on 16/07/2015.
//
//

#import "WXApiManager.h"

@interface WXApiManager()
@property NSString* currentState;
@end

@implementation WXApiManager

static WXApiManager *instance;

+(instancetype)getInstance {
	@synchronized (self) {
		if(instance == nil){
			instance = [[WXApiManager alloc] init];
		}
	}
	return instance;
}

- (instancetype)init{
	if(self = [super init]){
		
	}
	
	return self;
}

- (void)setup:(NSString *)appid{
	[WXApi registerApp:appid];
}

- (void)doAuth:(UIViewController *)vc
	withCallback:(void(^)(SendAuthResp *authResp))callback
		 withState:(NSString*)state{
	_callback = callback;
	_currentState = state;
	
	SendAuthReq* req = [[SendAuthReq new] init];
	
	req.scope = @"snsapi_userinfo";
	req.state = state;
	
	[WXApi sendAuthReq:req viewController:vc delegate:self];
}

- (void)onManagerDidRecvAuthResponse:(SendAuthResp*)authResp{
	_callback(authResp);
}

#pragma mark - WXApiDelegate
- (void)onResp:(BaseResp *)resp {
	if ([resp isKindOfClass:[SendMessageToWXResp class]]) {
        SendMessageToWXResp *shareResp = (SendMessageToWXResp*)resp;
        switch (shareResp.errCode) {
            case WXSuccess:
                NSLog(@"wechat 分享成功");
                if (_shareCallback != nil) {
                    _shareCallback(3);
                }
                break;
            default:
                NSLog(@"wechat 分享失败 或 取消，retcode=%d", shareResp.errCode);
                if (_shareCallback != nil) {
                    _shareCallback(10);
                }
                break;
        }
	} else if ([resp isKindOfClass:[SendAuthResp class]]) {
		SendAuthResp *authResp = (SendAuthResp *)resp;
		[self onManagerDidRecvAuthResponse:authResp];
	} else if ([resp isKindOfClass:[AddCardToWXCardPackageResp class]]) {
		
    } else if ([resp isKindOfClass:[PayResp class]]) {
        PayResp *response = (PayResp*)resp;
        switch(response.errCode){
            case WXSuccess:
                //服务器端查询支付通知或查询API返回的结果再提示成功
                NSLog(@"wechat 支付成功");
                if (_payCallback != nil) {
                    _payCallback(0);
                }
                break;
            case WXErrCodeUserCancel:
                NSLog(@"wechat 支付取消");
                if (_payCallback != nil) {
                    _payCallback(1);
                }
                break;
            default:
                NSLog(@"支付失败，retcode=%d", response.errCode);
                if (_payCallback != nil) {
                    _payCallback(response.errCode);
                }
                break;
        }
    }
}

- (void)onReq:(BaseReq *)req {
	if ([req isKindOfClass:[GetMessageFromWXReq class]]) {
		
	} else if ([req isKindOfClass:[ShowMessageFromWXReq class]]) {
		
	} else if ([req isKindOfClass:[LaunchFromWXReq class]]) {
		
	}
}

- (void)doPay:(NSDictionary*)payInfo withCallback:(void(^)(int code))callback {
    _payCallback = callback;
    
    PayReq *request = [[PayReq alloc] init];
    request.partnerId = payInfo[@"partnerid"];
    request.prepayId = payInfo[@"prepayid"];
    request.package = payInfo[@"package"];
    request.nonceStr = payInfo[@"noncestr"];
    request.timeStamp = (UInt32)[payInfo[@"timestamp"] intValue];
    request.sign = payInfo[@"sign"];
    [WXApi sendReq: request];
}

- (void)doShare:(NSDictionary *)shareInfo withCallback:(void (^)(int))callback {
    _shareCallback = callback;
    
    NSString *type = shareInfo[@"type"];
    NSDictionary *params = shareInfo[@"params"];
    
    NSString *urlString = params[@"url"];
    if ([urlString isEqualToString:@"img"]) {
        [self shareImage:shareInfo];
    } else {
        [self shareUrl:shareInfo];
    }
    
}

- (void)shareUrl:(NSDictionary *)shareInfo {
    NSString *type = shareInfo[@"type"];
    NSDictionary *params = shareInfo[@"params"];
    
    NSString *urlString = params[@"url"];
    NSString *title = params[@"title"];
    NSString *description = params[@"description"];
    NSString *tagName = @"WECHAT_TAG_JUMP_SHOWRANK";
    
    WXWebpageObject *ext = [WXWebpageObject object];
    ext.webpageUrl = urlString;
    
    UIImage *thumbImage = [UIImage imageNamed:@"ShareIcon.png"];
    WXMediaMessage *message = [WXMediaMessage message];
    message.title = title;
    message.description = description;
    message.mediaObject = ext;
    message.messageExt = nil;
    message.messageAction = nil;
    message.mediaTagName = tagName;
    [message setThumbImage:thumbImage];
    
    SendMessageToWXReq *req = [[SendMessageToWXReq alloc] init];
    req.bText = NO;
    req.message = message;
    if([type isEqualToString:@"wx_session"]){
        req.scene = WXSceneSession;
    }else if([type isEqualToString:@"wx_timeline"]){
        req.scene = WXSceneTimeline;
    }
    
    [WXApi sendReq:req];
}

- (void)shareImage:(NSDictionary *)shareInfo {
    NSString *type = shareInfo[@"type"];
    NSDictionary *params = shareInfo[@"params"];
    
    NSString *title = params[@"title"];
    
    WXImageObject *ext = [WXImageObject object];
    ext.imageData = [NSData dataWithContentsOfURL:[NSURL URLWithString:title]];
    
    UIImage* thumbImage = [UIImage imageWithData: ext.imageData scale:0.2];
    
    WXMediaMessage *message = [WXMediaMessage message];
    message.mediaObject = ext;
    [message setThumbImage:thumbImage];
    
    SendMessageToWXReq *req = [[SendMessageToWXReq alloc] init];
    req.bText = NO;
    req.message = message;
    if([type isEqualToString:@"wx_session"]){
        req.scene = WXSceneSession;
    }else if([type isEqualToString:@"wx_timeline"]){
        req.scene = WXSceneTimeline;
    }
    
    [WXApi sendReq:req];
}

@end
