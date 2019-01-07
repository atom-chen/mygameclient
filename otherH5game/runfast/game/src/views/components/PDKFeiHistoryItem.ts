/**
 * 兑换话费，话费充值卡，微信红包，微信零钱，支付宝红包，支付宝零钱 等单条记录信息
 * 4 话费 5 京东卡  6 话费卡 7 支付宝零钱 8 支付宝红包
 */
let _allCfg = {
    [1]:"{0}元微信红包",
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

class PDKFeiHistoryItem extends eui.ItemRenderer {
    private exDescLabel: eui.Label;
    private exTimeLabel: eui.Label;
    private exStatusLabel: eui.Label;
    private typeImg:eui.Image;
    private statusBgImg:eui.Image;

    protected dataChanged(): void {
        super.dataChanged();  
        if (this.data == null)
        { 
            return;
        }

        let dateTime = new Date(this.data.recordtime*1000);
        let format = PDKalien.TimeUtils.timeFormatForEx(dateTime,"-","-","",false);
        this.exTimeLabel.text = "领取日期:  " + format;
        
        this.typeImg.source = "exchange_" + this.data.goodsid;
        this._initDesc();
        this._initStatus();
        this.statusBgImg["addClickListener"](this._onClickStatus,this,false);
    }

    // 3 未领取 4 已领取 5 充值中 6 充值失败 7 充值失败转人工补发
    private _initStatus():void{
        let _d = this.data;
        let _status= _d.status;
        let _goodsId = this.data.goodsid;
        if(_status == 3 ){
            this.statusBgImg.source = "pdk_common_btn_orange3";
            this.statusBgImg.touchEnabled = true;
        }else if(_status == 4){
            if(_goodsId == 5 || _goodsId == 6){
                this.statusBgImg.source = "pdk_common_btn_orange3";
                this.statusBgImg.touchEnabled = true;
            }else{
                this.statusBgImg.source = "pdk_common_btn_orange2_gray";
                this.statusBgImg.touchEnabled = false;
            }
        }else{
            this.statusBgImg.source = "pdk_common_btn_orange2_gray";
            this.statusBgImg.touchEnabled = false;
        }

        if(_stCfg[_status]){
            this.exStatusLabel.text = _stCfg[_status];
            if(_status == 4){  
                if(_goodsId == 5 || _goodsId == 6){
                    this.exStatusLabel.text = "查看卡密";
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
        }
    }

    public updateInfo(data:any):void{
        this.data = data;
    }
    /**
     * 点击状态按钮
     */
    private _onClickStatus():void{
        let self = this;
        let _d = this.data;
        _d.item = this;
        let _status= _d.status;
        //兑换红包
        if (_d.goodsid == "1") {
            if (_status != 3) return;
			PDKwebService.goRechageFei({uid:pdkServer.uid,coinid:_d.id},function(response){
				if(response.code == 0){
					PDKToast.show("领取微信红包成功！请留意公众号通知。"+response.message);
                    if(self){
                        self.data.status = 4;
                        self.updateInfo(self.data);
                    }
				} else {
					PDKToast.show("领取微信红包失败！错误原因："+response.message);
				}
			});
			return;
        }
        if(_status == 3 || _status == 4 ){
            PDKPanelFeiEx.getInstance().show(_d);
        }
    }
}