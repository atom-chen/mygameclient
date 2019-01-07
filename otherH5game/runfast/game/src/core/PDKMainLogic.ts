/**
 * Created by rockyl on 16/3/3.
 *
 * 主逻辑入口
 */

class PDKMainLogic {
    private static _instance: PDKMainLogic;
    public static get instance(): PDKMainLogic {
        if (this._instance == undefined) {
            this._instance = new PDKMainLogic();
        }
        return this._instance;
    }

    running: boolean;
    private _almsCount: number = 0;
    private _almsUsageCount: number = 0;

    public latitude: number;
    public longitude: number;

    selfData: PDKUserInfoData;
    checkNicknameCount: number;
    fromThirdPart: string;
    private _getLocationTimer: egret.Timer;

    constructor() {

        this.init();
    }

    private init(): void {
        PDKalien.Native.instance.addEventListener('back', this.back, this);  //仅android可用
        PDKalien.Native.instance.addEventListener('enterBackground', this.enterBackground, this);
        PDKalien.Native.instance.addEventListener('enterForeground', this.enterForeground, this);

        pdkServer.addEventListener(PDKEventNames.USER_USER_INFO_RESPONSE, this.onUserInfoResponse, this);
        pdkServer.addEventListener(PDKEventNames.USER_ALMS_REP, this.onAlmsResponse, this);

        PDKalien.Dispatcher.addEventListener(PDKEventNames.CLOCK_0, this.onClock0, this);
        PDKalien.Dispatcher.addEventListener(PDKEventNames.SERVER_CLOSE, this.onServerClose, this);
        pdkServer.addEventListener(PDKEventNames.USER_GET_FRREWARD_REP, this._onRecvGetFRechargeRewRep, this);
        pdkServer.addEventListener(PDKEventNames.USER_PAY_TO_CHAT_REP, this._onRecvHornRep, this);
        pdkServer.addEventListener(PDKEventNames.USER_CHECK_RECONNECT_REP, this._onCheckReconnectRep, this);
        PDKalien.Dispatcher.addEventListener(PDKEventNames.SERVER_HASUPDATE, this._onServerHasUpdate, this);

        this.selfData = new PDKUserInfoData();
    }

    initData(): void {
        PDKGameConfig.roomList.forEach((roomInfo: any) => {
            if (roomInfo.hasOwnProperty('cycleTime') && !roomInfo.hasOwnProperty('cycleTimeStamp')) {
                roomInfo.cycleTimeStamp = [];
                roomInfo.cycleTime.some((time: string) => {
                    roomInfo.cycleTimeStamp.push(PDKalien.TimeUtils.parseTime(time));
                });
            }

            if (roomInfo.roomType == 2) { //比赛房间预处理
				/*roomInfo.reward.forEach((item:any)=>{
					item.reward = PDKUtils.parseGoodsString(item.reward);
				});*/
                roomInfo.masterReward = PDKMatchService.getRewardStringByRank(roomInfo);
                roomInfo.rewardText = PDKalien.StringUtils.format(PDKlang.match_jikai_reward, roomInfo.masterReward);
                if (roomInfo.matchId == 205) {
                    roomInfo.masterReward = PDKMatchService.getRewardStringBy205(roomInfo);
                    roomInfo.rewardText = PDKalien.StringUtils.format(PDKlang.match_jikai_reward, roomInfo.masterReward);
                }
                roomInfo.limitText = PDKalien.StringUtils.format(PDKlang.match_jikai_limit, roomInfo.maxPlayer);
                roomInfo.entryMoneyText = roomInfo.entryMoney > 0 ? PDKUtils.currencyRatio(roomInfo.entryMoney) + PDKlang.gold : PDKlang.free_pay;
            }
        });
        // PDKGameConfig.roomList.push({ ads: true,roomType: 2 });

        PDKGoodsManager.instance;
        PDKMatchService.instance.initData();
        // if(PDKlang.debug == "false"){
        //     if(!this._getLocationTimer){
        //         this._getLocationTimer = new egret.Timer(1000 * 10);
        //         this._getLocationTimer.repeatCount = 5;
        //         this._getLocationTimer.addEventListener(egret.TimerEvent.TIMER, this.getLocation, this);
        //         this._getLocationTimer.start();
        //     }
        // }
        //PDKalien.PDKSceneManager.addTopScene(PDKSceneNames.GIFT,SceneGift);
    }

    back(event: egret.Event) {
        if (!PDKalien.PopUpManager.removeTopPupUp()) {
            let _curScene = PDKalien.PDKSceneManager.instance.currentScene;
            if (_curScene.name == PDKSceneNames.ROOM) {
                let _scene: PDKSceneRoom = <PDKSceneRoom>_curScene;
                _scene.doBack();
            } else if (!PDKalien.PDKSceneManager.back(null, PDKalien.sceneEffect.Fade)) {
                PDKalien.Native.instance.closeApp();
            }
        }
    }

    enterForeground(event: egret.Event): void {
        console.log('app enter foreground.');

        this.onAppEnterForeground();
    }

    enterBackground(event: egret.Event): void {
        console.log('app enter background.');

        if (this._ready && PDKalien.PDKSceneManager.instance.currentSceneName == PDKSceneNames.LOADING) {
            this.tryStart();
        } else {
            PDKalien.Dispatcher.dispatch(PDKEventNames.ENTER_BACKGROUND);
            this.onAppEnterBackground();
        }
    }

    private _ready: boolean;
    public delayStart(): void {
        console.log("delayStart----------->");
        this._ready = true;
        PDKGameData.instance.loadData();
        PDKUserData.instance.init(PDKGameConfig.platform);
        PDKUserData.instance.loadData();

        this.initData();

        this.tryStart();
    }

    private tryStart(): void {
        console.log('tryStart');
        pdkServer.ready();
        if (pdkServer._isInDDZ == true) {
            pdkServer.checkReconnect();
            // if (pdkServer._isReconnected == true) {
            //     console.log('tryStart----reconnect');
            //     PDKSceneManager.show(PDKSceneNames.PLAY, { action: 'reconnect', roomID: 9000 }, PDKalien.sceneEffect.Fade);
            // }
            // else {
            //     console.log('tryStart----quick_join');
            //     PDKSceneManager.show(PDKSceneNames.PLAY, { action: 'quick_join', roomID: 9000 }, PDKalien.sceneEffect.Fade);
            // }
        }
        else {
            let _pdk_nativeBridge = PDKalien.Native.instance;
            if (_pdk_nativeBridge.isWXMP) { //微信公众号登录游戏
                PDKLoginService.instance.doWebWXLogin();
            } else if (_pdk_nativeBridge.isAli()) { //阿里生活号
                PDKLoginService.instance.doWebAliLogin();
            }
            else {
                this.showLogin();
            }
        }

    }

    /**
     * 显示登录
     */
    showLogin(): void {
        PDKalien.PDKSceneManager.show(PDKSceneNames.LOGIN, { autoLogin: true, isFirstIn: true }, PDKalien.sceneEffect.Fade);
    }

    getLocation(): void {
        PDKalien.Native.instance.getWXLocation((location: any) => {
            if (location.result == 'success') {
                PDKMainLogic.instance.latitude = location.latitude
                PDKMainLogic.instance.longitude = location.longitude
                console.log('!!!!!!!!得到位置信息')

                var data: any = { latitude: location.latitude, longitude: location.longitude };
                pdkServer.modifyUserInfo(data);
                this._getLocationTimer.stop();
            } else {
                console.log('获取位置信息失败: ' + location.result);
            }
        });
    }

    start(cb): void {
        if (this.running) {
            return;
        }
        console.log('PDKMainLogic start.');

        this.refreshSelfInfo();

        let gd: PDKGameData = PDKGameData.instance;
        let lastLaunchTime = gd.getItem('lastLaunchTime', 0);
        let a = PDKalien.TimeUtils.tsToDate(lastLaunchTime);
        let b = PDKalien.TimeUtils.tsToDate(pdkServer.tsLocal);
        if (a.getDate() == b.getDate() && a.getMonth() == b.getMonth() && a.getFullYear() == b.getFullYear()) {
            //同一天
            gd.changeItem('todayLaunchCount', 1);
        } else {
            gd.setItem('todayLaunchCount', 1);
        }
        if (PDKalien.TimeUtils.getWeekIndex(lastLaunchTime) == PDKalien.TimeUtils.getWeekIndex(pdkServer.tsLocal)) {
            //同一周
            gd.changeItem('weekLaunchCount', 1);
        } else {
            gd.setItem('weekLaunchCount', 1);
        }
        gd.setItem('lastLaunchTime', pdkServer.tsLocal, true);

        if (pdkServer._isInDDZ) {
            this.running = true;
            cb();
        }
        else {
            async.parallel([
                function (cb) { PDKMatchService.instance.start(cb) },
                function (cb) { PDKBagService.instance.start(cb) },
                function (cb) { PDKCountDownService.instance.start(cb) },
                function (cb) { PDKRechargeService.instance.start(cb) },
                function (cb) { PDKMailService.instance.start(cb) },
            ], () => {
                this.running = true;
                cb();
            });
        }

        this.checkNicknameCount = 0;
    }

    stop(): void {
        PDKalien.PopUpManager.removeAllPupUp();
        if (!this.running) {
            return;
        }
        console.log('PDKMainLogic stop.');

        this.selfData.clean();

        PDKMatchService.instance.stop();
        PDKBagService.instance.stop();
        PDKCountDownService.instance.stop();
        PDKRechargeService.instance.stop();
        PDKMailService.instance.stop();

        pdkServer.close(false);

        this.running = false;
    }

    private _restartFlag: boolean;
    private _restartCallback: Function;
    restart(restartCallback: Function): void {
        this._restartFlag = true;
        this._restartCallback = restartCallback;
        if (pdkServer.connected) {
            this.stop();
        } else {
            restartCallback();
            this._restartFlag = false;
            this._restartCallback = null;
        }

        egret.setTimeout(restartCallback.bind(this), this, 500);
    }

    private onAppEnterForeground() {
        pdkServer.frozen = false;
        if (pdkServer.checkEnterForegroundTimeOut()) {

        }
        else {
            // if(pdkServer.playing) {
            pdkServer.checkReconnect();
            // }
        }

        if (PDKalien.Native.instance.isNative) {
            pdkServer.userInfoRequest(pdkServer.uid); // 强制请求一波玩家信息 刷新一下金豆
            PDKBagService.instance.refreshBagInfo(true);	// 强制请求一波背包信息 刷新一下钻石
        }
    }

    private onAppEnterBackground() {
        pdkServer.frozen = true;
    }

    /**
   * 是否是登录页面
   */
    isLoginScene(): boolean {
        let _curSceneName = PDKalien.PDKSceneManager.instance.currentSceneName;
        if (_curSceneName == PDKSceneNames.LOGIN) {
            return true;
        }
        return false;
    }

    /**
     * 显示网络断开
     */
    showDisconnect(data: any): void {
        if (data.socketClose) {//是否是socket 关闭
            if (PDKalien.StageProxy.isPause() || pdkServer.kickOut || this.isLoginScene()) {//是否是后台或者是被踢掉了
                return;
            }
        }
        this.showMostTopTip(data);
    }

    showMostTopTip(data: any): void {
        PDKalien.Dispatcher.dispatch(PDKEventNames.SHOW_DISCONNECT, data);
    }

	/**
	 * 当服务器关闭时
	 * @param event
	 */
    private onServerClose(event: egret.Event): void {
        this.stop();

		/*if(this._restartFlag){
			if(this._restartCallback){
				this._restartCallback();
			}
			this._restartFlag = false;
			this._restartCallback = null;
		}*/
    }

	/**
	 * 零点的处理
	 * @param event
	 */
    private onClock0(event: egret.Event): void {
        //MissionService.instance.start();
        //pdkServer.getMissionList();
    }

    refreshSelfInfo(): void {
        pdkServer.userInfoRequest(pdkServer.uid);
    }

	/**
	 * 获取到玩家信息
	 * @param event
	 */
    private onUserInfoResponse(event: egret.Event): void {
        let data: any = event.data;
        console.log("onUserInfoResponse------pdk------>", data.uid, pdkServer.uid);
        if (data.uid == pdkServer.uid) {
            this.selfData.initData(data);
            PDKalien.Dispatcher.dispatch(PDKEventNames.MY_USER_INFO_UPDATE, { userInfoData: this.selfData });
            PDKalien.Dispatcher.dispatch(PDKEventNames.GOLD_UPDATE, { gold: this.selfData.gold });
            PDKOtherGameManager.instance.onMyInfoUpdate();
        }
    }

    updateRecorderExpireTime(): void {
        var et = new Date();
        et.setFullYear(this.selfData.cardsRecorder[0], this.selfData.cardsRecorder[1] - 1, this.selfData.cardsRecorder[2])
        // et.setMonth()
        // et.setDate(this.selfData.cardsRecorder[2])
        et.setHours(this.selfData.cardsRecorder[3])
        et.setMinutes(this.selfData.cardsRecorder[4])
        et.setSeconds(this.selfData.cardsRecorder[5])

        var cur = new Date();

        var sub = et.getTime() - cur.getTime();
        this.selfData.cardsRecorder[6] = Math.floor(sub / 1000);
    }


	/**
	 * 请求救济金
	 */
    alms(gold: number = 0): boolean {
        gold = gold || this.selfData.gold;
        if (gold < PDKGameConfig.almsConfig.condition) {
            pdkServer.alms();  //请求救济金
            return true;
        } else {
            this._almsCount++;
            return false;
        }
    }

    /**
     * 游戏服务器更新，充值失败
     */
    public rechareErrByServerUpdate(): void {
        pdkServer.reqServerUpdateRechareErr();
        if (pdkServer.playing) {
            let _info = "游戏服务器已更新，请在本局游戏结束后重新登录游戏!"
            if (PDKalien.Native.instance.isNative) {
                _info = "游戏服务器已更新，请在本局游戏结束后重新启动游戏!";
            }
            PDKAlert.show(_info);
        } else {
            this._onServerHasUpdate();
        }
    }

	/**
	 * 救济金返回
	 * @param event
	 */
    private onAlmsResponse(event: egret.Event): void {
        let data: any = event.data;

        switch (data.result) {
            case 0:   //成功
                if (this._almsCount == 0) {
                    PDKAlert.show(PDKlang.format(PDKlang.id.alms_success,
                        PDKUtils.currencyRatio(PDKGameConfig.almsConfig.gold),
                        PDKGameConfig.almsConfig.count - data.usagecnt
                    ));
                    this._almsUsageCount = data.usagecnt;
                }
                break;
            case 1:   //领取次数使用完
                break;
            case 2:   //未达到领取条件
                break;
        }

        this._almsCount++;
    }

	/**
	 * 返回房间列表
	 */
    static backToRoomScene(params: any = null): void {
        // PDKalien.PDKSceneManager.show(PDKSceneNames.ROOM, params, PDKalien.sceneEffect.Fade, null, null, false, PDKSceneNames.LOADING);
        PDKalien.PDKSceneManager.show(PDKSceneNames.ROOM, { jump2pdk: true }, PDKalien.sceneEffect.Fade, null, null, false, PDKSceneNames.LOADING);
        PDKMainLogic.instance.alms();
    }

	/**
	 * 获取今日启动次数
	 * @returns {any}
	 */
    static getTodayLaunchCount(): number {
        return PDKGameData.instance.getItem('todayLaunchCount', 0);
    }

	/**
	 * 获取这周启动次数
	 * @returns {any}
	 */
    static getWeekLaunchCount(): number {
        return PDKGameData.instance.getItem('weekLaunchCount', 0);
    }

	/**
	 * 获取领取奖励成功的提示文字
	 */
    private _getRewSuccTextByCfg(cfg: any): string {
        let _str = "成功领取";
        cfg.sort(function (a, b) {
            return a.id > b.id;
        })

        for (let i = 0; i < cfg.length; ++i) {
            if (cfg[i].id == 0) {
                _str += "首充每日大礼:" + cfg[i].num + "金豆\n";
            }
            else if (cfg[i].id == 101) {
                _str += "免费表情*" + cfg[i].num + "次 ";
            }
            else if (cfg[i].id == 2) {
                _str += "记牌器*" + (cfg[i].num / 24 / 7) + "天 ";
            }
        }
        return _str;
    }

    /**
	 * 收到领取首充奖励的通知 0成功 1 没有资格 2 奖励已领取 3 奖励已过期
	 */
    private _onRecvGetFRechargeRewRep(e: any): void {
        let _data = e.data;
        let _str = "";
        if (_data.result == 0) {
            let _cfg = PDKGameConfig.getFRechargeRewByDay(_data.day);
            if (_cfg) {
                _str = this._getRewSuccTextByCfg(_cfg);
                _str += "\n\n首充每日大礼剩余" + (7 - _data.day) + "天"
            }
            else {

                PDKLogUtil.error("_onRecvGetFRechargeRewRep==========error===", _data.day, _cfg);
                return;
            }

            PDKBagService.instance.refreshBagInfo();
            this.selfData.setFRechargeTodayHasGet();
            PDKPanelFirstRecharge.setDisableGet()
        }
        else {
            let _arr = {
                [1]: "没有资格",
                [2]: "奖励已领取",
                [3]: "奖励已过期",
            }
            if (_arr[_data.result]) {
                _str = _arr[_data.result];
            }
            else {
                _str = "领取奖励失败";
                PDKLogUtil.error("_onRecvGetRewRep==========error===", _data.result);
            }
        }

        PDKAlert.show(_str);
    }

	/**
	 * 领奖励
	 */
    public onGoGetRewardReq(): void {
        let _userData = this.selfData
        let _day = _userData.getFRechargeRewGetDay();
        if (_day && _day >= 1 && _day <= 7) {
            pdkServer.send(PDKEventNames.USER_GET_FRREWARD_REQ, { day: _day });
            //测试setTimeout(()=>{ 
            //this._onRecvGetRewRep({data:{result:0,day:_day}});
            //},500)
        }
        else {
            PDKLogUtil.info("_onGoRecharge------------ERROR-->", _day);
        }
    }

    /**
 * 收到服务器下发的喇叭消息
 */

    // result 0 成功 1 钻石不足 2 内容不能为空 3 参数错误(type)
    private _onRecvHornRep(e: egret.Event): void {
        let data = e.data;
        let _err = {
            [1]: "钻石不足",
            [2]: "内容不能为空",
            [3]: "参数错误"
        }
        let _str = "";
        if (data.result == null) { //成功
            let _infoList = data.chatinfo;
            let selfName = PDKMainLogic.instance.selfData.nickname;
            let _oneInfo = { time: 0, msg: null, nickname: null };
            for (let i = 0; i < _infoList.length; ++i) {
                if (PDKBase64.decode(_infoList[i].nickname) != selfName) { //如果是自己发的过滤掉
                    _oneInfo.time = _infoList[i].time * 1000;//服务器时间戳是秒
                    _oneInfo.nickname = _infoList[i].nickname;
                    _oneInfo.msg = _infoList[i].msg;
                    this.selfData.addHornTalkRec(_oneInfo);
                }
            }
        }
        else if (_err[data.result]) {
            _str = _err[data.result];
            PDKToast.show(_str);
        }
        else {

        }
    }

    /**
     * 判断钻石复活礼包是否达到每日上限，达到上限，提示去商城，关闭则退回到大厅
     * num:房间的最低钻石数
     */
    public ifBuyReviveMaxTipShop(num: number, roomid: number): void {
        // if (this.selfData.isMaxBuyDiamondRevive()) {
        //     let _nMax = this.selfData.getDiamondReviveMaxBuy();
        //     PDKAlert.show("今日复活礼包购买已达到" + _nMax + "次上限,请前往商城购买!", 0, function (act) {
        //         if (act == "confirm") { //确定前往
        //             PDKPanelExchange2.instance.show(1);
        //         } else {
        //             PDKMainLogic.backToRoomScene();
        //         }
        //     });
        // } else {
        //     PDKPanelReviveBag.getInstance().show(num);
        // }
        PDKPanelReviveBag.getInstance().show(num, roomid);
    }
    /**
     * 当玩家钻石不足，要判断是否领取过新手钻石奖励，如果没有则领取，如果有则提示复活礼包
     * num:房间的最低钻石数
     */
    public noDiamondGetNewDiamondRewOrBuyRevive(num: number, roomid: number) {
        // let _hasGetNewDiamond = this.selfData.hasGetNewDiamond();
        // if (!_hasGetNewDiamond) {
        //     pdkServer.reqNewPlayerGetDiamond();
        //     return;
        // }
        this.ifBuyReviveMaxTipShop(num, roomid);
    }

    /**
     * 需要隐藏入口文件(wx/index.html)的下载APP和刷新按钮
     */
    public hideIndexDownAndRefresh(): void {
        //h5 在大厅界面未展示前要一直显示刷新和 下载App按钮
        if (PDKalien.Native.instance.isWXMP) {
            if (window.top["hideDownApp"]) {
                window.top["hideDownApp"]();
            }
            if (window.top["hideRefresh"]) {
                window.top["hideRefresh"]();
            }
        }
    }

    /**
     * 加载字体
     */
    private loadFntFont(): void {
        if (!RES.isGroupLoaded("pdkfont")) {
            RES.loadGroup("pdkfont");
        }
    }

    /**
     * 加载充值资源
     */
    private loadRecharge(): void {
        // if (!RES.isGroupLoaded("recharge")) {
        //     RES.loadGroup("recharge");
        // }
    }

    /**
     * 加载需要的资源
     */
    private _loadResGroups(): void {
        this.loadFntFont();
        this.loadRecharge();
    }

    public checkPDKGoldNum(_data: any): void {
        let roomInfo = PDKGameConfig.getRoomConfigById(_data.roomid);
        let _gold = PDKMainLogic.instance.selfData.gold;
        if (roomInfo.minScore > _gold) {//金豆不足
            this.showGoldNotEnough(roomInfo.minScore);
            return;
        }
        if (_data.isReconnect) {
            PDKSceneManager.show(PDKSceneNames.PLAY, { action: 'reconnect', roomID: _data.roomid }, PDKalien.sceneEffect.Fade);
        }
        else {
            PDKSceneManager.show(PDKSceneNames.PLAY, { action: 'quick_join', roomID: _data.roomid }, PDKalien.sceneEffect.Fade);
        }
    }

    /**
     * 显示金豆不足
     */
    public showGoldNotEnough(needGold: number): void {
        PDKAlert.show("金豆不足" + needGold + " 是否前往商城购买 ？", 1, function (act) {
            if (act == "confirm") {
                if (pdkServer._isInDDZ) {
                    pdkServer.ddzDispatchEvent(1, '', { type: 2, shopFlag: 0 });
                } else {
                    PDKPanelExchange2.instance.show();
                }
                // PDKPanelExchange2.instance.show(0);
            }
        });
    }

    /**
     * 服务器返回检查结果后执行该函数,来判断是进大厅还是进游戏
     */
    private _reconnectRetCheckStatusByData(data: any): void {
        PDKalien.Dispatcher.dispatch(PDKEventNames.HIDE_WAITING);
        let _curSceneName = PDKSceneManager.instance.currentSceneName;
        let _curScene = PDKSceneManager.instance.currentScene;
        let needReconnect: boolean = false;
        let _gameName: string = null;
        console.log("_reconnectRetCheckStatusByData----->", data)
        if (data.roomid) {
            let _roomInfo = PDKGameConfig.getRoomConfigById(data.roomid);
            if (_roomInfo) {
                _gameName = _roomInfo.gameType;
            }
            console.log("_reconnectRetCheckStatusByData", data.roomid, _gameName, data.gametype)
            if (_gameName == "pdk") {
                needReconnect = true;
            }
        }

        //console.log("onMainLogicStart==========>",_curSceneName,data);
        // if (PDKalien.Native.instance.isNative) {
        //     PDKBagService.instance.refreshBagInfo(true);	// 强制请求一波背包信息 刷新一下钻石
        // }
        if (data.roomid > 999 && data.roomid < 10000 && data.gametype == 2) {
            this._loadResGroups();
            //如果在游戏中，不用再重新加载资源，直接重连回游戏
            if (_curSceneName == PDKSceneNames.PLAY) {//有重连
                let _scene = <ScenePDKPlay>(_curScene);
                _scene.doReconnectToGame({ personalgame: true, action: 'reconnect', roomID: data.roomid });
            } else {
                PDKSceneManager.show(PDKSceneNames.PLAY, { personalgame: true, action: 'reconnect', roomID: data.roomid }, PDKalien.sceneEffect.Fade);
            }
        } else if (needReconnect) {//有重连
            //第三方游戏断线重连
            if (_gameName != PDKGameConfig.gameName) {
                data.action = "reconnect";
                PDKOtherGameManager.instance.runOtherGameByName(_gameName, data);
                return;
            }
            this._loadResGroups();
            //如果在游戏中，不用再重新加载资源，直接重连回游戏
            if (_curSceneName == PDKSceneNames.PLAY) {
                let _scene = <ScenePDKPlay>(_curScene);
                _scene.doReconnectToGame({ personalgame: false, action: 'reconnect', roomID: data.roomid });
            } else {
                PDKSceneManager.show(PDKSceneNames.PLAY, { action: 'reconnect', roomID: data.roomid }, PDKalien.sceneEffect.Fade);
            }
        } else {
            //有第三方游戏则不处理
            if (PDKOtherGameManager.instance.isRunOtherGame()) {
                return;
            }

            PDKwebService.loadLog(2, 1);
            if (_curSceneName == PDKSceneNames.ROOM) {
                let _scene = <PDKSceneRoom>(_curScene);
                _scene.doReconnectToLobby(data);
            } else {
                console.log("PDKSceneManager.show(PDKSceneNames.ROOM, { fromLogin: true }, PDKalien.sceneEffect.Fade);===========")
                // PDKSceneManager.show(PDKSceneNames.ROOM, { fromLogin: true }, PDKalien.sceneEffect.Fade);
                // let roomid = 9000;
                // PDKSceneManager.show(PDKSceneNames.PLAY, { action: 'from_login', roomID: roomid }, PDKalien.sceneEffect.Fade);
                PDKSceneManager.show(PDKSceneNames.ROOM, { jump2pdk: true }, PDKalien.sceneEffect.Fade);
                this._loadResGroups();
            }
        }
    }

    /**
     * 服务器返回重连检查结果
     */
    private _onCheckReconnectRep(event: egret.Event): void {
        let data: any = event.data;

        this.hideIndexDownAndRefresh();
        if (this.running) {
            this._reconnectRetCheckStatusByData(data);
        } else {
            this.start(this._reconnectRetCheckStatusByData.bind(this, data));
        }
    }

    /**
     * 重启游戏
     */
    public doRestartGame(): void {
        let _pdk_nativeBridge = PDKalien.Native.instance;
        this.stop();
        if (!_pdk_nativeBridge.isNative) {
            window.top.location.reload();
        } else {
            //检测更新,如果无更新则显示登录
            _pdk_nativeBridge.checkAppUpdate(function () {
                PDKMainLogic.instance.showLogin();
            });
        }
    }

    /**
     * 服务器已更新
     */
    private _onServerHasUpdate(): void {
        egret.setTimeout(() => {
            let _ins = PDKalien.Native.instance;
            let _func = this.doRestartGame.bind(this);
            let _info: string = "游戏服务器已更新，为了保障您的数据完整性，请重新登录游戏！"
            if (_ins.isNative) {
                _info = "游戏服务器已更新，为了保障您的数据完整性，请重新启动游戏！"
                _func = _ins.closeApp.bind(_ins);
            }
            PDKPanelAlert3.instance.show(_info, 0, function (act) {
                if (act == "confirm") {
                    _func();
                }
            }.bind(this), false);
        }, this, 100)
    }

    /**
     * 关闭自己
     */
    public closeSelf(): void {
        let _pdk_nativeBridge = PDKalien.Native.instance;
        if (_pdk_nativeBridge.isNative) {
            _pdk_nativeBridge.closeApp();
        } else {
            //window.top.close();
        }
    }
}
