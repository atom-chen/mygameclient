/**
 * Created by zhu on 2017/11/16.
 * 活动告面板
 */

class PDKPanelAct extends PDKalien.PDKPanelBase {
	private static _instance: PDKPanelAct;

	/**
	 * 代理活动节点
	 */
	private _delegateNode: PDKPanelDelegate;

	/**
	 * APP福利节点
	 */
	private _appNode: PDKPanelDownApp;

	/**
	 * 感恩节活动节点
	 */
	private _thanksgivingNode: PDKPanelThanksgiving;
	/**
	 * 首充节点
	 */
	private _frechargeNode: PDKPanelFirstRecharge;
	/**
	 * 每日福袋节点
	 */
	private _dayBuygNode: PDKPanelDayBuy;
	/**
	 * 关注公众号节点
	 */
	private _watchWXNode: PDKPanelWatchWX;

	/**
	 * 左边活动按钮的列表
	 */
	private leftLabelList: eui.List;

	/**
	 * 左侧的按钮的dataProvider
	 */
	private _leftLabelsDataProvider: eui.ArrayCollection;

	/**
	 * 上一次选中的左侧的活动按钮的缩影
	 */
	private _lastSelectIdx: number = 0;

	/**
	 * 顶层的group
	 */
	private infoGroup: eui.Group;

	/**
	 * 左边的箭头指示当前选中的按钮
	 */
	private arrImg: eui.Image;

	/**
	 * 当前选中的左边的某个按钮信息
	 */
	private _selectItem: any;

	private _labels: Array<any> = [];

	private _selfData: PDKUserInfoData = PDKMainLogic.instance.selfData;
	constructor() {
		super();
	}

	init(): void {
		this.skinName = panels.PDKPanelActSkin;
	}

	createChildren(): void {
		super.createChildren();
		this._initUI();
		this._initEvent();

		//let _uid = PDKMainLogic.instance.selfData.uid;
		//PDKwebService.getWatchPublicWX(_uid,this._onGetWatchWXHttpRep.bind(this));
	}

	/**
	 * 首充状态改变
	 */
	private _onFRechargeUpdate(): void {
		if (!this._selfData.isNotBuyFRecharge()) {
			for (let i = 0; i < this._labels.length; ++i) {
				if (this._labels[i].id == 1) {
					this._labels.splice(i, 1);
					break;
				}
			}
			this._leftLabelsDataProvider.source = this._labels;
			this._leftLabelsDataProvider.refresh();

			if (this._frechargeNode) {
				PDKPanelFirstRecharge.nullInstance();
				this._frechargeNode = null;
			}
			this._changeSelectByIdx(-1);
		}
	}

	/**
	 * 大厅里面获取到是否登录过APP的标记后分发事件通知是否登录APP状态已更新
	 */
	private _onLoginAppUpdate(): void {
		if (!PDKalien.Native.instance.isNative) {
			if (this._selfData.hasNotLoginApp()) {
				let _newDownApp = this._selfData.shouldShowActDownAppRed();
				this._labels.push({ tit: "APP福利", id: 2, sel: false, new: _newDownApp, cb: this._onClickAPPAct.bind(this) });
				this._leftLabelsDataProvider.source = this._labels;
				this._leftLabelsDataProvider.refresh();
			}
		}
	}

	/**
	 * 初始化事件
	 */
	private _initEvent(): void {
		this._enableEvent(true);
		this.leftLabelList.addEventListener(egret.Event.CHANGE, this._onSelectItem, this);
		let e: PDKalien.PDKEventManager = PDKEventManager.instance;
		e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.FRECHARGE_HASUPDATE, this._onFRechargeUpdate, this);
		e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.LOGINAPP_HASUPDATE, this._onLoginAppUpdate, this);
		PDKEventManager.instance.enableOnObject(this);
	}

	//根据活动id来设置不显示小红点
	//0:推广 1:首充,2:APP福利,3:感恩节
	private _setNotRedById(id: number): void {
		for (let i = 0; i < this._labels.length; ++i) {
			if (this._labels[i].id == id) {
				this._labels[i].new = false;
				this._leftLabelsDataProvider.itemUpdated(this._labels[i]);
				break;
			}
		}
	}
	//获取在list中的缩影
	private _getIdxById(id: number): number {
		for (let i = 0; i < this._labels.length; ++i) {
			if (this._labels[i].id == id) {
				return i;
			}
		}
		return -1;
	}
	/**
	 * 不显示首充的红点
	 */
	private _setNotShowFirstRechargeRed(): void {
		if (this._selfData.shouldShowActFirstRechareRedRed()) {
			this._selfData.setNotShowActFirstRechargeRed();
			pdkServer.reqClickFirstRecharge();
			this._setNotRedById(1);
		}
	}
	/**
	 * 不显示感恩节的红点
	 */
	private _setNotShowThanksRed(): void {
		if (this._selfData.shouldShowActThanksRed()) {
			this._selfData.setNotShowActThanksRed();
			pdkServer.reqClickThanksgiving();
			this._setNotRedById(3);
		}
	}
	/**
	 * 不显示APP福利的红点
	 */
	private _setNotShowDownAppRed(): void {
		if (this._selfData.shouldShowActDownAppRed()) {
			this._selfData.setNotShowActDownAppRed();
			pdkServer.reqClickDownApp();
			this._setNotRedById(2);
		}
	}


	/**
	 * web通知关注结果
	 */
	private _onGetWatchWXHttpRep(response: any): void {
		if (response && response.code == 0 && response.data && response.data.has_subscribe != 1) {
			let _watchInfo = { tit: "关注福利", sel: false, id: 4, new: false, cb: this._onClickWatch.bind(this) };
			this._labels.push(_watchInfo);
			this._leftLabelsDataProvider.source = this._labels;
			this._leftLabelsDataProvider.refresh();
		}
	}

	/**
	 * 初始化左边的按钮
	 */
	private _initLeftBtns(): void {
		let _thanksInfo = { tit: "感恩节活动", sel: false, id: 3, new: false, cb: this._onClickThanksgiving.bind(this) };
		if (PDKUtils.isInTimeSection("2017-11-23 00:00:00", "2017-11-26 00:00:00", new Date().getTime())) {
			let _newThanks = this._selfData.shouldShowActThanksRed();
			_thanksInfo.new = _newThanks;
			this._labels.push(_thanksInfo);
		}

		let _firstInfo = { tit: "首充活动", id: 1, sel: false, new: false, cb: this._onClickFirstRecharge.bind(this) };
		if (this._selfData.isNotBuyFRecharge()) {
			let _newFirst = this._selfData.shouldShowActFirstRechareRedRed();
			_firstInfo.new = _newFirst;
			this._labels.push(_firstInfo);
		}/*else if(!this._selfData.isHadGetFRechargeRew()){
			let _newFirst  = this._selfData.shouldShowActFirstRechareRedRed();
			_firstInfo.new = _newFirst;
			this._labels.push(_firstInfo);
		}
*/

		if (!PDKalien.Native.instance.isNative) {
			if (this._selfData.hasNotLoginApp()) {
				let _newDownApp = this._selfData.shouldShowActDownAppRed();
				this._labels.push({ tit: "APP福利", id: 2, sel: false, new: _newDownApp, cb: this._onClickAPPAct.bind(this) });
			}
		}

		//this._labels.push({tit:"每日福利",sel:false,new:false,id:5,cb:this._onClickDayBuy.bind(this)});
		this._labels.push({ tit: "推广福利", sel: false, new: false, id: 0, cb: this._onClickDelegate.bind(this) });
	}

	/**
	 * 初始化界面
	 */
	private _initUI(): void {
		//let _newDownApp = this._selfData.shouldShowActDownAppRed();
		this._labels = [];

		this._initLeftBtns();
		this.leftLabelList.itemRenderer = PDKActListItem;
		this.leftLabelList.dataProvider = this._leftLabelsDataProvider = new eui.ArrayCollection(this._labels);

		this.leftLabelList.selectedIndex = 0;
		//this._leftLabelsDataProvider.refresh();
	}

	/**
	 * 当刚创建界面或者是设置的选中标签超出了列表的缩影范围
	 */
	private _onSelIdxInvide(selectIdx: number): void {
		if (selectIdx >= this._labels.length || selectIdx < 0) {
			selectIdx = 0;
		}
		this._selectItem = this._labels[selectIdx];
		this._selectItem.cb();

		for (let i = 0; i < this._leftLabelsDataProvider.length; ++i) {
			if (i == selectIdx) {
				this._leftLabelsDataProvider.source[i].sel = true;
			} else {
				this._leftLabelsDataProvider.source[i].sel = false;

			}
			this._leftLabelsDataProvider.itemUpdated(this._labels[i]);
		}
		this._lastSelectIdx = selectIdx;
		egret.setTimeout(() => {
			let _item = this.leftLabelList.getChildAt(selectIdx);
			let _pos: any = _item.localToGlobal(_item.width * 0.5, _item.height * 0.5);
			let _pos1 = this.infoGroup.globalToLocal(_pos.x, _pos.y);
			this.arrImg.y = _pos1.y;
		}, this, 350);
	}

	/**
	 * 根据索引设置选中的按钮
	 */
	private _changeSelectByIdx(selectIdx: number): void {
		if (selectIdx >= this.leftLabelList.$children.length || selectIdx < 0) {
			this._onSelIdxInvide(selectIdx);
			return;
		}
		let idx = selectIdx;
		this._leftLabelsDataProvider.source[this._lastSelectIdx].sel = 0;
		this._leftLabelsDataProvider.itemUpdated(this._labels[this._lastSelectIdx]);
		this._lastSelectIdx = idx;
		let _item = this.leftLabelList.getChildAt(idx);
		let _pos: any = _item.localToGlobal(_item.width * 0.5, _item.height * 0.5);
		let _pos1 = this.infoGroup.globalToLocal(_pos.x, _pos.y);
		this.arrImg.y = _pos1.y;

		for (let i = 0; i < this._leftLabelsDataProvider.length; ++i) {
			if (i == idx) {
				this._leftLabelsDataProvider.source[i].sel = true;
				this._leftLabelsDataProvider.itemUpdated(this._labels[idx]);
				break;
			}
		}
		this._selectItem = this._labels[idx];
		this._labels[idx].cb();
		egret.callLater(() => {
			this.leftLabelList.selectedIndex = -1;
		}, this);
	}

	/**
	 * 选中某个活动
	 */
	private _onSelectItem(): void {
		this._changeSelectByIdx(this.leftLabelList.selectedIndex);
	}
	/**
	 * 点击感恩节活动
	 */
	private _onClickThanksgiving(): void {
		this._showThanksgiving();
	}

	/**
	 * 点击首充
	 */
	private _onClickFirstRecharge(): void {
		this._showFirstRecharge();
	}

	/**
	 * 点击APP福利
	 */
	private _onClickAPPAct(): void {
		this._showAPPAct();
	}

	private _onClickDelegate(): void {
		this._showDelegate();
	}

	/**
	 * 点击关注福利
	 */
	private _onClickWatch(): void {
		this._showWatchWX();
	}

	/**
	 * 点击每日福利
	 */
	public _onClickDayBuy(): void {
		this._showDayBuy();
	}

	/**
	 * 检查是否添加了每日福袋
	 */
	private _checkDayBuy(): void {
		if (!this._dayBuygNode) {
			this._dayBuygNode = PDKPanelDayBuy.getInstance()
			this.addChild(this._dayBuygNode);
		}
	}

	/**
	 * 检查是否添加了关注公众号
	 */
	private _checkWatchWX(): void {
		if (!this._watchWXNode) {
			this._watchWXNode = PDKPanelWatchWX.getInstance()
			this.addChild(this._watchWXNode);
		}
	}
	/**
	 * 检查是否添加了感恩节节点
	 */
	private _checkThanksgiving(): void {
		if (!this._thanksgivingNode) {
			this._thanksgivingNode = PDKPanelThanksgiving.getInstance()
			this.addChild(this._thanksgivingNode);
		}
	}

    /**
     * 首充礼包的光效
     */
	private _onFRLightLoadOver(event: RES.ResourceEvent): void {
		if (event.groupName == "firstRechargelight") {
			RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._onFRLightLoadOver, this);
			if (this._selectItem && this._selectItem.id == 1) {
				this._showFirstRecharge();
			}
		}
	}

	/**
	 * 检查是否添加了首充节点
	 */
	private _checkFrecharge(): void {
		if (!this._frechargeNode) {
			if (!RES.isGroupLoaded("firstRechargelight")) {
				RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._onFRLightLoadOver, this);
				RES.loadGroup("firstRechargelight");
			} else {
				this._frechargeNode = PDKPanelFirstRecharge.getInstance()
				this.addChild(this._frechargeNode);
			}
		}
	}

	/**
	 * 检查是否添加了APP福利节点
	 */
	private _checkAppAct(): void {
		if (!this._appNode) {
			this._appNode = PDKPanelDownApp.getInstance()
			this.addChild(this._appNode);
		}
	}

	/**
	 * 检查是否添加了代理节点
	 */
	private _checkDelegate(): void {
		if (!this._delegateNode) {
			this._delegateNode = PDKPanelDelegate.getInstance();
			this.addChild(this._delegateNode);
		}
	}

	/**
	 * 使能感恩节活动面板是否显示
	 */
	private _enableThanksShow(bShow: boolean): void {
		if (this._thanksgivingNode) {
			this._thanksgivingNode.visible = bShow;
			if (bShow) {
				pdkServer.reqThanksBuyCounts();
			}
		}
	}

	/**
	 * 使能首充面板是否显示
	 */
	private _enableFrechargeShow(bShow: boolean): void {
		if (this._frechargeNode) {
			this._frechargeNode.visible = bShow;
		}
	}

	/**
	 *  使能APP福利面板是否显示
	 */
	private _enableAppActShow(bShow: boolean): void {
		if (this._appNode) {
			this._appNode.visible = bShow;
		}
	}

	/**
	 *  使能代理面板是否显示
	 */
	private _enableDelegateActShow(bShow: boolean): void {
		if (this._delegateNode) {
			this._delegateNode.visible = bShow;
		}
	}

	/**
	 *  使能每日福袋是否显示
	 */
	private _enableDayBuyShow(bShow: boolean): void {
		if (this._dayBuygNode) {
			this._dayBuygNode.visible = bShow;
		}
	}

	/**
	 *  使能关注公众号是否显示
	 */
	private _enableWatchWXShow(bShow: boolean): void {
		if (this._watchWXNode) {
			this._watchWXNode.visible = bShow;
		}
	}
	/**
	 * 显示感恩节活动
	 */
	private _showThanksgiving(): void {
		this._checkThanksgiving();
		this._enableAppActShow(false);
		this._enableFrechargeShow(false);
		this._enableDelegateActShow(false);
		this._enableThanksShow(true);
		this._enableDayBuyShow(false);
		this._enableWatchWXShow(false);
		this._setNotShowThanksRed();
	}

	/**
	 * 显示首充
	 */
	private _showFirstRecharge(): void {
		this._checkFrecharge();
		this._enableAppActShow(false);
		this._enableFrechargeShow(true);
		this._enableDelegateActShow(false);
		this._enableThanksShow(false);
		this._enableDayBuyShow(false);
		this._enableWatchWXShow(false);
		this._setNotShowFirstRechargeRed();
	}

	/**
	 * 显示APP福利
	 */
	private _showAPPAct(): void {
		this._checkAppAct();
		this._enableAppActShow(true);
		this._enableFrechargeShow(false);
		this._enableDelegateActShow(false);
		this._enableThanksShow(false);
		this._enableDayBuyShow(false);
		this._enableWatchWXShow(false);
		this._setNotShowDownAppRed();
	}

	/**
	 * 显示代理赚钱
	 */
	private _showDelegate(): void {
		this._checkDelegate();
		this._enableAppActShow(false);
		this._enableFrechargeShow(false);
		this._enableDelegateActShow(true);
		this._enableDayBuyShow(false);
		this._enableWatchWXShow(false);
		this._enableThanksShow(false);
	}

	/**
	 * 显示每日福袋
	 */
	private _showDayBuy(): void {
		this._checkDayBuy();
		this._enableAppActShow(false);
		this._enableFrechargeShow(false);
		this._enableDelegateActShow(false);
		this._enableDayBuyShow(true);
		this._enableWatchWXShow(false);
		this._enableThanksShow(false);

	}

	/**
	 * 显示关注公众号
	 */
	private _showWatchWX(): void {
		this._checkWatchWX();
		this._enableAppActShow(false);
		this._enableFrechargeShow(false);
		this._enableDelegateActShow(false);
		this._enableThanksShow(false);
		this._enableDayBuyShow(false);
		this._enableWatchWXShow(true);
	}

	/**
	 * 从场景移除
	 */
	private _onRemovedToStage(): void {
		this._enableEvent(false);
		this.leftLabelList.removeEventListener(egret.Event.CHANGE, this._onSelectItem, this);
		PDKalien.PDKEventManager.instance.disableOnObject(this);
		PDKPanelAct._instance = null;
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
	}

	/**
	 * 设置显示APP福利并修改选中的按钮
	 */
	public setShowAppAct(): void {
		let _idx = this._getIdxById(2);
		if (_idx < 0) {
			_idx = 0;
		}
		this._changeSelectByIdx(_idx);
	}
	/**
	 * 设置显示首充并修改选中的按钮
	 */
	public setShowFirstRecharge(): void {
		let _idx = this._getIdxById(1);
		if (_idx < 0) {
			_idx = 0;
		}
		this._changeSelectByIdx(_idx);

	}
	/**
	 * 设置显示感恩节并修改选中的按钮
	 */
	public setShowThanksgiving(): void {
		let _idx = this._getIdxById(3);
		if (_idx < 0) {
			_idx = 0;
		}
		this._changeSelectByIdx(_idx);
	}

	/**
	 * 获取公告单例
	 */
	public static getInstance(): PDKPanelAct {
		if (!PDKPanelAct._instance) {
			PDKPanelAct._instance = new PDKPanelAct();
		}
		return PDKPanelAct._instance;
	}

	/**
	 * 移除公告面板
	 */
	public static remove(): void {
		if (PDKPanelAct._instance) {
			PDKPanelAct._instance.close();
		}
	}
}