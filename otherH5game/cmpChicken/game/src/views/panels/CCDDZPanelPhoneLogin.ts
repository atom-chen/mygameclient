/**
 * Created by zhu on 2018/01/02.
 * 关注公众号活动面板
 */
class CCDDZPanelPhoneLogin extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelPhoneLogin;

	private phoneLabel:eui.TextInput;
	private codeLabel:eui.TextInput;
	private getCodeImg:eui.Image;
	private countLabel:eui.Label;
	private loginImg:eui.Image;
	private unid:string;
	private sk:string;
	private _nIntervalId:number;
	private _nCountTime:number;
	private closeImg:eui.Button;

	constructor() {
		super();
	}

    init():void {
		this.skinName = panels.CCDDZPanelPhoneLoginSkin;
	}
	
	createChildren():void {
		super.createChildren();
		this._initEvent();
		this.unid = "";
		this.sk = "";
		this._nIntervalId = -1;

		this.phoneLabel.prompt = ccddz_phonePrompt;
		this.phoneLabel.maxChars = ccddz_phoneLen;
		this.codeLabel.maxChars = ccddz_codeLen;
		this.codeLabel.prompt = ccddz_codePrompt;

		this._showCountLabel(false);
		this._initPhone();
		this._resetCountNum();
		this.phoneLabel.inputType = egret.TextFieldInputType.TEL;
		this.codeLabel.inputType = egret.TextFieldInputType.TEL;
	}

	/**
	 * 初始化本地记录的手机
	 */
	private _initPhone():void{
		let _defNum = CCGlobalUserData.instance.getLocalPhone();
		if(_defNum && _defNum.length == 11){
			this.phoneLabel.text = _defNum;
		}
	}

	/**
	 * 校验手机号
	 */
	private  _checkPhone(phone:string):boolean{
		let _str = phone;
		if(!_str || _str.length != 11){
			return false;
		}
		return true;
	}

	/**
	 * 校验验证码
	 */
	private _checkCode(code:string):boolean{
		let _str = code;
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
		let _phone = this.phoneLabel.text;
		if(!this._checkPhone(_phone)){
			CCDDZToast.show(ccddz_phonePrompt);
			return;
		}
		let _str = {
			[0]      :  "验证码发送成功",
			[1000]   :  "参数错误",
			[2015]   :  "手机号码错误",
			[2018]   :  "发送失败",
			[2019]   :  "请稍后重试"
		}
		ccddzwebService.getCode(this.phoneLabel.text,function(response){
			let _code = response.code;
			let _info = _str[_code]||"验证码发送失败";
			CCDDZToast.show(_info);
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
	 * 初始化事件
	 */
	private _initEvent():void{
		this._enableEvent(true);
		this.closeImg["addClickListener"](this._onClickClose,this);
		this.getCodeImg["addClickListener"](this._onClickGetCode,this);
		this.loginImg["addClickListener"](this._onClickLogin,this);
	}

	/**
	 * 点击登录
	 */
	private _onClickLogin():void{
		let _phone = this.phoneLabel.text;
		let _code = this.codeLabel.text;
		let _self = this;
		if(!_self._checkPhone(_phone) ) {
			CCDDZToast.show(ccddz_phonePrompt);
			return;
		}else if(!_self._checkCode(_code)){
			CCDDZToast.show(ccddz_codePrompt);
			return;
		}

		_self._enableTouch(_self.loginImg,false);
		let cc_nativeBridge = CCalien.Native.instance;
		let _param = cc_nativeBridge.getUrlArg();
		if(_param.share_sk){
			_self.sk = _param.share_sk;
		}

		ccddzwebService.loginByPhone(_phone,_code,_self.unid,_self.sk,function(response){
			_self.dealAction();
			CCLoginService.instance.onVerifyResponse(response);
		}.bind(_self))
	}


	/**
	 * 点击关闭
	 */
	private _onClickClose():void{
		this.dealAction();
	}

	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._clearCountInterval();
		this._enableEvent(false);
		CCDDZPanelPhoneLogin._instance = null;
	}
	/**
	 * 使能 事件
	 */
	private _enableEvent(bEnable:boolean):void{
		let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
	}

	show():void{
		this.popup(null,true,{alpha:0})
	}

	/**
	 * 获取手机登录单例
	 */
    public static getInstance(): CCDDZPanelPhoneLogin {
        if(!CCDDZPanelPhoneLogin._instance) {
            CCDDZPanelPhoneLogin._instance = new CCDDZPanelPhoneLogin();
        }
        return CCDDZPanelPhoneLogin._instance;
    }

	/**
	 * 移除手机登录面板
	 */
	public static remove():void{
		if(CCDDZPanelPhoneLogin._instance){
			CCDDZPanelPhoneLogin._instance.close();
		}
	}
}