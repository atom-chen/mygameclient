/**
 *
 * @ cyj
 *
 */
class PDKPanelRechargeTips extends PDKalien.PDKPanelBase {
    private static _instance: PDKPanelRechargeTips;
    public static get instance(): PDKPanelRechargeTips {
        if (this._instance == undefined) {
            this._instance = new PDKPanelRechargeTips();
        }
        return this._instance;
    }

    constructor() {
        super(
            PDKalien.popupEffect.Scale, { withFade: true, ease: egret.Ease.backOut },
            PDKalien.popupEffect.Scale, { withFade: true, ease: egret.Ease.backIn }
        );
    }

    //    private rectMask: eui.Rect;
    private btnClose: eui.Button;


    private btnExchange: eui.Button;
    private btnBuy: eui.Button;
    private btnShare: eui.Button;

    protected init(): void {
        this.skinName = panels.PDKPanelRechargeTipsSkin;
    }

    createChildren(): void {

        super.createChildren();
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnCloseClick, this);

        this.btnExchange.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onExchangeClick, this);
        this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRechargeClick, this);
        this.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShareClick, this);
    }

    show(callback: Function = null, data: any = null): void {
        this._callback = callback;
        this.popup();
    }

    private onExchangeClick() {
        if (pdkServer._isInDDZ) {
            this.openDDZShop();
        }
        else {
            PDKPanelExchange2.instance.show(0);
        }
        this.close();
    }

    private openDDZShop(flag = 0) {
        pdkServer.ddzDispatchEvent(1, '', { type: 2, shopFlag: flag });
    }

    private onRechargeClick() {
        //        PDKPanelExchange2.instance.show();
        if (pdkServer._isInDDZ) {
            this.openDDZShop();
        } else {
            PDKPanelExchange2.instance.show();
        }
        this.close();
    }

    private onShareClick() {
        //        PDKPanelExchange2.instance.show();
        // PDKPanelShare.instance.show();       
        if (!PDKalien.Native.instance.isNative) {  // 非native 也就是web平台的 调起分享提示页面
            PDKPanelShare.instance.showInviteFriend()
        } else { // native端 直接调起分享 分享到朋友圈
            // this.onShareWx(); // 由于这个接口不对外开放 所以直接把内部实现提取出来 考虑后期整合  TODO
            PDKWxHelper.doNativeShare();
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