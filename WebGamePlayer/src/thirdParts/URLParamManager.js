import {listenBridge} from '../Bridge'

export class URLParamManager{
	constructor(){
		console.log('URLParamManager init.');
		listenBridge('getUrlParams', (callback)=>{
			var params=this.getUrlParams();
			// this.URLParamManagerCallback = callback;
			callback(params);
			// console.log('URLParamManager init2.');
			
		});
		listenBridge('getEncodeURIComponent',this.getEncodeURIComponent);
	}

	getUrlParams() {
		var params = {};
		var href = window.location.href;
		var index = href.indexOf("?");
		if (index < 0) {
			return params;
		}
		var hashes = href.substr(index + 1).split('&');
		for (var i = 0; i < hashes.length; i++) {
			var arr = hashes[i].split('=');
			params[arr[0]] = arr[1];
		}
		return params;
	}

	getEncodeURIComponent(value,callback){
		var str=encodeURIComponent(value);
		callback(str);
	}

	static get instance(){
		if(!URLParamManager._instance){
			URLParamManager._instance = new URLParamManager();
		}
		return URLParamManager._instance;
	}
}

export default URLParamManager.instance;