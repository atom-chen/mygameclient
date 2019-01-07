/**
 * Created by rockyl on 15/11/25.
 *
 * 用户信息
 */

class CCGlobalUserInfoData {
	uid: number;
	nickname: string;
	money: number;
	gold: number;
	exp: number;
	vipexp: number;
	sex: number;
	sexStr: string;
	sexVoiceStr: string;
	imageid: string;
	havesecondpwd: number;
	isbinding: number;
	//	wincnt:number;
	//	losecnt:number;
	drawcnt: number;
	fakeuid: number;
	bindphone: string;
	freshmanredcoinsent: number;
	rcminexcchanceused: number;
	rcminexcexpiretime: number;
	freshrewardgot: number;
	recorderfirstrewardgot: number;
	cardsRecorder: any;
	beans: string;

	seatid: number;
	redcoingot: number;//红包金额
	totalwincnt: number;//总胜利的局数
	totallosecnt: number;//总失败的局数
	totaldrawcnt: number;//总平局的局数
	/**
	 *  0 表示 新玩家是否打完一局(0否/1是)， idx 1表示完成赢5局任务的下线玩家数量
	 */
	daytaskprogress: any;
	/**
	 * 表示每日任务是否完成，0未完成 1已完成 2 已领取
	 */
	daytaskstatus: any;

	/**
	 * 游戏玩的和胜利局数;
	 */
	playrecords: any;
	/**
	 * 有时间限制的邀请任务 第一位邀请的总人数，后续对应的id的状态
	 */
	invitetaskstatus: any;

	wincnt;
	redcoin: number;
	/**
	 * 获取每日任务完成的数量
	 */
	_dayTaskOverNum: number;

	/**
	 * 首充 获得首充奖励之后的天数 1~7存在即可领奖 ，8今日奖励已领取 9 所有奖励领取完毕，如果为-1则为未购买
	 */
	frechargerewardday: number;

	/**
	 * 今日是否签到
	 */
	todayHasSign: boolean;

	/**
	 *  //签到奖励加成剩余天数
	 */
	signrewardaddremain: number;

	/**
	 * 喇叭消息聊天记录
	 */
	_hornTalkRec: Array<any>;

	/**
	 * 显示喇叭消息的数组
	 */
	_hornTalkShowList: Array<any>;

	/**
	 * 系统消息聊天记录
	 */
	_sysTalkRec: Array<any>;

	/**
	 * 系统公告的最大条数
	 */
	_sysTalkMaxN: number = 10;

	/**
	 * 喇叭记录的最大条数
	 */
	_hornTalkRecMaxN: number = 20;
	/**
	 * 我的国庆信息
	 */
	_nationalInfo: any;

	/**
	 * 新手是否领取过钻石奖励
	 */
	diamondgiftgot: number;

	/**
	 * 今日是否购买了复活礼包
	 */
	diamondrelive: number;

	/**
	 * 今日是否购买了金豆复活礼包
	 */
	goldrelive: number;

	/**
	 * 表情的免费次数
	 */
	freeBrowCount: number;

	/**
	 * 是否需要显示小红点
	 */
	showredpoint: Array<number>;

	/**
	 * 是否为登录过APP
	 */
	notLoginApp: boolean;

	/**
	 * 新年礼盒购买次数
	 */
	newGiftBuyCount: number = 0;

	/**
	 * 新年任务信息
	 */
	newYearTaskInfo: any = [];
	/**
	 * 新年登录信息
	 */
	newYearLoginInfo: any = [];

	/**
	 * 新年任务信息
	 */
	newYearWorkInfo: any = [];

	/**
	 * 1 邀请玩家抽奖次数 2 首次打出王炸抽奖次数
	 */
	otherrcchance: any = [];

	/**
	 *  1 胜利次数 2 抽奖次数
	 */
	poolreward: any = [0, 0];

	/**
	 * 充值的次数
	 */
	private _payCount: number = 0;

	/**
	 * 0 赞数 1 踩数
	 */
	praise: any;

	/**
	 * 是否已经实名认证
	 */
	private _bRealname: boolean = false;

	/**
	 * 当前的vip等级
	 */
	private _vipLevel: number;

	constructor() {
		this.clean();
	}

	public set realName(bReal) {
		this._bRealname = bReal;
	}

	public get realName(): boolean {
		return this._bRealname;
	}

	/**
	 * 获取是否有记牌器
	 */
	public hasRecorder(): boolean {
		if (this.cardsRecorder && this.cardsRecorder.length >= 7 && this.cardsRecorder[6] > 0) {
			return true;
		}
		return false;
	}

	/**
	 * 今天是否购买了钻石复活礼包
	 */
	public todayHasBuyRevive(): boolean {
		if (this.diamondrelive >= 1) {
			return true;
		}
		return false;
	}

	/**
	 * 设置今天已经购买了记牌器(钻石复活礼包)
	 */
	public setTodayHasBuyRevive(): void {
		this.diamondrelive += 1;
	}

	/**
	 * 今日复活礼包购买的次数
	 */
	public getTodayBuyDiamondReviveNum(): number {
		return this.diamondrelive || 0;
	}

	/**
	 * 获取今日金豆复活礼包购买的次数
	 */
	public getTodayBuyGoldReviveNum(): number {
		return this.goldrelive || 0;
	}

	/**
	 * 钻石场复活礼包购买是否达到上限
	 */
	public isMaxBuyDiamondRevive(): boolean {
		let _maxBuy = this.getDiamondReviveMaxBuy();
		if (this.diamondrelive >= _maxBuy) {
			return true;
		}
		return false;
	}

	/**
	 * 金豆复活礼包购买是否达到上限
	 */
	public isMaxBuyGoldRevive(): boolean {
		let _maxBuy = CCGlobalGameConfig.getGoldReviveMaxBuy();
		if (this.goldrelive >= _maxBuy) {
			return true;
		}
		return false;
	}

	/**
	 * 获取钻石场的复活礼包每天购买的最大次数
	 */
	public getDiamondReviveMaxBuy(): number {
		/*let _cfg = CCGlobalGameConfig.rechargeConfig;
		for(let i =0;i<_cfg.length;++i){
			if(_cfg[i].product_id == 10009){
				return _cfg[i].maxBuyNum;
			}
		}*/
		return 9999;
	}

	/**
	 * 今天是否购买了金豆复活礼包
	 */
	public todayHasBuyGoldRevive(): boolean {
		if (this.goldrelive >= 1) {
			return true;
		}
		return false;
	}

	/**
	 * 设置今天已经购买了记牌器
	 */
	public setTodayHasBuyGoldRevive(): void {
		this.goldrelive += 1;
	}

	initData(data: any): void {
		if (data['cardsRecorder'] && data['cardsRecorder'].length < 1) {
			data['cardsRecorder'] = null;
		}

		CCalien.CCDDZUtils.injectProp(this, data, (target, key, value) => {
			if (key == 'nickname') {
				if (value) {
					if (value != "参赛玩家") {
						target.nickname = CCDDZBase64.decode(value);
					}
					else {
						target.nickname = value;
					}
				}
			} else if (key == 'sex') {
				CCGlobalUserInfoData.updateSex(target, value);
			} else if (key == 'gold' ||
				key == "redcoingot" ||
				key == "totalwincnt" ||
				key == "totallosecnt" ||
				key == "totaldrawcnt" ||
				key == "diamondgiftgot" ||
				key == "diamondrelive" ||
				key == "godlrelive") {
				target[key] = parseInt(value);
				if (key == "redcoingot") {//->需要除以100
					target[key] = target[key] / 100;
				}
			} else if (key == "frechargerewardday") {
				if ((value >= 1 && value <= 9) || (value == -1)) {
					target[key] = parseInt(value);
					if (value != -1) {
						CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.FRECHARGE_HASUPDATE);
					}
				}
			} else if (key == "showredpoint") {
				if (value && value.length >= 1) {
					target[key] = value;
				}
			} else if (key == "otherrcchance") {
				if (value && value.length >= 2) {
					target[key] = value;
				}
			} else if (key == "poolreward") {
				if (value && value.length >= 2) {
					target[key] = value;
				}
			}
			else if (key == 'wincnt') {
				if (value && value.length >= 1)
					target[key] = value;
			}
			else if (key == "daytaskprogress") {
				if (value.length >= 1) {
					target[key] = value;
				}
			}
			else if (key == "daytaskstatus") {
				if (value && value.length >= CCGlobalGameConfig.getDayTaskList().length) {
					target[key] = value;
					this._calculateOverTaskNum(value);
				}
			} else if (key == "invitetaskstatus") {
				if (value && value.length >= 2) {
					target[key] = value;
				}
			} else if (key == "imageid") {
				if (value && value.indexOf("head") == 0 && value.length <= 10) {
					target[key] = "cc_icon_head_default";
				} else {
					target[key] = value;
				}
			}
			else if (key == "praise") {
				if (value && value >= 5) {
					target[key] = value;
				}
			} else if (key == "ivtrwddayrcd") {
				if (value && value.length >= 2) {
					target[key] = value;
				}
			} else if (key == 'primarydmrcge') {
				if (value && value.length >= 1) {
					target[key] = value;
				}
			} else if (key == 'vipdata') {
				if (value && value.length >= 1) {
					target[key] = value;
					this._calcuateVipLevel();
				}
			} else if (key == "params") {
				if (value.length >= 1) {
					this["monthcardinfo"] = value;
				}
			} else if (key == "playrecords") {
				if (value && value.length >= 1) {
					this.playrecords = value;
				}
			}
			else {
				target[key] = value;
			}
		});
		if (this.sex == 0) {
			CCGlobalUserInfoData.updateSex(this, 0);
		}
		if (this.recorderfirstrewardgot == 0 &&
			!data['recorderfirstrewardgot']) {
			this.recorderfirstrewardgot = null;
		}
		//        else if (key == 'wincnt')
		//        {
		//            value.forEach((val, idx) => {
		//                target[key][idx] = { roomid: value.roomid, cnt: value.cnt, chance: value.chance };
		//            });
		//
		//        } 
	}

	static updateSex(target: CCGlobalUserInfoData, sex: number = 0): void {
		target.sex = sex;
		target.sexStr = lang.sex[target.sex];
		target.sexVoiceStr = lang.sexVoice[target.sex];
	}

	/**
	 * 计算完成的每日任务的数量(排除邀请)
	 */
	private _calculateOverTaskNum(val: any): void {
		let _taskCfg = CCGlobalGameConfig.getCfgByField("newTaskInfo");
		let _num: number = 0;
		for (let i = 0; i < val.length; ++i) {
			if (val[i] == 1) {//已完成
				let _id = i + 1;
				if (_taskCfg[_id].tp != 2 && !_taskCfg[_id].hide) {
					_num += 1;
				}
			}
		}

		let _lastNum = this._dayTaskOverNum;
		this._dayTaskOverNum = _num;
		if (_lastNum != this._dayTaskOverNum) {
			CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.USER_DTREWARD_GET_SUCC);
		}
	}

	//获取玩家的胜率 返回小数 zhu
	public getWinRate(): number {
		let _total = this.totalwincnt + this.totaldrawcnt + this.totallosecnt;
		if (_total == 0 || this.totalwincnt == 0) {
			return 0
		}
		return this.totalwincnt / _total;
	}

	//获取金豆 zhu
	public getGold(): number {
		return this.gold;
	}

	//玩家加金豆
	public addGold(nGold: number): void {
		let _gold = this.gold + nGold;
		this.gold = _gold;
		if (_gold < 0) {
			this.gold = 0;
		}
	}

	/**
	 * 邀请的总人数
	 */
	public getInviteTaskPre(): number {
		return this.invitetaskstatus[0];
	}

	/**
	 * 时限邀请任务的状态
	 */
	public getInviteTaskStatus(): any {
		return this.invitetaskstatus;
	}

	/**
	 * 获取玩家的任务进度
	 */
	public getDayTaskPre(): any {
		return this.daytaskprogress;
	}

	/**
	 * 获取玩家每日任务所有任务的状态
	 */
	public getDayTaskAllTStatus(): any {
		return this.daytaskstatus;
	}

	/**
	 * 获取每日任务完成的数量
	 */
	public getDayTaskOverCount(): any {
		return this._dayTaskOverNum;
	}

	/**
	 * 是否未购买首充
	 */
	public isNotBuyFRecharge(): boolean {
		if (this.frechargerewardday == -1) {
			return true;
		}
		return false;
	}

	/**
	 * 是否未购买钻石首充
	 */
	public isNotBuyDiaFirRecharge(): boolean {
		return false;
		// if(this["monthcardinfo"][0] == 0){
		// 	return true;
		// }
		// return false;
	}

	/**
	 * 是否今天还有月卡免费复活的次数 如果有就直接领取
	 */
	public checkMonthCardRevival(): boolean {
		let monthCard1RevivalUseTime = this["monthcardinfo"][3] * 1000;
		let monthCar1EndTime = this["monthcardinfo"][1] * 1000;
		let nowTime = ccserver.getServerStamp();
		if (monthCar1EndTime > nowTime) {
			if (monthCard1RevivalUseTime == 0 || CCDDZUtils.isTwoStampSameDay(monthCard1RevivalUseTime, nowTime) == false) {
				CCDDZAlert.show("是否使用月卡复活机会？", 0, (act) => {
					if (act == "confirm") {
						let data = { optype: 10 };
						ccserver.send(CCGlobalEventNames.USER_GET_REWARD_REQ, data);
					}
					else if (act == "close") {
						CCDDZMainLogic.backToRoomScene()
					}
				})
				return true;
			}
		}
		return false;
	}

	/**
	 * 是否今天还可以领取月卡免费钻石
	 */
	public checkMonthCardFreeDiamond(): boolean {
		let monthCard1RevivalUseTime = (this["monthcardinfo"][4] == 0 ? 0 : this["monthcardinfo"][4] * 1000);
		let monthCar1EndTime = (this["monthcardinfo"][2] == 0 ? 0 : this["monthcardinfo"][2] * 1000);
		let nowTime = ccserver.getServerStamp();
		if (monthCar1EndTime > nowTime) {
			if (monthCard1RevivalUseTime == 0 || CCDDZUtils.isTwoStampSameDay(monthCard1RevivalUseTime, nowTime) == false) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 判断月卡1or月卡2是否在三天之内结束 or  没有月卡
	 */
	public checkMonthCardEndTime(): boolean {
		let monthcard1EndTime = (this["monthcardinfo"][1] == 0 ? 0 : this["monthcardinfo"][1] * 1000);
		let monthcard2EndTime = (this["monthcardinfo"][2] == 0 ? 0 : this["monthcardinfo"][2] * 1000);
		if (monthcard1EndTime == 0 && monthcard2EndTime == 0) return true;
		let nowTime = ccserver.getServerStamp();
		let difftimeCard1 = Number(CCDDZUtils.getTimeStampDiff(nowTime, monthcard1EndTime, "day"));
		let difftimeCard2 = Number(CCDDZUtils.getTimeStampDiff(nowTime, monthcard2EndTime, "day"));
		console.log("checkMonthCardEndTime-------1->", monthcard1EndTime, monthcard2EndTime, nowTime, difftimeCard1, difftimeCard2);
		if (difftimeCard1 >= 3 || difftimeCard2 >= 3) {
			return false;
		}
		if ((difftimeCard1 < 3 && monthcard1EndTime != 0) || (difftimeCard2 < 3 && monthcard2EndTime != 0)) {
			return true;
		}
		return false;
	}

	/**
	 * 是否领取过首充奖励,全部领取完毕也包括在内
	 */
	public isHadGetFRechargeRew(): boolean {
		if ((this.frechargerewardday >= 2 && this.frechargerewardday <= 9)) {
			return true;
		}
		return false;
	}

	/**
	 * 是否领取了今日的首充奖励 
	 */
	public isGetTodayFRechargeRew(): boolean {
		if (this.frechargerewardday == 8) {
			return true;
		}
		return false;
	}

	/**
	 * 判断首充奖励是否全部领取完毕（目前是可以领取7天的奖励）
	 */
	public isFRechargeRewGetOver(): boolean {
		if (this.frechargerewardday >= 1 && this.frechargerewardday <= 7) {
			return false;
		}
		return true;
	}

	/**
	 * 获取首充的领取天数
	 */
	public getFRechargeRewGetDay(): number {
		return this.frechargerewardday;
	}

	/**
	 * 设置首充奖励,今日已领取
	 */
	public setFRechargeTodayHasGet(): void {
		this.frechargerewardday = 8;
		CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.USER_FRREWARD_GET_SUCC);
	}

	/**
	 * 获取今日是否已经签到 默认未签到
	 */
	public isTodayHasSign(): boolean {
		return this.todayHasSign;
	}

	/**
	 * 设置今日已签到
	 */
	public setTodaySigned(bSigned: boolean): void {
		this.todayHasSign = bSigned;
	}
	/**
	 *  今日签到是否有金豆加成
	 */
	public isSignGoldAddByFRecharge(): boolean {
		if (this.signrewardaddremain && this.signrewardaddremain > 0) {
			return true;
		}
		return false;
	}

	/**
	 *  是否未领取过签到的金豆加成
	 */
	public isNotGetFRechargeSignAdd(): boolean {
		if (this.signrewardaddremain == 7) {
			return true;
		}
		return false;
	}

	/**
	 * 签到成功，如果购买了首充,并且领过首充，则加成剩余天数要减1
	 */
	public signSuccSubSignAddRemin(): void {
		if (!this.isNotBuyFRecharge() && this.isHadGetFRechargeRew()) {
			if (this.signrewardaddremain) {
				this.signrewardaddremain -= 1;
				if (this.signrewardaddremain < 0) {
					this.signrewardaddremain = 0;
				}
			}
		}
	}


	/**
	 * 设置任务状态为已领取
	 */
	public setTaskHasGetRew(nId: number): void {
		for (let i = 0; i < this.daytaskstatus.length; ++i) {
			if ((i + 1) == nId) {
				this.daytaskstatus[i] = 2;//已领取
				break;
			}
		}
		this._calculateOverTaskNum(this.daytaskstatus);
	}

	/**
	 * 设置邀请任务状态为已领取
	 */
	public setInviteTaskHasGetRew(nId: number): void {
		for (let i = 0; i < this.invitetaskstatus.length; ++i) {
			if (i == nId) {
				this.invitetaskstatus[i] = 2;//已领取
				break;
			}
		}
		CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.USER_DTREWARD_GET_SUCC);
	}

	/**
	 * 增加喇叭消息到聊天记录
	 */
	public addHornTalkRec(msgObj) {
		if (!msgObj || !msgObj.nickname || !msgObj.msg) return;

		let time: Date = new Date(msgObj.time);
		let hour: any = time.getHours();
		let min: any = time.getMinutes();
		let sec: any = time.getSeconds();
		if (hour < 10) {
			hour = "0" + hour;
		}
		if (min < 10) {
			min = "0" + min;
		}
		if (sec < 10) {
			sec = "0" + sec;
		}
		let sTime = hour + ":" + min + ":" + sec;
		let obj = { time: sTime, name: msgObj.nickname, msg: msgObj.msg, isUser: true };
		if (this._hornTalkRec.length >= this._hornTalkRecMaxN) {
			this._hornTalkRec.shift();
		}
		this._hornTalkRec.push(obj);
		this._hornTalkShowList.push(obj);
		CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.HORN_TALK_RECORDS_CHANGE, obj);
	}

	/**
	 * Http 回复的喇叭消息记录 
	 */
	public addHornTalkRecByHttp(data): void {
		if (!data || !data.nickname || !data.msg || !data.add_time) return;

		let sTime = data.add_time.substr(-8);
		let name = data.nickname;
		let msg = data.msg;
		let obj = { time: sTime, name: name, msg: msg, isUser: true };
		if (this._hornTalkRec.length >= this._hornTalkRecMaxN) {
			this._hornTalkRec.shift();
		}
		this._hornTalkRec.push(obj);
	}

	/**
	 * 当从Http收到新的喇叭记录时，清除本地的喇叭记录 
	 */
	public cleanLocalHornRecByHttp(): void {
		this._hornTalkRec = [];
	}

	/**
	 * 设置喇叭记录的最大条数
	 */
	public setHornTalkRecMaxLen(nMax: number): void {
		this._hornTalkRecMaxN = nMax;
	}
	/**
	 * 获取喇叭消息记录列表
	 */
	public getHornTalkRecList(): Array<any> {
		return this._hornTalkRec;
	}

	/**
	 * 获取喇叭消息显示列表长度
	 */
	public getHornTalkShowLen(): number {
		return this._hornTalkShowList.length;
	}

	/**
	 * 返回喇叭消息显示队列的前面的一条信息
	 */
	public getFrontHornTalkShow(): any {
		let msgObj = null;
		if (this._hornTalkShowList.length > 0) {
			msgObj = this._hornTalkShowList[0];
			this._hornTalkShowList.shift();
		}
		return msgObj;
	}
	/**
	 * 增加系统消息到聊天记录
	 */
	public addSysTalkRec(msg) {
		//系统公告目前就一条

		this._sysTalkRec[0] = { msg: msg, isUser: false };
		/*if(this._sysTalkRec.length >= this._sysTalkMaxN){
			this._sysTalkRec.shift();
		}
		this._sysTalkRec.push({msg:msg,isUser:false});
		*/
		CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.HORN_TALK_RECORDS_CHANGE);
	}

	/**
	 * 获取系统公告
	 */
	public getSysTalkRecList(): Array<any> {
		return this._sysTalkRec;
	}

	/**
	 * 设置我的国庆活动信息
	 */
	public setNationalActInfo(_info): void {
		this._nationalInfo = _info;
		CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.NATIONAL_INFO_CHANGE);
	}

	/**
	 * 获取国庆登录礼包已领取的天数
	 */
	public getNationalGetLoginRewDay(): number {
		if (this._nationalInfo && this._nationalInfo.getRewDay) {
			return this._nationalInfo.getRewDay;
		}
		return 0;
	}
	/**
	 * 获取国庆活动今日的礼包是否已领取
	 * (1未领取 2 已领取)
	 */
	public hasGetNationalTodayLoginRew(): boolean {
		if (this._nationalInfo && this._nationalInfo.todayGet == 2) {
			return true;
		}
		return false;
	}

	/**
	 * 获取国庆邀请的玩家完成5局的数量
	 */
	public getNationalInviteNum(): number {
		if (this._nationalInfo && this._nationalInfo.inviteNum) {
			return this._nationalInfo.inviteNum
		}
		return 0;
	}

	/**
	 * 获取国庆邀请的玩家应获得的奖励红包额度
	 */
	public getNationalInviteRew(): number {
		if (this._nationalInfo && this._nationalInfo.inviteNum) {
			return CCGlobalGameConfig.getNationalInviteRewByNum(this._nationalInfo.inviteNum);
		}
		return 0;
	}

	/**
	 * 是否领取了国庆邀请活动的奖励
	 * (1未领取 2 已领取)
	 */
	public hasGetNationalInviteRew(): boolean {
		if (this._nationalInfo && this._nationalInfo.getInviteRew && this._nationalInfo.getInviteRew == 2) {
			return true;
		}
		return false;
	}

	/**
	 * 是否领取了新手的钻石奖励
	 */
	public hasGetNewDiamond(): boolean {
		if (this.diamondgiftgot >= 1) {
			return true;
		}
		return false;
	}

	/**
	 * 是否可以领取新手免费钻石
	 * diamondgiftgot != 1 就可以领取
	 */
	public canGetNewDiamond(): boolean {
		if (this.diamondgiftgot != 1) {
			return true;
		}
		return false;
	}

	/**
	 * 设置可以领取新手免费钻石
	 */
	public setCanGetNewDiamond(): void {
		//console.log("this.diamondgiftgot------------------------>",this.diamondgiftgot);
		if (this.diamondgiftgot == null || this.diamondgiftgot == undefined) {
			this.diamondgiftgot = -1;
		}
	}

	/**
	 * 设置已经领取了新手钻石奖励
	 */
	public setHasGetNewDiamond(): void {
		this.diamondgiftgot = 1;
	}
	/**
	 * 设置国庆登录礼领取的天数（领取成功后调用）
	 */
	public setNationalGetLoginRewDay(nDay: number): void {
		this._nationalInfo.getRewDay = nDay;
		this._nationalInfo.todayGet = 2;
	}
	/**
	 * 获取免费表情次数
	 */
	public getFreeBrowCount(): number {
		return this.freeBrowCount;
	}
	/**
	 * 设置表情的免费次数
	 */
	public setFreeBrowCount(num: number): void {
		this.freeBrowCount = num;
	}

	/**
	 * 加减表情的免费次数
	 */
	public addFreeBrowCount(num: number): void {
		let _num = this.freeBrowCount + num;
		if (_num >= 0) {
			this.freeBrowCount = _num;
		} else {
			this.freeBrowCount = 0;
		}
	}

	/**
	 * 是否购买了1元的钻石复活礼包
	 */
	public hasBuyOneDiaRevive(): boolean {
		let obj = this["primarydmrcge"];
		if (obj && obj.length >= 1) {
			if (obj[0] >= 1) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 获取是否购买了3元的钻石复活礼包
	 */
	public hasBuyThreeDiaRevive(): boolean {
		let obj = this["primarydmrcge"];
		if (obj && obj.length >= 2) {
			if (obj[1] >= 1) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 检查是否需要显示大厅任务小红点
	 */
	public shouldShowTaskRed(): boolean {
		if (this.showredpoint && this.showredpoint.length >= 1 && this.showredpoint[0] == 1) {
			return true;
		}
		return false;
	}

	/**
	 * 检查是否需要显示活动首充小红点
	 */
	public shouldShowActFirstRechareRedRed(): boolean {
		if (this.showredpoint && this.showredpoint.length >= 2 && this.showredpoint[1] == 1) {
			return true;
		}
		return false;
	}

	/**
	 * 检查是否需要显示钻石首充小红点
	 */
	public shouldShowActDiaFirRechareRedRed(): boolean {
		if (this.showredpoint && this.showredpoint.length >= 5 && this.showredpoint[4] == 1) {
			return true;
		}
		return false;
	}

	/**
	 * 检查是否需要显示活动APP福利小红点
	 */
	public shouldShowActDownAppRed(): boolean {
		if (this.showredpoint && this.showredpoint.length >= 3 && this.showredpoint[2] == 1) {
			return true;
		}
		return false;
	}


	/**
	 * 检查是否需要显示活动感恩节小红点
	 */
	public shouldShowActThanksRed(): boolean {
		if (this.showredpoint && this.showredpoint.length >= 4 && this.showredpoint[3] == 1) {
			return true;
		}
		return false;
	}

	/**
	 * 设置不显示任务的小红点
	 */
	public setNotShowTaskRed(): void {
		this.showredpoint[0] = 0;
	}

	/**
	 * 设置不显示首充的小红点
	 */
	public setNotShowActFirstRechargeRed(): void {
		this.showredpoint[1] = 0
		this.updateActRed();
	}

	/**
	 * 设置不显示钻石首充的小红点
	 */
	public setNotShowActDiaFirRechargeRed(): void {
		this.showredpoint[4] = 0
		this.updateActRed();
	}

	/**
	 * 设置不显示APP福利的小红点
	 */
	public setNotShowActDownAppRed(): void {
		this.showredpoint[2] = 0
		this.updateActRed();
	}

	/**
	 * 设置不显示感恩节的小红点
	 */
	public setNotShowActThanksRed(): void {
		this.showredpoint[3] = 0
		this.updateActRed();
	}

	/**
	 * 设置未登录过APP
	 */
	public setNotLoginApp(notLogin: boolean): void {
		this.notLoginApp = notLogin;
	}
	/**
	 * 是否需要显示大厅活动的小红点
	 */
	public shouldShowActRed(): boolean {
		if (this.showredpoint && this.showredpoint.length > 1) {
			for (let i = 1; i < this.showredpoint.length; ++i) {
				if (this.showredpoint[i] != 0) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 活动的小红点书聊聊变化
	 */
	public updateActRed(): void {
		CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.ACT_RED_CHANGE);
	}

	/**
	 * 是否未登录过APP
	 */
	public hasNotLoginApp(): boolean {
		return this.notLoginApp;
	}

	/**
	 * 获取玩家所有普通房里的红包个数
	 */
	public getNorRoomRedNum(): number {
		let _nTot: number = 0;
		if (this.wincnt) {
			let roomId;
			for (let i = 0; i < this.wincnt.length; ++i) {
				roomId = this.wincnt[i].roomid;
				if (roomId != 1001 && roomId != 1002 && roomId != 8001 && roomId != 8002) {
					_nTot += this.wincnt[i].chance;
				}
			}
		}

		if (this.otherrcchance && this.otherrcchance.length >= 2) { //邀请获得的抽奖个数和王炸获得的抽奖个数
			_nTot += this.otherrcchance[1];
		}
		if (this.poolreward) { //金豆场合并后的星星数和抽奖次数
			//_nTot += this.poolreward[1];
		}
		return _nTot;
	}

	/**
	 * 获取房间的抽红包信息
	 */
	public getRoomWinCntInfo(roomId): any {
		let info = null;
		if (this.wincnt) {
			let len = this.wincnt.length;
			for (let i = 0; i < len; ++i) {
				if (this.wincnt[i].roomid == roomId) {
					info = this.wincnt[i];
					break;
				}
			}
		}
		return info;
	}

	/**
	 * 金豆场合并后抽取红包成功,客户端主动减
	 */
	public subNewGoldRedNum(): void {
		if (this.poolreward && this.poolreward.length >= 2) {
			let _num = this.poolreward[1];
			_num -= 1;
			if (_num < 0) {
				_num = 0;
			}
			this.poolreward[1] = _num;
		}
	}

	/**
	 * 获取金豆场合并后的抽奖次数
	 */
	public getNewGoldRed(): any {
		return this.poolreward || [0, 0];
	}

	/**
	 * 王炸红包抽取成功,客户端主动减
	 */
	public subWangZhaRedNum(): void {
		if (this.otherrcchance && this.otherrcchance.length >= 2) {
			let _num = this.otherrcchance[1];
			_num -= 1;
			if (_num < 0) {
				_num = 0;
			}
			this.otherrcchance[1] = _num;
		}
	}

	/**
	 * 邀请红包抽取成功,客户端主动减
	 */
	public subInviteRedNum(): void {
		if (this.otherrcchance && this.otherrcchance.length >= 1) {
			let _num = this.otherrcchance[0];
			_num -= 1;
			if (_num < 0) {
				_num = 0;
			}
			this.otherrcchance[0] = _num;
		}
	}

	/**
	 * 邀请5人的额外红包抽取成功,客户端主动减
	 */
	public subInviteExtraRedNum(): void {
		if (this.otherrcchance && this.otherrcchance.length >= 3) {
			let _num = this.otherrcchance[2];
			_num -= 1;
			if (_num < 0) {
				_num = 0;
			}
			this.otherrcchance[2] = _num;
		}
	}

	/**
	 * 获取王炸的红包信息
	 */
	public getWangZhaRedNum(): any {
		if (this.otherrcchance && this.otherrcchance.length >= 2) {
			return this.otherrcchance[1];
		}
		return 0;
	}

	/**
	 * 获取邀请的红包信息
	 */
	public getInviteRedNum(): any {
		if (this.otherrcchance && this.otherrcchance.length >= 1) {
			return this.otherrcchance[0];
		}
		return 0;
	}

	/**
	 * 获取邀请的额外红包信息
	 */
	public getInviteExtraRedNum(): any {
		if (this.otherrcchance && this.otherrcchance.length >= 3) {
			return this.otherrcchance[2];
		}
		return 0;
	}
	/**
	 * 获取每日邀请红包的已抽奖次数
	 */
	public getInviteRedGetRewNum(): number {
		let info = this["ivtrwddayrcd"];
		if (info && info.length >= 1) {
			return info[0];
		}
		return 0;
	}

	/**
	 * 已经抽取每日邀请的红包次数+1
	 */
	public changeInviteGetRedNum(bAdd: boolean): void {
		let info = this["ivtrwddayrcd"];
		if (!info) {
			info = [0, 0];
		}

		info[0] += bAdd ? 1 : -1;
	}


	/**
	 * 获取已经抽取每日邀请的额外红包次数
	 */
	public getHasGetInvExtraRed(): number {
		let info = this["ivtrwddayrcd"];
		if (info && info.length >= 2) {
			return info[1];
		}
		return 0;
	}
	/**
	 * 已经抽取每日邀请的额外红包次数+1
	 */
	public changeInviteGetExtraRedNum(bAdd: boolean): void {
		let info = this["ivtrwddayrcd"];
		if (!info) {
			info = [0, 0]
		}
		info[1] += bAdd ? 1 : -1;
	}

	/**
	 * 获取某个房间玩几局或者是赢几局抽红包
	 */
	public getRoomRedWinCnt(roomId): number {
		let _nDefNum = 3;

		let _info = CCDDZMainLogic.instance.selfData.getRoomWinCntInfo(roomId);
		if (roomId == 1001 || roomId == 1002 || roomId == 8001 || roomId == 1006) {
			if (roomId == 1001) {
				_nDefNum = 5;
			} else if (roomId == 1002) {
				_nDefNum = 3;
			} else {
				_nDefNum = 1;
			}
		} else {
			if (_info) {
				if (roomId == 1000) {
					if (_info.getchance >= 2) {
						_nDefNum = 3;
					} else if (_info.getchance >= 1) {
						_nDefNum = 2;
					}
				} else if (roomId == 8003) {
					_nDefNum = 1;
				}
			} else {
				if (roomId == 1000 || roomId == 8003) {
					_nDefNum = 1;
				}
			}
		}
		return _nDefNum;
	}

	/**
	 * 判断该房间在玩几局就可以抽红包
	 */
	public getRoomNeedWinCntGetRed(roomId: number): number {
		let _nDefNum = 5;
		if (roomId == 10002 || roomId == 10004) _nDefNum = 3;
		if (roomId == 10005) _nDefNum = 2;
		if (roomId == 10003 || roomId == 10006) _nDefNum = 1;
		if (this.wincnt && this.wincnt.length) {
			for (var i: number = 0; i < this.wincnt.length; i++) {
				if (this.wincnt[i].roomid == roomId) {
					var cnt: number = this.wincnt[i].cnt;
					if (!cnt || cnt <= 0) {
						cnt = 0;
						return _nDefNum;
					} else {
						return _nDefNum - cnt;
					}
				}
			}
		}
		return _nDefNum;
	}

	/**
	 * 从普通房里从小到大返回一个红的信息
	 */
	public getOneNorRoomRedFromSmall(): any {
		if (this.wincnt) {
			let roomId;
			for (let i = 0; i < this.wincnt.length; ++i) {
				if (this.wincnt[i].chance > 0) {
					roomId = this.wincnt[i].roomid;
					if (roomId != 1001 && roomId != 1002 && roomId != 8001 && roomId != 1006) {
						return this.wincnt[i];
					}
				}
			}
		}
		return null;
	}

	/**
	 * 设置新年礼盒购买的次数
	 */
	public setNewYearGiftBuyCount(num: number): void {
		this.newGiftBuyCount = num || 0;
	}

	/**
	 * 获取新年礼盒购买的数量
	 */
	public getNewYearGiftBuyCount(): number {
		return this.newGiftBuyCount;
	}

	/**
	 * 设置新年任务的进度等信息
	 */
	public setNewYearTaskInfo(info: any): void {
		this.newYearTaskInfo = info || [];
	}

	/**
	 * 获取新年任务的进度信息
	 */
	public getNewYearTaskInfo(): any {
		return this.newYearTaskInfo;
	}

	/**
	 * 设置新年登录信息
	 * params1 1今天是否已签到（1已签到 0待签到） 2 今天是第几天 3 总签到天数 ...每天的签到情况1已签到 0 未签到
	 */
	public setNewYearLoginInfo(info: any): void {
		if (info && info.length >= 10) {
			this.newYearLoginInfo = info
		}
	}

	/**
	 * 设置今天的新年登录奖励已领取
	 */
	public setNewYearTodayRewGet(): void {
		this.newYearLoginInfo[0] = 1;
		let _idx = this.newYearLoginInfo[1];
		this.newYearLoginInfo[2 + _idx] = 1;
	}

	/**
	 * 是否领取了今日的新年礼盒登录奖励
	 */
	public isNewYearGetTodayRew(): boolean {
		let _info: any = this.newYearLoginInfo;
		if (_info && _info.length >= 1 && _info[0] == 1) {
			return true;
		}
		return false;
	}

	/**
	 * 获取新年登录信息
	 */
	public getNewYearLoginInfo(): any {
		return this.newYearLoginInfo;
	}

	/**
	 * 设置新年开工活动进度等信息
	 */
	public setNewYearWorkInfo(info: any): void {
		this.newYearWorkInfo = info || [];
	}

	/**
	 * 获取新年开工活动进度等信息
	 */
	public getNewYearWorkInfo(): any {
		return this.newYearWorkInfo;
	}

	/**
	 * 收到支付成功，购买次数加1
	 */
	public addPayCount(): void {
		this._payCount += 1;
	}

	/**
	 * 设置充值次数
	 */
	public setPayCount(count: number): void {
		this._payCount = count;
	}
	/**
	 * 获取充值次数
	 */
	public getPayCount(): number {
		return this._payCount;
	}

	/**
	 * 今天是否充值过
	 */
	public hasPayToday(): boolean {
		if (this["todayPayRmb"] > 0) {
			return true;
		}
		return false;
	}

	/**
	 * 今日充值金额
	 */
	public setHasPayToday(payRmb: number): void {
		this["todayPayRmb"] = payRmb;
	}

	/**
	 * 初始化赞还是踩的信息
	 */
	public initPraise(arr: any): void {
		if (arr.length < 5) return;
		this.praise = arr;
	}

	/**
	 * 计算当前的vip等级
	 */
	private _calcuateVipLevel(): void {
		let vipCfg = CCGlobalGameConfig.getCfgByField("vip_config");
		let len = vipCfg.upgrade.length;
		let nCur = 0;
		let i = 0;
		let curExp = 0;
		let vipData = this["vipdata"];
		this._vipLevel = 0;
		if (vipData && vipData.length >= 1) {
			curExp = vipData[0];
			if (curExp < 1) {
				return;
			}
		}

		if (curExp >= vipCfg.upgrade[len - 1].exp) {
			this._vipLevel = len;
			return;
		}

		while (i < len - 1) {
			if (this["vipdata"][0] >= vipCfg.upgrade[i].exp) {
				if (this["vipdata"][0] < vipCfg.upgrade[i + 1].exp) {
					this._vipLevel = i + 1;
					return;
				}
			}
			i++;
		}
	}

	/**
	 * 获取当前的Vip等级
	 */
	public getCurVipLevel(): number {
		return this._vipLevel;
	}

	/**
	 * 获取当前经验值
	 */
	public getCurExp(): number {
		let vipData = this["vipdata"];
		if (vipData && vipData.length >= 1) {
			return vipData[0];
		}
		return 0;
	}


	/**
	 * 是否领取今日vip奖励
	 */
	public hasGetTodayVipRew(): boolean {
		let vipData = this["vipdata"];
		if (vipData && vipData.length >= 2) {
			let nTimeStamp = ccserver.getServerStamp();
			let isSameDay = CCDDZUtils.isTwoStampSameDay(vipData[1] * 1000, nTimeStamp);
			if (isSameDay) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 设置已经领取今日VIP奖励
	 */
	public setHasGetTodayVipRew(): void {
		let vipData = this["vipdata"];
		let len = vipData.length;
		let nTimeStamp = ccserver.tsServer;
		if (len < 2) {
			if (len < 1) {
				this["vipdata"] = [1, nTimeStamp];
			} else {
				this["vipdata"].push(nTimeStamp);
			}
		} else {
			this["vipdata"][1] = nTimeStamp;
		}
	}

	/**
	 * 设置已经抽过今日免费抽奖
	 */
	public setHasTodayAppLucky(): void {
		let info = this["monthcardinfo"];
		let len = info.length;
		let nTimeStamp = ccserver.tsServer;
		if (len >= 6) {
			info[5] = nTimeStamp;
		}
	}

	/**
	 * 今天vip抽奖信息
	 */
	public getTodayVipLucky(): any {
		if (this["vipdata"].length >= 3) {
			let time = this["vipdata"][2] * 1000;
			let curTime = ccserver.getServerStamp();
			if (time < curTime) {
				let hour = CCGlobalGameConfig.getCfgByField("custom.vipLuckyCfg.hourRange");
				let hours = hour.split("|");
				let bIn = CCalien.CCDDZUtils.checkCurHourisInHourRange(Number(hours[0]), Number(hours[1]));
				if (time <= 0) {
					return { inTime: bIn };
				}

				let bOther = CCalien.CCDDZUtils.checkTwoTimestampIsOtherDay(time, curTime);
				if (bOther) {
					return { inTime: bIn };
				} else {
					return { inTime: false, hasLuck: true };
				}
			}
		}
		return { inTime: false };
	}

	/**
	 * 是否显示周一特惠
	 */
	public shouldShowMonday(): boolean {
		let obj = this["monthcardinfo"];
		let buyTimeStamp = 0;
		let curStamp = ccserver.getServerStamp();
		let dayIdx = new Date(curStamp).getDay();
		if (dayIdx != 1) {
			return false;
		}

		if (obj && obj.length >= 7) {
			buyTimeStamp = obj[6] * 1000;
		} else {
			return true;
		}
		let sameDay = CCDDZUtils.isTwoStampSameDay(buyTimeStamp, curStamp);
		if (sameDay) {
			return false;
		}
		return true;
	}

	/**
	 * 获取今天APP 未抽掉免费抽奖
	 */
	public noTodayAppLucky(): any {
		let obj = this["monthcardinfo"];
		if (obj.length >= 6) {
			let time = obj[5] * 1000;
			if (time <= 0) {
				return true;
			}
			let curTime = ccserver.getServerStamp();
			if (time < curTime) {
				let bOther = CCalien.CCDDZUtils.checkTwoTimestampIsOtherDay(time, curTime);
				return bOther;
			} else {
				return false;
			}
		}
		return true;
	}

	public getRoomPlayCount(roomId: number): number {
		let rec = this.playrecords;
		let len = rec.length;
		for (let i = 0; i < len; ++i) {
			if (rec[i].roomid == roomId) {
				return rec[i].played;
			}
		}
		return 0;
	}

	public getRoomWinCount(roomId: number): number {
		let rec = this.playrecords;
		let len = rec.length;
		for (let i = 0; i < len; ++i) {
			if (rec[i].roomid == roomId) {
				return rec[i].win;
			}
		}
		return 0;
	}

	/**
	 * 判断房间是不是可以抽红包
	 */
	public getRoomCanGetRed(roomId: number): boolean {
		if (this.wincnt && this.wincnt.length) {
			for (var i: number = 0; i < this.wincnt.length; i++) {
				if (this.wincnt[i].roomid == roomId) {
					var chance: number = this.wincnt[i].chance;
					if (!chance || chance <= 0) {
						return false;
					} else {
						return true;
					}
				}
			}
		}
		return false;
	}

	clean(): void {
		this.playrecords = [];
		this["vipdata"] = [];
		this._vipLevel = 0;
		this["primarydmrcge"] = [0, 0];
		this.invitetaskstatus = [0, 0];
		this.diamondrelive = 0;
		this.goldrelive = 0;
		this.showredpoint = [0, 0, 0, 0]; //0任务 1首充 2 下载APP奖励 3 (感恩节)活动
		this.freeBrowCount = 0;
		this._nationalInfo = { getRewDay: 0, todayGet: 0, inviteNum: 0, getInviteRew: 0 };
		this._hornTalkShowList = [];
		this._hornTalkRec = []
		this._sysTalkRec = [];
		this.uid = 0;
		this.nickname = null;
		this.diamondgiftgot = null;
		this.money = 0;
		this.gold = 0;
		this.exp = 0;
		this.vipexp = 0;
		this.sex = 0;
		this.sexStr = null;
		this.sexVoiceStr = null;
		this.imageid = null;
		this.havesecondpwd = 0;
		this.isbinding = 0;
		this.wincnt = [];
		//		this.losecnt = 0;
		this.drawcnt = 0;
		this.fakeuid = 0;
		this.bindphone = null;
		this.redcoin = 0;
		this.seatid = 0;
		this.freshmanredcoinsent = 0;
		this.beans = null;
		this.rcminexcexpiretime = 0;//服务器下发兑换过期的时间戳
		this.rcminexcchanceused = null;
		this.freshrewardgot = null;
		this.redcoingot = 0;//红包金额 
		this.totalwincnt = 0;//总胜利的局数
		this.totallosecnt = 0;//总失败的局数
		this.totaldrawcnt = 0;//总平局的局数
		this.recorderfirstrewardgot = 0;
		this.cardsRecorder = null;
		this._dayTaskOverNum = 0;
		this.daytaskprogress = [0, 0, 0, 0, 0, 0];
		this.praise = [0, 0, -1, -1, -1];
		this.daytaskstatus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		this.frechargerewardday = null;
		this.todayHasSign = null;
		this.signrewardaddremain = null;
		this.notLoginApp = false;
		this["primarydmrcge"] = 0;
		this["monthcardinfo"] = [0, 0, 0, 0, 0];
	}
}