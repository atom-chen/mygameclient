/**
 * Created by rockyl on 15/12/28.
 *
 * 提示面板类
 * 通过PDKAlert.show()来调用
 */

class PDKPanelAlert2 extends PDKalien.PDKPanelBase {
	private static _instance:PDKPanelAlert2;
	public static get instance():PDKPanelAlert2 {
		if (this._instance == undefined) {
			this._instance = new PDKPanelAlert2();
		}
		return this._instance;
	}

	private labContent:eui.Label;
	private btnConfirm:PDKNormalButton;
	private btnClose:eui.Button;

	protected init():void {
		this.skinName = panels.PDKPanelAlert2Skin;
	}

	constructor() {
		super(PDKalien.popupEffect.Scale, {
			withFade: true,
			ease: egret.Ease.backOut
		}, PDKalien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backIn});
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
		PDKPanelAlert2.instance.show(content, buttonRes, callback);
	}
}