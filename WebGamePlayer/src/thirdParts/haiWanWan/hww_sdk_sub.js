(function() {
    var h = function() {};
    h.prototype = {
        postData: function(a) {
            window.top.postMessage(a, "*");
            console.log("send msg to parent " + JSON.stringify(a))
        },
        pay: function(goodsName, amount, roleName, callBackInfo,sign) {
            this.postData({
                op_type: "fn",
                value: {
                    fn: "hww_pay",
                    args: [{
                        goodsName: goodsName,
                        amount: amount,
                        roleName: roleName,
                        callBackInfo: callBackInfo,
                        sign: sign
                    }]
                }
            })
        },
        ejectFollow: function() {
            this.postData({
                op_type: "fn",
                value: {
                    fn: "hww_ejctFollow",
                    args: [{
                    }]
                }
            })
        },
        gameRoleinfo: function(roleId,roleName,roleLevel,serverName,serverId) {
        	 this.postData({
                op_type: "fn",
                value: {
                    fn: "hww_gameRoleinfo",
                    args: [{
                    	a:roleId,
                    	b:roleName,
                    	c:roleLevel,
                    	d:serverName,
                    	e:serverId
                    }]
                }
            })
        },
        paybailu: function(userId,userName,gameId,goodsId,goodsName,money,egretOrderId,channelExt,ext,gameUrl,time,sign) {
            this.postData({
                op_type: "fn",
                value: {
                    fn: "hww_paybailu",
                    args: [{
                    	userId:userId,
                    	userName:userName,
                    	gameId:gameId,
                    	goodsId:goodsId,
                    	goodsName:goodsName,
                    	money:money,
                    	egretOrderId:egretOrderId,
                    	channelExt:channelExt,
                    	ext:ext,
                    	gameUrl:gameUrl,
                    	time:time,
                    	sign:sign
                    }]
                }
            })
        },
        userInfo: function() {
            this.postData({
                op_type: "fn",
                value: {
                    fn: "hww_userinfo",
                    args: []
                }
            })
        },
        __paysucc: null,
        onpaysucc: function(a) {
            if ("function" === typeof a) {
                this.__paysucc = a
            } else {
                throw "onpaysucc\u53c2\u6570\u9519\u8bef\uff0c\u5fc5\u987b\u662f\u4e00\u4e2afunction\u3002"
            }
        },
        __userinfo: null,
        onuserinfo: function(a) {
            if ("function" === typeof a) {
                this.__userinfo = a
            } else {
                throw "onuserinfo\u53c2\u6570\u9519\u8bef\uff0c\u5fc5\u987b\u662f\u4e00\u4e2afunction\u3002"
            }
        },
        __share: null,
        onshare: function(a,b) {
            if ("function" === typeof a) {
                this.__share = a;
                this.postData({
                    op_type: "fn",
                    value: {
                        fn: "hww_shareinfo",
                        args: [{callbackInfo:b}]
                    }
                });
            } else {
                throw "onshare\u53c2\u6570\u9519\u8bef\uff0c\u5fc5\u987b\u662f\u4e00\u4e2afunction\u3002"
            }
        },
        isIos: function() {
            return navigator.userAgent.match(/iphone|ipod|ios|ipad/i)
        },
        isAndroid: function() {
            return navigator.userAgent.match(/android/i)
        }
    };
    window.Hwwsdk = new h;
    window.addEventListener("message",
    function(a) {
        var b = {
            paysucc: function(a) {
                "function" === typeof Hwwsdk.__paysucc && Hwwsdk.__paysucc(a)
            },
            userinfo: function(a) {
                "function" === typeof Hwwsdk.__userinfo && Hwwsdk.__userinfo(a);
            },
            share: function(a) {
                "function" === typeof Hwwsdk.__share && Hwwsdk.__share(a);
            }
        };
        var c;
        switch (a.data.op_type) {
        case "fn":
            (c = b[a.data.value.fn]) && "function" == typeof c ? c.apply(window, a.data.value.args) : (console.log("======unknow fun ======"), console.log(c), console.log(a));
            break;
        default:
            console.log(a)
        }
    },
    !1)
})();