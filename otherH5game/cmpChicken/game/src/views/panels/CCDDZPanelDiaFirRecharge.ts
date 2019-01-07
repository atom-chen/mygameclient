/**
 * Created by angleqqs on 18/06/20.
 * 钻石首充信息面板
 */

class CCDDZPanelDiaFirRecharge extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelDiaFirRecharge;
	/**
	 * 去充值按钮
	 */
	private btnGoRecharge:CCDDZButtonDoTaskSkin;
	
	/**
	 * 是否购买了首充
	 */
	private _hasBuy :boolean;

	constructor() {
		super();
        this["addEventListener"](egret.Event.ADDED_TO_STAGE,this._onAddToStage,this);
	}

	createChildren():void {
		super.createChildren();
		this._initUI();
		this._enableEvent(true);
	}

	/**
	 * 初始化皮肤
	 */
	init():void{
		this.skinName = panels.CCDDZPanelDiaFirRecharge;
	}

	/**
	 * 用户信息更新 判断是否购买了首充
	 */
	private _onMyUserInfoUpdate():void{
		this._initGoRechargeBtn();
	}
	/**
	 * 去充值
	 */
	private _onGoRecharge():void{
		let _product_id = "10042"; 
		CCDDZRechargeService.instance.doRecharge(_product_id);
	}

	/**
	 * 初始化UI
	 */
	private _initUI():void{
		this._initGoRechargeBtn();
	}

	/**
	 * 初始化充值按钮(去充值,领奖励)
	 */
	private _initGoRechargeBtn():void{
		let _data = CCDDZMainLogic.instance.selfData["monthcardinfo"];		
		let hasBuy = true;
		if(_data && _data[0] == 0) {
			hasBuy = false;
		}

		this._hasBuy = hasBuy;
		if(!this._hasBuy){
			this.btnGoRecharge.visible = true;
			this.btnGoRecharge.setPngs("cc_frecharge_gopay_n","cc_frecharge_gopay_p");
			this.btnGoRecharge.setClickFunc(this._onGoRecharge.bind(this));
		}	
		else {
			this.btnGoRecharge.visible = false;
		}	
	}

	/**
     * 使能事件
     */
    private _enableEvent(bEnable:boolean):void{
        let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
        this[_func](egret.Event.REMOVED_FROM_STAGE,this._onRemoveFromStage,this);
    }
	/**
	 * 加入到舞台
	 */
	private _onAddToStage():void{
        let e: CCalien.CCDDZEventManager = CCDDZEventManager.instance;
        e.registerOnObject(this,CCalien.CCDDZDispatcher,CCGlobalEventNames.MY_USER_INFO_UPDATE,this._onMyUserInfoUpdate,this);
		CCDDZEventManager.instance.enableOnObject(this);
	}

	/**
	 * 从舞台移除
	 */
	private _onRemoveFromStage():void{
		this._enableEvent(false);
        this["removeEventListener"](egret.Event.ADDED_TO_STAGE,this._onAddToStage,this);
		CCDDZPanelDiaFirRecharge._instance = null;
		CCDDZEventManager.instance.disableOnObject(this);
	}


	/**
	 * 显示首充面板
	 */
	public show():void{
		this.popup(null,true,{alpha:0})
	}

	/**
	 * 获取首充UI单例
	 */
    public static getInstance(): CCDDZPanelDiaFirRecharge {
        if(!CCDDZPanelDiaFirRecharge._instance) {
            CCDDZPanelDiaFirRecharge._instance = new CCDDZPanelDiaFirRecharge();
        }
        return CCDDZPanelDiaFirRecharge._instance;
    }

	/**
	 * 其他地方移除
	 */
	public static nullInstance():void{
		if(CCDDZPanelDiaFirRecharge._instance){
			let _ins = this._instance;
			_ins.parent.removeChild(_ins);
		}
	}

	/**
	 * 领取成功后隐藏领取按钮
	 */
	public static setDisableGet():void{
		if(CCDDZPanelDiaFirRecharge._instance) {
			CCDDZPanelDiaFirRecharge._instance.btnGoRecharge.visible = false;
		}
	}

	/**
	 * 移除首充面板
	 */
	public static remove():void{
		if(CCDDZPanelDiaFirRecharge._instance){
			CCDDZPanelDiaFirRecharge._instance.close();
		}
	}

}