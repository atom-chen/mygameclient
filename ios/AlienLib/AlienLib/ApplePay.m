//
//  ApplePay.m
//  doudizhuhero
//
//  Created by 劳琪峰 on 16/7/5.
//  Copyright © 2016年 htgames. All rights reserved.
//

#import "ApplePay.h"

@implementation ApplePay

UIViewController *viewController;

- (instancetype)initWithViewController:(UIViewController *)vc {
	if (self = [super init]) {
		viewController = vc;
		
	}
	return self;
}

- (void)paymentAuthorizationViewController:(PKPaymentAuthorizationViewController *)controller
											 didAuthorizePayment:(PKPayment *)payment
																completion:(void (^)(PKPaymentAuthorizationStatus status))completion
{
	NSLog(@"Payment was authorized: %@", payment);
	
	// do an async call to the server to complete the payment.
	// See PKPayment class reference for object parameters that can be passed
	BOOL asyncSuccessful = FALSE;
	
	// When the async call is done, send the callback.
	// Available cases are:
	//    PKPaymentAuthorizationStatusSuccess, // Merchant auth'd (or expects to auth) the transaction successfully.
	//    PKPaymentAuthorizationStatusFailure, // Merchant failed to auth the transaction.
	//
	//    PKPaymentAuthorizationStatusInvalidBillingPostalAddress,  // Merchant refuses service to this billing address.
	//    PKPaymentAuthorizationStatusInvalidShippingPostalAddress, // Merchant refuses service to this shipping address.
	//    PKPaymentAuthorizationStatusInvalidShippingContact        // Supplied contact information is insufficient.
	
	if(asyncSuccessful) {
		completion(PKPaymentAuthorizationStatusSuccess);
		
		// do something to let the user know the status
		
		NSLog(@"Payment was successful");
		
		//        [Crittercism endTransaction:@"checkout"];
		
	} else {
		completion(PKPaymentAuthorizationStatusFailure);
		
		// do something to let the user know the status
		
		NSLog(@"Payment was unsuccessful");
		
		//        [Crittercism failTransaction:@"checkout"];
	}
	
}

- (void)paymentAuthorizationViewControllerDidFinish:(PKPaymentAuthorizationViewController *)controller
{
	NSLog(@"Finishing payment view controller");
	
	// hide the payment window
	[controller dismissViewControllerAnimated:TRUE completion:nil];
}

- (BOOL)doPay:(NSString *)label decimal:(NSString *)decimal
{
	// [Crittercism beginTransaction:@"checkout"];
	
	if([PKPaymentAuthorizationViewController canMakePayments]) {
		
		NSLog(@"Woo! Can make payments!");
		
		PKPaymentRequest *request = [[PKPaymentRequest alloc] init];
		
		PKPaymentSummaryItem *widget1 = [PKPaymentSummaryItem summaryItemWithLabel:label
																																				amount:[NSDecimalNumber decimalNumberWithString:decimal]];
		request.paymentSummaryItems = @[widget1];
		request.countryCode = @"CN";
		request.currencyCode = @"CNY";
		request.supportedNetworks = @[PKPaymentNetworkAmex, PKPaymentNetworkMasterCard, PKPaymentNetworkVisa, PKPaymentNetworkChinaUnionPay];
		request.merchantIdentifier = @"merchant.cn.htgames.herodoudizhu";
		request.merchantCapabilities = PKMerchantCapabilityEMV;
		
		PKPaymentAuthorizationViewController *paymentPane = [[PKPaymentAuthorizationViewController alloc] initWithPaymentRequest:request];
		if (!paymentPane) {
			
		}else{
			paymentPane.delegate = self;
			[viewController presentViewController:paymentPane animated:TRUE completion:nil];
		}
		
		return true;
	} else {
		NSLog(@"This device cannot make payments");
		
		return false;
	}
}
@end
