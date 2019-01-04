/**
 *
 * @author zhanghaichuan
 *
 */
class QznnGamePage extends alien.SceneBase {
    private static STATUS_ADDCARD1: number = 1;
    private static STATUS_ADDCARD2: number = 2;

    protected myGold: MyGold;
    protected ticket:eui.Label;
    private baseScore: eui.Label;
    private backBtn: eui.Button;
    private optionBtn: eui.Button;
    private leaveLabel: eui.Group;
    private waitLabel: eui.Group;
    private startBtn: LabelButton;
    private readyBtn: LabelButton;
    private goonBtn: LabelButton;
    private changeBtn: LabelButton;
    private grpRedcoin:eui.Group;
    private clock: Clock1;
    private counter: Counter;
    private player1: PlayerUI;
    private player2: PlayerUI;
    private player3: PlayerUI;
    private player4: PlayerUI;
    private player5: PlayerUI;
    private cardView1: CardView;
    private cardView2: CardView;
    private cardView3: CardView;
    private cardView4: CardView;
    private cardView5: CardView;
    private resultGold1: ResultGold;
    private resultGold2: ResultGold;
    private resultGold3: ResultGold;
    private resultGold4: ResultGold;
    private resultGold5: ResultGold;
    private statusLabel: StatusLabel;
    private rabBtn1: LabelButton;
    private rabBtn2: LabelButton;
    private multipleBtn1: BetBtn2;
    private multipleBtn2: BetBtn2;
    private multipleBtn3: BetBtn2;
    private rab1: Rab;
    private rab2: Rab;
    private rab3: Rab;
    private rab4: Rab;
    private rab5: Rab;
    private playerSelect: eui.Image;
    private gameMask: eui.Rect;
    private matchWait: eui.Group;
    private chooseCard: QznnChooseCard;
    private isOneGameEnd: Boolean;
    private isChangeTable: Boolean;
    private isReconnect: Boolean;
    private session:number;
    private gameEndtimeOut1: number;
    private gameEndtimeOut2: number;
    private gameEndtimeOut3: number;
    private myName: string;
    private myImgId: string;
    private winSeatId: Array<number>;
    private selfSeatId:number;
    private gameStatus: number;
    private masterSeatId: number;

    private matchScore: number;
    private matchRound: number;
    private teamRound:number;    
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
    private kickbacks =1;
    private isMatch = false;
    private isMatchEnd = false;
    private matchId = 0;
    private isTeam = false;
    private players = null;
    private selfGold = 0;
    private isGameStart= false;
    private isInGame = false;
    private roomsInfo = null;
    private checkGoldTime = null;
    protected static goldPool: ObjectPool;
    /**
     * 红包场的抽红包按钮
     */
    private redNormal_img:eui.Image;

    /**
     * 红包场的抽红包倒计时的label
     */
    private redNormal_label:eui.Label;

    /**
     * 红包场抽红包的倒计时
     */
    private _redNormalNum:number;

    /**
     * 红包赛的规则按钮
     */
    private redNormalHelp_img:eui.Image;

    private isLobbyGoldEnough:boolean;

    /**
     * 是否是金豆不足的情况
     */
    private goldNotEnough:boolean;

    constructor() {
        super();

        this.skinName = QZNNSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this._onAddStage,this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this._onRemoveStage,this);
    }
    private _onAddStage():void{
    }

    private _onRemoveStage():void{
        this.destroy();
        this.removeEventListener(egret.Event.ADDED_TO_STAGE,this._onAddStage,this);
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE,this._onRemoveStage,this);
    }

    private _initListen(bAdd:boolean):void{
        let func = "addEventListener";
        if(!bAdd){
            func = "removeEventListener";
        }
        server[func](EventNamesNiu.USER_QUICK_JOIN_RESPONSE,this.quickJoinResonpseHandle,this);
        server[func](EventNamesNiu.GAME_GIVE_UP_GAME_REP,this.giveUpGameHandle,this);
        server[func](EventNamesNiu.GAME_ASK_READY,this.askReadyHandle,this);
        server[func](EventNamesNiu.GAME_ENTER_TABLE,this.enterTableHandle,this);
        server[func](EventNamesNiu.GAME_TABLE_INFO,this.tableInfoHandle,this);
        server[func](EventNamesNiu.GAME_USER_INFO_IN_GAME_REP,this.userInfoInGameRepHandle,this);
        server[func](EventNamesNiu.GAME_LEAVE_TABLE,this.leaveTableHandle,this);
        server[func](EventNamesNiu.GAME_GET_READY_REP,this.getReadyRepHandle,this);
        server[func](EventNamesNiu.GAME_GAME_START_NTF,this.gameStartNtfHandle,this);
        server[func](EventNamesNiu.GAME_ADD_CARD,this.addCardHandle,this);
        server[func](EventNamesNiu.GAME_SET_SCORE,this.setScoreHandle,this);
        server[func](EventNamesNiu.GAME_ASK_CASHON,this.askCashOnHandle,this);
        server[func](EventNamesNiu.GAME_USE_CARD_NTF,this.useCardNtfHandle,this);
        server[func](EventNamesNiu.GAME_SHOW_CARD,this.showCardHandle,this);
        server[func](EventNamesNiu.GAME_GAME_END,this.gameEndHandle,this);
        server[func](EventNamesNiu.GAME_UPDATE_GAME_INFO,this.updateGameInfoHandle,this);
        server[func](EventNamesNiu.GAME_OPERATE_REP,this.onGameOperateRep,this);
        server[func](EventNamesNiu.USER_RECONNECT_TABLE_REP,this.reconnectTableRepHandle,this);
        server[func](EventNamesNiu.GAME_RECONNECT_REP,this.reconnectRepHandle,this);
        this.player1[func](egret.TouchEvent.TOUCH_TAP,this.onClickHead.bind(this,1),this);
        this.player2[func](egret.TouchEvent.TOUCH_TAP,this.onClickHead.bind(this,2),this);
        this.player3[func](egret.TouchEvent.TOUCH_TAP,this.onClickHead.bind(this,3),this);
        this.player4[func](egret.TouchEvent.TOUCH_TAP,this.onClickHead.bind(this,4),this);
        this.player5[func](egret.TouchEvent.TOUCH_TAP,this.onClickHead.bind(this,5),this);

        this.backBtn[func](egret.TouchEvent.TOUCH_TAP,this.onBackClick,this);
        this.startBtn[func](egret.TouchEvent.TOUCH_TAP,this.onStartBtnClick,this);
        this.readyBtn[func](egret.TouchEvent.TOUCH_TAP,this.onReadyClick,this);
        this.goonBtn[func](egret.TouchEvent.TOUCH_TAP,this.onGoonClick,this);
        this.changeBtn[func](egret.TouchEvent.TOUCH_TAP,this.onChangeClick,this);
        this.rabBtn1[func](egret.TouchEvent.TOUCH_TAP,this.onRabClick,this);
        this.rabBtn2[func](egret.TouchEvent.TOUCH_TAP,this.onRabClick,this);
        this.optionBtn[func](egret.TouchEvent.TOUCH_TAP,this.onSettingClick,this);
        this.multipleBtn1[func](egret.TouchEvent.TOUCH_TAP,this.onMultipleClick,this);
        this.multipleBtn2[func](egret.TouchEvent.TOUCH_TAP,this.onMultipleClick,this);
        this.multipleBtn3[func](egret.TouchEvent.TOUCH_TAP,this.onMultipleClick,this);
        this.redNormalHelp_img[func](egret.TouchEvent.TOUCH_TAP,this._showRedNormalRule,this);
        this.redNormal_img[func](egret.TouchEvent.TOUCH_TAP,this._onClickRedNormal,this);
        this.grpRedcoin[func](egret.TouchEvent.TOUCH_TAP,this._onClickRedCoin,this);
        alien.Dispatcher[func](EventNames.MY_USER_INFO_UPDATE,this._updateRedCoinInfo,this);
    }
    protected initData(): void {
        if(!QznnGamePage.goldPool)
            QznnGamePage.goldPool = ObjectPool.getInstance(egret.getDefinitionByName("FlyGold"));
        
        this.isLobbyGoldEnough = true;
        this._redNormalNum = null;
        this.protoIndex = 0;
        this.kickbacks = this.roomsInfo.kickbacks;
        //this.ticket.text = alien.StringUtils.format(GameConfigNiu.language.taibanfei,this.kickbacks);
        this.ticket.visible = false;
        this.isMatch = false;
        this.isMatchEnd = false;
        this.goldNotEnough = false;
        this.matchId = 0;
        this.isTeam = false;
        this.backBtn.visible=!this.isTeam;
        this.matchLeftPlayer = 0;
        this.matchScore = 0;
        this.matchRound = 0;
        this.teamRound=0;
        this.baseScore.text = "";
        this.setBaseScore();
        this.cardView1.Index = 1;
        this.cardView2.Index = 2;
        this.cardView3.Index = 3;
        this.cardView4.Index = 4;
        this.cardView5.Index = 5;
        this.clearUI(true);
        this.clock.init();
        if(this.isReconnect)
            this.reconnectTableReq();
        else {
            this.addChild(this.startBtn);
        }
        this._showRedNormalImage(false);
    }

    private onClickHead(idx:number):void{
        this._showPlayerInfo(idx);
    }
    protected createChildren(): void {
        super.createChildren();

        this.startBtn.initSkin("btn_word_ksyx_n","btn_word_ksyx_r");
        this.readyBtn.initSkin("btn_word_getready_n","btn_word_getready_h");
        this.goonBtn.initSkin("btn_word_jx_n","btn_word_jx_h");
        this.changeBtn.initSkin("btn_word_exchange_n","btn_word_exchange_h");
        this.rabBtn1.initSkin("btn_word_bq_n","btn_word_bq_h");
        this.rabBtn2.initSkin("btn_word_q4_n","btn_word_q4_h");
      
        this.counter.initSkin();
        this.resultGold2.Align = "right";
        this.resultGold3.Align = "right";
    }

    protected destroy(): void {
        this.playerSelect.removeEventListener(egret.Event.ENTER_FRAME,this.enterFrame,this);
        if(this.gameEndtimeOut1)
            egret.clearTimeout(this.gameEndtimeOut1);
        if(this.gameEndtimeOut2)
            egret.clearTimeout(this.gameEndtimeOut2);
        if(this.gameEndtimeOut3)
            egret.clearTimeout(this.gameEndtimeOut3);

        this._showRedNormalImage(false);
        server.removeEventListener(EventNamesNiu.USER_QUICK_JOIN_RESPONSE,this.quickJoinResonpseHandle,this);
        server.removeEventListener(EventNamesNiu.GAME_GIVE_UP_GAME_REP,this.giveUpGameHandle,this);
        server.removeEventListener(EventNamesNiu.GAME_ASK_READY,this.askReadyHandle,this);
        server.removeEventListener(EventNamesNiu.GAME_ENTER_TABLE,this.enterTableHandle,this);
        server.removeEventListener(EventNamesNiu.GAME_TABLE_INFO,this.tableInfoHandle,this);
        server.removeEventListener(EventNamesNiu.GAME_USER_INFO_IN_GAME_REP,this.userInfoInGameRepHandle,this);
        server.removeEventListener(EventNamesNiu.GAME_LEAVE_TABLE,this.leaveTableHandle,this);
        server.removeEventListener(EventNamesNiu.GAME_GET_READY_REP,this.getReadyRepHandle,this);
        server.removeEventListener(EventNamesNiu.GAME_GAME_START_NTF,this.gameStartNtfHandle,this);
        server.removeEventListener(EventNamesNiu.GAME_ADD_CARD,this.addCardHandle,this);
        server.removeEventListener(EventNamesNiu.GAME_SET_SCORE,this.setScoreHandle,this);
        server.removeEventListener(EventNamesNiu.GAME_ASK_CASHON,this.askCashOnHandle,this);
        server.removeEventListener(EventNamesNiu.GAME_USE_CARD_NTF,this.useCardNtfHandle,this);
        server.removeEventListener(EventNamesNiu.GAME_SHOW_CARD,this.showCardHandle,this);
        server.removeEventListener(EventNamesNiu.GAME_GAME_END,this.gameEndHandle,this);
        server.removeEventListener(EventNamesNiu.GAME_UPDATE_GAME_INFO,this.updateGameInfoHandle,this);
        server.removeEventListener(EventNamesNiu.USER_RECONNECT_TABLE_REP,this.reconnectTableRepHandle,this);
        server.removeEventListener(EventNamesNiu.USER_CHECK_RECONNECT_REP,this.reconnectRepHandle,this);

        server.removeEventListener(EventNamesNiu.GAME_OPERATE_REP,this.onGameOperateRep,this);
        alien.Dispatcher.removeEventListener(EventNames.MY_USER_INFO_UPDATE,this._updateRedCoinInfo,this);
        server.stopCache();
    }

    beforeShow(params: any,back: boolean): void {
        GameConfigNiu.init();
        this.isReconnect = params.data.isReconnect || false;
        this.session = params.data.session;
        this.roomsInfo = params.roomInfo;
        this.roomType = params.roomInfo.roomType;
        this.roomId = params.roomInfo.roomID;

        this.roomBaseScroe = params.roomInfo.baseScore;
        this.roomMinScore = params.roomInfo.minScore;
        this.roomMaxScore = params.roomInfo.maxScore;
        this.initData();
        this._initListen(true);
        MainLogic.instance.setScreenLandScape(1280,640);
        GameSoundManagerNiu.playBgmNow(1);
    }
    
	beforeHide(params:any = null, back:boolean = false):void {
        this._initListen(false);
        this.destroy();
    }

    private _updateRedCoinInfo():void{
        let _data = MainLogic.instance.selfData;
        let _redcoin = _data.redcoin;
        this["lbRedCoin"].text = alien.Utils.flatToString( _redcoin / 100,2);

        let player: PlayerData = this.getPlayerBySeatId(this.selfSeatId);
        if(player){
            player.gold = ""+_data.gold;
            console.log("_updateRedCoinInfo------------------>",player.gold,this.isOneGameEnd,this.goldNotEnough,this.roomMinScore);
            this.myGold.updateGold(player.gold);
            if(_data.gold >= this.roomMinScore){
                if(this.isOneGameEnd){
                    if((this.leaveLabel && this.leaveLabel.parent) || this.goldNotEnough){
                        if(!this.startBtn.parent){
                            this.addChild(this.startBtn);
                        }
                    }
                }
            }
        }
    }

    /**
     * 显示红包赛的规则
     */
    private _showRedNormalRule():void{
        let _text = "";
        _text = "门槛:" + this.roomsInfo.minScore + "金豆。\n"
        +"方式:玩一局请立即领取,10秒超时视为放弃。\n"
        +"奖杯:100随机奖杯。\n"
        +"倍率:底分为"+this.roomsInfo.baseScore +"金豆，"+this.roomsInfo.maxOdds +"倍封顶。\n"
        +"收费:每局游戏每人收取"+ this.roomsInfo.kickbacks+"金豆。\n"
        +"比牌:炸弹>三带对>顺子>三带一>两对>对子>单牌。\n"
        +"单牌排序2>A>K>Q>J>10>9>8>7>6>5>4>3。\n"
        +"当牌型一样,以单牌决定大小。\n"
        +"当牌型与单牌都一样,以拼手气得主为胜。\n"

        Alert.show(_text,0,null,"left");
    }

    /**
     * 清除检测进步不足的timer
     */
    private _clearCheckGoldTime():void{
        if(this.checkGoldTime){
            egret.clearTimeout(this.checkGoldTime);
        }
        this.checkGoldTime = null;
    }

    /**
     * 点击牛牛的抽红包 
     */
    private _onClickRedNormal():void{
        server.lotteryRedCoinReq(this.roomId);
        this._showRedNormalImage(false);
        this._clearCheckGoldTime();
        this.checkGoldTime = egret.setTimeout(()=>{
            if(this.checkGoldNotEnough()){
                this.goldNotEnough = true;
                this.showGoldNotEnough();
            }
        },this,2000)
    }

    /**
     * 点击红包栏
     */
    private _onClickRedCoin():void{
        PanelExchange2.instance.show(4);
    }

    /**
     * 清除10s抽红红包的interval
     */
    private _clearRedNormalInterval():void{       
        if(this._redNormalNum != null){
            egret.clearInterval(this._redNormalNum);
        }
        this._redNormalNum = null;
    }

    /**
     * 显示红包房的抽红包按钮
     * 如果显示则同时播放动画
     */
    private _showRedNormalImage(bShow:boolean,nTime:number = 10):void{
        //console.log("_showRedNormalImage========>",bShow,arguments.callee.caller);
        egret.Tween.removeTweens(this.redNormal_img);
        this._clearRedNormalInterval();
        if(bShow){
            let _func = null;
            _func = function(){
                egret.Tween.get(this.redNormal_img).to({rotation:20},100).to({rotation:-20},100).to({rotation:10},60).to({rotation:-10},60).wait(1000).call(function(){
                    _func();
                }.bind(this));
            }.bind(this); 

		    _func();

            var nSecond = nTime;
            var nCur = nSecond;
            let sCur = "" + nCur;

            this._redNormalNum = egret.setInterval(()=>{
                nCur -= 1; 
                if(nCur <0){
                    nCur = 0;
                    this._showRedNormalImage(false);
                }
                sCur = "" + nCur;
                this.redNormal_label.text = sCur + "s";
            },this,1000);
            
            this.redNormal_label.text = sCur + "s";
        }
        
        this.redNormal_img.visible = bShow;
        this.redNormal_label.visible = bShow;
    }

    private onSettingClick():void{
        PanelSetting.instance.show();
    }

    protected onBackClick(e: egret.TouchEvent): void {
        this.quitGameToMain();
    }

    public removeAChild(child: egret.DisplayObject): void {
        if(child && child.parent) {
            child.parent.removeChild(child);
        }
    }

    private onStartBtnClick(e: egret.TouchEvent): void {
        this.goldNotEnough = false;
        GameSoundManagerNiu.playTouchEffect();
        this.removeAChild(this.startBtn);
        this.quickJoin();
    }

    /**
     * 检测金豆是否不足
     */
    private checkGoldNotEnough():boolean{
        if(MainLogic.instance.selfData.gold < this.roomMinScore){
            return true;
        }
        return false;
    }
    private onReadyClick(e: egret.TouchEvent): void {
        this._clearCheckGoldTime();
        if(this.checkGoldNotEnough()){
            this.showGoldNotEnough();
            this.goldNotEnough = true;
            return;
        }
        GameSoundManagerNiu.playTouchEffect();
        this.getReady();
        this.clock.stopTimer();
        this.removeAChild(this.clock);
        this.removeAChild(this.readyBtn);
        this.removeAChild(this.goonBtn);
        this.removeAChild(this.changeBtn);
    }

    private onGoonClick(e: egret.TouchEvent): void {
        GameSoundManagerNiu.playTouchEffect();
        this.getReady();
        this.onResultComplete();
        this.clock.stopTimer();
        this.removeAChild(this.clock);
        this.removeAChild(this.readyBtn);
        this.removeAChild(this.goonBtn);
        this.removeAChild(this.changeBtn);
    }

    protected giveUpGame(status: number): void {
        var msg: any = {};
        msg.status = status;
        msg.session = 0;
        server.send(EventNamesNiu.GAME_GIVE_UP_GAME_REQ,msg);
    }

    private onChangeClick(e: egret.TouchEvent) {
        GameSoundManagerNiu.playTouchEffect();
        this.onResultComplete();
        this.clock.stopTimer();
        this.removeAChild(this.clock);
        this.removeAChild(this.readyBtn);
        this.removeAChild(this.goonBtn);
        this.removeAChild(this.changeBtn);
        this.isChangeTable = true;
        this.giveUpGame(3);
    }

    private getReady(): void {
        var msg: any = {};
        server.send(EventNamesNiu.GAME_GET_READY_REQ,msg);
    }

    protected quickJoin(gold: number = 0): void {
        var msg: any = {};
        msg.roomid = this.roomId;
        msg.clientid = server.uid;
        msg.gold = gold;
        server.send(EventNamesNiu.USER_QUICK_JOIN_REQUEST,msg);
    }

    private talkNtfHandle(e: egret.Event): void {
        /*var msg: TalkNtf = e.data as TalkNtf;
        var player: PlayerData = this.getPlayerBySeatId(msg.seatid);
        if(player) {
            var p: PlayerUI = this.getPlayer(msg.seatid);
            this.addUI(p.chatBubble);
            p.chatBubble.x = p.x + 125;
            p.chatBubble.y = p.y + 37;
            p.chat(msg.msg);
        }*/
    }

    private quitGameToMain():void{
        PanelPlayerInfo.remove();
        this._clearCheckGoldTime();
        if(!this.isInGame){
            this.giveUpGame(0);
        }
        this.destroy();
        MainLogic.backToRoomScene({toSmall:true});
    }

    private quickJoinResonpseHandle(e: egret.Event): void {
        var msg: any = e.data;
        console.log("快速加入游戏返回:" + msg.result);
        if(msg.result == 0) {
            //console.log("加入游戏成功");
            this.addGameView();
            this.onReadyClick(null);

        }
        else if(msg.result == 2) { //金豆不足
            this.showGoldNotEnough();
        }
        else if(msg.result == 3) { //房间满
           Alert.show("房间已满，请稍后重试",0,(act)=>{
                this.quitGameToMain();
            })
        }
    }

    private onQuickJoinFail(e: egret.Event): void {
        //MessageBox.getInstance().removeEventListener(MessageBox.OK,this.onQuickJoinFail,this);
        //this.back();
    }

    private giveUpGameHandle(e: egret.Event): void {
        var msg: any = e.data;
        //        if(msg.result == 0) {
        console.log("离开游戏");
        //        }
    }

    private setBaseScore(): void {
        if(!this.isMatch)
            this.baseScore.text = "房间底分：" + GoldStr.GoldFormat((this.roomBaseScroe).toString());
        else
            this.baseScore.text = "淘汰积分：" + this.matchScore;
    }

    protected clearUI(isFirstEnter: boolean = false): void {
        //        this.removeAChild(this.backBtn);
        this.selfSeatId = 0;
        this.gameStatus = 0;
        this.masterSeatId = 0;
        this.isOneGameEnd = false;
        this.isChangeTable = false;
        this.counter.initNum();
        this.clock.stopTimer();
        //        this.removeAChild(this.optionBtn);
        this.removeAChild(this.leaveLabel);
        this.removeAChild(this.waitLabel);
        this.removeAChild(this.startBtn);
        this.removeAChild(this.readyBtn);
        this.removeAChild(this.goonBtn);
        this.removeAChild(this.changeBtn);
        this.removeAChild(this.myGold);
        this.removeAChild(this.grpRedcoin)
        this.removeAChild(this.chooseCard);

        this.removeAChild(this.clock);
        this.removeAChild(this.counter);
        this.removePlayers();
        this.removeCardViews();
        this.removeResultGolds();
        this.removeAChild(this.statusLabel);
        this.removeRabBtns();
        this.removeMultipleBtns();
        this.removeRabs();
        this.initRabs();
        this.removeAChild(this.gameMask);
        this.removeAChild(this.playerSelect);


        if(isFirstEnter) {
            this.player1.init(1,this.isMatch);
            this.player2.init(2,this.isMatch);
            this.player3.init(3,this.isMatch);
            this.player4.init(4,this.isMatch);
            this.player5.init(5,this.isMatch);
        }
        else {
            this.player1.init(0,this.isMatch);
            this.player2.init(0,this.isMatch);
            this.player3.init(0,this.isMatch);
            this.player4.init(0,this.isMatch);
            this.player5.init(0,this.isMatch);
        }
    }

    private addGameView(): void {
        this.removeAChild(this.startBtn);
        this.removeAChild(this.leaveLabel);
        if(!this.optionBtn.parent)
            this.addChild(this.optionBtn);
        if(!this.myGold.parent && !this.isMatch)
            this.addChild(this.myGold);
        if(!this.grpRedcoin.parent)
            this.addChild(this.grpRedcoin);
        if(!this.player1.parent)
            this.addChild(this.player1);
        if(!this.player2.parent)
            this.addChild(this.player2);
        if(!this.player3.parent)
            this.addChild(this.player3);
        if(!this.player4.parent)
            this.addChild(this.player4);
        if(!this.player5.parent)
            this.addChild(this.player5);

        this._updateRedCoinInfo();
    }
    private askReadyHandle(e: egret.Event): void {
        var msg: any = e.data;
        if(msg.flag == 1) {
            this.addGameView();
            this.removeAChild(this.waitLabel);
            if(!this.statusLabel.parent)
                this.addChild(this.statusLabel);
            this.statusLabel.setStatus(StatusLabel.GAME_START,Math.floor(msg.time / 100));
        }
        else {

            var msg: any = e.data;
            this.clock.Num = msg.time / 100;
            this.askReadyNow(msg);
            //this.getAlms();
            MainLogic.instance.alms();
        }
    }

    private askReadyNow(msg: any): void {
        if(msg) {
            if(this.isMatch) {
                this.getReady();
            }
            else {
                if(!this.clock.parent)
                    this.addChild(this.clock);
                if(this.isOneGameEnd) {
                    if(!this.goonBtn.parent)
                        this.addChild(this.goonBtn);
                    if(!this.changeBtn.parent)
                        this.addChild(this.changeBtn);
                }
                else {
                    this.clock.Num = msg.time / 100;
                    if(!this.readyBtn.parent)
                        this.addChild(this.readyBtn);
                }
                this.isOneGameEnd = false;
            }
        }
    }

    protected getPlayerByUid(uid: number): PlayerData {
        if(!this.players)
            return null;
        for(var i: number = 0;i < this.players.length;i++) {
            if(this.players[i].uid == uid)
                return this.players[i];
        }
        return null;
    }

    private enterTableHandle(e: egret.Event): void {
        var msg: any = e.data;
        if(msg) {
            if(!this.players)
                this.players = new Array<PlayerData>();
            let player: PlayerData = this.getPlayerByUid(msg.uid);
            let bPush = false;
            if(!player) {
                bPush = true;
                player = new PlayerData();
            }
            if(!msg.gold || !Number(msg.gold)){
                player.gold = "0";
            }else{
                player.gold = msg.gold;
            }
            alien.Utils.injectProp(player,msg);
            player.redcoingot = (msg.redcoingot||0) / 100;
            player.ready = 0;
            player["info"] = msg;
            this.getUserInfo(player.uid);
            if(bPush){
                this.players.push(player);
            }
            if(msg.uid == server.uid) {
                this.onReadyClick(null);
            }
            if(this.isMatch)
                this.checkShowMatchWait();
        }
    }

    private tableInfoHandle(e: egret.Event): void {
        var msg: any = e.data;
        if(msg) {
            if(!this.players)
                this.players = new Array<PlayerData>();
            let oneInfo;
            for(var i: number = 0;i < msg.players.length;i++) {
                oneInfo = msg.players[i];
                if(oneInfo.uid) {
                    let player: PlayerData = this.getPlayerByUid(oneInfo.uid);
                    let bPush = false;
                    if(!player) {
                        bPush = true;
                        player = new PlayerData();
                    }
                    player["info"] = oneInfo;
                    alien.Utils.injectProp(player,oneInfo);
                    player.redcoingot = (oneInfo.redcoingot||0) / 100;
                    if(this.isGameStart)
                        player.ready = 0;
                    else
                        player.ready = oneInfo.ready;
                    if(bPush){
                        this.players.push(player);
                    }
                    this.getUserInfo(player.uid);
                    
                    if(oneInfo.uid == server.uid) {
                        this.selfSeatId = player.seatid;
                    }
                }
            }
            if(this.isMatch)
                this.checkShowMatchWait();
        }
    }

    protected showGoldNotEnough(): void {
        if(!this.readyBtn.parent)
            this.addChild(this.readyBtn);
        PanelAlert3.instance.show("金豆不足"+ this.roomMinScore +"，是否前往商城购买？",1,(act)=>{
            if(act == "confirm"){
                PanelExchange2.instance.show();
            }else{
                this.quitGameToMain();
            }
        })
    }
    

    protected onGoldEnough(e: egret.Event): void {
    }

    protected leaveTableHandle(e: egret.Event): void {
        console.log("leaveTableHandle===========>");
        var msg: any = e.data;
        if(msg) {
            let player: PlayerData;
            if(msg.uid == server.uid) {
                if(msg) {
                    if(msg.uid == server.uid && msg.reason == 4 && !this.isMatch && !this.isTeam) { //金豆不足
                        MainLogic.instance.alms();
                        return;
                    }
                }

                if(this.isChangeTable) {
                    this.isChangeTable = false;
                    player = this.getPlayerByUid(msg.uid);
                    this.quickJoin(Number(player.gold));
                    this.clearUI();
                    this.players = null;
                    if(!this.player1.parent)
                        this.addChild(this.player1);
                    if(!this.player2.parent)
                        this.addChild(this.player2);
                    if(!this.player3.parent)
                        this.addChild(this.player3);
                    if(!this.player4.parent)
                        this.addChild(this.player4);
                    if(!this.player5.parent)
                        this.addChild(this.player5);
                }
                else {
                    this.clearUI();

                    this.isOneGameEnd = true;
                    this.players = null;
                    if(!this.isMatch) {
                        this.addChild(this.startBtn);
                        if(msg.reason == 2) {
                            this.addChild(this.leaveLabel);
                        }
                    }
                }
            }
            else {
                player = this.getPlayerByUid(msg.uid);
                var p: PlayerUI = this.getPlayer(player.seatid);
                p.init(0,this.isMatch);
                this.deletePlayerByUid(msg.uid);
            }
        }
    }

    protected onReconnectPGameRep(e: egret.Event): void {
        var msg: any = e.data;
        if(msg.result == 0) {
            this.roomBaseScroe=msg.bscore;
            this.setBaseScore();
            this.teamRound=msg.playround+1;
        }
    }
    
    private onGameDissolve(e: egret.TouchEvent): void {
        
    }

    private getUserInfo(uid: number): void {
        var msg: any = {};
        msg.uid = uid;
        server.send(EventNamesNiu.GAME_USER_INFO_IN_GAME_REQ,msg);
    }

    private onGameOperateRep(e: egret.Event){
        var msg: any = e.data;
        if(msg) {
            if(msg.optype == 8){
                //赞或者是踩 1:赞 0:踩
                if((msg.result == 0 || msg.result == null) && msg.params && msg.params.length >=2){
                    let _seatId = msg.params[0];
                    var player: PlayerData = this.getPlayerBySeatId(_seatId);
                    if(player) {
                        let _op = msg.params[1];
                        let _data = player;
                        let _coolNum = _data["praise"][0];
                        let _shitNum = _data["praise"][1];
                        if(_op == 0){
                            _data["praise"][1] += 1;
                        }else{
                            _data["praise"][0] += 1;
                        }
                        _data["praise"][_seatId + 1] = _op;
                        PanelPlayerInfo.onPraise(_seatId,_op);
                    }
                }
            }
        }
    }

    private userInfoInGameRepHandle(e: egret.Event): void {
        var msg: any = e.data;
        console.log("userInfoInGameRepHandle===========>",msg);
        if(msg) {
            let player: PlayerData = this.getPlayerByUid(msg.uid);
            if(player) {
                alien.Utils.injectProp(player,msg);
                player.redcoingot = (msg.redcoingot||0) / 100;
                if(msg.praise && msg.praise.length >=5){
                    player["praise"] = msg.praise;
                }
            }
            if(msg.uid == server.uid) {
                this.myName = player.nickname;
                this.myImgId = player.imageid;
            }

            this.setPlayerInfo();
        }
    }

    private getReadyRepHandle(e: egret.Event): void {
        console.log("getReadyRepHandle===========>");
        var msg: any = e.data;
        if(msg) {
            GameSoundManagerNiu.playSoundReadyEffect();
            var player: PlayerData = this.getPlayerBySeatId(msg.seatid);
            if(player) {
                player.ready = msg.result;
                var p: PlayerUI = this.getPlayer(player.seatid);
                p.Ready = player.ready;

                if(player.uid == server.uid) {
                    if(!this.waitLabel.parent && !this.statusLabel.parent)
                        this.addChild(this.waitLabel);
                    this.removeAChild(this.readyBtn);
                    this.removeAChild(this.goonBtn);
                    this.removeAChild(this.changeBtn);
                    this.clock.stopTimer();
                    this.removeAChild(this.clock);
                }
            }
        }
    }

   protected gameStartNtfHandleEff(e: egret.Event): void {
        GameSoundManagerNiu.playSoundStartEffect();
        StartGameEffect.getInstance().addEventListener("complete",this.onStartGameEndEff,this);
        if(!StartGameEffect.getInstance().parent)
            this.addChild(StartGameEffect.getInstance());
        server.startCache();
    }

    private onStartGameEndEff(e: egret.Event): void {
        StartGameEffect.getInstance().removeEventListener(egret.Event.COMPLETE,this.onStartGameEndEff,this);
        this.removeAChild(StartGameEffect.getInstance());
        server.stopCache();
    }

    protected gameStartNtfHandle(e: egret.Event): void {
        console.log("gameStartNtfHandle===========>");
        this.isGameStart = true;
        console.log("游戏开始");
        if(!this.players)
            return null;
        if(this.isMatch) {
            this.addGameView();
            this.setBaseScore();
        }
        this.isInGame = false;
        this.isGameEndEffectEnd = false;
        this._clearCheckGoldTime();
        for(var i: number = 0;i < this.players.length;i++) {
            this.players[i].ready = 0;
            this.players[i].isInGame = true;
            if(this.players[i].uid == server.uid) {
                this.isInGame = true;
               // SetUpUI.getInstance().dispatchEvent(new egret.Event("gameStatus",false,false,1));
            }
        }
        this.player1.Ready = 0;
        this.player2.Ready = 0;
        this.player3.Ready = 0;
        this.player4.Ready = 0;
        this.player5.Ready = 0;
        this.removeAChild(this.statusLabel);
        this.removeAChild(this.waitLabel);
        this.gameStartNtfHandleEff(e);
    }

    private truePlayerNum: number;
    private sendCardCount: number;
    //炸弹7 葫芦6 顺子5 三张4 连对3 对子2 单牌1
    private addCardHandle(e: egret.Event): void {
        console.log("addCardHandle===========>");
        var msg: any = e.data;
        if(msg) {
            msg.time = 558;
            this.sendCardCount = 0;
            this.truePlayerNum = 0;
            this.counter.initNum();
            var player: PlayerData;
            if(msg.cardids.length == 4) {
                if(!this.isReconnect)
                    server.startCache([EventNamesNiu.GAME_USER_INFO_IN_GAME_REP],100);
                this.gameStatus = QznnGamePage.STATUS_ADDCARD1;
                player = this.getPlayerBySeatId(this.selfSeatId);
                if(player && player.uid && player.isInGame) {
                    this.truePlayerNum++;
                    if(!this.cardView1.parent)
                        this.addChild(this.cardView1);
                    this.cardView1.Cards = msg.cardids;
                    this.cardView1.once("complete",this.onSendCardOver,this);
                    this.cardView1.qznnSendCard1(this.isReconnect);
                    //                    this.cardView1.addEventListener(EventNamesNiu.SET_NUM_TEXT,this.onSetNumText,this);
                    //                    this.cardView1.once(EventNamesNiu.AUTO_START,this.autoStart,this);
                    //                    this.counter.once(EventNamesNiu.AUTO_START,this.autoStart,this);
                }

                player = this.getPlayerBySeatId(this.nextSeatId(this.selfSeatId + 1));
                if(player && player.uid && player.isInGame) {
                    this.truePlayerNum++;
                    if(!this.cardView2.parent)
                        this.addChild(this.cardView2);
                    this.cardView2.Cards = [0,0,0,0,0];
                    this.cardView2.once("complete",this.onSendCardOver,this);
                    this.cardView2.qznnSendCard1(this.isReconnect);
                }
                player = this.getPlayerBySeatId(this.nextSeatId(this.selfSeatId + 2));
                if(player && player.uid && player.isInGame) {
                    this.truePlayerNum++;
                    if(!this.cardView3.parent)
                        this.addChild(this.cardView3);
                    this.cardView3.Cards = [0,0,0,0,0];
                    this.cardView3.once("complete",this.onSendCardOver,this);
                    this.cardView3.qznnSendCard1(this.isReconnect);
                }
                player = this.getPlayerBySeatId(this.nextSeatId(this.selfSeatId + 3));
                if(player && player.uid && player.isInGame) {
                    this.truePlayerNum++;
                    if(!this.cardView4.parent)
                        this.addChild(this.cardView4);
                    this.cardView4.Cards = [0,0,0,0,0];
                    this.cardView4.once("complete",this.onSendCardOver,this);
                    this.cardView4.qznnSendCard1(this.isReconnect);
                }
                player = this.getPlayerBySeatId(this.nextSeatId(this.selfSeatId + 4));
                if(player && player.uid && player.isInGame) {
                    this.truePlayerNum++;
                    if(!this.cardView5.parent)
                        this.addChild(this.cardView5);
                    this.cardView5.Cards = [0,0,0,0,0];
                    this.cardView5.once("complete",this.onSendCardOver,this);
                    this.cardView5.qznnSendCard1(this.isReconnect);
                }
                this.statusLabel.setStatus(StatusLabel.RAB,Math.floor(msg.time / 100) - 1);
                if(!this.isReconnect)
                    this.playCardSound(4);
            }
            else {
                this.gameStatus = QznnGamePage.STATUS_ADDCARD2;
                player = this.getPlayerBySeatId(this.selfSeatId);
                if(GameConfigNiu.qznnMode == 1) {
                    if(!this.isReconnect)
                        server.startCache([],100);
                    this.clock.Num = msg.time / 100;
                }
                else {
                    this.removeAChild(this.clock);
                    if(player.isInGame) {
                        if(!this.chooseCard.parent)
                            this.addChild(this.chooseCard);
                        this.chooseCard.setInfo(msg.cardids,msg.time / 100);
                    }
                }


                this.removeAChild(this.statusLabel);
                this.removeMultipleBtns();

                if(player && player.uid && player.isInGame) {
                    this.truePlayerNum++;
                    if(!this.cardView1.parent)
                        this.addChild(this.cardView1);
                    this.cardView1.LastCards = msg.cardids[0];
                    this.cardView1.once("complete",this.onSendCardOver,this);
                    this.cardView1.qznnSendCard2(this.isReconnect);
                    this.cardView1.addEventListener(EventNamesNiu.SET_NUM_TEXT,this.onSetNumText,this);
                    this.cardView1.once(EventNamesNiu.AUTO_START,this.autoStart,this);
                    this.counter.once(EventNamesNiu.AUTO_START,this.autoStart,this);
                    this.chooseCard.once(EventNamesNiu.AUTO_START,this.autoStart,this);
                }

                player = this.getPlayerBySeatId(this.nextSeatId(this.selfSeatId + 1));
                if(player && player.uid && player.isInGame) {
                    this.truePlayerNum++;
                    if(!this.cardView2.parent)
                        this.addChild(this.cardView2);
                    this.cardView2.LastCards = 0;
                    this.cardView2.once("complete",this.onSendCardOver,this);
                    this.cardView2.qznnSendCard2(this.isReconnect);
                }
                player = this.getPlayerBySeatId(this.nextSeatId(this.selfSeatId + 2));
                if(player && player.uid && player.isInGame) {
                    this.truePlayerNum++;
                    if(!this.cardView3.parent)
                        this.addChild(this.cardView3);
                    this.cardView3.LastCards = 0;
                    this.cardView3.once("complete",this.onSendCardOver,this);
                    this.cardView3.qznnSendCard2(this.isReconnect);
                }
                player = this.getPlayerBySeatId(this.nextSeatId(this.selfSeatId + 3));
                if(player && player.uid && player.isInGame) {
                    this.truePlayerNum++;
                    if(!this.cardView4.parent)
                        this.addChild(this.cardView4);
                    this.cardView4.LastCards = 0;
                    this.cardView4.once("complete",this.onSendCardOver,this);
                    this.cardView4.qznnSendCard2(this.isReconnect);
                }
                player = this.getPlayerBySeatId(this.nextSeatId(this.selfSeatId + 4));
                if(player && player.uid && player.isInGame) {
                    this.truePlayerNum++;
                    if(!this.cardView5.parent)
                        this.addChild(this.cardView5);
                    this.cardView5.LastCards = 0;
                    this.cardView5.once("complete",this.onSendCardOver,this);
                    this.cardView5.qznnSendCard2(this.isReconnect);
                }
                if(GameConfigNiu.qznnMode == 2) {
                    this.truePlayerNum = 1;
                }
                if(!this.isReconnect)
                    this.playCardSound(1);
            }



            //            this.clock.Num = msg.time / 100;
            if(this.isReconnect) {
                this.onSendCardOver(null);
            }
        }
    }
    protected playCardSound(times: number, delay: number = 200): void {
        for(var i: number = 0;i < times;i++) {
            egret.setTimeout(GameSoundManagerNiu.playSoundCardEffect,this,delay * i);
        }
    }


    //    private askPlayCardHandle(e:egret.Event):void
    //    {
    //        var msg:AskPlayCard=e.data as AskPlayCard;
    //        if (msg)
    //        {
    //            this.clock.Num=msg.time/100;
    //        }
    //    }

    private onSendCardOver(e: egret.Event): void {
        if(e) {
            this.sendCardCount++;
        }
        else {
            this.sendCardCount = this.truePlayerNum;
        }
        if(this.sendCardCount < this.truePlayerNum)
            return;

        var player: PlayerData = this.getPlayerBySeatId(this.selfSeatId);
        var cardView: CardView = this.getCardView(this.selfSeatId);

        if(this.gameStatus == QznnGamePage.STATUS_ADDCARD1) {
            if(!this.statusLabel.parent)
                this.addChild(this.statusLabel);

            var rab: Rab = this.getRab(this.selfSeatId);
            if(!rab.parent && player.isInGame)
                this.addRabBtns();
            if(!this.isReconnect) {
                //                server.stopCache();
                egret.setTimeout(server.stopCache.bind(server),server,30);
            }
        }
        else if(this.gameStatus == QznnGamePage.STATUS_ADDCARD2) {
            this.removeMultipleBtns();
            cardView.showSelfCardsAndType();
            
            if(GameConfigNiu.qznnMode == 1) {
                //        this.counter.initNum();
                if(!this.clock.parent && this.isGameStart)
                    this.addChild(this.clock);
                if(player.isInGame && !cardView.Finish) {
                    if(!this.counter.parent)
                        this.addChild(this.counter);
                }
            }
            var i: number;
            if(!this.isReconnect)
                server.stopCache();
        }

    }

    private onRabClick(e: egret.TouchEvent): void {
        GameSoundManagerNiu.playTouchEffect();
        var score: number;
        switch(e.target) {
            case this.rabBtn1:
                score = 0;
                break;

            case this.rabBtn2:
                score = 1;
                break;


        }
        this.removeRabBtns();
        var msg: any = {};
        msg.score = score;
        server.send(EventNamesNiu.GAME_ANSWER_MASTER,msg);
    }

    private onMultipleClick(e: egret.TouchEvent): void {
        GameSoundManagerNiu.playTouchEffect();
        var score: number;
        let _target = e.currentTarget;
    
        score = _target["selIdx"];
        this.removeMultipleBtns();
        var msg: any = {};
        msg.session= 0;
        msg.ismaster=false;
        msg.index = 0;
        msg.seatid = 0;
        msg.status = 0;
        msg.score = score;
        server.send(EventNamesNiu.GAME_SET_SCORE,msg);
    }

    private setScoreHandle(e: egret.Event): void {
        console.log("setScoreHandle===========>");
        var msg: any = e.data;
        var player: PlayerUI = this.getPlayer(msg.seatid);
        var rab: Rab = this.getRab(msg.seatid);
        if(this.masterSeatId) {
            player.Multiple = msg.score;
        }
        else {
            if(msg.ismaster) {
                this.masterSeatId = msg.seatid;
                this.removeAChild(this.statusLabel);
                this.removeRabs(false);
                this.removeRabBtns();
                //                player.Master=true;
                server.startCache([],100);
                this.showGetMasterMovie();
            }
            else {
                rab.Rab = msg.score;
                if(!rab.parent)
                    this.addChild(rab);
                if(msg.score > this.maxScore)
                    this.maxScore = msg.score;
            }
        }
    }

    private showGetMasterMovie(): void {
        this.indexP = 0;
        this.setIsQiangZhuang();
        if(this.indexP > 1) {
            this.isMasterMovieEnd = false;
            if(!this.gameMask.parent)
                this.addChild(this.gameMask);
            if(!this.playerSelect.parent)
                this.addChild(this.playerSelect);
            this.frame = 0;
            this.playerSelect.addEventListener(egret.Event.ENTER_FRAME,this.enterFrame,this);
        }
        else {
            this.isMasterMovieEnd = true;
            this.maxScore = 0;
            this.getPlayer(this.masterSeatId).Master = true;
            //            this.clearQiangfen();
            this.removeAChild(this.playerSelect);
            server.stopCache();
        }

    }

    private isMasterMovieEnd: boolean;
    private maxScore: number = 0;
    private indexP: number = 0;
    private frame: number = 0;
    private frameTimes: number = 0;
    private enterFrame(e: Event): void {
        this.frame++;
        if(this.isFrameDo()) {
            GameSoundManagerNiu.playSoundCircleEffect();
            this.frameTimes++;
            var p: PlayerUI;
            while(true) {
                this.indexP++;
                if(this.indexP > 5)
                    this.indexP = 1;
                p = this.getPlayer(this.indexP);
                if(p.IsQiangZhuang)
                    break;
            }
            this.playerSelect.x = p.x + 57;
            this.playerSelect.y = p.y;
            let _len = 1;
            if(this.players){
                _len = this.players.length;
            }
            if(this.frameTimes > _len*2 && this.indexP == this.masterSeatId) {
                this.removeAChild(this.gameMask);
                egret.setTimeout(this.removeAChild.bind(this,this.playerSelect),this,500);
                p.Master = true;
                this.maxScore = 0;
                this.indexP = 0;
                this.frameTimes = 0;
                this.playerSelect.removeEventListener(egret.Event.ENTER_FRAME,this.enterFrame,this);
                this.isMasterMovieEnd = true;
                server.stopCache();
            }

        }
    }

    private isFrameDo(): boolean {
        if(this.frameTimes <= 20) {
            if(this.frame % 4 == 0) {
                this.frame = 0;
                return true;
            }
            else
                return false;
        }
        else if(this.frameTimes <= 22) {
            if(this.frame % 8 == 0) {
                this.frame = 0;
                return true;
            }
            else
                return false;
        }
        else if(this.frameTimes <= 24) {
            if(this.frame % 12 == 0) {
                this.frame = 0;
                return true;
            }
            else
                return false;
        }
        else if(this.frameTimes <= 26) {
            if(this.frame % 16 == 0) {
                this.frame = 0;
                return true;
            }
            else
                return false;
        }
        else {
            if(this.frame % 20 == 0) {
                this.frame = 0;
                return true;
            }
            else
                return false;
        }
    }

    private setIsQiangZhuang(): void {
        var count: number;
        for(var i: number = 0;i < this.players.length;i++) {
            var player: PlayerData = this.players[i];
            if(player) {
                var p: PlayerUI = this.getPlayer(player.seatid);
                var rab: Rab = this.getRab(player.seatid);
                if(player && player.uid && rab.Rab == this.maxScore && player.isInGame) {
                    p.IsQiangZhuang = true;
                    this.playerSelect.x = p.x + 72;
                    this.playerSelect.y = p.y + 15;
                    this.indexP++;
                }
                else
                    p.IsQiangZhuang = false;
            }
        }

    }

    private askCashOnHandle(e: egret.Event): void {
        var msg: any = e.data;
        if(this.selfSeatId == this.masterSeatId) {
            this.statusLabel.setStatus(StatusLabel.WAIT_BET,Math.floor(msg.time / 100));
        }
        else {
            this.statusLabel.setStatus(StatusLabel.BET,Math.floor(msg.time / 100));
            var player: PlayerData = this.getPlayerBySeatId(this.selfSeatId);
            if(player && player.isInGame)
                this.addMultipleBtns(msg.money);
        }
        if(!this.statusLabel.parent)
            this.addChild(this.statusLabel);
    }

    private useCardNtfHandle(e: egret.Event): void {
        console.log("useCardNtfHandle===========>");
        var msg: any = e.data;
        var card: CardView = this.getCardView(msg.seatid);
        //        card.Finish = true;
        if(GameConfigNiu.qznnMode == 2) {
            if(msg.seatid == this.selfSeatId) {
                server.startCache([],100);
                this.chooseCard.addEventListener(egret.Event.COMPLETE,this.onChooseCardComplete,this);
                this.chooseCard.show();
            }
            else {
                card.Finish = true;
                card.qznnSendFifthCard();
            }
        }
        else {
            card.Finish = true;
        }
    }

    private onChooseCardComplete(e: egret.Event): void {
        this.removeAChild(this.chooseCard);
        this.chooseCard.removeEventListener(egret.Event.COMPLETE,this.onChooseCardComplete,this);
        this.cardView1.qznnSendFifthCard(e.data);
    }

    private onSetNumText(e: egret.Event): void {
        this.counter.setNumText(e.data)
    }

    private autoStart(e: egret.Event): void {
        this.useCard();
    }

    private useCard(): void {
        this.counter.removeEventListener(EventNamesNiu.AUTO_START,this.autoStart,this);
        this.cardView1.removeEventListener(EventNamesNiu.AUTO_START,this.autoStart,this);
        this.cardView1.removeEventListener(EventNamesNiu.SET_NUM_TEXT,this.onSetNumText,this);
        this.cardView1.removeTap();
        this.removeAChild(this.counter);


        var msg: any =  {};
        msg.session = 0;
        msg.cardids =[];
        msg.index= 0;
        msg.seatid= 0;

        server.send(EventNamesNiu.GAME_USE_CARD_NTF,msg);
    }


    private showCardHandle(e: egret.Event): void {
        var msg: any = e.data;
        this.removeAChild(this.chooseCard);
        if(msg) {
            this.showCardNow(msg);
        }
    }

    private showCardNow(msg: any) {
        console.log("showCardNow===========>");
        if(msg) {
            if(msg.seatid == this.selfSeatId) {
                this.counter.removeEventListener(EventNamesNiu.AUTO_START,this.autoStart,this);
                this.cardView1.removeEventListener(EventNamesNiu.AUTO_START,this.autoStart,this);
                this.cardView1.removeEventListener(EventNamesNiu.SET_NUM_TEXT,this.onSetNumText,this);

                this.removeAChild(this.counter);
            }

            var cardView: CardView = this.getCardView(msg.seatid);
            if(cardView) {
                cardView.showCard(msg.cardids);
                cardView.Finish = false;
            }
        }
    }


    private gameEndHandle(e: egret.Event): void {
        var msg: any = e.data;
        console.log("gameEndHandle===========>");
        if(msg) {
            if(this.isInGame){
                this._showRedNormalImage(true);
            }
            //server.startCache([RoomTaskRep.pName],100);
            this.isGameEndEffectEnd = false;
            this.isGameStart = false;
            this.isInGame = false;
            this.clock.stopTimer();
            this.removeRabs();
            this.removeAChild(this.clock);
            //var results: Array<ResultData> = [];
            //var isSelfWin: Boolean = false;
            this.winSeatId = [];
            /*if(!this.isMatch && !this.isTeam)
                this.ticket.visible = true;*/

            let idx  = 0;
            for(var i: number = 1;i <= 5;i++) {
                var playerData: PlayerData = this.getPlayerBySeatId(i);
                idx = i-1;
                if(playerData && playerData.isInGame) {
                    var cardView: CardView = this.getCardView(i);
                    let _gold = Number(playerData.gold) + msg.chanage[idx] ||0;
                    playerData.gold = "" +_gold;
                    if(playerData.seatid == this.selfSeatId){
                        MainLogic.instance.selfData.gold = _gold;
                    }
                    if(msg.chanage[idx] > 0)
                        this.winSeatId.push(i);
                    var p: PlayerUI = this.getPlayer(i);
                    p.Multiple = 0;
                    let _changeGold = 0;

                    if(idx < msg.realkickback.length && idx < msg.chanage.length){
                        _changeGold = (msg.chanage[idx] + msg.realkickback[idx]);
                    }
                    p.ChangeGold = ""+ _changeGold;
                    //console.log("endLog----->",playerData);
                }
            }
            this.showWin();
        }
    }

    private showWin(): void {
        for(let i: number = 0;i < this.winSeatId.length;i++) {
            let p: PlayerUI = this.getPlayer(this.winSeatId[i]);
            p.showWin();
        }

        for(let i =1;i<= 5; ++i){
            let playerData: PlayerData = this.getPlayerBySeatId(i);
            if(playerData && playerData.isInGame) {
                let playerUI: PlayerUI = this.getPlayer(playerData.seatid);
                
                let resultGold = this.getResultGold(playerData.seatid);
                this.addChild(resultGold);
                let _changeGold = playerUI.ChangeGold;
                if(isNaN(Number(_changeGold))){
                    _changeGold = "0";
                }
                resultGold.show(_changeGold,0,function(_seatId){
                    let _pData: PlayerData = this.getPlayerBySeatId(_seatId);
                    if(!_pData) return;
                    let _pUI: PlayerUI = this.getPlayer(_pData.seatid);
                    if(_pData.seatid == this.selfSeatId){
                        this.myGold.updateGold(_pData.gold);
                        this.selfGold = Number(_pData.gold);
                    }else{
                        _pUI.Gold = _pData.gold;
                    }
                }.bind(this,i));
            }
        }
        this.isOneGameEnd = true;
    }

    protected flyComplete(e: egret.Event): void {
        (e.target as FlyGold).removeEventListener("flyComplete",this.flyComplete,this);
        QznnGamePage.goldPool.returnObject(e.target);
    }

    /**
     * 各个玩家加减金豆显示完成,清理桌面
     */
    private onResultComplete(): void {
        this.isGameEndEffectEnd = true;

        this.getPlayer(this.masterSeatId).Master = false;
        this.masterSeatId = 0;
        this.removeCardViews();
        this.setPlayerIsNotInGame();
        this.initRabs();
        this.ticket.visible = false;
        server.stopCache();
    }

    private _showPlayerInfo(idx:number):void{
        if(idx < 1 || idx > 5) return;

        let playerUI:PlayerUI = this["player" + idx];
        let _players = this.players;
        let _len = _players.length;
       for(var i: number = 0;i < _len;i++) {
           let player: PlayerUI = this.getPlayer(_players[i].seatid);
           if(playerUI == player){
                let _info = _players[i];
                let _win = _info.totalwincnt;
                let _lose = _info.totallosecnt;
                let _raw = _info.totaldrawcnt;
                let _total = (_win + _lose + _raw) || 1;
                let _rate = Math.floor(100* _win/_total); 
                let data = _info
                data.winRate = _rate;
                data.base64 = true;
		        data.game = _total;
                PanelPlayerInfo.getInstance().show(data);
                return;
           }
       }
    }

    private setPlayerInfo(): void {
        if(this.players) {
            for(var i: number = 0;i < this.players.length;i++) {
                var player: PlayerUI = this.getPlayer(this.players[i].seatid);
                console.log("setPlayerInfo================>",this.players[i]);
                if(player) {
                    player.Nickname = Base64.decode(this.players[i].nickname);
                    player.ImgId = this.players[i].imageid;
                    player.Gold = this.players[i].gold;
                    player.Ready = this.players[i].ready;
                    if(player.Index == 1) {
                        MainLogic.instance.selfData.gold = this.players[i].gold;
                        this.myGold.updateGold(this.players[i].gold);
                        this.selfGold = Number(this.players[i].gold);
                    }
                }
            }
        }
    }


    private updateGameInfoHandle(e: egret.Event): void {

        var msg: any = e.data;
    
        if(msg && msg.params1 && msg.params1.length >= 2 && msg.params1[0] == 250 && msg.params1[1] == 250) {//当自己金豆小于房间的门槛是不清理
            if(msg.params1[3] == 1) {
                this.isLobbyGoldEnough = true;
            }
            else {
                this.isLobbyGoldEnough = false;
            }
            //this.clearUI();
            //this.isGoldNotEnoughAlms = true;
        }
    }

    private reconnectTableReq(): void {
        var msg: any = {};
        msg.result = 0;
        msg.index = this.protoIndex;
        msg.session = this.session;
        server.send(EventNamesNiu.USER_RECONNECT_TABLE_REQ,msg);
    }

    private reconnectTableRepHandle(e: egret.Event): void {
        var msg: any = e.data;
        if(msg) {
            if(msg.result == 0) {

            }
            else if(msg.result == 1 || msg.result == 2) {
                if(this.isMatch) {
                    this.checkShowMatchWait();                    
                }
                else {
                    /*this.removeMessageBoxEventListener();
                    if(msg.result == 1)
                        MessageBox.getInstance().show(GameConfigNiu.language.reconnetResult1,true);
                    else
                        MessageBox.getInstance().show(GameConfigNiu.language.reconnetResult2,true);
                    MessageBox.getInstance().addEventListener(MessageBox.OK,this.msgHandle,this);
                    MessageBox.getInstance().addEventListener(MessageBox.CANCEL,this.msgHandle,this);
                    this.addPopup(MessageBox.getInstance());
                    */
                }
            }
            else {
                if(!this.startBtn.parent && !this.isMatch && !this.isTeam)
                    this.addChild(this.startBtn);

            }
        }
    }
    //    cppToSwf recv:{"data":{ "players":[{ "uid": 101634,"seatid": 1,"params": [1,2,255,0] },{ "uid": 101636,"seatid": 2,"params": [1,2,255,0] },{ "uid": 101643,"seatid": 3,"params": [1,0,255,0] },{ "uid": 101645,"seatid": 4,"params": [1,2,255,0] },{ "uid": 100006244,"seatid": 5,"params": [1,255,255,0] }],"params2":[13,90,103,83],"status":1,"params1":[2],"session":1086160897,"time":86 },"name":"game.ReconnectRep" }
    private reconnectRepHandle(e: egret.Event): void {
        var msg: any = e.data;
        if(msg) {
            this.clearUI();
            var event: egret.Event;
            var setScore: any;

            var i: number = 0;
            let player: PlayerData;
            var rab: Rab;
            var p: PlayerUI;
            var cardView: CardView;

            this.addGameView();
            this.isReconnect = true;
            let _players = msg.players;
            this.isInGame = false;
            if(!this.players)
                this.players = [];
            if(msg.params1&&msg.params1.length > 0 && msg.status > 1) {
                this.masterSeatId = msg.params1.shift();
            }
            if(!_players){
                _players = [];
            }
            this.players = [];
            console.log("reconnectRepHandle===================>",this.masterSeatId,_players,this.players,msg.params2,msg.status);
            for(i = 0;i < _players.length;i++) {
                if(_players[i].uid) {
                    player = this.getPlayerByUid(_players[i].uid);
                    if(player) {
                        player.seatid = _players[i].seatid;
                        player.ready = 0;
                        player.uid = _players[i].uid;
                    }
                    else {
                        player = new PlayerData();
                        player.seatid = _players[i].seatid;
                        player.ready = 0;
                        player.uid = _players[i].uid;
                        this.players.push(player);
                    }
                    if(_players[i].params[0] == 1) {
                        player.isInGame = true;
                        if(player.uid == server.uid)
                            this.isInGame = true;
                    }
                    else
                        player.isInGame = false;
                    if(_players[i].uid == server.uid) {
                        this.selfSeatId = player.seatid;
                    }
                    this.getUserInfo(player.uid);
                }
            }
            if(msg.status) {
                this.isGameStart = true;
                var addCard: any = {};
                addCard.seatid = this.selfSeatId;
                addCard.time = msg.time;
                addCard.cardids = [msg.params2[0],msg.params2[1],msg.params2[2],msg.params2[3]];
                event = new egret.Event("",false,false,addCard);
                this.addCardHandle(event);


                for(i = 0;i < _players.length;i++) {
                    player = this.getPlayerByUid(_players[i].uid);
                    rab = this.getRab(player.seatid);
                    p = this.getPlayer(player.seatid);
                    cardView = this.getCardView(player.seatid);
                    if(msg.status == 1) {
                        if(_players[i].params[1] != 255 && player.isInGame) {
                            setScore = {};
                            setScore.score = _players[i].params[1];
                            setScore.seatid = player.seatid;
                            event = new egret.Event("",false,false,setScore);
                            this.setScoreHandle(event);
                        }
                    }
                    else if(msg.status == 2) {
                        if(this.masterSeatId == player.seatid) {
                            p.Master = true;
                            rab = this.getRab(player.seatid);
                            rab.Rab = _players[i].params[1];
                            if(!rab.parent)
                                this.addChild(rab);
                        }
                        else
                            p.Master = false;
                        if(_players[i].params[2] != 255 && player.isInGame) {
                            p.Multiple = _players[i].params[2]
                        }
                    }
                    else if(msg.status == 3) {
                        if(this.masterSeatId == player.seatid) {
                            p.Master = true;
                            rab = this.getRab(player.seatid);
                            rab.Rab = _players[i].params[1];
                            if(!rab.parent)
                                this.addChild(rab);
                        }
                        else
                            p.Master = false;
                        if(_players[i].params[2] != 255 && player.isInGame) {
                            p.Multiple = _players[i].params[2]
                        }
                        if(String(_players[i].params[3]) == "1") {
                            cardView.Finish = true;
                        }
                    }
                }

                rab = this.getRab(this.selfSeatId);
                p = this.getPlayer(this.selfSeatId);
                player = this.getPlayerBySeatId(this.selfSeatId);
                if(msg.status == 1) {

                }
                else if(msg.status == 2) {
                    this.removeRabBtns();
                    if(this.selfSeatId == this.masterSeatId) {
                        this.statusLabel.setStatus(StatusLabel.WAIT_BET,Math.floor(msg.time / 100));
                    }
                    else {
                        if(p.Multiple == 0 && player.isInGame)
                            this.addMultipleBtns(msg.params1);
                        this.statusLabel.setStatus(StatusLabel.BET,Math.floor(msg.time / 100));
                    }
                }
                else if(msg.status == 3) {
                    this.removeRabBtns();

                    addCard = {};
                    addCard.seatid = this.selfSeatId;
                    if(msg.params2.length >= 7)
                        addCard.cardids = [msg.params2[4],msg.params2[5],msg.params2[6]];
                    else
                        addCard.cardids = [msg.params2[4]];
                    addCard.time = msg.time;
                    event = new egret.Event("",false,false,addCard);
                    this.addCardHandle(event);

                }
            }   
        
        }
        this.isReconnect = false;
    }

    private matchInfoNtfRepHandler(e: egret.Event): void {
        /*var msg: any = e.data;
        if(!msg) return;
        if(msg.matchid != this.matchId) return;
        if(msg) {
            if(msg.optype == 1) {
                this.matchLeftPlayer = msg.params[1];
                if(this.matchLeftPlayer <= 5) {
                    GameSoundManagerNiu.playBGMJueSai();
                    this.matchTime.stop();
                    this.removeAChild(this.matchTime);
                }
            }
            else if(msg.optype == 2) {
                var matchData: any = GameLogic.getMatchDataByMatchId(GameLogic.currentMatchId);
                this.matchBaseScoreSave = msg.params[0];
                this.matchScore = msg.params[0] * matchData.stage[0].kickOutOdds;
                if(msg.params.length > 3) {
                    this.matchTime.Time = msg.params[3];
                }
                if(this.baseScore.text == "")
                    this.setBaseScore();
            }
            else if(msg.optype == 4) {
                this.matchRound++;
            }
            else if(msg.optype == 3)//结算
            {
                var fun: Function = function(): void {
                    if(!this.isGameEndEffectEnd) {
                        this.gameEndtimeOut3 = setTimeout(fun.bind(this),1000);
                        return;
                    }
                    else {
                        console.log("比赛结束");
                        this.removeAChild(QznnMatchWaitEffect.getInstance())
                        if(!this.matchResult.parent)
                            this.addChild(this.matchResult);


                        this.matchResult.setResult(msg.params[0]);
                    }
                }
                this.isMatchEnd = true;
                this.gameEndtimeOut3 = setTimeout(fun.bind(this),1000);
            }
            this.checkShowMatchWait();
        }*/
    }

    private checkShowMatchWait(needShowPromoted: boolean = false): void {

    }

    private chekShowMatchPromoted(): void {

    }

    private enterMatchRepHandler(e: egret.Event): void {
        var msg: any = e.data;
        if(msg.result == 0) {
            console.log("加入比赛成功");
            //            if (!this.isReconnect)
            //                this.addGameView();
        }
    }
    private setMainUIVis(b: boolean): void {
        this.optionBtn.visible = b;
        this.leaveLabel.visible = b;
        this.startBtn.visible = b;
        this.readyBtn.visible = b;
        this.goonBtn.visible = b;
        this.changeBtn.visible = b;
        this.myGold.visible = b;
        this.grpRedcoin.visible = b;
        this.clock.visible = b;
        this.counter.visible = b;
        this.player1.visible = b;
        this.player2.visible = b;
        this.player3.visible = b;
        this.player4.visible = b;
        this.player5.visible = b;
        this.cardView1.visible = b;
        this.cardView2.visible = b;
        this.cardView3.visible = b;
        this.cardView4.visible = b;
        this.cardView5.visible = b;
        this.resultGold1.visible = b;
        this.resultGold2.visible = b;
        this.resultGold3.visible = b;
        this.resultGold4.visible = b;
        this.resultGold5.visible = b;
        this.statusLabel.visible = b;
        this.rabBtn1.visible = b;
        this.rabBtn2.visible = b;
        this.multipleBtn1.visible = b;
        this.multipleBtn2.visible = b;
        this.multipleBtn3.visible = b;
        this.rab1.visible = b;
        this.rab2.visible = b;
        this.rab3.visible = b;
        this.rab4.visible = b;
        this.rab5.visible = b;
        this.gameMask.visible = b;
        this.playerSelect.visible = b;
    }

    protected getPlayer(seatId: number): PlayerUI {
        if(seatId == this.selfSeatId)
            return this.player1;
        else if((seatId - this.selfSeatId) == 1 || (seatId - this.selfSeatId) == -4)
            return this.player2;
        else if((seatId - this.selfSeatId) == 2 || (seatId - this.selfSeatId) == -3)
            return this.player3;
        else if((seatId - this.selfSeatId) == 3 || (seatId - this.selfSeatId) == -2)
            return this.player4;
        else if((seatId - this.selfSeatId) == 4 || (seatId - this.selfSeatId) == -1)
            return this.player5;
        else {
            console.log("getPlayer 找不到玩家");
            return null;
        }
    }

    private getCardView(seatId: number): CardView {
        if(seatId == this.selfSeatId)
            return this.cardView1;
        else if((seatId - this.selfSeatId) == 1 || (seatId - this.selfSeatId) == -4)
            return this.cardView2;
        else if((seatId - this.selfSeatId) == 2 || (seatId - this.selfSeatId) == -3)
            return this.cardView3;
        else if((seatId - this.selfSeatId) == 3 || (seatId - this.selfSeatId) == -2)
            return this.cardView4;
        else if((seatId - this.selfSeatId) == 4 || (seatId - this.selfSeatId) == -1)
            return this.cardView5;
        else {
            console.log("getcard 找不到玩家");
            return null;
        }
    }

    private getResultGold(seatId: number): ResultGold {
        if(seatId == this.selfSeatId)
            return this.resultGold1;
        else if((seatId - this.selfSeatId) == 1 || (seatId - this.selfSeatId) == -4)
            return this.resultGold2;
        else if((seatId - this.selfSeatId) == 2 || (seatId - this.selfSeatId) == -3)
            return this.resultGold3;
        else if((seatId - this.selfSeatId) == 3 || (seatId - this.selfSeatId) == -2)
            return this.resultGold4;
        else if((seatId - this.selfSeatId) == 4 || (seatId - this.selfSeatId) == -1)
            return this.resultGold5;
        else {
            console.log("getResultGold 找不到玩家");
            return null;
        }
    }

    private getRab(seatId: number): Rab {
        if(seatId == this.selfSeatId)
            return this.rab1;
        else if((seatId - this.selfSeatId) == 1 || (seatId - this.selfSeatId) == -4)
            return this.rab2;
        else if((seatId - this.selfSeatId) == 2 || (seatId - this.selfSeatId) == -3)
            return this.rab3;
        else if((seatId - this.selfSeatId) == 3 || (seatId - this.selfSeatId) == -2)
            return this.rab4;
        else if((seatId - this.selfSeatId) == 4 || (seatId - this.selfSeatId) == -1)
            return this.rab5;
        else {
            console.log("rab 找不到玩家");
            return null;
        }
    }



    private nextSeatId(value: number): number {
        if(value > 5)
            return value - 5;
        else if(value <= 0)
            return value + 5;
        else
            return value;
    }

    private getPlayerBySeatId(seatId: number): PlayerData {
        if(!this.players)
            return null;
        for(var i: number = 0;i < this.players.length;i++) {
            if(this.players[i].seatid == seatId)
                return this.players[i];
        }
        return null;
    }

    private setPlayerIsNotInGame(): void {
        if(!this.players)
            return null;
        for(var i: number = 0;i < this.players.length;i++) {
            if(this.players[i].uid)
                this.players[i].isInGame = false;
        }
    }

    private deletePlayerByUid(uid: number): void {
        if(this.players) {
            for(var i: number = 0;i < this.players.length;i++) {
                if(this.players[i].uid == uid) {
                    this.players.splice(i,1);
                    return;
                }
            }
        }
    }

    private initRabs(): void {
        this.rab1.initRabValue();
        this.rab2.initRabValue();
        this.rab3.initRabValue();
        this.rab4.initRabValue();
        this.rab5.initRabValue();
    }

    private removeRabs(needRemoveMaster: boolean = true): void {
        this.removeAChild(this.rab1);
        this.removeAChild(this.rab2);
        this.removeAChild(this.rab3);
        this.removeAChild(this.rab4);
        this.removeAChild(this.rab5);
        //        if(!needRemoveMaster)
        //        {
        //            var rab:Rab=this.getRab(this.masterSeatId);
        //            this.addChild(rab);
        //        }
    }

    private removeMultipleBtns(): void {
        this.removeAChild(this.multipleBtn1);
        this.removeAChild(this.multipleBtn2);
        this.removeAChild(this.multipleBtn3);
    }

    private removeRabBtns(): void {
        this.removeAChild(this.rabBtn1);
        this.removeAChild(this.rabBtn2);
    }

    private removeResultGolds(): void {
        this.removeAChild(this.resultGold1);
        this.removeAChild(this.resultGold2);
        this.removeAChild(this.resultGold3);
        this.removeAChild(this.resultGold4);
        this.removeAChild(this.resultGold5);
    }

    private removeCardViews(): void {
        this.removeAChild(this.cardView1);
        this.removeAChild(this.cardView2);
        this.removeAChild(this.cardView3);
        this.removeAChild(this.cardView4);
        this.removeAChild(this.cardView5);
    }

    private removePlayers(): void {
        this.removeAChild(this.player1);
        this.removeAChild(this.player2);
        this.removeAChild(this.player3);
        this.removeAChild(this.player4);
        this.removeAChild(this.player5);
    }

    private addRabBtns(): void {
        if(!this.rabBtn1.parent)
            this.addChild(this.rabBtn1);
        if(!this.rabBtn2.parent)
            this.addChild(this.rabBtn2);

    }

    private addMultipleBtns(values: Array<number>): void {
        let _stageWidth = alien.StageProxy.stage.stageWidth;
        this.removeMultipleBtns();
        if(values.length == 1) {
            this.addChild(this.multipleBtn1);
            this.multipleBtn1.Bet = String(values[0]);
            this.multipleBtn1.x = (_stageWidth - this.multipleBtn1.width) / 2;
            this.multipleBtn1["selIdx"] = 1;
        }
        else if(values.length == 2) {
            this.addChild(this.multipleBtn1);
            this.addChild(this.multipleBtn2);
            this.multipleBtn1.Bet = String(values[1]);
            this.multipleBtn1["selIdx"] = 2;
            this.multipleBtn2.Bet = String(values[0]);
            this.multipleBtn2["selIdx"] = 1;
            this.multipleBtn1.x = (_stageWidth - this.multipleBtn1.width) / 2 - 100;
            this.multipleBtn2.x = (_stageWidth - this.multipleBtn1.width) / 2 + 100;
        }
        else if(values.length == 3) {
            this.addChild(this.multipleBtn1);
            this.addChild(this.multipleBtn2);
            this.addChild(this.multipleBtn3);
            this.multipleBtn1.Bet = String(values[2]);
            this.multipleBtn2.Bet = String(values[1]);
            this.multipleBtn3.Bet = String(values[0]);
            this.multipleBtn1.x = (_stageWidth - this.multipleBtn1.width) / 2 - 200;
            this.multipleBtn2.x = (_stageWidth - this.multipleBtn1.width) / 2;
            this.multipleBtn3.x = (_stageWidth - this.multipleBtn1.width) / 2 + 200;
            
            this.multipleBtn1["selIdx"] = 3;
            this.multipleBtn2["selIdx"] = 2;
            this.multipleBtn3["selIdx"] = 1;
        }

    }
}
