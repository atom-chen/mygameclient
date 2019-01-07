/**
 * Created by zhu on 17/08/23.
 * 玩家信息面板
 */

class PDKPanelPlayerInfo extends PDKalien.PDKPanelBase {
	private bg_img: eui.Image; //背景图
	private head_img: eui.Image;//图像
	private headMask_img: eui.Image;//头像遮罩
	private nick_label: eui.Label;//昵称
	private gold_label: eui.Label;//金豆
	private games_label: eui.Label;//对局
	private winRate_label: eui.Label;//胜率
	private redbeg_label: eui.Label;//红包数量
	private brow1_btn: eui.Button;//表情1
	private brow2_btn: eui.Button;//表情2
	private brow3_btn: eui.Button;//表情3
	private brow4_btn: eui.Button;//表情4
	private brow5_btn: eui.Button; //表情5
	private report_btn: eui.Button; //举报
	private close_btn: eui.Button;//关闭按钮
	private static _instance: PDKPanelPlayerInfo;
	protected _uid: number;//玩家的uid
	protected _seatId: number; //玩家的座位id
	private _browData: PDKBrowData;//表情数据

	private brow1Gold_img: eui.Image;  //金豆
	private brow1Price_img: eui.Image; //价格
	private brow1Free_img: eui.Image;  //免费

	private brow2Gold_img: eui.Image; //金豆
	private brow2Price_img: eui.Image;//价格
	private brow2Free_img: eui.Image; //免费

	private brow3Gold_img: eui.Image; //金豆
	private brow3Price_img: eui.Image;//价格 
	private brow3Free_img: eui.Image; //免费

	private brow4Gold_img: eui.Image; //金豆
	private brow4Price_img: eui.Image;//价格
	private brow4Free_img: eui.Image; //免费

	private brow5Gold_img: eui.Image; //金豆
	private brow5Price_img: eui.Image;//价格 
	private brow5Free_img: eui.Image; //免费

	private mFLeft_label: eui.Label; //剩余免费次数
	private browAndReport_group: eui.Group;//表情，举报，免费剩余此次
	init(): void {
		this.skinName = panels.PDKPanelPlayerInfo;
	}

	constructor() {
		super(PDKalien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, PDKalien.popupEffect.Scale, { withFade: false, ease: egret.Ease.backIn });
		this._cleanData();
		this._browData = new PDKBrowData();
	}

	createChildren(): void {
		super.createChildren();
		this._initTouchEvent();
		this._initDefault();
	}

	/**
	 * 清除数据
	 */
	_cleanData(): void {
		this._browData = null;
		PDKPanelPlayerInfo._instance = null;
	}
	/**
	 * 事件使能
	 */
	private _enableEvent(bEnable: boolean): void {
		let _func = "addEventListener";
		if (bEnable == false) {
			_func = "removeEventListener";
		}
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
		this.brow1_btn[_func](egret.TouchEvent.TOUCH_TAP, this._onTouchBrow1Btn, this);
		this.brow2_btn[_func](egret.TouchEvent.TOUCH_TAP, this._onTouchBrow2Btn, this);
		this.brow3_btn[_func](egret.TouchEvent.TOUCH_TAP, this._onTouchBrow3Btn, this);
		this.brow4_btn[_func](egret.TouchEvent.TOUCH_TAP, this._onTouchBrow4Btn, this);
		this.brow5_btn[_func](egret.TouchEvent.TOUCH_TAP, this._onTouchBrow5Btn, this);
		this.report_btn[_func](egret.TouchEvent.TOUCH_TAP, this._onTouchReportBtn, this);
		this.close_btn[_func](egret.TouchEvent.TOUCH_TAP, this._onTouchCloseBtn, this);
	}

	//事件初始化
	private _initTouchEvent(): void {
		this._enableEvent(true);
	}


	/**
	 * 初始化免费表情次数
	 */
	private _initFreeBrow(): void {
		let _nFree: number = PDKMainLogic.instance.selfData.getFreeBrowCount();
		let _bFree = false;
		if (_nFree > 0) {
			_bFree = true;
		}

		let _n = 0;
		for (let i = 0; i < 5; ++i) {
			_n = i + 1;
			this["brow" + _n + "Gold_img"].visible = !_bFree;
			this["brow" + _n + "Price_img"].visible = !_bFree;
			this["brow" + _n + "Free_img"].visible = _bFree;
		}
		this.mFLeft_label.visible = _bFree;
		this.mFLeft_label.text = "剩余免费次数:" + _nFree;
	}

	/**
	 * 初始化默认
	 */
	private _initDefault(): void {
		this.head_img.mask = this.headMask_img; //玩家头像模板
		this._initFreeBrow();
	}

	/**
	 *  设置昵称 长度五个中文字符,10个英文字符
	 */
	private _setNick(sNick: string): void {
		this.nick_label.text = sNick;
	}

	/**
	 * 设置对局
	 */
	private _setGames(nGames: number): void {
		this.games_label.text = "" + nGames;
	}

	/**
	 * 设置金豆 大于10万则以万为单位
	 */
	private _setGold(nGold: number): void {
		let _str = "" + nGold;
		if (!nGold || nGold < 0) {
			nGold = 0;
		}
		if (nGold >= 100000) { //十万只显示一位小数
			if (nGold >= 1000000) { //百万不显示小数部分
				_str = _str.substring(0, _str.length - 4) + "万";
			}
			else {
				_str = _str.substr(0, 2) + "." + _str.substr(2, 1) + "万";
			}
		}
		this.gold_label.text = _str;
	}
	/**
	 * 设置胜率 xx%
	 */
	private _setWinRate(sRate: string): void {
		this.winRate_label.text = sRate;
	}

	/**
	 * 设置玩家头像
	 */
	private _setHeadImg(url: string): void {
		let _url = url;
		if (url) {
			if (url.indexOf("http://") != -1) {
				_url = url.replace("http://", "https://");
			}
		}
		this.head_img.source = _url;
	}

	/**
	 * 设置红包 保留一位小数
	 */
	private _setRedBeg(fNum: Number): void {
		this.redbeg_label.text = fNum.toFixed(1).toString();
	}

	/**
	 * 点击发送表情
	 */
	private _onBuyBrow(nId: number): void {
		if (this._uid == pdkServer.uid) return;

		this.dealAction();
		let _costGold = this._browData.getBrowCostGold(nId);
		if (!_costGold) return;

		let _nFree = PDKMainLogic.instance.selfData.getFreeBrowCount();
		let _selfGold = PDKMainLogic.instance.selfData.getGold() || 0;
		//没有免费次数，并且金豆不足
		if ((_nFree < 0) && (_costGold > _selfGold)) {
			return PDKImgToast.instance.show(this, PDKlang.browNoGold);
		}

		if (this._browData.checkCanBuyByBrowId(nId)) {
			this._browData.startCDByBrowId(nId);
			pdkServer.send(PDKEventNames.GAME_OPERATE_REQ, { optype: 5, params: [this._seatId, nId] });
		}
	}

	/**
	 * 点击表情1 id:1
	 */
	private _onTouchBrow1Btn(): void {
		let _id = PDKBrowData.BrowID.BROW_666;
		this._onBuyBrow(_id);
	}
	/**
	 * 点击表情2
	 */
	private _onTouchBrow2Btn(): void {
		let _id = PDKBrowData.BrowID.BROW_TORTISE;
		this._onBuyBrow(_id);
	}
	/**
	 * 点击表情3
	 */
	private _onTouchBrow3Btn(): void {
		let _id = PDKBrowData.BrowID.BROW_TOMATO;
		this._onBuyBrow(_id);
	}
	/**
	 * 点击表情4
	 */
	private _onTouchBrow4Btn(): void {
		let _id = PDKBrowData.BrowID.BROW_LOVE;
		this._onBuyBrow(_id);
	}
	/**
	 * 点击表情5
	 */
	private _onTouchBrow5Btn(): void {
		let _id = PDKBrowData.BrowID.BROW_GOOD;
		this._onBuyBrow(_id);
	}
	/**
	 * Http 举报玩家回调
	 * 	code
	    0     成功
	    1000  参数缺少
        9001  token认证失败
        30001 请求重复

	 */
	private _onReportRet(response: any): void {
		if (response) {
			if (response.code == 0) {
				PDKImgToast.instance.show(this, PDKlang.reportSucc);
			}
			else if (response.code == 30001) {
				PDKImgToast.instance.show(this, PDKlang.repeatReport);
			}
		}
	}

	/**
	 * 点击举报 不可以举报自己
	 */
	private _onTouchReportBtn(): void {
		if (this._uid == pdkServer.uid) return;

		let _token = PDKUserData.instance.getItem('token');
		let _uid = pdkServer.uid;
		let _type = 1;
		let _roomId = pdkServer.getRoomId();
		let _tableId = pdkServer.getTableId();
		let _toUid = this._uid;
		let _content = null;
		PDKwebService.reportUser(_token, _uid, _type, _roomId, _tableId, _toUid, this._onReportRet.bind(this));
	}

	/**
	 * 显示表情，举报和免费表情次数
	 */
	private _showBrowAndReport(bShow: boolean): void {
		this.browAndReport_group.visible = bShow;
	}
	/**
	 * 点击关闭按钮
	 */
	private _onTouchCloseBtn(): void {
		this.dealAction();
	}
	/**
	 * 显示玩家信息
	 */
	public show(_data): void {
		this._uid = _data.uid;
		this._seatId = _data.seatId;
		this._setNick(_data.nick);
		this._setGold(_data.gold);
		this._setGames(_data.game);
		this._setWinRate(_data.winRate);
		this._setRedBeg(_data.redBeg);
		this._setHeadImg(_data.head);

		if (pdkServer.isMatch) {
			if (this._uid != pdkServer.uid) {
				this._hidePlayerInfo();
			}
		}

		this.popup(this.dealAction.bind(this), true, { alpha: 0 });

	}

	/**
	 * 比赛中要赢藏玩家的信息
	 */
	private _hidePlayerInfo(): void {
		this.nick_label.text = "***";
		this.gold_label.text = "***";
		this.games_label.text = "***";
		this.winRate_label.text = "***";
		this.redbeg_label.text = "***";
		this.head_img.source = "pdk_icon_head_default";
	}

	/**
	 * 移除监听
	 */
	public _onRemovedToStage(): void {
		this._enableEvent(false);
		this._cleanData();
	}

	public static getInstance(): PDKPanelPlayerInfo {
		if (!PDKPanelPlayerInfo._instance) {
			PDKPanelPlayerInfo._instance = new PDKPanelPlayerInfo();
		}
		return PDKPanelPlayerInfo._instance;
	}

	/**
	 * 玩家离开房间
	 */
	public static onPlayerLeave(nSeatId: number): void {
		let _instance = PDKPanelPlayerInfo._instance;
		if (_instance) {
			if (_instance._seatId == nSeatId) {
				_instance.close();
			}
		}
	}

	/**
	 * 一局游戏结束，需要移除
	 */
	public static remove(): void {
		if (PDKPanelPlayerInfo._instance) {
			PDKPanelPlayerInfo._instance.close();
		}
	}
}