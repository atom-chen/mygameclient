//
//  AlienTextField.h
//  herodoudizhu
//
//  Created by 劳琪峰 on 2017/1/10.
//  Copyright © 2017年 htgames. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface AlienTextField : UITextField <UITextFieldDelegate>
- (instancetype)initWithFrame:(CGRect)frame;
- (instancetype)initWithCoder:(NSCoder *)aDecoder;
@property (nonatomic) int maxLimit;
@end
