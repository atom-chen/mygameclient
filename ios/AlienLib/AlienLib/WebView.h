//
//  WebView.h
//  doudizhu
//
//  Created by 劳琪峰 on 16/5/25.
//  Copyright © 2016年 egret. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface WebView : NSObject <UIWebViewDelegate>

- (instancetype)initWithViewConfig;
- (void)addTo:(UIView *) view;
- (void)remove;
- (void)loadByUrl:(NSString *)url;

@end
