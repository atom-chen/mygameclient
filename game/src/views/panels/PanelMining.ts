/**
 * Created by zhu on 2017/11/16.
 * 挖矿
 */

class PanelMining extends alien.PanelBase {
	public static MINING_FLAG_REC:number = 1;
	public static MINING_FLAG_RULE:number = 2;
	public static MINING_FLAG_MINING:number = 3;
	public static MINING_FLAG_RANK:number = 4;

    private static _instance: PanelMining;
	private miningRadio:eui.RadioButton;
	private ruleRadio:eui.RadioButton;
	private recRadio:eui.RadioButton;
	private rankRadio:eui.RadioButton;
	private totGetLabel0:eui.Label;
	private todayLuckLabel0:eui.Label;
	private yesterdayLuckLabel0:eui.Label;
	private yesterDayTotLabel:eui.Label;
	private ruleCtxLabel:eui.Label;
	private mPro_label:eui.Label;
	private mPro_img:eui.Image;
	private mProBg_img:eui.Image;
	private recList:eui.List;
	private rankList:eui.List;
	private _flagFunc:any;
	private _info:any;

	private _dataProvider:eui.ArrayCollection;
	private _rankData:eui.ArrayCollection;
	private rankScroller:eui.Scroller;
	
	constructor() {
		super(alien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, alien.popupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});
	}
	public static get instance():PanelMining {
		if (this._instance == undefined) {
			this._instance = new PanelMining();
		}
		return this._instance;
	}
    init():void {
		this.skinName = panels.PanelMiningSkin;
		this._flagFunc = {
			[PanelMining.MINING_FLAG_MINING]:this._toMining.bind(this),
			[PanelMining.MINING_FLAG_REC]:this._toRec.bind(this),
			[PanelMining.MINING_FLAG_RULE]:this._toRule.bind(this),
			[PanelMining.MINING_FLAG_RANK]:this._toRank.bind(this)
		}
		this._rankData = new eui.ArrayCollection();
		this._dataProvider = new eui.ArrayCollection();
		this.rankList.itemRenderer = MiningRankItemRender;
		this.rankList.dataProvider = this._rankData;
		this.recList.itemRenderer = MiningItemRender;
		this.recList.dataProvider = this._dataProvider;
	}
	
	createChildren():void {
		super.createChildren();
		this._enableEvent(true);
		this._addClickFunc();
	}

	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
		PanelMining._instance = null;
	}

	private _addClickFunc():void{
		let func = "addClickListener";
		this["closeImg"][func](this._onClickClose,this);
	}

	private onRadioSelChange(event:egret.Event):void{
		let rbGroup:eui.RadioButtonGroup = event.target;
        let val = rbGroup.selectedValue;
        switch(val){
			case "mining":
				this._toMining();
				break;
			case "rule":
				this._toRule();
				break;
			case "rec":
				this._toRec();
				break;
			case "rank":
				this._toRank();
				break;
		}
	}

	private _onClickClose():void{
		this.close();
	}

	/**
	 * 使能 事件
	 */
	private _enableEvent(bEnable:boolean):void{
		let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
		
		this.miningRadio.group[_func](egret.Event.CHANGE,this.onRadioSelChange,this);
		this.ruleRadio.group[_func](egret.Event.CHANGE,this.onRadioSelChange,this);
		this.recRadio.group[_func](egret.Event.CHANGE,this.onRadioSelChange,this);
		this.rankRadio.group[_func](egret.Event.CHANGE,this.onRadioSelChange,this);
		this.rankScroller.addEventListener(egret.Event.CHANGE,this._onListScroll,this)
	}

	private _toRec():void{
		this.recRadio.selected = true;
		this.currentState = "rec";
		this.validateProperties();
		this._updateMyRec();
	}

	private _toMining():void{
		this.miningRadio.selected = true;
		this.currentState = "mining";
		this.validateProperties();
		let rankList = this._info.luck_ranking;
		if(rankList && rankList.length >= 3){
			this["nick1Label"].text = rankList[0].nickname;
			this["nick2Label"].text = rankList[1].nickname;
			this["nick3Label"].text = rankList[2].nickname;
			this["avatar1"].imageId = rankList[0].headimgurl; 
			this["avatar2"].imageId = rankList[1].headimgurl;
			this["avatar3"].imageId = rankList[2].headimgurl;
		}
		this._setMyMiningInfo();
	}

	private _toRule():void{
		this.ruleRadio.selected = true;
		this.currentState = "rule";
		this.validateProperties();
	}

	private _toRank():void{
		this.rankRadio.selected= true;
		this.currentState = "rank";
		this.validateProperties();
		this._toRankTop();
		this._rankData.source = [].concat(this._info.self_ranking,this._info.ranking.slice(0,10));
	}

	private _toRankTop():void{
		this.rankScroller.stopAnimation();
		this.rankScroller.viewport.scrollV = 0; 
	}

    private _onListScroll(e:egret.Event):void{
		let offsetY = this.rankScroller.viewport.scrollV + this.rankScroller.height;
        if( offsetY >= this.rankScroller.viewport.contentHeight){
			let hasLen = this._rankData.source.length;
			let totLen = this._info.ranking.length;
			if(hasLen < this._info.ranking.length){
				let _endIdx = hasLen + 11;
				if(_endIdx > totLen + 1){
					_endIdx = totLen+1;
				}
				this._rankData.source = this._rankData.source.concat(this._info.ranking.slice(hasLen,_endIdx));
			}
        }
    }

	private _setStateByFlag(flag):void{
		if(this._flagFunc[flag]){
			this._flagFunc[flag]();
		}
	}

	private _setTodayLuck(num):void{
		this.todayLuckLabel0.text = num
	}

	private _setYesterdayGet(num):void{
		this.yesterDayTotLabel.text = num;
	}

	private _setTotGet(num):void{
		this.totGetLabel0.text = num;
	}
	
	private _setYesterDayLuck(num):void{
		this.yesterdayLuckLabel0.text = num;
	}

	private _setRule(ctx):void{
		this.ruleCtxLabel.text = ctx;
	}

	private _setPro(nPro:number):void{
		this.mPro_label.text = nPro + "/100";
		let _fPro = nPro / 100;
		if(_fPro >= 1){
			this.mPro_img.width = this["proGrp"].width;
		}
		else{
			this.mPro_img.width = _fPro * this["proGrp"].width;
		}
	}

	private _initUI():void{
		this._updateMyRec();
		this._setMyMiningInfo();
	}

	private _updateMyRec():void{	
		this._dataProvider.source = (this._info.list||[]);
	}

	private _setMyMiningInfo():void{
		this._setTodayLuck(this._info.luck_num);
		this._setYesterdayGet((this._info.yesterday_profit ||0));
		this._setTotGet((this._info.sum_profit||0));
		this._setYesterDayLuck(this._info.yesterday_luck_prize||0);
		this._setRule((this._info.rule||""));
		this._setPro((this._info.rate||0));
	}

	private _formatRecList():void{
		if(this._info.list){
			let len = this._info.list.length;
			for(let i=0;i<len;++i){
				if(i%2 == 0){
					this._info.list[i].showBg = true;
				}
			}
		}
	}

	/**
	 * 类型和flag相同
	 */
	public show(type:number = PanelMining.MINING_FLAG_MINING,data):void{
		this._info = data;
		this._formatRecList();
		this._initUI();
		this.popup();
		this._setStateByFlag(type);
	}
}

class MiningItemRender extends eui.ItemRenderer{
	private lbl_tot:eui.Label;
	private lbl_devote:eui.Label;
	private lbl_time:eui.Label; 
	private bgImg:eui.Image;

	dataChanged():void{
		super.dataChanged();
		let data = this.data;
		this.lbl_tot.text = data.profit;
		this.lbl_time.text = data.log_date;
		this.lbl_devote.text = data.profit_coin;
		this.bgImg.visible = data.showBg;
	}
}

class MiningRankItemRender extends eui.ItemRenderer{
	private lbl_tot:eui.Label;
	private lbl_devote:eui.Label;
	private lbl_nick:eui.Label; 
	private lbl_rank:eui.Label;
	private rankBgImg:eui.Image;

	private _rankPng ={
		[1] :"red_rank_bg_15",
		[2] :"red_rank_bg_14",
		[3] :"red_rank_bg_13",
	}
	dataChanged():void{
		super.dataChanged();
		let data = this.data;
		this.lbl_tot.text = data.sum_profit;
		this.lbl_rank.text = data.ranking;
		this.lbl_nick.text = data.nickname;
		this.lbl_devote.text = data.sum_profit_coin;
		if(data.ranking >=1 && data.ranking <=10){
			this.rankBgImg.visible = true;
			if(data.ranking > 3){
				this.lbl_rank.visible = true;
				this.lbl_rank.textColor = 0xFFFBD8;
				this.rankBgImg.source = "red_rank_bg_n";
			}else{
				this.lbl_rank.visible = false;
				this.rankBgImg.source = this._rankPng[data.ranking];
			}
		}else{
			this.lbl_rank.textColor = 0x874A19;
			this.lbl_rank.visible = true;
			this.rankBgImg.visible = false;
		}
	}
}