/**
 * Created by zhu on 2018/01/18.
 * 新年礼盒
 */

class PanelNewYear extends alien.PanelBase {
    private static _instance: PanelNewYear;
	/**
	 * 规则
	 */
	private ruleImg:eui.Image;

	/**
	 * 购买
	 */
	private buyImg:eui.Image;

	/**
	 * 领取
	 */
	 private getImg:eui.Image;

	 /***
	  * 新年礼盒购买次数
	  */
	 private _buyCount:number;

	 /**
	  * 当前选中的领取奖励的索引
	  */
	 private _selIdx:number;

	 /**
	  * 签到的每天奖励
	  */
	  private _signRew:any;

	/**
	 * 新年开工礼组件
	 */
	private workComponent:DayTaskItemInfo;

	/**
	 * 滚动容器
	 */
	private scroller:eui.Scroller;
	constructor() {
		super();
	}

    init():void {
		this.skinName = panels.PanelNewYear;
	}
	
	createChildren():void {
		super.createChildren();
		this._formatSignRew();
		this._initUI();
		this._initEvent();
	}

	private _initTime():void{
		let _cfg = GameConfig.newYearCfg.yearGift;
		let _start = _cfg.trigger_time;
		let _end = _cfg.recharge_finish_time;
		this["actTimeLabel1"].text = "2018年"+_start[1] +"月" + _start[2]+ "日0:00"+"至" +  "2018年"+_end[1] +"月" + _end[2]+ "日0:00";
	}

	private _formatSignRew():void{
		let _cfg = GameConfig.getNewYearGift();
		let _info = _cfg.rwd_aft_rec;
		let _oneStr = "";
		let _arr = null;
		let _newInfo = {};
		for(let i=1;i<8;++i){
			_oneStr = _info[i];
			_arr = _oneStr.split("|");
			let _item1 = _arr[0].split(":");
			let _item2 = _arr[1].split(":");
			_newInfo[i] = {[0]:{id:_item1[0],num:_item1[1]},[1]:{id:_item2[0],num:_item2[1]}};
		}
		this._signRew = _newInfo;
	}

	/**
	 * 使能点击
	 * target：点击对象
	 * bEnable：是否可以点击
	 * bGray：是否灰掉
	 */
	private _enableTouch(target:eui.Image,bEnable:boolean,bGray:boolean = false):void{
		target.touchEnabled = bEnable;
		if(bGray){
			target.source = "common_btn_orange2_gray";
		}else{
			target.source = "common_btn_orange3";
		}
	}

	/**
	 * 初始化事件
	 */
	private _initEvent():void{
		this._enableEvent(true);
		this.ruleImg["addClickListener"](this._onClickRule,this,false);
		this.buyImg["addClickListener"](this._onClickBuy,this,false);
		this.getImg["addClickListener"](this._onClickGet,this,false);
		for(let i=1;i<8;++i){
			this["_onClickIdx" + i] = ()=>{
				this._onClickIdxBgImg(i);
			}
			this["bgImg" + i]["addClickListener"](this["_onClickIdx" + i],this,false);
		}
		 server.addEventListener(EventNames.USER_RECHARGE_RESULT_NOTIFY, this._onRechargeResultNotify, this);
	}

	private _onRechargeResultNotify(event:egret.Event):void{
		let data:any = event.data;

		if(data.result == 0){
			let _productId = data.productid;
			let _info = GameConfig.getNewYearGift();
			if(_productId == 10021){
				server.isInNewyearGiftReqNewYear();
			}
			PanelChoosePay.remove();
		}
	}

	/**
	 * 点击索引的背景
	 */
	private _onClickIdxBgImg(idx:number):void{
		this._setSelectSignIdx(idx);
		let _state = 0;
		let _signInfo = MainLogic.instance.selfData.getNewYearLoginInfo();
		if(_signInfo.length >= 10){
			_state = _signInfo[2+idx];
		}
		if(_state == 0 && idx < _signInfo[1]){
			_state = 2;
		}
		this._setGetBtnByState(_state);
	}

	private _scrollToBottom():void{
		this.scroller.stopAnimation();
		this.scroller.viewport.scrollV =  this.scroller.viewport.contentHeight - this.scroller.height;
        this.scroller.viewport.validateNow();
	}

//1今天是否已签到（1已签到 0待签到） 2 今天是第几天 3 总签到天数 ...每天的签到情况1已签到 0 未签到
	public updateGift():void{
		if(this.currentState != "gift") return;

		let _selfData = MainLogic.instance.selfData;
		let _buyCount = _selfData.getNewYearGiftBuyCount();
		let _signInfo = _selfData.getNewYearLoginInfo();
		this._buyCount = _buyCount;

		if(_buyCount>=1){
			this._enableTouch(this.buyImg,false,true);
			if(_signInfo && _signInfo.length >=10){
				let _idx = _signInfo[1];
				let _state = _signInfo[0];
				if(_signInfo[1]>_signInfo[2]){//时间超出签到期限则为领取设置为已过期
					_idx = _signInfo[2]; //总签到天数
					_state = _signInfo[2 + _idx];
					if(_state != 1){
						_state = 2;
					}
				}
				this._setSelectSignIdx(_idx);
				this._setGetBtnByState(_state);
			}
			this._scrollToBottom();
		}else{
			this._enableTouch(this.buyImg,true);
			this._setSelectSignIdx(1);
			this._setGetBtnByState(0);
		}
	}

	/**
	 * 新年礼盒
	 */
	public showGift():void{
		this.currentState = "gift";
		this.scroller.stopAnimation();
		this.scroller.viewport.scrollV = 0;
		this.scroller.viewport.validateProperties();
		this._initTime();
		this.updateGift();
	}

	/**
	 * 新年开工礼
	 */
	public showWork():void{
		this.currentState = "work";
	}

	/**
	 * 设置领取按钮的状态
	 * state:1已签到 0待签到 2 已过期
	 */
	private _setGetBtnByState(state:number):void{
		let _self = this;
		let _stateLabel = {
			[0]:{text:"未领取",png:"common_btn_orange3",func:function(){
				_self._enableTouch(_self.getImg,true);
			}.bind(_self)},
			[1]:{text:"已领取",png:"common_btn_orange2_gray",func:function(){
				_self._enableTouch(_self.getImg,false,true);
			}.bind(_self)},
			[2]:{text:"已过期",png:"common_btn_orange2_gray",func:function(){
				_self._enableTouch(_self.getImg,false,true);
			}.bind(_self)}
		}

		if(_stateLabel[state]){
			this["getLabel"].text = _stateLabel[state].text;
			this["getImg"].source = _stateLabel[state].png;
			_stateLabel[state].func();
		}
	}

	/**
	 * 设置当前选中的新年礼盒领取奖励索引
	 */
	private _setSelectSignIdx(idx:number):void{
		let _col1 = "0xB83600";
		let _png1 = "newyear_bg2";
		let _col2 = "0xFFFFFF";
		let _png2 = "newyear_bg3";
		let _col = _col2;
		let _png = _png2;
		this._selIdx = idx;
		console.log("_setSelectSignIdx=========>",idx);
		if(!this._signRew){
			this._formatSignRew();
		}
		for(let i=1;i<8;++i){
			if(idx == i){
				_col = _col2;
				_png = _png2;
				this["item1Label"].text = "金豆x" + this._signRew[i][0].num;
			}else{
				_col = _col1;
				_png = _png1;
			}
	
			this["bgImg" + i].source = _png;
			this["label" + i].textColor = _col;
		}
	}

	/**
	 * 点击规则
	 */
	private _onClickRule():void{
		let _info = "\
1）国庆礼盒购买即得100000金豆和100钻石;\n\
2）连续7天登录奖励包含20996金豆和7天记牌器;\n\
3）7天登录中，如果某日未登录游戏，奖励不可领取;\n\
4）购买活动持续7天，签到奖励自购买当日起至第七日结束。\n\ ";

		  Alert.show(_info,0,null,"left");
	}

	/**
	 * 点击购买
	 */
	private _onClickBuy():void{
		let _info = GameConfig.getNewYearGift();
		RechargeService.instance.doRecharge("10021");
	}

	/**
	 * 点击领取
	 */
	private _onClickGet():void{
		let _signInfo = MainLogic.instance.selfData.getNewYearLoginInfo();
		if(this._buyCount < 1){
			Alert.show("您还未购买国庆礼盒,不可领取奖励!");
			return;
		}else if(this._selIdx > _signInfo[1]){
			Alert.show("未到领取奖励时间!");
			return;
		}
		server.reqGetNewYearLoginRew();
	}

	/**
	 * 初始化界面
	 */
	private _initUI():void{

	}

	/**
	 * 点击关闭
	 */
	private _onTouchClose():void{
		this.dealAction();
	}

	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
        //alien.EventManager.instance.disableOnObject(this);
		PanelNewYear._instance = null;
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

	/**
	 * 更新新年开工礼的数
	 */
	public updateWork(data:any):void{
		this.workComponent.updateInfo(data);
	}

	/**
	 * 获取新年礼盒
	 */
    public static getInstance(): PanelNewYear {
        if(!PanelNewYear._instance) {
            PanelNewYear._instance = new PanelNewYear();
        }
        return PanelNewYear._instance;
    }

	/**
	 * 移除新年礼盒
	 */
	public static remove():void{
		if(PanelNewYear._instance){
			PanelNewYear._instance.close();
		}
	}
}