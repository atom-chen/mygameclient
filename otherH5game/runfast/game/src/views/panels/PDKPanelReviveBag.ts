/**
 * Created by zhu on 2017/10/20.
 * 复活礼包面板
 */

class PDKPanelReviveBag extends PDKalien.PDKPanelBase {
	private static _instance: PDKPanelReviveBag;

	/**
	 * 关闭按钮
	 */
	private close_img: eui.Image;

	/**
	 * 购买按钮
	 */
	private btnBuy: eui.Group;

	/**
	 * 原钻石数量
	 */

	private item1Num_label: eui.Label;

	/**
	 * 赠送的钻石数量
	 */
	private item2Num_label: eui.Label;

	/**
	 * 赠送的记牌器
	 */
	private item3Num_label: eui.Label;

	/**
	 * 钻石少于门槛的提示
	 */
	private diamoneTip_label: eui.Label;

	/**
	 * 钻石门槛
	 */
	private _diamondLimitNum: number;
	private _buyId: number;

	private _rechargeTit = {
		[10047]: "初级场复活礼包", //不带记牌器
		[10048]: "中级场复活礼包", // old
		[10049]: "高级场复活礼包", // old
		[10052]: "中级场复活礼包", // new-20180828
		[10053]: "高级场复活礼包", // new-20180828
	}

	constructor() {
		super(PDKalien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, PDKalien.popupEffect.Scale, { withFade: false, ease: egret.Ease.backIn });

	}

	init(): void {
		this.skinName = panels.PDKPanelReviveSkin;
	}

	createChildren(): void {
		super.createChildren();
		this._initEvent();
	}

	/**
	 * 初始化事件
	 */
	private _initEvent(): void {
		this._enableEvent(true);
		this.close_img["addClickListener"](this._onTouchClose, this);
		this.btnBuy["addClickListener"](this._onClickBuyRevive, this);
		//let e: PDKalien.PDKEventManager = PDKalien.PDKEventManager.instance;
		//e.registerOnObject(this,PDKalien.Dispatcher,PDKEventNames.HORN_TALK_RECORDS_CHANGE,this._onHornRecChange,this);
	}

	/**
	 * 初始化界面
	 */
	private _initUI(roomid: number): void {
		let _productId = 10047;
		if (roomid == 9004) {
			// _productId = 10048;
			_productId = 10052;
		}
		else if (roomid == 9005) {
			// _productId = 10049;
			_productId = 10053;
		}
		this._buyId = _productId;
		let _info: any = PDKGameConfig.getReviveBagInfo(_productId);
		if (_info) {
			let _baseInfo = _info.goods.split(":");
			this.item1Num_label.text = "x" + _baseInfo[1];

			let _addGoods = _info.addition_goods.split(":");
			this.item2Num_label.text = 'x' + _addGoods[1];

			console.log("PDKPanelReviveBag----_initUI------>", _info, _baseInfo[1], _addGoods[1]);

			let _addInfo = _info.goods.split("|");
			if (_addInfo.length == 2) {
				let add1: any = _addInfo[0].split(":");
				let add2: any = _addInfo[1].split(":");

				this.item2Num_label.text = "x" + add1[1];
				let str = add2[1] + "小时";
				if (add2[1] % 24 == 0) {
					str = add2[1] / 24 + "天";
				}
				this.item3Num_label.text = str;
			}
			this["revive_cost"].text = _info.money + "元";
		}
	}

	/**
	 * 点击关闭
	 */
	private _onTouchClose(): void {
		this.dealAction();
		PDKalien.Dispatcher.dispatch(PDKEventNames.CLOSE_REVIVE_PANEL);
	}

	/**
	 * 点击购买
	 */
	private _onClickBuyRevive(): void {
		// let _payId = "10009";
		let _payId = "" + this._buyId;
		// if(this.currentState == "noRecorder"){
		// 	_payId = "10016";
		// }

		if (pdkServer._isInDDZ) {
			pdkServer.ddzDispatchEvent(1, '', { type: 5, productID: _payId });
		}
		else {
			PDKRechargeService.instance.doRecharge(_payId);
		}
	}

	/**
	 * 从场景移除
	 */
	private _onRemovedToStage(): void {
		this._enableEvent(false);
		PDKalien.PDKEventManager.instance.disableOnObject(this);
		PDKPanelReviveBag._instance = null;
	}
	/**
	 * 使能 事件
	 */
	private _enableEvent(bEnable: boolean): void {
		let _func = "addEventListener";
		if (!bEnable) {
			_func = "removeEventListener"
		}
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);

		pdkServer[_func](PDKEventNames.USER_RECHARGE_RESULT_NOTIFY, this.onRechargeResultNotify, this);
	}

	private onRechargeResultNotify(event: egret.Event): void {
		let data: any = event.data;

		if (data.result == 0) {
			let _productId = data.productid;
			if (this._rechargeTit[_productId]) {
				PDKAlert.show("购买" + this._rechargeTit[_productId] + "成功!");
			}
		}
	}

	/**
	 * 判断今天是否购买了复活礼包来设置是否显示赠送的记牌器  
	 */
	private _checkShouldState(): void {
		let _todayHasBuy = PDKMainLogic.instance.selfData.todayHasBuyRevive();
		if (_todayHasBuy) {
			this.currentState = "noRecorder";
		} else {
			this.currentState = "hasRecorder";
		}
	}

    /**
     * 背包更新
    */
	private _onBagRefresh(): void {
		let _nDiamond: any = PDKBagService.instance.getItemCountById(3);
		if (_nDiamond >= this._diamondLimitNum) {
			this.dealAction();
			PDKalien.Dispatcher.dispatch(PDKEventNames.BUY_REVIVE_SUCC);
		}
	}

	/**
	 * 显示复活礼包面板
	 * num:钻石门槛
	 */
	public show(num: number, roomid: number): void {
		this._diamondLimitNum = num;
		let text: any = this.diamoneTip_label.text;
		this.diamoneTip_label.text = text.replace('{0}', num);
		this.popup(null, true, { alpha: 0 });
		this._checkShouldState();
		this._initUI(roomid);

		let e: PDKalien.PDKEventManager = PDKalien.PDKEventManager.instance;
		e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.BAG_INFO_REFRESH, this._onBagRefresh, this);
		PDKalien.PDKEventManager.instance.enableOnObject(this);
	}

	/**
	 * 获取复活礼包单例
	 */
	public static getInstance(): PDKPanelReviveBag {
		if (!PDKPanelReviveBag._instance) {
			PDKPanelReviveBag._instance = new PDKPanelReviveBag();
		}
		return PDKPanelReviveBag._instance;
	}

	/**
	 * 移除复活礼包面板
	 */
	public static remove(): void {
		if (PDKPanelReviveBag._instance) {
			PDKPanelReviveBag._instance.close();
		}
	}
}