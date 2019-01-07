/**
 * zhu 17/12/28
 * 兑换话费,支付宝红包，微信红包等
 */

class PDKPanelFeiEx extends PDKalien.PDKPanelBase {
	private static _instance:PDKPanelFeiEx;
	public static get instance():PDKPanelFeiEx {
		if (this._instance == undefined) {
			this._instance = new PDKPanelFeiEx();
		}
		return this._instance;
	}

	private descLabel:eui.Label;
	private input1:eui.TextInput;
	private input2:eui.TextInput;
	private input3:eui.TextInput;
	private okImg:eui.Image;
	private Pre1Label:eui.Label;
	private Pre2Label:eui.Label;
	private Pre3Label:eui.Label;
	private info:any;
	private _okFunc:Function;
	private yidong:eui.RadioButton;
	private liantong:eui.RadioButton;
	private dianxin:eui.RadioButton;
	private _curSpNum:string; //当前选择的运营商
	private closeBtn:eui.Button;
	private _bShow:boolean;
	protected init():void {
		this.skinName = panels.PDKPanelFeiExSkin;
		this._okFunc = null;
	}

	constructor(){
		super(PDKalien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, PDKalien.popupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});
	}

	createChildren():void {
		super.createChildren();
		this._enableEvent(true);
		this._initSpInfo();
		this.closeBtn["addClickListener"](this._onClickClose,this);
		this.okImg["addClickListener"](this._onClickOK,this);
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
	 * 使能点击
	 */
	private _enableTouch(target:any,bEnable:boolean):void{
		target.touchEnabled = bEnable;
	}

	/**
	 * 话费充值二次确认
	 *  *  0    成功 (如果是卡密 则卡密内容在data.msg里面)
        1    系统错误,稍后再试
        1000  参数错误
        2013  用户不存在
        50001  领取失败 具体错误看data.msg
        50002  领取失败,每日充值话费累计最大金额为2000元!
	 */
	private _onAlertFei():void{
		let _id = this.info.id;
		let _phone = this.input2.text;
		let _self = this;
		let _str = "确认充值 <font color='#FF0000'>" + this.info.goodsamount + "</font> 元话费 到  <font color='#FF0000'>" + _phone +"</font>";
		let _textFlow = (new egret.HtmlTextParser).parser(_str);
		PDKAlert.show("",0,function(act){
			if(act == "confirm"){
				PDKwebService.goRechageFei({uid:pdkServer.uid,coinid:_id,phone:_phone},function(response){
					if(response.code == 0){
						_self.info.status = 5;
						PDKUserData.saveLocalPhone(_phone);
						
						PDKAlert3.show("正在为您充值，预计半小时内到账，如果2小时内未到账，请联系客服微信！",null,"pdk_common_btn_lab_confirm_h");
						if(_self.info.item){
							_self.info.item.updateInfo(_self.info);
						}
					}else {
						PDKAlert3.show("充值失败,错误码:" + response.data+"|" + response.code,null,"pdk_common_btn_lab_confirm_h");
					}
				})
			}
		},"center",_textFlow);
	}

	/**
	 * 支付宝二次确认
	 */
	private _onAlertAli():void{
		let _id = this.info.id;
		let _name = this.input1.text;
		let _self = this;
		let _account = this.input2.text;
		let _str = "确认领取 <font color='#FF0000'>" + this.info.goodsamount + "</font> 元支付宝红包\n支付宝账号:<font color='#FF0000'>"+ _account +"</font>";
		let _textFlow = (new egret.HtmlTextParser).parser(_str);
		PDKAlert.show("",0,function(act){
			if(act == "confirm"){
				PDKwebService.goRechageFei({uid:pdkServer.uid,coinid:_id,account:_account,account_name:_name},function(response){
					if(response.code == 0){
						_self.info.status = 4;
						PDKUserData.saveLocalAli(_account,_name);
						PDKAlert3.show("领取成功",null,"pdk_common_btn_lab_confirm_h");
						if(_self.info.item){
							_self.info.item.updateInfo(_self.info);
						}
					}else {
						PDKAlert3.show("领取失败,错误码:" + response.data +"|" + response.code,null,"pdk_common_btn_lab_confirm_h");
					}
				})
			}
		},"center",_textFlow);

	}

	/**
	 * 点击确定
	 */
	private _onClickOK():void{
		if(this._okFunc){
			this._okFunc();
		}
	}

	/**
	 * 从舞台移除
	 */
	private _onRemoveFromStage():void{
		this._enableEvent(false);
		PDKPanelFeiEx._instance = null;
	}

	/**
	 * 初始化兑换话费
	 */
	private _initFei(){
		let _self = this;
		let _defNum = PDKUserData.getLocalPhone();
		if(_defNum && _defNum.length == 11){
			this.input2.text = _defNum;
		}
		this.currentState = "fei";
		this._okFunc = function(){
			let _phone = _self.input2.text;
			if(_phone&&_phone.length == 11){
				_self._onAlertFei();
			}else{
				PDKToast.show("请输入11位的手机号码");
			}
		}.bind(this);
	}

	/**
	 * 初始化运营商选择
	 */
	private _initSpInfo():void{
		this.liantong.labelDisplay.text = "中国联通";
		this.dianxin.labelDisplay.text = "中国电信";

		this.yidong.value = "10086";
		this.yidong.value = "10010";
		this.yidong.value = "10000";
		
		this._onSelectYD();

		this.yidong.addEventListener(egret.TouchEvent.TOUCH_TAP,this._onSelectYD,this);
		this.liantong.addEventListener(egret.TouchEvent.TOUCH_TAP,this._onSelectLT,this);
		this.dianxin.addEventListener(egret.TouchEvent.TOUCH_TAP,this._onSelectDX,this);
	}
	/**
	 * 显示话费充值卡运营商选择页面
	 */
	private _showFeiKaSp():void{
		this.currentState = "sp";
		let _self = this;
		this._okFunc = function(){
			if(_self._curSpNum && _self._curSpNum.length == 5){
				PDKwebService.goRechageFei({uid:pdkServer.uid,coinid:_self.info.id,sp:_self._curSpNum},function(response){
					_self._onGetCardRet(response);
				});
			}
		}
	}

	/**
	 * 选择移动
	 */
	private _onSelectYD():void{
		this._curSpNum = "10086";
		this.yidong.currentState = "downAndSelected";
		this.liantong.currentState = "up";
		this.dianxin.currentState = "up";
	}

	/**
	 * 选择联通
	 */
	private _onSelectLT():void{
		this._curSpNum = "10010";
		this.yidong.currentState = "up";
		this.liantong.currentState = "downAndSelected";
		this.dianxin.currentState = "up";
	}
    
	/**
	 * 选择电信
	 */
	private _onSelectDX():void{
		this._curSpNum = "10000";
		this.yidong.currentState = "up";
		this.liantong.currentState = "up";
		this.dianxin.currentState = "downAndSelected";
	}
	/**
	 * 复制卡密信息
	 */
	private _copyCardInfo():void{
		let _cardNo = this.input1.text;
		let _cardPwd = this.input2.text;
		let _str = "卡号:" + _cardNo +"卡密:" + _cardPwd;
		PDKGameConfig.copyText(this,_str,_str,true);
	}

	/**
	 * 初始化显示话费充值卡
	 */
	private _initFeiKa(){
		if(this.info.status == 3){ //未领取
			this._showFeiKaSp();
			return;

		}else if(this.info.status == 4){ //已领取
			this.currentState = "card";
		}
		let _info = this.info.send_listid;
		let _card = _info.cards.card;
		let _cardNo = _card.cardno;
		let _cardPwd = _card.cardpws;
		let _expire = _card.expiretime;
		this.input1.text = _cardNo;
		this.input2.text = _cardPwd;
		this.input3.text = _expire;
		
		let _sp = this.info.sp || _info.cardname;
		this.input1.touchEnabled = false;
		this.input2.touchEnabled = false;
		this.input3.touchEnabled = false;
		egret.setTimeout(()=>{
			this.descLabel.text = "您已成功领取"+ _sp;
			this.descLabel.textAlign = "center";
		},this,50);
		this._okFunc = this._copyCardInfo.bind(this);
	}
	/**
	 * 初始化兑换支付宝
	 */
	private _initAli(){
		this.currentState = "ali";
		let _self = this;
		let _aliInfo = PDKUserData.getLocalAli();
		if(_aliInfo && _aliInfo.name && _aliInfo.account){
			this.input1.text = _aliInfo.name;
			this.input2.text = _aliInfo.account;
		}
		this._okFunc = function(){
			let _account = this.input2.text;
			let _name = _self.input1.text;
			if(_name&&_name.length >1 && _account && _account.length > 1){
				 _self._onAlertAli();
			}else{
				PDKToast.show("请输入姓名和支付宝账号");
			}
		}
	}

	/**
	 * 领取卡密回调
	 */
	private _onGetCardRet(response:any):void{
		let _self = this;
		let _data = response.data;
		//领取成功
		if(response.code == 0){
			_self.info.status = 4;
			if(_self.info.goodsid == 5){ //京东卡
				_self.info.send_listid = this.info.send_listid ||{};
				_self.info.send_listid.cardno = _data.cardnum;
				_self.info.send_listid.cardpwd = _data.cardpwd;
				_self.info.send_listid.expiretime = _data.expiretime;
				_self.info.money = _data.money;
				this._initJD();
			}
			else if(_self.info.goodsid == 6){
				_self.info.send_listid = this.info.send_listid ||{cards:{card:{}}};
				_self.info.send_listid.cards.card.cardno = _data.cardno;
				_self.info.send_listid.cards.card.cardpws = _data.cardpws;
				_self.info.send_listid.cards.card.expiretime = _data.expiretime;
				_self.info.sp = _data.sp;
				_self.info.money = _data.money;
				_self._initFeiKa();
			}
			
			if(_self.info.item){
				_self.info.item.updateInfo(_self.info);
			}
			
		//console.log("_onGetCardRet===========>",_self.info);
			
		}else {
			PDKAlert3.show("领取失败,错误码:" + response.data+"|" + response.code,null,"pdk_common_btn_lab_confirm_h");
		}
	}
	/**
	 * 初始化显示京东卡
	 */
	private _initJD(){
		this.currentState = "card";
		let _self = this;
		//console.log("_initJD===========>",_self.info);
		if(_self.info.status == 3){//未领取
			PDKwebService.goRechageFei({uid:pdkServer.uid,coinid:_self.info.id},function(response){
				_self._onGetCardRet(response);
			});
			return;
		}else if(_self.info.status != 4){
			return;
		}
		let _info = this.info.send_listid;
		let _name = "京东E卡";
		let _cardNo = _info.cardno || _info.cardnum;
		let _cardPwd = _info.cardpwd;
		let _expire = _info.expiretime;
		let _money = this.info.goodsamount || this.info.money;
		egret.setTimeout(()=>{
			this.descLabel.text = "您已成功领取" + _money + "元京东E卡";
			this.descLabel.textAlign = "center";
		},this,50);

		this.input1.text = _cardNo;
		this.input2.text = _cardPwd;
		this.input3.text = _expire;
		
		this.input1.touchEnabled = false;
		this.input2.touchEnabled = false;
		this.input3.touchEnabled = false;

		this._okFunc = this._copyCardInfo.bind(this);
	}

	show(info:any):void{
		if(this._bShow) return;
		this._bShow = true;
		this.info = info;
		if(info.goodsid == "4"){ //话费
			this._initFei();
		}else if(info.goodsid == "7" ||info.goodsid == "8"){ //支付宝
			this._initAli();
		}else if(info.goodsid == "6"){ //话费充值卡
			this._initFeiKa();
		}else if(info.goodsid == "5"){ //京东卡
			this._initJD();
		}
		this.popup(null,true,{alpha:0})
	}

	/**
	 * 获取兑换话费或者是支付宝信息
	 */
    public static getInstance(): PDKPanelFeiEx {
        if(!PDKPanelFeiEx._instance) {
            PDKPanelFeiEx._instance = new PDKPanelFeiEx();
        }
        return PDKPanelFeiEx._instance;
    }
}