/**
 * 抽奖
 */

class PanelLucky extends alien.PanelBase {
	private static _instance:PanelLucky;
	private _curSelNum:number;
	private _minSelNum:number;
	private _timeId:number;
	private _destIdx:number;
	private _rewInfo:any;
	private _hasLuckNum:number;
	private _luckyCfg:any;
	private _shouldStart:boolean;
	private _showTime:number;
	private _inLucky:boolean;
	public static get instance():PanelLucky {
		if (this._instance == undefined) {
			this._instance = new PanelLucky();
		}
		return this._instance;
	}


	protected init():void {
		this.skinName = panels.PanelLuckySkin;
	}

	constructor() {
		super(alien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, alien.popupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});
	}

	createChildren():void {
		super.createChildren();
	}

	/**
	 * 点击关闭
	 */
	private _onTouchClose():void{
		this._addListener(false);
		this._clearShowTime();
		this._clearStepTime();
		this.dealAction();
	}

	/**
	 * 初始化点击事件
	 */
	private _initClick():void{
		this["btnClose"]["addClickListener"](this._onTouchClose, this);
		this["chouGrp"]["addClickListener"](this._clickLucky, this);
		this["ruleImg"]["addClickListener"](this._clickRule, this);
	}

	private _addListener(bAdd:boolean):void{
		let func = "addEventListener";
		if(!bAdd){
			func = "removeEventListener";
		}
		server[func](EventNames.USER_GET_REWARD_REP, this._onRecvGetRewRep, this);
	}

	/**
	 * 仅处理抽奖
	 * optype:7 抽奖 8:今日已抽奖的次数 12:vip免费抽奖
	 */
	private _onRecvGetRewRep(e:egret.Event):void{
        let data = e.data;
		if(data.optype != 7&& data.optype != 8&&data.optype != 12&&data.optype != 13){
			return;
		}
		
		if(data.result == 0 ||data.result == null){
			if(data.optype == 7 || data.optype ==12 || data.optype == 13){
				if(data.strreward){
					this._rewInfo = data.strreward.split(":");
					if(this._rewInfo && this._rewInfo.length >=2){
						if(!this._hasLuckNum){
							this._hasLuckNum = 0;
						}
						
						this._hasLuckNum += 1;
						if(this.currentState == "app"){
							MainLogic.instance.selfData.setHasTodayAppLucky();
							this._setLeftLukyInfo(this._luckyCfg.dayMax-this._hasLuckNum);
						}
						this._beginLottery();
					}else{
						console.error("_onRecvGetRewRep-2->",data);
					}
				}else{
					console.error("_onRecvGetRewRep-1->",data);
				}
			}else if(data.optype == 8){
				if(data.params && data.params.length >= 1){
					this._shouldStart = false;
					this._hasLuckNum = data.params[0];
					if(this._shouldStart){
						this._clickLucky();
					}
				}
			}
		}else if(data.result == 2){
			Alert.show("有游戏未结束");
		}else{
			Alert.show("请稍后重试，result:"+data.result);
		}
	}

	private _initLight():void{
		let src = "lucky_light2";
		for(let i=0;i<52;++i){
			if(i%2 == 1){
				src = "lucky_light1"
			}else{
				src = "lucky_light2"
			}
			this["lightImg" + i].source = src;
		}
	}

	private _initCost():void{
		let lucky = this._luckyCfg;
		let costId = lucky.cost.id;
		let num = lucky.cost.num;
		let icon;
		if(costId == 0){
			icon = "icon_gold2"
		}else if(costId == 3){
			icon = "icon_diamond"
		}
		this["costTypeImg"].source = icon;
		this["numLabel"].text = num;
	}

	private _initItem():void{
		let lucky = this._luckyCfg;
		let rew = lucky.rew;
		let len = rew.length;
		let num = 0;
		let id = 0;
		let ext = "";
		for(let i=0;i<len;++i){
			id = Number(rew[i].id);
			num = Number(rew[i].num);
			ext = "";
			this["itemImg" + i].source = "lucky_" + id;
			if(id == 1){
				num = num/100;
			}else if(id == 2){
				ext = "小时";
			}
			this["itemNLabel" + i].text = "x" + num + ext;
		}

	}

    private _showGoldNotEnough(needGold): void {
        Alert.show("金豆不足"+ needGold +"，是否前往商城购买？",1,(act)=>{
            if(act == "confirm"){
				PanelExchange2.instance.show(0);
            }else{
				this._onTouchClose();
            }
        })
    }

	private _showNotVip():void{
		Alert.show("您还未成为VIP用户，是否前往充值获取抽奖机会？",1,(act)=>{
			if(act == "confirm"){
				this._onTouchClose();
				PanelExchange2.instance.show(1);
			}
		})
	}

	private _clickLucky():void{
		if(this.currentState == "app"){
			let _nativeBridge = alien.Native.instance;
			if(_nativeBridge.isNative || (!_nativeBridge.isNative && egret.Capabilities.os == "iOS" && !_nativeBridge.isWXMP)){
			}else{
				Alert.show("登录APP端才能抽奖，是否确定下载？",0,function(act){
					if(act == "confirm"){
						GameConfig.downApp();
					}
				})
				return;
			}
		}

		if(this._inLucky){
			Toast.show("抽奖中。。。");
			return;
		}
		let selfData = MainLogic.instance.selfData;
		let lucky = this._luckyCfg;
		let costId = lucky.cost.id;
		let num = lucky.cost.num;
		let vipLevel = selfData.getCurVipLevel();
		if(this._destIdx >=0 && this._destIdx <=9){
			this["itemBgImg" + this._destIdx].source = "lucky_nor";
		}

		if(isNaN(this._hasLuckNum) ){
			this._shouldStart = true;
			if(this.currentState == "lucky"){
				server.reqLuckyInfo();
				return;
			}else if(this.currentState == "vip"){
				if(vipLevel < 1){
					this._showNotVip();
					return;
				}
				let luck = selfData.getTodayVipLucky();
				if(luck.hasLuck){
					Toast.show("今日抽奖已达" + lucky.dayMax +"次上限！");
					return;
				}else if(!luck.inTime){
					let hours = this._luckyCfg.hours;
					let beginHour = hours[0];
					let endHour = hours[1];
					if(beginHour >12){
						beginHour -= 12;
					}
					if(endHour>12){
						endHour -= 12;
					}

					Toast.show("免费抽奖每晚"+ beginHour + "点到" + endHour + "点开放，VIP有一次免费抽奖机会。");
					return;
				}
			}else if(this.currentState == "app"){
				let noLucky = selfData.noTodayAppLucky();
				if(!noLucky){
					Toast.show("今日抽奖已达" + lucky.dayMax +"次上限！");
					return;
				}
			}
		}

		if(this._hasLuckNum >= lucky.dayMax){
			Toast.show("今日抽奖已达" + lucky.dayMax +"次上限！");
			return;
		}
		if(costId == 0){
			let have = selfData.getGold();
			if(have < num){
				return this._showGoldNotEnough(num);
			}
		}
		let optype = 7
		if(this.currentState == "vip"){
			optype = 12;
		}else if(this.currentState == "app"){
			optype = 13;
		}
		server.reqLucky(optype);
	}


	private _clearStepTime():void{
		egret.clearTimeout(this._timeId);
	}

	private _clearShowTime():void{
		egret.clearTimeout(this._showTime);
	}

	private _clickRule():void{
		let lucky = this._luckyCfg;
		let id = lucky.cost.id;
		let costStr;
		if(id == 0){
			costStr = "金豆";
		}else if(id == 3){
			costStr = "钻石";
		}
		let str = "1)抽奖1次消耗" + lucky.cost.num + costStr + "，每日限抽"+lucky.dayMax+"次，今日剩余" + (lucky.dayMax-this._hasLuckNum) +"次。\n"
				  +"2)奖励领取直接到账，如显示不及时，可退出重新登录刷新。\n"
				  +"3)概率公示：奖杯&钻石（"+lucky.coin+"）、金豆（"+lucky.gold+"）、记牌器（"+lucky.recorder+"）。\n"

		Alert.show(str,0,null,"left");
	}

	private _runNextStep(sec:number):void{
		this._clearStepTime();
		this._curSelNum += 1;
		this._timeId = egret.setTimeout(()=>{
			let curIdx = this._curSelNum % 10;
			let lastIdx = curIdx - 1;
			this["itemBgImg" + curIdx].source = "lucky_sel";

			if(lastIdx == -1){
				lastIdx = 9;
			}
			this["itemBgImg" + lastIdx].source = "lucky_nor";
			if(this._curSelNum <= 10){
				sec += -30;
			}else if(this._curSelNum <= 40){
				sec += -40;
			}else if(this._curSelNum >= 60 && this._curSelNum <= this._minSelNum){
				sec += 20;
			}else if(this._curSelNum > this._minSelNum){
				sec += 100;
				if(this._destIdx == curIdx){
					this._showTime = egret.setTimeout(()=>{
						this._endLottery();
					},this,1000);
					return;
				}
			}
			if(sec <= 40){
				sec = 40;
			}else if(sec >=3000){
				sec = 3000;
			}
			this._runNextStep(sec);
		},this,sec);
	}
	
	private _beginLottery():void{
		this._curSelNum = 0;
		let rew = this._luckyCfg.rew;
		let len = rew.length;
		this._destIdx = -1;
		this._inLucky = true;
		for(let i=0;i<len;++i){
			if(rew[i].id == this._rewInfo[0] && rew[i].num == this._rewInfo[1]){
				this._destIdx = i;
				break;
			}
		}
		if(this._destIdx== -1){
			console.error("_beginLottery---------------->",this._rewInfo);
			return;
		}

		this._minSelNum = 60 + this._destIdx - 5;
		this._clearShowTime();
		this["itemBgImg0"].source = "lucky_sel";
		this._runNextStep(200);
	}

	private _endLottery():void{
		this._inLucky = false;
		this._showGetReward();
		this._clearStepTime();
		this._clearShowTime();
	}

	private _showGetReward():void{
		let text = {
			[0]:"金豆x{0}",
			[1]:"奖杯x{0}",
			[2]:"记牌器x{0}小时",
			[3]:"钻石x{0}"
		}
		let id = Number(this._rewInfo[0]);
		let desc = text[id];
		if(desc){
			let num = Number(this._rewInfo[1]);
			if(id == 1){
				num = num/100;
			}
			desc = desc.replace("{0}",num);
			Alert.show("恭喜获得:" + desc);
		}
	}

	private _setLeftLukyInfo(num:number):void{
		this["numLabel"].text = "剩余" + num + "次";
	}

	/**
	 * code：0 新运抽奖 code：1 vip抽奖 code:2 APP 免费抽奖
	 */
	show(code:number):void {
		this.popup();
		this._shouldStart = false;
		this._inLucky = false;
		this._hasLuckNum = undefined;
		let _info;
		if(code == 0){
			this._luckyCfg = GameConfig.getCfgByField("custom.luckyCfg");
			this.currentState = "lucky";
        	_info = GameConfig.getCfgByField("webCfg.luck");
			this._initCost();
		}else if(code == 1){
			this._luckyCfg = GameConfig.getCfgByField("custom.vipLuckyCfg");
			this._luckyCfg.hours =  this._luckyCfg.hourRange.split("|");
        	_info = GameConfig.getCfgByField("webCfg.vip");
			this.currentState = "vip";
		}else if(code == 2){
			this._luckyCfg = GameConfig.getCfgByField("custom.appLuckyCfg");
        	_info = GameConfig.getCfgByField("webCfg.appLucky");
			this.currentState = "app";	
		}

		this.validateNow();
		if(this.currentState == "app"){
			let noLucky = MainLogic.instance.selfData.noTodayAppLucky();
			if(!noLucky){
				this._setLeftLukyInfo(0);
			}
		}

		this["timeLabel"].text = "活动时间:" + _info.time;
		this._initClick();
		this._initLight();
		this._initItem();
		this._addListener(true);
		if(code == 0){
			server.reqLuckyInfo();
		}
	}
}
