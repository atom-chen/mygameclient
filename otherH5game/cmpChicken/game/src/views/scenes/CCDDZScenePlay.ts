/**
 * Created by rockyl on 16/2/26.
 *
 * 游戏场景
 */

class CCDDZScenePlay extends CCalien.CCDDZSceneBase {
    private _newTable: boolean;
    private _timerClean: any;
    private _timerDelayJoin: any;
    private _showResultTimeOutId: number;
    private _showResultTimeOutId1: number;
    private _redProcessTimeOutId: number;
    private _reconnectIn: boolean;

    private _askPlayCardCount: number = 0;
    private _tfMatchPlayInfo: any[];
    private _cache: any[] = [];

    private _roomInfo: any;
    private _isNewRed: boolean;
    private _seats: CCDDZDDZSeat[] = [];
    private _mySeat: CCDDZMySeat;
    private labWaiting: eui.Label;
    private btnHang: eui.CheckBox;
    private grpButton: eui.Group;
    private masterCards: CCDDZMasterCards;
    private buttonBar: CCDDZButtonBar;
    private rectMask: eui.Rect;

    private btnContinue: CCDDZStateButton;
    private cdProgressBar: CCDDZCDProgressBar;
    /**
     * 比赛轮数局数信息
     */
    private labMatchInfo: eui.Label;
    private labelMatchInfo: eui.Label;
    private grpBg: eui.Group;
    private grpTopButton: eui.Group;
    private seat1: CCDDZSideSeat;// 右边的位置
    private seat2: CCDDZSideSeat;// 左边的位置
    private seat0: CCDDZMySeat;
    private grpRed: eui.Group;

    private redList: eui.List;
    private redCount: eui.Label;
    private redListDataProvider: eui.ArrayCollection;
    private redListDataArr: Array<number>;
    //zhu private grpRedWarn:eui.Group;
    private redLeftCount: eui.Label;

    private dragonHongBao: CCDDZDragonHongBao;
    private dragonHongBaoWarn: CCDDZDragonHongBaoWarn;
    private dragonChunTian: CCDDZDragonGameChunTian;
    private dragonWangZha: CCDDZDragonGameWangZha;
    private dragonZhaDan: CCDDZDragonGameZhaDan;
    private dragonFeiJi: CCDDZDragonGameFeiJi;
    private dragonMyLianDui: CCDDZDragonGameLianDui;
    private dragonRightLianDui: CCDDZDragonGameLianDui;
    private dragonLeftLianDui: CCDDZDragonGameLianDui;
    private dragonMyShunZi: CCDDZDragonGameShunZi;
    private dragonRightShunZi: CCDDZDragonGameShunZi;
    private dragonLeftShunZi: CCDDZDragonGameShunZi;
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
    private isCoupleGame: boolean = false;

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
    // private grpRecorder:eui.Group;
    private remainCards = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    private rollMsg: CCDDZMarqueeText;

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

    /**
     * 是否在可以领取每日福袋的时间内
     */
    private _inDayGetTime: boolean;

    /**
     * 任务按钮
     */
    private grpTask: eui.Group;

    /**
     * 任务上的红点
     */
    private overTaskBgImg: eui.Image;

    /**
     * 任务完成的数量
     */
    private overTaskLabel: eui.Label;

    /**
     * 清除五张牌奖励timeout
     */
    private fiveRewGetTimeout: number;
    constructor() {
        super();

        this.init();
    }

    private init(): void {
        this.skinName = scenes.CCDDZScenePlaySkin;

        this._tfMatchPlayInfo = CCalien.CCDDZUtils.parseColorTextFlow(lang.match_play_info);
    }

    /**
     * 显示赢五局抽红包
     */
    private _showGrpRed(bShow: boolean): void {
        this.grpRed.visible = bShow;
    }

    initGuessCardsView(): void {
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
        this.setGuessCardsMultiple([1.2, 3, 6, 15, 20, 100]);
        console.log("_roomInfo" + this._roomInfo);
        if (!this._roomInfo || !this._roomInfo.guessbet) return;
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
        this._mySeat.width = CCalien.CCDDZStageProxy.stage.stageWidth - 20;
        for (let i = 0; i < 3; i++) {
            this._seats[i] = this['seat' + i];
            this['labChange' + i].visible = false;
        }
        this.grpRedNotice.visible = false;

        this.labWaiting.visible = false;
        this.btnShare.visible = false;
        this.redListDataArr = [1, 1, 1, 1, 1];
        this.redListDataProvider = new eui.ArrayCollection(this.redListDataArr);
        this.redList.itemRenderer = CCDDZRedPacketProcess;
        this.redList.dataProvider = this.redListDataProvider;
        if (!ccserver.isMatch && !this.isPersonalGame) {
            if (!this.dragonHongBao)
                this.dragonHongBao = new CCDDZDragonHongBao();
            /*if(!this.dragonHongBaoWarn)
                this.dragonHongBaoWarn = new CCDDZDragonHongBaoWarn();*/
        }
        this.dragonChunTian = new CCDDZDragonGameChunTian();
        this.dragonWangZha = new CCDDZDragonGameWangZha();
        this.dragonZhaDan = new CCDDZDragonGameZhaDan();
        this.dragonFeiJi = new CCDDZDragonGameFeiJi();
        this.dragonMyLianDui = new CCDDZDragonGameLianDui(false);
        this.dragonRightLianDui = new CCDDZDragonGameLianDui(false);
        this.dragonLeftLianDui = new CCDDZDragonGameLianDui(true);
        this.dragonMyShunZi = new CCDDZDragonGameShunZi(false);
        this.dragonRightShunZi = new CCDDZDragonGameShunZi(false);
        this.dragonLeftShunZi = new CCDDZDragonGameShunZi(true);
        this._mySeat.userInfoView.currentState = "my";

        let e: CCalien.CCDDZEventManager = CCalien.CCDDZEventManager.instance;
        e.registerOnObject(this, ccserver, CCGlobalEventNames.USER_RECONNECT_TABLE_REP, this.onReconnectTableRep, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.GAME_GIVE_UP_GAME_REP, this.onGiveUpGameRep, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.USER_ALMS_REP, this.onAlmsResponse, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.USER_QUICK_JOIN_RESPONSE, this.onQuickJoinResponse, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.GAME_USER_INFO_IN_GAME_REP, this.onUserInfoInGameResponse, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.GAME_GAME_START_NTF, this.onGameStart, this, 1000);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.GAME_RECONNECT_REP, this.onReconnectRep, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.GAME_ADD_CARD, this.onAddCard, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.GAME_USE_CARD_NTF, this.onUseCard, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.GAME_SET_CARDS, this.onSetCards, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.GAME_ASK_MASTER, this.onAskMaster, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.GAME_SET_SCORE, this.onSetScore, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.GAME_SHOW_CARD, this.onShowCard, this);

        e.registerOnObject(this, ccserver, CCGlobalEventNames.GAME_TABLE_INFO, this.onTableInfo, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.GAME_USER_ONLINE, this._onUserOnline, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.GAME_USER_OFFLINE, this._onUserOffline, this);

        e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.SHOW_LOTTERY, this.showLaba, this);

        e.registerOnObject(this, ccserver, CCGlobalEventNames.GAME_GAME_END, this.onGameEnd, this, 1000);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.GAME_OPERATE_REP, this.onOperateRep, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.USER_OPERATE_REP, this.onUserOperateRep, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.GAME_UPDATE_GAME_INFO, this.onUpdateGameInfo, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.GAME_ENTER_TABLE, this.onEnterTable, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.GAME_LEAVE_TABLE, this.onLeaveTable, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.GAME_ASK_READY, this.onAskReady, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.GAME_GET_READY_REP, this.onGetReadyRep, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.USER_FRESH_MAN_REDCOIN_LOTTERY_CHANCEGOT, this.onFreshManRedcoinLotteryChanceGot, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.USER_LOTTERY_RED_COIN_REP, this.onLotteryRedCoinRep, this);

        e.registerOnObject(this, this.buttonBar, CCGlobalEventNames.BUTTON_BAR_TAP, this.onButtonBarTap, this);
        e.registerOnObject(this, this.grpButton, egret.TouchEvent.TOUCH_TAP, this.onGrpButtonTap, this);
        //e.registerOnObject(this,this._timerChatCD,egret.TimerEvent.TIMER,this.onChatCD,this);
        e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.SELECT_CARDS, this.onSelectCards, this);
        e.registerOnObject(this, this.grpBg, egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.SHOW_GAME_EFFECT, this.onShowGameEffect, this);

        e.registerOnObject(this, ccserver, CCGlobalEventNames.QUIT_PGAME_REP, this.onQuitRoomRep, this);
        e.registerOnObject(this, this.seat0.userInfoView.gold, egret.TouchEvent.TOUCH_TAP, this._onClickGold, this);
        e.registerOnObject(this, this.seat0.userInfoView.diamond, egret.TouchEvent.TOUCH_TAP, this._onClickDiamond, this);

        e.registerOnObject(this, ccserver, CCGlobalEventNames.GAME_DISSOLVE, this.onGameDissolve, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.START_PGAME_REP, this.onStartGameRep, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.QUERY_ROOMINFO_REP, this.onPGameRoomInfoRep, this);
        e.registerOnObject(this, ccserver, CCGlobalEventNames.USER_DiamondGame_REP, this.onRedNormalMoneyInfoRep, this);

        e.registerOnObject(this, this.btnShare, egret.TouchEvent.TOUCH_TAP, this.onShare, this);
        // e.registerOnObject(this,this.btnShare,egret.TouchEvent.TOUCH_TAP,this.onStart,this);
        e.registerOnObject(this, this.btnStart, egret.TouchEvent.TOUCH_TAP, this.onStart, this);

        e.registerOnObject(this, this._mySeat.redBgImg, egret.TouchEvent.TOUCH_TAP, this.onGrpRedcoinClick, this);
        e.registerOnObject(this, this._mySeat.redExchangeImg, egret.TouchEvent.TOUCH_TAP, this._onClickExchageRed, this);

        e.registerOnObject(this, this.grpGuessCards, egret.TouchEvent.TOUCH_TAP, this.onCloseGrpGuessOp, this);
        e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.MY_USER_INFO_UPDATE, this.myUserinfoUpdate, this);
        // e.registerOnObject(this,this.btnRecord,egret.TouchEvent.TOUCH_TAP,this.switchRecorder,this);
        // e.registerOnObject(this,this.btnGuessCards,egret.TouchEvent.TOUCH_TAP,this.onBtnGuessClick,this);
        e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.USER_RED_COUNT_CHANGE, this._onUserRedCountChange, this);
        e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.HORN_TALK_RECORDS_CHANGE, this._onHornRecChange, this);
        e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.BAG_INFO_REFRESH, this._onBagRefresh, this);
        e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.CLOSE_REVIVE_PANEL, this._onCloseRevivePanel, this);
        e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.BUY_REVIVE_SUCC, this._onBuyReviveSucc, this);

        e.registerOnObject(this, ccserver, CCGlobalEventNames.USER_MatchOperate_REP, this._onRecvMatchOperateRep, this);
        e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.USER_DTREWARD_GET_SUCC, this._onDayTaskRewGetSucc, this);

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
        // if(CCGlobalGameConfig.testers && CCGlobalGameConfig.testers[CCDDZMainLogic.instance.selfData.uid]){
        //     this.btnRecord.visible = true;
        //     this._mySeat.grpRecorder.visible = true;
        // }else{
        //     this.btnRecord.visible = false;
        //     this._mySeat.grpRecorder.visible = false;
        // }
    }

    private setBeforeWincnt(): void {
        if (ccserver.isMatch || ccserver.isPersonalGame) return;
        this.beforewincnt = 0;
        if (CCDDZMainLogic.instance.selfData.wincnt && CCDDZMainLogic.instance.selfData.wincnt.length) {
            for (var i: number = 0; i < CCDDZMainLogic.instance.selfData.wincnt.length; i++) {
                if (CCDDZMainLogic.instance.selfData.wincnt[i].roomid == this._roomInfo.roomID) {
                    this.beforewincnt = CCDDZMainLogic.instance.selfData.wincnt[i].cnt;
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

        let _seat: CCDDZDDZSeat = this.getSeatById(_data.seatid);
        if (!_seat) return;

        _seat.setUserOffline(false);
    }

    /**
     * 用户掉线
     */
    private _onUserOffline(e: egret.Event): void {
        let _data = e.data;
        if (!_data || !_data.uid) return;

        let _seat: CCDDZDDZSeat = this.getSeatByUId(_data.uid);
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
        let fromSeat: CCDDZDDZSeat = this.getSeatById(fromSeatId);
        let toSeat: CCDDZDDZSeat = this.getSeatById(toSeatId);
        if (fromSeat && toSeat && browId) {
            let role: egret.MovieClip = CCGlobalBrowData.createBrowMCById(browId);
            if (!role) return;

            let img = new eui.Image("cc_play_animate_star");
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
            let wh = CCGlobalBrowData.getBrowAniWHById(browId);
            role.anchorOffsetX = wh.width * 0.25;
            role.anchorOffsetY = wh.height * 0.25;

            role.addEventListener(egret.Event.COMPLETE, function (e: egret.Event): void {
                let _fStay = CCGlobalBrowData.getBrowAniLastStayById(browId);
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
                if (CCGlobalBrowData.isNeedXMoveById(browId)) {
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
        var userInfoData: CCGlobalUserInfoData = CCDDZMainLogic.instance.selfData;
        var temp = egret.localStorage.getItem("cardsrecorderexpirenotice");

        if (ccserver.isCoupleGame == true) {
            this.recorderBubble.visible = false;
            return;
        }

        if (!userInfoData.recorderfirstrewardgot) {//} || userInfoData.recorderfirstrewardgot != 1){
            this.recorderBubble.source = 'cc_play_recorder_gift'
            this.recorderBubbleAnimate();
            this._mySeat.grpRecorder.visible = false;
        } else if ((userInfoData.cardsRecorder.length < 1 || userInfoData.cardsRecorder[6] <= 0)) {
            // 隐藏动画
            egret.Tween.removeTweens(this.recorderBubble);
            this.recorderBubble.visible = false;

            if (!temp) {
                this.recorderBubble.source = 'cc_play_recorder_outofdate';
                this.recorderBubble.visible = true;
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
        this._mySeat.grpRecorder.visible = bShow;
    }

    private myUserinfoUpdate(event: egret.Event): void {
        var userInfoData: CCGlobalUserInfoData = CCDDZMainLogic.instance.selfData;

        if (userInfoData.hasRecorder()) {
            if (this.recorderBubble.visible) {
                // this.removeChild(this.recorderBubble);
                egret.Tween.removeTweens(this.recorderBubble);
                this._showRecorder(false);
                if (this.recorderBubble.source == 'cc_play_recorder_gift' && userInfoData.recorderfirstrewardgot) {
                    CCDDZImgToast.instance.show(this, '领取成功');
                }
                this._showRecorder(true);
                egret.localStorage.setItem("opencardsrecorder", '1');
            }

            if (!this.beforerecorderTime || this.beforerecorderTime <= 0) {
                // this.beforerecorderTime = userInfoData.cardsRecorder[6]
                if (ccserver.playing) {
                    ccserver.gameOperate(6); //请求记牌器数据
                }
            }
        }

        if (!ccserver.isMatch && !ccserver.isPersonalGame) {
            let _gold = CCDDZMainLogic.instance.selfData.gold;
            this._mySeat.userInfoView.updateGold(_gold);
            this._mySeat.userInfoView.avatar.setVipLevel(userInfoData.getCurVipLevel());
            this._setTableRedInfo();
        }
        this.refreshCardsRecorderAbout();
        this.updateRedCoinInfo();
        let roomId = this._roomInfo.roomID;
        if (roomId != 1001 && roomId != 1002 && roomId != 8001 && roomId != 1006) {
            this._initNewRedProcess();
        } else {
            this.setRedProcess();
        }
    }

    /***
     * 点击记牌器按钮后如果是打开则关闭，如果是关闭则打开
     */
    private switchRecorder(event: egret.TouchEvent): void {
        var userInfoData: CCGlobalUserInfoData = CCDDZMainLogic.instance.selfData;
        if (!userInfoData.recorderfirstrewardgot || userInfoData.recorderfirstrewardgot != 1) {
            ccserver.getCardsRecorderReward();
        } else if (userInfoData.hasRecorder()) {
            this._mySeat.grpRecorder.visible = !this._mySeat.grpRecorder.visible;

            if (this._mySeat.grpRecorder.visible) {
                egret.localStorage.setItem("opencardsrecorder", '1');
            } else {
                egret.localStorage.removeItem("opencardsrecorder");
            }
        } else {
            CCDDZPanelBuyRecorder.instance.show();
        }

        // var temp = egret.localStorage.getItem("cardsrecorderexpirenotice");
        if (this.recorderBubble.source == 'cc_play_recorder_outofdate' && this.recorderBubble.visible) {
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
        this._showGuessNotice(false);
        if (this.grpGuessOp.visible) {
            this.onCloseGrpGuessOp(null);
        } else {
            this.showGuessView();
        }
    }

    private onGuessOptionClick(event: egret.TouchEvent): void {
        var option = Number(event.currentTarget.name);

        if (this.guesscount[option] >= 20) {
            CCDDZImgToast.instance.show(this, lang.guessCardsNotice[1]);
            CCDDZImgToast.instance.enableTouch(false);
        } else {
            //ccserver.gameOperate(3, [option + 1]);
            ccserver.reqUserGuessNextCard(this._roomInfo.roomID, option + 1);
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
        let _selfData = CCDDZMainLogic.instance.selfData;
        let conf = CCGlobalGameConfig.exchangeConfig.filter((item: any) => {
            if (item.goodsid == 1 && !item.hide) {
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
        let _selfData = CCDDZMainLogic.instance.selfData;
        let conf = CCGlobalGameConfig.exchangeConfig.filter((item: any) => {
            if (item.goodsid == 4 || item.goodsid == 1) {
                if (item.first) {
                    let _timeStamp = _selfData.rcminexcexpiretime;//过期时间戳单位秒
                    let _curStamp = CCalien.CCDDZUtils.getCurTimeStamp();
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

        this._mySeat.setRedcoin((redcoin == null ? "0.00" : CCDDZUtils.exchangeRatio(redcoin, true)), true);
    }

    /**
     * 点击抽红包的兑
     */
    private _onClickExchageRed(): void {
        CCDDZPanelExchange2.instance.show(4);
    }

    /**
     * 提示兑换红包的动画
     */
    private _showExchangeRedAni(): void {
        egret.Tween.get(this.grpRedNotice).set({
            visible: true,
            alpha: 1,
        }).wait(1000)
            .to({
                alpha: 0
            }, 2000);
    }

    private onGrpRedcoinClick(event: egret.TouchEvent): void {
        // this.grpRedNotice.visible = !this.grpRedNotice.visible;
        //有金额可以兑换则直接跳转到兑换界面
        if (this._checkHasRedCanExchange()) {
            CCDDZPanelExchange2.instance.show(4);
            return;
        }
        this._showExchangeRedAni();
    }

    private onGameDissolve(event: egret.Event): void {
        var data: any = event.data;
        CCDDZPanelPlayerInfo.remove();
        if (data.players && data.players.length > 0) {
            for (var i = 0; i < data.players.length; ++i) {
                data.players[i].nickname = CCDDZBase64.decode(data.players[i].nickname);
            }
            if (data.quitPlayer) {
                data.quitPlayer = CCDDZBase64.decode(data.quitPlayer)
                if (data.quitPlayer.length > 8) {
                    data.quitPlayer = data.quitPlayer.substring(0, 8)
                }
            }
            CCDDZPersonalDetail.instance.show(data.players, this.onAlertResult.bind(this, 0), true, data.quitPlayer);
        } else if (data.reason == 2) {
            //  CCDDZAlert.show()
            CCDDZAlert.show('房主退出，牌局解散', 0, this.onAlertResult.bind(this, 0));
        }
    }

    private onQuitRoomRep(event: egret.Event): void {
        var data: any = event.data;
        if (data.result == 0) {
            if (data.uid == ccserver.uid) {
                CCDDZMainLogic.backToRoomScene();
            } else if (ccserver.playing) {
                let seat: CCDDZDDZSeat = this.getSeatByUId(data.uid);
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
            CCDDZPanelAlert.instance.show('错误编号' + data.result, 0);
        } else {
            // CCalien.CCDDZSceneManager.show(CCGlobalSceneNames.PLAY, this.roominfo, CCalien.CCDDZsceneEffect.CCDDFade);
            this.setStartPgameBtnVisible(false);
            this.btnShare.visible = false;
            this.gamestarted = true;
        }
    }

    private onCloseGrpGuessOp(event: egret.TouchEvent): void {
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
        CCGlobalWxHelper.share(1, (response) => {
            //0 分享成功 1 取消分享 2 分享失败 3 用户点击分享按钮
            /*zhu 暂时不重置分享的链接
            if(response.code != 3) {
                CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.WX_SHARE);
            }
            */
        }, [this.total_round, this.lbLimit.text, this.roomid]);
    }
    private onShare(event: egret.TouchEvent): void {
        this._justSetShareParams();
        if (!CCalien.Native.instance.isNative) {
            CCDDZPanelShare.instance.sendGameToFriend();
        } else {
            CCGlobalWxHelper.shareForNative(1, null, [this.total_round, this.lbLimit.text, this.roomid])
        }
    }

    private onStart(event: egret.TouchEvent): void {
        ccserver.StartPGameReq(this.roomid);
    }

    addListeners(): void {
        if (ccserver.isMatch) {
            CCDDZMatchService.instance.addEventListener(CCGlobalEventNames.USER_MATCH_INFO_NTF, this.onMatchInfoNtf, this);
        }
        // CCDDZExchangeService.instance;
        CCalien.CCDDZEventManager.instance.enableOnObject(this);
        CCalien.CCDDZDispatcher.addEventListener(CCGlobalEventNames.SHOW_PAYCHAT, this.showLaba, this);
        this._addClickFunc();
    }

    removeListeners(): void {
        if (ccserver.isMatch) {
            CCDDZMatchService.instance.removeEventListener(CCGlobalEventNames.USER_MATCH_INFO_NTF, this.onMatchInfoNtf, this);
        }

        CCalien.CCDDZEventManager.instance.disableOnObject(this);
        CCalien.CCDDZDispatcher.removeEventListener(CCGlobalEventNames.SHOW_PAYCHAT, this.showLaba, this);
    }

    private showLaba(e: egret.Event): void {
        this.rollMsg.show();
    }

    private _lastTap: any = {};
    private onTap(event: egret.TouchEvent): void {
        let t = this._lastTap;

        //console.log(new Date().valueOf() - t.time, CCalien.MathUtils.distance(t.x, t.y, event.stageX, event.stageY));
        if (new Date().valueOf() - t.time < 200 && CCalien.MathUtils.distance(t.x, t.y, event.stageX, event.stageY) < 50) {
            this.doubleTap(event);
            t = this._lastTap = {};
        }

        t.x = event.stageX;
        t.y = event.stageY;
        t.time = new Date().valueOf();
    }

    private doubleTap(event: egret.TouchEvent): void {
        //console.log('doubleTap');
        if (ccserver.playing) {
            this._mySeat.cancelSelect();
        }
    }

	/**
	 * 场景初始化
	 */
    initData(bOnClickReady: boolean = false): void {
        if (this.isPersonalGame) {
            this._seats.forEach((seat: CCDDZDDZSeat) => {
                seat.initData({ isMatch: false, matchType: 1 })
            });
        } else {
            this._seats.forEach((seat: CCDDZDDZSeat) => {
                let obj = { isMatch: ccserver.isMatch, matchType: ccserver.roomInfo.matchType, cleanUserInfo: true, roomType: ccserver.roomInfo.roomType, isSelf: false, roomFlag: this._roomInfo.roomFlag };
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


        // if(!ccserver.isMatch) {
        //     this.labWaiting.visible = true;
        // }
        ccserver.playing = false;
        this.buttonBar.switchState('hidden');
        this._showReadyBtn(false);
        this.btnHang.enabled = false;
        this.labWaiting.visible = false;
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
        this._stopChangeEffect();
        this._hideGameEndGetInfo();
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
        if (CCDDZMainLogic.instance.selfData.hasRecorder()) {
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
        if (cards && CCDDZMainLogic.instance.selfData.hasRecorder()) {
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
        if (cardsNum && cardsNum.length == 15 && CCDDZMainLogic.instance.selfData.hasRecorder()) {
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
        this._seats.forEach((seat: CCDDZDDZSeat) => {
            seat.reset();
            seat.setReady(false);
        });

        this._clearRecorderInfo(0);
        for (let i = 0; i < 3; i++) {
            this['labChange' + i].visible = false;
        }
        ccserver.playing = true;
        this._showReadyBtn(false);
        this.btnHang.selected = false;
        this.btnHang.enabled = true;
        this.cdProgressBar.stop();

        this.masterCards.initData();

        if (ccserver.roomInfo && ccserver.roomInfo.baseScore) {
            this.masterCards.updateScore(ccserver.roomInfo.baseScore || 0, 1);
        }

        CCalien.CCDDZPopUpManager.instance.removeAllPupUp();

        if (ccserver.isMatch) {
            CCDDZPanelMatchWaitingInner.instance.close();
        }
        egret.clearTimeout(this._timerClean);
        if (this._showResultTimeOutId)
            egret.clearTimeout(this._showResultTimeOutId)
        if (this._showResultTimeOutId1)
            egret.clearTimeout(this._showResultTimeOutId1)

        if (ccserver.isMatch) {
            CCDDZMainLogic.instance.alms();
        }

        if (!ccserver.isMatch && !ccserver.isPersonalGame) {
            this.initGuessCardsView();
        }
    }

    private getRedCoinLackCnt(): any {
        let _mainIns = CCDDZMainLogic.instance;
        let _needWinCnt = _mainIns.selfData.getRoomNeedWinCntGetRed(this._roomInfo.roomID);
        return _needWinCnt;
    }

    private testFunction(): void {
        // var cardids = [30,31,32,40,41,42,50,51,52,60,70,71]

        // var cardids = [30,31,32,40,41,42,50,51,52,130,131,132]
        // this._mySeat.addCards([140,150,130,131,100,101,102])
        // var xx = this._mySeat.checkType(cardids);
        // console.log(xx);

        //  if(CCGlobalGameConfig.testcards && CCGlobalGameConfig.testcards.length == 54){
        //            ccserver.setCards(CCGlobalGameConfig.testcards);
        //            return;
        //        }

        this.recorderBubble.visible = true
        this.recorderBubble.source = 'cc_play_recorder_gift';
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
     * 提示再过多久或是在玩几局就可以抽奖杯
     */
    private _showPlayGameGetCoin(): void {
        let sText: string = "";
        let info = this._getNeedPlayInfo();
        if (this._roomInfo.roomFlag == 1 || this._roomInfo.rewardwinround) {
            //if(this._roomInfo.roomID == 1001){
            if (ccserver.playing) {
                sText = CCalien.StringUtils.format(lang.backAlert, this.getRedCoinLackCnt());
            } else {
                sText = "您确定要退出游戏？"
            }
            /*}else{
                let sPre =  "再赢" + info + "局即可获得奖杯";;
                if(ccserver.playing){
                    sText = sPre + "现在退出房间将为您托管游戏。";
                }else{
                    sText = sPre + "您确定要退出游戏？"
                }
            }*/
        } else if (this._roomInfo.roomFlag == 2) {
            let sPre = "再玩" + info + "局即可获得奖杯";
            if (info <= 0) {
                sPre = "本局结束即可获得奖杯";
            }

            if (ccserver.playing) {
                sText = sPre + ",现在退出房间将为您托管游戏。";
            } else {
                sText = sPre + ",您确定要退出游戏？"
            }
        }

        CCDDZAlert.show(sText, 1, this.onAlertResult.bind(this, 0));
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
                // CCDDZPanelSetting.instance.show();
                this.test();
                break;
            case 'hang':
                ccserver.hang(this.btnHang.selected);
                break;
            case 'lottery':
                CCDDZPanelLottery.instance.show();
                break;
            case 'recorder':
                // this._mySeat.grpRecorder.visible = !this._mySeat.grpRecorder.visible
                this.switchRecorder(null);
                break;
            case 'back':
                if (ccserver.isMatch) {
                    CCDDZAlert.show(lang.match_cancel_alert, 1, this.onAlertResult.bind(this, 2));
                } else if (this.isPersonalGame) {
                    CCDDZAlert.show('确认离开房间？', 1, this.onAlertResult.bind(this, 2));
                } else {
                    this._showPlayGameGetCoin();
                } /*if(ccserver.playing) {
                    if(this._roomInfo.roomID ==  1000 || this._roomInfo.roomID ==  1004){
                        CCDDZAlert.show("本局结束即可获得奖杯,现在退出将为您托管游戏", 1, this.onAlertResult.bind(this,0));
                    }                    
                    else{
                        CCDDZAlert.show(CCalien.StringUtils.format(lang.backAlert, this.getRedCoinLackCnt()), 1, this.onAlertResult.bind(this,0));
                    }
                } else {

                    if(this._roomInfo.roomFlag == 1){
                        CCDDZAlert.show("游戏未结束,现在退出将为您托管游戏", 1, this.onAlertResult.bind(this,0));
                    }                    
                    else{
                        CCDDZAlert.show(CCalien.StringUtils.format(lang.backAlert1, this.getRedCoinLackCnt()), 1, this.onAlertResult.bind(this,0));
                    }
                }*/
                break;
            case 'continue':
                this._onClickReady();
                break;
        }
    }


    private sendQuickJoin(flag: number = 0): void {
        //console.log("sendQuickJoin--->",arguments.callee.caller);

        this._onSendQuickJoin();
        //极速场和金豆赢一局抽奖券不延迟
        if (this._roomInfo && (this._roomInfo.roomID == 1000 || this._roomInfo.roomID == 1004) ||
            (this._roomInfo.style && (this._roomInfo.style == 'diamond' || this._roomInfo.style == 'queue')) || this._roomInfo.roomID == 1004) {
            ccserver.quickJoin(flag);
            return;
        }

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
            ccserver.quickJoin(flag);
        }, this, d);
    }

    private test(): void {
        // this.showDragonChunTian();
        // this.showDragonFeiJi();
        // this.showDragonMyLianDui();
        // this.showDragonRightLianDui();
        // this.showDragonLeftLianDui();
        // this.showDragonMyShunZi();
        // this.showDragonLeftShunZi();
        // this.showDragonRightShunZi();
        // this.showDragonWangZha();
        // this.showDragonZhaDan();     
        // if (!this.dragonHongBao.parent) {
        //     this.addChild(this.dragonHongBao);
        // }                
        // this.dragonHongBao.play1(false);

        // if(!this.dragonHongBaoWarn) {
        //     this.dragonHongBaoWarn = new CCDDZDragonHongBaoWarn();
        // }

        // if (!this.dragonHongBaoWarn.parent) {
        //     this.addChild(this.dragonHongBaoWarn);
        // }                
        // this.dragonHongBaoWarn.play2();

        // this._mySeat.showJingDeng();
        // this.seat1.showJingDeng();
        // this.seat2.showJingDeng();     
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
                ccserver.useCardNtf([]);
                this._mySeat.cancelSelect();
                break;
            case 'use':
                let pokerIds: number[] = this._mySeat.getSelectPokerIds();
                ccserver.useCardNtf(pokerIds);
                break;
            case 'setScore':
                ccserver.answerMaster(event.data.score);
                this.buttonBar.switchState('hidden');
                break;
            case 'help':
                if (!this._mySeat.help()) {
                    ccserver.useCardNtf([]);
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
            //console.log(event.data);
            this._selectCardsCount = event.data.count;
        }
        if (this.buttonBar.currentState == 'useCard') {
            //console.log(this._selectCardsCount);
            this.buttonBar.modifyButton('cancelSelect', this._selectCardsCount > 0);
        }
        if (event) {
            this._canUse = event.data.canUse;
        }
        if (this.buttonBar.currentState == 'useCard') {
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
                //ccserver.giveUpGame();
                CCDDZMainLogic.backToRoomScene();
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
        //console.log("onAlertResult=======================>",type,action);
        switch (action) {
            case 'confirm':
                switch (type) {
                    case 0:
                        if (!ccserver.isMatch && !ccserver.isPersonalGame) {
                            if (!ccserver.playing) {
                                if (this._roomInfo.style && (this._roomInfo.style == 'diamond' || this._roomInfo.style == 'queue')) {
                                    ccserver.QuitWaitingQueueReq();
                                } else {
                                    ccserver.giveUpGame();
                                }
                            }
                        }
                        CCDDZMainLogic.backToRoomScene();

                        break;
                    case 1:
                        if (!ccserver.isMatch && !ccserver.isPersonalGame) {
                            this.sendQuickJoin();
                            this.initData();
                        }
                        break;
                    case 2:
                        if (this.isPersonalGame) {
                            ccserver.QuitPGameReq(this.roomid);
                        } else if (ccserver.isMatch) {
                            //never giveup match
                            if (this._roomInfo.matchId == 100) {

                            } else {
                                //ccserver.giveUpMatch(ccserver.roomInfo.matchId);
                            }
                        } else if (ccserver.playing) {
                            ccserver.giveUpGame();
                        } else {

                        }
                        CCDDZMainLogic.backToRoomScene();
                        break;
                    case 3:
                        CCDDZPanelExchange2.instance.show();
                        break;
                    case 4:
                        CCDDZMainLogic.backToRoomScene();
                        break;
                }
                break;
            case 'cancel':

                break;
        }
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
                CCDDZPanelMatchRevive.remove();
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
                CCDDZAlert.show(_showStr, 0, function () {
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
                // CCDDZAlert.show(lang.noMoreGold,0,this.onAlertResult.bind(this,0));
                /*if(this._roomInfo.roomID == 1000){ //极速场钻石不足
                    CCDDZMainLogic.instance.noDiamondGetNewDiamondRewOrBuyRevive(this._roomInfo.minScore);
                    return;
                }
                else{
                    CCDDZPanelRechargeTips.instance.show(this.onAlertResult.bind(this,0));
                    if(!ccserver.playing){
                        if(this._isInGuessTime()){
                            this._showNextMasterCardGuessBtn(true);
                        }
                        this._showReadyBtn(true);
                    }
                }*/

                CCDDZMainLogic.instance.enterGameItemNotEnough(this._roomInfo);
                break;
            case 3:
                CCDDZAlert.show(lang.no_more_desk, 0, this.onAlertResult.bind(this, 0));
                break;
            case 4:
                console.log('join failed.');
                break;
            case 7:
                // console.log('join failed.');
                CCDDZAlert.show('拥有金豆超过房间上限', 0, () => {
                    CCDDZMainLogic.backToRoomScene();
                });
                break;
        }
    }

    private hideDeskCards(): void {
        this._seats.forEach((seat: CCDDZDDZSeat) => {
            seat.cleanDesk();
        });
    }

    private onReconnectTableRep(event: egret.Event): void {
        let data = event.data;
        if (data.result != 0) {
            if (data.result == 1 || data.result == 2)//如果不是比赛，并且游戏没有开始
            {
                CCDDZMainLogic.backToRoomScene();
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
                CCDDZMainLogic.backToRoomScene({ roomInfo: this._roomInfo });
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
        let _myData = CCDDZMainLogic.instance.selfData;
        // 表情免费次数
        if (data.uid == _myData.uid && data.gameprop >= 0) {
            _myData.setFreeBrowCount(data.gameprop);
        }
        //        data.imageid ="/uploads/avatar/tax465.jpg";
        let seat: CCDDZDDZSeat = this.getSeatByUId(data.uid);
        if (seat) {
            if (data.offline) {
                seat.setUserOffline(true);
            } else {
                seat.setUserOffline(false);
            }

            if (data.praise && data.praise.length >= 5) {
                seat.userInfoData.initPraise(data.praise);
            }
            if (this._roomInfo.roomFlag == 2) { //红包场要用此字段显示钻石不要刷新背包
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
            }
            else if (ccserver.isMatch) {
                data.nickname = '参赛玩家'
                if (seat.isMaster) {
                    data.imageid = 'cc_icon_head9'
                } else {
                    data.imageid = 'cc_icon_head10'
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
        } else if (!ccserver.isMatch && !this.isPersonalGame) {
            this.setRedCoin();
            this.setBeforeWincnt();
        }

        //zhu 
        if (data.cardsrecorderremain && CCDDZMainLogic.instance.selfData.cardsRecorder) {
            CCDDZMainLogic.instance.selfData.cardsRecorder[6] = data.cardsrecorderremain;
            this.refreshCardsRecorderAbout();
        }
        this._showNextMasterCardGuessBtn(false);
        this.setlabWaiting(null);
        if (this._roomInfo.roomFlag == 1) {
            let fMoney = ((data.rewardpool || 0) / 100).toFixed(2);
            this["hasRedNum"] = parseFloat(fMoney);
            this._setNewRedHasNum();
        }
    }

    /**
     * 检查是否需要弹出极速场规则，如果需要则弹出
     */
    private _shouldTipRedNormalRule() {
        let _hasTip = CCalien.CCDDZlocalStorage.getItem("redNormalRule");
        if (_hasTip != "1") {
            this._showRedNormalRule();
            CCalien.CCDDZlocalStorage.setItem("redNormalRule", "1");
        }
    }

    /**
     * 检查是否需要弹出金豆大师场规则，如果需要则弹出
     */
    private _shouldTipGoldRedRule() {
        let _hasTip = CCalien.CCDDZlocalStorage.getItem("goldRule");
        if (_hasTip != "1") {
            this._showRedNormalRule();
            CCalien.CCDDZlocalStorage.setItem("goldRule", "1");
        }
    }

    private setRedCoin(): void {
        if (CCDDZMainLogic.instance.selfData.freshmanredcoinsent != 1) {
            var hasShow: string = CCalien.CCDDZlocalStorage.getItem("freshmanredcoinsent");
            if (hasShow == "1")
                this.showRedcoinDragon(false);
            else {
                //极速场不提示新手王炸红包
                if (this._roomInfo.roomID != 1000) {
                    //ccserver.startCache();
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

        console.log("onReconnectRep----------", data, this._roomInfo, this.currentState);
        this._reconnectIn = true;

        this.beforeGameStart();

        this.playersSeatDown(data.players);

        //todo 重连要处理的代码
        this._mySeat.addCards(data.params1, !this._reconnectIn);

        data.players.forEach((player: any) => {
            let seat: CCDDZDDZSeat = this.getSeatById(player.seatid);
            seat.setHang(player.params[1] == 1);
            if (ccserver.isMatch) {
                let info: any = {
                    imageid: 'cc_icon_head10',
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
            if (this._mySeat != seat) {
                //console.log('%s有%d张牌', seat.userInfoData.uid, player.params[0]);                
                if (ccserver.isCoupleGame) {
                    let cardids = [];
                    for (var i = 0; i < player.params[0]; i++) {
                        cardids.push(0);
                    }
                    if (data.mastersid != null && data.mastersid >= 0 && data.mastersid == seat.seatid) {
                        (<CCDDZSideSeat>seat).setMaster(false, false);
                    }
                    (<CCDDZSideSeat>seat).addCards(cardids);
                }
                else {
                    (<CCDDZSideSeat>seat).setCardCount(player.params[0]);
                }
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

        if (!ccserver.isMatch && !this.isPersonalGame) {
            this.setBeforeWincnt();
            this.setRedCoin();
        }
        ccserver.hang(false);

        if (data.params3) {
            let isMaster = false;
            if (this._mySeat.seatid == data.mastersid) {
                isMaster = true;
            }
            this.setGiveWayScore(data.params3[0], data.mastersid, isMaster);
            // for(var i = 0; i < data.params3.length; ++i){
            //     if(data.params3[i]){
            //         this.setGCGold(i, data.params3[i])
            //     }
            // }             
        }
        if (data.params4) {
            if (this._roomInfo.roomID == 8001) {
                for (var i = 0; i < data.params4.length; ++i) {
                    if (data.params4[i]) {
                        this.setGCGold(i, data.params4[i])
                    }
                }
            }
            else {
                this._setRecorderInfoByServerNum(data.params4);
            }
        }

        this.autoOpenRecorder();
        CCDDZBagService.instance.refreshBagInfo();
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
                    _cardType = _seat.useCard(_cardids, false, false, true);
                }
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
    }

    private showMasterCards(cards: number[], reconnect: boolean): void {
        this.masterCards.showCards(cards, reconnect);

        this._seats.forEach((seat: CCDDZDDZSeat) => {
            seat.hideScore();
        });
    }

	/**
	 * 全部玩家就坐
	 * @param players
	 */
    private playersSeatDown(players: any[]): void {
        players.some((player: any) => {
            if (player.uid == ccserver.uid) {
                ccserver.seatid = player.seatid;
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

        if (ccserver.isMatch) {
            this.updateMathTurnInfo();
        }
    }

	/**
	 * 更新桌面信息
	 * @param event
		message CCDDZTableInfo {
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
        if (ccserver.isPersonalGame) {
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

        if (data.uid == ccserver.uid) {
            switch (data.reason) {
                case 0:
                case 1:
                case 2:
                case 3:
                    if (!ccserver.isMatch && !ccserver.isPersonalGame) {
                        this.playerStandUp(data.uid);
                    }
                    break;
                case 4:
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

        let seat: CCDDZDDZSeat = this.getSeatById(data.seatid);
        if (seat.userInfoData.uid == ccserver.uid) {
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
            if (this._roomInfo.minPlayer == 3 || ccserver.isMatch || ccserver.isPersonalGame) {
                this.buttonBar.switchState('askMaster', data.score);
            } else {
                this.buttonBar.switchState('grap', data.score);
            }
        } else {
            this.buttonBar.switchState('hidden');
        }

        if (this.isCoupleGame) {
            this.setGiveWayScore(data.score, data.seatid, false);
        }
        let seat: CCDDZDDZSeat = this.getSeatById(data.seatid);
        //zhu 加上空处理
        if (seat) {
            seat.startCD(data.time || 1);
        }
    }

    private setGiveWayScore(score, masterSeatid, isMaster): void {
        //console.log("setGiveWayScore------------>",masterSeatid,ccserver.seatid);

        if (isMaster) {
            let graySeat: CCDDZDDZSeat;
            let normalSeat: CCDDZDDZSeat;
            if (masterSeatid == ccserver.seatid) {
                graySeat = this.seat1;
                normalSeat = this._mySeat;
            } else {
                graySeat = this._mySeat;
                normalSeat = this.seat1;
            }
            normalSeat.setGrayCardsNum(0);
            graySeat.setGrayCardsNum(score);
        }
        else {
            this.seat1.setGrayCardsNum(score);
            this._mySeat.setGrayCardsNum(score);
        }

        if (!score) {
            score = 0;
        }

        this["lblGiveWay"].text = score;
        this["lblGiveWayDes"].textFlow = (new egret.HtmlTextParser).parse("农民手牌" + "<font color='#FFFF00'>≤</font>" + score + "胜");
    }

    private autoOpenRecorder(): void {
        if (ccserver.isCoupleGame) {
            this._showRecorder(false);
            return;
        }
        var opencardsrecorder = egret.localStorage.getItem("opencardsrecorder");
        var userInfoData: CCGlobalUserInfoData = CCDDZMainLogic.instance.selfData;
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
        let seat: CCDDZDDZSeat = this.getSeatById(data.seatid);
        if (!seat) return;

        if (data.ismaster) {
            seat.setMaster(data.ismaster, !this._reconnectIn);
            if (ccserver.isMatch) {
                data.imageid = 'cc_icon_head9';
                data.nickname = '参赛玩家';
                if (seat == this._mySeat) {
                    data.uid = CCDDZMainLogic.instance.selfData.uid;
                }
                seat.userInfoView.update(data);
            }
            if (this.isCoupleGame) {
                this.setGiveWayScore(data.score, data.seatid, data.ismaster);
            }
            this.autoOpenRecorder();
        } else if (this._mySeat.seatid == data.seatid) {
            this.buttonBar.switchState('hidden');
        }

        if (data.score > 0) {
            let _def = this._roomInfo.defaultOdds;
            let _multi = data.score;
            if (_def) {
                _multi = data.score * _def;
            }
            this.masterCards.updateMultiple(_multi);
        }

        //if (!this._reconnectIn) {
        seat.stopCD();
        if (ccserver.isCoupleGame == true) {
            if (!data.ismaster) {
                seat.showGrab(data.score);
            }
        }
        else {
            seat.showScore(data.ismaster ? -1 : data.score);
        }

        //}

        //1000 = 极速场
        if (data.ismaster && (!ccserver.isPersonalGame) && (!ccserver.isMatch) && this._roomInfo.roomID == 1001) {//只有3人休闲场才可以钻石加倍
            if (this._roomInfo.doublediamond < 1) { //加倍不消耗钻石则不开启加倍
                this._showDoubleNoDouble(false);
                return;
            }

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
        let data: any = event.data;
        if (ccserver.isMatch && data.reshufflecnt && data.reshufflecnt > 0) {
            for (var i = 0; i < 3; ++i) {
                let seat: CCDDZDDZSeat = this.getSeatById(i + 1);
                seat.updateGold(-100, ccserver.isMatch);
            }
        }
        this._mySeat.cancelSelect();
        this._setRecorderInfoByServerCard(data.cardids);
        if (ccserver.playing) {
            this.addCard(data);
        } else {
            this._cache.splice(0);
            this._cache.push({ method: this.addCard.bind(this, data) });
        }
    }

    private addCard(data: any): void {
        let seat: CCDDZDDZSeat = this.getSeatById(data.seatid);
        seat.cleanHand();
        seat.addCards(data.cardids, true, true);
        this['seat' + 1].cleanHand();
        this['seat' + 2].cleanHand();

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

        let seat: CCDDZDDZSeat = this.getSeatById(data.seatid);
        let _cardType: number = -1;

        //刚刚出的牌
        if (seat) {
            seat.cleanDesk();
            _cardType = seat.useCard(data.cardids);
            seat.stopCD();
        }

        /* if(data.lastseatid) {
             if(ccserver.isCoupleGame && data.lastcards) {
                 let lastSeat: CCDDZDDZSeat = this.getSeatById(data.lastseatid);
                 if(this._mySeat.seatid != data.lastseatid) {
                     lastSeat.cleanDesk();
                     console.log("data.lastcards" + data.lastcards)
                     lastSeat.useHandCards(data.lastcards);
                 }                
             }            
         }
         */

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

        let seat: CCDDZDDZSeat = this.getSeatById(data.seatid);
        //seat.cleanDesk();
        if (!seat) return;
        if (data.seatid != ccserver.seatid) {
            if (ccserver.isCoupleGame) {
                seat.showHandCards(data.cardids);
            } else {
                seat.useCard(data.cardids, true);
            }
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
        this._mySeat.userInfoView.updateGold(CCDDZMainLogic.instance.selfData.gold);
        // this['GCGold' + index].text = 'x' + cnt;// * this._roomInfo.ba;
    }

    private hideGuessRight(): void {
        this.grpGuessRight.visible = false;
        this.grpGRLight.visible = false;
    }

    private goldfly(cseat: CCDDZDDZSeat, cx: any, cy: any, tx: any, ty: any): void {
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
        } else {
            var cp = this.localToGlobal(this.masterCards.x + this.masterCards.width * 0.5, this.masterCards.y + this.masterCards.height * 0.5);
            this.goldfly(cseat, cp.x, cp.y, tpos.x, tpos.y);
        }

        if (cseat) {
            if (cseat != this._mySeat) {
                cseat.playWinGoldAnimate();

                //极速场不更新金豆
                if (this._roomInfo && this._roomInfo.roomID != 1000 && !ccserver.isMatch) {
                    cseat.updateGold(gold);
                }
            }
            else {
                if (!ccserver.isMatch) { //不是比赛才加，比赛显示的是积分
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
                let cfg = CCGlobalGameConfig.getBrowCfgById(browId);
                if (cfg && cfg.currency == 0 && cfg.price && fromSeatId == this._mySeat.seatid) { //判断是否不是我自己发送表情
                    //表情的免费次数
                    let _nFree: number = CCDDZMainLogic.instance.selfData.getFreeBrowCount();
                    if (_nFree > 0) {
                        CCDDZMainLogic.instance.selfData.addFreeBrowCount(-1);
                    }
                    else {
                        //比赛场不扣积分
                        if (!ccserver.isMatch) {
                            this._mySeat.updateGold(-cfg.price, ccserver.isMatch);
                        }
                    }
                }

                this._onPlayBrowInfo(fromSeatId, toSeatId, browId);
            }
        }
        else if (data.result == 3) { //金豆不足
            CCDDZImgToast.instance.show(this, lang.browNoGold);
            CCDDZImgToast.instance.enableTouch(false);
        }
        else {
            CCDDZLogUtil.info("_onServerBrowRep------------->error", data.result);
        }
    }
    /**
     * 获取分享奖励领取成功
     */
    private _showGetDayShareRewSucc(): void {
        let _gameCfg = CCGlobalGameConfig;
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

        CCDDZShareImageManager.instance.stop(true, _info);
    }

    /**
     * 非游戏过程中的操作（猜牌等）
     */
    private onUserOperateRep(event: egret.Event): void {
        let data = event.data;
        if (data.optype == 3) {
            if (data.result != null) {
                // CCDDZAlert.show('押注错误编号:'+data.result);
                CCDDZImgToast.instance.show(this, lang.guessCardsNotice[data.result - 1]);
            } else {
                this.setGCGold(data.params[0] - 1, this._roomInfo.guessbet);
            }
        }
        else if (data.optype == 2) { //分享成功奖励
            // this._showGetDayShareRewSucc();
        }
        else if (data.optype == 7) { //每日福袋
            if (data.result == null) {
                let _str = CCDDZUtils.parseGoodsString(data.str);
                let _text = CCDDZUtils.goodsListToString(_str);
                CCDDZAlert.show(_text);
            }
        } else if (data.optype == 13) { //掉落的5张牌
            if (!this["showFiveRew"]) {
                this["fiveCardDatas"] = null;
                this._initFiveCard(data);
            } else {
                this["fiveCardDatas"] = data;
            }
        } else if (data.optype == 14) { //五张牌领奖励
            if (data.result == 2) {
                CCDDZMainLogic.instance.selfData.setHasPayToday(0);
                this._showFiveOpenCard(true);
                this._showNotPayTodayForGetFiveRew();
            }
            else if ((data.result == 0 || data.result == null) && data.str) {
                let _items = CCDDZUtils.parseGoodsString(data.str);
                this._showFiveCardReward(true, _items);
                this._openFiveCard({ 2: 1, 3: 1 });
                this["showFiveRew"] = true;

                this._clearFiveRewardTimeout();
                this.fiveRewGetTimeout = egret.setTimeout(() => {
                    this["showFiveRew"] = false;
                    this._onGetFiveRewOver();
                }, this, 3000);
            }
        }
    }

    /**
     * 清除5张牌的奖励倒计时
     */
    private _clearFiveRewardTimeout(): void {
        if (this.fiveRewGetTimeout) {
            egret.clearTimeout(this.fiveRewGetTimeout);
        }
        this.fiveRewGetTimeout = null;
    }
    /**
     * 显示领取五张牌奖励完毕
     */
    private _onGetFiveRewOver(): void {
        this._clearFiveRewAndCards();
        let _data = this["fiveCardDatas"];
        if (_data) {
            this._initFiveCard(_data);
        }
        this["fiveCardDatas"] = null;
    }

    /**
     * 显示默认的集牌赢奖励
     */
    private _showFiveDefault(bShow: boolean): void {
        this["fiveLabel"].visible = bShow;
    }

    /**
     * 显示点击翻牌赢奖励 
     */
    private _showFiveOpenCard(bShow: boolean): void {
        this["openFiveImg"].visible = bShow;
    }

    /**
     * 掉落的5张牌 params[1] roomid ..N张牌   str 获得的奖励 result 获得的新牌
     */
    private _initFiveCard(data: any): void {
        if (data.params && data.params.length >= 2) {
            let _roomId = data.params[0];
            let _todayPayRmb = data.params[1];
            CCDDZMainLogic.instance.selfData.setHasPayToday(_todayPayRmb);

            if (_roomId != this._roomInfo.roomID) return;
            let _cardS = data.params.slice(2);
            if (!_cardS) {
                _cardS = [];
            }

            if (data.result != null) { //没有新牌
                _cardS.push(data.result);
                //this._showNewDropCard(data.result,_cardS);
            } else {
                //this._updateFiveCardView(_cardS);
            }

            this._updateFiveCardView(_cardS, { 2: 1, 3: 1 });
            /*
            if(data.str){
                let _items = CCDDZUtils.parseGoodsString(data.str);
                this._showFiveCardReward(true,_items);
            }
            */
        }
    }

    /**
     * 显示掉落的牌
     */
    private _showNewDropCard(pokerId: number, cards: any): void {
        let idx = cards.length - 1;
        let proxy = CCalien.CCDDZStageProxy;
        let w = proxy.width;
        let h = proxy.height;
        let card: CCDDZCard = CCDDZCard.create({ pid: 0 });
        card.x = (w - card.width) * 0.5;
        card.y = (h - card.height) * 0.5;
        card.pokerId = pokerId;
        card.showFront(false);
        this.addChild(card);
        let _pos: egret.Point = this["fiveCardContainer"].localToGlobal(idx * 45, 4);

        egret.Tween.get(card).to({ scaleX: 1.2, scaleY: 1.2 }, 50).wait(1000).to({ x: _pos.x, y: _pos.y, scaleX: 0.3, scaleY: 0.3 }, 400).call(() => {
            this.removeChild(card);
            this._updateFiveCardView(cards, { 2: 1, 3: 1 });
        })
    }

    /**
     * 显示五张牌
     * backCard:显示牌的背面
     */
    private _updateFiveCardView(cards: any, backCard: any = null): void {
        let _cards = cards;
        let _len = _cards.length;
        if (_len >= 1) {
            this._showFiveDefault(false);
            if (_len == 5) {
                this._showFiveOpenCard(true);
            } else {
                this._showFiveOpenCard(false);
            }
        } else {
            this._showFiveDefault(true);
            this._showFiveCardReward(false);
            this._showFiveOpenCard(false);
        }

        this["fiveCardContainer"].removeChildren();
        if (_len >= 4) {
            let _newArr = [0, 0, 0, 0, 0];
            let _first = Math.floor(cards[0] / 10);
            let _second = Math.floor(cards[1] / 10);
            if (_first == _second) {
                _newArr[0] = cards[0];
                _newArr[3] = cards[1];
                _newArr[1] = cards[2];
                _newArr[2] = cards[3];
                _cards = _newArr;
            }

            if (_len == 5) {
                if (_first == _second) {
                    _newArr[0] = cards[0];
                    _newArr[3] = cards[1];
                    _newArr[4] = cards[2];
                    _newArr[1] = cards[3];
                    _newArr[2] = cards[4];
                    _cards = _newArr;
                }
            }
        }

        for (let i = 0; i < _len; ++i) {
            let card: CCDDZCard = CCDDZCard.create({ pid: 0 });
            card.scaleX = card.scaleY = 0.3;
            card.x = i * 45;
            card.y = 4;
            card.pokerId = _cards[i];
            if (backCard && backCard[i + 1]) {
                card.showBack();
            } else {
                card.showFront(false);
            }
            this["fiveCardContainer"].addChild(card);
        }
    }

    /**
     * 清空5张牌
     */
    private _clearFiveCardView(): void {
        this["fiveCardContainer"].removeChildren();
        this._showFiveDefault(true);
        this._showFiveOpenCard(false);
    }

    /**
     * 清除掉落牌型奖励和牌型
     */
    private _clearFiveRewAndCards(): void {
        if (this["fiveRewLabel"].visible) {
            this._showFiveCardReward(false);
            this._clearFiveCardView();
        }
    }

    /**
     * 显示五张牌的奖励
     */
    private _showFiveCardReward(bShow: boolean, rews: any = null): void {
        let _label = this["fiveRewLabel"];
        _label.visible = bShow;
        egret.Tween.removeTweens(_label);
        if (!rews || rews.length < 1) return;
        if (bShow) {
            let _srcY = -24;
            _label.text = "+" + CCDDZUtils.goodsListToString(rews, 0, true);
            egret.Tween.get(_label).set({ y: _srcY }).to({ y: _srcY - 20 }, 500).wait(500).call(() => {
                //_label.visible = false;
                //this._clearFiveCardView();
            });
        }
    }

    /**
     * 显示5张牌
     */
    private _openFiveCard(data: any): void {
        for (let i = 0; i < 5; ++i) {
            let _card: CCDDZCard = this["fiveCardContainer"].getChildAt(i);
            if (data[i + 1]) {
                _card.showFront(true);
            } else {
                _card.showFront(false);
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
            this.beforerecorderTime = CCDDZMainLogic.instance.selfData.cardsRecorder[6];
            if (data.params) {
                this._showRecorder(true);
                this._setRecorderInfoByServerNum(data.params);
            }
        }
        else if (data.optype == 7) { //加倍 不加倍服务器回调
            this._onServerDoubleRep(data);
        } else if (data.optype == 8) { //赞或者是踩 1:赞 0:踩
            if ((data.result == 0 || data.result == null) && data.params && data.params.length >= 2) {
                let _seatId = data.params[0];
                let _op = data.params[1];
                let seat: CCDDZDDZSeat = this.getSeatById(_seatId);
                if (!seat) return;
                let _data = seat.userInfoData;
                let _coolNum = _data.praise[0];
                let _shitNum = _data.praise[1];
                if (_op == 0) {
                    _data.praise[1] += 1;
                } else {
                    _data.praise[0] += 1;
                }
                _data.praise[_seatId + 1] = _op;
                CCDDZPanelPlayerInfo.onPraise(_seatId, _op);
            }
        }
        else {
            let optype: number = data.optype || 0;
            let seat: CCDDZDDZSeat = this.getSeatById(data.seatid);
            if (!seat) return;

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
        this.guessCardsType.source = 'cc_guesscards_' + (925 + ct);
        this.gcardtype.source = 'cc_guesscards_' + (925 + ct);
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
        let seat: CCDDZDDZSeat = this.getSeatById(data.seatid);

        if (ccserver.playing) {
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
        let seat: CCDDZDDZSeat = this.getSeatById(data.seatid);
        if (!seat) return;

        seat.cleanDesk();
        let timeout: number = data.time;
        if (this._mySeat.seatid == data.seatid) {
            //当前出牌和上一手出牌都是我，或者是我是本轮第一个出牌的
            if (data.seatid == data.pseatid || data.pseatid == 0) {
                this.buttonBar.switchState('useCard');
                this.buttonBar.modifyButton('pass', false);
                this.buttonBar.modifyButton('help', false);
                this._mySeat.checkType([]);
            }
            else {
                let canUse: boolean = this._mySeat.checkType(data.cardids);
                if (!canUse)
                    this.buttonBar.switchState('pass');
                else
                    this.buttonBar.switchState('useCard');
                this.buttonBar.modifyButton('pass', true);
                this.buttonBar.modifyButton('help', true);

                if (!canUse) {  //如果没有可出的牌,倒计时变为5秒
                    if (timeout > 5) {
                        timeout = 5;
                    }

                    if (cardType == CCDDZSHUANGWANG) { //王炸时倒计时变为2秒
                        if (timeout > 1) {
                            timeout = 1;
                        }
                    }
                    this._mySeat.showNoMatchCards(timeout * 1000);
                }
            }

            //this.onUpdateUseButtonState();
            this.onSelectCards();
            this._mySeat.checkCanUse();
        }
        if (timeout > 0) {
            seat.startCD(timeout, this.onCDComplete.bind(this, data.time > timeout));
        }
    }

    private onCDComplete(isFakeTimeout: boolean): void {
        //console.log('isFakeTimeout:', isFakeTimeout);
        if (isFakeTimeout) {
            ccserver.useCardNtf([]);
            this._mySeat.cancelSelect();
        }
    }

    private onPanelMatchResultClose(): void {
        if (CCalien.CCDDZSceneManager.instance.currentSceneName != CCGlobalSceneNames.ROOM) {
            CCalien.CCDDZSceneManager.show(CCGlobalSceneNames.ROOM, null, CCalien.CCDDZsceneEffect.CCDDFade, null, null, false, CCGlobalSceneNames.LOADING);
        }
    }

    //显示比赛的结果 返回值确定是否展示了比赛结果界面
    private _showMatchResult(data: any): boolean {
        let _bShow = false;
        if (CCDDZSceneManager.instance.currentSceneName == CCGlobalSceneNames.PLAY &&
            data.matchid == this._roomInfo.matchId &&
            data.params[0] > 0 && this._roomInfo.matchType != 6) {  //有名次才显示结算界面并且不是钻石赛
            if (data.params[1] && data.params[1] > 0) {
                CCDDZMatchService.instance.updateScoreGetOut(data.matchid, data.params[1]);
                this.updateMathTurnInfo();
            }
            CCDDZPanelMatchResult.instance.show(data, this.onPanelMatchResultClose.bind(this));
            CCDDZBagService.instance.refreshBagInfo();    //涉及到物品奖励,需要更新背包
            _bShow = true;
        }

        CCDDZMatchService.instance.onMatchEndCheckRemoveMatchInfoNtf(data);
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
                if (ccserver.isMatch && ccserver.roomInfo.matchType == 6) { //钻石赛
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
        let match: CCDDZMatchService = CCDDZMatchService.instance;
        let matchMode: number = match.currentMatchMode;

        let turnName: string = this._roomInfo.stage.length == 1 ? '' : lang.match_turn_name[matchMode - 1];
        if (matchMode == 3) { //新模式特殊处理
            turnName = lang.match_turn_name[0];
        }

        let content: string;
        switch (matchMode) {
            case 1://打立出局
                if (!match.scoreGetOut || match.scoreGetOut == undefined) return;
                content = lang.format(lang.id.match_top_info_1, match.currentPlay, CCDDZUtils.currencyRatio(match.scoreGetOut));
                break;
            case 2://瑞士位移
                if (match.countPromote == 0) {  //总决赛
                    turnName = lang.match_turn_name[2];
                    content = lang.format(lang.id.match_top_info_3, match.currentPlay);
                } else {  //普通决赛
                    if (isNaN(match.currentTurn)) {
                        match.currentTurn = 1;
                    }
                    content = lang.format(lang.id.match_top_info_2, match.currentTurn, match.currentPlay, match.countPromote);
                }
                break;
            case 3://新模式
                if (!match.scoreGetOut || match.scoreGetOut == undefined) return;
                content = lang.format(lang.id.match_top_info_1, match.currentPlay, CCDDZUtils.currencyRatio(match.scoreGetOut));
                break;
        }

        this.labMatchInfo.text = turnName + ' ' + content;
    }

    /**
     * 播放完加减分动画后更新金豆或者是钻石或者是比赛积分
     */
    private _changeEffectEnd(seat: CCDDZDDZSeat, change: number, kb: number): void {
        //console.log("_changeEffectEnd--------------->",change,kb,seat);
        if (this._roomInfo.roomFlag == 2) {
            if (seat != this._mySeat) { //不是自己才刷新，自己的钻石服务器会主动推
                seat.updateRednormalGold(change);
            }
            else {
                //seat.updateRednormalGold(change,true);
            }
        }
        else {
            if (seat)
                seat.updateGold(change, ccserver.isMatch);
        }
        this._showMaxOrZero(seat, change, kb);
    }

    /**
     * 停止播放加减分动画
     */
    _stopChangeEffect(): void {
        let i = 0;
        for (let i = 0; i < 3; ++i) {
            let lab: eui.BitmapLabel = this['labChange' + i];
            egret.Tween.removeTweens(lab);
        }
    }

    /**
     * 播放本局的加减分动画
     */
    playChangeEffect(_seatIdx: number, seat: CCDDZDDZSeat, change: number, kb: number, delay: number = 0): void {
        let score = change + kb;
        let seatIdx = _seatIdx;
        let lab: eui.BitmapLabel = this['labChange' + seatIdx];
        lab.font = RES.getRes(score > 0 ? 'cc_font_num_1' : 'cc_font_num_2');
        let s: string = CCDDZUtils.currencyRatio(Math.abs(score));
        lab.text = (score > 0 ? '+' + s : '-' + s);
        lab.y += 50;
        lab.alpha = 0;
        lab.visible = true;
        egret.Tween.get(lab).wait(delay).to({ y: lab.y - 50, alpha: 1 }, 1000).call(this._changeEffectEnd.bind(this, seat, change, kb));
    }

    /**
     * 隐藏游戏结算时的封顶或者是破产说明
     */
    private _hideGameEndGetInfo(): void {
        this["myGetInfoGroup"].visible = false;
        this["rightGetInfoGroup"].visible = false;
        this["leftGetInfoGroup"].visible = false;
    }

    /**
     * 显示破产或者是封顶
     */
    private _showMaxOrZero(seat: CCDDZDDZSeat, change: number, kb: number): void {
        if (!ccserver.isMatch && !ccserver.isPersonalGame) {
            let _infoBgImg: eui.Image = null;
            let _infoLabel: eui.Label = null;
            let _btnBgImg: eui.Image = null;
            let _btnLabel: eui.Label = null;
            let _infoGroup: eui.Group = null;
            if (seat == this._mySeat) {
                _infoBgImg = this["myInfoBgImg"];
                _infoLabel = this["myInfoLabel"];
                _btnBgImg = this["myBtnbgImg"];
                _btnLabel = this["myBtnLabel"];
                _infoGroup = this["myGetInfoGroup"];
                let _changeLen = this["labChange0"].width;
                let offset = -40;
                if (_changeLen > 131) {
                    offset += (_changeLen - 131) * 0.5;
                }
                //console.log("_showMaxOrZero=====================>",_changeLen,offset);
                this["myGetInfoGroup"].horizontalCenter = offset;
            } else if (seat == this.seat1) {
                _infoBgImg = this["rightInfoBgImg"];
                _infoLabel = this["rightInfoLabel"];
                _btnBgImg = this["rightBtnbgImg"];
                _btnLabel = this["rightBtnLabel"];
                _infoGroup = this["rightGetInfoGroup"];
            } else {
                _infoBgImg = this["leftInfoBgImg"];
                _infoLabel = this["leftInfoLabel"];
                _btnBgImg = this["leftBtnbgImg"];
                _btnLabel = this["leftBtnLabel"];
                _infoGroup = this["leftGetInfoGroup"];
            }

            let _zeroOrMax = false;
            let _data = seat.userInfoView;
            let _suffix = "金豆";
            let _userHas = _data.gold.getGold();
            if (this._roomInfo.roomFlag == 2) {
                _suffix = "钻石";
                if (seat == this._mySeat) { //我自己
                    _userHas = _data.diamond.getGold();
                }
            }

            let _getGold = 0;
            if (change > 0) {
                _getGold = change + kb + this._roomInfo.kickbacks;
                let _showMax = false;
                if (_getGold + change >= _userHas) { //金豆或者是钻石动画播放完成,玩家的信息已经更新了
                    _showMax = true;
                    _userHas = _getGold;
                }

                if (_showMax) {
                    _zeroOrMax = true;
                    /*let _str:string = "" + _userHas;
                    if(_userHas >= 10000){ 
                        _str = _str.substring(0,_str.length - 4) + "万";
                    }*/
                    _infoLabel.text = "最多赢取所拥有的" + _suffix;//"只有" + _str + _suffix + ",最多也只能赢" + _str + _suffix;
                    _btnBgImg.source = "cc_common_btn_blue_h";
                    _btnLabel.text = "封顶";
                    _btnLabel.textColor = 0x173d70;
                }
            } else if (change < 0) {
                if (_userHas <= 0) {
                    _zeroOrMax = true;
                    _infoLabel.text = _suffix + "都输光了！";
                    _btnBgImg.source = "cc_common_btn_orange_h";
                    _btnLabel.text = "破产";
                    _btnLabel.textColor = 0x921c13;
                }
            }

            if (_zeroOrMax) {
                _infoLabel.validateNow();
                _infoGroup.visible = true;
                let _fontW = _infoLabel.width;
                _infoBgImg.width = _fontW + 40;
                _infoBgImg.validateNow();
                if (seat == this._mySeat) { //我自己
                    this._onClickMyEndInfo();
                } else if (seat == this.seat1) {
                    this._onClickRightEndInfo();
                } else {
                    this._onClickLeftEndInfo();
                }
            }

            //console.log("_showMaxOrZero====1=========>","加减:",change,"扣除:",kb,"台费:",this._roomInfo.kickbacks,"理论获得:",_getGold,"身上:",_userHas);
        }
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
        ccserver.playing = false;
        let data: any = event.data;
        let kickbacks = this._roomInfo.kickbacks;
        if (!kickbacks) kickbacks = 0;
        let winDesk: CCDDZDDZSeat;
        this.buttonBar.switchState('hidden');
        this._mySeat.setHang(false);
        this._mySeat.setStatus(null); //隐藏不出
        this.seat1.setStatus(null); //隐藏不出       
        this.seat2.setStatus(null); //隐藏不出
        if (this._roomInfo.roomFlag == 2) {
            CCDDZMainLogic.instance.selfData.setCanGetNewDiamond();
        }

        var c, kb;
        let _myChangeGold = 0;
        for (var i = 0; i < 3; ++i) {
            c = data.chanage[i];
            kb = data.realkickback[i] == null ? 0 : data.realkickback[i];
            let seat: CCDDZDDZSeat = this.getSeatById(i + 1);
            if (!seat) break;
            if (c > 0) {
                winDesk = seat;
            }
            if (this._mySeat == seat) {
                success = c > 0;
                _myChangeGold = c;
            }
            let cseatid = 0;
            if (this.seat1 == seat) {
                cseatid = 1;
            } else if (this.seat2 == seat) {
                cseatid = 2;
            }

            this.playChangeEffect(cseatid, seat, c, kb, 0);
            if (seat)
                seat.stopCD();
        }

        this.btnHang.enabled = false;
        this._mySeat.grpRecorder.visible = false;

        let _myGold = _myChangeGold + this._mySeat.userInfoData.gold;

        this.showResult(success, _myGold);
        this._clearRecorderInfo(0);
        CCDDZPanelPlayerInfo.remove();
        //todo 游戏结束处理
        if (ccserver.isPersonalGame) {
            if (this.cur_round < this.total_round) {
                ++this.cur_round;
            }
        } else {
            if (ccserver.isMatch && ccserver.roomInfo.matchType == 6) { //钻石赛
                this._curMatch9Play += 1;
                if (this._curMatch9Play > this._roomInfo.stage[0].handCount) {
                    if (!CCDDZPanelMatch9GetRew.getInstance().isShow()) {
                        this._showMatch9WaitOtherPlayerOver(true);
                    }
                }
                else {
                    this._setMatch9Turn(this._curMatch9Play);
                }
            }
        }

        // CCDDZMainLogic.instance.updateRecorderExpireTime();
        this.refreshCardsRecorderAbout();
    }

    /**
     * zhu 显示9人钻石赛的等待其他玩家结束的信息
     */
    private _showMatch9WaitOtherPlayerOver(bShow: boolean): void {
        this.match9WaitOther_img.visible = bShow;
    }

    /**
     * _myCurGold:本局结束后我的金豆应该显示的金豆数量
     */
    showResult1(success: boolean, _myCurGold: number): void {
        let _min = 1000;
        let _mainIns = CCDDZMainLogic.instance;
        if (!success || ccserver.isMatch || ccserver.isPersonalGame) {
            if (!ccserver.isMatch && !ccserver.isPersonalGame && _myCurGold < this._roomInfo.minScore) {
                if (!ccserver.isMatch && !success && _myCurGold < _min && this._roomInfo.roomFlag != 2) { //钻石场不请求救济金
                    _mainIns.alms(_myCurGold);
                }
            }
        }

        //只有比赛和自由组局才会清理玩家信息
        if (ccserver.isMatch || ccserver.isPersonalGame) {
            this._timerClean = egret.setTimeout(this.cleanSeat, this, 3000, true, true);
        } else {
            this.cleanSeat(true, true, false);
            let roomId = this._roomInfo.roomID;
            if (success) {
                if (roomId == 1001 || roomId == 1002 || roomId == 8001 || roomId == 1006) {
                    this._isOverFive = false;
                    let winCnt = CCDDZMainLogic.instance.selfData.getRoomWinCntInfo(roomId);
                    if (winCnt && winCnt.cnt < 1 && winCnt.chance >= 1) {
                        this._isOverFive = true;
                    }
                    /**
                     * 赢满5局，并未显示王炸则显示抽红包 
                     */
                    if (this._isOverFive && !this._isShowWZAni) {
                        this._onHasRedChance();
                    }
                } else if (roomId == 8003 || roomId == 8004) { //钻石中级和高级
                    this._initNewRedProcess();
                }
            }
        }
    }

    showResult(success: boolean, _myGold: number): void {
        if (this.dragonChunTian.parent) //显示春天动画
        {
            this._showResultTimeOutId = egret.setTimeout(this.showResult, this, 2000, success, _myGold);
            return;
        }

        this._showResultTimeOutId1 = egret.setTimeout(this.showResult1, this, 500, success, _myGold);
    }

	/**
	 * 更新游戏信息
	 * @param event
	 */
    private onUpdateGameInfo(event: egret.Event): void {
        let msg: any = event.data;
        if (msg.params1.length >= 4 && !ccserver.isMatch) {
            if (msg.params1[3]) {
                let _maxMulti = msg.params1[3];
                //this.initMaxMultiple(_maxMulti);
            }
        }

        //高级场匹配到同级别金豆玩家,低分变化
        if (msg.optype == 1) {
            if (msg.params1 && msg.params1.length > 2) {
                let _baseScore = msg.params1[1];
                let _sScore = "" + _baseScore;
                if (_baseScore >= 10000) {
                    _sScore = _sScore.substring(0, _sScore.length - 4) + "万";
                }
                this.setlabWaiting("当前底分为" + _sScore);
                egret.setTimeout(function () {
                    this.setlabWaiting(null);
                }, this, 5000)
                this.masterCards.updateScore(msg.params1[1], msg.params1[0]);
            }
        } else if (msg && msg.params1 && msg.params1.length >= 1 && msg.params1[0] == 250 && msg.params1[1] == 250) {
            if (msg.params1[3] == 0) {
                //金豆不够
                // CCDDZAlert.show(lang.noMoreGold, 1, this.onAlertResult.bind(this, 3));
                // CCDDZPanelRechargeTips.instance.show();
            } else {
                //金豆足够
                CCDDZAlert.show(lang.noMoreGold3, 1, this.onAlertResult.bind(this, 1));
            }
        } else if (msg.params1 && msg.params1.length >= 1) {//} && msg.params1.length == 1) {
            //console.log('底分:', msg.params1[0], '倍数:', msg.params1[1]);
            if (msg.params1.length >= 2) {
                this._roomInfo.baseScore = msg.params1[1];
                this.masterCards.updateScore(this._roomInfo.baseScore, msg.params1[0]);
                // this.masterCards.updateScore(msg.params1[1], msg.params1[0]);    
            } else {
                this.masterCards.updateMultiple(msg.params1[0]);
            }
        } else if (msg.params2 && msg.params2.length > 2) {
            //春天,火箭,炸弹
            //console.log('游戏结算:', msg.params2[0], msg.params2[1], msg.params2[2]);
            if (msg.params2[0] > 0)
                this.showDragonChunTian();
            // this.labResult.text = CCalien.StringUtils.format(lang.gameResult,msg.params2[0],msg.params2[1],msg.params2[2]);
        }

    }

	/**
	 * 救济金返回
	 * @param event
	 */
    private onAlmsResponse(event: egret.Event): void {
        //钻石场不处理救济金
        if (this._roomInfo && this._roomInfo.roomFlag == 2) {
            return;
        }

        let data: any = event.data;
        switch (data.result) {
            case 0:   //成功
                let gold: number = CCDDZMainLogic.instance.selfData.gold;
                let msg: string = lang.format(lang.id.alms_success,
                    CCDDZUtils.currencyRatio(CCGlobalGameConfig.almsConfig.gold),
                    CCGlobalGameConfig.almsConfig.count - data.usagecnt
                );

                if (ccserver.isMatch || ccserver.isPersonalGame) {
                    CCDDZAlert.show(msg);
                    return;
                }

                if (this._roomInfo.roomID == 1001 || this._roomInfo.roomID == 1005) { //只有金豆场和大师场才更新金豆
                    this._mySeat.updateGold(CCGlobalGameConfig.almsConfig.gold, false);
                }
                //救济金返回后还未同步到玩家身上
                if (gold < CCGlobalGameConfig.almsConfig.gold) {
                    gold += CCGlobalGameConfig.almsConfig.gold;
                    CCDDZMainLogic.instance.selfData.gold = gold;
                }

                if (gold < this._roomInfo.minScore) {
                    ////CCDDZPanelRechargeTips.instance.show(this.onAlertResult.bind(this,0));
                    CCDDZPanelReviveBag.getInstance().show(this._roomInfo);
                } else {
                    CCDDZAlert.show(msg + lang.alms_success_continue, 1, (action: string) => {
                        if (action == 'confirm') {
                            this.initData();
                            this.sendQuickJoin();
                        } else {
                            CCDDZMainLogic.backToRoomScene();
                        }
                    });
                }
                break;
            case 1:   //领取次数使用完
            case 2:   //未达到领取条件
                if (!ccserver.isMatch) {
                    CCDDZPanelReviveBag.getInstance().show(this._roomInfo);
                    //CCDDZPanelRechargeTips.instance.show(this.onAlertResult.bind(this,0));
                }
                break;
        }
    }

	/**
	 * 玩家坐下
	 * @param data {seatid, uid}
	 * @returns {CCDDZMySeat}
	 */
    private playerSeatDown(data: any): CCDDZDDZSeat {
        if (data.uid == ccserver.uid) {
            ccserver.seatid = data.seatid;
            // this.grpRedcoin.visible = true;
            /*zhu 在beforeShow里面处理 if(!ccserver.isMatch && !ccserver.isPersonalGame){
                this.updateRedCoinInfo();
                this._mySeat.grpRedcoin.visible = true;
            }else{
                this._mySeat.grpRedcoin.visible = false;
            }*/
        }

        let seat: CCDDZDDZSeat = this.getSeatById(data.seatid);
        if (!seat || !seat.userInfoData || seat.userInfoData.uid != data.uid) {
            let userInfoData: CCGlobalUserInfoData = new CCGlobalUserInfoData();
            userInfoData.initData(data);
            let seatNum = 3;
            if (this.isCoupleGame) seatNum = 2;
            seat = this._seats[(userInfoData.seatid + seatNum - ccserver.seatid) % seatNum];
            seat.userInfoData = userInfoData;
            seat.seatid = data.seatid;
            seat.setOwnerFlagVisible(false);
            seat.setQuitFlagVisible(false);
            // seat.updateUserInfoData(data);
            seat.userInfoView.update(data);
        } else if (seat) {
            seat.updateUserInfoData(data);
        }

        ccserver.getUserInfoInGame(data.uid);
        if (seat && ccserver.isMatch) {
            data.nickname = '参赛玩家';
            if (seat.isMaster) {
                data.imageid = 'cc_icon_head9'
            } else {
                data.imageid = 'cc_icon_head10'
            }
            seat.updateUserInfoData(data);
            seat.userInfoView.update(data);
        }

        if (!ccserver.isMatch && !ccserver.isPersonalGame) {
            if (data.viplv >= 1) {
                seat.userInfoView.avatar.setVipLevel(data.viplv);
            }
        }
        // ++this.playerCnt;
        return seat;
    }

	/**
	 * 玩家站起
	 * @param uid
	 */
    private playerStandUp(uid: number): void {
        console.log("playerStandUp===============>", uid);
        if (!ccserver.isMatch && uid == ccserver.uid) {
            this.cdProgressBar.stop();
            CCDDZMainLogic.backToRoomScene();
        }

        let seat: CCDDZDDZSeat = this.getSeatByUId(uid);
        //一局结束,当玩家离开不清玩家信息
        if (!ccserver.isMatch && !ccserver.isPersonalGame && !ccserver.playing) {
            return;
        }
        if (seat) {//} && uid != ccserver.uid){
            CCDDZPanelPlayerInfo.onPlayerLeave(seat.seatid);
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

    /**
	 * 是否在猜底牌开放时间
	 */
    private _isInGuessTime(): boolean {
        let _bIn = false;
        let _custom: any = CCGlobalGameConfig.getCfgByField("custom");
        if (_custom) {
            if (_custom.guessCard) {
                let _start = _custom.guessCard.start;
                let _end = _custom.guessCard.end;
                let _ts = ccserver.getServerStamp();
                _bIn = CCDDZUtils.isInTimeSection(_start, _end, _ts, true, false);
            }
        }
        return _bIn;
    }

    private cleanSeat(keepCards: boolean = false, showReady: boolean = false, clearPlayer: boolean = true): void {
        var i = 0;
        if (clearPlayer) {
            this._seats.forEach((seat: CCDDZDDZSeat) => {
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
        }
        // this._timerClean = null;
        egret.clearTimeout(this._timerClean);

        this._showReadyBtn(showReady);
        if (!ccserver.isMatch && !ccserver.isPersonalGame) {
            this.initGuessCardsView();
            this.grpRedNotice.visible = false;
        }
    }

	/**
	 * 根据座位号获取座位
	 * @param seatid
	 * @returns {CCDDZDDZSeat}
	 */
    private getSeatById(seatid: number): CCDDZDDZSeat {
        let seat: CCDDZDDZSeat = null;
        this._seats.some((s: CCDDZDDZSeat): boolean => {
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
	 * @returns {CCDDZDDZSeat}
	 */
    private getSeatByUId(uid: number): CCDDZDDZSeat {
        let seat: CCDDZDDZSeat = null;
        this._seats.some((s: CCDDZDDZSeat): boolean => {
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
            this._stopNewRedAni();
            this._showNormalRedImg(false);
            this["canNewRed"] = false;

            //钻石场要更新进度
            if (this._roomInfo.roomFlag == 2 && !ccserver.isMatch && !ccserver.isPersonalGame) {
                this._initNewRedProcess();
            }
        }
    }

    private setRedProcess(bGameEnd: boolean = false): void {
        if (!ccserver.isMatch && !ccserver.isPersonalGame) {
            let roomId = this._roomInfo.roomID;
            if (roomId != 1001 && roomId != 1002 && roomId != 8001 && roomId != 1006) {
                return;
            }
            let redPDef = [0, 0, 0, 0, 0];
            let redPOver = [1, 1, 1, 1, 1];
            let nWinTot = 5;
            let srcPng = "cc_play_btn_chou";
            if (roomId == 1002) {
                nWinTot = 3;
                redPDef = [0, 0, 0];
                redPOver = [1, 1, 1];
                srcPng = "cc_play_btn_chou2";

            } else if (roomId == 8001 || roomId == 1006) {
                redPDef = [0];
                redPOver = [1];
                nWinTot = 1;
                srcPng = "cc_play_btn_chou3";
            }
            this["mRed_img"].source = srcPng;
            let _mainIns = CCDDZMainLogic.instance;
            this.redListDataArr = redPDef;
            let _winCntInfo = _mainIns.selfData.getRoomWinCntInfo(roomId);
            let count = 0;
            let _count = 0;
            if (_winCntInfo) {
                count = _winCntInfo.cnt;
                _count = _winCntInfo.chance || 0;
            }
            if (this._isOverFive && bGameEnd && !this._isShowWZAni) {
                this.redListDataArr = redPOver;
            }
            else {
                for (var j: number = 0; j < count; j++) {
                    this.redListDataArr[j] = 1;
                }
            }

            this.redCount.text = "" + _count;
            if (_count >= 1) {
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
        let _mainIns = CCDDZMainLogic.instance;
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
        } else if (roomId == 8001 || roomId == 1006) {
            nWinTot = 1;
        }
        let bFound = false;
        let info = CCDDZMainLogic.instance.selfData.wincnt;
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
        CCDDZMainLogic.instance.selfData.freshmanredcoinsent = 1;
        if (!this.dragonHongBao.parent)
            this.addChild(this.dragonHongBao);
        this.dragonHongBao.play2();

        this._isShowWZAni = true;
    }

    /**
     * zhu 新手提示打出王炸并获胜
     */
    private showRedcoinDragon(isPlay: boolean): void {
        /* if(!this.dragonHongBao.parent)
             this.addChild(this.dragonHongBao);
         if (isPlay)
         {
             CCalien.CCDDZlocalStorage.setItem("freshmanredcoinsent","1");        
             this.dragonHongBao.addEventListener(egret.Event.COMPLETE,this.ondragonHongBaoComplete,this);
         }
         this.dragonHongBao.play1(isPlay);*/
    }

    private ondragonHongBaoComplete(e: egret.Event): void {
        //this.dragonHongBao.removeEventListener(egret.Event.COMPLETE,this.ondragonHongBaoComplete,this);
        //ccserver.stopCache();
    }

    private showDragonChunTian(): void {
        if (!this.dragonChunTian.parent) {
            this.addChild(this.dragonChunTian);
        }
    }

    private showDragonWangZha(): void {
        if (!this.dragonWangZha.parent) {
            this.addChild(this.dragonWangZha);
        }
    }

    private showDragonZhaDan(): void {
        if (!this.dragonZhaDan.parent) {
            this.addChild(this.dragonZhaDan);
        }
    }

    private showDragonFeiJi(): void {
        if (!this.dragonFeiJi.parent) {
            this.addChild(this.dragonFeiJi);
        }
    }

    private showDragonMyLianDui(): void {
        if (!this.dragonMyLianDui.parent) {
            this.dragonMyLianDui.x = CCalien.CCDDZStageProxy.stage.stageWidth >> 1;
            this.dragonMyLianDui.y = CCalien.CCDDZStageProxy.stage.stageHeight / 2 + 20;

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
            this.dragonMyShunZi.x = CCalien.CCDDZStageProxy.stage.stageWidth >> 1;
            this.dragonMyShunZi.y = CCalien.CCDDZStageProxy.stage.stageHeight / 2 + 20;

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

    private onShowGameEffect(e: egret.Event): void {
        switch (e.data.cardType) {
            //王炸
            case 1:
                this.showDragonWangZha();
                break;
            //炸弹
            case 2:
                this.showDragonZhaDan();
                break;

            //炸弹
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
            CCDDZToast.show("请整点领取");
        } else {

        }
    }

    /**
     * 每日福袋
     */
    private _initDayBuy(): void {
        let _timeNow = ccserver.serverDate;
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

    //设置最高倍数
    initMaxMultiple(nMax: number): void {
        this.labelMatchInfo.textFlow = (new egret.HtmlTextParser).parser("最高<font color='#F0FF00'>" + nMax + "</font>倍");
    }

    private _onClickMyEndInfo(): void {
        egret.Tween.removeTweens(this["myInfoBgImg"])
        this["myInfoBgImg"].visible = true;
        this["myInfoLabel"].visible = true;
        egret.Tween.get(this["myInfoBgImg"]).wait(3000).call(() => {
            egret.Tween.removeTweens(this["myInfoBgImg"]);
            this["myInfoBgImg"].visible = false;
            this["myInfoLabel"].visible = false;
        })
    }

    private _onClickLeftEndInfo(): void {
        egret.Tween.removeTweens(this["leftInfoBgImg"])
        this["leftInfoBgImg"].visible = true;
        this["leftInfoLabel"].visible = true;
        egret.Tween.get(this["leftInfoBgImg"]).wait(3000).call(() => {
            egret.Tween.removeTweens(this["leftInfoBgImg"]);
            this["leftInfoBgImg"].visible = false;
            this["leftInfoLabel"].visible = false;
        })
    }

    private _onClickRightEndInfo(): void {
        egret.Tween.removeTweens(this["rightInfoBgImg"])
        this["rightInfoBgImg"].visible = true;
        this["rightInfoLabel"].visible = true;
        egret.Tween.get(this["rightInfoBgImg"]).wait(3000).call(() => {
            egret.Tween.removeTweens(this["rightInfoBgImg"]);
            this["rightInfoBgImg"].visible = false;
            this["rightInfoLabel"].visible = false;
        })
    }

    private _onClickTask(): void {
        CCDDZPanelDayTask.getInstance().show();
    }

    /**
     * 点击五张牌规则
     */
    private _onClickFiveRule(): void {
        let _dropRew = CCGlobalGameConfig.getCfgByField("item_drop");
        let _formatInfo = function (rewObj: any) {
            let _info = CCDDZUtils.parseGoodsString(rewObj.reward);
            let _text = CCDDZUtils.goodsListToString(_info, 0, true);
            return _text;
        }

        let _text = "1)斗地主游戏中，玩家在牌局结束后随机掉落扑克牌，其中第二张和第三张牌为未知牌，集齐5张点击翻牌按钮，今日充值任意金额玩家可根据牌型获得对应奖励。扑克牌只在金豆场和钻石极速场掉落\n"
            + "2)牌型奖励如下：\n"
            + "   炸弹：" + _formatInfo(_dropRew[6]) + "\n"
            + "   三带对：" + _formatInfo(_dropRew[5]) + "\n"
            + "   顺子：" + _formatInfo(_dropRew[4]) + "\n"
            + "   三带一：" + _formatInfo(_dropRew[3]) + "\n"
            + "   两对：" + _formatInfo(_dropRew[2]) + "\n"
            + "   对子：" + _formatInfo(_dropRew[1]) + "\n"
            + "   单牌：" + _formatInfo(_dropRew[0]) + "\n"
            + "3)好手气斗地主在法律规定范围内，对活动保留进行解释的权利。\n";
        CCDDZAlert.show(_text, 0, null, "left");
    }

    /**
     * 提示今日未充值抽
     */
    private _showNotPayTodayForGetFiveRew(): void {
        CCDDZAlert.show("充值任意金额，即有机会获得最高500倍奖励！确定前往充值？", 0, function (act) {
            if (act == "confirm") {
                CCDDZPanelExchange2.instance.show(0);
            }
        });
    }
    /**
     * 五张牌挤满点击领取奖励
     */
    private _onClickOpenFiveCard(): void {
        if (CCDDZMainLogic.instance.selfData.hasPayToday()) {
            this._showFiveOpenCard(false);
            ccserver.reqGetFiveCardRew(this._roomInfo.roomID);
        } else {
            this._showNotPayTodayForGetFiveRew();
        }
    }

    /**
     * 显示问号规则按钮
     */
    private _showHelpImg(bShow: boolean): void {
        this.redNormalHelp_img.visible = bShow;
    }

    private _setCurState(state: string): void {
        this.currentState = state;
        this.validateNow();
    }

    private _addClickFunc(): void {
        let func = "addClickListener"
        this.mRed_img[func](this._onClickRed, this);
        this.matchInfo_img[func](this._onClickMatch9Info, this);
        this.double_group[func](this._onClickDouble, this);
        this.noDouble_group[func](this._onClickNoDouble, this);
        this.redNormal_img[func](this._onClickNewRed, this);
        //this["iconAward"][func](this._onClickNewRed,this);
        this.redNormalHelp_img[func](this._onClickRedNormalHelp, this);
        this.dayBuyGroup[func](this._onClickDayBuy, this);
        this.grpTask[func](this._onClickTask, this);
        this["myBtnbgImg"][func](this._onClickMyEndInfo, this, false);
        this["leftBtnbgImg"][func](this._onClickLeftEndInfo, this, false);
        this["rightBtnbgImg"][func](this._onClickRightEndInfo, this, false);
        this["fiveRuleImg"][func](this._onClickFiveRule, this);
        this["openFiveImg"][func](this._onClickOpenFiveCard, this, false);
        this["guessImg"][func](this.onBtnGuessClick, this);
    }

    beforeShow(params: any): void {
        CCalien.CCDDZPopUpManager.removeAllPupUp();
        this._showRedCount(false);
        this.grpGuessCards.visible = true;

        this._stopChangeEffect();
        this._hideGameEndGetInfo();
        this._showNextMasterCardGuessBtn(false);
        this._showMatch9WaitOtherPlayerOver(false);
        this._showDoubleNoDouble(false);
        this._showFailDouble(false);
        this._showHelpImg(true);

        let _nDiamond = CCDDZBagService.instance.getItemCountById(3);
        this._setDiamondUI(_nDiamond);
        this.rollMsg.visible = true;
        this.rollMsg.enableSendHorn(false);
        this._mySeat.grpRedcoin.visible = false;
        this["grpGiveWay"].visible = false;

        // this.playerCnt = 0;        
        if (params.personalgame) {
            this._mySeat.showDiamond(false);
            //zhu ccserver.startCache([CCGlobalEventNames.QUERY_ROOMINFO_REP]);
            this.isPersonalGame = true
            this.isCoupleGame = false;
            ccserver.isCoupleGame = false;
            ccserver.isPersonalGame = true;
            // ccserver.roomInfo.matchType
            // ccserver.roomInfo = this._roomInfo = params;

            this._setCurState('personalGame');
            this._showHelpImg(false);

        } else {
            //zhu 
            this.isPersonalGame = false;
            this.isCoupleGame = false;
            ccserver.isCoupleGame = false;
            ccserver.isPersonalGame = false;

            let roomInfo: any = CCGlobalGameConfig.getRoomConfig(params.roomID);
            if (!roomInfo) {
                // 走重连流程 否则界面清理会有问题
                // CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.SHOW_DISCONNECT, { content: lang.disconnect_server });
                // 退回上一个界面
                if (!params.gameID) {
                    if (Math.floor(params.roomID / 1000) == 8) {
                        params.gameID = 8;
                    }
                }
                roomInfo = CCGlobalGameConfig.getRoomCfgByGameId(params.gameID, params.roomID);
                if (!roomInfo) {
                    CCDDZMainLogic.backToRoomScene();
                    return;
                }
            }
            ccserver.roomInfo = this._roomInfo = roomInfo;
            /*zhu 暂时去掉if(!this._roomInfo || !this._roomInfo.roomID || !this._roomInfo.roomType){
                ccddzwebService.postError(CCGlobalErrorConfig.REPORT_ERROR,"CCDDZScenePlay beforeShow=>"+ version + "|uuid" + ccddzwebService.uuid +"|" +JSON.stringify(params) + JSON.stringify(CCGlobalGameConfig.roomList));
            }*/
            ccserver.isMatch = roomInfo.roomType == 2;

            let currentState = ccserver.isMatch ? 'match' : 'normal';
            if (params.roomID == 8001 || params.roomID == 8002 || params.roomID == 8003 || params.roomID == 8004) {
                this.isCoupleGame = true;
                ccserver.isCoupleGame = true;
                currentState = "couple";
                this["grpGiveWay"].visible = true;
            }

            this._setCurState(currentState);

            if (ccserver.isMatch) {
                this._showHelpImg(false);
            }
            if (!ccserver.isMatch) {
                this.labMatchInfo.text = "...";
                this._mySeat.grpRedcoin.visible = true;
                this._mySeat.userInfoView.avatar.setVipLevel(CCDDZMainLogic.instance.selfData.getCurVipLevel());
                this._mySeat.showDiamond(true);
                this.initGuessCardsView();
                this.updateRedCoinInfo();
                this._showFiveCardReward(false);
                this._clearFiveCardView();
                ccserver.reqFiveCard(this._roomInfo.roomID);
                this._initNewRed();
                this._showMatchRank(true);
                this.initMaxMultiple(this._roomInfo.maxOdds);
            } else {
                //钻石赛
                this._mySeat.showDiamond(false);
                if (ccserver.roomInfo.matchType == 6) {
                    this._showMatchTurnAndRank(false);
                    this._showMatch9Bottom(true);
                    this._setMatch9Turn(1);
                    this._setMatch9CurRank(-1);
                }
                else {//其他比赛
                    this._showMatchTurnAndRank(true);
                    this._showMatch9Bottom(false);
                }
                this.labMatchInfo.text = '';
            }
        }

        this._initGeneralHeadImgTouch(true);
        this.addListeners();
        this._newTable = true;
        this.initData();
        let _selfData = CCDDZMainLogic.instance.selfData;
        if (!ccserver.isMatch) {//zhu 刚进入游戏就刷新金豆
            this._mySeat.userInfoView.updateGold(_selfData.gold);
            this._showDayTaskDefaultByOverNum(_selfData.getDayTaskOverCount());
        }
        //zhu 刚进入游戏就设置自己的头像
        egret.setTimeout(() => {
            this._mySeat.userInfoView.avatar.imageId = _selfData.imageid;
            this._mySeat.userInfoView.updateNickname(_selfData);
        }, this, 100);
        CCalien.CCDDZSoundManager.instance.playMusic(CCGlobalResNames.bgm);

        // setTimeout(this.showLaba.bind(this, null),2000);
        if (_selfData && _selfData.cardsRecorder &&
            _selfData.cardsRecorder.length >= 7) {
            this.beforerecorderTime = _selfData.cardsRecorder[6];
        } else {
            this.beforerecorderTime = 0;
        }

        //this.showLaba(null);
        this.rollMsg.showLast(2);
        this._clearRecorderInfo(0);
        this.refreshCardsRecorderAbout();


        this._setTableRedInfo();

        CCDDZMainLogic.instance.setScreenLandScape(1280, 640);
        //this.addChild(this.dragonHongBao);
        //this.dragonHongBao.play2();
    }

    /**
     * 初始化每日任务右上角的小红点和任务完成数量
     */
    private _showDayTaskDefaultByOverNum(num: number): void {
        let bShow = false;
        if (num > 0) {
            bShow = true;
        }
        this.overTaskLabel.text = "" + num;
        this.overTaskLabel.visible = bShow;
        this._showTaskRedImg(bShow);
    }
    /**
     * 显示任务右上角的小红点
     */
    private _showTaskRedImg(bShow: boolean): void {
        this.overTaskBgImg.visible = bShow;
    }

    /**
 * 任务奖励领取成功
 */
    private _onDayTaskRewGetSucc(): void {
        let _num = CCDDZMainLogic.instance.selfData.getDayTaskOverCount();
        this._showDayTaskDefaultByOverNum(_num);
    }
    /**
     * 提示赢一局抽奖券
     */
    private _showJustOne(bOne: boolean): void {
        /*if(bOne){
            this["redList"].visible = false;
            this["mRed_img"].visible = false;
            this["redCountBg_img"].visible = false;
            this["redCount"].visible = false;
        }else{
            this["redList"].visible = true;
            this["mRed_img"].visible = true;
            this["redCountBg_img"].visible = true;
            this["redCount"].visible = true;
        }*/
    }

    private setPGameView(params: any) {
        this.lbRoomID.text = String(params.roomid);
        if (!params.maxodd) params.maxodd = '无';
        this.lbLimit.text = String(params.maxodd);
        this.cur_round = params.playround == null ? 1 : (params.playround + 1);
        this.lbRound.text = this.cur_round + '/' + String(params.maxround);
        this.isowner = params.owner == ccserver.uid ? true : false;
        this.owneruid = params.owner;
        this.roomid = params.roomid;
        this.total_round = params.maxround;
        this.masterCards.updateScore(params.bscore || 0, 1);
        this.gamestarted = params.gamestatus > 1 ? true : false;
        if (!CCalien.Native.instance.isNative) {
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
        ccserver.roomInfo = this._roomInfo = { roomID: params.roomid, maxOdds: params.maxodd, maxround: params.maxround, baseScore: params.bscore, kickbacks: 0 };
        //zhu ccserver.stopCache();
    }

    protected onShow(params: any = null, back: boolean = false): void {
        // this.playerCnt = 0;
        if (params.personalgame) {
            this.isPersonalGame = true;
            ccserver.isMatch = false;
            ccserver.isPersonalGame = true;
            // if(params.maxOdds){
            //     this.setPGameView(params);
            // }else{
            if (params.roomID) {
                ccserver.QueryRoomInfoReq(params.roomID);
            }
            // }

            this.btnShare.visible = true;
        } else {
            ccserver.isPersonalGame = false;
        }

        if (params.roomID == 8001 || params.roomID == 8002 || params.roomID == 8003 || params.roomID == 8004) {
            this.isCoupleGame = true;
            ccserver.isCoupleGame = true;
            this.currentState = "couple";
            this["grpGiveWay"].visible = true;
        }

        switch (params.action) {
            case 'quick_join':
                this.sendQuickJoin();
                break;
            case 'reconnect':
                ccserver.reconnect(0);
                break;
        }

        if (ccserver.isMatch) {
            ccserver.enterMatch(this._roomInfo.matchId);

            if (params.action != 'reconnect') {
                this.setlabWaiting('比赛开始，正在为您匹配对手...');
            } else {
                this.setlabWaiting('正在为您匹配对手...');
            }
        }
        //极速场或者是金豆赢一局抽奖券
        else if (ccserver.roomInfo && (ccserver.roomInfo.roomID == 1000 || params.roomID == 1004)) {
            this.setlabWaiting('正在为您匹配对手...');
        }
    }

    beforeHide() {
        this.cleanSeat();
        this.removeListeners();
        this._clearRedNormalInterval();
        this._clearFiveRewardTimeout();
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
        ccserver.playing = false;

        if (ccserver.isMatch) {
            CCDDZPanelMatchWaitingInner.instance.close();
        }
    }

    protected onHide(params: any = null, back: boolean = false): void {
        super.onHide(params, back);

        //        CCalien.CCDDZSoundManager.instance.stopMusic();

        this._seats.forEach((seat: CCDDZDDZSeat) => {
            seat.stopCD();
        });
    }

    /**
     * 点击屏幕下方抽红包按钮
     */
    private _onClickRed(): void {
        let _mainIns = CCDDZMainLogic.instance;
        let _num = Number(this.redCount.text);
        if (_num <= 0) {
            let _needWinCnt = this.getRedCoinLackCnt();
            CCDDZToast.show("游戏再赢" + _needWinCnt + "局即可抽取");
            return;
        }
        let _ins = CCDDZExchangeService.instance;
        if (_ins.doChouWangZha()) { //抽了王炸
            return;
        }

        _ins.doChou(this._roomInfo.roomID);
        /*let _oneOld = _mainIns.selfData.getOneNorRoomRedFromSmall();
        if(_oneOld){ //抽旧的红包
            _ins.doChou(_oneOld.roomid);
        }else{
            _ins.doChouNewGold();
        }*/
    }

    private _showRedCount(bShow: boolean): void {
        this.redCountBg_img.visible = bShow;
        this.redCount.visible = bShow;
    }
    /**
     * 玩家可兑换的红包个数变化
     */
    private _onUserRedCountChange(e: egret.Event): void {
        let roomId = this._roomInfo.roomID;
        if (ccserver.isMatch || !roomId || roomId == 1000 || roomId == 1004) {
            return;
        }
        let _data = e.data;
        let _bShow = false;
        let winCntInfo = CCDDZMainLogic.instance.selfData.getRoomWinCntInfo(roomId);
        winCntInfo.chance = winCntInfo.chance || 0;
        if (winCntInfo && winCntInfo.chance >= 0) {
            this.redCount.text = "" + winCntInfo.chance;
            _bShow = true;
        }
        this._showRedCount(_bShow);
    }

    /**
     * 显示其他比赛的进度（当前局数/总局数)和排名,9人钻石赛有自己的进度显示
     */
    private _showMatchTurnAndRank(bShow: boolean): void {
        this.matchTurn_group.visible = bShow;
        this._showMatchRank(bShow);
    }

    private _showMatchRank(bShow): void {
        this.matchRank_group.visible = bShow;
    }

    /**
     * 设置钻石赛的局数
     */
    private _setMatch9Turn(nCur: number): void {
        let roomInfo = CCGlobalGameConfig.getRoomConfigByMatchId(this._roomInfo.matchId);
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
        CCDDZPanelMatch9Info.getInstance().show(this._match9Info);
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
            let roomInfo = CCGlobalGameConfig.getRoomConfigByMatchId(matchId);
            if (roomInfo && roomInfo.matchType == 6) { //钻石赛
                CCDDZPanelMatch9GetRew.getInstance().show(roomInfo, _data);
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
        let _seat: CCDDZDDZSeat = this._mySeat;
        let _rightSeat: CCDDZDDZSeat = this['seat1'];
        let _leftSeat: CCDDZDDZSeat = this['seat2'];
        let leftGold = 0;
        if (_leftSeat && _leftSeat.userInfoData)
            leftGold = _leftSeat.userInfoData.getGold() || 0;
        let rightGold = 0;
        if (_rightSeat && _rightSeat.userInfoData)
            rightGold = _rightSeat.userInfoData.getGold() || 0;
        let nDiamond = CCDDZBagService.instance.getItemCountById(3);
        let myGold = CCDDZMainLogic.instance.selfData.getGold();
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
            CCDDZImgToast.instance.show(this, this._doubleRet.sReason);
        }
        else {
            ccserver.reqDouble();
        }
    }
    /**
     * 点击不加倍
     */
    private _onClickNoDouble(): void {
        ccserver.reqNoDouble();
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
            let seat: CCDDZDDZSeat = this.getSeatById(_data.seatid);
            if (!seat) return;

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
                    //CCDDZBagService.instance.updateItemCount(3,-nDiamondCost);
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
        this.btnGuessCards.visible = false;
    }

    /**
     * 检测是否高于踢出门槛
     */
    private _isEnoughChip(): boolean {
        let bEnough = false;
        let gold = CCDDZMainLogic.instance.selfData.gold;
        //console.log("_isEnoughChip======>",this._roomInfo,gold);
        let kickScore = this._roomInfo.kickScore;
        if (!kickScore) {
            kickScore = this._roomInfo.minScore;
        }
        if (this._roomInfo.roomFlag == 1) {
            if (gold >= kickScore) {
                bEnough = true;
            }
        } else {
            let diamond = CCDDZBagService.instance.getItemCountById(3);
            if (diamond >= kickScore) {
                bEnough = true;
            }
        }
        return bEnough;
    }

    /**
     * 点击准备
     */
    private _onClickReady(): void {
        this.cleanSeat(false, false, true);
        this.initData(true);
        this._showNextMasterCardGuessBtn(false);
        this.onCloseGrpGuessOp(null);
        this._clearFiveRewAndCards();
        ccserver.reqFiveCard(this._roomInfo.roomID);
        this.checkEnoughSendQuickJoin();
    }

    /**
     * 检测是否高于提出门槛
     */
    public checkEnoughSendQuickJoin(): void {
        if (this._isEnoughChip()) {
            this.setlabWaiting("正在为您匹配对手...");
            this.sendQuickJoin(1);
        } else {
            CCDDZMainLogic.instance.enterGameItemNotEnough(this._roomInfo);
            /*let _curRoomId = this._roomInfo.roomID;
            let _gold = CCDDZMainLogic.instance.selfData.gold;
            let _room = CCGlobalGameConfig.getSuitableRoomConfig(_gold);
            console.log("_onClickReady====>suitableRoom==>",_room,"--cur--",_curRoomId,"--curGold--",_gold);
            if(!_room){ //未找到合适的房间
                CCDDZPanelRechargeTips.instance.show(this.onAlertResult.bind(this,0));
            }
            else if(_room.roomID != _curRoomId && (_curRoomId == 1001 || _curRoomId == 1005)){
                CCDDZMainLogic.instance.toSuitableRoom(_room);
                ccserver.checkReconnect();
                return;
            }else{
                this.sendQuickJoin();
            }*/
        }
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
        this._showReadyBtn(false);
        if (!ccserver.isMatch) {
            this.setlabWaiting("正在为您匹配对手...")
        }
    }

    /**
     * 显示准备按钮
     */
    private _showReadyBtn(bShow: boolean): void {
        let _show = !ccserver.isMatch && !ccserver.isPersonalGame && bShow;
        this.btnContinue.visible = _show;
        if (_show && this._roomInfo.roomFlag == 1) {
            if (this.currentState == "normal" || this._roomInfo.roomID == 8001) {
                let inTime = this._isInGuessTime();
                this["grpGuess"].visible = inTime;
                let key = "tipGuess";
                let hasTip = CCalien.CCDDZlocalStorage.getItem(key);
                this._showGuessNotice(inTime && (hasTip != "1"));
                CCalien.CCDDZlocalStorage.setItem(key, "1");
            }
        } else {
            this["grpGuess"].visible = false;
            this._showGuessNotice(false);
        }
    }

    private _showGuessNotice(bShow): void {
        this["grpGuessNotice"].visible = bShow;
    }

    /**
     * 背包更新
    */
    private _onBagRefresh(): void {
        //极速不要监听此协议
        let _nDiamond: any = CCDDZBagService.instance.getItemCountById(3);
        if (this._roomInfo && this._roomInfo.roomFlag == 2) {
            if (ccserver.playing)
                return;
        }
        this._setDiamondUI(_nDiamond);
    }

    /**
     * 点击极速场的抽红包 
     */
    private _onClickRedNormal(): void {
        if (this._roomInfo.roomID == 1000) { //极速场赢一局抽奖券
            ccserver.reqRedNormalMoney();
        } else if (!ccserver.isMatch && !ccserver.isPersonalGame) {//其他红包场的红包
            if (this._roomInfo.roomID == 1005) { //新的抽奖方式
                ccserver.reqNewGoldRedRew();
            } else if (this._roomInfo.roomID == 1004) {
                CCDDZExchangeService.instance.doChou(this._roomInfo.roomID);
            } else {
                let _mainIns = CCDDZMainLogic.instance;
                let _oneOld = _mainIns.selfData.getOneNorRoomRedFromSmall();
                if (_oneOld) { //抽旧的红包
                    CCDDZExchangeService.instance.doChou(_oneOld.roomid);
                } else {
                    CCDDZExchangeService.instance.doChouNewGold();
                }
            }
        }
        this._showReadyBtn(true);
    }
    /**
     * 显示红包的进度
     */
    private _showGrpRedStatus(bShow: boolean): void {
        this["grpAwardStatus"].visible = bShow;
    }

    /**
     * 显示新的抽奖
     */
    private _showNewRed(bShow: boolean): void {
        this["grpAward"].visible = bShow;
    }

    private _initNewRed(): void {
        if (ccserver.isPersonalGame || ccserver.isMatch) {
            return;
        }
        //钻石场
        if (this._roomInfo.roomFlag == 2) {
            if (this._roomInfo.rewardwinround) {
                this._showNewRed(false);
            } else {
                this._showNewRed(true);
            }
            this._showNewRedHas(false);
        } else {
            this._showNewRed(false);
            this._showNewRedHas(true);
            this._setNewRedHasNum();
        }

        let roomID = this._roomInfo.roomID;
        //赢5局抽红包，赢3局，赢1局
        if (roomID == 1001 || roomID == 1002 || roomID == 8001 || roomID == 1006) {
            this._showNormalRedImg(false);
            this.setRedProcess();
            this._showGrpRed(true);
            return;
        }
        this._showGrpRed(false);
        this._stopNewRedAni();
        this._initNewRedProcess();
    }

    /**
     * 5分钟或者是满3局抽红包的数量
     */
    private _setNewRedNum(num: number): void {
        let obj = this["redNumGrp"];
        if (num > 0) {
            obj.visible = true;
            this["redNumLabel"].text = "" + num;
        } else {
            obj.visible = false;
        }
    }

    /**
     * 5分钟或者是满3局抽红包
     */
    private _onClickNewRed(): void {
        let roomId = this._roomInfo.roomID;
        let winCnt: any = CCDDZMainLogic.instance.selfData.getRoomWinCntInfo(roomId);
        let sText: string;
        if (this._roomInfo.roomFlag == 1) {
            if (roomId == 1001 || roomId == 1002 || roomId == 8001 || roomId == 1006) {
                this._showNormalRedImg(false);
                CCDDZExchangeService.instance.doChou(roomId);
                return;
            } else {
                //金豆场时间到了才可以抽
                if (this["canNewRed"]) {
                    if (winCnt) {
                        if (winCnt.chance >= 1) {
                            CCDDZExchangeService.instance.doChou(roomId);
                            return;
                        }
                    }
                }
            }
        } else if (this._roomInfo.roomFlag == 2) {
            if (roomId == 8003 || roomId == 8004) { //钻石中级和高级
                this._showNormalRedImg(false);
                CCDDZExchangeService.instance.doChou(roomId);
                return;
            } else {
                if (winCnt) {
                    if (winCnt.chance >= 1) {
                        CCDDZExchangeService.instance.doChou(roomId);
                        return;
                    }
                }
            }
        }

        this._tipNewRedInfo();
    }

    /**
     * 设置桌子上的红包描述
     */
    private _setTableRedInfo(): void {
        if (ccserver.isMatch || ccserver.isPersonalGame) return;
        let sText = "";
        let roomId = this._roomInfo.roomID;
        let cnt: number = CCDDZMainLogic.instance.selfData.getRoomRedWinCnt(roomId);


        if (this._roomInfo.roomFlag == 1) {
            sText = "赢" + cnt + "局抽奖杯 ";
        } else if (this._roomInfo.roomFlag == 2) {
            if (this._roomInfo.rewardwinround) {
                sText = "赢" + this._roomInfo.rewardwinround + "局抽奖杯";
            } else {
                sText = "玩" + cnt + "局抽奖杯";
            }
        }
        this["labRedInfo"].text = sText;
    }

    /**
     * 计算要多久才可以领取奖杯
     */
    private _getNeedPlayInfo(): any {
        let roomId = this._roomInfo.roomID;
        let winCnt: any = CCDDZMainLogic.instance.selfData.getRoomWinCntInfo(roomId);

        let cnt = 1;
        if (roomId == 1000) {
            cnt = 3;
        }
        if (winCnt) {
            if (this._roomInfo.roomFlag == 1 || this._roomInfo.rewardwinround) {
                cnt = this.getRedCoinLackCnt();
            } else {
                if (roomId == 1000) {
                    if (winCnt.getchance >= 2) {
                        cnt = 3 - (winCnt.cnt || 0);
                    } else {
                        cnt = ((winCnt.getchance || 0) + 1 - (winCnt.cnt || 0));
                    }
                } else {
                    cnt = 1 - (winCnt.cnt || 0);
                }

            }
        }
        return cnt;
    }

    /**
     * 奖杯不足时的提示
     */
    private _tipNewRedInfo(): void {
        let sText: string = "";
        //let winCnt:any = CCDDZMainLogic.instance.selfData.getRoomWinCntInfo(this._roomInfo.roomID);
        let info = this._getNeedPlayInfo();
        if (this._roomInfo.roomFlag == 1) {
            sText = "再赢" + info + "局即可获得奖杯";
        } else if (this._roomInfo.roomFlag == 2) {
            sText = "再玩" + info + "局即可获得奖杯";
        }
        CCDDZToast.show(sText);
    }

    /**
     * 设置红包当前累计的值
     */
    private _setNewRedHasNum(): void {
        let num = this["hasRedNum"] || 0.00;
        let obj = this["lblAward"];
        let sVal = "" + num;
        obj.text = sVal;
    }

    /**
     * 显示当前的红包累计
     */
    private _showNewRedHas(bShow: boolean): void {
        this["lblAward"].visible = bShow;
    }

    /**
     * 显示抽奖杯
     */
    private _showNormalRedImg(bShow: boolean): void {
        this.redNormal_img.visible = bShow;
    }

    /**
     * 满3局抽红包
     */
    private _initNewRedProcess(): void {
        let roomId = this._roomInfo.roomID;
        if (roomId == 1001 || roomId == 1002 || roomId == 8001 || roomId == 1006)
            return;

        let obj = this["lblAwardStatus"];
        this._clearRedNormalInterval();
        this._showNormalRedImg(false);
        let winCnt: any = CCDDZMainLogic.instance.selfData.getRoomWinCntInfo(roomId);
        console.log("_initNewRedProcess==================>", winCnt);
        if (this._roomInfo.roomFlag == 1) {
            this._setNewRedNum(0);
            this["lblRound"].visible = false;
            let times = this._getNearestRedOpenTime();
            obj.text = times.min + ":" + times.sec;
            let min = times.min;
            let sec = times.sec;
            let sMin = "";
            let sSec = "";
            this["newRedTime"] = times;
            if (winCnt) {
                if (winCnt.time && winCnt.chance >= 1) {
                    if (ccserver.tsServer >= winCnt.time) {
                        this["canNewRed"] = true;
                        this._onHasRedChance();
                    }
                }
            }

            this._redNormalNum = egret.setInterval(() => {
                sec -= 1;
                times.totS -= 1;
                if (sec <= 0) {
                    sec = 59;
                    min -= 1;
                    if (min <= -1) {
                        sec = 0
                        min = 0;
                        times.totS = 0;
                        let winCnt: any = CCDDZMainLogic.instance.selfData.getRoomWinCntInfo(roomId);
                        //有抽奖机会
                        if (winCnt && winCnt.chance >= 1) {
                            this["canNewRed"] = true;
                            this._onHasRedChance();
                        }
                        this._initNewRedProcess();
                    }
                }
                sSec = sec;
                if (sec < 10) {
                    sSec = "0" + sec;
                }
                obj.text = min + ":" + sSec;
            }, this, 1000);
        } else if (this._roomInfo.roomFlag == 2) {
            let chance = 0;
            this["lblRound"].visible = true;
            if (winCnt) {
                let cnt = (winCnt.cnt || 0) + 1;
                chance = winCnt.chance || 0;
                if (roomId == 1000) {
                    if (winCnt.getchance < 2) {
                        if (cnt > (winCnt.getchance + 1)) {
                            cnt = (winCnt.getchance + 1);
                        }
                        obj.text = cnt + "/" + (winCnt.getchance + 1);
                    } else {
                        if (cnt > 3) {
                            cnt = 3;
                        }
                        obj.text = cnt + "/3";
                    }
                } else {
                    obj.text = "1/1";
                }
            } else {
                if (roomId == 1000) {
                    obj.text = "1/1";
                } else {
                    obj.text = "1/1";
                }
            }

            if (chance >= 1) {
                this._onHasRedChance();
            } else {
                this._stopNewRedAni();
                this._showNormalRedImg(false);
            }
            this._setNewRedNum(chance);
        }
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
     * 计算出最新一期的开奖时间
     */
    private _getNearestRedOpenTime(): any {
        let nCur = CCalien.CCDDZUtils.getCurTimeStamp();
        let date = new Date(nCur);
        let min = date.getMinutes();
        let sec = date.getSeconds();
        let rate = Math.floor(min / 5);
        let next = rate * 5 + 4;
        let diffM = next - min;
        let diffS = 60 - sec;
        let totSec = diffM * 60 + diffS;
        return { min: diffM, sec: diffS, totS: totSec };
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
        //console.log("onRedNormalMoneyInfoRep----scenePlay------>",data);
        if (data.optype == 1) { //抽到的红包金额
            if (data.result == null) {
                this.fastRedValue = data.params;
                let value = CCDDZUtils.exchangeRatio(data.params / 100, true);
                CCDDZAlert.show("恭喜获得" + value + "奖杯!");
            }
        }
        else if (data.optype == 3) { //领取新手钻石奖励成功
            /*if(data.result == null){
                let _str = "恭喜您，成功领取新手钻石奖励:" + data.params + "钻"
                CCDDZMainLogic.instance.selfData.setHasGetNewDiamond();
                CCDDZAlert.show(_str,0,function(){
                    if(!ccserver.playing && this._roomInfo && this._roomInfo.roomID== 1000){ //极速场 
                        let _nDiamond = CCDDZBagService.instance.getItemCountById(3);
                        if(this._roomInfo.minScore >_nDiamond){
                            CCDDZMainLogic.instance.ifBuyReviveMaxTipShop(this._roomInfo.minScore);
                            return;
                        }
                        else{
                            this.sendQuickJoin();
                        }
                    }
                }.bind(this));
            }
            */
        }
    }

    private onAlertBtn(action: string, data: any): void {
        if (action == 'cancel') {
            let code: number = this.fastRedValue;
            let shareScene: number = CCDDZShareImageManager.instance.getShareScene(CCDDZShareImageManager.GAME_TYPE_FAST, code);
            CCDDZShareImageManager.instance.start(ccserver.uid, shareScene);
        }
    }

    /**
     * 购买复活礼包成功
     */
    private _onBuyReviveSucc(): void {
        this.sendQuickJoin();
    }

    /**
     * 显示极速场或者是高级场的规则
     */
    private _showRedNormalRule(): void {
        let _text = "";
        if (this._roomInfo.roomID == 1000) {
            _text = "福袋规则：不限时3局场，不限制时间，只要完成3局就能福袋抽奖杯。\n"
                + "特殊情况：\n"
                + "       1）中途退出游戏：不限时3局场，退出游戏如果不超过120分钟，游戏局数会保留，超过120分钟，局数清零。\n"
                + "       2）钻石不足赔付的处理：您（玩家）拥有多少钻石，只能产生这些钻石的输赢，系统不额外抽取，也不额外赔偿。\n"
                + "服务费：每局游戏会收取一定的服务费\n"
        } else if (this._roomInfo.roomID == 1001) { //休闲场
            _text = "1）发牌：一副牌54张，一人17张，留3张做底牌，在确定地主之前玩家不能看底牌，地主确定后，底牌亮出，底牌分给地主。\n"
                + "2）牌型大小：\n"
                + "         火箭：最大，可以压制任意其他的牌。\n"
                + "         炸弹：只比火箭小，比其他都大。同是炸弹按牌的值比大小。\n"
                + "         单牌大小：大王>小王>2>A>K>Q>J>10>9>8>7>6>5>4>3（不分花色）。\n"
                + "         对牌、三张牌、飞机都按牌的值进行大小比较。"
                + "抽奖杯规则：赢5局抽一次奖杯。\n"
                + "特殊情况：\n"
                + "        您（玩家）拥有多少金豆，只能产生这些金豆的输赢，系统不额外抽取，也不额外赔偿\n"

        } else if (this._roomInfo.roomID == 1002) {//初级场
            _text = ""
                + "抽奖杯规则：赢3局抽一次奖杯。\n"
                + "特殊情况：\n"
                + "        您（玩家）拥有多少金豆，只能产生这些金豆的输赢，系统不额外抽取，也不额外赔偿\n"
                + "服务费：每局游戏会收取一定的服务费\n"
        } else if (this._roomInfo.roomID == 8001 || this._roomInfo.roomID == 8002) {//金豆中高级场
            _text = "游戏规则：2人进行游戏，一副扑克牌，两人每人发17张牌，剩余20张牌中3张为地主牌，其余17张为弃牌。\n"
                + "让牌规则：抢地主时，每抢1次地主加一张让牌数，最多可抢5次，即最多让5张牌。比如地主让牌4张，农名出到手牌≤4张的时候，游戏结束，农民胜利。\n"
                + "抽奖杯规则：赢1局抽一次奖杯。\n"
                + "特殊情况：\n"
                + "                您（玩家）拥有多少金豆，只能产生这些金豆的输赢，系统不额外抽取，也不额外赔偿\n"
                + "服务费：每局游戏会收取一定的服务费。\n"
        } else if (this._roomInfo.roomID == 8003 || this._roomInfo.roomID == 8004) {//钻石中高级场
            _text = "福袋规则：不限时1局场，不限制时间，只要完成1局就能福袋抽奖杯。\n"
                + "特殊情况：\n"
                + "        1）中途退出游戏：不限时1局场。\n"
                + "        2）钻石不足赔付的处理：您（玩家）拥有多少钻石，只能产生这些钻石的输赢，系统不额外抽取，也不额外赔偿。\n"
                + "服务费：每局游戏会收取一定的服务费。\n"
        } else if (this._roomInfo.roomID == 1006) {
            _text = "福袋规则：不限时1局场，不限制时间，只要赢1局就能福袋抽奖杯。\n"
                + "特殊情况：\n"
                + "        1）中途退出游戏：不限时1局场。\n"
                + "        2）钻石不足赔付的处理：您（玩家）拥有多少钻石，只能产生这些钻石的输赢，系统不额外抽取，也不额外赔偿。\n"
                + "服务费：每局游戏会收取一定的服务费。\n"
        }
        else {
            return;
        }

        CCDDZAlert.show(_text, 0, null, "left");
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
        CCDDZMainLogic.backToRoomScene();
    }

    /**
     * 商城金豆
     */
    private _onClickGold(): void {
        CCDDZPanelExchange2.instance.show();
    }

    /**
     * 商城钻石
     */
    private _onClickDiamond(): void {
        CCDDZPanelExchange2.instance.show(1);
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
        ccserver.giveUpMatch(this._roomInfo.matchId);
        CCDDZPanelMatchRevive.remove();
        if (!this._showMatchResult(_data)) { //没有展示比赛结果
            CCDDZMainLogic.backToRoomScene();
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
        let _ins = CCDDZPanelMatchRevive.getInstance();
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

        let _gold = CCDDZMainLogic.instance.selfData.getGold();
        let _revive = function () {
            if (_gold < _data.params[2]) {//金豆不足
                CCDDZImgToast.instance.show(_ins, "金豆不足");
            } else {
                ccserver.reqMatchRevive();
            }
        }

        _ins.show(_revive.bind(this), _giveUp.bind(this));
        _ins.setRankSub(_rankSub);
        _ins.setReviveCost(_data.params[2]);
        _ins.updateCountDown(_nTime);
    }
}