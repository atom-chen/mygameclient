/**
 * Created by rockyl on 16/2/26.
 *
 * 游戏场景
 */

class ScenePDKPlay extends PDKalien.SceneBase {
    private _newTable: boolean;
    private _timerClean: any;
    private _timerDelayJoin: any;
    private _showResultTimeOutId: number;
    private _showResultTimeOutId1: number;
    private _redProcessTimeOutId: number;
    private _reconnectIn: boolean;

    private ruleReadedFlag: eui.Image;

    private _askPlayCardCount: number = 0;
    private _tfMatchPlayInfo: any[];
    private _cache: any[] = [];

    private _roomInfo: any;
    private _isNewRed: boolean;
    private _seats: PDKDDZSeat[] = [];
    private _mySeat: PDKMySeat;
    private labWaiting: eui.Label;
    private btnHang: eui.CheckBox;
    private grpButton: eui.Group;
    private masterCards: PDKMasterCards;
    private buttonBar: PDKButtonBar;
    private rectMask: eui.Rect;

    private btnContinue: PDKStateButton;
    private cdProgressBar: PDKCDProgressBar;
    /**
     * 比赛轮数局数信息
     */
    private labMatchInfo: eui.Label;
    private labelMatchInfo: eui.Label;
    private grpBg: eui.Group;
    private grpTopButton: eui.Group;
    private seat1: PDKRightSeat;// 右边的位置
    private seat2: PDKLeftSeat;// 左边的位置
    private seat0: PDKMySeat;
    private grpRed: eui.Group;

    private redList: eui.List;
    // private redTip: eui.Label;
    private redCount: eui.Label;
    private redListDataProvider: eui.ArrayCollection;
    private redListDataArr: Array<number>;
    //zhu private grpRedWarn:eui.Group;
    private redLeftCount: eui.Label;

    private dragonHongBao: PDKDragonHongBao;
    private dragonHongBaoWarn: PDKDragonHongBaoWarn;
    private dragonZhaDan: PDKDragonGameZhaDan;
    private dragonFeiJi: PDKDragonGameFeiJi;
    private dragonMyLianDui: PDKDragonGameLianDui;
    private dragonRightLianDui: PDKDragonGameLianDui;
    private dragonLeftLianDui: PDKDragonGameLianDui;
    private dragonMyShunZi: PDKDragonGameShunZi;
    private dragonRightShunZi: PDKDragonGameShunZi;
    private dragonLeftShunZi: PDKDragonGameShunZi;
    private dragonMySanDaiYi: PDKDragonGameSanDaiYi;
    private dragonLeftSanDaiYi: PDKDragonGameSanDaiYi;
    private dragonRightSanDaiYi: PDKDragonGameSanDaiYi;
    private dragonMySanDaiEr: PDKDragonGameSanDaiEr;
    private dragonLeftSanDaiEr: PDKDragonGameSanDaiEr;
    private dragonRightSanDaiEr: PDKDragonGameSanDaiEr;
    private dragonMySiDaiEr: PDKDragonGameSiDaiEr;
    private dragonLeftSiDaiEr: PDKDragonGameSiDaiEr;
    private dragonRightSiDaiEr: PDKDragonGameSiDaiEr;
    private btnShare: eui.Button;

    private lbRoomID: eui.Label;
    private lbLimit: eui.Label;
    private lbRound: eui.Label;

    private roomid: number;
    private total_round: number;
    private cur_round: number;

    private playerCnt: number;

    private isowner: boolean;
    private owneruid: number;

    private imgStart: eui.Image;
    private btnStart: eui.Button;
    private gamestarted: boolean;
    private isPersonalGame: boolean = false;

    private grpRedNotice: eui.Group;
    private grprn1: eui.Group;
    private grprn2: eui.Group;
    private lbremain1: eui.Label;
    private lbrmb1: eui.Label;
    private lbrmb2: eui.Label;

    private recorderBubble: eui.Image;
    private grpMain: eui.Group;//座位的父节点
    // private grpRedcoin:eui.Group;
    // private lbRedCoin:eui.Label;

    // private grpRedCoinAnnounce:eui.Group;
    //guesscards
    private guesscount: any;
    private grpGuessCards: eui.Group;
    private btnGuessCards: eui.Button;
    private grpGuessResult: eui.Group; // 地主牌下的  牌型
    private guessCardsType: eui.Image;

    private grpGuessOp: eui.Group; // 押注操作
    //guess_option0 ~ 6
    //GCGold0 ~ 6
    private lbGuessConsume: eui.Label; // 押注消耗

    private guessWrong: eui.Image; // 猜错
    private grpGuessRight: eui.Group; // 猜对
    private gcardtype: eui.Image; // 牌型
    private gwingold: eui.BitmapLabel; // 赢得的金豆
    private gcgoldLight0: eui.Image; // 金光
    private gcgoldLight1: eui.Image; // 金光

    private grpGRLight: eui.Group; // 玩家猜中头像动画
    //star 0 ~ 2
    private light: eui.Image; // 金光    

    private flygoldindex: number;

    private btnRecord: eui.Button;
    private btnHelp: eui.Button;
    // private grpRecorder:eui.Group;
    private remainCards = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    private rollMsg: PDKMarqueeText;

    private beforerecorderTime: number;

    private beforewincnt: number;

    /**
     * 右下角的红包按钮
     */
    private mRed_img: eui.Image;
    /**
     * 红包个数的背景
     */
    private redCountBg_img: eui.Image;

    /**
     * 是否在播新手王炸获胜抽红包的动画
     */
    private _isShowWZAni: boolean;

    /**
     * 是否赢满5局
     */
    private _isOverFive: boolean;

    /**
     * 9人钻石赛播放规则动画的层；
     */
    private match9Rule_group: eui.Group;

    /**
     * 9人钻石赛规则动画
     */
    private _match9RuleAni: PDKDragonMatch9Rule;

    /**
     * 9人钻石赛的底部进度，规则，详情等
     */
    private match9_bottom_group: eui.Group;
    /**
     * 9 人钻石赛规则按钮
     */
    private match9Rule_img: eui.Image;
    /**
     * 9人钻石赛详情按钮
     */
    private matchInfo_img: eui.Image;

    /**
     *  比赛当前排名信息（非钻石赛）
     */
    private matchRank_group: eui.Group;

    /**
     * 比赛当前局数信息（非钻石赛）
     */
    private matchTurn_group: eui.Group;

    /**
     * 钻石赛规则关闭按钮
     */
    private match9RuleAniClose_btn: eui.Button;

    /**
     * 钻石赛进度
     */
    private match9Turn_label: eui.Label;

    /**
     * 钻石赛当前排名
     */
    private curRank_label: eui.Label;

    /**
     * 钻石赛等待其他玩家结束的提示
     */
    private match9WaitOther_img: eui.Image;

    /**
     * 9人钻石赛当前的局数
     */
    private _curMatch9Play: number = 1;

    /**
     * 9人钻石赛的详情信息；
     */
    private _match9Info: any;

    /**
     * 加倍
     */
    private double_group: eui.Group;
    /**
     * 加倍要消耗的参数数
     */
    private doubleCost_label: eui.Label;
    /**
     * 不加倍
     */
    private noDouble_group: eui.Group;

    /**
     * 加倍失败的说明
     */
    private failDouble_group: eui.Group;

    /**
     * 加倍失败的原因
     */
    private failDoubleDesc1_img: eui.Image;

    /**
     * 判断当前局的我的是否可以加倍
     */
    private _doubleRet: any;

    /**
     * 红包场的抽红包按钮
     */
    private redNormal_img: eui.Image;

    /**
     * 红包场的抽红包倒计时的label
     */
    private redNormal_label: eui.Label;

    /**
     * 红包场抽红包的倒计时
     */
    private _redNormalNum: number;

    /**
     * 红包赛的规则按钮
     */
    private redNormalHelp_img: eui.Image;

    /**
     * 红包场抽中的红包金额 用于分享图片 
     */
    private fastRedValue: number;

    /**
     * 加倍不加倍超时的timeOutId
     */
    private _askDoubleTimeOutId: number;


    /**
     * 比赛复活的intervalId 
     */
    private _matchReviveIntervalId: number;

    /**
     * 每日福袋
     */
    private dayBuyGroup: eui.Group;

    /**
     * 每日福袋倒计时
     */
    private dayFuDaiTimeLabel: eui.Label;



    private grpTwoGame: eui.Group;
    private grpTwoRuleExplain: eui.Group;
    private btnTwoRuleExplain: eui.Button;
    private imgGameBG: eui.Image;

    private grpBaseScore: eui.Group;
    private showBoomEffect: boolean = false;

    /**
     * 是否在可以领取每日福袋的时间内
     */
    private _inDayGetTime: boolean;
    constructor() {
        super();

        this.init();
    }

    private init(): void {
        this.skinName = scenes.ScenePDKPlaySkin;

        this._tfMatchPlayInfo = PDKalien.PDKUtils.parseColorTextFlow(PDKlang.match_play_info);
    }

    initGuessCardsView(): void {
        //this.btnGuessCards.visible = false;
        this.grpGuessOp.y = -250;
        this.grpGuessOp.visible = false;
        this.grpGuessResult.visible = false;
        this.guessWrong.visible = false;
        this.grpGuessRight.visible = false;
        this.grpGRLight.visible = false;
        for (var i = 0; i < 6; ++i) {
            this['GCGold' + i].visible = false;
            this['GCGold' + i].goldNum = 0;
            this.guesscount[i] = 0;
        }
        this.setGuessCardsMultiple([1.2, 3, 6, 15, 20, 300]);
        this.lbGuessConsume.text = '每次点击消耗' + this._roomInfo.guessbet + '金豆，可重复点击'
    }

    createChildren(): void {

        this.guesscount = [0, 0, 0, 0, 0, 0]

        this.percentWidth = 100;
        this.percentHeight = 100;
        super.createChildren();
        this._redNormalNum = -1;
        this._askDoubleTimeOutId = 0;
        this._isOverFive = false;
        this._isShowWZAni = false;
        this.recorderBubble.visible = false;
        // this.recorderBubble.visible = false;
        this.cdProgressBar.stop();
        // this.playerCnt = 0;
        this.gamestarted = false;
        this.isowner = false;
        this._mySeat = this['seat0'];
        this._mySeat.width = PDKalien.StageProxy.stage.stageWidth - 20;
        for (let i = 0; i < 3; i++) {
            this._seats[i] = this['seat' + i];
            this['labChange' + i].visible = false;
        }
        this.grpRedNotice.visible = false;

        this.labWaiting.visible = false;
        this.btnShare.visible = false;
        this.grpBaseScore.visible = false;
        this.redListDataArr = [0, 0, 0, 0, 0];
        this.redListDataProvider = new eui.ArrayCollection(this.redListDataArr);
        this.redList.itemRenderer = PDKRedPacketProcess;
        this.redList.dataProvider = this.redListDataProvider;
        if (!pdkServer.isMatch && !this.isPersonalGame) {
            if (!this.dragonHongBao)
                this.dragonHongBao = new PDKDragonHongBao();
            /*if(!this.dragonHongBaoWarn)
                this.dragonHongBaoWarn = new PDKDragonHongBaoWarn();*/
        }
        this.dragonZhaDan = new PDKDragonGameZhaDan();
        this.dragonFeiJi = new PDKDragonGameFeiJi();
        this.dragonMyLianDui = new PDKDragonGameLianDui(false);
        this.dragonRightLianDui = new PDKDragonGameLianDui(false);
        this.dragonLeftLianDui = new PDKDragonGameLianDui(true);
        this.dragonMyShunZi = new PDKDragonGameShunZi(false);
        this.dragonRightShunZi = new PDKDragonGameShunZi(false);
        this.dragonLeftShunZi = new PDKDragonGameShunZi(true);
        this.dragonMySanDaiYi = new PDKDragonGameSanDaiYi(false);
        this.dragonRightSanDaiYi = new PDKDragonGameSanDaiYi(false);
        this.dragonLeftSanDaiYi = new PDKDragonGameSanDaiYi(true);
        this.dragonMySanDaiEr = new PDKDragonGameSanDaiEr(false);
        this.dragonRightSanDaiEr = new PDKDragonGameSanDaiEr(false);
        this.dragonLeftSanDaiEr = new PDKDragonGameSanDaiEr(true);
        this.dragonMySiDaiEr = new PDKDragonGameSiDaiEr(false);
        this.dragonRightSiDaiEr = new PDKDragonGameSiDaiEr(false);
        this.dragonLeftSiDaiEr = new PDKDragonGameSiDaiEr(true);
        this._mySeat.userInfoView.currentState = "my";

        let e: PDKalien.PDKEventManager = PDKalien.PDKEventManager.instance;
        e.registerOnObject(this, pdkServer, PDKEventNames.USER_RECONNECT_TABLE_REP, this.onReconnectTableRep, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_GIVE_UP_GAME_REP, this.onGiveUpGameRep, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.USER_ALMS_REP, this.onAlmsResponse, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.USER_QUICK_JOIN_RESPONSE, this.onQuickJoinResponse, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_USER_INFO_IN_GAME_REP, this.onUserInfoInGameResponse, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_GAME_START_NTF, this.onGameStart, this, 1000);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_RECONNECT_REP, this.onReconnectRep, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_ADD_CARD, this.onAddCard, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_USE_CARD_NTF, this.onUseCard, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_SET_CARDS, this.onSetCards, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_ASK_MASTER, this.onAskMaster, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_SET_SCORE, this.onSetScore, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_SHOW_CARD, this.onShowCard, this);

        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_TABLE_INFO, this.onTableInfo, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_USER_ONLINE, this._onUserOnline, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_USER_OFFLINE, this._onUserOffline, this);

        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.SHOW_LOTTERY, this.showLaba, this);


        //跑得快协议 开始
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_STC_PDK_GIVECARDS, this.onPdkGiveCards, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_STC_PDK_OUTCARD, this.onPdkOutcard, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_STC_PDK_READY, this.onPdkReady, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_STC_PDK_END, this.onPdkEnd, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_STC_PDK_CARD_HOLDER, this.onPdkCardHolder, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_STC_PDK_RECONNECT, this.onPdkReconnect, this);
        //跑得快协议 结束

        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_GAME_END, this.onGameEnd, this, 1000);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_OPERATE_REP, this.onOperateRep, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.USER_OPERATE_REP, this.onUserOperateRep, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_UPDATE_GAME_INFO, this.onUpdateGameInfo, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_ENTER_TABLE, this.onEnterTable, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_LEAVE_TABLE, this.onLeaveTable, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_ASK_READY, this.onAskReady, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_GET_READY_REP, this.onGetReadyRep, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.USER_FRESH_MAN_REDCOIN_LOTTERY_CHANCEGOT, this.onFreshManRedcoinLotteryChanceGot, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.USER_LOTTERY_RED_COIN_REP, this.onLotteryRedCoinRep, this);

        e.registerOnObject(this, this.buttonBar, PDKEventNames.BUTTON_BAR_TAP, this.onButtonBarTap, this);
        e.registerOnObject(this, this.grpButton, egret.TouchEvent.TOUCH_TAP, this.onGrpButtonTap, this);
        //e.registerOnObject(this,this._timerChatCD,egret.TimerEvent.TIMER,this.onChatCD,this);
        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.SELECT_CARDS, this.onSelectCards, this);
        e.registerOnObject(this, this.grpBg, egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.SHOW_GAME_EFFECT, this.onShowGameEffect, this);

        e.registerOnObject(this, pdkServer, PDKEventNames.QUIT_PGAME_REP, this.onQuitRoomRep, this);
        e.registerOnObject(this, this.seat0.userInfoView.gold, egret.TouchEvent.TOUCH_TAP, this._onClickGold, this);
        e.registerOnObject(this, this.seat0.userInfoView.diamond, egret.TouchEvent.TOUCH_TAP, this._onClickDiamond, this);

        e.registerOnObject(this, pdkServer, PDKEventNames.GAME_DISSOLVE, this.onGameDissolve, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.START_PGAME_REP, this.onStartGameRep, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.QUERY_ROOMINFO_REP, this.onPGameRoomInfoRep, this);
        e.registerOnObject(this, pdkServer, PDKEventNames.USER_DiamondGame_REP, this.onRedNormalMoneyInfoRep, this);

        e.registerOnObject(this, this.btnShare, egret.TouchEvent.TOUCH_TAP, this.onShare, this);
        // e.registerOnObject(this,this.btnShare,egret.TouchEvent.TOUCH_TAP,this.onStart,this);
        e.registerOnObject(this, this.btnStart, egret.TouchEvent.TOUCH_TAP, this.onStart, this);

        e.registerOnObject(this, this._mySeat.redBgImg, egret.TouchEvent.TOUCH_TAP, this.onGrpRedcoinClick, this);
        e.registerOnObject(this, this._mySeat.redExchangeImg, egret.TouchEvent.TOUCH_TAP, this._onClickExchageRed, this);

        e.registerOnObject(this, this.grpGuessCards, egret.TouchEvent.TOUCH_TAP, this.onCloseGrpGuessOp, this);
        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.MY_USER_INFO_UPDATE, this.myUserinfoUpdate, this);
        // e.registerOnObject(this,this.btnRecord,egret.TouchEvent.TOUCH_TAP,this.switchRecorder,this);
        // e.registerOnObject(this,this.btnGuessCards,egret.TouchEvent.TOUCH_TAP,this.onBtnGuessClick,this);
        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.USER_RED_COUNT_CHANGE, this._onUserRedCountChange, this);
        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.HORN_TALK_RECORDS_CHANGE, this._onHornRecChange, this);
        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.BAG_INFO_REFRESH, this._onBagRefresh, this);
        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.CLOSE_REVIVE_PANEL, this._onCloseRevivePanel, this);
        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.BUY_REVIVE_SUCC, this._onBuyReviveSucc, this);

        e.registerOnObject(this, pdkServer, PDKEventNames.USER_MatchOperate_REP, this._onRecvMatchOperateRep, this);

        this._mySeat.grpRecorder.visible = false;
        this.grpGuessOp.y = -250;
        this.grpGuessOp.visible = false;
        this.grpGuessResult.visible = false;
        this.guessWrong.visible = false;
        this.grpGuessRight.visible = false;
        this.grpGRLight.visible = false;
        for (var i = 0; i < 6; ++i) {
            this['GCGold' + i].visible = false;
            this['GCGold' + i].goldNum = 0;
            e.registerOnObject(this, this['guess_option' + i], egret.TouchEvent.TOUCH_TAP, this.onGuessOptionClick, this);

        }
        // e.registerOnObject(this,this.rectMask,egret.TouchEvent.TOUCH_TAP,this.onStart,this);
        //        if(!this.dragonHongBaoWarn.parent)
        //            this.addChild(this.dragonHongBaoWarn);
        //        this.dragonHongBaoWarn.play1();

        this.btnRecord.visible = true;
        // if(PDKGameConfig.testers && PDKGameConfig.testers[PDKMainLogic.instance.selfData.uid]){
        //     this.btnRecord.visible = true;
        //     this._mySeat.grpRecorder.visible = true;
        // }else{
        //     this.btnRecord.visible = false;
        //     this._mySeat.grpRecorder.visible = false;
        // }
    }

    private setBeforeWincnt(): void {
        if (pdkServer.isMatch || pdkServer.isPersonalGame) return;
        this.beforewincnt = 0;
        if (PDKMainLogic.instance.selfData.wincnt && PDKMainLogic.instance.selfData.wincnt.length) {
            for (var i: number = 0; i < PDKMainLogic.instance.selfData.wincnt.length; i++) {
                if (PDKMainLogic.instance.selfData.wincnt[i].roomid == this._roomInfo.roomID) {
                    this.beforewincnt = PDKMainLogic.instance.selfData.wincnt[i].cnt;
                    break;
                }
            }
        }
    }

    /**
     * 用户上线
     */
    private _onUserOnline(e: egret.Event): void {
        let _data = e.data;
        if (!_data || !_data.seatid) return;

        let _seat: PDKSeat = this.getSeatById(_data.seatid);
        if (!_seat) return;

        _seat.setUserOffline(false);
    }

    /**
     * 用户掉线
     */
    private _onUserOffline(e: egret.Event): void {
        let _data = e.data;
        if (!_data || !_data.uid) return;

        let _seat: PDKSeat = this.getSeatByUId(_data.uid);
        if (!_seat) return;

        _seat.setUserOffline(true);
    }
    /**
     * 初始化左右两边玩家的图像可以点击，查看玩家信息
     * 仅普通场可以查看玩家信息,比赛场不可以查看  zhu
     * bEnable:是否允许点击玩家头像
     */
    private _initGeneralHeadImgTouch(bEnable: boolean): void {
        this.seat1.setHeadTouch(bEnable);
        this.seat2.setHeadTouch(bEnable);
        this._mySeat.setHeadTouch(bEnable);
    }

    /**
     * 播放表情动画
     */
    private _onPlayBrowInfo(fromSeatId: number, toSeatId: number, browId: number) {
        let fromSeat: PDKSeat = this.getSeatById(fromSeatId);
        let toSeat: PDKSeat = this.getSeatById(toSeatId);
        if (1) return;
        if (fromSeat && toSeat && browId) {
            let role: egret.MovieClip = PDKBrowData.createBrowMCById(browId);
            if (!role) return;

            let img = new eui.Image("pdk_play_animate_star");
            this.grpMain.addChild(img);
            img.anchorOffsetX = img.width * 0.6;
            img.anchorOffsetY = img.height * 0.5;

            let fromPos = fromSeat.getHeadCenterPos();
            let toPos = toSeat.getHeadCenterPos();
            let _fromNodePos = new egret.Point(0, 0);
            let _toNodePos = new egret.Point(0, 0);
            this.grpMain.globalToLocal(fromPos.x, fromPos.y, _fromNodePos);
            this.grpMain.globalToLocal(toPos.x, toPos.y, _toNodePos);

            this.grpMain.addChild(role);
            role.visible = false;
            role.scaleX = 2; //动画序列帧导出是50%大小的
            role.scaleY = 2;
            let wh = PDKBrowData.getBrowAniWHById(browId);
            role.anchorOffsetX = wh.width * 0.25;
            role.anchorOffsetY = wh.height * 0.25;

            role.addEventListener(egret.Event.COMPLETE, function (e: egret.Event): void {
                let _fStay = PDKBrowData.getBrowAniLastStayById(browId);
                if (_fStay) {
                    egret.Tween.get(role).wait(_fStay * 1000).call(function () {
                        this.grpMain.removeChild(role);
                    }.bind(this));
                }
                else {
                    this.grpMain.removeChild(role);
                }
            }, this);
            egret.Tween.get(img).set({ x: _fromNodePos.x, y: _fromNodePos.y }).to({ x: _toNodePos.x, y: _toNodePos.y }, 500).wait(200).call(function () {
                this.grpMain.removeChild(img);
                role.visible = true;
                if (PDKBrowData.isNeedXMoveById(browId)) {
                    egret.Tween.get(role).set({ x: _toNodePos.x - 100, y: _toNodePos.y }).to({ x: _toNodePos.x + 100, y: _toNodePos.y }, 1000).wait(200).call(function () {
                        this.grpMain.removeChild(role);
                    }.bind(this))
                    role.gotoAndPlay(1, -1);
                }
                else {
                    role.x = _toNodePos.x;
                    role.y = _toNodePos.y;
                    role.gotoAndPlay(1, 1);
                }
            }.bind(this))
        }
    }

    private recorderBubbleAnimate(): void {
        egret.Tween.removeTweens(this.recorderBubble);
        this.recorderBubbleAnimateReal();
    }

    private recorderBubbleAnimateReal(): void {
        if (this._roomInfo.roomID == 9000 || this._roomInfo.roomID == 9001 || this._roomInfo.roomID == 9002 ||
            this._roomInfo.roomID == 9003 || this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005) return;
        egret.Tween.get(this.recorderBubble).set({
            visible: true,
            loop: true,
        })
            .to({
                y: 82,
            }, 446)
            .to({
                y: 72,
            }, 446).
            call(this.recorderBubbleAnimateReal, this);
    }

    private refreshCardsRecorderAbout(): void {
        if (this._roomInfo.roomID == 9000 || this._roomInfo.roomID == 9001 || this._roomInfo.roomID == 9002 ||
            this._roomInfo.roomID == 9003 || this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005) return;
        var userInfoData: PDKUserInfoData = PDKMainLogic.instance.selfData;
        var temp = egret.localStorage.getItem("cardsrecorderexpirenotice");

        if (!userInfoData.recorderfirstrewardgot) {//} || userInfoData.recorderfirstrewardgot != 1){
            this.recorderBubble.source = 'pdk_play_recorder_gift'
            this.recorderBubbleAnimate();
            this._mySeat.grpRecorder.visible = false;
        } else if ((userInfoData.cardsRecorder.length < 1 || userInfoData.cardsRecorder[6] <= 0)) {
            // 隐藏动画
            egret.Tween.removeTweens(this.recorderBubble);
            this.recorderBubble.visible = false;

            if (!temp) {
                this.recorderBubble.source = 'pdk_play_recorder_outofdate';
                // this.recorderBubble.visible = true;
                this.recorderBubble.visible = false;
                this.recorderBubbleAnimate();
            }
            this._mySeat.grpRecorder.visible = false;
        } else {
            egret.Tween.removeTweens(this.recorderBubble);
            this.recorderBubble.visible = false;
        }
    }

    /**
     * 是否显示记牌器
     */
    private _showRecorder(bShow: boolean): void {
        // this._mySeat.grpRecorder.visible = bShow;
        this._mySeat.grpRecorder.visible = false;
    }

    private myUserinfoUpdate(event: egret.Event): void {
        var userInfoData: PDKUserInfoData = PDKMainLogic.instance.selfData;

        if (userInfoData.hasRecorder()) {
            if (this.recorderBubble.visible) {
                // this.removeChild(this.recorderBubble);
                egret.Tween.removeTweens(this.recorderBubble);
                this._showRecorder(false);
                if (this.recorderBubble.source == 'pdk_play_recorder_gift' && userInfoData.recorderfirstrewardgot) {
                    PDKImgToast.instance.show(this, '领取成功');
                }
                this._showRecorder(true);
                egret.localStorage.setItem("opencardsrecorder", '1');
            }

            if (!this.beforerecorderTime || this.beforerecorderTime <= 0) {
                // this.beforerecorderTime = userInfoData.cardsRecorder[6]
                if (pdkServer.playing) {
                    //pdkServer.gameOperate(6); //请求记牌器数据
                    pdkServer.sendPdkCardHolder();
                }
            }
        }

        this.refreshCardsRecorderAbout();
        this.updateRedCoinInfo();
        this._mySeat.userInfoView.updateGold(userInfoData.gold);
        this.setRedProcess();
    }



    /***
     * 点击记牌器按钮后如果是打开则关闭，如果是关闭则打开
     */
    private switchRecorder(event: egret.TouchEvent): void {
        var userInfoData: PDKUserInfoData = PDKMainLogic.instance.selfData;
        if (!userInfoData.recorderfirstrewardgot || userInfoData.recorderfirstrewardgot != 1) {
            pdkServer.getCardsRecorderReward();
        } else if (userInfoData.hasRecorder()) {
            this._mySeat.grpRecorder.visible = !this._mySeat.grpRecorder.visible;

            if (this._mySeat.grpRecorder.visible) {
                egret.localStorage.setItem("opencardsrecorder", '1');

                if (pdkServer.playing) {
                    //pdkServer.gameOperate(6); //请求记牌器数据
                    pdkServer.sendPdkCardHolder();
                }
            } else {
                egret.localStorage.removeItem("opencardsrecorder");
            }
        } else {
            PDKPanelBuyRecorder.instance.show();
        }

        // var temp = egret.localStorage.getItem("cardsrecorderexpirenotice");
        if (this.recorderBubble.source == 'pdk_play_recorder_outofdate' && this.recorderBubble.visible) {
            egret.localStorage.setItem("cardsrecorderexpirenotice", '1');
            egret.Tween.removeTweens(this.recorderBubble);
            this.recorderBubble.visible = false;
        }
    }

    /**
     * 显示猜地主牌面板
     */
    private showGuessView(): void {
        egret.Tween.get(this.grpGuessOp).set({
            visible: true,
            x: 0,
            y: -250,
        })
            .to({
                x: 0,
                y: 0,
            }, 146);
        this.grpGuessCards.touchEnabled = true;
    }

    private onBtnGuessClick(event: egret.TouchEvent): void {
        if (this.grpGuessOp.visible) {
            this.onCloseGrpGuessOp(null);
        } else {
            this.showGuessView();
        }
    }

    private onGuessOptionClick(event: egret.TouchEvent): void {
        var option = Number(event.currentTarget.name);

        if (this.guesscount[option] >= 20) {
            PDKImgToast.instance.show(this, PDKlang.guessCardsNotice[1]);
            PDKImgToast.instance.enableTouch(false);
        } else {
            //pdkServer.gameOperate(3, [option + 1]);
            pdkServer.reqUserGuessNextCard(this._roomInfo.roomID, option + 1);
            event.stopImmediatePropagation();
        }
        //
        // event.stopPropagation();
    }

    /**
     * 检测玩家当前是否有可以兑换的红包
     */
    private _checkHasRedCanExchange(): boolean {
        let _bCan = false;
        let _selfData = PDKMainLogic.instance.selfData;
        let conf = PDKGameConfig.exchangeConfig.filter((item: any) => {
            if (item.goodsid == 1) {
                if (item.first) {
                    let _timeStamp = _selfData.rcminexcexpiretime;//过期时间戳单位秒
                    let _curStamp = new Date().getTime();
                    let _hasExchange = _selfData.rcminexcchanceused;
                    if (_curStamp < (_timeStamp * 1000) && !_hasExchange) {//未过期
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                return true;
            }
            return false;
        })

        conf.sort((c1: any, c2: any): number => {
            return c1.amount - c2.amount;
        });

        var redcoin = Math.ceil(_selfData.redcoin) / 100;
        var index = conf.length;
        for (var i = 0; i < conf.length; ++i) {
            if (conf[i].amount > redcoin) {
                index = i;
                break;
            }
        }

        if (index > 0) {
            _bCan = true;
        }
        return _bCan;
    }

    private updateRedCoinInfo() {
        let _selfData = PDKMainLogic.instance.selfData;
        let conf = PDKGameConfig.exchangeConfig.filter((item: any) => {
            if (item.goodsid == 4) {
                if (item.first) {
                    let _timeStamp = _selfData.rcminexcexpiretime;//过期时间戳单位秒
                    let _curStamp = new Date().getTime();
                    let _hasExchange = _selfData.rcminexcchanceused;
                    if (_curStamp < (_timeStamp * 1000) && !_hasExchange) {//未过期
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                return true;
            }
            return false;
        })

        conf.sort((c1: any, c2: any): number => {
            return c1.amount - c2.amount;
        });

        var redcoin = Math.ceil(_selfData.redcoin) / 100;
        var index = conf.length;
        for (var i = 0; i < conf.length; ++i) {
            if (conf[i].amount > redcoin) {
                index = i;
                break;
            }
        }

        // if(conf[0].amount > redcoin){
        //     index = i;
        // }

        if (index == 0) {
            this.grprn2.visible = false;
            this.grprn1.visible = true;
            this.lbremain1.text = "" + (Math.floor(conf[index].amount * 100 - redcoin * 100) / 100);
            this.lbrmb1.text = conf[index].amount;
        } else if (index > 0 && index <= conf.length) {
            this.grprn2.visible = true;
            this.grprn1.visible = false;
            this.lbrmb2.text = conf[index - 1].amount;
        }

        this._mySeat.setRedcoin((redcoin == null ? "0.00" : PDKUtils.exchangeRatio(redcoin, true)), true);
    }

    /**
     * 点击抽红包的兑
     */
    private _onClickExchageRed(): void {
        if (pdkServer._isInDDZ) {
            this.openDDZShop(2);
        } else {
            PDKPanelExchange2.instance.show(2);
        }
    }

    private _shouldShowRedNotice(): void {
        let time: string = PDKalien.localStorage.getItem('redNoticeShowTime');
        if (!time) time = '0';
        let itime: number = parseInt(time);
        if (itime < 3) {
            this._showExchangeRedAni();
            itime++;
            PDKalien.localStorage.setItem('redNoticeShowTime', itime + '');
        }
    }

    /**
     * 提示兑换红包的动画
     */
    private _showExchangeRedAni(): void {
        this.grpRedNotice.visible = false;
        if (1) return;
        egret.Tween.get(this.grpRedNotice).set({
            visible: true,
            alpha: 1,
        }).wait(1000)
            .to({
                alpha: 0
            }, 3000);
    }

    private onGrpRedcoinClick(event: egret.TouchEvent): void {
        // this.grpRedNotice.visible = !this.grpRedNotice.visible;
        //有金额可以兑换则直接跳转到兑换界面
        if (this._checkHasRedCanExchange()) {
            if (pdkServer._isInDDZ) {
                this.openDDZShop(2);
            } else {
                PDKPanelExchange2.instance.show(2);
            }
            return;
        }
        this._showExchangeRedAni();
    }

    private onGameDissolve(event: egret.Event): void {
        var data: any = event.data;
        PDKPanelPlayerInfo.remove();
        if (data.players && data.players.length > 0) {
            for (var i = 0; i < data.players.length; ++i) {
                data.players[i].nickname = PDKBase64.decode(data.players[i].nickname);
            }
            if (data.quitPlayer) {
                data.quitPlayer = PDKBase64.decode(data.quitPlayer)
                if (data.quitPlayer.length > 8) {
                    data.quitPlayer = data.quitPlayer.substring(0, 8)
                }
            }
            PDKPersonalDetail.instance.show(data.players, this.onAlertResult.bind(this, 0), true, data.quitPlayer);
        } else if (data.reason == 2) {
            //  PDKAlert.show()
            PDKAlert.show('房主退出，牌局解散', 0, this.onAlertResult.bind(this, 0));
        }
    }

    private onQuitRoomRep(event: egret.Event): void {
        var data: any = event.data;
        if (data.result == 0) {
            if (data.uid == pdkServer.uid) {
                PDKMainLogic.backToRoomScene();
            } else if (pdkServer.playing) {
                let seat: PDKDDZSeat = this.getSeatByUId(data.uid);
                if (seat) {
                    seat.setQuitFlagVisible(true);
                }
            }
        }
    }

    private onPGameRoomInfoRep(event: egret.Event): void {
        var data: any = event.data;
        this.setPGameView(data);
    }

    private setStartPgameBtnVisible(v: boolean) {
        this.btnStart.visible = v;
        this.imgStart.visible = v;
    }

    private onStartGameRep(event: egret.Event): void {
        let data: any = event.data;
        if (data.result != 0) {
            PDKPanelAlert.instance.show('错误编号' + data.result, 0);
        } else {
            // PDKalien.PDKSceneManager.show(PDKSceneNames.PLAY, this.roominfo, PDKalien.sceneEffect.Fade);
            this.setStartPgameBtnVisible(false);
            this.btnShare.visible = false;
            this.gamestarted = true;
        }
    }

    private onCloseGrpGuessOp(event: egret.TouchEvent): void {
        // if(event != null && event.currentTarget != this.grpGuessCards){
        //     return;
        // }
        egret.Tween.get(this.grpGuessOp).set({
            visible: true,
        })
            .to({
                x: 0,
                y: -250,
                visible: false,
            }, 146);
        this.grpGuessCards.touchEnabled = false;
    }

    /**
     * 仅仅设置分享房间信息的参数
     */
    private _justSetShareParams(): void {
        PDKWxHelper.share(1, (response) => {
            //0 分享成功 1 取消分享 2 分享失败 3 用户点击分享按钮
            /*zhu 暂时不重置分享的链接
            if(response.code != 3) {
                PDKalien.Dispatcher.dispatch(PDKEventNames.WX_SHARE);
            }
            */
        }, [this.total_round, this.lbLimit.text, this.roomid]);
    }

    private onShare(event: egret.TouchEvent): void {
        this._justSetShareParams();
        if (!PDKalien.Native.instance.isNative) {
            PDKPanelShare.instance.sendGameToFriend();
        } else {
            PDKWxHelper.shareForNative(1, null, [this.total_round, this.lbLimit.text, this.roomid])
        }
    }

    private onStart(event: egret.TouchEvent): void {
        pdkServer.StartPGameReq(this.roomid);
    }

    addListeners(): void {
        if (pdkServer.isMatch) {
            PDKMatchService.instance.addEventListener(PDKEventNames.USER_MATCH_INFO_NTF, this.onMatchInfoNtf, this);
        }
        // PDKExchangeService.instance;
        PDKalien.PDKEventManager.instance.enableOnObject(this);
        PDKalien.Dispatcher.addEventListener(PDKEventNames.SHOW_PAYCHAT, this.showLaba, this);

        pdkServer.addEventListener(PDKEventNames.USER_BAG_INFO_REP, this.onBagInfoRep, this);
        pdkServer.addEventListener(PDKEventNames.USER_LOTTERY_RED_COIN_REP, this.onLotteryRedCoinRep, this);
    }

    removeListeners(): void {
        if (pdkServer.isMatch) {
            PDKMatchService.instance.removeEventListener(PDKEventNames.USER_MATCH_INFO_NTF, this.onMatchInfoNtf, this);
        }

        PDKalien.PDKEventManager.instance.disableOnObject(this);
        PDKalien.Dispatcher.removeEventListener(PDKEventNames.SHOW_PAYCHAT, this.showLaba, this);
        pdkServer.removeEventListener(PDKEventNames.USER_BAG_INFO_REP, this.onBagInfoRep, this);
    }


    private onBagInfoRep(event: egret.Event): void {
        let data: any = event.data;

        // console.log("onBagInfoRep--------pdk--22-->", data);

        PDKBagService.instance.bagItemArray.forEach((item: PDKBagItemData) => {
            item.count = 0;
        });
        //if(data.result == 0){
        data.items.forEach((item: any) => {
            PDKBagService.instance.updateItemByData(item);
        });
        //}

        PDKalien.Dispatcher.dispatch(PDKEventNames.BAG_INFO_REFRESH, false);
    }


    private showLaba(e: egret.Event): void {
        this.rollMsg.show();
    }

    private _lastTap: any = {};
    private onTap(event: egret.TouchEvent): void {
        let t = this._lastTap;

        //console.log(new Date().valueOf() - t.time, PDKalien.MathUtils.distance(t.x, t.y, event.stageX, event.stageY));
        if (new Date().valueOf() - t.time < 200 && PDKalien.MathUtils.distance(t.x, t.y, event.stageX, event.stageY) < 50) {
            this.doubleTap(event);
            t = this._lastTap = {};
        }

        t.x = event.stageX;
        t.y = event.stageY;
        t.time = new Date().valueOf();
    }

    private doubleTap(event: egret.TouchEvent): void {
        //console.log('doubleTap');
        if (pdkServer.playing) {
            this._mySeat.cancelSelect();
        }
    }

	/**
	 * 场景初始化
	 */
    initData(bOnClickReady: boolean = false): void {
        if (this.isPersonalGame) {
            this._seats.forEach((seat: PDKDDZSeat) => {
                seat.initData({ isMatch: false, matchType: 1 })
            });
        } else {
            this._seats.forEach((seat: PDKDDZSeat) => {
                let obj = { isMatch: pdkServer.isMatch, matchType: pdkServer.roomInfo.matchType, cleanUserInfo: true, roomType: pdkServer.roomInfo.roomType, isSelf: false };
                if (seat == this._mySeat) {
                    obj.isSelf = true;
                }
                if (bOnClickReady) { //zhu 点击准备后，自己的信息不清除
                    if (seat == this._mySeat) {
                        obj.cleanUserInfo = false;
                    }
                    seat.initData(obj);
                }
                else {
                    seat.initData(obj);
                }
            });
        }

        // if(!pdkServer.isMatch) {
        //     this.labWaiting.visible = true;
        // }
        pdkServer.playing = false;
        this.buttonBar.switchState('hidden');
        this.btnContinue.visible = false;
        this.btnHang.enabled = false;
        this.labWaiting.visible = false;
        this.showBoomEffect = false;
        this.masterCards.initData();

        //if(this._roomInfo && this._roomInfo.baseScore){
        //    this.masterCards.updateScore(this._roomInfo.baseScore || 0,1);
        //}

        for (var i = 0; i < 3; ++i) {
            this._seats[i].setOwnerFlagVisible(false);
            this._seats[i].setQuitFlagVisible(false);
            this['labChange' + i].visible = false;
        }
        this.flygoldindex = 0;
        //console.log('场景初始化');
    }

    private setGuessCardsMultiple(multi: Array<number>): void {
        for (var i = 0; i < multi.length; ++i) {
            this['lbguess' + (i + 1)].text = '(赢' + multi[i] + '倍)';
        }
    }

    /**
     * 清空记牌器上牌的信息
     * cardNum:每张牌的数量
     */
    private _clearRecorderInfo(cardNum: number): void {
        //console.log("_clearRecorderInfo========",cardNum);
        let n = cardNum;
        let n1 = cardNum;
        if (cardNum == 4) {
            n1 = 1;
        }
        this.remainCards = [n, n, n, n, n, n, n, n, n, n, n, n, n, n1, n1];
        for (let i = 0; i < this.remainCards.length; ++i) {
            this._mySeat['lb' + (i + 1)].text = this.remainCards[i];
            this._mySeat['lb' + (i + 1)].textColor = 0x9d9d9d;
            if (n == 4) {
                this._mySeat['lb' + (i + 1)].textColor = 0xe77802;
            }
        }

        if (n1 == 1) { //大小王
            this._mySeat['lb14'].textColor = 0x518200;
            this._mySeat['lb15'].textColor = 0x518200;
        }
    }

    /**
     * idx :牌的数组缩影
     * num:牌当前的数量
     */
    private _setRecorderCardAndNum(idx: number, num: number): void {
        let _num = num;

        let _debugCards = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'k', 'A', '2', 'X', 'D'];
        if (idx < 0 || idx > 14 || _num < 0) {
            if (!RELEASE) {
                alert("error idx=>" + idx + "|num:" + _num);
            }
            return;
        }

        if (_num < 0) {
            _num = 0;
        }

        let _arrayIdx = idx;
        let _nId = (idx + 1);
        this.remainCards[_arrayIdx] = _num;
        this._mySeat['lb' + _nId].text = _num;

        //console.log("_setRecorderCardAndNum==>",idx,"|card:",_debugCards[_arrayIdx],"|num:",_num);

        if (_num == 4) {
            this._mySeat['lb' + _nId].textColor = 0xe77802;
        } else if (_num == 0) {
            this._mySeat['lb' + _nId].textColor = 0x9d9d9d;
        } else {
            this._mySeat['lb' + _nId].textColor = 0x518200;
        }
    }

    /**
     * 更新记牌器单张牌的数量信息主动减1
     */
    private _subOneRecorderByCard(cardId: number): void {
        if (cardId < 10 || cardId > 150) {
            if (!RELEASE) {
                alert("error cardId" + cardId);
            }
            return;
        }
        let _sCard = "" + cardId;
        let _nId = 0;
        if (cardId < 100) {
            _nId = Number(_sCard.substr(0, 1));
        }
        else {
            _nId = Number(_sCard.substr(0, 2));
        }
        let _arrayIdx = -1 + _nId;
        let _num = this.remainCards[_arrayIdx];
        _num += -1;
        if (_num < 0) {
            _num = 0;
        }
        this._setRecorderCardAndNum(_arrayIdx, _num);
    }

    /**
     * 更新记牌器（牌的数组）
     */
    private _updateRecorderByCards(cards: Array<number>): void {
        //console.log("_updateRecorderByCards==========",cards,cards.length);
        if (PDKMainLogic.instance.selfData.hasRecorder()) {
            if (cards && cards.length > 0) {
                for (let i = 0; i < cards.length; ++i) {
                    this._subOneRecorderByCard(cards[i]);
                }
            }
        }
    }

    /**
     * 发牌需要根据服务器下发的记牌器信息来更新数据(牌的值的数组)
     */
    private _setRecorderInfoByServerCard(cards: Array<number>): void {
        //console.log("_setRecorderCardInfoByServer==========",cards,cards.length);
        if (cards && PDKMainLogic.instance.selfData.hasRecorder()) {
            this._clearRecorderInfo(4);
            for (let i = 0; i < cards.length; ++i) {
                this._subOneRecorderByCard(cards[i]);
            }
        }
    }

    /**
     * 剩余的牌数量数组
     */
    private _setRecorderInfoByServerNum(cardsNum: Array<number>): void {
        //console.log("_setRecorderInfoByServerNum==========",cardsNum,cardsNum.length);
        if (cardsNum && cardsNum.length == 15 && PDKMainLogic.instance.selfData.hasRecorder()) {
            this._clearRecorderInfo(0);
            for (let i = 0; i < cardsNum.length; ++i) {
                this._setRecorderCardAndNum(i, cardsNum[i]);
            }
        }
    }

	/**
	 * 新游戏开始
	 * 初始化桌面
	 */
    newGame(): void {
        this._isOverFive = false;
        this._isShowWZAni = false;
        this.labWaiting.visible = false;
        this._seats.forEach((seat: PDKDDZSeat) => {
            seat.reset();
            seat.setReady(false);
        });

        this._clearRecorderInfo(0);
        for (let i = 0; i < 3; i++) {
            this['labChange' + i].visible = false;
        }
        pdkServer.playing = true;
        this.btnContinue.visible = false;
        this.btnHang.selected = false;
        this.btnHang.enabled = true;
        this.cdProgressBar.stop();

        this.masterCards.initData();

        if (pdkServer.roomInfo && pdkServer.roomInfo.baseScore) {
            this.masterCards.updateScore(pdkServer.roomInfo.baseScore || 0, 1);
        }

        PDKalien.PopUpManager.instance.removeAllPupUp();

        if (pdkServer.isMatch) {
            PDKPanelMatchWaitingInner.instance.close();
        }
        egret.clearTimeout(this._timerClean);
        if (this._showResultTimeOutId)
            egret.clearTimeout(this._showResultTimeOutId)
        if (this._showResultTimeOutId1)
            egret.clearTimeout(this._showResultTimeOutId1)

        if (pdkServer.isMatch) {
            PDKMainLogic.instance.alms();
        }

        if (!pdkServer.isMatch && !pdkServer.isPersonalGame) {
            this.initGuessCardsView();
        }
    }

    private getRedCoinLackCnt(): any {
        var count: number = 0;
        if (PDKMainLogic.instance.selfData.wincnt && PDKMainLogic.instance.selfData.wincnt.length) {
            for (var i: number = 0; i < PDKMainLogic.instance.selfData.wincnt.length; i++) {
                if (PDKMainLogic.instance.selfData.wincnt[i].roomid == this._roomInfo.roomID) {
                    var cnt: number = PDKMainLogic.instance.selfData.wincnt[i].cnt;
                    if (!cnt)
                        cnt = 0;
                    count = cnt % 5;
                    break;
                }
            }
        }

        return 5 - count;
    }

    private testFunction(): void {
        // var cardids = [30,31,32,40,41,42,50,51,52,60,70,71]

        // var cardids = [30,31,32,40,41,42,50,51,52,130,131,132]
        // this._mySeat.addCards([140,150,130,131,100,101,102])
        // var xx = this._mySeat.checkType(cardids);
        // console.log(xx);

        //  if(PDKGameConfig.testcards && PDKGameConfig.testcards.length == 54){
        //            pdkServer.setCards(PDKGameConfig.testcards);
        //            return;
        //        }

        this.recorderBubble.visible = true
        this.recorderBubble.source = 'pdk_play_recorder_gift';
        this.myUserinfoUpdate(null);
    }

    /**
     * zhu 点击聊天按钮
     */
    private _onClickChat(): void {
        /*if(!this._timerChatCD.running) {
            if(this.btnChat.selected){
               this.chatList.show(this.onSelectChat.bind(this));
            }
            else{
                this._closeChatList();
            }
       }*/
    }

    /**
     *  关闭聊天列表
     */
    private _closeChatList(): void {
        //this.chatList.close();
    }

	/**
	 * 当按钮组被按下
	 * @param event
	 */
    private onGrpButtonTap(event: egret.TouchEvent): void {
        switch (event.target.name) {
            case 'chat':
                this._onClickChat();
                return;
            case 'setting':
                // this.test();
                if (pdkServer._isInDDZ) {
                    pdkServer.ddzDispatchEvent(1, '', { type: 3 });
                } else {
                    PDKPanelSetting.instance.show();
                }
                break;
            case 'help':
                if (this._roomInfo.roomID == 9000 || this._roomInfo.roomID == 9001 || this._roomInfo.roomID == 9002 ||
                    this._roomInfo.roomID == 9003 || this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005) {
                    let bTwoGame: boolean = (this._roomInfo.roomID == 9000 || this._roomInfo.roomID == 9001 || this._roomInfo.roomID == 9002 ||
                        this._roomInfo.roomID == 9003 || this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005);
                    PDKPanelRuleTip.getInstance().show(bTwoGame);
                } else {
                    this._showRedNormalRule();
                }
                PDKalien.localStorage.setItem("gameRuleFlag", "1");
                this.ruleReadedFlag.visible = false;
                break;
            case 'hang':
                pdkServer.hang(this.btnHang.selected);
                break;
            case 'recorder':
                // this._mySeat.grpRecorder.visible = !this._mySeat.grpRecorder.visible
                this.switchRecorder(null);
                break;
            case 'back':
                // if (pdkServer.isMatch) {
                //     PDKAlert.show(PDKlang.match_cancel_alert, 1, this.onAlertResult.bind(this, 2));
                // } else if (this.isPersonalGame) {
                //     PDKAlert.show('确认离开房间？', 1, this.onAlertResult.bind(this, 2));
                // } else if (pdkServer.playing) {
                //     // this.showResult(true);
                //     // for(var i = 0; i < 3; ++i){
                //     //     this.playChangeEffect(i, 1000);
                //     // }
                //     // var x = this.getGuessCardsType([120,131,10]);
                //     //    this.testFunction();
                //     if (this._roomInfo.roomID == 5001 || this._roomInfo.roomID == 5101) {
                //         PDKAlert.show("本局结束即可获得奖杯,现在退出将为您托管游戏", 1, this.onAlertResult.bind(this, 0));
                //     }
                //     else {
                //         PDKAlert.show(PDKalien.StringUtils.format(PDKlang.backAlert, this.getRedCoinLackCnt()), 1, this.onAlertResult.bind(this, 0));
                //     }
                //     // this.flygoldindex = 0;
                //     // this.playGuessRightAnimate(this._mySeat.userInfoData.seatid, 10000)
                //     // this.playGuessRightAnimate(1, 10000)
                //     // this.playGuessWrongAnimate();
                //     // this.playGuessRightAnimate(2, 10000)
                //     // this.playGuessRightAnimate(3, 10000)
                // } else {
                //     // var x = this.getGuessCardsType([120,131,10]);
                //     // this.flygoldindex = 0;
                //     // this.playGuessRightAnimate(this._mySeat.userInfoData.seatid, 10000)
                //     // this.playGuessRightAnimate(1, 10000)
                //     // this.playGuessRightAnimate(2, 10000)
                //     // this.playGuessRightAnimate(3, 10000)
                //     // this.showResult(true);
                //     // for(var i = 0; i < 3; ++i){
                //     //     this.playChangeEffect(i, 1000);
                //     // }
                //     //    this.testFunction(); 
                //     if (this._roomInfo.roomID == 5001 || this._roomInfo.roomID == 5101) {
                //         PDKAlert.show("本局结束即可获得奖杯，是否确定离开", 1, this.onAlertResult.bind(this, 0));
                //     }
                //     else {
                //         PDKAlert.show(PDKalien.StringUtils.format(PDKlang.backAlert1, this.getRedCoinLackCnt()), 1, this.onAlertResult.bind(this, 0));
                //     }
                // }
                //离开房间
                if (pdkServer.isMatch) {
                    PDKAlert.show(PDKlang.match_cancel_alert, 1, this.onAlertResult.bind(this, 2));
                } else if (this.isPersonalGame) {
                    PDKAlert.show('确认离开房间？', 1, this.onAlertResult.bind(this, 2));
                } else {
                    this._showPlayGameGetCoin();
                }
                // PDKAlert.show("确认离开房间？", 1, this.onAlertResult.bind(this, 4));
                break;
            case 'continue':
                this._onClickReady();
                //this.newGame();
                //pdkServer.getReady();
                break;
            case 'guessCards':
                if (this.grpGuessOp.visible) {
                    this.onCloseGrpGuessOp(null);
                } else {
                    egret.Tween.get(this.grpGuessOp).set({
                        visible: true,
                        x: 0,
                        y: -250,
                    })
                        .to({
                            x: 0,
                            y: 0,
                        }, 146);
                    this.grpGuessCards.touchEnabled = true;
                }
                break;
        }
    }

    /**
     * 提示再过多久或是在玩几局就可以抽奖杯
     */
    private _showPlayGameGetCoin(): void {
        let sText: string = "确认离开房间？";
        // if (this._roomInfo.roomFlag == 1) {
        //     //金币休闲场无奖杯
        //     if (this._roomInfo.roomID == 1001) {
        //         if (pdkServer.playing) {
        //             sText = PDKalien.StringUtils.format(PDKlang.backAlert, this.getRedCoinLackCnt());
        //         } else {
        //             sText = "您确定要退出游戏？"
        //         }
        //     } else {
        //         let sPre = "距离福袋爆开还有" + info.totS + "秒，";
        //         if (pdkServer.playing) {
        //             sText = sPre + "现在退出房间将为您托管游戏。";
        //         } else {
        //             sText = sPre + "您确定要退出游戏？"
        //         }
        //     }
        // } else if (this._roomInfo.roomFlag == 2) {
        //     let sPre = "再玩" + info + "局即可获得奖杯";
        //     if (info <= 0) {
        //         sPre = "本局结束即可获得奖杯";
        //     }

        //     if (pdkServer.playing) {
        //         sText = sPre + ",现在退出房间将为您托管游戏。";
        //     } else {
        //         sText = sPre + ",您确定要退出游戏？"
        //     }
        // }

        PDKAlert.show(sText, 1, this.onAlertResult.bind(this, 0));
    }

    private sendQuickJoinWithFlag() {
        this._onSendQuickJoin();
        // //红包场不延迟
        // if(this._roomInfo && this._roomInfo.roomID == 5001 ||
        // (this._roomInfo.style && (this._roomInfo.style == 'diamond' || this._roomInfo.style == 'queue'))){
        //     pdkServer.quickJoin();  
        //     return;
        // }

        var d = 2000;
        if (this.roomid == 1001) {
            d = 1200;
        } else if (this.roomid == 1002) {
            d = 1600;
        } else if (this.roomid == 1002) {
            d = 2000;
        }
        d = Math.ceil(Math.random() * d + 200);
        this._timerDelayJoin = egret.setTimeout(() => {
            pdkServer.quickJoinWithFlag();
        }, this, d);
    }


    private sendQuickJoin(): void {
        //console.log("sendQuickJoin--->",arguments.callee.caller);

        this._onSendQuickJoin();
        // //红包场不延迟
        // if(this._roomInfo && this._roomInfo.roomID == 5001 ||
        // (this._roomInfo.style && (this._roomInfo.style == 'diamond' || this._roomInfo.style == 'queue'))){
        //     pdkServer.quickJoin();  
        //     return;
        // }

        var d = 2000;
        if (this.roomid == 1001) {
            d = 1200;
        } else if (this.roomid == 1002) {
            d = 1600;
        } else if (this.roomid == 1002) {
            d = 2000;
        }
        d = Math.ceil(Math.random() * d + 200);
        this._timerDelayJoin = egret.setTimeout(() => {
            pdkServer.quickJoin();
        }, this, d);
    }

    private test(): void {
        // this.showDragonFeiJi();

        // this.showDragonMyLianDui();
        // this.showDragonRightLianDui();
        // this.showDragonLeftLianDui();

        // this.showDragonMySanDaiEr()
        // this.showDragonRightSanDaiEr();
        // this.showDragonLeftSanDaiEr();

        // this.showDragonMySanDaiYi()
        // this.showDragonRightSanDaiYi();
        // this.showDragonLeftSanDaiYi();

        // this.showDragonMyShunZi();
        // this.showDragonLeftShunZi();
        // this.showDragonRightShunZi();

        // this.showDragonMySiDaiEr()
        // this.showDragonRightSiDaiEr();
        // this.showDragonLeftSiDaiEr();

        // this.showDragonZhaDan();           

        // this.showRedcoinDragon(true);

        // this.seat1.showJingDeng();
        // this.seat2.showJingDeng();   

        egret.setTimeout(this.delayShowChangeEffect.bind(this, 0, 100), this, 1000);
        egret.setTimeout(this.delayShowChangeEffect.bind(this, 1, -100), this, 1000);
    }

	/**
	 * 操作按钮
	 * @param event
	 */
    private onButtonBarTap(event: egret.TouchEvent): void {
        switch (event.data.action) {
            case 'cancelSelect':
                this._mySeat.cancelSelect();
                break;
            case 'pass':
                //pdkServer.useCardNtf([]);
                pdkServer.sendPdkOutcard([]);
                this._mySeat.cancelSelect();
                break;
            case 'use':
                let pokerIds: number[] = this._mySeat.getSelectPokerIds();
                //pdkServer.useCardNtf(pokerIds);
                console.log('==============================>>> select plker ids = ' + JSON.stringify(pokerIds));
                pdkServer.sendPdkOutcard(pokerIds);
                break;
            case 'setScore':
                pdkServer.answerMaster(event.data.score);
                this.buttonBar.switchState('hidden');
                break;
            case 'help':
                if (!this._mySeat.help()) {
                    //pdkServer.useCardNtf([]);
                    pdkServer.sendPdkOutcard([]);
                    this._mySeat.cancelSelect();
                    this._mySeat.showNoMatchCards();
                }
                break;
        }
    }

    private _selectCardsCount: number;
    private _canUse: boolean;
    private onSelectCards(event: egret.Event = null): void {
        if (event) {
            console.log(event.data);
            this._selectCardsCount = event.data.count;
        }
        if (this.buttonBar.currentState == 'useCard' || this.buttonBar.currentState == 'useCard2') {
            //console.log(this._selectCardsCount);
            this.buttonBar.modifyButton('cancelSelect', this._selectCardsCount > 0);
        }
        if (event) {
            this._canUse = event.data.canUse;
        }
        if (this.buttonBar.currentState == 'useCard' || this.buttonBar.currentState == 'useCard2') {
            //console.log(this._hasSame);
            this.buttonBar.modifyButton('use', this._canUse);
        }
    }

	/**
	 * 返回确认处理
	 * @param action
	 */
    private onBackResult(action: string): void {
        switch (action) {
            case 'confirm':
                pdkServer.giveUpGame();
                PDKMainLogic.backToRoomScene();
                break;
            case 'cancel':

                break;
        }
    }

	/**
	 * 提示确认处理
	 * @param type
	 * @param action
	 */
    private onAlertResult(type: number, action: string): void {
        switch (action) {
            case 'confirm':
                switch (type) {
                    case 0:
                        if (pdkServer._isInDDZ == true) {
                            if (!pdkServer.isMatch && !pdkServer.isPersonalGame) {
                                if (!pdkServer.playing) {
                                    if (this._roomInfo.style && (this._roomInfo.style == 'diamond' || this._roomInfo.style == 'queue')) {
                                        pdkServer.QuitWaitingQueueReq();
                                    } else {
                                        pdkServer.giveUpGame();
                                    }
                                }
                            }
                            // MainLogic.backToRoomScene();
                            this.quitGame();
                            return;
                        }
                        if (!pdkServer.isMatch && !pdkServer.isPersonalGame) {
                            if (!pdkServer.playing) {
                                if (this._roomInfo.roomID == 5001 || this._roomInfo.roomID == 1003 ||
                                    (this._roomInfo.style && (this._roomInfo.style == 'diamond' || this._roomInfo.style == 'queue'))) {
                                    // let data = {optype:4};
                                    // pdkServer.send(PDKEventNames.USER_DiamondGame_REQ,data);
                                    pdkServer.QuitWaitingQueueReq();
                                } else {
                                    pdkServer.giveUpGame();
                                }
                            }
                        }
                        PDKMainLogic.backToRoomScene();
                        // if(this._timerDelayJoin){
                        //     clearTimeout(this._timerDelayJoin);
                        // }
                        break;
                    case 1:
                        if (!pdkServer.isMatch && !pdkServer.isPersonalGame) {
                            this.sendQuickJoin();
                            this.initData();
                        }
                        break;
                    case 2:
                        if (this.isPersonalGame) {
                            pdkServer.QuitPGameReq(this.roomid);
                        } else if (pdkServer.isMatch) {
                            //never giveup match
                            if (this._roomInfo.matchId == 100) {

                            } else {
                                //pdkServer.giveUpMatch(pdkServer.roomInfo.matchId);
                            }
                        } else if (pdkServer.playing) {
                            pdkServer.giveUpGame();
                        } else {

                        }
                        if (pdkServer._isInDDZ) {
                            this.quitGame();
                        }
                        else {
                            PDKMainLogic.backToRoomScene();
                        }
                        break;
                    case 3:
                        if (pdkServer._isInDDZ) {
                            this.openDDZShop();
                        }
                        else {
                            PDKPanelExchange2.instance.show();
                        }
                        break;
                    case 4:
                        this.quitGame();
                        break;
                }
                break;
            case 'cancel':

                break;
        }
    }

    private quitGame() {
        //关闭背景音乐                 
        // PDKSceneManager.back();
        PDKSceneManager.show(PDKSceneNames.ROOM, { jump2pdk: true }, PDKalien.sceneEffect.Fade);
        // pdkServer.ddzDispatchEvent(1, '', { type: 1 });
    }

    private openDDZShop(flag = 0) {
        pdkServer.ddzDispatchEvent(1, '', { type: 2, shopFlag: flag });
    }

	/**
	 * 比赛中的操作收到服务器的回复
	 */
    // result = 0 成功 1 玩家不存在 2 比赛不存在 3 次数达到上限 4 不支持复活 5 金豆不足 6 配置不存在 7 超时未复活
    private _onRecvMatchOperateRep(e: egret.Event): void {
        let data = e.data;
        if (!data) return;
        //比赛复活
        if (data.optype == 1) {
            if (data.result == 0) {
                if (data.params && data.params.length >= 1) {
                    this._mySeat.userInfoView.updateGold(data.params[0]);
                }
                PDKPanelMatchRevive.remove();
                this._clearMatchReviveInterval();
                egret.clearTimeout(this._timerClean);
                //this.cleanSeat();
                this.setlabWaiting("复活成功,正在为您匹配对手,请稍等...");
            } else {
                let _txt = {
                    [3]: "次数达到上限",
                    [4]: "不支持复活",
                    [5]: "金豆不足",
                    [7]: "超时未复活",
                    [8]: "决赛已经开始",
                }

                let _showStr = "复活失败";
                if (_txt[data.result]) {
                    _showStr = _txt[data.result];
                }
                PDKAlert.show(_showStr, 0, function () {
                    this._onMatchReviveTimeOut(data);
                }.bind(this));
            }
        }
    }

	/**
	 * 当快速加入成功
		message QuickJoinResonpse {
			required int32 result = 1; //0成功，1失败
			required int32 clientid = 2;
		}
	 * @param event
     * //0成功  2 金豆不足 3 房间已满  4 用户已经存在 5 用户不存在 6 服务器不可用  7 拥有金豆超过房间上限
	 */
    private onQuickJoinResponse(event: egret.Event): void {
        let data = event.data;
        switch (data.result) {
            case 0:
                console.log('join success.');
                this.hideDeskCards();
                break;
            case 1:
                console.log('join failed.');
                break;
            case 2:
                // PDKAlert.show(PDKlang.noMoreGold,0,this.onAlertResult.bind(this,0));
                if (this._roomInfo.roomID == 9002 || this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005) { //红包场钻石不足
                    PDKMainLogic.instance.noDiamondGetNewDiamondRewOrBuyRevive(this._roomInfo.minScore, this._roomInfo.roomID);
                    // this.initData(true);
                    // PDKAlert.show("钻石不足，是否前往商城购买 ？", 1, function (act) {
                    //     if (act == "confirm") {
                    //         if (pdkServer._isInDDZ == true) {
                    //             pdkServer.ddzDispatchEvent(1, '', { type: 2, shopFlag: 0 });
                    //         }
                    //         else {
                    //             PDKPanelExchange2.instance.show();
                    //         }
                    //     }
                    // });
                    // this.btnContinue.visible = true;
                    // return;
                }
                else {
                    // PDKPanelRechargeTips.instance.show(this.onAlertResult.bind(this, 0));
                    // if (!pdkServer.playing) {
                    //     this._showNextMasterCardGuessBtn(true);
                    //     this.btnContinue.visible = true;
                    // }
                    this.initData(true);
                    PDKAlert.show("金豆不足，是否前往商城购买 ？", 1, function (act) {
                        if (act == "confirm") {
                            if (pdkServer._isInDDZ == true) {
                                pdkServer.ddzDispatchEvent(1, '', { type: 2, shopFlag: 0 });
                            }
                            else {
                                PDKPanelExchange2.instance.show(0);
                            }
                        }
                    });
                    this.btnContinue.visible = true;
                }
                break;
            case 3:
                PDKAlert.show(PDKlang.no_more_desk, 0, this.onAlertResult.bind(this, 0));
                break;
            case 4:
                console.log('join failed.');
                break;
            case 7:
                // console.log('join failed.');
                PDKAlert.show('拥有金豆超过房间上限', 0, () => {
                    PDKMainLogic.backToRoomScene();
                });
                break;
        }
    }

    private hideDeskCards(): void {
        this._seats.forEach((seat: PDKDDZSeat) => {
            seat.cleanDesk();
        });
    }

    private onReconnectTableRep(event: egret.Event): void {
        let data = event.data;
        if (data.result != 0) {
            if (data.result == 1 || data.result == 2)//如果不是比赛，并且游戏没有开始
            {
                PDKMainLogic.backToRoomScene();
            }
        }

    }

	/**
	 * 放弃游戏返回
	 * @param event
	 */
    private onGiveUpGameRep(event: egret.Event): void {
        let data = event.data;

        switch (data.result) {
            case 0:
                console.log('give up game success.');
                PDKMainLogic.backToRoomScene({ roomInfo: this._roomInfo });
                break;
            case 1:
                console.log('give up game failed.');
                break;
        }
    }

	/**
	 * 当收到用户信息
	 * userInfo
	 * @param event
	 */
    private onUserInfoInGameResponse(event: egret.Event): void {
        let data = event.data;
        let _myData = PDKMainLogic.instance.selfData;
        // 表情免费次数
        if (data.uid == _myData.uid && data.gameprop >= 0) {
            _myData.setFreeBrowCount(data.gameprop);
        }
        //        data.imageid ="/uploads/avatar/tax465.jpg";
        let seat: PDKDDZSeat = this.getSeatByUId(data.uid);
        if (seat) {
            if (data.offline) {
                seat.setUserOffline(true);
            } else {
                seat.setUserOffline(false);
            }
            if (this._roomInfo.roomID == 9002 || this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005) { //红包场要用此字段显示钻石不要刷新背包
                seat.updateUserInfoData(data);

                if (seat == this._mySeat) {
                    seat.userInfoView.updateGold(data.gold);
                    if (data.diamond) {
                        this._setDiamondUI(data.diamond);
                    }
                } else {
                    if (data.diamond) {
                        seat.userInfoView.updateGold(data.diamond);
                    }
                }
            } else
                if (pdkServer.isMatch) {
                    data.nickname = '参赛玩家'
                    if (seat.isMaster) {
                        data.imageid = 'pdk_icon_head9'
                    } else {
                        data.imageid = 'pdk_icon_head10'
                    }
                    //自己的信息值刷新金豆，其他的不刷新
                    if (seat == this._mySeat) {
                        seat.userInfoData.initData(data);
                        seat.userInfoView.updateGold(data.gold);
                        seat.userInfoView.updateHeadImage(data.imageid);
                    }
                    else {
                        seat.updateUserInfoData(data);
                    }
                    //seat.userInfoView.update(data);
                } else {
                    this.setRedProcess();
                    seat.updateUserInfoData(data);
                }
        }
    }
    /**
     * 急速红包场开始游戏要扣除台费
     */
    private redNormalSubDiamond() {

    }
	/**
	 * 游戏开始
	 * @param event
		message GameStartNtf {
			message PlayerInfo {
		      required int32 uid = 1;
		      required int32 seatid = 2;
		      optional string gold = 4;
		      optional string nickname = 5;
		    }
		    required int32 session = 1;
			required int32 playercnt = 2;
		    repeated PlayerInfo playerinfo = 3;
		}
	 */
    private onGameStart(event: egret.Event): void {
        console.log('----------game start----------');

        let data = event.data;

        this.beforeGameStart();
        this._reconnectIn = false;
        this._showMatch9WaitOtherPlayerOver(false);
        this.playersSeatDown(data.playerinfo);
        //todo 游戏开始要处理的代码

        if (this._cache.length > 0) {
            this._cache.forEach((item: any) => {
                item.method.call(this);
            });
            this._cache.splice(0);
        }
        if (this.isPersonalGame) {
            this.lbRound.text = String(this.cur_round) + '/' + String(this.total_round);
        } else if (!pdkServer.isMatch && !this.isPersonalGame) {
            this.setRedCoin();
            this.setBeforeWincnt();
        }

        //zhu 
        if (data.cardsrecorderremain && PDKMainLogic.instance.selfData.cardsRecorder) {
            PDKMainLogic.instance.selfData.cardsRecorder[6] = data.cardsrecorderremain;
            this.refreshCardsRecorderAbout();
        }
        this._showNextMasterCardGuessBtn(false);
    }

    /**
     * 检查是否需要弹出红包赛规则，如果需要则弹出
     */
    private _shouldTipRedNormalRule() {
        let _hasTip = PDKalien.localStorage.getItem("redNormalRule");
        if (_hasTip != "1") {
            this._showRedNormalRule();
            PDKalien.localStorage.setItem("redNormalRule", "1");
        }
    }

    /**
     * 检查是否需要弹出游戏规则，如果需要则弹出
     */
    private _shouldTipGameRule() {
        let _hasTip = PDKalien.localStorage.getItem("gameNormalRule");
        if (_hasTip != "1" && this._roomInfo.roomID != 5001 && this._roomInfo.roomID != 5101) {
            let bTwoGame: boolean = (this._roomInfo.roomID == 3101 || this._roomInfo.roomID == 5101 || this._roomInfo.roomID == 3102);
            PDKPanelRuleTip.getInstance().show(bTwoGame);
            PDKalien.localStorage.setItem("gameNormalRule", "1");
        }
    }

    /**
     * 检查是否阅读过游戏规则
     */
    private _shouldShowRuleFlag() {
        let _hasTip = PDKalien.localStorage.getItem("gameRuleFlag");
        if (_hasTip != "1") {
            this.ruleReadedFlag.visible = true;
        }
    }

    private setRedCoin(): void {
        if (PDKMainLogic.instance.selfData.freshmanredcoinsent != 1) {
            var hasShow: string = PDKalien.localStorage.getItem("freshmanredcoinsent");
            if (hasShow == "1") {
                this.showRedcoinDragon(false);
            }
            else {
                //红包场不提示新手王炸红包
                //if(this._roomInfo.roomID != 5001 && this._roomInfo.roomID != 5101){
                if (this._roomInfo.roomID == 3006) {
                    //只有初级场显示王炸任务
                    pdkServer.startCache();
                    this.showRedcoinDragon(true);
                }
            }
        }
        //已领取新手红包
        else {

        }
    }

	/**
	 * 重连
	 * @param event
	 message PlayerInfo {
    	required int32 uid = 1;
    	required int32 seatid = 2;
    	repeated int32 params = 3;
  	}
	 required int32 session = 1;
	 required int32 status = 2;

	 optional int32 time = 3;
	 repeated PlayerInfo players = 4;
	 repeated int32 params1 = 5;
	 repeated int32 params2 = 6;
	 */
    private onReconnectRep(event: egret.Event): void {
        this.labWaiting.visible = false;
        let data = event.data;

        this._reconnectIn = true;

        this.beforeGameStart();

        this.playersSeatDown(data.players);

        //todo 重连要处理的代码
        this._mySeat.addCards(data.params1, !this._reconnectIn);

        data.players.forEach((player: any) => {
            let seat: PDKDDZSeat = this.getSeatById(player.seatid);
            seat.setHang(player.params[1] == 1);
            if (pdkServer.isMatch) {
                let info: any = {
                    imageid: 'pdk_icon_head10',
                    nickname: '参赛玩家'
                };
                seat.userInfoView.update(info);
            }
            if (player.params[2] == 1) { //玩家离线
                seat.setUserOffline(true);
            }
            if (player.params[3] == 2) {//是否加倍 4 加倍 (0未开始 1不加倍 2加倍)
                seat.showDoubleFlag(true);
            }
            if (this._mySeat.seatid != seat.seatid) {
                //console.log('%s有%d张牌', seat.userInfoData.uid, player.params[0]);
                (<PDKSideSeat>seat).setCardCount(player.params[0]);
            }
        });

        let masterCards: number[] = [];
        let li = data.params2.length;
        if (data.params2[li - 1] > 0) {
            for (let i = li - 1; i >= li - 3; i--) {
                masterCards.unshift(data.params2[i]);
            }
            this.showMasterCards(masterCards, true);
        }

        if (data.mastersid != null && data.mastersid >= 0) {
            let _masterSeat = this.getSeatById(data.mastersid);
            _masterSeat.setMaster(true, false);
        }

        if (!pdkServer.isMatch && !this.isPersonalGame) {
            this.setBeforeWincnt();
            this.setRedCoin();
        }
        pdkServer.hang(false);

        if (data.params3) {
            for (var i = 0; i < data.params3.length; ++i) {
                if (data.params3[i]) {
                    this.setGCGold(i, data.params3[i])
                }
            }
        }

        if (data.params4) {
            this._setRecorderInfoByServerNum(data.params4);
        }

        this.autoOpenRecorder();
        PDKBagService.instance.refreshBagInfo();
        //100开始游戏 0 开始发牌 1叫庄 2 出牌 3 检查是否结束 4 加倍 255 空闲状态
        if (data.status == 1 || data.status == 2) {
            if (data.status == 1) {
                let _event = new egret.Event("reconnect");
                _event.data = { seatid: data.cursid, time: data.time };
                this.onAskMaster(_event);
            } else if (data.status == 2) {
                let _cardType = -1;
                let _cardids = data.params2.slice(0, data.params2.length - 3);
                if (data.params2.length > 0) {
                    let _seat = this.getSeatById(data.presid);
                    _cardType = _seat.useCard(_cardids, false, false);
                }
                _cardids = PDKUtils.transformCards(_cardids);
                this.onAskPlayCard({ cardType: _cardType, cardids: _cardids, pseatid: data.presid, seatid: data.cursid, time: data.time });
            }
        } else {
            let masterSeatId = data.params5[0];
            //zhu 没有确定地主时断线重连回来报错
            if (!masterSeatId) return;

            let score = data.params5[1];
            let masterSeat = this.getSeatById(masterSeatId);
            masterSeat.setMaster(true, false);
            this.masterCards.updateScore(data.params5[0], score);
        }

        PDKMainLogic.instance.refreshSelfInfo();
    }

    private showMasterCards(cards: number[], reconnect: boolean): void {
        this.masterCards.showCards(cards, reconnect);

        this._seats.forEach((seat: PDKDDZSeat) => {
            seat.hideScore();
        });
    }

	/**
	 * 全部玩家就坐
	 * @param players
	 */
    private playersSeatDown(players: any[]): void {
        players.some((player: any) => {
            if (player.uid == pdkServer.uid) {
                pdkServer.seatid = player.seatid;
                return true;
            }
        });

        players.forEach((player: any) => {
            this.playerSeatDown(player);
        });
    }

	/**
	 * 在游戏回合开始前处理
	 */
    private beforeGameStart(): void {
        this.newGame();
        this._askPlayCardCount = 0;

        if (pdkServer.isMatch) {
            this.updateMathTurnInfo();
        }
    }

	/**
	 * 更新桌面信息
	 * @param event
		message TableInfo {
			message Info {
				required int32 uid = 1;
		      required int32 seatid = 2;
		      required int32 ready = 3;
		      optional string gold = 4;
		      optional string nickname = 5;
			}
			required int32 session = 1;
			repeated Info players = 2;
		}
	 */
    private onTableInfo(event: egret.Event): void {
        let data = event.data;
        for (var i = 0; i < data.players.length; ++i) {
            this.playerSeatDown(data.players[i]);
        }
    }

	/**
	 * 当有人进入房间
	 * @param event
		message EnterTable {
			required int32 session = 1;
			required int32 uid = 2;
			required int32 seatid = 3;
			optional string gold = 4;
			optional string nickname = 5;
		}
	 */
    private onEnterTable(event: egret.Event): void {
        let data = event.data;

        this.playerSeatDown(data);
        this.hideDeskCards();
        // ++this.playerCnt;
        if (pdkServer.isPersonalGame) {
            this.setShareStart();
        }
    }

    private setlabWaiting(str: string = null) {
        if (str) {
            this.labWaiting.text = str;
            this.labWaiting.visible = true;
        } else {
            this.labWaiting.visible = false;
        }
    }

    private setShareStart() {
        if (!this.gamestarted) {
            var playerCnt = this.getPlayersAmount();
            if (playerCnt >= 3) {
                this.btnShare.visible = false;
                if (this.isowner) {
                    this.setStartPgameBtnVisible(true);
                } else {
                    this.setlabWaiting('等待房主开始');
                }
            } else {
                this.setlabWaiting('房间ID:' + this.roomid);
                if (this.isowner) {
                    this.setStartPgameBtnVisible(false);
                }
                this.btnShare.visible = true;
                this.setStartPgameBtnVisible(false);
            }
        } else {
            this.btnShare.visible = false;
            this.setStartPgameBtnVisible(false);
        }
    }

	/**
	 * 当有人离开房间
	 * -- reason 0表示正常踢出，不用发送LeaveTable协议，其他值需要发送LeaveTable协议，游戏开始后不能被踢出
	 * -- 1表示玩家主动离开桌子，
	 * -- 2表示玩家长时间未开始被踢出桌子
	 * -- 3表示桌子解散桌子
	 * -- 4表示钱不够了
	 * @param event
		message LeaveTable {
			required int32 session = 1;
			required int32 uid = 2;
			required int32 reason = 3;
		}
	 */
    private onLeaveTable(event: egret.Event): void {
        let data = event.data;

        if (data.uid == pdkServer.uid) {
            switch (data.reason) {
                case 0:
                case 1:
                case 2:
                case 3:
                    if (!pdkServer.isMatch && !pdkServer.isPersonalGame) {
                        this.playerStandUp(data.uid);
                    }
                    break;
                case 4:
                    // if(!PDKMainLogic.instance.alms(this._mySeat.userInfoData.gold)) {  //请求救济金
                    //     // PDKAlert.show(PDKlang.noMoreGold,1,(action: string) => { //未达到救济金要求，提示充值
                    //     //     if(action == 'confirm') {
                    //     //         PDKRechargeService.instance.recharge();
                    //     //     }
                    //     //     PDKMainLogic.backToRoomScene();
                    //     // });
                    //     // PDKPanelRechargeTips.instance.show();
                    //     PDKPanelRechargeTips.instance.show(this.onAlertResult.bind(this,0));
                    // }
                    break;
            }
        } else {
            this.playerStandUp(data.uid);
        }
        // --this.playerCnt;
        if (this.isPersonalGame) {
            this.setShareStart()
        }
    }

	/**
	 * 当收到准备通知
	 * @param event
		message AskReady {
			required int32 session = 1;
			required int32 time = 2;
			required int32 uid = 3;
			optional int32 flag = 4;
		}
	 */
    private onAskReady(event: egret.Event): void {
        let data = event.data;

        this.cdProgressBar.play(data.time);
    }

	/**
	 * 当准备返回
	 * @param event
		message GetReadyRep {
			required int32 session = 1;
			required int32 result = 2;
			required int32 seatid = 3;
		}
	 */
    private onGetReadyRep(event: egret.Event): void {
        let data = event.data;

        let seat: PDKDDZSeat = this.getSeatById(data.seatid);
        if (seat.userInfoData.uid == pdkServer.uid) {
            this.cdProgressBar.stop();
        }

        seat.setReady(true);
    }

	/**
	 * 问地主
	 * @param event
	 * {
      "index" : 5,
      "score" : 0,
      "seatid" : 2,
      "session" : 221001,
      "time" : 20
     }
	 */
    private onAskMaster(event: egret.Event): void {
        let data: any = event.data;
        if (this._mySeat.seatid == data.seatid) {
            this.buttonBar.switchState('askMaster', data.score);
        } else {
            this.buttonBar.switchState('hidden');
        }

        let seat: PDKDDZSeat = this.getSeatById(data.seatid);
        //zhu 加上空处理
        if (seat) {
            seat.startCD(data.time);
        }

    }

    private autoOpenRecorder(): void {
        var opencardsrecorder = egret.localStorage.getItem("opencardsrecorder");
        var userInfoData: PDKUserInfoData = PDKMainLogic.instance.selfData;
        if (userInfoData.hasRecorder() && opencardsrecorder == '1') {
            this._showRecorder(true);
        }
    }
	/**
	 * 叫分
	 * @param event
	 * {
      "index" : 6,
      "ismaster" : false,
      "score" : 0,
      "seatid" : 2,
      "session" : 221001
     }
	 */
    private onSetScore(event: egret.Event): void {
        let data: any = event.data;
        let seat: PDKDDZSeat = this.getSeatById(data.seatid);
        if (!seat) return;

        if (data.ismaster) {
            //zhu this.btnGuessCards.visible = true;
            seat.setMaster(data.ismaster, !this._reconnectIn);
            if (pdkServer.isMatch) {
                data.imageid = 'pdk_icon_head9';
                data.nickname = '参赛玩家';
                if (seat == this._mySeat) {
                    data.uid = PDKMainLogic.instance.selfData.uid;
                }
                seat.userInfoView.update(data);
            }

            this.autoOpenRecorder();
        } else if (this._mySeat.seatid == data.seatid) {
            this.buttonBar.switchState('hidden');
        }

        if (data.score > 0) {
            this.masterCards.updateMultiple(data.score);
        }

        //if (!this._reconnectIn) {
        seat.stopCD();
        seat.showScore(data.ismaster ? -1 : data.score);
        //}

        //1000 = 急速红包场
        if (data.ismaster && (!pdkServer.isPersonalGame) && (!pdkServer.isMatch) && this._roomInfo.roomID != 5001 && this._roomInfo.roomID != 5101) {//只有普通房间才可以钻石加倍
            this._showDoubleNoDouble(true);
            this.doubleCost_label.text = "x" + this._roomInfo.doublediamond;
            let _ret = this._checkShowFailDouble();
            this._doubleRet = _ret;
            if (_ret.bShow) {
                this._showFailDouble(true, _ret.nReason);
            } else {
                this._showFailDouble(false);
            }
            this._mySeat.startCD(5);
            this._clearAskDoubleTimeOut();
            this._askDoubleTimeOutId = egret.setTimeout(this._onMyAskDoubleTimeOut, this, 5000);
        }
    }

    /**
     * 清除加倍不加倍的timeout
     */
    private _clearAskDoubleTimeOut(): void {
        if (this._askDoubleTimeOutId != 0) {
            egret.clearTimeout(this._askDoubleTimeOutId);
        }
        this._askDoubleTimeOutId = 0;
    }

	/**
	 * 发牌
	 * @param event
	 * seatid座位号 askseatid询问操作座位号 time 操作时间 cardids N张扑克(每个玩家一张，按座位号索引)
		message AddCard{
			required int32 session = 1;
			required int32 index = 2;
			required int32 seatid = 3;
			optional int32 askseatid = 4;
			optional int32 cardid = 5;
			optional int32 time = 6;
			repeated int32 odds = 7;
			repeated int32 cardids = 8;
		}
	 */
    private onAddCard(event: egret.Event): void {
        // this.btnContinue.visible = false;
        let data: any = event.data;
        if (pdkServer.isMatch && data.reshufflecnt && data.reshufflecnt > 0) {
            for (var i = 0; i < 3; ++i) {
                let seat: PDKDDZSeat = this.getSeatById(i + 1);
                seat.updateGold(-100, pdkServer.isMatch);
            }
        }
        this._mySeat.cancelSelect();
        this._setRecorderInfoByServerCard(data.cardids);
        if (pdkServer.playing) {
            this.addCard(data);
        } else {
            this._cache.splice(0);
            this._cache.push({ method: this.addCard.bind(this, data) });
        }
    }

    private addCard(data: any): void {
        let seat: PDKDDZSeat = this.getSeatById(data.seatid);
        seat.cleanHand();
        seat.addCards(data.cardids, true, true);

        this['seat' + 1].addCards([]);
        this['seat' + 2].addCards([]);
    }

	/**
	 * 当有玩家出牌
	 * {
   *  "index" : 14,
   *  "seatid" : 1,
   *  "session" : 221001
   * }
	 * @param event
	 */
    private onUseCard(event: egret.Event): void {
        let data: any = event.data;

        let seat: PDKDDZSeat = this.getSeatById(data.seatid);
        let _cardType: number = -1;

        //刚刚出的牌
        if (seat) {
            seat.cleanDesk();
            _cardType = seat.useCard(data.cardids);
            seat.stopCD();
        }

        //如果刚刚出的牌是我出的
        if (this._mySeat.seatid == data.seatid) {
            this.buttonBar.switchState('hidden');
            this._mySeat.cancelSelect();
            this._mySeat.hideNoMathCards();
            this._mySeat.checkType([]);
        } else {
            this._updateRecorderByCards(data.cardids);
        }

        if (data.time && data.cursid) {
            let _pseatid = data.seatid;

            // 上轮我出的牌最大
            if (data.lastseatid == this._mySeat.seatid) {
                _pseatid = 0;
            }
            data.lastcards = PDKUtils.transformCards(data.lastcards)
            this.onAskPlayCard({ cardType: _cardType, cardids: data.lastcards, pseatid: _pseatid, time: data.time, seatid: data.cursid });
        }
    }

	/**
	 * 当有玩家出牌
	 message SetCards{
			required int32 session = 1;
			required int32 seatid = 2;
			repeated int32 cardids = 3;
		}
	 * @param event
	 */
    private onSetCards(event: egret.Event): void {
        let data: any = event.data;

        let seat: PDKDDZSeat = this.getSeatById(data.seatid);
        //seat.cleanDesk();
        if (!seat) return;
        if (data.seatid != pdkServer.seatid) {
            seat.useCard(data.cardids, true);
        }
    }

    private getGuessCardsType(cards: any): number {
        if (!cards || cards.length != 3) return 0;

        cards.sort((c1: any, c2: any): number => {
            return c1 - c2;
        });


        var sequence = true
        var samecolor = true
        var haspair = false
        var hasJQK = false
        var hasJork = false
        var has2 = false
        cards.forEach((v: number, i: number) => {
            if (v == 140 || v == 150) {
                hasJork = true
                samecolor = sequence = false;
            }

            if (!hasJQK && (Math.floor(v / 10) == 9 || Math.floor(v / 10) == 10 || Math.floor(v / 10) == 11)) {
                hasJQK = true
            }

            if (!has2 && (Math.floor(v / 10) == 13)) {
                has2 = true
            }
        });

        for (var i = 1; i < 3; ++i) {
            var xx = Math.floor(cards[i] / 10);
            if (Math.floor(cards[i] / 10) == Math.floor(cards[i - 1] / 10)) {
                haspair = true
            }

            if (!hasJork) {
                if (Math.floor(cards[i] / 10) - Math.floor(cards[i - 1] / 10) != 1) {
                    sequence = false
                }

                if ((cards[i] % 10) != (cards[i - 1] % 10)) {
                    samecolor = false
                }
            }
        }

        if (has2 && sequence) {
            sequence = false
        }

        if (!sequence) {
            if ((Math.floor(cards[0] / 10) == 1 && Math.floor(cards[1] / 10) == 12 && Math.floor(cards[2] / 10) == 13) ||
                (Math.floor(cards[0] / 10) == 1 && Math.floor(cards[1] / 10) == 2 && Math.floor(cards[2] / 10) == 13)) {
                sequence = true
            }
        }

        if (sequence && samecolor) {
            return 6
        } else if (sequence) {
            return 5
        } else if (samecolor) {
            return 4
        } else {
            if (hasJork) return 3;
            if (haspair) return 2;
            if (hasJQK) return 1;

            return 0
        }
    }

    private setGCGold(index: number, cnt: number): void {
        if (index < 0 || index > 5) return;
        if (!cnt || cnt < 0) return;

        ++this.guesscount[index];

        this['GCGold' + index].goldNum += cnt;
        this['GCGold' + index].visible = true;
        this['GCGold' + index].setData(this['GCGold' + index].goldNum);
        this._mySeat.userInfoView.updateGold(PDKMainLogic.instance.selfData.gold);
        this._mySeat.userInfoView.avatar.setVipLevel(PDKMainLogic.instance.selfData.getCurVipLevel());
        // this['GCGold' + index].text = 'x' + cnt;// * this._roomInfo.ba;
    }

    private hideGuessRight(): void {
        this.grpGuessRight.visible = false;
        this.grpGRLight.visible = false;
    }

    private goldfly(cseat: PDKDDZSeat, cx: any, cy: any, tx: any, ty: any): void {
        for (var i = this.flygoldindex; i < this.flygoldindex + 5; ++i) {
            //  setTimeout(this['flygold' + i].fly.bind(this['flygold' + i]),70 * (i - this.flygoldindex),cx,cy,tx,ty,700);
            egret.setTimeout(this['flygold' + i].fly, this['flygold' + i], 70 * (i - this.flygoldindex), cx, cy, tx, ty, 700);
        }
        this.flygoldindex += 5;
        // setTimeout(this.hideGuessRight.bind(this), 700 * 4);
        egret.setTimeout(this.hideGuessRight, this, 700 * 4);
    }

    private playGuessRightAnimate(seat: any, gold: number): void {
        var cseat = this.getSeatById(seat)
        // var flygoldindex = 0;
        let tpos = cseat.getAvatarPos();
        if (cseat == this._mySeat) {
            this.grpGuessRight.visible = true;
            // this.gcardtype.source = 
            this.gwingold.text = 'x' + gold;
            egret.Tween.get(this.gcgoldLight0).set({
                visible: true,
                alpha: 0,
                scaleX: 0.76,
                scaley: 0.55,
            })
                .to({
                    alpha: 1,
                    scaleX: 3.16,
                    scaley: 1.60,
                }, 146).to({
                    alpha: 0,
                    scaleX: 1.62,
                    scaley: 0.22,
                }, 292);

            egret.Tween.get(this.gcgoldLight1).set({
                visible: true,
                alpha: 0,
                scaleX: 0.76,
                scaley: 0.55,
            })
                .wait(438).to({
                    alpha: 1,
                    scaleX: 3.16,
                    scaley: 1.60,
                }, 146).to({
                    alpha: 0,
                    scaleX: 1.62,
                    scaley: 0.22,
                }, 292).call(this.goldfly, this, [cseat, this.grpGuessRight.x, this.grpGuessRight.y, tpos.x, tpos.y]);
            // goldfly(flygoldindex:number, cseat:PDKDDZSeat): void {
            // call(this.hideGuessRight, this);
            //
        } else {
            var cp = this.localToGlobal(this.btnGuessCards.x, this.btnGuessCards.y);
            this.goldfly(cseat, cp.x, cp.y, tpos.x, tpos.y);
            // for(var i = flygoldindex; i < flygoldindex + 5; ++i){
            //     this['flygold' + i].fly(this.btnGuessCards.x, this.btnGuessCards.y, cseat.userInfoView.avatar.x, cseat.userInfoView.avatar.y);
            // }
        }

        if (cseat) {
            if (cseat != this._mySeat) {
                cseat.playWinGoldAnimate();

                //极速红包场不更新金豆
                if (this._roomInfo && this._roomInfo.roomID != 5001 && !pdkServer.isMatch) {
                    cseat.updateGold(gold);
                }
            }
            else {
                if (!pdkServer.isMatch) { //不是比赛才加，比赛显示的是积分
                    cseat.updateGold(gold);
                }
            }
        }
    }

    private playGuessWrongAnimate(): void {
        // this.guessWrong
        egret.Tween.get(this.guessWrong).set({
            visible: true,
            alpha: 0,
        })
            .to({
                alpha: 1,
            }, 146).wait(1000).to({
                alpha: 0,
                visible: false,
            }, 1000);
    }

    /**
     * 收到服务器下发的发送表情回复
     */
    private _onServerBrowRep(data): void {
        if (data.result == null) { //成功
            if (data.params && data.params.length == 3) {
                let fromSeatId = data.params[0];
                let toSeatId = data.params[1];
                let browId = data.params[2];
                let cfg = PDKGameConfig.getBrowCfgById(browId);
                if (cfg && cfg.currency == 0 && cfg.price && fromSeatId == this._mySeat.seatid) { //判断是否不是我自己发送表情
                    //表情的免费次数
                    let _nFree: number = PDKMainLogic.instance.selfData.getFreeBrowCount();
                    if (_nFree > 0) {
                        PDKMainLogic.instance.selfData.addFreeBrowCount(-1);
                    }
                    else {
                        //比赛场不扣积分
                        if (!pdkServer.isMatch) {
                            this._mySeat.updateGold(-cfg.price, pdkServer.isMatch);
                        }
                    }
                }

                this._onPlayBrowInfo(fromSeatId, toSeatId, browId);
            }
        }
        else if (data.result == 3) { //金豆不足
            PDKImgToast.instance.show(this, PDKlang.browNoGold);
            PDKImgToast.instance.enableTouch(false);
        }
        else {
            PDKLogUtil.info("_onServerBrowRep------------->error", data.result);
        }
    }
    /**
     * 获取分享奖励领取成功
     */
    private _showGetDayShareRewSucc(): void {
        let _gameCfg = PDKGameConfig;
        let _cfg = _gameCfg.getShareRewCfg();
        if (!_cfg) return;

        let _name = null;
        let _idx = 1;
        let _info = "恭喜您分享成功获得以下奖励:\n";
        for (let k in _cfg) {
            _name = _gameCfg.getItemNameById(parseInt(k));
            if (_name) {
                _info += _idx + "." + _name + "x" + _cfg[k] + "\n";
            }
        }

        PDKShareImageManager.instance.stop(true, _info);
    }

    /**
     * 非游戏过程中的操作（猜牌等）
     */
    private onUserOperateRep(event: egret.Event): void {
        let data = event.data;
        if (data.optype == 3) {
            if (data.result != null) {
                // PDKAlert.show('押注错误编号:'+data.result);
                PDKImgToast.instance.show(this, PDKlang.guessCardsNotice[data.result - 1]);
            } else {
                this.setGCGold(data.params[0] - 1, this._roomInfo.guessbet);
            }
        }
        else if (data.optype == 2) { //分享成功奖励
            // this._showGetDayShareRewSucc();
        }
        else if (data.optype == 7) { //每日福袋
            if (data.result == null) {
                let _str = PDKUtils.parseGoodsString(data.str);
                let _text = PDKUtils.goodsListToString(_str);
                PDKAlert.show(_text);
            }
        }
    }

	/**
	 * 操作
	 * @param event
	 required int32 session = 1;
	 required int32 index = 2;
	 optional int32 optype = 3; (1 加注 2 跟注 3 弃牌 4 过牌 5 showhand)
	 optional int32 seatid = 5;
	 optional int32 askseatid = 6;
	 optional int32 timeout = 7;
	 repeated int32 params = 8;
	 */
    private onOperateRep(event: egret.Event): void {
        let data = event.data;

        if (data.optype == 4) {
            // var seat = this.getSeatById(data.seatid)
            if (data.params && data.params[0]) {
                this.playGuessRightAnimate(data.seatid, data.params[0])
            } else {
                //play guessWrong animate
                this.playGuessWrongAnimate();
            }
        } else if (data.optype == 5) { //发送表情的服务器回调
            this._onServerBrowRep(data);
        }
        else if (data.optype == 6) { //请求记牌器数据
            this.beforerecorderTime = PDKMainLogic.instance.selfData.cardsRecorder[6];
            if (data.params) {
                this._showRecorder(true);
                this._setRecorderInfoByServerNum(data.params);
            }
        }
        else if (data.optype == 7) { //加倍 不加倍服务器回调
            this._onServerDoubleRep(data);
        }
        else {
            let optype: number = data.optype || 0;
            let seat: PDKDDZSeat = this.getSeatById(data.seatid);
            seat.setHang(optype == 1);

            if (this._mySeat.seatid == data.seatid) {
                if (optype == 1 && this.double_group.visible) { //1托管 0或者2 取消托管
                    this._onMyAskDoubleTimeOut();
                }
                this.btnHang.selected = optype == 1;
            }
        }
    }

    private setGuessCardsType(ct: number): void {
        this.grpGuessResult.visible = true;
        this.guessCardsType.source = 'guesscards_' + (925 + ct);
        this.gcardtype.source = 'guesscards_' + (925 + ct);
    }

	/**
	 * 显示地主牌
	 * @param event
	 * {
      "cardids" : [ 63, 93, 42 ],
      "index" : 10,
      "seatid" : 3,
      "session" : 221001
     }
	 */
    private onShowCard(event: egret.Event): void {
        let data: any = event.data;
        //todo 摊牌处理
        let seat: PDKDDZSeat = this.getSeatById(data.seatid);

        if (pdkServer.playing) {
            var ct = this.getGuessCardsType(data.cardids)
            if (ct > 0) {
                this.setGuessCardsType(ct);
            }
            this.showMasterCards(data.cardids, this._reconnectIn);
            seat.addCards(data.cardids);

            if (seat == this._mySeat) {
                this._updateRecorderByCards(data.cardids);
            }

            this._showExchangeRedAni();
        }
    }

	/**
	 * 出牌阶段
	 * @param event
	 * {
      "cardids" : [ 11, 12, 13, 32 ],
      "index" : 13,
      "pseatid" : 3,
      "seatid" : 1,
      "session" : 221001,
      "time" : 100
     }
	 */
    private onAskPlayCard(data: any): void {
        //let data: any = event.data;
        let cardType: number = data.cardType;
        let seat: PDKDDZSeat = this.getSeatById(data.seatid);
        if (!seat) return;

        seat.cleanDesk();
        let timeout: number = data.time;
        let _bClockShow = true;
        if (this._mySeat.seatid == data.seatid) {
            let bTowGame: boolean = (this._roomInfo.roomID == 3101 || this._roomInfo.roomID == 5101 || this._roomInfo.roomID == 3102);
            //当前出牌和上一手出牌都是我，或者是我是本轮第一个出牌的
            if (data.seatid == data.pseatid || data.pseatid == 0) {
                this.buttonBar.switchState(bTowGame ? 'useCard' : 'useCard2');
                this.buttonBar.modifyButton(bTowGame ? 'pass' : 'pass2', false);
                this.buttonBar.modifyButton('help', false);
                this._mySeat.checkType([]);
            }
            else {
                let canUse: boolean = this._mySeat.checkType(data.cardids);
                if (!canUse)
                    this.buttonBar.switchState(bTowGame ? 'pass' : 'pass2');
                else {
                    this.buttonBar.switchState(bTowGame ? 'useCard' : 'useCard2');
                }
                if (!bTowGame) {
                    //三人场不能不出
                    this.buttonBar.modifyButton('pass2', true && !canUse);
                } else {
                    //二人场可以不出
                    this.buttonBar.modifyButton('pass', true);
                }
                this.buttonBar.modifyButton('help', true);

                if (!canUse && !bTowGame) {  //如果没有可出的牌,倒计时变为2秒
                    if (timeout > 2) {
                        timeout = 1;
                        _bClockShow = false;
                    }

                    if (cardType == PDKSHUANGWANG || cardType == PDKSANTIAOA) { //王炸时倒计时变为2秒
                        if (timeout > 1) {
                            timeout = 1;
                            _bClockShow = false;
                        }
                    }
                    this._mySeat.showNoMatchCards(timeout * 1000);

                    //不能出自动不出
                    //pdkServer.sendPdkOutcard([]);
                }
            }

            //this.onUpdateUseButtonState();
            this.onSelectCards();
            this._mySeat.checkCanUse();
        }
        if (timeout > 0) {
            seat.startCD(timeout, this.onCDComplete.bind(this, data.time > timeout), _bClockShow);
        }
    }

    private onCDComplete(isFakeTimeout: boolean): void {
        //console.log('isFakeTimeout:', isFakeTimeout);
        if (isFakeTimeout) {
            //pdkServer.useCardNtf([]);
            pdkServer.sendPdkOutcard([]);
            this._mySeat.cancelSelect();
        }
    }

    private onPanelMatchResultClose(): void {
        if (PDKalien.PDKSceneManager.instance.currentSceneName != PDKSceneNames.ROOM) {
            PDKalien.PDKSceneManager.show(PDKSceneNames.ROOM, null, PDKalien.sceneEffect.Fade, null, null, false, PDKSceneNames.LOADING);
        }
    }

    //显示比赛的结果 返回值确定是否展示了比赛结果界面
    private _showMatchResult(data: any): boolean {
        let _bShow = false;
        if (PDKSceneManager.instance.currentSceneName == PDKSceneNames.PLAY &&
            data.matchid == this._roomInfo.matchId &&
            data.params[0] > 0 && this._roomInfo.matchType != 6) {  //有名次才显示结算界面并且不是钻石赛
            if (data.params[1] && data.params[1] > 0) {
                PDKMatchService.instance.updateScoreGetOut(data.matchid, data.params[1]);
                this.updateMathTurnInfo();
            }
            PDKPanelMatchResult.instance.show(data, this.onPanelMatchResultClose.bind(this));
            PDKBagService.instance.refreshBagInfo();    //涉及到物品奖励,需要更新背包
            _bShow = true;
        }

        PDKMatchService.instance.onMatchEndCheckRemoveMatchInfoNtf(data);
        return _bShow;
    }

	/**
	 * 比赛信息更新
	 * @param event
	 */
    private onMatchInfoNtf(event: egret.Event): void {
        let data: any = event.data;
        switch (data.optype) {
            case 101:

                break;
            case 102:
                this.labWaiting.visible = false;

                this._showMatch9Rew(data);
                //是否可以复活  {p.curr_rank, _curr_base_score, _relive_price, rt,score}
                if (data.params && data.params.length >= 5 && data.params[2] > 0) {
                    this._showMatchRevive(data);
                } else {
                    this._showMatchResult(data);
                }

                break;
            case 103:
                this.updateMathTurnInfo();
                break;
            case 104:
                let tf: any[] = this._tfMatchPlayInfo;
                tf[0].text = data.params[0].toString(); //当前排名
                tf[2].text = data.params[1].toString(); //当前的分数
                this.labelMatchInfo.textFlow = this._tfMatchPlayInfo;
                if (pdkServer.isMatch && pdkServer.roomInfo.matchType == 6) { //钻石赛
                    this._match9Info = data.roundInfo;
                    this._setMatch9CurRank(data.params[0]);
                }
                break;
            case 105:
                this.updateMathTurnInfo();
                break;
            case 106:
                this.updateMathTurnInfo();
                this._curMatch9Play = data.params[1] + 1;
                if (this._curMatch9Play >= this._roomInfo.stage[0].handCount) {
                    this._curMatch9Play = this._roomInfo.stage[0].handCount;
                }

                this._setMatch9Turn(this._curMatch9Play);
                break;
        }
    }

	/**
	 * 更新比赛信息
	 */
    private updateMathTurnInfo(): void {
        let match: PDKMatchService = PDKMatchService.instance;
        let matchMode: number = match.currentMatchMode;

        let turnName: string = this._roomInfo.stage.length == 1 ? '' : PDKlang.match_turn_name[matchMode - 1];
        let content: string;
        switch (matchMode) {
            case 1://打立出局
                if (!match.scoreGetOut || match.scoreGetOut == undefined) return;
                content = PDKlang.format(PDKlang.id.match_top_info_1, match.currentPlay, PDKUtils.currencyRatio(match.scoreGetOut));
                break;
            case 2://瑞士位移
                if (match.countPromote == 0) {  //总决赛
                    turnName = PDKlang.match_turn_name[2];
                    content = PDKlang.format(PDKlang.id.match_top_info_3, match.currentPlay);
                } else {  //普通决赛
                    if (isNaN(match.currentTurn)) {
                        match.currentTurn = 1;
                    }
                    content = PDKlang.format(PDKlang.id.match_top_info_2, match.currentTurn, match.currentPlay, match.countPromote);
                }
                break;
        }

        this.labMatchInfo.text = turnName + ' ' + content;
    }

    playChangeEffect(seat: number, score: number, delay: number = 0): void {
        if (!this.seat2.visible && seat == 2) {
            return;
        }
        let lab: eui.BitmapLabel = this['labChange' + seat];
        egret.Tween.removeTweens(lab);
        lab.font = RES.getRes(score >= 0 ? 'pdk_font_num_1' : 'pdk_font_num_2');
        let s: string = PDKUtils.currencyRatio(Math.abs(score));
        lab.text = (score >= 0 ? '+' + s : '-' + s);
        lab.y += 50;
        lab.alpha = 0;
        lab.visible = true;
        egret.Tween.get(lab).wait(delay).to({ y: lab.y - 50, alpha: 1 }, 1000, egret.Ease.cubicOut);
    }

    delayShowChangeEffect(seat: number, score: number) {
        this.playChangeEffect(seat, score)
    }
	/**
	 * 游戏结束
	 * @param event
	 * {
      "chanage" : [ -300, -300, 600 ],
      "session" : 221001
     }
	 */
    private onGameEnd(event: egret.Event): void {
        let success: boolean = false;
        pdkServer.playing = false;
        let data: any = event.data;
        let kickbacks = this._roomInfo.kickbacks;
        if (!kickbacks) kickbacks = 0;
        let winDesk: PDKDDZSeat;
        this.buttonBar.switchState('hidden');
        this._mySeat.setHang(false);
        this._mySeat.setStatus(null); //隐藏不出
        this.seat1.setStatus(null); //隐藏不出
        this.seat2.setStatus(null); //隐藏不出

        var c, kb;
        for (var i = 0; i < 3; ++i) {
            // if(data.chanage[i] == 0)
            c = data.chanage[i];
            kb = data.realkickback[i] == null ? 0 : data.realkickback[i];
            let seat: PDKDDZSeat = this.getSeatById(i + 1);
            if (!seat) continue;
            if (c > 0) {
                winDesk = seat;
            }
            if (this._mySeat == seat) {
                success = c > 0;
            }
            var cseatid = 0;
            if (this.seat1 == seat) {
                cseatid = 1;
            } else if (this.seat2 == seat) {
                cseatid = 2;
            }

            this.playChangeEffect(cseatid, c + kb, 0);
            if (this._roomInfo.roomID == 9002 || this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005) {
                if (seat != this._mySeat) { //不是自己才刷新，自己的钻石服务器会主动推
                    seat.updateRednormalGold(c);
                }
                else {
                    seat.updateRednormalGold(c, true);
                }
            }
            else {
                seat.updateGold(c, pdkServer.isMatch);
            }
            seat.stopCD();
        }

        this.btnHang.enabled = false;
        this._mySeat.grpRecorder.visible = false;
        this.showResult(success);
        this._clearRecorderInfo(0);
        PDKPanelPlayerInfo.remove();
        //todo 游戏结束处理
        if (pdkServer.isPersonalGame) {
            if (this.cur_round < this.total_round) {
                ++this.cur_round;
            }
        } else {// if(!pdkServer.isMatch){
            if (pdkServer.isMatch && pdkServer.roomInfo.matchType == 6) { //钻石赛
                this._curMatch9Play += 1;
                if (this._curMatch9Play > this._roomInfo.stage[0].handCount) {
                    if (!PDKPanelMatch9GetRew.getInstance().isShow()) {
                        this._showMatch9WaitOtherPlayerOver(true);
                    }
                }
                else {
                    this._setMatch9Turn(this._curMatch9Play);
                }
            }
        }

        // PDKMainLogic.instance.updateRecorderExpireTime();
        this.refreshCardsRecorderAbout();
    }

    /**
     * zhu 显示9人钻石赛的等待其他玩家结束的信息
     */
    private _showMatch9WaitOtherPlayerOver(bShow: boolean): void {
        this.match9WaitOther_img.visible = bShow;
    }

    showResult1(success: boolean): void {
        //红包赛不显示结算
        if (this._roomInfo.roomID == 5001) {
            if (success) {
                this._showNormalRedImg(true);
            }
        } else {
            if (!success || pdkServer.isMatch || pdkServer.isPersonalGame) {
                if (!pdkServer.isMatch && !pdkServer.isPersonalGame) {
                    let roomId = this._roomInfo.roomID;
                    if (roomId == 9000 || this._roomInfo.roomID == 9001 || roomId == 9003 && PDKMainLogic.instance.selfData.gold < this._roomInfo.minScore)
                        if (!PDKMainLogic.instance.alms(this._mySeat.userInfoData.gold)) {  //请求救济金
                            PDKPanelRechargeTips.instance.show(this.onAlertResult.bind(this, 0));
                        }
                }
            } else if (success) {
                let roomId = this._roomInfo.roomID;
                if (roomId == 9000 || this._roomInfo.roomID == 9001 || this._roomInfo.roomID == 9002 ||
                    this._roomInfo.roomID == 9003 || this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005) {
                    this._isOverFive = false;
                    let winCnt = PDKMainLogic.instance.selfData.getRoomWinCntInfo(roomId);
                    if (winCnt && winCnt.cnt < 1 && winCnt.chance >= 1) {
                        this._isOverFive = true;
                    }
                    /**
                     * 赢满5局，并未显示王炸则显示抽红包 
                     */
                    if (this._isOverFive && !this._isShowWZAni) {
                        this._onHasRedChance();
                    }
                }
                // this.addRedProcess();

                /**
                 * 赢满5局，并未显示王炸则显示抽红包 
                 */
                // if(this._isOverFive && !this._isShowWZAni){
                //     this._showNormalRedImg(true);
                // }
            }
        }

        this._timerClean = egret.setTimeout(this.cleanSeat, this, 3000, true, true);
    }

    showResult(success: boolean): void {
        this._showResultTimeOutId1 = egret.setTimeout(this.showResult1, this, 500, success);
    }

	/**
	 * 更新游戏信息
	 * @param event
	 */
    private onUpdateGameInfo(event: egret.Event): void {
        let msg: any = event.data;
        if (msg.tableid) {
            this._roomInfo.tableId = msg.tableid;
        }
        console.log("onUpdateGameInfo------->", msg);
        //高级场匹配到同级别金豆玩家,低分变化
        if (msg.optype == 1) {
            if (msg.params1 && msg.params1.length > 2) {
                let _baseScore = msg.params1[1];
                let _sScore = "" + _baseScore;
                if (_baseScore >= 10000) {
                    _sScore = _sScore.substring(0, _sScore.length - 4) + "万";
                }
                this.setlabWaiting("当前底分为" + _sScore);
                this._roomInfo.baseScore = _sScore;
                this.setBaseScore();
                egret.setTimeout(function () {
                    this.setlabWaiting();
                }, this, 5000)
                this.masterCards.updateScore(msg.params1[1], msg.params1[0]);
            }
        } else if (msg && msg.params1 && msg.params1.length >= 1 && msg.params1[0] == 250 && msg.params1[1] == 250) {
            if (msg.params1[3] == 0) {
                //金豆不够
                // PDKAlert.show(PDKlang.noMoreGold, 1, this.onAlertResult.bind(this, 3));
                // PDKPanelRechargeTips.instance.show();
            } else {
                //金豆足够
                PDKAlert.show(PDKlang.noMoreGold3, 1, this.onAlertResult.bind(this, 1));
            }
        } else if (msg.params1 && msg.params1.length >= 1) {//} && msg.params1.length == 1) {
            //console.log('底分:', msg.params1[0], '倍数:', msg.params1[1]);
            if (msg.params1.length == 2) {
                this._roomInfo.baseScore = msg.params1[1];
                this.masterCards.updateScore(this._roomInfo.baseScore, msg.params1[0]);
                this.setBaseScore();
                // this.masterCards.updateScore(msg.params1[1], msg.params1[0]);    
            } else {
                this.masterCards.updateMultiple(msg.params1[0]);
            }
        } else if (msg.params2 && msg.params2.length > 2) {
            //春天,火箭,炸弹
            //console.log('游戏结算:', msg.params2[0], msg.params2[1], msg.params2[2]);
            // this.labResult.text = PDKalien.StringUtils.format(PDKlang.gameResult,msg.params2[0],msg.params2[1],msg.params2[2]);
        }

    }

	/**
	 * 救济金返回
	 * @param event
	 */
    private onAlmsResponse(event: egret.Event): void {
        let data: any = event.data;

        switch (data.result) {
            case 0:   //成功
                let gold: number = PDKMainLogic.instance.selfData.gold;
                let msg: string = PDKlang.format(PDKlang.id.alms_success,
                    PDKUtils.currencyRatio(PDKGameConfig.almsConfig.gold),
                    PDKGameConfig.almsConfig.count - data.usagecnt
                );

                if (pdkServer.isMatch || pdkServer.isPersonalGame) {
                    PDKAlert.show(msg);
                    return;
                }

                if ((gold + PDKGameConfig.almsConfig.gold) < this._roomInfo.minScore) {
                    PDKPanelRechargeTips.instance.show(this.onAlertResult.bind(this, 0));
                } else {
                    PDKAlert.show(msg + PDKlang.alms_success_continue, 1, (action: string) => {
                        if (action == 'confirm') {
                            this.initData();
                            this.sendQuickJoin();
                        } else {
                            PDKMainLogic.backToRoomScene();
                        }
                    });
                }
                break;
            case 1:   //领取次数使用完
            case 2:   //未达到领取条件
                // PDKAlert.show(PDKlang.noMoreGold,1,(action: string) => {
                //     if(action == 'confirm') {
                //         PDKRechargeService.instance.recharge();
                //     }
                //     PDKMainLogic.backToRoomScene();
                // });
                // PDKPanelRechargeTips.instance.show();
                if (!pdkServer.isMatch) {
                    PDKPanelRechargeTips.instance.show(this.onAlertResult.bind(this, 0));
                }
                break;
        }
    }

    private onAlmsAlertResult(action: string): void {
        //领取救济金后判断房间门槛
        if (PDKMainLogic.instance.selfData.gold < pdkServer.roomInfo.minScore) {
            PDKMainLogic.backToRoomScene();
        }
    }

	/**
	 * 玩家坐下
	 * @param data {seatid, uid}
	 * @returns {PDKMySeat}
	 */
    private playerSeatDown(data: any): PDKDDZSeat {
        if (data.uid == pdkServer.uid) {
            pdkServer.seatid = data.seatid;
            // this.grpRedcoin.visible = true;
            /*zhu 在beforeShow里面处理 if(!pdkServer.isMatch && !pdkServer.isPersonalGame){
                this.updateRedCoinInfo();
                this._mySeat.grpRedcoin.visible = true;
            }else{
                this._mySeat.grpRedcoin.visible = false;
            }*/
        }

        let seat: PDKDDZSeat = this.getSeatById(data.seatid);
        if (data.viplv) {
            data["_vipLevel"] = data.viplv;
        }
        let bTwoGame: boolean = (this._roomInfo.roomID == 9000 || this._roomInfo.roomID == 9001 || this._roomInfo.roomID == 9002 ||
            this._roomInfo.roomID == 9003 || this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005);
        let userCount: number = bTwoGame ? 2 : 3;
        if (this._roomInfo.roomID == 9000 || this._roomInfo.roomID == 9001 || this._roomInfo.roomID == 9002 ||
            this._roomInfo.roomID == 9003 || this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005) {
            this.grpBaseScore.visible = true;
            this.setBaseScore();
        }
        if (!seat || !seat.userInfoData || seat.userInfoData.uid != data.uid) {
            let userInfoData: PDKUserInfoData = new PDKUserInfoData();
            userInfoData.initData(data);

            seat = this._seats[(userInfoData.seatid + userCount - pdkServer.seatid) % userCount];
            seat.userInfoData = userInfoData;
            seat.seatid = data.seatid;
            seat.setOwnerFlagVisible(false);
            seat.setQuitFlagVisible(false);
            // seat.updateUserInfoData(data);
            seat.userInfoView.update(data);
        } else if (seat) {
            seat.updateUserInfoData(data);
        }

        pdkServer.getUserInfoInGame(data.uid);
        if (seat && pdkServer.isMatch) {
            data.nickname = '参赛玩家';
            if (seat.isMaster) {
                data.imageid = 'pdk_icon_head9'
            } else {
                data.imageid = 'pdk_icon_head10'
            }
            seat.updateUserInfoData(data);
            seat.userInfoView.update(data);
        }
        // ++this.playerCnt;
        if (!pdkServer.isMatch) {
            if (data.viplv >= 1) {
                seat.userInfoView.avatar.setVipLevel(data.viplv);
            }
        }
        return seat;
    }

    private setBaseScore(): void {
        this["lblBaseScore"].text = "底分：" + this._roomInfo.baseScore;
    }

	/**
	 * 玩家站起
	 * @param uid
	 */
    private playerStandUp(uid: number): void {
        if (!pdkServer.isMatch && uid == pdkServer.uid) {
            this.cdProgressBar.stop();
            PDKMainLogic.backToRoomScene();
        }

        let seat: PDKDDZSeat = this.getSeatByUId(uid);

        if (seat) {//} && uid != pdkServer.uid){
            PDKPanelPlayerInfo.onPlayerLeave(seat.seatid);
            seat.cleanPlayer();
            // --this.playerCnt;
        }
    }

    private getPlayersAmount(): number {
        var amount = 0;
        for (var i = 0; i < this._seats.length; ++i) {
            if (this._seats && this._seats[i].userInfoData != null) {
                ++amount;
            }
        }
        return amount;
    }

    private cleanSeat(keepCards: boolean = false, showReady: boolean = false): void {
        var i = 0;
        this._seats.forEach((seat: PDKDDZSeat) => {
			/*if(seat.userInfoData){
				seat.reset();
			}else{
				seat.clean();
			}*/
            this['labChange' + i++].visible = false;
            if (keepCards) {
                if (seat != this._mySeat) {
                    seat.clean(keepCards);
                } else {
                    seat.cleanDesk();
                }
            } else {
                seat.clean(keepCards);
            }

        });
        // this._timerClean = null;
        egret.clearTimeout(this._timerClean);

        this.btnContinue.visible = !pdkServer.isPersonalGame && !pdkServer.isMatch && showReady;
        /* zhu 暂时关闭猜底牌
        if(this.btnContinue.visible){
            if(this._roomInfo.roomID != 1000){//红包场不显示猜底牌
                this.showGuessView(); 
                this._showNextMasterCardGuessBtn(true);
            }
        }*/
        // if(this.showWaiting && pdkServer.isMatch){
        // this.labWaiting.visible = true;
        // this.labWaiting.text = '等待其他玩家结束游戏...'
        // PDKMatchService.instance.checkMatchWaiting(PDKMatchService.instance.nextPlayerCount, true);
        // }

        if (!pdkServer.isMatch && !pdkServer.isPersonalGame) {
            this.initGuessCardsView();
            //zhu 不置为空 this._mySeat.setRedcoin('', false);

            // this.lbRedCoin.text = "";
            // this.grpRedcoin.touchEnabled = false;
            this.grpRedNotice.visible = false;
        }
    }

	/**
	 * 根据座位号获取座位
	 * @param seatid
	 * @returns {PDKSeat}
	 */
    private getSeatById(seatid: number): PDKDDZSeat {
        let seat: PDKDDZSeat = null;
        this._seats.some((s: PDKDDZSeat): boolean => {
            if (s.userInfoData && s.userInfoData.seatid == seatid) {
                seat = s;
                return true;
            }
        });
        return seat;
    }

	/**
	 * 根据uid获取座位
	 * @param uid
	 * @returns {PDKSeat}
	 */
    private getSeatByUId(uid: number): PDKDDZSeat {
        let seat: PDKDDZSeat = null;
        this._seats.some((s: PDKDDZSeat): boolean => {
            if (s.userInfoData && s.userInfoData.uid == uid) {
                seat = s;
                return true;
            }
        });
        return seat;
    }

    private onLotteryRedCoinRep(e: egret.Event): void {
        if (e.data.result == 0) {
            this.setRedProcess();
            this.updateRedCoinInfo();

            let data: any = e.data;
            switch (data.result) {
                case 0:

                    //                 PDKAlert.show(PDKlang.exchange_redcoin[data.result]);
                    pdkServer.getRedcoinRankingListReq();
                    PDKAlert.show("恭喜获得" + PDKUtils.exchangeRatio(data.coin / 100, true) + "奖杯!");
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
        }
        this.lotteryIndex = null
    }

    private lotteryIndex;

    private doChou(roomid: number): void {
        if (this.lotteryIndex != null)
            return
        this.lotteryIndex = roomid;
        pdkServer.lotteryRedCoinReq(roomid);
    }

    private setRedProcess(bGameEnd: boolean = false): void {
        if (!pdkServer.isMatch && !pdkServer.isPersonalGame) {
            let roomId = this._roomInfo.roomID;
            let letitgo = false;
            if (roomId == 9000 || roomId == 9001 || roomId == 9002 ||
                this._roomInfo.roomID == 9003 || this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005) {
                letitgo = false;
            }
            else {
                letitgo = true;
            }
            if (letitgo == true) return;
            let redPDef = [0, 0, 0, 0, 0];
            let redPOver = [1, 1, 1, 1, 1];
            let nWinTot = 5;
            let srcPng = "pdk_play_btn_chou";
            if (roomId == 9001) {
                nWinTot = 3;
                redPDef = [0, 0, 0];
                redPOver = [1, 1, 1];
                srcPng = "pdk_play_btn_chou2";

            }
            else if (roomId == 9002) {
                nWinTot = 3;
                redPDef = [0, 0, 0];
                redPOver = [1, 1, 1];
                srcPng = "pdk_play_btn_chou4";
            } else if (roomId == 9003 || roomId == 9004 || roomId == 9005) {
                redPDef = [0];
                redPOver = [1];
                nWinTot = 1;
                srcPng = "pdk_play_btn_chou3";
            }
            this["mRed_img"].source = srcPng;
            let _mainIns = PDKMainLogic.instance;
            this.redListDataArr = redPDef;
            let _winCntInfo = _mainIns.selfData.getRoomWinCntInfo(roomId);
            let count = 0;
            let _count = 0;
            if (_winCntInfo) {
                count = _winCntInfo.cnt;
                if (!_winCntInfo.chance) {
                    _count = 0;
                }
                else {
                    _count = Number(_winCntInfo.chance);
                }
            }
            if (this._isOverFive && bGameEnd && !this._isShowWZAni) {
                this.redListDataArr = redPOver;
            }
            else {
                count = (count > nWinTot ? nWinTot : count);
                for (var j: number = 0; j < count; j++) {
                    this.redListDataArr[j] = 1;
                }
            }

            console.log("setRedPro2cess---------->", this.redListDataArr, _winCntInfo, _count);

            this.redCount.text = "" + _count;
            if (Number(_count) > 0) {
                this._onHasRedChance();
                this._showNormalRedImg(true);
                this._showRedCount(true);
            } else {
                this._showNormalRedImg(false);
                this._showRedCount(false);
            }
            this.redListDataProvider.source = this.redListDataArr;
            this.redListDataProvider.refresh();
        }
    }

    private addRedProcess(): void {
        this._isOverFive = false;
        let _mainIns = PDKMainLogic.instance;
        let roomId = this._roomInfo.roomID;
        let _winCntInfo = _mainIns.selfData.getRoomWinCntInfo(roomId);
        /*if(_redInfo.length >= 2){
            let cnt = _redInfo[0];
            if(cnt % 5 == 4){
               this._isOverFive = true;
               _redInfo[1] += 1;
            }
           _redInfo[0] += 1;
        }*/
        let count = 0;
        if (_winCntInfo) {
            count = _winCntInfo.cnt;
        }
        let nWinTot = 5;
        let cnt = count + 1;
        if (roomId == 1002) {
            nWinTot = 3;
        } else if (roomId == 8001) {
            nWinTot = 1;
        }
        let bFound = false;
        let info = PDKMainLogic.instance.selfData.wincnt;
        for (var i: number = 0; i < info.length; i++) {
            if (info[i].roomid == roomId) {
                bFound = true;
                if (cnt == nWinTot) {
                    this._isOverFive = true;
                    info[i].cnt = 0;
                    info[i].chance = _winCntInfo.chance + 1;
                } else {
                    info[i].cnt = cnt;
                }
            }
        }
        if (!bFound) {
            info.push({ chance: 0, cnt: cnt, roomid: roomId, getchance: null, time: new Date().getTime() });
        }
        this.setRedProcess(true);
    }

    private onFreshManRedcoinLotteryChanceGot(e: egret.Event): void {
        PDKMainLogic.instance.selfData.freshmanredcoinsent = 1;
        if (1) return;
        if (!this.dragonHongBao.parent)
            this.addChild(this.dragonHongBao);
        this.dragonHongBao.play2();

        this._isShowWZAni = true;
    }

    /**
     * zhu 新手提示打出王炸并获胜
     */
    private showRedcoinDragon(isPlay: boolean): void {
        if (1) return;
        if (!this.dragonHongBao.parent)
            this.addChild(this.dragonHongBao);
        if (isPlay) {
            PDKalien.localStorage.setItem("freshmanredcoinsent", "1");
            this.dragonHongBao.addEventListener(egret.Event.COMPLETE, this.ondragonHongBaoComplete, this);
        }
        this.dragonHongBao.play1(isPlay);
    }

    private ondragonHongBaoComplete(e: egret.Event): void {
        this.dragonHongBao.removeEventListener(egret.Event.COMPLETE, this.ondragonHongBaoComplete, this);
        pdkServer.stopCache();
    }

    private showDragonZhaDan(): void {
        if (!this.dragonZhaDan.parent) {
            this.addChild(this.dragonZhaDan);
        }
    }

    private dragonSign: PDKDragonSign;
    private showSign(): void {
        this.dragonSign = new PDKDragonSign();
        if (!this.dragonSign.parent) {
            this.addChild(this.dragonSign);
        }
    }

    private showDragonFeiJi(): void {
        if (!this.dragonFeiJi.parent) {
            this.addChild(this.dragonFeiJi);
        }
    }

    private showDragonMyLianDui(): void {
        if (!this.dragonMyLianDui.parent) {
            this.dragonMyLianDui.x = PDKalien.StageProxy.stage.stageWidth >> 1;
            this.dragonMyLianDui.y = PDKalien.StageProxy.stage.stageHeight / 2 + 20;

            this.addChild(this.dragonMyLianDui);
        }
    }

    private showDragonRightLianDui(): void {
        if (!this.dragonRightLianDui.parent) {
            this.dragonRightLianDui.x = this.seat1.x + 200;
            this.dragonRightLianDui.y = this.seat1.y + 92;

            this.addChild(this.dragonRightLianDui);
        }
    }

    private showDragonLeftLianDui(): void {
        if (!this.dragonLeftLianDui.parent) {
            this.dragonLeftLianDui.x = this.seat2.x + 230;
            this.dragonLeftLianDui.y = this.seat2.y + 92;

            this.addChild(this.dragonLeftLianDui);
        }
    }

    private showDragonMyShunZi(): void {
        if (!this.dragonMyShunZi.parent) {
            this.dragonMyShunZi.x = PDKalien.StageProxy.stage.stageWidth >> 1;
            this.dragonMyShunZi.y = PDKalien.StageProxy.stage.stageHeight / 2 + 20;

            this.addChild(this.dragonMyShunZi);
        }
    }

    private showDragonRightShunZi(): void {
        if (!this.dragonRightShunZi.parent) {
            this.dragonRightShunZi.x = this.seat1.x + 200;
            this.dragonRightShunZi.y = this.seat1.y + 92;

            this.addChild(this.dragonRightShunZi);
        }
    }

    private showDragonLeftShunZi(): void {
        if (!this.dragonLeftShunZi.parent) {
            this.dragonLeftShunZi.x = this.seat2.x + 230;
            this.dragonLeftShunZi.y = this.seat2.y + 92;

            this.addChild(this.dragonLeftShunZi);
        }
    }

    private showDragonMySanDaiYi(): void {
        if (!this.dragonMySanDaiYi.parent) {
            this.dragonMySanDaiYi.x = PDKalien.StageProxy.stage.stageWidth >> 1;
            this.dragonMySanDaiYi.y = PDKalien.StageProxy.stage.stageHeight / 2 + 20;

            this.addChild(this.dragonMySanDaiYi);
        }
    }

    private showDragonRightSanDaiYi(): void {
        if (!this.dragonRightSanDaiYi.parent) {
            this.dragonRightSanDaiYi.x = this.seat1.x + 200;
            this.dragonRightSanDaiYi.y = this.seat1.y + 92;

            this.addChild(this.dragonRightSanDaiYi);
        }
    }

    private showDragonLeftSanDaiYi(): void {
        if (!this.dragonLeftSanDaiYi.parent) {
            this.dragonLeftSanDaiYi.x = this.seat2.x + 230;
            this.dragonLeftSanDaiYi.y = this.seat2.y + 92;

            this.addChild(this.dragonLeftSanDaiYi);
        }
    }

    private showDragonMySanDaiEr(): void {
        if (!this.dragonMySanDaiEr.parent) {
            this.dragonMySanDaiEr.x = PDKalien.StageProxy.stage.stageWidth >> 1;
            this.dragonMySanDaiEr.y = PDKalien.StageProxy.stage.stageHeight / 2 + 20;

            this.addChild(this.dragonMySanDaiEr);
        }
    }

    private showDragonRightSanDaiEr(): void {
        if (!this.dragonRightSanDaiEr.parent) {
            this.dragonRightSanDaiEr.x = this.seat1.x + 200;
            this.dragonRightSanDaiEr.y = this.seat1.y + 92;

            this.addChild(this.dragonRightSanDaiEr);
        }
    }

    private showDragonLeftSanDaiEr(): void {
        if (!this.dragonLeftSanDaiEr.parent) {
            this.dragonLeftSanDaiEr.x = this.seat2.x + 230;
            this.dragonLeftSanDaiEr.y = this.seat2.y + 92;

            this.addChild(this.dragonLeftSanDaiEr);
        }
    }

    private showDragonMySiDaiEr(): void {
        if (!this.dragonMySiDaiEr.parent) {
            this.dragonMySiDaiEr.x = PDKalien.StageProxy.stage.stageWidth >> 1;
            this.dragonMySiDaiEr.y = PDKalien.StageProxy.stage.stageHeight / 2 + 20;

            this.addChild(this.dragonMySiDaiEr);
        }
    }

    private showDragonRightSiDaiEr(): void {
        if (!this.dragonRightSiDaiEr.parent) {
            this.dragonRightSiDaiEr.x = this.seat1.x + 200;
            this.dragonRightSiDaiEr.y = this.seat1.y + 92;

            this.addChild(this.dragonRightSiDaiEr);
        }
    }

    private showDragonLeftSiDaiEr(): void {
        if (!this.dragonLeftSiDaiEr.parent) {
            this.dragonLeftSiDaiEr.x = this.seat2.x + 230;
            this.dragonLeftSiDaiEr.y = this.seat2.y + 92;

            this.addChild(this.dragonLeftSiDaiEr);
        }
    }

    private onShowGameEffect(e: egret.Event): void {
        switch (e.data.cardType) {
            //王炸
            case 1:
                break;
            //炸弹
            case 2:
            case PDKSANTIAOA:
                this.showDragonZhaDan();
                break;

            //飞机
            case 9:
                this.showDragonFeiJi();
                break;
            //双顺 三顺    
            case 11:
            case 12:
                if (e.data.state == "my")
                    this.showDragonMyLianDui();
                else if (e.data.state == "right")
                    this.showDragonRightLianDui();
                else if (e.data.state == "left")
                    this.showDragonLeftLianDui();
                break;
            //单顺  
            case 10:
                if (e.data.state == "my")
                    this.showDragonMyShunZi();
                else if (e.data.state == "right")
                    this.showDragonRightShunZi();
                else if (e.data.state == "left")
                    this.showDragonLeftShunZi();
                break;
            //三带一
            case PDKSANDAIYI:
                if (e.data.state == "my")
                    this.showDragonMySanDaiYi();
                else if (e.data.state == "right")
                    this.showDragonRightSanDaiYi();
                else if (e.data.state == "left")
                    this.showDragonLeftSanDaiYi();
                break;
            //三带二
            case PDKSANDAIER:
                if (e.data.state == "my")
                    this.showDragonMySanDaiEr();
                else if (e.data.state == "right")
                    this.showDragonRightSanDaiEr();
                else if (e.data.state == "left")
                    this.showDragonLeftSanDaiEr();
                break;
            //四带二
            case PDKSIDAIERDUI:
            case PDKSIDAIER:
            case PDKSIDAISAN:
                if (e.data.state == "my")
                    this.showDragonMySiDaiEr();
                else if (e.data.state == "right")
                    this.showDragonRightSiDaiEr();
                else if (e.data.state == "left")
                    this.showDragonLeftSiDaiEr();
                break;
        }
    }

    /**
     * 设置是否在可以领取每日福袋的时间内
     */
    private _setInDayFuTime(bIn: boolean): void {
        this._inDayGetTime = bIn;
    }
    /**
     * 点击每日福袋
     */
    private _onClickDayBuy(): void {
        if (this._inDayGetTime) {
            PDKToast.show("请整点领取");
        } else {

        }
    }

    private _onClickTwoRuleExplain(): void {
        this.grpTwoRuleExplain.visible = !this.grpTwoRuleExplain.visible;
    }

    /**
     * 每日福袋
     */
    private _initDayBuy(): void {
        let _timeNow = pdkServer.serverDate;
        let _curMinute = _timeNow.getMinutes();
        let _curSec = _timeNow.getSeconds();
        let _leftMin = -59 + _curMinute;
        let _leftSec = -60 + _curSec;
        let _clickTime = 11;
        this.dayFuDaiTimeLabel.text = _leftMin + ":" + _leftSec;
        this.dayFuDaiTimeLabel.textColor = 0xFFFFFF;
        this._setInDayFuTime(false)
        let _intervalId = egret.setInterval(() => {
            _leftSec -= 1;
            if (_leftSec == -1) {
                _leftSec = 59;
                _leftMin -= 1;
            }

            if (_leftMin == 0 && _leftSec == 0) {
                this.dayFuDaiTimeLabel.textColor = 0xFF0000;
                this._setInDayFuTime(true);
                _clickTime -= 1;
                if (_clickTime < 0) {
                    this._initDayBuy();
                }
            }

        }, this, 1000);
    }
    beforeShow(params: any): void {
        PDKalien.PopUpManager.removeAllPupUp();
        this._showRedCount(false);
        this.mRed_img["addClickListener"](this._onClickRed, this);
        this.match9Rule_img["addClickListener"](this._onClickMatch9Rule, this);
        this.matchInfo_img["addClickListener"](this._onClickMatch9Info, this);
        this.match9RuleAniClose_btn["addClickListener"](this._onCloseMatch9RuleAni, this);
        this.double_group["addClickListener"](this._onClickDouble, this);
        this.noDouble_group["addClickListener"](this._onClickNoDouble, this);
        this.redNormal_img["addClickListener"](this._onClickRedNormal, this);
        this.redNormalHelp_img["addClickListener"](this._onClickRedNormalHelp, this);
        this.dayBuyGroup["addClickListener"](this._onClickDayBuy, this);
        this.btnTwoRuleExplain["addClickListener"](this._onClickTwoRuleExplain, this);

        this._showNextMasterCardGuessBtn(false);
        this._showMatch9WaitOtherPlayerOver(false);
        this._showDoubleNoDouble(false);
        this._showFailDouble(false);
        let _nDiamond = PDKBagService.instance.getItemCountById(3);
        this._setDiamondUI(_nDiamond);
        this.rollMsg.visible = true;
        this.rollMsg.enableSendHorn(false);

        this._mySeat.grpRedcoin.visible = false;
        this._showNormalRedImg(false);
        // this.playerCnt = 0;
        if (params.personalgame) {
            this._mySeat.showDiamond(false);
            //zhu pdkServer.startCache([PDKEventNames.QUERY_ROOMINFO_REP]);
            this.isPersonalGame = true
            pdkServer.isPersonalGame = true;
            // pdkServer.roomInfo.matchType
            // pdkServer.roomInfo = this._roomInfo = params;

            this.currentState = 'personalGame';

        } else {
            //zhu 
            this.isPersonalGame = false;
            pdkServer.isPersonalGame = false;

            let roomInfo: any = PDKGameConfig.getRoomConfig(params.roomID);
            if (!roomInfo) {
                // 走重连流程 否则界面清理会有问题
                // PDKalien.Dispatcher.dispatch(PDKEventNames.SHOW_DISCONNECT, { content: PDKlang.disconnect_server });
                // 退回上一个界面
                PDKMainLogic.backToRoomScene();
                return;
            }
            pdkServer.roomInfo = this._roomInfo = roomInfo;
            /*zhu 暂时去掉if(!this._roomInfo || !this._roomInfo.roomID || !this._roomInfo.roomType){
                PDKwebService.postError(PDKErrorConfig.REPORT_ERROR,"ScenePDKPlay beforeShow=>"+ version + "|uuid" + PDKwebService.uuid +"|" +JSON.stringify(params) + JSON.stringify(PDKGameConfig.roomList));
            }*/
            pdkServer.isMatch = roomInfo.roomType == 2;

            this.currentState = pdkServer.isMatch ? 'match' : 'normal';

            //红包场不显示五局抽红包,高级场也要显示规则
            // this.redTip.text = "赢5局抽奖杯";
            this.redList.visible = true;
            if (pdkServer.roomInfo.roomID == 9000 || this._roomInfo.roomID == 9001 || this._roomInfo.roomID == 9002 ||
                this._roomInfo.roomID == 9003 || this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005) {
                // this.redNormalHelp_img.visible = true;
                this.redNormalHelp_img.visible = false;
                this.grpRed.visible = true;
                if (pdkServer.roomInfo.roomID == 5001 || pdkServer.roomInfo.roomID == 5101) {
                    //this.grpRed.visible = false;
                    this.redList.visible = false;
                    // this.redTip.text = "赢1局即得奖杯";
                    this._shouldTipRedNormalRule();
                }
            }
            else {
                this.grpRed.visible = true;
                this.redNormalHelp_img.visible = false;
            }
            if (!pdkServer.isMatch) {
                this._mySeat.grpRedcoin.visible = true;
                this._mySeat.userInfoView.avatar.setVipLevel(PDKMainLogic.instance.selfData.getCurVipLevel());
                this._mySeat.showDiamond(true);
                this.initGuessCardsView();
                this.setRedProcess();
                this.updateRedCoinInfo();
            } else {
                //钻石赛
                this._mySeat.showDiamond(false);
                if (pdkServer.roomInfo.matchType == 6) {
                    this._showMatchTurnAndRank(false);
                    this._showMatch9Bottom(true);
                    this._setMatch9Turn(1);
                    this._setMatch9CurRank(-1);
                }
                else {//其他比赛
                    this._showMatchTurnAndRank(true);
                    this._showMatch9Bottom(false);
                    this._showMatch9RuleAniCloseBtn(false);
                }
                this.labMatchInfo.text = '';
            }
        }

        this._initGeneralHeadImgTouch(true);
        this.addListeners();
        this._newTable = true;

        this.initData();
        let _selfData = PDKMainLogic.instance.selfData;
        if (!pdkServer.isMatch) {//zhu 刚进入游戏就刷新金豆
            this._mySeat.userInfoView.updateGold(_selfData.gold);
        }
        //zhu 刚进入游戏就设置自己的头像
        egret.setTimeout(() => {
            this._mySeat.userInfoView.avatar.imageId = _selfData.imageid;
            this._mySeat.userInfoView.updateNickname(_selfData);
        }, this, 100);
        PDKalien.PDKSoundManager.instance.playMusic(PDKResNames.pdk_bgm);

        // setTimeout(this.showLaba.bind(this, null),2000);
        if (_selfData && _selfData.cardsRecorder &&
            _selfData.cardsRecorder.length >= 7) {
            this.beforerecorderTime = _selfData.cardsRecorder[6];
        } else {
            this.beforerecorderTime = 0;
        }

        // this.showLaba(null);
        this.rollMsg.showLast(2);
        this._clearRecorderInfo(0);
        this.refreshCardsRecorderAbout();

        this._shouldTipGameRule();
        this._shouldShowRuleFlag();
        this._shouldShowRedNotice();


        this.grpTwoGame.visible = (pdkServer.roomInfo.roomID == 5101);
        this.grpTwoRuleExplain.visible = false;
        let bTowGame: boolean = (this._roomInfo.roomID == 9000 || this._roomInfo.roomID == 9001 || this._roomInfo.roomID == 9002 ||
            this._roomInfo.roomID == 9003 || this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005);
        this.seat2.visible = !bTowGame;//二人场，去掉一个用户头像
        this.imgGameBG.source = bTowGame ? 'pdk_play_bg2' : 'pdk_play_bg';
        this.seat1.right = bTowGame ? 120 : 18;
        // this.seat1.y = bTowGame ? 105 : 128;
        this.seat1.currentState = bTowGame ? 'right2' : 'right';
        this._mySeat.currentState = bTowGame ? 'my2' : 'my';
        this.btnRecord.visible = !bTowGame;
        this.btnHelp.right = bTowGame ? 160 : 237;
        this.ruleReadedFlag.right = bTowGame ? 155 : 229;
        if (bTowGame) {
            this._showRecorder(false);
            this.recorderBubble.visible = false;
            egret.Tween.removeTweens(this.recorderBubble);
        }
    }

    private setPGameView(params: any) {
        this.lbRoomID.text = String(params.roomid);
        if (!params.maxodd) params.maxodd = '无';
        this.lbLimit.text = String(params.maxodd);
        this.cur_round = params.playround == null ? 1 : (params.playround + 1);
        this.lbRound.text = this.cur_round + '/' + String(params.maxround);
        this.isowner = params.owner == pdkServer.uid ? true : false;
        this.owneruid = params.owner;
        this.roomid = params.roomid;
        this.total_round = params.maxround;
        this.masterCards.updateScore(params.bscore || 0, 1);
        this.gamestarted = params.gamestatus > 1 ? true : false;
        if (!PDKalien.Native.instance.isNative) {
            this._justSetShareParams();
        }
        if (this.isowner) {
            // this.btnStart
            if (params.players && params.players.length >= 3) {
                this.setStartPgameBtnVisible(true);
                this.btnShare.visible = false;
            } else {
                this.setStartPgameBtnVisible(false);
                this.btnShare.visible = true;
            }
            //            this._mySeat.setOwnerFlagVisible(true);
            this.labWaiting.visible = false;
        } else {
            this.setStartPgameBtnVisible(false);
            this.btnShare.visible = true;
            if (params.players && params.players.length >= 3) {
                this.labWaiting.text = '等待房主开始';
                this.labWaiting.visible = true;
            } else {
                this.labWaiting.visible = false;
            }
        }

        if (params.gamestatus == 2 || (params.players && params.players.length >= 3)) {
            this.setStartPgameBtnVisible(false);
            this.btnShare.visible = false;
        }

        if (params.players) {
            // this.playerCnt = params.players.length;
            this.playersSeatDown(params.players);
        }

        this.setShareStart();

        let seat = this.getSeatByUId(this.owneruid)
        if (seat) {
            seat.setOwnerFlagVisible(true);
        }

        // this.playerCnt = params.players.length;
        //zhu roomID 大写
        pdkServer.roomInfo = this._roomInfo = { roomID: params.roomid, maxOdds: params.maxodd, maxround: params.maxround, baseScore: params.bscore, kickbacks: 0 };
        //zhu pdkServer.stopCache();
    }

    protected onShow(params: any = null, back: boolean = false): void {
        // this.playerCnt = 0;
        if (params.personalgame) {
            this.isPersonalGame = true;
            pdkServer.isMatch = false;
            pdkServer.isPersonalGame = true;
            // if(params.maxOdds){
            //     this.setPGameView(params);
            // }else{
            if (params.roomID) {
                pdkServer.QueryRoomInfoReq(params.roomID);
            }
            // }

            this.btnShare.visible = true;
        } else {
            pdkServer.isPersonalGame = false;
        }
        console.log("----------onShow", params.action, pdkServer._isFirstFromDDZ)
        switch (params.action) {
            case 'quick_join':
                this.sendQuickJoin();
                break;
            case 'reconnect':
                pdkServer.reconnect(0);
                if (params.roomID == 5001) { //需要请求抽红包的倒计时
                    pdkServer.reqRedNormalTime();
                }
                break;
            case 'from_login':
                if (pdkServer._isFirstFromDDZ == true) {
                    this.sendQuickJoin();
                    pdkServer._isFirstFromDDZ = false;
                }
                else {
                    this.btnContinue.visible = true;
                }
                break;
        }
        if (pdkServer._isFirstFromDDZ == true) {
            pdkServer._isFirstFromDDZ = false;
        }

        if (pdkServer.isMatch) {
            pdkServer.enterMatch(this._roomInfo.matchId);

            if (params.action != 'reconnect') {
                this.setlabWaiting('比赛开始，正在为您匹配对手...');
            } else {
                this.setlabWaiting('正在为您匹配对手...');
            }
        }
        //红包场
        else if (pdkServer.roomInfo && (pdkServer.roomInfo.roomID == 5001)) {
            this._redNormalShowMatching();
        }

        PDKMainLogic.instance.refreshSelfInfo();
        PDKBagService.instance.refreshBagInfo();
    }

    /**
     * 红包场开始游戏需要提示匹配对手
     */
    private _redNormalShowMatching(): void {
        this.labWaiting.visible = true;
        this.labWaiting.text = '正在为您匹配对手...'
    }
    beforeHide() {
        this.cleanSeat();
        this.removeListeners();
        if (this._timerClean) {
            egret.clearTimeout(this._timerClean);
        }
        if (this._redProcessTimeOutId) {
            egret.clearTimeout(this._redProcessTimeOutId);
        }
        if (this._showResultTimeOutId) {
            egret.clearTimeout(this._showResultTimeOutId);
        }
        if (this._timerDelayJoin) {
            egret.clearTimeout(this._timerDelayJoin);
        }
        if (this._showResultTimeOutId1) {
            egret.clearTimeout(this._showResultTimeOutId1);
        }
        egret.Tween.removeTweens(this.recorderBubble);
        pdkServer.playing = false;

        if (pdkServer.isMatch) {
            PDKPanelMatchWaitingInner.instance.close();
        }
    }

    protected onHide(params: any = null, back: boolean = false): void {
        super.onHide(params, back);

        //        PDKalien.PDKSoundManager.instance.stopMusic();

        this._seats.forEach((seat: PDKDDZSeat) => {
            seat.stopCD();
        });
    }

    /**
     * 点击红包按钮
     */
    private _onClickRed(): void {
        let _num = Number(this.redCount.text);
        let canChou = PDKMainLogic.instance.selfData.getRoomCanGetRed(this._roomInfo.roomID);
        if (canChou) {
            this.doChou(this._roomInfo.roomID)
            return;
        }
        if (_num <= 0) {
            let _needWinCnt = PDKMainLogic.instance.selfData.getRoomNeedWinCntGetRed(this._roomInfo.roomID);
            if (this._roomInfo.roomID == 9000 || this._roomInfo.roomID == 9001 || this._roomInfo.roomID == 9003 ||
                this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005) {
                PDKToast.show("游戏再赢" + _needWinCnt + "局即可抽取");
            }
            else if (this._roomInfo.roomID == 9002) {
                PDKToast.show("游戏再玩" + _needWinCnt + "局即可抽取");
            }
            return;
        }

        this.doChou(this._roomInfo.roomID)
    }

    private _showRedCount(bShow: boolean): void {
        this.redCountBg_img.visible = bShow;
        this.redCount.visible = bShow;
    }
    /**
     * 玩家可兑换的红包个数变化
     */
    private _onUserRedCountChange(e: egret.Event): void {
        let _data = e.data;
        let _bShow = false;
        if (_data.count > 0) {
            this.redCount.text = _data.count;
            _bShow = true;
        }
        this._showRedCount(_bShow);
    }
    /**
     * 初始化钻石赛规则关闭按钮
     */
    private _showMatch9RuleAniCloseBtn(bShow: boolean): void {
        this.match9RuleAniClose_btn.visible = bShow;
    }

    /**
     * zhu 播放9人钻石赛的规则
     */
    private onPlayMatch9RuleAni(): void {
        if (this._match9RuleAni == null) {
            this._match9RuleAni = new PDKDragonMatch9Rule();
            this._showMatch9RuleAniCloseBtn(true);
        }
        this.match9Rule_group.visible = true;
        this.match9Rule_group.addChild(this._match9RuleAni);
        this._match9RuleAni.play(this._onCloseMatch9RuleAni.bind(this));
    }
    /**
     * zhu 停止播放9人钻石赛规则
     */
    private _onCloseMatch9RuleAni(): void {
        if (this._match9RuleAni != null) {
            this._match9RuleAni.stop();
            this.match9Rule_group.removeChild(this._match9RuleAni);
            this._match9RuleAni = null;
        }
        this.match9Rule_group.visible = false;
        this._showMatch9RuleAniCloseBtn(false);
    }

    /**
     * 显示其他比赛的进度（当前局数/总局数)和排名,9人钻石赛有自己的进度显示
     */
    private _showMatchTurnAndRank(bShow: boolean): void {
        this.matchRank_group.visible = bShow;
        this.matchTurn_group.visible = bShow;
    }

    /**
     * 点击9人钻石赛规则
     */
    private _onClickMatch9Rule(): void {
        this.onPlayMatch9RuleAni();

    }
    /**
     * 设置钻石赛的局数
     */
    private _setMatch9Turn(nCur: number): void {
        let roomInfo = PDKGameConfig.getRoomConfigByMatchId(this._roomInfo.matchId);
        if (roomInfo.stage && roomInfo.stage.length == 1) {
            let turnCount = roomInfo.stage[0].handCount;
            this.match9Turn_label.textFlow = (new egret.HtmlTextParser).parser("<font color='#F0FF00'>" + nCur + "</font>" + "/" + turnCount);
        }
    }

    /**
     * 设置钻石赛当前的排名 
     */
    private _setMatch9CurRank(nCur: number): void {
        if (nCur < 0) {
            this.curRank_label.text = "正在统计.."
        }
        else {
            this.curRank_label.text = "" + nCur;
        }
    }

    /**
     * 点击9人钻石赛详情
     */
    private _onClickMatch9Info(): void {
        PDKPanelMatch9Info.getInstance().show(this._match9Info);
    }

    /**
     * 显示9人钻石赛局数，规则，详情等信息
     */
    private _showMatch9Bottom(bShow: boolean): void {
        this.match9_bottom_group.visible = bShow;
    }

    /**
     * 显示9人钻石赛的奖励
     */
    private _showMatch9Rew(_data): void {
        if (_data) {
            let matchId = _data.matchid;
            let roomInfo = PDKGameConfig.getRoomConfigByMatchId(matchId);
            if (roomInfo && roomInfo.matchType == 6) { //钻石赛
                PDKPanelMatch9GetRew.getInstance().show(roomInfo, _data);
            }
        }
        this._showMatch9WaitOtherPlayerOver(false);
    }

    /**
     * 喇叭消息变化
     */
    private _onHornRecChange(): void {
        this.rollMsg.show();
    }

    /**
     * 根据房间的限制，是否需要显示不可以加倍的原因
     */
    private _checkShowFailDouble(): any {
        let _seat: PDKDDZSeat = this._mySeat;
        let _rightSeat: PDKDDZSeat = this['seat1'];
        let _leftSeat: PDKDDZSeat = this['seat2'];
        let leftGold = _leftSeat.userInfoData.getGold() || 0;
        let rightGold = _rightSeat.userInfoData.getGold() || 0;
        let nDiamond = PDKBagService.instance.getItemCountById(3);
        let myGold = PDKMainLogic.instance.selfData.getGold();
        let _ret = { bShow: false, nReason: 1, sReason: "" };
        if (nDiamond < this._roomInfo.doublediamond) { //钻石不足
            _ret.bShow = true;
            _ret.sReason = "钻石不足,无法加倍";
            _ret.nReason = 4;
        }
        else if (_seat.isMaster) {
            if (leftGold < this._roomInfo.doublelimit && rightGold < this._roomInfo.doublelimit) {
                _ret.bShow = true;
                _ret.nReason = 3;
                _ret.sReason = "农民金豆不足" + this._roomInfo.doublelimit + ",无法加倍";
            }
        }
        else {
            if (_leftSeat.isMaster) {
                if (leftGold < this._roomInfo.doublelimit) {
                    _ret.bShow = true;
                    _ret.nReason = 1;
                    _ret.sReason = "地主金豆不足" + this._roomInfo.doublelimit + ",无法加倍";
                }
            }
            else {
                if (rightGold < this._roomInfo.doublelimit) {
                    _ret.bShow = true;
                    _ret.nReason = 1;
                    _ret.sReason = "地主金豆不足" + this._roomInfo.doublelimit + ",无法加倍";
                }
            }
        }
        return _ret;
    }
    /**
     * 显示加倍不加倍按钮
     */
    private _showDoubleNoDouble(bShow: boolean): void {
        this.double_group.visible = bShow;
        this.noDouble_group.visible = bShow;
    }

    /**
     * 点击加倍
     */
    private _onClickDouble(): void {
        if (this._doubleRet && this._doubleRet.bShow) {
            PDKImgToast.instance.show(this, this._doubleRet.sReason);
        }
        else {
            pdkServer.reqDouble();
        }
    }
    /**
     * 点击不加倍
     */
    private _onClickNoDouble(): void {
        pdkServer.reqNoDouble();
        this._mySeat.stopCD();
        this._clearAskDoubleTimeOut();
        this._showDoubleNoDouble(false);
        this._showFailDouble(false);
    }

    /**
     * 叫加倍不加倍超时，默认为不加倍
     */
    private _onMyAskDoubleTimeOut(): void {
        this._mySeat.stopCD();
        this._showDoubleNoDouble(false);
        this._clearAskDoubleTimeOut();
        this._showFailDouble(false);
        this._mySeat.showDoubleTip(true, false);
    }
    /**
     * 服务器下发加倍 不加倍
     * 1不加倍 2 加倍
     */
    private _onServerDoubleRep(_data): void {
        if (_data.params && _data.seatid && _data.params.length >= 1) {
            let nCode = _data.params[0]
            let seat: PDKDDZSeat = this.getSeatById(_data.seatid);

            if (nCode == 1) {
                seat.showDoubleTip(true, false);
                seat.showDoubleFlag(false);
            }
            else {
                seat.showDoubleTip(true, true);
                seat.showDoubleFlag(true);
                if (seat == this._mySeat) { //是我自己要扣加倍消耗的金豆
                    this._clearAskDoubleTimeOut();
                    this._mySeat.stopCD();
                    this._showDoubleNoDouble(false);
                    this._showFailDouble(false);
                    //let nDiamondCost = this._roomInfo.doublediamond;
                    //PDKBagService.instance.updateItemCount(3,-nDiamondCost);
                    //this._onBagRefresh();
                }
            }
        }
    }

    /**
     * 显示加倍失败的说明
     * //1 地主金豆不足 2,自己金豆不足 3,农民金豆不足 4,钻石不足
     */
    private _showFailDouble(bShow: boolean, nReason: any = null): void {
        if (bShow) {
            if (nReason >= 1 && nReason <= 4) {
                this.failDoubleDesc1_img.source = "failDoublePre" + nReason;
            } else {
                return;
            }
        }

        this.failDouble_group.visible = bShow;
    }
    /**
     * 显示下一句地主牌竞猜按钮
     */
    private _showNextMasterCardGuessBtn(bShow: boolean): void {
        bShow = false;
        this.btnGuessCards.visible = bShow;
    }

    /**
     * 钻石场需要判断钻石是否够门槛
     */
    private _shouldQuickJoinForRedRoom(): boolean {
        //红包赛需要显示正在匹配对手     
        let nDiamond = PDKBagService.instance.getItemCountById(3);
        //如果是自己的钻石小于门槛则是否获取了新手钻石奖励如果已领取则弹出复活提示框
        console.log("_shouldQuickJoinForRedRoom---------->", this._roomInfo.kickScore);
        if (nDiamond < this._roomInfo.kickScore) {
            PDKMainLogic.instance.noDiamondGetNewDiamondRewOrBuyRevive(this._roomInfo.minScore, this._roomInfo.roomID);
            // PDKAlert.show("钻石不足，是否前往商城购买 ？", 1, function (act) {
            //     if (act == "confirm") {
            //         if (pdkServer._isInDDZ == true) {
            //             pdkServer.ddzDispatchEvent(1, '', { type: 2, shopFlag: 0 });
            //         }
            //         else {
            //             PDKPanelExchange2.instance.show();
            //         }
            //     }
            // });
            // this.btnContinue.visible = true;
            return false;
        }
        else {
            this._redNormalShowMatching();
        }

        return true;
    }

    /**
     * 点击准备
     */
    private _onClickReady(): void {
        this.initData(true);

        if (this._roomInfo.roomID == 9002 || this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005) {
            if (!this._shouldQuickJoinForRedRoom()) {
                return;
            }
        }
        if (this._roomInfo.roomID == 9002 || this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005) {
            this.sendQuickJoinWithFlag();
        }
        else {
            this.sendQuickJoin();
        }
        this._showNextMasterCardGuessBtn(false);
        this.onCloseGrpGuessOp(null);
    }

    /**
     * 显示自己的钻石
     */
    private _setDiamondUI(nDiamond: number): void {
        let _nDiamond = nDiamond;
        this._mySeat.updateDiamond(_nDiamond);
    }

    /**
     * 发送快速加入，要隐藏准备按钮
     */
    private _onSendQuickJoin(): void {
        this.btnContinue.visible = false;
        if (!pdkServer.isMatch) {
            this.setlabWaiting("正在为您匹配对手...")
        }
    }

    /**
     * 背包更新
    */
    private _onBagRefresh(): void {
        //红包场不要监听此协议
        let _nDiamond: any = PDKBagService.instance.getItemCountById(3);
        if (this._roomInfo && (this._roomInfo.roomID == 5001)) {
            if (pdkServer.playing)
                return;
        }
        this._setDiamondUI(_nDiamond);
    }

    /**
     * 点击红包场的抽红包 
     */
    private _onClickRedNormal(): void {
        if (this._roomInfo.roomID == 5001 || this._roomInfo.roomID == 5101) { //急速红包场            
            this.doChou(this._roomInfo.roomID)
        } else if (!pdkServer.isMatch && !pdkServer.isPersonalGame) {//其他红包场的红包            
            this.doChou(this._roomInfo.roomID)
        }
        this._stopNewRedAni();
        this._showNormalRedImg(false);
    }

    /**
     * 清除10s抽红红包的interval
     */
    private _clearRedNormalInterval(): void {
        if (this._redNormalNum != -1) {
            egret.clearInterval(this._redNormalNum);
            this._redNormalNum = -1;
        }
    }
    /**
 * 显示抽奖杯
 */
    private _showNormalRedImg(bShow: boolean): void {
        // console.log("_showNormalRedImg----------->", bShow);
        this.redNormal_img.visible = bShow;
    }

    private _stopNewRedAni(): void {
        egret.Tween.removeTweens(this["redNormal_img"]);
        this["redNormal_img"].rotation = 0;
    }

    /**
     * 更新抽红包信息
     */
    private _onHasRedChance(): void {
        this._stopNewRedAni();
        this._showNormalRedImg(true);
        let _func = null;
        _func = function () {
            egret.Tween.get(this["redNormal_img"]).to({ rotation: 20 }, 100).to({ rotation: -20 }, 100).to({ rotation: 10 }, 60).to({ rotation: -10 }, 60).to({ rotation: 0 }, 30).wait(1000).call(function () {
                _func();
            }.bind(this));
        }.bind(this);

        _func();
    }

    /**
     * 红包场抽红包的信息或者是抽到的金额信息
     */
    private onRedNormalMoneyInfoRep(e: egret.Event): void {
        let data = e.data;
        //console.log("onRedNormalMoneyInfoRep----scenePDKPlay------>",data);
        if (data.optype == 1) { //抽到的红包金额
            if (data.result == null) {
                this.fastRedValue = data.params;
                let value = PDKUtils.exchangeRatio(data.params / 100, true);
                if (PDKalien.Native.instance.isNative) {
                    PDKAlert.show("恭喜获得" + value + "奖杯!");//zhu 暂时屏蔽 ,2, this.onAlertBtn);
                } else {
                    PDKAlert.show("恭喜获得" + value + "奖杯!");
                }
            }
        }
        else if (data.optype == 2) { //抽红包剩余时间
            if (data.result == null && data.params > 0) { //成功
                this._showNormalRedImg(true)
            }
        }
        else if (data.optype == 3) { //领取新手钻石奖励成功
            if (data.result == null) {
                let _str = "恭喜您，成功领取新手钻石奖励:" + data.params + "钻"
                PDKMainLogic.instance.selfData.setHasGetNewDiamond();
                PDKAlert.show(_str, 0, function () {
                    if (!pdkServer.playing && this._roomInfo && (this._roomInfo.roomID == 5001)) { //急速红包场 
                        let _nDiamond = PDKBagService.instance.getItemCountById(3);
                        if (this._roomInfo.minScore > _nDiamond) {
                            PDKMainLogic.instance.ifBuyReviveMaxTipShop(this._roomInfo.minScore, this._roomInfo.roomID);
                            return;
                        }
                        else {
                            this.sendQuickJoin();
                        }
                    }
                }.bind(this));
            }
        }
    }

    private onAlertBtn(action: string, data: any): void {
        if (action == 'cancel') {
            let code: number = this.fastRedValue;
            let shareScene: number = PDKShareImageManager.instance.getShareScene(PDKShareImageManager.GAME_TYPE_FAST, code);
            PDKShareImageManager.instance.start(pdkServer.uid, shareScene);
        }
    }

    /**
     * 购买复活礼包成功
     */
    private _onBuyReviveSucc(): void {
        if (this._roomInfo.roomID == 9002 || this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005) {
            if (!this._shouldQuickJoinForRedRoom()) {
                return;
            }
            this.sendQuickJoin();
        }
    }

    /**
     * 显示红包赛的规则
     */
    private _showRedNormalRule(): void {
        let _text = "";
        if (this._roomInfo.roomID == 5001) {
            _text = "进入条件:" + this._roomInfo.minScore + "钻石。\n方式:赢一局请立即领取。\n奖杯:10随机奖杯。\n底牌:一张牌价格1颗钻石。\n关牌:被关的玩家要付出双倍钻石。\n收费:每局游戏每人需要支付4颗钻石。"
        } else if (this._roomInfo.roomID == 5101) {
            _text = "进入条件:" + this._roomInfo.minScore + "金豆。\n方式:赢一局需要立即领取。\n胜利:胜利不获得金豆而获得大奖杯。\n奖杯:胜利即可获得，详细见右下角奖励说明。\n底牌:一张牌价格700金豆。\n关牌:被关的玩家要付出双倍金豆。\n收费:每局游戏每人需要支付5000金豆。"
        } else if (this._roomInfo.roomID == 1003) {
            _text = "底分说明：\r\n三人中金豆最少的人满足以下区间，则底分动态变化。\r\n\r\n1、金豆<50万，底分3000\r\n2、50万<金豆<200万，底分5000\r\n3、200万<金豆<500万，底分10000\r\n4、金豆>500万，底分30000\r\n"
        } else {
            return;
        }

        PDKAlert.show(_text, 0, null, "left");
    }

    /**
     * 点击红包则的规则按钮
     */
    private _onClickRedNormalHelp(): void {
        this._showRedNormalRule();
    }
    /**
     * 点击关闭复活界面（不购买）
     */
    private _onCloseRevivePanel(): void {
        PDKMainLogic.backToRoomScene();
    }

    /**
     * 商城金豆
     */
    private _onClickGold(): void {
        if (pdkServer._isInDDZ == true) {
            this.openDDZShop();
        }
        else {
            PDKPanelExchange2.instance.show();
        }
    }

    /**
     * 商城钻石
     */
    private _onClickDiamond(): void {
        if (pdkServer._isInDDZ == true) {
            this.openDDZShop(1);
        }
        else {
            PDKPanelExchange2.instance.show(1);
        }
    }
    /**
     * 游戏中断线重连，登录成功后，需要重新连接到游戏
     */
    public doReconnectToGame(data: any): void {
        this.onShow({ action: 'reconnect', personalgame: data.personalgame, roomID: data.roomid });
    }

    /**
     * 清除比赛复活的intervalId
     */
    private _clearMatchReviveInterval(): void {
        if (this._matchReviveIntervalId != 0) {
            egret.clearInterval(this._matchReviveIntervalId);
        }
        this._matchReviveIntervalId = 0;
    }

    /**
     * 比赛复活超时
     */
    private _onMatchReviveTimeOut(_data: any): void {
        this._clearMatchReviveInterval();
        pdkServer.giveUpMatch(this._roomInfo.matchId);
        PDKPanelMatchRevive.remove();
        if (!this._showMatchResult(_data)) { //没有展示比赛结果
            PDKMainLogic.backToRoomScene();
        }
    }
    /**
     * 显示比赛复活 (调用此函数之前验证过是否可以复活，并已知复活价格)
     */
    //{p.curr_rank, _curr_base_score, _relive_price, rt}
    private _showMatchRevive(_data): void {
        let _stage = this._roomInfo.stage;
        let _rankSub = _data.params[4]; //差多少名晋级
        this._clearMatchReviveInterval();
        let _nTime = _data.params[3];
        let _ins = PDKPanelMatchRevive.getInstance();
        let _interval = egret.setInterval(function () {
            _nTime += -1;
            if (_nTime < 0) {
                this._onMatchReviveTimeOut(_data);
            }
            _ins.updateCountDown(_nTime);
        }, this, 1000);

        this._matchReviveIntervalId = _interval;

        let _giveUp = function () {
            this._onMatchReviveTimeOut(_data);
        }

        let _gold = PDKMainLogic.instance.selfData.getGold();
        let _revive = function () {
            if (_gold < _data.params[2]) {//金豆不足
                PDKImgToast.instance.show(_ins, "金豆不足");
            } else {
                pdkServer.reqMatchRevive();
            }
        }

        _ins.show(_revive.bind(this), _giveUp.bind(this));
        _ins.setRankSub(_rankSub);
        _ins.setReviveCost(_data.params[2]);
        _ins.updateCountDown(_nTime);
    }


    //跑得快协议 处理
    private onPdkGiveCards(event: egret.Event): void {
        console.log('===================================>onPdkGiveCards:' + event.data);
        //游戏开始+发牌
        let data = event.data;
        // data.cards = [30, 91, 40, 41, 42, 50, 51, 52, 62, 70, 80, 133, 113, 123, 103, 13];
        //转换牌组
        data.cards = PDKUtils.transformCards(data.cards);
        if (!data.last_out_cards) {
            data.last_out_cards = [];
        }
        data.last_out_cards = PDKUtils.transformCards(data.last_out_cards);

        this.beforeGameStart();
        this._reconnectIn = false;
        this._showMatch9WaitOtherPlayerOver(false);
        //this.playersSeatDown(data.playerinfo);
        //todo 游戏开始要处理的代码

        if (this._cache.length > 0) {
            this._cache.forEach((item: any) => {
                item.method.call(this);
            });
            this._cache.splice(0);
        }
        if (this.isPersonalGame) {
            this.lbRound.text = String(this.cur_round) + '/' + String(this.total_round);
        } else if (!pdkServer.isMatch && !this.isPersonalGame) {
            this.setRedCoin();
            this.setBeforeWincnt();
        }

        //zhu 
        if (data.cardsrecorderremain && PDKMainLogic.instance.selfData.cardsRecorder) {
            PDKMainLogic.instance.selfData.cardsRecorder[6] = data.cardsrecorderremain;
            //清理记牌器
            this.refreshCardsRecorderAbout();
        }
        this._showNextMasterCardGuessBtn(false);

        //发牌
        data.cardids = data.cards;
        data.seatid = this._mySeat.seatid;
        this._mySeat.cancelSelect();
        //设置记牌器
        //this._setRecorderInfoByServerCard(data.cardids);
        console.log("pdkServer.playing-----------?", pdkServer.playing);
        if (pdkServer.playing) {
            this.addCard(data);
        } else {
            this._cache.splice(0);
            this._cache.push({ method: this.addCard.bind(this, data) });
        }

        //如果是我出牌
        this.onAskPlayCard({ cardType: 0, cardids: data.last_out_cards, pseatid: 0, time: data.time, seatid: data.curr_seatid });

        pdkServer.getUserInfoInGame(PDKMainLogic.instance.selfData.uid);
        // PDKBagService.instance.refreshBagInfo();
    }

    private onPdkOutcard(event: egret.Event): void {
        console.log('===================================>onPdkOutcard:' + event.data);
        //玩家出牌
        let data: any = event.data;
        // data.card = [73, 72, 71, 63, 61, 60, 53, 33, 32, 31];
        // data.last_out_cards = [73, 72, 71, 63, 61, 60, 53, 33, 32, 31];
        data.card = PDKUtils.transformCards(data.card);
        data.last_out_cards = PDKUtils.transformCards(data.last_out_cards);
        if (0 != data.code) {
            this.buttonBar.switchState('hidden');
            this._mySeat.cancelSelect();
            this._mySeat.hideNoMathCards();
            this._mySeat.checkType([]);
            //出牌错误，只有自己收到，重新提示
            var _cardType1 = PDKCardsType.GetType(data.last_out_cards);
            if (data.curr_seatid) {
                let _pseatid = data.seatid;

                // 上轮我出的牌最大
                if (data.last_out_seatid == this._mySeat.seatid) {
                    _pseatid = 0;
                }
                // 如果第一次出牌 lastoutcatds=[] 将其赋值为本次出的牌
                // data.cardids = [30, 31, 32, 40, 41, 42];
                // data.cardids = [30];
                // data.card = PDKUtils.transformCards(data.card);
                // data.last_out_cards = PDKUtils.transformCards(data.last_out_cards);

                if (data.card.length != 0 && data.last_out_cards.length == 0 && 0 != _pseatid) {
                    data.last_out_cards = data.card;
                }
                this.onAskPlayCard({ cardType: _cardType1, cardids: data.last_out_cards, pseatid: _pseatid, time: 0, seatid: data.curr_seatid });
            }
            return;
        }

        //转换牌组
        data.time = 14;
        if (data.last_out_seatid <= 0) {
            //首次出牌20秒
            data.time = 20;
        }
        // data.card = PDKUtils.transformCards(data.card);
        // data.last_out_cards = PDKUtils.transformCards(data.last_out_cards);

        let seat: PDKDDZSeat = this.getSeatById(data.seatid);
        let _cardType: number = -1;

        //炸弹加分
        let bTwoGame: boolean = (this._roomInfo.roomID == 9000 || this._roomInfo.roomID == 9001 || this._roomInfo.roomID == 9002 ||
            this._roomInfo.roomID == 9003 || this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005);
        let isBeBoomed = false;
        this.showBoomEffect = false;

        console.log("bomb_change_gold------------>data.bomb_change_gold=", data.bomb_change_gold);

        if (data.bomb_change_gold && data.bomb_change_gold.length > 0) {
            var cseatid = 0;
            if (data.last_out_seatid != this._mySeat.seatid) {
                if (data.last_out_seatid == this.seat1.seatid) {
                    cseatid = 1;
                }
                else if (data.last_out_seatid == this.seat2.seatid) {
                    cseatid = 2;
                }
            }
            console.log("onPdkOutcard----------->炸弹加分", data.last_out_seatid, this._mySeat.seatid, cseatid);
            if (data.last_out_seatid != this._mySeat.seatid) {
                isBeBoomed = true;
            }
            this.showBoomEffect = true;
            this.playChangeEffect(cseatid, Math.abs(data.bomb_change_gold[cseatid]), 0);
            this.updateGoldByBoom(cseatid, Math.abs(data.bomb_change_gold[cseatid]));
            for (var k = 0; k < 3; k++) {
                if (k == cseatid) continue;

                this.playChangeEffect(k, -Math.abs(data.bomb_change_gold[k]), 0);
                this.updateGoldByBoom(k, -Math.abs(data.bomb_change_gold[k]));
            }
            this._timerClean = egret.setTimeout(function (self) {
                for (var i = 0; i < 3; i++) {
                    if (pdkServer.playing) {
                        self['labChange' + i].visible = false;
                    }
                }
            }, this, 3000, this);
        }

        //刚刚出的牌
        if (seat) {
            seat.cleanDesk();
            let showWord4 = true;
            if (seat.seatid == this._mySeat.seatid && data.card.length == 0 && isBeBoomed == true) {
                showWord4 = false;
            }
            let isGameend = true;
            let isUpdateCnt = true;
            if (data.left_card != 0) isGameend = false;
            if (isGameend == true) isUpdateCnt = false;
            let pokerIds = data.card;
            let orderIds = PDKUtils.sortCardIds(pokerIds);
            console.log("useCards------>", pokerIds, "\norderIds------>", orderIds)
            if (!orderIds) orderIds = [];
            _cardType = seat.useCard(orderIds, isGameend, isUpdateCnt, showWord4);
            console.log("onPdkOutcard----------->要我出牌了", orderIds, isGameend, showWord4);
            seat.stopCD();
        }

        //如果刚刚出的牌是我出的
        if (this._mySeat.seatid == data.seatid) {
            this.buttonBar.switchState('hidden');
            this._mySeat.cancelSelect();
            this._mySeat.hideNoMathCards();
            this._mySeat.checkType([]);
        } else {
            //更新记牌器
            //this._updateRecorderByCards(data.card);
        }

        if (data.curr_seatid) {
            let _pseatid = data.seatid;

            // 上轮我出的牌最大
            if (data.last_out_seatid == this._mySeat.seatid) {
                _pseatid = 0;
            }
            // 如果第一次出牌 lastoutcatds=[] 将其赋值为本次出的牌
            if (data.card.length != 0 && data.last_out_cards.length == 0 && 0 != _pseatid) {
                data.last_out_cards = data.card;
            }
            this.onAskPlayCard({ cardType: _cardType, cardids: data.card.length == 0 ? data.last_out_cards : data.card, pseatid: _pseatid, time: data.time, seatid: data.curr_seatid });
        }
    }

    private updateGoldByBoom(seat, score) {
        if (!this.seat2.visible && seat == 2) {
            return;
        }
        console.log("playChangeEffect-----updateGold------>", seat, this._mySeat.seatid, score);

        if (seat == 0) {
            if (this._roomInfo.roomID == 9002 || this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005) {
                this._mySeat.updateDiamondNum(score, true);
            }
            else {
                this._mySeat.updateGold(score);
            }
        }
        else {
            if (this._roomInfo.roomID == 9002 || this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005) {
                this.seat1.updateDiamondNum(score, false)
            }
            else {
                this.seat1.updateGold(score);
            }
        }
    }

    private onPdkReady(event: egret.Event): void {
        console.log('===================================>onPdkReady:' + event.data);
    }

    private onPdkEnd(event: egret.Event): void {
        console.log('===================================>onPdkEnd:' + event.data);
        let success: boolean = false;
        pdkServer.playing = false;
        let data: any = event.data;
        let kickbacks = this._roomInfo.kickbacks;
        if (!kickbacks) kickbacks = 0;
        let winDesk: PDKDDZSeat;
        this.buttonBar.switchState('hidden');
        this._mySeat.setHang(false);
        this._mySeat.setStatus(null); //隐藏不出
        this.seat1.setStatus(null); //隐藏不出
        this.seat2.setStatus(null); //隐藏不出

        var c, kb = 0;
        let bTwoGame: boolean = (this._roomInfo.roomID == 9000 || this._roomInfo.roomID == 9001 || this._roomInfo.roomID == 9002 ||
            this._roomInfo.roomID == 9003 || this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005);
        let userCount: number = bTwoGame ? 2 : 3;
        for (var i = 0; i < userCount; ++i) {
            // if(data.chanage[i] == 0)
            //c = data.chanage[i];
            c = data.users[i].score;
            //kb = data.realkickback[i] == null ? 0: data.realkickback[i];
            let seat: PDKDDZSeat = this.getSeatById(data.users[i].seatid);
            if (!seat) continue;
            if (c > 0) {
                winDesk = seat;
            }
            if (this._mySeat == seat) {
                //success = c > 0;
                success = (data.users[i].left_card <= 0);
            }
            var cseatid = 0;
            if (this.seat1 == seat) {
                cseatid = 1;
            } else if (this.seat2 == seat) {
                cseatid = 2;
            }
            if (this.showBoomEffect == true) {
                let cs = cseatid;
                let change = c + kb;
                egret.setTimeout(this.delayShowChangeEffect.bind(this, cs, change), this, 1000);
                // this.playChangeEffect(cseatid, c + kb, 0);
            }
            else {
                this.playChangeEffect(cseatid, c + kb, 0);
            }

            // if (!bTwoGame || this._roomInfo.roomID == 3101 || this._roomInfo.roomID == 3102) {
            //     this.playChangeEffect(cseatid, c + kb, 0);
            // } else {
            //     if (data.users[i].left_card > 0) {
            //         this.playChangeEffect(cseatid, c + kb, 0);
            //     }
            // }
            if (this._roomInfo.roomID == 9002 || this._roomInfo.roomID == 9004 || this._roomInfo.roomID == 9005) {
                if (seat != this._mySeat) { //不是自己才刷新，自己的钻石服务器会主动推
                    seat.updateRednormalGold(c);
                }
                else {
                    seat.updateRednormalGold(c, true);
                }
            }
            else {
                seat.updateGold(c - data.users[i].table_fee, pdkServer.isMatch);
            }
            seat.stopCD();

            //亮牌
            if (data.users[i].ncards.length > 0) {
                data.users[i].ncards = PDKUtils.transformCards(data.users[i].ncards);
                data.users[i].ncards.sort((a, b): number => {
                    return b - a;
                });
                seat.useCard(data.users[i].ncards, true);
            }
        }

        if (success == false) {
            for (var i = 0; i < userCount; ++i) {
                let seat: PDKDDZSeat = this.getSeatById(data.users[i].seatid);
                if (!seat) continue;
                if (this._mySeat != seat) {
                    (<PDKSideSeat>seat).setCardCount(0);
                }
            }
        }

        this.btnHang.enabled = false;
        this.btnContinue.visible = true;
        this._mySeat.grpRecorder.visible = false;
        //this.showResult(success);
        // if (success) {
        //     this.addRedProcess();
        // }
        this._clearRecorderInfo(0);
        PDKPanelPlayerInfo.remove();

        // PDKMainLogic.instance.updateRecorderExpireTime();
        //this.refreshCardsRecorderAbout();

        //结算框
        // PDKPanelNormalResult.instance.show(data, this._seats, this._mySeat.seatid, (action, data)=> {
        //     if (action == 'close') {
        //         //this.onAlertResult(0, 'confirm');
        //     } else if (action == 'continue') {
        //         this._onClickReady();
        //     }
        // });
    }

    private onPdkCardHolder(event: egret.Event): void {
        console.log('===================================>onPdkCardHolder:' + event.data);
        this.beforerecorderTime = PDKMainLogic.instance.selfData.cardsRecorder[6];
        let data: any = event.data;
        if (data.card_infos && data.card_infos.length > 0) {
            let cards: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (var i = 0, length = data.card_infos.length; i < length; i++) {
                if (data.card_infos[i].card_value >= 3) {
                    cards[data.card_infos[i].card_value - 3] = data.card_infos[i].card_num;
                } else {
                    cards[10 + data.card_infos[i].card_value] = data.card_infos[i].card_num;
                }
            }
            this._showRecorder(true);
            this._setRecorderInfoByServerNum(cards);
        }
    }

    private onPdkReconnect(event: egret.Event): void {
        console.log('===================================>onPdkReconnect:' + event.data);
        let data: any = event.data;
        //重连要处理的代码
        this.labWaiting.visible = false;
        this._reconnectIn = true;
        this.beforeGameStart();
        this.playersSeatDown(data.players);

        //转换牌组
        data.cards = PDKUtils.transformCards(data.cards);
        data.last_out_cards = PDKUtils.transformCards(data.last_out_cards);

        //todo 重连要处理的代码
        this._mySeat.addCards(data.cards, !this._reconnectIn);

        data.players.forEach((player: any) => {
            let seat: PDKDDZSeat = this.getSeatById(player.seatid);
            seat.setHang(player.is_deposit == 1);
            if (pdkServer.isMatch) {
                let info: any = {
                    imageid: 'pdk_icon_head10',
                    nickname: '参赛玩家'
                };
                seat.userInfoView.update(info);
            }
            if (player.is_offline == 1) { //玩家离线
                seat.setUserOffline(true);
            }
            if (this._mySeat.seatid != seat.seatid) {
                //console.log('%s有%d张牌', seat.userInfoData.uid, player.params[0]);
                (<PDKSideSeat>seat).setCardCount(player.left_card);
            }
        });

        if (!pdkServer.isMatch && !this.isPersonalGame) {
            this.setBeforeWincnt();
            this.setRedCoin();
        }
        pdkServer.hang(false);

        this.autoOpenRecorder();
        PDKBagService.instance.refreshBagInfo();
        PDKalien.PDKSoundManager.instance.playMusic(PDKResNames.pdk_bgm);

        let _cardType = -1;
        let _cardids = data.last_out_cards;
        if (data.last_out_cards.length > 0) {
            let _seat = this.getSeatById(data.last_out_seatid);
            _cardType = _seat.useCard(_cardids, false, false);
        }
        this.onAskPlayCard({ cardType: _cardType, cardids: _cardids, pseatid: data.last_out_seatid, seatid: data.curr_seatid, time: 14 });
    }
    //跑得快协议 处理结束
}