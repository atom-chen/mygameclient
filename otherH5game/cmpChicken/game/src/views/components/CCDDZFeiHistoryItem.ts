/**
 * 兑换话费，话费充值卡，微信红包，微信零钱，支付宝红包，支付宝零钱 等单条记录信息
 * 4 话费 5 京东卡  6 话费卡 7 支付宝零钱 8 支付宝红包
 */
let _allCfg = {
    [3]:"{0}钻石兑换码",
    [4]:"{0}元话费",
    [5]:"{0}元京东卡",
    [6]:"{0}元话费充值卡",
    [7]:"{0}奖杯",
    [8]:"{0}奖杯"
}

let _stCfg = {
    [3]: "领取", 
    [4]: "已领取", 
    [5]: "充值中",
    [6]: "充值失败",
    [7]: "邮件补发"
}

let _courseCfg = {
    [4]:{text:"查询教程",func:function(target:any){
        target.setHasShowGetCourse();
        CCGlobalGameConfig.toFeiUrl();
    }},
    [5]:{text:"使用教程",func:function(target:any){
        target.setHasShowGetCourse();
        CCGlobalGameConfig.toJDCardUrl();
    }},
    [6]:{text:"使用教程",func:function(target:any){
        target.setHasShowGetCourse();
        CCGlobalGameConfig.toFeiCardUrl();
    }},
    [7]:{text:"查询教程",func:function(target:any){
        target.setHasShowGetCourse();
        CCGlobalGameConfig.toAliRedUrl();
    }},
    [8]:{text:"查询教程",func:function(target:any){
        target.setHasShowGetCourse();
        CCGlobalGameConfig.toFeiUrl();
    }},
}

class CCDDZFeiHistoryItem extends eui.ItemRenderer {
    private exDescLabel: eui.Label;
    private exTimeLabel: eui.Label;
    private exStatusLabel: eui.Label;
    private typeImg:eui.Image;
    private statusBgImg:eui.Image;
    private courseBgImg:eui.Image;
    private courseLabel:eui.Label;
    private static showCourse:boolean;

    protected dataChanged(): void {
        super.dataChanged();  
        if (this.data == null)
        { 
            return;
        }

        let dateTime = new Date(this.data.recordtime*1000);
        let format = CCalien.TimeUtils.timeFormatForEx(dateTime,"-","-","",false);
        this.exTimeLabel.text = "兑换日期:  " + format;
        
        this.typeImg.source = (this.data.goodsid == 3 ? "cc_room_3" : "exchange_" + this.data.goodsid);       
        this.courseBgImg.visible = (this.data.goodsid == 3 ? false : true);
        this.courseLabel.visible = (this.data.goodsid == 3 ? false : true);        
        this._initDesc();
        this._initStatus();
        this.statusBgImg["addClickListener"](this._onClickStatus,this,false);
        this.courseBgImg["addClickListener"](this._onClickCourse,this,false)
    }

    private _showCourse(bShow:boolean):void{
        this["courseImg"].visible = bShow;
        let _height = 91;
        if(bShow){
            _height = 133;
        }
    
        this.data.showCourse = bShow;
        this["rootGroup"].height = _height;
    }

    /**
     * 提示点击卡密使用教程
     */
    private _showGetCourse():void{
        if(this.data.showCourse && this.data.goodsid != 3){
            this._showCourse(true);
        }else{
            this._showCourse(false);
        }
    }

    /**
     * 已经展示过卡密使用教程
     */
    public setHasShowGetCourse():void{
        CCDDZPanelExchange2.setHasShowClickCourse();
        this._showCourse(false);
    }

    // 3 未领取 4 已领取 5 充值中 6 充值失败 7 充值失败转人工补发
    private _initStatus():void{
        let _d = this.data;
        let _status= _d.status;
        let _goodsId = this.data.goodsid;
        this._showGetCourse();

        if(_status == 3 ){
            this.statusBgImg.source = "cc_common_btn_orange3";
            this.statusBgImg.touchEnabled = true;
        }else if(_status == 4){
            if(_goodsId == 5 || _goodsId == 6 || _goodsId == 3){
                this.statusBgImg.source = "cc_common_btn_orange3";
                this.statusBgImg.touchEnabled = true;
            }else{
                this.statusBgImg.source = "cc_common_btn_orange2_gray";
                this.statusBgImg.touchEnabled = false;
            }
        }else{
            this.statusBgImg.source = "cc_common_btn_orange2_gray";
            this.statusBgImg.touchEnabled = false;
        }

        if(_stCfg[_status]){
            this.exStatusLabel.text = _stCfg[_status];
            if(_status == 4){  
                if(_goodsId == 5 || _goodsId == 6){
                    this.exStatusLabel.text = "查看卡密";
                }else if(_goodsId == 4){
                    this.exStatusLabel.text = "充值成功";
                }else if(_goodsId == 3){
                    this.exStatusLabel.text = "查看兑换码";
                }
            }
        }
    }

    private _initDesc():void{
        let _d = this.data;
        if(_allCfg[_d.goodsid]){
            let _info = _allCfg[_d.goodsid];
            _info = _info.replace("{0}",_d.goodsamount);
            this.exDescLabel.text = _info;            
            if(_d.goodsid != 3) this.courseLabel.text = _courseCfg[_d.goodsid].text;
        }
    }

    public updateInfo(data:any):void{
        this.data = data;
    }
    /**
     * 点击状态按钮
     */
    private _onClickStatus():void{
        let _d = this.data;
        _d.item = this;
        let _status= _d.status;
        if(_status == 3 || _status == 4 ){
            CCDDZPanelFeiEx.getInstance().show(_d);
        }
    }

    /**
     * 点击教程按钮
     */
    private _onClickCourse():void{
        let _data = this.data;
        let _goodsId = _data.goodsid;
        _courseCfg[_goodsId].func(this);
    }
}