import PDKSoundManager = PDKalien.PDKSoundManager;
/**
 * Created by rockyl on 16/3/30.
 *
 * 比赛逻辑
 */

class PDKMatchService extends PDKService {
	private static _instance: PDKMatchService;
	public static get instance(): PDKMatchService {
		if (this._instance == undefined) {
			this._instance = new PDKMatchService();
		}
		return this._instance;
	}

	private _timer: number;
	private _watchedRooms: any[];
	private _timerWaiting: number;
	private _checkCount: number = 0;

	private _idTopNotify: number;
	private _matchTopNotify: any[];

	private _scoreGetOut: number;      //淘汰分数线
	private _countPromote: number;     //晋级名额
	private _currentTurn: number;      //当前轮
	private _currentPlay: number;      //当前局
	private _currentMatchMode: number; //当前比赛模式
	private _playerInMatch: number;    //比赛中的玩家数
	private _nextPlayerCount: number;  //下一轮比赛玩家数

	private myUserInfoData: PDKUserInfoData;
	private _matchover: boolean;

	public get nextPlayerCount(): number {
		return this._nextPlayerCount;
	}

	protected init(): void {
		this.myUserInfoData = PDKMainLogic.instance.selfData;
		this._watchedRooms = [];

		this._matchTopNotify = PDKalien.PDKUtils.parseColorTextFlow(PDKlang.match_top_notify);

		pdkServer.addEventListener(PDKEventNames.USER_MATCH_SING_UP_REP, this.onMatchSignUpRep, this);
		pdkServer.addEventListener(PDKEventNames.USER_MATCH_START_NTF, this.onMatchStartNtf, this);
		pdkServer.addEventListener(PDKEventNames.USER_MATCH_INFO_NTF, this.onMatchInfoNtf, this);
		pdkServer.addEventListener(PDKEventNames.USER_GIVE_UP_MATCH_REP, this.onGiveUpMatchRep, this);
		pdkServer.addEventListener(PDKEventNames.GAME_GAME_START_NTF, this.onGameStart, this, false, 1000);
		pdkServer.addEventListener(PDKEventNames.GAME_GAME_END, this.onGameEnd, this);
		pdkServer.addEventListener(PDKEventNames.GAME_LEAVE_TABLE, this.onLeaveTable, this);
		pdkServer.addEventListener(PDKEventNames.GAME_RECONNECT_REP, this.onReconnectRep, this);

		//PDKPanelMatchResult.instance.show([1, 100, 1003, 3], null);
	}

	start(cb): void {
		this._playerInMatch = 1000000;
		this._checkCount = 0;
		this._watchedRooms.splice(0);
		if (this._timer > 0) {
			egret.clearInterval(this._timer);
		}
		this._initDefaultInfo();
		this._timer = egret.setInterval(this.onTimer.bind(this), this, 1000);
		pdkServer.addEventListener(PDKEventNames.USER_MATCH_SING_UP_INFO_REP, this.onMatchSignUpInfoRep, this);
		this.checkMatchStatus();
		super.start(cb);
	}

	stop(): void {
		super.stop();

		if (this._timer > 0) {
			egret.clearInterval(this._timer);
		}

		if (this._idTopNotify > 0) {
			egret.clearInterval(this._idTopNotify);
			PDKalien.Dispatcher.dispatch(PDKEventNames.HIDE_TOP_NOTIFY);
		}
	}

	get scoreGetOut(): number {
		return this._scoreGetOut;
	}

	set currentTurn(ct: number) {
		this._currentTurn = ct;
	}

	get currentTurn(): number {
		return this._currentTurn;
	}

	get currentPlay(): number {
		return this._currentPlay;
	}

	get currentMatchMode(): number {
		return this._currentMatchMode;
	}

	get countPromote(): number {
		return this._countPromote;
	}

	/**
	 * zhu 显示比赛报名成功的tips
	 */
	private _showSignMatchSucc(roomInfo: any, nextTurn: any): void {
		let str = "   " + roomInfo.name + "报名成功，请您准时参加。\n（比赛还有{2}小时{1}分钟开始，开赛前有提示）";
		let tsNow: number = pdkServer.tsNow;
		let tsNext = nextTurn.nextTs;
		str = PDKalien.TimeUtils.timeFormat(tsNext - tsNow, str);
		PDKAlert.show(str);
	}

	/**
	 * 回复报名结果
	 * @param event
	 required int32 result = 1;   0成功 1已经报名过 2比赛已经开始 3找不到比赛 4取消失败，没报名过 5取消失败，已经开始
	 required int32 matchid = 2;
	 required int32 optype = 3;
	 */
	private onMatchSignUpRep(event: egret.Event): void {
		let data: any = event.data;

		if (data.result > 0) {
			if (data.result == 8) {
				PDKPanelMatchSignUp.instance.close();
				PDKPanelRechargeTips.instance.show();
			} else {
				if (data.result == 16) {
					let roomInfo: any = PDKGameConfig.getRoomConfigByMatchId(data.matchid);
					// PDKAlert.show(PDKlang.format(PDKlang.match_sign_up_result[data.result], roomInfo.maxOwnGoldLimit, roomInfo.name));
					PDKAlert.show(PDKalien.StringUtils.formatApply(PDKlang.match_sign_up_result[16], [roomInfo.maxOwnGoldLimit, roomInfo.name]));
				} else if (data.result == 5) {
					//没有报过名
				} else {
					PDKAlert.show(PDKlang.match_sign_up_result[data.result]);
				}
			}
		} else {
			PDKBagService.instance.refreshBagInfo();    //涉及到参赛券的使用,需要更新背包
			let roomInfo: any = PDKGameConfig.getRoomConfigByMatchId(data.matchid);
			switch (data.optype) {
				case 1: //报名成功
					roomInfo.is_signup = 1;
					pdkServer.addEventListener(PDKEventNames.USER_MATCH_INFO_NTF, this.onMatchInfoNtf, this);

					PDKPanelMatchSignUp.instance.close();
					if (roomInfo.hasOwnProperty('startDate')) {  //定时开赛
						let turnInfo = this.addWatchRoom(roomInfo);
						//zhu 500元定时赛和1000元定时赛不弹出报名的界面
						//if(roomInfo.matchId == 201 || roomInfo.matchId == 202|| roomInfo.matchId == 203){
						this._showSignMatchSucc(roomInfo, turnInfo);
						/*}
						else{
							PDKPanelMatchCountDown.instance.show(roomInfo);
						}*/
					} else {
						PDKPanelMatchWaiting.instance.show(roomInfo);
					}
					break;
				case 2: //取消报名成功
					roomInfo.is_signup = 0;
					if (roomInfo.hasOwnProperty('startDate')) {  //定时开赛
						if (this._idTopNotify > 0) {
							egret.clearInterval(this._idTopNotify);
							PDKalien.Dispatcher.dispatch(PDKEventNames.HIDE_TOP_NOTIFY);
						}
						this.removeWatchRoom(roomInfo);
						PDKPanelMatchCountDown.instance.close();
						PDKPanelMatchNotice.instance.close();
					} else {
						PDKPanelMatchWaiting.instance.close();
					}
					break;
			}

			PDKalien.Dispatcher.dispatch(PDKEventNames.REFRESH_MATCH_LIST);
		}
	}

	/**
	 * 初始化默认的数据
	 */
	private _initDefaultInfo(): void {
		this._currentMatchMode = 0;
		this._currentTurn = 0;
		this._currentPlay = 0;
		this._countPromote = 0;
		this._playerInMatch = 1000000;
		this._nextPlayerCount = 0;
	}

	/**
	 * 比赛开始广播
	 * @param event
	 */
	private onMatchStartNtf(event: egret.Event): void {
		let data: any = event.data;

		this._initDefaultInfo();

		let roomInfo: any = PDKGameConfig.getRoomConfigByMatchId(data.matchid);

		if (roomInfo.stage.length > 1) {
			this.updateScoreGetOut(data.matchid);//, roomInfo.stage[0].baseScore[0][1]);
		}

		if (PDKSceneManager.instance.currentSceneName == PDKSceneNames.PLAY) {
			PDKMainLogic.backToRoomScene();
		}
		pdkServer.resetSession();

		if (roomInfo.hasOwnProperty('startDate')) {
			PDKalien.Dispatcher.dispatch(PDKEventNames.HIDE_TOP_NOTIFY);

			PDKGameConfig.roomList.forEach((match: any) => {
				if (!match.hasOwnProperty('startDate') && match.is_signup >= 1) {
					pdkServer.giveUpMatch(match.matchId);
				}

			});
		}

		PDKalien.PDKSceneManager.show(PDKSceneNames.PLAY, { roomID: data.matchid }, PDKalien.sceneEffect.Fade);
	}

	/**
	 * 当比赛中展示了淘汰结算后检查是否需要移除比赛信息监听
	 */
	public onMatchEndCheckRemoveMatchInfoNtf(data: any): void {
		let roomInfo: any = PDKGameConfig.setMatchSignupFlag(data.matchid, 0);
		if (!PDKGameConfig.anyMatchSignuped()) {
			pdkServer.removeEventListener(PDKEventNames.USER_MATCH_INFO_NTF, this.onMatchInfoNtf, this);
		}
	}

	/**
	 * 比赛信息更新
	 * @param event
	 */
	private onMatchInfoNtf(event: egret.Event): void {
		let data: any = event.data;
		let roomInfo: any = PDKGameConfig.getRoomConfigByMatchId(data.matchid);
		let stage: any[] = roomInfo.stage;

		switch (data.optype) {
			case -1:// 参赛人数不足比赛取消
				var cfg = PDKGameConfig.getRoomConfigByMatchId(data.matchid);
				if (data.params && data.params[0] && data.params[0] > 0) {
					PDKAlert.show('您报名的' + cfg.name + '因人数不足比赛取消\n报名费用' + data.params[0] + '已通过邮件退还');
				}
				break;
			case -2:// 服务器更新
				var cfg = PDKGameConfig.getRoomConfigByMatchId(data.matchid);
				if (cfg) {
					PDKAlert.show('您报名的' + cfg.name + '已更新\n请在开赛前重新登录游戏 感谢您的配合');
				}
				break;
			case 100:   //游戏模式变动  1:打立出局 2:瑞士位移
				this._currentMatchMode = data.params[0];

				if (!data.params[1]) {
					let turnCount: number = 1;
					if (this._currentMatchMode == 2) {
						turnCount = stage[stage.length == 1 ? 0 : 1].handCount;
					}

					PDKPanelBeforeMatch.instance.show(stage.length, this._currentMatchMode, turnCount);
					PDKPanelMatchWaitingInner.instance.close();
				}
				break;
			case 101:   //等待其他玩家界面
				if (!this._matchover && pdkServer.isMatch) {
					egret.setTimeout(() => {
						let roomInfo: any = PDKGameConfig.getRoomConfigByMatchId(data.matchid);
						var index = PDKMatchService.instance._currentTurn + 1 + 2
						if (data.params.length > index) {
							PDKMatchService.instance.checkMatchWaiting(data.params[index]);
						}
					}, this, 1000 * 6);
				}
				break;
			case 102:   //游戏结算界面
				this._matchover = true;
				if (this._timerWaiting > 0) {
					egret.clearTimeout(this._timerWaiting);
					this._timerWaiting = 0;
				}
				PDKPanelMatchWaitingInner.instance.close();
				// if(data.params[0] > 0){  //有名次才显示结算界面
				// 	PDKPanelMatchResult.instance.show(data, this.onPanelMatchResultClose.bind(this));
				// 	PDKBagService.instance.refreshBagInfo();    //涉及到物品奖励,需要更新背包
				// }

				/*let roomInfo:any = PDKGameConfig.setMatchSignupFlag(data.matchid, 0);

				if(!PDKGameConfig.anyMatchSignuped()){
					pdkServer.removeEventListener(PDKEventNames.USER_MATCH_INFO_NTF, this.onMatchInfoNtf, this);
				}*/
				break;
			case 103:   //牌局开始显示界面
				this._countPromote = data.params[0];
				this._currentTurn = data.params[1]; //当前的局数
				this._currentPlay = 0;
				break;
			case 104:   //更新排名,在ScenePlay里处理
				this._playerInMatch = data.params[1];
				this._nextPlayerCount = data.params[2];
				if (this._currentMatchMode == 1) {
					this.checkMatchWaiting(this._playerInMatch);
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

	public updateScoreGetOut(matchid: any, value: number = -1) {
		// if(roomInfo && roomInfo.stage && value){
		let roomInfo: any = PDKGameConfig.getRoomConfigByMatchId(matchid);
		if (value == -1) {
			value = roomInfo.stage[0].baseScore[0][1]
		}
		let kickOutOdds: number = roomInfo.stage[0].kickOutOdds;
		this._scoreGetOut = value * kickOutOdds;
		// }
		console.log('scoreGetOut :' + this._scoreGetOut);
	}

	private onGameStart(event: egret.Event): void {
		if (pdkServer.isMatch) {
			this._matchover = false;
			this._currentPlay++;
		}
	}

	private onGameEnd(event: egret.Event): void {
		if (pdkServer.isMatch) {
			this.checkMatchWaiting(this._nextPlayerCount, true);
		}
	}

	private onLeaveTable(event: egret.Event): void {
		if (pdkServer.isMatch) {

		}
	}

	private onReconnectRep(event: egret.Event): void {
		if (pdkServer.isMatch) {
			this.checkMatchWaiting();
		}
	}

	public checkMatchWaiting(nextPlayerCount: number = 0, fromGameEnd: boolean = false): void {
		if (pdkServer.playing || PDKalien.PDKSceneManager.instance.currentSceneName != PDKSceneNames.PLAY ||
			this._matchover) {
			return;
		}

		console.log('checkMatchWaiting currentMatchMode:', this._currentMatchMode, fromGameEnd);
		if (this._currentMatchMode == 2) {
			if (!fromGameEnd) {
				PDKPanelMatchWaitingInner.instance.show(nextPlayerCount);
			}
		} else {
			if (pdkServer.roomInfo && pdkServer.roomInfo.stage && pdkServer.roomInfo.stage.length == 2) {
				let playerIn: number = pdkServer.roomInfo.stage[1].playerIn;
				if (this._playerInMatch <= playerIn) {
					PDKPanelMatchWaitingInner.instance.show(playerIn);
				} else if (fromGameEnd) {
					PDKPanelMatchWaitingInner.instance.show();
				}
			}
		}
	}

	/**
	 * 比赛房间信息返回
	 * @param event
	 */
	private onMatchSignUpInfoRep(event: egret.Event): void {
		let data: any = event.data;

		if (data.is_signup) {
			this.onCheckMatchStatus(data.matchid, data.is_signup);
		} else {
			this._checkCount--;
			if (this._checkCount <= 0) {
				this.onCheckMatchStatus(0);
				pdkServer.removeEventListener(PDKEventNames.USER_MATCH_SING_UP_INFO_REP, this.onMatchSignUpInfoRep, this);
				return;
			}
		}
	}

	private onPanelMatchResultClose(): void {
		if (PDKalien.PDKSceneManager.instance.currentSceneName != PDKSceneNames.ROOM) {
			PDKalien.PDKSceneManager.show(PDKSceneNames.ROOM, null, PDKalien.sceneEffect.Fade, null, null, false, PDKSceneNames.LOADING);
		}
	}

	/**
	 * 放弃比赛返回
	 * @param event
	 */
	private onGiveUpMatchRep(event: egret.Event): void {
		let data: any = event.data;

		if (data.result == 0) {

		}
	}

	/**
	 * 获取已报名的所有即开赛
	 */
	// getSignedMatch():any[]{
	// 	return PDKGameConfig.roomList.filter((roomInfo:any):boolean=>{
	// 		return !roomInfo.hasOwnProperty('startDate') && roomInfo.is_signup == 1;
	// 	});
	// }

	/**
	 * 检查比赛状态(瀑布式)
	 */
	checkMatchStatus(): void {
		PDKGameConfig.roomList.forEach((item: any) => {
			if (item.roomType == 2 && !item.ads) {
				this._checkCount++;
				pdkServer.getMatchSignUpInfo(item.matchId);
			}
		});
	}

	private onCheckMatchStatus(matchId: number, isSignUp: number = 0): void {
		if (matchId > 0) {//有比赛
			let roomInfo: any = PDKGameConfig.getRoomConfigByMatchId(matchId);
			switch (isSignUp) {
				case 1:
					if (roomInfo.hasOwnProperty('startDate')) {//定时开赛
						this.addWatchRoom(roomInfo);
					} else {
						/**
						 * zhu 检查是否已经显示比赛等待界面，如果已经显示则不处理
						 */
						let _ins = PDKPanelMatchWaiting.instance;
						if (!_ins.isWaitingShow()) {
							_ins.show(roomInfo);
						}
					}
					break;
				case 2:
					this.setInMatch();
					PDKalien.PDKSceneManager.show(PDKSceneNames.PLAY, { roomID: matchId, action: 'reconnect' }, PDKalien.sceneEffect.Fade);
					break;
			}
		}
		PDKalien.Dispatcher.dispatch(PDKEventNames.HIDE_WAITING);
	}

	/**
	 * 添加房间倒计时监视
	 * @param roomInfo
	 */
	addWatchRoom(roomInfo: any): any {
		let nextTurn: any = PDKMatchService.getNextTurn(roomInfo);
		this._watchedRooms.push({ roomInfo, nextTurn });
		return nextTurn;
	}

	/**
	 * 添加房间倒计时监视
	 * @param roomInfo
	 */
	removeWatchRoom(roomInfo: any): void {
		this._watchedRooms.some((item: any, index: number) => {
			if (item.roomInfo == roomInfo) {
				this._watchedRooms.splice(index, 1);
				return true;
			}
		});
	}

	private onTimer(): void {
		let spliceArr: number[] = [];
		this._watchedRooms.forEach((item: any, index: number) => {
			let offset: number = item.nextTurn.nextTs - pdkServer.tsNow;
			//console.log(offset);
			if (offset <= 0) {              //移除监视
				spliceArr.push(index);
			}
			if (offset <= 30) {       //30秒提示
				if (!item.notifyWhen30) {
					item.notifyWhen30 = true;
					PDKPanelMatchNotice.instance.show(item.roomInfo, offset);

					PDKSoundManager.instance.vibrate();
				}
			}
			if (offset <= 60 * 5) {   //5分钟提示
				if (!item.notifyWhen300) {
					item.notifyWhen300 = true;
					this._matchTopNotify[1].text = item.roomInfo.name;

					PDKCountDownService.unregister(this._idTopNotify);
					PDKalien.Dispatcher.dispatch(PDKEventNames.SHOW_TOP_NOTIFY, {
						content: (label: eui.Label) => {
							this._idTopNotify = PDKCountDownService.register(offset, (time: number) => {
								this._matchTopNotify[3].text = PDKalien.TimeUtils.timeFormat(time);
								label.textFlow = this._matchTopNotify;
							});
						}, onTap: () => {
							PDKCountDownService.unregister(this._idTopNotify);
						}, showButton: true
					});
				}
			}
		});

		spliceArr.forEach((index: number) => {
			this._watchedRooms.splice(index, 1);
		});
	}

	signUp(roomInfo: any, itemId: number): void {
		pdkServer.matchSignUp(roomInfo.matchId, 1, itemId);
	}

	cancelMatch(roomInfo: any): void {
		pdkServer.matchSignUp(roomInfo.matchId, 2);
	}

	setInMatch(): void {
		pdkServer.addEventListener(PDKEventNames.USER_MATCH_INFO_NTF, this.onMatchInfoNtf, this);
	}


	/**
	 * zhu 获取是否比赛结束
	 */
	public isMatchOver() {
		return this._matchover;
	}

	static getRewardStringByRank(roomInfo: any, rank: number = 1, join: string = ' '): string {
		return this.rewardToString(this.makeRewardTextFlow(this.getRewardByRank(roomInfo, rank)), join);
	}

	/**
	 * 富豪赛
	 */
	static getRewardStringBy205(roomInfo: any): string {
		let _rews = this.getRewardByRank(roomInfo, 1);
		let _redPool = roomInfo.rewardredcoinpool;
		let _maxRed: number = 0;
		for (let k in _redPool) {
			if (_redPool[k][1] >= _maxRed) {
				_maxRed = _redPool[k][1];
			}
		}
		_maxRed = _maxRed / 100;
		return "最高" + (_rews[0].count + _maxRed) + "奖杯";
	}

	static makeRewardTextFlow(reward: any[]): any[] {
		let ret: any[] = [];
		if (reward) {
			reward.forEach((item: any) => {
				let count = item.count;
				if (item.id == 0) {
					count = PDKUtils.currencyRatio(count);
				}
				if (item.id == 1) {
					ret.push(count + '奖杯');
				} else {
					ret.push(PDKGoodsManager.instance.getGoodsById(item.id).name + 'x' + count);
				}
			});
		}

		return ret;
	}

	static rewardToString(reward: any[], join: string = ' '): string {
		return reward.join(join);
	}

	static getNextTurn(roomInfo: any): any {
		let tsNow: number = pdkServer.tsNow;
		let nextIndex: number = -1;
		roomInfo.cycleTimeStamp.some((time: number, index: number) => {
			if (tsNow < time) {
				nextIndex = index;
				return true;
			}
		});

		let nextTime: string;
		let nextTs: number;
		let tsAdd: number = 0;
		let date: string = '';
		if (nextIndex < 0) {
			nextIndex = 0;
			let tsTomorrow: number = pdkServer.tsToday + 24 * 3600;
			date = PDKalien.TimeUtils.tsToMonthDayString(tsTomorrow);

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
	static getRewardByRank(roomInfo: any, rank: number = 1): any[] {
		let reward: any[];
		roomInfo.reward.some((item: any): boolean => {
			if (item.rankend >= rank && item.rankstart <= rank) {
				reward = PDKUtils.parseGoodsString(item.reward);

				return true;
			}
		});

		return reward;
	}

}