#ifndef HotUpdate_h
#define HotUpdate_h

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@class ViewController;
@interface HotUpdate : NSObject

- (instancetype)initWithGameId:(NSString *)gameId
                ViewController:(ViewController*)controller;
- (void)doLoadGame;

@end

#endif /* HotUpdate_h */
