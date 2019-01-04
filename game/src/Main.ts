/**
 * Created by rockyl on 16/4/1.
 *egret publish -compile --runtime native
 * 游戏主入口
 */
window["alien"] = alien;

class Main extends eui.UILayer {
	static _instance;
	static get instance(): Main {
		return this._instance;
	}
	/**
	 * 配置是否加载完毕
	 */
	private _cfgLoadOver:boolean;
	/**
	 * 大厅资源是否加载完毕
	 */
	private _roomLoadOver:boolean;

	private _displayObj = {num:0,map:{}};
    /**
	 * 扩展初始化
	 */
	private _initExt():void{
		alien.StageProxy.init(this.stage, this);
		alien.Schedule.init();
		alien.Schedule.startSchedule();
		egret.setInterval = alien.Schedule.setInterval;
		egret.setTimeout = alien.Schedule.setTimeout;
		egret.clearInterval = alien.Schedule.clearInterval;
		egret.clearTimeout = alien.Schedule.clearTimeout;
		
		if(alien.Native.instance.isAndroidWebView()){
			let _log = console.log.bind(console);
			console.log = function(){
				let _arg = arguments;
				let _len = _arg.length;
				let _string = "[js]";
				for(var i=0; i<_len; i++){
					let _obj = _arg[i];
					if(typeof (_obj) == "object"){
						let _str = JSON.stringify(_arg[i]);
						if(_str){
							_string +=	_str;
						}else{
							_string += _arg[i];
						}
					}else{
						_string += _arg[i];
					}
					_string += "  ";
				}
				_arg = null;
				_log(_string);
			}
		}
		
		/*let _disObj = this._displayObj;
		let _onAddToStage = egret.DisplayObject.prototype.$onAddToStage;
		egret.DisplayObject.prototype.$onAddToStage = function(stage: egret.Stage, nestLevel: number){
			//console.error("_onAddToStage==========>",this);
			_onAddToStage.call(this,stage,nestLevel);
			_disObj.num += 1;
			_disObj.map[this] = 1
		}
		let _onRemoveFromStage = egret.DisplayObject.prototype.$onRemoveFromStage;
		egret.DisplayObject.prototype.$onRemoveFromStage = function(){
			//console.error("_onRemoveFromStage==========>",this);
			_onRemoveFromStage.call(this);
			_disObj.num -= 1;
			if(_disObj.map[this]){
				delete _disObj.map[this];
			}
		}*/
		
		/*egret.setInterval(()=>{
			console.error("#####DisplayObject#####num:",_disObj.num," Schedule Num:",alien.Schedule.instance["_count"]);
		},this,5000)
		*/

		egret.DisplayObject.prototype["addClickListener"] = function(func:Function,thisObj:Object = null,scale:boolean = true){
			let target = this;
			let _srcScaleX = target.scaleX;
			let _srcScaleY = target.scaleY;

			let _onTouchBtnBegin = function(){
				if(!target.touchEnabled)
					return;
					
				target._hasTouchBegin = true;
				if(!scale) return;
				egret.Tween.get(target).to({scaleX:_srcScaleX + 0.1,scaleY:_srcScaleY + 0.1},50);
			}
			let _onTouchBtnEnd = function(event:egret.Event){
				if(target._hasTouchBegin){
					event.stopImmediatePropagation();
					egret.Tween.get(target).to({scaleX:_srcScaleX,scaleY:_srcScaleY},50);
					if(func){
						func.call(thisObj,event);
					}
				}
				target._hasTouchBegin = false;
			}
			let _onTouchBtnOutSide = function(){
				target._hasTouchBegin = false;
				if(!scale) return;
				egret.Tween.get(target).to({scaleX:_srcScaleX,scaleY:_srcScaleY},50);
			}
			let _onTouchBtnCancel = function(){
				target._hasTouchBegin = false;
				if(!scale) return;
				egret.Tween.get(target).to({scaleX:_srcScaleX,scaleY:_srcScaleY},50);
			}

			let _onRemoveFromStage = function(){
				_enableEvent(false);
			}

			let _enableEvent = function(bEnable:boolean){
				let _str = "addEventListener";
				if(!bEnable){
					_str = "removeEventListener";
				}
				target._hasTouchBegin = false;
				target[_str](egret.TouchEvent.TOUCH_BEGIN,_onTouchBtnBegin);
				target[_str](egret.TouchEvent.TOUCH_END, _onTouchBtnEnd);
				target[_str](egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, _onTouchBtnOutSide);
				target[_str](egret.TouchEvent.TOUCH_CANCEL, _onTouchBtnCancel);
				target[_str](egret.Event.REMOVED_FROM_STAGE, _onRemoveFromStage);
			}
			_enableEvent(true);
		}

		// zhu webgl 渲染需要加入
		egret.ImageLoader.crossOrigin = "anonymous";


		let logFunc = console.log.bind(console);
		let errorFunc = console.error.bind(console);
		let warnFunc = console.warn.bind(console);
		let infoFunc = console.info.bind(console);

		let argsToString = function(message?: any,...optionalParams: any[]){
			let args = arguments;
			let len = args.length;
			let str = "";
			for(let i=0;i<len;++i){
				if(args[i] == null || args[i] == undefined){
					str += "" + args[i];
				}else{
					if(typeof args[i] == 'object'){
						var cache = [];
						str += JSON.stringify(args[i], function(key, value) {
							if (typeof value === 'object' && value !== null) {
								if (cache.indexOf(value) !== -1) {
									// Circular reference found, discard key
									return;
								}
								// Store value in our collection
								cache.push(value);
							}
							return value;
						});
						cache = null; // Enable garbage collection
					}else{
						str += args[i].toString();
					}
				}
			}
			return str
		}

		// console.log = function(message?: any, ...optionalParams: any[]){
		// 	let str = argsToString(message,optionalParams);
		// 	logFunc(str);
		// }
		// console.info = function(message?: any, ...optionalParams: any[]){
		// 	let str = argsToString(message,optionalParams);
		// 	infoFunc(str);
		// }
		// console.warn = function(message?: any, ...optionalParams: any[]){
		// 	let str = argsToString(message,optionalParams);
		// 	warnFunc(str);
		// }
		// console.error = function(message?: any, ...optionalParams: any[]){
		// 	let str = argsToString(message,optionalParams);
		// 	errorFunc(str);
		// }
	}

	/**
	 * APP 端需要的初始化
	 */
	private doNativeInit(){
		console.log("doNativeInit===========>",alien.Native.instance.isNative,egret.Capabilities.os);
		if(alien.Native.instance.isNative){
			let _logLevel = 3;
			let _androidDataEyeId = "C9029BAFD559F19C50E0247E2E9B57353";
			let _iosDataEyeId = "C2E5D5868229A2EFA0563E5C3A3A66881"
			let _wxAppId = "wx2f626b869698b735";
			let _dataEyeAppId = _androidDataEyeId;

			let _androidBugId = "cbe075303b";
			let _iosBugId = "cec021ffbd";
			let _buglyId = _androidBugId;
			let _bugDebug = false;
			let _xgAccount = "adbddfsf";
			let _xgTag = "223";
			let _xgDebug = false;
			if(egret.Capabilities.os == "iOS"){
				_dataEyeAppId = _iosDataEyeId;
				_buglyId = _iosBugId;
			}

			let _info = {
				logLevel:_logLevel,
				deAppId:_dataEyeAppId,
				deChannelId:"",
				wxAppId:_wxAppId,
				hasAli:false,
				xgDebug:_xgDebug,
				xgAccount:_xgAccount,
				xgTag:_xgTag,
				bugAppId:_buglyId,
				bugDebug:_bugDebug
			};
			
			alien.Native.instance.setKeepScreenOn(true);
			alien.Native.instance.getAppChannelId(function(channelId){
				_info.deChannelId = channelId;
				alien.Native.instance.call("initNative",_info,function(info){
					let _json = JSON.parse(info);
					console.log("initNative-------->",info,_json.result);
				});
			})
		}
	}

	/**
	 * 腾讯统计
	 */
	private initMta(){
		var mta = document.createElement("script");
		mta.src = "https://pingjs.qq.com/h5/stats.js?v2.0.2";
		mta.setAttribute("name", "MTAH5");
		mta.setAttribute("sid", "500485827");
		var s = document.getElementsByTagName("script")[0];
		s.parentNode.insertBefore(mta, s);
	}

	protected createChildren(): void {
		this._initExt();
		super.createChildren();	
		RES.setMaxLoadingThread(8);
		
		let _param = alien.Native.instance.getUrlArg();
		alien.Native.instance.setInMiniApp(_param.egretnative);
		this.doGameInit();
	}

	//APP 需要在检测完版本更新后，确认无更新则执行
	private doGameInit():void{
		this.initMta();
		this.doNativeInit();
		Main._instance = this;
		this._resetCfgAndRoomFalse();
		AdvanceMethod.start();
		Reportor.instance.start();
		this.init();
	}

	private init() {
		/*if(egret.Capabilities.os == "iOS"){
			this.stage.frameRate = 45;
		}*/
		
		alien.Dispatcher.init();
		alien.SceneManager.init(this);
		alien.localStorage.init(GameConfig.gameName);
		alien.TickerManager.activate();
		new ObjectPoolInit();
		
		console.log('DEBUG :' + GameConfig.DEBUG);
		
		egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
		egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

		RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
		RES.loadConfig("resource/default.res.json", "resource/");
	}

	private onGotEnvInfo(params: any): void {
		//console.log('onGotEnvInfo:' + JSON.stringify(params));
		alien.Utils.injectProp(Environment, params);
	}

	/**
	 * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
	 * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
	 */
	private onConfigComplete(event: RES.ResourceEvent): void {
		MainLogic.instance.parseResConfigByIns(event.target);
		RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
		let theme = new eui.Theme("resource/default.thm.json", this.stage);
		theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
	}

	/**
	 * 主题文件加载完成,开始预加载
	 * Loading of theme configuration file is complete, start to pre-load the
	 */
	private onThemeLoadComplete(): void {
		RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
	
		RES.loadGroup("preload");
	}


	/**
	 * 如果是运行在浏览器则要初始化对应的渠道信息
	 */
	private _initH5Info():void{
		let _nativeBridge = alien.Native.instance;
		let _param = _nativeBridge.getUrlArg();
		console.log("_initH5Info=====>",_nativeBridge.isNative,_param);
		if(!_nativeBridge.isNative){
			if(_param.wx_code){ //微信公众号
				if(_param.isWxQr && _param.isWxQr == "1"){
					_nativeBridge.setChannelName("wxqr");
				}else{
					_nativeBridge.setChannelName("wxmp");
					if(window.top["isWXReady"]()){
						_nativeBridge.onWXReadyCallInit();
					}
					else{
						window.top["onWXReadyFunc"](()=>{
							_nativeBridge.onWXReadyCallInit();
						})
					}
				}
			}else if(_param.ali_code){ //支付宝生活圈
				if(_param.isAliQr && _param.isAliQr == "1"){
					_nativeBridge.setChannelName("aliqr");
				}else{
					_nativeBridge.setChannelName("ali");
				}
			}else{
				let _name = "other";
				if(egret.Capabilities.os == "iOS"){
					_name = "ios_browser";
				}else if(egret.Capabilities.os == "Android"){
					_name = "android_browser";
				}
				_nativeBridge.setChannelName(_name);
			}
		}else{
			let _name = "other";
			if(egret.Capabilities.os == "iOS"){
				_name = "ios_app";
			}else if(egret.Capabilities.os == "Android"){
				_name = "android_app";
			}
			_nativeBridge.setChannelName(_name);
		}
	}

	/**
	 * preload完成
	 */
	private _doCreateScene(){
		SceneLoading.setLoadingText("资源加载中。。。");
		alien.SceneManager.register(SceneNames.LOGIN, SceneLogin, 'preload');
		alien.SceneManager.register(SceneNames.ROOM, SceneRoom, 'preload');
		alien.SceneManager.register(SceneNames.PLAY, ScenePlay, 'play');
		alien.SceneManager.register(SceneNames.RUNFASTPLAY, SceneRunFastPlay, 'play');
		alien.SceneManager.register("QznnGamePage", QznnGamePage, 'niuniu');
		alien.SceneManager.register("SceneDzpkPlay", SceneDzpkPlay, 'dzpk');
		alien.SceneManager.register("SceneFffPlay", SceneFFFPlay, 'fff');
		alien.SceneManager.register("GameLLT",GameLLT,"llt");
		alien.SceneManager.register("GameLLK",GameLLK,"llk");
		alien.SceneManager.register("Game2048",Game2048,"2048");
		alien.SceneManager.register("GameFFL",GameFFle,"ffl");
		alien.SceneManager.register("GameFD",GameCWFD,"fd");
		
		RES.loadGroup("common");
		RES.loadGroup("room");

		SceneLoading.setLoadingText("获取配置。。。");
		webService.loadLog(1,1);
		this._initH5Info();
		this.createScene();
	}

	/**
	 * preload资源组加载完成
	 * preload resource group is loaded
	 */
	private onResourceLoadComplete(event: RES.ResourceEvent): void {
		let self = this;
		if(event.groupName == "common"){
			this._onRoomLoadOver();
		}else if (event.groupName == "preload") {
			GameConfig.init();
			//注册场景
			alien.SceneManager.register(SceneNames.LOADING, SceneLoading,"preload");
			alien.StageProxy.addEvent();
			let _showCopyRight = true;
			if(alien.Native.instance.isNative){
				_showCopyRight = false;
				alien.Native.instance.closeStartImg();
			}else{
				if(window.parent){
					window.parent.postMessage("hideProgress","*");
				}
			}
			//显示加载场景
			alien.SceneManager.show(SceneNames.LOADING,{showCopyRight:_showCopyRight});

			self._doCreateScene();
			// GameConfig.getUrl(()=>{
			// 	//检查APP版本更新
			// 	if(alien.Native.instance.isNative){
			// 		SceneLoading.setLoadingText("检测版本更新。。。");
			// 		alien.Native.instance.checkAppUpdate(function(){
			// 			self._doCreateScene();
			// 		});
			// 	}else{
			// 		self._doCreateScene();
			// 	}
			// });
		}
	}

	private onResourceLoadError(event: RES.ResourceEvent): void {
		egret.warn("Group:" + event.groupName + " has failed to load");
		this.onResourceLoadComplete(event);
	}

	private onResourceProgress(event: RES.ResourceEvent): void {
		/*if (event.groupName == "preload") {
			alien.Dispatcher.dispatch(EventNames.LOADING_PROGRESS, {
				itemsLoaded: event.itemsLoaded,
				itemsTotal: event.itemsTotal
			});
		}
		*/
	}

	/**
	 * 重置房间加载状态和配置加载状态为false
	 */
	private _resetCfgAndRoomFalse():void{
		this._cfgLoadOver = false;
		this._roomLoadOver = false;
	}

	/**
	 * 先加载common 后加载room 房间资源加载完成
	 */
	private _onRoomLoadOver():void{
		this._roomLoadOver = true;
		this._checkRoomAndCfgOkAndStart();
	}

	/**
	 * 加载config 完成
	 */
	private _onCfgInitOver():void{
		this._cfgLoadOver = true;
		GiftManager.instance;
		this._checkRoomAndCfgOkAndStart();
	}

	/**
	 * 检查房间资源和配置是否都加载完毕,如果都加载完成在启动游戏
	 */
	private _checkRoomAndCfgOkAndStart():void{
		console.log("_checkRoomAndCfgOkAndStart=======>"+this._cfgLoadOver + "|" + this._roomLoadOver)
		if(!this._cfgLoadOver || !this._roomLoadOver) return;
		this._resetCfgAndRoomFalse();
		RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
		RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
		RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
		MainLogic.instance.delayStart();
	}
	/**
	 * 开始渲染游戏
	 */
	protected createScene(): void {
		//console.log('createScene');
		//各种准备
		console.log("createScene============>");
//		GameConfig.getUrlData(()=> {
			async.parallel([
				function (cb) {
					alien.SceneManager.addTopScene(SceneNames.COMMON, SceneCommon);
					alien.SceneManager.addEffectScene(SceneNames.EFFECT, SceneEffect);
					alien.SceneManager.addMostTopScene(SceneNames.MOST_TOP, SceneMostTop);

					//敏感词
					let _text = RES.getRes('badwords_txt')
					let _arr = _text.split("\n");
					Utils.setSensitiveWord(_arr);

					alien.Native.instance.getDeviceUUID((args: any)=> {
						GameConfig.IS_NATIVE_SHOW_TIP = (!args.not_show_tip);
						webService.uuid = args.uuid;
						//console.log('get uuid:' + webService.uuid);
						cb();
					}, GameConfig.platform);
				},
				function (cb) {
					GameConfig.loadConfigs((data: any)=> {
						cb();
					});
				},
			], ()=> {
				this._onCfgInitOver();
			});
//		});
	}
}