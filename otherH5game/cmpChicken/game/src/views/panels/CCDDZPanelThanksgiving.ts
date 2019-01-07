/**
 * Created by zhu on 2017/11/16.
 * 感恩节活动面板
 */

class CCDDZPanelThanksgiving extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelThanksgiving;
	/**
	 * 购买按钮
	 */
	private buyImg:CCDDZImgWordBtn;

	/**
	 * 领取按钮
	 */
	private getImg:CCDDZImgWordBtn;

	/**
	 * 购买进度
	 */
	private buyProLabel:eui.Label;
	
	/**
	 * 购买次数
	 */
	private _buyCount:number;

	/**
	 * 签到天数
	 */
	private _signCount:number;
	/**
	 * 三天的签到情况
	 */
	private _signInfo:Array<number>;

	/**
	 * 今天已签到
	 */
	private _todaySign:number;

	constructor() {
		super();
	}

    init():void {
		this.skinName = panels.CCDDZPanelThanksgivingSkin;
		this._signInfo = [0,0,0];
		this._buyCount = 0;
	}
	
	createChildren():void {
		super.createChildren();
		this._initEvent();
		this._initUI();
	}

	/**
	 * 初始化事件
	 */
	private _initEvent():void{
		this._enableEvent(true);
		this.buyImg["addClickListener"](this._onClickBuyImg,this);
		this.getImg["addClickListener"](this._onClickGetImg,this);
		
		 ccserver.addEventListener(CCGlobalEventNames.USER_OPERATE_REP,this._onRecvUserOperateRep,this);
		 ccserver.addEventListener(CCGlobalEventNames.USER_RECHARGE_RESULT_NOTIFY, this._onRechargeResultNotify, this);
	}

	/**
	 * 充值成功
	 */
	private _onRechargeResultNotify(event:egret.Event):void{
		let data:any = event.data;

		if(data.result == 0){
			let _productId = data.productid;
			if(_productId == 10018 || _productId == 10019|| _productId == 10020){
				this._buyCount += 1;
				this._initBuy();
			}
		}
	}

	/**
	 * 收到玩家操作
	 */
	private _onRecvUserOperateRep(event:egret.Event):void{
        let data = event.data;
		//console.log("_onRecvUserOperateRep-------------->",data);
        if(data.optype == 4){ //查询活动
            if(data.result == null){
				//	params 0 签到次数 1 今天是否已经签到(1已签到) 2 充值次数
				if(data.params && data.params.length >= 6){
					this._buyCount = data.params[0];
					this._todaySign = data.params[1];
					this._signInfo = data.params.slice(3);
					this._initSignInfo();
					this._initBuy();
				}
            }
        }
        else if(data.optype ==6){ //活动签到
			//1 非活动时间 2 全部签到 3 今天已签到 4 奖励不存在
            if(data.result == null){ //签到成功
				this._signInfo[data.params[0]-1] = 1;
				for(let i =0;i<this._signInfo.length;++i){
					if(this._signInfo[i] != 1 && i < data.params[0]-1){
						this._signInfo[i] = 2;
					}
				}
				this._tipGetSignRewSucc();
				this._todaySign = 1;
				this._initSignInfo();
            }
        }
	}

	/**
	 * 提示签到奖励领取成功
	 */
	private _tipGetSignRewSucc():void{
		CCDDZAlert.show("领取成功");
	}
	/**
	 * 初始化界面
	 */
	private _initUI():void{
		this.buyImg.setTit("cc_thanks_buy");
		this.buyImg.setDisable();
		this.getImg.setDisable();
	}

	/**
	 * 点击购买按钮 
	 */
	private _onClickBuyImg():void{
		let _productId:string = "10018";
		if(this._buyCount < 1){
			_productId = "10018"
		}else if(this._buyCount < 3){
			_productId = "10019"

		}else if(this._buyCount < 6){
			_productId = "10020"

		}
		CCDDZRechargeService.instance.doRecharge(_productId);
	}

	/**
	 * 点击领取按钮
	 */
	private _onClickGetImg():void{
		ccserver.reqThanksSign();
	}

	/**
	 * 设置购买进度
	 */
	private _setBuyPro(sPro:string){
		this.buyProLabel.text = sPro;
	}

	/**
	 * 初始化购买按钮
	 */
	private _initBuy():void{
		this._setBuyPro(this._buyCount + "/6");
		if(this._buyCount >= 6){
			this.buyImg.setDisable();
		}else{
			this.buyImg.setEnable();
		}
	}
	/**
	 * 初始化签到 信息
	 */
	private _initSignInfo():void{
		if(this._todaySign == 1){
			this.getImg.setDisable();
		}else {
			this.getImg.setEnable();
		}

		//1已签到 2未签到 0待签到
		for(let i =0;i<this._signInfo.length;++i){
			if(this._signInfo[i] == 1){
				this["get" + i + "Img"].visible = true;
				this["get" + i + "Img"].source = "cc_thanks_r";
			}else if(this._signInfo[i] == 0){
				this["get" + i + "Img"].visible = false;
			}else{
				this["get" + i + "Img"].visible = true;
				this["get" + i + "Img"].source = "cc_thanks_w";
			}
		}
	}
	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
		CCDDZPanelThanksgiving._instance = null;
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
	 * 获取感恩节单例
	 */
    public static getInstance(): CCDDZPanelThanksgiving {
        if(!CCDDZPanelThanksgiving._instance) {
            CCDDZPanelThanksgiving._instance = new CCDDZPanelThanksgiving();
        }
        return CCDDZPanelThanksgiving._instance;
    }
	/**
	 * 移除感恩节面板
	 */
	public static remove():void{
		if(CCDDZPanelThanksgiving._instance){
			CCDDZPanelThanksgiving._instance.close();
		}
	}
}