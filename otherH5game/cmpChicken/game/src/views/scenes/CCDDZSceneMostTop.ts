/**
 * Created by rockyl on 15/12/25.
 *
 * 最顶层场景
 */

class CCDDZSceneMostTop extends CCalien.CCDDZSceneBase {
	private grpWaiting: eui.Group;
	private loading: CCDDZLoading;
	private labLoadingTip: eui.Label;
	private labToast: eui.Label;
	private grpToast: eui.Group;
	private grpDisconnect: eui.Group;
	private labDisconnect: eui.Label;
	private btnReconnect: eui.Button;

	constructor() {
		super();

		this.init();
	}

	private init(): void {
		this.skinName = scenes.CCDDZSceneMostTopSkin;

		this.grpWaiting.visible = false;
	}

	createChildren(): void {
		super.createChildren();

		this.grpToast.visible = false;
		this.grpDisconnect.visible = false;

		CCalien.CCDDZDispatcher.addEventListener(CCGlobalEventNames.SHOW_WAITING, this.onShowWaiting, this);
		CCalien.CCDDZDispatcher.addEventListener(CCGlobalEventNames.HIDE_WAITING, this.onHideWaiting, this);

		CCalien.CCDDZDispatcher.addEventListener(CCGlobalEventNames.SHOW_DISCONNECT, this.onShowDisconnect, this);
		CCalien.CCDDZDispatcher.addEventListener(CCGlobalEventNames.HIDE_DISCONNECT, this.onHideDisconnect, this);

		CCalien.CCDDZDispatcher.addEventListener(CCGlobalEventNames.SHOW_TOAST, this.onShowToast, this);
		CCalien.CCDDZDispatcher.addEventListener(CCGlobalEventNames.ACCOUNT_ERROR, this._onAccountError, this);
		ccserver.addEventListener(CCGlobalEventNames.USER_LOGIN_RESPONSE, this._onLoginResponse, this);
		this.btnReconnect.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnReconnectTap, this);
	}

	private onShowWaiting(event: egret.Event): void {
		this.grpWaiting.visible = true;
		this.grpDisconnect.visible = false;
		this.loading.play();
		this.labLoadingTip.text = event.data ? event.data.content : '';
	}

	private onHideWaiting(event: egret.Event): void {
		this.grpWaiting.visible = false;
		this.loading.stop();
		this._hideAllGrp();
	}

	private onShowToast(event: egret.Event): void {
		this.grpToast.visible = true;
		this.labToast.text = event.data.content;
		this.labToast.textColor = event.data.color >= 0 ? event.data.color : 0xececec;
		egret.Tween.get(this.grpToast, null, null, true).to({ alpha: 1 }, 200).wait(event.data.delay || 1000).to({ alpha: 0 }, 200);
	}

	private _onLoginResponse(): void {
		this._hideAllGrp();
	}

	/**
	 * 需要隐藏所有的提示
	 */
	private _hideAllGrp(): void {
		this.grpToast.visible = false;
		this.grpDisconnect.visible = false;
		this.grpWaiting.visible = false;
	}

	private onBtnReconnectTap(event: egret.TouchEvent): void {
		this.btnReconnect.visible = false;
		if (this.btnReconnect["clickFunc"]) {
			this.btnReconnect["clickFunc"]();
		}
	}

	private onShowDisconnect(event: egret.Event): void {
		if (ccserver._isInDDZ) return;
		this.grpDisconnect.visible = true;
		this.btnReconnect.visible = true;
		this.grpToast.visible = false;
		this.grpWaiting.visible = false;
		this.labDisconnect.text = event.data.content;
		this.btnReconnect.label = event.data.button || lang.reconnect;
		this.btnReconnect["clickFunc"] = this._onTryRelogin.bind(this);
	}

	private _onTryRelogin(): void {
		// 1s后发起自动重连 防止重连速度过快导致服务端一直踢人的情况
		this.labDisconnect.text = "";
		egret.setTimeout(() => {
			CCLoginService.instance.tryReconnectLogin();
		}, this, 1000);
	}

	/**
	 * 账号异常
	 */
	private _onAccountError(e: egret.Event): void {
		this.grpDisconnect.visible = true;
		this.btnReconnect.visible = true;
		this.grpToast.visible = false;
		this.grpWaiting.visible = false;
		this.labDisconnect.text = e.data.content;
		this.btnReconnect.label = lang.confirm;
		this.btnReconnect["clickFunc"] = function () {
			this._hideAllGrp();
			CCLoginService.instance.doRelogin();
		}.bind(this);
	}

	private onHideDisconnect(event: egret.Event): void {
		this._hideAllGrp();
	}

	beforeShow(params: any): void {

	}
}