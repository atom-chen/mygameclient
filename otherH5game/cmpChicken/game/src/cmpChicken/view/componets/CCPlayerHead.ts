/**
 * Created by rockyl on 16/1/5.
 *
 * 头像
 */

class CCPlayerHead extends eui.Component {
	private imgMask: eui.Image;
	private imgAvatar: eui.Image;
	private grpHead: eui.Image;
	private quitFlag: eui.Image;
	private ownerFlag: eui.Image;
	private readyFlag: eui.Image;
	private _headTouchFunc: Function; //头像点击回调 目前用背景作为点击的对象
	private _headCGlobalPos: egret.Point;//玩家头像中心点全局坐标	
	createChildren(): void {
		super.createChildren();
		this._initDefault();
		this._initTouchEvent();
		this.imgAvatar.source = 'cc_icon_head_default';

		if (this.imgMask) {
			this.imgAvatar.mask = this.imgMask;
		}
	}
	/**
	 * 获取头像中心的的坐标 zhu
	 */
	public getHeadCenGlobalPos(): egret.Point {
		if (!this._headCGlobalPos) {
			let x = this.imgAvatar.x;
			let y = this.imgAvatar.y;
			let width = this.imgAvatar.width;
			let height = this.imgAvatar.height;
			let pos = new egret.Point(0, 0);
			this._headCGlobalPos = this.imgAvatar.localToGlobal(x + width * 0.5, y + height * 0.5);
		}
		return this._headCGlobalPos;
	}
	/**
	 * 初始化默认数据 zhu
	 */
	private _initDefault(): void {
		this._headTouchFunc = null;
		this.grpHead.touchEnabled = false;
	}

	/**
	 * 初始化点击事件 zhu
	 */
	private _initTouchEvent(): void {
		this.grpHead.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchHead, this);
	}

	/**
	 * 点击头像 zhu
	 */
	private _onTouchHead(e: egret.TouchEvent): void {
		if (this._headTouchFunc) {
			this._headTouchFunc();
		}
	}

	/**
	 * 头像点击回调 zhu
	 */
	public setHeadTouchFunc(func: Function): void {
		this._headTouchFunc = func;
	}

	/**
	 * 图像是否可以点击 zhu
	 */
	public setHeadTouch(bEnable: boolean): void {
		this.grpHead.touchEnabled = bEnable;
	}


	setQuitFlagVisible(v: boolean) {
		this.quitFlag.visible = v;
	}

	setOwnerFlagVisible(v: boolean) {
		this.ownerFlag.visible = v;
	}

	setReadyFlagVisible(v: boolean) {
		this.readyFlag.visible = v;
	}

	set imageId(value: string) {
		let _url = value;
		if (value) {
			if (value != this.imgAvatar.source) {
				if (value.indexOf("http://") != -1) {
					_url = value.replace("http://", "https://");
				}
				this.imgAvatar.source = _url;//RES.getRes(defaultAvatar);
			}
		}
		else {
			if(value == "") {
				this.imgAvatar.source = "cc_play_common_avatar_bg"
			}
		}
	}

	clean(): void {
		this.imgAvatar.source = null;
	}
}
window["CCPlayerHead"] = CCPlayerHead;