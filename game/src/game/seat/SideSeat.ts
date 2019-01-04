/**
 * Created by rockyl on 15/11/26.
 */

class SideSeat extends DDZSeat {
//	protected labCardCount:eui.Label;

    protected cardCount: number;

	protected init():void {
		super.init();
	}

	addCards(cardids:number[], animation:boolean = true):void {
		//三张地主牌
		if(cardids.length == 3){
			cardids = [0,0,0]
		}
		super.addCards(cardids);

		if(cardids.length == 0){
			cardids = [];
			this.setCardCount(0);
			for(let i:number = 0; i < 17; i++){
				cardids.push(0);
			}
		}
		this.handCardGroup.addCards(cardids, animation);
		this.ddzHandCardGroup.updateOtherGrayCards();
	}

	reset(keepCards:boolean):Seat {
		this.cardCount = 0;

		return super.reset(keepCards);
	}

	protected onCardAdded(card:Card):void {
		super.onCardAdded(card);

		this.cardCount ++;
//		this.labCardCount.text = this.cardCount.toString();
		this.updateCardCount(this.cardCount);
		if(server.isCoupleGame == true) {
			if(card.parent == this.handCardGroup && this.currentState == "left"){
				this.handCardGroup.removeChild(card);
			}
		}
		else {
			if(card.parent == this.handCardGroup){
				this.handCardGroup.removeChild(card);
			}
		}		
	}

	/**
	 * 设置卡牌数量,用于重连现场恢复
	 * @param count
	 */
	setCardCount(count:number):void{
		this.cardCount = count;
		this.ddzHandCardGroup.cardCount = count;
		this.updateCardCount(count);
	}

	/**
	 * 更新卡牌数
	 * @param count
	 */
	protected updateCardCount(count:number):void{
		super.updateCardCount(count);
		this.labCardCount.text = count.toString();
	}
}