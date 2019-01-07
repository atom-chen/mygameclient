/**
 * Created by rockyl on 16/3/9.
 *
 * 三条-牌组
 */

class CCCardGroup extends CCCardGroupBase {
	public interact: boolean = false;

	protected _touchBegin: boolean;
	protected _touchBeginIndex: number;
	protected _selectFrom: number;
	protected _selectTo: number;
	protected _cardsSelect: number[] = [];
	protected _pokerIds: number[] = [];
	protected _isMaster: boolean;
	private _grayNum: number = 0;

	createChildren(): void {
		super.createChildren();

		this.touchEnabled = false;
		// if (this.interact) {
		// 	this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
		// 	this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		// 	this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
		// 	CCalien.CCDDZStageProxy.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
		// }
	}

	initListeners(beable) {
		let func = "addEventListener";
		if (!beable) {
			func = "removeEventListener";
		}
		this[func](egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
		this[func](egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		this[func](egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
		CCalien.CCDDZStageProxy.stage[func](egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
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
				if (this.numChildren < i) continue;
				let card: CCCard = <CCCard>this.getChildAt(i);
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
		this._grayNum = 0;
		this._cardsSelect.splice(0);
	}

	/**
	 * 设置让几张牌
	 */
	setGrayCardsNum(grayNum: number): void {
		if (!ccserver.isCoupleGame)
			return;
		this._grayNum = grayNum || 0;
		if (this.currentState == "my") {
			this.updateMyGrayCards();
		} else {
			this.updateOtherGrayCards();
		}
	}

	/**
	 * 更新其他玩家手牌中让的牌
	 */
	updateOtherGrayCards(): void {
		let bGray: boolean;
		let container = this;
		let card: CCCard;
		let childLen = this.numChildren;
		let startIdx = childLen - this._grayNum;
		for (let i = 0; i < childLen; ++i) {
			card = <CCCard>container.getChildAt(i);
			if (i >= startIdx && this._isMaster == false) {
				bGray = true;
			} else {
				bGray = false;
			}
			card.showGrayBg(bGray);
		}
	}

	/**
	 * 二人斗地主让牌 更新我被让的牌
	 */
	updateMyGrayCards(): void {
		let bGray: boolean;
		let container = this;
		let card: CCCard;
		let childLen = this.numChildren;
		let len = this._pokerIds.length;
		let grayPokers = this._pokerIds.slice(len - this._grayNum);
		for (let i = 0; i < childLen; ++i) {
			card = <CCCard>container.getChildAt(i);
			if (!card) break;
			card.showGrayBg(false);
			for (let j = 0; j < grayPokers.length; j++) {
				if (card.pokerId == grayPokers[j]) {
					card.showGrayBg(true);
					grayPokers.splice(j, 1);
					break;
				}
			}
		}
	}

	/**
	 * 智能选择
	 * @param cards
	 */
	selectCards(cards: CCCard[]): void {
		let arrSelect: number[];
		let pokerIds: number[] = cards.map(card => card.pokerId);
		//console.log("selectCards============>",this._debugCardValues(pokerIds));

		var allselected = true;
		for (var i = 0; i < cards.length; ++i) {
			if (!cards[i].select) {
				allselected = false;
			}
		}

		if (allselected) {
			CCalien.CCDDZUtils.enumChildren(this, (card: CCCard, index: number) => {
				if (pokerIds.indexOf(card.pokerId) >= 0) {
					this.selectCard(card, !card.select);
				}
			});
			this.checkCanUse();
			return;
		}
		var preselectcards: number[] = []; //之前选取的扑克
		let allSelectPids: number[] = [];
		CCalien.CCDDZUtils.enumChildren(this, (card: CCCard, index: number) => {
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
					CCalien.CCDDZUtils.enumChildren(this, (card: CCCard, index: number) => {
						let p: number = Math.floor(card.pokerId / 10);
						if (p == pMax || p == pMin || card.pokerId < allSelectPids[0] && card.pokerId > allSelectPids[1]) {
							insides.push(card.pokerId);
						}
					});
					arrSelect = CCDDZCardsType.CheckShun2(insides);
				}
			} else {
				if (preselectcards.length < 1) {// 只有第一次拖牌调用该函数
					arrSelect = CCDDZCardsHint.getMaxAmountCards(pokerIds);
				}
			}
		} else {
			if (cards.length == 1) {

			} else {  //如果是多张牌,那么就判断顺子
				arrSelect = CCDDZCardsType.CheckShun(pokerIds);
			}
		}


		if (arrSelect) {  //如果都没有匹配到方案就做亦或操作
			CCalien.CCDDZUtils.enumChildren(this, (card: CCCard, index: number) => {
				this.selectCard(card, arrSelect.indexOf(card.pokerId) >= 0);
			});
		} else {
			CCalien.CCDDZUtils.enumChildren(this, (card: CCCard, index: number) => {
				if (pokerIds.indexOf(card.pokerId) >= 0) {
					this.selectCard(card, !card.select);
				}
			});
		}
		//console.log(this._cardsSelect);
		this.checkCanUse();
	}

	selectCard(card: CCCard, select: boolean): void {
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
	 * 获取自己的牌
	 */
	getPorkersId(): number[] {
		return this._pokerIds;
	}

	setPokersId(ids: number[]) {
		if (!ids) return;
		this._pokerIds = ids;
	}

	/**
	 * 清除自己pokersid
	 */
	cleanPokersId(): void {
		this._pokerIds = [];
	}

	/**
	 * 重选，就是撤销全部选择
	 */
	cancelSelect(): void {
		CCalien.CCDDZUtils.enumChildren(this, (card: CCCard, index: number) => {
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
		//console.log('checkType', pokerIds);
		//let _otherValues = this._debugCardValues(pokerIds);
		//let _selfValues = this._debugCardValues(this._pokerIds);

		this._targetCards = pokerIds;
		let temp = CCDDZCardsType.GetCards2(pokerIds, this._pokerIds.concat());
		if (temp) {
			this._arrUseHelp = temp[4];
			//let _arr =  this._debugCardValues(this._arrUseHelp);
			//console.log("checkType-->其他玩家出牌",_otherValues,"我的手牌", _selfValues,"帮助", _arr);
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
		let canUse: boolean = force || CCDDZCardsType.CheckType(this._cardsSelect, this._targetCards);
		//console.log("checkCanUse==>",canUse,this._debugCardValues(this._cardsSelect));
		CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.SELECT_CARDS, { canUse, count: this._cardsSelect.length });
	}

	/**
	 * 提示出牌
	 */
	private _helpIndex: number;

	help(): boolean {
		let cards: number[];
		if (this._arrUseHelp) {
			if (this._helpIndex >= this._arrUseHelp.length) {
				this._helpIndex = 0;
			}
			cards = this._arrUseHelp[this._helpIndex];
		}
		this._helpIndex++;

		if (cards) {
			CCalien.CCDDZUtils.enumChildren(this, (card: CCCard, index: number) => {
				this.selectCard(card, cards.indexOf(card.pokerId) >= 0);
			});
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
		//if(this._selectTo >= this.numChildren && this.numChildren >= 1){
		//	this._selectTo = this.numChildren - 1;
		//}
		//console.log("rollOverCardIds==========>",id1,id2,this.numChildren);
		CCalien.CCDDZUtils.enumChildren(this, (card: CCCard, index: number) => {
			card.rollOver = index >= from && index <= to;
		});
	}

	cleancards(): void {
		super.clean();
		this._grayNum = 0;
	}

	addCards(pokerIds: number[], animation: boolean = true, showorder: boolean = false): number {
		let count: number = super.addCards(pokerIds, animation, showorder);

		this.updatePokersIds();
		return count;
	}

	/**
	 * 出牌
	 * @param pokerIds
	 * @param receive
	 * @param updateCount
	 */
	useCards(pokerIds: number[], receive: CCCardGroup, updateCount: boolean = true, isReconnect: boolean = false): number {
		let cards: CCCard[] = [];
		if (this.currentState != "my") {
			if (this.currentState == "right_2") {
				pokerIds.forEach((pid: number, idx: number) => {
					let card: CCCard = CCCard.create({ pid });
					this.addChild(card);
					card.sending = true;
					let card1: CCCard = <CCCard>this.getChildAt(idx);
					let x = 0;
					let y = 0;
					if (card1) {
						x = card1.x;
						y = card1.y;
					}
					CCalien.CCDDZUtils.injectProp(card, { x: x, y: y, alpha: 1, scaleX: 0.24, scaleY: 0.24 });
					cards.push(card);
				});
			} else {
				pokerIds.forEach((pid: number) => {
					let card: CCCard = CCCard.create({ pid });
					this.addChild(card);
					card.sending = true;
					CCalien.CCDDZUtils.injectProp(card, { x: 0, y: 0, alpha: 1, scaleX: 0.24, scaleY: 0.24 });
					cards.push(card);
				});
			}
		} else {
			if (isReconnect) {
				pokerIds.forEach((pid: number, idx: number) => {
					let card: CCCard = CCCard.create({ pid });
					this.addChild(card);
					card.sending = true;
					CCalien.CCDDZUtils.injectProp(card, { x: 0, y: 0, alpha: 1, scaleX: 0.24, scaleY: 0.24 });
					cards.push(card);
				});
			} else {
				CCalien.CCDDZUtils.enumChildren(this, (card: CCCard, index: number) => {
					if (pokerIds.indexOf(card.pokerId) >= 0) {
						card.sending = true;
						cards.push(card);
					}
				});
			}
		}

		//console.log("useCards==2=========>",cards,this.currentState);

		this.removeHandCardsToDeskCardsGrp(receive, cards, updateCount, isReconnect);

		this._touchBegin = false;

		this.updatePokersIds();

		this.addPokersIdsToDeskCardsGrp(receive, cards, pokerIds)

		return this.cardCount;
	}

	private updatePokersIds(): void {
		this._pokerIds.splice(0);
		CCalien.CCDDZUtils.enumChildren(this, (card: CCCard) => {
			if (!card.sending) {
				this._pokerIds.push(card.pokerId);
			}
		});
	}

	//更新grp的pokersid
	addPokersIdsToDeskCardsGrp(receiver: CCCardGroup, cards: CCCard[], pokerIds: number[]) {
		CCalien.CCDDZUtils.enumChildren(this, (card: CCCard) => {
			if (card.sending && pokerIds.indexOf(card.pokerId) >= 0) {
				receiver._pokerIds.push(card.pokerId);
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
		let rightestCard: CCCard;
		for (let li = this.numChildren - 1, i = li; i >= 0; i--) {
			let card: CCCard = <CCCard>this.getChildAt(i);
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
	}

	sortPokersIdByType(type): void {
		if (type == SORT_TYPE_VALUE) {
			this._pokerIds.sort((a, b) => {
				return b - a;
			})
		}
		else {
			this._pokerIds.sort((a, b) => {
				if (a == 140 || b == 140 || a == 150 || b == 150) {
					return b - a;
				}
				else if (a % 10 != b % 10) {
					return b % 10 - a % 10;
				}
				else if (Math.floor(a / 10) != Math.floor(b / 10)) {
					return Math.floor(b / 10) - Math.floor(a / 10);
				}
				return b - a;
			})
		}
		console.log("sortPokersIdByType-------", this._pokerIds);
		this.sortPokers();
	}

	sortPokers() {
		// this.clean();
		// this.addCards(this._pokerIds);
		let count: number = super.sortCards(this._pokerIds);
		this.updatePokersIds();
	}

	checkCanUseType() {
		console.log("checkCanUseType---------this._pokerIds-----", this._pokerIds);
		let canUseThree = CCCardsType.checkThree(this._pokerIds);
		let canUseStrFlush = CCCardsType.checkStrFlush(this._pokerIds);
		let canUseFlush = CCCardsType.checkFlush(this._pokerIds);
		return { canUseFlush: canUseFlush, canUseStrFlush: canUseStrFlush, canUseThree: canUseThree };
	}
}
window["CCCardGroup"] = CCCardGroup;