/**
 * Created by zhu on 2017/10/26.
 * 引导下载App面板
 */

class CCDDZPanelDownApp extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelDownApp;

	/**
	 * 下载
	 */
	private down_img:eui.Image;

	constructor() {
		super();
	}

    init():void {
		this.skinName = panels.CCDDZPanelDownAppSkin;
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
		this.down_img["addClickListener"](this._onClickDownApp,this);
	}

	private _initDownGold():void{
		let gold = CCGlobalGameConfig.getCfgByField("custom.downAppGold")
		this["item3Num_label"].text = gold;
	}

	/**
	 * 点击下载按钮
	 */
	private _onClickDownApp():void{
        CCGlobalGameConfig.downApp();
	}

	/**
	 * 初始化界面
	 */
	private _initUI():void{
		this._initDownGold();
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
        CCalien.CCDDZEventManager.instance.disableOnObject(this);
		CCDDZPanelDownApp._instance = null;
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
	 * 获取引导下载App单例
	 */
    public static getInstance(): CCDDZPanelDownApp {
        if(!CCDDZPanelDownApp._instance) {
            CCDDZPanelDownApp._instance = new CCDDZPanelDownApp();
        }
        return CCDDZPanelDownApp._instance;
    }

	/**
	 * 移除引导下载App面板
	 */
	public static remove():void{
		if(CCDDZPanelDownApp._instance){
			CCDDZPanelDownApp._instance.close();
		}
	}
}