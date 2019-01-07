/**
 *
 * @ cyj
 *
 */

class PDKPanelInviteList extends PDKalien.PDKPanelBase {
	private static _instance:PDKPanelInviteList;
	/**
	 * 没有邀请的玩家提示group
	 */
	private noInviteGroup:eui.Group;

	public static get instance():PDKPanelInviteList {
		if (this._instance == undefined) {
			this._instance = new PDKPanelInviteList();
		}
		return this._instance;
	}

	// protected init():void {

	// }

	constructor() {
		super(
			PDKalien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backOut},
			PDKalien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backIn}
		);
	}

	// constructor(){
	// 	super();

	// 	this.init();
	// }

	private rectMask: eui.Rect;
	private btnClose: eui.Button;
	private lbCount: eui.Label;
	private scroller: eui.Scroller;
	private list:eui.List;
	private _dataProvide:eui.ArrayCollection;
	protected _callback;
	protected init():void {
        this.skinName =  panels.PDKPanelInvateListSkin;
		this.list.itemRenderer = PDKInviteListItem;
		if (!this._dataProvide){
			this._dataProvide=new eui.ArrayCollection([]);	
			this.list.dataProvider=this._dataProvide;
		}
	}

	createChildren():void {
		super.createChildren();
		// this.list.itemRenderer = PDKInviteListItem;
		
		// this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnCloseClick, this);
		let e: PDKalien.PDKEventManager = PDKEventManager.instance;
        // e.registerOnObject(this,this.btnClose,egret.TouchEvent.TOUCH_TAP,this.onBtnCloseClick,this);
		this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtnCloseClick,this);
		this.scroller.addEventListener(eui.UIEvent.CHANGE_END, this.scroll2end, this);

		PDKInviteService.instance.addEventListener(PDKEventNames.INVITE_DATA_REFRESH, this.onInviteDataUpdate,this)
		this._showNoInviteTipGroup(true);
		// e.registerOnObject(this,PDKInviteService.instance,,this.onInviteDataUpdate,this);
	}

	private onInviteDataUpdate(event: egret.Event):void{
		let data: any = event.data;
		this._dataProvide.source=data;
		this._dataProvide.refresh();
		this._showNoInviteByInviteList();
		// this.scroller.viewport.scrollV = 0;
		this.lbCount.text = '您已累计获得' + PDKInviteService.instance.complete_amount + '次抽奖杯机会，被邀请好友赢得5局游戏即可获得1次机会';
	}

	private scroll2end(event: egret.Event):void{
		// console.log('afsdfasdfasdfsadfasdfasdfasf');
		PDKInviteService.instance.getInvitePlayersList();
	}
	/**
	 * 显示邀请列表为空的提示
	 */
	private _showNoInviteTipGroup(bShow:boolean):void{
		this.noInviteGroup.visible = bShow;
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
	show(data:any, callback:Function = null):void{
		this._dataProvide.source=data;
		this._dataProvide.refresh();
		this.scroller.viewport.scrollV = 0;
		this._callback = callback;
        this.popup();//this.dealAction.bind(this)

		this.lbCount.text = '您已累计获得' + PDKInviteService.instance.complete_amount + '次抽奖杯机会，被邀请好友赢得5局游戏即可获得1次机会';
	}

	// show1(callback:Function = null):void{
	// 	this._callback = callback;
	// 	this.popup(this.dealAction.bind(this));
	// }

	private onBtnCloseClick(event:egret.TouchEvent):void{
		this.dealAction();
	}

	// clearListItems():void{
	// 	if(this._dataProvide != undefined && this._dataProvide.source != undefined){
	// 		this._dataProvide.source=[];
	// 		this._dataProvide.refresh();
	// 	}
	// }
}