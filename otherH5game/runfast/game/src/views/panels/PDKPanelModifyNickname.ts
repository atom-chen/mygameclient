/**
 * Created by rockyl on 16/9/14.
 */

class PDKPanelModifyNickname extends PDKalien.PDKPanelBase {
	private static _instance: PDKPanelModifyNickname;
	public static get instance(): PDKPanelModifyNickname {
		if (this._instance == undefined) {
			this._instance = new PDKPanelModifyNickname();
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
			PDKalien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backOut},
			PDKalien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backIn}
		);
	}

	createChildren(): void {
		super.createChildren();

		let em: PDKalien.PDKEventManager = PDKalien.PDKEventManager.instance;
		em.registerOnObject(this, pdkServer, PDKEventNames.USER_MODIFY_USER_INFO_REP, this.onModifyUserInfoRep, this);
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
				let len = PDKalien.PDKUtils.getByteLen(nickname);
				if(len < 4 || len > 16){
					result = 5;
				}else if(PDKUtils.regNickname(nickname)){
					result = 1001;
				}
				if(result > 0){
					this.labErr.text = PDKlang.modify_profile_err[result];
				}else{
					this.labErr.text = '';

					let data:any = {nickname: PDKBase64.encode(nickname)};
					pdkServer.modifyUserInfo(data);
					this._submitData = data;
				}
				break;
		}
	}

	private onModifyUserInfoRep(event: egret.Event): void {
		let data: any = event.data;

		let rname = data.rname || 0;
		if (rname == 0) {
			PDKMainLogic.instance.selfData.initData(this._submitData);
			PDKToast.show(PDKlang.modify_profile_err[0]);
			PDKalien.Dispatcher.dispatch(PDKEventNames.MY_USER_INFO_UPDATE);
			this.dealAction();
		}else{
			this.labErr.text = PDKlang.modify_profile_err[data.rname];
		}
	}

	show(): void {
		if (!this.skinName) {
			this.skinName = panels.PDKPanelModifyNicknameSkin;
		}

		this.popup();
		this.labErr.text = '';

		PDKalien.PDKEventManager.instance.enableOnObject(this);
	}

	close():void {
		super.close();

		PDKalien.PDKEventManager.instance.disableOnObject(this);
	}
}