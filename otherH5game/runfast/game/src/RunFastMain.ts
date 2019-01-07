/**
 * Created by rockyl on 16/4/1.
 *egret publish -compile --runtime native
 * 游戏主入口
 */

let _pdk_nativeBridge = PDKalien.Native.instance;

class RunFastMain extends eui.UILayer {
	static _instance;
	static get instance(): RunFastMain {
		return this._instance;
	}
	/**
	 * 配置是否加载完毕
	 */
	private _cfgLoadOver: boolean;
	/**
	 * 大厅资源是否加载完毕
	 */
	private _roomLoadOver: boolean;

    /**
	 * 扩展初始化
	 */
	private _initExt(): void {
		if (_pdk_nativeBridge.isAndroidWebView()) {
			let _log = console.log.bind(console);
			console.log = function () {
				let _arg = arguments;
				let _len = _arg.length;
				let _string = "[js]";
				for (var i = 0; i < _len; i++) {
					let _obj = _arg[i];
					if (typeof (_obj) == "object") {
						let _str = JSON.stringify(_arg[i]);
						if (_str) {
							_string += _str;
						} else {
							_string += _arg[i];
						}
					} else {
						_string += _arg[i];
					}
					_string += "  ";
				}
				_arg = null;
				_log(_string);
			}
		}

		egret.DisplayObject.prototype["addClickListener"] = function (func: Function, thisObj: Object = null, scale: boolean = true) {
			let target = this;
			let _srcScaleX = target.scaleX;
			let _srcScaleY = target.scaleY;

			let _onTouchBtnBegin = function () {
				if (!target.touchEnabled)
					return;

				target._hasTouchBegin = true;
				if (!scale) return;
				egret.Tween.get(target).to({ scaleX: _srcScaleX + 0.1, scaleY: _srcScaleY + 0.1 }, 50);
			}
			let _onTouchBtnEnd = function (event: egret.Event) {
				if (target._hasTouchBegin) {
					event.stopImmediatePropagation();
					egret.Tween.get(target).to({ scaleX: _srcScaleX, scaleY: _srcScaleY }, 50);
					if (func) {
						func.call(thisObj, event);
					}
				}
				target._hasTouchBegin = false;
			}
			let _onTouchBtnOutSide = function () {
				target._hasTouchBegin = false;
				if (!scale) return;
				egret.Tween.get(target).to({ scaleX: _srcScaleX, scaleY: _srcScaleY }, 50);
			}
			let _onTouchBtnCancel = function () {
				target._hasTouchBegin = false;
				if (!scale) return;
				egret.Tween.get(target).to({ scaleX: _srcScaleX, scaleY: _srcScaleY }, 50);
			}

			let _onRemoveFromStage = function () {
				_enableEvent(false);
			}

			let _enableEvent = function (bEnable: boolean) {
				let _str = "addEventListener";
				if (!bEnable) {
					_str = "removeEventListener";
				}
				target._hasTouchBegin = false;
				target[_str](egret.TouchEvent.TOUCH_BEGIN, _onTouchBtnBegin);
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

		let argsToString = function (message?: any, ...optionalParams: any[]) {
			let args = arguments;
			let len = args.length;
			let str = "";
			for (let i = 0; i < len; ++i) {
				if (args[i] == null || args[i] == undefined) {
					str += "" + args[i];
				} else {
					if (typeof args[i] == 'object') {
						var cache = [];
						str += JSON.stringify(args[i], function (key, value) {
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
					} else {
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
	private doNativeInit() {
		console.log("doNativeInit===========>", _pdk_nativeBridge.isNative, egret.Capabilities.os);

		if (_pdk_nativeBridge.isNative) {
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
			if (egret.Capabilities.os == "iOS") {
				_dataEyeAppId = _iosDataEyeId;
				_buglyId = _iosBugId;
			}

			let _info = {
				logLevel: _logLevel,
				deAppId: _dataEyeAppId,
				deChannelId: "",
				wxAppId: _wxAppId,
				hasAli: false,
				xgDebug: _xgDebug,
				xgAccount: _xgAccount,
				xgTag: _xgTag,
				bugAppId: _buglyId,
				bugDebug: _bugDebug
			};

			_pdk_nativeBridge.setKeepScreenOn(true);
			_pdk_nativeBridge.getAppChannelId(function (channelId) {
				_info.deChannelId = channelId;
				_pdk_nativeBridge.call("initNative", _info, function (info) {
					let _json = JSON.parse(info);
					console.log("initNative-------->", info, _json.result);
				});
			})
		}
	}

	/**
	 * 腾讯统计
	 */
	private initMta() {
		if (!PDKalien.Native.instance.isNative) {
			var mta = document.createElement("script");
			mta.src = "https://pingjs.qq.com/h5/stats.js?v2.0.2";
			mta.setAttribute("name", "MTAH5");
			mta.setAttribute("sid", "500485827");
			var s = document.getElementsByTagName("script")[0];
			s.parentNode.insertBefore(mta, s);
		}
	}

	constructor(params: any) {
		super();
		RunFastMain._instance = this;
		pdkServer._isInDDZ = false;
		pdkServer._isFirstFromDDZ = false;
		pdkServer._isReconnected = false;
		console.log("RunFastMain------------>constructor", params);
		pdkServer.initFromParams(params);
	}

	protected createChildren(): void {
		this._initExt();
		super.createChildren();
		RES.setMaxLoadingThread(8);

		let _param = _pdk_nativeBridge.getUrlArg();
		_pdk_nativeBridge.setInMiniApp(_param.egretnative);
		this.doGameInit();

		//牌型提示测试
		// let targetCards:number[] = [10,10,10,20,20,20,30,30,40,40];
		// let totalCards:number[] = [110,110,110,110,120,130];
		// let targetCards:number[] = [120,91,92,93,80,81,82,83,70,50];
		// let totalCards:number[] = [110,111,112,100,101,102,90,71,72,61,52,51,40,41,42,43];
		// console.log(PDKCardsType.GetCards2(targetCards, totalCards));
	}

	//APP 需要在检测完版本更新后，确认无更新则执行
	private doGameInit(): void {
		//this.initMta();
		this.doNativeInit();
		RunFastMain._instance = this;
		this._resetCfgAndRoomFalse();
		PDKAdvanceMethod.start();

		if (RELEASE) {
			PDKReportor.instance.start();
		}
		this.init();
	}

	private init() {
		//PDKalien.Native.call('getEnvInfo', {version}, this.onGotEnvInfo.bind(this));

		if (egret.Capabilities.os == "iOS") {
			this.stage.frameRate = 45;
		}

		PDKalien.Dispatcher.init();
		PDKalien.StageProxy.init(this.stage, this);
		PDKalien.PDKSceneManager.init(this);
		PDKalien.localStorage.init(PDKGameConfig.gameName);
		PDKalien.TickerManager.activate();
		new PDKObjectPoolInit();

		console.log('DEBUG :' + PDKGameConfig.DEBUG);

		egret.registerImplementation("eui.IAssetAdapter", new PDKAssetAdapter());
		egret.registerImplementation("eui.IThemeAdapter", new PDKThemeAdapter());

		RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
		RES.loadConfig("resource/runfast.res.json", "resource/");
	}

	private onGotEnvInfo(params: any): void {
		//console.log('onGotEnvInfo:' + JSON.stringify(params));
		PDKalien.PDKUtils.injectProp(PDKEnvironment, params);
	}

	/**
	 * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
	 * PDKLoading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
	 */
	private onConfigComplete(event: RES.ResourceEvent): void {
		RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
		let theme = new eui.Theme("resource/runfast.thm.json", this.stage);
		theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
	}

	/**
	 * 主题文件加载完成,开始预加载
	 * PDKLoading of theme configuration file is complete, start to pre-load the
	 */
	private onThemeLoadComplete(): void {
		RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);

		RES.loadGroup("pdkpreload");
	}

	//初始化微信配置
	private _onWXReadyCallInit(): void {
		var _native = PDKalien.Native.instance;
		if (_native.isNative) return;
		_native.initWXFunc();
		_native.wxConfig();
	}

	/**
	 * 如果是运行在浏览器则要初始化对应的渠道信息
	 */
	private _initH5Info(): void {
		let _param = _pdk_nativeBridge.getUrlArg();
		console.log("_initH5Info=====>", _pdk_nativeBridge.isNative);
		if (!_pdk_nativeBridge.isNative) {
			if (_param.wx_code) { //微信公众号
				_pdk_nativeBridge.setChannelName("wxmp");
				if (window.top["isWXReady"]()) {
					this._onWXReadyCallInit();
				}
				else {
					window.top["onWXReadyFunc"](() => {
						this._onWXReadyCallInit();
					})
				}
			} else if (_param.ali_code) { //支付宝生活圈
				_pdk_nativeBridge.setChannelName("ali");
			}
		}
	}

	/**
	 * preload完成
	 */
	private _doCreateScene() {
		PDKSceneLoading.setLoadingText("资源加载中。。。");
		PDKalien.PDKSceneManager.register(PDKSceneNames.LOGIN, PDKSceneLogin, 'pdkpreload');
		PDKalien.PDKSceneManager.register(PDKSceneNames.ROOM, PDKSceneRoom, 'pdkpreload');
		PDKalien.PDKSceneManager.register(PDKSceneNames.PDKGAMESEL, PDKSceneGameSel, 'pdkroom');
		PDKalien.PDKSceneManager.register(PDKSceneNames.PLAY, ScenePDKPlay, 'pdkplay');
		RES.loadGroup("pdkcommon");
		// RES.loadGroup("room");

		PDKSceneLoading.setLoadingText("获取配置。。。");
		console.log("----1------");
		PDKwebService.loadLog(1, 1);
		console.log("----2------");

		this._initH5Info();
		console.log("----3------");
		this.createScene();
	}



	/**
	 * preload资源组加载完成
	 * preload resource group is loaded
	 */
	private onResourceLoadComplete(event: RES.ResourceEvent): void {
		let self = this;
		if (event.groupName == "pdkcommon") {
			this._onRoomLoadOver();
		} else if (event.groupName == "pdkpreload") {
			PDKGameConfig.init();
			PDKGameConfig.getUrl(() => {
				//注册场景
				PDKalien.PDKSceneManager.register(PDKSceneNames.LOADING, PDKSceneLoading, "pdkpreload");
				PDKalien.StageProxy.addEvent();
				RES.loadGroup("pdkplay");
				RES.loadGroup("pdkfont");
				RES.loadGroup("pdksounds");				
				// RES.loadGroup("pdksetting");								
				// RES.loadGroup("pdktaskActNotice");
				// RES.loadGroup("pdkbindPhone");
				// RES.loadGroup("pdkfirstRechargelight");
				// RES.loadGroup("pdkrecharge");

				console.log("onResourceLoadComplete--------->1");
				let _showCopyRight = true;
				if (_pdk_nativeBridge.isNative) {
					_showCopyRight = false;
					_pdk_nativeBridge.closeStartImg();
				} else {
					if (window.parent) {
						window.parent.postMessage("hideProgress", "*");
					}
				}
				//显示加载场景
				console.log("onResourceLoadComplete--------->2");
				PDKalien.PDKSceneManager.show(PDKSceneNames.LOADING, { showCopyRight: _showCopyRight });
				console.log("onResourceLoadComplete--------->3");
				//检查APP版本更新
				if (_pdk_nativeBridge.isNative) {
					PDKSceneLoading.setLoadingText("检测版本更新。。。");
					_pdk_nativeBridge.checkAppUpdate(function () {
						self._doCreateScene();
					});
				} else {
					self._doCreateScene();
				}
				console.log("onResourceLoadComplete--------->4");
			});
		}
	}

	private onResourceLoadError(event: RES.ResourceEvent): void {
		egret.warn("Group:" + event.groupName + " has failed to load");
		PDKToast.show("Group:" + event.groupName + " has failed to load");
		this.onResourceLoadComplete(event);
	}

	private onResourceProgress(event: RES.ResourceEvent): void {
		/*if (event.groupName == "preload") {
			PDKalien.Dispatcher.dispatch(PDKEventNames.LOADING_PROGRESS, {
				itemsLoaded: event.itemsLoaded,
				itemsTotal: event.itemsTotal
			});
		}
		*/
	}

	/**
	 * 重置房间加载状态和配置加载状态为false
	 */
	private _resetCfgAndRoomFalse(): void {
		this._cfgLoadOver = false;
		this._roomLoadOver = false;
	}

	/**
	 * 先加载common 后加载room 房间资源加载完成
	 */
	private _onRoomLoadOver(): void {
		this._roomLoadOver = true;
		this._checkRoomAndCfgOkAndStart();
	}

	/**
	 * 加载config 完成
	 */
	private _onCfgInitOver(): void {
		this._cfgLoadOver = true;
		this._checkRoomAndCfgOkAndStart();
	}

	/**
	 * 检查房间资源和配置是否都加载完毕,如果都加载完成在启动游戏
	 */
	private _checkRoomAndCfgOkAndStart(): void {
		console.log("_checkRoomAndCfgOkAndStart=======>" + this._cfgLoadOver + "|" + this._roomLoadOver)
		if (!this._cfgLoadOver || !this._roomLoadOver) return;
		this._resetCfgAndRoomFalse();
		RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
		RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
		RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
		PDKMainLogic.instance.delayStart();
	}
	/**
	 * 开始渲染游戏
	 */
	protected createScene(): void {
		//console.log('createScene');
		//各种准备
		console.log("createScene============>");
		//		PDKGameConfig.getUrlData(()=> {
		async.parallel([
			function (cb) {
				PDKalien.PDKSceneManager.addTopScene(PDKSceneNames.COMMON, PDKSceneCommon);
				PDKalien.PDKSceneManager.addEffectScene(PDKSceneNames.EFFECT, PDKSceneEffect);
				PDKalien.PDKSceneManager.addMostTopScene(PDKSceneNames.MOST_TOP, PDKSceneMostTop);

				//敏感词
				let _text = RES.getRes('runfast_badwords_txt')
				let _arr = _text.split("\n");
				PDKUtils.setSensitiveWord(_arr);

				PDKalien.Native.instance.getDeviceUUID((args: any) => {
					PDKGameConfig.IS_NATIVE_SHOW_TIP = (!args.not_show_tip);
					PDKwebService.uuid = args.uuid;
					//console.log('get uuid:' + PDKwebService.uuid);
					cb();
				}, PDKGameConfig.platform);
			},
			function (cb) {
				PDKGameConfig.loadConfigs((data: any) => {
					cb();
				});
			},
		], () => {
			this._onCfgInitOver();
		});
		//		});
	}
}