/**
 *
 * @ cyj
 *
 */
class PDKPanelBuyRecorder extends PDKalien.PDKPanelBase {
    private static _instance: PDKPanelBuyRecorder;
    public static get instance(): PDKPanelBuyRecorder {
        if (this._instance == undefined) {
            this._instance = new PDKPanelBuyRecorder();
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
    // private btnExchange:eui.Button;
    private btn1: eui.Button;
    private btn2: eui.Button;
    private btn3: eui.Button;

    private lbRemain: eui.Label;
    private lbExpire: eui.Label;
    protected init(): void {
        this.skinName = panels.PDKPanelBuyRecorderSkin;
    }

    createChildren(): void {
        super.createChildren();
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnCloseClick, this);
        this.btn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuyClick, this);
        this.btn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuyClick, this);
        this.btn3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuyClick, this);
    }

    addListeners(): void {
        let e: PDKalien.PDKEventManager = PDKEventManager.instance;
        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.MY_USER_INFO_UPDATE, this.onMyUserInfoUpdate, this);
        PDKalien.PDKEventManager.instance.enableOnObject(this);
    }

    removeListeners(): void {
        PDKalien.PDKEventManager.instance.disableOnObject(this);
    }

    private onMyUserInfoUpdate(event: egret.Event = null): void {
        let userInfoData: PDKUserInfoData = event ? event.data.userInfoData : PDKMainLogic.instance.selfData;

        var remaintime: number = 0;
        var expiredate: string = '';
        if (userInfoData.cardsRecorder) {
            if (userInfoData.cardsRecorder[6] > 0) {
                remaintime = Math.ceil(userInfoData.cardsRecorder[6] / 3600 / 24);
                expiredate = '(至' + userInfoData.cardsRecorder[0] + '年' + userInfoData.cardsRecorder[1] + '月' + userInfoData.cardsRecorder[2] + '日' + userInfoData.cardsRecorder[3] + ':' + userInfoData.cardsRecorder[4] + ')';
            }
        }

        this.lbRemain.text = String(remaintime);
        if (remaintime > 0) {
            this.lbRemain.textColor = 0x208720;
            egret.localStorage.setItem("opencardsrecorder", '1');
            egret.localStorage.removeItem("cardsrecorderexpirenotice");
        } else {
            this.lbRemain.textColor = 0xff0000;
        }

        this.lbExpire.text = expiredate;
        // if(remaintime > 0){
        //     var expiredate:Date = new Date();
        //     var origin = expiredate.getTime();
        //     expiredate.setTime(origin + remaintime);
        //     this.lbExpire.text = '(' + expiredate.toLocaleDateString() + ')';
        // }else{
        //     this.lbExpire.text = '';
        // }
    }

    show(callback: Function = null, data: any = null): void {
        PDKMainLogic.instance.refreshSelfInfo();
        this.addListeners();
        this._callback = callback;
        // PDKMainLogic.instance.updateRecorderExpireTime();
        this.onMyUserInfoUpdate();
        this.popup();
    }

    private onBuyClick(event: egret.TouchEvent) {
        var id = Number(event.currentTarget.name) - 1;
        var cfg = PDKGameConfig.cardsRecorderConfig[id];
        if (cfg && cfg.id) {
            PDKRechargeService.instance.doRecharge(cfg.id);
        }
    }

    private onBtnCloseClick(event: egret.TouchEvent): void {
        // if(this._callback){
        //     this._callback('confirm');
        // }
        this.removeListeners();
        this.dealAction();
    }
}