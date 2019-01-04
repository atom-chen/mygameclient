/**
 * Created by zhu on 2017/11/16.
 * 活动告面板
 */

class PanelAct extends alien.PanelBase {
    private static _instance: PanelAct;

	private actList:ActList;

	/**
	 * 左边的箭头指示当前选中的按钮
	 */
	private arrImg:eui.Image;

	/**
	 * 顶层的group
	 */
	private infoGroup:eui.Group;
	constructor() {
		super();
	}

    init():void {
		this.skinName = panels.PanelActSkin;
	}
	
	createChildren():void {
		super.createChildren();
		//let _uid = MainLogic.instance.selfData.uid;
		//webService.getWatchPublicWX(_uid,this._onGetWatchWXHttpRep.bind(this));
		this.actList.setSelectChangeFunc(this._onSelectChange.bind(this));
		this._enableEvent(true);
	}

	private _onSelectChange(data:any):void{
		let _pos = data.pos;
		let _dst = this.infoGroup.globalToLocal(_pos.x,_pos.y);
		
		this.arrImg.y = _dst.y;
	}

	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
        alien.EventManager.instance.disableOnObject(this);
		PanelAct._instance = null;
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
	 * 刷新actlist
	 */
	public refreshActList(): void {
		this.actList.refreshActlist();
	}

	/**
	 * 设置显示绑定手机福利
	 */
	public setShowBindAct():void{
		this.actList.setShowBindAct();
	}
	/**
	 * 设置显示邀请活动
	 */
	public setShowInviteAct():void{
		this.actList.setShowInviteAct();
	}
	/**
	 * 设置显示邀请活动
	 */
	public setShowFFFAct():void{
		this.actList.setShowById(ACT_ID_FFF);
	}
	/**
	 * 设置显示新年礼盒
	 */
	public setShowYearGift():void{
		this.actList.setShowNewYearGift();
	}

	/**
	 * 设置显示APP福利并修改选中的按钮
	 */
	public setShowAppAct():void{
		this.actList.setShowAppAct();
	}
	/**
	 * 设置显示首充并修改选中的按钮
	 */
	public setShowFirstRecharge():void{
		this.actList.setShowFirstRecharge()
		
	}
	/**
	 * 设置显示钻石首充并修改选中的按钮
	 */
	public setShowDFirstRecharge():void{
		this.actList.setShowById(ACT_ID_DIAFIRREC);
	}

	/**
	 * 设置显示感恩节并修改选中的按钮
	 */
	public setShowThanksgiving():void{
		this.actList.setShowThanksgiving();
	}

	/**
	 * 获取公告单例
	 */
    public static getInstance(): PanelAct {
        if(!PanelAct._instance) {
            PanelAct._instance = new PanelAct();
        }
        return PanelAct._instance;
    }

	/**
	 * 移除公告面板
	 */
	public static remove():void{
		if(PanelAct._instance){
			PanelAct._instance.close();
		}
	}
}