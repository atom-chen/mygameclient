/**
 *
 * @ cyj
 *
 */

class PanelInviteList extends alien.PanelBase {
	private static _instance:PanelInviteList;
	/**
	 * 没有邀请的玩家提示group
	 */
	private noInviteGroup:eui.Group;

	public static get instance():PanelInviteList {
		if (this._instance == undefined) {
			this._instance = new PanelInviteList();
		}
		return this._instance;
	}

	constructor() {
		super(
			alien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backOut},
			alien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backIn}
		);
	}


	private rectMask: eui.Rect;
	private btnClose: eui.Button;
	private lbCount: eui.Label;
	protected _callback;
	/**
	 * 邀请好友
	 */
	private inviteGroup:eui.Group;

	/**
	* 抽红包背景
	*/
	private redBgImg:eui.Image;
	/**
	 * 规则按钮
	 */
	 private ruleImg:eui.Image;

	 /**
	  * 可抽多少次
	  */
	 private countLabel:eui.Label;

	 /**
	  * 抽到的红包额度
	  */
	 private redLabel:eui.Label;

	 /**
	  * 按钮抽
	  */
	  private chouImg:eui.Image;
	  /**
	   * 邀请好友或者是复制专属连接
	   */
	  private inviteDescImg:eui.Image;

	/**
	 * 活动时间
	 */
	private actTimeLabel:eui.Label;

	private rollMsg:MarqueeText;

	protected init():void {
        this.skinName =  panels.PanelInvateListSkin;

		InviteService.instance.addEventListener("INVITE_RANK_LIST", this.onInviteRankUpdate,this)
		InviteService.instance.getInviteRankList()
	}

	createChildren():void {
		super.createChildren();
		let e: alien.EventManager = EventManager.instance;
		this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtnCloseClick,this);
	}

	private onInviteRankUpdate(event: egret.Event):void{
		let data: any = event.data;
		InviteService.instance.removeEventListener("INVITE_RANK_LIST", this.onInviteRankUpdate,this);
		this.rollMsg.showByInviteRankList(data);
	}

	private _initClickListener():void{
		this.inviteGroup["addClickListener"](this._onClickInvite,this);
		this.chouImg["addClickListener"](this._onClickChou,this);
		this.ruleImg["addClickListener"](this._onClickRule,this);
		this["rankImg"]["addClickListener"](this._onClickRank,this);
	}

	private _initDesc():void{
		this["actDescLabel"].text = "1.邀请好友完成赢5局任务，可获得10-100随机钻石奖励。\n"
		+"2、联系客服，开通更多邀请奖励：\n\t\t\t\t"
		+"1）每个有效用户2奖杯。\n\t\t\t\t"
		+"2）永久享有充值邀请奖励。\n\t\t\t\t"
		+"3）详情添加客服微信："+ GameConfig.extendWX;
	}
	/**
	 * 复制专属连接或者是邀请好友
	 */
	private _initBtnCopyPng():void{
		let _png = "invite_url"
		if(alien.Native.instance.isNative){
			_png = "invite_do1";
		}
		this["inviteDescImg"].source = _png;
	}

	/**
	 * 点击复制专属连接或者是邀请好友
	 */
	private _onClickInvite():void{
		this._doInvite();
	}

	/**
	 * 根据当前的系统做不同的处理
	 */
	private _doInvite():void{
		if(alien.Native.instance.isNative){
			WxHelper.shareForAndroidApp();
		}else{
			let _url = GameConfig.getMySelfUrl();
			GameConfig.copyText(null,_url,"专属链接",true);
		}
	}
	/**
	 * 可以抽取的邀请红包信息
	 */
	private _initRedCount():void{
		let _n = MainLogic.instance.selfData.getInviteRedNum();
		let _str = "<font color='#F7D87C'>可抽</font> " + _n + " <font color='#F7D87C'>次</font>";
		this.countLabel.textFlow = (new egret.HtmlTextParser).parser(_str);
	}

	/**
	 * 显示今日到达上限
	 */
	private _showChouMax():void{
		let _max = GameConfig.getCfgByField("custom").inviteRedNum;
		let _str = "今日已达"+_max+"次";
		Toast.show(_str);
	}

	/**
	 * 点击抽奖券
	 */
	private _onClickChou():void{
		let n = MainLogic.instance.selfData.getInviteRedNum();
		if(n >0){
			let custom = GameConfig.getCfgByField("custom");
			let hasGetIRedNum = GameConfig.getCfgByField("hasGetIRedNum");
			if(!hasGetIRedNum ||hasGetIRedNum < custom.inviteRedNum){
		    	server.reqInviteRedRew();
			}else{
				this._showChouMax();
			}
		}else{
			Alert.show("次数不足，是否立刻邀请好友？",0,(act)=>{
				if(act == "confirm"){
					this._doInvite();
				}
			});
		}
	}

	/**
	 * 点击排行榜
	 */
	private _onClickRank():void{
		PanelInviteRank.instance.show();
	}

	/**
	 * 点击规则
	 */
	private _onClickRule():void{
		PanelInviteJustList.instance.show();

	}

	/**
	 * 显示抽到的红包金额
	 */
	private _showGetRed(bShow:boolean,sMoney:string =""):void{
		this.redLabel.visible = bShow;
		if(bShow && sMoney){
			let _srcY = 213;
			this.redLabel.text = "+" + sMoney;
			egret.Tween.removeTweens(this.redLabel);
			this.chouImg.touchEnabled = false;
			egret.Tween.get(this.redLabel).set({y:_srcY}).to({y:_srcY - 20},500).wait(500).call(()=>{
				this.redLabel.visible = false;
				this.chouImg.touchEnabled = true;
			});
		}else{
			egret.Tween.removeTweens(this.redLabel);
		}
	}

	/**
	 * 仅处理邀请的抽红包
	 */
	private _onRecvGetRewRep(e:egret.Event):void{
        let data = e.data;
        let _desc = null;
		if(data.optype == 4){
			if(data.result == 0 ||data.result == null){
				MainLogic.instance.selfData.subInviteRedNum();
				this._initRedCount();
                if(data.params && data.params.length >= 2){ 
					let _sMoney =data.params[1];//Utils.exchangeRatio(data.params[0] / 100,true);
					this._showGetRed(true,_sMoney);
				}
			}
			else if(data.result == 1){
				_desc = "活动不存在";
			}
			else if(data.result ==2){
				let _max = GameConfig.getCfgByField("custom").inviteRedNum;
				GameConfig.setCfgByField("hasGetIRedNum",_max)
				this._showChouMax();
				return;
			}
			else if(data.result == 3){
				_desc = "奖励已领取";
			}

			if(_desc){
				Alert.show(_desc);
			}
		}
	}

	private _initTime():void{
        let _info = GameConfig.getCfgByField("webCfg");
		this.actTimeLabel.text = _info.time;
	}

	show(data:any, callback:Function = null):void{
        this.popup();
		this.rollMsg.stop();
		this.rollMsg.enableSendHorn(false);
		
		this._initBtnCopyPng();
		this._initClickListener();
		this._initDesc();
		this._showGetRed(false);
		this._initTime();
		this._initRedCount();
        server.addEventListener(EventNames.USER_GET_REWARD_REP, this._onRecvGetRewRep, this);
		//this.lbCount.text = '您已累计获得' + InviteService.instance.complete_amount + '次抽奖杯机会，被邀请好友赢得5局游戏即可获得1次机会';
	}

	private onBtnCloseClick(event:egret.TouchEvent):void{
		this.dealAction();
	}

}