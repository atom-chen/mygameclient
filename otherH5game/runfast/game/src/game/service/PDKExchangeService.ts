/**
 *
 * @author 
 *
 */
class PDKExchangeService extends PDKService {
    private static _instance: PDKExchangeService;
    public static get instance(): PDKExchangeService {
        if (this._instance == undefined) {
            this._instance = new PDKExchangeService();
        }
        return this._instance;
    }
    private _selfData = PDKMainLogic.instance.selfData
    public _showInfoQueen: Array<any> = [];
    /**
    * 最近最大的一条抽奖记录
    */
    private _oneChouInfo: any = null;
    public matchChampionMsg: Array<any> = [];
    private lotteryIndex;
    private redcoinhttpMsgId;
    private matchhttpMsgId;

    /**
     * 红包兑换的对应的物品信息（goodsid 0:金豆，1：微信红包，3:钻石）
     */
    private _exchangeInfo;

    private _redcoinReqTimer: egret.Timer;

    private _announceReqTimer: egret.Timer;

    private _matchMsgReqTimer: egret.Timer;

    public announce: string; //公告

    public lottery: any
    // private redcoinQueue:any[];
    protected init(): void {
        if (pdkServer._isInDDZ) return;
        pdkServer.addEventListener(PDKEventNames.USER_REDCOIN_EXCHANGE_GOODS_REP, this.onExchangeNotify, this);
        pdkServer.addEventListener(PDKEventNames.USER_LOTTERY_RED_COIN_REP, this.onLotteryRedCoinRep, this, false, 1);
        pdkServer.addEventListener(PDKEventNames.USER_OPERATE_REP, this._onDiamondExchangeRep, this);


        // pdkServer.addEventListener(PDKEventNames.USER_PAY_TO_CHAT_REP,this.onPay2ChatRep,this);

        if (!this._matchMsgReqTimer) {
            this._matchMsgReqTimer = new egret.Timer(1000 * 30);
            this._matchMsgReqTimer.addEventListener(egret.TimerEvent.TIMER, this.getMatchChampion, this);
            this._matchMsgReqTimer.start();
        }

        if (!this._redcoinReqTimer) {
            this._redcoinReqTimer = new egret.Timer(1000 * 30);
            this._redcoinReqTimer.addEventListener(egret.TimerEvent.TIMER, this.getRedCoinData, this);
            this._redcoinReqTimer.start();
        }

        if (!this._announceReqTimer) {
            this._announceReqTimer = new egret.Timer(1000 * 60 * 2);
            this._announceReqTimer.addEventListener(egret.TimerEvent.TIMER, this.getAnnouce, this);
            this._announceReqTimer.start();
        }

        this.getAnnouce();
        this.getRedCoinData();
        this.getMatchChampion();
    }

    deleteAnnounce(): void {
        this.announce = null;
    }

    // private randomPushRedCoinAnimation() {
    //     this._showInfoQueen.push(data);
    //     PDKalien.Dispatcher.dispatch(PDKEventNames.SHOW_PAYCHAT);
    // }
    delLottery(): void {
        let _lottery = this.lottery;
        if (_lottery) {
            this.lottery = { next_id: _lottery.next_id };
        } else {
            this.lottery = null;
        }
    }


    getData(callback: Function = null, params: any = null, tail: string = '/notify/redPackets'): void {
        if (!params) {
            params = {};
        }

        // let url: string = 'http://pl.ddz.htgames.cn:18998//user/sharelist';
        let url: string = PDKGameConfig.WEB_SERVICE_URL + tail;

        let m: Function = PDKalien.Ajax.GET;

        m.call(PDKalien.Ajax, url, params, (content: any) => {
            if (PDKGameConfig.DEBUG) {
                console.log('get:' + content);
            }
            if (callback) {
                let response: any = JSON.parse(content);
                if (response.code > 0) {
                    if (PDKGameConfig.DEBUG) {
                        console.log(url, response.code, response.message);
                    }
                }
                callback(response);
            }
        });
    }

    getRedCoinData() {
        if (this._showInfoQueen && this._showInfoQueen.length > 0) {
            return
        }
        let params: any = {};
        if (this.redcoinhttpMsgId) {
            params.id = this.redcoinhttpMsgId;
        }
        this.getData((response: any) => {            
            if (response.code == 0) {
                let data = response.data || [];
                if (data) {
                    PDKExchangeService.instance.redcoinhttpMsgId = data.next_id
                    PDKExchangeService.instance._showInfoQueen = PDKExchangeService.instance._showInfoQueen.concat(data.items);
                    let _len = PDKExchangeService.instance._showInfoQueen.length;
                    PDKExchangeService.instance._oneChouInfo = PDKExchangeService.instance._showInfoQueen[_len - 1];                    
                    PDKalien.Dispatcher.dispatch(PDKEventNames.SHOW_PAYCHAT);                    
                }               
            }
        }, params)
    }

    /**
     * 获取一条抽奖券信息
     * bFront true:取第一条记录，false:最后一条记录
     */
    getOneChouInfoFromFront(bFront: boolean): any {
        let _info = null;
        let _que = PDKExchangeService.instance._showInfoQueen;
        if (bFront) {
            _info = _que.shift();
        } else {
            let _l = _que.length;
            if (_l > 0) {
                let _info = _que[_l - 1];
                _que.splice(_l - 1, 1);
            }
        }
        return _info;
    }

    /**
     * 获取最近最大的一条抽奖记录
     */
    getOneChouMaxInfo(): any {
        return PDKExchangeService.instance._oneChouInfo;
    }

    getMatchChampion() {
        if (this.matchChampionMsg && this.matchChampionMsg.length > 0) {
            return
        }
        let params: any = {};
        if (this.matchhttpMsgId) {
            params.id = this.matchhttpMsgId;
        }
        this.getData((response: any) => {
            if (response.code == 0) {
                // PDKExchangeService.instance.announce = response.data;
                // if(PDKExchangeService.instance.announce && PDKExchangeService.instance.announce.length > 0){
                // PDKalien.Dispatcher.dispatch(PDKEventNames.SHOW_ANNOUNCE);
                // }else{
                //     PDKalien.Dispatcher.dispatch(PDKEventNames.HIDE_ANNOUNCE);
                // }
                let data = response.data || [];
                if (data) {
                    // this._complete_amount = data.total_items_finished;
                    // this._source = data.current_items || [];
                    PDKExchangeService.instance.matchhttpMsgId = data.next_id || 0
                    PDKExchangeService.instance.matchChampionMsg = PDKExchangeService.instance.matchChampionMsg.concat(data.items);
                    PDKalien.Dispatcher.dispatch(PDKEventNames.SHOW_PAYCHAT);
                    // egret.Timer
                }
            }
        }, params, '/notify/matchChampionMsg')
    }

    getAnnouce() {
        let params: any = {};
        this.getData((response: any) => {
            if (response.code == 0) {
                PDKExchangeService.instance.announce = response.data;
                // PDKMarqueeText.getInstance().announceplayed = 0;
                if (PDKExchangeService.instance.announce && PDKExchangeService.instance.announce.length > 0) {
                    PDKMainLogic.instance.selfData.addSysTalkRec(PDKExchangeService.instance.announce);
                    PDKalien.Dispatcher.dispatch(PDKEventNames.SHOW_ANNOUNCE);
                }
            }
        }, params, '/msg/notice')
    }

    getLottery() {
        let params: any = {};
        if (this.lottery) {
            params.id = this.lottery.next_id;
        }
        this.getData((response: any) => {
            if (response.code == 0) {
                this.lottery = response.data;
                // MarqueeText.getInstance().announceplayed = 0;
                if (this.lottery && this.lottery.nickname) {
                    PDKalien.Dispatcher.dispatch(PDKEventNames.SHOW_LOTTERY);
                }
            }
        }, params, '/lottery/roll');
    }

    private _alertWithFollowCourse(info: string, bToHistory: boolean = false): void {
        let _alert = PDKPanelAlert3.instance;
        let _textFlow = (new egret.HtmlTextParser).parser(info)

        _alert.show(info, 0, function (act) {
            if (bToHistory) {
                PDKPanelExchange2.instance.show(5);
            }
            /* if(act == "cancel"){ //关注公众号
                PDKPanelFollowCourse.instance.show();
             }*/
        });

        //_alert.btnCancel.labelIcon = "room_getRedCourse";
    }

    //zhu 兑换红包成功提示
    private onExchangeRedSucc(): void {
        let _info = "兑换" + this._exchangeInfo.amount + "元红包成功,请到 <font color='#FF0000'>" + "兑换记录 </font>领取";
        this._alertWithFollowCourse(_info);
    }

    //zhu 兑换话费成功提示
    private onExchangeHuaFeiSucc(): void {
        let _info = "兑换" + this._exchangeInfo.amount + "元话费成功,请到 <font color='#FF0000'>" + "兑换记录 </font>领取";
        this._alertWithFollowCourse(_info, true);
    }

    private onExchangeHFKSucc(): void {
        let _info = "兑换" + this._exchangeInfo.amount + "元话费充值卡成功,请到 <font color='#FF0000'>" + "兑换记录 </font>领取";
        this._alertWithFollowCourse(_info, true);
    }

    private onExchangeJDKSucc(): void {
        let _info = "兑换" + this._exchangeInfo.amount + "元京东卡成功,请到 <font color='#FF0000'>" + "兑换记录 </font>领取";
        this._alertWithFollowCourse(_info, true);
    }

    private onExchangeAliSucc(): void {
        let _info = "兑换" + this._exchangeInfo.amount + "元支付宝红包成功,请到 <font color='#FF0000'>" + "兑换记录 </font>领取";
        this._alertWithFollowCourse(_info, true);
    }

    private onExchangeNotify(event: egret.Event): void {
        let data: any = event.data;

        //        PDKAlert.show(PDKlang.exchange_redcoin[data.result],0,this.onConfirm);
        //        PDKAlert3.show(PDKlang.exchange_redcoin[data.result], this.onConfirm, "common_btn_add_favorite_n");
        // 0 成功 1 配置不存在 2 “ 访问数据库失败

        switch (data.result) {
            case 0:
                if (this._exchangeInfo) {
                    if (this._exchangeInfo.goodsid == 1) { //兑换微信红包
                        this.onExchangeRedSucc();
                    } else if (this._exchangeInfo.goodsid == 4) { //话费
                        this.onExchangeHuaFeiSucc();
                    } else if (this._exchangeInfo.goodsid == 6) { //话费卡
                        this.onExchangeHFKSucc();
                    } else if (this._exchangeInfo.goodsid == 5) { //京东卡
                        this.onExchangeJDKSucc();
                    } else if (this._exchangeInfo.goodsid == 7) { //支付宝
                        this.onExchangeAliSucc();
                    }
                    else if (this._exchangeInfo.item_type == 3) {
                        PDKAlert3.show("兑换" + this._exchangeInfo.num + "钻石成功", null, "pdk_common_btn_lab_confirm_h");
                    } else if (this._exchangeInfo.item_type == 1) {
                        PDKAlert3.show("兑换" + this._exchangeInfo.num + "金豆成功", this.onConfirm, "pdk_common_btn_lab_confirm_h");
                    }

                    if (this._exchangeInfo.first) {
                        PDKMainLogic.instance.selfData.rcminexcchanceused = 1;
                        PDKPanelExchange2.instance.flashData(true);
                    } else {
                        PDKPanelExchange2.instance.flashData();
                    }
                }
                else {
                    PDKAlert3.show(PDKlang.exchange_redcoin[data.result], this.onConfirm, "pdk_common_btn_lab_confirm_h");
                }
                break;
            case 1:
                PDKAlert3.show(PDKlang.exchange_redcoin[data.result], this.onConfirm, "pdk_common_btn_lab_confirm_h");
                break;
            case 2:
                PDKAlert3.show(PDKlang.exchange_redcoin[data.result], this.onConfirm, "pdk_common_btn_lab_confirm_h");
                break;
            case 3:
                PDKAlert3.show(PDKlang.exchange_redcoin[data.result], this.onConfirm, "pdk_common_btn_lab_confirm_h");
                break;
            case 4:
                PDKAlert3.show(PDKlang.exchange_redcoin[data.result], null, "pdk_common_btn_lab_confirm_h");
                break;

        }
        this._exchangeInfo = null;
    }

    private onConfirm() {

    }

    private onLotteryRedCoinRep(event: egret.Event) {
        let data: any = event.data;

        switch (data.result) {
            case 0:

                //                 PDKAlert.show(PDKlang.exchange_redcoin[data.result]);
                pdkServer.getRedcoinRankingListReq();
                PDKAlert.show("恭喜获得" + PDKUtils.exchangeRatio(data.coin / 100, true) + "奖杯!");
                this._selfData.wincnt.forEach((val, idx) => {
                    if (this.lotteryIndex != null && this.lotteryIndex == val.roomid) {
                        val.chance -= 1;
                        // PDKMainLogic.instance.selfData.redcoin = PDKMainLogic.instance.selfData.redcoin + data.coin;
                        PDKalien.Dispatcher.dispatch(PDKEventNames.USER_RED_COUNT_CHANGE, { count: val.chance });
                        //PanelExchange1.instance.flashData();
                    }

                });

                break;
            case 1:
                PDKAlert.show("配置不存在");

                break;
            case 2:
                PDKAlert.show("抽奖次数不足");

                break;
            case 3:
                PDKAlert.show("你有未完成的兑换");
                break;
        }
        this.lotteryIndex = null
    }

    private onPay2ChatRep(event: egret.Event) {
        let data: any = event.data;
        if (data.type == 3) {
            this._showInfoQueen.push(data);
            PDKalien.Dispatcher.dispatch(PDKEventNames.SHOW_PAYCHAT);
        }
    }


    /**
     *  红包兑换物品
     */
    doRedExchange(_info) {
        this._exchangeInfo = _info;
        pdkServer.redcoinExchangeGoodsReq(_info.id);
    }

    doChou(roomid: number): void {
        if (this.lotteryIndex != null)
            return
        this.lotteryIndex = roomid;
        pdkServer.lotteryRedCoinReq(roomid);
    }

    /**
     * 钻石兑换物品回调
     */
    _onDiamondExchangeRep(e: egret.Event): void {
        let _data = e.data;
        if (_data) {
            if (_data.optype == 1) {
                if (_data.result == null) {
                    PDKAlert.show("兑换金豆成功");
                }
            }
        }
    }
}