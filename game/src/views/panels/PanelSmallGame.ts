/**
 * 小游戏界面
 * @author 
 *
 */

class PanelSmallGame extends alien.PanelBase {
    private static _instance: PanelSmallGame;
    public static get instance(): PanelSmallGame {
        if (this._instance == undefined)
        {
            this._instance = new PanelSmallGame();
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
    private _self: UserInfoData;
    private gold: Gold;
	/**
	 * 钻石
	 */
	private diamond:Gold;
    private avatar: Avatar;

    protected _dataProvide:eui.ArrayCollection;
    //兑换按钮
    private redExchangeImg:eui.Image;
    //商城
    private rechargeBtn:eui.Button;
    private itemInfoScroller:eui.Scroller;

    protected init(): void {
        this.skinName = panels.PanelSmallGameSkin;
        this._self = MainLogic.instance.selfData;
    }


    constructor() {
        super(
            alien.popupEffect.Fade, {},
            alien.popupEffect.Fade, {}
        );
    }

   
    createChildren(): void {
        super.createChildren();
        this.percentWidth = 100;
        this.percentHeight = 100;
        this.lvGames.dataProvider = this._dataProvide = new eui.ArrayCollection();
        this.lvGames.itemRenderer = SmallGameItem;
        this.gold.bgImg.source = "smallgame_userData_bg";
        this.diamond.bgImg.source = "smallgame_userData_bg";
        this.avatar.bg_img.source = "smallgame_user_img_bg"
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
        alien.Dispatcher[func](EventNames.MY_USER_INFO_UPDATE,this.onMyUserInfoUpdate,this);
		alien.Dispatcher[func](EventNames.BAG_INFO_REFRESH,this._onBagRefresh,this);
    }
        /**
     * 点击设置
     */
    private _onClickSetting():void{
        PanelSetting.instance.show();
    }
    
    /**
     * 点击签到
     */
    private _onClickSign():void{
        PanelSign.getInstance().show();
    }

    /**
     * 点击客服
     */
    private _onClickKefu():void{
        GameConfig.showKeFu();
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
        let userInfoData: UserInfoData = event ? event.data.userInfoData : this._self;
        let _nDiamond:any = BagService.instance.getItemCountById(3);
        this.gold.updateGold(userInfoData.gold);
        this.diamond.updateGold(_nDiamond);
        this.avatar.imageId = userInfoData.imageid;
        this.avatar.setVipLevel(userInfoData.getCurVipLevel());
        if(userInfoData.nickname) {
            //let _nameStr = userInfoData.nickname.substr(0,10);
            //this.labNickName.text =  _nameStr + "(" + userInfoData.fakeuid + ")";
         }
        this._self.redcoin = MainLogic.instance.selfData.redcoin;
        this.lbRedCoin.text = "" + (this._self.redcoin == null ? "0.00" : Utils.exchangeRatio(this._self.redcoin/100,true));
    }
    /**
     * 点击红包栏的兑
     */
    private _onClickExchange():void{
        PanelExchange2.instance.show(EX_ID_WXRED)
    }

    /**
     * 商城金豆
     */
    private _onClickGold():void{
        PanelExchange2.instance.show();
    }

    /**
     * 商城钻石
     */
    private _onClickDiamond():void{
        PanelExchange2.instance.show(1);
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
        PanelExchange2.instance.show(EX_ID_WXRED)
    }

    /**
     * 点击商城
     */
    private _onClickRecharge():void{
        PanelExchange2.instance.show();
    }

    /**
     * 背包更新
    */
    private _onBagRefresh():void{
        let _nDiamond:any = BagService.instance.getItemCountById(3);
        this.diamond.updateGold(_nDiamond);
    }
    private _toZCJ():void{
        MainLogic.instance.setWillToGame(T_G_NIU);
        server.checkReconnect();
    }
    private _toFFF(roomInfo):void{
        this.onClose()
        MainLogic.instance.toFFF();
    }
    private _toLLT(roomInfo):void{
        this.onClose()
        MainLogic.instance.toLLT();
    }
    private _toLLK(roomInfo):void{
        MainLogic.instance.setWillToGame(T_G_LLK);
        server.checkReconnect();
    }
    private _to2048(roomInfo):void{
        MainLogic.instance.setWillToGame(T_G_2048);
        server.checkReconnect();
    }
    private _toFFL(roomInfo):void{
        MainLogic.instance.setWillToGame(T_G_FFL);
        server.checkReconnect();
    }
    private _toFD(roomInfo):void{
        MainLogic.instance.setWillToGame(T_G_FD);
        server.checkReconnect();
    }

    private _toBJ(): void {
        MainLogic.instance.setWillToGame(T_G_BJ);
        server.checkReconnect();          
    }

    private _initGameList():void{
        let list = []

        let zcjCfg = GameConfig.getCfgByField("webCfg.zcj");
        if (zcjCfg && zcjCfg.status == 1) {
            let zcjcfg = GameConfig.getRoomCfgFromAll(4001);
            zcjcfg.roomIcon = "smallgame_game_excite";
            zcjcfg.func = this._toZCJ.bind(this,zcjcfg);
            list.push(zcjcfg)
        }

        let fffCfg = GameConfig.getCfgByField("webCfg.fff");
        if (fffCfg && fffCfg.status == 1) {
            let fff:any = {};
            fff.roomIcon = "smallgame_game_turn";
            fff.func = this._toFFF.bind(this,fff);
            list.push(fff)
        }

        let lltCfg = GameConfig.getCfgByField("webCfg.llt");
        if (lltCfg && lltCfg.status == 1) {
            let llt:any = {};
            llt.roomIcon = "smallgame_game_explore";
            llt.func = this._toLLT.bind(this,llt);
            list.push(llt);
        }

        //llk
        let _llkCfg = GameConfig.getCfgByField("webCfg.llk");        
        if (_llkCfg && _llkCfg.status == 1) {
            let _llkcfg = GameConfig.getRoomCfgFromAll(20001);
            _llkcfg.roomIcon = "smallgame_game_link";
            _llkcfg.func = this._toLLK.bind(this,_llkcfg);
            list.push(_llkcfg);
        }

        let _2048Cfg = GameConfig.getCfgByField("webCfg.2048");
        //2048
        if (_2048Cfg && _2048Cfg.status == 1) {
            let _2048cfg = GameConfig.getRoomCfgFromAll(21001);
            _2048cfg.roomIcon = "smallgame_game_2048";
            _2048cfg.func = this._to2048.bind(this,_2048cfg);
            list.push(_2048cfg);
        }

        let _fflCfg = GameConfig.getCfgByField("webCfg.ffl");
        //ffl
        if (_fflCfg && _fflCfg.status == 1) {
            let _fflcfg = GameConfig.getRoomCfgFromAll(22001);
            _fflcfg.roomIcon = "smallgame_game_hturn";
            _fflcfg.func = this._toFFL.bind(this,_fflcfg);
            list.push(_fflcfg)
        }
        
        let fdCfg = GameConfig.getCfgByField("webCfg.knife");
        //fd
        if (fdCfg && fdCfg.status == 1) {
            let _fdcfg = GameConfig.getRoomCfgFromAll(24000);
            _fdcfg.roomIcon = "smallgame_game_knife";
            _fdcfg.func = this._toFD.bind(this,_fdcfg);
            list.push(_fdcfg)
        }

        let stCfg = GameConfig.getCfgByField("webCfg.st");
        //st
        if(stCfg && stCfg.status == 1) {
            let _stcfg = {roomIcon: "smallgame_game_three", func: null }
            _stcfg.func = this._toBJ.bind(this,_stcfg);
            list.push(_stcfg);
        }

        this._dataProvide.source = list;
    }

    show(): void {
        MainLogic.instance.setScreenLandScape(1280,640);
        this.popup();
        this._addClickEvent();
        this._enableEvent(true);
        this._initGameList();
        EventManager.instance.enableOnObject(this);
        egret.setTimeout(()=>{
            this.onMyUserInfoUpdate();
        },this,50);
    }
}


class SmallGameItem extends eui.ItemRenderer{
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