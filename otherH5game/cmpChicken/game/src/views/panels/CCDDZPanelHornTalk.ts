/**
 * Created by zhu on 2017/09/19.
 * 喇叭聊天面板
 */

class CCDDZPanelHornTalk extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelHornTalk;

	private _dataProvider:eui.ArrayCollection;
	private _dataArr:Array<any>;

	/**
	 * 喇叭输入
	 */
	private talk_editText:eui.EditableText;
	/**
	 * 单条消息的数据
	 */
	private _itemData:CCDDZHornTalkItem;
	/**
	 * 消息记录的滚动列表
	 */
	private talkRec_list:eui.List; 

	/**
	 * 关闭按钮
	 */
	private close_img:eui.Image;

	/**
	 * 输入按钮
	 */
	private sendMsg_img:eui.Image;

	/**
	 * 喇叭记录的滚动容器
	 */
	private horn_scroller:eui.Scroller;

	/**
	 * 默认冷却时间
	 */
	private _nDefaultCoolTime:number;

	/**
	 * 当前的冷却时间
	 */
	private _nCurCoolTime:number;

	/**
	 * setInterval 重复的id
	 */
	private _nIntervalRepeatId:number;

	/**
	 * 已经发送了喇叭消息
	 */
	private _hasSendMsg:boolean;

	/**
	 * 金豆消耗
	 */
	 private costGold_label:eui.Label;

	 /**
	 * 金豆消耗的数量
	 */
	 private _costNum:number;
	constructor() {
		super(CCalien.CCDDZpopupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, CCalien.CCDDZpopupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});

	}

    init():void {
		this.skinName = panels.CCDDZPanelHornTalk;
	}

	/**
	*  设置发送喇叭的钻石消耗
	*/
	private _setChatCost():void{
		let cfg = CCGlobalGameConfig.getChatCostInfoByType(2);
		let nCost = 0;
		if(cfg && cfg.id ==3){
			nCost = cfg.cost;
		}
		this._costNum = nCost
		this.costGold_label.text = "" + nCost;
	}

    /**
     * 点击发送喇叭消息
     */
    private _onClickSendMsg():void{
		let _selfData = CCDDZMainLogic.instance.selfData;
		let _nDiamond = CCDDZBagService.instance.getItemCountById(3);
		if(this._hasSendMsg){
			CCDDZToast.show("消息发送中");
		}
		else if(this._nCurCoolTime > -1){
			CCDDZToast.show("发送消息过于频繁");
		}
		else if(_nDiamond< this._costNum ){
			CCDDZToast.show("钻石不足");
		}
		else if(this.talk_editText.text && this.talk_editText.text.length >= 1){
			let text = this._onReplaceSensitive(this.talk_editText.text);
        	ccserver.sendHornMsg(2,text);
			this.talk_editText.text = "";
  			let _oneInfo = {
				time : new Date().getTime(),
				nickname : _selfData.nickname,
				msg : text
			};
			_selfData.addHornTalkRec(_oneInfo);
			//_selfData.addGold(-this._costNum);
			//CCDDZBagService.instance.updateItemCount(3,-this._costNum)
			this._setHasSendMsg(true);
		}
		else{
			CCDDZToast.show("消息不能为空");
		}
    }
	createChildren():void {
		super.createChildren();		
		this._initDefaut();
		this._initEvent();
		CCDDZEventManager.instance.enableOnObject(this);
	}

	/**
	 * 格式化系统消息和玩家喇叭消息
	 */
	private _formatTalk():Array<any>{
		let _selfData = CCDDZMainLogic.instance.selfData;
		let _userTalk = _selfData.getHornTalkRecList(); //用户喇叭消息
		let _sysTalk = _selfData.getSysTalkRecList(); //系统公告
		let _arr = [];

		_arr = _arr.concat(_userTalk);
		_arr = _arr.concat(_sysTalk);
		return _arr;
	}

	/**
	 * 初始化默认数据
	 */
	private _initDefaut():void{
		this._hasSendMsg = false;
		this._nDefaultCoolTime = 5;
		this._nIntervalRepeatId = -1;
		this._dataArr = this._formatTalk();
	    this._dataProvider= new eui.ArrayCollection(this._dataArr);
	    this.talkRec_list.itemRenderer = CCDDZHornTalkItem;
	    this.talkRec_list.dataProvider = this._dataProvider; 
		this._onScrollToBottom();
		this._setChatCost();
	}

	/**
	 * 设置是否已结发送喇叭消息
	 */
	private _setHasSendMsg(bHas:boolean):void{
		this._hasSendMsg = bHas;
	}
	/**
	 * 喇叭记录变化
	 */
	private _onHornRecChange(e:egret.Event):void{
		let data = e.data;
		if(data){
			this._dataArr.push(data);
			this._dataProvider.source = this._dataArr;
			this._dataProvider.refresh();
			this._onScrollToBottom();
		}
	}

	/**
	 * 滚动到底部
	 */
	private _onScrollToBottom():void{
		egret.setTimeout(()=>{
			if(this.horn_scroller.viewport.contentHeight < this.horn_scroller.height){
				return;
			}
			this.horn_scroller.viewport.scrollV = this.horn_scroller.viewport.contentHeight - this.horn_scroller.height;
        	this.horn_scroller.viewport.validateNow();
		}, this, 100);
	}
	/**
	 * 初始化事件
	 */
	private _initEvent():void{
		this._enableEvent(true);
		this.close_img["addClickListener"](this._onTouchClose, this);
		this.sendMsg_img["addClickListener"](this._onClickSendMsg,this);
		
        let e: CCalien.CCDDZEventManager = CCalien.CCDDZEventManager.instance;
		e.registerOnObject(this,CCalien.CCDDZDispatcher,CCGlobalEventNames.HORN_TALK_RECORDS_CHANGE,this._onHornRecChange,this);
	}

	/**
	 * 点击关闭
	 */
	private _onTouchClose():void{
		this.dealAction();
	}

	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
        CCalien.CCDDZEventManager.instance.disableOnObject(this);
		CCDDZPanelHornTalk._instance = null;
	}
	/**
	 * 使能 事件
	 */
	private _enableEvent(bEnable:boolean):void{
		let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
		ccserver[_func](CCGlobalEventNames.USER_PAY_TO_CHAT_REP,this._onRecvHornRep,this);
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
	}


	/**
	 * 收到喇叭消息
	 */
	private _onRecvHornRep(e:egret.Event):void{
		let data = e.data;
		let selfName = CCDDZMainLogic.instance.selfData.nickname;
		if(data){
			if(data.result == null){
				let _infoList = data.chatinfo;
				for (let i=0;i<_infoList.length;++i){
					if(CCDDZBase64.decode(_infoList[i].nickname) == selfName){
						if(this._hasSendMsg){
							this._startCool();
						}
						this._setHasSendMsg(false);	
					}
				}
			}
			else{
				this._setHasSendMsg(false);
			}
		}
	}
	/**
	 * 显示喇叭面板
	 */
	public show():void{
		this.popup(null,true,{alpha:0});
	}
	
	/**
     * 替换敏感词
     */
    public _onReplaceSensitive(_srcStr):string{
		let _allTxts = CCDDZUtils.getSensitiveWord();
        let _newTxt = _srcStr;
        for(let i =0;i < _allTxts.length;++i){
			_newTxt = _newTxt.replace(new RegExp(_allTxts[i],"g"),"*");
        }
        return _newTxt;
    }

	/**
	 * 清除用于倒计时的id
	 */
	private _clearRepeatInterval():void{
		if(this._nIntervalRepeatId >0 ){
			egret.clearInterval(this._nIntervalRepeatId);
			this._nIntervalRepeatId = -1;	
		}
	}

	/**
	 * 开始冷却
	 */
	private _startCool():void{
		this._clearRepeatInterval();
		this._nCurCoolTime = this._nDefaultCoolTime;
		//this._showCoolTime(true);
		//this._setShowTime(this._nCurCoolTime);
		this._nIntervalRepeatId = egret.setInterval(this._coolUpdate, this,1000);
	}

	/**
	 * 结束冷却
	 */
	private _stopCool():void{
		this._clearRepeatInterval();
		//this._showCoolTime(false);
	}

	/**
	 * 冷却倒计时
	 */
	private _coolUpdate(){
		this._nCurCoolTime -= 1;
		if(this._nCurCoolTime >= 0){
		}
		else{
			this._stopCool();
		}
	};

	/**
	 * 获取喇叭单例
	 */
    public static getInstance(): CCDDZPanelHornTalk {
        if(!CCDDZPanelHornTalk._instance) {
            CCDDZPanelHornTalk._instance = new CCDDZPanelHornTalk();
        }
        return CCDDZPanelHornTalk._instance;
    }

	/**
	 * 移除喇叭面板
	 */
	public static remove():void{
		if(CCDDZPanelHornTalk._instance){
			CCDDZPanelHornTalk._instance.close();
		}
	}
}