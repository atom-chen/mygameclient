/**
 * Created by zhu on 2018/03/05.
 * 邀请活动面板
 */

class CCDDZPanelInviteAct extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelInviteAct;

	private _dataProvider:eui.ArrayCollection;
	private _dataArr:Array<any>;

	/**
	 * 邀请活动的滚动容器
	 */
	private taskScroller:eui.Scroller;
	/**
	 * 邀请任务的滚动列表
	 */
	private taskList:eui.List; 

	/**
	 * 活动描述
	 */
	private actDescLabel:eui.Label;
	/**
	 * 活动时间
	 */
	private actTimeLabel:eui.Label;
	/**
	 * 活动规则
	 */
	private actRuleLabel:eui.Label;
	/**
	 * 活动进度信息
	 */
	private _allTaskInfo:any;
	constructor() {
		super(CCalien.CCDDZpopupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, CCalien.CCDDZpopupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});

	}

    init():void {
		this.skinName = panels.CCDDZPanelInviteActSkin;
	}

	initUI():void{
        let _info = CCGlobalGameConfig.getCfgByField("webCfg");
		
		this.actRuleLabel.text = _info.rule;
		this.actTimeLabel.text = _info.time;
		this.actDescLabel.text = _info.content;
	}

	createChildren():void {
		super.createChildren();	
		this._initDefaut();
		this.initUI();
		this._enableEvent(true);
	}

	/**
	 * 格式化每条任务的数据
	 */
	private _formatEveryTaskData():any{
		let _task = CCGlobalGameConfig.getDayTaskList();
		if(!_task) return [];

		let _inviteTask:any = CCGlobalGameConfig.getCfgByField("dbs_config.invite_active");

		let userInfoData:CCGlobalUserInfoData = CCDDZMainLogic.instance.selfData;
		let _taskPro = userInfoData.getDayTaskPre();
		let _inviteStatus = userInfoData.getInviteTaskStatus();
		let _idAndNum = [];
		let _items = [];
		let _idAndNumArr =[];
		let _oneItemInfo = null;
		let _itemId = 0;
		let _itemNum = 0;
		let _inviteList = [];

		let _invite = _inviteTask.task;
		if(_invite){
			let _len = _invite.length;
			for(let i=0;i<_len;++i){
				_idAndNumArr =[];
				_items = _invite[i].reward.split("|");
				for(let j=0;j<_items.length;++j){
					_idAndNum = _items[j].split(":");
					_itemId = Number(_idAndNum[0]);
					_itemNum = Number(_idAndNum[1]);
					if(_itemId == 1){ //红包余额 单位为分
						_itemNum = _itemNum / 100;
					}
					_idAndNumArr.push({id:_itemId,num:_itemNum});
				}

				_oneItemInfo = {};
				//i+1 就是任务id
				_oneItemInfo.id = _invite[i].id;
				if(_inviteStatus.length >= _invite[i].id +1 ){
					_oneItemInfo.status = _inviteStatus[_invite[i].id] || 0;
				}else{
					_oneItemInfo.status =0;
				}
				_oneItemInfo.tp = 2;
				_oneItemInfo.num = _inviteStatus[0];
				_oneItemInfo.total = _invite[i].progress;
				_oneItemInfo.taskDesc1 = "邀请" +_oneItemInfo.total +"位新好友";
				_oneItemInfo.taskDesc2 = "(好友需赢5局)"
				let _nLeftNum = _oneItemInfo.total - _oneItemInfo.num; //剩余的高级红包次数
				if(_nLeftNum < 0){
					_nLeftNum = 0;
				}
				_idAndNumArr.unshift({id:41003,num:_nLeftNum});
				_oneItemInfo.rew = _idAndNumArr;
				_inviteList.push(_oneItemInfo);
			}

		}
		return {invite:_inviteList};
	}

	/**
	 * 初始化默认数据
	 */
	private _initDefaut():void{
		this._allTaskInfo = this._formatEveryTaskData();
		this._dataArr = this._allTaskInfo.invite;
		if(!this._dataArr || this._dataArr.length < 1) return;

	    this._dataProvider= new eui.ArrayCollection(this._dataArr);
	    this.taskList.itemRenderer = CCDDZIRContainer;
	    this.taskList.dataProvider = this._dataProvider; 
		ccserver.isInNewyearTaskReqNewYear();
	}

	/**
	 * 初始化事件
	 */
	private _initEvent():void{
		let _func = "addClickListener";
        let e: CCalien.CCDDZEventManager = CCalien.CCDDZEventManager.instance;
        e.registerOnObject(this,CCalien.CCDDZDispatcher,CCGlobalEventNames.MY_USER_INFO_UPDATE,this._userinfoUpdate,this);
        e.registerOnObject(this,CCalien.CCDDZDispatcher,CCGlobalEventNames.USER_DTREWARD_GET_SUCC,this._onDayTaskRewGetSucc,this);
		ccserver.addEventListener(CCGlobalEventNames.USER_OPERATE_REP,this._onRecvUserOperateRep,this);
	}

   /**
     * 玩家操作的服务器通知 仅处理新年活动相关
     */
    private _onRecvUserOperateRep(event:egret.Event):void{
        let _data = CCDDZMainLogic.instance.selfData;
        let data: any = event.data;
		if(data.optype == 4){ //查询活动
            if(data.result == null){
				_data.setNewYearTaskInfo(data.params2)
            }
        }else if(data.optype == 10) {//新年任务领取奖励
			if(data.result == null && data.params && data.params.length == 3){
				let _info = _data.getNewYearTaskInfo();
				let _type = data.params[1];
				let _subId = data.params[2];
				let _len = _info.length;
				for(let i=0;i<_len;++i){
					if(_info[i].ct == _type){
						_info[i].status[_subId-1] = 2;
						_data.setNewYearTaskInfo(_info);
						let _arr = this._dataArr;
						let _len = _arr.length;
						for(let i=0;i<_len;++i){
							if(_arr[i].type == _type && _arr[i].subId == _subId){
								this._dataArr[i].status = 2;
								let _str = "领取以下奖励成功:" + _arr[i].rewDesc;
								CCDDZAlert.show(_str,0,null,"left");
								this._dataProvider.source = this._dataArr;
								this._dataProvider.itemUpdated(this._dataArr[i]);
								return;
							}
						}
						return;
					}
				}
			}else{
				CCDDZAlert.show("领取奖励失败|result:" + data.result);
			}
		}
    }

    /**
     * 任务奖励领取成功
     */
    private _onDayTaskRewGetSucc():void{
		this._allTaskInfo = this._formatEveryTaskData();
		this._showInviteActInfo();
    }

	/**
	 * 滚动到顶部
	 */
	private _toTaskTop():void{
		this.taskScroller.stopAnimation();
		this.taskScroller.viewport.scrollV = 0;
		this.taskScroller.validateNow();
	}

	/**
	 * 显示每周任务
	 */
	private _showInviteActInfo():void{
		let _info = [];
		if(this._allTaskInfo.week && this._allTaskInfo.week.length >= 1) {
			_info = this._allTaskInfo.week;
		};
		this._dataProvider.source = _info;
		this._dataProvider.refresh();
	}

	/**
	 * 	加入舞台
	 */
	private _onAddToStage():void{	
		this._initEvent();
		CCDDZEventManager.instance.enableOnObject(this);
	}
	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
        CCalien.CCDDZEventManager.instance.disableOnObject(this);
		CCDDZPanelInviteAct._instance = null;
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
		this[_func](egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
	}

	/**
	 * 用户信息变化
	 */
	private _userinfoUpdate():void{
		this._allTaskInfo = this._formatEveryTaskData();
		this._showInviteActInfo();
	}

	/**
	 * 显示
	 */
	public show():void{
		this.popup(null,true,{alpha:0});
	}
	
	/**
	 * 获取邀请活动单例
	 */
    public static getInstance(): CCDDZPanelInviteAct {
        if(!CCDDZPanelInviteAct._instance) {
            CCDDZPanelInviteAct._instance = new CCDDZPanelInviteAct();
        }
        return CCDDZPanelInviteAct._instance;
    }


	/**
	 * 移除邀请活动面板
	 */
	public static remove():void{
		if(CCDDZPanelInviteAct._instance){
			CCDDZPanelInviteAct._instance.close();
		}
	}
}