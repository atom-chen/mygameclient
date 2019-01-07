/**
 * Created by rockyl on 16/4/12.
 *
 * 登录面板
 */

class CCDDZPanelLogin extends CCalien.CCDDZPanelBase {
	private static _instance:CCDDZPanelLogin;
	public static get instance():CCDDZPanelLogin {
		if (this._instance == undefined) {
			this._instance = new CCDDZPanelLogin();
		}
		return this._instance;
	}
	private tiID:eui.TextInput;
	private tiPassword:eui.TextInput;
	private grpButton:eui.Group;
	private btnClose:eui.Button;
	protected init():void {
		this.skinName = panels.CCDDZPanelLoginSkin;
	}

	constructor() {
		super(
			CCalien.CCDDZpopupEffect.Flew, {direction: 'up', ease: egret.Ease.backOut},
			CCalien.CCDDZpopupEffect.Flew, {direction: 'up', ease: egret.Ease.backIn}
		);

		this.addExcludeForClose(['confirm']);
	}

	private addListeners():void {
		this.grpButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGrpButtonTap, this);
		this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnCloseTap, this);
	}

	private removeListeners():void {
		this.grpButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGrpButtonTap, this);
		this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnCloseTap, this);
	}

	private onGrpButtonTap(event:egret.TouchEvent):void {
		switch (event.target.name) {
			case 'forgot':
				break;
			case 'register':
				break;
			case 'confirm':
				let id:string = this.tiID.text;
				let password:string = this.tiPassword.text;
				let autoLogin:boolean = true;

				CCGlobalGameData.instance.setItem('id', id, true);
				this.dealAction('confirm', {id, password, autoLogin});
				break;
		}
	}

	private onBtnCloseTap(event:egret.TouchEvent):void {
		this.dealAction();
	}

	createChildren():void {
		super.createChildren();
	}

	show(callback:Function):void{
		this._callback = callback;

		this.popup();

		this.tiID.text = CCGlobalGameData.instance.getItem('id');
		this.tiPassword.text = '';

		this.addListeners();
	}

	close():void {
		super.close();
		this.removeListeners();
	}
}