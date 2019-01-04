/**
 * Created by angleqqs on 18/5/28.
 *
 * 翻翻乐
 */

class GameFFle extends alien.SceneBase {

    private selectedPts: number[];
    private failedPts: number[];
    private initArr: number[];
    private baseArr = [1, 2, 3, 4, 5, 6, 7, 8];
    private selfScore = 0;
    private scoreArr = {};

    /**
     * 0匹配成功之前 1匹配成功等待开始 2游戏过程中 3游戏结束
     */
    private gameStaus = 0;

    private session: any;
    private _roomInfo: any;
    private matchingInterval: any;
    private waitnum: number;
    private _myInfo: UserInfoData;
    private mySeatid: any;
    private myHead1: Head;
    private myHead2: Head;
    private myHead3: Head;
    private _othersUid: number;
    private othersHead1: Head;
    private othersHead2: Head;
    private othersHead3: Head;
    private startTime: number;
    private isGameEnd: boolean;
    private step1Timeout: number;
    private step2Timeout: number;
    private step3Timeout: number;
    private step4Timeout: number;

    //局数统计
    private redNum;
    private cnt1 = 1;
    private pause1;
    private chance1;

    private leftDiamond: number = 0;

    private myBeanNum:number = 0;
    private hisBeanNum:number = 0;

    constructor() {
        super();
        this.init();
    }

    private init(): void {
        this.skinName = scenes.GameFFleSkin;
        this.initData();
    }

    private initData(): void {
        this.gameStaus = 0;
        this.isGameEnd = false;
        this.selectedPts = [];
        this.failedPts = [];
        this["matching"].visible = true;
        this["lblStatus"].text = "正在匹配"
        this["lblWaittime"].text = "已等待0秒";

        this.myHead1.x = 290;
        this.othersHead1.visible = false;
        this["playing"].visible = false;
        this["player1Score"].width = 0;
        this["player2Score"].width = 0;
        this["result"].visible = false;
        this["lblChangeGame"].text = "换个游戏";
        this["tips"].visible = false;
        this["tipsWord"].source = "lg_READY";
        this["meng"].visible = false;
        this["btnBack"].visible = true;
        this["btnHelp"].visible = true;
        this["help"].visible = false;
        this["exit"].visible = false;
        
        this.myBeanNum = 0;
        this.hisBeanNum = 0;

        for (var index = 0; index < 24; index++) {
            this["itemImg" + index].source = "ffl_card_reverse_png";
            this["itemImg" + index].scaleX = 1;
            this["itemImg" + index].scaleY = 1;
            this["itemImg" + index].visible = true;
            this["itemImg" + index].touchEnable = true;
        }

        egret.clearInterval(this.matchingInterval);

        this.initMyinfo();
    }

    private initMyinfo(): void {
        this._myInfo = MainLogic.instance.selfData;
        this.myHead1.imageId = this._myInfo.imageid;
        this.myHead1.nickName = this._myInfo.nickname;
        this.myHead2.imageId = this._myInfo.imageid;
        this.myHead2.nickName = this._myInfo.nickname;
        this.myHead3.imageId = this._myInfo.imageid;
        this.myHead3.nickName = this._myInfo.nickname;
        if (this._myInfo.sex == 2) {
            this.myHead1.currentState = "female";
            this.myHead2.currentState = "female";
            this.myHead3.currentState = "female";
        } else {
            this.myHead1.currentState = "male";
            this.myHead2.currentState = "male";
            this.myHead3.currentState = "male";
        }
    }

    protected createChildren(): void {
        super.createChildren();
    }

    beforeShow(params: any): void {
        this._enableEvent(true);
        this._initServerListeners(true);
        alien.SoundManager.instance.enablePlayMusic(false);
        alien.SoundManager.instance.stopMusic();
        MainLogic.instance.setScreenPortrait(750, 1334);
        this._roomInfo = server.roomInfo = params.roomInfo;
        this.initData();

        if (params.data.isReconnect) {
            this.session = params.data.session;
            this.reconnectTableReq(params.data.session);
        } else {
            this.quickJoin();
        }
    }

    beforeHide(): void {
        this._initServerListeners(false);
    }

    private _shuffle = function (arr) {
        var input = arr;
        for (var i = input.length - 1; i >= 0; i--) {
            var randomIndex = Math.floor(Math.random() * (i + 1));
            var itemAtIndex = input[randomIndex];
            input[randomIndex] = input[i];
            input[i] = itemAtIndex;
        }
        return input;
    }

    private _enableEvent(bEnable: boolean): void {
        let _func = "addEventListener";
        if (!bEnable) {
            _func = "removeEventListener"
        }
        this[_func](egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
        this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
        this["btnBack"]["addEventListener"](egret.TouchEvent.TOUCH_TAP, this._clickBtnBack, this);
        this["btnHelp"]["addEventListener"](egret.TouchEvent.TOUCH_TAP, this._clickBtnHelp, this);
        this["bthExitHelp"]["addEventListener"](egret.TouchEvent.TOUCH_TAP, this._clickExitHelp, this);
        this["exitCancel"]["addEventListener"](egret.TouchEvent.TOUCH_TAP, this._clickExitCancel, this);
        this["exitConfirm"]["addEventListener"](egret.TouchEvent.TOUCH_TAP, this._clickExitConfirm, this);
        this["btnFightStatus"]["addEventListener"](egret.TouchEvent.TOUCH_TAP, this._clickFightAgain, this);
        this["btnChangeGame"]["addEventListener"](egret.TouchEvent.TOUCH_TAP, this._onchangeGame, this);
        this["btnChangeEnemy"]["addEventListener"](egret.TouchEvent.TOUCH_TAP, this._onchangePerson, this);
    }

    //重连桌子
    private reconnectTableReq(session: any): void {
        var msg: any = {};
        msg.session = session;
        msg.result = 0;
        msg.index = 0;
        server.send(EventNames.USER_RECONNECT_TABLE_REQ, msg);
    }

    protected quickJoin(gold: number = 0): void {
        var msg: any = {};
        msg.roomid = this._roomInfo.roomID;
        msg.clientid = server.uid;
        msg.gold = gold;
        server.send(EventNames.USER_QUICK_JOIN_REQUEST, msg);
    }
    /**
     * 消息监听
     */
    private _initServerListeners(bAdd: boolean): void {
        let func = "addEventListener";
        if (!bAdd) {
            func = "removeEventListener";
        }
        server[func](EventNames.USER_RECONNECT_TABLE_REP, this._onReconnectTableRep, this);
        server[func](EventNames.USER_ALMS_REP, this._onAlmsResponse, this);
        server[func](EventNames.GAME_GIVE_UP_GAME_REP, this._onGiveUpGameRep, this);
        server[func](EventNames.GAME_USER_INFO_IN_GAME_REP, this._onUserInfoInGameResponse, this);
        server[func](EventNames.GAME_GAME_START_NTF, this._onGameStart, this);
        server[func](EventNames.GAME_RECONNECT_REP, this._onReconnectRep, this);
        server[func](EventNames.GAME_ADD_CARD, this._onAddCard, this);
        server[func](EventNames.GAME_SHOW_CARD, this._onShowCard, this);
        server[func](EventNames.GAME_GAME_END, this._onGameEnd, this);
        server[func](EventNames.GAME_REPLENISH_FREEZE_GOLD_REP, this._onReplenishFreezeGoldRep, this)
        server[func](EventNames.GAME_OPERATE_REP_EX, this._onGameOperateRepEx, this)
        server[func](EventNames.GAME_OPERATE_REP, this._onGameOperateRep, this);
        server[func](EventNames.GAME_UPDATE_GAME_INFO, this._onUpdateGameInfo, this);
        server[func](EventNames.GAME_ENTER_TABLE, this._onEnterTable, this);
        server[func](EventNames.GAME_LEAVE_TABLE, this._onLeaveTable, this);
        server[func](EventNames.GAME_TABLE_INFO, this._onRecvTableInfo, this);
        server[func](EventNames.GAME_ASK_READY, this._onAskReady, this);
        server[func](EventNames.GAME_GET_READY_REP, this._onGetReadyRep, this);
        server[func](EventNames.QUIT_PGAME_REP, this._onQuitRoomRep, this);
        server[func](EventNames.USER_QUICK_JOIN_RESPONSE, this.quickJoinResonpseHandle, this);
        server[func](EventNames.USER_USER_INFO_RESPONSE, this._onUserInfoResponse, this);
        server[func](EventNames.START_PGAME_REP, this._onStartGameRep, this);
        server[func](EventNames.USER_OPERATE_REP, this._onUserOperateRep, this);
    }

    private _onAddToStage(): void {
    }

    private _onRemovedToStage(): void {
        this._enableEvent(false);
    }

    private _initAllItem(data: any): void {
        this.initArr = [];
        let hasCleanedNum = 0;
        for (var index = 0; index < data.length; index++) {
            if (data[index] != 0) {
                this["itemImg" + index]["addClickListener"](this._onClickItem.bind(this, index), this);
                this.initArr[index] = data[index];
            }
            else {
                this["itemImg" + index].visible = false;
                hasCleanedNum++;
            }
        }
        this["player1Score"].width = Math.floor((this["playerTatol"].width - 12) / 2 * (hasCleanedNum / 24));
    }

    private gameStart(): void {
        this["matching"].visible = true;
        this["btnBack"].visible = false;
        this["btnHelp"].visible = false;
        this["lblStatus"].text = "匹配成功";
        this["lblWaittime"].text = "先将全部图案消除的人获胜";
        this["lblVS"].visible = true;
        this.myHead1.x = 140;
        this.myHead1.visible = true;
        this.othersHead1.visible = true;

        if (this.isGameEnd) {
            return;
        }

        this.step1Timeout = egret.setTimeout(() => {
            this.step2Timeout = egret.setTimeout(() => {
                this["matching"].visible = false;
                this["playing"].visible = true;
                this["meng"].visible = true;
                this["tips"].visible = true;
                //ReadyGo音效
                alien.SoundManager.instance.playEffect("small_readyGo_mp3");

                this.step3Timeout = egret.setTimeout(() => {
                    this["tipsWord"].source = "lg_GO";
                    this.step4Timeout = egret.setTimeout(() => {
                        this["tips"].visible = false;
                        this["meng"].visible = false;
                        this.gameStaus = 2;
                        this["btnBack"].visible = true;
                        this["btnHelp"].visible = true;
                        if (this["help"].visible == true) {
                            this["help"].visible = false;
                        }
                        this.startTime = egret.getTimer();
                    }, this, 1000);
                }, this, 1000);
            }, this, 1000);
        }, this, 2000);
    }

    /**
     * status 0 逃跑  3换桌
     */
    protected giveUpGame(status: number): void {
        var msg: any = {};
        msg.status = status;
        msg.session = 0;
        server.send(EventNames.GAME_GIVE_UP_GAME_REQ, msg);
    }

    private _onClickItem(idx: number): void {

        alien.SoundManager.instance.playEffect("ffl_click_mp3");

        if (this["itemImg" + idx].touchEnable == false) return;
        if (!this.selectedPts) {
            this.selectedPts = [];
        }
        if (!this.failedPts) {
            this.failedPts = [];
        }
        this.selectedPts.push(idx);
        if (this.selectedPts.length == 1) {
            if (this.failedPts.length == 2) {
                var index1 = this.failedPts[0];
                var index2 = this.failedPts[1];
                this._reverseCard(this["itemImg" + index1], "ffl_card_reverse_png");
                this._reverseCard(this["itemImg" + index2], "ffl_card_reverse_png");
                this["itemImg" + index1].touchEnable = true;
                this["itemImg" + index2].touchEnable = true;
            }
            this._reverseCard(this["itemImg" + this.selectedPts[0]], "ffl_card_" + this.initArr[this.selectedPts[0]] + "_png");
            this["itemImg" + this.selectedPts[0]].touchEnable = false;
        }
        else if (this.selectedPts.length == 2) {
            var index2 = this.selectedPts[1];
            this._reverseCard(this["itemImg" + index2], "ffl_card_" + this.initArr[index2] + "_png");
            this["itemImg" + index2].touchEnable = false;
            this._checkChoosedCard();
        }
    }

    private _reverseCard(card: any, picSource: string): void {
        egret.Tween.get(card).to({ anchorOffsetX: card.width / 2, anchorOffsetY: card.height / 2, source: picSource, scaleX: 0 }, 150).call(() => {
            egret.Tween.get(card).to({ anchorOffsetX: card.width / 2, anchorOffsetY: card.height / 2, scaleX: 1 }, 150);
        });
    }

    private _checkChoosedCard(): void {
        var index1 = this.selectedPts[0];
        var index2 = this.selectedPts[1];
        if (this.initArr[index1] == this.initArr[index2]) {
            this.initArr[index1] = this.initArr[index2] = 0;
            this._chooseSuccess(this["itemImg" + index1], this["itemImg" + index2]);
            this._sendUserOperate([index1 + 1, index2 + 1]);
            this.failedPts = [];
        }
        else {
            this.failedPts = this.selectedPts;
        }
        this.selectedPts = [];
    }

    private _chooseSuccess(card1: any, card2: any): void {
        egret.Tween.get(card1).wait(200).to({ anchorOffsetX: card1.width / 2, anchorOffsetY: card1.height / 2, scaleX: 0, scaleY: 0 }, 150, egret.Ease.backIn).call(() => {
            card1.visible = false;
        });
        egret.Tween.get(card2).wait(200).to({ anchorOffsetX: card2.width / 2, anchorOffsetY: card2.height / 2, scaleX: 0, scaleY: 0 }, 150, egret.Ease.backIn).call(() => {
            card2.visible = false;
        });
        //消除音效
        alien.SoundManager.instance.playEffect("ffl_remove_wav");
    }

    private _clickBtnBack(e: egret.TouchEvent): void {
        if (this.gameStaus == 0) {
            server.QuitWaitingQueueReq();
            this.quitToLobby();
        }
        else if (this.gameStaus == 2) {
            this["exit"].visible = true;
        }
        else {
            this.giveUpGame(0);
            this.quitToLobby();
        }
    }

    private _clickExitCancel(e: egret.TouchEvent): void {
        this["exit"].visible = false;
    }

    private _clickExitConfirm(e: egret.TouchEvent): void {
        this.giveUpGame(0);
        this["exit"].visible = false;
        this["btnFightStatus"].source = "lg_result_btn_gray"
    }

    private quitToLobby(): void {
        MainLogic.backToRoomScene({toSmall:true});
        this.initData();
    }

    protected _sendGetReadyReq(session: number): void {
        var msg: any = {};
        msg.session = session;
        server.send(EventNames.GAME_GET_READY_REQ, msg);
    }

    private _clickFightAgain(): void {
        this.initData();
        egret.setTimeout(() => {
            this.quickJoin();
        }, this, 500); 
    }

    //换游戏
    private _onchangeGame(): void {
        this.quitToLobby();
    }

    //换人
    private _onchangePerson(): void {
        this["result"].visible = false;
        this.initData();
        this.quickJoin();
    }

    private _clickBtnHelp(e: egret.TouchEvent): void {
        this["help"].visible = true;
    }

    private _clickExitHelp(e: egret.TouchEvent): void {
        this["help"].visible = false;
    }

    private _onReconnectTableRep(event: egret.Event): void {
        var msg: any = event.data;
        if (msg) {
            if (msg.result == 0) {

            }
            else {
                this.quickJoin();
            }
        }
    }
    //恢复桌子
    private _onRecvTableInfo(event: egret.Event): void {
        let data = event.data;
        if (data.players.length == 2) {
            for (var i = 0; i < data.players.length; i++) {
                if (data.players[i].uid != this._myInfo.uid) {
                    this._setOthersInfo(data.players[i]);
                    this._othersUid = data.players[i].uid
                }
                else {
                    this.mySeatid = data.players[i].seatid;
                }
            }
        }
    }

    //收到地图
    private _onAddCard(event: egret.Event): void {
        let data = event.data;
        if (data.cardids) {
            this.initData();
            this._initAllItem(data.cardids);
            this.gameStaus = 2;
            this.gameStart();
        }
    }

    //重连收到地图
    private _onReconnectRep(event: egret.Event): void {
        var data: any = event.data;
        if (data.params1) {
            this.initData();
            this.startTime = egret.getTimer();
            this["matching"].visible = false;
            this["playing"].visible = true;
            this.gameStaus = 2;
            this._initAllItem(data.params1);
            if (data.players.length == 2) {
                for (var i = 0; i < data.players.length; i++) {
                    if (data.players[i].uid != this._myInfo.uid) {
                        if (data.players[i].params){
                            this["player2Score"].width = Math.floor((this["playerTatol"].width - 12) / 2 * (data.players[i].params[0] / 24));
                            this.hisBeanNum = data.players[i].params[0] / 2;
                        }
                    }else{
                        if (data.players[i].params){
                            this["player1Score"].width = Math.floor((this["playerTatol"].width - 12) / 2 * (data.players[i].params[0] / 24));
                            this.myBeanNum = data.players[i].params[0] / 2;
                        }
                    }
                }
            }
        }
    }

    private _onAlmsResponse(event: egret.Event): void {
        let data = event.data;
        if (data.result != 0) {
        }
    }

    private _onGiveUpGameRep(event: egret.Event): void {
        let data = event.data;
        if (data.result != 0) {
            Alert.show("退出游戏失败", 0, (act) => {
            })
        }
    }

    /**
     * 游戏结束
     * @param status -1 平局  1自己赢 2自己输
    */
    private _GameOver(status: number): void {
        if (this.isGameEnd) return;
        if (status == -1) {
            this["resultTitleImg"].source = "lg_result_draw";

            //平局音效
            alien.SoundManager.instance.playEffect("small_draw_mp3");
        }
        else if (status == 1) {
            this["resultTitleImg"].source = "lg_result_win";

            //赢音效
            alien.SoundManager.instance.playEffect("small_win_mp3");
        }
        else {
            this["resultTitleImg"].source = "lg_result_lose";

            //输音效
            alien.SoundManager.instance.playEffect("small_lose_mp3");
        }
        this.isGameEnd = true;
        this.gameStaus = 3;
        // if (!this.scoreArr[this._myInfo.uid]) this.scoreArr[this._myInfo.uid] = {};
        // if (!this.scoreArr[this._myInfo.uid]["gameNum"]) this.scoreArr[this._myInfo.uid]["gameNum"] = 0;
        // this.scoreArr[this._myInfo.uid]["gameNum"]++;
        // this["resultFightTimes"].text = "今日已对决" + this.scoreArr[this._myInfo.uid]["gameNum"] + "场";
        // if (!this.scoreArr[this._myInfo.uid][this._othersUid]) this.scoreArr[this._myInfo.uid][this._othersUid] = [0, 0];
        // this["resultScore"].text = this.scoreArr[this._myInfo.uid][this._othersUid][0] + ":" + this.scoreArr[this._myInfo.uid][this._othersUid][1];
        this["playing"].visible = false;
        this["result"].visible = true;
        this["btnFightStatus"].touchEnable = true;
        let nowTime = egret.getTimer();
        this["resultFightCost"].text = (nowTime / 1000 - this.startTime / 1000).toFixed(2) + "秒";
        this["resultFightCost"].visible = (status == 1 ? true : false);
    }

    private _onUserInfoInGameResponse(event: egret.Event): void {
        let data = event.data;
        if (data.result != 0) {
        }
    }

    private _onGameStart(event: egret.Event): void {
        let data = event.data;
        this.gameStaus = 2;
        // let roominfo = GameConfig.getRoomConfigById(this._roomInfo.roomID);
        // console.log("================kickbacks",roominfo);
        // this.leftDiamond -= Number(roominfo.kickbacks);
    }

    private _onShowCard(event: egret.Event): void {
        let data = event.data;
    }
    /**
     * 时间到游戏结束
    */
    private _onGameEnd(event: egret.Event): void {
        let data = event.data;
        this._stopAllStep();
        this["exit"].visible = false;
        this._GameOver(-1);

        this["resultScore"].text = this.myBeanNum + ":" + this.hisBeanNum;
        let _myChangeGold = 0;
         for(var i = 0; i < 2; ++i){
            // let seat: DDZSeat = this.getSeatById(i + 1);
            // console.log("===============seat",seat);
            // if(!seat) break;
            if(this.mySeatid == (i+1)) {
                _myChangeGold = data.chanage[i];
            }
        }
        this["GetNum"].visible = false;
        if(_myChangeGold>0){
            this["GetNum"].visible = true;
            this["GetNum"].text = "你获得" + _myChangeGold + "金豆";
        }else if(_myChangeGold<0){
            this["GetNum"].visible = true;
            this["GetNum"].text = "你失去" + Math.abs(_myChangeGold) + "金豆";
        }else{
            this["GetNum"].visible = false;
        }

    }

    private _initStepTimeout(): void {
        this.step1Timeout = 0;
        this.step2Timeout = 0;
        this.step3Timeout = 0;
        this.step4Timeout = 0;
    }

    private _stopAllStep(): void {
        if (this.step1Timeout) {
            egret.clearTimeout(this.step1Timeout);
        }
        if (this.step2Timeout) {
            egret.clearTimeout(this.step2Timeout);
        }
        if (this.step3Timeout) {
            egret.clearTimeout(this.step3Timeout);
        }
        if (this.step4Timeout) {
            egret.clearTimeout(this.step4Timeout);
        }
        this._initStepTimeout();
    }

    private _onReplenishFreezeGoldRep(event: egret.Event): void {
    }

    private _onGameOperateRepEx(event: egret.Event): void {
    }

    private _sendUserOperate(points): void {
        let data = { optype: 1, params: points };
        server.send(EventNames.GAME_OPERATE_REQ, data);
    }

    private _onGameOperateRep(event: egret.Event): void {
        let data = event.data;
        if (data.seatid == this.mySeatid) {
            this["player1Score"].width = Math.floor((this["playerTatol"].width - 12) / 2 * (data.params[0] / 24));
            if(data.params[0] != null){
                this.myBeanNum = data.params[0]/2;
            }
        }
        else {
            this["player2Score"].width = Math.floor((this["playerTatol"].width - 12) / 2 * (data.params[0] / 24));
            if(data.params[0] != null){
                this.hisBeanNum = data.params[0]/2;
            }
        }
        if (data.winsid != null) {
            this["btnFightStatus"].source = "lg_result_btn_blue";
            this["btnFightStatus"].touchEnabled = true;
            if (!this.scoreArr[this._myInfo.uid]) this.scoreArr[this._myInfo.uid] = {};
            if (data.winsid == -1) {//平局
                this._GameOver(-1);
            }
            else if (data.winsid == this.mySeatid) {
                if (!this.scoreArr[this._myInfo.uid][this._othersUid]) this.scoreArr[this._myInfo.uid][this._othersUid] = [0, 0];
                this.scoreArr[this._myInfo.uid][this._othersUid][0]++;
                this._GameOver(1);
            }
            else {
                if (!this.scoreArr[this._myInfo.uid][this._othersUid]) this.scoreArr[this._myInfo.uid][this._othersUid] = [0, 0];
                this.scoreArr[this._myInfo.uid][this._othersUid][1]++;
                this._GameOver(0);
            }
        }
    }

    private _onUpdateGameInfo(event: egret.Event): void {
        let data = event.data;
        if (data.result != 0) {
        }
    }

    private _onEnterTable(event: egret.Event): void {
        let data = event.data;
        if(this.gameStaus == 3) {
            return ;    
        }
        if (data.uid == this._myInfo.uid) {
            this.mySeatid = data.seatid;
            this.leftDiamond = Number(data.diamond);
        }
        else {
            this._othersUid = data.uid;
            this._setOthersInfo(data);
        }
    }

    private _setOthersInfo(data) {
        let arrayBuffer: ArrayBuffer = egret.Base64Util.decode(data.nickname);
        let messageBytes: egret.ByteArray = new egret.ByteArray(arrayBuffer);
        messageBytes.position = 0;
        let othersNickName = messageBytes.readUTFBytes(messageBytes.length)

        this.othersHead1.imageId = data.imageid;
        this.othersHead1.nickName = othersNickName;
        this.othersHead2.imageId = data.imageid;
        this.othersHead2.nickName = othersNickName;
        this.othersHead3.imageId = data.imageid;
        this.othersHead3.nickName = othersNickName

        if (data.sex == 2) {
            this.othersHead1.currentState = "female";
            this.othersHead2.currentState = "female";
            this.othersHead3.currentState = "female";
        } else {
            this.othersHead1.currentState = "male";
            this.othersHead2.currentState = "male";
            this.othersHead3.currentState = "male";
        }
    }

    private _onLeaveTable(event: egret.Event): void {
        let data = event.data;
        // this["btnFightStatus"].source = "lg_result_btn_gray";
        // this["btnFightStatus"].touchEnabled = false;
        // this["resultTips"].text = "对方已退出游戏";
    }

    private _onAskReady(event: egret.Event): void {
        let data = event.data;
        if (data.result != 0) {
        }
    }

    private _onGetReadyRep(event: egret.Event): void {
        let data = event.data;
        if (data.result == 0) {//准备成功
            // this["btnFightStatus"].source = "lg_result_btn_blue";
            // if (data.seatid == this.mySeatid) {
            //     this["resultTips"].text = "等待对方准备"
            // }
            // else {
            //     this["resultTips"].text = "对方已准备，马上再战"
            // }
        }
    }

    private _onQuitRoomRep(event: egret.Event): void {
        let data = event.data;
        if (data.result != 0) {
        }
    }

    //匹配计时
    private _GameAni(): void {
        this["matching"].visible = true;
        this["lblStatus"].text = "正在匹配"
        this["myHead1"].visible = true;
        this.waitnum = 0;
        this.matchingInterval = egret.setInterval(() => {
            this.waitnum += 1;
            this["lblWaittime"].text = "已等待" + this.waitnum + "秒";
        }, this, 1000);
    }

    private quickJoinResonpseHandle(e: egret.Event): void {
        var msg: any = e.data;
        let errMsg = {
            2: "体力不足",
            3: "房间已满",
            4: "用户已经存在",
            5: "用户不存在",
            6: "服务器不可用",
            7: "拥有体力超过房间上限",
            10: "请求过于频繁",
            11: "服务器已更新",
        }
        if (msg.result == 0) {
            this._GameAni();
        }
        else if (msg.result == 2) { //体力不足
            this.quitToLobby();
            PanelAlert3.instance.show("金豆不足"+ this._roomInfo.minScore +"，是否前往商城购买？",1,(act)=>{
                if(act == "confirm"){
                    PanelExchange2.instance.show();
                }
            })
        }
    }

    private reconnectTableRepHandle(e: egret.Event): void {
    }


    
    private _onUserInfoResponse(event: egret.Event): void {
    }
    private _onStartGameRep(event: egret.Event): void {
        let data = event.data;
        if (data.result != 0) {
        }
    }

    private _onUserOperateRep(event: egret.Event): void {
        let data = event.data;
    }
}