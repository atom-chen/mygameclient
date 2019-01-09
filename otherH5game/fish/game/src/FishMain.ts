/**
 * Created by eric.liu on 17/11/15.
 *
 * 入口
 */

class FishMain extends eui.UILayer {
    //加载进度界面
    private loadingView: FishLoading;

    //状态
    private isThemeLoadEnd: boolean = false;
    private isResourceLoadEnd: boolean = false;

    //网络
    private loginData: any = { uid: 0,token: '' };

    private static _instance = null;
    public static GetInstance() : FishMain {
        return FishMain._instance;
    }

    //构造函数
    constructor(params:any) {
        super();
        this.isThemeLoadEnd = false;
        this.isResourceLoadEnd = false;
        let self:FishMain = this;
        FishMain._instance = this;
        if (!FISH_MODE_INDEPENDENT && params) {
            //接管斗地主那边传入的dispatcher，用于网络相关的消息传递
            fishServer.initFromParams(params);
        }
    }

    //继承自父类，类似于onCreate
    protected createChildren(): void {
        super.createChildren();
        let self:FishMain = this;
        this.stage.setContentSize(1280,720);
        //发布版屏蔽log
        if (RELEASE) {
            if(FISH_MODE_INDEPENDENT){
                console.log = function(){};
            }
        }

        //注入自定义的素材解析器
        let assetAdapter = new FishAssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new FishThemeAdapter());

        //初始化js bridge
        FishJsBridge.getInstance();

        //微端模式
        if (FISH_MODE_MICROCLIENT) {
            //资源加载线程
            RES.setMaxLoadingThread(8);

            //初始化微端
            let param:any = {};
            param['wxAppId'] = 'wx8b9e89cb045df35b';
            // param['deAppId'] = '';
            // param['deChannelId'] = '';
            // param['xgDebug'] = false;
            // param['xgAccount'] = '';
            // param['xgTag'] = '';
            FishNativeBridge.getInstance().CallNative('initNativeGame', JSON.stringify(param));

            //显示登录窗口
            let loginScene:FishLogin = new FishLogin(function(arg, obj) {
                let self:FishMain = arg;
                //TODO:调起微信登录
                //let _loginScene:FishLogin = obj;
                //self.removeChild(_loginScene);
                //self.loadGame();
                FishNativeBridge.getInstance().CallNative('loginByWechat', '');
            }, self);
            self.addChildAt(loginScene, 0);
        } else {
            //直接加载
            self.loadGame();
        }
    }
    
    private loadGame() {
        let self:FishMain = this;
        //设置加载进度界面
        self.loadingView = new FishLoading(function(arg) {
            let self:FishMain = arg;
            //PS:loading资源加载完毕后，再加载default资源
            //初始化Resource资源加载库
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, self.onConfigComplete, self);
            RES.loadConfig("resource/fish.default.res.json", "resource/");
        }, self);
        self.stage.addChild(self.loadingView);
    }

    //配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);

        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        let theme = new eui.Theme("resource/fish.default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("fish_preload", 0);
    }

    //主题文件加载完成,开始预加载
    private onThemeLoadComplete(): void {
        this.isThemeLoadEnd = true;
        this.createScene();
    }
    
    //preload资源组加载完成
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "fish_preload") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.isResourceLoadEnd = true;
            this.createScene();
        }
    }
    
    //创建场景
    private createScene() {
        let self:FishMain = this;
        if (self.isThemeLoadEnd && self.isResourceLoadEnd) {
            //模式判断
            if (FISH_MODE_EDITOR) {
                //路径编辑器模式
                FishJsBridge.getInstance().tsCallJsFunc('settitle', FISH_GAME_NAME+' '+FISH_MODE_EDITOR_TITLE);
                //创建编辑器场景
                let pathEditor:FishPathEditor = new FishPathEditor();
                self.addChildAt(pathEditor, 0);
                self.stage.removeChild(self.loadingView);
                return;
            } else if (FISH_MODE_INDEPENDENT) {
                //单款模式
                FishJsBridge.getInstance().tsCallJsFunc('settitle', FISH_GAME_NAME+' '+FISH_VERSION);
                //WEBGL开启跨域图片（需要web服务器支持）
                egret.ImageLoader.crossOrigin = "anonymous";
                //数据初始化
                FishUtils.GameConfig.init();
                FishUserData.instance.loadData();
                //FishUtils.localStorage.init(GameConfig.gameName);
                FishUtils.localStorage.init('ddz');
                //网络事件
                let e: FishUtils.EventManager = FishUtils.EventManager.instance;
                e.registerOnObject(self, fishServer, FishEvent.USER_LOGIN_RESPONSE, self.onLoginResponse, self);
                e.registerOnObject(self, fishServer, FishEvent.CONNECT_SERVER, self.onConnectToServer, self);
                e.registerOnObject(self, fishServer, FishEvent.USER_CHECK_RECONNECT_REP, self.onCheckReconnectRep, self);
                e.enableOnObject(self);
                //获取配置
                self.loadingView.setLoadingText('正在获取配置...');
                FishUtils.GameConfig.getUrl(()=>{
                    //网络服务
                    fishServer.ready();
                    //微信公众号单款模式
                    self.loadingView.setLoadingText('微信认证中.');
                    if (FISH_MODE_WXMP) {
                        let code = FishUtils.localStorage.getItem("wx_login_code_wechat");
                        if (code && code != "null" && !FishUtils.Native.instance.isNative) {
                            FishUtils.Native.instance.isWXMP = true;
                            if (window.top["isWXReady"]()) {
                                self.loadingView.setLoadingText('微信认证中..');
                                self.onWXReadyCallInit();
                                self.doWebWXLogin();
                            } else {
                                let __this = self;
                                __this.loadingView.setLoadingText('微信认证中...');
                                // window.top["onWXReadyFunc"](()=>{
                                //     FishMain.GetInstance().loadingView.setLoadingText('正在登录......');
                                //     FishMain.GetInstance().onWXReadyCallInit();
                                //     FishMain.GetInstance().doWebWXLogin();
                                // });
                                var counter = egret.getTimer();
                                var intervalId = egret.setInterval(function(_self, _intervalId) {
                                    if (window.top["isWXReady"]() || egret.getTimer()-counter > 3000) {
                                        egret.clearInterval(_intervalId);
                                        _self.onWXReadyCallInit();
                                        _self.doWebWXLogin();
                                    }
                                }, self, 1000, self, intervalId);
                            }
                        } else {
                            self.loadingView.setLoadingText('微信认证异常，请重试:'+code);
                        }
                    } else {
                        //申请快速认证并登录
                        fishWebService.fastLogin(self.onVerifyLoginResponse.bind(self));
                    }
                });
            } else {

                let e: FishUtils.EventManager = FishUtils.EventManager.instance;
                e.registerOnObject(self, fishServer, FishEvent.USER_CHECK_RECONNECT_REP, self.onCheckReconnectRep, self);
                e.enableOnObject(self);

                //接入模式
                //WEBGL开启跨域图片（需要web服务器支持）
                egret.ImageLoader.crossOrigin = "anonymous";
                //数据初始化
                FishUtils.GameConfig.init();
                FishUserData.instance.loadData();
                //网络服务
                fishServer.ready();
                
                //检测断线
                fishServer.checkReconnect();

                //进入捕鱼游戏
                //this.startCreateScene();
            }
        }
    }

    //资源组加载出错
    private onItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    //资源组加载出错
    private onResourceLoadError(event:RES.ResourceEvent):void {
        console.warn("Group:" + event.groupName + " has failed to load");

        //忽略加载失败的项目
        this.onResourceLoadComplete(event);
    }

    //preload资源组加载进度
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "fish_preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    //创建场景界面
    protected startCreateScene(session:number=0): void {
        let self:FishMain = this;
        //禁用事件
        let e: FishUtils.EventManager = FishUtils.EventManager.instance;
        e.disableOnObject(this);

        //加载捕鱼场景
        let fishScene:FishScene = new FishScene(self.loginData, session);
        this.addChildAt(fishScene, 0);
        fishScene.visible = false;
        egret.setTimeout(function(__this, __fishScene) {
            //增加过渡时间，去掉过渡黑屏
            __fishScene.visible = true;
            //修改css样式
            FishJsBridge.getInstance().tsCallJsFunc('setstyle');
            __this.stage.removeChild(__this.loadingView);
        }, this, 500, this, fishScene);
    }

    //认证响应
    private onVerifyLoginResponse(response): void {
        let self:FishMain = this;
        self.loadingView.setLoadingText('微信认证结果:'+response);
        if (response) {
            if (response.hasOwnProperty('code')) {  //兼容老版本
                let code = response.code;
                if (code == 0) {
                    self.tryLogin(response.data);
                } else {
                    console.log(langFish.loginError[code] + " " + JSON.stringify(response.data));
                    self.loadingView.setLoadingText('微信认证失败，请重试');
                }
            } else {
                self.tryLogin(response);
            }
        } else {
            self.loadingView.setLoadingText('微信认证失败，请重试..');
        }
    }

    //尝试登录
    private tryLogin(data: any) {
        let self:FishMain = this;
        this.loginData = data;
        let userData: FishUserData = FishUserData.instance;
        userData.setItem('uid', this.loginData.uid);
        userData.setItem('sk', this.loginData.sk);
        userData.setItem('username', this.loginData.username);
        userData.setItem('type', this.loginData.type);
        userData.setItem('token', FishUtils.Native.instance.isNative ? this.loginData.token : this.loginData.token,true);
        userData.setItem('isbind', this.loginData.is_bind);
        userData.setItem('server', this.loginData.server);
        FishUtils.GameConfig.SERVER_URL = this.loginData.server;
        FishUtils.GameConfig.init_SERVER_URL_TAIL();
        self.loadingView.setLoadingText('连接游戏服务器..');
        fishServer.tryConnect(this.loginData.uid);
    }

    //微信登录
    public doWebWXLogin():void{
        let self:FishMain = this;
        let _nativeBridge = FishUtils.Native.instance;
		let _param = _nativeBridge.getUrlArg();
        var code: string = _param.wx_code;
        if (code && code != "null") {
            self.loadingView.setLoadingText('微信认证中....');
            var sk: string = FishUtils.localStorage.getItem("wx_login_code_wechat_sk");            
            if (!sk)
                sk="";
            fishWebService.loginByWxFromWechat(code, sk, self.onVerifyLoginResponse.bind(self));
        } else {
            //self.loadingView.setLoadingText('获取微信code失败');
        }
    }

    //连接成功
    private onConnectToServer(event: egret.Event): void {
        let self:FishMain = this;
        self.loadingView.setLoadingText('正在登录...');
        fishServer.login(this.loginData.uid, this.loginData.token);
    }

    //登录返回
    private onLoginResponse(event: egret.Event): void {
        let self:FishMain = this;
        let data = event.data;
        let _data = JSON.stringify(data);
        switch(data.code) {
            case 0:
                self.loadingView.setLoadingText('正在进入游戏...');
                FishUtils.Native.instance.userLogin(fishServer.uid, self.loginData.token);
                fishServer.checkReconnect();
                break;
            default:
                self.loadingView.setLoadingText('登录失败，请重试');
                fishServer.close();
                break;
        }
    }

    //重复连接
    private onCheckReconnectRep(event: egret.Event): void {
        let self:FishMain = this;
        let data: any = event.data;
        console.log("onCheckReconnectRep===========>",data);
        if (data.roomid == 0) {
            //初次进入
            self.startCreateScene();
        } else {
            //重连进入
            self.startCreateScene(data.session);
        }
    }

    //初始化微信配置
	private onWXReadyCallInit():void{
		var _native = FishUtils.Native.instance;
		if(_native.isNative) return;
		_native.initWXFunc();
        _native.wxConfig();
        _native.setShareParam();
	}
}
