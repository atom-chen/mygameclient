/**
 *
 * @ cyj
 *
 */
class PanelRechargeTips extends alien.PanelBase {
    private static _instance: PanelRechargeTips;
    public static get instance(): PanelRechargeTips {
        if(this._instance == undefined) {
            this._instance = new PanelRechargeTips();
        }
        return this._instance;
    }

    constructor() {
        super(
            alien.popupEffect.Scale,{ withFade: true,ease: egret.Ease.backOut },
            alien.popupEffect.Scale,{ withFade: true,ease: egret.Ease.backIn }
        );
    }

    //    private rectMask: eui.Rect;
    private btnClose: eui.Button;
    
    
    private btnExchange:eui.Button;
    private btnBuy: eui.Button;
    private btnShare: eui.Button;
    private btnMatch:eui.Button;

    protected init(): void {
        this.skinName =  panels.PanelRechargeTipsSkin;
        
        if(!alien.Native.instance.isNative){
            //this.currentState = "wxmp";
            this.currentState = "withMatch";
        }else{
            this.currentState = "phone";
        }
        
    }

    createChildren(): void {
        super.createChildren();
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtnCloseClick,this);
        
        this.btnExchange.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onExchangeClick,this);
        this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onRechargeClick,this);
        this.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShareClick,this);
        this.btnMatch.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onToMatch,this);
    }

    show(callback: Function = null, data: any = null): void {
        this._callback = callback;
        this.popup();
    }
    
    private onExchangeClick() {
        PanelExchange2.instance.show(0);
        this.close();
    }
    
    private onRechargeClick() {
//        PanelExchange2.instance.show();
        PanelExchange2.instance.show();
        this.close();
    }
    
    /**
     * 参加比赛
     */
    private onToMatch():void{
        //alien.Dispatcher.dispatch(EventNames.TO_PAGE_MATCH);
        alien.SceneManager.instance.show(SceneNames.ROOM,{jump2match:true});
        this.close();
    }

    private onShareClick() {
//        PanelExchange2.instance.show();
        // PanelShare.instance.show();       
        if (!alien.Native.instance.isNative) {  // 非native 也就是web平台的 调起分享提示页面
            //PanelShare.instance.showInviteFriend()
            if(!alien.Native.instance.isWXMP && !alien.Native.instance.isAli()){
                WxHelper.shareForPhone();
            }
        } else { // native端 直接调起分享 分享到朋友圈
            // this.onShareWx(); // 由于这个接口不对外开放 所以直接把内部实现提取出来 考虑后期整合  TODO
            WxHelper.doNativeShare();
        }

        this.close();
    }
        
    private onBtnCloseClick(event: egret.TouchEvent): void {
        if(this._callback){
            this._callback('confirm');
        }
        this.dealAction();
    }
}