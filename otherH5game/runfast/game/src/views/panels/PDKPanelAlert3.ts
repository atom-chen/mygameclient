/**
 * Created by rockyl on 15/12/28.
 *
 * 提示面板类
 * 通过PDKAlert.show()来调用
 */

class PDKPanelAlert3 extends PDKalien.PDKPanelBase {
	private static _instance: PDKPanelAlert3;
	public static get instance(): PDKPanelAlert3 {
		if (this._instance == undefined) {
			this._instance = new PDKPanelAlert3();
		}
		return this._instance;
	}

	private labContent: eui.Label;
	private grpButton: eui.Group;
	public btnConfirm: PDKStateButton;
	public btnCancel: PDKStateButton;

	private _defaultConfirmString: string;
	private _defaultCancelString: string;

	private btnClose: eui.Button;
	protected init(): void {
		this.skinName = panels.PDKPanelAlertSkin;

		this._defaultConfirmString = this.btnConfirm.labelIcon;
		this._defaultCancelString = this.btnCancel.labelIcon;
	}

	constructor() {
		super(PDKalien.popupEffect.Scale, {
			withFade: true,
			ease: egret.Ease.backOut
		}, PDKalien.popupEffect.Scale, { withFade: true, ease: egret.Ease.backIn });
	}

	createChildren(): void {
		super.createChildren();

		this.grpButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGrpButtonTap, this);

		this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.close, this);
	}

	private onGrpButtonTap(event: egret.TouchEvent): void {
		this.dealAction(event.target.name);
	}

	// private onClose(event:egret.TouchEvent):void {
	// if(this._excludeActionsClose.indexOf('xx') < 0) {
	// this.close();
	// }
	// this.dealAction('cancel');
	// }

	show(content, type = 0, callback = null, showClose: boolean = false): void {
		this.popup();
		this.btnConfirm.labelIcon = this._defaultConfirmString;
		this.btnCancel.labelIcon = this._defaultCancelString;

		this.btnClose.visible = showClose;
		this.labContent.textFlow = (new egret.HtmlTextParser).parser(content);
		this._callback = callback;

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
}

class PDKAlert3 {
	static show(content: string, callback: Function = null, str: string = "", showClose: boolean = false): void {
		PDKPanelAlert3.instance.show(content, 0, callback, showClose);
		PDKPanelAlert3.instance.btnConfirm.labelIcon = str;
	}
}