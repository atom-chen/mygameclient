//
//  ViewController.h
//
//  Copyright (c) 2014-2015 egret. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "EgretRuntime.h"

@interface ViewController : UIViewController


@property EgretRuntime *egretRuntime;

- (void)runGameWithUpdateUrl:(NSString *)updateUrl;

@end

