/**
 * Created by lenovo on 2014/6/21.
 *
 * 游戏配置
 */

class GameConfig {
	static DEBUG:boolean = false;         //debug模式?在url里传入

	static IS_NATIVE_DEBUG: boolean = false; // native模式下的debug开关
	static IS_NATIVE_SHOW_TIP: boolean = true; // native模式下的显示更新提示的开关
	static gameName:string = 'ddz';       //游戏名
	static gameAlice:string = 'ddz';      //游戏别名
	static gameId:number = 1;             //游戏ID
	static platform:string = 'bode';      //入驻的平台

	static CHAT_COUNT_DOWN:number = 1;    //聊天时间冷冻

	static CARD_SCALE:number = 1;         //卡牌缩放
	static CARD_WIDTH:number = 140;       //卡牌宽度
	static CARD_HEIGHT:number = 178;      //卡牌高度
	static CARD_GAP_H:number = 50;        //卡牌横向间隔
	static CARD_GAP_V:number = 100;       //卡牌纵向间隔
	static CARD_OFFSET:number;

	//各种地址配置
	//static SERVER_URL:string = 'ws://10.101.1.219:9001/ws';
//    static SERVER_URL: string = 'ws://10.101.1.150:9001/ws';

	//static SERVER_URL:string = 'ws://10.101.1.63:9001/ws';
	
	static SERVER_URL:string = 'ws://192.168.1.15:9001/ws';
	static SERVER_URL_TAIL:string;
    static WX_LOGIN_URL: string = 'http://www.htgames.cn/zhanghaichuan';
    static WEB_SERVICE_URL: string = "http://192.168.1.7:8081/";//'http://kungu.ngrok.club/';
//    static WEB_SERVICE_URL: string = 'http://u169j32762.iok.la/';
	static REPORT_URL:string = 'http://120.27.162.46:8866/_.gif';
	static RESOURCE_URL:string = 'http://192.168.0.81/laoqifeng/platform/';
	static RECHARGE_URL:string = 'http://pay.exunsoul.com:8998/index/pay?account=';

	static REGISTER_URL:string = 'http://reg.gamebode.com/regist.html';
	static PASSWORD_URL:string = 'http://reg.gamebode.com/motify.html';
	static HOME_PAGE_URL:string = 'http://reg.gamebode.com/index.html';
	static DOWNLOAD_PAGE_URL:string = 'http://reg.gamebode.com/index.html';
	static LOBBY_PAGE_URL:string = 'http://reg.gamebode.com/game_list_1.html';
    static EXCHANGE_URL: string = 'http://192.168.0.86:8998/coin/index';
    
	static almsConfig:any;                //救济金配置
    static signInRewardConfig: any;        //签到奖励配置
	static currencyRatio:number = 1;      //前/后端金豆比率
	static rechargeRatio:number = 1000;  //人民币/金豆比率
    static exchangeRatio: number = 100;  //人民币/红包比例比率
    static wxService:string="";
	static extendWX:string =""; //推广的微信号
	static loginAppRew:any = null; //登录App奖励 配置为字符串，需要解析成数组
	static lotteryMaxNum:number = 1000;//单次最多可以投入多少

	static rid2gt:any ; //房间列表映射的gameName
	/**
	 * 表情列表
	 */
    static _browList:any;                  
	/**
	 * 每日任务
	 */
	static _dayTaskList:any;    
	/**
	 * 首充奖励配置 
	 */      
	static _fRechargeCfg:any;

	/**
	 * 分享的奖励
	 */
	static _dayShareCfg:any;

	/**
	 * 钻石兑换物品的配置
	 */
	static _diamondExCfg:any;

	static roomList:any;                  //房间列表
	static matchConfig:any;               //比赛配置
	static goodsConfig:any;               //物品配置
	static rechargeConfig:any;            //充值配置
    static exchangeConfig: any;           //兑换配置
    static exchangeGoodsConfig: any;      //兑换物品配置
	static cardsRecorderConfig:any;       //记牌器购买配置

	static testcards:any;

	static personalGameConfig: any;      //自定义游戏
	static testers:any;
	static dbsConfig:any;
	static nationalCfg:any; //国庆活动配置
	static roomListBak:any; //房间列表备份
	static chatCost:any; //聊天消耗配置
	static allCfgs:any; //所有的配置
	static newYearCfg:{yearGift:any,yearTask:any,yearWork:any}; //新年活动配置

	static matchRoundscore: any = null;
	static _curMatchRank:number = 0;	
	static fishTask:any; //	捕鱼任务
	/**
	 * 物品名称
	 */
	static _itemName={
		[0]:"金豆",
		[1]:"奖杯",
		[2]:"记牌器",
		[3]:"钻石",
		[101]:"表情免费次数",
		[41001]:"初级场奖杯抽奖机会",
		[41002]:"中级场奖杯抽奖机会",
		[41003]:"高级场奖杯抽奖机会"
	}

	/**
	 * 仅限于普通游戏配置,不适用比赛,只读
	 * roomId:0则传回所有的房间配置
	 */
	static getRoomCfgByGameId(gameId:number,roomId:number):any{
		let games = this.getCfgByField("allGamesCfg");
		let cfgs = games[gameId];
		if(cfgs){
			if(roomId == 0){
				return cfgs.rooms;
			}
			let len = cfgs.rooms.length;
			for(let i=0;i<len;++i){
				if(cfgs.rooms[i].roomID == roomId){
					return cfgs.rooms[i];
				}
			}
		}
		return null;
	}

	/**
	 * 获取房间配置
	 * @param id
	 * @returns {any}
	 */
	static getRoomConfigById(id:number):any{
		let ret;
		this.roomList.forEach((room:any)=>{
			if(room.roomID == id){
				ret = room;
				return true;
			}
		});

		return ret;
	}

	/**
	 * 获取房间配置
	 * @param id
	 * roomFlag 1:金豆场 2:钻石场
	 * @returns {any}
	 */
	static getSuitableRoomConfig(gold:number,roomFlag:number =1):any{
		for(var i = 0; i < this.roomList.length; ++i){
			let room = this.roomList[i];
			if(room.roomType == 1 && room.roomFlag == roomFlag && room.maxScore > gold && room.minScore <= gold ){
				return room;
			}
		}
		return null;
	}

	/**
	 * 获取房间配置
	 * @param id
	 * @returns {any}
	 */
	static getRoomConfigByMatchId(id:number):any{
		for(var i = 0; i < this.roomList.length; ++i){
			if(this.roomList[i].matchId == id){
				return this.roomList[i];
			}
		}
	}

	static setMatchSignupFlag(matchid:number, signupFlag:number):void{
		this.roomList.forEach((room:any)=>{
			if(room.matchId == matchid){
				room.is_signup = signupFlag;
			}
		});
	}

	static anyMatchSignuped():boolean{
		for(var i = 0; i < this.roomList.length; ++i){
			if(this.roomList[i].is_signup > 0){
				return true;
			}
		}
		return false;
	}

	/**
	 * 获取房间配置
	 * @param id
	 * @returns {any}
	 */
	static getRoomConfig(id:number):any{
		let room:any = this.getRoomConfigById(id);
		if(!room){
			room = this.getRoomConfigByMatchId(id);
		}

		return room;
	}

	/**
	 * 获取比赛配置
	 * @param id
	 * @returns {any}
	 */
	static getMatchConfigById(id:number):any{
		for(let key in this.matchConfig){
			if(parseInt(key) == id){
				return this.matchConfig[key];
			}
		}
	}

	/**
	 * 初始化配置
	 */
	static init():void{
		lang = new Language(RES.getRes('lang'));

		this.CARD_WIDTH *= this.CARD_SCALE;
		this.CARD_HEIGHT *= this.CARD_SCALE;
		this.CARD_GAP_H *= this.CARD_SCALE;
		this.CARD_OFFSET = this.CARD_WIDTH - this.CARD_GAP_H;
		
		//GameConfig.testcards = JSON.parse(egret.localStorage.getItem('testcards'));
	}

	static urlData:any;
	static getUrl(callback:Function):void{
		alien.Ajax.GET((this.DEBUG ? this.RESOURCE_URL : lang.config_url) + 'geturl.php', {}, (response:any)=>{
			let data:any = JSON.parse(response);
			//console.log('>>>>>>>>>>' + response);

			if(!this.DEBUG){
				GameConfig.WEB_SERVICE_URL = data.WEB_SERVICE_URL;//"http://192.168.0.120:8090/"
                GameConfig.WX_LOGIN_URL = data.WX_LOGIN_URL;
				GameConfig.RESOURCE_URL = data.RESOURCE_URL;

				//zhu GameConfig.REPORT_URL = data.REPORT_URL;
				GameConfig.RECHARGE_URL = data.RECHARGE_URL;
				GameConfig.REGISTER_URL = data.REGISTER_URL;
				GameConfig.PASSWORD_URL = data.PASSWORD_URL;
				GameConfig.HOME_PAGE_URL = data.HOME_PAGE_URL;
				GameConfig.DOWNLOAD_PAGE_URL = data.DOWNLOAD_PAGE_URL;
				GameConfig.LOBBY_PAGE_URL = data.LOBBY_PAGE_URL;
			}
         
            console.log('WX_LOGIN_URL:' + GameConfig.WX_LOGIN_URL);
			console.log('WEB_SERVICE_URL:' + GameConfig.WEB_SERVICE_URL);
			console.log('RESOURCE_URL:' + GameConfig.RESOURCE_URL);
			console.log('RECHARGE_URL:' + GameConfig.RECHARGE_URL);
            GameConfig.urlData=data;
            callback();
		},()=>{
            webService.postError(ErrorConfig.CONFIG_LOAD_ERROR,'geturl.php');
		});
	}
	
    static getUrlData(callback: Function): void {
        callback(GameConfig.urlData);
    }

	/**
	 * 初始化游戏服务器地址
	 */
	static initServer(ws:string):void{
		if(DEBUG||(lang.debug == "true")){
			let localUrl: string = alien.localStorage.getItem('server_url');
			if(localUrl){
				ws = localUrl;
			}
		}
		this.SERVER_URL = ws;
		this.SERVER_URL ="ws://129.28.92.229:9001/ws";//ws;//
		console.log("SERVER_URL===>",this.SERVER_URL);
		this.init_SERVER_URL_TAIL();
	}

	static init_SERVER_URL_TAIL():void{
		let s = GameConfig.SERVER_URL;
		let arr = s.split('.');
		let _s1 = arr[0];
		let _b = _s1.substr(_s1.length - 1);		
		GameConfig.SERVER_URL_TAIL =_b;
		console.log('SERVER_URL_TAIL===>', GameConfig.SERVER_URL_TAIL);
	}

	static getServerUrl(uid:number, callback:Function, onError:Function):void{
				/*zhu 走php 接口获取
		let localUrl: string = alien.localStorage.getItem('server_url');
		if (localUrl) {
			GameConfig.SERVER_URL = localUrl;
			console.log('SERVER_URL:' + GameConfig.SERVER_URL);
			callback({code: 0});
		} else {
			alien.Ajax.GET((this.DEBUG ? this.RESOURCE_URL : lang.config_url) + 'getserverurl.php', {uid}, (response: any)=> {
				console.log('response:' + response);
				// 处理下字符串 如果第一个是0xfeff的 过滤掉
				let resp: string = response;
				let firstCode = resp.charCodeAt(0);
				console.log('response 0:' + firstCode);
				if (firstCode < 0x20 || firstCode > 0x7f) {
					console.log('response get sp char');
					resp = resp.substring(1); // 去除第一个字符
					console.log('response:' + resp);
				}
				let data: any = JSON.parse(resp);
				console.log('data code:' + data.code);
				if (data.code == 0) {
					if (!DEBUG) {
						  GameConfig.SERVER_URL = data.data;
						  GameConfig.init_SERVER_URL_TAIL();
					}
					
					console.log('SERVER_URL:' + GameConfig.SERVER_URL);
					
				}
				callback(data);
			}, onError);
		}
		// GameConfig.init_SERVER_URL_TAIL();
				*/
	}

	/**
	 * 重置房间列表配置
	 */
	static resetRoomList():void{
		this.roomList = JSON.parse(JSON.stringify(this.roomListBak));
	}

	/**
	* 格式化聊天配置 服务器下发的数组是0,1锁定
	*/
	static _formatChatCost(cfg):any{
		let _ret = {};
		let item = null;
		for(let k in cfg){
			item = cfg[k].split(":");
			_ret[Number(k)+1] = {id:Number(item[0]),cost:Number(item[1])}; 
		}
		return _ret;
	}
	
	/**
	 * 解析分享的奖励的配置 
	 */
	static parseShareRewardCfg():void{
		let _share = this.dbsConfig.day_share_reward.split("|");
		if(_share){
			let _allShare = {};
			let _item = null;
			for(let i=0;i<_share.length;++i){
				_item = _share[i].split(":");
				_allShare[_item[0]] = parseInt(_item[1]); 
			}
			this._dayShareCfg = _allShare;
		}
	}

	/**
	 * 新年礼盒,新年任务,新年上班礼包
	 */
	private static _formatNewYearCfg(cfg:any):void{
		if(!cfg) return;
		
		let _cfg = cfg;
		let _len = _cfg.length;
		this.newYearCfg = {yearGift:null,yearTask:null,yearWork:null};
		for(let i=0;i<_len;++i){
			if(_cfg[i].id ==5){ //新年礼盒
				this.newYearCfg.yearGift = cfg[i];
			}else if(_cfg[i].id == 6){//新年任务
				this.newYearCfg.yearTask = cfg[i];
			}else if(_cfg[i].id == 4){ //新年上班礼包
				this.newYearCfg.yearWork = cfg[i];
			}
		} 
	}

	/**
	 * 获取所有的web的配置的信息
	 */
	public static getInviteActInfo(callback:any = null):void{
		webService.getInviteActInfo((jInfo)=>{
			this.setCfgByField("webCfg",jInfo);
			if(callback){
				callback();
			}
		});
	}

	/**
	 * 获取商城中兑换支付宝红包的信息
	 */
	public static getExAliRedInfo():void{
		webService.getExchangeAliInfo((jInfo)=>{
			this.setCfgByField("aliRedInfo",jInfo);
		});
	}

	private static _formatRooms(games:any):void{
		let allGamesCfg = {};
		games.forEach(element => {
			allGamesCfg[element.gameID] = element;
		});

		let texasholdemCfg:any = allGamesCfg[5];
		let ddz3PCfg:any = allGamesCfg[1];
		let ddz2PCfg:any =  allGamesCfg[8];
		let rooms = ddz3PCfg.rooms.concat(ddz2PCfg.rooms).concat(texasholdemCfg.rooms);
		
		let goldRooms = [];
		let diamondRooms = [];
		this.roomList = rooms.sort((r1:any, r2:any):number=>{
			return r1.roomID - r2.roomID;
		});

		this.roomList.forEach(element=>{
			if(element.roomType == 1){
				if(element.roomFlag == 1){
					goldRooms.push(element);
				}else{
					diamondRooms.push(element);
				}
			}
		})

		let pdkMatchRooms = this.getPdkMatchCfg(allGamesCfg[9]);
		this.roomList = this.roomList.concat(pdkMatchRooms)
		this.roomListBak = this.roomList;
		this.setCfgByField("goldRooms",goldRooms);
		this.setCfgByField("diamondRooms",diamondRooms);
		this.setCfgByField("allGamesCfg",allGamesCfg);
	}

	private static getPdkMatchCfg(allgamesgfg) {
		let _pdkMatchRooms = [];
		allgamesgfg.rooms.forEach(element=>{
			if(element.roomType == 2){
				_pdkMatchRooms.push(element);
			}
		})
		return _pdkMatchRooms;
	}

	public static getRoomCfgFromAll(roomId:number):any{
		let cfg = this.allCfgs["allGamesCfg"];
		if(cfg){
			let rooms = null;
			for (let k in cfg){
				rooms = cfg[k].rooms;
				if(rooms){
					for(let i in rooms) {
						if(rooms[i].roomID == roomId){
							return rooms[i]
						}
					}
				}
			} 
		}
		return null;
	}

	/**
	 * 加载游戏配置
	 * @param callback
	 */
	static loadConfigs(callback:Function):void{
		SceneLoading.setLoadingText("加载配置。。。");
		this.allCfgs = {};
		alien.Ajax.GET((this.DEBUG ? this.RESOURCE_URL : lang.config_url) + 'config.php', {id: this.gameId}, (response:any)=>{
			let data:any = JSON.parse(response);
			//console.log('>>>>>>>>>>' + response);
			this.allCfgs = data;
			this.dbsConfig = data.dbs_config;
			this.rid2gt = data.rid2gt;
			this.chatCost = GameConfig._formatChatCost(this.dbsConfig.chat_consume);
			let custom:any = data.custom;
			this.almsConfig = this.dbsConfig.alms;
			//分享的奖励
			this._dayShareCfg =  this.dbsConfig.day_share_reward;
			this.parseShareRewardCfg();
			this._diamondExCfg = this.dbsConfig.diamond_exc;
			GameConfig._formatNewYearCfg(data.activity_config);

			this.currencyRatio = custom.currency_ratio;
			this.rechargeRatio = custom.recharge_ratio;
            this.exchangeRatio = custom.exchange_ratio;
			this.lotteryMaxNum = custom.lotteryMaxNum;
			lang.exchange_roomid = custom.exchange_roomid;
			
			//this.loginAppRew  = this.dbsConfig.login_app_reward;
			//zhu 下载app奖励配置改成多个物品
			let _rew = this.dbsConfig.login_app_reward.split("|");
			if(_rew){
				let _allRew = {};
				let _item = null;
				for(let i=0;i<_rew.length;++i){
					_item = _rew[i].split(":");
					_allRew[_item[0]] = parseInt(_item[1]); 
				}
				this.loginAppRew = _allRew;
			}

			//this.nationalCfg  = data.national_day_config;
			//this._formatNationalLoginRewCfg();

            this.wxService = custom.qq;
			this.extendWX  = custom.extendWX;

            this.signInRewardConfig = this.dbsConfig.daysignin.map((item: string) => {
                return Utils.parseGoodsString(item);
            });

			this._formatRooms(data.game);
			this._browList = data.game_prop;
			this._dayTaskList = data.day_task;
			this._dayTaskList = this._dayTaskList.filter(function(item){
				if(!item){
					return false;
				}
				return true;
			})
			this._formatTaskInfo();
			GameConfig._formatFRechargeDays(this.dbsConfig.firstrechargereward.reward);
			this.matchConfig = data.match;
			this.goodsConfig = data.goods;
			this.rechargeConfig = data.recharge;
            this.exchangeConfig = data.red_coin_exchange;
            this.exchangeGoodsConfig = data.red_coin_goods;
			this.personalGameConfig = data.personalgame;
			this.testers = data.testers;
			this.cardsRecorderConfig = data.cards_recorder_buy_option;
			this._formatRedCoinExchange();
			callback(data);
		});
	}

	private static _formatRedCoinExchange():void{
		this.allCfgs["red_coin_exchange"] = {};
		this.exchangeConfig.forEach((item)=>{
			this.allCfgs["red_coin_exchange"][item.goodsid] = this.allCfgs["red_coin_exchange"][item.goodsid] || {};
			this.allCfgs["red_coin_exchange"][item.goodsid][item.amount] = item;
		});
	}

	private static _formatTaskInfo():void{
		let _newTaskInfo = {};
		let _list = this._dayTaskList;
		let _len = _list.length;
		for(let i=0;i<_len;++i){
			_newTaskInfo[_list[i].id] = _list[i];
		}
		this.setCfgByField("newTaskInfo",_newTaskInfo);
	}

	/**
	 * 格式化国庆登录礼包
	 */
	static _formatNationalLoginRewCfg():void{
		let _daysignin = {}
		let _id = 0;
		let _num = 0;
		let _item = null;
		let sign = this.nationalCfg.daysignin;
		for(let i= 0;i<sign.length;++i){
			_item = sign[i].split(":");
			_id = Number(_item[0]);
			_num = Number(_item[1]);
			_daysignin[i+1] ={id:_id,num:_num};
		}
		this.nationalCfg.daysignin = _daysignin;
	}

	/**
	 *  格式化首充配置 字符串转为{}
	 */
	static _formatFRechargeDays(cfgs:any):void{
		let _oneInfo = null;
		let _obj = {};
		let _item = null;
		for(let i=0;i<cfgs.length;++i){
			_oneInfo = cfgs[i].split("|");
			_obj[i] = [];
			for(let j=0;j<_oneInfo.length;++j){
				_item = _oneInfo[j].split(":")
				_obj[i].push({id:parseInt(_item[0]),num:parseInt(_item[1])});
			}
		}
		
		this._fRechargeCfg = _obj;
	}
	/**
	 * 根据id获取表情配置 
	 * currency:货币类型 0:金豆
	 * price:价格
	 */
	static getBrowCfgById(nId:number):any{
		let info:any = null;
		if(this._browList){
			for(let i =0;i<this._browList.length;++i){
				if(nId == this._browList[i].id){
					return {id:this._browList[i].id,currency:this._browList[i].currency,price:this._browList[i].price};
				}
			}
		}
		return info;
	}

	/**
	 * 获取任务列表
	 */
	static getDayTaskList():any{
		return this._dayTaskList;
	}
	/**
	 * 获取首充某天的奖励配置
	 */
	static getFRechargeRewByDay(nDay:number):any{
		if(nDay<1) return null;

		if(this._fRechargeCfg && this._fRechargeCfg[nDay-1]){
			return 	this._fRechargeCfg[nDay-1];
		}
		
		return null;
	}

	/**
	 *  获取首充礼包信息
	 */
	static getFRechargeInfo():any{
		for(let i=0;i<GameConfig.rechargeConfig.length;++i){
			if(GameConfig.rechargeConfig[i].firstrecharge){
				return GameConfig.rechargeConfig[i];
			}
		}
		LogUtil.error("getFRechargeInfo------error----->");
		return null;
	}

	/**
	 * 获取充值配置的信息
	 */
	static getRechargeInfoByProductId(product_id:number):any{
		for(let i=0;i<GameConfig.rechargeConfig.length;++i){
			if(GameConfig.rechargeConfig[i].product_id == product_id){
				return GameConfig.rechargeConfig[i];
			}
		}
		
		LogUtil.error("getRechargeInfoByProductId------error----->");
		return null;
	}

	/**
	 * 获取登录App的奖励数量
	 */
	static getLoginAppRew():any{
		return this.loginAppRew;
	}

	/**
	 * 获取物品的名称
	 */
	static getItemNameById(nId:number):string{
		let _name = this._itemName[nId];
		if(_name){
			return _name; 
		}
		return null;
	}

	/**
	 * 获取下载App的奖励描述
	 */
	static getLoginAppRewText():string{
		if(this.loginAppRew){
			let _all = "";
			let _Name = null;
			for(let id in this.loginAppRew){
				_Name = this.getItemNameById(Number(id));
				if(_Name){
					_all += _Name + "x" + this.loginAppRew[id] + "\n";
				}
			}
			return _all;
		}
		return "";
	}
	/**
	 * 获取国庆活动的配置
	 */
	static getNationalCfg():any{
		return this.nationalCfg;
	}

	/**
	 * 判断是否在国庆期间
	 */
	static isInNationalTime():any{
		//配置的时间是秒为单位的时间戳
		let _obj = {isInTime:false,isBefore:false,isAfter:false};
		if(this.nationalCfg && this.nationalCfg.trigger_time && this.nationalCfg.finish_time){
			let curTimeStamp = new Date().getTime();
			let startTStamp = this.nationalCfg.trigger_time * 1000;
			let endTStamp = this.nationalCfg.finish_time * 1000;
			if(curTimeStamp >= startTStamp && endTStamp >= curTimeStamp){
				 _obj.isInTime = true;
			}
			else{
				if(curTimeStamp<startTStamp){ //活动未开始
					_obj.isInTime = false;
					_obj.isBefore = true;
					_obj.isAfter = false;
				}
				else if(curTimeStamp > endTStamp){ //活动已过期
					_obj.isInTime = false;
					_obj.isBefore = false;
					_obj.isAfter = true;
				}
			}
		}

		return _obj;
	}

	/**
	 * 获取是否到了领取国庆邀请玩家的奖励
	 */
	static isTimeToGetNationalInviteRew():boolean{
		//配置的时间是秒为单位的时间戳
		if(this.nationalCfg && this.nationalCfg.finish_time){
			let curTimeStamp = new Date().getTime();
			let endTStamp = this.nationalCfg.finish_time * 1000;
			if(curTimeStamp >= endTStamp ){
				return true;
			}
		}
		return false;
	}

	/**
	 * 根据国庆期间邀请玩家完成的5局的人数计算邀请获得的奖励
	 */
	static getNationalInviteRewByNum(num:number):number{
		if(this.nationalCfg && this.nationalCfg.invite && this.nationalCfg.invite.length == 4){
			let _data = this.nationalCfg.invite;
			let n1 = _data[0].e;
			let n2 = _data[1].e;
			let n3 = _data[2].e;
			let n4 = _data[3].e;
			let r1 = _data[0].reward * 0.01;
			let r2 = _data[1].reward * 0.01
			let r3 = _data[2].reward * 0.01
			let r4 = _data[3].reward * 0.01

			if(num <=n1){
				return num * r1;
			}
			else if(num <= n2)
			{
				return (num-n1) * r2 + r1 * n1;
			}
			else if(num <=n3){
				return n1 * r1 + r2 * (n2-n1)  + (num - n2) * r3;
			}
			else if(num <= n4){
				return n1 * r1 + r2 * (n2-n1)  + (n3 - n2) * r3 + (num - n3) * r4;
			}
			else{
				return n1 * r1 + (n2 - n1) * r2 + (n3 -n2) *r3 + (n4 -n3) * r4 ;
			}
		}
		return 0;
	}

	/**
	 * 根据领取国庆登录礼包的天数获取对应的奖励描述
	 */
	static getNationalLoginRewByDay(day:number):string{
		if(this.nationalCfg &&this.nationalCfg.daysignin && this.nationalCfg.daysignin[day]){
			let _info = this.nationalCfg.daysignin[day];
			if(_info){
				let _text = {
					[0]:"金豆x{0}",
					[1]:"奖杯x{0}",
					[2]:"记牌器x{0}小时",
					[101]:"表情免费次数x{0}次"
				}
				let _desc = _text[_info.id];
				let _num = _info.num;
				if(_info.id == 1){
					_num = _num * 0.01;
				}
				if(_desc){
					_desc = _desc.replace("{0}",_num);
					return _desc;
				}
			}
		}
		return null;
	}

	/**
	 * 获取是否要展示国庆活动按钮
	 */
	static shouldShowNationalBtn():boolean{
		let _date = "2017-09-30 23:50:00";
		let _showTimeStamp = new Date(Date.parse(_date.replace(/-/g, "/"))).getTime();
		let _curTimeStamp = new Date().getTime();
		if(_curTimeStamp >= _showTimeStamp){	
			return true;
		}
		return false;
	}

	/**
	 * 获取是否领取国庆邀请奖励超时
	 * 2017.10.15
	 */
	static getNationalInviteRewTimeOut():boolean{
		let _date = "2017-10-15 00:00:00";
		let _outTimeStamp = new Date(Date.parse(_date.replace(/-/g, "/"))).getTime();
		let _curTimeStamp = new Date().getTime();
		if(_curTimeStamp >= _outTimeStamp){	
			return true;
		}
		return false;
	}

	/**
	 * 是否在某个活动时间期间
	 */
	static isBetweenTime(cfg:any):any{
		let _obj = {isInTime:false,isBefore:false,isAfter:false};
		if(cfg && cfg.trigger_time && cfg.finish_time){
			let curTimeStamp = server.getServerStamp();

			let _startMonth = cfg.trigger_time["1"];
			let _startDay = cfg.trigger_time["2"];
			
			let _endMonth = cfg.finish_time["1"];
			let _endDay = cfg.finish_time["2"];

			let _start = "2018/"+_startMonth +"/" + _startDay + " 00:00:00";
			let _startTimeStamp = new Date(Date.parse(_start)).getTime();
			let _end = "2018/"+_endMonth +"/" + _endDay + " 00:00:00";
			let _endTimeStamp = new Date(Date.parse(_end)).getTime();

			if(curTimeStamp < _startTimeStamp){
				_obj.isBefore = true;
			}else if(curTimeStamp >= _endTimeStamp){
				_obj.isAfter = true;
			}else{
				_obj.isInTime = true;
			}
		}
		return _obj;
	}

	/**
	 * 获取新年礼盒的配置
	 */
	static getNewYearGift():any{
		return this.newYearCfg.yearGift;
	}

	/**
	 * 是否在新年礼盒期间
	 */
	static isInNewYearGift():any{
		return this.isBetweenTime(this.newYearCfg.yearGift);
	}

	/**
	 * 是否在新年礼盒购买期间
	 */
	static isInNewYearBuyGift():any{
		let cfg = null;
		cfg = {};
		cfg.trigger_time = this.newYearCfg.yearGift.trigger_time;
		cfg.finish_time = this.newYearCfg.yearGift.recharge_finish_time;
		return this.isBetweenTime(cfg);
	}

	/**
	 * 是否在新年任务时间
	 */
	static isInNewYearTask():any{
		return this.isBetweenTime(this.newYearCfg.yearTask);
	}

	/**
	 * 是否在新年开工礼期间
	 */
	static isInNewYearWork():any{
		return this.isBetweenTime(this.newYearCfg.yearWork);
	}

	/**
	 * 新年任务
	 */
	static getNewYearTask():any{
		return this.newYearCfg.yearTask;
	}

	/**
	 * 新年开工礼包
	 */
	static getNewYearWork():any{
		return this.newYearCfg.yearWork;
	}

	/**
	* 根据聊天类型获取聊天消耗配置
	* 1:免费 2:需要广播
	*/
	static getChatCostInfoByType(nType):any{
		if(this.chatCost && this.chatCost[nType]){
			return this.chatCost[nType];
		}
		return null;
	}

	/**
	 * zhu 复制微信公众号
	 * str：要复制的文本
	 * sTip:微信号、公众号
	 * bAlert:是否提示复制成功
	 */
	static copyText(parent:any,str,sTip,bToast:boolean = false):void{
		let copyString = str;
		let _shouldTip = bToast;
		if (!alien.Native.instance.isNative) {
			let _input = document.getElementById("ddzCopyTex");
			let _button = document.getElementById("ddzCopyBtn");
			_input.style.visibility = "visible"
			_input["value"] = copyString;
			let clipboard = new Clipboard('.copyBtn');
			let _succFunc = ()=>{
				if(_shouldTip){
					Toast.show("复制" + sTip +"成功");
				}else{
					Alert.show("复制"+ sTip + "成功!");
				}
			};

			let _failFunc = ()=>{
				Alert.show("复制"+ sTip + "失败");
			}

			clipboard.once('success', _succFunc);
			clipboard.once('error', _failFunc);
			_button.click();
			_input.style.visibility = "hidden";
		} else {
			alien.Native.instance.toClipboard(copyString);
			if(_shouldTip){
				Toast.show("复制" + sTip +"成功");
			}else{
				Alert.show("复制"+ sTip + "成功!");
			}
		}
	}

	/**
	 * 获取分享奖励的配置
	 */
	static getShareRewCfg():any{
		return this._dayShareCfg;
	}

	/**
	 * 获取钻石兑换物品的配置
	 */
	static getDiamondExCfg():void{
		return this._diamondExCfg;
	}

	/**
	 * 通过房间号获取对应的游戏名称
	 */
	static getRid2gt(roomId:number):string{
		if(this.rid2gt && this.rid2gt[roomId]){
			return this.rid2gt[roomId];
		}
		return null;
	}

	private static getField(cfg,field):void{
		let _info = null;
		if( typeof(field) == "string"  ){
			_info = cfg[field];
			return _info;
		}else{
			let i = 0;
			if(cfg[field[i]]){
				if(field.length <=1){
					_info = cfg[field[i]];
					return _info;
				}else{
					_info = GameConfig.getField(cfg[field[i]],field.slice(i+1));
				}
			}
		}
		return _info;
	}
	/**
	 * 获取某个配置
	 * sField:string
	 */
	static getCfgByField(sField:any):any{
		let _arr = sField.split(".");
		let _info = null;
		_info =  GameConfig.getField(this.allCfgs,_arr)
		return _info;
	}

	/**
	 * 设置某个配置
	 * sField:string
	 */
	static setCfgByField(sField:any,data:any):void{
		return this.allCfgs[sField] = data;
	}

	static toUrl(url:string):void{
		let _nativeBridge = alien.Native.instance;
		if(_nativeBridge.isNative){
			_nativeBridge.openUrlBySys(url)
		}else{
			window.top.location.href = url;
		}
	}

	/**
	 * H5 下载APP
	 */
	static downApp():void{
		let _url= this.getCfgByField("urlCfg.downAppUrl");
		this.toUrl(_url);
	}
	
	/**
	 * 话费充值查询教程页面
	 */
	static toFeiUrl():void{
		let _url= this.getCfgByField("urlCfg.queryFeiUrl");
		this.toUrl(_url);
	}

	/**
	 * 支付宝红包教程页面
	 */
	static toAliRedUrl():void{
		let _url= this.getCfgByField("urlCfg.aliRedFollowUrl");
		this.toUrl(_url);
	}

	/**
	 * 话费充值卡使用教程页面
	 */
	static toFeiCardUrl():void{
		let _url= this.getCfgByField("urlCfg.queryFeiCardUrl");
		this.toUrl(_url);
	}

	/**
	 *京东卡使用教程页面
	 */
	static toJDCardUrl():void{
		let _url= this.getCfgByField("urlCfg.queryJDUrl");
		this.toUrl(_url);
	}

	/**
	 * 关注公众号的页面
	 */
	static toWatchWXUrl():void{
		let _url = this.getCfgByField("urlCfg.watchWXUrl");
		this.toUrl(_url);
	}

	/**
	 * 显示客服
	 */
	static showKeFu():void{
		let _str = GameConfig.wxService
        let _ins = PanelAlert3.instance;
		let _info = "如有问题或宝贵意见，请联系客服。\n我们将会非常重视，感谢你！\n";
		let btnNum = 0;
		if(_str.length > 1){
			_info += "微信客服："+ _str +"\n";
			btnNum = 1;
		}
		_info += "客服电话：400-178-1766\n";
		_info += "客服工作时间：周一到周五(9:00-18:00)";
		
        _ins.show(_info,btnNum,function(act){
            if(act == "confirm"){
				if(_ins.btnConfirm.labelIcon == "room_report"){
					Reportor.instance.toReportPage();
				}else{
                	GameConfig.copyText(this.parent, _str, "微信号(" + _str + ")");
				}
            }else if(act == "cancel"){
                Reportor.instance.toReportPage();
            }
        },true);
        
		if(btnNum == 1){
			_ins.btnConfirm.labelIcon = "common_copyWX";
		}else{
			_ins.btnConfirm.labelIcon = "room_report";
		}
        _ins.btnCancel.labelIcon = "room_report";
	}

	/**
	 * 获取金豆复活礼包购买的信息
	 */
	static getGoldReviveMaxBuy():number{
		/*let _cfg = GameConfig.rechargeConfig;
		for(let i =0;i<_cfg.length;++i){
			if(_cfg[i].product_id == 10023){
				return _cfg[i].maxBuyNum;
			}
		}*/
		return 9999;
	}

	/**
	 * 是否显示邀请活动
	 */
	static shouldShowInviteAct():boolean{
		if(alien.Native.instance.isNative){
			return true;
		}
		return false;
	}

	/**
	 * 我自己的专属连接
	 */
	static getMySelfUrl():string{
		let userData: UserData = UserData.instance;
        var sk: string = userData.getSk();
        if(!sk){
            sk = "";
        }
		let _url = GameConfig.WX_LOGIN_URL + "?state=3&"+"share_sk=" + sk;

		return _url;
	}

	/**
	 * 获取游戏中跳转的url的配置
	 */
	static initGameUrlsCfg(callback:Function):void{	
		webService.getGameUrlsCfg((cfgs)=>{
			this.allCfgs["urlCfg"] = cfgs;
			this.getInviteActInfo(()=>{
				callback();
			});
		})
	}
}

let lang:Language;