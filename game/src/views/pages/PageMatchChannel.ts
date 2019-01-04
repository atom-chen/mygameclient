/**
 * Created by rockyl on 16/3/29.
 *
 * 比赛频道页
 */

class PageMatchChannel extends PageChannelBase {
	static defName:string = 'PageMatchChannel';

	private _reloadRoomListTime: number;

	protected init():void {
		this.skinName = pages.PageMatchChannelSkin;
	}

	createChildren():void {
		super.createChildren();

		this.list.itemRenderer = IRContainer;
	}

	protected addListeners():void{
		super.addListeners();

		server.addEventListener(EventNames.USER_MATCH_SING_UP_INFO_REP, this.onMatchSignUpInfoRep, this);
		alien.Dispatcher.addEventListener(EventNames.REFRESH_MATCH_LIST, this.onRefreshMatchList, this);
	}

	protected removeListeners():void{
		super.removeListeners();		
		if(this._reloadRoomListTime) {
			egret.clearTimeout(this._reloadRoomListTime);
		}
		this._reloadRoomListTime = null;
		server.removeEventListener(EventNames.USER_MATCH_SING_UP_INFO_REP, this.onMatchSignUpInfoRep, this);
		alien.Dispatcher.removeEventListener(EventNames.REFRESH_MATCH_LIST, this.onRefreshMatchList, this);
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
		alien.localStorage.setItem("shareSucc",""+ nGames);
	}

	/**
	 * 获取分享成功时的玩家玩的局数,未分享过返回-1，否则返回分享时的局数
	 */
	private _getShareSuccGames():number{
		let _sGames = alien.localStorage.getItem("shareSucc");
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
			alien.Dispatcher.removeEventListener(EventNames.USER_SHARE_RESULT, this._onWXShareRet, this);
		}
		PanelShare.instance.close();
	}

	/**
	 *zhu 免费赛参加次数达到上限，要求分享后才可以继续参赛
	*/
	private _onFreePopShare():void{
		let self = this;
		Alert.show("成功分享游戏后即可报名免费赛",0,function(){
			alien.Dispatcher.addEventListener(EventNames.USER_SHARE_RESULT, self._onWXShareRet, self);
			PanelShare.instance.showInviteFriend()
        })
	}

	/**
	 *zhu 加入比赛
	 */
	private _onJoinMatch():void{
		if(this.selectedRoom.ads){

		}else{
			for(var i = 0; i < GameConfig.roomList.length; ++i){
				if(GameConfig.roomList[i].is_signup == 2){
					server.checkReconnect();
					return;
				}
			}	
			if(this.selectedRoom.is_signup){
				if(this.selectedRoom.is_signup == 1){
					PanelMatchCountDown.instance.show(this.selectedRoom);
				}else if(this.selectedRoom.is_signup == 2){
					server.checkReconnect();
				}
			}else{
				if(this.selectedRoom.maxOwnGoldLimit && this.selectedRoom.maxOwnGoldLimit < MainLogic.instance.selfData.gold){
					Alert.show(alien.StringUtils.formatApply(lang.match_sign_up_result[16], [this.selectedRoom.maxOwnGoldLimit, this.selectedRoom.name]));
				}else{
					let _bShowShare = this._shouldShareForFree();
					if(_bShowShare) {
						this._onFreePopShare();
					}
					else{
						PanelMatchSignUp.instance.show(this.selectedRoom);
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
				server.getMatchSignUpInfo(roomInfo.matchId);
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

		this.loadRoomList();		
	}

	private loadRoomList(): void {
		let visibleRooms:any[] = null;
		let _curTimeStamp = server.getServerStamp();
		visibleRooms = GameConfig.roomList.filter((item:any) => {
			let _showTime = item.showTime;
			let _hideTime = item.hideTime;
			let _inTime = false;
			if(item.roomType == 2){
				_showTime = _showTime.replace(/T/,' ');
				_hideTime = _hideTime.replace(/T/,' ');
				_inTime = alien.Utils.isInTimeSection(_showTime,_hideTime,_curTimeStamp,true,false);
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
		for(_idx=0;_idx<_len;_idx++){
			_item = {0:{},length:1,_p:this,spec:0};
			_item[0] = visibleRooms[_idx];	
			let _data = visibleRooms[_idx];
			let _nextTimeStamp = 0;
			if(_data.hasOwnProperty('startDate')){  //定时开赛
				let nextTurn:any = MatchService.getNextTurn(_data);
				_nextTimeStamp = nextTurn.nextTs;				
			}else{  //即开赛
				let _nextTime = _data.limitText;
				_nextTimeStamp = alien.TimeUtils.parseTime(_nextTime);
			}				 
			_item.nextTimeStamp = _nextTimeStamp;	
			_newList.push(_item);
		}

		_newList.sort((r1:any, r2:any)=>{return r1.nextTimeStamp - r2.nextTimeStamp;});

		this._dataProvide.source = _newList;

		if(!_newList || !_newList.length) {

		}
		else {
			let tsNow:number = server.tsNow;
			let tsNext = _newList[0].nextTimeStamp;
			let _time = (tsNext - tsNow) * 1000 + 500;
			console.log("loadRoomList---------->", _time);
			if(!_time || _time < 0) {

			}
			else {
				this._reloadRoomListTime = egret.setTimeout(()=>{
					this.loadRoomList();
				}, this, _time);
			}
		}
	}
}

class MatchRoom extends eui.Component {	
	private itemGroup:eui.Group;
	private _matchChannel:PageMatchChannel;
	private _data:any;
	createChildren():void {
		super.createChildren();
	}

	private onClickGroup(e:egret.Event):void{
		let _target = e.target;		
		this._matchChannel.clickRoom(this._data[0]);		
	}

	private initDataByIdx(idx:number,data:any){		
		this["labName"].text = data.shortName ;
		this["lbOpenTime"].text = data.shortName;
		if(data.hasOwnProperty('startDate')){  //定时开赛
			let nextTurn:any = MatchService.getNextTurn(data);
			this["labLimit"].text = data.limitText = nextTurn.nextTime;
			data.nextIndex = nextTurn.nextIndex;
		}else{  //即开赛
			this["labLimit"].text = data.limitText;
		}

		switch(data.matchType){
			case 0: //普通赛
				this["labReward"].text = data.rewardText;
				break;
			case 1: //金豆带入赛

				break;
		}
		this["imgSignUp"].source = (data.is_signup ? "room_match_enrolment" : "room_match_enroll");

		if(data.gameType == "pdk") {			
			this["typeimg"].source = "room_match_runFast1"			
		} else if(data.gameType == "ddz") {			
			this["typeimg"].source = "room_match_landlord1"			
		}
	}

	protected setData(data): void{
        this.itemGroup["addClickListener"](this.onClickGroup,this,false);		
		this._matchChannel = data._p;		
		this._data = data;
		let _len = data.length;
		
		this.initDataByIdx(0, data[0]);		
	}
}
window["MatchRoom"]=MatchRoom;