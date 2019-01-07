/**
 *
 * @ cyj
 *
 */

class PDKHistoryRecord extends PDKalien.PDKPanelBase {
	private static _instance:PDKHistoryRecord;
	public static get instance():PDKHistoryRecord {
		if (this._instance == undefined) {
			this._instance = new PDKHistoryRecord();
		}
		return this._instance;
	}

	constructor() {
		super(
			PDKalien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backOut},
			PDKalien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backIn}
		);
	}

	private btnClose: eui.Button;
	// private lbCount: eui.Label;
	private scroller: eui.Scroller;
	private list:eui.List;
	private _dataProvide:eui.ArrayCollection;
	protected _callback;
	protected init():void {
        this.skinName = components.PDKHistoryRecordSkin;
		this.list.itemRenderer = PDKHistoryItem;
		if (!this._dataProvide){
			this._dataProvide=new eui.ArrayCollection([]);	
			this.list.dataProvider=this._dataProvide;
		}
	}

	createChildren():void {
		super.createChildren();
		this.list.itemRenderer = PDKHistoryItem;
		
		this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtnCloseClick,this);
		this.scroller.addEventListener(eui.UIEvent.CHANGE_END, this.scroll2end, this);
		PDKPersonalGameHistory.instance.addEventListener(PDKEventNames.PGAME_RECORD_DATA_REFRESH, this.onGameRecordDataUpdate,this)
	}

	private onGameRecordDataUpdate(event: egret.Event):void{
		let data: any = event.data;
		this._dataProvide.source=data;
		this._dataProvide.refresh();
		// this.scroller.viewport.scrollV = 0;
	}

	private scroll2end(event: egret.Event):void{
		// console.log('afsdfasdfasdfsadfasdfasdfasf');
		PDKPersonalGameHistory.instance.getDataList();
	}

	show(data:any, callback:Function = null):void{
		this._dataProvide.source=data;
		this._dataProvide.refresh();
		this.scroller.viewport.scrollV = 0;

		this._callback = callback;
		this.popup();//this.dealAction.bind(this)
	}

	private onBtnCloseClick(event:egret.TouchEvent):void{
		this.dealAction();
	}
}