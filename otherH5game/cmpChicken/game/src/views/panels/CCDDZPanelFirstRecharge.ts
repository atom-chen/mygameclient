/**
 * Created by zhu on 17/08/29.
 * 首充信息面板
 */

class CCDDZPanelFirstRecharge extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelFirstRecharge;
	/**
	 * 正常的字
	 */
	private mMoneyBack_img:eui.Image;

	/**
	 * 带光的字
	 */
	private mMoneyLight_img:eui.Image;

	/**
	 * 带光字上的遮罩
	 */
	private mMoneyLight_mask:eui.Image;
	/**
	 * 去充值按钮
	 */
	private mGoRecharge_btn:CCDDZButtonDoTaskSkin;

	/**
	 * 闪光效果
	 */
	private mLight1_img:eui.Image;
	
	/**
	 * 闪光效果
	 */
	private mLight2_img:eui.Image;
	
	/**
	 * 闪光效果
	 */
	private mLight3_img:eui.Image;
	
	/**
	 * 是否购买了首充
	 */
	private _hasBuy :boolean;

	constructor() {
		super();
        this["addEventListener"](egret.Event.ADDED_TO_STAGE,this._onAddToStage,this);
	}

	createChildren():void {
		super.createChildren();
		this._initUI();
		this._enableEvent(true);
	}

	/**
	 * 初始化皮肤
	 */
	init():void{
		this.skinName = panels.CCDDZPanelFirstRecharge;
	}

	/**
	 * 用户信息更新 判断是否购买了首充
	 */
	private _onMyUserInfoUpdate():void{
		this._initGoRechargeBtn();
	}
	/**
	 * 去充值
	 */
	private _onGoRecharge():void{
		let _info = CCGlobalGameConfig.getFRechargeInfo();
		if(!_info) return;

		CCDDZRechargeService.instance.doRecharge(_info.product_id);
	}

	/**
	 * 点击领取奖励
	 */
	public _onGetRew():void{
		CCDDZMainLogic.instance.onGoGetRewardReq();
		this.dealAction();
	}

	/**
	 * 初始化UI
	 */
	private _initUI():void{
		this._initGoRechargeBtn();
		this._playMaskAni();
		this._playFontLightAni();
		this._playItemLightAni();
	}

	/**
	 * 初始化充值按钮(去充值,领奖励)
	 */
	private _initGoRechargeBtn():void{
		let _data = CCDDZMainLogic.instance.selfData;
		let _hasBuy = !_data.isNotBuyFRecharge();
		if(this._hasBuy) return;

		this._hasBuy = _hasBuy;
		if(!_hasBuy){
			this.mGoRecharge_btn.setPngs("cc_frecharge_gopay_n","cc_frecharge_gopay_p");
			this.mGoRecharge_btn.setClickFunc(this._onGoRecharge.bind(this));
		}
		else{
			this.mGoRecharge_btn.setPngs("cc_frecharge_get_n","cc_frecharge_get_p");
			this.mGoRecharge_btn.setClickFunc(this._onGetRew.bind(this));
		}

		/*todo let _scaleFunc = null;
		_scaleFunc = function(self){
			egret.Tween.get(self.mGoRecharge_btn).to({scaleX:1.5,scaleY:1.5},100).to({scaleX:1.2,scaleY:1.2},50).wait(1000).call(()=>{
				_scaleFunc(self);
			})
		}

		_scaleFunc(this);
		*/
	}

	/**
	 * 播放首充的遮罩动画
	 */
	private _playMaskAni():void{
		this.mMoneyLight_img.mask = this.mMoneyLight_mask;
		let _srcX = this.mMoneyLight_mask.x;
		let _srcY = this.mMoneyLight_mask.y;
		let _toX = this.mMoneyLight_img.x + this.mMoneyLight_img.width + 10;
		let _func = null;
		_func = function(self){
			egret.Tween.get(self.mMoneyLight_mask).to({x:_toX,y:_srcY},1000).wait(500).to({x:_srcX,y:_srcY},500).call(()=>{
				_func(self);
			})
		}
		_func(this);
	}

	/**
	 * 播放文字上的闪光效果动画
	 */
	private _playFontLightAni():void{
		let _func = null;
		
		this.mLight2_img.visible = false;
		this.mLight3_img.visible = false;
		_func = function(self,target,srcScaleX,srcScaleY,toScaleX,toScaleY){
			target.scaleX = srcScaleX;
			target.scaleY = srcScaleX;
			egret.Tween.get(target).to({scaleX:toScaleX,scaleY:toScaleX},800).wait(500).to({scaleX:srcScaleX,scaleY:srcScaleY},500).call(()=>{
				_func(self,target,srcScaleX,srcScaleY,toScaleX,toScaleY);
			})
		}
		_func(this,this.mLight1_img,0,0,this.mLight1_img.scaleX,this.mLight1_img.scaleY);
		egret.setTimeout(()=>{
			this.mLight2_img.visible = true;
			_func(this,this.mLight2_img,0,0,this.mLight2_img.scaleX,this.mLight2_img.scaleY);
		}, this, 600)
		egret.setTimeout(()=>{
			this.mLight3_img.visible = true;
			_func(this,this.mLight3_img,0,0,this.mLight3_img.scaleX,this.mLight3_img.scaleY);
		}, this, 1000)
	}

	/**
	 * 某个物品上播放光效
	 */
	private _playLightOnTarget(target:eui.Image):any{
		let mcData = RES.getRes("cc_frLightAni_json");
		let pngData = RES.getRes("cc_frLightAni_png");
		var mcDataFactory = new egret.MovieClipDataFactory(mcData, pngData);
		var role:egret.MovieClip = new egret.MovieClip(mcDataFactory.generateMovieClipData("frlight"));
		role.anchorOffsetX = 114 * 0.5;
		role.anchorOffsetY = 120 * 0.5;
		role.gotoAndPlay(1,-1);
		role.x = target.x;
		role.y = target.y;
		target.parent.addChild(role);
		return role;
	}

	/**
	 * 播放奖励物品上的光线
	 */
	private _playItemLightAni():void{
		this._playLightOnTarget(this["item1Img"]); 
		this._playLightOnTarget(this["item2Img"]);
		this._playLightOnTarget(this["item3Img"]);
		this._playLightOnTarget(this["item4Img"]);
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
	 * 加入到舞台
	 */
	private _onAddToStage():void{
        let e: CCalien.CCDDZEventManager = CCDDZEventManager.instance;
        e.registerOnObject(this,CCalien.CCDDZDispatcher,CCGlobalEventNames.MY_USER_INFO_UPDATE,this._onMyUserInfoUpdate,this);
		CCDDZEventManager.instance.enableOnObject(this);
	}

	/**
	 * 从舞台移除
	 */
	private _onRemoveFromStage():void{
		this._enableEvent(false);
        this["removeEventListener"](egret.Event.ADDED_TO_STAGE,this._onAddToStage,this);
		CCDDZPanelFirstRecharge._instance = null;
		CCDDZEventManager.instance.disableOnObject(this);
	}


	/**
	 * 显示首充面板
	 */
	public show():void{
		this.popup(null,true,{alpha:0})
	}

	/**
	 * 获取首充UI单例
	 */
    public static getInstance(): CCDDZPanelFirstRecharge {
        if(!CCDDZPanelFirstRecharge._instance) {
            CCDDZPanelFirstRecharge._instance = new CCDDZPanelFirstRecharge();
        }
        return CCDDZPanelFirstRecharge._instance;
    }

	/**
	 * 其他地方移除
	 */
	public static nullInstance():void{
		if(CCDDZPanelFirstRecharge._instance){
			let _ins = this._instance;
			_ins.parent.removeChild(_ins);
		}
	}

	/**
	 * 领取成功后隐藏领取按钮
	 */
	public static setDisableGet():void{
		if(CCDDZPanelFirstRecharge._instance) {
			CCDDZPanelFirstRecharge._instance.mGoRecharge_btn.visible = false;
		}
	}

	/**
	 * 移除首充面板
	 */
	public static remove():void{
		if(CCDDZPanelFirstRecharge._instance){
			CCDDZPanelFirstRecharge._instance.close();
		}
	}

}