/**
 * Created by rockyl on 15/12/25.
 *
 * 最顶层场景
 */

class PDKSceneMostTop extends PDKalien.SceneBase {
	private grpWaiting: eui.Group;
	private loading: PDKLoading;
	private labLoadingTip: eui.Label;
	private labToast: eui.Label;
	private grpToast: eui.Group;
	private grpDisconnect: eui.Group;
	private labDisconnect: eui.Label;
	private btnReconnect: eui.Button;
	//定时重连的interval;
	private _reconnectInterval: number;
	/**
	 * 是否发生了账号异常 
	 */
	private _bHasAccountErr: boolean;

	constructor() {
		super();

		this.init();
	}

	private init(): void {
		this.skinName = scenes.PDKSceneMostTopSkin;

		this._setHasAccountError(false);
		this.grpWaiting.visible = false;
	}

	createChildren(): void {
		super.createChildren();

		this._reconnectInterval = 0;
		this.grpToast.visible = false;
		this.grpDisconnect.visible = false;

		PDKalien.Dispatcher.addEventListener(PDKEventNames.SHOW_WAITING, this.onShowWaiting, this);
		PDKalien.Dispatcher.addEventListener(PDKEventNames.HIDE_WAITING, this.onHideWaiting, this);

		PDKalien.Dispatcher.addEventListener(PDKEventNames.SHOW_DISCONNECT, this.onShowDisconnect, this);
		PDKalien.Dispatcher.addEventListener(PDKEventNames.HIDE_DISCONNECT, this.onHideDisconnect, this);
		PDKalien.Dispatcher.addEventListener(PDKEventNames.LOGIN_SUCCESS, this._onLoginSuccess, this);

		PDKalien.Dispatcher.addEventListener(PDKEventNames.SHOW_TOAST, this.onShowToast, this);
		PDKalien.Dispatcher.addEventListener(PDKEventNames.ACCOUNT_ERROR, this._onAccountError, this);

		this.btnReconnect.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnReconnectTap, this);

		pdkServer.addEventListener(PDKEventNames.USER_LOGIN_RESPONSE, this._onLoginResponse, this);
		PDKalien.Dispatcher.addEventListener(PDKEventNames.HIDE_MOSTTOP_TIP, this._onClearAllTip, this);
	}

	private onShowWaiting(event: egret.Event): void {
		this.grpWaiting.visible = true;
		this.loading.play();
		this.labLoadingTip.text = event.data ? event.data.content : '';
	}

	private onHideWaiting(event: egret.Event): void {
		this.grpWaiting.visible = false;
		this.loading.stop();
	}

	private onShowToast(event: egret.Event): void {
		this.grpToast.visible = true;
		this.labToast.text = event.data.content;
		this.labToast.textColor = event.data.color >= 0 ? event.data.color : 0xececec;
		egret.Tween.get(this.grpToast, null, null, true).to({ alpha: 1 }, 200).wait(event.data.delay || 1000).to({ alpha: 0 }, 200);
	}

	//清除重连的interval
	_clearReconnectInterval(): void {
		if (this._reconnectInterval != 0) {
			egret.clearInterval(this._reconnectInterval);
		}
		this._reconnectInterval = 0;
	}
	/**
	 * 设置是否发生了账号错误
	 */
	_setHasAccountError(bHas: boolean): void {
		this._bHasAccountErr = bHas;
	}
	//重连后登陆成功
	_onLoginSuccess(): void {
		this._clearReconnectInterval();
		this._hideAllGrp();
		this._setHasAccountError(false);
	}

	//收到登录返回结果
	private _onLoginResponse(): void {
		this._clearReconnectInterval();
	}

	//重连尝试三次
	private _tryReconnect(): void {
		let _nCount = 0;
		this.btnReconnect.visible = false;
		this.labDisconnect.text = "尝试重连中。。。";

		this._clearReconnectInterval();
		let _func = function () {
			if (_nCount >= 3) {
				this.grpDisconnect.visible = true;
				this.btnReconnect.visible = true;
				this.labDisconnect.text = "请检查您的网络后点击重新连接";

				this._clearReconnectInterval();
				return;
			}
			_nCount += 1;
			PDKLoginService.instance.doReconnect();
		}.bind(this);
		this._reconnectInterval = egret.setInterval(function () {
			_func();
		}, this, 5000);
		_func();
	}

	/**
	 * 取消自动重连,隐藏所有提示
	 */
	private _onClearAllTip(): void {
		this._clearReconnectInterval();
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
		if (this._bHasAccountErr) return;
		if (pdkServer._isInDDZ) return;

		this.grpDisconnect.visible = true;
		this.btnReconnect.visible = true;
		this.grpToast.visible = false;
		this.grpWaiting.visible = false;
		this.labDisconnect.text = event.data.content;
		this.btnReconnect.label = event.data.button || PDKlang.reconnect;

		if (PDKalien.Native.instance.isNative) {
			this.btnReconnect.visible = false;
			// 1s后发起自动重连 防止重连速度过快导致服务端一直踢人的情况
			egret.setTimeout(this._tryReconnect, this, 1000);
			// this._tryReconnect();
		}

		this.btnReconnect["clickFunc"] = this._tryReconnect.bind(this);
	}

	/**
	 * 账号异常
	 */
	private _onAccountError(e: egret.Event): void {
		this._setHasAccountError(true);
		this.grpDisconnect.visible = true;
		this.btnReconnect.visible = true;
		this.grpToast.visible = false;
		this.grpWaiting.visible = false;
		this.labDisconnect.text = e.data.content;
		this.btnReconnect.label = PDKlang.confirm;
		this.btnReconnect["clickFunc"] = function () {
			this._hideAllGrp();
			PDKLoginService.instance.doRelogin();
		}.bind(this);
	}

	private onHideDisconnect(event: egret.Event): void {
		this.grpDisconnect.visible = false;
	}

	beforeShow(params: any): void {

	}
}