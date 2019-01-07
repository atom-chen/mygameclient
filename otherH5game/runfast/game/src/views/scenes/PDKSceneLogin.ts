/**
 * Created by rockyl on 15/12/2.
 *
 * 登录场景
 */

import PDKSceneManager = PDKalien.PDKSceneManager;

class PDKSceneLogin extends PDKalien.SceneBase {
    private grpSelectButton: eui.Group;
    private _autoLogin: boolean;
    private _loginData: any = { uid: 0, token: '' };

    /**
     * 试玩登录
     */
    private guest_btn: eui.Button;

    /**
     * 手机登录
     */
    private phone_btn: eui.Button;

    /**
     * 微信的登录
     */
    private wx_btn: eui.Button;

    constructor() {
        super();

        this.init();
    }

    private init(): void {
        this.skinName = scenes.PDKSceneLoginSkin;
    }

    protected createChildren(): void {
        super.createChildren();
        let e: PDKalien.PDKEventManager = PDKalien.PDKEventManager.instance;
        PDKalien.Dispatcher.addEventListener(PDKEventNames.LOGIN_SUCCESS, this._onLoginSuccess, this);
        e.registerOnObject(this, this.grpSelectButton, egret.TouchEvent.TOUCH_TAP, this.onGrpSelectButtonTap, this);

        this.initBtnsByChannel();
    }

    /**
     * 初始化登录选项
     */
    private initBtnsByChannel(): void {
        let _pdk_nativeBridge = PDKalien.Native.instance;
        if (!_pdk_nativeBridge.isNative) {
            if (PDKlang.debug == "true") {
                this.currentState = "all";
            } else {
                if (!_pdk_nativeBridge.isWXMP && !_pdk_nativeBridge.isAli()) {
                    let _platform = egret.Capabilities.os;
                    if (_platform != "Android" && _platform != "iOS") {
                        this.currentState = "wxPhone";
                    } else {
                        this.currentState = "justPhone";
                    }
                } else {
                    this.grpSelectButton.visible = false;
                }
            }
        } else {
            this.currentState = "justWx";
        }
    }

    private _openNewWindow(url, name, iWidth, iHeight) {
        let newWindow = null;
        //获得窗口的垂直位置 
        var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
        //获得窗口的水平位置 
        var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
        newWindow = window.open(url, name, 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no');
    }

    private waitTimeOut: number;
    private onGrpSelectButtonTap(event: egret.TouchEvent): void {
        if (PDKalien.Native.instance.isNative) {
            //PDKalien.Dispatcher.dispatch(PDKEventNames.SHOW_WAITING,{ content: PDKlang.login_waiting });
            this.waitTimeOut = setTimeout(() => {
                PDKalien.Dispatcher.dispatch(PDKEventNames.HIDE_WAITING);
            }, 15000);
        }
        let _loginService = PDKLoginService.instance;
        switch (event.target.name) {
            case 'quick':
                PDKwebService.fastLogin(_loginService.onVerifyResponse.bind(_loginService));
                break;
            case 'input':
                PDKPanelLogin.instance.show(this.onPanelLoginResult.bind(this));
                break;
            case 'weixin':
                // this._openNewWindow("http://d.htgames.cn/qrcode.html","微信授权",800,700);
                if (_pdk_nativeBridge.isNative) {
                    PDKLoginService.instance.doAppWxLogin();
                } else {
                    if (PDKlang.debug == "true") { //手机登录
                        PDKPanelLogin.instance.show(this.onPanelLoginResult.bind(this));
                    } else { //扫码登录
                        if (!_pdk_nativeBridge.isWXMP) {
                            window.top["openWXQRCode"]();
                        }
                    }
                }
                break;
            case 'phone':
                // if (RELEASE) {
                PDKPanelPhoneLogin.getInstance().show();
                // } else {
                //测试版使用账号密码
                // PDKwebService.fastLogin(_loginService.onVerifyResponse.bind(_loginService));
                //}
                break;
        }
    }

    private onPanelLoginResult(action: string, params: any): void {
        let _loginService = PDKLoginService.instance;
        switch (action) {
            case 'close':

                break;
            case 'confirm':
                //PDKalien.Dispatcher.dispatch(PDKEventNames.SHOW_WAITING,{ content: PDKlang.login_waiting });
                PDKwebService.login(params.id, params.password, _loginService.onVerifyResponse.bind(_loginService));

                break;
        }
    }

    /**
     * 登录成功
     */
    private _onLoginSuccess(): void {
        PDKPanelLogin.instance.close();
    }

    beforeShow(params: any): void {
        PDKwebService.loadLog(1, 0);
        PDKalien.PDKEventManager.instance.enableOnObject(this);
        //非公众号登录游戏要先检查本地的token并到web验证,如果验证成功，直接登录游戏
        if (!PDKalien.Native.instance.isWXMP) {
            PDKLoginService.instance.checkLocalToken();
        }
    }

    onShow(params: any): void {
        /* if(params && params.logout) {
             //PDKPanelLogin.instance.show(this.onPanelLoginResult.bind(this));
             PDKalien.Native.instance.authenticate(0,this.onVerifyResponse.bind(this));
         }*/
    }

    beforeHide(): void {
        if (this.waitTimeOut)
            clearTimeout(this.waitTimeOut);

        PDKalien.PDKEventManager.instance.disableOnObject(this);
    }
}