/**
 *
 * @author 
 *
 */
let SORT_TYPE_VALUE = 0;
let SORT_TYPE_COLOR = 1;

class CCChooseCard extends eui.Component {

    private grpDesk: eui.Group;
    private firGrp: eui.Group;
    protected firGrpDeskCards: CCCardGroup;
    private secGrp: eui.Group;
    protected secGrpDeskCards: CCCardGroup;
    private thrGrp: eui.Group;
    protected thrGrpDeskCards: CCCardGroup;
    protected handCardGroup: CCCardGroup;

    private resetBtn: eui.Group;
    private imgReset: eui.Image;
    private lblReset: eui.Label;

    private comparisonBtn: eui.Group;
    private imgComparison: eui.Image;
    private lblComparison: eui.Label;

    private helpBtn: eui.Group;
    private imgHelp: eui.Image;
    private lblHelp: eui.Label;

    private giveupBtn: eui.Group;

    //系统发的10张牌
    private _cardids: number[];
    //系统推荐的最优牌
    private _cardids2: number[];

    private _canChooseData;
    private _firMaxiData;
    private _bestData;
    private _canUseBestData: boolean = false;
    private _choosedIndex: number = 0;
    private _isChoosed: boolean = false;
    private _isClickConfirm: boolean = false;
    private static _isSending: boolean = false;
    private static _selfSelected: boolean = false;

    private _cardTypeNames = {
        [6]: "三条",
        [5]: "同花顺",
        [4]: "同花",
        [3]: "顺子",
        [2]: "对子",
        [1]: "单张",
        [0]: "未知"
    };

    public constructor() {
        super();
    }

    protected createChildren(): void {
        super.createChildren();

        this.resetBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnTap, this);
        this.comparisonBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnTap, this);
        this.helpBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnTap, this);

        this.firGrp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGrpDeskTap, this)
        this.secGrp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGrpDeskTap, this)
        this.thrGrp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGrpDeskTap, this)

        this.grpDesk.visible = false;

        this.refreshBtnStatus();
    }

    private onBtnTap(event: egret.TouchEvent): void {
        let data: any = {};
        let action: string = event.target.name;
        data.action = action;
        console.log("onBtnTap---------->", action);
        switch (action) {
            case "resetBtn":
                this.resetSelected();
                this.refreshBtnStatus();
                CCChooseCard._isSending = false;
                this._isChoosed = false;
                this._choosedIndex = 0;
                break;
            case "comparisonBtn":
                this.startComparison();
                break;
            case "helpBtn":
                this.sendHelpCards();
                break;
        }
    }

    private onGrpDeskTap(event: egret.TouchEvent): void {
        let action: string = event.target.name;
        console.log("onGrpDeskTap----------->", action);
        console.log("selected pokers id", this.handCardGroup.getSelectedCards())

        CCChooseCard._isSending = false;
        this._choosedIndex = 0;
        if (CCChooseCard._selfSelected == true) return;
        CCChooseCard._selfSelected = true
        egret.setTimeout(() => {
            CCChooseCard._selfSelected = false;
        }, this, 200);
        switch (action) {
            case "firGrp":
                if (this.handCardGroup.getSelectedCards().length < 4 && this.firGrpDeskCards.getPorkersId().length == 3) {
                    CCDDZSoundManager.instance.playEffect(CCResNames.cc_snd_throw);
                    this.handCardGroup.addCards(this.firGrpDeskCards.getPorkersId())
                    this.firGrpDeskCards.cleanPokersId();
                    this.firGrpDeskCards.clean();
                }
                else if (this.handCardGroup.getSelectedCards().length == 3 && this.firGrpDeskCards.getPorkersId().length == 0) {
                    CCDDZSoundManager.instance.playEffect(CCResNames.cc_snd_throw);
                    this.handCardGroup.useCards(this.handCardGroup.getSelectedCards(), this.firGrpDeskCards);
                    this.handCardGroup.cancelSelect();
                }
                else {
                    this.handCardGroup.cancelSelect();
                }
                break;
            case "secGrp":
                if (this.handCardGroup.getSelectedCards().length < 3 && this.secGrpDeskCards.getPorkersId().length == 3) {
                    CCDDZSoundManager.instance.playEffect(CCResNames.cc_snd_throw);
                    this.handCardGroup.addCards(this.secGrpDeskCards.getPorkersId())
                    this.secGrpDeskCards.cleanPokersId();
                    this.secGrpDeskCards.clean();
                }
                else if (this.handCardGroup.getSelectedCards().length == 3 && this.secGrpDeskCards.getPorkersId().length == 0) {
                    CCDDZSoundManager.instance.playEffect(CCResNames.cc_snd_throw);
                    this.handCardGroup.useCards(this.handCardGroup.getSelectedCards(), this.secGrpDeskCards);
                    this.handCardGroup.cancelSelect();
                }
                else {
                    this.handCardGroup.cancelSelect();
                }
                break;
            case "thrGrp":
                if (this.handCardGroup.getSelectedCards().length < 3 && this.thrGrpDeskCards.getPorkersId().length == 3) {
                    CCDDZSoundManager.instance.playEffect(CCResNames.cc_snd_throw);
                    this.handCardGroup.addCards(this.thrGrpDeskCards.getPorkersId())
                    this.thrGrpDeskCards.cleanPokersId();
                    this.thrGrpDeskCards.clean();
                }
                else if (this.handCardGroup.getSelectedCards().length == 3 && this.thrGrpDeskCards.getPorkersId().length == 0) {
                    CCDDZSoundManager.instance.playEffect(CCResNames.cc_snd_throw);
                    this.handCardGroup.useCards(this.handCardGroup.getSelectedCards(), this.thrGrpDeskCards);
                    this.handCardGroup.cancelSelect();
                }
                else {
                    this.handCardGroup.cancelSelect();
                }
                break;
        }

        this.refreshBtnStatus();
    }

    private refreshBtnStatus() {
        console.log("refreshBtnStatus--------->", this.firGrpDeskCards.getPorkersId(), this.secGrpDeskCards.getPorkersId(), this.thrGrpDeskCards.getPorkersId())
        this._isChoosed = true;
        if (this.firGrpDeskCards.getPorkersId().length == 3 && this.secGrpDeskCards.getPorkersId().length == 3 && this.thrGrpDeskCards.getPorkersId().length == 3) {
            this.imgComparison.source = "cc_play_btn_yellow"
            this.comparisonBtn.touchEnabled = true;
        }
        else {
            this.imgComparison.source = "cc_play_btn_gray"
            this.comparisonBtn.touchEnabled = false;
            if (this.firGrpDeskCards.getPorkersId().length == 0 && this.secGrpDeskCards.getPorkersId().length == 0 && this.thrGrpDeskCards.getPorkersId().length == 0) {
                this._isChoosed = false;
            }
        }
    }

    private checkCanUseType(_cardsids) {
        // console.log("checkCanUseType---------this._pokerIds-----", _cardsids);
        let canUseThree = CCCardsType.checkThree(_cardsids);
        let canUseStrFlush = CCCardsType.checkStrFlush(_cardsids);
        let canUseFlush = CCCardsType.checkFlush(_cardsids);
        let canUseStright = CCCardsType.checkStraight(_cardsids);
        let canUseDouble = CCCardsType.checkDouble(_cardsids);
        let canUseSingle = CCCardsType.checkSingle(_cardsids);
        return { canUseThree: canUseThree, canUseStrFlush: canUseStrFlush, canUseFlush: canUseFlush, canUseStright: canUseStright, canUseDouble: canUseDouble, canUseSingle: canUseSingle };
    }

    private getChooseCard(canusetype, cardis) {
        if (canusetype.canUseThree) {
            return CCCardsType.getThree(cardis);
        }
        else if (canusetype.canUseStrFlush) {
            return CCCardsType.getStrFlush(cardis);
        }
        else if (canusetype.canUseFlush) {
            return CCCardsType.getFlush(cardis);
        }
        else if (canusetype.canUseStright) {
            return CCCardsType.getStraight(cardis);
        }
        else if (canusetype.canUseDouble) {
            return CCCardsType.getDouble(cardis);
        }
        else if (canusetype.canUseSingle) {
            return CCCardsType.getSingle(cardis);
        }
    }

    private resetSelected() {
        this.handCardGroup.addCards(this.firGrpDeskCards.getPorkersId())
        this.firGrpDeskCards.cleanPokersId();
        this.firGrpDeskCards.clean();

        this.handCardGroup.addCards(this.secGrpDeskCards.getPorkersId())
        this.secGrpDeskCards.cleanPokersId();
        this.secGrpDeskCards.clean();

        this.handCardGroup.addCards(this.thrGrpDeskCards.getPorkersId())
        this.thrGrpDeskCards.cleanPokersId();
        this.thrGrpDeskCards.clean();
    }

    private startComparison() {
        if (this.comparisonBtn.touchEnabled == false) return;
        let cards1 = this.thrGrpDeskCards.getPorkersId();
        let cards2 = this.secGrpDeskCards.getPorkersId();
        let cards3 = this.firGrpDeskCards.getPorkersId();

        let cardsData = [
            { cardids: cards1, cardsType: CCCardsType.checkType(cards1) },
            { cardids: cards2, cardsType: CCCardsType.checkType(cards2) },
            { cardids: cards3, cardsType: CCCardsType.checkType(cards3) }
        ]

        let tmpCardsData = cardsData;

        let sortedData = tmpCardsData.sort((a, b) => {
            // if (a.cardsType.ct == b.cardsType.ct) {
            //     if (a.cardsType.kv == b.cardsType.kv) {
            //         if (a.cardsType.kv2 == b.cardsType.kv2) {
            //             return b.cardsType.kv3 - a.cardsType.kv3;
            //         }
            //         return b.cardsType.kv2 - a.cardsType.kv2;
            //     }
            //     return b.cardsType.kv - a.cardsType.kv;
            // }
            return b.cardsType.ct - a.cardsType.ct;
        });

        console.log("startComparison----sortedData-11--->", sortedData[0].cardsType, sortedData[1].cardsType, sortedData[2].cardsType)


        for (let i = 0; i < sortedData.length - 1; i++) {
            let _data1 = sortedData[i];
            let _data2 = sortedData[i + 1];
            let _card1_1 = Math.floor(_data1.cardsType.kv / 10);
            let _card2_1 = Math.floor(_data1.cardsType.kv2 / 10);
            let _card3_1 = Math.floor(_data1.cardsType.kv3 / 10);

            let _card1_2 = Math.floor(_data2.cardsType.kv / 10);
            let _card2_2 = Math.floor(_data2.cardsType.kv2 / 10);
            let _card3_2 = Math.floor(_data2.cardsType.kv3 / 10);
            console.log("startComparison----sortedData-22--->", i, _data1.cardsType.ct, _card1_1, _card2_1, _card3_1, _data2.cardsType.ct, _card1_2, _card2_2, _card3_2)
            if (_data1.cardsType.ct == _data2.cardsType.ct) {
                if (_card1_1 == _card1_2 && _card2_1 == _card2_2 && _card3_1 == _card3_2) {
                    if (_data1.cardsType.kv == _data2.cardsType.kv) {
                        if (_data1.cardsType.kv2 == _data2.cardsType.kv2) {
                            if (_data1.cardsType.kv3 == _data2.cardsType.kv3) {

                            }
                            else if (_data1.cardsType.kv3 < _data2.cardsType.kv3) {
                                let tmpData = _data1;
                                _data1 = _data2;
                                _data2 = tmpData;
                                console.log("swap----111-----", _data1, _data2);
                            }
                            else {

                            }
                        }
                        else if (_data1.cardsType.kv2 < _data2.cardsType.kv2) {
                            let tmpData = _data1;
                            _data1 = _data2;
                            _data2 = tmpData;
                            console.log("swap----222-----", _data1, _data2);
                        }
                        else {

                        }
                    }
                    else if (_data1.cardsType.kv < _data2.cardsType.kv) {
                        let tmpData = _data1;
                        _data1 = _data2;
                        _data2 = tmpData;
                        console.log("swap----333-----", _data1, _data2);
                    }
                    else {

                    }
                }
                else {
                    if (_card1_1 == _card1_2) {
                        if (_data1.cardsType.kv == _data2.cardsType.kv) {
                            if (_card2_1 == _card2_2) {
                                if (_data1.cardsType.kv2 == _data2.cardsType.kv2) {
                                    if (_card3_1 == _card3_2) {
                                        if (_data1.cardsType.kv3 == _data2.cardsType.kv3) {
                                        }
                                        else if (_data1.cardsType.kv3 < _data2.cardsType.kv3) {
                                            let tmpData = _data1;
                                            _data1 = _data2;
                                            _data2 = tmpData;
                                            console.log("swap----444-----", _data1, _data2);
                                        }
                                        else {

                                        }
                                    }
                                    else if (_card3_1 < _card3_2) {
                                        let tmpData = _data1;
                                        _data1 = _data2;
                                        _data2 = tmpData;
                                        console.log("swap----555-----", _data1, _data2);
                                    }
                                    else {

                                    }
                                }
                                else if (_data1.cardsType.kv2 < _data2.cardsType.kv2) {
                                    let tmpData = _data1;
                                    _data1 = _data2;
                                    _data2 = tmpData;
                                    console.log("swap----666-----", _data1, _data2);
                                }
                                else {

                                }
                            }
                            else if (_card2_1 < _card2_2) {
                                let tmpData = _data1;
                                _data1 = _data2;
                                _data2 = tmpData;
                                console.log("swap----777-----", _data1, _data2);
                            }
                            else {

                            }
                        }
                        else if (_data1.cardsType.kv < _data2.cardsType.kv) {
                            let tmpData = _data1;
                            _data1 = _data2;
                            _data2 = tmpData;
                            console.log("swap----888-----", _data1, _data2);
                        }
                        else {

                        }
                    }
                    else if (_card1_1 < _card1_2) {
                        let tmpData = _data1;
                        _data1 = _data2;
                        _data2 = tmpData;
                        console.log("swap----999-----", _data1, _data2);
                    }
                    else {

                    }
                }
            }
            sortedData[i] = _data1;
            sortedData[i + 1] = _data2;
        }

        let hasSorted = false;
        if (this.arraysEqual(sortedData[0].cardids, cards1) == false
            || this.arraysEqual(sortedData[1].cardids, cards2) == false
            || this.arraysEqual(sortedData[2].cardids, cards3) == false) {
            hasSorted = true;
        }
        console.log("startComparison-----111----->", this._choosedIndex, hasSorted, sortedData[0].cardids, sortedData[1].cardids, sortedData[2].cardids)

        if (this._choosedIndex != 0) {
            if (hasSorted == true) {
                hasSorted = false;
                sortedData[0].cardids = cards1;
                sortedData[1].cardids = cards2;
                sortedData[2].cardids = cards3;
                console.log("startComparison-----222----->", hasSorted, sortedData[0].cardids, sortedData[1].cardids, sortedData[2].cardids)
            }
        }

        let data = {
            cardsid: sortedData[0].cardids.concat(sortedData[1].cardids, sortedData[2].cardids),
            hassorted: hasSorted
        };
        this.cleanAllCardGrps();
        this._isClickConfirm = true;
        CCalien.CCDDZDispatcher.dispatch(CCEventNames.STRART_COMPARISON, data);
    }

    private arraysEqual(a, b) {
        // console.log("arraysEqual--11-->", a, b);
        if (a === b) return true;
        // console.log("arraysEqual--22-->", a, b);
        if (a == null || b == null) return false;
        // console.log("arraysEqual--33-->", a, b);
        if (a.length != b.length) return false;

        let tmpArrA = [].concat(a);
        let tmpArrB = [].concat(b);
        tmpArrA.sort((a, b) => {
            return b - a;
        })

        tmpArrB.sort((a, b) => {
            return b - a;
        })

        for (var i = 0; i < tmpArrA.length; ++i) {
            if (tmpArrA[i] !== tmpArrB[i]) {
                // console.log("arraysEqual--44-->", a, b);
                return false;
            }
        }
        // console.log("arraysEqual--55-->", a, b);
        return true;
    }

    private sendHelpCards(): void {
        // console.log("sendHelpCards----11---->", CCChooseCard._isSending);
        if (CCChooseCard._isSending || this._isClickConfirm) return;
        // console.log("sendHelpCards----22---->", CCChooseCard._isSending);
        let delaytime = 300;
        if (this._isChoosed == false) {
            delaytime = 50;
            this._isChoosed = true;
        }
        this._choosedIndex = 1;
        CCChooseCard._isSending = true;
        this.resetSelected();
        egret.setTimeout(() => {
            if (this._cardids2 && this._cardids2.length == 9) {
                let thrCards = [this._cardids2[0], this._cardids2[1], this._cardids2[2]];
                let secCards = [this._cardids2[3], this._cardids2[4], this._cardids2[5]];
                let firCards = [this._cardids2[6], this._cardids2[7], this._cardids2[8]];

                let cardsData = [
                    { cardids: thrCards, cardsType: CCCardsType.checkType(thrCards) },
                    { cardids: secCards, cardsType: CCCardsType.checkType(secCards) },
                    { cardids: firCards, cardsType: CCCardsType.checkType(firCards) }
                ]

                this.handCardGroup.useCards(thrCards, this.thrGrpDeskCards);
                this.handCardGroup.useCards(secCards, this.secGrpDeskCards);
                this.handCardGroup.useCards(firCards, this.firGrpDeskCards);
            }
            CCChooseCard._isSending = false;
            this.refreshBtnStatus();
        }, this, delaytime);

    }

    public cleanAllCardGrps() {
        // console.log("cleanAllCardGrps---------->");
        this.firGrpDeskCards.clean();
        this.firGrpDeskCards.cleanPokersId();
        this.secGrpDeskCards.clean();
        this.secGrpDeskCards.cleanPokersId();
        this.thrGrpDeskCards.clean();
        this.thrGrpDeskCards.cleanPokersId();
        this.handCardGroup.clean();
        this.handCardGroup.cleanPokersId();
        this.grpDesk.alpha = 0;

        this.handCardGroup.initListeners(false);
    }

    private sortPokersIdByType(type: number) {
        CCGlobalGameConfig.currentSortType = type;
        this.handCardGroup.sortPokersIdByType(type);
    }

    private showBtns(bshow): void {
        this.resetBtn.visible = bshow;
        this.comparisonBtn.visible = bshow;
        this.helpBtn.visible = bshow;
    }

    private enableHandCardGroup(benable): void {
        this.handCardGroup.initListeners(benable);
    }

    addCards(cardids: number[], animation: boolean = true, cleancards: boolean = false, showOrder: boolean = false, cardids2: number[] = []): void {
        if (cleancards) {
            this.handCardGroup.clean();
        }
        // cardids = [102, 150, 100, 112, 140, 110, 83, 81, 80, 73]
        this.handCardGroup.addCards(cardids, animation, showOrder);
        let _showTime = 500;
        if (showOrder == true) {
            _showTime = 1800;
        }

        this._cardids = [];
        if (cardids) {
            this._cardids = cardids;
        }

        this._cardids2 = [];
        if (cardids2 && cardids2.length == 9) {
            this._cardids2 = cardids2;
        }

        CCChooseCard._isSending = false;
        CCChooseCard._selfSelected = false;
        this._isChoosed = false;
        this._isClickConfirm = false;
        this.giveupBtn.visible = false;
        this.enableHandCardGroup(false);
        this.showBtns(false);
        this.refreshBtnStatus();
        egret.setTimeout(() => {
            let grpDesk = this.grpDesk;
            grpDesk.alpha = 0;
            egret.Tween.get(grpDesk).to({ visible: true, alpha: 1 }, 200);

            this.enableHandCardGroup(true);
            this.showBtns(true);
        }, this, _showTime);
    }
}

window["CCChooseCard"] = CCChooseCard;