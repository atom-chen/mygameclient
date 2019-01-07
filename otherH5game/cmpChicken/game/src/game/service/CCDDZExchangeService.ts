/**
 *
 * @author 
 *
 */
class CCDDZExchangeService extends CCService {
    private static _instance: CCDDZExchangeService;
    public static get instance(): CCDDZExchangeService {
        if (this._instance == undefined) {
            this._instance = new CCDDZExchangeService();
        }
        return this._instance;
    }
    private _selfData = CCDDZMainLogic.instance.selfData
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

    private _lotteryReqTimer: egret.Timer;

    public announce: string; //公告

    public lottery: any
    // private redcoinQueue:any[];
    protected init(): void {
        if (ccserver._isInDDZ) return;
        ccserver.addEventListener(CCGlobalEventNames.USER_REDCOIN_EXCHANGE_GOODS_REP, this.onExchangeNotify, this);
        ccserver.addEventListener(CCGlobalEventNames.USER_LOTTERY_RED_COIN_REP, this.onLotteryRedCoinRep, this, false, 1);
        ccserver.addEventListener(CCGlobalEventNames.USER_OPERATE_REP, this._onDiamondExchangeRep, this);


        // ccserver.addEventListener(CCGlobalEventNames.USER_PAY_TO_CHAT_REP,this.onPay2ChatRep,this);

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

        if (!this._lotteryReqTimer) {
            this._lotteryReqTimer = new egret.Timer(1000 * 60);
            this._lotteryReqTimer.addEventListener(egret.TimerEvent.TIMER, this.getLottery, this);
            this._lotteryReqTimer.start();
        }

        this.getAnnouce();
        this.getRedCoinData();
        this.getMatchChampion();
        this.getLottery();
    }

    deleteAnnounce(): void {
        this.announce = null;
    }

    delLottery(): void {
        let _lottery = this.lottery;
        if (_lottery) {
            this.lottery = { next_id: _lottery.next_id };
        } else {
            this.lottery = null;
        }
    }
    // private randomPushRedCoinAnimation() {
    //     this._showInfoQueen.push(data);
    //     CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.SHOW_PAYCHAT);
    // }


    getData(callback: Function = null, params: any = null, tail: string = '/notify/redPackets'): void {
        if (!params) {
            params = {};
        }

        // let url: string = 'http://pl.ddz.htgames.cn:18998//user/sharelist';
        let url: string = CCGlobalGameConfig.WEB_SERVICE_URL + tail;

        let m: Function = CCalien.Ajax.GET;

        m.call(CCalien.Ajax, url, params, (content: any) => {
            if (CCGlobalGameConfig.DEBUG) {
                console.log('get:' + content);
            }
            if (callback) {
                let response: any = JSON.parse(content);
                if (response.code > 0) {
                    if (CCGlobalGameConfig.DEBUG) {
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
                if (data && data.total_items > 0) {
                    CCDDZExchangeService.instance.redcoinhttpMsgId = data.next_id
                    CCDDZExchangeService.instance._showInfoQueen = CCDDZExchangeService.instance._showInfoQueen.concat(data.items);
                    let _len = CCDDZExchangeService.instance._showInfoQueen.length;
                    CCDDZExchangeService.instance._oneChouInfo = CCDDZExchangeService.instance._showInfoQueen[_len - 1];
                    CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.SHOW_PAYCHAT);
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
        let _que = CCDDZExchangeService.instance._showInfoQueen;
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
        return CCDDZExchangeService.instance._oneChouInfo;
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
                let data = response.data || [];
                if (data) {
                    CCDDZExchangeService.instance.matchhttpMsgId = data.next_id || 0
                    CCDDZExchangeService.instance.matchChampionMsg = CCDDZExchangeService.instance.matchChampionMsg.concat(data.items);
                    CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.SHOW_PAYCHAT);
                }
            }
        }, params, '/notify/matchChampionMsg')
    }

    getAnnouce() {
        let params: any = {};
        this.getData((response: any) => {
            if (response.code == 0) {
                CCDDZExchangeService.instance.announce = response.data;
                if (CCDDZExchangeService.instance.announce && CCDDZExchangeService.instance.announce.length > 0) {
                    CCDDZMainLogic.instance.selfData.addSysTalkRec(CCDDZExchangeService.instance.announce);
                    CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.SHOW_ANNOUNCE);
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
                // CCDDZMarqueeText.getInstance().announceplayed = 0;
                if (this.lottery && this.lottery.nickname) {
                    CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.SHOW_LOTTERY);
                }
            }
        }, params, '/lottery/roll');
    }

    private _alertWithFollowCourse(info: string, args: any): void {
        let _alert = CCDDZPanelAlert3.instance;
        // let _textFlow = (new egret.HtmlTextParser).parser(info)
        let _btnNum = 0;
        let bToHistory = args.toHistory;
        let toRedCourse = args.toRedCourse;
        if (!bToHistory) {
            _btnNum = 1;
        }
        _alert.show(info, _btnNum, function (act) {
            if (bToHistory) {
                CCDDZPanelExchange2.instance.show(5);
            }
            if (act == "cancel" && toRedCourse) { //关注公众号
                let _redCourseUrl = CCGlobalGameConfig.getCfgByField("custom.redFollowUrl");
                CCGlobalGameConfig.toUrl(_redCourseUrl);
            }
        });

        if (toRedCourse) {
            _alert.btnCancel.labelIcon = "cc_room_getRedCourse";
        }
    }

    //zhu 兑换红包成功提示
    private onExchangeRedSucc(): void {
        let _info = "兑换" + this._exchangeInfo.amount + "微信红包成功，请在(好手气斗地主)公众号领取";
        this._alertWithFollowCourse(_info, { toRedCourse: true });
    }

    //zhu 兑换话费成功提示
    private onExchangeHuaFeiSucc(): void {
        let _info = "兑换" + this._exchangeInfo.amount + "元话费成功,请到 <font color='#FF0000'>" + "兑换记录 </font>领取";
        this._alertWithFollowCourse(_info, { toHistory: true });
    }

    private onExchangeHFKSucc(): void {
        let _info = "兑换" + this._exchangeInfo.amount + "元话费充值卡成功,请到 <font color='#FF0000'>" + "兑换记录 </font>领取";
        this._alertWithFollowCourse(_info, { toHistory: true });
    }

    private onExchangeJDKSucc(): void {
        let _info = "兑换" + this._exchangeInfo.amount + "元京东卡成功,请到 <font color='#FF0000'>" + "兑换记录 </font>领取";
        this._alertWithFollowCourse(_info, { toHistory: true });
    }

    private onExchangeAliSucc(): void {
        let _info = "兑换" + this._exchangeInfo.amount + "支付宝红包成功,请到 <font color='#FF0000'>" + "兑换记录 </font>领取";
        this._alertWithFollowCourse(_info, { toHistory: true });
    }

    private onExchangeDiamondSucc(): void {
        let cfgCode = CCGlobalGameConfig.getCfgByField("webCfg.diamondsCode");
        if (cfgCode == 1) {
            let _info = "兑换" + this._exchangeInfo.num + "钻石成功,请到<font color=0xff0000>" + "兑换记录</font>领取";
            this._alertWithFollowCourse(_info, { toHistory: true });
        } else {
            CCDDZAlert3.show("兑换" + this._exchangeInfo.num + "钻石成功", this.onConfirm, "cc_common_btn_lab_confirm_n");
        }
    }

    private onExchangeNotify(event: egret.Event): void {
        let data: any = event.data;
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
                    } else if (this._exchangeInfo.item_type == 3) {  // 钻石
                        this.onExchangeDiamondSucc();
                        // CCDDZAlert3.show("兑换" + this._exchangeInfo.num +"钻石成功,请到兑换记录领取！", (data) => {},"cc_common_btn_lab_confirm_n");
                    } else if (this._exchangeInfo.item_type == 1) {
                        CCDDZAlert3.show("兑换" + this._exchangeInfo.num + "金豆成功", this.onConfirm, "cc_common_btn_lab_confirm_n");
                    }

                    if (this._exchangeInfo.first) {
                        CCDDZMainLogic.instance.selfData.rcminexcchanceused = 1;
                        CCDDZMainLogic.instance.selfData.rcminexcexpiretime = null;
                        CCDDZPanelExchange2.instance.flashData(true);
                    } else {
                        CCDDZPanelExchange2.instance.flashData();
                    }
                }
                else {
                    CCDDZAlert3.show(lang.exchange_redcoin[data.result], this.onConfirm, "cc_common_btn_lab_confirm_n");
                }
                break;
            case 1:
                CCDDZAlert3.show(lang.exchange_redcoin[data.result], this.onConfirm, "cc_common_btn_lab_confirm_n");
                break;
            case 2:
                CCDDZAlert3.show(lang.exchange_redcoin[data.result], this.onConfirm, "cc_common_btn_lab_confirm_n");
                break;
            case 3:
                CCDDZAlert3.show(lang.exchange_redcoin[data.result], this.onConfirm, "cc_common_btn_lab_confirm_n");
                break;
            case 4:
                CCDDZAlert3.show(lang.exchange_redcoin[data.result], null, "cc_common_btn_lab_confirm_n");
                break;

        }
        this._exchangeInfo = null;
    }

    private onConfirm() {

    }

    private onLotteryRedCoinRep(event: egret.Event) {
        if (ccserver._isInDDZ) return;
        let data: any = event.data;

        switch (data.result) {
            case 0:
                if (data.coin && data.coin > 0) {
                    ccserver.getRedcoinRankingListReq();
                    CCDDZAlert.show("恭喜获得" + CCDDZUtils.exchangeRatio(data.coin / 100, true) + "奖杯!");

                    this._selfData.wincnt.forEach((val, idx) => {
                        if (this.lotteryIndex != null && this.lotteryIndex == val.roomid) {
                            val.chance -= 1;
                            CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.USER_RED_COUNT_CHANGE, { count: val.chance });
                        }
                    });
                } else if (data.gold && data.gold > 0) {
                    CCDDZAlert.show("恭喜获得" + data.gold + "金豆!");
                }
                break;
            case 1:
                CCDDZAlert.show("配置不存在");

                break;
            case 2:
                CCDDZAlert.show("抽奖次数不足");

                break;
        }
        this.lotteryIndex = null
    }

    private onPay2ChatRep(event: egret.Event) {
        let data: any = event.data;
        if (data.type == 3) {
            this._showInfoQueen.push(data);
            CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.SHOW_PAYCHAT);
        }
    }


    /**
     *  红包兑换物品
     */
    doRedExchange(_info) {
        this._exchangeInfo = _info;
        if (_info.money > 0 || _info.coin > 0) { //奖券兑换
            ccserver.redcoinExchangeGoodsReq(_info.id);
        } else if (_info.diamond && _info.diamond > 0) { //钻石兑换
            ccserver.diamondExchangeGoodsReq(_info.id);
        }
    }

    /**
     * 先抽新手王炸
     */
    doChouWangZha(): boolean {
        let _num = CCDDZMainLogic.instance.selfData.getWangZhaRedNum();
        if (_num > 0) { //王炸红包
            ccserver.reqWangZhaRedRew();
            return true;
        }
        return false;
    }


    /**
     * 抽金豆场合并后的红包，
     */
    doChouNewGold(): boolean {
        let _redArr = CCDDZMainLogic.instance.selfData.getNewGoldRed();
        if (_redArr.length >= 2) {
            if (_redArr[1] > 0) {
                ccserver.reqNewGoldRedRew();
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
        if (this.lotteryIndex != null)
            return
        this.lotteryIndex = roomid;
        ccserver.lotteryRedCoinReq(roomid);
    }

    /**
     * 钻石兑换物品回调
     */
    _onDiamondExchangeRep(e: egret.Event): void {
        let _data = e.data;
        if (_data) {
            if (_data.optype == 1) {
                if (_data.result == null) {
                    CCDDZAlert3.show("兑换" + this._exchangeInfo.num + "金豆成功", this.onConfirm, "cc_common_btn_lab_confirm_n");
                }
            }
        }
    }
}