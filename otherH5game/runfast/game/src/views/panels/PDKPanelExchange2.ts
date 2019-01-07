/**
 *
 * @author 
 *
 */
class PDKPanelExchange2 extends PDKalien.PDKPanelBase {
    private static _instance: PDKPanelExchange2;
    public static get instance(): PDKPanelExchange2 {
        if (this._instance == undefined) {
            this._instance = new PDKPanelExchange2();
        }
        return this._instance;
    }

    public lv_goods: eui.List;

    private close_group: eui.Group;
    private btn_history: eui.Button;
    private tit_img: eui.Image;
    private bgImg: eui.Image;

    /**
     * 红包余额
     */
    private lbRedCoin: eui.Label;
    private tip: eui.Group;
    private _self: PDKUserInfoData;
    private gold: PDKGold;
	/**
	 * 钻石
	 */
    private diamond: PDKGold;
    private labNickName: eui.Label;
    private avatar: PDKAvatar;
    private flagGoldImg: eui.Image;
    private flagDiamondImg: eui.Image;
    private flagExchangeImg: eui.Image;
    private flagJdImg: eui.Image;
    private flagRedImg: eui.Image;
    private redLabel: eui.Label;
    private _clickRedFunc: Function;

    private flagExImg: eui.Image;
    private flagExLabel: eui.Label;

    private jdLabel: eui.Label;
    private infoGroup: eui.Group;

    /**
     * 购买记牌器
     */
    private btn_recorder: eui.Button;

    public itemList: Array<any>;
    protected _dataProvide: eui.ArrayCollection;
    //兑换按钮
    private redExchangeImg: eui.Image;

    /**
     * 兑换话费，话费充值卡等记录
     */
    private hisoryInfoScroller: eui.Scroller;
    private _historyProvide: eui.ArrayCollection;
    private lv_history: eui.List;
    private _historyInfo: any;
    private _isReqHistory: boolean;

    protected init(): void {
        this.skinName = panels.PDKPanelExchange2Skin;

        this._self = PDKMainLogic.instance.selfData;
    }

    constructor() {
        super(
            PDKalien.popupEffect.Fade, {},
            PDKalien.popupEffect.Fade, {}
        );
    }

    /**
     * 根据时间戳判断是显示过期前的数据还是过期后的数据
     */
    _filterTimeStampByGoodsId(goodsId: Array<number>): void {
        let _timeStamp = PDKMainLogic.instance.selfData.rcminexcexpiretime;
        if (_timeStamp) {
            let _curStamp = new Date().getTime();
            let _outStamp = _timeStamp * 1000;//服务器时间戳是秒为单位的
            if (_outStamp > _curStamp) { //未过期
                this._showBefore(_outStamp, goodsId);
            }
            else {
                this._showAfter(goodsId);
            }
        } else {
            this._showAfter(goodsId);
        }

    }

    updateExchangeList() {
        if (this.currentState != "card") return;
        this._filterTimeStampByGoodsId([4, 6]);
        this._dataProvide.source = this.itemList;
        this._dataProvide.refresh();
    }

    updateRedList() {
        if (this.currentState != "red") return;
        this._filterTimeStampByGoodsId([1]);
        this._dataProvide.source = this.itemList;
        this._dataProvide.refresh();
    }

    updateJDList() {
        if (this.currentState != "jd") return;

        this.itemList = PDKGameConfig.exchangeConfig.filter((item: any) => {
            return (item.goodsid == 5);//京东卡
        })

        this._dataProvide.source = this.itemList;
        this._dataProvide.refresh();
    }

    private _initJD(): void {
        let _cfg = PDKGameConfig.exchangeConfig;
        let _bHasJd = false;
        for (let i = 0; i < _cfg.length; ++i) {
            if (_cfg[i].goodsid == 5) {
                _bHasJd = true;
                break;
            }
        }
        if (!_bHasJd) {
            this.jdLabel.visible = false;
            this.flagJdImg.visible = false;
        }
    }

    /**
     * H5 不显示红包和兑换记录
     */
    private _initH5(): void {
        // let _native = PDKalien.Native.instance;
        // if(!_native.isNative){
        //     //this.flagExImg.visible = false;
        //     //this.flagExLabel.visible = false;
        //     this.redLabel.text = "更多奖品";
        //     this._clickRedFunc = function(){
        //         let _str = "更多奖品兑换请下载APP\n下载就送<font color='#FF0000'>" + "钻石礼包" + "</font>！";
        //         let _textFlow = (new egret.HtmlTextParser).parser(_str);
        //         let _ins = PDKPanelAlert.instance;
        //         _ins.show("",0,function(act){
        //             if(act == "confirm"){
        //                 PDKGameConfig.downApp();
        //             }
        //         },"center",_textFlow);
        //         _ins.btnConfirm.bgImg.visible = false;
        //         _ins.btnConfirm.scaleX = 1.5;
        //         _ins.btnConfirm.scaleY = 1.5;
        //         _ins.btnConfirm.labelIcon = "go_down";
        //     }
        // }else{
        this._clickRedFunc = this._showRed.bind(this);
        // }
    }

    /**
     * 限时过期后的数据
     */
    private _showAfter(goodsid: Array<number>): void {
        this.itemList = PDKGameConfig.exchangeConfig.filter((item: any) => {
            item.timeStamp = 0;
            let bRet = false;
            let _len = goodsid.length;
            for (let i = 0; i < _len; ++i) {
                if (item.goodsid == goodsid[i]) {
                    bRet = true;
                }
            }
            return (item.first == null) && bRet;
        })
    }

    /**
     * 限时过期前的数据
     */
    private _showBefore(timeStamp: number, goodsid: Array<number>): void {
        this.itemList = PDKGameConfig.exchangeConfig.filter((item: any) => {
            item.timeStamp = timeStamp;

            let bRet = false;
            for (let i = 0; i < goodsid.length; ++i) {
                if (item.goodsid == goodsid[i]) {
                    bRet = true;
                }
            }
            return (item.after == null) && bRet;
        })
    }

    createChildren(): void {
        super.createChildren();

        //this.width = this.stage.stageWidth;
        //this.height = this.stage.stageHeight;

        this.percentWidth = 100;
        this.percentHeight = 100;

        //        let layout: eui.TileLayout = <eui.TileLayout>this.list.layout;
        //        layout.columnWidth = (this.stage.stageWidth - 40) / 3;

        // var tmp:Array<any>;
        //this.initItemListData();

        this.lv_goods.dataProvider = this._dataProvide = new eui.ArrayCollection();
        this.lv_history.dataProvider = this._historyProvide = new eui.ArrayCollection();
        this.lv_history.itemRenderer = PDKFeiHistoryItem;
        this._isReqHistory = false;
        this.hisoryInfoScroller.addEventListener(egret.Event.CHANGE, this._onHistoryScroll, this);
        this.onResize(null);
        this.lv_goods.itemRenderer = PDKShopItem;
        /*if(!this._dataProvide){;
            // this.itemList.push(this.itemList[0]);
        }
        */
        //
        let e: PDKalien.PDKEventManager = PDKEventManager.instance;
        //        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.MY_USER_INFO_UPDATE, this.onMyUserInfoUpdate, this);
        //        e.registerOnObject(this, this.grpButton, egret.TouchEvent.TOUCH_TAP, this.onGrpButtonTap, this);
        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.MY_USER_INFO_UPDATE, this.onMyUserInfoUpdate, this);
        e.registerOnObject(this, this.btn_history, egret.TouchEvent.TOUCH_TAP, this.onHistory, this);
        e.registerOnObject(this, this.close_group, egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        // e.registerOnObject(this,this.tit_img,egret.TouchEvent.TOUCH_TAP,this.onClickTit,this);

        e.registerOnObject(this, this.flagGoldImg, egret.TouchEvent.TOUCH_TAP, this._onClickGoldGroup, this);
        e.registerOnObject(this, this.flagDiamondImg, egret.TouchEvent.TOUCH_TAP, this._onClickDiamondGroup, this);
        e.registerOnObject(this, this.flagExchangeImg, egret.TouchEvent.TOUCH_TAP, this._onClickExchangeGroup, this);
        e.registerOnObject(this, this.btn_recorder, egret.TouchEvent.TOUCH_TAP, this.onRecorderClick, this);
        e.registerOnObject(this, this.redExchangeImg, egret.TouchEvent.TOUCH_TAP, this._onClickExchange, this);
        e.registerOnObject(this, this.flagJdImg, egret.TouchEvent.TOUCH_TAP, this._onClickJD, this);
        e.registerOnObject(this, this.flagRedImg, egret.TouchEvent.TOUCH_TAP, this._onClickRed, this);
        e.registerOnObject(this, this.flagExImg, egret.TouchEvent.TOUCH_TAP, this._onClickExHistory, this);
        e.registerOnObject(this, PDKalien.StageProxy.stage, egret.Event.RESIZE, this.onResize, this);
        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.BAG_INFO_REFRESH, this._onBagRefresh, this);
        this._initJD();
        this._initH5();
    }

    private onResize(e: egret.Event): void {
        //        let layout: eui.TileLayout = <eui.TileLayout>this.lv_goods.layout;
        //        layout.columnWidth = (this.stage.stageWidth - 40) / 3;
    }

    /**
     * 显示金豆页
     */
    private _showGold(): void {

        this.currentState = "gold";
        let _arr = [];
        let _cfg = PDKGameConfig.rechargeConfig;
        //金豆界面不显示首充礼包
        for (let i = 0; i < _cfg.length; ++i) {
            if (!_cfg[i].firstrecharge && _cfg[i].item_type == 1) //金豆
            {
                _arr.push(_cfg[i]);
            }
        }
        this._dataProvide.source = _arr;
        this._dataProvide.refresh();
    }
    /**
     * 显示钻石标签页
     */
    private _showDiamond(): void {
        let _arr = [];
        let _cfg = PDKGameConfig.rechargeConfig;
        //钻石界面不显示复活礼包
        for (let i = 0; i < _cfg.length; ++i) {
            if (_cfg[i].product_id != 10009 && _cfg[i].item_type == 3) //钻石
            {
                _arr.push(_cfg[i]);
            }
        }

        this._dataProvide.source = _arr;
        this._dataProvide.refresh();

        this.currentState = "diamond";
    }

    /**
     * 显示兑换
     */
    private _showExchange(): void {
        this.currentState = "card";
        this.updateExchangeList();
    }

    /**
     * 显示京东
     */
    private _showJD(): void {
        this.currentState = "jd";
        this.updateJDList();
    }

    /**
     * 点击金豆
     */
    private _onClickGoldGroup(): void {
        this._showGold();
    }

    /**
     * 点击钻石
     */
    private _onClickDiamondGroup(): void {
        this._showDiamond();
    }

    /**
     * 点击兑换
     */
    private _onClickExchangeGroup(): void {
        this._showExchange();
    }

    private onHistory() {
        PDKPanelExchange3.instance.show();
    }

    private onClose() {
        this.close();
    }

    /**
     * 当我的玩家信息
     * @param event
     */
    private onMyUserInfoUpdate(event: egret.Event = null): void {
        let userInfoData: PDKUserInfoData = event ? event.data.userInfoData : this._self;
        let _nDiamond: any = PDKBagService.instance.getItemCountById(3);
        this.gold.updateGold(userInfoData.gold);
        this.diamond.updateGold(_nDiamond);
        this.avatar.imageId = userInfoData.imageid;
        this.avatar.setVipLevel(userInfoData.getCurVipLevel());
        if (userInfoData.nickname) {
            let _nameStr = userInfoData.nickname.substr(0, 10);
            this.labNickName.text = _nameStr + "(" + userInfoData.fakeuid + ")";
        }
        this._self.redcoin = PDKMainLogic.instance.selfData.redcoin;
        this.updateExchangeList();
        this.flashData(false);
    }
    /**
     * 点击红包栏的兑
     */
    private _onClickExchange(): void {
        this._showExchange();
    }

    /**
     * 点击京东
     */
    private _onClickJD(): void {
        this._showJD();
    }

    /**
     * 点击红包
     */
    private _onClickRed(): void {
        this._clickRedFunc();
    }

    /**
     * 点击兑换记录
     */
    private _onClickExHistory(): void {
        this._showExHistory();
    }

    public flashData(refresh: boolean = false) {
        this.lbRedCoin.text = "" + (this._self.redcoin == null ? "0.00" : PDKUtils.exchangeRatio(this._self.redcoin / 100, true));
        if (refresh) {
            for (var i = 0; i < PDKGameConfig.exchangeConfig.length; ++i) {
                if (PDKGameConfig.exchangeConfig[i].after) {
                    for (var j = 0; j < this.itemList.length; ++j) {
                        if (this.itemList[j].first) {
                            this.itemList.splice(j, 1, PDKGameConfig.exchangeConfig[i]);
                            break;
                        }
                    }
                    break;
                }
            }
            this._dataProvide.source = this.itemList;
            this._dataProvide.refresh();
        }
    }

    /**
     * 默认购买金豆的标签页
     * type:0 金豆标签页 1:钻石标签页 2:兑换标签 3:京东,4:红包,5:兑换记录
     */
    show(type: number = 0): void {
        this.popup();
        PDKEventManager.instance.enableOnObject(this);
        egret.setTimeout(() => {

            this.onMyUserInfoUpdate();
            if (type == 1) {
                this._showDiamond();
            } else if (type == 2) {
                this._showExchange();
            } else if (type == 3) {
                this._showJD();
            } else if (type == 4) {
                this._showRed();
            } else if (type == 5) {
                this._showExHistory();
            }
            else {
                this._showGold();
            }
        }, this, 50);
    }

    /**
     * 显示红包
     */
    private _showRed(): void {
        this.currentState = "red";
        this.updateRedList();
    }

    /**
     * 显示兑换话费，话费充值卡，微信红包，微信零钱，支付宝红包，支付宝零钱记录
     */
    private _showExHistory(): void {
        let self = this;
        PDKwebService.getExHistory(1, (response) => {
            self.currentState = "history";
            if (response.code == 0) {
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
    private _onHistoryScroll(e: egret.Event): void {
        if (this.hisoryInfoScroller.viewport.scrollV >= this.hisoryInfoScroller.height) {
            let _curPage = this._historyInfo.current_page;
            let _self = this;
            if (_curPage < this._historyInfo.total_page && !_self._isReqHistory) {
                _self._isReqHistory = true;
                PDKwebService.getExHistory(_curPage + 1, (response) => {
                    _self._isReqHistory = false;
                    if (response.code == 0) {
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
     * 初始化兑换话费，话费充值卡，微信红包，微信零钱，支付宝红包，支付宝零钱记录列表信息
     */
    private _initExRecordInfo(data: any): void {
        this._historyProvide.source = data;
        this._historyProvide.refresh();
    }

    close(isToShop: boolean = false): void {
        if (isToShop)
            PDKalien.PopUpManager.removePopUp(this);
        else
            super.close();
        PDKEventManager.instance.disableOnObject(this);
    }
    /**
     * 限时过期
     */
    public onTimeExpired(goodsId: Array<number>): void {
        this._showAfter(goodsId);
        this._dataProvide.source = this.itemList;
        this._dataProvide.refresh();
    }
    /**
	 * 背包更新
	*/
    private _onBagRefresh(): void {
        let _nDiamond: any = PDKBagService.instance.getItemCountById(3);
        this.diamond.updateGold(_nDiamond);
    }

    /**
     * 购买记牌器
     */
    private onRecorderClick(event: egret.TouchEvent): void {
        PDKPanelBuyRecorder.instance.show();
    }
}