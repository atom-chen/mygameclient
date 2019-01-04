/**
 * zhu 17/12/16
 * 绑定手机号
 */

class PanelBindPhone extends alien.PanelBase {
	private static _instance:PanelBindPhone;
	public static get instance():PanelBindPhone {
		if (this._instance == undefined) {
			this._instance = new PanelBindPhone();
		}
		return this._instance;
	}
	private phone:eui.TextInput;
	private code:eui.TextInput;
	private countLabel:eui.Label;
	private getCodeImg:eui.Image;
	private bindNowImg:eui.Image;
	private closeImg:eui.Image;
	private args:any;
	private bindType:number;
	private _nIntervalId:number;
	private _nCountTime:number;
	private _okCallback:Function;
	protected init():void {
		this.skinName = panels.PanelBindPhoneSkin;
	}

	constructor(){
		super(alien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, alien.popupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});
	}

	createChildren():void {
		super.createChildren();
		this._nIntervalId = -1;
		this._okCallback = null;
		this.args = {};
		this._showCountLabel(false);
		this._resetCountNum();
		
		this.phone.prompt = _phonePrompt;
		this.phone.maxChars = _phoneLen;
		this.code.maxChars = _codeLen;
		this.code.prompt = _codePrompt;

		this.phone.inputType = egret.TextFieldInputType.TEL;
		this.code.inputType = egret.TextFieldInputType.TEL;
	}

	private _initEvent():void{
		this._enableEvent(true);
		this.closeImg["addClickListener"](this._onClickClose,this);
		this.getCodeImg["addClickListener"](this._onClickGetCode,this);
		this.bindNowImg["addClickListener"](this._onClickBindNow,this);
	}
	
	/**
     * 使能事件
     */
    private _enableEvent(bEnable:boolean):void{
        let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
		this._enableTouch(this.bindNowImg,bEnable);
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
	 * 关闭按钮
	 */
	private _onClickClose():void{
		this.dealAction();
	}

	/**
	 * 点击获取验证码
	 */
	private _onClickGetCode():void{
		if(!this._checkPhone()){
			Toast.show(_phonePrompt);
			return;
		}
		webService.getCode(this.phone.text,function(response){
			let _str = {
				[0]      :  "验证码发送成功",
				[1000]   :  "参数错误",
				[2015]   :  "手机号码错误",
				[2018]   :  "发送失败",
				[2019]   :  "请稍后重试"
			}
			let _code = response.code;
			let _info = _str[_code]||"验证码发送失败";
			Toast.show(_info);
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
			Toast.show("手机号或验证码错误");
			return;
		}
		
		if(this.bindType == 1){
			this._bindByLogin();
		}else if(this.bindType ==2){
			this._bindByExchange();
		}
	}

	/**
	 * 2兑换绑定手机
	 */
	private _bindByExchange():void{
		let _self = this;
		let _phone = this.phone.text;
		let _code = this.code.text;
		this._enableTouch(this.bindNowImg,false);
		webService.bindPhoneByExchange(_phone,_code,function(response){
			let _code = response.code;
			let _info = response.message;
			let _phone = response.data.phone;
			console.log("_bindByExchange==ret==>",_phone);
			let _func = function(){
				let _okCallback = _self._okCallback;
				UserData.instance.saveLocalPhone(_phone,true);
				_self.dealAction();
				MailService.instance.getMailList(0);
				if(_okCallback){
					_okCallback();
				}
			}
		
			if(_code !=0){
				this._enableTouch(this.bindNowImg,true);
				_func = function(){
					
				}
			}
			
			Alert3.show(_info,_func,"common_btn_lab_confirm");
		}.bind(this))
	}

	/**
	 * 1登录绑定手机
	 */
	private _bindByLogin():void{
		let _phone = this.phone.text;
		let _code = this.code.text;
		let _self = this;
		this._enableTouch(this.bindNowImg,false);
		webService.bindPhoneByLogin(_phone,_code,this.args.unid,this.args.share_sk,function(response){
			let _code = response.code;
			let _info = response.message;
			let _phone = response.data.phone;
			console.log("_bindByLogin====>",_phone);
			let _func = function(){
				UserData.instance.saveLocalPhone(_phone,true);
				let _okCallback = _self._okCallback;
				MailService.instance.getMailList(0);
				if(_okCallback){
					_okCallback();
				}
			}
		
			if(_code !=0){
				this._enableTouch(this.bindNowImg,true);
				_func = function(){
					
				}
			}
			
			Alert.show(_info,0,_func);
		}.bind(this))
	}
	
	/**
	 * 从舞台移除
	 */
	private _onRemoveFromStage():void{
		this._clearCountInterval();
		this._enableEvent(false);
		PanelBindPhone._instance = null;
		//EventManager.instance.disableOnObject(this);
	}

	/**
	 * 是否显示关闭按钮
	 */
	private _showClose(bShow:boolean):void{
		this.closeImg.visible = bShow;
	}

	/**
	 * 绑定送的金币
	 */
	private _initBindGold():void{
		let gold = GameConfig.getCfgByField("custom.bindPhoneGold");
		this["bindGoldLabel"].text = "首次绑定奖励" + gold +"金豆"
	}

	//type:1登录绑定手机 2:兑换绑定手机
	show(type:number,args:any,callback:Function = null):void{
		this.currentState = "exBind";
		this._initEvent();
		this.popup(null,true,{alpha:0})
		let _nativeBridge = alien.Native.instance;
		let _param = _nativeBridge.getUrlArg();
		this._okCallback = callback;
		this.bindType = type;
		this.args = args;	

		if(_param.share_sk){
			this.args.share_sk = _param.share_sk;
		}
		if(args.actTipBind){
			this["descLabel"].text = "为了更方便您领取奖励，请绑定手机;";
			this._initBindGold();
		}
		this._showClose(args.showClose);
	}

	/**
	 * 活动页面的绑定手机
	 */
	showBindAct(callback):void{
		this._initEvent();
		this.currentState = "actBind";
		let _param = alien.Native.instance.getUrlArg();
		this._okCallback = callback;
		this.bindType = 2;
		this["descLabel"].text = "为了更方便您领取奖励，请绑定手机;";
		this._initBindGold();
		if(_param.share_sk){
			this.args.share_sk = _param.share_sk;
		}
	}

	public static nullInstance():void{
		let _ins = PanelBindPhone._instance;
		if(_ins ){
			_ins.close(true);
		}
		PanelBindPhone._instance = null;
	}

	/**
	 * 获取绑定手机号UI单例
	 */
    public static getInstance(): PanelBindPhone {
        if(!PanelBindPhone._instance) {
            PanelBindPhone._instance = new PanelBindPhone();
        }
        return PanelBindPhone._instance;
    }
}