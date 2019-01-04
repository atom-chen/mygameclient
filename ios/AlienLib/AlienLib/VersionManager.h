//
//  LoadingView.h
//  HelloEgret
//
//  Created by wei huang on 11/26/15.
//  Copyright © 2015 egret. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>

@interface VersionManager : NSObject

@property (nonatomic) UIProgressView *progressView;

- (instancetype)initWithViewController:(UIViewController *)viewController;

- (void)checkVersion:(NSString*)publishZip callback:(void(^)(int result, NSString *codeUrl, NSString *resourceUrl))callback;
- (void) checkUpgrade;

@end
