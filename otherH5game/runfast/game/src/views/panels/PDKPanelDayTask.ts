/**
 * Created by zhu on 2017/08/30.
 * 每日任务信息面板
 */

class PDKPanelDayTask extends PDKalien.PDKPanelBase {
	private static _instance: PDKPanelDayTask;

	private _dataProvider: eui.ArrayCollection;
	private _dataArr: Array<any>;
	/**
	 * 所有任务的数据
	 */
	private _allTaskInfo: { day: any, week: any };
	/**
	 * 单条任务的数据
	 */
	private _itemData: PDKDayTaskItemInfo;
	/**
	 * 每日任务的滚动列表
	 */
	private mTask_list: eui.List;

	/**
	 * 关闭按钮
	 */
	private mClose_btn: eui.Button;

	/**
	 * 每日任务按钮
	 */
	private dayTaskImg: eui.Image;

	/**
	 * 每周任务按钮
	 */
	private weekTaskImg: eui.Image;

	constructor() {
		super(PDKalien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, PDKalien.popupEffect.Scale, { withFade: false, ease: egret.Ease.backIn });

	}

	init(): void {
		this.skinName = panels.PDKPanelDayTaskSkin;
	}

	createChildren(): void {
		super.createChildren();
		this._initDefaut();
		this._initEvent();
	}

	/**
	 * 格式化每条任务的数据
	 */
	private _formatEveryTaskData(): any {
		let _task = PDKGameConfig.getDayTaskList();
		if (!_task) return [];

		let userInfoData: PDKUserInfoData = PDKMainLogic.instance.selfData;
		let _taskPro = userInfoData.getDayTaskPre();
		let _taskStatus = userInfoData.getDayTaskAllTStatus();

		let _idAndNum = [];
		let _items = [];
		let _idAndNumArr = [];
		let _oneItemInfo = null;
		let _hasInsertDayTit = false;
		let _hasInsertWeekTit = false;
		let _itemId = 0;
		let _itemNum = 0;
		let _dayList = [];
		let _weekList = [];
		for (let i = 0; i < _task.length; ++i) {
			_idAndNumArr = [];
			_items = _task[i].reward.split("|");
			for (let j = 0; j < _items.length; ++j) {
				_idAndNum = _items[j].split(":");
				_itemId = Number(_idAndNum[0]);
				_itemNum = Number(_idAndNum[1]);
				if (_itemId == 1) { //红包余额 单位为分
					_itemNum = _itemNum / 100;
				}
				_idAndNumArr.push({ id: _itemId, num: _itemNum });
			}

			_oneItemInfo = {};
			//i+1 就是任务id
			_oneItemInfo.id = i + 1;
			_oneItemInfo.status = _taskStatus[i] || 0;
			_oneItemInfo.condition = _task[i].condition;
			_oneItemInfo.total = _task[i].progress;

			//胜利多少局
			if (_task[i].condition == 1) {
				_oneItemInfo.num = _taskPro[0] || 0;
				_oneItemInfo.taskDesc1 = "胜利" + _oneItemInfo.total + "局";
				_oneItemInfo.taskDesc2 = "";
			}
			else if (_task[i].condition == 2) { //其他任务为邀请N个好友(好友需要赢5局)
				_oneItemInfo.num = _taskPro[1] || 0;
				_oneItemInfo.taskDesc1 = "邀请" + _oneItemInfo.total + "位新好友";
				_oneItemInfo.taskDesc2 = "(好友需赢5局)";
				if (_task[i].week == 1) { //只有每日任务会送抽高级红包次数，一个被邀请玩家完成则服务器会自动送抽高级红包的机会
					let _nLeftNum = _oneItemInfo.total - _oneItemInfo.num; //剩余的高级红包次数
					if (_nLeftNum < 0) {
						_nLeftNum = 0;
					}
					_idAndNumArr.unshift({ id: 41003, num: _nLeftNum });
				}
			}

			//每日任务中的针对邀请我的人的任务
			if (_task[i].day == 1 && _task[i].tp == 2) {
				_oneItemInfo.num = _taskPro[2] || 0;
			}
			_oneItemInfo.rew = _idAndNumArr;
			if (_task[i].day == 1) {
				//目前仅保留赢多少局任务
				if (_task[i].condition == 1) {
					_dayList.push(_oneItemInfo);
				}
			} else if (_task[i].week == 1) {
				//zhu 暂时屏蔽_weekList.push(_oneItemInfo);
			}

		}
		return { day: _dayList, week: _weekList };
	}

	/**
	 * 初始化默认数据
	 */
	private _initDefaut(): void {
		this._allTaskInfo = this._formatEveryTaskData();
		this._dataArr = this._allTaskInfo.day;
		if (!this._dataArr || this._dataArr.length < 1) return;

		this._dataProvider = new eui.ArrayCollection(this._dataArr);
		this.mTask_list.itemRenderer = PDKDayTaskItemInfo;
		this.mTask_list.dataProvider = this._dataProvider;
	}

	/**
	 * 初始化事件
	 */
	private _initEvent(): void {
		this._enableEvent(true);
		let _func = "addClickListener";
		this.mClose_btn[_func](this._onTouchClose, this);
		this.dayTaskImg[_func](this._onClickDayTask, this, false);
		this.weekTaskImg[_func](this._onClickWeekTask, this, false);

		let e: PDKalien.PDKEventManager = PDKalien.PDKEventManager.instance;
		e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.MY_USER_INFO_UPDATE, this._userinfoUpdate, this);
		e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.USER_DTREWARD_GET_SUCC, this._onDayTaskRewGetSucc, this);
	}
    /**
     * 任务奖励领取成功
     */
	private _onDayTaskRewGetSucc(): void {
		this._allTaskInfo = this._formatEveryTaskData();
		if (this.currentState == "day") {
			this._showDayTask();
		} else if (this.currentState == "week") {
			this._showWeekTask();
		}
	}

	/**
	 * 显示每日任务
	 */
	private _showDayTask(): void {
		let _info = [];
		if (this._allTaskInfo.day && this._allTaskInfo.day.length >= 1) {
			_info = this._allTaskInfo.day;
		};
		this._dataProvider.source = _info;
		this._dataProvider.refresh();
	}

	/**
	 * 显示每周任务
	 */
	private _showWeekTask(): void {
		let _info = [];
		if (this._allTaskInfo.week && this._allTaskInfo.week.length >= 1) {
			_info = this._allTaskInfo.week;
		};
		this._dataProvider.source = _info;
		this._dataProvider.refresh();
	}

	/**
	 * 点击每日任务
	 */
	private _onClickDayTask(): void {
		this.currentState = "day";
		this._showDayTask();
	}

	/**
	 * 点击每日任务
	 */
	private _onClickWeekTask(): void {
		this.currentState = "week";
		this._showWeekTask();
	}


	/**
	 * 点击关闭
	 */
	private _onTouchClose(): void {
		this.dealAction();
	}
	/**
	 * 	加入舞台
	 */
	private _onAddToStage(): void {
		PDKEventManager.instance.enableOnObject(this);
	}
	/**
	 * 从场景移除
	 */
	private _onRemovedToStage(): void {
		this._enableEvent(false);
		PDKalien.PDKEventManager.instance.disableOnObject(this);
		PDKPanelDayTask._instance = null;
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
		this[_func](egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
	}

	/**
	 * 用户信息变化
	 */
	private _userinfoUpdate(): void {
		this._allTaskInfo = this._formatEveryTaskData();
		if (this.currentState == "day") {
			this._showDayTask();
		} else if (this.currentState == "week") {
			this._showWeekTask();
		}
	}

	/**
	 * 显示
	 */
	public show(): void {
		this.popup(null, true, { alpha: 0 });
	}

	/**
	 * 获取每日任务单例
	 */
	public static getInstance(): PDKPanelDayTask {
		if (!PDKPanelDayTask._instance) {
			PDKPanelDayTask._instance = new PDKPanelDayTask();
		}
		return PDKPanelDayTask._instance;
	}


	/**
	 * 移除每日任务面板
	 */
	public static remove(): void {
		if (PDKPanelDayTask._instance) {
			PDKPanelDayTask._instance.close();
		}
	}
}