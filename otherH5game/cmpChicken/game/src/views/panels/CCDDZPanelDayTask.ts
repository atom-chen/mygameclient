/**
 * Created by zhu on 2017/08/30.
 * 每日任务信息面板
 */
let CCDDZ_TASK_TYPEID_DIAMOND = 1;
let CCDDZ_TASK_TYPEID_DAY = 2;
let CCDDZ_TASK_TYPEID_YEAR = 3;

class CCDDZPanelDayTask extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelDayTask;

	private _dataProvider:eui.ArrayCollection;

	private _yearArr:Array<any>;
	private _yearProvider:eui.ArrayCollection;
	/**
	 * 新年任务
	 */
	private yearScroller:eui.Scroller;
	/**
	 *新年任务的滚动列表
	 */
	 private yearList:eui.List;
	 private yearTimeLabel:eui.Label;

	/**
	 * 箭头
	 */
	private arr_img:eui.Image;

	/**
	 * 所有任务的数据
	 */
	private _allTaskInfo:any;
	/**
	 * 每日任务的滚动列表
	 */
	private mTask_list:eui.List; 

	/**
	 * 关闭按钮
	 */
	private mClose_btn:eui.Button;

	/**
	 * 任务滚动容器
	 */
	private taskScroller:eui.Scroller;

	private flagScroller:eui.Scroller;
	/**
	 * 任务左侧的标签页
	 */
	private leftLabelList:eui.List;

	/**
	 * 左侧任务标签的数据更新
	 */
	private _leftLabelsDataProvider:eui.ArrayCollection;

	/**
	 * 左边的任务类别
	 */
	private _leftLabels:Array<any>;
	constructor() {
		super(CCalien.CCDDZpopupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, CCalien.CCDDZpopupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});
		
		this._addListener(true);
	}

    init():void {
		this.skinName = panels.CCDDZPanelDayTaskSkin;
		
	}

	createChildren():void {
		super.createChildren();	
	}

	/**
	 * 奖励中含有钻石则归类到钻石任务
	 */
	private _rewHasDiamond(rewArr:any):boolean{
		let _len = rewArr.length;
		for(let i =0;i<_len;++i){
			if(rewArr[i].id == 3){
				return true;
			}
		}
		return false;
	}

	/**
	 * 格式化每条任务的数据
	 */
	private _formatEveryTaskData():any{
		let _task = CCGlobalGameConfig.getDayTaskList();
		if(!_task) return [];

		let userInfoData:CCGlobalUserInfoData = CCDDZMainLogic.instance.selfData;
		let _taskPro = userInfoData.getDayTaskPre();
		let _taskStatus =  userInfoData.getDayTaskAllTStatus();
		let _idAndNum = [];
		let _items = [];
		let _idAndNumArr =[];
		let _oneItemInfo = null;
		let _hasInsertDayTit = false;
		let _hasInsertWeekTit = false;
		let _itemId = 0;
		let _itemNum = 0;
		let _dayList = [];
		let _weekList = [];
		for(let i=0;i<_task.length;++i){
			if(_task[i].hide == 1)
				continue;
				
			_idAndNumArr =[];
			_items = _task[i].reward.split("|");
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
			_oneItemInfo.id = _task[i].id;
			_oneItemInfo.status = _taskStatus[i] || 0;
			_oneItemInfo.tp = _task[i].tp;
			_oneItemInfo.total = _task[i].progress;

			//胜利多少局
			if(_task[i].tp == 1){
				_oneItemInfo.num = _taskPro[0]||0;
				_oneItemInfo.taskDesc1 = "胜利" +_oneItemInfo.total +"局";
				_oneItemInfo.taskDesc2 = "(自由组局除外)";
			}
			else if(_task[i].tp == 2){ //其他任务为邀请N个好友(好友需要赢5局)
				_oneItemInfo.num = _taskPro[1]||0;
				_oneItemInfo.taskDesc1 = "邀请" +_oneItemInfo.total +"位新好友";
				_oneItemInfo.taskDesc2 = "(好友需赢5局)";
				if(_task[i].week == 1){ //只有每日任务会送抽高级红包次数，一个被邀请玩家完成则服务器会自动送抽高级红包的机会
					let _nLeftNum = _oneItemInfo.total - _oneItemInfo.num; //剩余的高级红包次数
					if(_nLeftNum < 0){
						_nLeftNum = 0;
					}
					_idAndNumArr.unshift({id:41003,num:_nLeftNum});
				}
			}else if(_task[i].tp == 3){ //游戏局数
				if(_task[i]["roomid"]["1001"]){
					_oneItemInfo.num = _taskPro[3]||0;
					_oneItemInfo.taskDesc1 = "斗地主金豆场玩" +_oneItemInfo.total +"局";
					_oneItemInfo.taskDesc2 = "";
				}else if(_task[i]["roomid"]["1000"]||_task[i]["roomid"]["1006"]||_task[i]["roomid"]["8003"]){
					_oneItemInfo.num = _taskPro[5]||0;
					_oneItemInfo.taskDesc1 = "斗地主钻石场玩" +_oneItemInfo.total +"局";
					_oneItemInfo.taskDesc2 = "";
				}else if(_task[i]["roomid"]["4001"]){
					_oneItemInfo.num = userInfoData.getRoomPlayCount(4001);
					_oneItemInfo.num = _oneItemInfo.num ||0;
					_oneItemInfo.taskDesc1 = "找刺激玩" +_oneItemInfo.total +"局";
					_oneItemInfo.taskDesc2 = "";
				}else if(_task[i]["roomid"]["9002"] && _task[i]["roomid"]["9004"] && _task[i]["roomid"]["9005"]&&!_task[i]["roomid"]["9000"]&&!_task[i]["roomid"]["9001"]&&!_task[i]["roomid"]["9003"]){
					let n1 = userInfoData.getRoomPlayCount(9002);
					let n2 = userInfoData.getRoomPlayCount(9004);
					let n3 = userInfoData.getRoomPlayCount(9005);
					_oneItemInfo.num = n1+n2+n3;
					_oneItemInfo.taskDesc1 = "跑得快钻石场玩" +_oneItemInfo.total +"局";
					_oneItemInfo.taskDesc2 = "";
				}else if(_task[i]["roomid"]["9000"]&&_task[i]["roomid"]["9001"]&&_task[i]["roomid"]["9002"]&&_task[i]["roomid"]["9003"]&&_task[i]["roomid"]["9004"]&&_task[i]["roomid"]["9005"]){
					let n = userInfoData.getRoomPlayCount(9000);
					let n1 = userInfoData.getRoomPlayCount(9001);
					let n2 = userInfoData.getRoomPlayCount(9002);
					let n3 = userInfoData.getRoomPlayCount(9003);
					let n4 = userInfoData.getRoomPlayCount(9004);
					let n5 = userInfoData.getRoomPlayCount(9005);
					_oneItemInfo.num = n + n1 + n2 + n3 + n4 + n5;
					_oneItemInfo.taskDesc1 = "跑得快玩" +_oneItemInfo.total +"局";
					_oneItemInfo.taskDesc2 = "";
				}
				if(this._rewHasDiamond(_idAndNumArr)){
					_oneItemInfo.diamond = true;
				}
			}else if(_task[i].tp == 4){ //胜利局数
				if(_task[i]["roomid"]["1001"]){
					_oneItemInfo.num = _taskPro[3]||0;
					_oneItemInfo.taskDesc1 = "金豆场胜利" +_oneItemInfo.total +"局";
					_oneItemInfo.taskDesc2 = "";
				}else if(_task[i]["roomid"]["1000"]||_task[i]["roomid"]["1006"]||_task[i]["roomid"]["8003"]){
					_oneItemInfo.num = _taskPro[5]||0;
					_oneItemInfo.taskDesc1 = "钻石场胜利" +_oneItemInfo.total +"局";
					_oneItemInfo.taskDesc2 = "";
				}else if(_task[i]["roomid"]["4001"]){
					_oneItemInfo.num = _taskPro[4]||0;
					_oneItemInfo.taskDesc1 = "找刺激胜利" +_oneItemInfo.total +"局";
					_oneItemInfo.taskDesc2 = "";
				}else if(_task[i]["roomid"]["9000"]||_task[i]["roomid"]["9001"]||_task[i]["roomid"]["9003"]){
					let n = userInfoData.getRoomWinCount(9000);
					let n1 = userInfoData.getRoomWinCount(9001);
					let n2 = userInfoData.getRoomWinCount(9003);
					_oneItemInfo.num = n + n1 + n2;
					_oneItemInfo.taskDesc1 = "跑得快金豆场胜利" +_oneItemInfo.total +"局";
					_oneItemInfo.taskDesc2 = "";
				}
				if(this._rewHasDiamond(_idAndNumArr)){
					_oneItemInfo.diamond = true;
				}
			}else if(_task[i].tp == 5){ //捕鱼
				if(_task[i]["roomid"]["3002"]&&_task[i]["roomid"]["3003"]&&_task[i]["roomid"]["3004"]){
					_oneItemInfo.taskDesc1 = "捕鱼游戏中捕获1条鱼";
					_oneItemInfo.taskDesc2 = "";
					_oneItemInfo.num = 0;
					_oneItemInfo.total = 1;
				}
				if(_oneItemInfo.status == 1 ||_oneItemInfo.status == 2){
					_oneItemInfo.num = 1;
				}
				if(this._rewHasDiamond(_idAndNumArr)){
					_oneItemInfo.diamond = true;
				}
			}else if(_task[i].tp == 99){ //小游戏
				if(_task[i].id == 14){ //翻翻翻翻到777
					_oneItemInfo.taskDesc1 = "连连翻中翻到777图案1次";
					_oneItemInfo.taskDesc2 = "";
					_oneItemInfo.num = 0;
					_oneItemInfo.total = 1;
				}else if(_task[i].id == 15){ //连连探5个急以上
					_oneItemInfo.taskDesc1 = "连连探1局挖到5个及以上宝藏";
					_oneItemInfo.taskDesc2 = "";
					_oneItemInfo.num = 0;
					_oneItemInfo.total = 1;
				}
				
				if(_oneItemInfo.status == 1 ||_oneItemInfo.status == 2){
					_oneItemInfo.num = 1;
				}
				if(this._rewHasDiamond(_idAndNumArr)){
					_oneItemInfo.diamond = true;
				}
			}
			
			_oneItemInfo.roomid = _task[i].roomid;
			//每日任务中的针对邀请我的人的任务
			if(_task[i].day == 1 && _task[i].tp == 2){
				_oneItemInfo.num = _taskPro[2]||0;
			}
			_oneItemInfo.rew = _idAndNumArr;
			if(_task[i].day == 1){
				//目前仅保留赢多少局和玩多少局任务
				if(_task[i].tp == 1 || _task[i].tp == 3 || _task[i].tp == 4 || _task[i].tp == 5 || _task[i].tp == 99){
					_dayList.push(_oneItemInfo);
				}	
			}else if(_task[i].week ==1){
				//_weekList.push(_oneItemInfo);
			}
		}
		
		return {day:_dayList,week:_weekList};
	}

	private _initLeftBtns():void{
		this._leftLabels = [
			{tit:"钻石任务",sel:false,new:false,act:false,id:CCDDZ_TASK_TYPEID_DIAMOND,cb:this._onClickDiamondTask.bind(this)},
			{tit:"金豆任务",sel:false,new:false,act:false,id:CCDDZ_TASK_TYPEID_DAY,cb:this._onClickDayTask.bind(this)},
		]
		
        this._leftLabelsDataProvider = new eui.ArrayCollection(this._leftLabels);
		this.leftLabelList.dataProvider = this._leftLabelsDataProvider;
		this.leftLabelList.itemRenderer = CCDDZActListItem;
	}

	private _initYearTask():void{
		this._yearArr =[];
		this._yearProvider = new eui.ArrayCollection(this._yearArr);
		this.yearList.itemRenderer = CCDDZIRContainer;
		this.yearList.dataProvider = this._yearProvider;
		
		this._initLeftBtns();

		let _isInNewYearTask =CCGlobalGameConfig.isInNewYearTask();
		if(_isInNewYearTask.isInTime){
			let _hasClick= CCGlobalUserData.instance.hasClickNewYearTask();
			this._leftLabels.push({tit:"五一福利",sel:false,new:!_hasClick,act:false,id:CCDDZ_TASK_TYPEID_YEAR,cb:this._onClick51Task.bind(this)})
			ccserver.isInNewyearTaskReqNewYear();
			let _cfg = CCGlobalGameConfig.newYearCfg.yearTask;
			let _start = _cfg.trigger_time;
			let _end = _cfg.finish_time;
			this.yearTimeLabel.text = "2018年"+_start[1] +"月" + _start[2]+ "日0:00"+"至" +  "2018年"+_end[1] +"月" + _end[2]+ "日0:00";
		}
	}

	/**
	 * 初始化默认数据
	 */
	private _initDefaut():void{
		this._allTaskInfo = this._formatEveryTaskData();
	    this._dataProvider= new eui.ArrayCollection();
	    this.mTask_list.itemRenderer = CCDDZIRContainer;
	    this.mTask_list.dataProvider = this._dataProvider; 
	}

	/**
	 * 设置选中的标签页
	 */
	private _setLeftSelectById(id:number):void{
		let _l = this._leftLabels;
        let _len = _l.length;
        for(let i=0;i<_len;++i){
            if(_l[i].id == id){
                this.leftLabelList.selectedIndex = i;
                this.leftLabelList.selectedItem = _l[i];
                this._onSelectItem(null);
                return;
            }
        } 
	}


    private _onSelectItem(e:egret.Event):void{
        let _sel = this.leftLabelList.selectedItem;
        this.taskScroller.stopAnimation();
        this.taskScroller.viewport.scrollV = 0;
        //console.log("_onSelectItem==================>",_sel);
        let _source = this._leftLabels;
        let _len = this._leftLabels.length;
        for(let i=0;i<_len;++i){
            if(_source[i].sel){
                _source[i].sel = false;
                this._leftLabelsDataProvider.itemUpdated(_source[i]);
            }
        }
        this.leftLabelList.selectedItem.sel = true;
        let _idx = this.leftLabelList.selectedIndex;

        this.arr_img.y = this.flagScroller.y + _idx * 65 + 32.5;
        this._leftLabelsDataProvider.itemUpdated(_sel);
        if(_sel.cb){
            _sel.cb();
        }
    }

    /**
     * 任务奖励领取成功
     */
    private _onDayTaskRewGetSucc():void{
		this._allTaskInfo = this._formatEveryTaskData();
		let _select = this.leftLabelList.selectedItem;
		if(!_select){
			return;
		}
		else if(_select.id == CCDDZ_TASK_TYPEID_DAY){
			this._showDayTask();
		}else if(_select.id == CCDDZ_TASK_TYPEID_DIAMOND){
			this._showDiamondTask();
		}
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
	 * 显示每日任务
	 */
	private _showDayTask():void{
		this._showTaskScroller(true);
		this._showYearScroller(false);
		let _info = [];
		this["mBottomDesc_label"].text = "每日任务每天24点重置";
		if(this._allTaskInfo.day && this._allTaskInfo.day.length >= 1) {
			_info =  this._allTaskInfo.day.filter((item:any)=>{
				if(!item.diamond){
					return true;
				}
			});;
		};
		this._toTaskTop();
		this._dataProvider.source = _info;
		this._dataProvider.refresh();
	}
	
	/**
	 * 显示每周任务
	 */
	private _showWeekTask():void{
		let _info = [];
		if(this._allTaskInfo.week && this._allTaskInfo.week.length >= 1) {
			_info = this._allTaskInfo.week;
		};
		this._toTaskTop();
		this._dataProvider.source = _info;
		this._dataProvider.refresh();
	}

	/**
	 * 显示钻石任务
	 */
	private _showDiamondTask():void{
		this._showTaskScroller(true);
		this._showYearScroller(false);
		let _info = [];
		this["mBottomDesc_label"].text = "钻石任务每天24点重置";
		if(this._allTaskInfo.day && this._allTaskInfo.day.length >= 1) {
			_info = this._allTaskInfo.day.filter((item:any)=>{
				if(item.diamond){
					item.taskDesc2 = "(APP端领取)";
					return true;
				}
			});;
		};
		this._toTaskTop();
		this._dataProvider.source = _info;
		this._dataProvider.refresh();
	}

	/**
	 * 
	 */
	private _showYearScroller(bShow:boolean):void{
		this.yearScroller.visible = bShow;
	}

	/**
	 * 
	 */
	private _showTaskScroller(bShow:boolean):void{
		this.taskScroller.visible = bShow;
	}

	/**
	 * 显示新年任务
	 */
	private _showYearTask():void{
		this._showTaskScroller(false);
		this._showYearScroller(true);
		this.yearScroller.stopAnimation();
		this.yearScroller.viewport.scrollV = 0;
		this.yearScroller.viewport.validateNow();

		let _data = CCDDZMainLogic.instance.selfData;
		let _info = _data.getNewYearTaskInfo();
		let _len = _info.length;
		
		let _shunInfo = null;
		let _planeInfo = null;
		for(let i=0;i<_len;++i){
			if(_info[i].ct == 1){
				_shunInfo = _info[i];
			}else if(_info[i].ct == 2){
				_planeInfo = _info[i];
			}
		}

		let _cfg = CCGlobalGameConfig.getNewYearTask();
		let _yearInfo = _cfg.specialct;
		let _len1 = _yearInfo.length;
		let _oneItemInfo = null;
		let _rew = null;
		this._yearArr = [];
		for(let j=0;j<_len1;++j){
			for(let k=0; k< _yearInfo[j].length;++k){
				_rew =  _yearInfo[j][k].rwd.split(":");
				_oneItemInfo = {};
				_oneItemInfo.rew = [{id:_rew[0],num:_rew[1]}];
				_oneItemInfo.subId = k + 1;
				_oneItemInfo.condition = 3;
				_oneItemInfo.id = 3;
				_oneItemInfo.tp = 1;
				if(j == 0){ //顺子
					_oneItemInfo.num = _shunInfo.progress;
					_oneItemInfo.taskDesc1 = "任意场打出" + _yearInfo[j][k].progress +"个顺子";
					_oneItemInfo.taskDesc2 = "(自由组局除外)";
					_oneItemInfo.type = 1;
					_oneItemInfo.status = _shunInfo.status[k];
				}else if(j == 1){ //飞机
					_oneItemInfo.num = _planeInfo.progress;
					_oneItemInfo.taskDesc1 = "任意场打出" + _yearInfo[j][k].progress +"个飞机";
					_oneItemInfo.taskDesc2 = "(自由组局除外)";
					_oneItemInfo.type = 2;
					_oneItemInfo.status = _planeInfo.status[k];
				}

				_oneItemInfo.total = _yearInfo[j][k].progress;
				this._yearArr.push(_oneItemInfo);
			}
		}

		//console.log("_oneItemInfo===============>",this._yearArr);
		this._yearProvider.source = this._yearArr;
		this._yearProvider.refresh();

	}
	
	/**
	 * 点击每日任务
	 */
	private _onClickWeekTask():void{
		this._showWeekTask();
	}
	
	/**
	 * 点击钻石任务
	 */
	private _onClickDiamondTask():void{
		//console.log("===========_onClickDiamondTask=====>");
		this._showDiamondTask();
	}

	/**
	 * 点击每日任务
	 */
	private _onClickDayTask():void{
		//console.log("===========_onClickDayTask=====>");
		this._showDayTask();
	}

	/**
	 * 点击51任务
	 */
	private _onClick51Task():void{
		//console.log("===========_onClickDayTask=====>");
		CCGlobalUserData.instance.setHasClickNewYearTask();
		this._showYearTask();
	}

	/**
	 * 点击关闭
	 */
	private _onTouchClose():void{
		this.dealAction();
	}

	/**
	 * 初始化点击事件
	 */
	private _initClickListener():void{
		this.mClose_btn["addClickListener"](this._onTouchClose, this);
	}

	/**
	 * 	加入舞台
	 */
	private _onAddToStage():void{
		this._initClickListener();
		
        let e: CCalien.CCDDZEventManager = CCalien.CCDDZEventManager.instance;
        e.registerOnObject(this,CCalien.CCDDZDispatcher,CCGlobalEventNames.MY_USER_INFO_UPDATE,this._userinfoUpdate,this);
        e.registerOnObject(this,CCalien.CCDDZDispatcher,CCGlobalEventNames.USER_DTREWARD_GET_SUCC,this._onDayTaskRewGetSucc,this);
		e.registerOnObject(this,ccserver,CCGlobalEventNames.USER_OPERATE_REP,this._onRecvUserOperateRep,this);
		e.enableOnObject(this);
		this._initDefaut();
		this._initYearTask();
	}
	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._addListener(false);
        CCalien.CCDDZEventManager.instance.disableOnObject(this);
		CCDDZPanelDayTask._instance = null;
	}
	/**
	 * 使能 事件
	 */
	private _addListener(bEnable:boolean):void{
		let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
		
		this.leftLabelList[_func](egret.Event.CHANGE, this._onSelectItem, this);
		this[_func](egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
	}

	/**
	 * 用户信息变化
	 */
	private _userinfoUpdate():void{
		this._allTaskInfo = this._formatEveryTaskData();
		let item = this.leftLabelList.selectedItem;
		if(item.id == CCDDZ_TASK_TYPEID_DAY){
			this._showDayTask();
		}else if(item.id == CCDDZ_TASK_TYPEID_DIAMOND){

		}else if(item.id == CCDDZ_TASK_TYPEID_YEAR){
			this._showYearTask();
		}
	}


/**
     * 玩家操作的服务器通知 仅处理新年活动相关
     */
    private _onRecvUserOperateRep(event:egret.Event):void{
        let _data = CCDDZMainLogic.instance.selfData;
        let data: any = event.data;
		if(data.optype != 4 && data.optype != 10){
			return;
		}

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
						let _arr = this._yearArr;
						let _len = _arr.length;
						for(let i=0;i<_len;++i){
							if(_arr[i].type == _type && _arr[i].subId == _subId){
								this._yearArr[i].status = 2;
								let _str = "领取以下奖励成功:" + _arr[i].rewDesc;
								CCDDZAlert.show(_str,0,null,"center");
								this._yearProvider.source = this._yearArr;
								this._yearProvider.itemUpdated(this._yearArr[i]);
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
	 * 显示
	 */
	public show():void{
		CCDDZMainLogic.instance.refreshSelfInfo();
		this.popup(null,true,{alpha:0});
		this._setLeftSelectById(CCDDZ_TASK_TYPEID_DIAMOND);
	}
	
	/**
	 * 获取每日任务单例
	 */
    public static getInstance(): CCDDZPanelDayTask {
        if(!CCDDZPanelDayTask._instance) {
            CCDDZPanelDayTask._instance = new CCDDZPanelDayTask();
        }
        return CCDDZPanelDayTask._instance;
    }


	/**
	 * 移除每日任务面板
	 */
	public static remove():void{
		if(CCDDZPanelDayTask._instance){
			CCDDZPanelDayTask._instance.close();
		}
	}
}