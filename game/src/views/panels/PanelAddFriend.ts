/**
 * Created by zhu on 2017/11/16.
 * 添加好友
 */

class PanelAddFriend extends alien.PanelBase {
	public static FADD_FLAG_ADD:string = "add";
	public static FADD_FLAG_GIFT:string = "gift";
	public static FADD_FLAG_RED:string = "red";
	
    private static _instance: PanelAddFriend;
	private itemList:eui.List;
	private _stateFunc:any;
	private _lastSelIdx:number;
	private _info:any;

	private _dataProvider:eui.ArrayCollection;

	constructor() {
		super(alien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, alien.popupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});
	}
	public static get instance():PanelAddFriend {
		if (this._instance == undefined) {
			this._instance = new PanelAddFriend();
		}
		return this._instance;
	}
    init():void {
		this.skinName = panels.PanelAddFriendSkin;
		this._stateFunc = {
			[PanelAddFriend.FADD_FLAG_ADD]:this._toAddFriend.bind(this),
			[PanelAddFriend.FADD_FLAG_GIFT]:this._toSendGift.bind(this),
			[PanelAddFriend.FADD_FLAG_RED]:this._toSendRed.bind(this),
		}
		this._dataProvider = new eui.ArrayCollection();
		this.itemList.itemRenderer = FADDItemRender;
		this.itemList.dataProvider = this._dataProvider;
	}
	
	createChildren():void {
		super.createChildren();
		this._enableEvent(true);
		this._addClickFunc();
	}
	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
		PanelAddFriend._instance = null;
	}

	private _addClickFunc():void{
		let func = "addClickListener";
		this["btnClose"][func](this._onClickClose,this);
		this["sureBtn"][func](this._onClickSure,this);
	}

	private _onClickSure():void{
		let op;
		let giftCfg = this._dataProvider.source[this._lastSelIdx];
		giftCfg.count = giftCfg.gold;
		if(this.currentState == PanelAddFriend.FADD_FLAG_ADD){
			op = 1
			giftCfg.count = 1;
			if(server.playing){
				Toast.show("游戏中不能添加好友！");
				return;
			}
		}else if(this.currentState == PanelAddFriend.FADD_FLAG_GIFT || this.currentState == PanelAddFriend.FADD_FLAG_RED){
			op = 3;
			if(this.currentState == PanelAddFriend.FADD_FLAG_GIFT){
				giftCfg.count = 1;
			}
			if(server.playing){
				Toast.show("游戏中不能给好友发红包或者是送礼物！");
				return;
			}
		}
		let gifts = [{id:giftCfg.id,count:giftCfg.count}];
		server.reqFriendsOp(this._info.fakeuid,op,gifts);
		this.close();
	}

	private _onClickClose():void{
		this.close();
	}

	/**
	 * 使能 事件
	 */
	private _enableEvent(bEnable:boolean):void{
		let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
		
		alien.Dispatcher[_func](EventNames.FRIEND_SEND_CHAGNE,this._onSendNumChange,this);
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
		this["itemList"][_func](egret.Event.CHANGE, this._onSelectItem, this);
	}

	/**
	 * 发送礼物的次数变化
	 */
	private _onSendNumChange():void{
		let num = MainLogic.instance.selfData.getHasSendNum();
		this._updateLeftSendNum();
	}

	private _onSelectItem():void{
		let idx = this["itemList"].selectedIndex;
		let data = this._dataProvider.source;
		let len = data.length;
		if(idx >=0 && idx < len){
			if(this._lastSelIdx >=0 && this._lastSelIdx < len){
				data[this._lastSelIdx].sel = false;
				this._dataProvider.itemUpdated(data[this._lastSelIdx]);
			}
			data[idx].sel = true;
			this._dataProvider.itemUpdated(data[idx]);
			this._lastSelIdx = idx;
		}
		egret.callLater(()=>{
			this["itemList"].selectedIndex = -1;
		}, this);
	}

	private _initByGift():void{
		let cfg = GiftManager.instance.getAllGifts();
		let len = cfg.length;
		for(let i=0;i<len;++i){
			cfg[i].sel = false;
			cfg[i].state = "gold";
			cfg[i].spre = "魅力+";
		}
		cfg[0].sel = true;
		this._dataProvider.source = cfg;
		this._lastSelIdx = 0;
	}

	private _toAddFriend():void{
		this.currentState = PanelAddFriend.FADD_FLAG_ADD;
		this.validateProperties();
		this._initByGift();
	}

	private _toSendGift():void{
		this.currentState = PanelAddFriend.FADD_FLAG_GIFT;
		this.validateProperties();
		this._initByGift();
	}

	private _initByRed():void{
		let cfg = GameConfig.getCfgByField("custom.friendRed");
		let len = cfg.length;
		for(let i=0;i<len;++i){
			cfg[i].icon = "room_0";
			cfg[i].spre= "";
			cfg[i].state = "nogold";
			cfg[i].gold = cfg[i].count;
			cfg[i].sel = false;
		}
		cfg[0].sel = true;
		this._dataProvider.source = cfg;
		this._lastSelIdx = 0;
	}

	private _toSendRed():void{
		this.currentState = PanelAddFriend.FADD_FLAG_RED;
		this.validateProperties();
		this._initByRed();
		this._updateLeftSendNum();
	}

	private _updateLeftSendNum():void{
		let leftNum = MainLogic.instance.selfData.getLeftSendNum();
		this._setSendRedLeftNum(leftNum);
	}

	private _setStateByFlag(flag):void{
		if(this._stateFunc[flag]){
			this._stateFunc[flag]();
		}
	}

	private _initUI():void{
	}

	private _setSendRedLeftNum(num):void{
		this["descLabel1"].text = "升级VIP可增加送金豆次数，当前剩" + num + "次"
	}

	/**
	 * 类型和flag相同
	 */
	public show(type:string = PanelAddFriend.FADD_FLAG_ADD,data):void{
		this._info = data;
		this._initUI();
		this._setStateByFlag(type);
		this.popup();
	}
}

class FADDItemRender extends eui.ItemRenderer{
	private selBgImg:eui.Image;
	private itemImg:eui.Image;
	private charmLabel:eui.Label;
	private selImg:eui.Image;
	private goldBgImg:eui.Image;
	private goldImg:eui.Image;
	private goldLabel:eui.Label;

	dataChanged():void{
		super.dataChanged();
		let data = this.data;
		this.currentState = data.state;
		this.validateProperties();
		this.selBgImg.visible = data.sel;
		this.itemImg.source = data.icon;
		this.selImg.visible = data.sel;
		if(data.state == "nogold"){
			this.charmLabel.text = data.gold;
		}else{
			this.goldLabel.text = data.gold;
			this.charmLabel.text = data.spre +data.charm;
		}
	}
}