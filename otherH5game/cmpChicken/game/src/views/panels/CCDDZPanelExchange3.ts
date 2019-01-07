/**
 *
 * @author 
 *
 */

class CCDDZPanelExchange3 extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelExchange3;
    public static get instance(): CCDDZPanelExchange3 {
        if (this._instance == undefined)
        {
            this._instance = new CCDDZPanelExchange3();
        }
        return this._instance;
    }

    public lv_list1: eui.List;
    public lv_list2: eui.List;
    private btn_changetype: eui.Button;
    private btn_close: eui.Button;
    private _self: CCGlobalUserInfoData;
    
    private list1:eui.ArrayCollection;
    private list2:eui.ArrayCollection;

    protected init(): void {
        this.skinName = panels.CCDDZPanelExchange3Skin;
        this._self = CCDDZMainLogic.instance.selfData;
    }

    constructor() {
        super(
            CCalien.CCDDZpopupEffect.CCDDFade, {},
            CCalien.CCDDZpopupEffect.CCDDFade, {}
        );
    }

    createChildren(): void {
        super.createChildren();

        this.width = this.stage.stageWidth;
        this.height = this.stage.stageHeight;

        this.lv_list1.itemRenderer = CCDDZIRExchangeHistory;
        this.lv_list2.itemRenderer = CCDDZIRExchangeDetail;
        this.list1=new eui.ArrayCollection();
        this.list2=new eui.ArrayCollection();
        this.lv_list1.dataProvider=this.list1;
        this.lv_list2.dataProvider=this.list2;
        
        let e: CCalien.CCDDZEventManager = CCDDZEventManager.instance;
        e.registerOnObject(this, this.btn_close, egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        e.registerOnObject(this, this.btn_changetype, egret.TouchEvent.TOUCH_TAP, this.onChangeType, this);
       
    }
    private onChangeType() {
        if (this.skin.currentState == "detail")
        {
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
        ccddzwebService.getRedcoinHistory(this._self.uid,(response: any) => {
           
            if(response && response.data)
            {
                let exchangeData: Array<any> = response.data.concat();
                let newData:Array<any> = [];
                
                
                if(response.data != null) { 
                    for(var i = 0;i < response.data.length;i++)
                    {
                        if(response.data[i].type == "2")
                            newData.push(response.data[i]);
                    }
                }   
                this.list1.source = exchangeData;
                this.list1.refresh();
                this.list2.source=newData;
                this.list2.refresh();
            }
        });
    }
    private onClose() { 
        this.close();
    }
    show(): void {
        this.popup();

        CCDDZEventManager.instance.enableOnObject(this);
        this.loadConfigs(null);
    }

    close(): void {
        super.close();

        CCDDZEventManager.instance.disableOnObject(this);
    }
}


class CCDDZIRExchangeHistory extends eui.ItemRenderer {
    private img_status: eui.Image;
    private lbl_dis: eui.Label;
    private lbl_change: eui.Label;
    private lbl_time: eui.Label;

    protected dataChanged(): void {
        super.dataChanged();  
        if (this.data == null)
        { 
            return;
        }
        if (this.data.recordtime){ 
            let dateTime = new Date(this.data.recordtime*1000);
            let format = CCalien.TimeUtils.timeFormatForEx(dateTime);
           this.lbl_time.text = format;
        }
        if (this.data.type == "1"){ 
            if(this.data.roomid == "0"){
                this.lbl_dis.text = "金豆场奖杯";
            }else{
                this.lbl_dis.text = lang.exchange_roomid[this.data.roomid] + "奖杯";
            }
            this.lbl_change.text = "+" + CCDDZUtils.exchangeRatio(this.data.coin/100,true);
            this.lbl_change.textColor = 0xFE0100;
        } else if(this.data.type == "2"){
            this.lbl_dis.text = "兑换" + this.data.goodsamount + CCGlobalGameConfig.exchangeGoodsConfig[this.data.goodsid].describe
            this.lbl_change.text = "-" + CCDDZUtils.exchangeRatio(this.data.coin/100,true);
            this.lbl_change.textColor = 0x4e7904;
        }else if (this.data.type == "3"){ 
            this.lbl_dis.text = lang.match_reward;//[this.data.roomid];
            this.lbl_change.text = "+" + CCDDZUtils.exchangeRatio(this.data.coin/100,true);
            this.lbl_change.textColor = 0xFE0100;
        }else if (this.data.type == "4"){ 
            this.lbl_dis.text = '每日任务奖励';
            this.lbl_change.text = "+" + CCDDZUtils.exchangeRatio(this.data.coin/100,true);
            this.lbl_change.textColor = 0xFE0100;
        }else if (this.data.type == "78"){ 
            this.lbl_dis.text = '极速场奖杯';
            this.lbl_change.text = "+" + CCDDZUtils.exchangeRatio(this.data.coin/100,true);
            this.lbl_change.textColor = 0xFE0100;
        }else if(this.data.type == "82"){
            this.lbl_dis.text = "邮件奖励";
            this.lbl_change.text = "+" + CCDDZUtils.exchangeRatio(this.data.coin/100,true);
            this.lbl_change.textColor = 0xFE0100;
        }else if(this.data.type == "70"){
            this.lbl_dis.text = "王炸奖励";
            this.lbl_change.text = "+" + CCDDZUtils.exchangeRatio(this.data.coin/100,true);
            this.lbl_change.textColor = 0xFE0100;
        }else if(this.data.type == "26" || this.data.type == "35"){
            this.lbl_dis.text = "邀请奖励";
            this.lbl_change.text = "+" + CCDDZUtils.exchangeRatio(this.data.coin/100,true);
            this.lbl_change.textColor = 0xFE0100;
        }else if(this.data.type == "95"){
            this.lbl_dis.text = "幸运抽奖";
            this.lbl_change.text = "+" + CCDDZUtils.exchangeRatio(this.data.coin/100,true);
            this.lbl_change.textColor = 0xFE0100;
        }else{
            this.lbl_dis.text = '奖励类型:' + this.data.type;
            this.lbl_change.text = "+" + CCDDZUtils.exchangeRatio(this.data.coin/100,true);
            this.lbl_change.textColor = 0xFE0100;
        }
    }
}
class CCDDZIRExchangeDetail extends eui.ItemRenderer {
    private lbl_status: eui.Label;
    private lbl_dis: eui.Label;
    private lbl_time: eui.Label;

    protected dataChanged(): void {
        super.dataChanged();
        
        if (this.data.goodsid)
        {
            this.lbl_dis.text = "兑换" + this.data.goodsamount + CCGlobalGameConfig.exchangeGoodsConfig[this.data.goodsid].describe
//            this.lbl_dis.text = CCGlobalGameConfig.exchangeGoodsConfig[this.data.goodsid].describe;
        }
        if (this.data.recordtime)
        {
            let dateTime = new Date(this.data.recordtime * 1000);
            let format = CCalien.TimeUtils.timeFormatForEx(dateTime);
            this.lbl_time.text = format;
        }
//        1审核中 2审核失败 3审核通过待领取 4已领取
        switch (this.data.status) { 
            case "1":
                this.lbl_status.text = "审核中...";
                break;
            case "2":
                this.lbl_status.text = "审核失败";
                break;
            case "3":
                if(this.data.goodsid == 1){
                    this.lbl_status.text = "前往公众号领取";
                }else{
                    this.lbl_status.text = "兑换记录领取";
                }
                break;
            case "4":
                this.lbl_status.text = "已领取";
                break;
            case "7":
                this.lbl_status.text = "邮件补发";
                break;

        }
    }
}