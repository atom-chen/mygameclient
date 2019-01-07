/**
 *
 * @author 
 *
 */

class PDKPanelExchange3 extends PDKalien.PDKPanelBase {
    private static _instance: PDKPanelExchange3;
    public static get instance(): PDKPanelExchange3 {
        if (this._instance == undefined) {
            this._instance = new PDKPanelExchange3();
        }
        return this._instance;
    }

    public lv_list1: eui.List;
    public lv_list2: eui.List;
    private btn_changetype: eui.Button;
    private btn_close: eui.Button;
    private _self: PDKUserInfoData;

    private list1: eui.ArrayCollection;
    private list2: eui.ArrayCollection;

    protected init(): void {
        this.skinName = panels.PDKPanelExchange3Skin;
        this._self = PDKMainLogic.instance.selfData;
    }

    constructor() {
        super(
            PDKalien.popupEffect.Fade, {},
            PDKalien.popupEffect.Fade, {}
        );
    }

    createChildren(): void {
        super.createChildren();

        this.width = this.stage.stageWidth;
        this.height = this.stage.stageHeight;

        this.lv_list1.itemRenderer = PDKIRExchangeHistory;
        this.lv_list2.itemRenderer = PDKIRExchangeDetail;
        this.list1 = new eui.ArrayCollection();
        this.list2 = new eui.ArrayCollection();
        this.lv_list1.dataProvider = this.list1;
        this.lv_list2.dataProvider = this.list2;

        let e: PDKalien.PDKEventManager = PDKEventManager.instance;
        e.registerOnObject(this, this.btn_close, egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        e.registerOnObject(this, this.btn_changetype, egret.TouchEvent.TOUCH_TAP, this.onChangeType, this);

    }
    private onChangeType() {
        if (this.skin.currentState == "detail") {
            this.skin.currentState = "hirstory";
        } else {
            this.skin.currentState = "detail";
        }
    }

    /**
	 * 加载历史记录http://192.168.0.86:8998/coin/index
	 * @param callback
	 */
    private loadConfigs(callback: Function): void {
        PDKwebService.getRedcoinHistory(this._self.uid, (response: any) => {

            if (response && response.data) {
                let exchangeData: Array<any> = response.data.concat();
                let newData: Array<any> = [];


                if (response.data != null) {
                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].type == "2")
                            newData.push(response.data[i]);
                    }
                }
                this.list1.source = exchangeData;
                this.list1.refresh();
                this.list2.source = newData;
                this.list2.refresh();
            }
        });
    }
    private onClose() {
        this.close();
    }
    show(): void {
        this.popup();

        PDKEventManager.instance.enableOnObject(this);
        this.loadConfigs(null);
    }

    close(): void {
        super.close();

        PDKEventManager.instance.disableOnObject(this);
    }
}


class PDKIRExchangeHistory extends eui.ItemRenderer {
    private img_status: eui.Image;
    private lbl_dis: eui.Label;
    private lbl_change: eui.Label;
    private lbl_time: eui.Label;

    protected dataChanged(): void {
        super.dataChanged();
        if (this.data == null) {
            return;
        }
        if (this.data.recordtime) {
            let dateTime = new Date(this.data.recordtime * 1000);
            let format = PDKalien.TimeUtils.timeFormatForEx(dateTime);
            this.lbl_time.text = format;
        }
        if (this.data.type == "1") {
            this.lbl_dis.text = PDKlang.exchange_roomid[this.data.roomid];
            this.lbl_change.text = "+" + PDKUtils.exchangeRatio(this.data.coin / 100, true);
            this.lbl_change.textColor = 0xFE0100;
        } else if (this.data.type == "2") {
            this.lbl_dis.text = "领取" + this.data.goodsamount + PDKGameConfig.exchangeGoodsConfig[this.data.goodsid].describe
            this.lbl_change.text = "-" + PDKUtils.exchangeRatio(this.data.coin / 100, true);
            this.lbl_change.textColor = 0x4e7904;
        } else if (this.data.type == "3") {
            this.lbl_dis.text = PDKlang.match_reward;//[this.data.roomid];
            this.lbl_change.text = "+" + PDKUtils.exchangeRatio(this.data.coin / 100, true);
            this.lbl_change.textColor = 0xFE0100;
        } else if (this.data.type == "4") {
            this.lbl_dis.text = '每日任务奖励';
            this.lbl_change.text = "+" + PDKUtils.exchangeRatio(this.data.coin / 100, true);
            this.lbl_change.textColor = 0xFE0100;
        } else if (this.data.type == "78") {
            this.lbl_dis.text = '极速场奖杯';
            this.lbl_change.text = "+" + PDKUtils.exchangeRatio(this.data.coin / 100, true);
            this.lbl_change.textColor = 0xFE0100;
        } else if (this.data.type == "82") {
            this.lbl_dis.text = "邮件奖励";
            this.lbl_change.text = "+" + PDKUtils.exchangeRatio(this.data.coin / 100, true);
            this.lbl_change.textColor = 0xFE0100;
        }
        else {
            this.lbl_dis.text = '奖励类型:' + this.data.type;
            this.lbl_change.text = "+" + PDKUtils.exchangeRatio(this.data.coin / 100, true);
            this.lbl_change.textColor = 0xFE0100;
        }
    }
}
class PDKIRExchangeDetail extends eui.ItemRenderer {
    private lbl_status: eui.Label;
    private lbl_dis: eui.Label;
    private lbl_time: eui.Label;

    protected dataChanged(): void {
        super.dataChanged();

        if (this.data.goodsid) {
            this.lbl_dis.text = "领取" + this.data.goodsamount + PDKGameConfig.exchangeGoodsConfig[this.data.goodsid].describe
            //            this.lbl_dis.text = PDKGameConfig.exchangeGoodsConfig[this.data.goodsid].describe;
        }
        if (this.data.recordtime) {
            let dateTime = new Date(this.data.recordtime * 1000);
            let format = PDKalien.TimeUtils.timeFormatForEx(dateTime);
            this.lbl_time.text = format;
        }
        //        1审核中 2审核失败 3审核通过待领取 4已领取
        switch (this.data.status) {
            case 1:
                this.lbl_status.text = "审核中...";
                break;
            case 2:
                this.lbl_status.text = "审核失败";
                break;
            case 3:
                this.lbl_status.text = "待领取...";
                break;
            case 4:
                this.lbl_status.text = "已领取";
                break;
        }
    }
}