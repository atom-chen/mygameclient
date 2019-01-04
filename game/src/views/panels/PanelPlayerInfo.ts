/**
 * Created by zhu on 17/08/23.
 * 玩家信息面板
 */

class PanelPlayerInfo extends alien.PanelBase {
	private avatar:Avatar; 
	private nick_label:eui.Label;//昵称
	private gold_label:eui.Label;//金豆
	private games_label:eui.Label;//对局
	private winRate_label:eui.Label;//胜率
	private redbeg_label:eui.Label;//红包数量
	private brow1_btn:eui.Button;//表情1
	private brow2_btn:eui.Button;//表情2
	private brow3_btn:eui.Button;//表情3
	private brow4_btn:eui.Button;//表情4
	private brow5_btn:eui.Button; //表情5
	private report_btn:eui.Button; //举报
	private close_btn:eui.Button;//关闭按钮

    private static _instance: PanelPlayerInfo;
	private _data:any;
	protected _uid:number;//玩家的uid
	protected _seatId:number; //玩家的座位id
	private _browData:BrowData;//表情数据
	
	private brow1Gold_img:eui.Image;  //金豆
	private brow1Price_img:eui.Image; //价格
	private brow1Free_img:eui.Image;  //免费

	private brow2Gold_img:eui.Image; //金豆
	private brow2Price_img:eui.Image;//价格
	private brow2Free_img:eui.Image; //免费

	private brow3Gold_img:eui.Image; //金豆
	private brow3Price_img:eui.Image;//价格 
	private brow3Free_img:eui.Image; //免费

	private brow4Gold_img:eui.Image; //金豆
	private brow4Price_img:eui.Image;//价格
	private brow4Free_img:eui.Image; //免费

	private brow5Gold_img:eui.Image; //金豆
	private brow5Price_img:eui.Image;//价格 
	private brow5Free_img:eui.Image; //免费

	private mFLeft_label:eui.Label; //剩余免费次数
	private browAndReport_group:eui.Group;//表情，举报，免费剩余此次

	private coolImg:eui.Image; //赞
	private shitImg:eui.Image;//踩
	
	private _provider:eui.ArrayCollection;
	private itemList:eui.List;

     init():void {
		this.skinName = panels.PanelPlayerInfo;
	}

	constructor() {
		super(alien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, alien.popupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});
		this._cleanData();
		this._browData = new BrowData();
		this._provider = new eui.ArrayCollection();
		this.itemList.dataProvider = this._provider;
		this.itemList.itemRenderer = PInfoItemRender;
	}

	createChildren():void {
		super.createChildren();
		this._initTouchEvent();
		this._initDefault();
	}
	
	/**
	 * 清除数据
	 */
	_cleanData():void{
		this._browData = null;
		PanelPlayerInfo._instance = null;
	}
	/**
	 * 事件使能
	 */
	private _enableEvent(bEnable:boolean):void{
		let _func = "addEventListener";
		if(bEnable == false){
			_func = "removeEventListener";
		}
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
		this.brow1_btn[_func](egret.TouchEvent.TOUCH_TAP, this._onTouchBrow1Btn, this);
		this.brow2_btn[_func](egret.TouchEvent.TOUCH_TAP, this._onTouchBrow2Btn, this);
		this.brow3_btn[_func](egret.TouchEvent.TOUCH_TAP, this._onTouchBrow3Btn, this);
		this.brow4_btn[_func](egret.TouchEvent.TOUCH_TAP, this._onTouchBrow4Btn, this);
		this.brow5_btn[_func](egret.TouchEvent.TOUCH_TAP, this._onTouchBrow5Btn, this);
		this.coolImg[_func](egret.TouchEvent.TOUCH_TAP, this._onTouchCool, this);
		this.shitImg[_func](egret.TouchEvent.TOUCH_TAP, this._onTouchShit, this);
	}

	private _addClick():void{
		let func = "addClickListener";
		this["modifyBtn"][func](this._onClickModify,this);
		this["close_btn"][func](this._onTouchCloseBtn,this);
		this["report_btn"][func](this._onTouchReportBtn,this);
		this["sendGiftBtn"][func](this._onClickSendGift,this);
		this["sendRedBtn"][func](this._onClickSendRed,this);
		this["addBtn"][func](this._onClickAdd,this);
		this["delBtn"][func](this._onClickDel,this);
	}

	private _onClickModify():void{
		this.close();
		PanelModifyInfo.instance.show();
	}

	private _onClickSendGift():void{
		PanelAddFriend.instance.show(PanelAddFriend.FADD_FLAG_GIFT,this._data);
	}

	private _onClickSendRed():void{
		PanelAddFriend.instance.show(PanelAddFriend.FADD_FLAG_RED,this._data);
	}

	private _onClickAdd():void{
		PanelAddFriend.instance.show(PanelAddFriend.FADD_FLAG_ADD,this._data);
	}

	private _onClickDel():void{
		Alert.show("确定删除好友？",0,(act)=>{
			if(act == "confirm"){
				server.reqFriendsOp(this._data.fakeuid,2);
			}
		});
	}

	//事件初始化
	private _initTouchEvent():void{	
		this._enableEvent(true);
	}

	private _showReport(bShow:boolean):void{
		this.report_btn.visible = bShow;
	}

	private _showSendGift(bShow:boolean):void{
		this["sendGiftBtn"].visible = bShow;
	}
	
	private _showSendRed(bShow:boolean):void{
		this["sendRedBtn"].visible = bShow;
	}
	
	private _showDelete(bShow:boolean):void{
		this["delBtn"].visible = bShow;
	}
	
	private _showAdd(bShow:boolean):void{
		this["addBtn"].visible = bShow;
	}
	
	private _showModify(bShow:boolean):void{
		this["modifyBtn"].visible = bShow;
	}

	/**
	 * 初始化免费表情次数
	 */
	private _initFreeBrow():void{
		let _nFree:number = MainLogic.instance.selfData.getFreeBrowCount();
		let _bFree = false;
		if(_nFree>0){
			_bFree = true;
		}

		let _n = 0;
		for(let i=0;i<5;++i){
			_n = i+1;
			this["brow" + _n + "Gold_img"].visible = !_bFree;
			this["brow" + _n + "Price_img"].visible = !_bFree;
			this["brow" + _n + "Free_img"].visible = _bFree;
		}
		this.mFLeft_label.visible = _bFree;
		this.mFLeft_label.text = "剩余免费次数:" + _nFree;
	}
	
	/**
	 * 点击赞
	 */
	private _onTouchCool():void{
		server.reqPlayerPraise(this._seatId,1)
	}

	/**
	 * 点击踩
	 */
	private _onTouchShit():void{
		server.reqPlayerPraise(this._seatId,0)
	}

	/**
	 * 初始化默认
	 */
	private _initDefault():void{
		this._initFreeBrow();
	}

	/**
	 *  设置昵称 长度五个中文字符,10个英文字符
	 */
	private _setNick(sNick:string,base64:boolean):void{
		let s = sNick;
		if(base64){
			s = Base64.decode(sNick);
		}
		this.nick_label.text = s.substr(0,10);
	}

	/**
	 * 设置对局
	 */
	private _setGames(nGames:number):void{
		this.games_label.text = "" + (nGames||0);
	}

   /**
	* 设置金豆 大于10万则以万为单位
    */
	private _setGold(nGold:number):void{
		let _str = Utils.getFormatGold(nGold);
		this.gold_label.text = _str;
	}
	/**
	 * 设置胜率 xx%
	 */
	private _setWinRate(sRate:string):void{
		this.winRate_label.text = sRate + "%";
	}

	/**
	 * 设置玩家头像
	 */
	private _setHeadImg(url:string):void{
		let _url = url;
		if(url) {
			if(url.indexOf("http://") != -1){
				_url = url.replace("http://","https://");
			}
		}
		this.avatar.imageId = _url;
	}

	/**
	 * 设置红包 保留一位小数
	 */
	private _setRedBeg(fNum:Number):void{
		fNum = fNum || 0;
		this.redbeg_label.text = fNum.toFixed(1).toString();
	}

	/**
	 * 点击发送表情
	 */
	private _onBuyBrow(nId:number):void{
		if(this._uid == server.uid) return;
		
		this.dealAction();
		let _costGold = this._browData.getBrowCostGold(nId);
		if(!_costGold) return;

		let _nFree = MainLogic.instance.selfData.getFreeBrowCount();
		let _selfGold = MainLogic.instance.selfData.getGold() || 0;
		//没有免费次数，并且金豆不足
		if((_nFree < 0) && (_costGold > _selfGold)){
			return ImgToast.instance.show(this,lang.browNoGold);
		}

		if(this._browData.checkCanBuyByBrowId(nId)){
			this._browData.startCDByBrowId(nId);
			server.send(EventNames.GAME_OPERATE_REQ, {optype:5,params:[this._seatId,nId]});
		}
	}

	/**
	 * 点击表情1 id:1
	 */
	private _onTouchBrow1Btn():void{
		let _id = BrowData.BrowID.BROW_666;
		this._onBuyBrow(_id);
	}
	/**
	 * 点击表情2
	 */
	private _onTouchBrow2Btn():void{
		let _id = BrowData.BrowID.BROW_TORTISE;
		this._onBuyBrow(_id);
	}
	/**
	 * 点击表情3
	 */
	private _onTouchBrow3Btn():void{
		let _id = BrowData.BrowID.BROW_TOMATO;
		this._onBuyBrow(_id);
	}
	/**
	 * 点击表情4
	 */
	private _onTouchBrow4Btn():void{
		let _id = BrowData.BrowID.BROW_LOVE;
		this._onBuyBrow(_id);
	}
	/**
	 * 点击表情5
	 */
	private _onTouchBrow5Btn():void{
		let _id = BrowData.BrowID.BROW_GOOD;
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
	private _onReportRet(response:any):void{
		if(response){
			if(response.code == 0){
				ImgToast.instance.show(this,lang.reportSucc);
			}
			else if(response.code == 30001){
				ImgToast.instance.show(this,lang.repeatReport);
			}
		}
	}

	/**
	 * 点击举报 不可以举报自己
	 */
	private _onTouchReportBtn():void{
		if(this._uid == server.uid) return;

		let _token = UserData.instance.getToken();
		let _uid = server.uid;
		let _type = 1;
		let _roomId = server.getRoomId();
		let _tableId = server.getTableId();
		let _toUid = this._uid;
		let _content = null;
		webService.reportUser(_token,_uid,_type,_roomId,_tableId,_toUid,this._onReportRet.bind(this));
	}

	/**
	 * 显示表情，举报和免费表情次数
	 */
	private _showBrowAndReport(bShow:boolean):void{
		this.browAndReport_group.visible = bShow;
	}
	/**
	 * 点击关闭按钮
	 */
	private _onTouchCloseBtn():void{
		this.dealAction();
	}

	/**
	 * 格式化点赞或者是踩
	 */
	private _formatPraiseNum(n:number):string{
		let _s = "" + n;
		if(n>100000){
			let _s1 = _s.substr(0,_s.length -3);
			let _l = _s1.length;
			let _s2 = _s1.substr(_l - 1);
			_s = _s1.substr(0,_l - 1) + "." + _s2 + "万";
		}
		return _s;
	}

	/**
	 * 初始化赞还是踩
	 */
	private _initPraise(_data:any):void{
		if(_data){
			if(_data.length >= 1){
				this["coolLabel"].text = this._formatPraiseNum(_data[0]);
				if(_data.length >= 2){
					this["shitLabel"].text =  this._formatPraiseNum(_data[1]);
					let _seatIds = _data.slice(2) || [];
					let _l = _seatIds.length;
					for(let i=0;i<_l;++i){
						if( (i+1)== this._seatId && this._uid != server.uid ){
							if(_seatIds[i] == 1){
								this.coolImg.source = "pinfo_a";
								this.shitImg.source = "pinfo_b";
								this.coolImg.touchEnabled = false;
								this.shitImg.touchEnabled = false;
							}else if(_seatIds[i] == 0){
								this.coolImg.source = "pinfo_b";
								this.shitImg.source = "pinfo_a";
								this.coolImg.touchEnabled = false;
								this.shitImg.touchEnabled = false;
							}else{
								this.coolImg.source = "pinfo_b";
								this.shitImg.source = "pinfo_b";
								this.coolImg.touchEnabled = true;
								this.shitImg.touchEnabled = true;
							}
						}
					}
				}
			}
		}
	}

	/**
	 * 游戏中对玩家赞后者是踩
	 */
	private _chagePraise(op:number):void{
		let _label:eui.Label = this["shitLabel"];
		let _img:eui.Image = this.shitImg;
		if(op ==1){
			_label = this["coolLabel"];
			_img  = this.coolImg;
		}
		let _num = Number(_label.text);
		_num += 1;
		_label.text = "" + _num;
		_img.source = "pinfo_a";
		this.coolImg.touchEnabled = false;
		this.shitImg.touchEnabled = false;
	}

	private _setSex(nIdx:number):void{
		let src = "icon_male";
		if(nIdx == 2){
			src = "icon_female";
		}
		this["sexImg"].source = src;
	}

	private _hideOpBtns():void{
		this._showModify(false);
		this._showAdd(false);
		this._showDelete(false);
		this._showSendGift(false);
		this._showSendRed(false);
	}

	private _initByUid():void{
		let fakeuid = this._data.fakeuid;
		let self = MainLogic.instance.selfData;
		if(this._uid == self.uid){
			if(!this._data.isPlaying){
				this._showModify(true);
			}
		}else if(!this._data.isPlaying){
			let _myData = MainLogic.instance.selfData;
			if(_myData.isMyFriend(fakeuid)){
				this._showDelete(true);
				this._showSendGift(true);
				let sendCfg = GameConfig.getCfgByField("webCfg.friendRed");
				if(sendCfg && sendCfg.status == 1){
					this._showSendRed(true);
				}
			}else{
				this._showAdd(true);
			}
		}
		this._initByGift();
		webService.getWalletAddress(this._uid,(res)=>{
			if(res.wallet && res.wallet.address){
				this._setChain(res.wallet.address);
			}
		})
	}

	private _initByGift():void{
		let cfg = GiftManager.instance.getAllGifts();
		let gifts = this._data.gifts;
		let hasGiftsMap = {};
		let hasLen =  gifts.length;
		let charm = 0;
		for(let i=0;i<hasLen;++i){
			if(this._uid == server.uid){
				hasGiftsMap[gifts[i].id] = BagService.instance.getItemCountById(gifts[i].id);
			}else{
				hasGiftsMap[gifts[i].id] = gifts[i].count;
			}
		}
		
		let oneId;
		let oneInfo;
		let cfgLen = cfg.length;
		for(let i=0;i<cfgLen;++i){
			oneInfo = cfg[i];
			oneId = oneInfo.id;
			cfg[i].num = 0;
			if(hasGiftsMap[oneId]){
				charm += cfg[i].charm;
				cfg[i].num = hasGiftsMap[oneId];
			}
		}
		this._provider.source = cfg;
		this._setCharm(charm);
	}


	public _setCharm(number):void{
		this["charm_label"].text = "" + (number || 0);
	}

	public _setSign(sCtx):void{
		this["sign_label"].text = (sCtx || "玩家太懒，还没有个性签名~");
	}

	public _setChain(sCtx):void{
		this["chain_label"].text = (sCtx || "");
	}
	
	public _setId(id):void{
		this["id_label"].text = id;
	}

	/**
	 * 显示玩家信息
	 */
	public show(_data): void {
		this._data = _data;
		this._uid    = _data.uid;
		this._seatId = _data.seatId;
		this.popup();
		this._hideOpBtns();
		this["bg_img"].source = (_data.bgImg||"common_alert_bg");
		if(_data.uid == server.uid){
			let cfg = GiftManager.instance.getAllGifts();
			let len = cfg.length;
			for(let i=0;i<len;++i){
				let num = BagService.instance.getItemCountById(cfg[i].id);
				cfg[i].count = (num || 0);
			}
			_data.gifts = cfg;
			this._showReport(false);
		}
		this._setId(_data.fakeuid);
		this._setNick(_data.nickname,_data.base64);
		this._setGold(_data.gold);
		this._setGames(_data.game);
		this._setWinRate(_data.winRate);
		this._setRedBeg(_data.redcoingot);
		this._setHeadImg(_data.imageid);
		this._initPraise(_data.praise);
		this._setSign(_data.whatsup);
		this._setChain(_data.chain);
		this._setSex(_data.sex);
		this._addClick();
		if(_data.isMatch){
			if(this._uid != server.uid){
				this._hidePlayerInfo();
			}else{
				this._initByUid();
				this.avatar.setVipLevel(_data._vipLevel);
			}
		}else{
			this._initByUid();
			this.avatar.setVipLevel(_data._vipLevel);
		}
		if(this._uid == server.uid){
			this.coolImg.touchEnabled = false;
			this.shitImg.touchEnabled = false;
		}
	}

	/**
	 * 比赛中要赢藏玩家的信息
	 */
	private _hidePlayerInfo():void{
		this.nick_label.text = "***";
		this.gold_label.text = "***";
		this.games_label.text = "***";
		this.winRate_label.text = "***";
		this.redbeg_label.text ="***";
		this._setChain("***");
		this._setSign("***");
		this._setCharm("***");
		this._setId("***");
	}

	/**
	 * 移除监听
	 */
	public _onRemovedToStage():void{
		this._enableEvent(false);
		this._cleanData();
	}

	public static getInstance(): PanelPlayerInfo {
        if(!PanelPlayerInfo._instance) {
            PanelPlayerInfo._instance = new PanelPlayerInfo();
        }
        return PanelPlayerInfo._instance;
    }

	/**
	 * 赞还是踩
	 */
	public static onPraise(seatId:number,op:number){
		let _instance = PanelPlayerInfo._instance;
		if(_instance){
			if(_instance._seatId == seatId){
				_instance._chagePraise(op);
			}
		}
	}

	/**
	 * 玩家离开房间
	 */
	public static onPlayerLeave(nSeatId:number):void{
		let _instance = PanelPlayerInfo._instance;
		if(_instance){
			if(_instance._seatId == nSeatId){
				_instance.close();
			}
		}
	}

	/**
	 * 一局游戏结束，需要移除
	 */
	public static remove():void{
		if(PanelPlayerInfo._instance){
			PanelPlayerInfo._instance.close();
		}
	}
}


class PInfoItemRender extends eui.ItemRenderer{
	private numLabel:eui.Label;
	private itemImg:eui.Image;

	dataChanged():void{
		super.dataChanged();
		let data = this.data;

		this.itemImg.source = data.icon;
		this.numLabel.text = data.num;
	}
}