
class CCCardView extends eui.Component {
    private card1: CCCardUI;
    private card2: CCCardUI;
    private card3: CCCardUI;
    private card4: CCCardUI;
    private card5: CCCardUI;
    private card6: CCCardUI;
    private card7: CCCardUI;
    private card8: CCCardUI;
    private card9: CCCardUI;
    private cards: CCCardUI[];

    private lblCardType1: eui.Label;
    private lblCardType2: eui.Label;
    private lblCardType3: eui.Label;
    private lblChange1: eui.Label;
    private lblChange2: eui.Label;
    private lblChange3: eui.Label;
    private lblChangeAll: eui.Label;

    private lblTips: eui.Label;

    private listContainer: eui.Scroller;
    private rewardList: eui.List;
    private _rewardProvider: eui.ArrayCollection;

    //播放动画的interval;
    private _addcardsAniItval: number = 0;

    private timer: any;

    private _cardTypeNames = {
        [6]: "三条",
        [5]: "同花顺",
        [4]: "同花",
        [3]: "顺子",
        [2]: "对子",
        [1]: "单张"
    };

    public constructor() {
        super();
    }

    createChildren(): void {
        super.createChildren();
        this.listContainer.visible = false;
        this.rewardList.dataProvider = this._rewardProvider = new eui.ArrayCollection();
        this.rewardList.itemRenderer = CCDDZIRRewardTypeItem;
    }

    public addCards() {
        this.cards = [];
        this.hideAllLbl();
        for (let i = 0; i < 9; i++) {
            this["card" + (i + 1)].CCDDZCard = 0;
            let card = this["card" + (i + 1)]
            card.visible = false;
            this.cards.push(card);
        }
        // console.log("addCards--------", this.cards);
        this.lblTips.visible = true;
        if (this._addcardsAniItval != 0) return;
        let _cardIndex = 0;
        this._clearAnimationInterval();
        let _func = function () {
            // egret.Tween.get(this.cards[_cardIndex]).wait(500).to({ visible: true });
            // console.log("addCards------11111--", _cardIndex);
            this.cards[_cardIndex].visible = true;
            _cardIndex++;
            if (_cardIndex > 8) {
                // console.log("addCards------22222--");
                // let lbltips = this.lblTips
                // lbltips.alpha = 0;
                // egret.Tween.get(lbltips).to({ visible: true, alpha: 1 }, 500);
                this._clearAnimationInterval();
            }
        }.bind(this);

        this._addcardsAniItval = egret.setInterval(function () {
            _func();
        }, this, 150);
        _func();
    }

    public showCards(cardids: number[], cardTypes: number[] = null, scoreChanges: number[] = null, isGiveUp: boolean = false, msg: any = null, isself: boolean = false) {
        // let cardIds = cardids;
        let round = 0;
        this.hideAllLbl();
        this.showAllCard()
        if (!this.timer) {
            this.timer = egret.setInterval(() => {
                this._playShowCradsAni(round, cardids, cardTypes, scoreChanges, isGiveUp, msg);
                if (isself == true && round > 0 && round < 4) {
                    CCDDZSoundManager.instance.playEffect(CCResNames.cc_showcard);
                }
                round++;
            }, this, 1000);
        }
    }

    public hideAllLbl() {
        this.lblCardType1.visible = false;
        this.lblCardType2.visible = false;
        this.lblCardType3.visible = false;
        this.lblChange1.visible = false;
        this.lblChange1.text = "";
        this.lblChange1.y = 10;
        this.lblChange2.visible = false;
        this.lblChange2.text = "";
        this.lblChange2.y = 56;
        this.lblChange3.visible = false;
        this.lblChange3.text = "";
        this.lblChange3.y = 100;
        this.lblChangeAll.text = ""
        this.lblChangeAll.visible = false;
        this.listContainer.visible = false;
        this.lblTips.visible = false;
    }

    public showAllCard() {
        for (let i = 0; i < 9; i++) {
            this["card" + (i + 1)].CCDDZCard = 0;
            this["card" + (i + 1)].showMasterFlag(false);
            let card = this["card" + (i + 1)]
            card.visible = true;
        }
    }

    private _playShowCradsAni(round: number, cardids: number[], cardTypes: number[] = null, scoreChanges: number[] = null, isGiveUp: boolean = false, msg: any = null) {
        let cardIds = cardids;
        if (round < 4) {
            for (let i = 0; i < 9; i++) {
                let row = Math.floor(i / 3);
                let _type = this["lblCardType" + (row + 1)];
                let _value = this["lblChange" + (row + 1)];
                if (row < round && row + 1 == round) {
                    let _card = this["card" + (i + 1)];
                    _card.scaleX = 0.5;
                    _type.text = this._cardTypeNames[cardTypes[2 - row]];
                    let score = scoreChanges[2 - row];
                    let s: string = CCDDZUtils.currencyRatio(Math.abs(score));
                    _value.text = (score > 0 ? '+' + s : '-' + s);
                    _value.textColor = (score > 0 ? "0x8FFFE9" : "0xFF0000");
                    _type.visible = false;
                    _value.visible = false;
                    this.playCardAni(_card, cardIds[8 - i], _type, _value, isGiveUp);
                    // console.log("showCards----------11-----", round, 8 - i, cardIds[8 - i]);
                }
                else if (row >= round) {
                    this["card" + (i + 1)].CCDDZCard = 0;
                    let _card = this["card" + (i + 1)]
                    _card.scaleX = 0.5;
                    _type.text = "";
                    _value.text = "";
                    _type.visible = false;
                    _value.visible = false;
                    // console.log("showCards----------33-----", round, 8 - i);
                }
                else {
                    this["card" + (i + 1)].CCDDZCard = cardIds[8 - i];
                    this["card" + (i + 1)].showMasterFlag(isGiveUp);
                    let _card = this["card" + (i + 1)];
                    _card.scaleX = 0.5;
                    _type.text = this._cardTypeNames[cardTypes[2 - row]];
                    let score = scoreChanges[2 - row];
                    let s: string = CCDDZUtils.currencyRatio(Math.abs(score));
                    _value.text = (score > 0 ? '+' + s : '-' + s);
                    _value.textColor = (score > 0 ? "0x8FFFE9" : "0xFF0000");
                    _type.visible = true;
                    _value.visible = true;
                    // console.log("showCards----------22-----", round, 8 - i, cardIds[8 - i]);
                }
            }
        }
        else {
            this.lblChangeAll.visible = false;
            for (let i = 0; i < 3; i++) {
                let _type = this["lblCardType" + (i + 1)];
                let _value = this["lblChange" + (i + 1)];
                this.playAddScoreAni(_type, _value);
            }
            this._stopShowCradsAni(msg);
        }
    }

    //清除播放动画的interval
    private _clearAnimationInterval(): void {
        if (this._addcardsAniItval != 0) {
            egret.clearInterval(this._addcardsAniItval);
        }
        this._addcardsAniItval = 0;
    }

    private _stopShowCradsAni(msg: any = null): void {
        if (this.timer) {
            egret.clearInterval(this.timer);
            CCalien.CCDDZDispatcher.dispatch(CCEventNames.CC_SHOW_HAPPY_SCORE, msg);
        }
        this.timer = null;
    }

    public clearAllTimer() {
        this._clearAnimationInterval();
        this._stopShowCradsAni();
    }

    private playCardAni(card: CCCardUI, cardId: number, type: eui.Label, value: eui.Label, isGiveUp: boolean): void {
        // console.log("playCardAni--11---", cardId);
        egret.Tween.removeTweens(card);
        card.scaleX = 0.5;
        card.visible = true;
        egret.Tween.get(card).wait(500).to({ scaleX: 0.01 }, 200).call(() => {
            // console.log("playCardAni--22---", cardId);            
            card.CCDDZCard = cardId;
            card.showMasterFlag(isGiveUp);
        }).to({ scaleX: 0.5 }, 200).call(() => {
            type.visible = true;
            value.visible = true;
        });
    }

    private playAddScoreAni(type: eui.Label, value: eui.Label): void {
        egret.Tween.removeTweens(value);
        egret.Tween.get(value).to({ y: 146 }, 500)
            .to({ visible: false }).call(() => {
                this.lblChangeAll.visible = true;
                let score1 = Number(this.lblChange1.text);
                let score2 = Number(this.lblChange2.text);
                let score3 = Number(this.lblChange3.text);
                let score = score1 + score2 + score3;
                let s: string = CCDDZUtils.currencyRatio(Math.abs(score));
                this.lblChangeAll.text = (score > 0 ? '+' + s : '-' + s);
                this.lblChangeAll.textColor = (score > 0 ? 0x8FFFE9 : 0xFF0000);
                egret.Tween.get(this.lblChangeAll).to({ scaleX: 1.2, scaleY: 1.2 }, 300)
            })
    }

    // 刷新喜牌类型用
    public refreshRewardTypeData(data, showType: boolean = true, isGiveUp: boolean = false) {
        console.log("refreshRewardTypeData-------->", data, showType);
        if (showType == true) {
            let _rewardData = [];
            this._rewardProvider.source = _rewardData;
            let _data = data;
            if (_data) {
                if (_data.length > 0) {
                    this.lblCardType1.visible = false;
                    this.lblCardType2.visible = false;
                    this.lblCardType3.visible = false;
                }
                for (let i = 0; i < _data.length; i++) {
                    let item = {};
                    item["type"] = _data[i];
                    _rewardData.push(item);
                }
                this._rewardProvider.source = _rewardData;
                if (CCGameConfig.playersNum - CCGameConfig.giveupPlayersNum - 1 > 0)
                    this.listContainer.visible = true;
                else {
                    this.listContainer.visible = false;
                }
                this.listContainer.scaleY = 0;
                egret.Tween.get(this.listContainer).to({ scaleY: 1 }, _rewardData.length * 200);
            }
        }
        let round = 0;
        let maxRound = data.length;
        if (maxRound > 0) {
            let happyTimer = egret.setInterval(() => {
                this.playAddHappyScoreAni(this.lblChange1, showType, isGiveUp);
                round++;
                if (round >= maxRound) {
                    if (happyTimer) {
                        egret.clearInterval(happyTimer);
                    }
                    happyTimer = null;
                    if (showType) {
                        CCalien.CCDDZDispatcher.dispatch(CCEventNames.CC_SHOW_NEXT_HAPPY_SCORE);
                    }
                }
            }, this, 500);
        }
        else {
            if (showType) {
                CCalien.CCDDZDispatcher.dispatch(CCEventNames.CC_SHOW_NEXT_HAPPY_SCORE);
            }
        }
    }

    private playAddHappyScoreAni(value: eui.Label, isAdd: boolean = true, isGiveUp: boolean = false): void {
        egret.Tween.removeTweens(value);
        let score = CCGameConfig.playersNum - CCGameConfig.giveupPlayersNum - 1;
        console.log("playAddHappyScoreAni---------->", isAdd, isGiveUp, score)
        value.y = 10;
        if (isGiveUp == true || score <= 0) {
            value.visible = false;
            return;
        }
        value.visible = true;
        score = (isAdd ? (score * (CCGameConfig.playersNum - CCGameConfig.giveupPlayersNum - 1)) : (score))
        let s: string = CCDDZUtils.currencyRatio(Math.abs(score));
        value.text = (isAdd ? '+' + s : '-' + s);
        value.textColor = (isAdd ? 0x8FFFE9 : 0xFF0000);
        egret.Tween.get(value).to({ y: 146 }, 300)
            .to({ visible: false }).call(() => {
                this.lblChangeAll.visible = true;
                let score1 = Number(this.lblChange1.text);
                let score2 = Number(this.lblChangeAll.text);
                let score = score1 + score2;
                let s: string = CCDDZUtils.currencyRatio(Math.abs(score));
                this.lblChangeAll.text = (score > 0 ? '+' + s : '-' + s);
                this.lblChangeAll.textColor = (score > 0 ? 0x8FFFE9 : 0xFF0000);
                egret.Tween.get(this.lblChangeAll).to({ scaleX: 1.2, scaleY: 1.2 }, 200)
            })

    }
}

window["CCCardView"] = CCCardView;

class CCDDZIRRewardTypeItem extends eui.ItemRenderer {

    private lblType: eui.Label;

    private _happyTypeNames = {
        [11]: "三清",
        [10]: "全黑",
        [9]: "全红",
        [8]: "三顺清",
        [7]: "双顺清",
        [6]: "双三条",
        [5]: "全三条",
        [4]: "四个头",
        [3]: "连顺",
        [2]: "清连顺",
        [1]: "通关",
    };

    protected dataChanged(): void {
        super.dataChanged();
        let data = this.data;
        this.lblType.text = this._happyTypeNames[Number(data.type)];
    }
}

window["CCDDZIRRewardTypeItem"] = CCDDZIRRewardTypeItem;