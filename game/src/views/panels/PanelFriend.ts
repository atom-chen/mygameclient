/**
 * Created by zhu on 2017/11/16.
 * 好友
 */

class PanelFriend extends alien.PanelBase {
	public static FRIEND_FLAG_LIST:number = 1;
	public static FRIEND_FLAG_REQ:number = 2;
	public static FRIEND_FLAG_ADD:number = 3;

    private static _instance: PanelFriend;
	private listRadio:eui.RadioButton;
	private reqRadio:eui.RadioButton;
	private addRadio:eui.RadioButton;
	private searchBtn:eui.Button;
	private copyBtn:eui.Button;
	private reqList:eui.List;
	private listList:eui.List;
	private _flagFunc:any;
	private _info:any;
	private _opFunc:any;

	private _reqProvider:eui.ArrayCollection;
	private _listProvider:eui.ArrayCollection;

	constructor() {
		super();
	}
	public static get instance():PanelFriend {
		if (this._instance == undefined) {
			this._instance = new PanelFriend();
		}
		return this._instance;
	}
    init():void {
		this.skinName = panels.PanelFriendSkin;
		this._flagFunc = {
			[PanelFriend.FRIEND_FLAG_LIST]:this._toFriendList.bind(this),
			[PanelFriend.FRIEND_FLAG_REQ]:this._toFriendReq.bind(this),
			[PanelFriend.FRIEND_FLAG_ADD]:this._toFriendAdd.bind(this),
		}

		this._opFunc = {
			[1]:{func:this._onAddFriend.bind(this)},
			[2]:{func:this._onDelFriend.bind(this)},
			[3]:{func:this._onSendGift.bind(this)},
			[4]:{func:this._onAcceptReq.bind(this)},
			[5]:{func:this._onRefuseReq.bind(this)},
			[6]:{func:this._onReqFriends.bind(this)},
			[7]:{func:this._onAddSucc.bind(this)},
			[8]:{func:this._onNewReq.bind(this)},
			[9]:{func:this._onReqPInfo.bind(this)},
		}

		this._reqProvider = new eui.ArrayCollection();
		this._listProvider = new eui.ArrayCollection();
		this.reqList.itemRenderer = FriendReqItemRender;
		this.reqList.dataProvider = this._reqProvider;
		this.listList.itemRenderer = FriendListItemRender;
		this.listList.dataProvider = this._listProvider;
	}
	
	createChildren():void {
        this.percentWidth = 100;
        this.percentHeight = 100;
		super.createChildren();
		this._addClickFunc();
	}

	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
		PanelFriend._instance = null;
	}

	private _setFriendNum(n:number,max:number):void{
		this["infoLabel"].text = "好友数：" + n + "/" + max;
	}

	private _addClickFunc():void{
		let func = "addClickListener";
		this["close_group"][func](this._onClickClose,this);
		this["searchBtn"][func](this._onClickSearch,this);
		this["copyBtn"][func](this._onClickCopy,this);
		this["grpRedcoin"][func](this._onClickExchange,this,false);
	}

	private _onClickExchange():void{
		PanelExchange2.instance.show(4);
	}
	private _onClickSearch():void{
		let sId = this["searchIdInput"].text;
		if(!sId || sId.length < 7){
			let sErr = "用户ID错误";
			if(!sId){
				sErr = "用户ID不能为空";
			}else if(sId.length <7){
				sErr = "用户ID长度至少为7位"
			}
			Toast.show(sErr);
			return;
		}
		if(sId == MainLogic.instance.selfData.fakeuid){
			Toast.show("不能添加自己为好友！");
			return;
		}
		server.reqFriendsOp(sId,9);
	}

	private _onClickCopy():void{
		let sText = this["myIdLabel"].text;
		GameConfig.copyText(this,sText,sText,true);
	}


	private onRadioSelChange(event:egret.Event):void{
		let rbGroup:eui.RadioButtonGroup = event.target;
        let val = rbGroup.selectedValue;
        switch(val){
			case "list":
				this._toFriendList();
				break;
			case "req":
				this._toFriendReq();
				break;
			case "add":
				this._toFriendAdd();
				break;
		}
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
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
		
		this.listRadio.group[_func](egret.Event.CHANGE,this.onRadioSelChange,this)
		this.addRadio.group[_func](egret.Event.CHANGE,this.onRadioSelChange,this)
		this.reqRadio.group[_func](egret.Event.CHANGE,this.onRadioSelChange,this)
		server[_func](EventNames.USER_FriendsOptype_REP,this.onFriendsOptypeRep,this);
		alien.Dispatcher[_func](EventNames.MY_USER_INFO_UPDATE,this.onMyUserInfoUpdate,this);
	}

	private onMyUserInfoUpdate(event: egret.Event = null): void {
        let userInfoData: UserInfoData = event ? event.data.userInfoData : MainLogic.instance.selfData;
        let _nDiamond:any = BagService.instance.getItemCountById(3);
		this["gold"].updateGold(userInfoData.gold);
		this["diamond"].updateGold(_nDiamond);
		this["avatar"].imageId = userInfoData.imageid;
		this["avatar"].setVipLevel(userInfoData.getCurVipLevel());
        if(userInfoData.nickname) {
            let _nameStr = userInfoData.nickname.substr(0,10);
			this["labNickName"].text =  _nameStr + "(" + userInfoData.fakeuid + ")";
         }
		this["lbRedCoin"].text = Utils.exchangeRatio(userInfoData.redcoin/100,true);
    }

	private _onAddFriend(data):void{
		let result = data.result;
		let flist = data.friendlist;
	}

	private _onDelFriend(data):void{
		let result = data.result;
		let params = data.params;
		if(result == null){
			if(params&&params.length >=1){
				let fakeUid = params[0];
				Toast.show("删除好友成功！");
				
				MainLogic.instance.selfData.removeFromFriendList(fakeUid);
				this._updateListUI();
			}
		}else{
			Toast.show("删除好友失败：" + result);
		}
	}

	private _onSendGift(data):void{
		let result = data.result;
		let flist = data.friendlist;
		if(result == null){
		}else{
		}
	}

	private _onAcceptReq(data):void{
		let result = data.result;
		if(result == null){
			if(data.params && data.params.length >= 1){
				MainLogic.instance.selfData.removeFromFriendReq(data.params[0]);
				this._updateReqUI();
				server.reqFriendsInfo();
			}
		}
	}

	private _onRefuseReq(data):void{
		let result = data.result;
		if(result == null){
		}else{

		}
	}

	private _onReqFriends(data):void{
		let result = data.result;
		if(result == null){
			this._updateListUI();
		}
	}

	private _onAddSucc(data):void{
		let result = data.result;
		let flist = data.friendlist;
		if(result == null){
		}
	}

	private _onNewReq(data):void{
		this._showReqRedImg(true);
	}

	private _onReqPInfo(data):void{
		let result = data.result;
		let flist = data.friendlist;
		if(result == null){
			if(flist && flist.length >=1){
				flist[0].winRate = (flist[0].winrate||0);
				flist[0].game = flist[0].playround;
				flist[0].redcoingot = flist[0].redcoingot/100;
				flist[0].base64 = true;
				PanelPlayerInfo.getInstance().show(flist[0]);
			}else{
				Toast.show("用户不存在！");
			}
		}else{
			if(result == 1){
				Toast.show("UID错误，请重新输入！");
			}else{
				Toast.show("查询玩家信息失败：" + result);
			}
		}
	}

	//1添加好友 2 删除好友 3 赠送好友礼物 4 同意 5 拒绝 6 请求好友信息 7 添加好友成功 8 新的好友请求 9 查询玩家信息
	private onFriendsOptypeRep(e:egret.Event):void{
		let data = e.data;
		let optype = data.optype;
		let obj = this._opFunc[optype];
		if(obj){
			obj.func(data);
		}
	}

	private _toFriendList():void{
		this.currentState = "list";
		this.validateProperties();
		this.listRadio.selected = true;
		this._updateListUI();
	}

	private _showEmptyInfo(bShow:boolean):void{
		this["descLabel1"].visible = bShow;
	}
	private _updateListUI():void{	
		let list = MainLogic.instance.selfData.getFriendsList();
		this._listProvider.source = list;
		if(list.length < 1){
			this["descLabel1"].text = "您还没有好友，您可以通过“添加好友”找到您的朋友";
			this._showEmptyInfo(true);
		}else{
			this._showEmptyInfo(false);
		}
		this._updateFriendsNum();
	}

	private _updateFriendsNum():void{
		let list = MainLogic.instance.selfData.getFriendsList();
		let limit = GameConfig.getCfgByField("friends_cfg")
		let max = limit.friendslimt;
		this._setFriendNum(list.length,max);
	}

	private _toFriendReq():void{
		this.currentState = "req";
		this.validateProperties();
		this.reqRadio.selected = true;
		this._updateReqUI();
	}

	private _updateReqUI():void{
		let selfData = MainLogic.instance.selfData;
		let req = selfData.getFriendsReq();
		let len = req.length;
		for(let i=0;i<len;++i){
			req[i].acceptFunc = (fakeuid)=>{
				server.reqFriendsOp(fakeuid,4);
				selfData.removeFromFriendReq(fakeuid);
				this._updateReqUI();
				this._initReqRed();
			}
			req[i].refuseFunc = (fakeuid)=>{
				server.reqFriendsOp(fakeuid,5);
				selfData.removeFromFriendReq(fakeuid);
				this._updateReqUI();
				this._initReqRed();
			}
		}
		this._reqProvider.source = req;
		if(req.length < 1){
			this["descLabel1"].text = "您还没有收到好友申请，您可以通过“添加好友”找到您的朋友";
			this._showEmptyInfo(true);
		}else{
			this._showEmptyInfo(false);
		}
		
		this._updateFriendsNum();
	}

	private _toFriendAdd():void{
		this.currentState = "add";
		this.validateProperties();
		this.addRadio.selected = true;
		this["descLabel1"].text = "通过输入好友的ID可搜索想要申请好友的用户";
	}

	private _setMyId():void{
		this["myIdLabel"].text = MainLogic.instance.selfData.fakeuid;
	}

	private _setStateByFlag(flag):void{
		if(this._flagFunc[flag]){
			this._flagFunc[flag]();
		}
	}

	private _initReqRed():void{
		let showReqRed = false;
        let reqList = MainLogic.instance.selfData.getFriendsReq();
        if(reqList && reqList.length >= 1){
            showReqRed = true;
        }
		this._showReqRedImg(showReqRed);
	}

	private _initUI():void{
		this._setMyId();
		this._initReqRed();
	}

	private _showReqRedImg(bShow:boolean):void{
		this["reqRedImg"].visible = bShow;
	}

	/**
	 * 类型和flag相同
	 */
	public show(type:number = PanelFriend.FRIEND_FLAG_LIST,data):void{
		this._info = data || {};
		this._initUI();
		this._enableEvent(true);
		server.reqFriendsInfo();
		this.popup();
		this.onMyUserInfoUpdate();
		this._setStateByFlag(type);
	}
}

class FriendReqItemRender extends eui.ItemRenderer{
	private avatar:Avatar;
	private sexImg:eui.Image;
	private giftImg:eui.Image;
	private acceptBtn:eui.Image;
	private refuseBtn:eui.Image;
	private nickLabel:eui.Label;

	private addClick():void{
		let func = "addClickListener";
		this.acceptBtn[func](this._onClickAccept,this);
		this.refuseBtn[func](this._onClickRefuse,this);
	}

	private _onClickAccept():void{
		this.data.acceptFunc(this.data.fakeuid);
	}

	private _onClickRefuse():void{
		this.data.refuseFunc(this.data.fakeuid);
	}

	createChildren():void {
        super.createChildren();
		this.addClick();
	}

	dataChanged():void{
		super.dataChanged();
		let data = this.data;
		let nick = Base64.decode(data.nickname);
		nick = nick.substr(0,10);
		this.nickLabel.text = nick;
		this.avatar.imageId = data.imageid;
		let sex = "icon_male"
		if(data.sex == 2){
			sex = "icon_female";
		}
		this.sexImg.source = sex;
		if(data.gifts && data.gifts.length >= 1){
			let oneInfo = data.gifts[0];
			let cfg = GiftManager.instance.getGiftById(oneInfo.id);
			if(cfg){
				this.giftImg.source = cfg.icon;
				this.giftImg.visible = true;
			}
		}else{
			this.giftImg.visible = false;
		}
	}
}

class FriendListItemRender extends eui.ItemRenderer{
	private avatar:Avatar;
	private sexImg:eui.Image;
	private detailBtn:eui.Image;
	private nickLabel:eui.Label;
	private statusLabel:eui.Label;

	createChildren():void {
        super.createChildren();
		this.addClick();
	}
	private addClick():void{
		let func = "addClickListener";
		this.detailBtn[func](this._onClickDetail,this);
	}

	private _onClickDetail():void{
		this.data.base64 = true;
		PanelPlayerInfo.getInstance().show(this.data);
	}

	dataChanged():void{
		super.dataChanged();
		let data = this.data;
		let nick = Base64.decode(data.nickname);
		nick = nick.substr(0,10);
		this.nickLabel.text = nick;
		this.statusLabel.visible = false;
		this.avatar.imageId = data.imageid;
		let sex = "icon_male"
		if(data.sex == 2){
			sex = "icon_female";
		}
		this.sexImg.source = sex;
	}
}