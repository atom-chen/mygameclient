/**
 * Created by rockyl on 16/9/14.
 */

class CCDDZPanelModifyNickname extends CCalien.CCDDZPanelBase {
	private static _instance: CCDDZPanelModifyNickname;
	public static get instance(): CCDDZPanelModifyNickname {
		if (this._instance == undefined) {
			this._instance = new CCDDZPanelModifyNickname();
		}
		return this._instance;
	}

	public labErr: eui.Label;
	public tiNickname: eui.TextInput;
	public grpButtons: eui.Group;
	public btnClose:eui.Button;

	private _submitData: any;

	protected init(): void {

	}

	constructor() {
		super(
			CCalien.CCDDZpopupEffect.Scale, {withFade: true, ease: egret.Ease.backOut},
			CCalien.CCDDZpopupEffect.Scale, {withFade: true, ease: egret.Ease.backIn}
		);
	}

	createChildren(): void {
		super.createChildren();

		let em: CCalien.CCDDZEventManager = CCalien.CCDDZEventManager.instance;
		em.registerOnObject(this, ccserver, CCGlobalEventNames.USER_MODIFY_USER_INFO_REP, this.onModifyUserInfoRep, this);
		em.registerOnObject(this, this.grpButtons, egret.TouchEvent.TOUCH_TAP, this.onGrpButtonsTap, this);
	}

	private onGrpButtonsTap(event:egret.TouchEvent):void{
		switch(event.target.name){
			case 'close':
				this.dealAction();
				break;
			case 'confirm':
				let result = 0;
				let nickname:string = this.tiNickname.text;
				let len = CCalien.CCDDZUtils.getByteLen(nickname);
				if(len < 4 || len > 16){
					result = 5;
				}else if(CCDDZUtils.regNickname(nickname)){
					result = 1001;
				}
				if(result > 0){
					this.labErr.text = lang.modify_profile_err[result];
				}else{
					this.labErr.text = '';

					let data:any = {nickname: CCDDZBase64.encode(nickname)};
					ccserver.modifyUserInfo(data);
					this._submitData = data;
				}
				break;
		}
	}

	private onModifyUserInfoRep(event: egret.Event): void {
		let data: any = event.data;

		let rname = data.rname || 0;
		if (rname == 0) {
			CCDDZMainLogic.instance.selfData.initData(this._submitData);
			CCDDZToast.show(lang.modify_profile_err[0]);
			CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.MY_USER_INFO_UPDATE);
			this.dealAction();
		}else{
			this.labErr.text = lang.modify_profile_err[data.rname];
		}
	}

	show(): void {
		if (!this.skinName) {
			this.skinName = panels.CCDDZPanelModifyNicknameSkin;
		}

		this.popup();
		this.labErr.text = '';

		CCalien.CCDDZEventManager.instance.enableOnObject(this);
	}

	close():void {
		super.close();

		CCalien.CCDDZEventManager.instance.disableOnObject(this);
	}
}