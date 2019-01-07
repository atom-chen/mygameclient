/**
 * Created by rockyl on 16/3/9.
 */
module PDKalien {
    export class Native extends egret.EventDispatcher {
        private static _instance: Native;

        public static get instance(): Native {
            if(this._instance == undefined) {
                this._instance = new Native();
            }
            return this._instance;
        }
        /**
         * 微端
         */
        private isMiniApp:boolean = false;
        private _dicCall: any = {};
        private _wxApi:any;
        private _channelId:string = null;
        /**
         * H5重定向到游戏带的参数
         */
        private _urlParams:any = {};

        constructor() {
            super();
            egret.ExternalInterface.addCallback('nativeCall',this.nativeCall.bind(this));
            this._initDefaultWX();
            this._initData();
        }

        /**
         * 初始化默认数据
         */
        private _initData():void{
            this._isAli = false;
            this._isWXMP = false;
            this.isMiniApp = false;
            this._channel = "self";
            this._urlParams = PDKUtils.getUrlParams();
            if(this.isAndroidWebView()){
                let log = this._urlParams.showLog;
                if( log && log == 1){
                    this.callAndroidFunc("enableLog",true);
                }else{
                    this.callAndroidFunc("enableLog",false);
                }
            }
        }

        /**
         * android webview 模式，调用java 的方法
         */
        public callAndroidFunc(sName:string,param:any){
             window["javaBridge"][sName](param);
        }

        /**
         * 获取游戏重定向后带的参数
         */
        public getUrlArg():any{
            return this._urlParams;
        }

        /**
         * 设置当前是否在微端
         */
        public setInMiniApp(bMini:boolean):void{
            this.isMiniApp = bMini||false;
        }

        /**
         * 初始化默认的空的微信接口
         */
        private _initDefaultWX():void{
           this._wxApi = {
                initBridge:function(callback){

                },
                config:function(response){

                },
                share:function(params,callback){

                },
                recharge:function(response,callback){

                },
                getLocation:function(callback){

                }
            }
        }

        /**
         * 微信接口的定义
         */
        public initWXFunc():void{
            if(this.isNative) return;

            if(window.top && window.top['wxApi']){
                this._wxApi = window.top['wxApi'];
            }else{
                PDKwebService.postError(PDKErrorConfig.REPORT_ERROR,"Native _initWXFunc=>"+ PDKversion + "|uuid" + PDKwebService.uuid +"wxApi error");
            }
        }

		/**
		 * 直接调用native方法
		 * @param method
		 * @param params
		 * @param callback
		 */
        static call(method: string,params: any = null,callback: Function = null): void {
            this.instance.call(method,params,callback);
        }

		/**
		 *
		 * @returns {string}
		 */
        get platform(): string {
            let pf: string;
            if(this.isNative) {
                pf = egret.Capabilities.os;
            } else {
                pf = 'web';
            }
            return pf;
        }

		/**
		 *
		 * @returns {number}
		 */
        get platformId(): number {
            return PDKalien.Native.instance.isNative ? (egret.Capabilities.os == 'iOS' ? 2 : 3) : 4;
        }

		/**
		 * 判断是不是native模式
		 * @returns {boolean}
		 */
        public get isNative(): boolean {
            return (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE)||this.isMiniApp;
        }

        /**
         * H5当前运行的渠道名称  微信公众号:wxmp 支付宝生活圈:ali
         */
        private _channel:string;

        public setChannelName(sName:string):void{
            this._channel = sName;
            this._isWXMP = false;
            this._isAli = false;

            if(sName == "wxmp"){
                this._isWXMP = true;
            }else if(sName == "ali"){
                this._isAli = true;
            }
        }

        /**
         * 获取当前运行的渠道名称
         */
        public getChannelName():string{
            return this._channel;
        }

        /**
         * 是否运行在支付宝生活圈
         */
        private _isAli:boolean;

        /**
         * 是否运行在微信公众号
         */
        private _isWXMP: boolean;

		/**
		 * 判断是不是阿里生活号
		 * @returns {boolean}
		 */
        public isAli():boolean{
            return this._isAli;
        }

		/**
		 * 判断是不是微信公众号进来模式
		 * @returns {boolean}
		 */
        public get isWXMP(): boolean {
            return this._isWXMP
        }

        private nativeCall(str: string): void {
            console.log('nativeCall:' ,str);
            let params: any = JSON.parse(str);
            let id: string = params.id;
            let method: string = params.method;
            if(method && method.length >1){
                this.dispatchEventWith(method,false,params);
            }

            let callback = this._dicCall[id];
            if(callback) {
                delete this._dicCall[id];
                callback(params.args);
            }
        }


		/**
		 * 直接调用native方法
		 * @param method
		 * @param args
		 * @param callback
		 */
        call(method: string,args: any = null,callback: Function = null): void {
            args = args || {};
            let params: any = {
                id: PDKalien.StringUtils.makeRandomIntString(10),
                method,
                args
            };

            if(callback) {
                this._dicCall[params.id] = callback;
            }
            egret.ExternalInterface.call('egretCall',JSON.stringify(params));
        }

		/**
		 * 获取设备唯一ID
		 * @param callback
		 * @param prefix
		 * @param makeNew
		 */
        getDeviceUUID(callback: Function,prefix: string,makeNew: boolean = false): void {
            let uuid: string = PDKalien.localStorage.getItem('uuid',prefix);
            if(makeNew || !uuid) {
                uuid = PDKalien.StringUtils.makeRandomString(32);
                PDKalien.localStorage.setItem('uuid',uuid,prefix);
            }
            callback({ uuid });
        }

        /**
         * 关闭App端的启动图
         */
        closeStartImg(){
            this.call("closeStartImg");
        }

        /**
         * 内嵌webview打开页面
         */
        openUrlByWebview(sUrl:string){
            this.call("openUrlByWebView",{url:sUrl,left:10,top:10,maxWidth:PDKalien.StageProxy.width-20,maxHeight:PDKalien.StageProxy.height-20},null);
        }

        /**
         * 通过系统浏览器打开页面
         */
        openUrlBySys(sUrl:string){
            this.call("openUrlBySys",{url:sUrl},null);
        }

        /**
         * 调用APP方法检查文件是否存在
         */
        fileExist(sPath:string,callback:Function){
            let self = this;
            self.call("fileExist",null,function(sInfo){
                let _json = JSON.parse(sInfo);
                return _json.exist || false;
            })
        }
        
        /**
         * 调用APP方法获取某个文件的MD5
         */
        checkMd5(sPath:string,callback:Function){
            let self = this;
            self.call("getMd5",{path:sPath},function(sInfo){
                let _json = JSON.parse(sInfo);
                callback(_json.md5);
            })
        }

        /**
         * _final：成功的apk文件路径
         * 清除Android下载APK的tmp文件 成功的apk文件 本地记录的当前vercode,downState;
         */
        clearAndroidDown(_tmp:string,_final:string){
            let self = this;
            if(self.platform == "Android"){
				self.setAndroidLocalVercode(0);
                self.setAndroidDownState(0);
				self.call("deleteFile",{path: _tmp + "|" + _final});
			}
        }
        /**
         * 获取Android本地记录的下载的版本号
         * 0为无下载,第一个版本
         */
        getAndroidLocalVercode(){
            return Number(PDKalien.localStorage.getItem("apkDownVerCode"));
        }

        /**
         * 设置Android本地当前下载的版本号
         */
        setAndroidLocalVercode(verCode:number){
            PDKalien.localStorage.setItem("apkDownVerCode","" + verCode);
        }

        /**
         * 获取当前下载APP的状态
         */
        getAndroidDownState(){
            return Number(PDKalien.localStorage.getItem("apkDownState"));
        }

        /**
         * 设置Android 下载APP的当前状态
         * 0 :空状态 1：下载中  2:下载完成
         */
        setAndroidDownState(state:number){
            PDKalien.localStorage.setItem("apkDownState","" + state);
        }

        /**
         * 获取Android外部存储路径
         */
        getAndroidExtPath(callback:Function){
            let self = this;
            self.call("getExternalDir",null,function(sInfo){
                let _info = JSON.parse(sInfo);
                callback(_info.path);
            });
        }

        /**
         * 调用前先判断是Android平台
         * 下载apk
         * sTmp:临时文件 全路径
         * sFinal:最终文件 全路径
         * 必须在同一目录下
         */
        downApk(verCode:number,url:string,sTmp:string,sFinal:string,cleanTmp:boolean,progress:Function,finish:Function):void{
            let self = this;
            let _tmp = sTmp;
            let _name = sFinal;
            let progressFunc = function(sInfo:string){
                let _json = JSON.parse(sInfo);
                progress(_json);
            }

            let finishFunc = function(sInfo:string){
                self.setAndroidDownState(2);
                finish(JSON.parse(sInfo));
            }

            egret.ExternalInterface.addCallback("downProgressFunc",progressFunc.bind(self));
            egret.ExternalInterface.addCallback("downFinishFunc",finishFunc.bind(self));

            self.call("downLoadApk",{url:url,tmp:_tmp,name:_name,cleanTmp:cleanTmp,progress:"downProgressFunc",finish:"downFinishFunc"},function(){
                self.setAndroidDownState(1);
                self.setAndroidLocalVercode(verCode);
            });
        }

       /**
         * 调用前先判断是Android平台
         * 安装apk
         */
        installApk(sPath:string){
            let self = this;
            self.call("installApk",{path:sPath,closeSelf:true})
        }

        /**
         * 获取APP内置的渠道号（一串数字）
         */
        getAppChannelId(callback:Function):void{
            let self = this;
            if(self._channelId!=null){
                callback(self._channelId);
                return;
            }
            this.call("getChannelId",null,function(sInfo){
                if(sInfo){
                    let _info = JSON.parse(sInfo);
                    console.log("getAppChannelId=>",_info.channelId);
                    self._channelId = _info.channelId;
                    callback(_info.channelId);
                }
            });
        }

        /**
         * 获取APP的版本号 用版本码做版本更新检测
         */
        getAppVerCode(callback:Function):void{
            this.call("getVerCode",null,function(sInfo){
                if(sInfo){
                    let _info = JSON.parse(sInfo);
                    console.log("getAppVerCode=>",_info.versionCode);
                    callback(_info.versionCode);
                }
            });
        }

		/**
		 * 关闭app
		 * 仅android可用
		 */
        closeApp(): void {
            this.call('closeApp');
        }

		/**
		 * 调用震动
		 */
        vibrate(): void {
            //console.log('vibrate');
            if(this.isNative) {
                this.call('vibrate',{seconds:0.6});
            } else {

            }
        }


        /**
		 * 复制到剪切板
		 * @param 文字内容
		 */
        toClipboard(text: string): void {
            //console.log('bindThirdPart');
            if(this.isNative) {
                this.call('toClipboard',{ text });
            } else {
                console.log("toClipboard not endable!");
            }
        }

		/**
		 * 分享
		 * @param params
		 * @param callback
		 */
        share(params: any,callback: Function = null): void {
            //console.log('share');
            if(this.isNative) {
                params.shareImagePath = params.shareImagePath || "";
                params.shareThumbPath = params.shareThumbPath || "";
                this.call('shareByWechat', params,callback);
            } else {
                this._wxApi.share(params,callback);
            }
        }

		/**
		 * 系统提示框
		 * @param title
		 * @param message
		 * @param buttons
		 * @param callback
		 */
        alert(title: string,message: string,buttons: string[],callback: Function = null): void {
            //console.log('share');
            if(this.isNative) {
                this.call('alert',{ title,message,buttons },callback);
            } else {
                alert(message);
                callback({ index: 0 });
            }
        }

        public isAndroidWebView():boolean{
            let _javaObj = window['javaBridge'];
            console.log("isAndroidWebView====>",_javaObj);
            if(_javaObj){
                return true;
            }
            return false;
        }

        /**
         * 充值 微信H5
         * response 为php回的json里的data字段
         */
        public rechargeWXH5(response: any,callback:Function = null):void{
            let _isAndroidApp = this.isAndroidWebView();
            let _os = egret.Capabilities.os
            console.log("rechargeWXH5====>",_os,_isAndroidApp,response.url);
            if(_os == "Android" && _isAndroidApp){ //android的App 端
                let _newUrl = response.url +"&Referer="+response.Referer;
                window.open(_newUrl);
            }else{
                window.top.location.href = response.url; 
            }
        }

		/**
		 * 充值 微信APP
         * response 为php回的json里的data字段
		 */
        rechageWXApp(response: any,callback:Function = null){
            this.call("payByWechat",response,function(ret){
                let _info = JSON.parse(ret);
                console.log("rechageWXApp=============>",ret.code);
                if(ret.code ==0){
                    pdkServer.userInfoRequest(pdkServer.uid); 
					PDKBagService.instance.refreshBagInfo(true);
                }
            });
        }

		/**
		 * 充值 微信公众号
         * response 为php回的json里的data字段
		 */
        rechargeInWXMP(response: any,callback: Function = null): void 
        {
            this._wxApi.recharge(response,function(ret){
                console.log("rechargeInWXMP=============>",ret.code);
            });
        }
        
        /**
         * 支付宝H5支付
         * response 为php回的json里的data字段
         */
        rechargeAliH5(response:any,callback:Function = null):void{
            let _alipay = response.alipay;
            if(!_alipay)return;

            let _base64Src = PDKBase64.decode(_alipay);
            let pay = document.getElementById("pay");
            let _url = "http://localhost:8081/alipay.html?htmlCode="+_alipay ;
            //console.log(_url);
            //console.log(_base64Src);
            pay["src"] = "/alipay.html?htmlCode=" + _alipay;

            /*let div = document.createElement('div');
            div.innerHTML = _base64Src;
            pay.appendChild(div);
            document.forms['alipaysubmit'].submit();
            pay.removeChild(div);
            */

        }
        
        /**
         * 支付宝APP支付
         * response 为php回的json里的data字段
         */
        rechargeAliApp(response:any,callback:Function= null):void{

        }

        public wxConfig():void
        {
            PDKwebService.getWxConfig((response: any) => {
                this._wxApi.config(response);
            });
        }

        /**
         * zhu 动态加载js
         */
        public loadJs(url,callback):void{
            if(!this.isNative){
                var head = document.getElementsByTagName('head')[0];
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = url;
                script.async = false;
                head.appendChild(script);
                script.addEventListener('load', function () {
                    script.parentNode.removeChild(script);
                    script.removeEventListener('load', null, false);
                        callback();
                }, false);
            }else{

            }
        }

        /**
         * 通过微信获取位置信息
         */
        public getWXLocation(callback:any):void{
            if(PDKalien.Native.instance.isNative){

            }
            else{
                this._wxApi.getLocation(callback);
            }
        }
    
    /**
     * 调用APP接口设置是否开启屏幕常亮
     */
    public setKeepScreenOn(bOn:boolean):void{
        let _self = this;
        _self.call("setKeepScreenOn",{keepOn:bOn});
    }

    /**
	 * 检测APP是否有版本更新
     * noUpdateCb //无版本更新的回调
	 */
	public checkAppUpdate(noUpdateCb:Function){
		let _platform = egret.Capabilities.os;
		let _self = this;
		let _pdk_nativeBridge = PDKalien.Native.instance;
		let _retryCount = 0;
		let _maxRetry = 3;
		let _sTmpFull = "";
		let _sFinailFull = "";
		let _sExternal = "";
        let _bAndroid = false;
        if(_platform == "Android"){  
            _bAndroid = true;
            _pdk_nativeBridge.getAndroidExtPath(function(sFullPath){
		        let _tmp = "tmp.apk";
		        let _final = "hsqddz.apk";
                _sExternal = sFullPath + "/.hsq/";
                _sTmpFull = _sExternal + _tmp;
                _sFinailFull = _sExternal + _final;
            })
        }

		PDKwebService.checkAppUpdate(function(bHasNew,jInfo){
			//无版本更新
			if(!bHasNew){
                if(_bAndroid){
				    _pdk_nativeBridge.clearAndroidDown(_sTmpFull,_sFinailFull);
                }
				noUpdateCb();
			}else{
                //非安卓直接返回
                if(!_bAndroid){
                    //ios 企业包
                    if(_self._channelId == "20000"){
                        _pdk_nativeBridge.openUrlBySys(jInfo.url);
                    }
                    return;
                }

                let _progress = function(_jPro){
                    console.log("download progress======>",_jPro.recv,_jPro.recvTot,_jPro.tot);
                    let _number = Math.floor((_jPro.recvTot/_jPro.tot)*100);
                    PDKSceneLoading.setLoadingText("下载更新中。。。" + _number + "/" + 100);
                }

                let _finish = function(sInfo){
                    PDKSceneLoading.setLoadingText("下载更新完成,请稍候。。。");
                    _pdk_nativeBridge.checkMd5(_sFinailFull,function(sMd5){
                        console.log("downFinish======>",sMd5,jInfo.md5);
                        if(_retryCount >= _maxRetry){
                            PDKAlert.show("您的网络不稳定,请切换网络环境重试",0,function(action){
                                if(action=="confirm"){
                                    _retryCount = 0;
                                    _pdk_nativeBridge.downApk(jInfo.version,jInfo.url,_sTmpFull,_sFinailFull,jInfo.cleanTmp,_progress,_finish);
                                }else{
                                    _pdk_nativeBridge.closeApp();
                                }
                            });
                        }
                        if(jInfo.md5 != sMd5){
                            _retryCount += 1;
                            _pdk_nativeBridge.downApk(jInfo.version,jInfo.url,_sTmpFull,_sFinailFull,jInfo.cleanTmp,_progress,_finish);
                        }else{
                            _pdk_nativeBridge.installApk(_sFinailFull);
                        }
                    });
                }
                    
                //有版本更新
                if(jInfo.shouldInstall){
                    _finish(null);
                }else{
                    _pdk_nativeBridge.downApk(jInfo.version,jInfo.url,_sTmpFull,_sFinailFull,jInfo.cleanTmp,_progress,_finish);
                }
            }
        })
    }
}}

/**
 * android app 返回键Java调用此函数
 */
window["onAndroidKeyBack"] = function(){
    console.log("onAndroidKeyBack===================>");
    PDKalien.Native.instance.dispatchEventWith("back",false,null);
}