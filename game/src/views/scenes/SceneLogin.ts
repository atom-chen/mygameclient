/**
 * Created by rockyl on 15/12/2.
 *
 * 登录场景
 */

import SceneManager = alien.SceneManager;

class SceneLogin extends alien.SceneBase {
    private grpSelectButton: eui.Group;
    private _autoLogin: boolean;
    private _loginData: any = { uid: 0,token: '' };
    
    /**
     * 试玩登录
     */
    private guest_btn:eui.Button;

    /**
     * 手机登录
     */
    private phone_btn:eui.Button;

    /**
     * 微信的登录
     */
    private wx_btn:eui.Button;

    constructor() {
        super();

        this.init();
    }

    private init(): void {
        this.skinName = scenes.SceneLoginSkin;
    }

    protected createChildren(): void {
        super.createChildren();
        let e: alien.EventManager = alien.EventManager.instance;
        alien.Dispatcher.addEventListener(EventNames.LOGIN_SUCCESS,this._onLoginSuccess,this);
        e.registerOnObject(this,this.grpSelectButton,egret.TouchEvent.TOUCH_TAP,this.onGrpSelectButtonTap,this);
        
        this.initBtnsByChannel();
    }

    /**
     * 初始化登录选项
     */
    private initBtnsByChannel():void{
        let _nativeBridge = alien.Native.instance;
        if(!_nativeBridge.isNative){
            if(lang.debug == "true"){
                this.currentState = "all";
            }else{
                if(!_nativeBridge.isWXMP && !_nativeBridge.isAli()){
                    let _platform = egret.Capabilities.os; 
                    if(_platform != "Android" && _platform != "iOS"){
                        this.currentState = "wxPhone";
                    }else{
                        this.currentState = "justPhone";
                    }
                }else{
                    this.grpSelectButton.visible = false;
                }
            }
        }else{
            this.currentState = "justWx";
        }
    }

    private _openNewWindow(url,name,iWidth,iHeight){
        let newWindow = null;
        //获得窗口的垂直位置 
        var iTop = (window.screen.availHeight - 30 - iHeight) / 2; 
        //获得窗口的水平位置 
        var iLeft = (window.screen.availWidth - 10 - iWidth) / 2; 
        newWindow = window.open(url, name, 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no'); 
    }

    private waitTimeOut: number;
    private onGrpSelectButtonTap(event: egret.TouchEvent): void {
        if(alien.Native.instance.isNative) {
            //alien.Dispatcher.dispatch(EventNames.SHOW_WAITING,{ content: lang.login_waiting });
            this.waitTimeOut = setTimeout(() => {
                alien.Dispatcher.dispatch(EventNames.HIDE_WAITING);
            },15000);
        }
        let _loginService = LoginService.instance;
        switch(event.target.name) {
            case 'quick':
                webService.fastLogin(_loginService.onVerifyResponse.bind(_loginService));
                break;
            case 'input':
                PanelLogin.instance.show(this.onPanelLoginResult.bind(this));
                break;
            case 'weixin':
                // this._openNewWindow("http://d.htgames.cn/qrcode.html","微信授权",800,700);
                if(alien.Native.instance.isNative){
                    LoginService.instance.doAppWxLogin();
                }else{
                    if(lang.debug == "true"){ //手机登录
                        PanelLogin.instance.show(this.onPanelLoginResult.bind(this));
                    }else{ //扫码登录
                        if(!alien.Native.instance.isWXMP){
                            window.top["openWXQRCode"]();
                        }
                    }
                }
                break;
            case 'phone':
                PanelPhoneLogin.getInstance().show();
                break;
        }
    }

    private onPanelLoginResult(action: string,params: any): void {
        let _loginService = LoginService.instance;
        switch(action) {
            case 'close':

                break;
            case 'confirm':
                //alien.Dispatcher.dispatch(EventNames.SHOW_WAITING,{ content: lang.login_waiting });
                // webService.login(params.id,params.password,_loginService.onVerifyResponse.bind(_loginService));
               _loginService.tryLogingameserver(params);
                break;
        }
    }
    
    /**
     * 登录成功
     */
    private _onLoginSuccess():void{
        PanelLogin.instance.close();
    }

    beforeShow(params: any): void {
        webService.loadLog(1,0);
        alien.EventManager.instance.enableOnObject(this);
        //非公众号登录游戏要先检查本地的token并到web验证,如果验证成功，直接登录游戏
        if(!alien.Native.instance.isWXMP){
            LoginService.instance.checkLocalToken();
        }
    }

    onShow(params: any): void {
       /* if(params && params.logout) {
            //PanelLogin.instance.show(this.onPanelLoginResult.bind(this));
            alien.Native.instance.authenticate(0,this.onVerifyResponse.bind(this));
        }*/
    }

    beforeHide(): void {
        if(this.waitTimeOut)
            clearTimeout(this.waitTimeOut);
            
        alien.EventManager.instance.disableOnObject(this);
    }
}