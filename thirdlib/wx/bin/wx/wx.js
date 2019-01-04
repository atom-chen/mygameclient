!function (a, b) { "function" == typeof define && (define.amd || define.cmd) ? define(function () { return b(a); }) : b(a, !0); }(this, function (a, b) { function c(b, c, d) { a.WeixinJSBridge ? WeixinJSBridge.invoke(b, e(c), function (a) { h(b, a, d); }) : k(b, d); } function d(b, c, d) { a.WeixinJSBridge ? WeixinJSBridge.on(b, function (a) { d && d.trigger && d.trigger(a), h(b, a, c); }) : d ? k(b, d) : k(b, c); } function e(a) { return a = a || {}, a.appId = D.appId, a.verifyAppId = D.appId, a.verifySignType = "sha1", a.verifyTimestamp = D.timestamp + "", a.verifyNonceStr = D.nonceStr, a.verifySignature = D.signature, a; } function f(a) { return { timeStamp: a.timestamp + "", nonceStr: a.nonceStr, "package": a["package"], paySign: a.paySign, signType: a.signType || "SHA1" }; } function g(a) { return a.postalCode = a.addressPostalCode, delete a.addressPostalCode, a.provinceName = a.proviceFirstStageName, delete a.proviceFirstStageName, a.cityName = a.addressCitySecondStageName, delete a.addressCitySecondStageName, a.countryName = a.addressCountiesThirdStageName, delete a.addressCountiesThirdStageName, a.detailInfo = a.addressDetailInfo, delete a.addressDetailInfo, a; } function h(a, b, c) { "openEnterpriseChat" == a && (b.errCode = b.err_code), delete b.err_code, delete b.err_desc, delete b.err_detail; var d = b.errMsg; d || (d = b.err_msg, delete b.err_msg, d = i(a, d), b.errMsg = d), c = c || {}, c._complete && (c._complete(b), delete c._complete), d = b.errMsg || "", D.debug && !c.isInnerInvoke && alert(JSON.stringify(b)); var e = d.indexOf(":"), f = d.substring(e + 1); switch (f) {
    case "ok":
        c.success && c.success(b);
        break;
    case "cancel":
        c.cancel && c.cancel(b);
        break;
    default: c.fail && c.fail(b);
} c.complete && c.complete(b); } function i(a, b) { var c = a, d = q[c]; d && (c = d); var e = "ok"; if (b) {
    var f = b.indexOf(":");
    e = b.substring(f + 1), "confirm" == e && (e = "ok"), "failed" == e && (e = "fail"), -1 != e.indexOf("failed_") && (e = e.substring(7)), -1 != e.indexOf("fail_") && (e = e.substring(5)), e = e.replace(/_/g, " "), e = e.toLowerCase(), ("access denied" == e || "no permission to execute" == e) && (e = "permission denied"), "config" == c && "function not exist" == e && (e = "ok"), "" == e && (e = "fail");
} return b = c + ":" + e; } function j(a) { if (a) {
    for (var b = 0, c = a.length; c > b; ++b) {
        var d = a[b], e = p[d];
        e && (a[b] = e);
    }
    return a;
} } function k(a, b) { if (!(!D.debug || b && b.isInnerInvoke)) {
    var c = q[a];
    c && (a = c), b && b._complete && delete b._complete, console.log('"' + a + '",', b || "");
} } function l(a) { if (!(v || w || D.debug || "6.0.2" > A || C.systemType < 0)) {
    var b = new Image;
    C.appId = D.appId, C.initTime = B.initEndTime - B.initStartTime, C.preVerifyTime = B.preVerifyEndTime - B.preVerifyStartTime, I.getNetworkType({ isInnerInvoke: !0, success: function (a) { C.networkType = a.networkType; var c = "https://open.weixin.qq.com/sdk/report?v=" + C.version + "&o=" + C.isPreVerifyOk + "&s=" + C.systemType + "&c=" + C.clientVersion + "&a=" + C.appId + "&n=" + C.networkType + "&i=" + C.initTime + "&p=" + C.preVerifyTime + "&u=" + C.url; b.src = c; } });
} } function m() { return (new Date).getTime(); } function n(b) { x && (a.WeixinJSBridge ? b() : r.addEventListener && r.addEventListener("WeixinJSBridgeReady", b, !1)); } function o() { I.invoke || (I.invoke = function (b, c, d) { a.WeixinJSBridge && WeixinJSBridge.invoke(b, e(c), d); }, I.on = function (b, c) { a.WeixinJSBridge && WeixinJSBridge.on(b, c); }); } if (!a.jWeixin) {
    var p = { config: "preVerifyJSAPI", onMenuShareTimeline: "menu:share:timeline", onMenuShareAppMessage: "menu:share:appmessage", onMenuShareQQ: "menu:share:qq", onMenuShareWeibo: "menu:share:weiboApp", onMenuShareQZone: "menu:share:QZone", previewImage: "imagePreview", getLocation: "geoLocation", openProductSpecificView: "openProductViewWithPid", addCard: "batchAddCard", openCard: "batchViewCard", chooseWXPay: "getBrandWCPayRequest", openEnterpriseRedPacket: "getRecevieBizHongBaoRequest", startSearchBeacons: "startMonitoringBeacons", stopSearchBeacons: "stopMonitoringBeacons", onSearchBeacons: "onBeaconsInRange", consumeAndShareCard: "consumedShareCard", openAddress: "editAddress" }, q = function () { var a = {}; for (var b in p)
        a[p[b]] = b; return a; }(), r = a.document, s = r.title, t = navigator.userAgent.toLowerCase(), u = navigator.platform.toLowerCase(), v = !(!u.match("mac") && !u.match("win")), w = -1 != t.indexOf("wxdebugger"), x = -1 != t.indexOf("micromessenger"), y = -1 != t.indexOf("android"), z = -1 != t.indexOf("iphone") || -1 != t.indexOf("ipad"), A = function () { var a = t.match(/micromessenger\/(\d+\.\d+\.\d+)/) || t.match(/micromessenger\/(\d+\.\d+)/); return a ? a[1] : ""; }(), B = { initStartTime: m(), initEndTime: 0, preVerifyStartTime: 0, preVerifyEndTime: 0 }, C = { version: 1, appId: "", initTime: 0, preVerifyTime: 0, networkType: "", isPreVerifyOk: 1, systemType: z ? 1 : y ? 2 : -1, clientVersion: A, url: encodeURIComponent(location.href) }, D = {}, E = { _completes: [] }, F = { state: 0, data: {} };
    n(function () { B.initEndTime = m(); });
    var G = !1, H = [], I = { config: function (a) { D = a, k("config", a); var b = D.check === !1 ? !1 : !0; n(function () { if (b)
            c(p.config, { verifyJsApiList: j(D.jsApiList) }, function () { E._complete = function (a) { B.preVerifyEndTime = m(), F.state = 1, F.data = a; }, E.success = function (a) { C.isPreVerifyOk = 0; }, E.fail = function (a) { E._fail ? E._fail(a) : F.state = -1; }; var a = E._completes; return a.push(function () { l(); }), E.complete = function (b) { for (var c = 0, d = a.length; d > c; ++c)
                a[c](); E._completes = []; }, E; }()), B.preVerifyStartTime = m();
        else {
            F.state = 1;
            for (var a = E._completes, d = 0, e = a.length; e > d; ++d)
                a[d]();
            E._completes = [];
        } }), D.beta && o(); }, ready: function (a) { 0 != F.state ? a() : (E._completes.push(a), !x && D.debug && a()); }, error: function (a) { "6.0.2" > A || (-1 == F.state ? a(F.data) : E._fail = a); }, checkJsApi: function (a) { var b = function (a) { var b = a.checkResult; for (var c in b) {
            var d = q[c];
            d && (b[d] = b[c], delete b[c]);
        } return a; }; c("checkJsApi", { jsApiList: j(a.jsApiList) }, function () { return a._complete = function (a) { if (y) {
            var c = a.checkResult;
            c && (a.checkResult = JSON.parse(c));
        } a = b(a); }, a; }()); }, onMenuShareTimeline: function (a) { d(p.onMenuShareTimeline, { complete: function () { c("shareTimeline", { title: a.title || s, desc: a.title || s, img_url: a.imgUrl || "", link: a.link || location.href, type: a.type || "link", data_url: a.dataUrl || "" }, a); } }, a); }, onMenuShareAppMessage: function (a) { d(p.onMenuShareAppMessage, { complete: function () { c("sendAppMessage", { title: a.title || s, desc: a.desc || "", link: a.link || location.href, img_url: a.imgUrl || "", type: a.type || "link", data_url: a.dataUrl || "" }, a); } }, a); }, onMenuShareQQ: function (a) { d(p.onMenuShareQQ, { complete: function () { c("shareQQ", { title: a.title || s, desc: a.desc || "", img_url: a.imgUrl || "", link: a.link || location.href }, a); } }, a); }, onMenuShareWeibo: function (a) { d(p.onMenuShareWeibo, { complete: function () { c("shareWeiboApp", { title: a.title || s, desc: a.desc || "", img_url: a.imgUrl || "", link: a.link || location.href }, a); } }, a); }, onMenuShareQZone: function (a) { d(p.onMenuShareQZone, { complete: function () { c("shareQZone", { title: a.title || s, desc: a.desc || "", img_url: a.imgUrl || "", link: a.link || location.href }, a); } }, a); }, startRecord: function (a) { c("startRecord", {}, a); }, stopRecord: function (a) { c("stopRecord", {}, a); }, onVoiceRecordEnd: function (a) { d("onVoiceRecordEnd", a); }, playVoice: function (a) { c("playVoice", { localId: a.localId }, a); }, pauseVoice: function (a) { c("pauseVoice", { localId: a.localId }, a); }, stopVoice: function (a) { c("stopVoice", { localId: a.localId }, a); }, onVoicePlayEnd: function (a) { d("onVoicePlayEnd", a); }, uploadVoice: function (a) { c("uploadVoice", { localId: a.localId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1 }, a); }, downloadVoice: function (a) { c("downloadVoice", { serverId: a.serverId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1 }, a); }, translateVoice: function (a) { c("translateVoice", { localId: a.localId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1 }, a); }, chooseImage: function (a) { c("chooseImage", { scene: "1|2", count: a.count || 9, sizeType: a.sizeType || ["original", "compressed"], sourceType: a.sourceType || ["album", "camera"] }, function () { return a._complete = function (a) { if (y) {
            var b = a.localIds;
            b && (a.localIds = JSON.parse(b));
        } }, a; }()); }, getLocation: function (a) { }, previewImage: function (a) { c(p.previewImage, { current: a.current, urls: a.urls }, a); }, uploadImage: function (a) { c("uploadImage", { localId: a.localId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1 }, a); }, downloadImage: function (a) { c("downloadImage", { serverId: a.serverId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1 }, a); }, getLocalImgData: function (a) { G === !1 ? (G = !0, c("getLocalImgData", { localId: a.localId }, function () { return a._complete = function (a) { if (G = !1, H.length > 0) {
            var b = H.shift();
            wx.getLocalImgData(b);
        } }, a; }())) : H.push(a); }, getNetworkType: function (a) { var b = function (a) { var b = a.errMsg; a.errMsg = "getNetworkType:ok"; var c = a.subtype; if (delete a.subtype, c)
            a.networkType = c;
        else {
            var d = b.indexOf(":"), e = b.substring(d + 1);
            switch (e) {
                case "wifi":
                case "edge":
                case "wwan":
                    a.networkType = e;
                    break;
                default: a.errMsg = "getNetworkType:fail";
            }
        } return a; }; c("getNetworkType", {}, function () { return a._complete = function (a) { a = b(a); }, a; }()); }, openLocation: function (a) { c("openLocation", { latitude: a.latitude, longitude: a.longitude, name: a.name || "", address: a.address || "", scale: a.scale || 28, infoUrl: a.infoUrl || "" }, a); }, getLocation: function (a) { a = a || {}, c(p.getLocation, { type: a.type || "wgs84" }, function () { return a._complete = function (a) { delete a.type; }, a; }()); }, hideOptionMenu: function (a) { c("hideOptionMenu", {}, a); }, showOptionMenu: function (a) { c("showOptionMenu", {}, a); }, closeWindow: function (a) { a = a || {}, c("closeWindow", {}, a); }, hideMenuItems: function (a) { c("hideMenuItems", { menuList: a.menuList }, a); }, showMenuItems: function (a) { c("showMenuItems", { menuList: a.menuList }, a); }, hideAllNonBaseMenuItem: function (a) { c("hideAllNonBaseMenuItem", {}, a); }, showAllNonBaseMenuItem: function (a) { c("showAllNonBaseMenuItem", {}, a); }, scanQRCode: function (a) { a = a || {}, c("scanQRCode", { needResult: a.needResult || 0, scanType: a.scanType || ["qrCode", "barCode"] }, function () { return a._complete = function (a) { if (z) {
            var b = a.resultStr;
            if (b) {
                var c = JSON.parse(b);
                a.resultStr = c && c.scan_code && c.scan_code.scan_result;
            }
        } }, a; }()); }, openAddress: function (a) { c(p.openAddress, {}, function () { return a._complete = function (a) { a = g(a); }, a; }()); }, openProductSpecificView: function (a) { c(p.openProductSpecificView, { pid: a.productId, view_type: a.viewType || 0, ext_info: a.extInfo }, a); }, addCard: function (a) { for (var b = a.cardList, d = [], e = 0, f = b.length; f > e; ++e) {
            var g = b[e], h = { card_id: g.cardId, card_ext: g.cardExt };
            d.push(h);
        } c(p.addCard, { card_list: d }, function () { return a._complete = function (a) { var b = a.card_list; if (b) {
            b = JSON.parse(b);
            for (var c = 0, d = b.length; d > c; ++c) {
                var e = b[c];
                e.cardId = e.card_id, e.cardExt = e.card_ext, e.isSuccess = e.is_succ ? !0 : !1, delete e.card_id, delete e.card_ext, delete e.is_succ;
            }
            a.cardList = b, delete a.card_list;
        } }, a; }()); }, chooseCard: function (a) { c("chooseCard", { app_id: D.appId, location_id: a.shopId || "", sign_type: a.signType || "SHA1", card_id: a.cardId || "", card_type: a.cardType || "", card_sign: a.cardSign, time_stamp: a.timestamp + "", nonce_str: a.nonceStr }, function () { return a._complete = function (a) { a.cardList = a.choose_card_info, delete a.choose_card_info; }, a; }()); }, openCard: function (a) { for (var b = a.cardList, d = [], e = 0, f = b.length; f > e; ++e) {
            var g = b[e], h = { card_id: g.cardId, code: g.code };
            d.push(h);
        } c(p.openCard, { card_list: d }, a); }, consumeAndShareCard: function (a) { c(p.consumeAndShareCard, { consumedCardId: a.cardId, consumedCode: a.code }, a); }, chooseWXPay: function (a) { c(p.chooseWXPay, f(a), a); }, openEnterpriseRedPacket: function (a) { c(p.openEnterpriseRedPacket, f(a), a); }, startSearchBeacons: function (a) { c(p.startSearchBeacons, { ticket: a.ticket }, a); }, stopSearchBeacons: function (a) { c(p.stopSearchBeacons, {}, a); }, onSearchBeacons: function (a) { d(p.onSearchBeacons, a); }, openEnterpriseChat: function (a) { c("openEnterpriseChat", { useridlist: a.userIds, chatname: a.groupName }, a); } }, J = 1, K = {};
    return r.addEventListener("error", function (a) { if (!y) {
        var b = a.target, c = b.tagName, d = b.src;
        if ("IMG" == c || "VIDEO" == c || "AUDIO" == c || "SOURCE" == c) {
            var e = -1 != d.indexOf("wxlocalresource://");
            if (e) {
                a.preventDefault(), a.stopPropagation();
                var f = b["wx-id"];
                if (f || (f = J++, b["wx-id"] = f), K[f])
                    return;
                K[f] = !0, wx.ready(function () { wx.getLocalImgData({ localId: d, success: function (a) { b.src = a.localData; } }); });
            }
        }
    } }, !0), r.addEventListener("load", function (a) { if (!y) {
        var b = a.target, c = b.tagName;
        b.src;
        if ("IMG" == c || "VIDEO" == c || "AUDIO" == c || "SOURCE" == c) {
            var d = b["wx-id"];
            d && (K[d] = !1);
        }
    } }, !0), b && (a.wx = a.jWeixin = I), I;
} });
var _window = window.top;
var wxApi = {
    _bOnReady: false,
    _callback: null,
    onBridgeReady: function () {
        this._bOnReady = true;
        if (this._callback) {
            this._callback();
        }
        _window.WeixinJSBridge.call('hideToolbar');
        window.top.onWXLoadOver();
    },
    //just test not use
    getWXCfg: function () {
        alert("#33======" + encodeURIComponent(window.top.location.href));
        fetch("http://pl.ddz.htgames.cn:18998/wechat/jsConfig", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "url=" + encodeURIComponent(window.top.location.href)
        }).then(function (res) {
            if (res.ok) {
                res.json().then(function (_json) {
                    alert("getWXCfg" + "|" + _json.data.appId + "|" + _json.data.timestamp + "|" + _json.data.nonceStr + "|" + _json.data.signature);
                    wxApi.config(_json.data);
                });
            }
            else if (res.status == 401) {
                alert("Oops! You are not authorized.");
            }
        }, function (e) {
            alert("Error submitting form!");
        });
    },
    /**
     * 微信接口是否准备完毕
     */
    isReady: function () {
        return this._bOnReady;
    },
    initBridge: function (callback) {
        this._callback = callback;
        if (typeof _window.WeixinJSBridge == "undefined") {
            if (_window.document.addEventListener) {
                _window.document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady.bind(this), false);
            }
            else if (_window.document.attachEvent) {
                _window.document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady.bind(this));
                _window.document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady.bind(this));
            }
        }
        else {
            this.onBridgeReady();
        }
    },
    /**
     *  zhu H5初始化微信参数
     */
    config: function (response) {
        //alert(location.href.split('#')[0]);
        //alert("cfg" + this.isReady() + "|" + response.appId + "|" + response.timestamp+ "|" + response.nonceStr+ "|" + response.signature);
        if (!this.isReady())
            return;
        _window.wx.config({
            debug: false,
            appId: response.appId,
            timestamp: response.timestamp,
            nonceStr: response.nonceStr,
            signature: response.signature,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        _window.wx.ready(function () {
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });
        _window.wx.error(function (res) {
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });
    },
    /**
     * zhu H5 微信分享
     */
    share: function (response, callback) {
        //alert("share" + this.isReady() + "|" +  response.title2 + "|" + response.desc2+ "|" + response.link2+ "|" + response.imgUrl);
        if (!this.isReady())
            return;
        //alert("share--"+location.href.split('#')[0]);
        _window.wx.onMenuShareTimeline({
            title: response.title1,
            link: response.link1,
            imgUrl: response.imgUrl,
            success: function () {
                callback({ code: 0 });
            },
            cancel: function () {
                callback({ code: 1 });
            },
            fail: function () {
                callback({ code: 2 });
            },
            trigger: function () {
                // alert('trigger');
                callback({ code: 3 });
            },
        });
        _window.wx.onMenuShareAppMessage({
            title: response.title2,
            desc: response.desc2,
            link: response.link2,
            imgUrl: response.imgUrl,
            type: '',
            dataUrl: '',
            success: function () {
                callback({ code: 0 });
            },
            cancel: function () {
                callback({ code: 1 });
            },
            fail: function () {
                callback({ code: 2 });
            },
            trigger: function () {
                // alert('trigger');
                callback({ code: 3 });
            }
        });
    },
    /**
     *  zhu H5微信支付
     */
    recharge: function (response, callback) {
        //alert("wx recharge"+this.isReady());
        if (!this.isReady())
            return;
        // alert("charge2");
        // alert(response.appId + " " + response.timeStamp + " " + response.nonceStr + " " + response.package + " " + response.signType + " " + response.paySign);
        _window.WeixinJSBridge.invoke('getBrandWCPayRequest', {
            "appId": response.appId,
            "timeStamp": response.timeStamp,
            "nonceStr": response.nonceStr,
            "package": response.package,
            "signType": response.signType,
            "paySign": response.paySign //微信签名 
        }, function (res) {
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                callback({ code: 0 });
                alert("充值成功");
            }
            else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                callback({ code: 1 });
                alert("取消充值");
            }
            else if (res.err_msg == "get_brand_wcpay_request:fail") {
                callback({ code: 2 });
                alert("充值失败");
            } // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
            //	           window.location.href = url;
        });
    },
    /**
     * 获取位置信息
     */
    getLocation: function () {
        _window.wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                var speed = res.speed; // 速度，以米/每秒计
                var accuracy = res.accuracy; // 位置精度
                callback({ result: 'success', latitude: latitude, longitude: latitude, speed: latitude, accuracy: latitude });
            },
            cancel: function () {
                callback({ result: 'cancel' });
            },
            fail: function () {
                callback({ result: 'fail' });
            },
            trigger: function () {
                callback({ result: 'trigger' });
            },
        });
    }
};
window.top.wxApi = wxApi;
wxApi.initBridge();
