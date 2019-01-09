var _window = window.top;
var wxApi =  {
    _bOnReady  : false,
    _callback:null, //准备完成的回调

     onBridgeReady : function(){
         this._bOnReady = true;
         if(this._callback){
             this._callback();
         }
		_window.WeixinJSBridge.call('hideToolbar');
	},
    //just test not use
    getWXCfg:function(){
        alert("#33======"+encodeURIComponent(window.top.location.href));
        fetch("http://pl.ddz.htgames.cn:18998/wechat/jsConfig", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "url=" + encodeURIComponent(window.top.location.href)
            }).then(function(res) {
                if (res.ok) {
                    res.json().then(function(_json) {
                        
                    alert("getWXCfg" + "|" + _json.data.appId + "|" + _json.data.timestamp+ "|" + _json.data.nonceStr+ "|" + _json.data.signature);
                        wxApi.config(_json.data);
                    });
                } else if (res.status == 401) {
                    alert("Oops! You are not authorized.");
                }
                }, function(e) {
                    alert("Error submitting form!");
        });
    },

    /**
     * 微信接口是否准备完毕
     */
    isReady: function(){
        return this._bOnReady;
    },

    initBridge : function(callback){
        this._callback = callback;
        if(typeof _window.WeixinJSBridge == "undefined") 
        {
            if(_window.document.addEventListener) {
                _window.document.addEventListener('WeixinJSBridgeReady',this.onBridgeReady.bind(this),false);
            } else if(_window.document.attachEvent) {
                _window.document.attachEvent('WeixinJSBridgeReady',this.onBridgeReady.bind(this));
                _window.document.attachEvent('onWeixinJSBridgeReady',this.onBridgeReady.bind(this));
            }
        } 
        else {            
            this.onBridgeReady();
        }
    },

    /**
     *  zhu H5初始化微信参数
     */
    config : function(response){
        //alert(location.href.split('#')[0]);
        //alert("cfg" + this.isReady() + "|" + response.appId + "|" + response.timestamp+ "|" + response.nonceStr+ "|" + response.signature);
        if(!this.isReady()) return;
        

        _window.wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: response.appId, // 必填，公众号的唯一标识
            timestamp: response.timestamp, // 必填，生成签名的时间戳
            nonceStr: response.nonceStr, // 必填，生成签名的随机串
            signature: response.signature,// 必填，签名，见附录1
            jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        
        _window.wx.ready(function(){
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });
        _window.wx.error(function(res){
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });		
    },

    /**
     * zhu H5 微信分享
     */
    share : function(response,callback){     
        //alert("share" + this.isReady() + "|" +  response.title2 + "|" + response.desc2+ "|" + response.link2+ "|" + response.imgUrl);
        
        if(!this.isReady()) return;
        
        //alert("share--"+location.href.split('#')[0]);
        _window.wx.onMenuShareTimeline({
            title: response.title1, // 分享标题
            link: response.link1, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: response.imgUrl, // 分享图标
            success: function () {
                 callback({code:0});
            },
            cancel: function () {
                 callback({code:1});
            },
            fail: function () {
                callback({code:2});
            },
            trigger: function () { 
                // alert('trigger');
                 callback({code:3});
            },
        });

       _window.wx.onMenuShareAppMessage({
            title: response.title2, // 分享标题
            desc: response.desc2, // 分享描述
            link: response.link2, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: response.imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () { 
                callback({code:0});
            },
            cancel: function () { 
                callback({code:1});
            },
            fail: function () { 
                callback({code:2});
            },
            trigger: function () {
                // alert('trigger');
                callback({code:3});
            }
        });	
    },

    /**
     *  zhu H5微信支付
     */
    recharge : function(response,callback){
        //alert("wx recharge"+this.isReady());
        if(!this.isReady()) return;
        
        // alert("charge2");
        // alert(response.appId + " " + response.timeStamp + " " + response.nonceStr + " " + response.package + " " + response.signType + " " + response.paySign);
       _window.WeixinJSBridge.invoke(
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
                    callback({code:0});
                    alert("充值成功");
                }
                else if(res.err_msg == "get_brand_wcpay_request:cancel") {
                    callback({code:1});
                    alert("取消充值");
                }
                else if(res.err_msg == "get_brand_wcpay_request:fail") {
                    callback({code:2});
                    alert("充值失败");
                }      // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
                //	           window.location.href = url;
                
            }
        )
    },

    /**
     * 获取位置信息
     */
    getLocation:function(){
        _window.wx.getLocation({
		    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
		    success: function (res) {
		        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
		        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
		        var speed = res.speed; // 速度，以米/每秒计
		        var accuracy = res.accuracy; // 位置精度
		        callback({result:'success', latitude:latitude, longitude:latitude, speed:latitude, accuracy:latitude});
		    },
		    cancel: function () { 
		        callback({result:'cancel'});
		    },
		    fail: function () { 
		        callback({result:'fail'});
		    },
		    trigger: function () { 
		        callback({result:'trigger'});
		    },
		});	
    }
};

window.top.wxApi = wxApi;
wxApi.initBridge();