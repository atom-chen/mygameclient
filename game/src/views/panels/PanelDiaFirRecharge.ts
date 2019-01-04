/**
 * Created by angleqqs on 18/06/20.
 * 钻石首充信息面板
 */

class PanelDiaFirRecharge extends alien.PanelBase {
    private static _instance: PanelDiaFirRecharge;
	/**
	 * 去充值按钮
	 */
	private btnGoRecharge:ButtonDoTaskSkin;
	
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
		this.skinName = panels.PanelDiaFirRecharge;
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
		RechargeService.instance.doRecharge(_product_id);
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
		let _data = MainLogic.instance.selfData["monthcardinfo"];		
		let hasBuy = true;
		if(_data && _data[0] == 0) {
			hasBuy = false;
		}

		this._hasBuy = hasBuy;
		if(!this._hasBuy){
			this.btnGoRecharge.visible = true;
			this.btnGoRecharge["addClickListener"](this._onGoRecharge,this);
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
        let e: alien.EventManager = EventManager.instance;
        e.registerOnObject(this,alien.Dispatcher,EventNames.MY_USER_INFO_UPDATE,this._onMyUserInfoUpdate,this);
		EventManager.instance.enableOnObject(this);
	}

	/**
	 * 从舞台移除
	 */
	private _onRemoveFromStage():void{
		this._enableEvent(false);
        this["removeEventListener"](egret.Event.ADDED_TO_STAGE,this._onAddToStage,this);
		PanelDiaFirRecharge._instance = null;
		EventManager.instance.disableOnObject(this);
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
    public static getInstance(): PanelDiaFirRecharge {
        if(!PanelDiaFirRecharge._instance) {
            PanelDiaFirRecharge._instance = new PanelDiaFirRecharge();
        }
        return PanelDiaFirRecharge._instance;
    }

	/**
	 * 其他地方移除
	 */
	public static nullInstance():void{
		if(PanelDiaFirRecharge._instance){
			let _ins = this._instance;
			_ins.parent.removeChild(_ins);
		}
	}

	/**
	 * 领取成功后隐藏领取按钮
	 */
	public static setDisableGet():void{
		if(PanelDiaFirRecharge._instance) {
			PanelDiaFirRecharge._instance.btnGoRecharge.visible = false;
		}
	}

	/**
	 * 移除首充面板
	 */
	public static remove():void{
		if(PanelDiaFirRecharge._instance){
			PanelDiaFirRecharge._instance.close();
		}
	}

}