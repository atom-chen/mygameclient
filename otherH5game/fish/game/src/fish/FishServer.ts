/**
 * Created by eric.liu on 17/11/16.
 *
 * 网络类
 */

class FishServer extends FishSocket {
    public selfData:FishUserInfoData = new FishUserInfoData();
	public exchangeId:number = 0;
	public roomId:number = 0;

    protected beforeDispatchMessage(name:string, message:any):void {
		switch (name) {
			case FishEvent.GAME_SET_SESSION:
				if(this._session > 0 && this._session != message.session){
					this.giveUpGame();
				}
				this.resetSession();
				break;
		}

		super.beforeDispatchMessage(name, message);
	}

	initFromParams(params:any) {
		this._uid = params.serverUid;
		this._ddzDispatcher = params.dispatcher;
		this.ddzDispatchEvent(6,null, {type:6,protoIDS:{'user.RedcoinExchangeGoodsRep':{just:true},'user.LotteryRedcoinRep':{just:true}}})
		this._ddzDispatcher.addEventListener("RECV_SOCKET_DATA", fishServer.onDDZSocketData, fishServer);
	}

    send(name:string, data:any):void {
		if(!data.session && name.indexOf('game') >= 0){
			data.session = this._session;
		}
		super.send(name, data);
	}

	reconnectJoin(session:number):void {
		this.send(FishEvent.USER_RECONNECT_TABLE_REQ, {session:session, result:0, index:0});
	}

    quickJoin(roomid:number=FISH_ROOMID_TEST):void {
		this.roomId = roomid;
		this.send(FishEvent.USER_QUICK_JOIN_REQUEST, {roomid: roomid, clientid: this._clientId});
	}

    getFreshManReward():void{
		this.send(FishEvent.GET_FRESHMAN_REWARD_REQ, {});
	}

    userInfoRequest(uid:number):void {
		this.send(FishEvent.USER_USER_INFO_REQUEST, {uid:uid});
	}

    giveUpGame():void{
		this.send(FishEvent.GAME_GIVE_UP_GAME_REQ, {status: 0});
	}

    fireFish(bkind:number, bangle:number, bmulti:number, bid:number):void {
        this.send(FishEvent.GAME_FISH_FIRE_REQ, {bullet_kind: bkind, angle: bangle, bullet_multiple: bmulti, bullet_id:bid});
    }

    catchFish(bid:number, fid:number):void {
        this.send(FishEvent.GAME_FISH_CATCH, {bullet_id:bid, fishid:fid});
    }

	lotteryRedcoin(roomid:number=FISH_ROOMID_TEST) {
		this.send(FishEvent.LOTTERY_REDCOIN_REQ, {roomid:roomid});
	}

	getBagInfo():void {
		this.send(FishEvent.USER_BAG_INFO_REQ, {});
	}

	alms():void{
		this.send(FishEvent.USER_ALMS_REQ, {});
	}

	getUserInfoInGame(id:number):void {
		this.send(FishEvent.GAME_USER_INFO_IN_GAME_REQ, {uid:id});
	}

	redcoinExchangeGoodsReq(idx:number): void {
		this.exchangeId = idx;
        this.send(FishEvent.USER_REDCOIN_EXCHANGE_GOODS_REQ, {index:idx});
    }

	sendDaySigninOptReq(optype:number):void {
		this.send(FishEvent.USER_DAY_SIGNIN_OPT_REQ, {optype:optype});
	}

	getBindPhoneReward():void {
		this.send(FishEvent.GAME_FISH_BIND_PHONE_REWARD_REQ, {});
	}

	refreshUserGoldInGame():void {
		this.send(FishEvent.GAME_FISH_FRESHEN_GOLD_REQ, {});
	}
}

let fishServer:FishServer = new FishServer();