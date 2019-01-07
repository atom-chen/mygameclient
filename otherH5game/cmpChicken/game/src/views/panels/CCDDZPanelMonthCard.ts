/**
 * Created by angleqqs on 18/6/20.
 *
 * 月卡面板
 */

class CCDDZPanelMonthCard extends CCalien.CCDDZPanelBase {

    private static _instance: CCDDZPanelMonthCard;

    public static get instance(): CCDDZPanelMonthCard {
        if (this._instance == undefined) {
            this._instance = new CCDDZPanelMonthCard();
        }
        return this._instance;
    }


    protected init(): void {
        this.skinName = panels.CCDDZPanelMonthCardSkin;
    }

    constructor() {
        super(CCalien.CCDDZpopupEffect.Scale, {
            withFade: true,
            ease: egret.Ease.backOut
        }, CCalien.CCDDZpopupEffect.Scale, { withFade: true, ease: egret.Ease.backIn });
        this["addEventListener"](egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
    }

    createChildren(): void {
        super.createChildren();
    }

    private _enableEvent(bEnable: boolean): void {
        let _func = "addEventListener";
        if (!bEnable) {
            _func = "removeEventListener"
        }
        this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
        this["btnClose"][_func](egret.TouchEvent.TOUCH_TAP, this._onClickClose, this);
        this["buyCard1"]["addClickListener"](this._onClickBuyCard1, this);
        this["buyCard2"]["addClickListener"](this._onClickBuyCard2, this);
    }

    private _onAddToStage(): void {
        this._enableEvent(true);
    }

    private _onRemovedToStage(): void {
        this._enableEvent(false);
        this["removeEventListener"](egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
        CCDDZPanelMonthCard._instance = null;
    }

    show(): void {
        this.popup(this.dealAction.bind(this));
        this._refreshMonthCardInfo();
    }

    private _onClickClose(evt: egret.TouchEvent): void {
        this.close();
    }

    private _onClickBuyCard1(): void {
        console.log("_onClickBuyCard1");
        this._onBuyMonthCard(1);
    }

    private _onClickBuyCard2(): void {
        console.log("_onClickBuyCard2");
        this._onBuyMonthCard(2);
    }

    /**
	 * 去购买
	 */
    private _onBuyMonthCard(monthType: number): void {
        let product_id = (monthType == 1 ? "10043" : "10044");
        CCDDZRechargeService.instance.doRecharge(product_id);
    }

    public _refreshMonthCardInfo(): void {
        if(!CCDDZPanelMonthCard._instance) return ;
        let _data = CCDDZMainLogic.instance.selfData["monthcardinfo"];
        let card1EndTime = _data[1] * 1000;
        let card2EndTime = _data[2] * 1000;
        if (card1EndTime == 0) card1EndTime = 946656000000;
        if (card2EndTime == 0) card2EndTime = 946656000000;
        let nowTime = ccserver.getServerStamp();
        if (card1EndTime < nowTime) {
            this["lblCard1"].visible = false;
        }
        else {
            let diffDate = CCDDZUtils.getTimeStampDiff(nowTime, card1EndTime, "day");
            this["lblCard1"].visible = true;
            if (card1EndTime < 1) {
                this["lblCard1"].visible = false;
            }
            let endDate = CCDDZUtils.formatDate(card1EndTime, "（至yyyy年MM月dd日 hh:mm）");
            let _str = "月卡时间可累计，有效期剩余<font color='0x33AB30'>" + Math.floor(diffDate) + "</font>天\n" + endDate;
            let _textFlow = (new egret.HtmlTextParser).parser(_str);
            this["lblCard1"].textFlow = _textFlow;
        }

        if (card2EndTime < nowTime) {
            this["lblCard2"].visible = false;
        }
        else {
            let diffDate = CCDDZUtils.getTimeStampDiff(nowTime, card2EndTime, "day");
            this["lblCard2"].visible = true;
            if (card2EndTime < 1) {
                this["lblCard2"].visible = false;
            }
            let endDate = CCDDZUtils.formatDate(card2EndTime, "（至yyyy年MM月dd日 hh:mm）");
            let _str = "月卡时间可累计，有效期剩余<font color='0x33AB30'>" + Math.floor(diffDate) + "</font>天\n" + endDate;
            let _textFlow = (new egret.HtmlTextParser).parser(_str);
            this["lblCard2"].textFlow = _textFlow;
        }
    }
}