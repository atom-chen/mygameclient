/**
 * Created by rockyl on 15/12/28.
 *
 * 个人属性信息面板
 */

class CCDDZPanelProfile extends CCalien.CCDDZPanelBase {
	private static _instance:CCDDZPanelProfile;
	public static get instance():CCDDZPanelProfile {
		if (this._instance == undefined) {
			this._instance = new CCDDZPanelProfile();
		}
		return this._instance;
	}

	private avatar:CCDDZAvatar;
	private labNickname:eui.Label;
	private rbBoy:eui.RadioButton;
	private rbGirl:eui.RadioButton;
	private labID:eui.Label;
	private labGold:eui.Label;
	private labHistory:eui.Label;
	private labLevel:eui.Label;
	private btnClose:eui.Button;
	private imgChangeAvatar:eui.Image;

	private _submitData:any;

	protected init():void {
		this.skinName = panels.CCDDZPanelProfileSkin;
	}

	constructor() {
		super(CCalien.CCDDZpopupEffect.Scale, {
			withFade: true,
			ease: egret.Ease.backOut
		}, CCalien.CCDDZpopupEffect.Scale, {withFade: true, ease: egret.Ease.backIn});
	}

	createChildren():void{
		super.createChildren();

		let em:CCalien.CCDDZEventManager = CCalien.CCDDZEventManager.instance;
		em.registerOnObject(this, ccserver, CCGlobalEventNames.USER_MODIFY_USER_INFO_REP, this.onModifyUserInfoRep, this);
		em.registerOnObject(this, this.rbBoy, egret.TouchEvent.TOUCH_TAP, this.onRbBoyTap, this);
		em.registerOnObject(this, this.rbGirl, egret.TouchEvent.TOUCH_TAP, this.onRbGirlTap, this);
		em.registerOnObject(this, this.btnClose, egret.TouchEvent.TOUCH_TAP, this.onBtnCloseTap, this);
		em.registerOnObject(this, this.avatar, egret.TouchEvent.TOUCH_TAP, this.onBtnPickAvatarTap, this);
	}

	private onModifyUserInfoRep(event:egret.Event):void {
		let data:any = event.data;

		switch (data.result) {
			case 0:   //成功
				CCDDZMainLogic.instance.selfData.initData(this._submitData);
				this.updateProfile();
				break;
			case 1:   //失败,数据有误

				break;
			case 2:   //imageid太长

				break;
		}
	}

	private onRbBoyTap(event:egret.TouchEvent):void {
		let data:any = {sex: 1};
		ccserver.modifyUserInfo(data);
		this._submitData = data;
	}

	private onRbGirlTap(event:egret.TouchEvent):void {
		let data:any = {sex: 2};
		ccserver.modifyUserInfo(data);
		this._submitData = data;
	}

	private updateProfile():void {
		let userInfoData:CCGlobalUserInfoData = CCDDZMainLogic.instance.selfData;
		//console.log('userInfoData.imageid:' + userInfoData.imageid);
		this.avatar.imageId = userInfoData.imageid;
		this.labNickname.text = userInfoData.nickname;
		this.labGold.text = CCDDZUtils.currencyRatio(userInfoData.gold);
		this.labID.text = userInfoData.fakeuid + '';

        this.avatar.setVipLevel(userInfoData.getCurVipLevel());
		this.rbBoy.selected = userInfoData.sex == 0 || userInfoData.sex == 1;
		this.rbGirl.selected = userInfoData.sex == 2;
	}

	private onBtnCloseTap(event:egret.TouchEvent):void{
		this.dealAction();
	}

	private onBtnPickAvatarTap(event:egret.TouchEvent):void{
		// CCDDZPanelSelectAvatar.instance.show(this.onPanelSelectAvatarResult.bind(this));
	}

	private onPanelSelectAvatarResult(action:string, data:any):void{
		if(action == 'select'){
			ccserver.modifyUserInfo(this._submitData = {imageid: data.url});
		}
	}

	show(callback):void {
		this.popup(this.dealAction.bind(this));

		this._callback = callback;

		this.updateProfile();

		CCalien.CCDDZEventManager.instance.enableOnObject(this);
	}

	close():void {
		super.close();

		CCalien.CCDDZEventManager.instance.disableOnObject(this);
	}
}