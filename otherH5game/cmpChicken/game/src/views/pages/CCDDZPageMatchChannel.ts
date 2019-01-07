/**
 * Created by rockyl on 16/3/29.
 *
 * 比赛频道页
 */

class CCDDZPageMatchChannel extends CCDDZPageChannelBase {
	static defName:string = 'CCDDZPageMatchChannel';

	protected init():void {
		this.skinName = pages.CCDDZPageMatchChannelSkin;
	}

	createChildren():void {
		super.createChildren();

		this.list.itemRenderer = CCDDZIRContainer;
	}

	protected addListeners():void{
		super.addListeners();

		ccserver.addEventListener(CCGlobalEventNames.USER_MATCH_SING_UP_INFO_REP, this.onMatchSignUpInfoRep, this);
		CCalien.CCDDZDispatcher.addEventListener(CCGlobalEventNames.REFRESH_MATCH_LIST, this.onRefreshMatchList, this);
	}

	protected removeListeners():void{
		super.removeListeners();

		ccserver.removeEventListener(CCGlobalEventNames.USER_MATCH_SING_UP_INFO_REP, this.onMatchSignUpInfoRep, this);
		CCalien.CCDDZDispatcher.removeEventListener(CCGlobalEventNames.REFRESH_MATCH_LIST, this.onRefreshMatchList, this);
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
		roomInfo.signUpCountTest = roomInfo.signup_cnt + lang.people;
		roomInfo.todayCountText = roomInfo.today_cnt + '/' + roomInfo.maxDayPlayCnt;

		let _source = this._dataProvide.source;
		let _len = _source.length;
		for(let i=0;i<_len;++i){
			for(let j=0;j<_source[i].length;++j){
				if(_source[i][j].matchId == data.matchid){
					this._dataProvide.itemUpdated(_source[i]);
					return;
				}
			}
		}
		//this._dataProvide.itemUpdated(roomInfo);
	}

	private onRefreshMatchList(event:egret.Event):void{
		this._dataProvide.refresh();
	}

	/**
	 * 设置分享成功时当时的局数
	 */
	private _setShareSuccGames(nGames:string):void{
		CCalien.CCDDZlocalStorage.setItem("shareSucc",""+ nGames);
	}

	/**
	 * 获取分享成功时的玩家玩的局数,未分享过返回-1，否则返回分享时的局数
	 */
	private _getShareSuccGames():number{
		let _sGames = CCalien.CCDDZlocalStorage.getItem("shareSucc");
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
			CCalien.CCDDZDispatcher.removeEventListener(CCGlobalEventNames.USER_SHARE_RESULT, this._onWXShareRet, this);
		}
		CCDDZPanelShare.instance.close();
	}

	/**
	 *zhu 免费赛参加次数达到上限，要求分享后才可以继续参赛
	*/
	private _onFreePopShare():void{
		let self = this;
		CCDDZAlert.show("成功分享游戏后即可报名免费赛",0,function(){
			CCalien.CCDDZDispatcher.addEventListener(CCGlobalEventNames.USER_SHARE_RESULT, self._onWXShareRet, self);
			CCDDZPanelShare.instance.showInviteFriend()
        })
	}

	/**
	 *zhu 加入比赛
	 */
	private _onJoinMatch():void{
		if(this.selectedRoom.ads){

		}else{
			for(var i = 0; i < CCGlobalGameConfig.roomList.length; ++i){
				if(CCGlobalGameConfig.roomList[i].is_signup == 2){
					ccserver.checkReconnect();
					return;
				}
			}
			if(this.selectedRoom.is_signup){
				if(this.selectedRoom.is_signup == 1){
					CCDDZPanelMatchCountDown.instance.show(this.selectedRoom);
				}else if(this.selectedRoom.is_signup == 2){
					ccserver.checkReconnect();
				}
			}else{
				if(this.selectedRoom.maxOwnGoldLimit && this.selectedRoom.maxOwnGoldLimit < CCDDZMainLogic.instance.selfData.gold){
					CCDDZAlert.show(CCalien.StringUtils.formatApply(lang.match_sign_up_result[16], [this.selectedRoom.maxOwnGoldLimit, this.selectedRoom.name]));
				}else{
					let _bShowShare = this._shouldShareForFree();
					if(_bShowShare) {
						this._onFreePopShare();
					}
					else{
						CCDDZPanelMatchSignUp.instance.show(this.selectedRoom);
					}
				}
			}
		}
	}
	_tTopNotify:number;
	/*protected selectRoom(event:egret.Event):void {
		let _selItem = this.list.selectedItem;
		//if(_selItem ==)
		super.selectRoom(event);

		this._onJoinMatch();
	}*/

	public clickRoom(selectRoom:any):void {
		this.list.selectedItem = selectRoom;
		//if(_selItem ==)
		super.selectRoom(selectRoom);

		this._onJoinMatch();
	}

	protected dealRoomList():void{
		super.dealRoomList();

		//各种预处理
		this._roomList.forEach((roomInfo:any)=>{
			if(!roomInfo.ads){
				ccserver.getMatchSignUpInfo(roomInfo.matchId);
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

	beforeShow(action:string, params:any):void {
		super.beforeShow(action,params);
		// this.setRoomType(2);
		let visibleRooms:any[] = null;
		let _curTimeStamp = ccserver.getServerStamp();
		visibleRooms = CCGlobalGameConfig.roomList.filter((item:any) => {
			let _showTime = item.showTime;
			let _hideTime = item.hideTime;
			let _inTime = false;
			if(item.roomType == 2){
				_showTime = _showTime.replace(/T/,' ');
				_hideTime = _hideTime.replace(/T/,' ');
				_inTime = CCDDZUtils.isInTimeSection(_showTime,_hideTime,_curTimeStamp,true,false);
			}
			return _inTime;
		});
		
		visibleRooms.sort((r1:any, r2:any)=>{return r1.sortid - r2.sortid;});
		this._roomList = visibleRooms;

		this.dealRoomList();
		let _newList = [];
		let _len = visibleRooms.length;
		let _idx = 0;
		let _item:any = null;
		let _j = 0;
		for(_idx=0;_idx<_len;_idx = _j){
			_item = {0:{},1:{},length:1,_p:this,spec:0};
			_item[0] = visibleRooms[_idx];
			if(_item[0].matchId == 401){
				_j = 1;
				_item.spec = 1;
			}else{
				_j += 2;
				if(_idx + 1 < _len){
					_item[1] =visibleRooms[_idx+1];
					_item.length = 2;
				}
			}
			
			_newList.push(_item);
		}

		this._dataProvide.source = _newList;
	}
}

class CCDDZMatchRoom extends eui.Component {
	private item1Group:eui.Group;
	private item0Group:eui.Group;
	private _matchChannel:CCDDZPageMatchChannel;
	private _data:any;
	createChildren():void {
		super.createChildren();
	}

	private onClickGroup(e:egret.Event):void{
		let _target = e.target;
		if(_target == this.item0Group){
			this._matchChannel.clickRoom(this._data[0]);
		}else if(_target == this.item1Group){
			this._matchChannel.clickRoom(this._data[1]);
		}
	}

	private initDataByIdx(idx:number,data:any){
		this["labName" + idx].text = data.name;
		this["lbOpenTime" + idx].text = data.shortName;
		if(data.hasOwnProperty('startDate')){  //定时开赛
			let nextTurn:any = CCDDZMatchService.getNextTurn(data);
			this["labLimit" + idx].text = data.limitText = nextTurn.nextTime;
			data.nextIndex = nextTurn.nextIndex;
		}else{  //即开赛
			this["labLimit" + idx].text = data.limitText;
		}

		switch(data.matchType){
			case 0: //普通赛
				this["labReward" + idx].text = data.rewardText;
				break;
			case 1: //金豆带入赛

				break;
		}
		this["imgSignUp" + idx].visible = data.is_signup;
	}

	protected setData(data): void{
        this.item0Group["addClickListener"](this.onClickGroup,this,false);
        this.item1Group["addClickListener"](this.onClickGroup,this,false);
		this.currentState = 'normal';
		this._matchChannel = data._p;
		this._data = data;
		let _len = data.length;
		
		this.initDataByIdx(0,data[0]);

		if(_len == 2){
			this.currentState = "normal";
			this.item1Group.visible = true;
			this.initDataByIdx(1,data[1]);
		}else{
			if(data.spec){
				this.currentState  = "spec";
			}
			this.item1Group.visible = false;
		} 
	}
}
window["CCDDZMatchRoom"]=CCDDZMatchRoom;