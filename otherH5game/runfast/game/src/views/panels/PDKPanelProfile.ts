/**
 * Created by rockyl on 15/12/28.
 *
 * 个人属性信息面板
 */

class PDKPanelProfile extends PDKalien.PDKPanelBase {
	private static _instance: PDKPanelProfile;
	public static get instance(): PDKPanelProfile {
		if (this._instance == undefined) {
			this._instance = new PDKPanelProfile();
		}
		return this._instance;
	}

	private avatar: PDKAvatar;
	private labNickname: eui.Label;
	private rbBoy: eui.RadioButton;
	private rbGirl: eui.RadioButton;
	private labID: eui.Label;
	private labGold: eui.Label;
	private labHistory: eui.Label;
	private labLevel: eui.Label;
	private btnClose: eui.Button;
	private imgChangeAvatar: eui.Image;

	private _submitData: any;

	protected init(): void {
		this.skinName = panels.PDKPanelProfileSkin;
	}

	constructor() {
		super(PDKalien.popupEffect.Scale, {
			withFade: true,
			ease: egret.Ease.backOut
		}, PDKalien.popupEffect.Scale, { withFade: true, ease: egret.Ease.backIn });
	}

	createChildren(): void {
		super.createChildren();

		let em: PDKalien.PDKEventManager = PDKalien.PDKEventManager.instance;
		em.registerOnObject(this, pdkServer, PDKEventNames.USER_MODIFY_USER_INFO_REP, this.onModifyUserInfoRep, this);
		em.registerOnObject(this, this.rbBoy, egret.TouchEvent.TOUCH_TAP, this.onRbBoyTap, this);
		em.registerOnObject(this, this.rbGirl, egret.TouchEvent.TOUCH_TAP, this.onRbGirlTap, this);
		em.registerOnObject(this, this.btnClose, egret.TouchEvent.TOUCH_TAP, this.onBtnCloseTap, this);
		em.registerOnObject(this, this.avatar, egret.TouchEvent.TOUCH_TAP, this.onBtnPickAvatarTap, this);
	}

	private onModifyUserInfoRep(event: egret.Event): void {
		let data: any = event.data;

		switch (data.result) {
			case 0:   //成功
				PDKMainLogic.instance.selfData.initData(this._submitData);
				this.updateProfile();
				break;
			case 1:   //失败,数据有误

				break;
			case 2:   //imageid太长

				break;
		}
	}

	private onRbBoyTap(event: egret.TouchEvent): void {
		let data: any = { sex: 1 };
		pdkServer.modifyUserInfo(data);
		this._submitData = data;
	}

	private onRbGirlTap(event: egret.TouchEvent): void {
		let data: any = { sex: 2 };
		pdkServer.modifyUserInfo(data);
		this._submitData = data;
	}

	private updateProfile(): void {
		let userInfoData: PDKUserInfoData = PDKMainLogic.instance.selfData;
		//console.log('userInfoData.imageid:' + userInfoData.imageid);
		this.avatar.imageId = userInfoData.imageid;
		this.labNickname.text = userInfoData.nickname;
		this.labGold.text = PDKUtils.currencyRatio(userInfoData.gold);
		this.labID.text = userInfoData.fakeuid + '';
		this.avatar.setVipLevel(userInfoData.getCurVipLevel());
		this.rbBoy.selected = userInfoData.sex == 0 || userInfoData.sex == 1;
		this.rbGirl.selected = userInfoData.sex == 2;
	}

	private onBtnCloseTap(event: egret.TouchEvent): void {
		this.dealAction();
	}

	private onBtnPickAvatarTap(event: egret.TouchEvent): void {
		// PDKPanelSelectAvatar.instance.show(this.onPanelSelectAvatarResult.bind(this));
	}

	private onPanelSelectAvatarResult(action: string, data: any): void {
		if (action == 'select') {
			pdkServer.modifyUserInfo(this._submitData = { imageid: data.url });
		}
	}

	show(callback): void {
		this.popup(this.dealAction.bind(this));

		this._callback = callback;

		this.updateProfile();

		PDKalien.PDKEventManager.instance.enableOnObject(this);
	}

	close(): void {
		super.close();

		PDKalien.PDKEventManager.instance.disableOnObject(this);
	}
}