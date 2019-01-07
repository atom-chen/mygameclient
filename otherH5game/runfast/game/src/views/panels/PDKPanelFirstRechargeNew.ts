/**
 * Created by zhu on 2018/01/31.
 * 首充
 */

class PDKPanelFirstRechargeNew extends PDKalien.PDKPanelBase {
    private static _instance: PDKPanelFirstRechargeNew;
	private close_img:eui.Image;
	private pay_img:eui.Image;
	constructor() {
		super(PDKalien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, PDKalien.popupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});
	}

    init():void {
		this.skinName = panels.PDKPanelFirstRechargeNew;
	}

	createChildren():void {
		super.createChildren();
		this._initEvent();
	}

	/**
	 * 初始化事件
	 */
	private _initEvent():void{
		this.close_img["addClickListener"](this._onClickClose,this);
		this.pay_img["addClickListener"](this._onClickPay,this);
		this._enableEvent(true);
        let e: PDKalien.PDKEventManager = PDKalien.PDKEventManager.instance;
		
		//e.registerOnObject(this,PDKalien.Dispatcher,PDKEventNames.NATIONAL_INFO_CHANGE,this._updateByGetRewRep,this);
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
	 * 点击充值
	 */
	private _onClickPay():void {
		let _info = PDKGameConfig.getFRechargeInfo();
		if(!_info) return;
		PDKRechargeService.instance.doRecharge(_info.product_id);
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
		PDKPanelFirstRechargeNew._instance = null;
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
		this[_func](egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
	}

	/**
	 * 显示规则提示
	 */
	public show(){
		this.popup();
	}

	/**
	 * 获取首充界面
	 */
    public static getInstance(): PDKPanelFirstRechargeNew {
        if(!PDKPanelFirstRechargeNew._instance) {
            PDKPanelFirstRechargeNew._instance = new PDKPanelFirstRechargeNew();
        }
        return PDKPanelFirstRechargeNew._instance;
    }

	/**
	 * 移除首充界面
	 */
	public static remove():void{
		if(PDKPanelFirstRechargeNew._instance){
			PDKPanelFirstRechargeNew._instance.close();
		}
	}
}