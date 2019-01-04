/**
* 手气斗地主管理其他游戏 zhu 11/14
*/
class OtherGameManager {
    /**
     * 当前正在运行的第三方游戏的配置
     *  name:fish gameId:5
     */
    private _curGameCfg:any;

    /**
     * 当前正在运行的第三方游戏的容器
     */
    private _curGameContainer:any;

    /**
     * 斗地主监听第三方游戏派发的事件
     */
    private _dispatcher:egret.EventDispatcher;

    /**
     * 第三方游戏派发给斗地主的事件类型处理函数
     */
    private _tTypeFunc:{};

    /**
     * 第三方游戏需要监听的游戏协议号
     */
    private _protoIDS:{};

    /**
     * 第三方游戏的配置
     */
    private _otherCfg:any;

    /**
     * 加载第三方游戏的default.res.json 
     */
    private _loadConfigFunc:any;

    /**
     * getResByUrl 加载theme等
     */
    private _getResByUrlFunc:any;

    /**
     * $getVirtualUrl
     */
    private _$getVirtualUrlFunc:any;

    private static _instance:OtherGameManager;

    public static get instance():OtherGameManager{
        if(!this._instance){
            this._instance = new OtherGameManager();
        }
        return this._instance;
    }

    constructor(){
        this._dispatcher = new OtherGameBridge();
        this._otherCfg = otherGameCfg;
        this._loadConfigFunc = RES.loadConfig.bind(RES);
        this._getResByUrlFunc = RES.getResByUrl.bind(RES);
        this._$getVirtualUrlFunc = RES.$getVirtualUrl.bind(RES);
        this._protoIDS = {};
        this._resetRunGame();
        this._initTypeFunc();
        this._enableEvent(true);
    }

    /**
     * 使能监听
     */
    private _enableEvent(bEnable:boolean):void{
        let func = "addEventListener";
        if(!bEnable){
            func = "removeEventListener";
        }
		alien.Dispatcher[func](EventNames.MY_USER_INFO_UPDATE,this.onMyUserInfoUpdate,this);
    }

    /**
     * 是否监听所有的协议
     */
    public isListenAllProto():boolean{
        if(this._curGameCfg && this._curGameCfg.listenAllProto){
            return true;
        }
        return false;
    }
    /**
     * 是否第三方监听了此协议,返回值表示第三方游戏是否监听此协议
     */
    public isInOtherProtoListen(name:string):boolean{
        if(this._protoIDS && this._protoIDS[name]){
            return this._protoIDS[name];
        }
        return null;
    }

    /**
     * 派发事件
     */
    public dispatch(name:string,data:any):void{
        this._dispatcher.dispatchEventWith(name,false,data);
    }

    /**
     * 收到协议数据
     */
    public onSocketData(nameId:number,len:number,bytes:egret.ByteArray):void{
        if(this.isRunOtherGame()){
			this.dispatch(EventNames.RECV_SOCKET_DATA,{nameId:nameId,len:len,byteArray:bytes});
        }
    }
    /**
     * 我的信息更新
     */
    public onMyUserInfoUpdate():void{
        let _data:UserInfoData = MainLogic.instance.selfData;
        _data= JSON.parse( JSON.stringify( _data ) );
        this.dispatch("MY_USER_INFO_UPDATE",_data);
    }

    /**
     * 通过游戏名启动第三方游戏
     */
    public runOtherGameByName(name:string,data:any=null):void{
        let _cfg = this._getGameConfigByGameName(name);
        if(_cfg){
            this._startOtherGame(_cfg,data);
        }
    }
 
     /**
     * 通过游戏ID启动第三方游戏
     */
    public runOtherGameByID(gameId:number,data:any=null):void{
        let _cfg = this._getGameConfigByGameId(name);
        if(_cfg){
            this._startOtherGame(_cfg,data);
        }
    }

    /**
     * 获取当前运行的第三方游戏配置
     */
    public getCurGameCfg():any{
        return this._curGameCfg
    }

    /**
     * 当前是否运行其他三方游戏
     */
    public isRunOtherGame():boolean{
        if(this._curGameCfg){
            return true;
        }
        return false;
    }

    /**
     * 音乐开关变化
     */
    public onMusicEnableChange():void{
        let _enable = alien.SoundManager.instance.musicMute;
        this.dispatch("MUSCI_ENABEL_CHANGE",{enable:_enable});
    }

    /**
     * 音效开关变化
     */
    public onEffectEnableChange():void{
        let _enable = alien.SoundManager.instance.effectMute;
        this.dispatch("EFFECT_ENABEL_CHANGE",{enable:_enable});
    }

    /**
     * 震动开关变化
     */
    public onVibrateEnableChange():void{
        let _enable = alien.SoundManager.instance.vibrateMute;
        this.dispatch("VIBRATE_ENABEL_CHANGE",{enable:_enable});
    }

    /**
     * 根据名称获取第三方游戏配置
     */
    private _getGameConfigByGameName(name:string):void{
        let _cfg = null;
        if(this._otherCfg){
            for(let k in this._otherCfg){
                if(this._otherCfg[k].name == name){
                    return this._otherCfg[k];
                }
            }
        }
        return _cfg;
    }

    /**
     * 根据ID获取第三方游戏配置
     */
    private _getGameConfigByGameId(gameId:number):void{
        let _cfg = null;
        if(this._otherCfg){
            if(this._otherCfg[gameId]){
                return this._otherCfg[gameId];
            }
        }
        return _cfg;
    }

    private _initLoadFunc():void{
        /*RES.loadConfig = (url: string, resourceRoot?: string, type?: string)=>{
            let dstUlr = url;
            if(url.indexOf("http://") < 0 && url.indexOf("https://") < 0){
                dstUlr = this._curGameCfg.rootPath + url;
            }
            console.log("loadConfig------>",url,dstUlr);
            this._loadConfigFunc(dstUlr,resourceRoot,type);
        };

        RES.getResByUrl = (url: string, compFunc: Function, thisObject: any, type?: string)=>{
            let dstUlr = url;
            if(url.indexOf("http://") < 0 && url.indexOf("https://") < 0){
                dstUlr = this._curGameCfg.rootPath + url;
            }
            console.log("getResByUrl------>",url,dstUlr);
            this._getResByUrlFunc(dstUlr,compFunc,thisObject,type);
        };
        */

        RES.$getVirtualUrl = (url: any)=>{
			let dstUlr = url;
            if(url.indexOf("http://") < 0 && url.indexOf("https://") < 0){
                dstUlr = this._curGameCfg.rootPath + url;
            }
            let resInfo = MainLogic.instance.getResInfoByUrl(url);
            if(resInfo){
                dstUlr = url;
            }
            //console.log("$getVirtualUrl------>",url,dstUlr);
            return this._$getVirtualUrlFunc(dstUlr);
        };
    }

    private _resetLoadFunc():void{
        RES.loadConfig = this._loadConfigFunc;
        RES.getResByUrl = this._getResByUrlFunc;
        RES.$getVirtualUrl = this._$getVirtualUrlFunc;
    }

   /**
     * 设置当前启动的第三方游戏配置
     */
    private _startOtherGame(cfg:any,data:any):void{
        let self = this;
        if(cfg.name){
            alien.Ajax.GET(lang.config_url + 'api.php',{action:"getGameByName",name:cfg.name},function(response){
                let ret = JSON.parse(response);
                if(ret.code == 0){
                    let gameInfo = ret.data;
                    //gameInfo.host = "http://192.168.1.77:8086/";
                    //gameInfo.url = "";
                    let rootPath = gameInfo.host + gameInfo.url;
                    let _mainJs = rootPath + gameInfo.mainJs;

                    console.log("startOtherGam==mainJs==>",_mainJs,"--entryClassName-",gameInfo.entryClassName);
                    alien.Native.instance.loadJs(_mainJs,function(ret){
                        if(!ret){
                            self._resetRunGame();
                            return;
                        }
                        let _entryClass = egret.getDefinitionByName(gameInfo.entryClassName);
                        if (_entryClass) {
                            self._curGameCfg = gameInfo;
                            self._curGameCfg.rootPath = rootPath;
                            self._initLoadFunc();
                            self._dispatcher.addEventListener(gameInfo.entryClassName,self._onOtherGameEvent.bind(self),self);
                            let _entryContainer:any = new _entryClass({dispatcher:self._dispatcher,serverUid:server.uid,server:GameConfig.SERVER_URL,data:data});
                            self._curGameContainer = _entryContainer;
                            alien.PopUpManager.removeAllPupUp();
                            alien.SoundManager.instance.stopMusic();
                            alien.SoundManager.instance.stopEffect();
                            alien.SceneManager.addOtherContainer(_entryContainer);
                            alien.SceneManager.removeDDZContainer();
                            OtherGameManager.instance.onMyUserInfoUpdate();
                        }else{
                            self._resetRunGame();
                        }
                    })
                }else{
                    Toast.show("未查询到相关游戏配置"+cfg.name);
                    self._resetRunGame();
                }
            });
        }
    }

    /**
     * 发送第三方游戏的协议数据
     * _data.protoID=>协议id
     * _data.byteArray=>协议封包后的ByteArray
     */
    private _onSendData(_data:any):void{
        if(_data.protoID && _data.byteArray){
            server.sendDataByProtoId(_data.protoID,_data.byteArray)
        }
    }

    /**
     * 关闭第三方游戏,返回斗地主
     * _data.toLobby=>返回斗地主的大厅
     */
    private _onOtherBack(_data:any):void{
        alien.SceneManager.removeOtherContainer(this._curGameContainer);
        this._resetRunGame();
        //if(_data.toLobby){
        alien.SoundManager.instance.playMusic(ResNames.bgm);
        let _ins = alien.SceneManager.instance;
        if(_ins.currentSceneName == SceneNames.ROOM){
            return;
        }
        _ins.show(SceneNames.ROOM,null,alien.sceneEffect.Fade);
        //}
    }

    public _onOtherToMatch(matchid:number = 303): void {
        alien.SceneManager.removeOtherContainer(this._curGameContainer);
        this._resetRunGame();        
        alien.SoundManager.instance.playMusic(ResNames.bgm);
        let _ins = alien.SceneManager.instance;      

        let _matchcfg = GameConfig.getRoomConfigByMatchId(matchid);
        if(_matchcfg.gameType == "pdk") {
            _ins.show(SceneNames.RUNFASTPLAY, {roomID: matchid}, alien.sceneEffect.Fade);
        }
        else {
            _ins.show(SceneNames.PLAY, {roomID: matchid}, alien.sceneEffect.Fade);
        }
    }

    /**
     * 显示斗地主的商城
     * _data.shopFlag=>0:金豆 1:钻石 2:兑换
     */
    private _onShowShop(_data:any):void{
        PanelExchange2.instance.show(_data.shopFlag);
    }

    /**
     * 设置
     */
    private _onShowSetting(_data:any):void{
        PanelSetting.instance.show();
    }

    /**
     * 播放声音
     * _data.soundRes=>声音文件的名称
     * _data.soundType=>1:music 2:effect 
     * _data.loop:循环
     */
    private _onPlaySound(_data:any):void{
        if(_data.soundType == 1){
            alien.SoundManager.instance.playMusic(_data.soundRes);
        }else if(_data.soundType == 2){
            alien.SoundManager.instance.playEffect(_data.soundRes,_data.loop);
        }
    }

    /**
     * 调支付
     * _data.productID 商品id
     */
    private _onRecharge(_data:any):void{
        if(!_data.productID) return;

        RechargeService.instance.doRecharge(_data.productID);
    }

    /**
     * 设置第三方游戏需要监听的游戏协议name
     */
    private _onSetListerenProtoID(_data:any):void{
        if(!_data || !_data.protoIDS){
            return;
        }
        this._protoIDS = _data.protoIDS;
    }

    /**
     * 兑换
     */
    private _onExchange(data:any):void{
        if(!data.id) return;
        server.redcoinExchangeGoodsReq(Number(data.id));
    }

    /**
     * 初始化各个事件的处理函数 
     */
    private _initTypeFunc():void{
        this._tTypeFunc = {};
        this._tTypeFunc[0] = this._onSendData.bind(this);
        this._tTypeFunc[1] = this._onOtherBack.bind(this);
        this._tTypeFunc[2] = this._onShowShop.bind(this);
        this._tTypeFunc[3] = this._onShowSetting.bind(this);
        this._tTypeFunc[4] = this._onPlaySound.bind(this);
        this._tTypeFunc[5] = this._onRecharge.bind(this);
        this._tTypeFunc[6] = this._onSetListerenProtoID.bind(this);
        this._tTypeFunc[7] = this._onExchange.bind(this);
        this._tTypeFunc[8] = this._onPlayerInfo.bind(this);
    }

    /**
     * 玩家信息页面
     */
    private _onPlayerInfo(_data:any):void{
        PanelPlayerInfo.getInstance().show(_data.data);
    }

    /**
     *  其他的三方游戏派发的事件
     * type:0:发协议{protoID:xxx,byteArray:xxx} 1 关闭自己 2:商城 3:设置 4:播放音乐,5:充值,6:设置第三方游戏需要监听的协议ID,7:兑换,8:玩家信息
     * data:{type:1,toLobby:是否返回斗地主的大厅}
     */
    private _onOtherGameEvent(e:egret.Event):void{
        let _data = e.data;
        console.log("_onOtherGameEvent===>",_data.type);
        if(_data){
            if (this._tTypeFunc[_data.type]){
                this._tTypeFunc[_data.type](_data);
            }
        }
    }

    /**
     * 移除事件监听
     */
    private _removeListeners():void{
        let _map = this._dispatcher.$EventDispatcher[1];

        let _list = [];
        for(let key in _map){
            _list = _map[key];
            if(!_list)
                continue;

            let length = _list.length;
            for(let i=0;i<length;++i){
                var eventBin = _list.pop();
                this._dispatcher.removeEventListener(eventBin.type, eventBin.listener, eventBin.thisObject, eventBin.useCapture);
            }
        }
        this._dispatcher.$EventDispatcher[1] = {}
    }

    /**
     * 其他游戏回到斗地主,要重置当前的配置
     */
    private _resetRunGame():void{
        this._curGameContainer = null;
        this._curGameCfg = null;
        this._removeListeners();
        this._resetLoadFunc();
    }
}

/**
 * 用于分发第三方游戏的数据
 */
class OtherGameBridge extends egret.EventDispatcher {
    /**
     * 声音管理类
     */
    private _soundIns = alien.SoundManager.instance;
    constructor(){
        super();
    }

    /**
     * 是否允许播放音乐
     */
    public isEnableMusic():boolean{
        return this._soundIns.musicMute;
    }

    /**
     * 是否允许播放音效
     */
    public isEnableEffect():boolean{
        return this._soundIns.effectMute;
    }
}