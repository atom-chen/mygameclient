/**
 * 小游戏界面
 * @author 
 *
 */

class CCDDZPanelSmallGame extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelSmallGame;
    public static get instance(): CCDDZPanelSmallGame {
        if (this._instance == undefined)
        {
            this._instance = new CCDDZPanelSmallGame();
        }
        return this._instance;
    }

    public lvGames: eui.List;

    private close_group: eui.Group;
    /**
     * 个人信息的红包栏
     */
    private grpRedcoin:eui.Group;
    /**
     * 红包余额
     */
    private lbRedCoin: eui.Label;
    private _self: CCGlobalUserInfoData;
    private gold: CCDDZGold;
	/**
	 * 钻石
	 */
	private diamond:CCDDZGold;
    private avatar: CCDDZAvatar;

    protected _dataProvide:eui.ArrayCollection;
    //兑换按钮
    private redExchangeImg:eui.Image;
    //商城
    private rechargeBtn:eui.Button;
    private itemInfoScroller:eui.Scroller;

    protected init(): void {
        this.skinName = panels.CCDDZPanelSmallGameSkin;
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
        this.percentWidth = 100;
        this.percentHeight = 100;
        this.lvGames.dataProvider = this._dataProvide = new eui.ArrayCollection();
        this.lvGames.itemRenderer = CCDDZSmallGameItem;
        this.gold.bgImg.source = "cc_smallgame_userData_bg";
        this.diamond.bgImg.source = "cc_smallgame_userData_bg";
        this.avatar.bg_img.source = "cc_smallgame_user_img_bg"
    }

    private _addClickEvent():void{
        let func = "addClickListener"
        this["close_group"][func](this.onClose, this);
        this["gold"][func](this._onClickGold, this);
        this["diamond"][func](this._onClickDiamond, this);
        this["redExchangeImg"][func](this._onClickExchange,this);
        this["grpRedcoin"][func](this._onClickRed,this);
        this["rechargeGroup"][func](this._onClickRecharge,this);
        this["signBtn"][func](this._onClickSign,this);
        this["keFuBtn"][func](this._onClickKefu,this);
        this["settingBtn"][func](this._onClickSetting,this);
    }

    private _enableEvent(bEnable):void{
        let func = "addEventListener"
        if(!bEnable){
            func = "removeEventListener"
        }
        CCalien.CCDDZDispatcher[func](CCGlobalEventNames.MY_USER_INFO_UPDATE,this.onMyUserInfoUpdate,this);
		CCalien.CCDDZDispatcher[func](CCGlobalEventNames.BAG_INFO_REFRESH,this._onBagRefresh,this);
    }
        /**
     * 点击设置
     */
    private _onClickSetting():void{
        CCDDZPanelSetting.instance.show();
    }
    
    /**
     * 点击签到
     */
    private _onClickSign():void{
        CCDDZPanelSign.getInstance().show();
    }

    /**
     * 点击客服
     */
    private _onClickKefu():void{
        CCGlobalGameConfig.showKeFu();
    }

    protected onSelectGame(event:egret.Event):void{
		let selectGame = this.lvGames.selectedItem;

		egret.callLater(()=>{
			this.lvGames.selectedIndex = -1;
		}, this);
	}

    private onClose() {
        this._enableEvent(false) 
        this.close();
    }
    
    /**
     * 当我的玩家信息
     * @param event
     */
    private onMyUserInfoUpdate(event: egret.Event = null): void {
        let userInfoData: CCGlobalUserInfoData = event ? event.data.userInfoData : this._self;
        let _nDiamond:any = CCDDZBagService.instance.getItemCountById(3);
        this.gold.updateGold(userInfoData.gold);
        this.diamond.updateGold(_nDiamond);
        this.avatar.imageId = userInfoData.imageid;
        this.avatar.setVipLevel(userInfoData.getCurVipLevel());
        if(userInfoData.nickname) {
            //let _nameStr = userInfoData.nickname.substr(0,10);
            //this.labNickName.text =  _nameStr + "(" + userInfoData.fakeuid + ")";
         }
        this._self.redcoin = CCDDZMainLogic.instance.selfData.redcoin;
        this.lbRedCoin.text = "" + (this._self.redcoin == null ? "0.00" : CCDDZUtils.exchangeRatio(this._self.redcoin/100,true));
    }
    /**
     * 点击红包栏的兑
     */
    private _onClickExchange():void{
        CCDDZPanelExchange2.instance.show(CCDDZ_EX_ID_WXRED)
    }

    /**
     * 商城金豆
     */
    private _onClickGold():void{
        CCDDZPanelExchange2.instance.show();
    }

    /**
     * 商城钻石
     */
    private _onClickDiamond():void{
        CCDDZPanelExchange2.instance.show(1);
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
        CCDDZPanelExchange2.instance.show(CCDDZ_EX_ID_WXRED)
    }

    /**
     * 点击商城
     */
    private _onClickRecharge():void{
        CCDDZPanelExchange2.instance.show();
    }

    /**
     * 背包更新
    */
    private _onBagRefresh():void{
        let _nDiamond:any = CCDDZBagService.instance.getItemCountById(3);
        this.diamond.updateGold(_nDiamond);
    }
    private _toZCJ():void{
        CCDDZMainLogic.instance.setWillToGame(CCDDZ_T_G_NIU);
        ccserver.checkReconnect();
    }
    private _toFFF(roomInfo):void{
        this.onClose()
        CCDDZMainLogic.instance.toFFF();
    }
    private _toLLT(roomInfo):void{
        this.onClose()
        CCDDZMainLogic.instance.toLLT();
    }
    private _toLLK(roomInfo):void{
        CCDDZMainLogic.instance.setWillToGame(CCDDZ_T_G_LLK);
        ccserver.checkReconnect();
    }
    private _to2048(roomInfo):void{
        CCDDZMainLogic.instance.setWillToGame(CCDDZ_T_G_2048);
        ccserver.checkReconnect();
    }
    private _toFFL(roomInfo):void{
        CCDDZMainLogic.instance.setWillToGame(CCDDZ_T_G_FFL);
        ccserver.checkReconnect();
    }

    private _initGameList():void{
        let list = []

        let zcj = CCGlobalGameConfig.getRoomCfgFromAll(4001);
        zcj.roomIcon = "cc_smallgame_game_excite";
        zcj.func = this._toZCJ.bind(this,zcj);
        list.push(zcj)

        let fffCfg = CCGlobalGameConfig.getCfgByField("webCfg.fff");
        if (fffCfg && fffCfg.status == 1) {
            let fff:any = {};
            fff.roomIcon = "cc_smallgame_game_turn";
            fff.func = this._toFFF.bind(this,fff);
            list.push(fff)
        }

        let lltCfg = CCGlobalGameConfig.getCfgByField("webCfg.llt");
        if (lltCfg && lltCfg.status == 1) {
            let llt:any = {};
            llt.roomIcon = "cc_smallgame_game_explore";
            llt.func = this._toLLT.bind(this,llt);
            list.push(llt)
        }
        //llk
        let _llkCfg = CCGlobalGameConfig.getRoomCfgFromAll(20001);
        _llkCfg.roomIcon = "cc_smallgame_game_link";
        _llkCfg.func = this._toLLK.bind(this,_llkCfg);
        list.push(_llkCfg)
        //2048
        let _2048Cfg = CCGlobalGameConfig.getRoomCfgFromAll(21001);
        _2048Cfg.roomIcon = "cc_smallgame_game_2048";
        _2048Cfg.func = this._to2048.bind(this,_2048Cfg);
        list.push(_2048Cfg)
        //ffl
        let _fflCfg = CCGlobalGameConfig.getRoomCfgFromAll(22001);
        _fflCfg.roomIcon = "cc_smallgame_game_hturn";
        _fflCfg.func = this._toFFL.bind(this,_fflCfg);
        list.push(_fflCfg)

        this._dataProvide.source = list;
    }

    show(): void {
        CCDDZMainLogic.instance.setScreenLandScape(1280,640);
        this.popup();
        this._addClickEvent();
        this._enableEvent(true);
        this._initGameList();
        CCDDZEventManager.instance.enableOnObject(this);
        egret.setTimeout(()=>{
            this.onMyUserInfoUpdate();
        },this,50);
    }
}


class CCDDZSmallGameItem extends eui.ItemRenderer{
    //小游戏图标
    private iconImg:eui.Image;

    private onClickGame():void{
        if (this.data){
            this.data.func();
        }
    }
    
    protected dataChanged(): void {
        super.dataChanged();
        let data  = this.data;

        this["addClickListener"](this.onClickGame, this,false);
        this.iconImg.source = data.roomIcon
    }
}