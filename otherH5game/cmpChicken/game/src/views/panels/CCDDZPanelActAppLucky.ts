/**
 * Created by zhu on 2017/10/26.
 * 引导下载App登录抽奖
 */

class CCDDZPanelActAppLucky extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelActAppLucky;

	/**
	 * 去抽奖
	 */
	private luckyBtn:eui.Image;

	constructor() {
		super();
	}

    init():void {
		this.skinName = panels.CCDDZPanelActAppLuckySkin;
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
		this.luckyBtn["addClickListener"](this._onClickLucky,this);
	}

	/**
	 * 点击抽奖按钮
	 */
	private _onClickLucky():void{
		let cc_nativeBridge = CCalien.Native.instance;
		if(cc_nativeBridge.isNative ||(!cc_nativeBridge.isNative && egret.Capabilities.os == "iOS" && !cc_nativeBridge.isWXMP)){
			CCDDZPanelLucky.instance.show(2);
		}else{
			CCDDZAlert.show("登录APP端才能抽奖，是否确定下载？",0,function(act){
				if(act == "confirm"){
					CCGlobalGameConfig.downApp();
				}
			})
		}
		
	}

	/**
	 * 初始化界面
	 */
	private _initUI():void{
		let _info = CCGlobalGameConfig.getCfgByField("webCfg.appLucky");
        if(_info && _info.status ==1){
			this["timeLabel"].text = "活动时间：" + _info.time;
		}
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
		CCDDZPanelActAppLucky._instance = null;
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
	 * 获取单例
	 */
    public static getInstance(): CCDDZPanelActAppLucky {
        if(!CCDDZPanelActAppLucky._instance) {
            CCDDZPanelActAppLucky._instance = new CCDDZPanelActAppLucky();
        }
        return CCDDZPanelActAppLucky._instance;
    }

	public static nullInstance():void{
		let _ins = CCDDZPanelActAppLucky._instance;
		if(_ins ){
			_ins.close(true);
		}
		CCDDZPanelActAppLucky._instance = null;
	}

	/**
	 * 移除面板
	 */
	public static remove():void{
		if(CCDDZPanelActAppLucky._instance){
			CCDDZPanelActAppLucky._instance.close();
		}
	}
}