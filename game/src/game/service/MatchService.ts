import SoundManager = alien.SoundManager;
/**
 * Created by rockyl on 16/3/30.
 *
 * 比赛逻辑
 */

class MatchService extends Service{
	private static _instance:MatchService;
	public static get instance():MatchService {
		if (this._instance == undefined) {
			this._instance = new MatchService();
		}
		return this._instance;
	}

	private _timer:number;
	private _watchedRooms:any[];
	private _timerWaiting:number;
	private _marqueeMatchs:any = {};
	private _checkCount:number = 0;

	private _idTopNotify:any = {timerId:-1,matchId:0,nextTurn:null,signIn:false};
	private _matchTopNotify:any[];

	private _scoreGetOut:number;      //淘汰分数线
	private _countPromote:number;     //晋级名额
	private _currentTurn:number;      //当前轮
	private _currentPlay:number;      //当前局
	private _currentMatchMode:number; //当前比赛模式
	private _playerInMatch:number;    //比赛中的玩家数
	private _nextPlayerCount:number;  //下一轮比赛玩家数
	private _notFinishTableCnt:number;   //未完成比赛的桌数

	private myUserInfoData:UserInfoData;
	private _matchover:boolean;
	private _justTipOnceMatch:any = {}; //只提示一次的比赛信息
	private _marqueeQueue:any = [];
	public get nextPlayerCount():number{
		return this._nextPlayerCount;
	}

	public get notFinishTableCnt(): number{
		return this._notFinishTableCnt;
	}

	protected init():void{
		this.myUserInfoData = MainLogic.instance.selfData;
		this._watchedRooms = [];

		this._matchTopNotify = alien.Utils.parseColorTextFlow(lang.match_top_notify);

		

		//PanelMatchResult.instance.show([1, 100, 1003, 3], null);
	}

	start(cb):void {
		this._playerInMatch = 1000000;
		this._checkCount = 0;
		this._watchedRooms.splice(0);
		if(this._timer>0){
			egret.clearInterval(this._timer);
		}
		this._initDefaultInfo();
		this._timer = egret.setInterval(this.onTimer.bind(this), this,1000);
		server.addEventListener(EventNames.USER_MATCH_SING_UP_INFO_REP, this.onMatchSignUpInfoRep, this);
		server.addEventListener(EventNames.USER_MATCH_SING_UP_REP, this.onMatchSignUpRep, this);
		server.addEventListener(EventNames.USER_MATCH_START_NTF, this.onMatchStartNtf, this);
		server.addEventListener(EventNames.USER_MATCH_INFO_NTF, this.onMatchInfoNtf, this);
		server.addEventListener(EventNames.USER_GIVE_UP_MATCH_REP, this.onGiveUpMatchRep, this);
		server.addEventListener(EventNames.GAME_GAME_START_NTF, this.onGameStart, this, false, 1000);
		server.addEventListener(EventNames.GAME_GAME_END, this.onGameEnd, this);
		server.addEventListener(EventNames.GAME_LEAVE_TABLE, this.onLeaveTable, this);
		server.addEventListener(EventNames.GAME_RECONNECT_REP, this.onReconnectRep, this);
		this.checkMatchStatus();
		super.start(cb);
	}

	stop():void {
		super.stop();

		if(this._timer > 0){
			egret.clearInterval(this._timer);
		}

		this._clearIdTopNotify();
		server.removeEventListener(EventNames.USER_MATCH_SING_UP_INFO_REP, this.onMatchSignUpInfoRep, this);
		server.removeEventListener(EventNames.USER_MATCH_SING_UP_REP, this.onMatchSignUpRep, this);
		server.removeEventListener(EventNames.USER_MATCH_START_NTF, this.onMatchStartNtf, this);
		server.removeEventListener(EventNames.USER_MATCH_INFO_NTF, this.onMatchInfoNtf, this);
		server.removeEventListener(EventNames.USER_GIVE_UP_MATCH_REP, this.onGiveUpMatchRep, this);
		server.removeEventListener(EventNames.GAME_GAME_START_NTF, this.onGameStart, this);
		server.removeEventListener(EventNames.GAME_GAME_END, this.onGameEnd, this);
		server.removeEventListener(EventNames.GAME_LEAVE_TABLE, this.onLeaveTable, this);
		server.removeEventListener(EventNames.GAME_RECONNECT_REP, this.onReconnectRep, this);
	}
	private _clearIdTopNotify():void{
		if(this._idTopNotify.timerId > 0){
			CountDownService.unregister(this._idTopNotify.timerId);
			alien.Dispatcher.dispatch(EventNames.HIDE_TOP_NOTIFY);
		}

		this._idTopNotify.matchId = 0;
		this._idTopNotify.timerId = -1;
		this._idTopNotify.nextTurn = null;
		this._idTopNotify.signIn = false;
	}

	get scoreGetOut():number {
		return this._scoreGetOut;
	}

	set currentTurn(ct:number) {
		this._currentTurn = ct;
	}

	get currentTurn():number {
		return this._currentTurn;
	}

	get currentPlay():number {
		return this._currentPlay;
	}

	get currentMatchMode():number {
		return this._currentMatchMode;
	}

	get countPromote():number {
		return this._countPromote;
	}

	get currentPlayers(): number {
		return this._playerInMatch;
	}

	/**
	 * zhu 显示比赛报名成功的tips
	 */
	private _showSignMatchSucc(roomInfo:any,nextTurn:any):void{
		let str = "   " + roomInfo.name + "报名成功！\n（比赛还有{2}小时{1}分钟开始，开赛前有提示）";
		let tsNow:number = server.tsNow;
		let tsNext = nextTurn.nextTs;
		str = alien.TimeUtils.timeFormat(tsNext-tsNow, str);
		Alert.show(str);
	}

	/**
	 * 回复报名结果
	 * @param event
	 required int32 result = 1;   0成功 1已经报名过 2比赛已经开始 3找不到比赛 4取消失败，没报名过 5取消失败，已经开始
	 required int32 matchid = 2;
	 required int32 optype = 3;
	 */
	private onMatchSignUpRep(event:egret.Event):void{
		let data:any = event.data;

		if(data.result > 0){
			if(data.result == 8){
				PanelMatchSignUp.instance.close();
				PanelRechargeTips.instance.show();
			}else{
				if(data.result == 16){
					let roomInfo:any = GameConfig.getRoomConfigByMatchId(data.matchid);
					// Alert.show(lang.format(lang.match_sign_up_result[data.result], roomInfo.maxOwnGoldLimit, roomInfo.name));
					Alert.show(alien.StringUtils.formatApply(lang.match_sign_up_result[16], [roomInfo.maxOwnGoldLimit, roomInfo.name]));
				}else if(data.result == 5){
					//没有报过名
				}else if(data.result == 18){
					//钻石不足
					PanelMatchSignUp.instance.close();
					PanelAlert3.instance.show("钻石不足，是否前往商城购买？",1,(act)=>{
						if(act == "confirm"){
							PanelExchange2.instance.show(1);
						}
					})
				}
				else{
					Alert.show(lang.match_sign_up_result[data.result]);
				}
			}
		}else{
			BagService.instance.refreshBagInfo();    //涉及到参赛券的使用,需要更新背包
			let roomInfo:any = GameConfig.getRoomConfigByMatchId(data.matchid);
			switch(data.optype){
				case 1: //报名成功
					roomInfo.is_signup = 1;
					server.addEventListener(EventNames.USER_MATCH_INFO_NTF, this.onMatchInfoNtf, this);

					PanelMatchSignUp.instance.close();
					if(roomInfo.hasOwnProperty('startDate')) {  //定时开赛
						let turnInfo = this.addWatchRoom(roomInfo,true);
						//zhu 500元定时赛和1000元定时赛不弹出报名的界面
						//if(roomInfo.matchId == 201 || roomInfo.matchId == 202|| roomInfo.matchId == 203){
							this._showSignMatchSucc(roomInfo,turnInfo);
						/*}
						else{
							PanelMatchCountDown.instance.show(roomInfo);
						}*/
					}else{
						PanelMatchWaiting.instance.show(roomInfo);
					}
					break;
				case 2: //取消报名成功
					roomInfo.is_signup = 0;
					if(roomInfo.hasOwnProperty('startDate')) {  //定时开赛
						if(this._idTopNotify.timerId > 0 && roomInfo.matchId == this._idTopNotify.matchId){
							this._clearIdTopNotify();
						}
						this.cancelSignIn(roomInfo);
						PanelMatchCountDown.instance.close();
						PanelMatchNotice.instance.close();
					}else{
						PanelMatchWaiting.instance.close();
					}
					break;
			}

			alien.Dispatcher.dispatch(EventNames.REFRESH_MATCH_LIST,data);
		}
	}

	/**
	 * 初始化默认的数据
	 */
	private _initDefaultInfo():void{
		this._currentMatchMode = 0;
		this._currentTurn = 0;
		this._currentPlay = 0;
		this._countPromote = 0;
		this._playerInMatch = 1000000;
		this._nextPlayerCount = 0;
		this._notFinishTableCnt = 0;
	}

	/**
	 * 比赛开始广播
	 * @param event
	 */
	private onMatchStartNtf(event:egret.Event):void{
		let data:any = event.data;

		this._initDefaultInfo();

		let roomInfo:any = GameConfig.getRoomConfigByMatchId(data.matchid);

		if(roomInfo.stage.length > 1){
			this.updateScoreGetOut(data.matchid);//, roomInfo.stage[0].baseScore[0][1]);
		}

		if(SceneManager.instance.currentSceneName == SceneNames.PLAY){
			MainLogic.backToRoomScene();
		}
		server.resetSession();
		
		if(roomInfo.hasOwnProperty('startDate')){
			alien.Dispatcher.dispatch(EventNames.HIDE_TOP_NOTIFY);

			GameConfig.roomList.forEach((match:any)=>{
				if(!match.hasOwnProperty('startDate') && match.is_signup >= 1){
					server.giveUpMatch(match.matchId);
				}
				
			});
		}
		server.startCache();
		let _matchid = data.matchid;
		if(OtherGameManager.instance.isRunOtherGame()) {
			console.log("从第三方游戏回到斗地主的比赛")
			OtherGameManager.instance._onOtherToMatch(_matchid)
		}
		else {
			let _matchcfg = GameConfig.getRoomConfigByMatchId(_matchid);			
			if(_matchcfg.gameType == "pdk") {
				alien.SceneManager.show(SceneNames.RUNFASTPLAY, {roomID: _matchid}, alien.sceneEffect.Fade);
			}
			else {
				alien.SceneManager.show(SceneNames.PLAY, {roomID: _matchid}, alien.sceneEffect.Fade);
			}
		}		
	}

	/**
	 * 当比赛中展示了淘汰结算后检查是否需要移除比赛信息监听
	 */
	public onMatchEndCheckRemoveMatchInfoNtf(data:any):void{
       let roomInfo:any = GameConfig.setMatchSignupFlag(data.matchid, 0);
        if(!GameConfig.anyMatchSignuped()){
            server.removeEventListener(EventNames.USER_MATCH_INFO_NTF, this.onMatchInfoNtf, this);
        }
	}

	/**
	 * 比赛信息更新
	 * @param event
	 */
	private onMatchInfoNtf(event:egret.Event):void{
		let data:any = event.data;
		let roomInfo:any = GameConfig.getRoomConfigByMatchId(data.matchid);
		let stage:any[] = roomInfo.stage;

		switch(data.optype){
			case -1:// 参赛人数不足比赛取消
				var cfg = GameConfig.getRoomConfigByMatchId(data.matchid);
				if(data.params && data.params[0] && data.params[0] > 0){
					Alert.show('您报名的' + cfg.name + '因人数不足比赛取消\n报名费用' + data.params[0] +'已通过邮件退还');
				}
				break;
			case -2:// 服务器更新
				var cfg = GameConfig.getRoomConfigByMatchId(data.matchid);
				if(cfg){
					Alert.show('您报名的' + cfg.name + '已更新\n请在开赛前重新登录游戏 感谢您的配合');
				}
				break;
			case 100:   //游戏模式变动  1:打立出局 2:瑞士位移 3:新模式
				this._currentMatchMode = data.params[0];

				if(!data.params[1]){
					let turnCount:number = 1;
					if(this._currentMatchMode == 2){
						turnCount = stage[stage.length == 1 ? 0 : 1].handCount;
					}

					PanelBeforeMatch.instance.show(stage.length, this._currentMatchMode, turnCount);
					PanelMatchWaitingInner.instance.close();
				}
				break;
			case 101:   //等待其他玩家界面
				if(!this._matchover && server.isMatch){
					// egret.setTimeout(() => {
						let roomInfo:any = GameConfig.getRoomConfigByMatchId(data.matchid);
						var index = MatchService.instance._currentTurn + 1 + 2
						if(data.params.length > index){
							// MatchService.instance.checkMatchWaiting(data.params[index]);	
							MatchService.instance.checkMatchWaiting(this._nextPlayerCount, false, this.notFinishTableCnt, this._playerInMatch);												
						}
                    // }, this, 1000 * 6);
				}
				break;
			case 102:   //游戏结算界面
				this._matchover = true;
				if(this._timerWaiting > 0){
					egret.clearTimeout(this._timerWaiting);
					this._timerWaiting = 0;
				}
				PanelMatchWaitingInner.instance.close();
				// if(data.params[0] > 0){  //有名次才显示结算界面
				// 	PanelMatchResult.instance.show(data, this.onPanelMatchResultClose.bind(this));
				// 	BagService.instance.refreshBagInfo();    //涉及到物品奖励,需要更新背包
				// }

				/*let roomInfo:any = GameConfig.setMatchSignupFlag(data.matchid, 0);

				if(!GameConfig.anyMatchSignuped()){
					server.removeEventListener(EventNames.USER_MATCH_INFO_NTF, this.onMatchInfoNtf, this);
				}*/
				break;
			case 103:   //牌局开始显示界面
				this._countPromote = data.params[0];
				this._currentTurn = data.params[1]; //当前的局数				
				this._currentPlay = 0;
				break;
			case 104:   //更新排名,在ScenePlay里处理  
			// 0-当前排名 1-剩余玩家 2-下一轮晋级人数 3-未完成桌数
				this._playerInMatch = data.params[1];
				this._nextPlayerCount = data.params[2];
				this._notFinishTableCnt = data.params[3];
				if(this._currentMatchMode == 1){
					this.checkMatchWaiting(this._nextPlayerCount, false, this.notFinishTableCnt, this._playerInMatch);
				}

				if (data.roundscore && data.roundscore.length > 0 && data.roundscore[0].params.length > 0) {
					GameConfig.matchRoundscore = data.roundscore;
				}
				break;
			case 105:   //淘汰分数线变化
				this.updateScoreGetOut(data.matchid, data.params[0]);
				break;
			case 106:   //轮和局更新
				this._currentTurn = data.params[0];//this._currentMatchMode == 1 ?  : data.params[0];//data.params[0];
				this._currentPlay = data.params[1];
				this._countPromote = data.params[2];

				console.log('currentTurn', this._currentTurn, 'currentPlay', this._currentPlay);
				break;
		}


		this.dispatchEvent(event);
	}

	public updateScoreGetOut(matchid:any, value:number = -1){
		// if(roomInfo && roomInfo.stage && value){
		let roomInfo:any = GameConfig.getRoomConfigByMatchId(matchid);
		console.log("updateScoreGetOut--------------------->",this._currentMatchMode,this._currentPlay);
		if(this._currentMatchMode == 3){
			let kickScore = roomInfo.stage[0].kickScore;
			let currentPlay = this._currentPlay -1;
			let lenKick = kickScore.length;
			if(currentPlay < 0){
				currentPlay = 0;
			}
			else if(currentPlay >= lenKick){
				currentPlay = lenKick - 1;
			}
			this._scoreGetOut = kickScore[currentPlay];
		}else{
			if(value == -1){
				value = roomInfo.stage[0].baseScore[0][1];
			}
			let kickOutOdds:number = roomInfo.stage[0].kickOutOdds;
			this._scoreGetOut = value * kickOutOdds;
		}
		// }
		console.log('scoreGetOut :' + this._scoreGetOut);
	}

	private onGameStart(event:egret.Event):void{
		if(server.isMatch){
			this._matchover = false;
			this._currentPlay ++;
			if(this._currentMatchMode == 3){ //新模式
				this.updateScoreGetOut(server.roomInfo.matchId);
			}
		}
	}

	private onGameEnd(event:egret.Event):void{
		if(server.isMatch){
			this.checkMatchWaiting(this._nextPlayerCount, true, this._notFinishTableCnt, this._playerInMatch);
		}
	}

	private onLeaveTable(event:egret.Event):void{
		if(server.isMatch){

		}
	}

	private onReconnectRep(event:egret.Event):void{
		if(server.isMatch){
			this.checkMatchWaiting();
		}
	}

	//_currentMatchMode 1:打立出局 2:瑞士位移
	public checkMatchWaiting(nextPlayerCount:number = 0, fromGameEnd:boolean = false, notFinishTableCnt: number = 0, playerInMatch:number = 100000):void{
		console.log("checkMatchWaiting-------->", server.playing, alien.SceneManager.instance.currentSceneName, this._matchover);
		// if(server.playing || alien.SceneManager.instance.currentSceneName != SceneNames.PLAY ||
		// this._matchover ){
		// 	return ;
		// }
		let _show = false;
		if(!server.playing && !this._matchover && (alien.SceneManager.instance.currentSceneName == SceneNames.PLAY || alien.SceneManager.instance.currentSceneName == SceneNames.RUNFASTPLAY)) {
			_show = true;
		}
		if(!_show) {
			return ;
		}

		console.log('checkMatchWaiting currentMatchMode:', this._currentMatchMode, fromGameEnd);
		if(this._currentMatchMode == 2){
			if(!fromGameEnd){
				let _type = 0;
				if(playerInMatch == 100000) {
					_type = 0;
				}
				else {
					_type = 2;
				}
				PanelMatchWaitingInner.instance.show(nextPlayerCount, _type, notFinishTableCnt, playerInMatch);										
				alien.Dispatcher.instance.dispatchEventWith(EventNames.HIDE_LABEL_WAITING);				
				console.log("show PanelMatchRoundResult--------->", GameConfig.matchRoundscore);
				// roundscore":[{"nickname":null,"uid":106712,"params":[-24,48,12,3,3,-12]},{"nickname":null,"uid":106959,"params":[-24,48,-6,3,3,-12]},{"nickname":null,"uid":120065,"params":[48,-96,-6,-6,-6,24]}]
				let _matchid = server.roomInfo.matchId;
                let _matchcfg = GameConfig.getRoomConfigByMatchId(_matchid);
				let _handcnt = 0;
				if(!_matchcfg || !_matchcfg.stage || !_matchcfg.stage.length ||  !_matchcfg.stage[0].handCount) {  
					_handcnt = 6;                  
                }
				else {
					_handcnt = _matchcfg.stage[0].handCount;
				}
				if (!GameConfig.matchRoundscore 
				 || GameConfig.matchRoundscore.length <= 0 
				 || !GameConfig.matchRoundscore[0].params
				 || GameConfig.matchRoundscore[0].params.length < _handcnt) {

				}
				else {					                    
                    if(!_matchcfg || !_matchcfg.stage || !_matchcfg.stage.length ||  !_matchcfg.stage[0].type) {                    
                    }
                    else {
                        let _matchtype = _matchcfg.stage[0].type;
                        if(_matchtype == "SWISSEX") {
                            if (!GameConfig.matchRoundscore) {
                            }
                            else {           
								egret.setTimeout(()=>{
									if(this.currentPlay == _handcnt) {									
										alien.Dispatcher.instance.dispatchEventWith(EventNames.SHOW_GRP_MATCH_DETAIL);
										if((alien.SceneManager.instance.currentSceneName == SceneNames.PLAY || alien.SceneManager.instance.currentSceneName == SceneNames.RUNFASTPLAY)) {
											PanelMatchRoundResult.instance.show(GameConfig.matchRoundscore);
										}
									}
								}, this, 2000);								
                            }
                        }                        
                    }					
				}
			}
		}else{
			if(server.roomInfo && server.roomInfo.stage && server.roomInfo.stage.length == 2){
				let playerIn:number = server.roomInfo.stage[1].playerIn;
				if(this._playerInMatch <= playerIn){
					PanelMatchWaitingInner.instance.show(playerIn);
				}else if(fromGameEnd){
					PanelMatchWaitingInner.instance.show();
				}
			}
		}
	}

	/**
	 * 比赛房间信息返回
	 * @param event
	 */
	private onMatchSignUpInfoRep(event:egret.Event):void{
		let data:any = event.data;

		if(data.is_signup){
			this.onCheckMatchStatus(data.matchid, data.is_signup);
		}else{
			this._checkCount --;
			if(this._checkCount <= 0){
				this.onCheckMatchStatus(0);
				server.removeEventListener(EventNames.USER_MATCH_SING_UP_INFO_REP, this.onMatchSignUpInfoRep, this);
			}
		}
		
		let roomInfo:any = GameConfig.getRoomConfigByMatchId(data.matchid);
		if(roomInfo.hasOwnProperty('startDate')){//定时开赛 5分钟滚动提示1次
			this.addWatchRoom(roomInfo,data.is_signup == 1);
		}
	}

	private onPanelMatchResultClose():void{
		if(alien.SceneManager.instance.currentSceneName != SceneNames.ROOM){
			alien.SceneManager.show(SceneNames.ROOM, null, alien.sceneEffect.Fade, null, null, false, SceneNames.LOADING);
		}
	}

	/**
	 * 放弃比赛返回
	 * @param event
	 */
	private onGiveUpMatchRep(event:egret.Event):void{
		let data:any = event.data;

		if(data.result == 0){

		}
	}

	/**
	 * 获取已报名的所有即开赛
	 */
	// getSignedMatch():any[]{
	// 	return GameConfig.roomList.filter((roomInfo:any):boolean=>{
	// 		return !roomInfo.hasOwnProperty('startDate') && roomInfo.is_signup == 1;
	// 	});
	// }

	/**
	 * 检查比赛状态(瀑布式)
	 */
	checkMatchStatus():void{
		let matchs = GameConfig.roomList.filter((item:any)=>{
			if(item.roomType == 2 && !item.ads){
				return true;
			}
			return false;
		})
		matchs.sort((item1,item2)=>{
			return item2.matchId - item1.matchId;
		})

		matchs.forEach((item:any) => {
			this._checkCount ++;
			server.getMatchSignUpInfo(item.matchId);
		});
	}

	private onCheckMatchStatus(matchId:number, isSignUp:number = 0):void{
		if(matchId > 0){//有比赛
			let roomInfo:any = GameConfig.getRoomConfigByMatchId(matchId);
			switch(isSignUp){
				case 1:
					if(!roomInfo.hasOwnProperty('startDate')){//定时开赛
						/**
						 * zhu 检查是否已经显示比赛等待界面，如果已经显示则不处理
						 */
						let _ins = PanelMatchWaiting.instance;
						if(!_ins.isWaitingShow()){
							_ins.show(roomInfo);
						}
					}
					break;
				case 2:
					this.setInMatch();
					// alien.SceneManager.show(SceneNames.PLAY, {roomID: matchId, action: 'reconnect'}, alien.sceneEffect.Fade);
					let sceneIns = alien.SceneManager.instance;
					let _curSceneName = sceneIns.currentSceneName;
					let _curScene = sceneIns.currentScene;
					//如果在游戏中，不用重连回去
					if ((_curSceneName == SceneNames.PLAY || _curSceneName == SceneNames.RUNFASTPLAY) && server.isMatch) {

					}
					else {
						server.checkReconnect();
						// let _matchcfg = GameConfig.getRoomConfigByMatchId(matchId);
						// if(_matchcfg.gameType == "pdk") {
						// 	alien.SceneManager.show(SceneNames.RUNFASTPLAY, { roomID: matchId, action: 'reconnect' }, alien.sceneEffect.Fade);
						// }
						// else {
						// 	alien.SceneManager.show(SceneNames.PLAY, { roomID: matchId, action: 'reconnect' }, alien.sceneEffect.Fade);
						// }						
					}
					break;
			}
		}
		alien.Dispatcher.dispatch(EventNames.HIDE_WAITING);
	}

	/**
	 * 取消报名
	 */
	cancelSignIn(roomInfo:any):void{
		let nextTurn:any = MatchService.getNextTurn(roomInfo);
		let len = this._watchedRooms.length;
		let oneInfo;
		for(let i=len-1;i>=0;--i){
			oneInfo = this._watchedRooms[i];
			if(oneInfo.roomInfo.matchId == roomInfo.matchId && nextTurn.nextTime == oneInfo.nextTurn.nextTime){
				oneInfo.signIn = false;
			}
		}
	}

	private _matchBetweenSmallThen(roomInfo,seconds){
		if (roomInfo.cycleTimeStamp.length >=2){
			if(roomInfo.cycleTimeStamp[1] - roomInfo.cycleTimeStamp[0] < seconds){
				return true;
			}
		}
		return false;
	}

	/**
	 * 添加房间倒计时监视
	 * @param roomInfo
	 */
	addWatchRoom(roomInfo:any,bSignIn:boolean = false):any{
		let nextTurn:any = MatchService.getNextTurn(roomInfo);
		let len = this._watchedRooms.length;
		let oneInfo;
		let isBetweenS60 = this._matchBetweenSmallThen(roomInfo,3600);
		if(isBetweenS60){
			if(!bSignIn){
				if(this._justTipOnceMatch[roomInfo.matchId] && this._justTipOnceMatch[roomInfo.matchId].tiped){
					return;
				}
			}
			this._justTipOnceMatch[roomInfo.matchId] = {added:true,tiped:false};
		}

		//当前正在提示的比赛
		if(this._idTopNotify.matchId == roomInfo.matchId){
			this._clearIdTopNotify();
		}

		for(let i=len-1;i>=0;--i){
			oneInfo = this._watchedRooms[i];
			if(oneInfo.roomInfo.matchId == roomInfo.matchId && nextTurn.nextTime == oneInfo.nextTurn.nextTime){
				oneInfo.signIn = bSignIn;
				oneInfo.nextTurn = nextTurn;
				return nextTurn;
			}
		}
		this._watchedRooms.push({roomInfo, nextTurn,signIn:bSignIn});
		return nextTurn;
	}

	/**
	 * 添加房间倒计时监视
	 * @param roomInfo
	 */
	removeWatchRoom(roomInfo:any):void{
		this._watchedRooms.some((item:any, index:number)=>{
			if(item.roomInfo == roomInfo){
				this._watchedRooms.splice(index, 1);
				return true;
			}
		});
	}

	public getOneMatchMarquee():string{
		if (this._marqueeQueue.length > 0){
			return this._marqueeQueue.shift();
		}
		return null;
	}

	private onTimer():void{
		let updateArr:any[] = []
		let spliceArr:any[] = [];
		this._watchedRooms.forEach((item:any, index:number)=>{
			let offset:number = item.nextTurn.nextTs - server.tsNow;
			//console.log(offset);
			if(offset <= 0){
				updateArr.push(item);
			}
			if(offset <= 30&&item.signIn){       //30秒提示
				if(!item.nextTurn.notifyWhen30){
					item.nextTurn.notifyWhen30 = true;
					PanelMatchNotice.instance.show(item.roomInfo, offset);
					SoundManager.instance.vibrate();
				}
			}else if(offset <= 60 * 5){   //5分钟提示
				if(!item.signIn){
					if(server.isMatch){
						return
					}
				}

				let topNotifyInfo = this._idTopNotify;
				if (topNotifyInfo.timerId >0 && topNotifyInfo.matchId > 0){ //已经有其他比赛倒计时提示了
					return;
				}

				if(!item.nextTurn.notifyWhen300){
					item.nextTurn.notifyWhen300 = true;
					//比赛间隔小于60分钟
					let betweenS60 = this._justTipOnceMatch[item.roomInfo.matchId];
					if(betweenS60){
						spliceArr.push(item);
						this._justTipOnceMatch[item.roomInfo.matchId].tiped = true;
					}
					
					topNotifyInfo.nextTurn = item.nextTurn;
					topNotifyInfo.signIn = item.signIn;
					topNotifyInfo.matchId = item.roomInfo.matchId;										 		
					this._matchTopNotify[1].text = item.roomInfo.name;
					let sBtn = lang.commonTopNotifyLable_1;
					if(!item.signIn){
						sBtn = lang.commonTopNotifyLable_2;
					}
					CountDownService.unregister(topNotifyInfo.timerId);
					alien.Dispatcher.dispatch(EventNames.SHOW_TOP_NOTIFY, {content: (label:eui.Label)=>{
						topNotifyInfo.timerId = CountDownService.register(offset, (time:number)=>{
							this._matchTopNotify[3].text = alien.TimeUtils.timeFormat(time);
							if (!item.signIn){
								label.textFlow = this._matchTopNotify.slice(1);
							}else{
								label.textFlow = this._matchTopNotify;
							}
						},()=>{
							this._clearIdTopNotify()
						});
					}, onTap: ()=>{
						CountDownService.unregister(topNotifyInfo.timerId);
						if(!item.signIn){
							alien.SceneManager.instance.show(SceneNames.ROOM,{jump2match:true});
						}
					}, showButton: true,btnLabel:sBtn});
				}
			}
		});

		updateArr.forEach((item)=>{
			item.signIn = false;
			item.nextTurn = MatchService.getNextTurn(item.roomInfo);
		})

		spliceArr.forEach((item)=>{
			this.removeWatchRoom(item.roomInfo);
		});
	}

	signUp(roomInfo:any, itemId:number):void{
		server.matchSignUp(roomInfo.matchId, 1, itemId);
	}

	cancelMatch(roomInfo:any):void{
		server.matchSignUp(roomInfo.matchId, 2);
	}

	setInMatch():void{
		server.addEventListener(EventNames.USER_MATCH_INFO_NTF, this.onMatchInfoNtf, this);
	}


	/**
	 * zhu 获取是否比赛结束
	 */
	public isMatchOver(){
		return this._matchover;
	}

	static getRewardStringByRank(roomInfo:any, rank:number = 1, join: string = ' '):string{
		return this.rewardToString(this.makeRewardTextFlow(this.getRewardByRank(roomInfo, rank)), join);
	}

	/**
	 * 富豪赛
	 */
	static getRewardStringBy205(roomInfo:any):string{
		let _rews = this.getRewardByRank(roomInfo, 1);
		let _redPool = roomInfo.rewardredcoinpool;
		let _maxRed:number = 0;
		for(let k in _redPool){
			if(_redPool[k][1] >= _maxRed){
				_maxRed = _redPool[k][1];
			}
		}
		_maxRed = _maxRed/100;
		return "最高" + (_rews[0].count + _maxRed) +"奖杯";
	}

	static makeRewardTextFlow(reward:any[]):any[]{
		let ret:any[] = [];
		if(reward){
			reward.forEach((item:any)=>{
				let count = item.count;
				if(item.id == 0){
					count = Utils.currencyRatio(count);
				}
				if(item.id == 1){
					ret.push(count + '奖杯');
				}else{
					ret.push(GoodsManager.instance.getGoodsById(item.id).name + 'x' + count);
				}
			});
		}

		return ret;
	}

	static rewardToString(reward:any[], join:string = ' '):string{
		return reward.join(join);
	}

	static getNextTurn(roomInfo:any):any{
		let tsNow:number = server.tsNow;
		let nextIndex:number = -1;
		roomInfo.cycleTimeStamp.some((time:number, index:number)=>{
			if(tsNow < time){
				nextIndex = index;
				return true;
			}
		});

		let nextTime:string;
		let nextTs:number;
		let tsAdd:number = 0;
		let date:string = '';
		if(nextIndex < 0){
			nextIndex = 0;
			let tsTomorrow:number = server.tsToday + 24 * 3600;
			date = alien.TimeUtils.tsToMonthDayString(tsTomorrow);

			tsAdd = 24 * 3600;
		}

		nextTime = date + ' ' + roomInfo.cycleTime[nextIndex];
		nextTs = roomInfo.cycleTimeStamp[nextIndex] + tsAdd;
		roomInfo.nextIndex = nextIndex;

		return {
			nextTime,
			nextIndex,
			nextTs,
		};
	}

	/**
	 * 根据排名获取奖励
	 * @param roomInfo
	 * @param rank
	 * @returns {any[]}
	 */
	static getRewardByRank(roomInfo:any, rank:number = 1):any[]{
		let reward:any[];
		roomInfo.reward.some((item:any):boolean=>{
			if(item.rankend >= rank && item.rankstart <= rank){
				reward = Utils.parseGoodsString(item.reward);

				return true;
			}
		});

		return reward;
	}

}