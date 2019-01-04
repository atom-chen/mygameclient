/**
 * Created by rockyl on 15/12/28.
 *
 * 提示面板类
 * 通过Alert.show()来调用
 */

class PanelAlert2 extends alien.PanelBase {
	private static _instance:PanelAlert2;
	public static get instance():PanelAlert2 {
		if (this._instance == undefined) {
			this._instance = new PanelAlert2();
		}
		return this._instance;
	}

	private labContent:eui.Label;
	private btnConfirm:NormalButton;
	private btnClose:eui.Button;

	protected init():void {
		this.skinName = panels.PanelAlert2Skin;
	}

	constructor() {
		super(alien.popupEffect.Scale, {
			withFade: true,
			ease: egret.Ease.backOut
		}, alien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backIn});
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

class Alert2 {
	static show(content:string, buttonRes, callback:Function = null):void {
		PanelAlert2.instance.show(content, buttonRes, callback);
	}
}