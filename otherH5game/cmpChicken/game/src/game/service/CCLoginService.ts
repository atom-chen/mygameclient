/**
 * Created by zhu on 17/11/06.
 */

class CCLoginService extends CCService {
	private static _instance: CCLoginService;
	
	//定时重连的interval;
	private _reconnectLoginInterval:number = 0;
    private _loginData: any = { uid: 0,token: '' };
    private _bCanReconnect:boolean;
	public static get instance(): CCLoginService {
		if (this._instance == undefined) {
			this._instance = new CCLoginService();
			this._instance.init();
		}
		return this._instance;
	}

	public init(): void {
		ccserver.addEventListener(CCGlobalEventNames.USER_LOGIN_RESPONSE,this._onLoginResponse,this);
		ccserver.addEventListener(CCGlobalEventNames.CONNECT_SERVER,this._onConnectToServer,this);
        CCalien.CCDDZDispatcher.addEventListener(CCGlobalEventNames.ACCOUNT_ERROR,this._onAccountError,this);
	}

    private _openNewWindow(url,name,iWidth,iHeight){
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
        ccserver.login(this._loginData.uid,this._loginData.token);
    }

	/**
	 * 游戏服务器登录结果返回,如果成功则
	 */
    private _onLoginResponse(event: egret.Event): void {
        let data = event.data;
        this._clearReconnectInterval();
        switch(data.code) {
            case 0:
                this._setCanReconnect(true);
			    CCGlobalGameConfig.getExAliRedInfo();
                CCGlobalGameConfig.initGameUrlsCfg(()=>{
                    CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.LOGIN_SUCCESS);
                    ccserver.checkReconnect();
                })
                break;
            default:
                CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.HIDE_WAITING);
				if(data.errorId == 105){
					CCDDZToast.show(CCalien.StringUtils.format(lang.loginError[1100],lang.loginError[data.errorId] + ' uid  ' + this._loginData.uid));
				}else{
					CCDDZToast.show(CCalien.StringUtils.format(lang.loginError[1100],lang.loginError[data.errorId]));
				}
                
                this._onAccountError();
				//token验证失效
				if(data.errorId == 103){
					this.doRelogin();
				}else{
                    CCDDZSceneLoading.setLoadingText("验证登录失败:"+data.errorId);
                }
        }
    }

    //H5跳转新公众号
    private _doRedirectH5WX(unionid:string,url:string):void{
        window.top["redirectWX"](unionid);
    }

	//web验证code返回
    public onVerifyResponse(response): void {
        if(response) {
            console.log("onVerifyResponse====>",response.code);
            if(response.hasOwnProperty('code')) {  //兼容老版本
                let code = response.code;
                if(response.code == 6666){ //新公众号
                     let _unionId = response.data.unionid;
                     let _url = response.data.url;
                     if(CCalien.Native.instance.isNative){

                     }else{
                         this._doRedirectH5WX(_unionId,_url);
                     }
                    return;
                }else if(response.code == 2020){ //需要绑定手机号
                    let data = response.data;
                    data.showClose = false;
                    CCDDZPanelBindPhone.getInstance().show(1,data,function(){
                        CCDDZMainLogic.instance.doRestartGame();
                    });
                    return;
                }

                if(code == 0) {
                    this.tryLogin(response.data);
                } else {
                    CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.HIDE_WAITING);
                    if(code > 10) {
                        CCDDZToast.show(lang.loginError[code] + " " + JSON.stringify(response.data));
                    }
                    
                    CCDDZSceneLoading.setLoadingText("授权失败:" + code);
                }
            } else {
                this.tryLogin(response);
            }

        } else {
            CCDDZToast.show(lang.loginError[2013]);
            
            CCDDZSceneLoading.setLoadingText("授权失败");
            CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.HIDE_WAITING);
        }
    }

	/**
	 * 验证code成功，登录游戏服务器
	 */
    private tryLogin(data: any) {
        this._loginData = data;
        let userData: CCGlobalUserData = CCGlobalUserData.instance;
        userData.setUid(this._loginData.uid);
        userData.setSk(this._loginData.sk);
        userData.setItem('username',this._loginData.username);
        userData.setItem('type',this._loginData.type);
        userData.setBindPhone(this._loginData.bindinfo);
        userData.saveLocalPhone(data.phone);
        userData.setToken(this._loginData.token,true);

        let _uid = this._loginData.uid;
        if(CCalien.Native.instance.isNative && egret.Capabilities.os == "Android"){
            CCalien.Native.instance.getAppChannelId(function(channelId){
                ccddzwebService.doBindChannel(_uid,channelId)
            })
        }
        

        if(!this._loginData.sk){
            CCDDZReportor.instance.reportCodeError("sk error tryLogin");
        }
        ccddzwebService.doUserInit(this._loginData.uid);
        CCGlobalWxHelper.doWebH5ShareCfg();
        CCGlobalGameConfig.initServer(data.server);
        CCDDZSceneLoading.setLoadingText("验证登录中。。。");
        ccserver.connect();
        //ccserver.tryConnect(this._loginData.uid);
    }
    
    /**
     * 微信公众号登录
     */
    public doWebWXLogin():void{
		let cc_nativeBridge = CCalien.Native.instance;
		let _param = cc_nativeBridge.getUrlArg();

        var code: string = _param.wx_code;
        if(code && code != "null") { 
            var sk: string = _param.share_sk;            
            if (!sk)
                sk="";

            CCDDZSceneLoading.setLoadingText("微信授权。。。");
            let cc_nativeBridge = CCalien.Native.instance;
            let _urlParam = cc_nativeBridge.getUrlArg();
            let _packageName = "cn.htgames.doudizhu.wechat";
            let _unionId = null;
            if(_urlParam.unionid && _urlParam.unionid != 0){
                _unionId = _urlParam.unionid;
                _packageName = 'cn.htgames.doudizhu.wechat.new';
            }
            
            if(_urlParam.oldWx=="1"){
                _packageName = 'cn.htgames.doudizhu.wechat_old';
            }

            if(cc_nativeBridge.isWxQr()){
                _packageName = "cn.htgames.doudizhu.qrcode";
            }
            ccddzwebService.loginByWxFromWechat(code,sk,_unionId,_packageName,this.onVerifyResponse.bind(this));
        }
    }


    /**
     * 支付宝生活号
     */
    doWebAliLogin():void{
		let cc_nativeBridge = CCalien.Native.instance;
		let _param = cc_nativeBridge.getUrlArg();
        var code: string = _param.ali_code;
        if(code && code != "null") { 
            var sk: string = _param.share_sk;            
            if (!sk)
                sk="";

            let cc_nativeBridge = CCalien.Native.instance;
            let _urlParam = cc_nativeBridge.getUrlArg();
            let _unionId = null;
            if(_urlParam.unionid && _urlParam.unionid != 0){
                _unionId = _urlParam.unionid;
            }

            ccddzwebService.loginByAliH5(code,sk,_unionId,this.onVerifyResponse.bind(this));
        }
    }

    /**
     * APP微信登录
     */
    public doAppWxLogin(){
        let _self = this;
        ccddzwebService.loginWXApp(function(response){
            _self.onVerifyResponse(response);
        });
    }

	/**
	 * 服务器连接失败
	 */
    private _onTryConnectError(): void {
        CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.HIDE_WAITING);
    }

    private _hasLocalUidAndToken():boolean{
        let userData: CCGlobalUserData = CCGlobalUserData.instance;
        let uid = userData.getUid();
        let token = userData.getToken();
        return (uid != null &&token!=null);
    }

	/**
	 * 游戏断线后重连，先检查本地的token
	 */
    public checkLocalToken():boolean {
        let userData: CCGlobalUserData = CCGlobalUserData.instance;
        let uid = userData.getUid();
        let token = userData.getToken();
        if(lang.debug == 'true'){
            let uid_token:any = CCalien.CCDDZlocalStorage.getItem('uid_token');
            if(uid_token){
                uid_token = uid_token.split('|');
                if(uid_token.length >=2){
                    uid = uid_token[0];
                    token = uid_token[1];
                }
            }
        }
        console.log('uid:',uid,'|token:',token);
        if(token && token != "null" && uid ) {
            this._loginData.uid = uid;
            this._loginData.token = token;
            
            ccddzwebService.doUserInit(this._loginData.uid);
            ccddzwebService.getServer(uid,(response)=>{
                if(response.code == 0){
                    if(!userData.getToken()){
                        CCDDZReportor.instance.reportCodeError("sk error checkLocalToken");
                    }

                    CCGlobalGameConfig.initServer(response.data);
                    
                    CCDDZSceneLoading.setLoadingText("连接游戏服务器。。。");
                    ccserver.connect();
                }else{
                    CCDDZSceneLoading.setLoadingText("获取服务器地址错误");
                }
            })
            //ccserver.tryConnect(uid,null,this._onTryConnectError.bind(this));
            return true;
        }else{
            this._clearReconnectInterval();
        }
        return false;
    }

    /**
     * token验证失效 要清除本地的token,否则断线重连后自动登录形成死循环
     */
    private _clearToken():void{
        this._loginData.token = null;
        let userData: CCGlobalUserData = CCGlobalUserData.instance;
        userData.setToken("null",true);
    }

    /**
     * 是否可以重连（如果是APP 在token失败的情况下不可以自动重连,必须在重新登录微信）
     */
    private _setCanReconnect(bCan:boolean):void{
        this._bCanReconnect = bCan;
    }

    /**
     * 账号异常
     */
    private _onAccountError():void{
        this._setCanReconnect(false);
        this._clearToken();
        CCDDZMainLogic.instance.stop();
    }

    /**
     * 显示遮罩并等待
     */
    public showWaitAndTryConnect():void{
        CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.SHOW_WAITING,{content:""});
        this.tryReconnectLogin();
    }

    /**
     * 断线重连登录
     */
	tryReconnectLogin():void{
		if(this._reconnectLoginInterval !=0) return;
        
        let _nCount = 0;
        this._clearReconnectInterval();		
        let _func = function(){
            ccserver.close();
            if(_nCount >=3){
                CCDDZMainLogic.instance.showDisconnect({ content: lang.disconnect_server});
                this._clearReconnectInterval();	
                return;
            }else if(_nCount >=2){
                CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.SHOW_WAITING,{content:"重连中。。。"});
            }
            _nCount += 1;
            console.log("tryReconnectLogin------>",_nCount,this._bCanReconnect);
            if(!this._bCanReconnect) {
                this._clearReconnectInterval();
                CCDDZMainLogic.instance.showMostTopTip({ content: lang.disconnect_kick_out[3] });
                return;
            }

            CCLoginService.instance.doReconnectLogin();
        }.bind(this);

        this._reconnectLoginInterval = egret.setInterval(function(){
            _func();
        },this,5000);
        _func();
	}

	//清除重连的interval
	_clearReconnectInterval():void{
		if(this._reconnectLoginInterval != 0){
			egret.clearInterval(this._reconnectLoginInterval);
		}
		this._reconnectLoginInterval = 0;
	}

    /**
     * 需要重新登录（账号在其他设备登录或者是token失效）
     */
    public doRelogin():void{
        this._setCanReconnect(false);
        this._clearToken();
        //微信公众号登录
        if(CCalien.Native.instance.isWXMP){
            window.top['reqWXCode']();
        }else if(CCalien.Native.instance.isAli()){
            window.top['reqAliCode']();
        }
        else{
            CCDDZMainLogic.instance.showLogin();
        }
    }

    /**
     * 断线重连走此函数
     * 需要确定可以重连在调用此函数
     */
    public doReconnectLogin():void{
        console.log("doReconnectLogin---->");
        if(!this.checkLocalToken()){
            CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.HIDE_DISCONNECT);
            CCalien.CCDDZSceneManager.show(CCGlobalSceneNames.LOGIN,{ autoLogin: true,isFirstIn: true},CCalien.CCDDZsceneEffect.CCDDFade);
        }
    }
}