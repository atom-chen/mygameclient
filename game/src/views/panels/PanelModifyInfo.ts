/**
 * Created by rockyl on 16/9/14.
 */

class PanelModifyInfo extends alien.PanelBase {
	private static _instance: PanelModifyInfo;
	public static get instance(): PanelModifyInfo {
		if (this._instance == undefined) {
			this._instance = new PanelModifyInfo();
		}
		return this._instance;
	}


	private _submitData: any;

	protected init(): void {

	}

	constructor() {
		super(
			alien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backOut},
			alien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backIn}
		);
	}

	createChildren(): void {
		super.createChildren();
	}


	private _enableEvent(bEnable):void{
		let _func = "addEventListener";
		if(bEnable == false){
			_func = "removeEventListener";
		}
		server[_func](EventNames.USER_MODIFY_USER_INFO_REP, this.onModifyUserInfoRep, this);
	}

	private _initUI():void{
		let data = MainLogic.instance.selfData;
		if(data.sex == 0 || data.sex == 1){
			this["rbBoy"].selected = true;
		}else{
			this["rbGirl"].selected = true;
		}
	}

	private _addClick():void{
		let func = "addClickListener";
		this["close_btn"][func](this.dealAction,this);
		this["sureBtn"][func](this._onClickSure,this);
	}

	private _onClickSure():void{
		let result = 0;
		/*let nickname:string = this.tiNickname.text;
		let len = alien.Utils.getByteLen(nickname);
		if(len < 4 || len > 16){
			result = 5;
		}else if(Utils.regNickname(nickname)){
			result = 1001;
		}
		if(result > 0){
			this.labErr.text = lang.modify_profile_err[result];
		}else{*/

			let sign = this["signInput"].text;
			let sex = 2;
			let rbGroup:eui.RadioButtonGroup = this["rbBoy"].group;
			if(rbGroup.selectedValue == "male"){
				sex = 1;
			}
			if(sign != ""){
				sign = Utils.replaceBySensitive(sign);
			}
			let data:any = {sex:sex,whatsup:sign};
			server.modifyUserInfo(data);
			this._submitData = data;
		//}
	}

	private onModifyUserInfoRep(event: egret.Event): void {
		let data: any = event.data;

		let rname = data.rname || 0;
		if (rname == 0) {
			MainLogic.instance.selfData.initData(this._submitData);
			Toast.show(lang.modify_profile_err[0]);
			alien.Dispatcher.dispatch(EventNames.MY_USER_INFO_UPDATE);
			this.dealAction();
		}else{
			Toast.show(lang.modify_profile_err[data.rname]);
		}
	}

	show(): void {
		if (!this.skinName) {
			this.skinName = panels.PanelModifyInfoSkin;
		}
		this._initUI();
		this._addClick();
		this._enableEvent(true);
		this.popup();

	}

	close():void {
		this._enableEvent(false);
		super.close();

	}
}