/**
 * Created by rockyl on 15/11/25.
 *
 * 用户信息
 */

class PDKUserInfoData {
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
	 * 今日是否购买了钻石复活礼包
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
	/**
	 * 好友信息
	 */
	private _friends: any = { req: [], list: [], leftSendNum: 0, sendNum: 0 };

	winRate = 0;
	base64 = false;
	game = 0;
	isPlaying = false;
	bgImg = "";
	whatsup = "";

	constructor() {
		this.clean();
	}

	public set realName(bReal) {
		this._bRealname = bReal;
	}

	public get realName(): boolean {
		return this._bRealname;
	}

	public setFriends(info: any): void {
		this._friends = info;
		this._friendsReqChange();
		this.setHasSendNum(info.sendNum);
	}

	public setHasSendNum(num): void {
		this._friends.sendNum = num;
		this.calculateLeftSendNum();

		PDKalien.Dispatcher.dispatch(PDKEventNames.FRIEND_SEND_CHAGNE);
	}

	/**
	 * 计算剩余的赠送次数
	 */
	public calculateLeftSendNum(): void {
		let vipLevel = this._vipLevel;
		if (vipLevel >= 1) {
			let limitCfg = PDKGameConfig.getCfgByField('friends_cfg.limit');
			let left = limitCfg[vipLevel].giftcnt - this._friends.sendNum;
			if (left < 0) {
				left = 0;
			}
			this._friends.leftSendNum = left;
		} else {
			this._friends.leftSendNum = 0;
		}
	}

	public getHasSendNum(): void {
		return this._friends.sendNum;
	}

	private _friendsReqChange(): void {
		let info = this._friends;
		let num = info.req.length;
		PDKalien.Dispatcher.dispatch(PDKEventNames.FRIEND_REQ_CHAGNE, { num: num });
	}

	public removeFromFriendList(fakeUid): void {
		if (this._friends[fakeUid]) {
			let list = this._friends.list;
			let len = list.length;
			for (let i = 0; i < len; ++i) {
				if (list[i].fakeuid == fakeUid) {
					list.splice(i, 1);
					break;
				}
			}
		}
		this._friends[fakeUid] = false;
	}

	public getFriendsList(): any {
		return this._friends.list;
	}

	public removeFromFriendReq(fakeUid): void {
		let list = this._friends.req;
		let len = list.length;
		for (let i = 0; i < len; ++i) {
			if (list[i].fakeuid == fakeUid) {
				list.splice(i, 1);
				break;
			}
		}

		this._friendsReqChange();
	}

	public getFriendsReq(): any {
		return this._friends.req;
	}

	public getLeftSendNum(): any {
		return this._friends.leftSendNum;
	}
	/**
	 * 是否是我的好友
	 */
	public isMyFriend(fakeuid: number): boolean {
		if (this._friends && this._friends[fakeuid]) {
			return true;
		}
		return false;
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
	 * 今天是否购买了复活礼包
	 */
	public todayHasBuyRevive(): boolean {
		if (this.diamondrelive >= 1) {
			return true;
		}
		return false;
	}

	/**
	 * 设置今天已经购买了记牌器
	 */
	public setTodayHasBuyRevive(): void {
		this.diamondrelive += 1;
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
	 * 获取钻石场的复活礼包每天购买的最大次数
	 */
	public getDiamondReviveMaxBuy(): number {
		let _cfg = PDKGameConfig.rechargeConfig;
		for (let i = 0; i < _cfg.length; ++i) {
			if (_cfg[i].product_id == 10009) {
				return _cfg[i].maxBuyNum;
			}
		}
		return 3;
	}

	initData(data: any): void {
		if (data['cardsRecorder'] && data['cardsRecorder'].length < 1) {
			data['cardsRecorder'] = null;
		}
		PDKalien.PDKUtils.injectProp(this, data, (target, key, value) => {
			if (key == 'nickname') {
				if (value) {
					if (value != "参赛玩家") {
						// console.log("initData-----nickname---11->", value);
						target.nickname = PDKBase64.decode(value);
						// console.log("initData-----nickname---22->", target.nickname);
					}
					else {
						target.nickname = value;
					}
				}
			} else if (key == 'sex') {
				PDKUserInfoData.updateSex(target, value);
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
						PDKalien.Dispatcher.dispatch(PDKEventNames.FRECHARGE_HASUPDATE);
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
			} else if (key == 'wincnt') {
				if (value && value.length >= 1)
					target[key] = value;
			} else if (key == "daytaskprogress") {
				if (value.length >= 1) {
					target[key] = value;
				}
			} else if (key == "daytaskstatus") {
				if (value && value.length >= PDKGameConfig.getDayTaskList().length) {
					target[key] = value;
					this._calculateOverTaskNum(value);
				}
			} else if (key == "invitetaskstatus") {
				if (value && value.length >= 2) {
					target[key] = value;
				}
			} else if (key == "imageid") {
				if (value && value.indexOf("head") == 0 && value.length <= 10) {
					target[key] = "pdk_icon_head_default";
				} else {
					target[key] = value;
				}
			} else if (key == "praise") {
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
			} else if (key == "uid" || key == "fakeuid") {
				if (value) {
					target[key] = value;
				}
			}
			else {
				target[key] = value;
			}
		});
		if (this.sex == 0) {
			PDKUserInfoData.updateSex(this, 0);
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

	static updateSex(target: PDKUserInfoData, sex: number = 0): void {
		target.sex = sex;
		target.sexStr = PDKlang.sex[target.sex];
		target.sexVoiceStr = PDKlang.sexVoice[target.sex];
	}

	/**
	 * 计算完成的每日任务的数量
	 */
	private _calculateOverTaskNum(val: any): void {
		let _num: number = 0;
		for (let i = 0; i < val.length; ++i) {
			if (val[i] == 1) {//已完成
				_num += 1;
			}
		}
		this._dayTaskOverNum = _num;
	}

	//获取玩家的胜率 返回小数 zhu
	public getWinRate(): number {
		let _total = this.totalwincnt + this.totaldrawcnt + this.totallosecnt;
		if (_total == 0 || this.totalwincnt == 0) {
			return 0
		}
		return (this.totalwincnt || 0) / _total;
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
		PDKalien.Dispatcher.dispatch(PDKEventNames.USER_FRREWARD_GET_SUCC);
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
		PDKalien.Dispatcher.dispatch(PDKEventNames.USER_DTREWARD_GET_SUCC);
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
		let obj = { time: sTime, name: PDKBase64.decode(msgObj.nickname), msg: msgObj.msg, isUser: true };
		if (this._hornTalkRec.length >= this._hornTalkRecMaxN) {
			this._hornTalkRec.shift();
		}
		this._hornTalkRec.push(obj);
		this._hornTalkShowList.push(obj);
		PDKalien.Dispatcher.dispatch(PDKEventNames.HORN_TALK_RECORDS_CHANGE, obj);
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
		PDKalien.Dispatcher.dispatch(PDKEventNames.HORN_TALK_RECORDS_CHANGE);
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
		PDKalien.Dispatcher.dispatch(PDKEventNames.NATIONAL_INFO_CHANGE);
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
			return PDKGameConfig.getNationalInviteRewByNum(this._nationalInfo.inviteNum);
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
		if (this.diamondgiftgot == 1) {
			return true;
		}
		return false;
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
		PDKalien.Dispatcher.dispatch(PDKEventNames.ACT_RED_CHANGE);
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
			for (let i = 0; i < this.wincnt.length; ++i) {
				_nTot += this.wincnt[i].chance;
			}
		}
		return _nTot;
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

	/**
	 * 判断该房间在赢几局就可以抽红包
	 */
	public getRoomNeedWinCntGetRed(roomId: number): number {
		let _nDefNum = 5;
		if (pdkServer.roomInfo.roomID == 9001 || pdkServer.roomInfo.roomID == 9002) _nDefNum = 3;//金豆中级场 钻石初级场赢3局即得红包
		if (pdkServer.roomInfo.roomID == 9003 || pdkServer.roomInfo.roomID == 9004 || pdkServer.roomInfo.roomID == 9005) _nDefNum = 1;
		if (this.wincnt && this.wincnt.length) {
			for (var i: number = 0; i < this.wincnt.length; i++) {
				if (this.wincnt[i].roomid == roomId) {
					var cnt: number = this.wincnt[i].cnt;
					if (!cnt || cnt <= 0) {
						cnt = 0;
						return _nDefNum;
					} else {
						return _nDefNum - cnt % _nDefNum;
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
			for (let i = 0; i < this.wincnt.length; ++i) {
				if (this.wincnt[i].chance > 0) {
					return this.wincnt[i];
				}
			}
		}
		return null;
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
		let vipCfg = PDKGameConfig.getCfgByField("vip_config");
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
			let nTimeStamp = pdkServer.getServerStamp();
			let isSameDay = PDKalien.PDKUtils.isTwoStampSameDay(vipData[1] * 1000, nTimeStamp);
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
		let nTimeStamp = pdkServer.tsServer;
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
		let nTimeStamp = pdkServer.tsServer;
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
			let curTime = pdkServer.getServerStamp();
			if (time < curTime) {
				let hour = PDKGameConfig.getCfgByField("custom.vipLuckyCfg.hourRange");
				let hours = hour.split("|");
				let bIn = PDKalien.PDKUtils.checkCurHourisInHourRange(Number(hours[0]), Number(hours[1]));
				if (time <= 0) {
					return { inTime: bIn };
				}

				let bOther = PDKalien.PDKUtils.checkTwoTimestampIsOtherDay(time, curTime);
				if (bOther) {
					return { inTime: bIn };
				} else {
					return { inTime: false, hasLuck: true };
				}
			}
		}
		return { inTime: false };
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

	clean(): void {
		this._friends = { req: [], list: [], leftSendNum: 0, sendNum: 0 }
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
}