/**
 * Created by rockyl on 2016/12/15.
 */

let listeners = {};

window.bridgeEnabled = true;

window.authenticate = function (){
	execute('authenticate', arguments);
};

window.bindThirdPart = function () {
	execute('bindThirdPart', arguments);
};

window.weixinAuthCallback = function () {
	execute('weixinAuthCallback', arguments);
};

window.wxRecharge = function () {
	execute('wxRecharge', arguments);
};

window.wxConfig = function () {
	execute('wxConfig', arguments);
};

window.wxShareTimeline = function () {
	execute('wxShareTimeline', arguments);
};

window.getUrlParams = function () {
	execute('getUrlParams', arguments);
};

window.getEncodeURIComponent = function () {
	execute('getEncodeURIComponent', arguments);
};

window.QunHeiRecharge = function () {
	execute('QunHeiRecharge', arguments);
};

window.HaiWanWanRecharge = function () {
	execute('HaiWanWanRecharge', arguments);
};

window.AiYouXiGetCode = function () {
	execute('AiYouXiGetCode', arguments);
};

window.AiYouXiRecharge = function () {
	execute('AiYouXiRecharge', arguments);
};

window.wxGetLocation = function () {
	execute('wxGetLocation', arguments);
};


function execute(name, params){
	console.log('Bridge', name, params);
	let temp = [];
	for(let i = 0, li = params.length; i < li; i++){
		temp.push(params[i]);
	}
	let arr = listeners[name];
	if(arr){
		arr.forEach((callback)=>{
			callback.apply(null, temp);
		});
	}
}

//console.log('Bridge start');

export function listenBridge(name, callback){
	let arr = listeners[name];
	if(!arr){
		arr = listeners[name] = [];
	}
	arr.push(callback);
	//console.log('listenBridge', name, callback);
}