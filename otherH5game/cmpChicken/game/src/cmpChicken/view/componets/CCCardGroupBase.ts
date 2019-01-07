/**
 * Created by rockyl on 15/11/20.
 *
 * 牌组
 */

class CCCardGroupBase extends eui.Group {
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
		CCDDZUtils.recycleCards(this);
		this.cardCount = 0;
	}

	private _showordercardsAniItval: number = 0;

	/**
	 * 添加卡牌
	 * @param pokerIds
	 * @param animation
	 */
	addCards(pokerIds: number[], animation: boolean = true, showorder: boolean = false): number {
		// console.log("addCards--------", pokerIds);
		// pokerIds.forEach((pid: number, index: number) => {
		// 	let card: CCCard = CCCard.create({ pid });			
		// 	this.addCard(card, index);
		// });

		// this.adjustCards(animation);

		if (showorder) {
			if (this._showordercardsAniItval != 0) return;
			let _cardIndex = 0;
			let _cardNum = pokerIds.length;
			this._clearAnimationInterval();
			CCDDZSoundManager.instance.playEffect(CCResNames.cc_special_dispatch)

			pokerIds.forEach((pid: number, index: number) => {
				let card: CCCard = CCCard.create({ pid });
				card.visible = false;
				this.addCard(card, index);
			});

			this.adjustCards(false);

			let _func = function () {
				if (_cardIndex > this.numChildren - 1) {
					this._clearAnimationInterval();
				}
				let card = this.getChildAt(_cardIndex);
				if (!card) {

				}
				else {
					card.visible = true;
				}
				_cardIndex++;
				if (_cardIndex > _cardNum - 1) {
					this._clearAnimationInterval();
				}
			}.bind(this);

			this._showordercardsAniItval = egret.setInterval(function () {
				_func();
			}, this, 200);
			_func();
		}
		else {
			CCDDZSoundManager.instance.playEffect(CCResNames.cc_send_hintcard);
			pokerIds.forEach((pid: number, index: number) => {
				let card: CCCard = CCCard.create({ pid });
				this.addCard(card, index);
			});

			this.adjustCards(animation);
		}

		return this.numChildren;
	}

	//清除播放动画的interval
	public _clearAnimationInterval(): void {
		if (this._showordercardsAniItval != 0) {
			egret.clearInterval(this._showordercardsAniItval);
		}
		this._showordercardsAniItval = 0;
	}
	/**
	 * 调整卡牌位置
	 * @param pokerIds
	 * @param animation
	 */
	sortCards(pokerIds: number[]): number {
		console.log("sortCards--------", pokerIds);
		CCalien.CCDDZUtils.enumChildren(this, (card: CCCard, index: number) => {
			let data = { pid: pokerIds[index] };
			card.initData(data);
		})
		return this.numChildren;
	}

	/**
	 * 添加一张牌到目标容器
	 * @param target
	 * @param index
	 */
	protected addCard(target: CCCard, index: number = 0): void {
		target.scaleX = target.scaleY = this.scale;
		CCalien.CCDDZUtils.enumChildren(this, (card: CCCard, index: number): boolean => {
			if (CCGlobalGameConfig.currentSortType == SORT_TYPE_VALUE) {
				if (target.pokerId > card.pokerId) {
					this.addChildAt(target, index);
					return true;
				}
			}
			else {
				if (target.pokerId == 140 || target.pokerId == 150 || card.pokerId == 140 || card.pokerId == 150) {
					if (target.pokerId > card.pokerId) {
						this.addChildAt(target, index);
						return true;
					}
				}
				else if (target.pokerId % 10 != card.pokerId % 10) {
					if (target.pokerId % 10 > card.pokerId % 10) {
						this.addChildAt(target, index);
						return true;
					}
				}
				else if (Math.floor(target.pokerId / 10) != Math.floor(card.pokerId / 10)) {
					if (Math.floor(target.pokerId / 10) > Math.floor(card.pokerId / 10)) {
						this.addChildAt(target, index);
						return true;
					}
				}
				else {
					if (target.pokerId > card.pokerId) {
						this.addChildAt(target, index);
						return true;
					}
				}
			}
		});
		if (!target.parent) {
			this.addChild(target);
		}
		this.cardCount++;

		target.addPlaying = true;
	}

	//二人斗地主当对手出牌要从对手的手牌（暗牌）中移除对应数量的牌
	removeHandCardsByNum(num: number): void {
		let container = this;
		let card: CCCard;
		let removeNum = num;

		while (removeNum > 0) {
			card = <CCCard>container.getChildAt(0);
			if (card) {
				container.removeChild(card);
			}
			removeNum--;
		}
	}

	//出牌 从handCCCardGroupBase 到 deskCCCardGroupBase
	removeHandCardsToDeskCardsGrp(receiver: CCCardGroupBase, cards: CCCard[], updateCount: boolean = true, isReconnect: boolean = false): void {
		receiver.receiveCardsFromGroup.call(receiver, this, cards);
		let num = cards.length;
		if (updateCount) {
			this.cardCount -= num;
		}
		if (this.currentState == "right_2" && ccserver.isCoupleGame && isReconnect == false) {
			this.removeHandCardsByNum(num);
			// return;
		}

		this.adjustCards(true);
	}

	private getCardGapH(len: number): number {
		if (len) {
			if ((CCGlobalGameConfig.CARD_GAP_H * (len - 1) + CCGlobalGameConfig.CARD_WIDTH * CCGlobalGameConfig.CARD_SCALE) > CCalien.CCDDZStageProxy.stage.stageWidth) {
				return (CCalien.CCDDZStageProxy.stage.stageWidth - CCGlobalGameConfig.CARD_WIDTH * CCGlobalGameConfig.CARD_SCALE) / (len - 1);
			}
			else
				return CCGlobalGameConfig.CARD_GAP_H;
		}
		else
			return CCGlobalGameConfig.CARD_GAP_H;

	}

	receiveCardsFromGroup(sender: CCCardGroupBase, cards: CCCard[]): void {
		let scale: number = this.scale;
		//console.log("receiveCardsFromGroup------>",cards,this.warpCount);
		cards.sort((card1: CCCard, card2: CCCard): number => {
			return card2.pokerId - card1.pokerId;
		});
		let len: number = cards.length;
		let animated: number = 0;
		var gapH: number = this.getCardGapH(len);

		let baseX: number = (this.width - (gapH * (Math.min(len, this.warpCount)) + CCGlobalGameConfig.CARD_OFFSET) * scale) * this.align;
		if (this.name.indexOf("DeskGroup") != -1 && sender.name == "handCardGroup") {
			gapH = 55;
			let _cardOffSet = CCGlobalGameConfig.CARD_WIDTH - gapH;
			baseX = (this.width - (gapH * (Math.min(len, this.warpCount)) + _cardOffSet) * scale) * this.align;
		}
		if (ccserver.isCoupleGame) {
			let oneCardW = CCGlobalGameConfig.CARD_WIDTH * this.scale;
			baseX = (this.width - (gapH * this.cardCount + CCGlobalGameConfig.CARD_OFFSET) * this.scale) * 0.5;
			if (this.currentState == "left") {
				return;
			} else if (this.currentState == "right_2") {
				gapH = oneCardW * 0.5;
				baseX = (this.width - (gapH * (len - 1) + oneCardW)) * 0.5;
			}
		}
		let gp = this.localToGlobal(baseX, 0);
		let lp = sender.globalToLocal(gp.x, gp.y);
		cards.forEach((card: CCCard, index: number) => {
			card.select = false;
			card.sending = true;
			let line: number = Math.floor(index / this.warpCount);
			let toX: number = 0;
			toX = lp.x + (index % this.warpCount) * gapH * scale;
			if (ccserver.isCoupleGame && this.currentState == "right_2") {
				toX = lp.x + (index % this.warpCount) * gapH;
			}
			let toY: number = lp.y + (line * CCGlobalGameConfig.CARD_GAP_V * scale);
			//console.log("adjustCards--------->",index,card.pokerId,this.warpCount,gapH,baseX);
			card.animate({ x: toX, y: toY, scaleX: scale, scaleY: scale }, 0, null, 200).call((index: number) => {
				card.sending = false;
				if (card.parent) {
					card.parent.removeChild(card);
				}
				this.addChildAt(card, 0);
				let toX2: number = 0;
				toX2 = baseX + (index % this.warpCount) * gapH * scale;
				if (ccserver.isCoupleGame && this.currentState == "right_2") {
					toX2 = baseX + (index % this.warpCount) * gapH;
				}
				// card.x = baseX + (index % this.warpCount) * gapH * scale;
				card.x = toX2;
				card.y = (line * CCGlobalGameConfig.CARD_GAP_V * scale);

				animated++;
				if (animated == len) {
					this.adjustCardsEnd();
				}
			}, this, [index]);
		});
	}

	private get stageCenterPos(): any {
		if (!this._stageCenterPos) {
			let p = this.globalToLocal(CCalien.CCDDZStageProxy.width / 2 - CCGlobalGameConfig.CARD_WIDTH / 2, CCalien.CCDDZStageProxy.height / 2 - CCGlobalGameConfig.CARD_HEIGHT / 2);
			this._stageCenterPos = { x: p.x, y: p.y };
		}

		return this._stageCenterPos;
	}

	/**
	 * 调整卡牌的坐标
	 */
	adjustCards(animation: boolean = true): void {
		let addCount: number = 0;
		let gapH: number;
		let baseX: number;
		let index: number = 0;
		let count: number = 0;
		let oneCardW = CCGlobalGameConfig.CARD_WIDTH * this.scale;
		gapH = this.getCardGapH(this.cardCount);

		// baseX = (this.width - (gapH * (this.cardCount-1) + oneCardW)) * 0.5;	
		baseX = (this.width - (gapH * this.cardCount + CCGlobalGameConfig.CARD_OFFSET) * this.scale) >> 1;
		if (ccserver.isCoupleGame) {
			if (this.currentState == "left") {
				return;
			} else if (this.currentState == "right_2") {
				gapH = oneCardW * 0.5;
				//从右边对齐
				// baseX = (20 - this.cardCount) * gapH;
				baseX = (this.width - (gapH * (this.cardCount - 1) + oneCardW)) * 0.5;
			}
		}


		CCalien.CCDDZUtils.enumChildren(this, (card: CCCard) => {
			if (card.sending) {
				return;
			}
			count++;
		});
		CCalien.CCDDZUtils.enumChildren(this, (card: CCCard) => {
			if (card.sending) {
				return;
			}
			// let toX: number = baseX + index * gapH;
			let toX = 0;
			toX = baseX + index * gapH * this.scale;
			if (ccserver.isCoupleGame && this.currentState == "right_2") {
				toX = baseX + index * gapH;
			}
			let toY: number = 0;
			if (animation) {//如果有动画
				let tween: egret.Tween;
				if (card.addPlaying) {  //如果是加牌
					CCalien.CCDDZUtils.injectProp(card, { alpha: 0, scaleX: 0.2, scaleY: 0.2 });

					// console.log("adjustCards--------->",this.width,gapH,this.cardCount,oneCardW,this.warpCount,baseX,toX,toY,this.currentState,this.scale);
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
	private destroyCard(card: CCCard): void {
		egret.Tween.get(card).to({ alpha: 0 }, 100).call((card: CCCard) => {
			this.removeChild(card);
			CCCard.recycle(card);
		}, this, [card]);
	}
}