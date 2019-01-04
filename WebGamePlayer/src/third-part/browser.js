/**
 * Created by rockyl on 16/8/30.
 */

var ua = navigator.userAgent;

export function getPlatform(){
	var platform = 'other';
	if(/(iPhone|iPad|iPod|iOS)/i.test(ua)){
		platform = 'iOS';
	}else if(/(Android)/i.test(ua)){
		platform = 'Android';
	}

	return platform;
}

export function getBrowser(){
	var browser = 'other';
	if(/(CriOS)/i.test(ua)){
		browser = 'chrome';
	}else if(/(MicroMessenger)/i.test(ua)){
		browser = 'wx';
	}else if(/(Safari)/i.test(ua)){
		browser = 'safari';
	}

	return browser;
}