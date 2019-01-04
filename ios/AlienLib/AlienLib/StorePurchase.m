//
//  InAppPurchase.m
//  doudizhuhero
//
//  Created by 劳琪峰 on 16/7/6.
//  Copyright © 2016年 htgames. All rights reserved.
//

#import "StorePurchase.h"
#import <StoreKit/StoreKit.h>
#import <AFNetworking/AFNetworking.h>


@interface StorePurchase()<SKPaymentTransactionObserver,SKProductsRequestDelegate>
@property(nonatomic,strong)SKProductsRequest *request;
@property(nonatomic,copy)NSString *productID;
@property(nonatomic,copy)NSString *productIdentifier;

@end

@implementation StorePurchase
NSString *bundleIdentifier;
void (^callback)(int code, NSString *receiptData);

-(id)init{
	if (self = [super init]) {
		[[SKPaymentQueue defaultQueue] addTransactionObserver:self];
		
		NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
		bundleIdentifier = infoDictionary[@"CFBundleIdentifier"];
	}
	
	return self;
}

-(void)doPruchase:(NSString *)productID callback:(void (^)(int code, NSString *receiptData))cb{
	self.productID=productID;
	callback = cb;
	
	if([self canInAppPayment]){
		self.productIdentifier = [NSString stringWithFormat:@"%@_%@",bundleIdentifier,self.productID];
		[self requestProductData: self.productIdentifier];
	}else{
		//UIAlertView *alert = [[UIAlertView alloc]initWithTitle:nil message:NSLocalizedString(@"program_is_not_allowed_to_pay", nil) delegate:nil cancelButtonTitle:NSLocalizedString(@"OK", nil) otherButtonTitles:nil, nil];
		//[alert show];
		if(callback) callback(104, nil);
	}
}

//是否能支付
-(bool)canInAppPayment

{
	//    越狱的设备当装有Cydia会造成不安全支付
	//
	//    通过以下禁用iap支付功能
	//    if ([[NSFileManager defaultManager] fileExistsAtPath:@"/Applications/Cydia.app"]){
	//
	//        NSLog(@"Jailbreak detected");
	//
	//        return NO;
	//
	//    }
	
	if( [SKPaymentQueue canMakePayments] ){
		
		return true;
		
	}
	else{
		//NSLog(@"不允许程序内付费");
		return NO;
	}
}

//请求商品
- (void)requestProductData:(NSString *)type{
	NSLog(@"-------------请求对应的产品信息----------------");
	//[MBProgressHUD showMessage:nil];
	NSSet * set = [NSSet setWithArray:@[type]];
	
	self.request = [[SKProductsRequest alloc] initWithProductIdentifiers:set];
	self.request.delegate = self;
	[self.request start];
	
}

//收到产品返回信息
- (void)productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response{
	
	NSLog(@"---------收到产品反馈消息---------------------");
	NSArray *product = response.products;
	if([product count] == 0){
		NSLog(@"-------无法获取产品信息，购买失败------------------");
		//[MBProgressHUD hideHUD];
		//UIAlertView *alert = [[UIAlertView alloc]initWithTitle:nil message:NSLocalizedString(@"unable_to_obtain_product_information", nil) delegate:nil cancelButtonTitle:NSLocalizedString(@"OK", nil) otherButtonTitles:nil, nil];
		//[alert show];
		if(callback) callback(105, nil);
		return;
	}
	
	NSLog(@"productID:%@", response.invalidProductIdentifiers);
	NSLog(@"产品付费数量:%lu",(unsigned long)[product count]);
	
	SKProduct *p = nil;
	for (SKProduct *pro in product) {
		NSLog(@"%@", [pro description]);
		NSLog(@"%@", [pro localizedTitle]);
		NSLog(@"%@", [pro localizedDescription]);
		NSLog(@"%@", [pro price]);
		NSLog(@"%@", [pro productIdentifier]);
		
		if([pro.productIdentifier isEqualToString:self.productIdentifier]){
			p = pro;
		}
	}
	
	SKPayment *payment = [SKPayment paymentWithProduct:p];
    
	NSLog(@"发送购买请求");
	[[SKPaymentQueue defaultQueue] addPayment:payment];
}

//请求失败
- (void)request:(SKRequest *)request didFailWithError:(NSError *)error{
	NSLog(@"-------错误-----------------:%@", error);
	//[MBProgressHUD hideHUD];
	//UIAlertView *alert = [[UIAlertView alloc]initWithTitle:nil message:NSLocalizedString(@"buy_failure", nil) delegate:nil cancelButtonTitle:NSLocalizedString(@"OK", nil) otherButtonTitles:nil, nil];
	//[alert show];
	if(callback) callback(101, nil);
}

- (void)requestDidFinish:(SKRequest *)request{
	NSLog(@"-------反馈信息结束-----------------");
}


//监听购买结果
- (void)paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transaction{
	for(SKPaymentTransaction *tran in transaction){
		
		switch (tran.transactionState) {
			case SKPaymentTransactionStatePurchased:
				NSLog(@"交易完成");
				[self completeTransaction:tran];
				break;
			case SKPaymentTransactionStatePurchasing:
				NSLog(@"商品添加进列表");
				
				break;
			case SKPaymentTransactionStateRestored:
				NSLog(@"已经购买过商品"); 
				[self restoreTransaction:tran];
				break;
			case SKPaymentTransactionStateFailed:
			{
				NSLog(@"交易失败");
				//                [MBProgressHUD hideHUD];
				//                UIAlertView *alert = [[UIAlertView alloc]initWithTitle:nil message:@"交易失败" delegate:nil cancelButtonTitle:NSLocalizedString(@"OK", nil) otherButtonTitles:nil, nil];
				//                [alert show];
				[self failedTransaction:tran];
			}
				break;
			default:
				break;
		}
	}
}

//交易结束
- (void)completeTransaction:(SKPaymentTransaction *)transaction{
	NSLog(@"交易结束");
	NSString * productIdentifier = transaction.payment.productIdentifier;
	
	NSData *receiptData = nil;
	
	receiptData = transaction.transactionReceipt;
	
	// 接受到的App Store验证字符串，这里需要经过JSON编码
	NSString* jsonObjectString = [self encode:(uint8_t *)receiptData.bytes length:receiptData.length];
	
	//NSLog(@"%@", [[NSString alloc]initWithData:transaction.transactionReceipt encoding:NSUTF8StringEncoding]);
	// 将jsonObjectString字符串发给服务器，由服务器POST到iTunes上验证
	if ([productIdentifier length] > 0) {
		//NSLog(@"jsonObjectString====%@",jsonObjectString);
		//        [MBProgressHUD showMessage:nil];
		
		if(callback) callback(0, jsonObjectString);
		/*[manager POST:callbackUrl parameters:@{@"receipt-data": jsonObjectString, @"uid": [NSNumber numberWithInteger:[[GameInfo getInstance]uid]]} progress:nil
					success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
						int code = [responseObject[@"code"]intValue];
						if(callback) callback(code, jsonObjectString);
					} failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
						if(callback) callback(103, nil);
					}];*/
	}else{
		if(callback) callback(100, nil);
	}
	
	[[SKPaymentQueue defaultQueue] finishTransaction:transaction];
}
- (void)failedTransaction:(SKPaymentTransaction *)transaction {
	if(transaction.error.code != SKErrorPaymentCancelled) {
		NSLog(@"购买失败---%ld, %@",transaction.error.code, transaction.error);
		//[MBProgressHUD hideHUD];
		//UIAlertView *alert = [[UIAlertView alloc]initWithTitle:nil message:NSLocalizedString(@"buy_failure", nil) delegate:nil cancelButtonTitle:NSLocalizedString(@"OK", nil) otherButtonTitles:nil, nil];
		//[alert show];
		if(callback) callback(102, nil);
	} else {
		NSLog(@"用户取消交易");
		//[MBProgressHUD hideHUD];
		//UIAlertView *alert = [[UIAlertView alloc]initWithTitle:nil message:NSLocalizedString(@"user_cancel_transaction", nil) delegate:nil cancelButtonTitle:NSLocalizedString(@"OK", nil) otherButtonTitles:nil, nil];
		//[alert show];
		if(callback) callback(1, nil);
	}
	[[SKPaymentQueue defaultQueue] finishTransaction: transaction];
}
- (void)restoreTransaction:(SKPaymentTransaction *)transaction {
	// 对于已购商品，处理恢复购买的逻辑
	[[SKPaymentQueue defaultQueue] finishTransaction: transaction];
}
// base64编码
- (NSString *)encode:(const uint8_t *)input length:(NSInteger)length
{
	static char table[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	
	NSMutableData *data = [NSMutableData dataWithLength:((length + 2) / 3) * 4];
	uint8_t *output = (uint8_t *)data.mutableBytes;
	
	for (NSInteger i = 0; i < length; i += 3) {
		NSInteger value = 0;
		for (NSInteger j = i; j < (i + 3); j++) {
			value <<= 8;
			
			if (j < length) {
				value |= (0xFF & input[j]);
			}
		}
		
		NSInteger index = (i / 3) * 4;
		output[index + 0] =                    table[(value >> 18) & 0x3F];
		output[index + 1] =                    table[(value >> 12) & 0x3F];
		output[index + 2] = (i + 1) < length ? table[(value >> 6)  & 0x3F] : '=';
		output[index + 3] = (i + 2) < length ? table[(value >> 0)  & 0x3F] : '=';
	}
	
	return [[NSString alloc] initWithData:data encoding:NSASCIIStringEncoding];
}

@end
