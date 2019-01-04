/**
 *
 * @author 
 *
 */
class ExchangeService extends Service {
    private static _instance: ExchangeService;
    public static get instance(): ExchangeService {
        if(this._instance == undefined) {
            this._instance = new ExchangeService();
        }
        return this._instance;
    }
    private _selfData = MainLogic.instance.selfData
    public _showInfoQueen: Array<any> = [];
    /**
     * 最近最大的一条抽奖记录
     */
    private _oneChouInfo:any = null;
    public matchChampionMsg: Array<any> = [];
    private lotteryIndex;
    private redcoinhttpMsgId;
    private matchhttpMsgId;

    /**
     * 红包兑换的对应的物品信息（goodsid 0:金豆，1：微信红包，3:钻石）
     */
    private _exchangeInfo;

    private _redcoinReqTimer: number = null;

    private _announceReqTimer: number = null;

    private _matchMsgReqTimer: number = null;

    private _lotteryReqTimer: number = null;

    public announce:string; //公告

    public lottery:any
    // private redcoinQueue:any[];
    protected init(): void {
        server.addEventListener(EventNames.USER_REDCOIN_EXCHANGE_GOODS_REP,this.onExchangeNotify,this);
        server.addEventListener(EventNames.USER_LOTTERY_RED_COIN_REP,this.onLotteryRedCoinRep,this,false,1);
        server.addEventListener(EventNames.USER_OPERATE_REP,this._onDiamondExchangeRep,this);


        // server.addEventListener(EventNames.USER_PAY_TO_CHAT_REP,this.onPay2ChatRep,this);
        
        if(!this._matchMsgReqTimer){
            this._matchMsgReqTimer = alien.Schedule.setInterval(this.getMatchChampion, this,1000*60);
        }

        if(!this._redcoinReqTimer){
            this._redcoinReqTimer = alien.Schedule.setInterval(this.getRedCoinData, this, 1000 * 30);
        }

        if(!this._announceReqTimer){
            this._announceReqTimer = alien.Schedule.setInterval(this.getAnnouce, this, 1000 * 60 * 2);
        }
        
       if(!this._lotteryReqTimer){
            this._lotteryReqTimer = alien.Schedule.setInterval( this.getLottery, this, 1000 * 60);
        }

        this.getAnnouce();
        this.getRedCoinData();
        this.getMatchChampion();
        this.getLottery();
    }

    deleteAnnounce():void{
        this.announce = null;
    }

    delLottery():void{
        let _lottery = this.lottery;
        if(_lottery){
            this.lottery = {next_id:_lottery.next_id};
        }else{
            this.lottery = null;
        }
    }
    // private randomPushRedCoinAnimation() {
    //     this._showInfoQueen.push(data);
    //     alien.Dispatcher.dispatch(EventNames.SHOW_PAYCHAT);
    // }


    getData(callback: Function = null,params: any = null, tail:string = '/notify/redPackets'): void {
        if(!params) {
            params = {};
        }

		// let url: string = 'http://pl.ddz.htgames.cn:18998//user/sharelist';
        let url: string = GameConfig.WEB_SERVICE_URL + tail;

        let m: Function = alien.Ajax.GET;

        m.call(alien.Ajax,url,params,(content: any) => {
            if(GameConfig.DEBUG) {
                console.log('get:' + content);
            }
            if(callback) {
                let response: any = JSON.parse(content);
                if(response.code > 0) {
                    if(GameConfig.DEBUG) {
                        console.log(url,response.code,response.message);
                    }
                }
                callback(response);
            }
        });
    }

	getRedCoinData() {
        if(this._showInfoQueen && this._showInfoQueen.length > 0){
            return
        }
		let params: any = {};
        if(this.redcoinhttpMsgId){
            params.id = this.redcoinhttpMsgId;
        }
		this.getData((response: any)=> {
			if (response.code == 0) {
				let data = response.data || [];
				if(data && data.total_items >0){
                    ExchangeService.instance.redcoinhttpMsgId = data.next_id
					ExchangeService.instance._showInfoQueen = ExchangeService.instance._showInfoQueen.concat(data.items);
                    let _len = ExchangeService.instance._showInfoQueen.length;
                    ExchangeService.instance._oneChouInfo = ExchangeService.instance._showInfoQueen[_len-1];
                    alien.Dispatcher.dispatch(EventNames.SHOW_PAYCHAT);
				}
			}
		}, params)
	}
    
    /**
     * 获取一条抽奖券信息
     * bFront true:取第一条记录，false:最后一条记录
     */
    getOneChouInfoFromFront(bFront:boolean):any{
        let _info = null;
        let _que = ExchangeService.instance._showInfoQueen;
        if(bFront){
            _info = _que.shift();
        }else{
            let _l = _que.length;
            if(_l > 0){
                let _info = _que[_l-1];
                _que.splice(_l - 1,1);
            }
        }
        return _info;
    }

    /**
     * 获取最近最大的一条抽奖记录
     */
    getOneChouMaxInfo():any{
        return ExchangeService.instance._oneChouInfo;
    }
    
    getMatchChampion() {
		let params: any = {};
        if(this.matchhttpMsgId){
            params.id = this.matchhttpMsgId;
        }
		this.getData((response: any)=> {
			if (response.code == 0) {
                let data = response.data || [];
				if(data){
                    ExchangeService.instance.matchhttpMsgId = data.next_id || 0
                    ExchangeService.instance.matchChampionMsg = ExchangeService.instance.matchChampionMsg.concat(data.items);
                    alien.Dispatcher.dispatch(EventNames.SHOW_PAYCHAT);
				}
			}
		}, params, '/notify/matchChampionMsg')
	}

    getAnnouce() {
		let params: any = {};
		this.getData((response: any)=> {
			if (response.code == 0) {
                ExchangeService.instance.announce = response.data;
                if(ExchangeService.instance.announce && ExchangeService.instance.announce.length > 0){
                    MainLogic.instance.selfData.addSysTalkRec(ExchangeService.instance.announce);
                    alien.Dispatcher.dispatch(EventNames.SHOW_ANNOUNCE);
                }
			}
		}, params, '/msg/notice')
	}

    getLottery(){
		let params: any = {};
        if(this.lottery){
            params.id =this.lottery.next_id; 
        }
		this.getData((response: any)=> {
			if (response.code == 0) {
                this.lottery = response.data;
                // MarqueeText.getInstance().announceplayed = 0;
                if(this.lottery && this.lottery.nickname){
                    alien.Dispatcher.dispatch(EventNames.SHOW_LOTTERY);
                }
			}
		}, params, '/lottery/roll');
    } 

    private _alertWithFollowCourse(info:string,args:any):void{
        let _alert = PanelAlert3.instance;
		// let _textFlow = (new egret.HtmlTextParser).parser(info)
        let _btnNum = 0;
        let bToHistory = args.toHistory;
        let toRedCourse = args.toRedCourse;
        if(!bToHistory){
            _btnNum = 1;
        }
        _alert.show(info,_btnNum,function(act){
            if(bToHistory){
                PanelExchange2.instance.show(5);
            }
            if(act == "cancel" && toRedCourse){ //关注公众号
                let _redCourseUrl = GameConfig.getCfgByField("custom.redFollowUrl");
               GameConfig.toUrl(_redCourseUrl);
            }
        });

        if(toRedCourse){
            _alert.btnCancel.labelIcon = "room_getRedCourse";
        }
    }

    //zhu 兑换红包成功提示
    private onExchangeRedSucc():void{
        let _info = "兑换" + this._exchangeInfo.amount+ "微信红包成功，请在(好手气斗地主)公众号领取";
        this._alertWithFollowCourse(_info,{toRedCourse:true});
    }

    //zhu 兑换话费成功提示
    private onExchangeHuaFeiSucc():void{
        let _info = "兑换" + this._exchangeInfo.amount+ "元话费成功,请到 <font color='#FF0000'>"+ "兑换记录 </font>领取";
        this._alertWithFollowCourse(_info,{toHistory:true});
    }

    private onExchangeHFKSucc():void{
        let _info = "兑换" + this._exchangeInfo.amount+ "元话费充值卡成功,请到 <font color='#FF0000'>"+ "兑换记录 </font>领取";
        this._alertWithFollowCourse(_info,{toHistory:true});
    }

    private onExchangeJDKSucc():void{
        let _info = "兑换" + this._exchangeInfo.amount+ "元京东卡成功,请到 <font color='#FF0000'>"+ "兑换记录 </font>领取";
        this._alertWithFollowCourse(_info,{toHistory:true});
    }

    private onExchangeAliSucc():void{
        let _info = "兑换" + this._exchangeInfo.amount+ "支付宝红包成功,请到 <font color='#FF0000'>"+ "兑换记录 </font>领取";
        this._alertWithFollowCourse(_info,{toHistory:true});
    }

    private onExchangeDiamondSucc(): void{ 
        let cfgCode = GameConfig.getCfgByField("webCfg.diamondsCode");
        if(cfgCode == 1){
            let _info = "兑换" + this._exchangeInfo.num+ "钻石成功,请到<font color=0xff0000>" + "兑换记录</font>领取";
            this._alertWithFollowCourse(_info,{toHistory:true});
        }else{
            Alert3.show("兑换" + this._exchangeInfo.num +"钻石成功",this.onConfirm,"common_btn_lab_confirm");
        }       
    }

    private onExchangeNotify(event: egret.Event): void {
        let data: any = event.data;
        switch(data.result) {
            case 0:
                if(this._exchangeInfo) {
                    if(this._exchangeInfo.goodsid ==1){ //兑换微信红包
                        this.onExchangeRedSucc();
                    }else if(this._exchangeInfo.goodsid == 4){ //话费
                        this.onExchangeHuaFeiSucc();
                    }else if(this._exchangeInfo.goodsid == 6){ //话费卡
                        this.onExchangeHFKSucc();
                    }else if(this._exchangeInfo.goodsid == 5){ //京东卡
                        this.onExchangeJDKSucc();
                    }else if(this._exchangeInfo.goodsid == 7){ //支付宝
                        this.onExchangeAliSucc();
                    }else if(this._exchangeInfo.item_type == 3){  // 钻石
                        this.onExchangeDiamondSucc();
                        // Alert3.show("兑换" + this._exchangeInfo.num +"钻石成功,请到兑换记录领取！", (data) => {},"common_btn_lab_confirm");
                    }else if(this._exchangeInfo.item_type == 1){
                        Alert3.show("兑换" + this._exchangeInfo.num +"金豆成功",this.onConfirm,"common_btn_lab_confirm");
                    }
                    
                    if(this._exchangeInfo.first){
                        MainLogic.instance.selfData.rcminexcchanceused = 1;
                        MainLogic.instance.selfData.rcminexcexpiretime = null;
                        PanelExchange2.instance.flashData(true);
                    }else{
                        PanelExchange2.instance.flashData();
                    }
                }
                else {
                    Alert3.show(lang.exchange_redcoin[data.result],this.onConfirm,"common_btn_lab_confirm");
                }
                break;
            case 1:
                Alert3.show(lang.exchange_redcoin[data.result],this.onConfirm,"common_btn_lab_confirm");
                break;
            case 2:
                Alert3.show(lang.exchange_redcoin[data.result],this.onConfirm,"common_btn_lab_confirm");
                break;
            case 3:
                Alert3.show(lang.exchange_redcoin[data.result],this.onConfirm,"common_btn_lab_confirm");
                break;
            case 4:
                Alert3.show(lang.exchange_redcoin[data.result],null,"common_btn_lab_confirm");
                break;

        }
        this._exchangeInfo = null;
    }

    private onConfirm() {

    }

    private onLotteryRedCoinRep(event: egret.Event) {
        let data: any = event.data;

        switch(data.result) {
            case 0:
                if(data.coin && data.coin >0){
                    server.getRedcoinRankingListReq();
                    Alert.show("恭喜获得" + Utils.exchangeRatio(data.coin / 100,true) + "奖杯!");
                    if(data.roomid){ //老的抽奖券
                       /*服务器会主动推送变化后的
                        this._selfData.wincnt.forEach((val,idx) => {
                            if(this.lotteryIndex != null && this.lotteryIndex == val.roomid) {
                                val.chance -= 1;
                            }
                        });
                        */
                        if(data.roomid == 1001){
                            MainLogic.instance.selfData.subNewGoldRedNum();
                        }
                    }else{//新的抽奖券
                        MainLogic.instance.selfData.subNewGoldRedNum();
                    }
                    alien.Dispatcher.dispatch(EventNames.USER_RED_COUNT_CHANGE);
                }else if(data.gold && data.gold >0){
                    Alert.show("恭喜获得" + data.gold + "金豆!");
                }

                break;
            case 1:
                Alert.show("配置不存在");

                break;
            case 2:
                Alert.show("抽奖次数不足");

                break;
        }
        this.lotteryIndex = null
    }

    private onPay2ChatRep(event: egret.Event) {
        let data: any = event.data;
        if(data.type == 3) {
            this._showInfoQueen.push(data);
            alien.Dispatcher.dispatch(EventNames.SHOW_PAYCHAT);
        }
    }


    /**
     *  红包兑换物品
     */
    doRedExchange(_info){
        this._exchangeInfo = _info;
        if(_info.money > 0 || _info.coin > 0){ //奖券兑换
            server.redcoinExchangeGoodsReq(_info.id);
        }else if(_info.diamond && _info.diamond >0){ //钻石兑换
            server.diamondExchangeGoodsReq(_info.id);
        }
    }

    /**
     * 先抽新手王炸
     */
    doChouWangZha():boolean{
        let _num = MainLogic.instance.selfData.getWangZhaRedNum();
        if(_num>0){ //王炸红包
            server.reqWangZhaRedRew();
            return true;
        }
        return false;
    }


    /**
     * 抽金豆场合并后的红包，
     */
    doChouNewGold():boolean{
        let _redArr = MainLogic.instance.selfData.getNewGoldRed();
        if(_redArr.length >=2){
            if(_redArr[1]>0){
                server.reqNewGoldRedRew();
                return true;
            }
        }
        return false;
    }

    /**
     * 抽普通房间的红包
     * 
     */
    doChou(roomid: number): void {
        if(this.lotteryIndex != null)
            return
        this.lotteryIndex = roomid;
        server.lotteryRedCoinReq(roomid);
    }

    /**
     * 钻石兑换物品回调
     */
    _onDiamondExchangeRep(e:egret.Event):void{
        let _data = e.data;
        if(_data){
            if(_data.optype == 1){
                if(_data.result ==null){
                    Alert3.show("兑换" + this._exchangeInfo.num +"金豆成功",this.onConfirm,"common_btn_lab_confirm");
                }
            }
        }
    }
}