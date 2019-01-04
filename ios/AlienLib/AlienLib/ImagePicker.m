//
//  ImagePicker.m
//  ddz
//
//  Created by 劳琪峰 on 16/2/15.
//  Copyright © 2016年 egret. All rights reserved.
//

#import "ImagePicker.h"

@implementation ImagePicker

UIAlertController *alertController;
UIImagePickerController *picker;
NSDictionary *defaultOptions;
NSMutableDictionary *options;
void (^callback)(NSMutableDictionary *response);

-(instancetype)initWithRoot:(UIViewController *)root{
	if (self = [super init]) {
		defaultOptions = @{
														@"title": @"Select a Photo",
														@"cancelButtonTitle": @"Cancel",
														@"takePhotoButtonTitle": @"Take Photo...",
														@"chooseFromLibraryButtonTitle": @"Choose from Library...",
														@"quality" : @0.5,
														@"allowsEditing" : @NO
														};
		
		self.root = root;
	}
	return self;
}

- (void)show:(NSDictionary *)setOptions callback:(void(^)(NSMutableDictionary *response))cb{
	callback = cb;
	
	options = [NSMutableDictionary dictionaryWithDictionary:defaultOptions]; // Set default options
	for (NSString *key in setOptions.keyEnumerator) { // Replace default options
		[options setValue:setOptions[key] forKey:key];
	}
	
	NSString *title = [options valueForKey:@"title"];
	
	alertController = [UIAlertController alertControllerWithTitle:title message:nil preferredStyle:UIAlertControllerStyleActionSheet];
	
	NSString *cancelTitle = [options valueForKey:@"cancelButtonTitle"];
	UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:cancelTitle style:UIAlertActionStyleCancel handler:^(UIAlertAction * action) {
		
	}];
	[alertController addAction:cancelAction];
	
	NSString *takePhotoButtonTitle = [options valueForKey:@"takePhotoButtonTitle"];
	NSString *chooseFromLibraryButtonTitle = [options valueForKey:@"chooseFromLibraryButtonTitle"];
	if (![takePhotoButtonTitle isEqual:[NSNull null]] && takePhotoButtonTitle.length > 0) {
		UIAlertAction *takePhotoAction = [UIAlertAction actionWithTitle:takePhotoButtonTitle style:UIAlertActionStyleDefault handler:^(UIAlertAction * action) {
			[self launchImagePicker:1];
		}];
		[alertController addAction:takePhotoAction];
	}
	if (![chooseFromLibraryButtonTitle isEqual:[NSNull null]] && chooseFromLibraryButtonTitle.length > 0) {
		UIAlertAction *chooseFromLibraryAction = [UIAlertAction actionWithTitle:chooseFromLibraryButtonTitle style:UIAlertActionStyleDefault handler:^(UIAlertAction * action) {
			[self launchImagePicker:2];
		}];
		[alertController addAction:chooseFromLibraryAction];
	}
	
	dispatch_async(dispatch_get_main_queue(), ^{
		UIViewController *root = self.root;//[[[[UIApplication sharedApplication] delegate] window] rootViewController];
		//alertController.popoverPresentationController.sourceView = root.view;
		//alertController.popoverPresentationController.sourceRect = CGRectMake(root.view.bounds.size.width / 2.0, root.view.bounds.size.height, 1.0, 1.0);
		[root presentViewController:alertController animated:YES completion:nil];
	});
}

- (void)launchImagePicker:(int) action{
	picker = [[UIImagePickerController alloc] init];
	
	switch (action) {
  case 1:	//拍照
#if TARGET_IPHONE_SIMULATOR
			NSLog(@"Camera not available on simulator");
			return;
#else
			picker.sourceType = UIImagePickerControllerSourceTypeCamera;
			break;
#endif
		break;
  case 2:	//从相册选取
			picker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
		break;
	}
	
	if ([[options objectForKey:@"allowsEditing"] boolValue]) {
		picker.allowsEditing = true;
	}
	picker.modalPresentationStyle = UIModalPresentationCurrentContext;
	picker.delegate = self;
	
	//UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
	
	dispatch_async(dispatch_get_main_queue(), ^{
		if (_root.presentedViewController) {
			[_root.presentedViewController presentViewController:picker animated:YES completion:nil];
		}
		else {
			[_root presentViewController:picker animated:YES completion:nil];
		}
	});
}

- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info
{
	dispatch_async(dispatch_get_main_queue(), ^{
		[picker dismissViewControllerAnimated:YES completion:nil];
	});
	
	/* Picked Image */
	UIImage *image;
	if ([[options objectForKey:@"allowsEditing"] boolValue]) {
		image = [info objectForKey:UIImagePickerControllerEditedImage];
	}
	else {
		image = [info objectForKey:UIImagePickerControllerOriginalImage];
	}
	
	/* creating a temp url to be passed */
	NSString *ImageUUID = [[NSUUID UUID] UUIDString];
	NSString *ImageName = [ImageUUID stringByAppendingString:@".jpg"];
	
	// This will be the default URL
	NSString* path = [[NSTemporaryDirectory()stringByStandardizingPath] stringByAppendingPathComponent:ImageName];
	
	NSDictionary *storageOptions;
	// if storage options are provided change path to the documents directory
	if([options objectForKey:@"storageOptions"] && [[options objectForKey:@"storageOptions"] isKindOfClass:[NSDictionary class]]){
		// retrieve documents path
		NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
		NSString *documentsDirectory = [paths objectAtIndex:0];
		// update path to save image to documents directory
		path = [documentsDirectory stringByAppendingPathComponent:ImageName];
		
		storageOptions = [options objectForKey:@"storageOptions"];
		// if extra path is provided try to create it
		if ([storageOptions objectForKey:@"path"]) {
			NSString *newPath = [documentsDirectory stringByAppendingPathComponent:[storageOptions objectForKey:@"path"]];
			NSError *error = nil;
			[[NSFileManager defaultManager] createDirectoryAtPath:newPath withIntermediateDirectories:YES attributes:nil error:&error];
			
			// if there was an error do not update path
			if (error != nil) {
				NSLog(@"error creating directory: %@", error);
			}
			else {
				path = [newPath stringByAppendingPathComponent:ImageName];
			}
		}
	}
	
	// Rotate the image for upload to web
	image = [self fixOrientation:image];
	
	//If needed, downscale image
	float maxWidth = image.size.width;
	float maxHeight = image.size.height;
	if ([options valueForKey:@"maxWidth"]) {
		maxWidth = [[options valueForKey:@"maxWidth"] floatValue];
	}
	if ([options valueForKey:@"maxHeight"]) {
		maxHeight = [[options valueForKey:@"maxHeight"] floatValue];
	}
	image = [self downscaleImageIfNecessary:image maxWidth:maxWidth maxHeight:maxHeight];
	
	NSMutableDictionary *response = [[NSMutableDictionary alloc] init];
	
	// base64 encoded image string
	NSData *data = UIImageJPEGRepresentation(image, [[options valueForKey:@"quality"] floatValue]);
	NSString *dataString = [data base64EncodedStringWithOptions:0];
	[response setObject:data forKey:@"data"];
	[response setObject:dataString forKey:@"base64"];
	
	// file uri
	[data writeToFile:path atomically:YES];
	NSString *fileURL = [[NSURL fileURLWithPath:path] absoluteString];
	if ([[storageOptions objectForKey:@"skipBackup"] boolValue]) {
		[self addSkipBackupAttributeToItemAtPath:path];
	}
	[response setObject:fileURL forKey:@"uri"];
	
	// image orientation
	BOOL vertical = (image.size.width < image.size.height) ? YES : NO;
	[response setObject:@(vertical) forKey:@"isVertical"];
	
	callback(response);
}

- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker{
	dispatch_async(dispatch_get_main_queue(), ^{
		[picker dismissViewControllerAnimated:YES completion:nil];
	});
	
	callback(nil);
}

- (UIImage *)fixOrientation:(UIImage *)srcImg {
	if (srcImg.imageOrientation == UIImageOrientationUp) {
		return srcImg;
	}
	
	CGAffineTransform transform = CGAffineTransformIdentity;
	switch (srcImg.imageOrientation) {
		case UIImageOrientationDown:
		case UIImageOrientationDownMirrored:
			transform = CGAffineTransformTranslate(transform, srcImg.size.width, srcImg.size.height);
			transform = CGAffineTransformRotate(transform, M_PI);
			break;
			
		case UIImageOrientationLeft:
		case UIImageOrientationLeftMirrored:
			transform = CGAffineTransformTranslate(transform, srcImg.size.width, 0);
			transform = CGAffineTransformRotate(transform, M_PI_2);
			break;
			
		case UIImageOrientationRight:
		case UIImageOrientationRightMirrored:
			transform = CGAffineTransformTranslate(transform, 0, srcImg.size.height);
			transform = CGAffineTransformRotate(transform, -M_PI_2);
			break;
		case UIImageOrientationUp:
		case UIImageOrientationUpMirrored:
			break;
	}
	
	switch (srcImg.imageOrientation) {
		case UIImageOrientationUpMirrored:
		case UIImageOrientationDownMirrored:
			transform = CGAffineTransformTranslate(transform, srcImg.size.width, 0);
			transform = CGAffineTransformScale(transform, -1, 1);
			break;
			
		case UIImageOrientationLeftMirrored:
		case UIImageOrientationRightMirrored:
			transform = CGAffineTransformTranslate(transform, srcImg.size.height, 0);
			transform = CGAffineTransformScale(transform, -1, 1);
			break;
		case UIImageOrientationUp:
		case UIImageOrientationDown:
		case UIImageOrientationLeft:
		case UIImageOrientationRight:
			break;
	}
	
	CGContextRef ctx = CGBitmapContextCreate(NULL, srcImg.size.width, srcImg.size.height, CGImageGetBitsPerComponent(srcImg.CGImage), 0, CGImageGetColorSpace(srcImg.CGImage), CGImageGetBitmapInfo(srcImg.CGImage));
	CGContextConcatCTM(ctx, transform);
	switch (srcImg.imageOrientation) {
		case UIImageOrientationLeft:
		case UIImageOrientationLeftMirrored:
		case UIImageOrientationRight:
		case UIImageOrientationRightMirrored:
			CGContextDrawImage(ctx, CGRectMake(0,0,srcImg.size.height,srcImg.size.width), srcImg.CGImage);
			break;
			
		default:
			CGContextDrawImage(ctx, CGRectMake(0,0,srcImg.size.width,srcImg.size.height), srcImg.CGImage);
			break;
	}
	
	CGImageRef cgimg = CGBitmapContextCreateImage(ctx);
	UIImage *img = [UIImage imageWithCGImage:cgimg];
	CGContextRelease(ctx);
	CGImageRelease(cgimg);
	return img;
}

- (UIImage*)downscaleImageIfNecessary:(UIImage*)image maxWidth:(float)maxWidth maxHeight:(float)maxHeight
{
	UIImage* newImage = image;
	
	// Nothing to do here
	if (image.size.width <= maxWidth && image.size.height <= maxHeight) {
		return newImage;
	}
	
	CGSize scaledSize = CGSizeMake(image.size.width, image.size.height);
	if (maxWidth < scaledSize.width) {
		scaledSize = CGSizeMake(maxWidth, (maxWidth / scaledSize.width) * scaledSize.height);
	}
	if (maxHeight < scaledSize.height) {
		scaledSize = CGSizeMake((maxHeight / scaledSize.height) * scaledSize.width, maxHeight);
	}
	
	// If the pixels are floats, it causes a white line in iOS8 and probably other versions too
	scaledSize.width = (int)scaledSize.width;
	scaledSize.height = (int)scaledSize.height;
	
	UIGraphicsBeginImageContext(scaledSize); // this will resize
	[image drawInRect:CGRectMake(0, 0, scaledSize.width, scaledSize.height)];
	newImage = UIGraphicsGetImageFromCurrentImageContext();
	if (newImage == nil) {
		NSLog(@"could not scale image");
	}
	UIGraphicsEndImageContext();
	
	return newImage;
}

- (BOOL)addSkipBackupAttributeToItemAtPath:(NSString *) filePathString
{
	NSURL* URL= [NSURL fileURLWithPath: filePathString];
	if ([[NSFileManager defaultManager] fileExistsAtPath: [URL path]]) {
		NSError *error = nil;
		BOOL success = [URL setResourceValue: [NSNumber numberWithBool: YES]
																	forKey: NSURLIsExcludedFromBackupKey error: &error];
		
		if(!success){
			NSLog(@"Error excluding %@ from backup %@", [URL lastPathComponent], error);
		}
		return success;
	}
	else {
		NSLog(@"Error setting skip backup attribute: file not found");
		return @NO;
	}
}

@end
