/**
 * Created by zhu on 2018/01/31.
 * 夺宝详情
 */

class CCDDZPanelLotteryDetail extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelLotteryDetail;

	private detailGroup:eui.Group;

	private btn_close:eui.Button;
	
	/**
	 * 详情标签
	 */
	private detailTitLabel:eui.Label;
	/**
	 * 往期幸运儿标签
	 */
	private luckTitLabel:eui.Label;
	/**
	 * 参加组
	 */
	private doGroup:eui.Group;

	/**
	 * 奖励物品
	 */
	private itemImg:eui.Image;
	/**
	 * 点击参加
	 */
	private buyGroup:eui.Group;

	/**
	 * 减
	 */
	private subImg:eui.Image;

	/**
	 * 加
	 */
	private addGroup:eui.Group;

	/**
	 * 参加次数输入
	 */
	private numInput:eui.TextInput;

	/**
	 * 我有夺宝码背景
	 */
	private haveBgImg:eui.Image;

	/**
	 * 我有多少夺宝码
	 */
	private haveLabel:eui.Label;

	/**
	 * 参加需要的总价格
	 */
	private moneyLabel:eui.BitmapLabel;
	/**
	 * 本期得主
	 */
	private thisLuckGroup:eui.Group;
	/**
	 * 标题
	 */
	private titLabel:eui.Label;
	/**
	 * 期数
	 */
	private orderLabel:eui.Label;
	/**
	 * 开奖时间
	 */
	private timeLabel:eui.Label;
	/**
	 * 类型 1:满人 2:定时
	 */
	private typeLabel:eui.Label;

	/**
	 * 本期的所有的参加次数和开奖最低要求次数
	 */
	private doLabel:eui.Label;

	/**
	 * 得奖玩家昵称
	 */
	private luckUserLabel:eui.Label;

	/**
	 * 得奖玩家参加次数
	 */
	luckInfoLabel:eui.Label;

	/**
	 * 开出的幸运码
	 */
	luckCodeLabel:eui.Label;

	/**
	 * 状态背景
	 */
	private statusImg:eui.Image;
	/**
	 * 状态文字
	 */
	private statusLabel:eui.Label;

	/**
	 * 流拍提示文字
	 */
	private failLabel:eui.Label;

	/**
	 * 往期滚动容器
	 */
	private getScroller:eui.Scroller;

	/**
	 * 往期幸运列表
	 */
	private luckList:eui.List;

	/**
	 * 详情的数据
	 */
	private _detailData:any;

	/**
	 * 往期幸运儿列表
	 */
	private _dataProvider:eui.ArrayCollection;

	/** 
	 * 往期数据
	*/
	private _recList:any;

	/**
	 * 所有活动id和期数存储记录
	 */
	private _recIdPhaseList:any;

	/**
	 * 是否正在请求往期列表
	 */
	private _isReqLuckList:boolean;
	/**
	 * 共多少页
	 */
	private _totalPage:number;
	/**
	 * 当前多少页
	 */
	private _curPage:number;

	constructor() {
		super(CCalien.CCDDZpopupEffect.Scale, {
			withFade: true,
			ease: egret.Ease.backOut
		}, CCalien.CCDDZpopupEffect.Scale, {withFade: true, ease: egret.Ease.backIn});
	}

    init():void {
		this.skinName = panels.CCDDZPanelLotteryDetail;
		this._isReqLuckList = false;
		this._recList = [];
		this._recIdPhaseList= {};
		this._curPage = 0;
	}
	
	createChildren():void {
		super.createChildren();
		this._initUI();
		this._enableEvent(true);
	}

	/**
	 * 初始化事件
	 */
	private _initEvent():void{
		this.btn_close["addClickListener"](this._onTouchClose,this);
		this.detailTitLabel["addClickListener"](this._onClickDetail,this,false);
		this.luckTitLabel["addClickListener"](this._onClickLuck,this,false);
		this.buyGroup["addClickListener"](this._onClickJoinLottery,this);
		this.haveBgImg["addClickListener"](this._onClickHaveCode,this,false);
		this.subImg["addClickListener"](this._onAddJoinNum.bind(this,-1),this);
		this.addGroup["addClickListener"](this._onAddJoinNum.bind(this,1),this);
		this.numInput.addEventListener(egret.Event.CHANGE,this._onInputChange,this);
		this._onMyInfoChange();
	}

	/**
	 * 初始化界面
	 */
	private _initUI():void{
		this.luckList.dataProvider = this._dataProvider = new eui.ArrayCollection(this._recList);
		this.luckList.itemRenderer = CCDDZLuckItem;
		this.numInput["textDisplay"].textAlign = "center";
	}

	/**
	 * 根据玩家身上的奖券计算出最合适的数据
	 */
	private _calculateRightNum():string{
		let _redCoin = CCDDZMainLogic.instance.selfData.redcoin / CCGlobalGameConfig.exchangeRatio / 100;
		
		let _price = this._detailData.price.num ||1;
		let _num = _redCoin / _price;
		let _num1 = CCalien.CCDDZUtils.flatToString(_num,0);
		return _num1;
	}

	/**
	 * 单次超出最大值
	 */
	private _isSingleMaxNum(num:number):boolean{
		if(num > CCGlobalGameConfig.lotteryMaxNum){
			return true;
		}
		return false;
	}

	private _showMaxSingleInfo():void{
		CCDDZToast.show("单次最大投入"+CCGlobalGameConfig.lotteryMaxNum);
	}

	/**
	 * 输入内容变化
	 */
	private _onInputChange(e:egret.Event):void{
		let _text = e.target.text;
		let _num:number = parseInt(_text);
		if(isNaN(_num)){
			CCDDZToast.show("最少1次");
			//this.numInput.text  = "1";
			_num = 1;
			return;
		}else if(_num < 1){
			_num = 1;
		}else if(this._isSingleMaxNum(_num)){
			this._showMaxSingleInfo();
			_num = CCGlobalGameConfig.lotteryMaxNum;
		}
		
		let _needMoney = _num * this._detailData.price.num;
		let _isEnough = this._isEnoughRedCoin(_needMoney);
		let _rightNum:any = _num;
		if(!_isEnough){
			_rightNum = this._calculateRightNum();
			if(_rightNum < 1){
				_rightNum = 1;
			}
		}
		this.numInput.text = _rightNum;
		this._initTotMoney();
		console.log("_onInputChange=================>",_rightNum);
	}
	/**
	 * 改变夺宝次数
	 */
	private _onAddJoinNum(num:number):void{
		console.log("_onAddJoinNum=================>",num);
		let _num = parseInt(this.numInput.text);
		_num += num;
		if(_num<1) {
			return;
		}else if(this._isSingleMaxNum(_num)){
			this._showMaxSingleInfo();
			_num = CCGlobalGameConfig.lotteryMaxNum;
		}

		let _price = this._detailData.price.num ;
		let _needMoney = _num * _price;
		let _isEnough = this._isEnoughRedCoin(_needMoney);
		if(_isEnough){
			this.numInput.text = "" + _num;
			this._initTotMoney();
		}
	}

	/**
	 * 点击我有多少个抽奖么
	 */
	private _onClickHaveCode():void{
		CCDDZPanelLotteryCode.getInstance().show(1,this._detailData.code);
	}

	/**
	 * 点击关闭
	 */
	private _onTouchClose():void{
		this.dealAction('close');
	}

	/**
	 * 点击详情
	 */
	private _onClickDetail():void{
		this.currentState = "detail";
		this.detailTitLabel.touchEnabled = false;
		this.luckTitLabel.touchEnabled = true;
	}

	/**
	 * 点击往期幸运儿
	 */
	private _onClickLuck():void{
		this.detailTitLabel.touchEnabled = true;
		this.luckTitLabel.touchEnabled = false;
		this.showHistoryLuck();
	}

	/**
	 * 奖券是否够
	 * needMoney:需要多少奖券
	 */
	private _isEnoughRedCoin(needMoney:number):boolean{
		let _data = CCDDZMainLogic.instance.selfData;
		let _myRed = _data.redcoin / CCGlobalGameConfig.exchangeRatio / 100;
		if(_myRed >= needMoney){
			return true;
		}
		return false;
	}

	/**
	 * 点击参加夺宝
	 */
	private _onClickJoinLottery():void{
		let _price = this._detailData.price.num;
		let _isEnough = this._isEnoughRedCoin(_price);
		if(_isEnough){
			let _num = parseInt(this.numInput.text);
			let _id = this._detailData.id;
			ccserver.reqBuyLotteryById(_id,_num);
		}else{
			CCDDZAlert.show("奖杯不足,前往游戏赢取奖杯",0,function(act){
				if(act == "confirm"){
        			CCalien.CCDDZSceneManager.instance.show(CCGlobalSceneNames.ROOM,{toGold:true});
				}
			});
		}
	}

	private _initTotMoney():void{
		let _nCount = parseInt(this.numInput.text);
		if(this._isSingleMaxNum(_nCount)){
			this._showMaxSingleInfo();
			_nCount = CCGlobalGameConfig.lotteryMaxNum;
		}
		this.moneyLabel.text = "" + CCalien.CCDDZUtils.flatToString(this._detailData.price.num *_nCount,2);
	}

	private _onMyInfoChange():void{
		let _data = CCDDZMainLogic.instance.selfData;
		if(this._detailData){
			let _price = this._detailData.price.num;
			let _isEnough = this._isEnoughRedCoin(_price);
			if(_isEnough ){
				this.numInput.touchEnabled = true;
				this.subImg.touchEnabled = true;
				this.addGroup.touchEnabled = true;
			}else{
				this.numInput.touchEnabled = false;
				this.subImg.touchEnabled = false;
				this.addGroup.touchEnabled = false;
			}
		}
	}

	/**
	 * 使能 事件
	 */
	private _enableEvent(bEnable:boolean):void{
		let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
		 CCalien.CCDDZDispatcher[_func](CCGlobalEventNames.MY_USER_INFO_UPDATE,this._onMyInfoChange,this);
            
		this.getScroller[_func](egret.Event.CHANGE,this._onListScroll,this)
    	this[_func](egret.Event.ADDED_TO_STAGE,this._onAddToStage,this);
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
	}

	private _onAddToStage(e:egret.Event):void{
		this._initEvent();
	}
	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
        CCalien.CCDDZEventManager.instance.disableOnObject(this);
		CCDDZPanelLotteryDetail._instance = null;
	}

	/**
	 * type:1 详情 2:往期幸运儿
	 */
	public show(type:number,_data:any):void{
		this.popup();
		if(type ==1){
			this.showDetail(_data);
		}else if(type==2){
			this.showHistoryLuck();
		}
	}

	/**
	 * 显示详情
	 */
	public showDetail(_data:any):void{
		console.log("showDetail=============>",_data.id,_data.phase,_data.statusCode);
		this.currentState = "detail";
		this._detailData = _data;
		this._isReqLuckList = false;
		this.titLabel.text = _data.title;
		this.typeLabel.text = _data.type == 1? "满人":"定时";
		this.orderLabel.text = "【第" + _data.phase + "期】";
		this.timeLabel.text = CCalien.TimeUtils.timeFormatForEx(new Date(_data.enddate),"-","-","",true) + "开奖"
		this.itemImg.source = CCDDZGoodsItem.parseUrl(_data.reward[0].id);
		this._updateMyCode(_data.code);
		this._updateAllJoinCount();
		this._showThisLuckGroup(false);
		this._showStatusGroup(false);
		this._showFailTip(false);
		this._initTotMoney();
		this._showJoinGroup(true);
		if(_data.statusCode == 10){
			this._showJoinGroup(false);
			this._showStatusGroup(true);
		}else if(_data.statusCode == 1){ //流拍
			this._showFailTip(true);
			this._showJoinGroup(false);
		}else if(_data.statusCode == 0){ //已开奖
			this._showJoinGroup(false);
			this._showThisLuckGroup(true);
			this._updateThisLuckByData(_data.luckData);
		}
	}

	/**
	 * 更新已抢次数
	 */
	private _updateAllJoinCount():void{
		let _d = this._detailData;
		let _str = "已抢<font color='#333333'>"+ _d.poll+"</font>次,至少" +_d.minpoll +"次开奖";
		this.doLabel.textFlow = (new egret.HtmlTextParser).parse(_str);
	}
	/**
	 * 更新我有多少夺宝码和夺宝次数
	 */
	private _updateMyCode(_code:any):void{
		if(_code && _code.length >0){
			let _len = _code.length;
			this.haveLabel.text = "我有" + _len+"个夺宝码>>";
			this._showMyHaveCode(true);
		}else{
			this._showMyHaveCode(false);
		}
	}
    /**
     * 往期幸运儿滚动
     */
    private _onListScroll(e:egret.Event):void{
		let _offset = this.getScroller.viewport.scrollV + this.getScroller.height;
        if( _offset >= this.getScroller.viewport.contentHeight){
			if(this._totalPage > this._curPage){
				this._reqLuckHistory(this._curPage +1);
			}
        }
    }

	/**
	 * 添加往期幸运儿数据
	 */
	private _addLuckItem(_one:any):void{
		let _id = _one.id;
		let _phase = _one.phase;
		this._recIdPhaseList[_id] = this._recIdPhaseList[_id] ||{};
		let _list = this._recList;
		let _len = _list.length;
		let _idx = 0;
		if(!this._recIdPhaseList[_id][_phase]){
			_idx = _len;
			this._recIdPhaseList[_id][_phase] = {idx:_idx};
			_list.push(_one);
		}else{
			_idx = this._recIdPhaseList[_id][_phase].idx;
			if(_len< _idx+1) return;
			_list[_idx] = _one;
		}
	}

	private _reqLuckHistory(page:number =0):void{
		if(this._isReqLuckList) return;
		this._isReqLuckList = true;
		ccddzwebService.getLotteryLuckHistory(page,this._detailData.id,(response)=>{
			this._isReqLuckList = false;
			if(response.code == 0 ){
				let _data = response.data;
				let _items = _data.items;
				let _len = _items.length;
				if(_len < 1) return;

				this._curPage = _data.page;
				this._totalPage = _data.total_pages;
				for(let i=0;i<_len;++i){
					_items[i].id = _items[i].lotteryid;
					this._addLuckItem(_items[i]);
				}
				this._updateLuckHistory();
			}
		})
	}

	private _updateLuckHistory():void{
		this.getScroller.stopAnimation();
		this._dataProvider.source = this._recList;
		this._dataProvider.refresh();
	}

	/**
	 * 显示往期幸运儿
	 */
	public showHistoryLuck():void{
		this.currentState = "luck";
		this._reqLuckHistory();
	}

	/**
	 * 获取夺宝详情
	 */
    public static getInstance(): CCDDZPanelLotteryDetail {
        if(!CCDDZPanelLotteryDetail._instance) {
            CCDDZPanelLotteryDetail._instance = new CCDDZPanelLotteryDetail();
        }
        return CCDDZPanelLotteryDetail._instance;
    }

	/**
	 * 移除夺宝详情
	 */
	public static remove():void{
		if(CCDDZPanelLotteryDetail._instance){
			CCDDZPanelLotteryDetail._instance.close();
		}
	}

	/**
	 * 显示状态
	 */
	private _showStatusGroup(_bShow:boolean):void{
		this.statusImg.visible = _bShow;
		this.statusLabel.visible = _bShow;
	}

	/**
	 * 显示流拍提示
	 */
	private _showFailTip(_bShow:boolean):void{
		this.failLabel.visible = _bShow;
	}

	/**
	 * 显示参加
	 */
	private _showJoinGroup(_bShow:boolean):void{
		this.doGroup.visible = _bShow;
		this.numInput["textDisplay"].visible = _bShow;
	}

	/**
	 * 显示我的夺宝码
	 */
	private _showMyHaveCode(_bShow:boolean):void{
		this.haveBgImg.visible = _bShow;
		this.haveLabel.visible = _bShow;
	}

	/**
	 * 显示本期得主
	 */
	private _showThisLuckGroup(_bShow:boolean):void{
		this.thisLuckGroup.visible = _bShow;
	}

	/**
	 * 更新本期得主
	 */
	private _updateThisLuck(_data:any):void{
		this.luckUserLabel.text = _data.nickname;
		this.luckInfoLabel.textFlow = (new egret.HtmlTextParser).parse("参加<font color='#BA2E2E'>"+ _data.count+"</font>次");
		this.luckCodeLabel.text = "幸运码:" + _data.winningcode;
	}

	/**
	 * 本期得主
	 */
	private _updateThisLuckByData(data:any):void{
		let _data = data;
		if(!_data.nickname || !_data.count || !_data.winningcode) {
			console.log("_updateThisLuckByData==========>",data);
			return;
		}
		this._updateThisLuck(data);
		this._showThisLuckGroup(true);
	}
	/**
	 * 当界面存在则更新详情
	 * type:1 等待开奖  2:流拍  3:已开奖 4:更新已有的夺宝码  5:更新数据,仅在可参加阶段
	 */
	public static updateDetail(type:number,data:any):void{
		let _ins =  CCDDZPanelLotteryDetail._instance;
		if(_ins){
			if(!_ins._detailData || data.id != _ins._detailData.id || _ins.currentState != "detail") return;
			console.log("updateDetail==1====>",type,data.id,data.phase,data.statusCode);
			_ins._showFailTip(false);
			_ins._showThisLuckGroup(false);
			if(type == 1){
				_ins._showJoinGroup(false);
				_ins._showStatusGroup(true);
			}else if(type == 2){
				_ins._showStatusGroup(false);
				_ins._showJoinGroup(false);
				_ins._showFailTip(true);
			}
			else if(type == 3){
				_ins._showStatusGroup(false);
				_ins._detailData.statusCode = 0;
				_ins._showJoinGroup(false);
				_ins._updateThisLuckByData(data);
			}else if(type == 4){
				_ins._detailData.poll = data.poll;
				_ins._detailData.code = data.code;
				_ins._updateAllJoinCount();
				_ins._updateMyCode(data.code);
			}else if(type ==5){
				if(_ins._detailData.statusCode == -1){
					_ins.showDetail(data);
				}
			}
		}
	}
}

/**
 * 往期幸运儿
 */
class CCDDZLuckItem extends eui.ItemRenderer {
	/**
	 * 开奖时间
	 */
	private timeLabel:eui.Label;
	/**
	 * 开奖期数
	 */
	private orderLabel:eui.Label;
	/**
	 * 开奖码
	 */
	private luckCodeLabel:eui.Label;
	/**
	 * 中奖者参加次数
	 */
	private numLabel:eui.Label;
	/**
	 * 中奖者昵称
	 */
	private userLabel:eui.Label;

	createChildren():void {
		super.createChildren();
	}

    protected dataChanged(): void {
        super.dataChanged();
		let _d = this.data;
		this.orderLabel.text = "第" + _d.phase + "期";
		this.timeLabel.textFlow = (new egret.HtmlTextParser).parse("<font color='#333333'>"+ _d.enddate + "结束</font>");
		this.userLabel.text = _d.nickname;
		this.numLabel.textFlow  = (new egret.HtmlTextParser).parse("参加<font color='#BA2E2E'>"+_d.poll + "</font>次") ;
		this.luckCodeLabel.text = "幸运码:" + _d.winningcode;
	}
}