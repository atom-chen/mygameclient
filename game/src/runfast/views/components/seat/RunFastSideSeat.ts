/**
 * Created by rockyl on 15/11/26.
 */

class RunFastSideSeat extends RunFastSeat {
	//	protected labCardCount:eui.Label;

	protected cardCountNum: number;

	protected init(): void {
		super.init();
	}

	addCards(cardids: number[], animation: boolean = true): void {
		super.addCards(cardids);

		if (cardids.length == 0) {
			cardids = [];
			this.setCardCount(0);
			for (let i: number = 0; i < 16; i++) {
				cardids.push(0);
			}
		}
		this.handCardGroup.addCards(cardids, animation);
	}

	reset(keepCards: boolean): RunFastBaseSeat {
		this.cardCountNum = 0;

		return super.reset(keepCards);
	}

	protected onCardAdded(card: Card): void {
		super.onCardAdded(card);

		this.cardCountNum++;
		//		this.labCardCount.text = this.cardCount.toString();
		this.updateCardCount(this.cardCountNum);
		if (card.parent == this.handCardGroup) {
			this.handCardGroup.removeChild(card);
		}
	}

	/**
	 * 设置卡牌数量,用于重连现场恢复
	 * @param count
	 */
	setCardCount(count: number): void {
		this.cardCountNum = count;
		this.ddzHandCardGroup.cardCount = count;
		this.updateCardCount(count);
	}

	/**
	 * 更新卡牌数
	 * @param count
	 */
	protected updateCardCount(count: number): void {
		if (count < 0 || !count) count = 0	
		super.updateCardCount(count);		
		this.labCardCount.text = count.toString();		
	}
}