/**
 * Created by rockyl on 2016/12/16.
 */

import {listenBridge} from '../Bridge'
import {bindByWeiXin} from '../actions/webService'
import {getDeviceUUID} from '../actions/browser'
import {addScript} from '../third-part/loadJs'

export class WXApiManager{
	constructor(){		
		//console.log('WXApiManager init6.');
		//zhu 微信下载到本地addScript("http://res.wx.qq.com/open/js/jweixin-1.2.0.js");
		listenBridge('bindThirdPart', (callback)=>{
			this.bindThirdPartCallback = callback;

			this.doAuth(1);
		});
		listenBridge('weixinAuthCallback', (code, type)=>{
			if(type == 1){
				console.log('weixinAuthCallback:' + code, type);

				if(code){
					bindByWeiXin(code, getDeviceUUID()).then(
						(data)=>{
							this.bindThirdPartCallback(data);
						},
						(error)=>{
							this.bindThirdPartCallback({code: 2});
						}
					);
				}
			}
		});
		listenBridge('wxRecharge',this.recharge);
		listenBridge('wxConfig',this.config);
		listenBridge('wxShareTimeline',this.share);
		listenBridge('wxGetLocation',this.getLocation);
		this.initWeixinJSBridge();
	}

	doAuth(type){
		this.win = window.open('http://www.htgames.cn/laoqifeng/weixin.html?type=' + type);
		this.checkWindowClose();
	}

	checkWindowClose(){
		this.timer = setInterval(()=>{
			if(this.win.closed && this.timer){
				this.timer = null;
				weixinAuthCallback();
			}
		}, 500);
	}
	
	onBridgeReady(){
		WeixinJSBridge.call('hideToolbar');
		// WeixinJSBridge.call('hideOptionMenu'); 
		// alert("WeixinJSBridge Ready");
       // alert(this.params.appId + " " + this.params.timeStamp + " " + this.params.nonceStr + " " + this.params.package1 + " " + this.params.signType + " " + this.params.paySign);
       
    }

    config(response){
    	wx.config({
		    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		    appId: response.appId, // 必填，公众号的唯一标识
		    timestamp: response.timestamp, // 必填，生成签名的时间戳
		    nonceStr: response.nonceStr, // 必填，生成签名的随机串
		    signature: response.signature,// 必填，签名，见附录1
		    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});
		wx.ready(function(){
			// alert("ready");
		    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
		});
		wx.error(function(res){
			// alert("error");
		    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
		});		
    }

    getLocation(callback){
    	callback('getLocation')
    	wx.getLocation({
		    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
		    success: function (res) {
		        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
		        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
		        var speed = res.speed; // 速度，以米/每秒计
		        var accuracy = res.accuracy; // 位置精度
		        callback({result:'success', latitude:latitude, longitude:latitude, speed:latitude, accuracy:latitude});
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		        callback({result:'cancel'});
		    },
		    fail: function () { 
		        // 用户取消分享后执行的回调函数
		        callback({result:'fail'});
		         // callback({code:2});
		    },
		    trigger: function () { 
		        // 用户取消分享后执行的回调函数
		        callback({result:'trigger'});
		        // callback({code:3});
		    },
		});	
	}

     share(response,callback){ 
    	wx.onMenuShareTimeline({
		    title: response.title1, // 分享标题
		    link: response.link1, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		    imgUrl: response.imgUrl, // 分享图标
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		        // callback({code:0});
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		        // callback({code:1});
		    },
		    fail: function () { 
		        // 用户取消分享后执行的回调函数
		         // callback({code:2});
		    },
		    trigger: function () { 
		        // 用户取消分享后执行的回调函数
		        // alert('trigger');
		        // callback({code:3});
		    },
		});

		wx.onMenuShareAppMessage({
		    title: response.title2, // 分享标题
		    desc: response.desc2, // 分享描述
		    link: response.link2, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		    imgUrl: response.imgUrl, // 分享图标
		    type: '', // 分享类型,music、video或link，不填默认为link
		    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		        callback({code:0});
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		         callback({code:1});
		    },
		    fail: function () { 
		        // 用户取消分享后执行的回调函数
		         callback({code:2});
		    },
		    trigger: function () { 
		        // 用户取消分享后执行的回调函数
		        // alert('trigger');
		        callback({code:3});
		    }
		});	
    }

    recharge(response){ 
    	// alert("charge2");
    	// alert(response.appId + " " + response.timeStamp + " " + response.nonceStr + " " + response.package + " " + response.signType + " " + response.paySign);
         WeixinJSBridge.invoke(
            'getBrandWCPayRequest',{
                "appId": response.appId,     //公众号名称，由商户传入     
                "timeStamp": response.timeStamp,         //时间戳，自1970年以来的秒数     
                "nonceStr": response.nonceStr, //随机串     
                "package": response.package,
                "signType": response.signType,         //微信签名方式：     
                "paySign": response.paySign //微信签名 
            },
            function(res) {
                if(res.err_msg == "get_brand_wcpay_request:ok") {

                    alert("充值成功");
                }
                else if(res.err_msg == "get_brand_wcpay_request:cancel") {

                    //                alert("");
                }
                else if(res.err_msg == "get_brand_wcpay_request:fail") {

                    alert("充值失败");
                }      // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
                //	           window.location.href = url;
            }
        );
    }   

    initWeixinJSBridge(){
    	console.log("initWeixinJSBridge")
    	if(typeof WeixinJSBridge == "undefined") 
        {
            if(document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady',this.onBridgeReady,false);
            } else if(document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady',this.onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady',this.onBridgeReady);
            }
        } 
        else {            
            this.onBridgeReady();
        }
    }


	static get instance(){
		if(!WXApiManager._instance){
			WXApiManager._instance = new WXApiManager();
		}
		return WXApiManager._instance;
	}
}

export default WXApiManager.instance;