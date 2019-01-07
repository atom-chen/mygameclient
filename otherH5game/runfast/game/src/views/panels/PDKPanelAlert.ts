/**
 * Created by rockyl on 15/12/28.
 *
 * 提示面板类
 * 通过PDKAlert.show()来调用
 */

class PDKPanelAlert extends PDKalien.PDKPanelBase {
	private static _instance:PDKPanelAlert;
	public static get instance():PDKPanelAlert {
		if (this._instance == undefined) {
			this._instance = new PDKPanelAlert();
		}
		return this._instance;
	}

	private labContent:eui.Label;
	private grpButton:eui.Group;
	private btnClose:eui.Button;
	private grpButtonShare:eui.Group;
	public btnConfirm:PDKStateButton;
    public btnCancel:PDKStateButton;
	/**
	 * 需要保存默认的确认和取消按钮
	 */
	private _defaultConfirmString:string;
	private _defaultCancelString:string;

	protected init():void {
		this.skinName = panels.PDKPanelAlertSkin;
		this._defaultConfirmString = this.btnConfirm.labelIcon;
		this._defaultCancelString = this.btnCancel.labelIcon;
	}

	constructor() {
		super(PDKalien.popupEffect.Scale, {
			withFade: true,
			ease: egret.Ease.backOut
		}, PDKalien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backIn});
	}

	createChildren():void {
		super.createChildren();
		this.grpButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGrpButtonTap, this);
		this.grpButtonShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGrpButtonTap, this);
		this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGrpButtonTap, this);
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
	
	static getInstance():PDKPanelAlert{
		return this._instance;
	}
}

class PDKAlert {
	static show(content:string, type:number = 0, callback:Function = null,textAlign:string = "center",textFlow:Array<egret.ITextElement> = null):void {
		PDKPanelAlert.instance.show(content, type, callback, textAlign,textFlow);
	}

}