/**
 * Created by zhu on 17/11/06.
 */

class PDKLoginService extends PDKService {
    private static _instance: PDKLoginService;

    private _loginData: any = { uid: 0, token: '' };
    private _bCanReconnect: boolean;
    public static get instance(): PDKLoginService {
        if (this._instance == undefined) {
            this._instance = new PDKLoginService();
            this._instance.init();
        }
        return this._instance;
    }

    public init(): void {
        pdkServer.addEventListener(PDKEventNames.USER_LOGIN_RESPONSE, this._onLoginResponse, this);
        pdkServer.addEventListener(PDKEventNames.CONNECT_SERVER, this._onConnectToServer, this);
        PDKalien.Dispatcher.addEventListener(PDKEventNames.ACCOUNT_ERROR, this._onAccountError, this);
    }

    private _openNewWindow(url, name, iWidth, iHeight) {
        let newWindow = null;
        //获得窗口的垂直位置 
        var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
        //获得窗口的水平位置 
        var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
        newWindow = window.open(url, name, 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no');
    }

	/**
	 * 连接游戏服务器成功
	 */
    private _onConnectToServer(event: egret.Event): void {
        pdkServer.login(this._loginData.uid, this._loginData.token);
    }

	/**
	 * 游戏服务器登录结果返回,如果成功则
	 */
    private _onLoginResponse(event: egret.Event): void {
        let data = event.data;
        switch (data.code) {
            case 0:
                this._setCanReconnect(true);
                PDKGameConfig.initGameUrlsCfg(() => {
                    PDKalien.Dispatcher.dispatch(PDKEventNames.LOGIN_SUCCESS);
                    pdkServer.checkReconnect();
                })

                break;
            default:
                PDKalien.Dispatcher.dispatch(PDKEventNames.HIDE_WAITING);
                if (data.errorId == 105) {
                    PDKToast.show(PDKalien.StringUtils.format(PDKlang.loginError[1100], PDKlang.loginError[data.errorId] + ' uid  ' + this._loginData.uid));
                } else {
                    PDKToast.show(PDKalien.StringUtils.format(PDKlang.loginError[1100], PDKlang.loginError[data.errorId]));
                }

                this._onAccountError();
                //token验证失效
                if (data.errorId == 103) {
                    this.doRelogin();
                } else {
                    PDKSceneLoading.setLoadingText("验证登录失败:" + data.errorId);
                }
        }
    }

    //H5跳转新公众号
    private _doRedirectH5WX(unionid: string, url: string): void {
        window.top["redirectWX"](unionid);
    }

    //web验证code返回
    public onVerifyResponse(response): void {
        if (response) {
            console.log("onVerifyResponse====>", response.code);
            //PDKToast.show(JSON.stringify(response));
            if (response.hasOwnProperty('code')) {  //兼容老版本
                let code = response.code;
                if (response.code == 6666) { //新公众号
                    let _unionId = response.data.unionid;
                    let _url = response.data.url;
                    if (PDKalien.Native.instance.isNative) {

                    } else {
                        this._doRedirectH5WX(_unionId, _url);
                    }
                    return;
                } else if (response.code == 2020) { //需要绑定手机号
                    PDKPanelBindPhone.getInstance().show(response.data);
                    return;
                }

                if (code == 0) {
                    this.tryLogin(response.data);
                } else {
                    PDKalien.Dispatcher.dispatch(PDKEventNames.HIDE_WAITING);
                    if (code > 10) {
                        PDKToast.show(PDKlang.loginError[code] + " " + JSON.stringify(response.data));
                    }

                    PDKSceneLoading.setLoadingText("授权失败:" + code);
                }
            } else {
                this.tryLogin(response);
            }

        } else {
            PDKToast.show(PDKlang.loginError[2013]);

            PDKSceneLoading.setLoadingText("授权失败");
            PDKalien.Dispatcher.dispatch(PDKEventNames.HIDE_WAITING);
        }
    }

	/**
	 * 验证code成功，登录游戏服务器
	 */
    private tryLogin(data: any) {
        this._loginData = data;
        let userData: PDKUserData = PDKUserData.instance;
        console.log("tryLogin-----------》", userData);
        userData.setItem('uid', this._loginData.uid);
        userData.setItem('sk', this._loginData.sk);
        userData.setItem('username', this._loginData.username);
        userData.setItem('type', this._loginData.type);
        userData.setItem('token', this._loginData.token, true);
        userData.setItem('bindinfo', this._loginData.bindinfo, true);
        userData.setItem('phone', this._loginData.phone, true);

        if (!this._loginData.sk) {
            PDKReportor.instance.reportCodeError("sk error tryLogin");
        }
        PDKWxHelper.doWebH5ShareCfg();
        PDKGameConfig.initServer(data.server);
        PDKSceneLoading.setLoadingText("验证登录中。。。");
        pdkServer.connect();
        //pdkServer.tryConnect(this._loginData.uid);
    }

    /**
     * 微信公众号登录
     */
    public doWebWXLogin(): void {
        let _pdk_nativeBridge = PDKalien.Native.instance;
        let _param = _pdk_nativeBridge.getUrlArg();

        var code: string = _param.wx_code;
        if (code && code != "null") {
            var sk: string = _param.share_sk;
            if (!sk)
                sk = "";


            PDKSceneLoading.setLoadingText("微信授权。。。");
            let _pdk_nativeBridge = PDKalien.Native.instance;
            let _urlParam = _pdk_nativeBridge.getUrlArg();
            let _packageName = PDKlang.package + ".wechat";
            let _unionId = null;
            if (_urlParam.unionid && _urlParam.unionid != 0) {
                _unionId = _urlParam.unionid;
                _packageName = PDKlang.package + '.wechat.new';
            }
            PDKwebService.loginByWxFromWechat(code, sk, _unionId, _packageName, this.onVerifyResponse.bind(this));
        }
    }

    /**
     * 支付宝生活号
     */
    doWebAliLogin(): void {
        let _pdk_nativeBridge = PDKalien.Native.instance;
        let _param = _pdk_nativeBridge.getUrlArg();
        var code: string = _param.ali_code;
        if (code && code != "null") {
            var sk: string = _param.ali_sk;
            if (!sk)
                sk = "";

            let _pdk_nativeBridge = PDKalien.Native.instance;
            let _urlParam = _pdk_nativeBridge.getUrlArg();
            let _unionId = null;
            if (_urlParam.unionid && _urlParam.unionid != 0) {
                _unionId = _urlParam.unionid;
            }

            PDKwebService.loginByAliH5(code, sk, _unionId, this.onVerifyResponse.bind(this));
        }
    }

    /**
     * APP微信登录
     */
    public doAppWxLogin() {
        let _self = this;
        PDKwebService.loginWXApp(function (response) {
            _self.onVerifyResponse(response);
        });
    }

	/**
	 * 服务器连接失败
	 */
    private _onTryConnectError(): void {
        PDKalien.Dispatcher.dispatch(PDKEventNames.HIDE_WAITING);
    }

	/**
	 * 游戏断线后重连，先检查本地的token
	 */
    public checkLocalToken(): boolean {
        let userData: PDKUserData = PDKUserData.instance;
        let uid = userData.getItem('uid');
        let token = userData.getItem('token');
        if (PDKlang.debug == 'true') {
            let uid_token: any = PDKalien.localStorage.getItem('uid_token');
            if (uid_token) {
                uid_token = uid_token.split('|');
                if (uid_token.length >= 2) {
                    uid = uid_token[0];
                    token = uid_token[1];
                }
            }
        }
        console.log('uid:', uid, '|token:', token);
        pdkServer.connect();
        // if (token && token != "null" && uid) {
        //     this._loginData.uid = uid;
        //     this._loginData.token = token;

        //     PDKwebService.getServer(uid, (response) => {
        //         if (response.code == 0) {
        //             if (!userData.getItem('token')) {
        //                 PDKReportor.instance.reportCodeError("sk error checkLocalToken");
        //             }

        //             PDKGameConfig.initServer(response.data);
        //             pdkServer.connect();
        //         } else {
        //             PDKSceneLoading.setLoadingText("获取服务器地址错误");
        //         }
        //     })
        //     //pdkServer.tryConnect(uid,null,this._onTryConnectError.bind(this));
        //     return true;
        // }
        return false;
    }

    /**
     * token验证失效 要清除本地的token,否则断线重连后自动登录形成死循环
     */
    private _clearToken(): void {
        this._loginData.token = null;
        let userData: PDKUserData = PDKUserData.instance;
        userData.setItem("token", "null", true);
    }

    /**
     * 是否可以重连（如果是APP 在token失败的情况下不可以自动重连,必须在重新登录微信）
     */
    private _setCanReconnect(bCan: boolean): void {
        this._bCanReconnect = bCan;
    }

    /**
     * 账号异常
     */
    private _onAccountError(): void {
        this._clearToken();
        PDKMainLogic.instance.stop();
    }

    /**
     * 需要重新登录（账号在其他设备登录或者是token失效）
     */
    public doRelogin(): void {
        this._setCanReconnect(false);
        this._clearToken();
        PDKalien.Dispatcher.dispatch(PDKEventNames.HIDE_MOSTTOP_TIP);
        //微信公众号登录
        if (PDKalien.Native.instance.isWXMP) {
            window.top['reqWXCode']();
        } else {
            PDKMainLogic.instance.showLogin();
        }
    }

    /**
     * 断线重连走次函数
     */
    public doReconnect(): void {
        if (!this._bCanReconnect) return;

        if (!this.checkLocalToken()) {
            console.error("doReconnect===>", this._loginData)
        }
    }
}