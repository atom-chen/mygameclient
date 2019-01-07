/**
 *
 * 周一特惠面板
 */

class CCDDZPanelMonday extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelMonday;
    public static get instance(): CCDDZPanelMonday {
        if (this._instance == undefined) {
            this._instance = new CCDDZPanelMonday();
        }
        return this._instance;
    }


    protected init(): void {
        this.skinName = panels.CCDDZPanelMondaySkin;
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
        this["buyMondayGrp"]["addClickListener"](this._onClickBuyMonday, this);
    }

    private _onAddToStage(): void {
        this._enableEvent(true);
    }

    private _onRemovedToStage(): void {
        this._enableEvent(false);
        this["removeEventListener"](egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
        CCDDZPanelMonday._instance = null;
    }

    show(): void {
        this.popup(this.dealAction.bind(this));
    }

    public static nullInstance():void{
        let ins = CCDDZPanelMonday._instance;
        if(ins){
            ins.close(true);
        }
        CCDDZPanelMonday._instance = null;
    }

    private _onClickClose(evt: egret.TouchEvent): void {
        this.close();
    }

    private _onClickBuyMonday(): void {
        CCDDZRechargeService.instance.doRecharge("10046");
    }
}