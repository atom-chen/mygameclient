/**
 * Created by rockyl on 16/3/30.
 *
 * 比赛报名面板
 */

class PDKPanelMatchSignUp extends PDKalien.PDKPanelBase {
	private static _instance:PDKPanelMatchSignUp;
	public static get instance():PDKPanelMatchSignUp {
		if (this._instance == undefined) {
			this._instance = new PDKPanelMatchSignUp();
		}
		return this._instance;
	}

	public labTitle: eui.Label;
	public labLimit: eui.Label;
	public labAmount: eui.Label;
	public labSignUpCount: eui.Label;
	public grpButtons: eui.Group;
	public ddPay:PDKalien.PDKDropDown;

	private roomInfo:any;
	private paySelect:any[];

	protected init():void {
		this.skinName = panels.PDKPanelMatchSignUpSkin;
	}

	constructor() {
		super(
			PDKalien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backOut},
			PDKalien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backIn}
		);
	}

	createChildren():void {
		super.createChildren();

		this.grpButtons.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGrpButtonsTap, this);
	}

	private onGrpButtonsTap(event:egret.TouchEvent):void{
		let matchConfig:any;
		switch(event.target.name){
			case 'reward_intro':
				matchConfig = PDKGameConfig.getMatchConfigById(this.roomInfo.matchId);
				PDKPanelMatchIntro.instance.show(PDKlang.match_title_reward_intro, matchConfig.reward);
				break;
			case 'match_intro':
				matchConfig = PDKGameConfig.getMatchConfigById(this.roomInfo.matchId);
				PDKPanelMatchIntro.instance.show(PDKlang.match_title_match_intro, matchConfig.des);
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
				PDKMatchService.instance.signUp(this.roomInfo, item)
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

		let paySelect:any[] = this.paySelect = [{text: roomInfo.entryMoneyText, data: roomInfo.entryMoney}];
		let goods:GoodsConfig = PDKGoodsManager.instance.getGoodsById(roomInfo.ticketId);
		let hasTicket:boolean = PDKBagService.instance.getItemCountById(roomInfo.ticketId) > 0 && !!goods;
		if(goods){
			paySelect.push({text: goods.name + 'x' + roomInfo.entryTicket, data: goods, disable:!hasTicket});
		}
		this.ddPay.items = paySelect;
		if(hasTicket){
			this.ddPay.index = 1;
		}

		if (roomInfo.hasOwnProperty('startDate')) {  //定时开赛
			let nextTurn:any = PDKMatchService.getNextTurn(roomInfo);
			//console.log('nextTurn.nextTime:' + nextTurn.nextTime);
			this.labLimit.text = roomInfo.limitText = nextTurn.nextTime;
			pdkServer.getMatchSignUpInfo(roomInfo.matchId);
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
		this._count += PDKalien.MathUtils.makeRandomInt(half + 1);
		this.labAmount.text = this._count + PDKlang.people;

		if (this._count >= this.roomInfo.maxPlayer) {
			this._count = 0;
		}
	}
}