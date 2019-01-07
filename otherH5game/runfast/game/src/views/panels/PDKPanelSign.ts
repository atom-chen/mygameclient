/**
 * Created by zhu on 2017/11/02.
 * 签到(登录活动)
 */

class PDKPanelSign extends PDKalien.PDKPanelBase {
    private static _instance: PDKPanelSign;
    private getRew_img:eui.Image;
	private close_img:eui.Image;
	/**
	 * 已签到的天数
	 */
	private _signCount:number;
	constructor() {
		super(PDKalien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, PDKalien.popupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});

	}

    init():void {
		this.skinName = panels.PDKPanelSign;
		this._signCount = 0;
	}

	createChildren():void {
		super.createChildren();		
		this._initDefaut();
		this._initEvent();
	}

	/**
	 * 初始化默认数据
	 */
	private _initDefaut():void{
		let _hasGetDay = PDKMainLogic.instance.selfData.getNationalGetLoginRewDay();
		let _target = null;
		for(let i=1;i<8;++i){
			_target = this["state" + i + "_img"];
			if(i<= _hasGetDay){
				_target.visible = true;
			}
			else{
				_target.visible = false;
			}
		}
	}

	/**
	 * 初始化事件
	 */
	private _initEvent():void{
        this.getRew_img["addClickListener"](this._onClickGetRew, this);
		this.close_img["addClickListener"](this._onClickClose,this);
		this._enableEvent(true);
        let e: PDKalien.PDKEventManager = PDKalien.PDKEventManager.instance;
		
		e.registerOnObject(this,PDKalien.Dispatcher,PDKEventNames.NATIONAL_INFO_CHANGE,this._updateByGetRewRep,this);
        //pdkServer.addEventListener(PDKEventNames.USER_GET_REWARD_REP, this._onRecvGetActRewRep, this);
        //e.registerOnObject(this,PDKalien.Dispatcher,PDKEventNames.MY_USER_INFO_UPDATE,this._userinfoUpdate,this);
	}


	/**
	 * 点击关闭
	 */
	private _onClickClose():void{
		this.dealAction();
	}
	/**
	 * 	加入舞台
	 */
	private _onAddToStage():void{
		PDKEventManager.instance.enableOnObject(this);
	}
	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
        PDKalien.PDKEventManager.instance.disableOnObject(this);
		PDKPanelSign._instance = null;
	}
	/**
	 * 使能 事件
	 */
	private _enableEvent(bEnable:boolean):void{
		let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
		pdkServer[_func](PDKEventNames.USER_DAY_SIGN_IN_REP, this._onSignInRep, this);
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
		this[_func](egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
	}

	/**
	 * 签到返回
	 */
	private _onSignInRep(event:egret.Event):void {
		let data:any = event.data;
		let _selfData = PDKMainLogic.instance.selfData;
		if(data.today == 1){
			_selfData.setTodaySigned(true);
		}
		switch (data.optype) {
			case 1: //更新信息
				this._signCount = data.total_day || 0;
				this._updateSignInfo();
				break;
			case 2: //领取奖励
				if (data.result == 0) {
					let _rewIndex = this._signCount;
					
					_selfData.setTodaySigned(true);
					this._signCount++;                    
					_selfData.signSuccSubSignAddRemin();
					PDKBagService.instance.refreshBagInfo();
					this._updateSignInfo();
					this._showGetSuccByIdx(_rewIndex);
					PDKalien.Dispatcher.dispatch(PDKEventNames.GOLD_RAIN_EFFECT);
				}
				break;
		}
	}
	
	/**
	 * 点击领取奖励
	 */
 	private _onClickGetRew(event: egret.TouchEvent): void {
		 pdkServer.getSignReward();
    }
    
	/**
	 * 更新已领取的奖励的标识显示状态
	 */
	private _updateByGetRewRep():void{
		let _hasGetDay = this._signCount;
		for(let i= 1;i<=_hasGetDay;++i){
			this["state" + i + "_img"].visible = true;
		}
	}
	
	/**
	 * 更新已经签到的信息
	 */
	private _updateSignInfo():void{
		let _rewCfg = PDKGameConfig.signInRewardConfig;
		if(this._signCount <= _rewCfg.length){
			for(let i=0;i<this._signCount;++i){
				this["state" + (i + 1)+ "_img"].visible = true;
			}
		}
		this._initTodayGet();
	}

	/**
	 * 初始化今日是否已经领取
	 */
	private _initTodayGet():void{
		let _todaySign = PDKMainLogic.instance.selfData.isTodayHasSign();
		if(_todaySign || this._signCount >=7){
			this.getRew_img.source = "pdk_btn_gray2";
			this.getRew_img.touchEnabled = false;
		}
		else{
			this.getRew_img.source = "pdk_btn_yellow";			
			this.getRew_img.touchEnabled = true;
		}
	}

	/**
	 * 显示签到奖励领取成功
	 */
	private _showGetSuccByIdx(_idx:number):void{
		let _rewCfg = PDKGameConfig.signInRewardConfig;
		if(_idx >=0 && _rewCfg && _idx < _rewCfg.length){
			let _rewInfo = _rewCfg[_idx][0];
			PDKPanelGetItems.instance.show(_rewInfo);
		}
	}

	/**
	 * 初始化每天的签到信息
	 */
	private _initItemInfo():void{
		let _rewCfg = PDKGameConfig.signInRewardConfig;
		for(let i=0;i<_rewCfg.length;++i){
			let _rewInfo = _rewCfg[i];
			let _text = "";
			for(let j=0;j<_rewInfo.length;++j){
				_text = _rewInfo[j].count;
				if(_rewInfo[j].id == 2) {//记牌器
					if(_rewInfo[j].count >= 24){
						_text = _rewInfo[j].count/24 +"天"
					}
					else{
						_text = _rewInfo[j].count +"小时"
					}
				} else if (_rewInfo[j].id == 0 && PDKalien.Native.instance.isNative) {	// 金豆
					_text = '' + (_rewInfo[j].count * 1.5);	// app有1.5倍金豆奖励
				}
				this["itemNum" + i + "_" + j + "label"].text = _text;
			}
			this["state" + (i + 1) + "_img"].visible = false;
		}
	}

	/**
	 * 显示签到面板
	 */
	public show(){
		this.popup();
		this._initItemInfo();
		pdkServer.getSignInInfo();
	}

	/**
	 * 获取签到单例
	 */
    public static getInstance(): PDKPanelSign {
        if(!PDKPanelSign._instance) {
            PDKPanelSign._instance = new PDKPanelSign();
        }
        return PDKPanelSign._instance;
    }

	/**
	 * 移除签到面板
	 */
	public static remove():void{
		if(PDKPanelSign._instance){
			PDKPanelSign._instance.close();
		}
	}
}