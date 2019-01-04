//
//  AlienTextField.m
//  herodoudizhu
//
//  Created by 劳琪峰 on 2017/1/10.
//  Copyright © 2017年 htgames. All rights reserved.
//

#import "AlienTextField.h"

@implementation AlienTextField

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/
- (instancetype)initWithFrame:(CGRect)frame{
	if(self = [super initWithFrame:frame]){
		[self setup];
	}
	
	return self;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder{
	if(self = [super initWithCoder:aDecoder]){
		[self setup];
	}
	
	return self;
}

- (void)setup{
	//[self addTarget:self action:@selector(limitTextFieldLength:) forControlEvents:UIControlEventEditingChanged];
	self.delegate = self;
}

- (void)limitTextFieldLength:(id)sender{
	if (_maxLimit > 0 && self.text.length > _maxLimit) {
		self.text = [self.text substringToIndex: _maxLimit];
	}
}

- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string{
	NSString* newString = [self.text stringByReplacingCharactersInRange:range withString:string];
	if (_maxLimit > 0 && newString.length > _maxLimit) {
		self.text = [newString substringToIndex: _maxLimit];
		return NO;
	}else{
		return YES;
	}
}
@end
