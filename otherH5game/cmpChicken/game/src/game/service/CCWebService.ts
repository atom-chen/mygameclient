/**
 * Created by rockyl on 15/12/16.
 *
 * 网络服务
 */

class CCWebService {
    uuid: string;

	/**
	 * 登录
	 * @param username
	 * @param password
	 * @param callback
	 */
    login(username: string, password: string, callback: Function): void {
        // this.callApi('index', 'login', (response) => {
        //     callback(response.data);
        // }, { username, password });
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
        if (CCalien.Native.instance.isNative) {
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
        let cc_nativeBridge = CCalien.Native.instance;
        let _self = this;
        cc_nativeBridge.call("loginByWechat", null, function (sinfo) {
            let info = JSON.parse(sinfo);
            console.log("doAppWxLogin==cb=》", info.code, info.wxCode);

            if (info && info.code == 0 && info.wxCode) {
                _self.doLoginWebCheck(info.wxCode, null, null, "cn.htgames.doudizhu", callback);
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
        }, { type: 1, package: "cn.htgames.doudizhu.web", wxcode: code, uid: CCDDZMainLogic.instance.selfData.uid }, 'post');
    }

    checkAppUpdate(callback: Function): void {
        let url = CCGlobalGameConfig.RESOURCE_URL + "appVerCheck.php";
        let _platform = egret.Capabilities.os;
        let _channelId = null;
        let _versionCode = null;
        let cc_nativeBridge = CCalien.Native.instance;
        cc_nativeBridge.getAppChannelId(function (channelId) {
            _channelId = channelId;
            cc_nativeBridge.getAppVerCode(function (versionCode) {
                _versionCode = versionCode;

                console.log("checkAppUpdate=====>", _channelId, _versionCode);
                CCalien.Ajax.POST(url, { platform: _platform, channel: "" + _channelId, id: "com.tangyou.doudizhu" }, function (_info: any) {
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
                                let _downVerCode: number = cc_nativeBridge.getAndroidLocalVercode();
                                let _downState = cc_nativeBridge.getAndroidDownState();

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
        let cc_nativeBridge = CCalien.Native.instance;
        if (cc_nativeBridge.isWXMP) {//微信公众号
            cc_nativeBridge.rechargeInWXMP(response.data);
        } else if (cc_nativeBridge.isNative) {
            cc_nativeBridge.rechageWXApp(response.data);
        } else if (cc_nativeBridge.isWxQr() || cc_nativeBridge.isLoginByWXQr()) {
            cc_nativeBridge.rechargeInWXQr(response.data);
        } else {
            cc_nativeBridge.rechargeWXH5(response.data)
        }
    }

    /**
     * 调用支付宝支付
     * 调用之前确保获得了正确的订单号和对应的支付参数
     */
    private _callAliPay(response: any): void {
        let cc_nativeBridge = CCalien.Native.instance;
        let data = response.data;
        if (cc_nativeBridge.isAli()) {//阿里生活号
            cc_nativeBridge.rechargeAliH5(data.info);
        } else if (cc_nativeBridge.isNative) {
            if (data.h5 = 1) {
                cc_nativeBridge.rechargeAliH5(data.info);
            } else {
                cc_nativeBridge.rechargeAliApp(data.info);
            }
        } else {
            cc_nativeBridge.rechargeAliH5(data.info);
        }
    }


    /**
     * 从Web获取到支付的订单号
     * payPlat:支付的渠道 ali,wx
     */
    private _onWebPayOrderCallBack(payPlat: string, response: any): void {
        let cc_nativeBridge = CCalien.Native.instance;
        if (response.code == 0) {
            if (payPlat == "wx") {
                this._callWXPay(response);
            } else if (payPlat == "ali") {
                this._callAliPay(response);
            }
        }
        else if (response.code == 7005) {
            CCDDZAlert.show("您已参加过此活动,感谢您的支持!");
        }
        else if (response.code == 7006) { //由于服务器更新不允许充值
            CCDDZMainLogic.instance.rechareErrByServerUpdate();
        } else if (response.code == 50003) { //每日充值限额
            CCDDZAlert.show("您的充值金额已达每日上限!");
        }
        else {
            CCDDZAlert.show("支付失败,错误码:" + response.code);
        }
    }

    /**
     * 获取阿里支付的相关参数
     */
    getRechargeCfgByAli(id: string): void {
        let _tradeType = "PAGEAPI";
        let _self = this;
        let cc_nativeBridge = CCalien.Native.instance;
        if (cc_nativeBridge.isNative) {
            _tradeType = "APP";
        }
        let _return = 0; //是否在支付完成要重定向 1:重定向 0:不需要重定向
        if (cc_nativeBridge.isAli()) {
            _return = 1;
        }
        let uid = CCGlobalUserData.instance.getUid();
        if (!uid) {
            return;
        }
        this.callApi('shop', 'alipayOrder', (response) => {
            _self._onWebPayOrderCallBack("ali", response);
        }, { product_id: id, os: 1, uid: uid, type: CCGlobalGameConfig.SERVER_URL_TAIL, trade_type: _tradeType, return: _return }, 'post');
    }

    /**
     * 获取微信支付的参数
     */
    getRechargeCfgByWX(id: string): void {
        let _tradeType = "h5";
        let _self = this;
        if (CCalien.Native.instance.isNative) {
            _tradeType = "APP";
        } else {
            if (CCalien.Native.instance.isWxQr() || CCalien.Native.instance.isLoginByWXQr()) {
                _tradeType = "NATIVE";
            }
            else if (!CCalien.Native.instance.isWXMP && !CCalien.Native.instance.isAli()) {
                _tradeType = "MWEB";
            }
        }

        let _urlParam = CCalien.Native.instance.getUrlArg();
        let _packageName = "";
        if (_urlParam.oldWx == "1") {
            _packageName = 'cn.htgames.doudizhu.wechat_old';
        }
        let uid = CCGlobalUserData.instance.getUid();
        if (!uid) {
            return;
        }
        this.callApi('shop', 'wechatpayOrder', (response) => {
            _self._onWebPayOrderCallBack("wx", response);
        }, { product_id: id, os: 1, uid: uid, type: CCGlobalGameConfig.SERVER_URL_TAIL, trade_type: _tradeType, package: _packageName }, 'post');
    }



    rechagre(id): void {
        let cc_nativeBridge = CCalien.Native.instance;
        if (cc_nativeBridge.isWXMP || cc_nativeBridge.isWxQr() || cc_nativeBridge.isLoginByWXQr()) {
            this.getRechargeCfgByWX(id);
        } else if (cc_nativeBridge.isAli()) {
            this.getRechargeCfgByAli(id);
        } else {
            if (cc_nativeBridge.isInMiniApp()) {
                let hasAliPay = false;
                let hasWxPay = false;
                let aliInfo = CCGlobalGameConfig.getCfgByField("webCfg.appzfbzf");
                if (aliInfo && aliInfo.status == 1) {
                    hasAliPay = true;
                }

                let wxInfo = CCGlobalGameConfig.getCfgByField("webCfg.appwxzf");
                if (wxInfo && wxInfo.status == 1) {
                    hasWxPay = true;
                }
                if (hasWxPay && hasAliPay) {
                    CCDDZPanelChoosePay.getInstance().show(id);
                } else if (hasWxPay) {
                    this.getRechargeCfgByWX(id);
                } else if (hasAliPay) {
                    this.getRechargeCfgByAli(id);
                }
            } else if (!cc_nativeBridge.isNative) {
                let _urlParam = cc_nativeBridge.getUrlArg();
                if (_urlParam.oldWx == "1") {
                    this.getRechargeCfgByAli(id);
                } else {
                    CCDDZPanelChoosePay.getInstance().show(id);
                }
            }
            console.log("未选择支付渠道,当前运行的渠道为:", cc_nativeBridge.getChannelName(), "|是APP版本:", cc_nativeBridge.isNative);
        }

    }

    buyCardsRecorder(id): void {
        this.rechagre(id);
    }

    getShareImgUrlByScene(callback, scene = 1): void {
        let _url = CCGlobalGameConfig.getCfgByField("urlCfg.shareUrl");

        CCalien.Ajax.GET(_url, { uid: CCDDZMainLogic.instance.selfData.uid, scene: scene }, callback);
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
        if (!CCalien.Native.instance.isNative) {
            if (load_type == 1 && this.isLogType1Send)
                return;
            else if (load_type == 2 && this.isLogType2Send)
                return;
            var load_time_stamp: number = new Date().valueOf();
            var tmp: string = CCalien.CCDDZlocalStorage.getItem('is_first', CCGlobalGameConfig.platform);
            tmp = tmp == null ? "1" : tmp;
            let is_first: number = Number(tmp);
            if (load_tag == 1)
                this.loadLogStartId = "";
            var sign: string = md5(ccddzwebService.uuid + load_type + load_tag + load_time_stamp + "!@#HTGames$%^");
            this.callApi('load', 'index', (response) => {
                if (response && response.code == 0)
                    this.loadLogStartId = response.data;
            }, { uuid: ccddzwebService.uuid, load_type: load_type, load_tag: load_tag, load_time_stamp: load_time_stamp, is_first: is_first, start_id: this.loadLogStartId, sign: sign }, 'post');
            if (is_first == 1 && load_type == 2 && load_tag == 0)
                CCalien.CCDDZlocalStorage.setItem('is_first', "0", CCGlobalGameConfig.platform);
            if (load_type == 1 && load_tag == 0)
                this.isLogType1Send = true;
            if (load_type == 2 && load_tag == 0)
                this.isLogType2Send = true;

        }
    }

    /**
     * 登录绑定手机号
     */
    bindPhoneByLogin(phone: string, code: string, unid: string, sk: string, callback: Function): void {
        this.callApi('index', 'login', (response) => {
            callback(response);
        }, { phone: phone, code: code, sk: sk, unid: unid, type: 2 });
    }

    /**
     * 兑换绑定手机
     */
    bindPhoneByExchange(phone: string, code: string, callback: Function): void {
        let _data = CCGlobalUserData.instance;
        let cc_nativeBridge = CCalien.Native.instance;
        let _uid = _data.getUid();
        let _token = _data.getToken();
        let _source = "ddz";
        if (cc_nativeBridge.isAli()) {
            _source = "alipay";
        } else if (cc_nativeBridge.isWXMP) {
            _source = "wechat";
        } else if (cc_nativeBridge.isNative) {
            _source = "wechat";
        }
        this.callApi('index', 'bindMobile', (response) => {
            callback(response);
        }, { phone: phone, code: code, token: _token, uid: _uid, source: _source });
    }

    /**
     * 获取验证码
     */
    getCode(phone: string, callback: Function): void {
        this.callApi('user', 'getYunCode', (response) => {
            callback(response);
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
        }, { phone, code, password, device_id: ccddzwebService.uuid });
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

        params.pf = CCalien.Native.instance.platformId;

        let url: string = CCGlobalGameConfig.WEB_SERVICE_URL + module + '/' + action;

        let m: Function = method == 'post' ? CCalien.Ajax.POST : CCalien.Ajax.GET;

        m.call(CCalien.Ajax, url, params, (content: any) => {
            if (CCGlobalGameConfig.DEBUG) {
                console.log('get:' + content);
            }
            if (callback) {
                let response: any;
                try {
                    response = JSON.parse(content);
                } catch (err) {
                    CCDDZReportor.instance.reportCodeError(module + " ----callApi---- " + action + " json error");
                }

                if (response.code > 0) {
                    if (CCGlobalGameConfig.DEBUG) {
                        console.log(url, response.code, response.message);
                    }
                    if (response.code == 500) { //停服更新中
                        CCDDZAlert.show("服务器维护中,预计2018年1月3日02:00:00维护完成", 0, function () {
                            CCDDZMainLogic.instance.closeSelf();
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
        let _gold: string = "|g:";
        let _g: any = "xx";
        let _diamond: string = "|d:";
        let _d: any = "xx";
        let _redCoin: string = "|r:";
        let _r: any = "xx";
        let _roomId: string = "|room:";
        let _room: any = "xx";
        let _uid: string = "uid:";
        let _uidId: string = "xx";
        let _data = CCDDZMainLogic.instance.selfData;
        if (_data) {
            _uidId = "" + _data.uid;
            if (_uidId) {
                if (_data.gold >= 0) {
                    _g = _data.gold;
                }
                if (_data.redcoin >= 0) {
                    _r = _data.redcoin;
                }
                let _num = CCDDZBagService.instance.getItemCountById(3);
                if (_num >= 0) {
                    _d = _num;
                }
                if (ccserver.roomInfo) {
                    _room = ccserver.roomInfo.roomID;
                }
            }
        }

        _redCoin += _r;
        _gold += _g;
        _diamond += _d;
        _roomId += _room;
        _uid += _uidId;
        let _info = _uid + _redCoin + _gold + _diamond + _roomId + body;
        CCalien.Ajax.POST(CCGlobalGameConfig.WEB_SERVICE_URL + "/load/error", { type: type, body: _info });
    }
    /**
     * 获取喇叭聊天记录
     */
    getHornRec(callback): void {
        CCalien.Ajax.GET(CCGlobalGameConfig.WEB_SERVICE_URL + "/msg/chatmsg", {}, (content: any) => {

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
        //CCalien.Ajax.POST("https://wx.d.hztangyou.com/loginlog/index.php",{release:RELEASE,uuid: this.uuid,step:step,ext:info});
    }

    /**
     * 获取兑换话费,话费充值卡,京东卡,支付宝零钱,支付宝红包,微信零钱,微信红包记录
     * 4 话费 5 京东卡  6 话费卡 7 支付宝零钱 8 支付宝红包
     * 
     */
    getExHistory(page: number, callback: Function): void {
        let _token = CCGlobalUserData.instance.getToken();
        CCalien.Ajax.POST(CCGlobalGameConfig.WEB_SERVICE_URL + "/wechat/redcoin", { uid: ccserver.uid, token: _token, page: page }, (content: any) => {
            let response: any = JSON.parse(content);
            callback(response);
        })
    }

    /**
     * 兑换成功,去充值话费,支付宝零钱,支付宝红包,微信零钱,微信红包
     */
    goRechageFei(params: any, callback: Function): void {
        CCalien.Ajax.POST(CCGlobalGameConfig.WEB_SERVICE_URL + "/mobile/onlineorder", params, (content: any) => {
            let response: any = JSON.parse(content);
            let _str = response.message;
            if (response.code == 0) {
                callback(response);
                return;
            } else if (response.code == 5004) {
                _str += CCGlobalGameConfig.wxService;
            }
            CCDDZAlert3.show(_str, null, "cc_common_btn_lab_confirm_n");
        })
    }

    /**
     * 兑换码兑换
     */
    doCodeExchange(params: any, callback: Function): void {
        CCalien.Ajax.POST(CCGlobalGameConfig.WEB_SERVICE_URL + "shop/exchangecode", params, (content: any) => {
            let response: any = JSON.parse(content);
            callback(response);
        })
    }

    /**
     * 绑定渠道
     */
    doBindChannel(uid: number, agentId: string): void {
        CCalien.Ajax.POST(CCGlobalGameConfig.WEB_SERVICE_URL + "/agent/subordinate", { uid: uid, agentid: agentId }, (content: any) => {

        });
    }


    //1 安卓微信公众号；2 安卓 网页登入，3 安卓 app ， 6 ios微信公众号 ，7 ios网页，10pc
    private _getSystemId(): number {
        let os = egret.Capabilities.os;
        let cc_nativeBridge = CCalien.Native.instance;
        let id = -1;
        if (cc_nativeBridge.isNative) {
            if (os == "Android") {
                id = 3;
            } else if (os == "iOS") {
                id = 8;
            }
        } else {
            if (os == "Android") {
                id = 2;
                if (cc_nativeBridge.isWXMP) {
                    id = 1;
                }
            } else if (os == "iOS") {
                id = 7;
                if (cc_nativeBridge.isWXMP) {
                    id = 6;
                }
            } else {
                id = 10;
            }
        }
        return id;
    }

    /**
     * 用户初始化
     */
    doUserInit(uid: number): void {
        let id = this._getSystemId();
        CCalien.Ajax.POST(CCGlobalGameConfig.WEB_SERVICE_URL + "/user/userInit", { uid: uid, system: id }, (content: any) => {
            let response: any = JSON.parse(content);
            if (response && response.data) {
                let _data = response.data;
                if (response.data.payment_num > 0) {
                    let _num = _data.payment_num;
                    CCDDZMainLogic.instance.selfData.setPayCount(_num);

                    if (_data.alipay && _data.alipay.connection_alipay) {
                        let _aliInfo = _data.alipay;
                        if (_aliInfo.username && _aliInfo.realname) {
                            CCGlobalUserData.instance.saveLocalAli(_aliInfo.username, _aliInfo.realname);
                        }
                    }
                }

                if (response.data.realname) {
                    CCDDZMainLogic.instance.selfData.realName = true;
                }
            }
        });
    }

    /**
     * 夺宝记录
     */
    getDoLotteryRec(uid: number, page: number, callback: Function): void {
        CCalien.Ajax.POST(CCGlobalGameConfig.WEB_SERVICE_URL + "/lottery/index", { uid: uid, page: page }, (content: any) => {
            let response: any = JSON.parse(content);
            callback(response);
        });
    }

    /**
     * 夺宝开奖
     * lotteryid:编号 配置的id
     * phase:期数
     */
    getLotteryCurLuck(lotteryid: number, phase: number, callback: Function): void {
        CCalien.Ajax.POST(CCGlobalGameConfig.WEB_SERVICE_URL + "/lottery/run", { lotteryid: lotteryid, phase: phase }, (content: any) => {
            let response: any = JSON.parse(content);
            callback(response);
        });
    }

    /**
     * 夺宝往期幸运儿
     */
    getLotteryLuckHistory(page: number, lotteryid: number, callback: Function): void {
        CCalien.Ajax.GET(CCGlobalGameConfig.WEB_SERVICE_URL + "/lottery/history", { page: page, lotteryid: lotteryid }, (content: any) => {
            let response: any = JSON.parse(content);
            callback(response);
        });
    }

    /**
     * 获取商城中兑换微信红包的活动介绍和活动时间
     * content
       time
       status=1 显示，=0不显示
     */
    getExchangeWXInfo(callback: Function): void {
        let _url: string = CCGlobalGameConfig.getCfgByField("urlCfg.wxRedUrl");
        CCalien.Ajax.GET(_url, {}, (content: any) => {
            let response: any = JSON.parse(content);
            callback(response);
        });
    }

    /**
     * 获取活动中邀请活动的活动介绍和活动时间
     * content
       time
       status=1 显示，=0不显示
     */
    getInviteActInfo(callback: Function): void {
        if (1) return;
        let _url: string = CCGlobalGameConfig.getCfgByField("urlCfg.wxRedUrl");
        CCalien.Ajax.GET(_url, { action: "share" }, (content: any) => {
            let response: any = JSON.parse(content);
            callback(response);
        });
    }

    /**
     * 获取商城中兑换支付宝红包的活动介绍和活动时间
     * content
       time
       status=1 显示，=0不显示
     */
    getExchangeAliInfo(callback: Function): void {
        let _uid = CCGlobalUserData.instance.getUid();
        let _platform = CCalien.Native.instance.getChannelName();
        CCalien.Ajax.GET(CCGlobalGameConfig.WEB_SERVICE_URL + "/user/showAlipayRedCoin", { uid: _uid, platform: _platform }, (content: any) => {
            let response: any = JSON.parse(content);
            callback(response);
        });
    }

    /**
     * 获取奖券排行榜
     */
    getRanklist(): void {
        let _uid = CCGlobalUserData.instance.getUid();
        CCalien.Ajax.GET(CCGlobalGameConfig.WEB_SERVICE_URL + "/notify/rankingList", { uid: _uid }, (content: any) => {
            let response: any = JSON.parse(content);
            if (response.code != 0) return;

            let _event = new egret.Event(CCGlobalEventNames.USER_REDCOIN_RANKING_LIST_REP);
            _event.data = { list: response.data };
            ccserver.dispatchEvent(_event);
        });
    }

    /**
     * 获取邀请排行榜
     */
    getInviteRankList(callback: Function): void {
        let _uid = CCGlobalUserData.instance.getUid();
        CCalien.Ajax.GET(CCGlobalGameConfig.WEB_SERVICE_URL + "/notify/shareRedCoin", { uid: _uid }, (content: any) => {
            let response: any = JSON.parse(content);
            if (response.code != 0) return;
            callback(response.data);
        });
    }

    /**
     * 获取德州扑克的上局记录
     */
    getDzpkHistory(callback: Function): void {
        let _uid = CCGlobalUserData.instance.getUid();
        CCalien.Ajax.GET(CCGlobalGameConfig.WEB_SERVICE_URL + "poker/gamelog", { uid: _uid }, (content: any) => {
            let response: any = JSON.parse(content);
            callback(response);
        });
    }

    /**
     * 实名认证
     */
    postRealNameAuth(sName: string, sId: string, callback: Function): void {
        let data = CCGlobalUserData.instance;
        let uid = data.getUid();
        let token = data.getToken()
        CCalien.Ajax.POST(CCGlobalGameConfig.WEB_SERVICE_URL + "user/realName", { uid: uid, name: sName, idcard: sId, token: token }, (content: any) => {
            let response: any = JSON.parse(content);
            if (response.code == 0) {
                CCDDZMainLogic.instance.selfData.realName = true;
            }
            callback(response);
        });
    }

    /**
     * 获取游戏中页面跳转的url配置
     */
    getGameUrlsCfg(callback: Function): void {
        let data = CCGlobalUserData.instance;
        let uid = data.getUid();
        let token = data.getToken();
        CCalien.Ajax.GET(CCGlobalGameConfig.WEB_SERVICE_URL + "activity/gameurl", { uid: uid, token: token }, (content: any) => {
            let response: any = JSON.parse(content);
            if (response.code == 0) {
                callback(response.data);
            }
        });
    }
}

let ccddzwebService = new CCWebService();