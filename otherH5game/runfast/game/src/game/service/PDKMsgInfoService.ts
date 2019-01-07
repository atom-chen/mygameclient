/**
 *
 * @author 
 *
 */
class PDKMsgInfoService extends PDKService {
    private static _instance: PDKMsgInfoService;
    public static get instance(): PDKMsgInfoService {
        if (this._instance == undefined) {
            this._instance = new PDKMsgInfoService();
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
        
    protected init(): void {        

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
            console.log("getRedCoinData--------------->", response);
            if (response.code == 0) {
                let data = response.data || [];
                if (data) {
                    PDKMsgInfoService.instance.redcoinhttpMsgId = data.next_id
                    PDKMsgInfoService.instance._showInfoQueen = PDKMsgInfoService.instance._showInfoQueen.concat(data.items);
                    let _len = PDKMsgInfoService.instance._showInfoQueen.length;
                    PDKMsgInfoService.instance._oneChouInfo = PDKMsgInfoService.instance._showInfoQueen[_len - 1];
                    console.log("getRedCoinData------->",  PDKMsgInfoService.instance._oneChouInfo)
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
        let _que = PDKMsgInfoService.instance._showInfoQueen;
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
        return PDKMsgInfoService.instance._oneChouInfo;
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
                    PDKMsgInfoService.instance.matchhttpMsgId = data.next_id || 0
                    PDKMsgInfoService.instance.matchChampionMsg = PDKMsgInfoService.instance.matchChampionMsg.concat(data.items);
                    PDKalien.Dispatcher.dispatch(PDKEventNames.SHOW_PAYCHAT);
                }
            }
        }, params, '/notify/matchChampionMsg')
    }

    getAnnouce() {
        let params: any = {};
        this.getData((response: any) => {
            if (response.code == 0) {
                PDKMsgInfoService.instance.announce = response.data;
                // PDKMarqueeText.getInstance().announceplayed = 0;
                if (PDKMsgInfoService.instance.announce && PDKMsgInfoService.instance.announce.length > 0) {
                    PDKMainLogic.instance.selfData.addSysTalkRec(PDKMsgInfoService.instance.announce);
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
}