/**
 * 商城中的每个item信息
 */
class PDKShopItem extends eui.ItemRenderer {
    private labGold: eui.Label;
    private labScale: eui.Label;
    private labAddition: eui.Label;
    private btnConfirm: any;
    private grpAddition: eui.Group;
    private imgIcon: eui.Image;
    /**
     * 循环的id
     */
    private mTimeInterval:number;
    /**
     * 左上角新手专享礼包标识
     */
    private mPre_img:eui.Image;

    /**
     * 确定按钮上的兑换
     */
    private exchange_img:eui.Image;

    protected createChildren(): void {
        super.createChildren();

        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnConfirmTap, this);
    }

    /**
     * 限时的时间刷新
     */
    private _refreshLeftTime():void {
        let _cur = new Date().getTime();
        let _minute = PDKUtils.getTimeStampDiff(_cur,this.data.timeStamp,"minute");
        _minute = Math.floor(_minute);

        let _hour = _minute / 60;
        _hour = Math.floor(_hour);
        _minute = _minute % 60;
        if(_hour == 0 && _minute == 0){
            this._showPreAndTime(false);
            PDKPanelExchange2.instance.onTimeExpired([this.data.goodsid]);
            return;
        }
        this.labAddition.text = "剩" + _hour + "小时" ;//+ _minute + "分"
    }

    /**
     * 清除内部的循环
     */
    private _clearRepeatInterval():void{
        if(this.mTimeInterval){
            egret.clearInterval(this.mTimeInterval);
            this.mTimeInterval = 0;
        }
    }
    /**
     * 显示新手专享
     */
    private _showPreAndTime(bShow:boolean):void{
        if(bShow){
            this._clearRepeatInterval();
            this._refreshLeftTime();
            this.mTimeInterval = egret.setInterval(()=>{
                this._refreshLeftTime();
            }, this, 60000) //一分钟
        }
        else{
            this._clearRepeatInterval();
        }
        this.grpAddition.visible = bShow;
        this.mPre_img.visible = bShow;
    }



    /**
     * 去兑换
     */
    private _doExchange(){
        var tmp:string;
        if(PDKPanelExchange2.instance.lv_goods.selectedItem)
        {
            let _info = PDKPanelExchange2.instance.lv_goods.selectedItem;
            var amount: number = _info.amount;
            if(_info.goodsid==0)
            {
                tmp = PDKalien.StringUtils.format(PDKlang.exchange_redcoin_gold,amount);
            }
            else if(_info.goodsid == 1) {
                tmp = PDKalien.StringUtils.format(PDKlang.exchange_redcoin_red,amount);
                // if(1){
                //     PDKAlert.show("由于微信冻结公众号商户，导致奖励无法兑换，官方正在增加新的奖励通道。感谢您对三桂游戏中心一贯的支持！");
                //     return;
                // }
            } 
            else if(_info.goodsid == 4){ //话费
                /*if(_info.amount==1 || _info.amount==5){
                    PDKAlert.show("因为运营商年底维护，5元暂时停止兑换，预计元旦左右恢复正常！",0,null);
                    return;
                }*/
                let sInfo = "确定领取{0}元话费？";
                tmp = PDKalien.StringUtils.format(sInfo,_info.amount);
            }else if(_info.goodsid == 6){ //话费卡
                let sInfo = "确定领取{0}元话费充值卡？领取成功后将获得充值卡的卡号和密码，需要自己下载运营商APP充值！";
                tmp = PDKalien.StringUtils.format(sInfo,_info.amount);
            }else if(_info.goodsid == 5){ //京东卡
                let sInfo = "确定领取{0}元京东卡？";
                tmp = PDKalien.StringUtils.format(sInfo,_info.amount);
            }else if(_info.goodsid == 7){
                let sInfo = "确定领取{0}元支付宝红包？";
                tmp = PDKalien.StringUtils.format(sInfo,_info.amount);
            }
            else if(_info.product_id == 0){ //红包兑换钻石
                let sInfo = "确定领取{0}";
                if(_info.item_type == 1){
                    sInfo += "金豆？"
                }else if(_info.item_type == 3){
                    sInfo += "钻石？"
                }
                tmp = PDKalien.StringUtils.format(sInfo,_info.num);
            }

            //判断是否绑定了手机号
            let userData: PDKUserData = PDKUserData.instance;
            if (!userData.getItem('bindinfo', false)) {
                PDKPanelBindPhone.getInstance().showNew();
                return;
            }
        
            PDKAlert.show(tmp,1,(action: string) => { 
                if(action == 'confirm') {
                    let _needNum = _info.coin /100;
                    if(_info.product_id == 0){ //红包兑换金豆或者是钻石
                        _needNum = _info.money;
                    }
                    let _myRedNum = (PDKMainLogic.instance.selfData.redcoin || 0) /100 ;
                    if(_myRedNum < _needNum){
                        egret.setTimeout(()=>{
                            PDKAlert.show("奖杯不足！");
                        },this,300);
                        return;
                    }

                    PDKExchangeService.instance.doRedExchange(_info);
                }            
            });   
        }
    }

    /**
     * 去购买
     */
    private _doBuy(){
        PDKRechargeService.instance.doRecharge(this.data.product_id);
    }

    private onBtnConfirmTap(event: egret.TouchEvent): void {
        if(this.data.amount){
            this._doExchange();
        }else {
            if(this.data.product_id == 0){ //红包兑换钻石
                this._doExchange();
            }
            else{
                this._doBuy();
            }
        }

    }

    protected dataChanged(): void {
        super.dataChanged();
        let _bShow = false;
        //this.imgIcon.source = PDKGoodsItem.parseUrl(this.data.goodsid);

        let _end = "金豆";
		let _iconId = 0;
		let _desc = "1元=";
        let _pre = "";
        if(this.data.item_type){
            if(this.data.item_type==1){//金豆
            }
            else if(this.data.item_type==2){//奖杯
                _iconId = 1;
                _end = "话费"
                _pre = "";
            }
            else if(this.data.item_type==3){ //钻石
                _iconId = 2;
                _end = "钻石"
            }
        }
        else{
            _iconId = this.data.goodsid;
        }

        let _descInfo = "";
        let _currency = PDKlang.currency;;
        if(this.data.goodsid == 4){
            _descInfo = this.data.amount + "元话费";
        }else if(this.data.goodsid == 5){
            _descInfo = this.data.amount + "元京东卡";
        }else if(this.data.goodsid == 6){
            _descInfo = this.data.amount + "元话费卡";
        }else if(this.data.goodsid == 7){
            _descInfo = this.data.amount + "元支付宝红包";
        }
        else{
            _descInfo = this.data.num + _end;
        }

        //奖杯兑换
        if(this.data.product_id == 0){
            _currency = "";
        }
        this.labGold.text = _descInfo;

		this.imgIcon.source = PDKGoodsItem.parseUrl(_iconId);
		//this.labScale.text =  _desc +  PDKUtils.currencyRatio(this.data.cost_scale) + _end;
        this.btnConfirm.money_label.text  = _pre + this.data.money + _currency;
        if(this.data.addition > 0){
			this.labAddition.text = PDKlang.format(PDKlang.id.recharge_addition, this.data.addition);
        }

        this.btnConfirm.skin._Image1.source = "pdk_buybtn_n";
        if(this.data.amount){ //兑换
            this.mPre_img.visible = true;
            this.exchange_img.visible = true;
            //this.labScale.visible = false;
            if(this.data.goodsid==0)
                this.labGold.text = this.data.amount + PDKlang.gold;
            else if(this.data.goodsid==1 || this.data.goodsid==4){
                this.labGold.text = _pre + PDKUtils.exchangeRatio(this.data.amount,true); 
                if(this.data.amount == 1 && this.data.first && this.data.timeStamp){
                    _bShow = true;
                }
            }else if(this.data.goodsid ==6){ //话费卡
                this.mPre_img.source = "exchange_pre2";
                 _bShow = true;
            }else if(this.data.goodsid == 7){ //支付宝红包
                if(this.data.first){
                    this.mPre_img.source = "exchange_pre";
                    _bShow = true;
                }else{
                    _bShow = false;
                }
            }

            this._showPreAndTime(_bShow);
            this.btnConfirm.money_label.text = _pre + this.data.coin / 100;
            //this.btnConfirm.money_label.horizontalCenter = -30;
        }
        else{ //充值
            //this.labScale.visible = true;
            this.mPre_img.visible = false;
            this.exchange_img.visible = false;
            this.btnConfirm.money_label.horizontalCenter = 0;
            if(this.data.product_id == 0){ //红包兑换钻石
                this.btnConfirm.skin._Image1.source = "pdk_buybtn_n";
                this.exchange_img.visible = true;
                //this.labScale.visible = false;
                this.mPre_img.visible  = true;
                this.mPre_img.source = "exchange_pre1";
               // this.btnConfirm.money_label.horizontalCenter = -30;
            }
        }
        
		this.grpAddition.visible = this.data.addition > 0 ||this.data.first;
    }
}