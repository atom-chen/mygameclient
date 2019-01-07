/**
 * zhu 17/12/16
 * 绑定手机号
 */

class PDKPanelBindPhone extends PDKalien.PDKPanelBase {
	private static _instance:PDKPanelBindPhone;
	public static get instance():PDKPanelBindPhone {
		if (this._instance == undefined) {
			this._instance = new PDKPanelBindPhone();
		}
		return this._instance;
	}
	private close_img:eui.Image;
	private phone:eui.TextInput;
	private code:eui.TextInput;
	private countLabel:eui.Label;
	private getCodeImg:eui.Image;
	private bindNowImg:eui.Image;
	private unid:string;
	private sk:string;
	private _nIntervalId:number;
	private _nCountTime:number;
	protected init():void {
		this.skinName = panels.PDKPanelBindPhoneSkin;
	}

	constructor(){
		super(PDKalien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, PDKalien.popupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});
	}

	createChildren():void {
		super.createChildren();
		this._nIntervalId = -1;
		this.sk = "";
		this.unid = "";
		this._showCountLabel(false);
		this._resetCountNum();
		this.phone.inputType = egret.TextFieldInputType.TEL;
		this.code.inputType = egret.TextFieldInputType.TEL;
		this._enableEvent(true);
		
		this.getCodeImg["addClickListener"](this._onClickGetCode,this);
		this.bindNowImg["addClickListener"](this._onClickBindNow,this);
		this.close_img["addClickListener"](this._onClickClose, this);
	}

	private _onClickClose():void{
		this.dealAction();
	}

	/**
     * 使能事件
     */
    private _enableEvent(bEnable:boolean):void{
        let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
        this[_func](egret.Event.REMOVED_FROM_STAGE,this._onRemoveFromStage,this);
    }

	/**
	 * 校验手机号
	 */
	private  _checkPhone():boolean{
		let _str = this.phone.text;
		if(!_str || _str.length != 11){
			return false;
		}
		return true;
	}

	/**
	 * 校验验证码
	 */
	private _checkCode():boolean{
		let _str = this.code.text;
		if(!_str){
			return false;
		}
		return true;
	}
	/**
	 * 显示倒计时
	 */
	private _showCountLabel(bShow:boolean):void{
		this.countLabel.visible  = bShow;
	}
	/**
	 * 重置倒计时间隔
	 */
	private _resetCountNum():void{
		this._nCountTime = 60;
	}

	/**
	 * 清除倒计时的intervalId
	 */
	private _clearCountInterval():void{
		if(this._nIntervalId != -1){
			egret.clearInterval(this._nIntervalId);
		}
		this._nIntervalId = -1;
	}

	/**
	 * 开始倒计时
	 */
	private _startCountDown():void{
		this._clearCountInterval();
		this._resetCountNum();
		
		this.countLabel.text = "" + this._nCountTime;
		this._showCountLabel(true);

		this._nIntervalId = egret.setInterval(()=>{
			if(this._nCountTime<1){
				this._clearCountInterval();
				this._showCountLabel(false)
				this._showGetCode(true);
				return;
			}
			this._nCountTime -= 1;
			this.countLabel.text = "" + this._nCountTime;
		},this,1000);
	}

	/**
	 * 是否显示获取验证码
	 */
	private _showGetCode(bShow:boolean):void{
		this.getCodeImg.visible = bShow;
	}

	/**
	 * 点击获取验证码
	 */
	private _onClickGetCode():void{
		if(!this._checkPhone()){
			PDKToast.show("手机号格式错误");
			return;
		}
		let _str = {
			[0]      :  "验证码发送成功",
			[1000]   :  "参数错误",
			[2015]   :  "手机号码错误",
			[2018]   :  "发送失败",
			[2019]   :  "请稍后重试"
		}
		PDKwebService.getCode(this.phone.text,function(code){
			let _info = _str[code];
			PDKToast.show(_info);
		});
		this._showGetCode(false);
		this._startCountDown();
	}

	/**
	 * 使能点击
	 */
	private _enableTouch(target:any,bEnable:boolean):void{
		target.touchEnabled = bEnable;
	}

	/**
	 * 点击立即绑定
	 */
	private _onClickBindNow():void{
		if(!this._checkPhone() || !this._checkCode()) {
			PDKToast.show("手机号或验证码错误");
			return;
		}

		let _str = {
			[0]     :  "绑定手机号成功",
			[1000]  :  "参数错误",
			[2016]  :  "该手机号已被绑定",
			[2017]  :  "绑定失败"
		}

		let _phone = this.phone.text;
		let _code = this.code.text;
		this._enableTouch(this.bindNowImg,false);
		// PDKwebService.bindPhone(_phone,_code,this.unid,this.sk,function(code){
		// 	let _info = _str[code];
		// 	let _func = function(){
		// 		PDKMainLogic.instance.doRestartGame();
		// 	}
		
		// 	if(code !=0){
		// 		this._enableTouch(this.bindNowImg,true);
		// 		_func = function(){
					
		// 		}
		// 	}
			
		// 	PDKAlert.show(_info,0,_func);
		// }.bind(this))

		let userData: PDKUserData = PDKUserData.instance;
		let uid:string = userData.getItem("uid", "");
		let token:string = userData.getItem("token", "");
		let self:PDKPanelBindPhone = this;
		PDKwebService.bindPhoneNew(_phone,_code,uid,token,function(code){
			let _info = _str[code];
			if(code !=0){
			} else {
				userData.setItem('bindinfo',true,true);
        		userData.setItem('phone',_phone,true);
				self.close();
			}
			PDKAlert.show(_info,0);
		}.bind(this))
	}

	/**
	 * 从舞台移除
	 */
	private _onRemoveFromStage():void{
		this._clearCountInterval();
		this._enableEvent(false);
		PDKPanelBindPhone._instance = null;
		//PDKEventManager.instance.disableOnObject(this);
	}

	show(unid:string):void{
		this.popup(null,true,{alpha:0})
		let _pdk_nativeBridge = PDKalien.Native.instance;
		let _param = _pdk_nativeBridge.getUrlArg();
		if(_param.sk){
			this.sk = _param.sk;
		}
		this.unid = unid;
	}

	showNew():void {
		this.popup(null,true,{alpha:0})
	}

	/**
	 * 获取绑定手机号UI单例
	 */
    public static getInstance(): PDKPanelBindPhone {
        if(!PDKPanelBindPhone._instance) {
            PDKPanelBindPhone._instance = new PDKPanelBindPhone();
        }
        return PDKPanelBindPhone._instance;
    }
}