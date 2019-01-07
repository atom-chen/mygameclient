/**
 * Created by zhu on 2017/10/26.
 * 引导下载App面板
 */

class PDKPanelDownApp extends PDKalien.PDKPanelBase {
    private static _instance: PDKPanelDownApp;

	/**
	 * 下载
	 */
	private down_img:eui.Image;

	constructor() {
		super();
	}

    init():void {
		this.skinName = panels.PDKPanelDownAppSkin;
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
        //let e: PDKalien.PDKEventManager = PDKalien.PDKEventManager.instance;
		//e.registerOnObject(this,PDKalien.Dispatcher,PDKEventNames.HORN_TALK_RECORDS_CHANGE,this._onHornRecChange,this);
	}

	/**
	 * 点击下载按钮
	 */
	private _onClickDownApp():void{
        PDKGameConfig.downApp();
	}

	/**
	 * 初始化界面
	 */
	private _initUI():void{
		
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
        PDKalien.PDKEventManager.instance.disableOnObject(this);
		PDKPanelDownApp._instance = null;
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
    public static getInstance(): PDKPanelDownApp {
        if(!PDKPanelDownApp._instance) {
            PDKPanelDownApp._instance = new PDKPanelDownApp();
        }
        return PDKPanelDownApp._instance;
    }

	/**
	 * 移除引导下载App面板
	 */
	public static remove():void{
		if(PDKPanelDownApp._instance){
			PDKPanelDownApp._instance.close();
		}
	}
}