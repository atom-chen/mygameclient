/**
 * Created by zhu on 2017/11/30.
 * 每日福袋购买面板
 */

class PanelDayBuy extends alien.PanelBase {
    private static _instance: PanelDayBuy;

	/**
	 * 购买
	 */
	private buyImg:ImgWordBtn;

	constructor() {
		super();
	}

    init():void {
		this.skinName = panels.PanelDayBuy;
	}
	
	createChildren():void {
		super.createChildren();
		this._initUI();
		this._initEvent();
	}

	/**
	 * 初始化事件
	 */
	private _initEvent():void{
		this._enableEvent(true);
		this.buyImg["addClickListener"](this._onClickBuy,this);
	}

	/**
	 * 点击购买按钮
	 */
	private _onClickBuy():void{
		RechargeService.instance.doRecharge("10021");
	}

	/**
	 * 初始化界面
	 */
	private _initUI():void{
		this.buyImg.setTit("common_buy");
		this.buyImg.setDisable();
		
	}

	/**
	 * 点击关闭
	 */
	private _onTouchClose():void{
		this.dealAction();
	}

	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
		PanelDayBuy._instance = null;
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
	}

	/**
	 * 获取购买每日福袋单例
	 */
    public static getInstance(): PanelDayBuy {
        if(!PanelDayBuy._instance) {
            PanelDayBuy._instance = new PanelDayBuy();
        }
        return PanelDayBuy._instance;
    }

	/**
	 * 移除引购买每日福袋面板
	 */
	public static remove():void{
		if(PanelDayBuy._instance){
			PanelDayBuy._instance.close();
		}
	}
}