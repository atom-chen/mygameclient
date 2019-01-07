/**
 * Created by zhu on 2017/11/02.
 * 签到(登录活动)
 */

class CCDDZPanelSign extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelSign;
    private getRew_img:eui.Image;
	private close_img:eui.Image;
	/**
	 * 已签到的天数
	 */
	private _signCount:number;
	constructor() {
		super(CCalien.CCDDZpopupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, CCalien.CCDDZpopupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});

	}

    init():void {
		this.skinName = panels.CCDDZPanelSign;
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
		let _hasGetDay = CCDDZMainLogic.instance.selfData.getNationalGetLoginRewDay();
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
        let e: CCalien.CCDDZEventManager = CCalien.CCDDZEventManager.instance;
		
		e.registerOnObject(this,CCalien.CCDDZDispatcher,CCGlobalEventNames.NATIONAL_INFO_CHANGE,this._updateByGetRewRep,this);
        //ccserver.addEventListener(CCGlobalEventNames.USER_GET_REWARD_REP, this._onRecvGetActRewRep, this);
        //e.registerOnObject(this,CCalien.CCDDZDispatcher,CCGlobalEventNames.MY_USER_INFO_UPDATE,this._userinfoUpdate,this);
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
		CCDDZEventManager.instance.enableOnObject(this);
	}
	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
        CCalien.CCDDZEventManager.instance.disableOnObject(this);
		CCDDZPanelSign._instance = null;
	}
	/**
	 * 使能 事件
	 */
	private _enableEvent(bEnable:boolean):void{
		let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
		ccserver[_func](CCGlobalEventNames.USER_DAY_SIGN_IN_REP, this._onSignInRep, this);
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
		this[_func](egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
	}

	/**
	 * 签到返回
	 */
	private _onSignInRep(event:egret.Event):void {
		let data:any = event.data;
		let _selfData = CCDDZMainLogic.instance.selfData;
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
					CCDDZBagService.instance.refreshBagInfo();
					this._updateSignInfo();
					this._showGetSuccByIdx(_rewIndex);
					CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.GOLD_RAIN_EFFECT);
				}
				break;
		}
	}
	
	/**
	 * 点击领取奖励
	 */
 	private _onClickGetRew(event: egret.TouchEvent): void {
		 ccserver.getSignReward();
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
		let _rewCfg = CCGlobalGameConfig.signInRewardConfig;
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
		let _todaySign = CCDDZMainLogic.instance.selfData.isTodayHasSign();
		if(_todaySign || this._signCount >=7){
			this.getRew_img.source = "cc_room_getGray";
			this.getRew_img.touchEnabled = false;
		}
		else{
			this.getRew_img.source = "cc_room_get";			
			this.getRew_img.touchEnabled = true;
		}
	}

	/**
	 * 显示签到奖励领取成功
	 */
	private _showGetSuccByIdx(_idx:number):void{
		let _rewCfg = CCGlobalGameConfig.signInRewardConfig;
		if(_idx >=0 && _rewCfg && _idx < _rewCfg.length){
			let _rewInfo = _rewCfg[_idx][0];
			CCDDZPanelGetItems.instance.show(_rewInfo);
		}
	}

	/**
	 * 初始化每天的签到信息
	 */
	private _initItemInfo():void{
		let _rewCfg = CCGlobalGameConfig.signInRewardConfig;
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
				} else if (_rewInfo[j].id == 0 ) {	// 金豆
					let _count = _rewInfo[j].count;
					if(CCDDZMainLogic.instance.selfData.isSignGoldAddByFRecharge()){
						_count += _count * 0.2;
					}
					let cc_nativeBridge = CCalien.Native.instance;
					if(cc_nativeBridge.isNative|| (!cc_nativeBridge.isWXMP && !cc_nativeBridge.isAli() && egret.Capabilities.os == "iOS")){
						_count += _count * 0.1; 
					}
					_text = ""+ parseInt('' + _count);
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
		ccserver.getSignInInfo();
	}

	/**
	 * 获取签到单例
	 */
    public static getInstance(): CCDDZPanelSign {
        if(!CCDDZPanelSign._instance) {
            CCDDZPanelSign._instance = new CCDDZPanelSign();
        }
        return CCDDZPanelSign._instance;
    }

	/**
	 * 移除签到面板
	 */
	public static remove():void{
		if(CCDDZPanelSign._instance){
			CCDDZPanelSign._instance.close();
		}
	}
}