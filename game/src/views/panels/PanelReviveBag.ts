/**
 * Created by zhu on 2017/10/20.
 * 复活礼包面板
 */

class PanelReviveBag extends alien.PanelBase {
    private static _instance: PanelReviveBag;

	/**
	 * 关闭按钮
	 */
	private close_img:eui.Image;

	/**
	 * 购买按钮
	 */
	private buyGrp:eui.Group;

	/**
	 * 原钻石数量
	 */

	private item1Num_label:eui.Label;

	/**
	 * 赠送的钻石数量
	 */
	private item2Num_label:eui.Label;

	/**
	 * 赠送的记牌器
	 */
	private item3Num_label:eui.Label;

	/**
	 * 钻石少于门槛的提示
	 */
	private diamoneTip_label:eui.Label;

	/**
	 * 门槛
	 */
	private _limitNum:number;

	/**
	 * 复活礼包类型 0:钻石复活礼包 1:金豆复活礼包
	 */
	private _type:number = 0;

	/**
	 * 房间信息配置表
	 */
	private _room:any;

	/**
	 * 价格
	 */
	private moneyLabel:eui.Label;

	/**
	 * 复活礼包的物品信息
	 */
	private _buyInfo:any = {goods:null,send:null,productId:0,currentState:"",cfg:null};

	constructor() {
		super(alien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, alien.popupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});

	}

    init():void {
		this.skinName = panels.PanelReviveSkin;
	}
	
	createChildren():void {
		super.createChildren();
		this._initEvent();
	}

	/**
	 * 初始化事件
	 */
	private _initEvent():void{
		this._enableEvent(true);
		let func = "addClickListener";
		this.close_img[func](this._onTouchClose, this);
		this.buyGrp[func](this._onClickBuyRevive,this);
		this["moreGrp"][func](this._onClickMoreDiscount,this);
	}

	private _onClickMoreDiscount():void{
		PanelExchange2.instance.show(1);
	}
	/**
	 * 初始化界面
	 */
	private _updateUI():void{
		this.currentState = this._buyInfo.currentState;
		this.validateNow();

		//钻石补满到多少颗
		if(this.currentState == "fullDiamondNoRecorder" ||  this.currentState == "fullDiamondHasRecorder"){
			let sText = "钻石不足,购买{0}元礼包,补充到{1}钻";
			sText = sText.replace('{0}',this._buyInfo.cfg.money);
			let num = Number(this._buyInfo.goods[1]);
			if(this._buyInfo.send && this._buyInfo.send.length >= 1){
				if(this._buyInfo.send[0][0] == this._buyInfo.goods[0]){
					num += Number(this._buyInfo.send[0][1]);
				}
			}
			sText = sText.replace('{1}',""+num);
			this.diamoneTip_label.text = sText;
		}else{
			let sType = "金豆";
			let sExt = "";
			if(this._room.roomFlag == 2){
				sType = "钻石";
				sExt = "颗";
			}
			let sNum = Utils.getFormatGold(this._limitNum);
			let sText = "抱歉，您的" + sType +"少于{0}"+ sExt +"，无法继续游戏，您可以通过以下方式复活。";
			this.diamoneTip_label.text = sText.replace('{0}',sNum);

			let _info:any = this._buyInfo;
			this.item1Num_label.text = "x" + Utils.getFormatGold(_info.goods[1]);
			if(_info.send){
				this.item2Num_label.text = "x" + Utils.getFormatGold(_info.send[0][1]);
				if(_info.send.length>=2){
					let str = _info.send[1][1] + "小时";
					if(_info.send[1][1] % 24 == 0){
						str = _info.send[1][1]/ 24 +"天";
					}
					this.item3Num_label.text = str;
				}
			}
		}

		this.moneyLabel.text = this._buyInfo.cfg.money + "元";
	}

	/**
	 * 点击关闭
	 */
	private _onTouchClose():void{
		this.dealAction();
		alien.Dispatcher.dispatch(EventNames.CLOSE_REVIVE_PANEL);
	}

	/**
	 * 点击购买
	 */
	private _onClickBuyRevive():void{
		RechargeService.instance.doRecharge(this._buyInfo.productId);
	}

	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
        alien.EventManager.instance.disableOnObject(this);
		PanelReviveBag._instance = null;
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
     * 背包更新
    */
    private _onBagRefresh():void{
		if(this._type == 2){
			let _nDiamond:any = BagService.instance.getItemCountById(3);
			if(_nDiamond >= this._limitNum){
				this.dealAction();
				alien.Dispatcher.dispatch(EventNames.BUY_REVIVE_SUCC);
			}
		}
    }

	/**
	 * 金豆变化
	 */
	private _onMyInfoUpdate():void{
		if(this._type == 1){
			let _nGold:any = MainLogic.instance.selfData.gold;
			if(_nGold >= this._limitNum){
				this.dealAction();
				alien.Dispatcher.dispatch(EventNames.BUY_REVIVE_SUCC);
			}
		}
	}

	/**
	 * 拆分复活礼包的信息
	 */
	private _splitRechareInfo(rechareInfo):void{
		this._buyInfo = null;
		if(rechareInfo){
			let _baseInfo = rechareInfo.goods.split(":");
			let _addInfo = null;
			let _send = [];
			if(rechareInfo.addition_goods){
				_addInfo = rechareInfo.addition_goods.split("|");
			}
			if(_addInfo){
				let len = _addInfo.length;
				for(let i=0;i<len;++i){
					_send.push(_addInfo[i].split(":"));
				}
				this._buyInfo = {goods:_baseInfo,send:_send};
			}else{
				this._buyInfo = {goods:_baseInfo};
			}
		}
	}

	/**
	 * 根据房间信息计算购买的物品product_id
	 */
	private _initRechargeInfo():void{
		let productId = 0;
		let roomId = this._room.roomID;
		let currentState = "";
		if(this._room.roomFlag == 1){
			let _goldRelive = MainLogic.instance.selfData.getTodayBuyGoldReviveNum();
			if(roomId == 1001){
				productId = 10035;
				currentState = "noRecorderGold";
				if(_goldRelive < 1){
					productId = 10034;
					currentState = "hasRecorderGold";
				}
			}else if(roomId == 1002){
				productId = 10037;
				currentState = "noRecorderGold";
				if(_goldRelive < 1){
					productId = 10036;
					currentState = "hasRecorderGold";
				}
			}else if(roomId == 8001){
				productId = 10039;
				currentState = "noRecorderGold";
				if(_goldRelive < 1){
					productId = 10038;
					currentState = "hasRecorderGold";
				}
			}else if(roomId == 8002){
				currentState = "noRecorderGold";
				productId = 10041;
				if(_goldRelive < 1){
					productId = 10040;
					currentState = "hasRecorderGold";
				}
			}
		}else if(this._room.roomFlag == 2){
			let data = MainLogic.instance.selfData;
			let _diamondRelive = data.getTodayBuyDiamondReviveNum();
			let _hasBuyOne = data.hasBuyOneDiaRevive();
			let _hasBuyThree = data.hasBuyThreeDiaRevive();
			if(roomId == 1000){
				if(!_hasBuyOne){
					productId = 10024;
					currentState = "fullDiamondNoRecorder";
					if(_diamondRelive < 1){
						productId = 10032;
						currentState = "fullDiamondHasRecorder";
					}
				}else{
					if(!_hasBuyThree){
						productId = 10025;
						currentState = "fullDiamondNoRecorder";
						if(_diamondRelive < 1){
							productId = 10033;
							currentState = "fullDiamondHasRecorder";
						}
					}else{
						productId = 10026;
						currentState = "noRecorderDiamond";
						if(_diamondRelive < 1){
							productId = 10029;
							currentState = "hasRecorderDiamond";
						}
					}
				}
			}else if(roomId == 8003){
				productId = 10051;
				currentState = "noRecorderDiamond";
				if(_diamondRelive < 1){
					productId = 10050;
					currentState = "hasRecorderDiamond";
				}
			}else if(roomId == 8004){
				productId = 10028;
				currentState = "noRecorderDiamond";
				if(_diamondRelive < 1){
					productId = 10031;
					currentState = "hasRecorderDiamond";
				}
			}else if(roomId == 1006 || roomId == 8000){
				productId = 10027;
				currentState = "noRecorderDiamond";
				if(_diamondRelive < 1){
					productId = 10030;
					currentState = "hasRecorderDiamond";
				}
			}
		}

		if(!productId){
			console.error("----------------------->");
		}
		
		let cfg = GameConfig.getRechargeInfoByProductId(productId);
		this._splitRechareInfo(cfg);
		this._buyInfo.cfg = cfg;
		this._buyInfo.productId = productId;
		this._buyInfo.currentState = currentState;
	}

	/**
	 * 显示复活礼包面板
	 * info = {type:2:钻石复活礼包 1:金豆复活礼包,num:门槛}
	 */
	public show(info):void{
		this._room = info;
		this._limitNum = info.minScore;
		this._type = info.roomFlag;
		this.popup();
		this._initRechargeInfo()
		this._updateUI()
        let e: alien.EventManager = alien.EventManager.instance;
		e.registerOnObject(this,alien.Dispatcher,EventNames.BAG_INFO_REFRESH,this._onBagRefresh,this);
		e.registerOnObject(this,alien.Dispatcher,EventNames.MY_USER_INFO_UPDATE,this._onMyInfoUpdate,this);
        alien.EventManager.instance.enableOnObject(this);
	}
	
	/**
	 * 获取复活礼包单例
	 */
    public static getInstance(): PanelReviveBag {
        if(!PanelReviveBag._instance) {
            PanelReviveBag._instance = new PanelReviveBag();
        }
        return PanelReviveBag._instance;
    }

	/**
	 * 移除复活礼包面板
	 */
	public static remove():void{
		if(PanelReviveBag._instance){
			PanelReviveBag._instance.close();
		}
	}
}