/**
 * Created by rockyl on 15/11/20.
 *
 * 牌组
 */

class RunFastBaseCardGroup extends eui.Group {
	protected _stageCenterPos: any;

	public cardCount: number;
	public scale: number = 1;
	public align: number = 0.5;
	public warpCount: number = 100;

	public onCardAdded: Function;

	constructor() {
		super();

		this.init();
	}

	protected init(): void {

	}

	initData(data: any = null): void {
		this.clean();
	}

	/**
	 * 清理桌面上的牌
	 */
	clean(): void {
		Utils.recycleCards(this);
		this.cardCount = 0;
	}

	/**
	 * 添加卡牌
	 * @param pokerIds
	 * @param animation
	 */
	addCards(pokerIds: number[], animation: boolean = true): number {
		// console.log("addCards---------11->", pokerIds);
		pokerIds.forEach((pid: number, index: number) => {
			let card: Card = Card.create({ pid });
			// console.log("addCards---------22->",card);
			this.addCard(card, index);
		});

		this.adjustCards(animation);

		return this.numChildren;
	}

	/**
	 * 添加一张牌到目标容器
	 * @param target
	 * @param index
	 */
	protected addCard(target: Card, index: number = 0): void {
		target.scaleX = target.scaleY = this.scale;
		alien.Utils.enumChildren(this, (card: Card, index: number): boolean => {
			if (target.pokerId > card.pokerId) {
				this.addChildAt(target, index);
				return true;
			}
		});
		if (!target.parent) {
			this.addChild(target);
		}
		//this.addChild(target);
		this.cardCount++;

		target.addPlaying = true;
	}

	sendCardsToGroup(receiver: RunFastBaseCardGroup, cards: Card[], updateCount: boolean = true): void {
		receiver.receiveCardsFromGroup.call(receiver, this, cards);

		if (updateCount) {
			this.cardCount -= cards.length;
		}
		this.adjustCards(true);
	}

	private getCardGapH(len: number): number {
		if (len) {
			if ((GameConfig.CARD_GAP_H * (len - 1) + GameConfig.CARD_WIDTH * GameConfig.CARD_SCALE) > alien.StageProxy.stage.stageWidth) {
				return (alien.StageProxy.stage.stageWidth - GameConfig.CARD_WIDTH * GameConfig.CARD_SCALE) / (len - 1);
			}
			else
				return GameConfig.CARD_GAP_H;
		}
		else
			return GameConfig.CARD_GAP_H;

	}

	receiveCardsFromGroup(sender: RunFastBaseCardGroup, cards: Card[]): void {
		let scale: number = this.scale;

		// cards.sort((card1: Card, card2: Card): number => {
		// 	return card2.pokerId - card1.pokerId;
		// });
		let len: number = cards.length;
		let animated: number = 0;
		var gapH: number = this.getCardGapH(len);
		let baseX: number = (this.width - (gapH * (Math.min(len, this.warpCount)) + GameConfig.CARD_OFFSET) * scale) * this.align;
		let gp = this.localToGlobal(baseX, 0);
		let lp = sender.globalToLocal(gp.x, gp.y);
		cards.forEach((card: Card, index: number) => {
			card.select = false;
			card.sending = true;
			let line: number = Math.floor(index / this.warpCount);
			let toX: number = lp.x + (index % this.warpCount) * gapH * scale;
			let toY: number = lp.y + (line * GameConfig.CARD_GAP_V * scale);

			card.animate({ x: toX, y: toY, scaleX: scale, scaleY: scale }, 0, null, 200).call((index: number) => {
				card.sending = false;

				this.addChildAt(card, 0);
				card.x = baseX + (index % this.warpCount) * gapH * scale;
				card.y = (line * GameConfig.CARD_GAP_V * scale);

				animated++;
				if (animated == len) {
					this.adjustCardsEnd();
				}
			}, this, [index]);
		});
	}

	private get stageCenterPos(): any {
		if (!this._stageCenterPos) {
			let p = this.globalToLocal(alien.StageProxy.width / 2 - GameConfig.CARD_WIDTH / 2, alien.StageProxy.height / 2 - GameConfig.CARD_HEIGHT / 2);
			this._stageCenterPos = { x: p.x, y: p.y };
		}

		return this._stageCenterPos;
	}

	/**
	 * 调整卡牌的坐标
	 */
	adjustCards(animation: boolean = true): void {
		let addCount: number = 0;
		var gapH: number = this.getCardGapH(this.cardCount);
		let baseX: number = (this.width - (gapH * this.cardCount + GameConfig.CARD_OFFSET) * this.scale) >> 1;
		let index: number = 0;
		let count: number = 0;
		alien.Utils.enumChildren(this, (card: Card) => {
			if (card.sending) {
				return;
			}
			count++;
		});
		alien.Utils.enumChildren(this, (card: Card) => {
			if (card.sending) {
				return;
			}
			let toX: number = baseX + index * gapH * this.scale;
			let toY: number = 0;
			if (animation) {//如果有动画
				let tween: egret.Tween;
				if (card.addPlaying) {  //如果是加牌
					alien.Utils.injectProp(card, { alpha: 0, scaleX: 0.2, scaleY: 0.2 });
					tween = card.animate({ alpha: 1, scaleX: this.scale, scaleY: this.scale, x: toX, y: toY }, addCount * 20, this.stageCenterPos);
					tween.call(() => {
						card.addPlaying = false;
						if (this.onCardAdded) {
							this.onCardAdded(card);
						}
					});
				} else {
					tween = card.animate({ x: toX, y: toY, alpha: 1 });
				}

				tween.call(() => {
					addCount++;
					if (addCount >= count) {
						this.adjustCardsEnd();
					}
				});
			} else {
				card.x = toX;
				card.y = toY;
				card.addPlaying = false;
			}

			index++;
		});

		if (!animation) {
			this.adjustCardsEnd();
		}
	}

	protected adjustCardsEnd(): void {

	}

	/**
	 * 销毁卡牌动画
	 * @param card
	 */
	private destroyCard(card: Card): void {
		egret.Tween.get(card).to({ alpha: 0 }, 100).call((card: Card) => {
			this.removeChild(card);
			Card.recycle(card);
		}, this, [card]);
	}
}