/**
 * 每日邀请红包任务
 */

class CCDDZPanelDayRed extends CCalien.CCDDZPanelBase {
	private static _instance:CCDDZPanelDayRed;

	private _okList:any;
	private _notOkList:any;
	public static get instance():CCDDZPanelDayRed {
		if (this._instance == undefined) {
			this._instance = new CCDDZPanelDayRed();
		}
		return this._instance;
	}


	protected init():void {
		this.skinName = panels.CCDDZPanelInviteDayRed;
		this._okList = [];
		this._notOkList = [];
	}

	constructor() {
		super(CCalien.CCDDZpopupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, CCalien.CCDDZpopupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});
		
	}

	createChildren():void {
		super.createChildren();
	}

	/**
	 * 点击关闭
	 */
	private _onTouchClose():void{
		this._addListener(false);
		this.dealAction();
	}

	/**
	 * 初始化点击事件
	 */
	private _initClick():void{
		this["btnClose"]["addClickListener"](this._onTouchClose, this);
		this["inviteImg0"]["addClickListener"](this._onClickGetRed.bind(this,0), this);
		this["inviteImg1"]["addClickListener"](this._onClickGetRed.bind(this,1), this);
		this["inviteImg2"]["addClickListener"](this._onClickGetRed.bind(this,2), this);
		this["inviteImg3"]["addClickListener"](this._onClickGetRed.bind(this,3), this);
		this["inviteImg4"]["addClickListener"](this._onClickGetRed.bind(this,4), this);
		this["redBgImg0"]["addClickListener"](this._onClickGetRed.bind(this,0), this);
		this["redBgImg1"]["addClickListener"](this._onClickGetRed.bind(this,1), this);
		this["redBgImg2"]["addClickListener"](this._onClickGetRed.bind(this,2), this);
		this["redBgImg3"]["addClickListener"](this._onClickGetRed.bind(this,3), this);
		this["redBgImg4"]["addClickListener"](this._onClickGetRed.bind(this,4), this);
		this["extraImg"]["addClickListener"](this._onClickGetExtra, this);
	}

	private _addListener(bAdd:boolean):void{
		let func = "addEventListener";
		if(!bAdd){
			func = "removeEventListener";
		}
		
		CCDDZInviteService.instance[func](CCGlobalEventNames.INVITE_DATA_REFRESH, this.onInviteDataUpdate,this)
		
		ccserver[func](CCGlobalEventNames.USER_GET_REWARD_REP, this._onRecvGetRewRep, this);
	}

	private _showGetRedByResult(data:any):void{
        let _desc = null;
		if(data.optype != 4 && data.optype != 6){
			return;
		}
		
		if(data.result == 0 ||data.result == null){
			let myData = CCDDZMainLogic.instance.selfData;
			if(data.optype == 4){
				myData.subInviteRedNum();
				myData.changeInviteGetRedNum(true);
			}else if(data.optype == 6){
				myData.subInviteExtraRedNum();
				myData.changeInviteGetExtraRedNum(true);
			}
			if(data.params && data.params.length >= 1){ 
				let _sMoney = CCDDZUtils.exchangeRatio(data.params[0] / 100,true);
				CCDDZAlert.show("恭喜获得" + _sMoney + "奖杯！");
			}
			this._updateUI();
		}
		else if(data.result == 1){
			_desc = "活动不存在";
		}
		else if(data.result ==2){
			if(data.optype == 4){
				let _max = CCGlobalGameConfig.getCfgByField("custom").inviteRedNum;
				CCGlobalGameConfig.setCfgByField("hasGetIRedNum",_max)
				this._showChouMax();
			}else{
				CCDDZToast.show("已领取");
			}
			return;
		}
		else if(data.result == 3){
			_desc = "奖励已领取";
		}

		if(_desc){
			CCDDZAlert.show(_desc);
		}
	}

	/**
	 * 仅处理邀请的抽红包
	 */
	private _onRecvGetRewRep(e:egret.Event):void{
        let data = e.data;
		this._showGetRedByResult(data);
	}

	private _initUI():void{
		for(let i=0;i<5;++i){
			this["statusLabel" + i].visible = false;
			this["friendGrp" + i].visible = false;
			this["headIcon" + i].mask = this["headMask" + i];
		}
		this["hasGetImg"].visible = false;
		let custom = CCGlobalGameConfig.getCfgByField("custom");
		this["descLabel"].text = "成功邀请好友并赢5局游戏后，即可领取随机奖杯，每日最多领取" + custom.inviteRedNum +"次！"
	}

	private _updateUI():void{
		let notOkLen = this._notOkList.length;
		let data = CCDDZMainLogic.instance.selfData;
		let hasN = data.getInviteRedNum();
		let hasGetN = data.getInviteRedGetRewNum();
		let hasGetEN = data.getHasGetInvExtraRed();
		if(hasGetEN){
			this["extraImg"].touchEnabled = false;
			this["hasGetImg"].visible = true;
		}else{
			this["hasGetImg"].visible = false;
			this["extraImg"].touchEnabled = true;
		}

		for(let i=0;i<5;++i){
			this["redBgImg" + i].touchEnabled = true;
			this["inviteImg" + i].touchEnabled = true;
			if(i < hasN + hasGetN){
				this["inviteImg" + i].visible = true;
				this["statusLabel" + i].visible = false;
				if(i < hasGetN){
					this["friendGrp" + i].visible = false;
					this["redBgImg" + i].source = "cc_invite_day_red";
					this["inviteImg" + i].source = "cc_invite_day_hasget";
					this["inviteImg" + i].touchEnabled = false;
					this["redBgImg" + i].touchEnabled = false;
				}else{
					this["friendGrp" + i].visible = false;
					this["redBgImg" + i].source = "cc_invite_day_red";
					this["inviteImg" + i].source = "cc_invite_day_get";
				}
			}else{
				this["inviteImg" + i].source = "cc_invite_day_get1";
				if(i < notOkLen){
					this["nameLabel" + i].text = this._notOkList[i].nickname.substr(0,6);
					this["headIcon" + i].source = this._notOkList[i].headimgurl2;
					this["redBgImg" + i].source = "cc_invite_day_bg";
					this["statusLabel" + i].visible = true;
					this["friendGrp" + i].visible = true;
					this["inviteImg" + i].visible = false;
				}else{
					this["inviteImg" + i].visible = true;
					this["friendGrp" + i].visible = false;
					this["redBgImg" + i].source = "cc_invite_day_red1";
					this["statusLabel" + i].visible = false;
				}
			}
		}
	}

	private onInviteDataUpdate(event: egret.Event):void{
		let data: any = event.data;
		let len = data.length;
		let overList = [];
		let notOverList = [];
		for(let i=0;i<len;++i){
			if(data[i].status == "1" ){ //已完成
				if(overList.length < 5){
					overList.push(data[i]);
				}
			}else{
				if(notOverList.length < 5){
					notOverList.push(data[i]);
				}
			}
			
			if(overList.length >=5 && notOverList.length >=5){
				break;
			}
		}
		this._okList = overList;
		this._notOkList = notOverList;
		this._updateUI();
	}

	//status 0:未完成 1:已完成  
	private _onClickGetRed(idx):void{
		if(this["inviteImg" + idx].source == "cc_invite_day_get"){
			let hasN = CCDDZMainLogic.instance.selfData.getInviteRedNum();
			let hasG = CCDDZMainLogic.instance.selfData.getInviteRedGetRewNum();
			let maxN = CCGlobalGameConfig.getCfgByField("custom").inviteRedNum;
			if(hasN >0){
				if(hasG < maxN){
					ccserver.reqInviteRedRew();
				}else{
					this._showChouMax();
				}
			}
		}else{
			if(CCalien.Native.instance.isNative){
				CCGlobalWxHelper.shareForAndroidApp();
			}else{
				let _url = CCGlobalGameConfig.getMySelfUrl();
				CCGlobalGameConfig.copyText(null,_url,"专属链接",true);
			}
		}
	}

	/**
	 * 显示今日到达上限
	 */
	private _showChouMax():void{
		let _max = CCGlobalGameConfig.getCfgByField("custom").inviteRedNum;
		let _str = "今日领取已达"+_max+"次";
		CCDDZToast.show(_str);
	}


	private _onClickGetExtra(idx):void{
		if(this._okList.lenght <5){
			CCDDZToast.show("邀请5位好友并赢5局游戏后即可领取");
		}else{
			let data = CCDDZMainLogic.instance.selfData;
			let hasRedN = data.getInviteExtraRedNum();
			let hasGetEN = data.getHasGetInvExtraRed();
			if(hasGetEN <= 0){
				if(hasRedN >=1){
					ccserver.reqInviteExtra();
				}else{
					CCDDZToast.show("抽奖次数不足");
				}
			}else{
				CCDDZToast.show("已领取");
			}
		}
	}

	private _initTime():void{
        let _info = CCGlobalGameConfig.getCfgByField("webCfg");
		this["timeLabel"].text = "活动时间:" + _info.time;
	}

	show():void {
		this.popup();
		this._initClick();
		this._addListener(true);
		this._initUI();
		this._initTime();
	}
}
