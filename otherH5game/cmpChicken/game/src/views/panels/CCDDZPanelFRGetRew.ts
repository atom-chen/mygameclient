/**
 * Created by zhu on 17/08/31.
 * 领取首充奖励面板
 */

class CCDDZPanelFRGetRew extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelFRGetRew;

	/**
	 * 领取按钮  
	 */
	private mGet_btn:eui.Button;

	/**
	 * 首充奖励的第几天
	 */
	private _day:number;

    init():void {
		this.skinName = panels.CCDDZPanelFRGetRewardSkin;
	}

	constructor() {
		super(CCalien.CCDDZpopupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, CCalien.CCDDZpopupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});

	}

	createChildren():void {
		super.createChildren();
		this._enableEvent(true);
	}


	/**
	 * 事件使能
	 */
	private _enableEvent(bEnable:boolean):void{
		let _func = "addEventListener";
		if(bEnable == false){
			_func = "removeEventListener";
		}
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
		this.mGet_btn[_func](egret.TouchEvent.TOUCH_TAP, this._onTouchGetRewBtn, this);
	}

	/**
	 * 点击领取
	 */
	private _onTouchGetRewBtn():void{
		CCDDZMainLogic.instance.onGoGetRewardReq(); 
		
		this.dealAction();
	}

	/**
	 * 显示首充当日奖励信息
	 */
	public show(): void {
		this._day = CCDDZMainLogic.instance.selfData.getFRechargeRewGetDay();
		this.popup(null,true,{alpha:0});
	}

	/**
	 * 移除监听
	 */
	public _onRemovedToStage():void{
		this._enableEvent(false);
		CCDDZPanelFRGetRew._instance = null;
	}

	/**
	 * 获取首充当日奖励领取面板
	 */
	public static getInstance(): CCDDZPanelFRGetRew {
        if(!CCDDZPanelFRGetRew._instance) {
            CCDDZPanelFRGetRew._instance = new CCDDZPanelFRGetRew();
        }
        return CCDDZPanelFRGetRew._instance;
    }

	/**
	 * 移除领取当日首充奖励面板
	 */
	public static remove():void{
		if(CCDDZPanelFRGetRew._instance){
			CCDDZPanelFRGetRew._instance.close();
		}
	}
}