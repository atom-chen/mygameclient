/**
 * Created by rockyl on 15/12/28.
 *
 * 提示面板类
 * 通过CCDDZAlert.show()来调用
 */

class CCDDZPanelAlert extends CCalien.CCDDZPanelBase {
	private static _instance:CCDDZPanelAlert;
	public static get instance():CCDDZPanelAlert {
		if (this._instance == undefined) {
			this._instance = new CCDDZPanelAlert();
		}
		return this._instance;
	}

	private labContent:eui.Label;
	private grpButton:eui.Group;
	private btnClose:eui.Button;
	private grpButtonShare:eui.Group;
	public btnConfirm:CCDDZStateButton;
    public btnCancel:CCDDZStateButton;
	/**
	 * 需要保存默认的确认和取消按钮
	 */
	private _defaultConfirmString:string;
	private _defaultCancelString:string;
	private ctxScroller:eui.Scroller;

	protected init():void {
		this.skinName = panels.CCDDZPanelAlertSkin;
		this._defaultConfirmString = this.btnConfirm.labelIcon;
		this._defaultCancelString = this.btnCancel.labelIcon;
	}

	constructor() {
		super(CCalien.CCDDZpopupEffect.Scale, {
			withFade: true,
			ease: egret.Ease.backOut
		}, CCalien.CCDDZpopupEffect.Scale, {withFade: true, ease: egret.Ease.backIn});
	}

	createChildren():void {
		super.createChildren();
		this.grpButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGrpButtonTap, this);
		this.grpButtonShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGrpButtonTap, this);
		this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.dealAction.bind(this,"close"), this);
	}

	private onGrpButtonTap(event:egret.TouchEvent):void {
		this.dealAction(event.target.name);
	}

	show(content, type = 0, callback = null,textAlign:string ="center",textFlow:Array<egret.ITextElement> = null):void {
		this.popup();
		
		this.btnConfirm.labelIcon =  this._defaultConfirmString;
		this.btnCancel.labelIcon = this._defaultCancelString;
		this.btnConfirm.scaleX = 1;
		this.btnConfirm.scaleY = 1;
		this.btnConfirm.bgImg.visible = true;
		this.labContent.text = content;

		if(textFlow == null){
			textFlow = [{"text":content}];
		}
		this.labContent.textFlow= textFlow;
		this._callback = callback;
		this.labContent.textAlign = textAlign;

		this.grpButtonShare.visible = false;
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
			case 2:
				this.grpButtonShare.visible = true;
				this.grpButton.visible = false;
				if (!this.grpButton.contains(this.btnCancel)) {
					this.grpButton.addChild(this.btnCancel);
				}
				break;
		}
	}
	
	static getInstance():CCDDZPanelAlert{
		return this._instance;
	}
}

class CCDDZAlert {
	static show(content:string, type:number = 0, callback:Function = null,textAlign:string = "center",textFlow:Array<egret.ITextElement> = null):void {
		CCDDZPanelAlert.instance.show(content, type, callback, textAlign,textFlow);
	}

}