/**
 * Created by rockyl on 15/12/28.
 *
 * 提示面板类
 * 通过CCDDZAlert.show()来调用
 */

class CCDDZPanelAlert2 extends CCalien.CCDDZPanelBase {
	private static _instance:CCDDZPanelAlert2;
	public static get instance():CCDDZPanelAlert2 {
		if (this._instance == undefined) {
			this._instance = new CCDDZPanelAlert2();
		}
		return this._instance;
	}

	private labContent:eui.Label;
	private btnConfirm:CCDDZNormalButton;
	private btnClose:eui.Button;

	protected init():void {
		this.skinName = panels.CCDDZPanelAlert2Skin;
	}

	constructor() {
		super(CCalien.CCDDZpopupEffect.Scale, {
			withFade: true,
			ease: egret.Ease.backOut
		}, CCalien.CCDDZpopupEffect.Scale, {withFade: true, ease: egret.Ease.backIn});
	}

	createChildren():void {
		super.createChildren();

		this.btnConfirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnConfirmTap, this);
		this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnCloseTap, this);
	}

	private onBtnConfirmTap(event:egret.TouchEvent):void {
		this.dealAction(event.target.name);
	}

	private onBtnCloseTap(event:egret.TouchEvent):void {
		this.dealAction();
	}

	show(content, buttonRes, callback = null):void {
		this.popup();

		this.labContent.text = content;
		this._callback = callback;

		this.btnConfirm.bgRes = buttonRes;
	}
}

class CCDDZAlert2 {
	static show(content:string, buttonRes, callback:Function = null):void {
		CCDDZPanelAlert2.instance.show(content, buttonRes, callback);
	}
}