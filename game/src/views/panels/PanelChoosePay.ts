/**
 * zhu 17/12/28
 * 选择支付方式
 */

class PanelChoosePay extends alien.PanelBase {
	private static _instance:PanelChoosePay;
	public static get instance():PanelChoosePay {
		if (this._instance == undefined) {
			this._instance = new PanelChoosePay();
		}
		return this._instance;
	}
    private _id:string;
	private payWx:eui.Image;
	private payAli:eui.Image;
	private closeImg:eui.Image;
	protected init():void {
		this.skinName = panels.PanelChoosePay;
	}

	constructor(){
		super(alien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, alien.popupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});
	}

	createChildren():void {
		super.createChildren();
		this._enableEvent(true);
		this.closeImg["addClickListener"](this._onClickClose,this);
		this["wxGrp"]["addClickListener"](this._onClickWX,this);
		this["aliGrp"]["addClickListener"](this._onClickAli,this);
	}

	private _onClickClose():void{
		this.dealAction();
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
	 * 使能点击
	 */
	private _enableTouch(target:any,bEnable:boolean):void{
		target.touchEnabled = bEnable;
	}

	/**
	 * 点击微信
	 */
	private _onClickWX():void{
        webService.getRechargeCfgByWX(this._id);
	}

	/**
	 * 点击支付宝
	 */
	private _onClickAli():void{
        webService.getRechargeCfgByAli(this._id);
	}

	/**
	 * 从舞台移除
	 */
	private _onRemoveFromStage():void{
		this._enableEvent(false);
		PanelChoosePay._instance = null;
	}

	show(id:string):void{
		this.popup(null,true,{alpha:0})
        this._id = id;
	}

	/**
	 * 选择支付方式
	 */
    public static getInstance(): PanelChoosePay {
        if(!PanelChoosePay._instance) {
            PanelChoosePay._instance = new PanelChoosePay();
        }
        return PanelChoosePay._instance;
    }

	/**
	 * 移除选择支付界面
	 */
	public static remove():void{
		if(PanelChoosePay._instance) {
			PanelChoosePay._instance.close()
		}
		PanelChoosePay._instance = null;
	}
}