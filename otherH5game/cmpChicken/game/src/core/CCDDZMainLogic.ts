/**
 * Created by rockyl on 16/3/3.
 *
 * 主逻辑入口
 */

let CCDDZ_T_G_FISH = 5
let CCDDZ_T_G_GOLD = 1;
let CCDDZ_T_G_DIAMOND = 3;
let CCDDZ_T_G_NIU = 4;
let CCDDZ_T_G_NGOLD = 2;
let CCDDZ_T_G_DZPK = 6;
let CCDDZ_T_G_P_DK = 7;
let CCDDZ_T_G_LLK = 8;
let CCDDZ_T_G_2048 = 9;
let CCDDZ_T_G_FFL = 10;
let CCDDZ_T_G_CC = 11;
class CCDDZMainLogic {
    private static _instance: CCDDZMainLogic;
    public static get instance(): CCDDZMainLogic {
        if (this._instance == undefined) {
            this._instance = new CCDDZMainLogic();
        }
        return this._instance;
    }

    running: boolean;
    private _almsUsageCount: number = 0;

    public latitude: number;
    public longitude: number;

    selfData: CCGlobalUserInfoData;
    checkNicknameCount: number;
    fromThirdPart: string;
    private _getLocationTimer: egret.Timer;
    private _suitableRoom: any;
    private _resCfg: any;
    private _resIns: any;
    private _nToGame: number;

    constructor() {

        this.init();
    }

    private init(): void {
        CCalien.Native.instance.addEventListener('back', this.back, this);  //仅android可用
        CCalien.Native.instance.addEventListener('enterBackground', this.enterBackground, this);
        CCalien.Native.instance.addEventListener('enterForeground', this.enterForeground, this);

        ccserver.addEventListener(CCGlobalEventNames.USER_USER_INFO_RESPONSE, this.onUserInfoResponse, this);
        ccserver.addEventListener(CCGlobalEventNames.USER_ALMS_REP, this.onAlmsResponse, this);

        CCalien.CCDDZDispatcher.addEventListener(CCGlobalEventNames.CLOCK_0, this.onClock0, this);
        CCalien.CCDDZDispatcher.addEventListener(CCGlobalEventNames.SERVER_CLOSE, this.onServerClose, this);
        ccserver.addEventListener(CCGlobalEventNames.USER_GET_FRREWARD_REP, this._onRecvGetFRechargeRewRep, this);
        ccserver.addEventListener(CCGlobalEventNames.USER_PAY_TO_CHAT_REP, this._onRecvHornRep, this);
        ccserver.addEventListener(CCGlobalEventNames.USER_CHECK_RECONNECT_REP, this._onCheckReconnectRep, this);
        ccserver.addEventListener(CCGlobalEventNames.USER_GET_REWARD_REP, this._onRecvGetRewRep, this);
        ccserver.addEventListener(CCGlobalEventNames.USER_QUICK_JOIN_RESPONSE, this.onQuickJoinRep, this);
        ccserver.addEventListener(CCGlobalEventNames.USER_DiamondGame_REP, this._onNewPlayerDiamonRewInfoRep, this);
        CCalien.CCDDZDispatcher.addEventListener(CCGlobalEventNames.SERVER_HASUPDATE, this._onServerHasUpdate, this);
        this._suitableRoom = null;
        this.selfData = new CCGlobalUserInfoData();
    }

    public setWillToGame(nType: number): void {
        this._nToGame = nType;
    }

    public getWillToGame(): number {
        return this._nToGame;
    }

    /**
     * 充值房间点击
     */
    public resetChannelClick(): void {
        this._nToGame = 0;
    }
    /**
     * 新手钻石奖励50钻
     */
    private _onNewPlayerDiamonRewInfoRep(e: egret.Event): void {
        let data = e.data;
        if (data.optype == 3) {
            if (data.result == null) {
                this.selfData.setHasGetNewDiamond();
                let _str = "恭喜您,成功领取新手钻石奖励:免费补充到32钻"
                CCDDZAlert.show(_str, 0, function () {
                    let _curScene = CCalien.CCDDZSceneManager.instance.currentScene;
                    if (_curScene instanceof CCDDZScenePlay) {
                        let scene = <CCDDZScenePlay>(_curScene);
                        scene.checkEnoughSendQuickJoin();
                    } else {
                        ccserver.checkReconnect();
                    }
                });
            } else {
                CCDDZAlert.show("领取新手钻石奖励失败:" + data.result + "|" + this.selfData.diamondgiftgot);
            }
        }
    }
    /**
     * 目前仅处理服务器更新后加入房间返回的错误信息
     */
    private onQuickJoinRep(e: egret.Event): void {
        let data = e.data;
        switch (data.result) {
            case 11: //服务器已更新
                this._onServerHasUpdate();
                break;
        }
    }

    /**
     * 领取奖励的回复(仅处理王炸的抽红包) 5 抽打出王炸红包
     * 0:成功
     */
    private _onRecvGetRewRep(e: egret.Event): void {
        let data = e.data;
        let _desc = null;
        if (data.optype == 5) {
            if (data.result == 0 || data.result == null) {
                if (data.params && data.params.length >= 1) {
                    _desc = "恭喜获得" + CCDDZUtils.exchangeRatio(data.params[0] / 100, true) + "奖杯!";
                    this.selfData.subWangZhaRedNum();
                    CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.USER_RED_COUNT_CHANGE, { num: data.params[0], optype: data.optype });
                    ccserver.getRedcoinRankingListReq();
                }
            }
            else if (data.result == 1) {
                _desc = "活动不存在";
            }
            else if (data.result == 2) {
                _desc = "任务未完成";
            }
            else if (data.result == 3) {
                _desc = "奖励已领取";
            }

            if (_desc) {
                CCDDZAlert.show(_desc);
            }
        }
        else {
            if (data.optype == 10) {
                if (data.result == 0 || data.result == null) {
                    CCDDZMainLogic.instance.selfData["monthcardinfo"][3] = ccserver.tsServer;
                    CCDDZAlert3.show("领取月卡复活成功", (act) => {
                        if (act == "confirm") {
                            let _curScene = CCalien.CCDDZSceneManager.instance.currentScene;
                            if (_curScene instanceof CCDDZScenePlay) {
                                let scene = <CCDDZScenePlay>(_curScene);
                                scene.checkEnoughSendQuickJoin();
                            }
                        }
                    }, "cc_common_btn_lab_confirm_n", false);
                }
            }
            else if (data.optype == 9) {
                if (data.result == 0 || data.result == null) {
                    CCDDZMainLogic.instance.selfData.setHasGetTodayVipRew();
                }
            }
        }
    }

    initData(): void {
        CCGlobalGameConfig.roomList.forEach((roomInfo: any) => {
            if (roomInfo.hasOwnProperty('cycleTime') && !roomInfo.hasOwnProperty('cycleTimeStamp')) {
                roomInfo.cycleTimeStamp = [];
                roomInfo.cycleTime.some((time: string) => {
                    roomInfo.cycleTimeStamp.push(CCalien.TimeUtils.parseTime(time));
                });
            }

            if (roomInfo.roomType == 2) { //比赛房间预处理
				/*roomInfo.reward.forEach((item:any)=>{
					item.reward = CCDDZUtils.parseGoodsString(item.reward);
				});*/
                if (ccserver._isInDDZ) {

                }
                else {
                    roomInfo.masterReward = CCDDZMatchService.getRewardStringByRank(roomInfo);
                    roomInfo.rewardText = CCalien.StringUtils.format(lang.match_jikai_reward, roomInfo.masterReward);
                    if (roomInfo.matchId == 205) {
                        roomInfo.masterReward = CCDDZMatchService.getRewardStringBy205(roomInfo);
                        roomInfo.rewardText = CCalien.StringUtils.format(lang.match_jikai_reward, roomInfo.masterReward);
                    }
                    roomInfo.limitText = CCalien.StringUtils.format(lang.match_jikai_limit, roomInfo.maxPlayer);
                    roomInfo.entryMoneyText = roomInfo.entryMoney > 0 ? CCDDZUtils.currencyRatio(roomInfo.entryMoney) + lang.gold : lang.free_pay;
                }
            }
        });
        // CCGlobalGameConfig.roomList.push({ ads: true,roomType: 2 });

        CCDDZGoodsManager.instance;
        if (ccserver._isInDDZ) {

        }
        else {
            CCDDZMatchService.instance.initData();
        }
        // if(lang.debug == "false"){
        //     if(!this._getLocationTimer){
        //         this._getLocationTimer = new egret.Timer(1000 * 10);
        //         this._getLocationTimer.repeatCount = 5;
        //         this._getLocationTimer.addEventListener(egret.TimerEvent.TIMER, this.getLocation, this);
        //         this._getLocationTimer.start();
        //     }
        // }
        //CCalien.CCDDZSceneManager.addTopScene(CCGlobalSceneNames.GIFT,SceneGift);
    }

    back(event: egret.Event) {
        if (!CCalien.CCDDZPopUpManager.removeTopPupUp()) {
            let _curScene = CCalien.CCDDZSceneManager.instance.currentScene;
            if (_curScene.name == CCGlobalSceneNames.ROOM) {
                let _scene: CCDDZSceneRoom = <CCDDZSceneRoom>_curScene;
                _scene.doBack();
            } else if (!CCalien.CCDDZSceneManager.back(null, CCalien.CCDDZsceneEffect.CCDDFade)) {
                CCalien.Native.instance.closeApp();
            }
        }
    }

    enterForeground(event: egret.Event): void {
        console.log('app enter foreground.');

        this.onAppEnterForeground();
    }

    enterBackground(event: egret.Event): void {
        console.log('app enter background.');

        if (this._ready && CCalien.CCDDZSceneManager.instance.currentSceneName == CCGlobalSceneNames.LOADING) {
            this.tryStart();
        } else {
            CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.ENTER_BACKGROUND);
            this.onAppEnterBackground();
        }
    }

    private _ready: boolean;
    public delayStart(): void {
        console.log("delayStart----------->");
        this._ready = true;
        CCGlobalGameData.instance.loadData();
        CCGlobalUserData.instance.init(CCGlobalGameConfig.platform);
        CCGlobalUserData.instance.loadData();

        this.initData();

        this.tryStart();
    }

    private tryStart(): void {
        console.log('tryStart');
        ccserver.ready();
        if (ccserver._isInDDZ == true) {
            ccserver.checkReconnect();
        }
        else {
            let cc_nativeBridge = CCalien.Native.instance;
            if (cc_nativeBridge.isWXMP) { //微信公众号登录游戏
                CCLoginService.instance.doWebWXLogin();
            } else if (cc_nativeBridge.isAli()) { //阿里生活号
                CCLoginService.instance.doWebAliLogin();
            } else if (cc_nativeBridge.isWxQr()) { //微信 扫码登录
                CCLoginService.instance.doWebWXLogin();
            } else if (cc_nativeBridge.isAliQr()) { //支付宝扫码登录
                CCLoginService.instance.doWebAliLogin();
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
        CCalien.CCDDZSceneManager.show(CCGlobalSceneNames.LOGIN, { autoLogin: true, isFirstIn: true }, CCalien.CCDDZsceneEffect.CCDDFade);
    }

    getLocation(): void {
        CCalien.Native.instance.getWXLocation((location: any) => {
            if (location.result == 'success') {
                CCDDZMainLogic.instance.latitude = location.latitude
                CCDDZMainLogic.instance.longitude = location.longitude
                console.log('!!!!!!!!得到位置信息')

                var data: any = { latitude: location.latitude, longitude: location.longitude };
                ccserver.modifyUserInfo(data);
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
        console.log('CCDDZMainLogic start.');

        this.refreshSelfInfo();

        let gd: CCGlobalGameData = CCGlobalGameData.instance;
        let lastLaunchTime = gd.getItem('lastLaunchTime', 0);
        let a = CCalien.TimeUtils.tsToDate(lastLaunchTime);
        let b = CCalien.TimeUtils.tsToDate(ccserver.tsLocal);
        if (a.getDate() == b.getDate() && a.getMonth() == b.getMonth() && a.getFullYear() == b.getFullYear()) {
            //同一天
            gd.changeItem('todayLaunchCount', 1);
        } else {
            gd.setItem('todayLaunchCount', 1);
        }
        if (CCalien.TimeUtils.getWeekIndex(lastLaunchTime) == CCalien.TimeUtils.getWeekIndex(ccserver.tsLocal)) {
            //同一周
            gd.changeItem('weekLaunchCount', 1);
        } else {
            gd.setItem('weekLaunchCount', 1);
        }
        gd.setItem('lastLaunchTime', ccserver.tsLocal, true);
        if (ccserver._isInDDZ) {
            this.running = true;
            cb();
        }
        else {
            async.parallel([
                function (cb) { CCDDZMatchService.instance.start(cb) },
                function (cb) { CCDDZBagService.instance.start(cb) },
                function (cb) { CCDDZCountDownService.instance.start(cb) },
                function (cb) { CCDDZRechargeService.instance.start(cb) },
                function (cb) { CCDDZExchangeService.instance.start(cb) },
                function (cb) { CCDDZMailService.instance.start(cb) },
            ], () => {
                this.running = true;
                cb();
            });
        }

        this.checkNicknameCount = 0;
    }

    /**
     * 被服务器踢下线
     */
    onKickOut(reason: number): void {
        //reason = 1 被挤下线, reason = 2 解码失败， reason = 3 超时 , reason = 4 被锁定
        if (ccserver._isInDDZ) {
            ccserver.ddzDispatchEvent(1, '', { type: 1 });
            return;
        }
        let data: any = { content: lang.disconnect_kick_out[reason] };
        if (reason == 4 || reason == 1) {
            data.button = lang.confirm;
            if (reason == 4) {
                CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.ACCOUNT_ERROR, data);
            } else {
                this.showMostTopTip(data);
            }
        } else if (reason == 5) { //游戏服务器更新
            this._onServerHasUpdate();
        } else if (reason == 3) { //服务器通知超时
            this.onSocketClose();
        } else {
            this.showMostTopTip(data);
        }
    }

    showMostTopTip(data: any): void {
        CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.SHOW_DISCONNECT, data);
    }

    /**
     * 是否是登录页面
     */
    isLoginScene(): boolean {
        let _curSceneName = CCalien.CCDDZSceneManager.instance.currentSceneName;
        if (_curSceneName == CCGlobalSceneNames.LOGIN) {
            return true;
        }
        return false;
    }

    /**
     * 显示网络断开
     */
    showDisconnect(data: any): void {
        if (data.socketClose) {//是否是socket 关闭
            if (CCalien.CCDDZStageProxy.isPause() || ccserver.kickOut || this.isLoginScene()) {//是否是后台或者是被踢掉了
                return;
            }
        }
        this.showMostTopTip(data);
    }

    /**
     * socket关闭调用,仅在ccserver.ts中的调用
     */
    onSocketClose(): void {
        if (CCalien.CCDDZStageProxy.isPause() || ccserver.kickOut || this.isLoginScene()) {
            return;
        }

        CCLoginService.instance.showWaitAndTryConnect();
    }

    stop(): void {
        CCalien.CCDDZPopUpManager.removeAllPupUp();
        if (!this.running) {
            return;
        }
        console.log('CCDDZMainLogic stop.');

        this.selfData.clean();

        CCDDZMatchService.instance.stop();
        CCDDZBagService.instance.stop();
        CCDDZCountDownService.instance.stop();
        CCDDZRechargeService.instance.stop();
        CCDDZMailService.instance.stop();

        ccserver.close(false);

        this.running = false;
    }

    private _restartFlag: boolean;
    private _restartCallback: Function;
    restart(restartCallback: Function): void {
        this._restartFlag = true;
        this._restartCallback = restartCallback;
        if (ccserver.connected) {
            this.stop();
        } else {
            restartCallback();
            this._restartFlag = false;
            this._restartCallback = null;
        }

        egret.setTimeout(restartCallback.bind(this), this, 500);
    }

    private onAppEnterForeground() {
        ccserver.frozen = false;
        /*if(ccserver.checkEnterForegroundTimeOut()) {

        }
        else {
            ccserver.checkReconnect();
        }

        if (CCalien.Native.instance.isNative) {
            ccserver.userInfoRequest(ccserver.uid); // 强制请求一波玩家信息 刷新一下金豆
            CCDDZBagService.instance.refreshBagInfo(true);	// 强制请求一波背包信息 刷新一下钻石
        }*/
    }

    private onAppEnterBackground() {
        ccserver.frozen = true;
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
        //ccserver.getMissionList();
        CCGlobalGameConfig.setCfgByField("hasGetIRedNum", 0);
        this.selfData.setHasPayToday(0);
    }

    refreshSelfInfo(): void {
        ccserver.userInfoRequest(ccserver.uid);
    }

	/**
	 * 获取到玩家信息
	 * @param event
	 */
    private onUserInfoResponse(event: egret.Event): void {
        let data: any = event.data;
        if (data.uid == ccserver.uid) {
            this.selfData.initData(data);
            CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.MY_USER_INFO_UPDATE, { userInfoData: this.selfData });
            CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.GOLD_UPDATE, { gold: this.selfData.gold });
            CCDDZOtherGameManager.instance.onMyInfoUpdate();
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
        if (gold < CCGlobalGameConfig.almsConfig.condition) {
            ccserver.alms();  //请求救济金
            return true;
        } else {
            return false;
        }
    }

    /**
     * 活动当天剩余的救济金领取次数
     */
    public getLeftAlmsCount(): number {
        let _left = CCGlobalGameConfig.almsConfig.count - this._almsUsageCount;
        if (_left < 0) {
            _left = 0;
        }
        return _left;
    }

    /**
     * 游戏服务器更新，充值失败
     */
    public rechareErrByServerUpdate(): void {
        ccserver.reqServerUpdateRechareErr();
        if (ccserver.playing) {
            let _info = "游戏服务器已更新，请在本局游戏结束后重新登录游戏!"
            if (CCalien.Native.instance.isNative) {
                _info = "游戏服务器已更新，请在本局游戏结束后重新启动游戏!";
            }
            CCDDZAlert.show(_info);
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
                CCDDZAlert.show(lang.format(lang.id.alms_success,
                    CCDDZUtils.currencyRatio(CCGlobalGameConfig.almsConfig.gold),
                    CCGlobalGameConfig.almsConfig.count - data.usagecnt
                ));
                this._almsUsageCount = data.usagecnt;
                break;
            case 1:   //领取次数使用完
                break;
            case 2:   //未达到领取条件
                break;
        }
    }

	/**
	 * 返回房间列表
	 */
    static backToRoomScene(params: any = null): void {
        // CCalien.CCDDZSceneManager.show(CCGlobalSceneNames.ROOM, params, CCalien.CCDDZsceneEffect.CCDDFade, null, null, false, CCGlobalSceneNames.LOADING);
        CCalien.CCDDZSceneManager.show(CCGlobalSceneNames.ROOM, { jump2cc: true }, CCalien.CCDDZsceneEffect.CCDDFade, null, null, false, CCGlobalSceneNames.LOADING);
        CCDDZMainLogic.instance.alms();
    }

	/**
	 * 获取今日启动次数
	 * @returns {any}
	 */
    static getTodayLaunchCount(): number {
        return CCGlobalGameData.instance.getItem('todayLaunchCount', 0);
    }

	/**
	 * 获取这周启动次数
	 * @returns {any}
	 */
    static getWeekLaunchCount(): number {
        return CCGlobalGameData.instance.getItem('weekLaunchCount', 0);
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
                //_str += "免费表情*" + cfg[i].num +"次 "; 
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
            let _cfg = CCGlobalGameConfig.getFRechargeRewByDay(_data.day);
            if (_cfg) {
                _str = this._getRewSuccTextByCfg(_cfg);
                _str += "\n\n首充每日大礼剩余" + (7 - _data.day) + "天"
            }
            else {

                CCDDZLogUtil.error("_onRecvGetFRechargeRewRep==========error===", _data.day, _cfg);
                return;
            }

            CCDDZBagService.instance.refreshBagInfo();
            this.selfData.setFRechargeTodayHasGet();
            CCDDZPanelFirstRecharge.setDisableGet()
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
                CCDDZLogUtil.error("_onRecvGetRewRep==========error===", _data.result);
            }
        }

        CCDDZAlert.show(_str);
    }

	/**
	 * 领奖励
	 */
    public onGoGetRewardReq(): void {
        let _userData = this.selfData
        let _day = _userData.getFRechargeRewGetDay();
        if (_day && _day >= 1 && _day <= 7) {
            ccserver.send(CCGlobalEventNames.USER_GET_FRREWARD_REQ, { day: _day });
            //测试setTimeout(()=>{ 
            //this._onRecvGetRewRep({data:{result:0,day:_day}});
            //},500)
        }
        else {
            CCDDZLogUtil.info("_onGoRecharge------------ERROR-->", _day);
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
            let selfName = CCDDZMainLogic.instance.selfData.nickname;
            let _oneInfo = { time: 0, msg: null, nickname: null };
            let _name = "";
            for (let i = 0; i < _infoList.length; ++i) {
                _name = CCDDZBase64.decode(_infoList[i].nickname);
                if (_name != selfName) { //如果是自己发的过滤掉
                    _oneInfo.time = _infoList[i].time * 1000;//服务器时间戳是秒
                    _oneInfo.nickname = _name;
                    _oneInfo.msg = _infoList[i].msg;
                    this.selfData.addHornTalkRec(_oneInfo);
                }
            }
        }
        else if (_err[data.result]) {
            _str = _err[data.result];
            CCDDZToast.show(_str);
        }
        else {

        }
    }

    /**
     * 判断钻石复活礼包是否达到每日上限，达到上限，提示去商城，关闭则退回到大厅
     */
    public ifBuyReviveMaxTipShop(roomInfo: any): void {
        if (this.selfData.isMaxBuyDiamondRevive()) {
            let _nMax = this.selfData.getDiamondReviveMaxBuy();
            CCDDZAlert.show("今日复活礼包购买已达到" + _nMax + "次上限,请前往商城购买!", 0, function (act) {
                if (act == "confirm") { //确定前往
                    CCDDZPanelExchange2.instance.show(1);
                } else {
                    CCDDZMainLogic.backToRoomScene();
                }
            });
        } else {
            CCDDZPanelReviveBag.getInstance().show(roomInfo);
        }
    }
    /**
     * 当玩家钻石不足，要判断是否领取过新手钻石奖励，如果没有则领取，如果有则提示复活礼包
     */
    public noDiamondGetNewDiamondRewOrBuyRevive(roomInfo: any) {
        let _hasGetNewDiamond = this.selfData.hasGetNewDiamond();
        if (!_hasGetNewDiamond) {
            ccserver.reqNewPlayerGetDiamond();
            return;
        }
        this.ifBuyReviveMaxTipShop(roomInfo);
    }

    /**
     * 需要隐藏入口文件(wx/index.html)的下载APP和刷新按钮
     */
    public hideIndexDownAndRefresh(): void {
        //h5 在大厅界面未展示前要一直显示刷新和 下载App按钮
        if (CCalien.Native.instance.isWXMP) {
        }
    }

    /**
     * 加载字体
     */
    private loadFntFont(): void {
        if (!RES.isGroupLoaded("font")) {
            RES.loadGroup("font");
        }
    }

    /**
     * 加载充值资源
     */
    private loadRecharge(): void {
        if (1) return;
        if (!RES.isGroupLoaded("recharge")) {
            RES.loadGroup("recharge");
        }
    }

    /**
     * 加载需要的资源
     */
    private _loadResGroups(): void {
        this.loadFntFont();
        this.loadRecharge();
    }

    /**
     * 显示金豆不足
     */
    public showGoldNotEnough(needGold: number): void {
        CCDDZAlert.show("金豆不足" + needGold + " 是否前往商城购买 ？", 1, function (act) {
            if (act == "confirm") {
                if (ccserver._isInDDZ) {
                    ccserver.ddzDispatchEvent(1, '', { type: 2, shopFlag: 0 });
                } else {
                    CCDDZPanelExchange2.instance.show(0);
                }
            }
        });
    }

    /**
      * 判断金豆复活礼包是否达到每日上限，达到上限，提示去商城，关闭则退回到大厅
      */
    public ifBuyGoldReviveMaxTipShop(num: number): void {
        if (this.selfData.isMaxBuyGoldRevive()) {
            let _nMax = CCGlobalGameConfig.getGoldReviveMaxBuy();
            CCDDZAlert.show("今日复活礼包购买已达到" + _nMax + "次上限,请前往商城购买!", 0, function (act) {
                if (act == "confirm") { //确定前往
                    CCDDZPanelExchange2.instance.show(0);
                } else {
                    CCDDZMainLogic.backToRoomScene();
                }
            });
        } else {
            let info = { type: 1, num: num };
            CCDDZPanelReviveBag.getInstance().show(info);
        }
    }

    /**
     * 找刺激和斗地主用的是斗地主的牌的资源
     */
    public checkPoker(_func: Function): void {
        let poker = RES.getRes("cc_sheet_poker");
        if (!poker) {
            RES.getResAsync("cc_sheet_poker", () => {
                _func();
            }, this)
        } else {
            _func();
        }
    }

    /**
     * 进入找刺激之前检查是否金豆够
     */
    public checkNiuGoldNum(_data: any): void {
        this.checkCCGoldNum(_data);
        if (1) return;
        let roomInfo = CCGlobalGameConfig.getRoomCfgFromAll(4001);
        let _gold = CCDDZMainLogic.instance.selfData.gold;
        if (roomInfo.minScore > _gold) {//金豆不足
            this.showGoldNotEnough(roomInfo.minScore);
            return;
        }

        this.toZcj();
    }

    /**
     * 进入找刺激
     */
    public toZcj(_data: any = {}): void {
        this.checkPoker(() => {
            let roomInfo = CCGlobalGameConfig.getRoomCfgFromAll(4001);
            CCalien.CCDDZPopUpManager.removeAllPupUp();
            CCalien.CCDDZSceneManager.show("QznnGamePage", { data: _data, roomInfo: roomInfo });
        })
    }

    /**
    * 进入三条之前检查是否金豆够
    */
    public checkCCGoldNum(_data: any): void {
        // let roomInfo = CCGlobalGameConfig.getRoomCfgFromAll(10001);
        // let _gold = CCDDZMainLogic.instance.selfData.gold;
        // if (roomInfo.minScore > _gold) {//金豆不足
        //     this.showGoldNotEnough(roomInfo.minScore);
        //     return;
        // }

        // this.toCC();
        let roomInfo = CCGlobalGameConfig.getRoomConfigById(_data.roomid);
        let _gold = CCDDZMainLogic.instance.selfData.gold;
        if (roomInfo.minScore > _gold) {//金豆不足
            this.showGoldNotEnough(roomInfo.minScore);
            return;
        }
        this.toCC(_data);
    }

    /**
     * 进入三条
     */
    public toCC(_data: any = {}): void {
        this.checkPoker(() => {
            let roomInfo = CCGlobalGameConfig.getRoomCfgFromAll(_data.roomid);
            CCalien.CCDDZPopUpManager.removeAllPupUp();
            CCDDZMainLogic.instance.setScreenLandScape(1280, 640);

            let _action = "quick_join";
            if (!_data.isReconnect) {
                _action = "quick_join"
            }
            else {
                _action = "reconnect"
            }
            CCalien.CCDDZSceneManager.show("SceneCmpChicken", { action: _action, roomID: roomInfo.roomID });
            // CCalien.CCDDZSceneManager.show("SceneCmpChicken", { data: _data, roomInfo: roomInfo });
        })
    }



    /**
     * 跑得快
     */
    public checkPDKGoldNum(): void {
        /*let rooms = CCGlobalGameConfig.getRoomCfgByGameId(9,0);
        let roomInfo = rooms[0]
        let _gold = CCDDZMainLogic.instance.selfData.gold;
        if(roomInfo.minScore > _gold){//金豆不足
            this.showGoldNotEnough(roomInfo.minScore);
            return;
        }
        */
        CCDDZOtherGameManager.instance.runOtherGameByName("pdk");
    }

    /**
     * 进入德州扑克之前检查是否金豆够
     */
    public checkDzpkGoldNum(_data: any): void {
        let rooms = CCGlobalGameConfig.getRoomCfgByGameId(5, 0);
        let roomInfo = rooms[0]
        let _gold = CCDDZMainLogic.instance.selfData.gold;
        if (roomInfo.minScore > _gold) {//金豆不足
            this.showGoldNotEnough(roomInfo.minScore);
            return;
        }
        this.checkPoker(() => {
            CCalien.CCDDZSceneManager.show("SceneDzpkPlay", { data: _data, roomInfo: roomInfo });
        })
    }

    public toFFF(): void {
        let roomInfo = CCGlobalGameConfig.getCfgByField("drawcard_conf.turn");
        CCalien.CCDDZSceneManager.show("SceneFffPlay", { roomInfo });
    }

    public toLLT(): void {
        let roomInfo = CCGlobalGameConfig.getCfgByField("drawcard_conf.checkout");
        CCalien.CCDDZSceneManager.show("GameLLT", { roomInfo });
    }

    /**
     * 服务器返回检查结果后执行该函数,来判断是进大厅还是进游戏
     */
    private _reconnectRetCheckStatusByData(data: any): void {
        CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.HIDE_WAITING);
        let _curSceneName = CCDDZSceneManager.instance.currentSceneName;
        let _curScene = CCDDZSceneManager.instance.currentScene;
        let needReconnect: boolean = false;
        let _gameName: string = null;
        if (data.roomid) {
            needReconnect = true;
            _gameName = CCGlobalGameConfig.getRid2gt(data.roomid);
        }
        //console.log("onMainLogicStart==========>",_curSceneName,data);
        if (data.roomid > 999 && data.roomid < 10000 && data.gametype == 2) {
            this._loadResGroups();
            //如果在游戏中，不用再重新加载资源，直接重连回游戏
            if (_curSceneName == CCGlobalSceneNames.PLAY) {//有重连
                let _scene = <CCDDZScenePlay>(_curScene);
                _scene.doReconnectToGame({ personalgame: true, action: 'reconnect', roomID: data.roomid });
            } else {
                CCDDZSceneManager.show(CCGlobalSceneNames.PLAY, { personalgame: true, action: 'reconnect', roomID: data.roomid }, CCalien.CCDDZsceneEffect.CCDDFade);
            }
        } else if (needReconnect) {//有重连
            if (_gameName == "ddz" || _gameName == "ddz2" || _gameName == "tommorow" || _gameName == "texasholdem") {
                if (data.roomid == 4001) {
                    data.isReconnect = true;
                    this.toZcj(data);
                    return;
                } else if (data.roomid == 5001) {
                    data.isReconnect = true;
                    this.checkDzpkGoldNum(data);
                    return;
                }
            }
            // else if (_gameName != CCGlobalGameConfig.gameName) {
            //     data.action = "reconnect";
            //     if (CCDDZOtherGameManager.instance.isRunOtherGame()) {
            //     } else {
            //         CCDDZOtherGameManager.instance.runOtherGameByName(_gameName, data);
            //     }
            //     return;
            // }

            if (data.roomid == 10001 || data.roomid == 10002 || data.roomid == 10003 || data.roomid == 10004 || data.roomid == 10005 || data.roomid == 10006) {
                data.isReconnect = true;
                this.toCC(data);
                return;
            }
            this._loadResGroups();
            //如果在游戏中，不用再重新加载资源，直接重连回游戏
            if (_curSceneName == CCGlobalSceneNames.PLAY) {
                let _scene = <CCDDZScenePlay>(_curScene);
                _scene.doReconnectToGame({ personalgame: false, action: 'reconnect', roomID: data.roomid });
            } else {
                CCDDZSceneManager.show(CCGlobalSceneNames.PLAY, { action: 'reconnect', roomID: data.roomid }, CCalien.CCDDZsceneEffect.CCDDFade);
            }
        } else {
            //有第三方游戏则不处理
            if (CCDDZOtherGameManager.instance.isRunOtherGame()) {
                return;
            }
            ccddzwebService.loadLog(2, 1);
            //console.log("_reconnectRetCheckStatusByData=======>",_curSceneName,this._suitableRoom);
            if (_curSceneName == CCGlobalSceneNames.ROOM) {
                let _scene = <CCDDZSceneRoom>(_curScene);
                _scene.doReconnectToLobby(data);
            } else {
                // this.toCC();
                // //金豆场合并后房间中金豆变化后要动态调整加入的房间
                // if (this._suitableRoom) {
                //     let _room = this._suitableRoom;
                //     this._suitableRoom = null;
                //     CCalien.CCDDZSceneManager.show(CCGlobalSceneNames.PLAY, { action: 'quick_join', roomID: _room.roomID }, CCalien.CCDDZsceneEffect.CCDDFade);
                //     return;
                // } else {
                //     CCDDZSceneManager.show(CCGlobalSceneNames.ROOM, { fromLogin: true }, CCalien.CCDDZsceneEffect.CCDDFade);
                //     this._loadResGroups();
                // }

                CCalien.CCDDZSceneManager.show(CCGlobalSceneNames.ROOM, { jump2cc: true }, CCalien.CCDDZsceneEffect.CCDDFade);
                this._loadResGroups();
            }
        }
    }

    /**
     * 服务器返回重连检查结果
     */
    private _onCheckReconnectRep(event: egret.Event): void {
        let data: any = event.data;
        console.log("_onCheckReconnectRep-------------------->", data);
        this.hideIndexDownAndRefresh();
        if (this.running) {
            this._reconnectRetCheckStatusByData(data);
        } else {
            this.start(this._reconnectRetCheckStatusByData.bind(this, data));
        }
    }

    /**
     * 根据玩家身上的金豆进入合适的房间
     * 要先找出适合玩家进入的房间配置
     */
    public toSuitableRoom(room: any): void {
        console.log("toSuitableRoom===================>", room);
        this._suitableRoom = room;
    }

    /**
     * 重启游戏
     */
    public doRestartGame(): void {
        let cc_nativeBridge = CCalien.Native.instance;
        this.stop();
        if (!cc_nativeBridge.isNative) {
            window.top.location.reload();
        } else {
            //检测更新,如果无更新则显示登录
            cc_nativeBridge.checkAppUpdate(function () {
                CCDDZMainLogic.instance.showLogin();
            });
        }
    }

    /**
     * 服务器已更新
     */
    private _onServerHasUpdate(): void {
        egret.setTimeout(() => {
            let _ins = CCalien.Native.instance;
            let _func = this.doRestartGame.bind(this);
            let _info: string = "游戏服务器已更新，为了保障您的数据完整性，请重新登录游戏！"
            if (_ins.isNative) {
                _info = "游戏服务器已更新，为了保障您的数据完整性，请重新启动游戏！"
                _func = _ins.closeApp.bind(_ins);
            }
            CCDDZPanelAlert3.instance.show(_info, 0, function (act) {
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
        let cc_nativeBridge = CCalien.Native.instance;
        if (cc_nativeBridge.isNative) {
            cc_nativeBridge.closeApp();
        } else {
            //window.top.close();
        }
    }

    public setScreenLandScape(width, height): void {
        let stage = CCalien.CCDDZStageProxy.stage;
        //stage.$scaleMode = "fixedHeight";

        stage.setContentSize(width, height);
        stage.orientation = egret.OrientationMode.LANDSCAPE;
    }

    public setScreenPortrait(width, height): void {
        let stage = CCalien.CCDDZStageProxy.stage;
        //stage.$scaleMode = "fixedWidth";
        stage.setContentSize(width, height);
        stage.orientation = egret.OrientationMode.PORTRAIT;
    }

    /**
     * 进入游戏时金豆或者是钻石不足
     */
    public enterGameItemNotEnough(roomCfg: any): void {
        if (roomCfg.roomFlag == 1) { //金豆场            
            CCDDZPanelAlert3.instance.show("金豆不足" + roomCfg.minScore + "，是否前往商城购买？", 1, (act) => {
                if (act == "confirm") {
                    if (ccserver._isInDDZ) {
                        this.openDDZShop();
                    }
                    else {
                        CCDDZPanelExchange2.instance.show();
                    }
                }
            })
        } else if (roomCfg.roomFlag == 2) { //钻石场
            if (roomCfg.roomID == 1000) { //三人初级场
                if (!this.selfData.hasGetNewDiamond() && this.selfData.canGetNewDiamond()) {
                    ccserver.reqNewPlayerGetDiamond();
                } else {
                    if (!this.selfData.checkMonthCardRevival()) {
                        CCDDZPanelReviveBag.getInstance().show(roomCfg);
                    }
                }
            } else {
                if (ccserver._isInDDZ) {
                    CCDDZPanelAlert3.instance.show("钻石不足" + roomCfg.minScore + "，是否前往商城购买？", 1, (act) => {
                        if (act == "confirm") {
                            if (ccserver._isInDDZ) {
                                this.openDDZShop(1);
                            }
                            else {
                                CCDDZPanelExchange2.instance.show();
                            }
                        }
                    })
                }
                else {
                    CCDDZPanelReviveBag.getInstance().show(roomCfg);
                }
            }
        }
    }

    /**
     * 进入游戏时金豆或者是钻石超过房间上线
     */
    public enterGameItemIsOver(roomCfg: any): void {
        if (roomCfg.roomFlag == 1) { //金豆场            
            CCDDZPanelAlert3.instance.show("拥有金豆已超过房间上限", 1, (act) => {
                if (act == "confirm") {
                    if (ccserver._isInDDZ) {
                        CCalien.CCDDZSceneManager.show(CCGlobalSceneNames.ROOM, { jump2cc: true }, CCalien.CCDDZsceneEffect.CCDDFade);
                    }
                    else {
                        CCDDZMainLogic.backToRoomScene();
                    }
                }
            })
        } else if (roomCfg.roomFlag == 2) { //钻石场
            if (ccserver._isInDDZ) {
                CCDDZPanelAlert3.instance.show("拥有钻石已超过房间上限", 1, (act) => {
                    if (act == "confirm") {
                        if (ccserver._isInDDZ) {
                            CCalien.CCDDZSceneManager.show(CCGlobalSceneNames.ROOM, { jump2cc: true }, CCalien.CCDDZsceneEffect.CCDDFade);
                        }
                        else {
                            CCDDZMainLogic.backToRoomScene();
                        }
                    }
                })
            }
            else {
                CCDDZPanelReviveBag.getInstance().show(roomCfg);
            }
        }
    }


    private openDDZShop(flag = 0) {
        ccserver.ddzDispatchEvent(1, '', { type: 2, shopFlag: flag });
    }

    /**
     * 根据url获取某个资源的信息
     */
    public getResInfoByUrl(url: string): any {
        let info = null
        if (this._resCfg) {
            if (this._resCfg.urls) {
                info = this._resCfg.urls[url];
            }
        } else if (url.indexOf("goods-icon") >= 0) {
            info = { url };
        }
        //console.log("getResInfoByUrl------->",url,info);
        return info;
    }

    /**
     * 根据name获取某个资源的信息
     */
    public getResInfoByName(name): any {
        if (this._resCfg) {
            if (this._resCfg.names) {
                return this._resCfg.names[name];
            }
        }
        return null;
    }

    /**
     * 解析res.default.json
     */
    public parseResConfigByIns(res: any): void {
        let resInstance = res;
        this._resCfg = { urls: {}, names: {}, subkeys: "" }
        this._resIns = resInstance;
        let mIns = this;
        let url = this._resCfg.urls;
        let name = this._resCfg.names;
        let subkey = this._resCfg.subkeys;
        let oneRes;
        let resourceConfig = <RES.ResourceConfig>(RES["configInstance"]);
        let resKeyMap = resourceConfig["keyMap"];
        for (let k in resKeyMap) {
            oneRes = resKeyMap[k];
            url[oneRes.url] = oneRes;
            name[oneRes.name] = oneRes;
            if (oneRes.subkeys) {
                subkey += oneRes.subkeys + ","
            }
        }

        let src$getAnalyzerByType = this._resIns.$getAnalyzerByType;
        this._resIns.$getAnalyzerByType = function (type: string) {
            let analyzer: any = src$getAnalyzerByType.call(this, type);
            if (!analyzer.hasOverWrite) {
                let srcOnLoadFinish = analyzer.onLoadFinish;
                analyzer.onLoadFinish = function (event: egret.Event) {
                    let request = event.target;
                    let data: any = this.resItemDic[request.$hashCode];
                    let resItem: RES.ResourceItem = data.item;
                    let compFunc: Function = data.func;
                    resItem.loaded = (event.type == egret.Event.COMPLETE);
                    if (resItem.loaded) {
                        if (request instanceof egret.HttpRequest) {
                            resItem.loaded = false;
                            if (this.analyzeConfig) {
                                let info = mIns.getResInfoByUrl(resItem.url)
                                if (info) {
                                    let imageUrl: string = this.analyzeConfig(resItem, request.response);
                                    if (imageUrl) {
                                        url[imageUrl] = { url: imageUrl };
                                    }
                                }
                            }
                        } else {
                            /*if(analyzer.analyzeBitmap){
                                let srcAnalyzeBitmap = analyzer.analyzeBitmap;
                                analyzer.analyzeBitmap = function(resItem:RES.ResourceItem, texture:egret.Texture){
                                    let name:string = resItem.name;
                                    let config:any = this.sheetMap[name];
                                    let targetName:string = resItem.data && resItem.data.subkeys ? "" : name;
                                    //console.log("analyzeBitmap------------------->",name,"config-->",config,"subkeys",resItem.data.subkeys);
                                    srcAnalyzeBitmap.call(analyzer,resItem,texture);
                                }.bind(analyzer);
                            }*/
                        }
                    }

                    if (srcOnLoadFinish) {
                        srcOnLoadFinish.call(this, event);
                    }
                }.bind(analyzer);
            }
            analyzer.hasOverWrite = true;
            return analyzer;
        }.bind(this._resIns);
    }
}
