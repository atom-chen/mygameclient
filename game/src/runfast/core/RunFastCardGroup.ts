/**
 * Created by rockyl on 16/3/9.
 *
 * 斗地主-牌组
 */

class RunFastCardGroup extends RunFastBaseCardGroup {
	public interact: boolean = false;

	protected _touchBegin: boolean;
	protected _touchBeginIndex: number;
	protected _selectFrom: number;
	protected _selectTo: number;
	protected _cardsSelect: number[] = [];
	protected _pokerIds: number[] = [];
	protected _isMaster: boolean;

	createChildren(): void {
		super.createChildren();

		this.touchEnabled = false;
		if (this.interact) {
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
			this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
			this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
			alien.StageProxy.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
		}
	}

	private onTouchTap(event: egret.TouchEvent): void {
		/*if (!this._touchMove) {
			this.selectCards([event.target]);
		}*/
	}

	private onTouchBegin(event: egret.TouchEvent): void {
		this._touchBeginIndex = this.getChildIndex(event.target);
		this._touchBegin = true;
		this.rollOverCardIds(this.getChildIndex(event.target), this._touchBeginIndex);
	}

	private onTouchMove(event: egret.TouchEvent): void {
		if (this._touchBegin) {
			this.rollOverCardIds(this.getChildIndex(event.target), this._touchBeginIndex);
		}
	}

	private onTouchEnd(event: egret.TouchEvent): void {
		if (this._touchBegin) {
			let cards = [];
			for (let i = this._selectFrom; i <= this._selectTo; i++) {
				let card: Card = <Card>this.getChildAt(i);
				if (card) {
					card.rollOver = false;
					cards.push(card);
				}
			}
			this.selectCards(cards);
		}

		this._touchBegin = false;
	}

	initData(): void {
		this._cardsSelect.splice(0);
	}

	sendCardsToGroup(receiver: RunFastBaseCardGroup, cards: Card[], updateCount: boolean = true): void {
		super.sendCardsToGroup(receiver, cards, updateCount);

		this._touchBegin = false;
	}

	/**
	 * 智能选择
	 * @param cards
	 */
	selectCards(cards: Card[]): void {
		let arrSelect: number[];
		let pokerIds: number[] = cards.map(card => card.pokerId);
		// console.log("selectCards======11111======>",this._debugCardValues(pokerIds));

		var allselected = true;
		for (var i = 0; i < cards.length; ++i) {
			if (!cards[i].select) {
				allselected = false;
			}
		}

		if (allselected) {
			alien.Utils.enumChildren(this, (card: Card, index: number) => {
				if (pokerIds.indexOf(card.pokerId) >= 0) {
					this.selectCard(card, !card.select);
				}
			});
			this.checkCanUse();
			return;
		}
		var preselectcards: number[] = []; //之前选取的扑克
		let allSelectPids: number[] = [];
		alien.Utils.enumChildren(this, (card: Card, index: number) => {
			if (card.select && allSelectPids.indexOf(card.pokerId) < 0) {
				allSelectPids.push(card.pokerId);
				preselectcards.push(card.pokerId);
			}
		});
		pokerIds.forEach((pid) => {
			if (allSelectPids.indexOf(pid) < 0) {
				allSelectPids.push(pid);
			}
		});
		allSelectPids.sort((a, b) => { return b - a });
		
		if (!this._targetCards || this._targetCards.length == 0) {
			if (allSelectPids.length == 2) {
				let pMax: number = Math.floor(allSelectPids[0] / 10);
				let pMin: number = Math.floor(allSelectPids[1] / 10);
				if (pMax != pMin) {
					let insides: number[] = [];
					alien.Utils.enumChildren(this, (card: Card, index: number) => {
						let p: number = Math.floor(card.pokerId / 10);
						if (p == pMax || p == pMin || card.pokerId < allSelectPids[0] && card.pokerId > allSelectPids[1]) {
							insides.push(card.pokerId);
						}
					});
					arrSelect = RunFastCardsType.CheckShun2(insides);
				}
			} else {
				if (preselectcards.length < 1) {// 只有第一次拖牌调用该函数
					// console.log("getMaxAmountCards---------->", pokerIds);
					arrSelect = RunFastCardsHint.getMaxAmountCards(pokerIds);
				}
			}
		} else {
			if (cards.length == 1) {
				
			} else {  //如果是多张牌,那么就判断顺子
				arrSelect = RunFastCardsType.CheckShun(pokerIds);
			}
		}


		if (arrSelect) {  //如果都没有匹配到方案就做亦或操作
			alien.Utils.enumChildren(this, (card: Card, index: number) => {
				this.selectCard(card, arrSelect.indexOf(card.pokerId) >= 0);
			});
		} else {
			alien.Utils.enumChildren(this, (card: Card, index: number) => {
				if (pokerIds.indexOf(card.pokerId) >= 0) {
					this.selectCard(card, !card.select);
				}
			});
		}
		// console.log("selectCards======22222======>", this._cardsSelect);
		this.checkCanUse();
	}

	selectCard(card: Card, select: boolean): void {
		if (!card.select && select) {
			this._cardsSelect.push(card.pokerId);
		} else if (card.select && !select) {
			let index: number = this._cardsSelect.indexOf(card.pokerId);
			if (index >= 0) {
				this._cardsSelect.splice(index, 1);
			}
		}

		card.select = select;
	}

	/**
	 * 获取已选的牌
	 */
	getSelectedCards(): number[] {
		return this._cardsSelect;
	}

	/**
	 * 重选，就是撤销全部选择
	 */
	cancelSelect(): void {
		alien.Utils.enumChildren(this, (card: Card, index: number) => {
			if (!card.sending) {
				card.select = card.rollOver = false;
			}
		});
		this._cardsSelect.splice(0);
		this.checkCanUse();
		//console.log(this._cardsSelect);
	}

	/**
	 * 根据卡牌的值计算出物理牌上的牌值 例如 10=>3;
	 */
	private _debugCardValues(pokerIds: number[]): number[] {
		let _debugCards = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'k', 'A', '2', 'X', 'D'];
		let _cardIdx = 0;
		let _cardValues = [];
		for (let i = 0; i < pokerIds.length; ++i) {
			if (pokerIds[i] < 100) {
				_cardIdx = parseInt(("" + pokerIds[i]).substr(0, 1));
			}
			else {
				_cardIdx = parseInt(("" + pokerIds[i]).substr(0, 2));
			}
			_cardValues.push(_debugCards[(_cardIdx - 1)]);
		}
		return _cardValues;
	}
	/**
	 * 检查牌型
	 * @param pokerIds
	 */
	private _arrUseHelp: any[];
	private _targetCards: number[];

	checkType(pokerIds: number[]): boolean {
		// let _otherValues = this._debugCardValues(pokerIds);
		// let _selfValues = this._debugCardValues(this._pokerIds);	

		// pokerIds = [40, 41, 42, 43]
		// pokerIds = Utils.transformCards(pokerIds);
		// console.log('checkType------xxxxx111-------->', pokerIds, this._pokerIds);
		this._targetCards = pokerIds;
		let temp = RunFastCardsType.GetCards2(pokerIds, this._pokerIds.concat());
		// console.log("heckType------xxxxx222-------->", temp)
		if (temp) {
			this._arrUseHelp = temp[4];
			// let _arr = this._debugCardValues(this._arrUseHelp);
			// console.log("checkType-->其他玩家出牌", _otherValues, "我的手牌", _selfValues, "帮助", _arr);
			this._helpIndex = 0;
			return true;
		} else {
			//console.log('checkType=>没有匹配的牌型',_otherValues);
			this._arrUseHelp = null;
			return false;
		}
	}

	checkCanUse(force: boolean = false): void {
		// this._cardsSelect = [];//100,101,102,111,112,113,122,121,123,130,140,150];
		// this._targetCards = [130];
		let canUse: boolean = force || RunFastCardsType.CheckType(this._cardsSelect, this._targetCards, this._pokerIds.concat());
		// console.log("checkCanUse==>", force, canUse, this._debugCardValues(this._cardsSelect));
		alien.Dispatcher.dispatch(EventNames.SELECT_CARDS, { canUse, count: this._cardsSelect.length });
	}

	/**
	 * 提示出牌
	 */
	private _helpIndex: number;

	help(): boolean {
		// console.log("help--------------提示出牌");
		let cards: number[];
		if (this._arrUseHelp) {
			if (this._helpIndex >= this._arrUseHelp.length) {
				this._helpIndex = 0;
			}
			// console.log("help------------->", this._arrUseHelp);
			cards = this._arrUseHelp[this._helpIndex];
		}
		this._helpIndex++;

		if (cards) {
			alien.Utils.enumChildren2(this, (card: Card, index: number) => {
				this.selectCard(card, cards.indexOf(card.pokerId) >= 0);
			});

			// alien.Utils.enumChildren(this, (card: Card, index: number) => {
			// 	this.selectCard(card, cards.indexOf(card.pokerId) >= 0);
			// });
			this.checkCanUse(true);//必定能出牌

			return true;
		} else {
			return false;
		}
	}

	/**
	 * 根据索引区间来划选
	 * @param id1
	 * @param id2
	 */
	rollOverCardIds(id1: number, id2: number): void {
		if (id1 < 0 || id2 < 0) {
			return;
		}
		let from: number = this._selectFrom = Math.min(id1, id2);
		let to: number = this._selectTo = Math.max(id1, id2);
		alien.Utils.enumChildren(this, (card: Card, index: number) => {
			card.rollOver = index >= from && index <= to;
		});
	}

	// private clearCards():void{
	// 	this._pokerIds.splice(0);
	// 	alien.Utils.enumChildren(this, (card:Card)=>{
	// 		if(!card.sending){
	// 			this._pokerIds.push(card.pokerId);
	// 		}
	// 	});
	// }
	cleancards(): void {
		super.clean();
	}

	addCards(pokerIds: number[], animation: boolean = true): number {
		let count: number = super.addCards(pokerIds, animation);

		this.updatePokersIds();

		return count;
	}

	/**
	 * 出牌
	 * @param pokerIds
	 * @param receive
	 * @param updateCount
	 */
	useCards(pokerIds: number[], receive: RunFastCardGroup, updateCount: boolean = true): number {
		let cards: Card[] = [];

		// console.log("pokerIds----111------>", pokerIds);
		if (this.scale == 0.24) {
			pokerIds.forEach((pid: number) => {
				let card: Card = Card.create({ pid });
				this.addChild(card);
				alien.Utils.injectProp(card, { x: 0, y: 0, alpha: 1, scaleX: 0.24, scaleY: 0.24 });
				cards.push(card);
			});
		} else {
			// alien.Utils.enumChildren(this, (card: Card, index: number) => {
			// 	if (pokerIds.indexOf(card.pokerId) >= 0) {
			// 		cards.push(card);
			// 	}
			// });

			for (let i = 0; i < pokerIds.length; i++) {
				for (let j = 0; j < this.numChildren; j++) {
					let card = <Card>this.getChildAt(j);
					if (!card) {
						continue;
					}
					if (pokerIds[i] == card.pokerId) {
						cards.push(card);
					}
				}
			}
		}

		this.sendCardsToGroup(receive, cards, updateCount);

		this.updatePokersIds();

		return this.cardCount;
	}

	private updatePokersIds(): void {
		this._pokerIds.splice(0);
		alien.Utils.enumChildren(this, (card: Card) => {
			if (!card.sending) {
				this._pokerIds.push(card.pokerId);
			}
		});
	}

	protected adjustCardsEnd(): void {
		//console.log('adjustCardsEnd');
		super.adjustCardsEnd();

		this.updateMasterFlag();
	}

	set isMaster(value: boolean) {
		if (this._isMaster != value) {
			this._isMaster = value;

			this.updateMasterFlag();
		}
	}

	updateMasterFlag(): void {
		let rightestCard: Card;
		for (let li = this.numChildren - 1, i = li; i >= 0; i--) {
			let card: Card = <Card>this.getChildAt(i);
			if (!card.sending) {
				if (!rightestCard) {
					rightestCard = card;
					rightestCard.showMasterFlag(this._isMaster);
				}
				if (card != rightestCard) {
					card.showMasterFlag(false);
				}
			}
		}
		//console.log('updateMasterFlag');
	}
}