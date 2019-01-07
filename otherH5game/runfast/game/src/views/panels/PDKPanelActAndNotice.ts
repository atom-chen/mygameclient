/**
 * Created by zhu on 2017/11/16.
 * 活动公告底板
 */

class PDKPanelActAndNotice extends PDKalien.PDKPanelBase {
    private static _instance: PDKPanelActAndNotice;

	/**
	 * 关闭按钮
	 */
	private closeImg:eui.Image;

	/**
	 * 活动按钮
	 */
	private actNormalGroup:eui.Group;
	
	/**
	 * 公告按钮
	 */
	private noticeNormalGroup:eui.Group;

	/**
	 * 活动模块
	 */
	private _act:PDKPanelAct;

	/**
	 * 公告模块
	 */
	private _notice:PDKPanelNotice;

	constructor() {
		super(PDKalien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, PDKalien.popupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});

	}

    init():void {
		this.skinName = panels.PDKPanelActAndNotice;
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
		this.closeImg["addClickListener"](this._onClickClose, this);
		this.actNormalGroup["addClickListener"](this._onClickTitAct, this,false);
		this.noticeNormalGroup["addClickListener"](this._onClickTitNotice, this,false);
        //let e: PDKalien.PDKEventManager = PDKalien.PDKEventManager.instance;
		//e.registerOnObject(this,PDKalien.Dispatcher,PDKEventNames.HORN_TALK_RECORDS_CHANGE,this._onHornRecChange,this);
	}

	/**
	 * 初始化界面
	 */
	private _initUI():void{
		
	}

	/**
	 * 检查是否创建了活动模块
	 */
	private _checkAct():void{
		if(!this._act){
			this._act = PDKPanelAct.getInstance();
			this.addChild(this._act);
		}
	}

	/**
	 * 检查是否创建了公告模块
	 */
	private _checkNotice():void{
		if(!this._notice){
			this._notice = PDKPanelNotice.getInstance();
			this.addChild(this._notice);
		}
	}

	/**
	 * 检查是否已经加入到舞台
	 */
	private _checkAdded():void{
		if(this.parent) return ;
		this.popup();
	}
	/**
	 * 点击关闭
	 */
	private _onClickClose():void{
		this.dealAction();
	}

	/**
	 * 点击活动
	 */
	private _onClickTitAct():void{
		this.showAct();
	}

	/**
	 * 点击公告
	 */
	private _onClickTitNotice():void{
		this.showNotice();
	}

	/**
	 * 显示首充
	 */
	public showFRecharge():void{
		this.showAct();
		this._act.setShowFirstRecharge();
	}

	/**
	 * 显示感恩节活动
	 */
	public showThanksgiving():void{
		this.showAct();
		this._act.setShowThanksgiving();
	}

	/**
	 * 显示APP福利
	 */
	public showAPPAct():void{
		this.showAct();
		this._act.setShowAppAct();
	}

	/**
	 * 是否显示act
	 */
	private _enableShowAct(bShow:boolean):void{
		if(!this._act) return;
		this._act.visible = bShow;
	}

	/**
	 * 是否显示notice
	 */
	private _enableShowNotice(bShow:boolean):void{
		if(!this._notice) return;
		this._notice.visible = bShow;
	}

	/**
	 * 显示活动
	 */
	public showAct():void{
		this.currentState = "act";
		this._enableShowAct(true);
		this._enableShowNotice(false);
		this._checkAct();
		this._checkAdded();
		//egret.setTimeout(this._act.setShowFirstRecharge,this._act,100);
	}

	/**
	 * 显示公告
	 */
	public showNotice():void{
		this.currentState = "notice";
		this._enableShowAct(false);
		this._enableShowNotice(true);
		this._checkNotice();
		this._checkAdded();
		//egret.setTimeout(this._notice.setShowRedExchange,this._notice,100);
	}

	/**
	 * 显示红包兑换
	 */
	public showRedExchange():void{
		this.showNotice();
	}

	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
        PDKalien.PDKEventManager.instance.disableOnObject(this);
		PDKPanelActAndNotice._instance = null;
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
	 * 获取活动公告单例
	 */
    public static getInstance(): PDKPanelActAndNotice {
        if(!PDKPanelActAndNotice._instance) {
            PDKPanelActAndNotice._instance = new PDKPanelActAndNotice();
        }
        return PDKPanelActAndNotice._instance;
    }

	/**
	 * 移除活动公告面板
	 */
	public static remove():void{
		if(PDKPanelActAndNotice._instance){
			PDKPanelActAndNotice._instance.close();
		}
	}
}