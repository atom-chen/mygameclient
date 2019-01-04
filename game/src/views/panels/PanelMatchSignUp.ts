/**
 * Created by rockyl on 16/3/30.
 *
 * 比赛报名面板
 */

class PanelMatchSignUp extends alien.PanelBase {
	private static _instance:PanelMatchSignUp;
	public static get instance():PanelMatchSignUp {
		if (this._instance == undefined) {
			this._instance = new PanelMatchSignUp();
		}
		return this._instance;
	}

	public labTitle: eui.Label;
	public labLimit: eui.Label;
	public labAmount: eui.Label;
	public labSignUpCount: eui.Label;
	public grpButtons: eui.Group;
	public ddPay:alien.DropDown;

	private roomInfo:any;
	private paySelect:any[];

	protected init():void {
		this.skinName = panels.PanelMatchSignUpSkin;
	}

	constructor() {
		super(
			alien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backOut},
			alien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backIn}
		);

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
	}

	protected _onAddToStage(): void {
		this._enableListeners(true);
	}

	protected _onRemovedToStage(): void {
		this._enableListeners(false);
	}

	private _enableListeners(bEnable: boolean) {
		let _func = "addEventListener";
		if (!bEnable) {
			_func = "removeEventListener";
		}

		server[_func](EventNames.USER_DiamondGame_REP,this._onNewPlayerDiamonRewInfoRep,this);

		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
	}

	createChildren():void {
		super.createChildren();

		this.grpButtons.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGrpButtonsTap, this);
	}

	private _onNewPlayerDiamonRewInfoRep(e:egret.Event):void{
        let data = e.data;
		let _selfdata = MainLogic.instance.selfData;
        if(data.optype ==3){
            if(data.result == null){				
                _selfdata.setHasGetNewDiamond();
				let _str = "恭喜您,成功领取新手钻石奖励:免费补充到48钻"
				let _roomInfo = this.roomInfo;
                Alert.show(_str,0,function(){
					MatchService.instance.signUp(_roomInfo, 3);
                });                
            }else{
                Alert.show("领取新手钻石奖励失败:"+data.result + "|" + _selfdata.diamondgiftgot);
            }
        } 
    }

	private onGrpButtonsTap(event:egret.TouchEvent):void{
		let matchConfig:any;
		switch(event.target.name){
			case 'reward_intro':
				matchConfig = GameConfig.getMatchConfigById(this.roomInfo.matchId);
				PanelMatchIntro.instance.show(lang.match_title_reward_intro, matchConfig.reward);
				break;
			case 'match_intro':
				matchConfig = GameConfig.getMatchConfigById(this.roomInfo.matchId);
				PanelMatchIntro.instance.show(lang.match_title_match_intro, matchConfig.des);				
				break;
			case 'close':
				this.dealAction();
				break;
			case 'sign_up':							
				let item:number = 0;
				let useItem:any = this.paySelect[this.ddPay.index];
				if (typeof useItem.data != 'number') {
					item = useItem.data.id;
				}	
				let _get = false;			
				if(item == 3) {
					let _diamond = BagService.instance.getItemCountById(3);
					let _roomInfo = this.roomInfo						
					if(_roomInfo.entryDiamond > _diamond) {//钻石不足
						_get = MainLogic.instance.noDiamondGetNewDiamondRew(_roomInfo);						
					}
				}
				if(!_get)
					MatchService.instance.signUp(this.roomInfo, item)
				break;
		}
	}

	show(roomInfo:any):void{
		this.popup();

		this.roomInfo = roomInfo;

		this.labTitle.text = roomInfo.name;
		this.labLimit.text = roomInfo.limitText;
		this.labAmount.text = roomInfo.signUpCountTest;
		this.labSignUpCount.text = roomInfo.todayCountText;

		let _entrycost = 0;
		if (!roomInfo || (!roomInfo.hasOwnProperty("entryMoney") && !roomInfo.hasOwnProperty("entryDiamond"))) {
            _entrycost = 0;
        }
        else {
            if (roomInfo.entryMoney || roomInfo.entryDiamond) {
                if (roomInfo.entryMoney > 0) {
                    _entrycost = roomInfo.entryMoney
                }
                else if (roomInfo.entryDiamond) {
                   roomInfo.ticketId = 3;
				   roomInfo.entryTicket = roomInfo.entryDiamond;
                }
            }
            else {
                _entrycost = roomInfo.entryMoney
            }
        }
		let paySelect:any[] = this.paySelect = [{text: roomInfo.entryMoneyText, data: roomInfo.entryMoney}];
		let goods:GoodsConfig = GoodsManager.instance.getGoodsById(roomInfo.ticketId);
		let hasTicket:boolean = BagService.instance.getItemCountById(roomInfo.ticketId) > 0 && !!goods;
		if(goods){
			paySelect = this.paySelect = [{text: roomInfo.entryTicket + goods.name, data: goods}];
		}
		this.ddPay.items = paySelect;
		if(hasTicket){
			this.ddPay.index = 0;
		}

		if (roomInfo.hasOwnProperty('startDate')) {  //定时开赛
			let nextTurn:any = MatchService.getNextTurn(roomInfo);
			//console.log('nextTurn.nextTime:' + nextTurn.nextTime);
			this.labLimit.text = roomInfo.limitText = nextTurn.nextTime;
			server.getMatchSignUpInfo(roomInfo.matchId);
		} else {
			this.labLimit.text = roomInfo.limitText;

			this._timer = egret.setInterval(this.fakeAmount, this, 1000);
		}
	}

	close():void {
		super.close();

		if(this._timer > 0){
			egret.clearInterval(this._timer);
		}
	}

	private _timer:number;
	private _count:number = 0;

	private fakeAmount():void {
		let half = Math.ceil((this.roomInfo.maxPlayer - this._count) / 2);
		this._count += alien.MathUtils.makeRandomInt(half + 1);
		this.labAmount.text = this._count + lang.people;

		if (this._count >= this.roomInfo.maxPlayer) {
			this._count = 0;
		}
	}
}