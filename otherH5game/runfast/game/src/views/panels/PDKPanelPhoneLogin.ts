/**
 * Created by zhu on 2018/01/02.
 * 关注公众号活动面板
 */

class PDKPanelPhoneLogin extends PDKalien.PDKPanelBase {
    private static _instance: PDKPanelPhoneLogin;

	private phoneLabel:eui.Label;
	private codeLabel:eui.Label;
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
		this.skinName = panels.PDKPanelPhoneLoginSkin;
	}
	
	createChildren():void {
		super.createChildren();
		this._initEvent();
		this.unid = "";
		this.sk = "";
		this._nIntervalId = -1;
		this._showCountLabel(false);
		this._resetCountNum();
		this.phoneLabel.inputType = egret.TextFieldInputType.TEL;
		this.codeLabel.inputType = egret.TextFieldInputType.TEL;

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
		PDKwebService.getCode(this.phoneLabel.text,function(code){
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
		if(!_self._checkPhone(_phone) || !_self._checkCode(_code)) {
			PDKToast.show("手机号或验证码错误");
			return;
		}

		_self._enableTouch(_self.loginImg,false);
		let _pdk_nativeBridge = PDKalien.Native.instance;
		let _param = _pdk_nativeBridge.getUrlArg();
		if(_param.sk){
			_self.sk = _param.sk;
		}

		PDKwebService.loginByPhone(_phone,_code,_self.unid,_self.sk,function(response){
			_self.dealAction();
			PDKLoginService.instance.onVerifyResponse(response);
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
		PDKPanelPhoneLogin._instance = null;
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
    public static getInstance(): PDKPanelPhoneLogin {
        if(!PDKPanelPhoneLogin._instance) {
            PDKPanelPhoneLogin._instance = new PDKPanelPhoneLogin();
        }
        return PDKPanelPhoneLogin._instance;
    }

	/**
	 * 移除手机登录面板
	 */
	public static remove():void{
		if(PDKPanelPhoneLogin._instance){
			PDKPanelPhoneLogin._instance.close();
		}
	}
}