/**
 * Created by rockyl on 15/12/16.
 *
 * 网络服务
 */

class PDKWebService {
    uuid: string;

    /**
     * 注册
     * @param username
     * @param password
     * @param callback
     */
    register(username, nickname, password, callback: Function): void {
        this.callApi('index', 'sign', (response) => {
            callback(response);
        }, { username, nickname, password });
    }

	/**
	 * 登录
	 * @param username
	 * @param password
	 * @param callback
	 */
    login(username: string, password: string, callback: Function): void {
        this.callApi('index', 'login', (response) => {
            callback(response.data);
        }, { username, password });
    }

	/**
	 * 快速登录
	 * @param callback
	 */
    fastLogin(callback: Function): void {
        this.callApi('index', 'guest', (response) => {
            callback(response.data);
        }, { device: this.uuid });
    }

    /**
     * code到web验证
     */
    doLoginWebCheck(code: string, sk: string, unionid: string, packageName: string, callback: Function) {
        let _os = 0; //web 
        if (PDKalien.Native.instance.isNative) {
            _os = 1;
        }

        this.callApi('index', 'login', (response) => {
            callback(response);
        }, { type: 1, package: packageName, unionid: unionid, code: code, sk: sk, os: _os }, 'post');

    }

    /**
     * APP微信登录
     */
    loginWXApp(callback: Function) {
        let _pdk_nativeBridge = PDKalien.Native.instance;
        let _self = this;
        _pdk_nativeBridge.call("loginByWechat", null, function (sinfo) {
            let info = JSON.parse(sinfo);
            console.log("doAppWxLogin==cb=》", info.code, info.wxCode);

            if (info && info.code == 0 && info.wxCode) {
                _self.doLoginWebCheck(info.wxCode, null, null, PDKlang.package, callback);
            }
        });
    }

    /**
     * 手机号登录
     * phone:手机号 
     * code:短信验证码
     * unid:要绑定到其他平台的唯一识别码
     */
    loginByPhone(phone: string, code: string, unid: string, sk: string, callback: Function): void {
        let _self = this;
        _self.callApi('index', 'login', (response) => {
            callback(response);
        }, { type: 2, unid: unid, sk: sk, phone: phone, code: code }, 'post');
    }

    //公众号微信登录
    loginByWxFromWechat(code, sk, _unionId, _packageName, callback): void {
        this.doLoginWebCheck(code, sk, _unionId, _packageName, callback);
    }

    /**
     * 阿里生活号登录
     */
    loginByAliH5(code, sk, _unionId, callback) {
        this.callApi('index', 'login', (response) => {
            callback(response);
        }, { type: 3, unionid: _unionId, code: code, sk: sk }, 'post');
    }

    bindByWx(code, callback): void {
        this.callApi('user', 'bindByUid', (response) => {
            callback(response);
        }, { type: 1, package: PDKlang.package + ".web", wxcode: code, uid: PDKMainLogic.instance.selfData.uid }, 'post');
    }

    checkAppUpdate(callback: Function): void {
        let url = PDKGameConfig.RESOURCE_URL + "appVerCheck.php";
        let _platform = egret.Capabilities.os;
        let _channelId = null;
        let _versionCode = null;
        let _pdk_nativeBridge = PDKalien.Native.instance;
        _pdk_nativeBridge.getAppChannelId(function (channelId) {
            _channelId = channelId;
            _pdk_nativeBridge.getAppVerCode(function (versionCode) {
                _versionCode = versionCode;

                console.log("checkAppUpdate=====>", _channelId, _versionCode);
                PDKalien.Ajax.POST(url, { platform: _platform, channel: "" + _channelId, id: "com.tangyou.doudizhu" }, function (_info: any) {
                    console.log("appVerCheck=1=>", _info);
                    if (_info) {
                        let info = JSON.parse(_info);
                        let jInfo = info.data;
                        jInfo.cleanTmp = true;
                        jInfo.shouldInstall = false;
                        console.log("appVerCheck=2=>code:", info.code, "version:", jInfo.version);
                        //有新版本
                        if (info.code == 0 && jInfo.version > _versionCode) {
                            if (_platform == "Android") {
                                let _downVerCode: number = _pdk_nativeBridge.getAndroidLocalVercode();
                                let _downState = _pdk_nativeBridge.getAndroidDownState();

                                console.log("_downVerCode", _downVerCode, "_downState======", _downState);
                                //已下载的versionCode
                                if (_downVerCode && _downVerCode != 0) {
                                    //最新版本和本地下载的版本同个版本
                                    if (_downVerCode == jInfo.version) {
                                        jInfo.cleanTmp = false;

                                        if (_downState == 2) {//下载完成
                                            jInfo.shouldInstall = true;
                                        }
                                    }
                                }
                            }
                            callback(true, jInfo);
                            return;
                        }
                    }
                    callback(false, null, null);
                });
            })
        })
    }

    /**
     * 调用微信支付
     * 调用之前确保获得了正确的订单号和对应的支付参数
     */
    private _callWXPay(response: any): void {
        let _pdk_nativeBridge = PDKalien.Native.instance;
        if (_pdk_nativeBridge.isWXMP) {//微信公众号
            _pdk_nativeBridge.rechargeInWXMP(response.data);
        } else if (_pdk_nativeBridge.isNative) {
            _pdk_nativeBridge.rechageWXApp(response.data);
        } else {
            _pdk_nativeBridge.rechargeWXH5(response.data)
        }
    }

    /**
     * 调用支付宝支付
     * 调用之前确保获得了正确的订单号和对应的支付参数
     */
    private _callAliPay(response: any): void {
        let _pdk_nativeBridge = PDKalien.Native.instance;
        if (_pdk_nativeBridge.isAli()) {//阿里生活号
            _pdk_nativeBridge.rechargeAliH5(response.data);
        } else if (_pdk_nativeBridge.isNative) {
            _pdk_nativeBridge.rechargeAliApp(response.data);
        } else {
            _pdk_nativeBridge.rechargeAliH5(response.data);
        }
    }


    /**
     * 从Web获取到支付的订单号
     * payPlat:支付的渠道 ali,wx
     */
    private _onWebPayOrderCallBack(payPlat: string, response: any): void {
        let _pdk_nativeBridge = PDKalien.Native.instance;
        if (response.code == 0) {
            if (payPlat == "wx") {
                this._callWXPay(response);
            } else if (payPlat == "ali") {
                this._callAliPay(response);
            }
        }
        else if (response.code == 7005) {
            PDKAlert.show("您已参加过此活动,感谢您的支持!");
        }
        else if (response.code == 7006) { //由于服务器更新不允许充值
            PDKMainLogic.instance.rechareErrByServerUpdate();
        } else if (response.code == 50003) { //每日充值限额
            PDKAlert.show("您的充值金额已达每日上限!");
        }
        else {
            PDKAlert.show("支付失败,错误码:" + response.code);
        }
    }

    /**
     * 获取阿里支付的相关参数
     */
    getRechargeCfgByAli(id: string): void {
        let _tradeType = "PAGEAPI";
        let _self = this;
        let _pdk_nativeBridge = PDKalien.Native.instance;
        if (_pdk_nativeBridge.isNative) {
            _tradeType = "APP";
        }

        this.callApi('shop', 'alipayOrder', (response) => {
            _self._onWebPayOrderCallBack("ali", response);
        }, { product_id: id, os: 1, uid: PDKMainLogic.instance.selfData.uid, type: PDKGameConfig.SERVER_URL_TAIL, trade_type: _tradeType }, 'post');
    }

    /**
     * 获取微信支付的参数
     */
    getRechargeCfgByWX(id: string): void {
        let _tradeType = "h5";
        let _self = this;
        let _pdk_nativeBridge = PDKalien.Native.instance;
        if (_pdk_nativeBridge.isNative) {
            _tradeType = "APP";
        } else {
            if (!_pdk_nativeBridge.isWXMP && !_pdk_nativeBridge.isAli()) {
                _tradeType = "MWEB";
            }
        }

        this.callApi('shop', 'wechatpayOrder', (response) => {
            _self._onWebPayOrderCallBack("wx", response);
        }, { product_id: id, os: 1, uid: PDKMainLogic.instance.selfData.uid, type: PDKGameConfig.SERVER_URL_TAIL, trade_type: _tradeType }, 'post');
    }

    rechagre(id): void {
        let _pdk_nativeBridge = PDKalien.Native.instance;
        if (_pdk_nativeBridge.isWXMP) {
            this.getRechargeCfgByWX(id);
        } else if (_pdk_nativeBridge.isAli()) {
            this.getRechargeCfgByAli(id);
        } else {
            this.getRechargeCfgByAli(id);
            console.log("未选择支付渠道,当前运行的渠道为:", _pdk_nativeBridge.getChannelName(), "|是APP版本:", _pdk_nativeBridge.isNative);
        }

    }

    buyCardsRecorder(id): void {
        this.rechagre(id);
    }

    getWxConfig(callback): void {
        //alert("getWxConfig============>"+encodeURIComponent(window.top.location.href));
        //console.log(encodeURIComponent(window.top.location.href));
        this.callApi('wechat', 'jsConfig', (response) => {
            if (response.code == 0)
                callback(response.data);
        }, { url: encodeURIComponent(window.top.location.href) }, 'post');
    }

    private loadLogStartId: string = "";
    private isLogType1Send: boolean;
    private isLogType2Send: boolean;
    /**
     * 
     * @param load_type 加载类型{1|2 } 			1 表示 第一段加载 2 第二段加载
     * @param load_tag 加载Tag{0|1 }			1 表示 开始 0 结束
     * 
     */
    loadLog(load_type: number, load_tag: number): void {
        //        uuid					是				
        //
        //        load_type				是				加载类型{1 | 2 } 1 表示 第一段加载 2 第二段加载
        //
        //        load_tag				是				加载Tag{0 | 1 } 1 表示 开始 0 结束
        //
        //        load_time_stamp			是				当前时间{时间戳 }
        //
        //        is_first				是				第一次进入游戏{0 | 1 } 0 表示 不是 1 是
        //
        //        start_id				否				如果load_tag = 0 带上上次返回的data里是数据;
        //
        //        sign					是				验证 md5(uuid + load_tag + load_tag + load_time_stamp + key) + 表示连接符
        if (!PDKalien.Native.instance.isNative) {
            if (load_type == 1 && this.isLogType1Send)
                return;
            else if (load_type == 2 && this.isLogType2Send)
                return;
            var load_time_stamp: number = new Date().valueOf();
            var tmp: string = PDKalien.localStorage.getItem('is_first', PDKGameConfig.platform);
            tmp = tmp == null ? "1" : tmp;
            let is_first: number = Number(tmp);
            if (load_tag == 1)
                this.loadLogStartId = "";
            var sign: string = md5(PDKwebService.uuid + load_type + load_tag + load_time_stamp + "!@#HTGames$%^");
            // this.callApi('load','index',(response) => {
            //     if(response && response.code == 0)
            //         this.loadLogStartId = response.data;
            // },{ uuid: PDKwebService.uuid,load_type: load_type,load_tag: load_tag,load_time_stamp: load_time_stamp,is_first: is_first,start_id: this.loadLogStartId,sign: sign },'post');
            if (is_first == 1 && load_type == 2 && load_tag == 0)
                PDKalien.localStorage.setItem('is_first', "0", PDKGameConfig.platform);
            if (load_type == 1 && load_tag == 0)
                this.isLogType1Send = true;
            if (load_type == 2 && load_tag == 0)
                this.isLogType2Send = true;

        }
    }

    /**
     * 绑定手机号
     */
    bindPhone(phone: string, code: string, unid: string, sk: string, callback: Function): void {
        this.callApi('index', 'login', (response) => {
            callback(response.code);
        }, { phone: phone, code: code, sk: sk, unid: unid, type: 2 });
    }
    /**
     * 绑定手机号
     */
    bindPhoneNew(phone: string, code: string, uid: string, token: string, callback: Function): void {
        this.callApi('index', 'bindMobile', (response) => {
            callback(response.code);
        }, { phone: phone, code: code, token: token, uid: uid });
    }

    /**
     * 获取验证码
     */
    getCode(phone: string, callback: Function): void {
        this.callApi('user', 'getYunCode', (response) => {
            callback(response.code);
        }, { phone }, "get");
    }

    /**
	 * 获取红包历史数据
	 * @param phone
	 * @param codes
	 * @param password
	 * @param callback
	 */
    getExChangeHistory(phone, code, password, callback): void {
        this.callApi('user', 'bind', (response) => {
            callback(response.code);
        }, { phone, code, password, device_id: PDKwebService.uuid });
    }

    getRedcoinHistory(uid, callback): void {
        this.callApi('coin', 'index', (response) => {
            callback(response);
        }, { uid }, 'get');

    }
    /**
     * 查询是否关注了微信公众号
     */
    getWatchPublicWX(uid, callback): void {
        this.callApi('user', "getUserInfo", (response) => {
            callback(response);
        }, { uid }, 'post')
    }

    /**
     * 获取当前的服务器
     */
    getServer(uid, callback): void {
        this.callApi('user', "server", (response) => {
            callback(response);
        }, { uid }, 'post')
    }

    /**
     * 获取分享页面地址
     */
    getShareAddr(uid, callback): void {
        this.callApi('share', 'index', (response) => {
            callback(response);
        }, { uid }, 'get');
    }

	/**
	 * 调用API
	 * @param module
	 * @param action
	 * @param callback
	 * @param params
	 * @param method
	 */
    callApi(module: string, action: string, callback: Function = null, params: any = null, method: string = 'post'): void {
        if (!params) {
            params = {};
        }

        params.pf = PDKalien.Native.instance.platformId;

        let url: string = PDKGameConfig.WEB_SERVICE_URL + module + '/' + action;

        let m: Function = method == 'post' ? PDKalien.Ajax.POST : PDKalien.Ajax.GET;

        m.call(PDKalien.Ajax, url, params, (content: any) => {
            if (PDKGameConfig.DEBUG) {
                console.log('get:' + content);
            }
            if (callback) {
                let response: any = JSON.parse(content);
                if (response.code > 0) {
                    if (PDKGameConfig.DEBUG) {
                        console.log(url, response.code, response.message);
                    }
                    if (response.code == 500) { //停服更新中
                        PDKAlert.show("服务器维护中,预计2018年1月3日02:00:00维护完成", 0, function () {
                            PDKMainLogic.instance.closeSelf();
                        });
                        return;
                    }
                }
                callback(response);
            }
        });
    }

    /**
    * 举报玩家
    * token	是	用户登录后返回的token
    * uid		是	举报人
    * type		是	举报类型 目前固定 1
    * roomid	否	roomid, type 值是 1时 必须
    * tableid	否	tableid, type 值是 1时 必须
    * touid	否	被举报人, type 值是 1时 必须
    * content	否				
    * callback 回调
    */
    reportUser = function (token: string, uid: number, type: number, roomid: number, tableid: number, touid: number, callback, content: any = null) {
        this.callApi('game', 'impeach', callback, { token, uid, type, roomid, tableid, touid, content });
    }
    postError(type, body): void {
        var nickname: string = "";
        if (PDKMainLogic.instance.selfData)
            nickname = PDKMainLogic.instance.selfData.nickname;
        if (!nickname)
            nickname = "";
        else
            nickname += " #$% ";
        PDKalien.Ajax.POST(PDKGameConfig.WEB_SERVICE_URL + "/load/error", { uuid: this.uuid, type: type, body: nickname + body });
    }
    /**
     * 获取喇叭聊天记录
     */
    getHornRec(callback): void {
        PDKalien.Ajax.GET(PDKGameConfig.WEB_SERVICE_URL + "/msg/chatmsg", {}, (content: any) => {

            if (callback) {
                let response: any = JSON.parse(content);
                if (response.code == 0) {
                    callback(response.data);
                }
            }
        });
    }

    /**
     * 登录流程统计
     */
    postLoginStep(step: number, info: string = ""): void {
        //console.log("--------step---->",step,info);
        //PDKalien.Ajax.POST("https://wx.d.hztangyou.com/loginlog/index.php",{release:RELEASE,uuid: this.uuid,step:step,ext:info});
    }

    /**
     * 获取兑换话费,话费充值卡,京东卡,支付宝零钱,支付宝红包,微信零钱,微信红包记录
     * 4 话费 5 京东卡  6 话费卡 7 支付宝零钱 8 支付宝红包
     * 
     */
    getExHistory(page: number, callback: Function): void {
        let _token = PDKUserData.instance.getItem('token');
        PDKalien.Ajax.POST(PDKGameConfig.WEB_SERVICE_URL + "/wechat/redcoin", { uid: pdkServer.uid, token: _token, page: page }, (content: any) => {
            let response: any = JSON.parse(content);
            callback(response);
        })
    }

    /**
     * 兑换成功,去充值话费,支付宝零钱,支付宝红包,微信零钱,微信红包
     */
    goRechageFei(params: any, callback: Function): void {
        PDKalien.Ajax.POST(PDKGameConfig.WEB_SERVICE_URL + "/mobile/onlineorder", params, (content: any) => {
            let response: any = JSON.parse(content);
            callback(response);
        })
    }

    /**
    * 获取游戏中页面跳转的url配置
    */
    getGameUrlsCfg(callback: Function): void {
        let userData: PDKUserData = PDKUserData.instance;
        let uid = userData.getItem('uid')
        let token = userData.getItem('token')
        PDKalien.Ajax.GET(PDKGameConfig.WEB_SERVICE_URL + "activity/gameurl", { uid: uid, token: token }, (content: any) => {
            let response: any = JSON.parse(content);
            if (response.code == 0) {
                callback(response.data);
            }
        });
    }
}

let PDKwebService = new PDKWebService();