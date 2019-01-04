/**
 * Created by zhu on 2017/11/30.
 * 关注公众号活动面板
 */

class PanelWatchWX extends alien.PanelBase {
    private static _instance: PanelWatchWX;

	/**
	 * 关注公众号
	 */
	private watchImg:eui.Image;

	constructor() {
		super();
	}

    init():void {
		this.skinName = panels.PanelWatchWX;
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
		this.watchImg["addClickListener"](this._onClickWatch,this);
	}

	/**
	 * 点击关注公众号
	 */
	private _onClickWatch():void{
        PanelFollowCourse.instance.show();
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
		PanelWatchWX._instance = null;
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
    public static getInstance(): PanelWatchWX {
        if(!PanelWatchWX._instance) {
            PanelWatchWX._instance = new PanelWatchWX();
        }
        return PanelWatchWX._instance;
    }

	/**
	 * 移除引购买每日福袋面板
	 */
	public static remove():void{
		if(PanelWatchWX._instance){
			PanelWatchWX._instance.close();
		}
	}
}