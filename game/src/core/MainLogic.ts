/**
 * Created by rockyl on 16/3/3.
 *
 * 主逻辑入口
 */

let T_G_FISH = 5
let T_G_GOLD = 1;
let T_G_DIAMOND = 3;
let T_G_NIU = 4; 
let T_G_NGOLD = 2;
let T_G_DZPK= 6;
let T_G_P_DK = 7;
let T_G_LLK = 8; 
let T_G_2048 = 9; 
let T_G_FFL = 10; 
let T_G_FD = 11; 
let T_G_BJ = 12;
class MainLogic {
    private static _instance: MainLogic;
    public static get instance(): MainLogic {
        if(this._instance == undefined) {
            this._instance = new MainLogic();
        }
        return this._instance;
    }

    running: boolean;
    private _almsUsageCount: number = 0;
    
    public latitude:number;
    public longitude:number;

    selfData: UserInfoData;
    checkNicknameCount: number;
    fromThirdPart:string;
    private _getLocationTimer:egret.Timer;
    private _suitableRoom:any;
    private _resCfg:any;
    private _resIns:any;
    private _nToGame:number;

    constructor() {

        this.init();
    }

    private init(): void {
        alien.Native.instance.addEventListener('back',this.back,this);  //仅android可用
        alien.Native.instance.addEventListener('enterBackground',this.enterBackground,this);
        alien.Native.instance.addEventListener('enterForeground',this.enterForeground,this);

        server.addEventListener(EventNames.USER_USER_INFO_RESPONSE,this.onUserInfoResponse,this);
        server.addEventListener(EventNames.USER_ALMS_REP,this.onAlmsResponse,this);
        
        alien.Dispatcher.addEventListener(EventNames.CLOCK_0,this.onClock0,this);
        alien.Dispatcher.addEventListener(EventNames.SERVER_CLOSE,this.onServerClose,this);
        server.addEventListener(EventNames.USER_GET_FRREWARD_REP,this._onRecvGetFRechargeRewRep,this);
        server.addEventListener(EventNames.USER_PAY_TO_CHAT_REP,this._onRecvHornRep,this);
        server.addEventListener(EventNames.USER_CHECK_RECONNECT_REP,this._onCheckReconnectRep,this);
        server.addEventListener(EventNames.USER_GET_REWARD_REP, this._onRecvGetRewRep, this);
        server.addEventListener(EventNames.USER_QUICK_JOIN_RESPONSE,this.onQuickJoinRep,this);
        server.addEventListener(EventNames.USER_DiamondGame_REP,this._onNewPlayerDiamonRewInfoRep,this);
        server.addEventListener(EventNames.USER_FriendsOptype_REP,this._onFriendsOptypeRep,this);
        server.addEventListener(EventNames.USER_MailUnread_REP,this._onHasUnreadMail,this);
        alien.Dispatcher.addEventListener(EventNames.SERVER_HASUPDATE,this._onServerHasUpdate,this);
        
        this._suitableRoom = null;
        this.selfData = new UserInfoData();
    }
    private _onHasUnreadMail():void{
        MailService.instance.getMailList();
    }

    private _onFriendsOptypeRep(e:egret.Event):void{
        let data = e.data;
        let result = data.result;
        let optype = data.optype;
        let flist = data.friendlist;
        let reqlist = data.friendreqlist;
        if(result == null){
            if(optype == 8){
                server.reqFriendsOp(null,6);
            }else if(optype == 6){
		        let info:any = {}
                if(flist){
                    let len = flist.length;
                    for(let i=0;i<len;++i){
                        flist[i].winRate = (flist[i].winrate||0);
                        flist[i].game = flist[i].playround;
                        flist[i].redcoingot = flist[i].redcoingot / 100;
                        info[flist[i].fakeuid] = flist[i];
                    }
                    info.list = flist;
                }

                if(data.friendreqlist){
                    info.req = reqlist;
                }
                if(data.params&&data.params.length >=1){
                    info.sendNum = data.params[0];
                }
                MainLogic.instance.selfData.setFriends(info);
            }else if(optype == 1){
			    Toast.show("发送加好友请求成功！");
            }else if(optype == 3 || optype == 4 || optype == 5 || optype == 7){
                MailService.instance.getMailList();
                BagService.instance.refreshBagInfo();
                if(optype == 3){
                    Toast.show("发送礼物成功！");
                    
                    if(data.params&&data.params.length >=1){
                        let sendNum = data.params[0];
                        MainLogic.instance.selfData.setHasSendNum(sendNum);
                    }
                }else if(optype == 7){
                    if(flist&&flist.length >=1){
                        let pInfo = flist[0];
                        let sNick = Base64.decode(pInfo.nickname);
                        Toast.show("添加好友" +sNick.substr(0,10) + "成功！");
                        server.reqFriendsOp(null,6);
                    }
                }
            }else if(optype == 2){
                if(data.params&&data.params.length >=1){
                    let fakeUid = data.params[0];
                    MainLogic.instance.selfData.removeFromFriendList(fakeUid);
                }
                PanelPlayerInfo.remove();
            }
        }else if(optype == 1){
            let sErr = "";
			let t = {
				[1]:"金币不足",
				[2]:"参数错误",
				[3]:"好友数量超过上限",
                [4]:"对方好友数量超过上限",
                [6]:"重复添加好友"
			}
			if(t[result]){
				sErr = t[result];
			}else{
				sErr = "发送加好友请求请求失败：" +result;
			}
			Toast.show(sErr);
        }else if(optype == 3){
            if(result == 2){
				Toast.show("金豆不足！");
            }else if(result == 4){
				Toast.show("您不是VIP,无法给好友发送红包！");
            }else if(result == 5){
				Toast.show("今日可赠送红包次数已用完，请明日再送。");
			}else{
				Toast.show("发送礼物失败：" + result);
			}
        }
    }

    public setWillToGame(nType:number):void{
        this._nToGame = nType;
    }

    public getWillToGame():number{
        return this._nToGame;
    }

    /**
     * 充值房间点击
     */
    public resetChannelClick():void{
        this._nToGame = 0;
    }
    /**
     * 新手钻石奖励50钻
     */
    private _onNewPlayerDiamonRewInfoRep(e:egret.Event):void{
        let data = e.data;
        if(data.optype ==3){
            if(data.result ==null){
                this.selfData.setHasGetNewDiamond();
                let _str = "恭喜您,成功领取新手钻石奖励:免费补充到48钻"
                Alert.show(_str,0,function(){
                    let _curScene = alien.SceneManager.instance.currentScene;
                    if(_curScene instanceof ScenePlay){
                        let scene = <ScenePlay>(_curScene);
                        scene.checkEnoughSendQuickJoin();
                    }else{
                        server.checkReconnect();
                    }
                });
            }else{
                Alert.show("领取新手钻石奖励失败:"+data.result + "|" + this.selfData.diamondgiftgot);
            }
        } 
    }
    /**
     * 目前仅处理服务器更新后加入房间返回的错误信息
     */
    private onQuickJoinRep(e:egret.Event):void{
        let data = e.data;
        switch(data.result) {
            case 11: //服务器已更新
                this._onServerHasUpdate();
                break;
        }
    }

    /**
     * 领取奖励的回复(仅处理王炸的抽红包) 5 抽打出王炸红包
     * 0:成功
     */
    private _onRecvGetRewRep(e:egret.Event):void{
        let data = e.data;
        let _desc = null;
        if(data.optype == 5){
            if(data.result == 0 ||data.result == null){
                if(data.params && data.params.length >= 1){ 
                    _desc =  "恭喜获得" + Utils.exchangeRatio(data.params[0] / 100,true) + "奖杯!";
                    this.selfData.subWangZhaRedNum();
                    alien.Dispatcher.dispatch(EventNames.USER_RED_COUNT_CHANGE,{num:data.params[0],optype:data.optype});
                    server.getRedcoinRankingListReq();
                }
            }
            else if(data.result == 1){
                _desc = "活动不存在";
            }
            else if(data.result ==2){
                _desc = "任务未完成";
            }
            else if(data.result == 3){
                _desc = "奖励已领取";
            }

            if(_desc){
                Alert.show(_desc);
            }
        }
        else{
            if(data.optype == 10) {
                if(data.result == 0 ||data.result == null){                    
                    MainLogic.instance.selfData["monthcardinfo"][3] = server.tsServer;
                    Alert3.show("领取月卡复活成功", (act)=>{                                             
                        if(act == "confirm") {                            
                            let _curScene = alien.SceneManager.instance.currentScene;
                            if(_curScene instanceof ScenePlay){
                                let scene = <ScenePlay>(_curScene);
                                scene.checkEnoughSendQuickJoin();
                            }										
                        }
                    }, "common_btn_lab_confirm", false);                                        
                }
            }
            else if(data.optype == 9){
                if(data.result == 0 ||data.result == null){
                    MainLogic.instance.selfData.setHasGetTodayVipRew();
                }
            } 
        }
    }
    
    initData(): void {
        GameConfig.roomList.forEach((roomInfo: any) => {
            if(roomInfo.hasOwnProperty('cycleTime') && !roomInfo.hasOwnProperty('cycleTimeStamp')) {
                roomInfo.cycleTimeStamp = [];
                roomInfo.cycleTime.some((time: string) => {
                    roomInfo.cycleTimeStamp.push(alien.TimeUtils.parseTime(time));
                });
            }

            if(roomInfo.roomType == 2) { //比赛房间预处理
				/*roomInfo.reward.forEach((item:any)=>{
					item.reward = Utils.parseGoodsString(item.reward);
				});*/
                roomInfo.masterReward = MatchService.getRewardStringByRank(roomInfo);
                roomInfo.rewardText = alien.StringUtils.format(lang.match_jikai_reward,roomInfo.masterReward);
                if(roomInfo.matchId == 205){
                    roomInfo.masterReward = MatchService.getRewardStringBy205(roomInfo);
                    roomInfo.rewardText = alien.StringUtils.format(lang.match_jikai_reward,roomInfo.masterReward);
                }
                roomInfo.limitText = alien.StringUtils.format(lang.match_jikai_limit,roomInfo.maxPlayer);
                let _entryMoneyText = "";
                if(roomInfo.entryMoney || roomInfo.entryDiamond) {
                    if(roomInfo.entryMoney  > 0) {
                        _entryMoneyText = Utils.currencyRatio(roomInfo.entryMoney) + lang.gold
                    }
                    else if(roomInfo.entryDiamond) {
                        _entryMoneyText = Utils.currencyRatio(roomInfo.entryDiamond) + "钻石";
                    }
                }
                else {
                    _entryMoneyText = lang.free_pay
                }
                roomInfo.entryMoneyText =  _entryMoneyText;
            }
        });
        // GameConfig.roomList.push({ ads: true,roomType: 2 });

        GoodsManager.instance;
        MatchService.instance.initData();
        // if(lang.debug == "false"){
        //     if(!this._getLocationTimer){
        //         this._getLocationTimer = new egret.Timer(1000 * 10);
        //         this._getLocationTimer.repeatCount = 5;
        //         this._getLocationTimer.addEventListener(egret.TimerEvent.TIMER, this.getLocation, this);
        //         this._getLocationTimer.start();
        //     }
        // }
        //alien.SceneManager.addTopScene(SceneNames.GIFT,SceneGift);
    }

    back(event: egret.Event) {
        if(!alien.PopUpManager.removeTopPupUp()) {
            let _curScene = alien.SceneManager.instance.currentScene;
            if(_curScene.name == SceneNames.ROOM){
                let _scene :SceneRoom =  <SceneRoom>_curScene;
                _scene.doBack();
            }else if(!alien.SceneManager.back(null,alien.sceneEffect.Fade)) {
                alien.Native.instance.closeApp();
            }
        }
    }

    enterForeground(event: egret.Event): void {
        console.log('app enter foreground.');

        this.onAppEnterForeground();
    }

    enterBackground(event: egret.Event): void {
        console.log('app enter background.');

        if(this._ready && alien.SceneManager.instance.currentSceneName == SceneNames.LOADING) {
            this.tryStart();
        } else {
             alien.Dispatcher.dispatch(EventNames.ENTER_BACKGROUND);
            this.onAppEnterBackground();
        }
    }

    private _ready: boolean;
    public delayStart(): void {
        console.log("delayStart----------->");
        this._ready = true;
        GameData.instance.loadData();
        UserData.instance.init(GameConfig.platform);
        UserData.instance.loadData();

        this.initData();

        this.tryStart();
    }

    private tryStart(): void {
        console.log('tryStart');
        server.ready();
        let _nativeBridge = alien.Native.instance;
        if(_nativeBridge.isWXMP){ //微信公众号登录游戏
            LoginService.instance.doWebWXLogin();
        }else if(_nativeBridge.isAli()){ //阿里生活号
            LoginService.instance.doWebAliLogin();
        }else if(_nativeBridge.isWxQr()){ //微信 扫码登录
            LoginService.instance.doWebWXLogin();
        }else if(_nativeBridge.isAliQr()){ //支付宝扫码登录
            LoginService.instance.doWebAliLogin();
        }
        else{
            this.showLogin();
        }
    }

    /**
     * 显示登录
     */
    showLogin():void{
        alien.SceneManager.show(SceneNames.LOGIN,{ autoLogin: true,isFirstIn: true},alien.sceneEffect.Fade);
    }

    getLocation():void{
        alien.Native.instance.getWXLocation( (location:any)=>{
            if(location.result == 'success'){
                MainLogic.instance.latitude = location.latitude
                MainLogic.instance.longitude = location.longitude
                console.log('!!!!!!!!得到位置信息')

                var data:any = {latitude: location.latitude, longitude: location.longitude};
				server.modifyUserInfo(data);
                this._getLocationTimer.stop();
            }else{
                console.log('获取位置信息失败: ' +location.result);
            } 
        });
    }

    start(cb): void {
        if(this.running) {
            return;
        }
        console.log('MainLogic start.');
        this.refreshSelfInfo();

        let gd: GameData = GameData.instance;
        let lastLaunchTime = gd.getItem('lastLaunchTime',0);
        let a = alien.TimeUtils.tsToDate(lastLaunchTime);
        let b = alien.TimeUtils.tsToDate(server.tsLocal);
        if(a.getDate() == b.getDate() && a.getMonth() == b.getMonth() && a.getFullYear() == b.getFullYear()) {
            //同一天
            gd.changeItem('todayLaunchCount',1);
        } else {
            gd.setItem('todayLaunchCount',1);
        }
        if(alien.TimeUtils.getWeekIndex(lastLaunchTime) == alien.TimeUtils.getWeekIndex(server.tsLocal)) {
            //同一周
            gd.changeItem('weekLaunchCount',1);
        } else {
            gd.setItem('weekLaunchCount',1);
        }
        gd.setItem('lastLaunchTime',server.tsLocal,true);

        async.parallel([
            function(cb) { MatchService.instance.start(cb) },
            function(cb) { BagService.instance.start(cb) },
            function(cb) { CountDownService.instance.start(cb) },
            function(cb) { RechargeService.instance.start(cb) },
            function(cb) { ExchangeService.instance.start(cb) },
            function(cb) { MailService.instance.start(cb) },
        ],() => {
            this.running = true;
            cb();
        });

        this.checkNicknameCount = 0;
    }

    /**
     * 被服务器踢下线
     */
    onKickOut(reason:number):void{
        //reason = 1 被挤下线, reason = 2 解码失败， reason = 3 超时 , reason = 4 被锁定
		let data: any = { content: lang.disconnect_kick_out[reason] };
        if (reason == 4 || reason == 1) {
            data.button = lang.confirm;
            if(reason ==4){
                alien.Dispatcher.dispatch(EventNames.ACCOUNT_ERROR,data);
            }else{
                this.showMostTopTip(data);
            }
        }else if(reason == 5){ //游戏服务器更新
            this._onServerHasUpdate();
        }else if(reason == 3){ //服务器通知超时
            this.onSocketClose();
        }else{
            this.showMostTopTip(data);
        }
    }

    showMostTopTip(data:any):void{
        alien.Dispatcher.dispatch(EventNames.SHOW_DISCONNECT,data);
    }

    /**
     * 是否是登录页面
     */
    isLoginScene():boolean{
        let _curSceneName = alien.SceneManager.instance.currentSceneName;
        if(_curSceneName == SceneNames.LOGIN){
            return true;
        }
        return false;
    }

    /**
     * 显示网络断开
     */
    showDisconnect(data:any):void{
        if(data.socketClose){//是否是socket 关闭
            if(alien.StageProxy.isPause() || server.kickOut || this.isLoginScene()){//是否是后台或者是被踢掉了
                return;
            }
        }
        this.showMostTopTip(data);
    }

    /**
     * socket关闭调用,仅在server.ts中的调用
     */
    onSocketClose():void{
        if(alien.StageProxy.isPause()|| server.kickOut || this.isLoginScene()){
            return;
        }
        
        LoginService.instance.showWaitAndTryConnect();
    }

    stop(): void {
        alien.PopUpManager.removeAllPupUp();
        if(!this.running) {
            return;
        }
        console.log('MainLogic stop.');

        this.selfData.clean();

        MatchService.instance.stop();
        BagService.instance.stop();
        CountDownService.instance.stop();
        RechargeService.instance.stop();
        MailService.instance.stop();
        server.close(false);

        this.running = false;
    }

    private _restartFlag: boolean;
    private _restartCallback:Function;
    restart(restartCallback: Function): void {
        this._restartFlag = true;
        this._restartCallback = restartCallback;
        if(server.connected) {
            this.stop();
        } else {
            restartCallback();
            this._restartFlag = false;
            this._restartCallback = null;
        }

        egret.setTimeout(restartCallback.bind(this), this, 500);
    }

    private onAppEnterForeground() {
        server.frozen = false;
        /*if(server.checkEnterForegroundTimeOut()) {

        }
        else {
            server.checkReconnect();
        }

        if (alien.Native.instance.isNative) {
            server.userInfoRequest(server.uid); // 强制请求一波玩家信息 刷新一下金豆
            BagService.instance.refreshBagInfo(true);	// 强制请求一波背包信息 刷新一下钻石
        }*/
    }

    private onAppEnterBackground() {
        server.frozen = true;
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
        //server.getMissionList();
        GameConfig.setCfgByField("hasGetIRedNum",0);
        this.selfData.setHasPayToday(0);
    }

    refreshSelfInfo(): void {
        server.reqFriendsInfo();
        MailService.instance.getMailList();
        BagService.instance.refreshBagInfo();
        server.userInfoRequest(server.uid);
    }

	/**
	 * 获取到玩家信息
	 * @param event
	 */
    private onUserInfoResponse(event: egret.Event): void {
        let data: any = event.data;
        if(data.uid == server.uid) {
            this.selfData.initData(data);
            alien.Dispatcher.dispatch(EventNames.MY_USER_INFO_UPDATE,{ userInfoData: this.selfData });
            alien.Dispatcher.dispatch(EventNames.GOLD_UPDATE,{ gold: this.selfData.gold });
        }
    }

    updateRecorderExpireTime():void{
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
        if(gold < GameConfig.almsConfig.condition) {
            server.alms();  //请求救济金
            return true;
        } else {
            return false;
        }
    }

    /**
     * 活动当天剩余的救济金领取次数
     */
    public getLeftAlmsCount():number{
        let _left = GameConfig.almsConfig.count - this._almsUsageCount;
        if(_left < 0){
            _left = 0;
        }
        return _left;
    }

    /**
     * 游戏服务器更新，充值失败
     */
    public rechareErrByServerUpdate():void{
        server.reqServerUpdateRechareErr();
        if(server.playing){
            let _info = "游戏服务器已更新，请在本局游戏结束后重新登录游戏!"
            if(alien.Native.instance.isNative){
                _info = "游戏服务器已更新，请在本局游戏结束后重新启动游戏!";
            }
            Alert.show(_info);
        }else{
            this._onServerHasUpdate();
        }
    }
    
	/**
	 * 救济金返回
	 * @param event
	 */
    private onAlmsResponse(event: egret.Event): void {
        let data: any = event.data;

        switch(data.result) {
            case 0:   //成功
                Alert.show(lang.format(lang.id.alms_success,
                    Utils.currencyRatio(GameConfig.almsConfig.gold),
                    GameConfig.almsConfig.count - data.usagecnt
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
        alien.SceneManager.show(SceneNames.ROOM,params,alien.sceneEffect.Fade,null,null,false,SceneNames.LOADING);
        MainLogic.instance.alms();
    }

	/**
	 * 获取今日启动次数
	 * @returns {any}
	 */
    static getTodayLaunchCount(): number {
        return GameData.instance.getItem('todayLaunchCount',0);
    }

	/**
	 * 获取这周启动次数
	 * @returns {any}
	 */
    static getWeekLaunchCount(): number {
        return GameData.instance.getItem('weekLaunchCount',0);
    }

	/**
	 * 获取领取奖励成功的提示文字
	 */
	private _getRewSuccTextByCfg(cfg:any):string{
		let _str = "成功领取";
        cfg.sort(function(a,b){
            return a.id > b.id;
        })

		for(let i=0;i<cfg.length;++i){
			if(cfg[i].id ==0){
				_str += "首充每日大礼:"+cfg[i].num +"金豆\n"; 
			}
			else if(cfg[i].id == 101){
				//_str += "免费表情*" + cfg[i].num +"次 "; 
			}
			else if(cfg[i].id == 2){
				_str += "记牌器*" + (cfg[i].num/24/7) +"天 "; 
			}
		}
		return _str;
	}
    
    /**
	 * 收到领取首充奖励的通知 0成功 1 没有资格 2 奖励已领取 3 奖励已过期
	 */
	private _onRecvGetFRechargeRewRep(e:any):void{
		let _data = e.data;
		let _str = "";
		if(_data.result ==0){
			let _cfg = GameConfig.getFRechargeRewByDay(_data.day);
			if(_cfg){
				_str = this._getRewSuccTextByCfg(_cfg);
				_str += "\n\n首充每日大礼剩余" + (7- _data.day) + "天"
			}
			else{
				
				LogUtil.error("_onRecvGetFRechargeRewRep==========error===",_data.day,_cfg);
				return;
			}
            
			BagService.instance.refreshBagInfo();
		    this.selfData.setFRechargeTodayHasGet();
            PanelFirstRecharge.setDisableGet()
		}
		else{
			let _arr = {
				[1] :"没有资格",
				[2] :"奖励已领取",
				[3] :"奖励已过期",
			}
			if(_arr[_data.result]){
				_str = _arr[_data.result];
			}
			else{
				_str = "领取奖励失败";
				LogUtil.error("_onRecvGetRewRep==========error===",_data.result);
			}
		}

		Alert.show(_str);
	}

	/**
	 * 领奖励
	 */
	public onGoGetRewardReq():void{		
		let _userData = this.selfData
		let _day = _userData.getFRechargeRewGetDay();
		if(_day &&_day>=1 &&_day <=7){
			server.send(EventNames.USER_GET_FRREWARD_REQ,{day:_day});
            //测试setTimeout(()=>{ 
                 //this._onRecvGetRewRep({data:{result:0,day:_day}});
            //},500)
		}
		else{
			LogUtil.info("_onGoRecharge------------ERROR-->",_day);
		}
	}

        /**
     * 收到服务器下发的喇叭消息
     */

    // result 0 成功 1 钻石不足 2 内容不能为空 3 参数错误(type)
    private _onRecvHornRep(e:egret.Event):void{
        let data = e.data;
        let _err = {
            [1] : "钻石不足",
            [2] : "内容不能为空",
            [3] : "参数错误"
        }
        let _str = "";
        if(data.result == null){ //成功
            let _infoList = data.chatinfo;
		    let selfName = MainLogic.instance.selfData.nickname;
            let _oneInfo = {time:0,msg:null,nickname:null};
            let _name = "";
            for (let i=0;i<_infoList.length;++i){
                _name = Base64.decode(_infoList[i].nickname);
                if(_name != selfName){ //如果是自己发的过滤掉
                    _oneInfo.time = _infoList[i].time * 1000;//服务器时间戳是秒
                    _oneInfo.nickname = _name;
                    _oneInfo.msg = _infoList[i].msg;
                    this.selfData.addHornTalkRec(_oneInfo);
                }
            }
        }
        else if(_err[data.result]){
            _str = _err[data.result];
            Toast.show(_str);
        }
        else{

        }
    }

    /**
     * 判断钻石复活礼包是否达到每日上限，达到上限，提示去商城，关闭则退回到大厅
     */
    public ifBuyReviveMaxTipShop(roomInfo:any):void{
        if(this.selfData.isMaxBuyDiamondRevive()){
            let _nMax = this.selfData.getDiamondReviveMaxBuy();
            Alert.show("今日复活礼包购买已达到"+_nMax +"次上限,请前往商城购买!",0,function(act){
                if(act == "confirm"){ //确定前往
                    PanelExchange2.instance.show(1);
                }else{
                    MainLogic.backToRoomScene();
                }
            });
        }else{
            PanelReviveBag.getInstance().show(roomInfo);
        }
    }
    /**
     * 当玩家钻石不足，要判断是否领取过新手钻石奖励，如果没有则领取，如果有则提示复活礼包
     */
    public noDiamondGetNewDiamondRewOrBuyRevive(roomInfo:any){
        let _hasGetNewDiamond = this.selfData.hasGetNewDiamond();
        if(!_hasGetNewDiamond){
            server.reqNewPlayerGetDiamond();
            return;
        }
        this.ifBuyReviveMaxTipShop(roomInfo);
    }

    /**
     * 当玩家钻石不足，要判断是否领取过新手钻石奖励，如果没有则领取
     */
    public noDiamondGetNewDiamondRew(roomInfo:any){
        let _hasGetNewDiamond = this.selfData.hasGetNewDiamond();
        if(!_hasGetNewDiamond){
            server.reqNewPlayerGetDiamond();
            return true;
        }        
        return false;
    }

    /**
     * 需要隐藏入口文件(wx/index.html)的下载APP和刷新按钮
     */
    public hideIndexDownAndRefresh():void{
        //h5 在大厅界面未展示前要一直显示刷新和 下载App按钮
        if(alien.Native.instance.isWXMP){
        }
    }

    /**
     * 加载字体
     */
    private loadFntFont():void{
        if(!RES.isGroupLoaded("font")){
            RES.loadGroup("font");
        }
    }

    /**
     * 加载充值资源
     */
    private loadRecharge():void{
        if(!RES.isGroupLoaded("recharge")){
            RES.loadGroup("recharge");
        }
    }

    /**
     * 加载需要的资源
     */
    private _loadResGroups():void{
        this.loadFntFont();
        this.loadRecharge();
    }
    
    /**
     * 显示金豆不足
     */
    public showGoldNotEnough(needGold:number):void{
       Alert.show("金豆不足" + needGold + " 是否前往商城购买 ？",1,function(act){
            if(act == "confirm"){
                PanelExchange2.instance.show(0);
            }
        });
    }

   /**
     * 判断金豆复活礼包是否达到每日上限，达到上限，提示去商城，关闭则退回到大厅
     */
    public ifBuyGoldReviveMaxTipShop(num:number):void{
        if(this.selfData.isMaxBuyGoldRevive()){
            let _nMax = GameConfig.getGoldReviveMaxBuy();
            Alert.show("今日复活礼包购买已达到"+_nMax +"次上限,请前往商城购买!",0,function(act){
                if(act == "confirm"){ //确定前往
                    PanelExchange2.instance.show(0);
                }else{
                    MainLogic.backToRoomScene();
                }
            });
        }else{
            let info = {type:1,num:num};
            PanelReviveBag.getInstance().show(info);
        }
    }

    /**
     * 找刺激和斗地主用的是斗地主的牌的资源
     */
    public checkPoker(_func:Function):void{
        let poker = RES.getRes("sheet_poker");
        if(!poker){
            RES.getResAsync("sheet_poker",()=>{
                _func();
            },this)
        }else{
            _func();
        }
    }

    /**
     * 进入找刺激之前检查是否金豆够
     */
    public checkNiuGoldNum(_data:any):void{
        let roomInfo = GameConfig.getRoomCfgFromAll(4001);
        let _gold = MainLogic.instance.selfData.gold;
        if(roomInfo.minScore > _gold){//金豆不足
            this.showGoldNotEnough(roomInfo.minScore);
            return;
        }

        this.toZcj();
    }

    /**
     * 进入找刺激
     */
    public toZcj(_data:any = {}):void{
        this.checkPoker(()=>{
            let roomInfo = GameConfig.getRoomCfgFromAll(4001);
            alien.PopUpManager.removeAllPupUp();
            alien.SceneManager.show("QznnGamePage",{data:_data,roomInfo:roomInfo});
        })
    }

    /**
     * 进入连连看之前检查是否金豆够
     */
    public checkLLKGoldNum(_data:any):void{
        let roomInfo = GameConfig.getRoomCfgByGameId(20,20001);
        let _gold = MainLogic.instance.selfData.gold;
        if(roomInfo.minScore > _gold){//金豆不足
            this.showGoldNotEnough(roomInfo.minScore);
            return;
        }

        this.toLlk();
    }
    /**
     * 进入连连看
     */
    public toLlk(_data:any = {}):void{
        let roomInfo = GameConfig.getRoomCfgByGameId(20,20001);
        alien.PopUpManager.removeAllPupUp();
        alien.SceneManager.show("GameLLK",{data:_data,roomInfo:roomInfo});
    }

     /**
     * 进入2048之前检查是否金豆够
     */
    public check2048GoldNum(_data:any):void{
        let roomInfo = GameConfig.getRoomCfgByGameId(21,21001);
        let _gold = MainLogic.instance.selfData.gold;
        if(roomInfo.minScore > _gold){//金豆不足
            this.showGoldNotEnough(roomInfo.minScore);
            return;
        }
        this.to2048();
    }
    /**
     * 进入2048
     */
    public to2048(_data:any = {}):void{
        let roomInfo = GameConfig.getRoomCfgByGameId(21,21001);
        alien.PopUpManager.removeAllPupUp();
        alien.SceneManager.show("Game2048",{data:_data,roomInfo:roomInfo});
    }

     /**
     * 进入翻翻乐之前检查是否金豆够
     */
    public checkFFLGoldNum(_data:any):void{
        let roomInfo = GameConfig.getRoomCfgByGameId(22,22001);
        let _gold = MainLogic.instance.selfData.gold;
        if(roomInfo.minScore > _gold){//金豆不足
            this.showGoldNotEnough(roomInfo.minScore);
            return;
        }
        
        this.toFfl();
    }
    /**
     * 进入翻翻乐
     */
    public toFfl(_data:any = {}):void{
        let roomInfo = GameConfig.getRoomCfgByGameId(22,22001);
        alien.PopUpManager.removeAllPupUp();
        alien.SceneManager.show("GameFFL",{data:_data,roomInfo:roomInfo});
    }

     /**
     * 进入飞刀之前检查是否金豆够
     */
    public checkFDGoldNum(_data:any):void{
        let roomInfo = GameConfig.getRoomCfgByGameId(24,24000);
        let _gold = MainLogic.instance.selfData.gold;
        if(roomInfo.minScore > _gold){//金豆不足
            this.showGoldNotEnough(roomInfo.minScore);
            return;
        }
        
        this.toFd();
    }
    /**
     * 进入飞刀
     */
    public toFd(_data:any = {}):void{
        let roomInfo = GameConfig.getRoomCfgByGameId(24,24000);
        alien.PopUpManager.removeAllPupUp();
        alien.SceneManager.show("GameFD",{data:_data,roomInfo:roomInfo});
    }
    

    /**
     * 跑得快
     */
    public checkPDKGoldNum():void{
        /*let rooms = GameConfig.getRoomCfgByGameId(9,0);
        let roomInfo = rooms[0]
        let _gold = MainLogic.instance.selfData.gold;
        if(roomInfo.minScore > _gold){//金豆不足
            this.showGoldNotEnough(roomInfo.minScore);
            return;
        }
        */
        OtherGameManager.instance.runOtherGameByName("pdk");
    }

    /**
     * 进入德州扑克之前检查是否金豆够
     */
    public checkDzpkGoldNum(_data:any):void{
        let rooms = GameConfig.getRoomCfgByGameId(5,0);
        let roomInfo = rooms[0]
        let _gold = MainLogic.instance.selfData.gold;
        if(roomInfo.minScore > _gold){//金豆不足
            this.showGoldNotEnough(roomInfo.minScore);
            return;
        }
        this.checkPoker(()=>{
            alien.SceneManager.show("SceneDzpkPlay",{data:_data,roomInfo:roomInfo});
        })
    }
  /**
     * 比鸡
     */
    public checkBJGoldNum():void{
        /*let rooms = GameConfig.getRoomCfgByGameId(9,0);
        let roomInfo = rooms[0]
        let _gold = MainLogic.instance.selfData.gold;
        if(roomInfo.minScore > _gold){//金豆不足
            this.showGoldNotEnough(roomInfo.minScore);
            return;
        }
        */
        OtherGameManager.instance.runOtherGameByName("chickencompare");
    }
    public toFFF():void{
        let roomInfo =  GameConfig.getCfgByField("drawcard_conf.turn");
        alien.SceneManager.show("SceneFffPlay",{roomInfo});
    }

    public toLLT():void{
        let roomInfo =  GameConfig.getCfgByField("drawcard_conf.checkout");
        alien.SceneManager.show("GameLLT",{roomInfo});
    }

    /**
     * 服务器返回检查结果后执行该函数,来判断是进大厅还是进游戏
     */
   private _reconnectRetCheckStatusByData(data: any): void {
        alien.Dispatcher.dispatch(EventNames.HIDE_WAITING);
        let _curSceneName = SceneManager.instance.currentSceneName;
        let _curScene = SceneManager.instance.currentScene; 
        let needReconnect: boolean = false;
        let _gameName:string = null;
        if(data.roomid){
            needReconnect = true;
            alien.PopUpManager.removeAllPupUp();
            _gameName = GameConfig.getRid2gt(data.roomid);
            if(data.roomid == 20001){
                data.isReconnect = true;
                this.toLlk(data);
                return;
            }else if(data.roomid == 21001){
                data.isReconnect = true;
                this.to2048(data);
                return;
            }else if(data.roomid == 22001){
                data.isReconnect = true;
                this.toFfl(data);
                return;
            }else if(data.roomid == 24000){
                data.isReconnect = true;
                this.toFd(data);
                return;
            }else if(data.roomid == 5001){
                data.isReconnect = true;
                this.checkDzpkGoldNum(data);
                return;
            }
        }
        //console.log("onMainLogicStart==========>",_curSceneName,data);
        if(data.roomid > 999 && data.roomid < 10000 && data.gametype == 2){
            this._loadResGroups();
            //如果在游戏中，不用再重新加载资源，直接重连回游戏
            if(_curSceneName == SceneNames.PLAY){//有重连
                let _scene = <ScenePlay>(_curScene);
                _scene.doReconnectToGame({personalgame:true, action: 'reconnect',roomID: data.roomid });
            }else{
                SceneManager.show(SceneNames.PLAY,{personalgame:true, action: 'reconnect',roomID: data.roomid },alien.sceneEffect.Fade);
            }
        }else if(needReconnect) {//有重连
            if(_gameName== "ddz" || _gameName =="ddz2" || _gameName == "tommorow" || _gameName == "texasholdem"){
                if(data.roomid == 4001){
                    data.isReconnect = true;
                    this.toZcj(data);
                    return;
                }else if(data.roomid == 5001){
                    data.isReconnect = true;
                    this.checkDzpkGoldNum(data);
                    return;
                }
            }else if(_gameName !=  GameConfig.gameName){
                data.action = "reconnect";
                let _matchcfg = GameConfig.getRoomConfigByMatchId(data.roomid);
                if(!_matchcfg) {
                    if(OtherGameManager.instance.isRunOtherGame()){
                    }else{
                        OtherGameManager.instance.runOtherGameByName(_gameName,data);
                    }
                }
                else if(_matchcfg.gameType == "pdk" && _matchcfg.roomType == 2) {
                    alien.SceneManager.show(SceneNames.RUNFASTPLAY, { action: 'reconnect', roomID: data.roomid}, alien.sceneEffect.Fade);
                }                              
                return;
            }
            this._loadResGroups();
            //如果在游戏中，不用再重新加载资源，直接重连回游戏
            if(_curSceneName == SceneNames.PLAY){
                let _scene = <ScenePlay>(_curScene);
                _scene.doReconnectToGame({personalgame:false, action: 'reconnect',roomID: data.roomid });
            }else{
                SceneManager.show(SceneNames.PLAY,{ action: 'reconnect',roomID: data.roomid },alien.sceneEffect.Fade);
            }
        }else {
            //有第三方游戏则不处理
            if(OtherGameManager.instance.isRunOtherGame()){
                return;
            }
            webService.loadLog(2,1);
            //console.log("_reconnectRetCheckStatusByData=======>",_curSceneName,this._suitableRoom);
            if(_curSceneName == SceneNames.ROOM){
                let _scene = <SceneRoom>(_curScene);
                _scene.doReconnectToLobby(data);
            }else{
                //金豆场合并后房间中金豆变化后要动态调整加入的房间
                if(this._suitableRoom){
                    let _room = this._suitableRoom;
                    this._suitableRoom = null;
                    alien.SceneManager.show(SceneNames.PLAY,{ action: 'quick_join',roomID: _room.roomID },alien.sceneEffect.Fade);
                    return;
                }else{
                    SceneManager.show(SceneNames.ROOM,{ fromLogin: true },alien.sceneEffect.Fade);
                    this._loadResGroups();
                }
            }
        }
    }

    /**
     * 服务器返回重连检查结果
     */
    private _onCheckReconnectRep(event: egret.Event): void {
        let data: any = event.data;
        console.log("_onCheckReconnectRep-------------------->",this.running,data);
        this.hideIndexDownAndRefresh();
        if(this.running){
            this._reconnectRetCheckStatusByData(data);
        }else{
            this.start(this._reconnectRetCheckStatusByData.bind(this,data));
        }
    }

    /**
     * 根据玩家身上的金豆进入合适的房间
     * 要先找出适合玩家进入的房间配置
     */
    public toSuitableRoom(room:any):void{
        console.log("toSuitableRoom===================>",room);
        this._suitableRoom = room;
    }

    /**
     * 重启游戏
     */
    public doRestartGame():void{
        let _nativeBridge = alien.Native.instance; 
        this.stop();
        if(!_nativeBridge.isNative){
            window.top.location.reload();
        }else{
            //检测更新,如果无更新则显示登录
            _nativeBridge.checkAppUpdate(function(){
                MainLogic.instance.showLogin();
            });
        }
    }

    /**
     * 服务器已更新
     */
    private _onServerHasUpdate():void{
        egret.setTimeout(()=>{
            let _ins = alien.Native.instance;
            let _func = this.doRestartGame.bind(this);
            let _info:string = "游戏服务器已更新，为了保障您的数据完整性，请重新登录游戏！"
            if(_ins.isNative){
                _info = "游戏服务器已更新，为了保障您的数据完整性，请重新启动游戏！"
                _func = _ins.closeApp.bind(_ins);
            }
            PanelAlert3.instance.show(_info,0,function(act){
                if(act == "confirm"){
                    _func();
                }
            }.bind(this),false);
        },this,100)
    }

    /**
     * 关闭自己
     */
    public closeSelf():void{
        let _nativeBridge = alien.Native.instance;
        if(_nativeBridge.isNative){
            _nativeBridge.closeApp();
        }else{
            //window.top.close();
        }
    }

    public setScreenLandScape(width,height):void{
        let stage = alien.StageProxy.stage;
        //stage.$scaleMode = "fixedHeight";

        stage.setContentSize(width,height);
        stage.orientation = egret.OrientationMode.LANDSCAPE;
    }

    public setScreenPortrait(width,height):void{
        let stage = alien.StageProxy.stage;
        //stage.$scaleMode = "fixedWidth";
        stage.setContentSize(width,height);
        stage.orientation = egret.OrientationMode.PORTRAIT;
    }

    /**
     * 进入游戏时金豆或者是钻石不足
     */
    public enterGameItemNotEnough(roomCfg:any):void{
        if(roomCfg.roomFlag == 1){ //金豆场
            PanelReviveBag.getInstance().show(roomCfg);
        }else if(roomCfg.roomFlag == 2){ //钻石场
            if(roomCfg.roomID == 1000){ //三人初级场
                if(!this.selfData.hasGetNewDiamond() && this.selfData.canGetNewDiamond()){
                    server.reqNewPlayerGetDiamond();
                }else{
                    if(!this.selfData.checkMonthCardRevival()){
                        PanelReviveBag.getInstance().show(roomCfg);
                    }
                }
            }else{
                PanelReviveBag.getInstance().show(roomCfg);
            }
        }
    }

    /**
     * 根据url获取某个资源的信息
     */
    public getResInfoByUrl(url:string):any{
        let info = null
        if(this._resCfg){
            if(this._resCfg.urls){
                info = this._resCfg.urls[url];
            }
        }else if(url.indexOf("goods-icon")>=0){
            info = {url};
        }
        //console.log("getResInfoByUrl------->",url,info);
        return info;
    }

    /**
     * 根据name获取某个资源的信息
     */
    public getResInfoByName(name):any{
        if(this._resCfg){
            if(this._resCfg.names){
                return this._resCfg.names[name];
            }
        }
        return null;
    }

    /**
     * 解析res.default.json
     */
    public parseResConfigByIns(res:any):void{
        let resInstance = res;
        this._resCfg = {urls:{},names:{},subkeys:""}
        this._resIns = resInstance;
        let mIns = this;
        let url = this._resCfg.urls;
        let name = this._resCfg.names;
        let subkey = this._resCfg.subkeys;
        let oneRes;
        let resourceConfig = <RES.ResourceConfig>(RES["configInstance"]);
        let resKeyMap = resourceConfig["keyMap"];
        for (let k in resKeyMap){
            oneRes = resKeyMap[k];
            url[oneRes.url] = oneRes;
            name[oneRes.name] = oneRes;
            if(oneRes.subkeys){
                subkey += oneRes.subkeys +","
            }
        }

        let src$getAnalyzerByType = this._resIns.$getAnalyzerByType;
        this._resIns.$getAnalyzerByType = function(type:string){
            let analyzer:any = src$getAnalyzerByType.call(this,type);
            if(!analyzer.hasOverWrite){
                let srcOnLoadFinish = analyzer.onLoadFinish;
                analyzer.onLoadFinish = function(event:egret.Event){
                    let request = event.target;
                    let data:any = this.resItemDic[request.$hashCode];
                    let resItem:RES.ResourceItem = data.item;
                    let compFunc:Function = data.func;
                    resItem.loaded = (event.type == egret.Event.COMPLETE);
                    if (resItem.loaded) {
                        if (request instanceof egret.HttpRequest) {
                            resItem.loaded = false;
                            if(this.analyzeConfig){
                                let info = mIns.getResInfoByUrl(resItem.url)
                                if(info){
                                    let imageUrl:string = this.analyzeConfig(resItem, request.response);
                                    if (imageUrl) {
                                        url[imageUrl] = {url:imageUrl};
                                    }
                                }
                            }
                        }else{
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

                    if(srcOnLoadFinish){
                        srcOnLoadFinish.call(this,event);
                    }
                }.bind(analyzer);
            }
            analyzer.hasOverWrite = true;
            return analyzer;
        }.bind(this._resIns);
    }
}
