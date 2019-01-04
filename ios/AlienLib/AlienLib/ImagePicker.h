//
//  ImagePicker.h
//  ddz
//
//  Created by 劳琪峰 on 16/2/15.
//  Copyright © 2016年 egret. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface ImagePicker : NSObject <UINavigationControllerDelegate, UIImagePickerControllerDelegate>


@property UIViewController *root;
-(instancetype)initWithRoot:(UIViewController *)root;
- (void)show:(NSDictionary *)options callback:(void(^)(NSMutableDictionary *response))cb;

@end
