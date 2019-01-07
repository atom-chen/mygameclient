class SceneCmpChicken extends CCalien.CCDDZSceneBase {
    private static STATUS_ADDCARD1: number = 1;
    private static STATUS_ADDCARD2: number = 2;

    protected myGold: CCGold;
    protected myDiamond: CCGold;
    protected myRedCoin: CCGold;
    private backBtn: eui.Button;
    private bgmBtn: eui.Image;
    private ruleBtn: eui.Image;
    protected ticket: eui.Label;
    private baseScore: eui.Label;
    private startBtn: CCLabelButton;
    private continueBtn: CCLabelButton;
    private changeBtn: CCLabelButton;

    private clock: CCClock;
    private player1: CCPlayerUI;
    private player2: CCPlayerUI;
    private player3: CCPlayerUI;
    private player4: CCPlayerUI;
    private player5: CCPlayerUI;
    private labWaiting: eui.Label;

    private matchWait: eui.Group;
    private chooseCard: CCChooseCard;
    private isOneGameEnd: Boolean;
    private isChangeTable: Boolean;
    private isReconnect: Boolean;
    private session: number;
    private myName: string;
    private myImgId: string;
    private winSeatId: Array<number>;
    private selfSeatId: number;
    private gameStatus: number;
    private masterSeatId: number;

    private matchScore: number;
    private matchRound: number;
    private teamRound: number;
    private isMatchFirstTrun: boolean;
    private isGameEndEffectEnd: boolean;
    private matchLeftPlayer: number;
    private matchBaseScoreSave: number;

    private protoIndex = 0;
    private roomType = 1;
    private roomId = 1;
    private roomBaseScroe = 1;
    private roomMinScore = 1;
    private roomMaxScore = 1;
    private kickbacks = 1;
    private isMatch = false;
    private isMatchEnd = false;
    private matchId = 0;
    private isTeam = false;
    private players = null;
    private selfGold = 0;
    private isGameStart = false;
    private isInGame = false;
    private _isPlayer3LeaveTable = false;
    private roomsInfo = null;
    private checkGoldTime = null;
    protected static goldPool: CCObjectPool;

    /**
     * 红包场抽红包的倒计时
     */
    private _redNormalNum: number;

    private grpRed: eui.Group;
    /**
     * 右下角的红包按钮
     */
    private mRed_img: eui.Image;
    /**
     * 红包个数的背景
     */
    private redCountBg_img: eui.Image;
    private redCount: eui.Label;
    private redList: eui.List;
    private redListDataProvider: eui.ArrayCollection;
    private redListDataArr: Array<number>;
    /**
     * 红包场的抽红包按钮
     */
    private redNormal_img: eui.Image;
    /**
     * 是否赢满5局
     */
    private _isOverFive: boolean;

    private isLobbyGoldEnough: boolean;

    /**
     * 是否是金豆不足的情况
     */
    private goldNotEnough: boolean;

    private lblStatus: CCStatusLabel;
    private start_bg: eui.Image;
    private start_word: eui.Image;
    private _isInQuickJoin: boolean = false;

    constructor() {
        super();

        this.skinName = scenes.SceneCmpChickenSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemoveStage, this);
    }
    private _onAddStage(): void {
    }

    private _onRemoveStage(): void {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this._onAddStage, this);
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemoveStage, this);
    }

    private _initListen(bAdd: boolean): void {
        let func = "addEventListener";
        if (!bAdd) {
            func = "removeEventListener";
        }
        ccserver[func](CCEventNames.USER_QUICK_JOIN_RESPONSE, this.quickJoinResonpseHandle, this);
        ccserver[func](CCEventNames.GAME_GIVE_UP_GAME_REP, this.giveUpGameHandle, this);
        ccserver[func](CCEventNames.GAME_ASK_READY, this.askReadyHandle, this);
        ccserver[func](CCEventNames.GAME_ENTER_TABLE, this.enterTableHandle, this);
        ccserver[func](CCEventNames.GAME_TABLE_INFO, this.tableInfoHandle, this);
        ccserver[func](CCEventNames.GAME_USER_INFO_IN_GAME_REP, this.userInfoInGameRepHandle, this);
        ccserver[func](CCEventNames.GAME_LEAVE_TABLE, this.leaveTableHandle, this);
        ccserver[func](CCEventNames.GAME_GET_READY_REP, this.getReadyRepHandle, this);
        ccserver[func](CCEventNames.GAME_GAME_START_NTF, this.gameStartNtfHandle, this);
        ccserver[func](CCEventNames.GAME_ADD_CARD, this.addCardHandle, this);
        ccserver[func](CCEventNames.GAME_SET_SCORE, this.setScoreHandle, this);
        ccserver[func](CCEventNames.GAME_USE_CARD_NTF, this.useCardNtfHandle, this);
        ccserver[func](CCEventNames.GAME_SHOW_CARD, this.showCardHandle, this);
        ccserver[func](CCEventNames.GAME_GAME_END, this.gameEndHandle, this);
        ccserver[func](CCEventNames.GAME_UPDATE_GAME_INFO, this.updateGameInfoHandle, this);
        ccserver[func](CCEventNames.GAME_OPERATE_REP, this.onGameOperateRep, this);
        ccserver[func](CCEventNames.USER_RECONNECT_TABLE_REP, this.reconnectTableRepHandle, this);
        ccserver[func](CCEventNames.GAME_RECONNECT_REP, this.reconnectRepHandle, this);

        ccserver[func](CCEventNames.USER_BAG_INFO_REP, this.onBagInfoRep, this);

        ccserver[func](CCGlobalEventNames.USER_LOTTERY_RED_COIN_REP, this.onLotteryRedCoinRep, this);

        this.backBtn[func](egret.TouchEvent.TOUCH_TAP, this.onBackClick, this);
        this.bgmBtn[func](egret.TouchEvent.TOUCH_TAP, this.onBgmClick, this);
        this.ruleBtn[func](egret.TouchEvent.TOUCH_TAP, this._showpanelRule, this);
        this.startBtn[func](egret.TouchEvent.TOUCH_TAP, this.onStartBtnClick, this);
        this.continueBtn[func](egret.TouchEvent.TOUCH_TAP, this.onContinueBtnClick, this);
        this.changeBtn[func](egret.TouchEvent.TOUCH_TAP, this.onChangeBtnClick, this);
        this.mRed_img[func](egret.TouchEvent.TOUCH_TAP, this._onClickRed, this);
        this.redNormal_img[func](egret.TouchEvent.TOUCH_TAP, this._onClickRedNormal, this);
        CCalien.CCDDZDispatcher[func](CCGlobalEventNames.MY_USER_INFO_UPDATE, this._updateMyUserInfo, this);
        CCalien.CCDDZDispatcher[func](CCGlobalEventNames.BAG_INFO_REFRESH, this._onBagRefresh, this);
        CCalien.CCDDZDispatcher[func](CCGlobalEventNames.USER_RED_COUNT_CHANGE, this._onUserRedCountChange, this);
        CCalien.CCDDZDispatcher[func](CCEventNames.STRART_COMPARISON, this._startComparison, this);
        CCalien.CCDDZDispatcher[func](CCEventNames.CC_SHOW_SCORECHANGE, this._showScoreChange, this);
        CCalien.CCDDZDispatcher[func](CCEventNames.CC_SHOW_HAPPY_SCORE, this._updateHappyScoreData, this);
        CCalien.CCDDZDispatcher[func](CCEventNames.CC_SHOW_NEXT_HAPPY_SCORE, this._showNextHappyScore, this);
        CCalien.CCDDZDispatcher[func](CCEventNames.CC_SEND_GIVE_UP_MSG, this._sendGiveUpGame, this);
    }

    private onBagInfoRep(event: egret.Event): void {
        let data: any = event.data;

        CCDDZBagService.instance.bagItemArray.forEach((item: CCDDZBagItemData) => {
            item.count = 0;
        });
        data.items.forEach((item: any) => {
            CCDDZBagService.instance.updateItemByData(item);
        });

        CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.BAG_INFO_REFRESH, false);
    }

    protected initData(): void {
        if (!SceneCmpChicken.goldPool)
            SceneCmpChicken.goldPool = CCObjectPool.getInstance(egret.getDefinitionByName("CCDDZFlyGold"));

        this.isLobbyGoldEnough = true;
        this._isInQuickJoin = false;
        this._redNormalNum = null;
        this.protoIndex = 0;
        this.kickbacks = this.roomsInfo.kickbacks;
        this.ticket.visible = false;
        this.isMatch = false;
        this.isMatchEnd = false;
        this.players = null;
        this.goldNotEnough = false;
        this.matchId = 0;
        this.isTeam = false;
        this.backBtn.visible = !this.isTeam;
        this.matchLeftPlayer = 0;
        this.matchScore = 0;
        this.matchRound = 0;
        this.teamRound = 0;
        this.baseScore.text = "";
        this.setBaseScore();
        this.clearUI(true);
        this.showCCBtns(false);
        this.clock.init();
        CCGameConfig.addHappyScoreTimes = 0;
        this.startBtn.visible = false;

        this.refreshBgmStatus();
        this.setRedProcess();
        this.updateSelfData();
    }

    protected createChildren(): void {
        super.createChildren();
        this.redListDataArr = [0, 0, 0, 0, 0];
        this.redListDataProvider = new eui.ArrayCollection(this.redListDataArr);
        this.redList.itemRenderer = CCDDZRedPacketProcess;
        this.redList.dataProvider = this.redListDataProvider;
    }

    beforeShow(params: any, back: boolean): void {
        console.log("beforeShow--------->", params);
        CCGameConfig.init();
        let roomId = 0;
        if (!params.roomID) {
            roomId = 10001;
        }
        else {
            roomId = params.roomID;
        }

        let _roomInfo: any = CCGlobalGameConfig.getRoomCfgFromAll(roomId);
        this.roomsInfo = _roomInfo;
        this.roomType = _roomInfo.roomType;
        this.roomId = _roomInfo.roomID;

        this.roomBaseScroe = _roomInfo.baseScore;
        this.roomMinScore = _roomInfo.minScore;
        this.roomMaxScore = _roomInfo.maxScore;
        this.initData();
        this._initListen(true);
        this.setlabWaiting(null);
        this._showRedCount(false);
        this.redNormal_img.visible = false;
        this.grpRed.visible = true;
        this.redList.visible = true;
        CCDDZMainLogic.instance.setScreenLandScape(1280, 640);
        CCalien.CCDDZSoundManager.instance.playMusic("cc_bg_mp3");
        CCDDZBagService.instance.refreshBagInfo();
    }

    protected onShow(params: any = null): void {
        console.log("onShow--------->", params);
        switch (params.action) {
            case 'quick_join':
                console.log("onShow---------->quick_join")
                this.checkEnoughSendQuickJoin();
                // this.startBtn.visible = true;
                break;
            case 'reconnect':
                console.log("onShow---------->reconnect")
                ccserver.reconnect(0);
                break;
            case 'from_login':
                if (ccserver._isFirstFromDDZ == true) {
                    console.log("onShow---------->from_login")
                    ccserver._isFirstFromDDZ = false;
                }
                this.startBtn.visible = true;
                break;
        }

        if (ccserver._isFirstFromDDZ == true) {
            ccserver._isFirstFromDDZ = false;
        }
        ccserver.isMatch = false;
        ccserver.isPersonalGame = false;

        CCDDZBagService.instance.refreshBagInfo();
    }

    beforeHide(params: any = null, back: boolean = false): void {
        this._initListen(false);
        ccserver.stopCache();
    }

    private _updateMyUserInfo(): void {
        let _data = CCDDZMainLogic.instance.selfData;
        let _redcoin = _data.redcoin;
        this.myGold.updateGold(Number(_data.gold));
        this.myRedCoin.updateGold(Number(_redcoin / 100));
        // console.log("_updateMyUserInfo------11-------->", _data.gold, _data.redcoin)
        let player: CCPlayerData = this.getPlayerBySeatId(this.selfSeatId);
        if (player) {
            player.gold = "" + _data.gold;
            // console.log("_updateMyUserInfo------22------------>", player.gold, this.isOneGameEnd, this.goldNotEnough, this.roomMinScore);
            this.myGold.updateGold(Number(player.gold));
        }
        this.updateRedCoinInfo();
        this.setRedProcess();
    }

    private _onBagRefresh(e: egret.Event) {
        let _nDiamond: any = CCDDZBagService.instance.getItemCountById(3);
        this.myDiamond.updateGold(Number(_nDiamond));
    }

    /**
     * 显示三条的规则
     */
    private _showpanelRule(): void {
        CCPanelRule.instance.show();
    }

    /**
     * 清除检测进步不足的timer
     */
    private _clearCheckGoldTime(): void {
        if (this.checkGoldTime) {
            egret.clearTimeout(this.checkGoldTime);
        }
        this.checkGoldTime = null;
    }

    protected onBackClick(e: egret.TouchEvent): void {
        if (this.isInGame == true) {
            let _str = "牌局暂未结束，确定要退出吗？" //根据游戏不同的状态显示不同的提示  
            CCAlert.show(_str, 1, (act) => {
                console.log("click---111--", act);
                if (act == "confirm") { //确定前往
                    this.quitGameToMain();
                } else {

                }
            })
        }
        else {
            let _str = ""
            if (CCGameConfig.isShowScoreChange == false) {
                _str = "牌局暂未结束，确定要退出吗？" //根据游戏不同的状态显示不同的提示  
            }
            else {
                _str = "确认离开房间？"
            }
            CCAlert.show(_str, 1, (act) => {
                console.log("click--222---", act);
                if (act == "confirm") { //确定前往
                    this.quitGameToMain();
                } else {

                }
            })
        }
    }

    private onBgmClick(e: egret.TouchEvent): void {
        CCDDZSoundManager.instance.switchMusic();
        this.refreshBgmStatus();
    }

    private refreshBgmStatus(): void {
        this.bgmBtn.source = (CCDDZSoundManager.instance.musicMute ? "cc_play_voice_btn_off" : "cc_play_voice_btn_on");
        if (CCDDZSoundManager.instance.musicMute == true) {
            CCDDZSoundManager.instance.playMusic("");
        }
        else {
            CCDDZSoundManager.instance.playMusic("cc_bg_mp3");
        }
    }

    private updateSelfData(): void {
        let _selfData = CCDDZMainLogic.instance.selfData;
        this.myGold.updateGold(Number(_selfData.gold));
        this.myRedCoin.updateGold(Number(_selfData.redcoin / 100));
        let _diamond = CCDDZBagService.instance.getItemCountById(3);
        if (!_diamond) _diamond = 0;
        this.myDiamond.updateGold(_diamond);
        this.player1.currentState = "my";
        this.player1.updateUserInfoData(CCDDZMainLogic.instance.selfData);
        this.player1.setHeadTouch(true)
    }

    private onStartBtnClick(e: egret.TouchEvent): void {
        this.goldNotEnough = false;
        this.clock.stopTimer();
        this.checkEnoughSendQuickJoin(CCDDZMainLogic.instance.selfData.gold);
        // this.quickJoinTest();
    }

    private onContinueBtnClick(e: egret.TouchEvent): void {
        this.showCCBtns(false);
        this.hideLblChanges();
        this.clock.stopTimer();
        // this.resetPlayersStatus();
        this.checkEnoughSendGetReady();
        // this.getReady();
    }

    private resetPlayersStatus() {

        this.player1.currentState = "my";
        this.player1.validateNow();

        this.player2.currentState = "rightChoose";
        this.player2.playerCardView.currentState = "chooseRight"
        this.player2.playerCardView.visible = false;
        this.player2.validateNow();

        this.player3.currentState = "rightChoose";
        this.player3.playerCardView.currentState = "chooseRight"
        this.player3.playerCardView.visible = false;
        this.player3.validateNow();

        this.player4.currentState = "leftChoose";
        this.player4.playerCardView.currentState = "chooseLeft"
        this.player4.playerCardView.visible = false;
        this.player4.validateNow();

        this.player5.currentState = "leftChoose";
        this.player5.playerCardView.currentState = "chooseLeft"
        this.player5.playerCardView.visible = false;
        this.player5.validateNow();
    }

    private onChangeBtnClick(e: egret.TouchEvent): void {
        this.isChangeTable = true;
        this.hideLblChanges();
        this.giveUpGame(3);
        this.showCCBtns(false);
        this.setlabWaiting('正在为您匹配对手...');
    }

    /**
     * 点击红包按钮
     */
    private _onClickRed(): void {
        let _num = Number(this.redCount.text);
        let canChou = CCDDZMainLogic.instance.selfData.getRoomCanGetRed(this.roomsInfo.roomID);
        if (canChou) {
            this.doChou(this.roomsInfo.roomID)
            return;
        }
        if (_num <= 0) {
            let _needWinCnt = CCDDZMainLogic.instance.selfData.getRoomNeedWinCntGetRed(this.roomsInfo.roomID);
            if (this.roomsInfo.roomID == 10001 || this.roomsInfo.roomID == 10002 || this.roomsInfo.roomID == 10003) {
                CCDDZToast.show("游戏再赢" + _needWinCnt + "局即可抽取");
            }
            else if (this.roomsInfo.roomID == 10004 || this.roomsInfo.roomID == 10005 || this.roomsInfo.roomID == 10006) {
                CCDDZToast.show("游戏再玩" + _needWinCnt + "局即可抽取");
            }
            return;
        }
        this.doChou(this.roomsInfo.roomID)
    }

    /**
     * 点击抽红包 
     */
    private _onClickRedNormal(): void {
        console.log("_onClickRedNormal---------->", ccserver.isMatch, ccserver.isPersonalGame)
        if (!ccserver.isMatch && !ccserver.isPersonalGame) {
            this.doChou(this.roomsInfo.roomID)
        }
        this._stopNewRedAni();
        this._showNormalRedImg(false);
    }

    private lotteryIndex = null;

    private doChou(roomid: number): void {
        console.log("doChou------------->", this.lotteryIndex, roomid);
        if (this.lotteryIndex != null)
            return
        this.lotteryIndex = roomid;
        ccserver.lotteryRedCoinReq(roomid);
    }

    private _stopNewRedAni(): void {
        egret.Tween.removeTweens(this["redNormal_img"]);
        this["redNormal_img"].rotation = 0;
    }

    /**
    * 显示抽奖杯
    */
    private _showNormalRedImg(bShow: boolean): void {
        this.redNormal_img.visible = bShow;
    }

    private onLotteryRedCoinRep(e: egret.Event): void {
        if (e.data.result == 0) {
            this.setRedProcess();
            this.updateRedCoinInfo();
            let data: any = e.data;
            switch (data.result) {
                case 0:
                    ccserver.getRedcoinRankingListReq();
                    CCAlert.show("恭喜获得" + CCDDZUtils.exchangeRatio(data.coin / 100, true) + "奖杯!");
                    break;
                case 1:
                    CCAlert.show("配置不存在");
                    break;
                case 2:
                    CCAlert.show("抽奖次数不足");
                    break;
                case 3:
                    CCAlert.show("你有未完成的兑换");
                    break;
            }
        }
        this.lotteryIndex = null
        console.log("onLotteryRedCoinRep---------->", this.lotteryIndex);
    }

    private setRedProcess(bGameEnd: boolean = false): void {
        if (!ccserver.isMatch && !ccserver.isPersonalGame) {
            let roomId = this.roomsInfo.roomID;
            let letitgo = false;
            if (roomId == 10001 || roomId == 10002 ||
                this.roomsInfo.roomID == 10003 || this.roomsInfo.roomID == 10004 || this.roomsInfo.roomID == 10005
                || this.roomsInfo.roomID == 10006) {
                letitgo = false;
            }
            else {
                letitgo = true;
            }
            if (letitgo == true) return;
            let redPDef = [0, 0, 0, 0, 0];
            let redPOver = [1, 1, 1, 1, 1];
            let nWinTot = 5;
            let srcPng = "cc_play_btn_chou";
            if (roomId == 10002) {
                nWinTot = 3;
                redPDef = [0, 0, 0];
                redPOver = [1, 1, 1];
                srcPng = "cc_play_btn_chou2";

            }
            else if (roomId == 10003) {
                redPDef = [0];
                redPOver = [1];
                nWinTot = 1;
                srcPng = "cc_play_btn_chou3";
            }
            else if (roomId == 10004) {
                redPDef = [0, 0, 0];
                redPOver = [1, 1, 1];
                nWinTot = 3;
                srcPng = "cc_room_btn_chou4";
            }
            else if (roomId == 10005) {
                redPDef = [0, 0];
                redPOver = [1, 1];
                nWinTot = 2;
                srcPng = "cc_room_btn_chou5";
            }
            else if (roomId == 10006) {
                redPDef = [0];
                redPOver = [1];
                nWinTot = 1;
                srcPng = "cc_room_btn_chou6";
            }
            this["mRed_img"].source = srcPng;
            let _mainIns = CCDDZMainLogic.instance;
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
            if (this._isOverFive && bGameEnd) {
                this.redListDataArr = redPOver;
            }
            else {
                count = (count > nWinTot ? nWinTot : count);
                for (var j: number = 0; j < count; j++) {
                    this.redListDataArr[j] = 1;
                }
            }

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
        let _mainIns = CCDDZMainLogic.instance;
        let roomId = this.roomsInfo.roomID;
        let _winCntInfo = _mainIns.selfData.getRoomWinCntInfo(roomId);
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

    private updateRedCoinInfo() {
        let _selfData = CCDDZMainLogic.instance.selfData;
        let conf = CCGlobalGameConfig.exchangeConfig.filter((item: any) => {
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

        this.myRedCoin.updateGold(redcoin);
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

    private showStartGameAni() {
        CCDDZSoundManager.instance.playEffect(CCResNames.cc_start);
        this.start_bg.x = -CCalien.CCDDZStageProxy.width;
        this.start_bg.scaleY = 1;
        this.start_bg.visible = true;
        this.start_bg.alpha = 0;
        egret.Tween.get(this.start_bg).to({ x: 0, alpha: 0.5 }, 200)
            .to({ alpha: 1 }, 300)
            .wait(800)
            .to({ scaleY: 0.2, alpha: 0, visible: false }, 500);

        this.start_word.visible = true;
        this.start_word.scaleX = 3;
        this.start_word.scaleY = 3;
        this.start_word.alpha = 0;
        this.start_word.horizontalCenter = 0;
        this.start_word.verticalCenter = 0;
        egret.Tween.get(this.start_word).to({ scaleX: 1, scaleY: 1, alpha: 0.5 }, 200)
            .to({ alpha: 1 }, 300)
            .wait(800)
            .to({ alpha: 0, verticalCenter: -250, visible: false }, 500);
    }

    private stopStartGameAni() {
        this.start_bg.visible = false;
        this.start_word.visible = false;
        egret.Tween.removeTweens(this.start_bg);
        egret.Tween.removeTweens(this.start_word);
    }

    private startGameTest() {
        this.player1.currentState = "my";
        this.chooseCard.visible = true;
        // [133, 103, 83, 112, 82, 22, 43, 33, 21, 40]
        let cardids = [133, 132, 131, 123, 122, 121, 113, 112, 111, 103]
        this.chooseCard.addCards(cardids, true, true)

        this.player2.currentState = "rightChoose"
        this.player2.playerCardView.currentState = "chooseRight";
        this.player2.playerCardView.addCards();

        this.player3.currentState = "rightChoose"
        this.player3.playerCardView.currentState = "chooseRight";
        this.player3.playerCardView.addCards();

        this.player4.currentState = "leftChoose"
        this.player4.playerCardView.currentState = "chooseLeft";
        this.player4.playerCardView.addCards();

        this.player5.currentState = "leftChoose"
        this.player5.playerCardView.currentState = "chooseLeft";
        this.player5.playerCardView.addCards();
    }

    private _startComparison(e: egret.Event) {
        this.chooseCard.visible = false;
        // this.clock.stopTimer();
        // console.log("_startComparison---------->", e.data)
        if (e.data) {
            if (e.data.hassorted) {
                CCToast.instance.show(this, "道位摆放错误，系统已自动帮您调整。", { x: 0.5, y: 0.65 });
            }
            ccserver.send(CCEventNames.GAME_OPERATE_REQ, { optype: 1, params: e.data.cardsid });
        }
        // this.startComparisonTest(0);
    }

    /**
     * 播放本局的加减分动画
     */
    private playChangeEffect(_seatIdx: number, player: CCPlayerUI, change: number, kb: number, gold: number = 0, delay: number = 0): void {
        let score = change + kb;
        let seatIdx = _seatIdx;
        let lab: eui.BitmapLabel = this['labChange' + seatIdx];
        lab.font = (score > 0 ? "cc_font_num_17" : "cc_font_num_18");
        // let s: string = CCDDZUtils.getFormatGold(Math.abs(score));
        let s = Math.abs(score);
        lab.text = ((score > 0) ? ('+' + s) : ("-" + s))
        if (_seatIdx == 1) {
            let _resName = ((score > 0) ? CCResNames.cc_win : CCResNames.cc_lose);
            CCDDZSoundManager.instance.playEffect(_resName)
        }
        console.log("playChangeEffect--------->", s, lab.text, gold);
        lab.alpha = 0;
        lab.visible = true;
        egret.Tween.get(lab).wait(delay).to({ alpha: 1 }, 1000).call(this._changeEffectEnd.bind(this, player, change, kb, gold));
    }

    /**
     * 播放完加减分动画后更新金豆或者是体力
     */
    private _changeEffectEnd(player: CCPlayerUI, change: number, kb: number, gold: number): void {
        if (player != this.player1) {
            if (this._isPlayer3LeaveTable == true) {
                gold = 0;
            }
            player.updateGold(gold, true);
        }
        else {
            let _roomInfo = this.roomsInfo;
            if (_roomInfo.roomID == 10004 || _roomInfo.roomID == 10005 || _roomInfo.roomID == 10006) {
                this.myDiamond.updateGold(gold);
            }
        }
    }

    /**
     * 检测金豆是否不足
     */
    private checkGoldNotEnough(): boolean {
        if (CCDDZMainLogic.instance.selfData.gold < this.roomMinScore) {
            return true;
        }
        return false;
    }

    protected QuitWaitingQueueReq(): void {
        ccserver.send(CCEventNames.QUIT_WAITING_QUEUE_REQ, {});
    }

    protected giveUpGame(status: number): void {
        var msg: any = {};
        msg.status = status;
        msg.session = 0;
        ccserver.send(CCEventNames.GAME_GIVE_UP_GAME_REQ, msg);
    }

    private getReady(): void {
        var msg: any = {};
        ccserver.send(CCEventNames.GAME_GET_READY_REQ, msg);
    }

    /**
     * 检测是否高于踢出门槛
     */
    private _isEnoughChip(): boolean {
        let bEnough = false;
        let gold = CCDDZMainLogic.instance.selfData.gold;
        //console.log("_isEnoughChip======>",this.roomsInfo,gold);
        let kickScore = this.roomsInfo.kickScore;
        if (!kickScore) {
            kickScore = this.roomsInfo.minScore;
        }
        if (this.roomsInfo.roomFlag == 1) {
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
     * 检测是否高于最高门槛
     */
    private _isOverEnoughChip(): boolean {
        let bOver = false;
        let gold = CCDDZMainLogic.instance.selfData.gold;
        //console.log("_isEnoughChip======>",this.roomsInfo,gold);
        let maxScore = this.roomsInfo.maxScore;
        if (!maxScore) {
            maxScore = this.roomsInfo.maxScore;
        }
        if (this.roomsInfo.roomFlag == 1) {
            if (gold >= maxScore) {
                bOver = true;
            }
        } else {
            let diamond = CCDDZBagService.instance.getItemCountById(3);
            if (diamond >= maxScore) {
                bOver = true;
            }
        }
        return bOver;
    }

    /**
     * 检测是否高于踢出门槛
     */
    public checkEnoughSendQuickJoin(gold: number = 0): void {
        // this.startGameTest();
        // if (1) return;
        if (this._isEnoughChip()) {
            if (this._isOverEnoughChip()) {
                this.setlabWaiting(null);
                this.hideLblChanges();
                this.showCCBtns(false);
                CCDDZMainLogic.instance.enterGameItemIsOver(this.roomsInfo);
                this.startBtn.visible = true;
                return;
            }
            this.startBtn.visible = false;
            this.quickJoin(gold);
            this.resetPlayersStatus();
            this.hideLblChanges();
            this.player1.playerHead.setReadyFlagVisible(true);
            this.setlabWaiting('正在为您匹配对手...');
        } else {
            this.setlabWaiting(null);
            this.hideLblChanges();
            this.showCCBtns(false);
            CCDDZMainLogic.instance.enterGameItemNotEnough(this.roomsInfo);
            this.startBtn.visible = true;
        }
    }

    public checkEnoughSendGetReady(gold: number = 0): void {
        if (this._isEnoughChip()) {
            if (this._isOverEnoughChip()) {
                this.startBtn.visible = true;
                this.hideLblChanges();
                this.showCCBtns(false);
                CCDDZMainLogic.instance.enterGameItemIsOver(this.roomsInfo);
                return;
            }
            this.startBtn.visible = false;
            this.resetPlayersStatus();
            this.getReady();
            this.hideLblChanges();
        } else {
            this.startBtn.visible = true;
            this.hideLblChanges();
            this.showCCBtns(false);
            CCDDZMainLogic.instance.enterGameItemNotEnough(this.roomsInfo);
        }
    }

    protected quickJoin(gold: number = 0): void {
        var msg: any = {};
        this._isInQuickJoin = true;
        msg.roomid = this.roomId;
        msg.clientid = ccserver.uid;
        msg.gold = gold;
        if (gold != 0) {
            msg.flag = 1;
        }
        ccserver.send(CCEventNames.USER_QUICK_JOIN_REQUEST, msg);
    }

    private quitGameToMain(): void {
        CCDDZPanelPlayerInfo.remove();
        this._clearCheckGoldTime();
        console.log("quitGameToMain-------------->", this.isInGame, this._isInQuickJoin);
        if (!this.isInGame) {
            let _roomsinfo = this.roomsInfo;
            if (_roomsinfo.style && (_roomsinfo.style == 'diamond' || _roomsinfo.style == 'queue') && this._isInQuickJoin) {
                this.QuitWaitingQueueReq();
            }
            else {
                this.giveUpGame(0);
            }
        }
        this.chooseCard.visible = false;
        this.chooseCard.cleanAllCardGrps();
        this.player1.playerCardView.clearAllTimer();
        if (!this.player3 || !this.player3.playerCardView) {

        }
        else {
            this.player3.playerCardView.clearAllTimer();
        }
        this.stopStartGameAni();
        this._initListen(false);
        this.clearUI();
        ccserver.stopCache();
        CCalien.CCDDZSceneManager.show(CCGlobalSceneNames.ROOM, { jump2cc: true }, CCalien.CCDDZsceneEffect.CCDDFade);
    }

    private quickJoinResonpseHandle(e: egret.Event): void {
        var msg: any = e.data;
        console.log("快速加入游戏返回:" + msg.result);
        if (msg.result == 0) {
            //console.log("加入游戏成功");
            this.addGameView();
        }
        else if (msg.result == 2) { //金豆不足
            this.showGoldNotEnough();
            this.showCCBtns(false);
            this.startBtn.visible = true;
            this.setlabWaiting(null);
        }
        else if (msg.result == 3) { //房间满
            CCDDZAlert.show("房间已满，请稍后重试", 0, (act) => {
                this.quitGameToMain();
            })
        }
    }

    private giveUpGameHandle(e: egret.Event): void {
        var msg: any = e.data;
        //        if(msg.result == 0) {
        console.log("离开游戏");
        //        }
    }

    private setBaseScore(): void {
        if (!this.isMatch)
            this.baseScore.text = "房间底分：" + CCGoldStr.GoldFormat((this.roomBaseScroe).toString());
        else
            this.baseScore.text = "淘汰积分：" + this.matchScore;
    }

    protected clearUI(isFirstEnter: boolean = false): void {
        this.selfSeatId = 0;
        this.gameStatus = 0;
        this.masterSeatId = 0;
        this.isOneGameEnd = false;
        this.isChangeTable = false;
        this.clock.stopTimer();
        this.startBtn.visible = false;
        this.hideLblChanges();
        this.showPlayers(false);
    }

    private addGameView(): void {
        this._updateMyUserInfo();
    }

    private askReadyHandle(e: egret.Event): void {
        var msg: any = e.data;
        if (msg.flag == 1) {
            this.addGameView();
        }
        else {
            var msg: any = e.data;
            this.clock.Num = msg.time / 100;
            this.askReadyNow(msg);
            //this.getAlms();
            CCDDZMainLogic.instance.alms();
        }
    }

    private askReadyNow(msg: any): void {
        if (msg) {
            if (this.isMatch) {
                this.getReady();
            }
            else {
                this.isOneGameEnd = false;
            }
        }
    }

    protected getPlayerByUid(uid: number): CCPlayerData {
        if (!this.players)
            return null;
        for (var i: number = 0; i < this.players.length; i++) {
            if (this.players[i].uid == uid)
                return this.players[i];
        }
        return null;
    }

    private enterTableHandle(e: egret.Event): void {
        var msg: any = e.data;
        if (msg) {
            if (!this.players)
                this.players = new Array<CCPlayerData>();
            var player: CCPlayerData = this.getPlayerByUid(msg.uid);
            if (!player) {
                player = new CCPlayerData();
                this.players.push(player);
            }
            if (!msg.gold || !Number(msg.gold)) {
                player.gold = "0";
            } else {
                player.gold = msg.gold;
            }
            player.uid = msg.uid;
            player.seatid = msg.seatid;
            player.ready = 0;
            player["info"] = msg;
            this.getUserInfo(player.uid);
            CCDDZSoundManager.instance.playEffect(CCResNames.cc_enter);
            if (this.isMatch)
                this.checkShowMatchWait();
        }
    }

    private tableInfoHandle(e: egret.Event): void {
        var msg: any = e.data;
        console.log("tableInfoHandle------------->", msg)
        if (msg) {
            if (!this.players)
                this.players = new Array<CCPlayerData>();
            for (var i: number = 0; i < msg.players.length; i++) {
                if (msg.players[i].uid) {
                    var player: CCPlayerData = this.getPlayerByUid(msg.players[i].uid);
                    if (!player) {
                        player = new CCPlayerData();
                        this.players.push(player);
                    }
                    player["info"] = msg.players[i];
                    player.uid = msg.players[i].uid;
                    player.seatid = msg.players[i].seatid;
                    if (this.isGameStart)
                        player.ready = 0;
                    else
                        player.ready = msg.players[i].ready;
                    console.log("this.getUserInfo(-------->", player.uid);
                    this.getUserInfo(player.uid);

                    if (msg.players[i].uid == ccserver.uid) {
                        this.selfSeatId = player.seatid;
                    }
                }
            }
            if (this.isMatch)
                this.checkShowMatchWait();
        }
    }

    protected showGoldNotEnough(): void {
        CCDDZPanelAlert3.instance.show("金豆不足" + this.roomMinScore + "，是否前往商城购买？", 1, (act) => {
            if (act == "confirm") {
                if (ccserver._isInDDZ) {
                    this.openDDZShop();
                }
                else {
                    CCDDZPanelExchange2.instance.show();
                }
            } else {
                this.quitGameToMain();
            }
        })
    }

    private openDDZShop(flag = 0) {
        ccserver.ddzDispatchEvent(1, '', { type: 2, shopFlag: flag });
    }


    protected onGoldEnough(e: egret.Event): void {
    }

    protected leaveTableHandle(e: egret.Event): void {
        console.log("leaveTableHandle===========>");
        var msg: any = e.data;
        if (msg) {
            var player: CCPlayerData;
            if (msg.uid == ccserver.uid) {
                for (let i = 0; i < this.players.length; i++) {
                    let playerui: CCPlayerUI = this.getPlayer(this.players[i].seatid);
                    if (playerui) {
                        if (playerui != this.player1) {
                            let pdata = this.players[i];
                            pdata.diamond = "0";
                            pdata.gold = "0";
                            pdata.nickname = "";
                            pdata.imgId = "";
                            playerui.updateHeadImage("");
                            playerui.updateNickname("");
                            playerui.updateGold(0);
                            playerui.updateDiamond(0);
                            playerui.playerHead.setReadyFlagVisible(false);
                            this.deletePlayerByUid(pdata.uid);
                        }
                    }
                }
                if (msg) {
                    if (msg.uid == ccserver.uid && msg.reason == 4 && !this.isMatch && !this.isTeam) { //金豆不足                        
                        let _roomsinfo = this.roomsInfo;
                        if (_roomsinfo.roomID == 10001 || _roomsinfo.roomID == 10002 || _roomsinfo.roomID == 10003) {
                            this.showGoldNotEnough();
                        }
                        this.continueBtn.visible = false;
                        this.startBtn.visible = true;
                        return;
                    }
                }

                if (this.isChangeTable) {
                    this.isChangeTable = false;
                    player = this.getPlayerByUid(msg.uid);
                    this.checkEnoughSendQuickJoin(Number(player.gold));
                    // this.clearUI();
                    this.players = null;
                }
                else {
                    this.showCCBtns(false);
                    // this.clearUI();
                    this.continueBtn.visible = false;
                    this.startBtn.visible = true;
                    this.isOneGameEnd = true;
                    this.players = null;
                }
            }
            else {
                player = this.getPlayerByUid(msg.uid);
                if (!player || !player.seatid) {

                }
                else {
                    var p: CCPlayerUI = this.getPlayer(player.seatid);
                    this._isPlayer3LeaveTable = true;
                    player.diamond = "0";
                    player.gold = "0";
                    player.nickname = "";
                    player.imgId = "";
                    p.updateHeadImage("");
                    p.updateNickname("");
                    p.updateGold(0);
                    p.updateDiamond(0);
                    p.playerHead.setReadyFlagVisible(false);
                    // p.clean();
                    // p.visible = false;
                    this.deletePlayerByUid(msg.uid);
                }
            }
        }
    }

    protected onReconnectPGameRep(e: egret.Event): void {
        var msg: any = e.data;
        if (msg.result == 0) {
            this.roomBaseScroe = msg.bscore;
            this.setBaseScore();
            this.teamRound = msg.playround + 1;
        }
    }

    private onGameDissolve(e: egret.TouchEvent): void {

    }

    private getUserInfo(uid: number): void {
        var msg: any = {};
        msg.uid = uid;
        ccserver.send(CCEventNames.GAME_USER_INFO_IN_GAME_REQ, msg);
    }

    private onGameOperateRep(e: egret.Event) {
        var msg: any = e.data;
        if (msg) {
            if (msg.optype == 8) {
                //赞或者是踩 1:赞 0:踩
                if ((msg.result == 0 || msg.result == null) && msg.params && msg.params.length >= 2) {
                    let _seatId = msg.params[0];
                    var player: CCPlayerData = this.getPlayerBySeatId(_seatId);
                    if (player) {
                        let _op = msg.params[1];
                        let _data = player;
                        let _coolNum = _data["praise"][0];
                        let _shitNum = _data["praise"][1];
                        if (_op == 0) {
                            _data["praise"][1] += 1;
                        } else {
                            _data["praise"][0] += 1;
                        }
                        _data["praise"][_seatId + 1] = _op;
                        CCDDZPanelPlayerInfo.onPraise(_seatId, _op);
                    }
                }
            }
            else if (msg.optype == 2 || msg.optype == 1) {
                if (msg.seatid == this.selfSeatId) {
                    this.chooseCard.visible = false;
                    this.chooseCard.cleanAllCardGrps();
                    this.player1.currentState = "myComparison";
                    this.player1.width = CCalien.CCDDZStageProxy.width;
                    this.player1.playerCardView.currentState = "comparisonRight";
                    this.player1.playerCardView.visible = true;
                    this.player1.playerCardView.hideAllLbl();
                    this.player1.playerCardView.showAllCard();
                }
                else {
                    let _player = this.getPlayer(msg.seatid);
                    if (!_player) {

                    }
                    else {
                        if (_player.visible == true) {
                            if (_player == this.player2 || _player == this.player3) {
                                _player.currentState = "rightComparison";
                                _player.playerCardView.currentState = "comparisonRight";
                                _player.playerCardView.hideAllLbl();
                                _player.playerCardView.showAllCard();
                            }
                            else if (_player == this.player4 || _player == this.player5) {
                                _player.currentState = "leftComparison";
                                _player.playerCardView.currentState = "comparisonLeft";
                                _player.playerCardView.hideAllLbl();
                                _player.playerCardView.showAllCard();
                            }
                        }
                    }
                }
            }
        }
    }

    private userInfoInGameRepHandle(e: egret.Event): void {
        var msg: any = e.data;
        console.log("userInfoInGameRepHandle===========>", msg);
        if (msg) {
            var player: CCPlayerData = this.getPlayerByUid(msg.uid);
            if (player) {
                player.uid = msg.uid;
                player.gold = msg.gold || 0;
                player.diamond = msg.diamond || 0;
                player.nickname = CCDDZBase64.decode(msg.nickname);
                player.imgId = msg.imageid;
                player.sex = msg.sex;
                player.redcoingot = msg.redcoingot || 0;
                player.totalwincnt = msg.totalwincnt || 0;
                player.totallosecnt = msg.totallosecnt || 0;
                player.totaldrawcnt = msg.totaldrawcnt || 0;
                if (msg.praise && msg.praise.length >= 5) {
                    player["praise"] = msg.praise;
                }
            }
            if (msg.uid == ccserver.uid) {
                this.myName = player.nickname;
                this.myImgId = player.imgId;
            }
            this.setRedProcess();
            this.setPlayerInfo();
        }
    }

    private getReadyRepHandle(e: egret.Event): void {
        console.log("getReadyRepHandle===========>");
        var msg: any = e.data;
        if (msg) {
            var player: CCPlayerData = this.getPlayerBySeatId(msg.seatid);
            if (player) {
                player.ready = msg.result;
                player.showed = 0;
                var p: CCPlayerUI = this.getPlayer(player.seatid);
                if (!p || !p.playerHead) {

                }
                else {
                    p.playerHead.setReadyFlagVisible(true);
                }
                if (player.uid == ccserver.uid) {
                    this.clock.stopTimer();
                }
            }
        }
    }

    protected gameStartNtfHandle(e: egret.Event): void {
        console.log("gameStartNtfHandle===========>");
        this._isInQuickJoin = false;
        this.isGameStart = true;
        console.log("游戏开始");
        this.setlabWaiting(null);
        if (!this.players)
            return null;
        if (this.isMatch) {
            this.addGameView();
            this.setBaseScore();
        }
        this.isInGame = false;
        this.isGameEndEffectEnd = false;
        CCGameConfig.happyTypes = [];
        this._clearCheckGoldTime();
        for (var i: number = 0; i < this.players.length; i++) {
            this.players[i].ready = 0;
            this.players[i].isInGame = true;
            if (this.players[i].uid == ccserver.uid) {
                this.isInGame = true;
            }
        }

        let msg = e.data;
        console.log("gameStartNtfHandle----------->", msg);
        this._isPlayer3LeaveTable = false;
        if (msg && msg.playerinfo) {
            for (let i: number = 0; i < msg.playerinfo.length; i++) {
                let player: CCPlayerUI = this.getPlayer(msg.playerinfo[i].seatid);
                if (player) {
                    player.playerHead.setReadyFlagVisible(false);
                    if (player == this.player1) {
                        let _roomsinfo = this.roomsInfo;
                        if (_roomsinfo.roomID == 10004 || _roomsinfo.roomID == 10005 || _roomsinfo.roomID == 10006) {
                            let playerdata = this.getPlayerBySeatId(msg.playerinfo[i].seatid)
                            let _diamond = msg.playerinfo[i].diamond || 0
                            playerdata.diamond = _diamond;
                            this.myDiamond.updateGold(Number(_diamond));
                        }
                        else {
                            let selfData = CCDDZMainLogic.instance.selfData;
                            selfData.gold = Number(msg.playerinfo[i].gold);
                            this.myGold.updateGold(Number(msg.playerinfo[i].gold))
                        }
                    }
                    else {
                        let playerdata = this.getPlayerBySeatId(msg.playerinfo[i].seatid)
                        console.log("gameStartNtfHandle----playerdata-111--->", playerdata)
                        if (!playerdata) {

                        }
                        else {
                            let _roomsinfo = this.roomsInfo;
                            console.log("gameStartNtfHandle----playerdata-111--->", _roomsinfo.roomID, playerdata)
                            if (_roomsinfo.roomID == 10004 || _roomsinfo.roomID == 10005 || _roomsinfo.roomID == 10006) {
                                let _diamond = Number(msg.playerinfo[i].diamond);
                                if (!_diamond) _diamond = 0;
                                playerdata.diamond = "" + _diamond;
                                player.updateDiamond(_diamond);
                            }
                            else {
                                let _gold = Number(msg.playerinfo[i].gold);
                                if (!_gold) _gold = 0;
                                playerdata.gold = "" + _gold;
                                player.updateGold(Number(msg.playerinfo[i].gold));
                            }
                        }
                    }
                }
            }
        }
    }

    private truePlayerNum: number;
    private sendCardCount: number;
    //炸弹7 葫芦6 顺子5 三张4 连对3 对子2 单牌1
    private addCardHandle(e: egret.Event): void {
        var msg: any = e.data;
        console.log("addCardHandle-----111--->", msg);
        if (msg) {
            if (!msg.status) {
                let _showorder = true;
                if (Number(msg.time) < 900) {
                    _showorder = false;
                }
                this.chooseCard.visible = true;
                this.chooseCard.cleanAllCardGrps();
                let cardids = msg.cardids;
                let cardids2 = msg.cardids2;
                this.chooseCard.addCards(cardids, true, true, _showorder, cardids2);
            }
            else {
                this.chooseCard.visible = false;
                this.chooseCard.cleanAllCardGrps();
                this.player1.currentState = "myComparison";
                this.player1.width = CCalien.CCDDZStageProxy.width;
                if (!this.player1 || this.player1.playerCardView) {

                }
                else {
                    this.player1.playerCardView.currentState = "comparisonRight";
                    this.player1.playerCardView.hideAllLbl();
                }
            }

            this.clock.Num = Math.floor(Number(msg.time) / 100);

            for (let i = 1; i <= 5; ++i) {
                let playerData: CCPlayerData = this.getPlayerBySeatId(i);
                if (playerData && playerData.isInGame) {
                    let CCPlayerUI: CCPlayerUI = this.getPlayer(playerData.seatid);
                    console.log("addCardHandle---------->", playerData)
                    if (!CCPlayerUI || !CCPlayerUI.playerCardView) {

                    }
                    else {
                        if (CCPlayerUI != this.player1) {
                            if (!playerData.showed) {
                                CCPlayerUI.playerCardView.visible = true;
                                CCPlayerUI.playerCardView.addCards();
                                CCPlayerUI.playerCardView.validateNow();
                            }
                            else {
                                if (CCPlayerUI == this.player2 || CCPlayerUI == this.player3) {
                                    CCPlayerUI.currentState = "rightComparison";
                                    CCPlayerUI.playerCardView.currentState = "comparisonRight";
                                    CCPlayerUI.playerCardView.visible = true;
                                    CCPlayerUI.playerCardView.hideAllLbl();
                                }
                                else if (CCPlayerUI == this.player4 || CCPlayerUI == this.player5) {
                                    CCPlayerUI.currentState = "leftComparison";
                                    CCPlayerUI.playerCardView.currentState = "comparisonLeft";
                                    CCPlayerUI.playerCardView.visible = true;
                                    CCPlayerUI.playerCardView.hideAllLbl();
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    protected playCardSound(times: number, delay: number = 200): void {
        for (var i: number = 0; i < times; i++) {
        }
    }

    private setScoreHandle(e: egret.Event): void {
        console.log("setScoreHandle===========>");
        var msg: any = e.data;
        var player: CCPlayerUI = this.getPlayer(msg.seatid);
        if (this.masterSeatId) {
        }
        else {
            if (msg.ismaster) {
                this.masterSeatId = msg.seatid;
                this.showGetMasterMovie();
            }
            else {
                if (msg.score > this.maxScore)
                    this.maxScore = msg.score;
            }
        }
    }

    private showGetMasterMovie(): void {
        this.indexP = 0;
        this.setIsQiangZhuang();
        if (this.indexP > 1) {
            this.isMasterMovieEnd = false;
            this.frame = 0;
        }
        else {
            this.isMasterMovieEnd = true;
            this.maxScore = 0;
        }

    }

    private isMasterMovieEnd: boolean;
    private maxScore: number = 0;
    private indexP: number = 0;
    private frame: number = 0;
    private frameTimes: number = 0;
    private enterFrame(e: Event): void {
        this.frame++;
        if (this.isFrameDo()) {
            this.frameTimes++;
            var p: CCPlayerUI;
            let _len = 1;
            if (this.players) {
                _len = this.players.length;
            }
            if (this.frameTimes > _len * 2 && this.indexP == this.masterSeatId) {
                this.maxScore = 0;
                this.indexP = 0;
                this.frameTimes = 0;
                this.isMasterMovieEnd = true;
            }

        }
    }

    private isFrameDo(): boolean {
        if (this.frameTimes <= 20) {
            if (this.frame % 4 == 0) {
                this.frame = 0;
                return true;
            }
            else
                return false;
        }
        else if (this.frameTimes <= 22) {
            if (this.frame % 8 == 0) {
                this.frame = 0;
                return true;
            }
            else
                return false;
        }
        else if (this.frameTimes <= 24) {
            if (this.frame % 12 == 0) {
                this.frame = 0;
                return true;
            }
            else
                return false;
        }
        else if (this.frameTimes <= 26) {
            if (this.frame % 16 == 0) {
                this.frame = 0;
                return true;
            }
            else
                return false;
        }
        else {
            if (this.frame % 20 == 0) {
                this.frame = 0;
                return true;
            }
            else
                return false;
        }
    }

    private setIsQiangZhuang(): void {
        var count: number;
        for (var i: number = 0; i < this.players.length; i++) {
            var player: CCPlayerData = this.players[i];
            if (player) {
                var p: CCPlayerUI = this.getPlayer(player.seatid);
                if (player && player.uid && player.isInGame) {
                    this.indexP++;
                }
            }
        }

    }

    private useCardNtfHandle(e: egret.Event): void {
        console.log("useCardNtfHandle===========>");
        var msg: any = e.data;

        if (CCGameConfig.qznnMode == 2) {
            if (msg.seatid == this.selfSeatId) {
            }
            else {

            }
        }
        else {

        }
    }

    private autoStart(e: egret.Event): void {
        this.useCard();
    }

    private useCard(): void {
        var msg: any = {};
        msg.session = 0;
        msg.cardids = [];
        msg.index = 0;
        msg.seatid = 0;

        ccserver.send(CCEventNames.GAME_USE_CARD_NTF, msg);
    }

    private showCardHandle(e: egret.Event): void {
        var msg: any = e.data;
        this.clock.stopTimer();
        if (msg) {
            if (this.start_bg.visible == false) {
                this.showStartGameAni();
            }
            this.showCardNow(msg);
        }
    }

    private showCardNow(msg: any) {
        console.log("showCardNow===========>");
        if (msg) {
            if (this.players) {
                for (var i: number = 0; i < this.players.length; i++) {
                    var player: CCPlayerUI = this.getPlayer(this.players[i].seatid);
                    if (player && this.players[i].seatid == msg.seatid) {
                        if (player == this.player1) {
                            if (this.chooseCard.visible) {
                                this.chooseCard.visible = false;
                                this.chooseCard.cleanAllCardGrps();
                                this.clock.stopTimer();
                                CCToast.instance.show(this, "超时未摆放，系统已自动帮您调整。", { x: 0.5, y: 0.65 });
                            }
                            player.currentState = "myComparison";
                            player.width = CCalien.CCDDZStageProxy.width;
                            player.playerCardView.currentState = "comparisonRight";
                        }
                        else if (player == this.player2 || player == this.player3) {
                            player.currentState = "rightComparison";
                            player.playerCardView.currentState = "comparisonRight";
                            player.playerCardView.visible = true;
                        }
                        else if (player == this.player4 || player == this.player5) {
                            player.currentState = "leftComparison";
                            player.playerCardView.currentState = "comparisonLeft";
                            player.playerCardView.visible = true;
                        }
                        this.playerShowCards(player, msg);
                    }
                }
            }
        }
    }

    private playerShowCards(player: CCPlayerUI, msg: any) {
        let cardids = [];
        if (msg.cardids && msg.cardids.length == 9) {
            cardids = msg.cardids;
        }

        let cardtypes = [];
        if (msg.params && msg.params.length > 2) {
            cardtypes = msg.params.slice(0, 3);
        }

        let scoreChanges = [];
        if (msg.params1 && msg.params1.length == 3) {
            scoreChanges = msg.params1;
        }

        let isGiveUp = false;
        if (!msg.status) {
            isGiveUp = false;
        }
        else if (msg.status && msg.status == 2) {
            isGiveUp = true;
        }

        let isSelf = false;
        if (player == this.player1) isSelf = true;

        player.playerCardView.showCards(cardids, cardtypes, scoreChanges, isGiveUp, msg, isSelf);
    }

    private gameEndHandle(e: egret.Event): void {
        var msg: any = e.data;
        console.log("gameEndHandle===========>");
        if (msg) {
            CCGameConfig.gameendData = msg;
            CCGameConfig.isShowScoreChange = false;
            this.isInGame = false;
            ccserver.startCache([], 100);
            // CCDDZBagService.instance.refreshBagInfo();
        }
    }

    private _showScoreChange(e: egret.Event) {
        let msg = CCGameConfig.gameendData;
        console.log("_showScoreChange-------------->")
        if (msg && CCGameConfig.isShowScoreChange == false) {
            CCGameConfig.isShowScoreChange = true;
            this.isGameEndEffectEnd = false;
            this.isGameStart = false;
            this._isInQuickJoin = false;
            this.isInGame = false;
            this.clock.stopTimer();
            this.winSeatId = [];
            let idx = 0;
            for (var i: number = 1; i <= 5; i++) {
                var playerData: CCPlayerData = this.getPlayerBySeatId(i);
                idx = i - 1;
                if (playerData && playerData.isInGame) {
                    // let _gold = Number(playerData.gold) + msg.chanage[idx] || 0;
                    let _gold = Number(msg.gold[idx] || 0) + Number(msg.realkickback[idx] || 0)
                    playerData.gold = "" + _gold;
                    if (playerData.seatid == this.selfSeatId) {
                        if (this.roomsInfo.roomID == 10004 || this.roomsInfo.roomID == 10005 || this.roomsInfo.roomID == 10006) {
                            _gold = CCDDZMainLogic.instance.selfData.gold;
                        }
                        else {
                            CCDDZMainLogic.instance.selfData.gold = _gold;
                            this.myGold.updateGold(_gold);
                        }
                    }
                    if (msg.chanage[idx] > 0)
                        this.winSeatId.push(i);
                    let player: CCPlayerUI = this.getPlayer(i);
                    let _changeGold = 0;
                    let _kb = 0;

                    // if (idx < msg.realkickback.length && idx < msg.chanage.length) {
                    // _changeGold = (msg.chanage[idx] + msg.realkickback[idx]);
                    _changeGold = msg.chanage[idx];
                    if (!_changeGold) {
                        _changeGold = 0;
                    }
                    // data.realkickback[i] == null ? 0 : data.realkickback[i]
                    _kb = msg.realkickback[idx] == null ? 0 : msg.realkickback[idx];
                    if (!_kb) {
                        _kb = 0;
                    }
                    _gold = msg.gold[idx];
                    if (this.roomsInfo.roomID == 10004 || this.roomsInfo.roomID == 10005 || this.roomsInfo.roomID == 10006) {
                        _gold = Number(playerData.diamond) + (Number(_changeGold) + Number(_kb));
                        playerData.diamond = _gold.toString();
                    }
                    let _seatIdx = 1;
                    if (player == this.player1) {
                        _seatIdx = 1;
                    }
                    else if (player == this.player2) {
                        _seatIdx = 2;
                    }
                    else if (player == this.player3) {
                        _seatIdx = 3;
                    }
                    else if (player == this.player4) {
                        _seatIdx = 4;
                    }
                    else if (player == this.player5) {
                        _seatIdx = 5;
                    }
                    this.playChangeEffect(_seatIdx, player, _changeGold, _kb, _gold);
                    // }
                }
            }
            this.showCCBtns(true);
            ccserver.stopCache();
        }
    }

    private _updateHappyScoreData(e: egret.Event) {
        CCGameConfig.playersNum = 0;
        CCGameConfig.addHappyScoreTimes++;
        for (let i = 1; i <= 5; i++) {
            if (this["player" + i].visible == true) {
                CCGameConfig.playersNum++;
            }
        }
        let _data = e.data;
        if (!CCGameConfig.happyTypes) {
            CCGameConfig.happyTypes = [];
        }
        CCGameConfig.happyTypes.push(_data);
        // console.log("_updateHappyScoreData-------->", e.data, CCGameConfig.addHappyScoreTimes, CCGameConfig.playersNum)
        if (Number(CCGameConfig.addHappyScoreTimes) == Number(CCGameConfig.playersNum)) {
            CCGameConfig.giveupPlayersNum = 0;
            for (let i = 0; i < CCGameConfig.happyTypes.length; i++) {
                let _data = CCGameConfig.happyTypes[i];
                if (!_data || !_data.status) {
                }
                else {
                    if (_data.status == 2)
                        CCGameConfig.giveupPlayersNum++;
                }
            }
            console.log("_showHappyScore---------->", CCGameConfig.playersNum, CCGameConfig.giveupPlayersNum)
            this._showHappyScore();
        }
    }

    private _showHappyScore() {
        CCGameConfig.happyScorePlayerIndex = 0;
        CCalien.CCDDZDispatcher.dispatch(CCEventNames.CC_SHOW_NEXT_HAPPY_SCORE);
    }

    private _showNextHappyScore(e: egret.Event) {
        let _curPlayerIndex = Number(CCGameConfig.happyScorePlayerIndex) + 1;
        // console.log("_showNextHappyScore--------->", _curPlayerIndex, CCGameConfig.happyTypes);
        CCGameConfig.happyScorePlayerIndex = _curPlayerIndex;
        let _player = this["player" + _curPlayerIndex];
        if (_player && _player.visible == true) {
            for (let j = 0; j < CCGameConfig.happyTypes.length; j++) {
                let _data = CCGameConfig.happyTypes[j];
                if (!_data || !_data.seatid) {
                    continue;
                }
                let player = this.getPlayer(_data.seatid);
                // console.log("_showNextHappyScore-----11---->")
                let _happyData = [];
                let k = 0;
                if (_data.params && _data.params.length > 3) {
                    for (k = 3; k < _data.params.length; k++) {
                        if (_data.params[k] > 0) {
                            let _happytype = k - 2;
                            if (_happytype > 0) {
                                _happyData.push(_happytype);
                            }
                        }
                    }
                }
                // console.log("_showNextHappyScore-----22---->", _happyData)
                if (player == _player) {
                    for (k = 1; k <= 5; k++) {
                        let cplayer = this.getPlayer(k);
                        // console.log("_showNextHappyScore-----33---->")
                        if (!cplayer || !cplayer.visible) continue;
                        if (cplayer.visible == true) {
                            // console.log("_happyData---------->", _happyData)
                            if (cplayer == player) {
                                // console.log("_showNextHappyScore-----44---->")
                                cplayer.playerCardView.refreshRewardTypeData(_happyData, true);
                            }
                            else {
                                // console.log("_showNextHappyScore-----55---->")
                                for (let m = 0; m < CCGameConfig.happyTypes.length; m++) {
                                    let _data = CCGameConfig.happyTypes[m];
                                    let __player = this.getPlayer(_data.seatid);
                                    let _isGiveUp = false;
                                    if (!_data.status) {
                                        _isGiveUp = false;
                                    }
                                    else if (_data.status == 2) {
                                        _isGiveUp = true;
                                    }
                                    if (__player == cplayer) {
                                        cplayer.playerCardView.refreshRewardTypeData(_happyData, false, _isGiveUp);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        else {
            if (CCGameConfig.happyScorePlayerIndex <= 5) {
                CCalien.CCDDZDispatcher.dispatch(CCEventNames.CC_SHOW_NEXT_HAPPY_SCORE);
            }
            else {
                CCalien.CCDDZDispatcher.dispatch(CCEventNames.CC_SHOW_SCORECHANGE)
                CCGameConfig.happyTypes = [];
                CCGameConfig.addHappyScoreTimes = 0;
            }
        }
    }

    private _sendGiveUpGame(e: egret.Event): void {
        CCDDZSoundManager.instance.playEffect(CCResNames.cc_giveup);
        ccserver.send(CCEventNames.GAME_OPERATE_REQ, { optype: 2 });
    }

    private showWin(): void {
        for (let i = 1; i <= 5; ++i) {
            let playerData: CCPlayerData = this.getPlayerBySeatId(i);
            if (playerData && playerData.isInGame) {
                let CCPlayerUI: CCPlayerUI = this.getPlayer(playerData.seatid);
            }
        }
        this.isOneGameEnd = true;
    }

    private showCCBtns(bShow) {
        this.continueBtn.visible = bShow;
    }

    private setPlayerInfo(): void {
        if (this.players) {
            for (var i: number = 0; i < this.players.length; i++) {
                var player: CCPlayerUI = this.getPlayer(this.players[i].seatid);
                // console.log("setPlayerInfo========11========>", this.players[i]);
                if (player) {
                    player.visible = true;
                    player.updateNickname(this.players[i]);
                    if (player != this.player1) {
                        player.updateHeadImage(this.players[i].imgId);
                    }
                    else {
                        let _selfData = CCDDZMainLogic.instance.selfData;
                        player.updateHeadImage(_selfData.imageid);
                    }

                    let _roomInfo = this.roomsInfo;
                    player.playerGold.showGold();
                    if (_roomInfo.roomID == 10004 || _roomInfo.roomID == 10005 || _roomInfo.roomID == 10006) {
                        if (player != this.player1) {
                            player.playerGold.showDiamond();
                            player.updateDiamond(Number(this.players[i].diamond))
                        }
                        else {
                            let _diamond = Number(this.players[i].diamond)
                            this.myDiamond.updateGold(_diamond);
                        }
                    }
                    else {
                        if (player != this.player1) {
                            player.updateGold(this.players[i].gold);
                        }
                        else {
                            this.myGold.updateGold(this.players[i].gold);
                            this.myDiamond.updateGold(this.players[i].diamond);
                        }
                    }

                }
            }
        }
    }


    private updateGameInfoHandle(e: egret.Event): void {

        var msg: any = e.data;

        if (msg && msg.params1 && msg.params1.length >= 2 && msg.params1[0] == 250 && msg.params1[1] == 250) {//当自己金豆小于房间的门槛是不清理
            if (msg.params1[3] == 1) {
                this.isLobbyGoldEnough = true;
            }
            else {
                this.isLobbyGoldEnough = false;
            }
        }
    }

    private reconnectTableReq(): void {
        var msg: any = {};
        msg.result = 0;
        msg.index = this.protoIndex;
        msg.session = this.session;
        ccserver.send(CCEventNames.USER_RECONNECT_TABLE_REQ, msg);
    }

    private reconnectTableRepHandle(e: egret.Event): void {
        var msg: any = e.data;
        if (msg) {
            if (msg.result == 0) {

            }
            else if (msg.result == 1 || msg.result == 2) {
                if (this.isMatch) {
                    this.checkShowMatchWait();
                }
                else {
                    CCDDZMainLogic.backToRoomScene();
                }
            }
            else {

            }
        }
    }

    private reconnectRepHandle(e: egret.Event): void {
        var msg: any = e.data;
        if (msg) {
            this.clearUI();
            var event: egret.Event;
            var setScore: any;

            var i: number = 0;
            var player: CCPlayerData;
            var p: CCPlayerUI;

            this.addGameView();
            this.isReconnect = true;
            let _players = msg.players;
            this.isInGame = false;
            this._isInQuickJoin = false;
            if (!this.players)
                this.players = [];
            if (msg.params1 && msg.params1.length > 0 && msg.status > 1) {
                this.masterSeatId = msg.params1.shift();
            }
            if (!_players) {
                _players = [];
            }
            this.players = [];
            let selfStatus = 0;
            this._isPlayer3LeaveTable = false;
            console.log("reconnectRepHandle===================>", this.masterSeatId, _players, this.players, msg.params2, msg.status);
            for (i = 0; i < _players.length; i++) {
                if (_players[i].uid) {
                    player = this.getPlayerByUid(_players[i].uid);
                    if (player) {
                        player.seatid = _players[i].seatid;
                        player.ready = 0;
                        player.uid = _players[i].uid;
                    }
                    else {
                        player = new CCPlayerData();
                        player.seatid = _players[i].seatid;
                        player.ready = 0;
                        player.uid = _players[i].uid;
                        this.players.push(player);
                    }
                    if (_players[i].params[0] == 1) {
                        player.isInGame = true;
                        if (player.uid == ccserver.uid)
                            this.isInGame = true;
                    }
                    else
                        player.isInGame = false;

                    if (!_players[i].params[2]) {
                        player.showed = 0;
                        if (player.uid == ccserver.uid) {
                            selfStatus = 0;
                        }
                    }
                    else {
                        player.showed = Number(_players[i].params[2]);
                        if (player.uid == ccserver.uid) {
                            selfStatus = player.showed
                        }
                    }
                    if (_players[i].uid == ccserver.uid) {
                        this.selfSeatId = player.seatid;
                    }
                    this.getUserInfo(player.uid);
                }
            }
            if (msg.status && msg.status == 1) {
                this.isGameStart = true;
                var addCard: any = {};
                addCard.seatid = this.selfSeatId;
                addCard.time = msg.time;
                addCard.cardids = msg.params1;
                addCard.cardids2 = msg.params2;
                addCard.selfStatus = selfStatus;
                event = new egret.Event(CCEventNames.GAME_ADD_CARD, false, false, addCard);
                this.resetPlayersStatus();
                this.addCardHandle(event);
            }
            let _roomsinfo = this.roomsInfo;
            if (_roomsinfo.roomID == 10004 || _roomsinfo.roomID == 10005 || _roomsinfo.roomID == 10006) {

            }
            else {
                CCDDZBagService.instance.refreshBagInfo();
            }

        }
        this.isReconnect = false;
    }

    private matchInfoNtfRepHandler(e: egret.Event): void {
    }

    private checkShowMatchWait(needShowPromoted: boolean = false): void {
    }

    private chekShowMatchPromoted(): void {
    }

    private enterMatchRepHandler(e: egret.Event): void {
        var msg: any = e.data;
        if (msg.result == 0) {
            console.log("加入比赛成功");
        }
    }

    protected getPlayer(seatId: number): CCPlayerUI {
        if (seatId == this.selfSeatId)
            return this.player1;
        else if ((seatId - this.selfSeatId) == 1 || (seatId - this.selfSeatId) == -1)
            return this.player3;
        else {
            // console.log("getPlayer 找不到玩家");
            return null;
        }
    }

    protected getPlayer2(seatId: number): CCPlayerUI {
        if (seatId == this.selfSeatId)
            return this.player1;
        else if ((seatId - this.selfSeatId) == 1 || (seatId - this.selfSeatId) == -4)
            return this.player2;
        else if ((seatId - this.selfSeatId) == 2 || (seatId - this.selfSeatId) == -3)
            return this.player3;
        else if ((seatId - this.selfSeatId) == 3 || (seatId - this.selfSeatId) == -2)
            return this.player4;
        else if ((seatId - this.selfSeatId) == 4 || (seatId - this.selfSeatId) == -1)
            return this.player5;
        else {
            console.log("getPlayer2 找不到玩家");
            return null;
        }
    }

    private nextSeatId(value: number): number {
        if (value > 5)
            return value - 5;
        else if (value <= 0)
            return value + 5;
        else
            return value;
    }

    private getPlayerBySeatId(seatId: number): CCPlayerData {
        if (!this.players)
            return null;
        for (var i: number = 0; i < this.players.length; i++) {
            if (this.players[i].seatid == seatId)
                return this.players[i];
        }
        return null;
    }

    private setPlayerIsNotInGame(): void {
        if (!this.players)
            return null;
        for (var i: number = 0; i < this.players.length; i++) {
            if (this.players[i].uid)
                this.players[i].isInGame = false;
        }
    }

    private deletePlayerByUid(uid: number): void {
        if (this.players) {
            for (var i: number = 0; i < this.players.length; i++) {
                if (this.players[i].uid == uid) {
                    this.players.splice(i, 1);
                    return;
                }
            }
        }
    }

    private hideLblChanges() {
        this["labChange1"].visible = false;
        this["labChange2"].visible = false;
        this["labChange3"].visible = false;
        this["labChange4"].visible = false;
        this["labChange5"].visible = false;
    }

    private showPlayers(bshow): void {
        if (bshow == false) {
            this.player1.currentState = "my";
        }
        // this.player2.visible = bshow;
        this.player3.visible = bshow;
        // this.player4.visible = bshow;
        // this.player5.visible = bshow;
    }

    private setlabWaiting(str: string = null) {
        if (str) {
            this.labWaiting.text = str;
            this.labWaiting.visible = true;
        } else {
            this.labWaiting.visible = false;
        }
    }
}
