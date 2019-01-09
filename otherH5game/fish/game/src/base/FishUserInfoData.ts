/**
 * Created by eric.liu on 17/11/16.
 *
 * 用户信息
 */

class FishUserInfoData {
	uid:number;
	nickname:string;
	money:number;
	gold:number;
	exp:number;
	vipexp:number;
	sex:number;
	sexStr:string;
	sexVoiceStr:string;
	imageid:string;
	havesecondpwd:number;
	isbinding:number;
	//	wincnt:number;
//	losecnt:number;
	drawcnt:number;
	fakeuid:number;
	bindphone:string;
    freshmanredcoinsent:number;
	rcminexcchanceused:number;
	rcminexcexpiretime:number;
	freshrewardgot:number;
	recorderfirstrewardgot:number;
	cardsRecorder:any;
    beans: string;

	seatid:number;
	redcoingot:number;//红包金额
	totalwincnt:number;//总胜利的局数
	totallosecnt:number;//总失败的局数
	totaldrawcnt:number;//总平局的局数
	/**
	 *  0 表示 新玩家是否打完一局(0否/1是)， idx 1表示完成赢5局任务的下线玩家数量
	 */
	daytaskprogress:any;
	/**
	 * 表示每日任务是否完成，0未完成 1已完成 2 已领取
	 */
	daytaskstatus:any;
    wincnt;
    redcoin: number;
	/**
	 * 获取每日任务完成的数量
	 */
	_dayTaskOverNum:number;

	/**
	 * 首充 获得首充奖励之后的天数 1~7存在即可领奖 ，8今日奖励已领取 9 所有奖励领取完毕，如果为null则为未购买
	 */
	frechargerewardday:number;

	/**
	 * 今日是否签到
	 */
	todayHasSign:boolean;
	
	/**
	 *  //签到奖励加成剩余天数
	 */
	signrewardaddremain:number;

	/**
	 * 喇叭消息聊天记录
	 */
	_hornTalkRec:Array<any>;

	/**
	 * 显示喇叭消息的数组
	 */
	_hornTalkShowList:Array<any>;

	/**
	 * 系统消息聊天记录
	 */
	_sysTalkRec:Array<any>;

	/**
	 * 系统公告的最大条数
	 */
	_sysTalkMaxN:number = 10;

	/**
	 * 喇叭记录的最大条数
	 */
	_hornTalkRecMaxN:number = 20;
	/**
	 * 我的国庆信息
	 */
	_nationalInfo:any;

	/**
	 * 新手是否领取过钻石奖励
	 */
	diamondgiftgot:number;

	/**
	 * 今日是否购买了复活礼包
	 */
	diamondrelive:number;

	constructor(){
		this.clean();
	}

	/**
	 * 获取是否有记牌器
	 */
	public hasRecorder():boolean{
		if(this.cardsRecorder && this.cardsRecorder.length >= 7 && this.cardsRecorder[6] > 0){
			return true;
		}
		return false;
	}

	/**
	 * 今天是否购买了复活礼包
	 */
	public todayHasBuyRevive():boolean{
		if(this.diamondrelive == 1){
			return true;
		}
		return false;
	}

	/**
	 * 设置今天已经购买了记牌器
	 */
	public setTodayHasBuyRevive():void{
		this.diamondrelive =1;
	}

	initData(data:any):void{
		if(data['cardsRecorder'] && data['cardsRecorder'].length < 1){
			data['cardsRecorder'] = null;
		}
		FishUtils.Utils.injectProp(this, data, (target, key, value)=>{
			if(key == 'nickname'){
				if(value){
					if(value != "参赛玩家"){
						target.nickname = FishUtils.Base64.decode(value);
					}
					else{
						target.nickname = value;
					}
				}
			}else if(key == 'sex'){
				FishUserInfoData.updateSex(target, value);
			}else if(key == 'gold'|| 
				key == "redcoingot" ||
				key == "totalwincnt" || 
				key == "totallosecnt" ||
				key == "totaldrawcnt"||
				key == "diamondgiftgot"||
				key == "diamondrelive"){
				target[key] = parseInt(value);
				if(key == "redcoingot"){//->需要除以100
					target[key] = target[key] / 100;
				}
            }else if(key == "frechargerewardday"){
				if(value >= 1 && value <=9){
					target[key] = parseInt(value);
				}
			}
			else if(key == 'wincnt')
            {
                if (value && value.length)
                    target[key] = value;
            }
			else if(key == "daytaskprogress"){
				if(value.length >= 1){
					target[key] = value;
				}
			}
			else if(key == "daytaskstatus"){
				if(value &&value.length == 7){
					target[key] = value;
					this._calculateOverTaskNum(value);
				}
			}
			else if(key == "imageid"){
				if(value && value.indexOf("head") == 0 && value.length <= 10){
					target[key] = "icon_head_default";
				}else{
					target[key] = value;
				}
			}
			else{
				target[key] = value;
			}
		});
		if(this.sex == 0){
			FishUserInfoData.updateSex(this, 0);
		}
		if(this.recorderfirstrewardgot == 0 && 
		!data['recorderfirstrewardgot']){
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

	static updateSex(target:FishUserInfoData, sex:number = 0):void{
		target.sex = sex;
		target.sexStr = langFish.sex[target.sex];
		target.sexVoiceStr = langFish.sexVoice[target.sex];
	}
	/**
	 * 计算完成的每日任务的数量
	 */
	private _calculateOverTaskNum(val:any):void{
		let _num:number = 0;
		for(let i=0;i<val.length;++i){
			if(val[i] == 1){//已完成
				_num += 1;
			}
		}
		this._dayTaskOverNum = _num;
	}

	//获取玩家的胜率 返回小数 zhu
	public getWinRate():number {
		let _total =  this.totalwincnt + this.totaldrawcnt + this.totallosecnt;
		if (_total ==0 || this.totalwincnt == 0){
			return 0
		}
		return this.totalwincnt / _total;
	}

	//获取金豆 zhu
	public getGold():number {
		return this.gold;
	}

	//玩家加金豆
	public addGold(nGold:number):void{
		let _gold = this.gold + nGold;
		this.gold = _gold;
		if(_gold <0){
			this.gold = 0;
		}
	}
	
	/**
	 * 获取玩家的任务进度
	 */
	public getDayTaskPre():any{
		return this.daytaskprogress;
	}

	/**
	 * 获取玩家每日任务所有任务的状态
	 */
	public getDayTaskAllTStatus():any{
		return this.daytaskstatus;
	}

	/**
	 * 获取每日任务完成的数量
	 */
	public getDayTaskOverCount():any{
		return this._dayTaskOverNum;
	}

	/**
	 * 是否购买了首充
	 */
	public isHasBuyFRecharge():boolean{
		if(this.frechargerewardday != null){
			return true;
		}
		return false;
	}

	/**
	 * 是否领取过首充奖励,全部领取完毕也包括在内
	 */
	public isHadGetFRechargeRew():boolean{
		if(this.frechargerewardday){
			if((this.frechargerewardday >=2 && this.frechargerewardday <= 9)){
				return true;
			}
		}
		return false;
	}

	/**
	 * 是否领取了今日的首充奖励 
	 */
	public isGetTodayFRechargeRew():boolean{
		if(this.frechargerewardday && this.frechargerewardday == 8){
			return true;
		}
		return false;
	}

	/**
	 * 判断首充奖励是否全部领取完毕（目前是可以领取7天的奖励）
	 */
	public isFRechargeRewGetOver():boolean{
		if(this.frechargerewardday && this.frechargerewardday >= 1 && this.frechargerewardday <=7){
			return false;
		}
		return true;
	}

	/**
	 * 获取首充的领取天数
	 */
	public getFRechargeRewGetDay():number{
		return this.frechargerewardday;
	}

	/**
	 * 设置首充奖励,今日已领取
	 */
	public setFRechargeTodayHasGet():void{
		this.frechargerewardday = 8;
        //FishUtils.Dispatcher.dispatch(FishEvent.USER_FRREWARD_GET_SUCC);
	}

	/**
	 * 获取今日是否已经签到 默认未签到
	 */
	public isTodayHasSign():boolean{
		return this.todayHasSign;
	}

	/**
	 * 设置今日已签到
	 */
	public setTodaySigned(bSigned:boolean):void{
		this.todayHasSign = bSigned;
	}
	/**
	 *  今日签到是否有金豆加成
	 */
	public isSignGoldAddByFRecharge():boolean{
		if(this.signrewardaddremain &&　this.signrewardaddremain>0){
			return true;
		}
		return false;
	}

	/**
	 *  是否未领取过签到的金豆加成
	 */
	public isNotGetFRechargeSignAdd():boolean{
		if(this.signrewardaddremain == 7){
			return true;
		}
		return false;
	}

	/**
	 * 签到成功，如果购买了首充,并且领过首充，则加成剩余天数要减1
	 */
	public signSuccSubSignAddRemin():void{
		if(this.isHasBuyFRecharge()&& this.isHadGetFRechargeRew()){
			if(this.signrewardaddremain){
				this.signrewardaddremain -= 1;
				if(this.signrewardaddremain <0){
					this.signrewardaddremain = 0;
				}
			}
		}
	}


	/**
	 * 设置任务状态为已领取
	 */
	public setTaskHasGetRew(nId:number):void{
		for(let i=0;i<this.daytaskstatus.length;++i){
			if((i+1) == nId){
				this.daytaskstatus[i] = 2;//已领取
			}
		}
		this._calculateOverTaskNum(this.daytaskstatus);
		//FishUtils.Dispatcher.dispatch(FishEvent.USER_DTREWARD_GET_SUCC);
	}
	/**
	 * 增加喇叭消息到聊天记录
	 */
	public addHornTalkRec(msgObj){
		if(!msgObj || !msgObj.nickname || !msgObj.msg) return;

        let time:Date = new Date(msgObj.time);
		let hour:any =  time.getHours();
		let min:any = time.getMinutes();
		let sec:any = time.getSeconds();
		if(hour <10) {
			hour  = "0" + hour;
		}
		if(min < 10){
			min  = "0" + min;
		}
		if(sec < 10){
			sec  = "0" + sec;
		}
		let sTime =  hour + ":" + min + ":" + sec;
		let obj = {time:sTime,name:FishUtils.Base64.decode(msgObj.nickname),msg:msgObj.msg,isUser:true};
		if(this._hornTalkRec.length >= this._hornTalkRecMaxN){
			this._hornTalkRec.shift();
		}
		this._hornTalkRec.push(obj);
		this._hornTalkShowList.push(obj);
		//FishUtils.Dispatcher.dispatch(FishEvent.HORN_TALK_RECORDS_CHANGE,obj);
	}

	/**
	 * Http 回复的喇叭消息记录 
	 */
	public addHornTalkRecByHttp(data):void{
		if(!data || !data.nickname || !data.msg || !data.add_time) return;

		let sTime =  data.add_time.substr(-8);
		let name = data.nickname;
		let msg = data.msg;
		let obj = {time:sTime,name:name,msg:msg,isUser:true};
		if(this._hornTalkRec.length >= this._hornTalkRecMaxN){
			this._hornTalkRec.shift();
		}
		this._hornTalkRec.push(obj);
	}

	/**
	 * 当从Http收到新的喇叭记录时，清除本地的喇叭记录 
	 */
	public cleanLocalHornRecByHttp():void{
		this._hornTalkRec = [];
	}
	
	/**
	 * 设置喇叭记录的最大条数
	 */
	public setHornTalkRecMaxLen(nMax:number):void{
		this._hornTalkRecMaxN = nMax;
	}
	/**
	 * 获取喇叭消息记录列表
	 */
	public getHornTalkRecList():Array<any>{
		return this._hornTalkRec;
	}

	/**
	 * 获取喇叭消息显示列表长度
	 */
	public getHornTalkShowLen():number{
		return this._hornTalkShowList.length;
	}

	/**
	 * 返回喇叭消息显示队列的前面的一条信息
	 */
	public getFrontHornTalkShow():any{
		let msgObj = null;
		if(this._hornTalkShowList.length > 0){
			msgObj = this._hornTalkShowList[0];
			this._hornTalkShowList.shift();
		}
		return msgObj;
	}
	/**
	 * 增加系统消息到聊天记录
	 */
	public addSysTalkRec(msg){
		//系统公告目前就一条
		
		this._sysTalkRec[0] = {msg:msg,isUser:false};
		/*if(this._sysTalkRec.length >= this._sysTalkMaxN){
			this._sysTalkRec.shift();
		}
		this._sysTalkRec.push({msg:msg,isUser:false});
		*/
		//FishUtils.Dispatcher.dispatch(FishEvent.HORN_TALK_RECORDS_CHANGE);
	}

	/**
	 * 获取系统公告
	 */
	public getSysTalkRecList():Array<any>{
		return this._sysTalkRec;
	}

	/**
	 * 设置我的国庆活动信息
	 */
	public setNationalActInfo(_info):void{
		this._nationalInfo = _info;
		//FishUtils.Dispatcher.dispatch(FishEvent.NATIONAL_INFO_CHANGE);
	}

	/**
	 * 获取国庆登录礼包已领取的天数
	 */
	public getNationalGetLoginRewDay():number{
		if(this._nationalInfo && this._nationalInfo.getRewDay ){
			return this._nationalInfo.getRewDay;
		}
		return 0;
	}
	/**
	 * 获取国庆活动今日的礼包是否已领取
	 * (1未领取 2 已领取)
	 */
	public hasGetNationalTodayLoginRew():boolean{
		if(this._nationalInfo && this._nationalInfo.todayGet == 2){
			return true;
		}
		return false;
	}

	/**
	 * 获取国庆邀请的玩家完成5局的数量
	 */
	public getNationalInviteNum():number{
		if(this._nationalInfo && this._nationalInfo.inviteNum ){
			return this._nationalInfo.inviteNum 
		}
		return 0;
	}

	/**
	 * 获取国庆邀请的玩家应获得的奖励红包额度
	 */
	public getNationalInviteRew():number{
		// if(this._nationalInfo && this._nationalInfo.inviteNum ){
		// 	return FishUtils.GameConfig.getNationalInviteRewByNum(this._nationalInfo.inviteNum);
		// }
		return 0;
	}

	/**
	 * 是否领取了国庆邀请活动的奖励
	 * (1未领取 2 已领取)
	 */
	public hasGetNationalInviteRew():boolean{
		if(this._nationalInfo && this._nationalInfo.getInviteRew && this._nationalInfo.getInviteRew == 2 ){
			return true;
		}
		return false;
	}

	/**
	 * 是否领取了新手的钻石奖励
	 */
	public hasGetNewDiamond():boolean{
		if(this.diamondgiftgot == 1){
			return true;
		}
		return false;
	}

	/**
	 * 设置已经领取了新手钻石奖励
	 */
	public setHasGetNewDiamond():void{
		this.diamondgiftgot = 1;
	}
	/**
	 * 设置国庆登录礼领取的天数（领取成功后调用）
	 */
	public setNationalGetLoginRewDay(nDay:number):void{
		this._nationalInfo.getRewDay = nDay;
		this._nationalInfo.todayGet = 2;
	}
	clean():void{
		this._nationalInfo = {getRewDay:0,todayGet:0,inviteNum:0,getInviteRew:0};
		this._hornTalkShowList = [];
		this._hornTalkRec = []
		this._sysTalkRec = [];
		this.uid = 0;
		this.nickname = null;
		this.diamondgiftgot = 0;
		this.money = 0;
		this.gold = null;
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
        this.freshmanredcoinsent=0;
        this.beans=null;
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
		this.daytaskprogress = [0,0];
		this.daytaskstatus = [0,0,0,0,0,0,0];
		this.frechargerewardday = null;
		this.todayHasSign = null;
		this.signrewardaddremain = null;
	}
}