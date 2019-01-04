/**
 *
 * @author 
 *
 */

let EX_ID_GOLD = 1;
let EX_ID_DIAMOND = 2;
let EX_ID_WXRED = 3;
let EX_ID_FEI = 4;
let EX_ID_JD = 5;
let EX_ID_CODE = 6;
let EX_ID_HISTORY= 7;
let EX_ID_AliRED = 8;

class PanelExchange2 extends alien.PanelBase {
    private static _instance: PanelExchange2;
    public static get instance(): PanelExchange2 {
        if (this._instance == undefined)
        {
            this._instance = new PanelExchange2();
        }
        return this._instance;
    }

    public lv_goods: eui.List;

    private close_group: eui.Group;
    private btn_history: eui.Button;
    private tit_img:eui.Image;
    private bgImg:eui.Image;
    /**
     * 个人信息的红包栏
     */
    private grpRedcoin:eui.Group;
    /**
     * 红包余额
     */
    private lbRedCoin: eui.Label;
    private tip:eui.Group;
    private _self: UserInfoData;
    private gold: Gold;
	/**
	 * 钻石
	 */
	private diamond:Gold;
    private labNickName: eui.Label;
    private avatar: Avatar;
    private redLabel:eui.Label;
    private _clickRedFunc:Function;
    private infoGroup:eui.Group;

    /**
     * 购买记牌器
     */
    private btn_recorder:eui.Button;

    public itemList:Array<any>;
    protected _dataProvide:eui.ArrayCollection;
    //兑换按钮
    private redExchangeImg:eui.Image;
    
    private itemInfoScroller:eui.Scroller;

    /**
     * 兑换话费，话费充值卡等记录
     */
    private hisoryInfoScroller:eui.Scroller;
    private _historyProvide:eui.ArrayCollection;
    private lv_history:eui.List;
    private  _historyInfo:any;
    private _isReqHistory:boolean;
    /**
     * 兑换
     */
    private exCodeInput:eui.TextInput;
    private exCodeImg:eui.Image;

    private flagScroller:eui.Scroller;
    private flagList:eui.List;
    private _flagsDataProvider:eui.ArrayCollection;
    /**
     * 箭头
     */
    private arr_img:eui.Image;
    
    /**
     * 兑换微信红包的标题
     */
    private wxTitLabel:eui.Label;
    /**
     * 兑换微信红包的介绍
     */
    private wxDescLabel:eui.Label;
    /**
     * 新年红包的时间
     */
    private yearTimeLabel:eui.Label;

    private _closeCb:Function;

    protected init(): void {
        this.skinName = panels.PanelExchange2Skin;
        this._self = MainLogic.instance.selfData;
        this._flagsDataProvider = new eui.ArrayCollection();
        this.flagList.dataProvider = this._flagsDataProvider;
        this.flagList.itemRenderer = ActListItem;
        //this.flagScroller.visible = false;

        this._initFlags();
    }

    /**
     * 微信红包显示与否
     */
    private _inWXRedTime(bShowTime:boolean):boolean{
        let _bIn = false;
		/*let _custom:any = GameConfig.getCfgByField("custom");
		if(_custom){
			if(_custom.redExchange){
				let _start = _custom.redExchange.start;
				let _end = _custom.redExchange.end;
				let _ts = server.getServerStamp();
                let _str1 = alien.TimeUtils.timeFormatForEx(new Date(_start),"年","月","日",true);
                let _str2 = alien.TimeUtils.timeFormatForEx(new Date(_end),"年","月","日",true);
				this.yearTimeLabel.text = _str1 + "至" + _str2;
				_bIn = Utils.isInTimeSection(_start,_end,_ts,true,false);
			}
		}*/
        let _info = GameConfig.getCfgByField("webCfg.red");
        if(_info &&_info.status >= 1){
            if(_info.status ==1) {//非公众号
                if(alien.Native.instance.isWXMP){
                    return _bIn;
                }
            }
            _bIn = true;
            this.wxTitLabel.text = _info.title;
            this.yearTimeLabel.text = _info.time;
            this.wxDescLabel.text = _info.content;
        }
		return _bIn;
    }

    /**
     * 支付宝红包显示与否
     */
    private _inAliRedTime():boolean{
        if(1){
            if(alien.Native.instance.isWXMP){
                return false;
            }
            return true;
        }
        let _bIn = false;
        let _info = GameConfig.getCfgByField("aliRedInfo");
        if(_info && _info.data ==true){
            _bIn = true;
        }
		return _bIn;
    }

    private _initFlags():void{
        let _flags:any = [
            {tit:"金豆",sel:false,new:false,act:false,id:EX_ID_GOLD,cb:this._onClickGoldGroup.bind(this)},
            {tit:"钻石",sel:false,new:false,act:false,id:EX_ID_DIAMOND,cb:this._onClickDiamondGroup.bind(this)}
        ]
        let _after = [
            {tit:"兑换码",sel:false,new:false,act:false,id:EX_ID_CODE,cb:this._onClickCodeExchange.bind(this)},
            {tit:"兑换记录",sel:false,new:false,act:false,id:EX_ID_HISTORY,cb:this._onClickExHistory.bind(this)}];

        if(this._inWXRedTime(true)){
            _flags.push({tit:"奖杯",sel:false,act:true,new:false,id:EX_ID_WXRED,cb:this._onClickRed.bind(this)});
        }

        _flags.push({tit:"话费",sel:false,new:false,act:true,id:EX_ID_FEI,cb:this._onClickExchangeGroup.bind(this)});

        let _cfg = GameConfig.exchangeConfig;
        for(let i=0;i<_cfg.length;++i){
            if(_cfg[i].goodsid ==5){
                _flags.push({tit:"京东",sel:false,act:true,new:false,id:EX_ID_JD,cb:this._onClickJD.bind(this)});
                break;
            }
        }

        _flags = _flags.concat(_after);
        this._flagsDataProvider.source = _flags;
        this._flagsDataProvider.refresh();
    }

    constructor() {
        super(
            alien.popupEffect.Fade, {},
            alien.popupEffect.Fade, {}
        );
    }

    /**
     * 根据时间戳判断是显示过期前的数据还是过期后的数据
     */
    _filterTimeStampByGoodsId(goodsId:Array<number>):void{
        let _timeStamp = MainLogic.instance.selfData.rcminexcexpiretime;
        if(_timeStamp){
            let _curStamp = alien.Utils.getCurTimeStamp();
            let _outStamp = _timeStamp*1000;//服务器时间戳是秒为单位的
            if( _outStamp > _curStamp){ //未过期
                this._showBefore(_outStamp,goodsId);   
            }
            else{
                this._showAfter(goodsId);
            }
        }else{
            this._showAfter(goodsId);
        }
        
    }

    updateExchangeList(){
        if(this.currentState != "card") return;
        this._filterTimeStampByGoodsId([4,6]);
        this._dataProvide.source = this.itemList;
        this._dataProvide.refresh();
    }

    updateRedList(){
        if( this.currentState != "red") return;
        this._filterTimeStampByGoodsId([1,7]);
        let _showAliRed = this._inAliRedTime();
        if(!_showAliRed){
            this._toTop();
            this.itemList = this.itemList.filter((item:any)=>{
                return (item.goodsid !=7);
            })
        }else{
            this._toBottom();
        }

        this._dataProvide.source = this.itemList;
        this._dataProvide.refresh();

    }

    updateJDList(){
        if(this.currentState != "jd") return;

        this.itemList = GameConfig.exchangeConfig.filter((item:any)=>{
            return (item.goodsid ==5);//京东卡
        })
        
        this._dataProvide.source = this.itemList;
        this._dataProvide.refresh();
    }

    /**
     * H5 不显示红包和兑换记录
     */
    private _initH5():void{
        let _native = alien.Native.instance;
        if(!_native.isNative){
            //this.flagExImg.visible = false;
            //this.flagExLabel.visible = false;
            this.redLabel.text = "更多奖品";
            this._clickRedFunc = function(){
                let _str = "更多奖品兑换请下载APP\n下载就送<font color='#FF0000'>" + "钻石礼包" + "</font>！";
                let _textFlow = (new egret.HtmlTextParser).parser(_str);
                let _ins = PanelAlert.instance;
                _ins.show("",0,function(act){
                    if(act == "confirm"){
                        GameConfig.downApp();
                    }
                },"center",_textFlow);
                _ins.btnConfirm.bgImg.visible = false;
                _ins.btnConfirm.scaleX = 1.5;
                _ins.btnConfirm.scaleY = 1.5;
                _ins.btnConfirm.labelIcon = "go_down";
            }
        }else{
            this._clickRedFunc = this._showRed.bind(this);
        }
    }

    /**
     * 限时过期后的数据
     */
    private _showAfter(goodsid:Array<number>):void{
        this.itemList = GameConfig.exchangeConfig.filter((item:any)=>{
            item.timeStamp = 0;
            let bRet = false;
            let _len = goodsid.length;
            for(let i=0;i<_len;++i){
                if(item.goodsid == goodsid[i] && item.hide != 1){
                    bRet = true;
                }
            }
            return (item.first == null)&& bRet;
        })
    }

    /**
     * 限时过期前的数据
     */
    private _showBefore(timeStamp:number,goodsid:Array<number>):void{
        this.itemList = GameConfig.exchangeConfig.filter((item:any)=>{
            item.timeStamp = timeStamp;
            
            let bRet = false;
            for(let i=0;i<goodsid.length;++i){
                if(item.goodsid == goodsid[i] && item.hide != 1){
                    bRet = true;
                }
            }
            return (item.after == null)&& bRet;
        })
    }
    
    createChildren(): void {
        super.createChildren();

        //this.width = this.stage.stageWidth;
        //this.height = this.stage.stageHeight;
        
        this.percentWidth = 100;
        this.percentHeight = 100;
        this.exCodeInput.prompt = _exCodePrompt;
        
        this.lv_goods.dataProvider = this._dataProvide = new eui.ArrayCollection();
        this.lv_history.dataProvider = this._historyProvide = new eui.ArrayCollection();
        this.lv_history.itemRenderer = FeiHistoryItem;
        this._isReqHistory = false;
        this.hisoryInfoScroller.addEventListener(egret.Event.CHANGE,this._onHistoryScroll,this);
        this.onResize(null);
        this.lv_goods.itemRenderer = ShopItem;

        let e: alien.EventManager = EventManager.instance;
        //        e.registerOnObject(this, alien.Dispatcher, EventNames.MY_USER_INFO_UPDATE, this.onMyUserInfoUpdate, this);
        //        e.registerOnObject(this, this.grpButton, egret.TouchEvent.TOUCH_TAP, this.onGrpButtonTap, this);
        e.registerOnObject(this,alien.Dispatcher,EventNames.MY_USER_INFO_UPDATE,this.onMyUserInfoUpdate,this);
        e.registerOnObject(this, this.btn_history, egret.TouchEvent.TOUCH_TAP, this.onHistory, this);
        e.registerOnObject(this, this.close_group, egret.TouchEvent.TOUCH_TAP, this.onClose, this);
       // e.registerOnObject(this,this.tit_img,egret.TouchEvent.TOUCH_TAP,this.onClickTit,this);
        e.registerOnObject(this,this.btn_recorder,egret.TouchEvent.TOUCH_TAP, this.onRecorderClick, this);
        e.registerOnObject(this,this.exCodeImg,egret.TouchEvent.TOUCH_TAP,this._onClickCodeExNow,this);
        e.registerOnObject(this,alien.StageProxy.stage,egret.Event.RESIZE,this.onResize,this);
		e.registerOnObject(this,alien.Dispatcher,EventNames.BAG_INFO_REFRESH,this._onBagRefresh,this);
        e.registerOnObject(this,this.grpRedcoin,egret.TouchEvent.TOUCH_TAP,this._showWxRed.bind(this),this);
		this.flagList.addEventListener(egret.Event.CHANGE, this._onSelectItem, this);
     
        //this._initH5();
    }
    
    private _setSelFlag(id:number):void{
        let _d = this._flagsDataProvider.source;
        let _l = _d.length;
        for(let i=0;i<_l;++i){
            if(_d[i].id == id){
                this.flagList.selectedIndex = i;
                this.flagList.selectedItem = _d[i];
                this._onSelectItem(null);
                return;
            }
        } 
    }

    private _onSelectItem(e:egret.Event):void{
        let _sel = this.flagList.selectedItem;
        this.itemInfoScroller.stopAnimation();
        this.itemInfoScroller.viewport.scrollV = 0;
        //console.log("_onSelectItem==================>",_sel);
        let _len = this._flagsDataProvider.source.length;
        let _source = this._flagsDataProvider.source;
        for(let i=0;i<_len;++i){
            if(_source[i].sel){
                _source[i].sel = false;
                this._flagsDataProvider.itemUpdated(_source[i]);
            }
        }
        this.flagList.selectedItem.sel = true;
        let _idx = this.flagList.selectedIndex;

        this.arr_img.y = this.flagScroller.y + _idx * 65 + 32.5;
        this._flagsDataProvider.itemUpdated(_sel);
        if(_sel.cb){
            _sel.cb();
        }
    }

    private onResize(e: egret.Event): void {
//        let layout: eui.TileLayout = <eui.TileLayout>this.lv_goods.layout;
//        layout.columnWidth = (this.stage.stageWidth - 40) / 3;
    }
    
    private _setExCode(params): void {
        let data = params;
        this.exCodeInput.text = data.code;
    }
    
    /**
     * 点击兑换码
     */
    private _onClickCodeExchange():void{
        this._toTop();
        this.currentState = "exCode";
    }

    /**
     * 点击兑换码的立即兑换
     */
    private _onClickCodeExNow():void{
        let code = this.exCodeInput.text;
        if(!code || code.length< 1){
            Toast.show("兑换码不能为空");
        }else{
            let _uid = UserData.instance.getUid();
            webService.doCodeExchange({uid:_uid,code:code,type: GameConfig.SERVER_URL_TAIL},function(response){
                Alert.show(response.message);
            });
        }
    }

    /**
     * 显示金豆页
     */
    private _showGold():void{
        this.currentState = "gold";
        let _arr = [];
        let _cfg = GameConfig.rechargeConfig;
        let _payNum = MainLogic.instance.selfData.getPayCount();
        //金豆界面不显示首充礼包
		for(let i=0;i<_cfg.length;++i){
            if(!_cfg[i].firstrecharge && _cfg[i].item_type == 1 &&(!_cfg[i].hide || _cfg[i].hide != 1) ) //金豆
			{
                if(_cfg[i].minPay){
                     if(_payNum >= _cfg[i].minPay && _payNum <= _cfg[i].maxPay){
				        _arr.push(_cfg[i]);
                    }
                }else{
				    _arr.push(_cfg[i]);
                }
			}
		}
        this._dataProvide.source = _arr;
        this._dataProvide.refresh();
    }
    /**
     * 显示钻石标签页
     */
    private _showDiamond():void{
        let _arr = [];
        let _cfg = GameConfig.rechargeConfig;
        //钻石界面不显示复活礼包
		for(let i=0;i<_cfg.length;++i){
			if(_cfg[i].product_id != 10009 && _cfg[i].item_type == 3 &&(!_cfg[i].hide || _cfg[i].hide != 1)) //钻石
			{
				_arr.push(_cfg[i]);
			}
		}
        
        this._dataProvide.source = _arr;
        this._dataProvide.refresh();

        this.currentState = "diamond";
    }

    /**
     * 显示兑换话费
     */
    private _showExchange():void{
        this.currentState = "card";
        this.updateExchangeList();
    }

    /**
     * 显示京东
     */
    private _showJD():void{
        this.currentState = "jd";
        this.updateJDList();
    }

    /**
     * 点击金豆
     */
    private _onClickGoldGroup():void{
        this._toTop();
        this._showGold();
    }

    /**
     * 点击钻石
     */
    private _onClickDiamondGroup():void{
        this._toTop();
        this._showDiamond();
    }

    /**
     * 点击兑换话费
     */
    private _onClickExchangeGroup():void{
        this._toTop();
        this._showExchange();
    }

    private onHistory() {
        PanelExchange3.instance.show();
    }

    private onClose() { 
        this.close();
    }
    
    /**
     * 当我的玩家信息
     * @param event
     */
    private onMyUserInfoUpdate(event: egret.Event = null): void {
        let userInfoData: UserInfoData = event ? event.data.userInfoData : this._self;
        let _nDiamond:any = BagService.instance.getItemCountById(3);
        this.gold.updateGold(userInfoData.gold);
        this.diamond.updateGold(_nDiamond);
        this.avatar.imageId = userInfoData.imageid;
        this.avatar.setVipLevel(userInfoData.getCurVipLevel());
        if(userInfoData.nickname) {
            let _nameStr = userInfoData.nickname.substr(0,10);
            this.labNickName.text =  _nameStr + "(" + userInfoData.fakeuid + ")";
         }
        this._self.redcoin = MainLogic.instance.selfData.redcoin;
        this.updateExchangeList();
        this.flashData(false);
    }
    /**
     * 点击红包栏的兑
     */
    private _onClickExchange():void{
        this._showRed();
    }

    /**
     * 点击京东
     */
    private _onClickJD():void{
        this._toTop();
        this._showJD();
    }

    /**
     * 滚动到底部
     */
    private _toTop():void{
        this.itemInfoScroller.stopAnimation();
        this.itemInfoScroller.viewport.scrollV = 0;
    }

    /**
     * 滚动到底部
     */
    private _toBottom():void{
        this.itemInfoScroller.stopAnimation();
        this.itemInfoScroller.viewport.scrollV = this.itemInfoScroller.height * 0.3;
    }

    /**
     * 点击红包
     */
    private _onClickRed():void{
        this._showRed();
    }

    /**
     * 点击兑换记录
     */
    private _onClickExHistory():void{
        this._showExHistory();
    }

    public flashData(refresh:boolean = false) {
        this.lbRedCoin.text = "" + (this._self.redcoin == null ? "0.00" : Utils.exchangeRatio(this._self.redcoin/100,true));
        if(refresh){
            for(var j = 0; j < this.itemList.length; ++j){
                if (this.itemList[j].first){
                    this.itemList.splice(j, 1);
                    break;
                }
            }
            this._dataProvide.source = this.itemList;
            this._dataProvide.refresh();
        }
    }

    /**
     * 切换到微信红包
     */
    private _showWxRed():void{
        let _d = this._flagsDataProvider.source;
        let _l = _d.length;
        //判断是否上了红包功能
        for(let i=0;i<_l;++i){
            if(_d[i].id == EX_ID_WXRED){
                this._setSelFlag(EX_ID_WXRED);
                return;
            }
        }
        this._setSelFlag(EX_ID_FEI);
    }

    /**
     * 切换到支付宝红包
     */
    private _showAliRed():void{
        let _d = this._flagsDataProvider.source;
        let _l = _d.length;
        //判断是否上了红包功能
        for(let i=0;i<_l;++i){
            if(_d[i].id == EX_ID_AliRED){
                this._setSelFlag(EX_ID_AliRED);
                return;
            }
        }
        this._setSelFlag(EX_ID_FEI);
    }

    /**
     * 默认购买金豆的标签页
     * type:0 金豆标签页 1:钻石标签页 2:兑换标签 3:京东,4:红包,5:兑换记录,6:兑换码标签
     */
    show(type:number = 0,closeCb:Function = null, params: {} = null): void {
        MainLogic.instance.setScreenLandScape(1280,640);
        this.popup();
        this._closeCb = closeCb;
        EventManager.instance.enableOnObject(this);
        egret.setTimeout(()=>{
            this.onMyUserInfoUpdate();
            if(type == 1){
                this._setSelFlag(EX_ID_DIAMOND);
            }else if(type == 2){
                this._setSelFlag(EX_ID_FEI);
            }else if(type ==3){
                this._setSelFlag(EX_ID_JD);
            }else if(type == 4){
                this._showWxRed();
            }else if(type ==5){
                this._setSelFlag(EX_ID_HISTORY);
            }else if(type == 6) {
                this._setSelFlag(EX_ID_CODE);
                this._setExCode(params);
            }
            else{
                this._setSelFlag(EX_ID_GOLD);
            }
        },this,50);
    }

    /**
     * 显示红包
     */
    private _showRed():void{
        this.currentState = "red";
        this.updateRedList();
    }

    /**
     * 显示兑换话费，话费充值卡，微信红包，微信零钱，支付宝红包，支付宝零钱记录
     */
    private _showExHistory():void{
        let self = this;
        webService.getExHistory(1,(response)=>{
            self.currentState = "history";
            if(response.code ==0){
                let _data = response.data.items;
                this._historyInfo = response.data;
                //console.log("_showExHistory==1==",response.data);
                self._initExRecordInfo(_data);
                this.hisoryInfoScroller.viewport.scrollV = 0;
            }
        });
    }
    /**
     * 兑换记录列表滚动
     */
    private _onHistoryScroll(e:egret.Event):void{
        if(this.hisoryInfoScroller.viewport.scrollV >= this.hisoryInfoScroller.height){
            let _curPage = this._historyInfo.current_page;
            let _self = this;
            if(_curPage < this._historyInfo.total_page && !_self._isReqHistory){
                _self._isReqHistory = true;
                webService.getExHistory(_curPage+1,(response)=>{
                    _self._isReqHistory = false;
                    if(response.code ==0){
                        let _data = response.data.items;
                        _self._historyInfo.items = this._historyInfo.items.concat(response.data.items);
                        _self._historyInfo.current_page = response.data.current_page;
                        _self._initExRecordInfo(_self._historyInfo.items);
                        //console.log("_showExHistory==2==",this._historyInfo.items);
                    }
                });
            }
        }
    }

    /**
     * 设置已经展示过提示点击教程
     * */

    public static setHasShowClickCourse():void{
        alien.localStorage.setItem("tipCourse","1");
    }

    /**
     * 查询是否展示过提示点击教程
     * */
    private _hasShowClickCourse():boolean{
        let _show = alien.localStorage.getItem("tipCourse") 
        if(_show != "1"){
            return false;
        }
        return true;
    }

    /**
     * 初始化兑换话费，话费充值卡，微信红包，微信零钱，支付宝红包，支付宝零钱记录列表信息
     */
    private _initExRecordInfo(data:any):void{
        if(data && data.length >0 && !this._hasShowClickCourse()){
            data[0].showCourse = true;
        }
        this._historyProvide.source = data;
        this._historyProvide.refresh();
    }

    close(isToShop: boolean = false): void {
        if(isToShop)
            alien.PopUpManager.removePopUp(this);
        else
            super.close();       
        EventManager.instance.disableOnObject(this);
        if(this._closeCb){
            this._closeCb();
        }
    }
    /**
     * 限时过期
     */
    public onTimeExpired(goodsId:Array<number>):void{
        this._showAfter(goodsId);
        this._dataProvide.source = this.itemList;
        this._dataProvide.refresh();
    }
    /**
	 * 背包更新
	*/
	private _onBagRefresh():void{
		let _nDiamond:any = BagService.instance.getItemCountById(3);
		this.diamond.updateGold(_nDiamond);
	}

    /**
     * 购买记牌器
     */
    private onRecorderClick(event:egret.TouchEvent):void{
		PanelBuyRecorder.instance.show();
	}
}