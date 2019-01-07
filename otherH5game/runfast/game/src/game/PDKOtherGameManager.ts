/**
* 手气斗地主管理其他游戏 zhu 11/14
*/
class PDKOtherGameManager {
    /**
     * 当前正在运行的第三方游戏的配置
     *  urlRoot = "http://192.168.220.1:8082/";
        mainJs = _host + "main.min.js";
        entryClassName = "MainCrazy32";
     */
    private _curGameCfg: any;

    /**
     * 当前正在运行的第三方游戏的容器
     */
    private _curGameContainer: any;

    /**
     * 斗地主监听第三方游戏派发的事件
     */
    private _dispatcher: egret.EventDispatcher;

    /**
     * 第三方游戏派发给斗地主的事件类型处理函数
     */
    private _tTypeFunc: {};

    /**
     * 第三方游戏需要监听的游戏协议号
     */
    private _protoIDS: {};

    /**
     * 第三方游戏的配置
     */
    private _otherCfg: any;

    private static _instance: PDKOtherGameManager;

    public static get instance(): PDKOtherGameManager {
        if (!this._instance) {
            this._instance = new PDKOtherGameManager();
        }
        return this._instance;
    }

    constructor() {
        this._dispatcher = new OtherGameBridge();
        this._otherCfg = PDKotherGameCfg;
        this._resetRunGame();
        this._initTypeFunc();
    }

    /**
     * 是否监听所有的协议
     */
    public isListenAllProto(): boolean {
        if (this._curGameCfg && this._curGameCfg.listenAllProto) {
            return true;
        }
        return false;
    }
    /**
     * 是否第三方监听了此协议,返回值表示第三方游戏是否监听此协议
     */
    public isInOtherProtoListen(nameId: number): boolean {
        if (this._protoIDS[nameId]) {
            return true;
        }
        return false;
    }

    /**
     * 派发事件
     */
    public dispatch(name: string, data: any): void {
        this._dispatcher.dispatchEventWith(name, false, data);
    }

    /**
     * 收到协议数据
     */
    public onSocketData(nameId: number, len: number, bytes: egret.ByteArray): void {
        if (this.isRunOtherGame()) {
            this.dispatch(PDKEventNames.RECV_SOCKET_DATA, { nameId: nameId, len: len, byteArray: bytes });
        }
    }
    /**
     * 我的信息更新
     */
    public onMyInfoUpdate(): void {
        let _data: PDKUserInfoData = PDKMainLogic.instance.selfData;
        _data = JSON.parse(JSON.stringify(_data));
        console.log("onMyInfoUpdate----->", _data);
        this.dispatch("MY_USER_INFO_UPDATE", _data);
    }

    /**
     * 通过游戏名启动第三方游戏
     */
    public runOtherGameByName(name: string, data: any = null): void {
        let _cfg = this._getGameConfigByGameName(name);
        if (_cfg) {
            this._startOtherGame(_cfg, data);
        }
    }

    /**
    * 通过游戏ID启动第三方游戏
    */
    public runOtherGameByID(gameId: number, data: any = null): void {
        let _cfg = this._getGameConfigByGameId(name);
        if (_cfg) {
            this._startOtherGame(_cfg, data);
        }
    }

    /**
     * 获取当前运行的第三方游戏配置
     */
    public getCurGameCfg(): any {
        return this._curGameCfg
    }

    /**
     * 获取当前运行的第三方游戏的根目录
     */
    public getCurGameUrlRoot(): void {
        if (this.isRunOtherGame() && this._curGameCfg.urlRoot) {
            return this._curGameCfg.urlRoot;
        }
        return null;
    }
    /**
     * 当前是否运行其他三方游戏
     */
    public isRunOtherGame(): boolean {
        if (this._curGameCfg) {
            return true;
        }
        return false;
    }

    /**
     * 音乐开关变化
     */
    public onMusicEnableChange(): void {
        let _enable = PDKalien.PDKSoundManager.instance.musicMute;
        this.dispatch("MUSCI_ENABEL_CHANGE", { enable: _enable });
    }

    /**
     * 音效开关变化
     */
    public onEffectEnableChange(): void {
        let _enable = PDKalien.PDKSoundManager.instance.effectMute;
        this.dispatch("EFFECT_ENABEL_CHANGE", { enable: _enable });
    }

    /**
     * 震动开关变化
     */
    public onVibrateEnableChange(): void {
        let _enable = PDKalien.PDKSoundManager.instance.vibrateMute;
        this.dispatch("VIBRATE_ENABEL_CHANGE", { enable: _enable });
    }

    /**
     * 根据名称获取第三方游戏配置
     */
    private _getGameConfigByGameName(name: string): void {
        let _cfg = null;
        if (this._otherCfg) {
            for (let k in this._otherCfg) {
                if (this._otherCfg[k].name == name) {
                    return this._otherCfg[k];
                }
            }
        }
        return _cfg;
    }

    /**
     * 根据ID获取第三方游戏配置
     */
    private _getGameConfigByGameId(gameId: number): void {
        let _cfg = null;
        if (this._otherCfg) {
            if (this._otherCfg[gameId]) {
                return this._otherCfg[gameId];
            }
        }
        return _cfg;
    }

    /**
      * 设置当前启动的第三方游戏配置
      */
    private _startOtherGame(cfg: any, data: any): void {
        this._curGameCfg = cfg;

        if (cfg.mainJs && cfg.urlRoot && cfg.entryClassName) {
            let _mainJs = cfg.urlRoot + cfg.mainJs;
            PDKalien.Native.instance.loadJs(_mainJs, function () {
                let _entryClass = egret.getDefinitionByName(cfg.entryClassName);
                if (_entryClass) {
                    this._dispatcher.addEventListener(cfg.entryClassName, this._onOtherGameEvent.bind(this), this);
                    console.log("startOtherGam======entryClassName=======>", cfg.entryClassName);
                    let _entryContainer: any = new _entryClass({ dispatcher: this._dispatcher, serverUid: pdkServer.uid, data: data });
                    this._curGameContainer = _entryContainer;
                    PDKalien.PDKSoundManager.instance.stopMusic();
                    PDKalien.PDKSoundManager.instance.stopEffect();
                    PDKalien.PDKSceneManager.addOtherContainer(_entryContainer);
                    PDKalien.PDKSceneManager.removeDDZContainer();
                    PDKOtherGameManager.instance.onMyInfoUpdate();
                }
            }.bind(this))
        }
    }

    /**
     * 发送第三方游戏的协议数据
     * _data.protoID=>协议id
     * _data.byteArray=>协议封包后的ByteArray
     */
    private _onSendData(_data: any): void {
        if (_data.protoID && _data.byteArray) {
            pdkServer.sendDataByProtoId(_data.protoID, _data.byteArray)
        }
    }

    /**
     * 关闭第三方游戏,返回斗地主
     * _data.toLobby=>返回斗地主的大厅
     */
    private _onOtherBack(_data: any): void {
        PDKalien.PDKSceneManager.removeOtherContainer(this._curGameContainer);
        this._resetRunGame();
        //if(_data.toLobby){
        PDKalien.PDKSoundManager.instance.playMusic(PDKResNames.pdk_bgm);
        let _ins = PDKalien.PDKSceneManager.instance;
        if (_ins.currentSceneName == PDKSceneNames.ROOM) {
            return;
        }
        _ins.show(PDKSceneNames.ROOM, null, PDKalien.sceneEffect.Fade);
        //}
    }

    /**
     * 显示斗地主的商城
     * _data.shopFlag=>0:金豆 1:钻石 2:兑换
     */
    private _onShowShop(_data: any): void {
        PDKPanelExchange2.instance.show(_data.shopFlag);
    }

    /**
     * 设置
     */
    private _onShowSetting(_data: any): void {
         if (pdkServer._isInDDZ) {
            pdkServer.ddzDispatchEvent(1, '', { type: 3 });
        } else {
            PDKPanelSetting.instance.show();
        }
    }

    /**
     * 播放声音
     * _data.soundRes=>声音文件的名称
     * _data.soundType=>1:music 2:effect 
     * _data.loop:循环
     */
    private _onPlaySound(_data: any): void {
        if (_data.soundType == 1) {
            PDKalien.PDKSoundManager.instance.playMusic(_data.soundRes, _data.loop);
        } else if (_data.soundType == 2) {
            PDKalien.PDKSoundManager.instance.playEffect(_data.soundRes, _data.loop);
        }
    }

    /**
     * 调支付
     * _data.productID 商品id
     */
    private _onRecharge(_data: any): void {
        if (!_data.productID) return;

        PDKRechargeService.instance.doRecharge(_data.productID);
    }

    /**
     * 设置第三方游戏需要监听的游戏协议ID
     */
    private _onSetListerenProtoID(_data: any): void {
        this._protoIDS = _data.protoIDS;
    }

    /**
     * 初始化各个事件的处理函数 
     */
    private _initTypeFunc(): void {
        this._tTypeFunc = {};
        this._tTypeFunc[0] = this._onSendData.bind(this);
        this._tTypeFunc[1] = this._onOtherBack.bind(this);
        this._tTypeFunc[2] = this._onShowShop.bind(this);
        this._tTypeFunc[3] = this._onShowSetting.bind(this);
        this._tTypeFunc[4] = this._onPlaySound.bind(this);
        this._tTypeFunc[5] = this._onRecharge.bind(this);
        this._tTypeFunc[6] = this._onSetListerenProtoID.bind(this);
    }

    /**
     *  其他的三方游戏派发的事件
     * type:0:发协议{protoID:xxx,byteArray:xxx} 1 关闭自己 2:商城 3:设置 4:播放音乐,5:充值,6:设置第三方游戏需要监听的协议ID
     * data:{type:1,toLobby:是否返回斗地主的大厅}
     */
    private _onOtherGameEvent(e: egret.Event): void {
        let _data = e.data;
        // console.log("_onOtherGameEvent===>", _data);
        if (_data) {
            if (this._tTypeFunc[_data.type]) {
                this._tTypeFunc[_data.type](_data);
            }
        }
    }

    /**
     * 移除事件监听
     */
    private _removeListeners(): void {
        let _map = this._dispatcher.$getEventMap();

        let _list = [];
        for (let key in _map) {
            _list = _map[key];
            let length = _list.length;
            if (length == 0) {
                return;
            }
            for (let i = 0; i < length; ++i) {
                var eventBin = _list.pop();
                this._dispatcher.removeEventListener(eventBin.type, eventBin.listener, eventBin.thisObject, eventBin.useCapture);
            }
        }
    }

    /**
     * 其他游戏回到斗地主,要重置当前的配置
     */
    private _resetRunGame(): void {
        this._curGameContainer = null;
        this._curGameCfg = null;
        this._removeListeners();
    }
}

/**
 * 用于分发第三方游戏的数据
 */
class OtherGameBridge extends egret.EventDispatcher {
    /**
     * 声音管理类
     */
    private _soundIns = PDKalien.PDKSoundManager.instance;
    constructor() {
        super();
    }

    /**
     * 是否允许播放音乐
     */
    public isEnableMusic(): boolean {
        return this._soundIns.musicMute;
    }

    /**
     * 是否允许播放音效
     */
    public isEnableEffect(): boolean {
        return this._soundIns.effectMute;
    }
}