/**
 * Created by rockyl on 16/3/29.
 *
 * 比赛频道页
 */

class PDKPageMatchChannel extends PDKPageChannelBase {
	static defName:string = 'PDKPageMatchChannel';

	protected init():void {
		this.skinName = pages.PDKPageMatchChannelSkin;
	}

	createChildren():void {
		super.createChildren();

		this.list.itemRenderer = PDKIRContainer;
	}

	protected addListeners():void{
		super.addListeners();

		pdkServer.addEventListener(PDKEventNames.USER_MATCH_SING_UP_INFO_REP, this.onMatchSignUpInfoRep, this);
		PDKalien.Dispatcher.addEventListener(PDKEventNames.REFRESH_MATCH_LIST, this.onRefreshMatchList, this);
	}

	protected removeListeners():void{
		super.removeListeners();

		pdkServer.removeEventListener(PDKEventNames.USER_MATCH_SING_UP_INFO_REP, this.onMatchSignUpInfoRep, this);
		PDKalien.Dispatcher.removeEventListener(PDKEventNames.REFRESH_MATCH_LIST, this.onRefreshMatchList, this);
	}

	private onMatchSignUpInfoRep(event:egret.Event):void{
		let data:any = event.data;

		let roomInfo:any = null;
		this._roomList.some((r:any)=>{
			if(r.matchId == data.matchid){
				roomInfo = r;
				return true;
			}
		});
		if(!roomInfo) return;
		roomInfo.is_signup = data.is_signup == null ? 0:data.is_signup;
		roomInfo.today_cnt = data.today_cnt == null ? 0:data.today_cnt;
		roomInfo.signup_cnt = data.signup_cnt == null ? 0:data.signup_cnt;
		roomInfo.signUpCountTest = roomInfo.signup_cnt + PDKlang.people;
		roomInfo.todayCountText = roomInfo.today_cnt + '/' + roomInfo.maxDayPlayCnt;

		this._dataProvide.itemUpdated(roomInfo);
	}

	private onRefreshMatchList(event:egret.Event):void{
		this._dataProvide.refresh();
	}

	/**
	 * 设置分享成功时当时的局数
	 */
	private _setShareSuccGames(nGames:string):void{
		PDKalien.localStorage.setItem("shareSucc",""+ nGames);
	}

	/**
	 * 获取分享成功时的玩家玩的局数,未分享过返回-1，否则返回分享时的局数
	 */
	private _getShareSuccGames():number{
		let _sGames = PDKalien.localStorage.getItem("shareSucc");
		if(!_sGames) {
			return -1;
		}
		return Number(_sGames);
	}

	/**
	 * 免费赛是否需要强制邀请
	 */
	private _shouldShareForFree():boolean{
		if(1) return false;
		/*免费赛分享先不更新*/

		let _room = this.selectedRoom;
		if(_room.matchId == 100){ //免费赛
			let _succGames = this._getShareSuccGames();
			if(_succGames < 0) return true;

			if(_room.today_cnt >= (_succGames + 5)){ //分享一次才可以玩五局
				return true;
			}
		}
		return false;
	}

	/**
	 *zhu 微信分享结果
	 */
	private _onWXShareRet(e:egret.Event):void{
		let _bSucc = e.data.shareSucc;
		if(_bSucc) {
			/**分享成功,记录分享成功的时玩的局数 */
			if(this.selectedRoom && this.selectedRoom.matchId){
				this._setShareSuccGames(this.selectedRoom.matchId);
			}
			PDKalien.Dispatcher.removeEventListener(PDKEventNames.USER_SHARE_RESULT, this._onWXShareRet, this);
		}
		PDKPanelShare.instance.close();
	}

	/**
	 *zhu 免费赛参加次数达到上限，要求分享后才可以继续参赛
	*/
	private _onFreePopShare():void{
		let self = this;
		PDKAlert.show("成功分享游戏后即可报名免费赛",0,function(){
			PDKalien.Dispatcher.addEventListener(PDKEventNames.USER_SHARE_RESULT, self._onWXShareRet, self);
			PDKPanelShare.instance.showInviteFriend()
        })
	}

	/**
	 *zhu 加入比赛
	 */
	private _onJoinMatch():void{
		if(this.selectedRoom.ads){

		}else{
			for(var i = 0; i < PDKGameConfig.roomList.length; ++i){
				if(PDKGameConfig.roomList[i].is_signup == 2){
					pdkServer.checkReconnect();
					return;
				}
			}
			if(this.selectedRoom.is_signup){
				if(this.selectedRoom.is_signup == 1){
					PDKPanelMatchCountDown.instance.show(this.selectedRoom);
				}else if(this.selectedRoom.is_signup == 2){
					pdkServer.checkReconnect();
				}
			}else{
				if(this.selectedRoom.maxOwnGoldLimit && this.selectedRoom.maxOwnGoldLimit < PDKMainLogic.instance.selfData.gold){
					PDKAlert.show(PDKalien.StringUtils.formatApply(PDKlang.match_sign_up_result[16], [this.selectedRoom.maxOwnGoldLimit, this.selectedRoom.name]));
				}else{
					let _bShowShare = this._shouldShareForFree();
					if(_bShowShare) {
						this._onFreePopShare();
					}
					else{
						PDKPanelMatchSignUp.instance.show(this.selectedRoom);
					}
				}
				// PDKPanelMatchSignUp.instance.show(this.selectedRoom);
			}
		}
	}
	_tTopNotify:number;
	protected selectRoom(event:egret.Event):void {
		super.selectRoom(event);

		this._onJoinMatch();
		/*if(this.selectedRoom.hasOwnProperty('startDate')) {  //定时开赛

		}else{

		}*/

		/*if(this.selectedRoom.ads){

		}else{
			for(var i = 0; i < PDKGameConfig.roomList.length; ++i){
				if(PDKGameConfig.roomList[i].is_signup == 2){
					pdkServer.checkReconnect();
					return;
				}
			}
			if(this.selectedRoom.is_signup){
				if(this.selectedRoom.is_signup == 1){
					PDKPanelMatchCountDown.instance.show(this.selectedRoom);
				}else if(this.selectedRoom.is_signup == 2){
					pdkServer.checkReconnect();
				}
			}else{
				if(this.selectedRoom.maxOwnGoldLimit && this.selectedRoom.maxOwnGoldLimit < PDKMainLogic.instance.selfData.gold){
					PDKAlert.show(PDKalien.StringUtils.formatApply(PDKlang.match_sign_up_result[16], [this.selectedRoom.maxOwnGoldLimit, this.selectedRoom.name]));
				}else{
					PDKPanelMatchSignUp.instance.show(this.selectedRoom);
				}
				// PDKPanelMatchSignUp.instance.show(this.selectedRoom);
			}
		}
		*/
		//PDKPanelMatchNotice.instance.show(this.selectedRoom);

		/*if(this._tTopNotify > 0){
			egret.clearInterval(this._tTopNotify);
		}
		let _matchTopNotify:any[] = PDKalien.PDKUtils.parseColorTextFlow(PDKlang.match_top_notify_green);
		_matchTopNotify[1].text = this.selectedRoom.name;
		PDKalien.Dispatcher.dispatch(PDKEventNames.SHOW_TOP_NOTIFY, {content: (label:eui.Label)=>{
			this._tTopNotify = PDKUtils.countDown(300, (str:string)=>{
				_matchTopNotify[3].text = str;
				label.textFlow = _matchTopNotify;
			});
		}, showButton: true});*/
	}

	protected dealRoomList():void{
		super.dealRoomList();

		//各种预处理
		this._roomList.forEach((roomInfo:any)=>{
			if(!roomInfo.ads){
				pdkServer.getMatchSignUpInfo(roomInfo.matchId);
			}
		});
	}

	/**
	 * 国庆期间 10.1 - 10.7 19:30分 显示MatchId = 203 隐藏MatchId = 201 
	 */
	public isAfterInNatonalLast500Match():boolean{
		let _date = "2017-10-07 19:30:00";
		let _lastTimeStamp = new Date(Date.parse(_date.replace(/-/g, "/"))).getTime();
		let _curTimeStamp = new Date().getTime();
		if(_curTimeStamp >= _lastTimeStamp){	
			return true;
		}
		return false;
	}

	beforeShow(params:any):void {
		super.beforeShow(params);
		// this.setRoomType(2);
		let visibleRooms:any[] = null;
		visibleRooms = PDKGameConfig.roomList.filter((item:any) => {
			return item.roomType == 2;
				/*zhu 还原之前的过滤if(item.roomType == 2){
					if(item.matchId == 203){
						if(!this.isAfterInNatonalLast500Match()){
							return true;
						}else{
							return false;
						}
					}
					else if(item.matchId == 201){
						if(this.isAfterInNatonalLast500Match()){
							return true;
						}else{
							return false;
						}
					}
					else{
						return true;
					}
				}*/
			});
		// if(PDKGameConfig.testers && PDKGameConfig.testers[PDKMainLogic.instance.selfData.uid]){
		// 	visibleRooms = PDKGameConfig.roomList.filter((item:any) => {
		// 		return item.roomType == 2;
		// 	});
		// }else{
		// 	visibleRooms = PDKGameConfig.roomList.filter((item:any) => {
		// 		return item.roomType == 2 && item.matchId != 102;
		// 	});
		// }
		visibleRooms.sort((r1:any, r2:any)=>{return r1.sortid - r2.sortid;});
		this._roomList = visibleRooms;

		this.dealRoomList();
		this._dataProvide.source = this._roomList;
	}
}

class PDKMatchRoom extends eui.Component {
	public labName: eui.Label;
	public labReward: eui.Label;
	public labLimit: eui.Label;
	public imgSignUp: eui.Image;
	//zhu 删除public imgAds: eui.Image;
	public lbOpenTime:eui.Label;
	createChildren():void {
		super.createChildren();
	}

	protected setData(data): void{
		this.currentState = data.ads ? 'ads' : 'normal';

		if(!data.ads){
			this.labName.text = data.name;
			// if(data.hasOwnProperty('availableTime')){
			// 	this.lbOpenTime.text = '每日 ' + data.availableTime[0] + ' - ' + data.availableTime[1] + ' 开放';
			// }else{
			// 	this.lbOpenTime.text = '全天开放';
			// }
			this.lbOpenTime.text = data.shortName;
			if(data.hasOwnProperty('startDate')){  //定时开赛
				// this.lbOpenTime.text = '每15分钟一场';

				let nextTurn:any = PDKMatchService.getNextTurn(data);

				this.labLimit.text = data.limitText = nextTurn.nextTime;
				data.nextIndex = nextTurn.nextIndex;
			}else{  //即开赛
				this.labLimit.text = data.limitText;
			}

			switch(data.matchType){
				case 0: //普通赛
					this.labReward.text = data.rewardText;
					break;
				case 1: //金豆带入赛

					break;
			}

			this.imgSignUp.visible = data.is_signup;
		}
	}
}