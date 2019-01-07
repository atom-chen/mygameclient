/**
 *
 * @ cyj
 *
 */

class CCDDZPanelInviteJustList extends CCalien.CCDDZPanelBase {
	private static _instance:CCDDZPanelInviteJustList;
	/**
	 * 没有邀请的玩家提示group
	 */
	private noInviteGroup:eui.Group;

	public static get instance():CCDDZPanelInviteJustList {
		if (this._instance == undefined) {
			this._instance = new CCDDZPanelInviteJustList();
		}
		return this._instance;
	}

	constructor() {
		super(
			CCalien.CCDDZpopupEffect.Scale, {withFade: true, ease: egret.Ease.backOut},
			CCalien.CCDDZpopupEffect.Scale, {withFade: true, ease: egret.Ease.backIn}
		);
	}


	private rectMask: eui.Rect;
	private btnClose: eui.Button;
	private lbCount: eui.Label;
	private scroller: eui.Scroller;
	private list:eui.List;
	private _dataProvide:eui.ArrayCollection;
	protected _callback;

	protected init():void {
        this.skinName =  panels.CCDDZPanelInviteJustListSkin;
		this.list.itemRenderer = CCDDZInviteListItem;
		if (!this._dataProvide){
			this._dataProvide=new eui.ArrayCollection([]);	
			this.list.dataProvider=this._dataProvide;
		}
	}

	createChildren():void {
		super.createChildren();
		let e: CCalien.CCDDZEventManager = CCDDZEventManager.instance;
		this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtnCloseClick,this);
		this.scroller.addEventListener(eui.UIEvent.CHANGE_END, this.scroll2end, this);

		CCDDZInviteService.instance.addEventListener(CCGlobalEventNames.INVITE_DATA_REFRESH, this.onInviteDataUpdate,this)
		this._showNoInviteTipGroup(true);
	}


	private onInviteDataUpdate(event: egret.Event):void{
		let data: any = event.data;
		this._dataProvide.source=data;
		this._dataProvide.refresh();
		this._showNoInviteByInviteList();
		// this.scroller.viewport.scrollV = 0;
		//this.lbCount.text = '您已累计获得' + CCDDZInviteService.instance.complete_amount + '次抽奖杯机会，被邀请好友赢得5局游戏即可获得1次机会';
	}
	/**
	 * 根据服务器返回的邀请列表显示是否提示空的提示
	 */
	private _showNoInviteByInviteList():void{
		if(this._dataProvide.source.length > 0){
			this._showNoInviteTipGroup(false);
		}else{
			this._showNoInviteTipGroup(true);
		}
	}
	private scroll2end(event: egret.Event):void{
		CCDDZInviteService.instance.getInvitePlayersList();
	}

	/**
	 * 显示邀请列表为空的提示
	 */
	private _showNoInviteTipGroup(bShow:boolean):void{
		this.noInviteGroup.visible = bShow;
	}

	show():void{
        this.popup();
		CCDDZInviteService.instance.getInvitePlayersList();
		//this.lbCount.text = '您已累计获得' + CCDDZInviteService.instance.complete_amount + '次抽奖杯机会，被邀请好友赢得5局游戏即可获得1次机会';
	}

	private onBtnCloseClick(event:egret.TouchEvent):void{
		this.dealAction();
	}

}