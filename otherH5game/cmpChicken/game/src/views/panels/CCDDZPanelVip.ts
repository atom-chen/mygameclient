/**
 * Created by zhu on 2017/10/20.
 * VIP面板
 */

class CCDDZPanelVip extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelVip;
    public static get instance(): CCDDZPanelVip {
        if(this._instance == undefined) {
            this._instance = new CCDDZPanelVip();
        }
        return this._instance;
    }

	private levelList:eui.List;
	private vipScroll:eui.Scroller;
	private vipDataProvider:eui.ArrayCollection;
	private goodsDataProvider:eui.ArrayCollection;
	private goodScroller:eui.Scroller;
	private goodsList:eui.List;
	private STATE_BUY:number = 1;
	private STATE_GET:number = 2;
	private STATE_HASGET:number = 3;

	private _buyState:number;
	private _stateFunc:any;
	private _vipCfg:any;
	private _vipScrollDestViewH:number;
	private _vipScrollSpeedDelta:number;
	private _vipScrollInterval:number;
	constructor() {
		super(CCalien.CCDDZpopupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, CCalien.CCDDZpopupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});

		this._stateFunc = {
			[this.STATE_BUY]:{func:this._setStateBuy.bind(this),clickFunc:this._clickToBuy.bind(this)},
			[this.STATE_GET]:{func:this._setStateGet.bind(this),clickFunc:this._clickToGet.bind(this)},
			[this.STATE_HASGET]:{func:this._setStateHasGet.bind(this),clickFunc:this._clickHasGet.bind(this)},
		}
	}

    init():void {
		this.skinName = panels.CCDDZPanelVipSkin;
	}
	
	createChildren():void {
		super.createChildren();
		this._initEvent();
		this.levelList.itemRenderer = CCDDZVipLevelItemRender;
		this.goodsList.itemRenderer = CCDDZVipRewGoodsItemRender;
		this.vipDataProvider = new eui.ArrayCollection();
		this.goodsDataProvider = new eui.ArrayCollection();
		this.levelList.dataProvider = this.vipDataProvider;
		this.goodsList.dataProvider = this.goodsDataProvider;
		this["descLlabel"].text = "充值1元增加1点财富值，财富值每天会自然减少"+this._vipCfg.decline+"。";
	}

	/**
	 * 初始化事件
	 */
	private _initEvent():void{
		this.addEventListener(egret.Event.ADDED_TO_STAGE,this._onAddToStage,this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this._onRemoveFromStage,this);
	}

	private _onAddToStage():void{
		this._enableEvent(true);
		this["arrLeftGrp"]["addClickListener"](this._clickLeft, this);
		this["arrRightGrp"]["addClickListener"](this._clickRight, this);
		this["btnClose"]["addClickListener"](this._onTouchClose, this);
		this["buyGrp"]["addClickListener"](this._onClickBuy, this);
	}

	private _clickToBuy():void{
		CCDDZPanelExchange2.instance.show();
	}

	private _clickToGet():void{
		ccserver.reqGetVipRew();
	}

	private _clickHasGet():void{
	}

	/**
	 * 当前VIP的奖励
	 */
	private _showGoodsScroller(bShow:boolean):void{
		this["goodScroller"].visible = bShow;
	}

	/**
	 * 显示无奖励的描述
	 */
	private _showNoRew(bShow:boolean):void{
		this["noRewLabel"].visible = bShow;
	}

	/**
	 * 去购买
	 */
	private _setStateBuy():void{
		this["buyImg"].source = "cc_vip_buy";
		this["buyGrp"].touchEnabled = true;
	}

	/**
	 * 领取
	 */
	private _setStateGet():void{
		this["buyImg"].source = "cc_vip_getRew";
		this["buyGrp"].touchEnabled = true;
	}

	/**
	 * 已领取
	 */
	private _setStateHasGet():void{
		this["buyImg"].source = "cc_room_getGray";
		this["buyGrp"].touchEnabled = false;
	}

	private _onRemoveFromStage():void{
		this._enableEvent(false);
	}

	private _setProNum(nCur,nTot):void{
		this["proLabel"].text = nCur + "/" + nTot;
		let nWidth = 0;
		if(nCur >= nTot){
			nWidth = this["proBgImg"].width
		}else{
			nWidth = this["proBgImg"].width * (nCur/nTot);
		}
		this["proImg"].width = nWidth;
	}

	private _setCurLevelTit(sTit):void{
		this["levelTit"].text = sTit;
	}

	private _showNoRewDesc(bShow:boolean):void{
		this["noRewDesc"].visible = bShow;
	}

	private _showCurLevel(nLevel:number):void{
		this["curLevelGrp"].visible = (nLevel>=1);
		this["curLevelLabel"].text = "" + nLevel;
	}
	
	private _showNextLevel(nLevel:number):void{
		if(nLevel > this._vipCfg.nMax){
			this["nextLevelGrp"].visible = false;
			return;
		}
		this["nextLevelLabel"].text = "" + nLevel;
		this["nextLevelGrp"].visible = true;
	}

	private _setCurLevel(nLevel):void{
		this["curLevelLabel"].text = "" + nLevel;
	}

	private _showArrLeft(bShow:boolean):void{
		this["arrLeftGrp"].visible = bShow;
	}

	private _showArrRight(bShow:boolean):void{
		this["arrRightGrp"].visible = bShow;
	}
	
	/**
	 * 普通
	 */
	private _showLevelNor(bShow:boolean):void{
		this["leveNorlTit"].visible = bShow;
	}

	private _clickLeft():void{
		let selLevel = this.levelList.selectedIndex + 1;
		this._updateUIByLevel(selLevel - 1);
	}

	private _clickRight():void{
		let selLevel = this.levelList.selectedIndex + 1;
		this._updateUIByLevel(selLevel + 1);
	}

	private _onClickBuy():void{
		this._stateFunc[this._buyState].clickFunc();
	}

	private _updateUIByLevel(nLevel,bAni:boolean = true):void{
		let showLeftArr = true;
		let showRightArr = true;
		if(nLevel <= 1){
			showLeftArr = false;
			nLevel = 1;
		}else if(nLevel >= this._vipCfg.nMax){
			showRightArr = false;
			nLevel = this._vipCfg.nMax;
		}
	
		this._showArrLeft(showLeftArr);
		this._showArrRight(showRightArr);
		let idx = nLevel - 1;
		this._vipScrollDestViewH = 740 * idx;
		if(idx > this.levelList.selectedIndex){
			this._vipScrollSpeedDelta = 100;
		}else{
			this._vipScrollSpeedDelta = -100; 
		}
		this.levelList.selectedIndex = idx;
		if(bAni){
			this._startMove();
		}else{
			this._stopMove();
			this._setToDestViewH();
		}
	}

	private _setToDestViewH():void{
		this.vipScroll.viewport.scrollH = this._vipScrollDestViewH;
	}

	private _startMove():void{
		this._stopMove();
		this._vipScrollInterval = egret.setInterval(()=>{
			this.vipScroll.viewport.scrollH += this._vipScrollSpeedDelta;
			if(this._vipScrollSpeedDelta > 0){
				if(this.vipScroll.viewport.scrollH >= this._vipScrollDestViewH){
					this._setToDestViewH();
					this._stopMove();
				}
			}else{
				if(this.vipScroll.viewport.scrollH <= this._vipScrollDestViewH){
					this._setToDestViewH();
					this._stopMove();
				}
			}
		},this,20);
	}

	private _stopMove():void{
		egret.clearInterval(this._vipScrollInterval);
	}

	/**
	 * 点击关闭
	 */
	private _onTouchClose():void{
		this._stopMove();
		this.dealAction();
	}

	/**
	 * 使能 事件
	 */
	private _enableEvent(bEnable:boolean):void{
		let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
		
		ccserver[_func](CCGlobalEventNames.USER_GET_REWARD_REP, this._onRecvGetRewRep, this);
	}

	/**
	 * 
	 */
	private _onRecvGetRewRep(e:egret.Event):void{
        let data = e.data;
		let desc = "";
        if(data.optype == 9){
            if(data.result == 0 ||data.result == null){
				let tit = "领取VIP奖励成功!";
				if(data.strreward){
					let text = "(您的当前等级为<font color='#E10000'>VIP" + CCDDZMainLogic.instance.selfData.getCurVipLevel() + "</font>)" ;
					let textFlow = new egret.HtmlTextParser().parser(text);
					let goods = CCDDZUtils.parseGoodsString(data.strreward)
					CCDDZPanelItems.instance.show(tit,0x1A1A1A,goods,"",0x7f3000,0,null,"center",textFlow);
				}
				this._setStateHasGet();
			}else{
				desc = "领取失败:" +  data.result;
				CCDDZAlert.show(desc);
			}

		}
	}

	private _formatVipCfg():void{
		let vipCfg = CCGlobalGameConfig.getCfgByField("vip_config");
		let len = vipCfg.upgrade.length;
		let up = vipCfg.upgrade;
		let data:any;
		this._vipCfg = {nMax:len,info:[],level:{},decline:vipCfg.decline};
		for(let i=0;i<len;++i){
			let rew = CCDDZUtils.parseGoodsString(up[i].reward);
			data = {level:i+1,exp:up[i].exp,rew:rew};
			this._vipCfg.info.push(data);
			this._vipCfg.level[i+1] = data;
		}
	}

	/**
	 * 显示VIP面板
	 */
	public show():void{
		this._formatVipCfg();
		this.popup();
		let selfData = CCDDZMainLogic.instance.selfData;
		let myLevel = selfData.getCurVipLevel();
		let myExp = selfData.getCurExp();
		let pro:any;
		let nextLevel = myLevel + 1;
		if(nextLevel > this._vipCfg.nMax){
			nextLevel = this._vipCfg.nMax;
		}

		this._showCurLevel(myLevel);
		this._showNextLevel(nextLevel);
		if(myLevel >= 1 ){
			if(myLevel > this._vipCfg.nMax){
				console.error("--------------------->",myLevel);
				return;
			}
			pro = this._vipCfg.level[nextLevel];
			this._showNoRewDesc(false);
			this._showGoodsScroller(true);
			this._showLevelNor(false);
			this.goodsDataProvider.source = this._vipCfg.level[myLevel].rew;
			if(selfData.hasGetTodayVipRew()){
				this._buyState = this.STATE_HASGET;
			}else{
				this._buyState = this.STATE_GET;
			}
		}else{
			this._showLevelNor(true);
			this._showNoRewDesc(true);
			this._showGoodsScroller(false);
			this._buyState = this.STATE_BUY;
			pro = this._vipCfg.level[1];
		}

		this._setProNum(myExp,pro.exp);
		this._stateFunc[this._buyState].func();
		this.vipDataProvider.source = this._vipCfg.info;
		this._updateUIByLevel(myLevel,false);
	}
}

class CCDDZVipLevelItemRender extends eui.ItemRenderer{
	private avatar:CCDDZAvatar;
	private levelLabel:eui.Label;
	private titLabel:eui.Label;
	private descLabel:eui.Label;

	createChildren():void {
		super.createChildren();
	}

	dataChanged():void{
		super.dataChanged();
		let data = this.data;
		this.levelLabel.text = "VIP" + data.level;
		this.titLabel.text = "VIP" + data.level + "等级特权(财富值达到" + data.exp +")";
		this.avatar.imageId = CCDDZMainLogic.instance.selfData.imageid;
		let rew = data.rew;
		let len = rew.length;
		let sText = "";
		for(let i=0;i<len;++i){
			let goodInfo = CCDDZGoodsManager.instance.getGoodsById(rew[i].id);
			sText += ""+ (i + 1)+".每天领取";
			if(rew[i].id == 2){
				if(rew[i].count % 60 == 0){
					sText += (rew[i].count/60) + "小时"
				}else{
					sText += rew[i].count + "分钟"
				}

				sText += goodInfo.name + "\n";
			}else{
				sText += rew[i].count + goodInfo.name + "\n";
			}
		}
		this.descLabel.text = sText;
	}
}

class CCDDZVipRewGoodsItemRender extends eui.ItemRenderer{
	private goodsItem:CCDDZGoodsItem;

	createChildren():void {
		super.createChildren();
		this.scaleX = this.scaleY = 0.9;
	}

	protected dataChanged():void {
		super.dataChanged();
		let data:any = this.data;
		this.goodsItem.setData(data);
	}
}