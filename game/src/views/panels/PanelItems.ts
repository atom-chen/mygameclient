/**
 * Created by rockyl on 15/12/28.
 *
 * 提示面板类
 */

class PanelItems extends alien.PanelBase {
	private static _instance:PanelItems;
	public static get instance():PanelItems {
		if (this._instance == undefined) {
			this._instance = new PanelItems();
		}
		return this._instance;
	}
	private labTit:eui.Label;
	private labContent:eui.Label;
	private grpButton:eui.Group;
	private btnClose:eui.Button;
	public btnConfirm:StateButton;
    public btnCancel:StateButton;
	private _defaultConfirmString:string;
	private _defaultCancelString:string;
	private ctxScroller:eui.Scroller;
	private goodsList:eui.List;
	private goodsDataProvider:eui.ArrayCollection;

	protected init():void {
		this.skinName = panels.PanelItemsSkin;
		this._defaultConfirmString = this.btnConfirm.labelIcon;
		this._defaultCancelString = this.btnCancel.labelIcon;
	}

	constructor() {
		super(alien.popupEffect.Scale, {
			withFade: true,
			ease: egret.Ease.backOut
		}, alien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backIn});
	}

	createChildren():void {
		super.createChildren();
		this.grpButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGrpButtonTap, this);
		this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.dealAction.bind(this,"close"), this);

		this.goodsList.itemRenderer = GoodsItemRender;
		this.goodsDataProvider = new eui.ArrayCollection();
		this.goodsList.dataProvider = this.goodsDataProvider;
	}

	private onGrpButtonTap(event:egret.TouchEvent):void {
		this.dealAction(event.target.name);
	}

	show(tit,titColor=0x000000,items,content,contentColor=0x000000, type = 0, callback = null,textAlign:string ="center",textFlow:Array<egret.ITextElement> = null):void {
		this.popup();
		
		this.btnConfirm.labelIcon =  this._defaultConfirmString;
		this.btnCancel.labelIcon = this._defaultCancelString;
		this.btnConfirm.scaleX = 1;
		this.btnConfirm.scaleY = 1;
		this.btnConfirm.bgImg.visible = true;
		this.labContent.text = content;
		this.labContent.textColor = contentColor;
		if(textFlow == null){
			textFlow = [{"text":content}];
		}
		this.labTit.text = tit;
		this.labTit.textColor = titColor;
		this.labContent.textFlow= textFlow;
		this._callback = callback;
		this.labContent.textAlign = textAlign;
		this.goodsDataProvider.source = items;
		this.grpButton.visible = true;
		this.labContent.validateNow();
		if(this.labContent.textHeight < this.ctxScroller.height){
			this.labContent.y = (this.ctxScroller.height - this.labContent.textHeight) *0.5;
		}else{
			this.labContent.y = 0;
		}
		
		this.ctxScroller.stopAnimation();
		this.ctxScroller.viewport.scrollV =0;
		this.ctxScroller.validateNow();

		switch (type) {
			case 0:
				if (this.grpButton.contains(this.btnCancel)) {
					this.grpButton.removeChild(this.btnCancel);
				}
				break;
			case 1:
				if (!this.grpButton.contains(this.btnCancel)) {
					this.grpButton.addChild(this.btnCancel);
				}
				break;
		}
	}
	
	static getInstance():PanelItems{
		return this._instance;
	}
}

class GoodsItemRender extends eui.ItemRenderer{
	private goodsItem:GoodsItem;

	createChildren():void {
		super.createChildren();
	}

	protected dataChanged():void {
		super.dataChanged();
		let data:any = this.data;
		this.goodsItem.setData(data);
	}
}