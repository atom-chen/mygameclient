/**
 * Created by rockyl on 15/11/26.
 */

class PDKSideSeat extends PDKDDZSeat {
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

	reset(keepCards: boolean): PDKSeat {
		this.cardCountNum = 0;

		return super.reset(keepCards);
	}

	protected onCardAdded(card: PDKCard): void {
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
		super.updateCardCount(count);
		if (count < 0 || !count) count = 0
		if (count == 1) {
			this.baodan.visible = true;
			this.cardCount.visible = false;
			if (this.baodanTimerId != 0) egret.clearInterval(this.baodanTimerId);
			this.baodanTimerId = egret.setInterval(function (self) {
				self.baodan02.visible = !self.baodan02.visible;
			}, this, 300, this);
		} else {
			if (this.baodanTimerId != 0) egret.clearInterval(this.baodanTimerId);
			this.baodanTimerId = 0;
			this.baodan.visible = false;
			this.baodan02.visible = false;
			this.cardCount.visible = true;
			this.labCardCount.text = count.toString();
		}
	}
}