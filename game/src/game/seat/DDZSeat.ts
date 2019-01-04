/**
 * Created by rockyl on 15/11/26.
 *
 * 斗地主-座位
 */

class DDZSeat extends Seat {
	protected container:eui.Group;
	protected cdClock:CDClock;
	protected labCardCount:eui.Label;
	protected imgMaster:eui.Image;
	protected robot:Robot;
	protected imgStatus:eui.Image;
	protected imgReady:eui.Image;
    protected jingdengGroup:eui.Group;
	
	protected ddzHandCardGroup:DDZCardGroup;
	protected ddzDeskCardGroup:DDZCardGroup;

	protected btnCancleTrust:eui.Button;
	protected cardShadow:eui.Image;
	private _sexVoice:string;
	/**
	 * 玩家头像上的加倍标识
	 */
	protected doubleFlag_img:eui.Image;

	protected init():void {
		super.init();

	}

	protected createChildren():void {
		super.createChildren();

		this.ddzHandCardGroup = <DDZCardGroup>this.handCardGroup;
		this.ddzDeskCardGroup = <DDZCardGroup>this.deskCardGroup;
		this.ddzHandCardGroup.onCardAdded = this.onCardAdded.bind(this);

		this.btnCancleTrust.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCancelTrust,this)
	}

	private onCancelTrust(event: egret.TouchEvent): void {
        server.hang(false);
    }

	reset(keepCards:boolean = false):Seat{
		this.cdClock.visible = this.imgStatus.visible = false;
		this.labCardCount.text = '0';
		this.hideJingDeng();
		this.showDoubleFlag(false);
		this.setMaster(false, false);
		this.setHang(false);

		this.ddzHandCardGroup.initData();

		return super.reset(keepCards);
	}

	clean(keepCards:boolean = false,cleanUserInfo:boolean = true):Seat {
		this.cleanPlayer(cleanUserInfo);
		return super.clean(keepCards,cleanUserInfo);
	}

	cleanPlayer(cleanUserInfo:boolean = true):void{
		this.cdClock.stop();
		this.robot.visible = false;
		this.labCardCount.text = '0';
		this.hideJingDeng();
		this.showDoubleFlag(false);
		this.imgMaster.visible = false;
		this.imgStatus.visible = false;
		this.imgReady.visible = false;
		if(cleanUserInfo){
			this.userInfoData = null;
		}
	}

	initData(data:any):void{
		let clearnUserInfo = data.cleanUserInfo;
		this.clean(false,clearnUserInfo);

       //this.userInfoView.gold.setType(data.isMatch,data.matchType);
		if(data.matchType ==6){ //钻石赛 zhu
			this.userInfoView.gold.visible = false;
		}
		else{//其他比赛
			this.userInfoView.gold.visible = true;
			this.userInfoView.gold.setType(data.isMatch, data.matchType);
			if(data.roomFlag ==2){
				if(!data.isSelf){ //不是自己才把金豆栏替换成钻石
					this.userInfoView.gold.showDiamond();
				}
			}
		}
	}
	
	cleanDesk():void {
		super.cleanDesk();
		this.setStatus();
	}

	setGrayCardsNum(grayNum:number):void{
		this.ddzHandCardGroup.setGrayCardsNum(grayNum);
	}


	addCards(cardids:number[], animation:boolean = true, hideStatus:boolean = true):void {
		if(hideStatus){
			this.setStatus();
		}
		
		super.addCards(cardids);
	}

	protected onCardAdded(card:Card):void{

	}

	/**
	 * 显示手牌
	 * 仅用于二人斗地主游戏结束展示手牌
	 */
	showHandCards(cardids:number[]):void{
		if(server.isCoupleGame == true){
			cardids.sort((num1,num2)=>{
				return num2 - num1;
			})
			let len = cardids.length;
			let childrens = this.handCardGroup.$children.slice(0);
			let card:Card;
			let childLen = 0;
			for(let i=0;i<len;++i){
				childLen = childrens.length;
				for(let j=0;j<childLen;++j){
					card = <Card>childrens[j];
					if(card && !card.sending){
						card.pokerId = cardids[i];
						childrens.splice(j,1);
						card.showFront();
						break;
					}
				}
			}
		}
	}

	protected setCardsShadowSize(cardcount):void{
		if(this.cardShadow){
			this.cardShadow.width = GameConfig.CARD_WIDTH + (cardcount - 1) * GameConfig.CARD_GAP_H;
		}
	}

	/**
	 * 出牌
	 * @param pokerIds 如果是null, 就说明是不出
	 * @param gameEnd
	 * @param updateCount
	 */
	useCard(pokerIds:number[] = null, gameEnd:boolean = false, updateCount:boolean = true, isReconnect: boolean = false):number {
		let cardType:number = 0;
		if (!gameEnd && updateCount) {
			// let a1 = []; let a2 = []; let a3 = []; let a4 = [];
			let result = CardsType.GetType(pokerIds);
			cardType = result.ct;
			let poker:any = Utils.pid2poker(pokerIds[0]);
			GameSoundManager.playCardType(this._sexVoice, cardType, poker.num);
            alien.Dispatcher.dispatch(EventNames.SHOW_GAME_EFFECT,{cardType,state:this.currentState});
			
//			switch(cardType){
//    			//王炸
//    			case 1:
//    			    alien.Dispatcher.dispatch(EventNames.SHOW_GAME_EFFECT,cardType);
//    			
//				case 9: //飞机特殊
//					break;
//			}
		}

		if (pokerIds.length == 0) {
			this.stopCD();
			if (gameEnd) {
				this.setStatus();
			}else{
				this.setStatus(ResNames.play_word_4);
			}
		} else {
			this.cleanDesk();

			let cardCount = this.ddzHandCardGroup.useCards(pokerIds, this.ddzDeskCardGroup, updateCount, isReconnect);			

			if (!gameEnd && updateCount) {
				this.updateCardCount(cardCount);
			}
			this.setStatus();

			this.setCardsShadowSize(this.handCardGroup.cardCount);
		}

		return cardType;
	}

	setStatus(s:string = null):void{
		if(s){
			this.imgStatus.source = s;
		}

		this.imgStatus.visible = !!s;
	}

	/**
	 * zhu 显示牌的遮罩
	 */
	public setShowCardShadow(bShow:boolean):void{
		if(this.cardShadow){
			this.cardShadow.visible = bShow;
			this.setCardsShadowSize(this.handCardGroup.cardCount);
		}
	}

	/**
	 * 设置挂机
	 * @param value
	 */
	setHang(value:boolean):void {
		this.robot.visible = value;
		if(this.btnCancleTrust){
			this.btnCancleTrust.visible = value
		}
		this.setShowCardShadow(value);
		/*
		if(this.cardShadow){
			this.cardShadow.visible = value;
			this.setCardsShadowSize(this.handCardGroup.cardCount);
		}*/
	}

	/**
	 * 开始CD
	 * @param cd
	 * @param onComplete
	 */
	startCD(cd:number, onComplete:Function = null):void {
		this.cdClock.visible = true;
		this.cdClock.start(cd, onComplete);
	}

	/**
	 * 隐藏CD
	 */
	stopCD():void {
		this.cdClock.visible = false;
		this.cdClock.stop();
	}

	/**
	 * 显示叫分
	 * @param score
	 */
	showScore(score:number):void {
		if (score == 0) {
			this.setStatus(ResNames.play_word_5);
		} else if (score < 0) {
			//this.imgStatus.source = ResNames.play_word_4;
		} else {
			this.setStatus('play_word_' + score);
		}

		GameSoundManager.playScore(this._sexVoice, score);
	}

	/**
	 * 显示叫不叫地主
	 */
	showGrab(score: number): void {
		if(score == 0) {
			this.setStatus("play_word_not_grab");
		}
		else {
			this.setStatus("play_word_grab");
		}
		GameSoundManager.playScore(this._sexVoice, score);
	}

	/**
	 * 隐藏分数
	 */
	hideScore():void {
		this.setStatus();
	}

	/**
	 * 显示玩家头像上的加倍标识
	 */
	showDoubleFlag(bShow:boolean):void{
		this.doubleFlag_img.visible = bShow;
	}

	/**
	 * 显示叫分位置的加倍或者是不加倍的Tip
	 * bDouble:是否加倍
	 */
	showDoubleTip(bShow:boolean,bDouble:boolean = false):void{
		let _s = "noDouble2";
		if(bDouble){
			_s = "double2";
		}
		
		this.setStatus(_s);
		egret.setTimeout(()=>{ //显示完不加倍或者是加倍后加一个自动隐藏的判断
			if(this.imgStatus.source == "noDouble2" || this.imgStatus.source == "double2"){
				this.setStatus();
			}
		}, this, 3000);
		GameSoundManager.playDouble(this._sexVoice,bDouble);
	}

	/**
	 * 更新卡牌数
	 * @param count
	 */
	protected updateCardCount(count:number):void {
        if(count<=3)
            this.showJingDeng();
        else
            this.hideJingDeng();
	}
	
    
    private jingdeng: DragonJingDeng;
    public showJingDeng(): void {
        if (!this.jingdeng)
            this.jingdeng = new DragonJingDeng();
        if(!this.jingdeng.parent) {
            this.jingdengGroup.addChild(this.jingdeng);
        }
    }

    public hideJingDeng(): void {
        if(this.jingdeng && this.jingdeng.parent) {
            this.jingdeng.parent.removeChild(this.jingdeng);
        }
    }

	private _isMaster:boolean;
	/**
	 * 设置地主
	 * @param value
	 * @param animation
	 */
	setMaster(value:boolean, animation:boolean):void {
		this.imgMaster.visible = false;

		this._isMaster = value;

		this.ddzHandCardGroup.isMaster = value;
		this.ddzDeskCardGroup.isMaster = value;

		if(value){
			let from:any = this.globalToLocal(alien.StageProxy.width / 2 - this.imgMaster.width / 2, alien.StageProxy.height / 2 - this.imgMaster.height / 2);
			from = {
				x: from.x,
				y: from.y,
				visible: true,
			};
			let to:any = {
				x: this.imgMaster.x,
				y: this.imgMaster.y,
			};
			let tween:egret.Tween = egret.Tween.get(this.imgMaster).set({visible: true}).to(from);
			if(animation){
				tween.wait(1000).to(to, 500, egret.Ease.cubicIn);
			}else{
				tween.to(to);
			}
		}
	}

	get isMaster():boolean{
		return this._isMaster;
	}

	protected _setUserInfoData(userInfoData:UserInfoData){
		super._setUserInfoData(userInfoData);

		if(this.userInfoData){
			this._sexVoice = userInfoData.sexVoiceStr;
		}
	}

	updateUserInfoData(data:any):void {
		super.updateUserInfoData(data);

		if(this.userInfoData){
			this._sexVoice = this._userInfoData.sexVoiceStr;
		}
	}

	updateGold(gold:number, ismatch:boolean = false):void{
		if(!this.userInfoData) return;

        var tmp: number = this.userInfoData.gold += gold;
        if(!ismatch && tmp < 0)
            tmp = 0;
		this.userInfoView.updateGold(tmp);
	}

	updateDiamondNum(nDiamond: number, self: boolean = true): void {
		this.userInfoView.updateDiamondNum(nDiamond, self);
	}

	/**
	 * 红包赛更新玩家的钻石
	 * isSelf:是否是我自己
	 */
	updateRednormalGold(gold:number,isSelf:boolean = false):void{
		let nCur = this.userInfoView.gold.nGold;
		if(isSelf){
			nCur = this.userInfoView.diamond.nGold;
		}
		var tmp: number = Number(nCur) + gold;
        if(tmp < 0)
            tmp = 0;
		if(isSelf){
			this.userInfoView.updateDiamond(tmp);
		}
		else{
			this.userInfoView.updateGold(tmp);
		}
	}

	/**
	 * 更新钻石数
	 */
	updateDiamond(nDiamond:number):void{
		if(nDiamond <0) return;
		this.userInfoView.updateDiamond(nDiamond);
	}

	/**
	 * 显示钻石
	 */
	showDiamond(bShow:boolean):void{
		this.userInfoView.diamond.visible = bShow;
	}

	/**
	 * 设置准备
	 * @param ready
	 */
	setReady(ready:boolean):void{
		this.imgReady.visible = ready && !server.isMatch;
	}
}