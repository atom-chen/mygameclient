/**
 *
 * 周一特惠面板
 */

class PanelMonday extends alien.PanelBase {
    private static _instance: PanelMonday;
    private _curBuyInfo:any;
    public static get instance(): PanelMonday {
        if (this._instance == undefined) {
            this._instance = new PanelMonday();
        }
        return this._instance;
    }


    protected init(): void {
        this.skinName = panels.PanelMondaySkin;
    }

    constructor() {
        super(alien.popupEffect.Scale, {
            withFade: true,
            ease: egret.Ease.backOut
        }, alien.popupEffect.Scale, { withFade: true, ease: egret.Ease.backIn });
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
        PanelMonday._instance = null;
    }

    show(): void {
        this.popup();
        this._initItems();
    }

    public static nullInstance():void{
        let ins = PanelMonday._instance;
        if(ins){
            ins.close(true);
        }
        PanelMonday._instance = null;
    }

    private _onClickClose(evt: egret.TouchEvent): void {
        this.close();
    }

    private _initItems():void{
        let vipLevel = MainLogic.instance.selfData.getCurVipLevel();

        let t = {
            [0]:{id:10059,png1:"monday_word",png2:"monday_price12"},
            [1]:{id:10055,png1:"monday_word2",png2:"monday_price22"},
            [2]:{id:10055,png1:"monday_word2",png2:"monday_price22"},
            [3]:{id:10056,png1:"monday_word3",png2:"monday_price48"},
            [4]:{id:10056,png1:"monday_word3",png2:"monday_price48"},
            [5]:{id:10057,png1:"monday_word4",png2:"monday_price87"},
            [6]:{id:10057,png1:"monday_word4",png2:"monday_price87"},
            [7]:{id:10058,png1:"monday_word5",png2:"monday_price137"},
        }
        let buyInfo = t[vipLevel];
        let cfg = GameConfig.getRechargeInfoByProductId(buyInfo.id);
        if(!cfg){
            console.error("_initItems----------------->",buyInfo);
            return;
        }
        let add = cfg.addition_goods.split("|");
        let len = add.length;
        let tAdd={};
        let base = cfg.goods.split(":");
        for(let i=0;i<len;++i){
            tAdd[i] = add[i].split(":");
        }
        this["item1Num_label"].text = "x" + base[1];
        this["item2Num_label"].text = "x" + tAdd[0][1];
        let time = tAdd[1][1];
        let sTime = "";
        if(time >=24){
            sTime = time/24 + "天";
        }else {
            sTime = time + "小时";
        }
        this["item3Num_label"].text = sTime;
        this["iconCard3"].source = buyInfo.png1;
        this["bgCostCard3"].source = buyInfo.png2;
        this["bitlblCard2"].text = "￥" + cfg.money;
        this._curBuyInfo = buyInfo;
    }

    private _onClickBuyMonday(): void {
        if(!this._curBuyInfo){
            return;
        }
        RechargeService.instance.doRecharge(this._curBuyInfo.id);
    }
}