/**
 * Created by zhu on 2017/11/16.
 * 活动告面板
 */


let ACT_ID_DELEGATE = 0; //推广活动
let ACT_ID_FIRSTR = 1; //首充
let ACT_ID_APP = 2; //APP福利
let ACT_ID_BIND = 4; //绑定手机
let ACT_ID_INVITE = 7; //邀请活动
let ACT_ID_FFF = 8; //连连翻
let ACT_ID_DIAFIRREC = 9; //钻石首冲
let ACT_ID_REALNAME = 10; //实名认证
let ACT_ID_APPLUCKY = 11; //APP免费抽奖

class CCDDZActList extends eui.Component {
	/**
	 * 代理活动节点
	 */
	private _delegateNode: CCDDZPanelDelegate;

	/**
	 * APP福利节点
	 */
	private _appNode: CCDDZPanelDownApp;

	/**
	 * 感恩节活动节点
	 */
	private _thanksgivingNode: CCDDZPanelThanksgiving;
	/**
	 * 首充节点
	 */
	private _frechargeNode: CCDDZPanelFirstRecharge;
	/**
	 * 每日福袋节点
	 */
	private _dayBuygNode: CCDDZPanelDayBuy;
	/**
	 * 关注公众号节点
	 */
	private _watchWXNode: CCDDZPanelWatchWX;

	/**
	 * 绑定手机活动节点
	 */
	private _bindPhoneNode: CCDDZPanelBindPhone;
	/**
	 * 新年礼盒节点
	 */
	private _newYearGiftNode: CCDDZPanelNewYear;

	/**
	 * 邀请活动节点
	 */
	private _inviteActNode: CCDDZPanelInviteAct;
	/**
	 * 左边活动按钮的列表
	 */
	private leftLabelList: eui.List;

	/***
	 * 翻翻翻
	 */
	private _fffActNode: CCDDZPanelFFFAct;

	/**
	 * 实名
	 */
	private _realActNode: CCDDZPanelRealName;

	/**
	 * app免费抽奖
	 */
	private _appLuckyActNode: CCDDZPanelActAppLucky;

	/**
	 * 钻石首冲
	 */
	private _diaFirRechargeNode: CCDDZPanelDiaFirRecharge;

	/**
	 * 左侧的按钮的dataProvider
	 */
	private _leftLabelsDataProvider: eui.ArrayCollection;

	/**
	 * 上一次选中的左侧的活动按钮的缩影
	 */
	private _lastSelectIdx: number = 0;


	/**
	 * 当前选中的左边的某个按钮信息
	 */
	private _selectItem: any;

	private _labels: Array<any> = [];

	private _selectCb: Function;

	private _selfData: CCGlobalUserInfoData = CCDDZMainLogic.instance.selfData;

	/**
	 * 使能显示的函数
	 */
	private _enableFuncs: any = {};

	constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	init(): void {

		this.skinName = components.CCDDZActList;
	}

	createChildren(): void {
		super.createChildren();
		this._initUI();
		let _self = this;
		this._enableFuncs = {
			[ACT_ID_DELEGATE]: _self._enableDelegateActShow.bind(_self),
			[ACT_ID_FIRSTR]: _self._enableFrechargeShow.bind(_self),
			[ACT_ID_DIAFIRREC]: _self._enableDiaFirrechargeShow.bind(_self),
			[ACT_ID_APP]: _self._enableAppActShow.bind(_self),
			[ACT_ID_BIND]: _self._enableBindPhoneShow.bind(_self),
			[ACT_ID_INVITE]: _self._enableInvaiteActShow.bind(_self),
			[ACT_ID_FFF]: _self._enableFFFActShow.bind(_self),
			[ACT_ID_REALNAME]: _self._enableRealNameActShow.bind(_self),
			[ACT_ID_APPLUCKY]: _self._enableAppLuckyShow.bind(_self)
		}
		//let _uid = CCDDZMainLogic.instance.selfData.uid;
		//ccddzwebService.getWatchPublicWX(_uid,this._onGetWatchWXHttpRep.bind(this));
	}

	private onAddToStage(e: egret.Event): void {
		this._initEvent();
		//ccserver.addEventListener(CCGlobalEventNames.USER_OPERATE_REP,this._onRecvUserOperateRep,this);
		//ccserver.isInNewyearGiftReqNewYear();
		//ccserver.isInNewyearWorkReqNewYear();
	}

	/**
     * 玩家操作的服务器通知 仅处理新年活动相关
     */
    /*private _onRecvUserOperateRep(event:egret.Event):void{
        let _data = CCDDZMainLogic.instance.selfData;
        let data: any = event.data;
		if(data.optype == 4){ //查询活动
            if(data.result == null){
				if(data.params1 && data.params1.length > 1){
                	_data.setNewYearLoginInfo(data.params1);
				}
				if(data.params3){
					_data.setNewYearWorkInfo(data.params3);
				}	
				if(data.params && data.params.length >=1){
					let _buyCount = data.params[0];
                	_data.setNewYearGiftBuyCount(_buyCount);
					let _bShow = this._onNewYearGiftUpdate();
					if(!_bShow){
						return;
					}else{
						if(this._newYearGiftNode){
							this._newYearGiftNode.updateGift();
						}
					}
				}
            }
        }
        else if(data.optype ==9){ //充值后领奖励
            let _str = "";
            if(data.result == null){ //领取成功
                _str = "领取成功";
                _data.setNewYearTodayRewGet();
				if(this._newYearGiftNode){
					this._newYearGiftNode.updateGift();
				}
            }else{
                if(data.result == 3){
                    _str = "今日已领取"
                }else{
                    _str = "领取失败|result:" + data.result;
                }
            }
            CCDDZAlert.show(_str);
        }else if(data.optype ==11){ //开工礼
           let _str = "领取成功";
			if(data.result == null){
				if(data.params&& data.params.length >=2){
					let subId = data.params[1];
					_data.setNewYearWorkInfo([5,2]);
					if(this._newYearGiftNode){
						this._updateNewYearWorkData();
					}
				}
			}else{
                if(data.result == 3){
                    _str = "今日已领取"
                }else{
                    _str = "领取失败|result:" + data.result;
                }
            }
            CCDDZAlert.show(_str);
		}
    }*/

	/**
	 * 获取到新年礼盒购买的次数
	 */
	/*private _onNewYearGiftUpdate():boolean{
		let isInNewYear = CCGlobalGameConfig.isInNewYearGift();
		if(isInNewYear.isInTime){
			let isBuyTime = CCGlobalGameConfig.isInNewYearBuyGift();
			let buyCount = CCDDZMainLogic.instance.selfData.getNewYearGiftBuyCount();
			if(isBuyTime.isInTime ||(!isBuyTime.isInTime && buyCount >= 1)){ //购买时间过期已购买
				
				let _idx = 	this._getIdxById(5);
				if(_idx == -1){ //未添加
					let _hasClick = CCGlobalUserData.instance.hasClickNewYearGift();
					this._labels.push({tit:"新年礼盒",sel:false,new:!_hasClick,id:5,cb:this._onClickNewYearGift.bind(this)});
					this._leftLabelsDataProvider.source = this._labels;
					this._leftLabelsDataProvider.refresh();
				}
				return true;
			}
		}
		return false;
	}
*/
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
				CCDDZPanelFirstRecharge.nullInstance();
				this._frechargeNode = null;
			}
			if (this._selectItem && this._selectItem.id == 1) {
				this._changeSelectByIdx(-1);
			} else {
				if (this._lastSelectIdx >= 1) {
					this._changeSelectByIdx(this._lastSelectIdx - 1);
				}
			}
		}
	}

	/**
	 * 大厅里面获取到是否登录过APP的标记后分发事件通知是否登录APP状态已更新
	 */
	private _onLoginAppUpdate(): void {
		if (!CCalien.Native.instance.isNative) {
			if (this._selfData.hasNotLoginApp()) {
				let _newDownApp = this._selfData.shouldShowActDownAppRed();
				let _labels = this._labels;
				let _len = _labels.length;
				for (let i = 0; i < _len; ++i) {
					if (_labels[i].id == ACT_ID_APP) {
						return;
					}
				}
				this._labels.push({ tit: "APP福利", id: ACT_ID_APP, sel: false, new: _newDownApp, cb: this._onClickAPPAct.bind(this) });
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
		let e: CCalien.CCDDZEventManager = CCDDZEventManager.instance;
		e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.FRECHARGE_HASUPDATE, this._onFRechargeUpdate, this);
		//e.registerOnObject(this,CCalien.CCDDZDispatcher,CCGlobalEventNames.LOGINAPP_HASUPDATE,this._onLoginAppUpdate,this);
		CCDDZEventManager.instance.enableOnObject(this);
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
			ccserver.reqClickFirstRecharge();
			this._setNotRedById(ACT_ID_FIRSTR);
		}
	}

	/**
	 * 不显示钻石首充的红点
	 */
	private _setNotShowDiaFirRechargeRed(): void {
		if (this._selfData.shouldShowActDiaFirRechareRedRed()) {
			this._selfData.setNotShowActDiaFirRechargeRed();
			ccserver.reqClickFirstRecharge();
			this._setNotRedById(ACT_ID_DIAFIRREC);
		}
	}
	/**
	 * 不显示感恩节的红点
	 */
	private _setNotShowThanksRed(): void {
		if (this._selfData.shouldShowActThanksRed()) {
			this._selfData.setNotShowActThanksRed();
			ccserver.reqClickThanksgiving();
			this._setNotRedById(3);
		}
	}
	/**
	 * 不显示APP福利的红点
	 */
	private _setNotShowDownAppRed(): void {
		if (this._selfData.shouldShowActDownAppRed()) {
			this._selfData.setNotShowActDownAppRed();
			ccserver.reqClickDownApp();
			this._setNotRedById(ACT_ID_APP);
		}
	}

	/**
	 * 不显示新年礼盒的红点
	 */
	private _setNotShowNewYearGiftRed(): void {
		this._setNotRedById(5);
	}

	/**
	 * 不显示新年开工礼包的红点
	 */
	private _setNotShowNewYearWorkRed(): void {
		this._setNotRedById(6);
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
     * 保存已经点击过邀请活动
     */
	private _saveHasClickInviteAct(): void {
		CCalien.CCDDZlocalStorage.setItem("hasClickInvite", "1");
	}

	/**
     * 获取是否已经点击过邀请活动
     */
	private _hasClickInviteAct(): boolean {
		let _hasClick = false;
		let _v = CCalien.CCDDZlocalStorage.getItem("hasClickInvite");
		if (_v == "1") {
			_hasClick = true;
		}
		return _hasClick;
	}

	/**
	 * 初始化左边的按钮
	 */
	private _initLeftBtns(): void {
		/*let _thanksInfo = {tit:"感恩节活动",sel:false,id:3,new:false,cb:this._onClickThanksgiving.bind(this)};
		if(CCDDZUtils.isInTimeSection("2017-11-23 00:00:00","2017-11-26 00:00:00",new Date().getTime())){
			let _newThanks = this._selfData.shouldShowActThanksRed();
			_thanksInfo.new = _newThanks;
			this._labels.push(_thanksInfo);
		}*/

		let _firstInfo = { tit: "首充活动", id: ACT_ID_FIRSTR, sel: false, new: false, cb: this._onClickFirstRecharge.bind(this) };
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

		let _info = CCGlobalGameConfig.getCfgByField("webCfg.appLucky");
		if (_info && _info.status == 1) {
			this._labels.push({ tit: "每日福利", id: ACT_ID_REALNAME, sel: false, new: false, cb: this._showAppLucky.bind(this) });
		}

		if (!CCalien.Native.instance.isNative) {
			//if(this._selfData.hasNotLoginApp()){
			let _newDownApp = this._selfData.shouldShowActDownAppRed();
			this._labels.push({ tit: "APP福利", id: ACT_ID_APP, sel: false, new: _newDownApp, cb: this._onClickAPPAct.bind(this) });
			//}
		}

		//this._labels.push({tit:"每日福利",sel:false,new:false,id:5,cb:this._onClickDayBuy.bind(this)});
		this._labels.push({ tit: "推广福利", sel: false, new: false, id: ACT_ID_DELEGATE, cb: this._onClickDelegate.bind(this) });
		/*if(CCGlobalGameConfig.shouldShowInviteAct()){
			let _info = CCGlobalGameConfig.getCfgByField("webCfg");
        	if(_info && _info.status ==1){
				let _click = this._hasClickInviteAct();
				this._labels.push({tit:"邀请有礼",id:ACT_ID_INVITE,sel:false,new:!_click,cb:this._onClickInviteAct.bind(this)});
			}
		}*/

		let _hasBindPhone = CCGlobalUserData.instance.hasBindPhone()
		if (!_hasBindPhone) {
			this._labels.push({ tit: "绑定福利", sel: false, new: true, id: ACT_ID_BIND, cb: this._onClickBindPhone.bind(this) });
		}

		/*let fffCfg = CCGlobalGameConfig.getCfgByField("webCfg.fff");
		if(fffCfg && fffCfg.status == 1){
			this._labels.push({tit:"连连翻",sel:false,new:false,id:ACT_ID_FFF,cb:this._onClickFFF.bind(this)});
		}*/

		let _diaFirRechargeInfo = { tit: "钻石首充", id: ACT_ID_DIAFIRREC, sel: false, new: false, cb: this._onClickDiaFirstRecharge.bind(this) };
		if (this._selfData.isNotBuyDiaFirRecharge()) {
			let _newDiaFirRecharge = this._selfData.shouldShowActDiaFirRechareRedRed();
			_diaFirRechargeInfo.new = _newDiaFirRecharge;
			this._labels.push(_diaFirRechargeInfo);
		}

		if (!this._selfData.realName) {
			this._labels.push({ tit: "实名认证", id: ACT_ID_REALNAME, sel: false, new: false, cb: this._showRealName.bind(this) });
		}

		/*
		let isInNewYearWork = CCGlobalGameConfig.isInNewYearWork();
		if(isInNewYearWork.isInTime){
			let _hasClick = CCGlobalUserData.instance.hasClickNewYearWork();
			this._labels.push({tit:"开工礼包",sel:false,new:!_hasClick,id:6,cb:this._onClickNewYearWork.bind(this)});
		}*/
	}

	/**
	 * 点击邀请活动
	 */
	private _onClickInviteAct(): void {
		this._showInviteAct();
	}

	/**
	 * 点击新年礼盒
	 */
	private _onClickNewYearGift(): void {
		this._showNewYearGift();
	}

	/**
	 * 更新新年开工礼的数据
	 */
	private _updateNewYearWorkData(): void {
		let _cfg = CCGlobalGameConfig.newYearCfg.yearWork;
		if (_cfg.play) {
			let _cfg1 = _cfg.play[0];
			let _total = _cfg1.progress;
			let _rewArr = _cfg1.rwd.split("|");
			let item1 = _rewArr[0].split(":");
			let item2 = _rewArr[1].split(":");
			let _rew = [{ id: item1[0], num: item1[1] }, { id: item2[0], num: item2[1] }];
			let _playInfo = this._selfData.getNewYearWorkInfo();
			let _playNum = 0;
			if (_playInfo.length >= 1) {
				_playNum = _playInfo[0];
			}
			let _oneInfo = { rew: _rew, taskDesc1: "任意场完成" + _total + "次对局", taskDesc2: "(自由组局除外)", condition: 4, id: 4, status: 0, type: 3, total: _total, num: _playNum, subId: 1 };
			_oneInfo.status = _playInfo[1] || 0;
			this._newYearGiftNode.updateWork(_oneInfo);
		}
	}

	/**
	 * 新年开工礼包
	 */
	private _onClickNewYearWork(): void {
		this._showNewYearWork();
		this._updateNewYearWorkData();
	}

	/**
	 * 初始化界面
	 */
	private _initUI(): void {
		//let _newDownApp = this._selfData.shouldShowActDownAppRed();
		this._labels = [];

		this._initLeftBtns();
		this.leftLabelList.itemRenderer = CCDDZActListItem;
		this.leftLabelList.dataProvider = this._leftLabelsDataProvider = new eui.ArrayCollection(this._labels);

		this.leftLabelList.selectedIndex = 0;
		//this._leftLabelsDataProvider.refresh();
		this.leftLabelList.validateNow();
	}

	/**
	 * 根据索引设置选中的按钮
	 */
	private _changeSelectByIdx(selectIdx: number): void {
		if (selectIdx >= this.leftLabelList.$children.length || selectIdx < 0) {
			selectIdx = 0;
		}
		let idx = selectIdx;

		if (this._lastSelectIdx >= 0 && this._lastSelectIdx < this._leftLabelsDataProvider.source.length) {
			this._leftLabelsDataProvider.source[this._lastSelectIdx].sel = 0;
			this._leftLabelsDataProvider.itemUpdated(this._labels[this._lastSelectIdx]);
		}
		this._lastSelectIdx = idx;
		let _item = this.leftLabelList.getChildAt(idx);

		if (this._selectCb) {
			egret.setTimeout(() => {
				let _pos: any = _item.localToGlobal(_item.width * 0.5, _item.height * 0.5);
				this._selectCb({ item: _item, pos: _pos });
			}, this, 50)
		}

		for (let i = 0; i < this._leftLabelsDataProvider.length; ++i) {
			if (i == idx) {
				this._leftLabelsDataProvider.source[i].sel = true;
				this._leftLabelsDataProvider.itemUpdated(this._labels[idx]);
				break;
			}
		}
		this._selectItem = this._labels[idx];
		//console.log("_changeSelectByIdx==>",idx,this._labels[idx]);
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
	 * 点击钻石首充
	 */
	private _onClickDiaFirstRecharge(): void {
		this._showDiaFirRecharge();
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
	 * 点击绑定福利
	 */
	public _onClickBindPhone(): void {
		this._showBindPhone();
	}

	/**
	 * 点击连连翻
	 */
	public _onClickFFF(): void {
		this._showFFF();
	}

	/**
	 * 检查是否添加了每日福袋
	 */
	private _checkDayBuy(): void {
		if (!this._dayBuygNode) {
			this._dayBuygNode = CCDDZPanelDayBuy.getInstance()
			this.parent.addChild(this._dayBuygNode);
		}
	}

	/**
	 * 检查是否添加了关注公众号
	 */
	private _checkWatchWX(): void {
		if (!this._watchWXNode) {
			this._watchWXNode = CCDDZPanelWatchWX.getInstance()
			this.parent.addChild(this._watchWXNode);
		}
	}
	/**
	 * 检查是否添加了感恩节节点
	 */
	private _checkThanksgiving(): void {
		if (!this._thanksgivingNode) {
			this._thanksgivingNode = CCDDZPanelThanksgiving.getInstance()
			this.parent.addChild(this._thanksgivingNode);
		}
	}

	/**
	 * 检查是否添加了绑定手机
	 */
	private _checkBindPhone(): void {
		if (!this._bindPhoneNode) {
			CCDDZPanelBindPhone.nullInstance();
			this._bindPhoneNode = CCDDZPanelBindPhone.getInstance()
			this.parent.addChild(this._bindPhoneNode);
		}
	}

	/**
	 * 检查是否添加了连连翻
	 */
	private _checkFFF(): void {
		if (!this._fffActNode) {
			CCDDZPanelFFFAct.nullInstance();
			this._fffActNode = CCDDZPanelFFFAct.getInstance()
			this.parent.addChild(this._fffActNode);
		}
	}

	/**
	 * 检查是否添加了实名
	 */
	private _checkRealName(): void {
		if (!this._realActNode) {
			CCDDZPanelRealName.nullInstance();
			this._realActNode = CCDDZPanelRealName.getInstance()
			this.parent.addChild(this._realActNode);
		}
	}
	/**
	 * 检查是否添加了APP抽奖
	 */
	private _checkAppLucky(): void {
		if (!this._appLuckyActNode) {
			CCDDZPanelActAppLucky.nullInstance();
			this._appLuckyActNode = CCDDZPanelActAppLucky.getInstance()
			this.parent.addChild(this._appLuckyActNode);
		}
	}

	/**
	 * 检查是否添加了新年礼盒
	 */
	private _checkNewYearGift(): void {
		if (!this._newYearGiftNode) {
			this._newYearGiftNode = CCDDZPanelNewYear.getInstance()
			this.parent.addChild(this._newYearGiftNode);
		}
	}

	/**
	 * 检查是否添加了邀请活动节点
	 */
	private _checkInviteAct(): void {
		if (!this._inviteActNode) {
			this._inviteActNode = CCDDZPanelInviteAct.getInstance();
			this.parent.addChild(this._inviteActNode);
		}
	}

	/**
	 * 绑定手机号成功
	 */
	private _onBindPhoneOk(): void {
		let _labels = this._labels;
		let _len = _labels.length;
		for (let i = 0; i < _len; ++i) {
			if (_labels[i].id == 4) {
				_labels.splice(i, 1);
				break;
			}
		}

		this._leftLabelsDataProvider.source = _labels;
		this._leftLabelsDataProvider.refresh();
		this._lastSelectIdx = -1;
		this._changeSelectByIdx(0);
	}

    /**
     * 首充礼包的光效
     */
	private _onFRLightLoadOver(event: RES.ResourceEvent): void {
		if (1) return;
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
		if (1) return;
		if (!this._frechargeNode) {
			if (!RES.isGroupLoaded("firstRechargelight")) {
				RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._onFRLightLoadOver, this);
				RES.loadGroup("firstRechargelight");
			} else {
				this._frechargeNode = CCDDZPanelFirstRecharge.getInstance()
				this.parent.addChild(this._frechargeNode);
			}
		}
	}

	/**
	 * 检查是否添加了钻石首充节点
	 */
	private _checkDiaFirecharge(): void {
		if (1) return;
		if (!this._diaFirRechargeNode) {
			if (!RES.isGroupLoaded("firstRechargelight")) {
				RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._onFRLightLoadOver, this);
				RES.loadGroup("firstRechargelight");
			} else {
				this._diaFirRechargeNode = CCDDZPanelDiaFirRecharge.getInstance()
				this.parent.addChild(this._diaFirRechargeNode);
			}
		}
	}

	/**
	 * 检查是否添加了APP福利节点
	 */
	private _checkAppAct(): void {
		if (!this._appNode) {
			this._appNode = CCDDZPanelDownApp.getInstance()
			this.parent.addChild(this._appNode);
		}
	}

	/**
	 * 检查是否添加了代理节点
	 */
	private _checkDelegate(): void {
		if (!this._delegateNode) {
			this._delegateNode = CCDDZPanelDelegate.getInstance();
			this.parent.addChild(this._delegateNode);
		}
	}

	/**
	 * 使能感恩节活动面板是否显示
	 */
	private _enableThanksShow(bShow: boolean): void {
		if (this._thanksgivingNode) {
			this._thanksgivingNode.visible = bShow;
			if (bShow) {
				ccserver.reqThanksBuyCounts();
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
	 * 使能钻石首充面板是否显示
	 */
	private _enableDiaFirrechargeShow(bShow: boolean): void {
		if (this._diaFirRechargeNode) {
			this._diaFirRechargeNode.visible = bShow;
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
	 *  使能绑定手机是否显示
	 */
	private _enableBindPhoneShow(bShow: boolean): void {
		if (this._bindPhoneNode) {
			this._bindPhoneNode.visible = bShow;
			this._bindPhoneNode.showBindAct(this._onBindPhoneOk.bind(this));
		}
	}
	/**
	 * 设置显示邀请活动
	 */
	private _enableInvaiteActShow(bShow: boolean): void {
		if (this._inviteActNode) {
			this._inviteActNode.visible = bShow;
		}
	}

	/**
	 * 设置显示邀请活动
	 */
	private _enableFFFActShow(bShow: boolean): void {
		if (this._fffActNode) {
			this._fffActNode.visible = bShow;
		}
	}

	/**
	 * 设置显示实名
	 */
	private _enableRealNameActShow(bShow: boolean): void {
		if (this._realActNode) {
			this._realActNode.visible = bShow;
		}
	}

	/**
	 * app 免费抽奖
	 */
	private _enableAppLuckyShow(bShow: boolean): void {
		if (this._appLuckyActNode) {
			this._appLuckyActNode.visible = bShow;
		}
	}

	/**
	 *  使能新年礼盒是否显示
	 */
	private _enableNewYearShow(bShow: boolean): void {
		if (this._newYearGiftNode) {
			this._newYearGiftNode.visible = bShow;
		}
	}

	/**
	 * 显示感恩节活动
	 */
	private _showThanksgiving(): void {
		this._checkThanksgiving();
		this._setNotShowThanksRed();
	}

	/**
	 * 显示首充
	 */
	private _showFirstRecharge(): void {
		this._checkFrecharge();
		this._enableShowById(ACT_ID_FIRSTR);
		this._setNotShowFirstRechargeRed();
	}

	/**
	 * 显示钻石首充
	 */
	private _showDiaFirRecharge(): void {
		this._checkDiaFirecharge();
		this._enableShowById(ACT_ID_DIAFIRREC);
		this._setNotShowDiaFirRechargeRed();
	}

	/**
	 * 显示APP福利
	 */
	private _showAPPAct(): void {
		this._checkAppAct();

		this._enableShowById(ACT_ID_APP);
		this._setNotShowDownAppRed();
	}

	/**
	 * 显示代理赚钱
	 */
	private _showDelegate(): void {
		this._checkDelegate();
		this._enableShowById(ACT_ID_DELEGATE);
	}

	/**
	 * 显示每日福袋
	 */
	private _showDayBuy(): void {
		this._checkDayBuy();
	}

	/**
	 * 显示关注公众号
	 */
	private _showWatchWX(): void {
		this._checkWatchWX();
	}

	/**
	 * 显示手机绑定
	 */
	private _showBindPhone(): void {
		this._checkBindPhone();
		this._enableShowById(ACT_ID_BIND);
	}
	/**
	 * 显示连连翻
	 */
	private _showFFF(): void {
		this._checkFFF();
		this._enableShowById(ACT_ID_FFF);
	}

	/**
	 * 显示实名认证
	 */
	private _showRealName(): void {
		this._checkRealName();
		this._enableShowById(ACT_ID_REALNAME);
	}

	/**
	 * 显示app 抽奖
	 */
	private _showAppLucky(): void {
		this._checkAppLucky();
		this._enableShowById(ACT_ID_APPLUCKY);
	}

	/**
	 * 显示新年礼盒
	 */
	private _showNewYearGift(): void {
		this._checkNewYearGift();
		this._newYearGiftNode.showGift();

		CCGlobalUserData.instance.setHasClickNewYearGift();
		this._setNotShowNewYearGiftRed();
	}

	/**
	 * 显示新年开工礼
	 */
	private _showNewYearWork(): void {
		this._checkNewYearGift();
		this._newYearGiftNode.showWork();

		CCGlobalUserData.instance.setHasClickNewYearWork();
		this._setNotShowNewYearWorkRed();
	}

	/**
	 * 显示邀请活动
	 */
	private _showInviteAct(): void {
		this._saveHasClickInviteAct();
		this._setNotRedById(ACT_ID_INVITE);
		this._checkInviteAct();
		this._enableShowById(ACT_ID_INVITE);
	}

	/**
	 * 选中某个标签
	 */
	private _enableShowById(id: number): void {
		let _funcs = this._enableFuncs;
		let _id = 0;
		for (let k in _funcs) {
			_id = Number(k);
			if (_id == id) {
				_funcs[_id](true);
			} else {
				_funcs[_id](false);
			}
		}
	}

	/**
	 * 从场景移除
	 */
	private _onRemovedToStage(): void {
		this._enableEvent(false);
		this.leftLabelList.removeEventListener(egret.Event.CHANGE, this._onSelectItem, this);
		CCalien.CCDDZEventManager.instance.disableOnObject(this);
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
	 *	刷新界面 
	 */
	public refreshActlist(): void {
		this._initUI();
	}

	/**
	 * 设置显示邀请活动
	 */
	public setShowInviteAct(): void {
		this.setShowById(ACT_ID_INVITE);
	}

	/**
	 * 显示某个活动
	 */
	public setShowById(id: number): void {
		let _idx = this._getIdxById(id);
		if (_idx < 0) {
			_idx = 0;
		}
		this._changeSelectByIdx(_idx);

	}

	/**
	 * 设置显示绑定手机福利
	 */
	public setShowBindAct(): void {
		this.setShowById(ACT_ID_BIND);
	}

	/**
	 * 设置显示新年礼盒
	 */
	public setShowNewYearGift(): void {
		let _idx = this._getIdxById(5);
		if (_idx < 0) {
			this._labels.push({ tit: "新年礼盒", sel: false, new: true, id: 5, cb: this._onClickNewYearGift.bind(this) });
			this._leftLabelsDataProvider.source = this._labels;
			this._leftLabelsDataProvider.refresh();
			this.leftLabelList.validateNow();
			_idx = this._labels.length - 1;
		}
		egret.setTimeout(() => {
			this._changeSelectByIdx(_idx);
		}, this, 50);
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

	public setSelectChangeFunc(cb: Function): void {
		this._selectCb = cb;
	}
}
window["CCDDZActList"] = CCDDZActList;