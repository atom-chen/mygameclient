/**
 *
 * @ cyj
 *
 */
class CCDDZPanelRechargeTips extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelRechargeTips;
    public static get instance(): CCDDZPanelRechargeTips {
        if (this._instance == undefined) {
            this._instance = new CCDDZPanelRechargeTips();
        }
        return this._instance;
    }

    constructor() {
        super(
            CCalien.CCDDZpopupEffect.Scale, { withFade: true, ease: egret.Ease.backOut },
            CCalien.CCDDZpopupEffect.Scale, { withFade: true, ease: egret.Ease.backIn }
        );
    }

    //    private rectMask: eui.Rect;
    private btnClose: eui.Button;


    private btnExchange: eui.Button;
    private btnBuy: eui.Button;
    private btnShare: eui.Button;
    private btnMatch: eui.Button;

    protected init(): void {
        this.skinName = panels.CCDDZPanelRechargeTipsSkin;

        if (!CCalien.Native.instance.isNative) {
            //this.currentState = "wxmp";
            this.currentState = "withMatch";
        } else {
            this.currentState = "phone";
        }

    }

    createChildren(): void {
        super.createChildren();
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnCloseClick, this);

        this.btnExchange.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onExchangeClick, this);
        this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRechargeClick, this);
        this.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShareClick, this);
        this.btnMatch.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onToMatch, this);
    }

    show(callback: Function = null, data: any = null): void {
        this._callback = callback;
        this.popup();
    }

    private onExchangeClick() {
        if (ccserver._isInDDZ) {
            this.openDDZShop();
        } else {
            CCDDZPanelExchange2.instance.show(0);
        }
        this.close();
    }

    private onRechargeClick() {
        //        CCDDZPanelExchange2.instance.show();
        if (ccserver._isInDDZ) {
            this.openDDZShop();
        }
        else {
            CCDDZPanelExchange2.instance.show();
        }
        this.close();
    }

    private openDDZShop(flag = 0) {
        ccserver.ddzDispatchEvent(1, '', { type: 2, shopFlag: flag });
    }

    /**
     * 参加比赛
     */
    private onToMatch(): void {
        //CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.TO_PAGE_MATCH);
        CCalien.CCDDZSceneManager.instance.show(CCGlobalSceneNames.ROOM, { jump2match: true });
        this.close();
    }

    private onShareClick() {
        //        CCDDZPanelExchange2.instance.show();
        // CCDDZPanelShare.instance.show();       
        if (!CCalien.Native.instance.isNative) {  // 非native 也就是web平台的 调起分享提示页面
            //CCDDZPanelShare.instance.showInviteFriend()
            if (!CCalien.Native.instance.isWXMP && !CCalien.Native.instance.isAli()) {
                CCGlobalWxHelper.shareForPhone();
            }
        } else { // native端 直接调起分享 分享到朋友圈
            // this.onShareWx(); // 由于这个接口不对外开放 所以直接把内部实现提取出来 考虑后期整合  TODO
            CCGlobalWxHelper.doNativeShare();
        }

        this.close();
    }

    private onBtnCloseClick(event: egret.TouchEvent): void {
        if (this._callback) {
            this._callback('confirm');
        }
        this.dealAction();
    }
}