
/**
 * 德州扑克游戏场景
 */
class SceneDzpkPlay extends alien.SceneBase {
    private _seats:any;
    private _mySeat:SeatDzpk;
    private _roomInfo:any;
    /** 
     * 记录桌面上的5张牌
     */
    private _cards:any; 

    /**
     * 记录我的手牌
     */
    private _myCards:any;

    /**
     * 上一个操作的玩家
     */
    private _lastOpSeat:SeatDzpk;

    /**
     * 是否在处理发公共牌,转牌或者是牌阶段
     */
    private _inTurnProc:boolean;

    /**
     * 最小下注的筹码
     */
    private _minChip:number = 0;
	/**
	 * 玩家当前局的默认选择
     * 6:让或者弃
     * 7:跟任何注
	 */
	private _myCTOptype:number;

    /**
     * 第一轮是否有人加注
     */
    private _firstTurnHasAdd:boolean;

    /**
     * 开宝箱的倒计时
     */
    private _dropInterval:number;

    /**
     * 加注上方的可选项配置
     */
    private _addCfg ={
        [1]:{tit:"大盲",con:["2X","3X","4X","5X"],val:[2,3,4,5]},
        [2]:{tit:"底池",con:["1/3","1/2","2/3","1倍"],val:[0.33,0.5,0.67,1]},
        [3]:[5,10,25,50]
    }

    /**
     * 底池的筹码信息
     */
    private _pools;

    /**
     * 历史记录
     */
    private _historyData:any;

    /**
     * 当前游戏的局数
     */
    private _curGameIdx:number = 0;
   /**
     * 获取历史记录的局数
     */
    private _getHistoryIdx:number = 0;

    /**
     * 我加入了桌子
     */
    private _inTable:boolean;

    /**
     * 是否有宝箱掉落
     */
    private _hasDrop:boolean;

    /**
     * 关闭加注面板后是否要显示快捷下注项
     */
    private _xPotShouldShow:boolean;

    /**
     *  关闭加注面板后是否要显示我的操作
     */
    private _myOpShouldShow:boolean;

    constructor() {
        super();

        this.init();
    }

    private init(): void {
        this.skinName = scenes.SceneDzpkPlaySkin;
    }

    protected createChildren(): void {
        super.createChildren();
    }

    private _initSeat():void{
        this._mySeat = this["mySeat"];
        this._seats = [this["_mySeat"],
        this["leftSeat1"],this["leftSeat2"],this["leftSeat3"],
        this["topSeat1"],this["topSeat2"],
        this["rightSeat3"],this["rightSeat2"],this["rightSeat1"]]
    }

    /**
     * 初始化桌面的5张牌
     */
    private _initDeskCards():void{
        this._cards = [];
        this._myCards = [];
        let grp = this["deskCardGroup"];
        let obj = null;
        while(grp.numChildren > 0){
            obj = grp.removeChildAt(0);
            CardDzpk.recycle(obj); 
        }
    }

    /**
     * 显示我的可操作选项
     */
    private _showMyOpGrp(bShow):void{
        this["myOpGroup"].visible = bShow;
    }

    /*
    * 显示加注滑动条
    */
    private _showAddGrp(bShow):void{
        this["addGrp"].visible = bShow;
    }

    /**
     * 设置加注的滚动条位置
     */
    private _setAddSliderV(val):void{
        this["chipSlider"].value = val;
        this._chagneFloatAndSliderChipVal();
    }

    /**
     * 清除玩家,仅仅隐藏
     */
    private _cleanPlayers():void{
        let len = this._seats.length;
        for(let i=0;i<len;++i){
            this._seats[i].setLeaveTable();
        }
    }

    /**
     * 显示屏幕中间的发牌
     */
    private _showSendCard(bShow):void{
        this["sendCardImg"].visible = bShow;
    }


    /**
     * 显示屏幕中间的加注几倍的大盲注或者是几倍的底池
     */
    private _showDeskOpot(bShow):void{
        this["deskXPotGrp"].visible = bShow;
    }

    /**
     * 显示让或者弃
     */
    private _showGiveOrSkip(bShow):void{
        this["sOrgGrp"].visible = bShow;
    }

     /**
     * 显示跟任何注
     */
    private _showFollowAll(bShow):void{
        this["fallGrp"].visible = bShow;
    }

    /**
     * 重置让或者弃和跟任何注的选择
     */
    private _resetGiveOrSkipSel():void{
        this["opRImg2"].source = "play_bg2";
        this["opRImg7"].source = "play_bg2";
    }

    /**
     * 设置选中让或弃 还是跟任何注
     */
    private _setSelGSOrFA():void{
        this._resetGiveOrSkipSel();
        let target = null;
        let selOp = this._getMyThisTurnDefOp();
        if(selOp == 6){
            target = this["opRImg2"];
        }else if(selOp == 7){
            target = this["opRImg7"];
        }else{
            return;
        }
        target.source = "play_bg1";
    }

    /**
     * 获取所有下注的筹码 底池,边池,玩家已下注的筹码
     */
    private _getAllChips():number{
        let num = 0;
        let obj = null;
        let seat:SeatDzpk;
        let pools = this._pools ||[];
        let poolLen = pools.length;
        for(let i=0;i<poolLen;++i){
            num += pools[i];
        }

        for(let j=0;j<9;++j){
            seat = this._seats[j];
            if(seat.inGame){
                num += seat.getHasChipNum();
            }
        }
        return num;
    }

    /**
     * 设置加注按钮上方的可操作选项
     * 返回是否有一个选项可以操作
     */
    private _setDeskOptByTurn():boolean{
        let cfgs =null;
        let hasOne = false;
        let baseVal = 0;
        let minChip = 0;
        if(this._cards.length <3){
            cfgs = this._addCfg[1];
            baseVal = this._roomInfo.bigblind;
            if(this._firstTurnHasAdd){ //有人加注
                cfgs = this._addCfg[2];
                baseVal = this._getAllChips();
            }
        }else{
            cfgs = this._addCfg[2];
            baseVal = this._getAllChips();
        }

        minChip = this._getMinChip();

        let val;
        let opNeedVal;
        let obj;
        let chipNum;
        let leftGold = this._mySeat.getGold();
        for(let i=1;i<=4;++i){
            obj = this["xPot" + i];
            this["xPotTlable" + i].text = cfgs.tit;
            this["xPotClable" + i].text = cfgs.con[i-1];
            val = cfgs.val[i-1];
            chipNum = Math.floor(val * baseVal);
            opNeedVal = chipNum + minChip;
            if(leftGold < opNeedVal){
                obj.alpha = 0.5;
                obj.touchEnabled = false;
            }else{
                obj.alpha = 1;
                obj.touchEnabled = true;
                hasOne = true;
            }
            obj.chipNum = chipNum;
        }
        return hasOne;
    }

    /**
     * 设置玩家当前轮的选中的默认操作 
     * 0:无选中任何项
     * 6:让或者弃
     * 7:跟任何注
     */
    private _setMyThisTurnDefOp(op:number):void{
        this._myCTOptype = op;
    }

    /**
     * 玩家当前轮的操作
     */
    private _getMyThisTurnDefOp():number{
        return this._myCTOptype;
    }

    /**
     * 初始化可下几倍盲注的选择项的坐标
     */
    private _initFourXPotsPos():void{
        let grpW = this["deskXPotGrp"].width;
        let onePotW = this["xPot1"].width;
        let padding = (grpW - onePotW*4)*0.3
        for(let i=0;i<4;++i){
            this["xPot" + (i+1)].x = onePotW * (i+0.5)  + i * padding;
        }
    }

    /**
     * 第一轮是否有人加注
     */
    private _setFirstTurnHasAdd(bAdd:boolean):void{
        this._firstTurnHasAdd = bAdd;
    }

    /**
     * 初始化加注页面上的四个加注选项的坐标和值
     */
    private _initFourAddChipPosAndVal():void{
        let okAddChip = this["okAddChip"];
        let okAddChipX = okAddChip.x;
        let halfOkAddChipW = okAddChip.width * 0.5;
        let obj:any;
        let startX:number;
        let chipNum;
        let oneItemW = this["addChip1"].width;
        for(let i=0;i<4;++i){
            obj = this["addChip" + (i+1)];
            chipNum =  this._addCfg[3][i] * this._roomInfo.bigblind;
            if(i>=2){
                startX = okAddChipX + halfOkAddChipW;  
                obj.x = startX + (i-1) * 30 + (i-2+0.5)*oneItemW;
            }else{
                startX = okAddChipX - halfOkAddChipW;
                obj.x = startX + (i-2) * 30 + (i-2+0.5)*oneItemW;
            }
            obj.chipNum = chipNum;
            this["addLable" + (i+1)].text = Utils.getFormatGold(chipNum);
        }
    }

    /**
     * 初始化可加注的四个选项点击和透明度
     */
    private _initFourAddChipTouch():void{
        let leftGold = this._mySeat.getGold();
        let needGold:number;
        let obj:any;
        for(let i=1;i<=4;++i){
            obj = this["addChip" + i];
            needGold = obj.chipNum + this._getMinChip();
            if(needGold > leftGold){
                obj.alpha = 0.5;
                obj.touchEnabled = false;
            }else{
                obj.alpha = 1;
                obj.touchEnabled = true;
            }
        }
    }

    /**
     * 初始化几人桌，大小盲注
     */
    private _initRoomDesc():void{
        this["tableLabel"].text = "盲注" + this._roomInfo.smallblind + "/" + this._roomInfo.bigblind;
    }

    /**
     * 显示底池筹码
     */
    private _showPublicPot(bShow:boolean):void{
        this["publicChipInfo"].visible = bShow;
    }
    /**
     * 显示边池组
     */
    private _showSidePotsGroup(bShow:boolean):void{
        this["sidePotsGrp"].visible = bShow;
    }

    /**
     * 显示滑条旁漂浮显示的筹码
     */
    private _showFloatChip(bShow:boolean):void{
        this["floatChipGrp"].visible = bShow;
    }

    /**
     * 更新滑条旁漂浮显示的筹码坐标
     */
    private _updateFloatChipPos():void{
        this["floatChipGrp"].y = this["chipSlider"].y + this["chipSlider"]["thumb"].y;
    }

    /**
     * 显示加注条顶部的最大下注
     */
    private _showMaxChipGrp(bShow:boolean):void{
        this["maxChipGrp"].visible = bShow;
    }

    /**
     * 显示我赢了的图片
     */
    private _showMyWinImg(bShow:boolean):void{
        this["myWinImg"].visible = bShow;
    }

    /**
     * 清除10s开宝箱
     */
    private _clearDropInterval():void{       
        if(this._dropInterval){
            egret.clearInterval(this._dropInterval);
            this._dropInterval = null;
        }
        egret.Tween.removeTweens(this["dropImg"]);
    }


    /**
     * 显示掉落
     */
    private _showDropGrp(bShow:boolean,nTime:number = 10):void{
        this._clearDropInterval();
        if(bShow){
            let _func = null;
            _func = function(){
                egret.Tween.get(this["dropImg"]).to({rotation:20},100).to({rotation:-20},100).to({rotation:10},60).to({rotation:-10},60).wait(1000).call(function(){
                    _func();
                }.bind(this));
            }.bind(this); 

		    _func();

            var nSecond = nTime;
            var nCur = nSecond;
            let sCur = "" + nCur;

            this._dropInterval = egret.setInterval(()=>{
                nCur -= 1; 
                if(nCur <0){
                    nCur = 0;
                    this._checkGoldEnough();
                    this._showDropGrp(false);
                }
                sCur = "" + nCur;
                this["dropLabel"].text = sCur + "s";
            },this,1000);
            
            this["dropLabel"].text = sCur + "s";
        }
        
        this["dropLabel"].visible= bShow;
        this["dropGrp"].visible = bShow;
    }

    /**
     * 初始化点击事件
     */
    private _initClick():void{
        this["ruleImg"]["addClickListener"](this._onClickRule,this);
        this["historyImg"]["addClickListener"](this._onClickHistory,this);
        this["dropGrp"]["addClickListener"](this._onClickOpenDrop,this,false);
        this["sOrgGrp"]["addClickListener"](this._onClickGiveOrSkip,this,false);
        this["fallGrp"]["addClickListener"](this._onClickFollowAll,this,false);
        this["xPot1"]["addClickListener"](this._onClickDeskOptItem.bind(this,1),this);
        this["xPot2"]["addClickListener"](this._onClickDeskOptItem.bind(this,2),this);
        this["xPot3"]["addClickListener"](this._onClickDeskOptItem.bind(this,3),this);
        this["xPot4"]["addClickListener"](this._onClickDeskOptItem.bind(this,4),this);
        this["addChip1"]["addClickListener"](this._onClickAddItem.bind(this,1),this);
        this["addChip2"]["addClickListener"](this._onClickAddItem.bind(this,2),this);
        this["addChip3"]["addClickListener"](this._onClickAddItem.bind(this,3),this);
        this["addChip4"]["addClickListener"](this._onClickAddItem.bind(this,4),this);
        this["soundImg"]["addClickListener"](this._onClickSound,this,false);
        this["bgRect"]["addClickListener"](this._onClickAddGrpBg,this,false);
        this["shopImg"]["addClickListener"](this._onClickShop,this);
        this["arrDownImg"]["addClickListener"](this._onClickDownArr,this);
        this["addChipImg"]["addClickListener"](this._onClickAddChip,this);
        this["giveUpChipImg"]["addClickListener"](this._onClickGiveupChip,this);
        this["followGrp"]["addClickListener"](this._onClickFollowChip,this);
        this["allInGrp"]["addClickListener"](this._onClickAllIn,this);
        this["allInAddGrp"]["addClickListener"](this._onClickAllIn,this);
        this["skipChipImg"]["addClickListener"](this._onClickSkipChip,this);
        this["okAddChip"]["addClickListener"](this._onClickSureAddChip,this);
        this["chipSlider"].addEventListener(eui.UIEvent.CHANGE,this.onSliderValChange,this);
    }

    /**
     * 滑动选中下注筹码
     */
    private onSliderValChange(e:egret.Event):void{
        let slider:eui.VSlider = this["chipSlider"];
        slider.validateDisplayList(); //滑条的坐标没有及时刷新;
        this._chagneFloatAndSliderChipVal();
        this._showFloatChip(true);
        this._updateFloatChipPos();
    }
    /**
     * 获取加注的最大筹码
     */
    private _getMaxChip():number{
        return this._mySeat.getGold();
    }

    /**
     * 获取加注最小筹码
     */
    private _getMinChip():number{
        let minChip = this._minChip;
        return minChip;
    }

    /**
     * 设置最小的筹码
     */
    private _setMinChip(minChip:number):void{
        this._minChip = minChip;
    }

    /**
     *设置可下的最大筹码
     */
    private _setMaxChipVal():void{
        let max = this._getMaxChip();
        this["maxChipLabel"].text = max;
    }
    /**
     *设置可下的最小筹码
     */
    private _setMinChipVal():void{
        this._setAddSliderV(1);
    }
    /**
     * 设置滑条上的筹码
     */
    private _setSliderChip(sChip):void{
        this["chipSlider"]["infoLabel"].text = sChip;
    }

    /**
     * 更新滑条左侧显示当前选中的筹码
     */
    private _chagneFloatAndSliderChipVal():void{
        let slider:eui.VSlider = this["chipSlider"];
        let value =  slider.value;
        let percent = (value /10);
        let myChip = this._getMaxChip();
        let minChip = this._getMinChip(); 
        let proNum = myChip - minChip; 
        let nV = percent * proNum;

        let gold = nV - nV%10;
        gold += minChip;
        if(gold <=0){
            gold = this._roomInfo.bigblind;
        }
        let selChip = "" + gold;
        if(value>=10){
            selChip = "all in"
            this._showMaxChipGrp(false);
        }else{
            this._showMaxChipGrp(true);
        }
        this._setSliderChip(selChip);
        this["selLabel"].text = "" + gold;
    }

    /**
     * 获取选中的加注筹码
     */
    private _getSelChip():number{
        let text = this["selLabel"].text;
        return Number(text);
    }

    /**
     * 游戏开始前需要的准备工作
     */
    private _doGameInit():void{
        this._updatePublicPot(0);
        this._initDeskCards();
        this._showPublicPot(false);
        this._showMyOpGrp(false);  
        this._showSendCard(false);
        this._showAddGrp(false);
        this._showSidePotsGroup(false);
        this._showDeskOpot(false);
        this._showGiveOrSkip(false);
        this._showFollowAll(false);
        this._showMyWinImg(false);
        this._initRoomDesc();
        this._setFirstTurnHasAdd(false);
        this._setMyThisTurnDefOp(0);
        this._pools = [];
        this._hasDrop = false;
        this._inTable = true;
        this._xPotShouldShow = false;
        this._myOpShouldShow = false;
    }

    beforeShow(params: any): void {
        this._roomInfo = params.roomInfo;
        this._initClick();
        this._initSeat();
        this._initServerListen(true);
        this._showDropGrp(false);
        this._doGameInit();
        this._cleanPlayers();
        if(params && params.data&&params.data.isReconnect){
            this._reconnectTableReq();
        }else{
            this._quickJoin();
        }
        this._initSound();
        alien.SoundManager.instance.enablePlayMusic(false);
        alien.SoundManager.instance.stopMusic();
        MainLogic.instance.setScreenPortrait(750,1334);
    }

    /**
     * 初始化音效的图标
     */
    private _initSound():void{
        let mute = alien.SoundManager.instance.effectMute;
        let src = "play_son";
        if(mute){
            src = "play_soff";
        }
        this["soundImg"].source = src;
    }

    /**
     * bAdd true则为添加 false则为删除
     */
    private _initServerListen(bAdd:boolean):void{
        let func = "addEventListener";
        if(!bAdd){
            func = "removeEventListener";
        }
        server[func](EventNames.USER_RECONNECT_TABLE_REP,this._onReconnectTableRep,this);
        server[func](EventNames.GAME_GIVE_UP_GAME_REP,this._onGiveUpGameRep,this);
        server[func](EventNames.USER_ALMS_REP,this._onAlmsResponse,this);
        server[func](EventNames.USER_QUICK_JOIN_RESPONSE,this._onQuickJoinResponse,this);
        server[func](EventNames.GAME_USER_INFO_IN_GAME_REP,this._onUserInfoInGameResponse,this);
        server[func](EventNames.GAME_GAME_START_NTF,this._onGameStart,this);
        server[func](EventNames.GAME_RECONNECT_REP,this._onReconnectRep,this);
        server[func](EventNames.GAME_ADD_CARD,this._onAddCard,this);
        server[func](EventNames.GAME_SHOW_CARD,this._onShowCard,this);
        server[func](EventNames.GAME_GAME_END,this._onGameEnd,this);
        server[func](EventNames.GAME_REPLENISH_FREEZE_GOLD_REP,this._onReplenishFreezeGoldRep,this)
        server[func](EventNames.GAME_OPERATE_REP_EX,this._onGameOperateRepEx,this)
        server[func](EventNames.GAME_OPERATE_REP,this._onGameOperateRep,this);
        server[func](EventNames.USER_OPERATE_REP,this._onUserOperateRep,this);
        server[func](EventNames.GAME_UPDATE_GAME_INFO,this._onUpdateGameInfo,this);
        server[func](EventNames.GAME_ENTER_TABLE,this._onEnterTable,this);
        server[func](EventNames.GAME_LEAVE_TABLE,this._onLeaveTable,this);
        server[func](EventNames.GAME_TABLE_INFO,this._onRecvTableInfo,this);
        server[func](EventNames.GAME_ASK_READY,this._onAskReady,this);
        server[func](EventNames.GAME_GET_READY_REP,this._onGetReadyRep,this);
        server[func](EventNames.QUIT_PGAME_REP,this._onQuitRoomRep,this);
        server[func](EventNames.START_PGAME_REP,this._onStartGameRep,this);
        server[func](EventNames.USER_LOTTERY_RED_COIN_REP,this._onLotteryRedCoinRep,this,false,1);
    }
    private _onLotteryRedCoinRep():void{
        egret.setTimeout(()=>{
            this._checkGoldEnough();
        },this,1000);
    }

    public _checkGoldEnough():void{
        let myHave = this._mySeat.getGold();
        console.log("_checkDzpkGoldNum========================>",myHave,this._roomInfo.minScore);
        if(myHave < this._roomInfo.minScore){
            this._showGoldNotEnough();
        }
    }

    private _onStartGameRep(event: egret.Event): void {
        let data = event.data;
        if(data.result != 0) {
        }
    }
    private _onReconnectTableRep(event: egret.Event): void {
        let data = event.data;
        if(data.result != 0) {
        }
    }

    private _onGiveUpGameRep(event: egret.Event): void {
        let data = event.data;
        if(data.result != 0) {
        }
    }
    private _onAlmsResponse(event: egret.Event): void {
        let data = event.data;
        if(data.result != 0) {
        }
    }

    private _onQuickJoinResponse(event: egret.Event): void {
      var msg: any = event.data;
        console.log("快速加入游戏返回:" + msg.result);
        if(msg.result == 0) {
            //console.log("加入游戏成功");
            this._inTable = true;
        }
        else if(msg.result == 2) { //金豆不足
        }
        else if(msg.result == 3) { //房间满
           Alert.show("房间已满，请稍后重试",0,(act)=>{
                this.quitToLobby();
            })
        }
    }
    private _onUserInfoInGameResponse(event: egret.Event): void {
        let data = event.data;
        if(data.result != 0) {
        }
    }

    private _onGameStart(event: egret.Event): void {
        let data = event.data;
        server.playing = true;
        let pInfo = data.playerinfo;
        let len = pInfo.length;
        let seat:SeatDzpk;
        this._curGameIdx += 1;
        this["historyImg"].touchEnabled = true;
        this._doGameInit();
        for(let i=0;i<len;++i)
        {
            seat = this._initSeatByInfo(pInfo[i]);
            if(pInfo[i].ingame == 1){
                seat.inGame = true;
            }

            seat.setAlphaJustSitDown(!seat.inGame);
        }
    }

    /**
     * 断线重连
     */
    private _onReconnectRep(event: egret.Event): void {
        let data = event.data;
        let pInfo = data.players;
        let status = data.status;
        let params3 = data.params3;
        let curOpSeatId = data.cursid;
        let masterSeatId = data.mastersid;
        let len = pInfo.length;
        let params;
        let onePInfo;
        let cardids = data.params1;
        let seat:SeatDzpk;
        let inGames = {};
        server.playing = (status == 1) ? true:false;
        for(let i=0;i<len;++i){
            onePInfo = pInfo[i];
            if(onePInfo.uid == server.uid){
                server.seatid = onePInfo.seatid;
                break;
            }
        }

        if(data.params3 && data.params3.length >=3){
            let pools = data.params2;
            let cardids2 = data.params3;
            let askseatid = data.askseatid;
            let timeout = (data.time||100)/100;
            this._onAddPublicCards(pools,cardids2,null,null,0,false);
        }

        for(let i=0;i<len;++i){
            onePInfo = pInfo[i];
            params = onePInfo.params ||[];
            seat = this._getSeatById(onePInfo.seatid);
            if(seat){
                seat.userInfoData.uid = onePInfo.uid;
                seat.userInfoData.seatid = onePInfo.seatid;
                let plen = params.length;
                if(plen>=1){
                    seat.inGame = params[0] == 1 ? true:false;
                    if(seat.inGame){
                        inGames[onePInfo.uid] = true;
                        seat.setAlphaJustSitDown(false);
                        if(plen>=2){
                            if(params[1] > 0){
                                seat.showChipInfo(true);
                                seat.setHasChipNum(params[1]);
                            }
                            if(plen >=3){
                                seat.updateSeatGold(params[2],true);
                                if(plen >=4){
                                    let opType = params[3];
                                    if(opType!=0){
                                        if(opType <= 5){
                                            seat.setOperateByType(opType,null,null,false);
                                        }
                                    }
                                }
                            }
                        }
                        if(seat == this._mySeat){
                            if(params && params.length >=5){
                                if(params[4]>=6){
                                    this._setMyThisTurnDefOp(params[4]);
                                }
                            }else{
                                this._setMyThisTurnDefOp(0);    
                            }
                        }
                    }else{
                        if(status == 1){ //游戏中玩家未参数本局游戏则为围观
                            seat.setAlphaJustSitDown(true);
                        }
                    }
                }
            }
        }
        len = this._seats.length;
        for(let i=0;i<len;++i){
            seat = this._seats[i];
            if(!seat.userInfoData.uid || !inGames[seat.userInfoData.uid]){
                seat.setLeaveTable();
                seat.inGame = false;
            }
        }
        
        if(masterSeatId){
            seat = this._getSeatById(masterSeatId);
            if(seat){
                seat.showMaster(true);
            }
        }

        if(cardids){
            this._myCards = cardids;
            for(let i=0;i<cardids.length;++i){
                this._mySeat.addCard(cardids[i],false);
            }
            this._showMyCardType();
        }
        if(curOpSeatId){
            seat = this._getSeatById(curOpSeatId);
            if(seat){
                let minChip = 0;
                let timeout = (data.time||100)/100;
                if(data.params4.length >=3){
                    minChip = data.params4[2];
                }
                this._askSeatOpBySeatId(curOpSeatId,timeout,minChip);
            }
        }
    }

    /**
     * 某个座位号的玩家进入操作cd
     */
    private _askSeatOpBySeatId(askseatid,timeout,minChip):void{
        let seat = this._getSeatById(askseatid);
        if(this._lastOpSeat){
            this._lastOpSeat.stopCD();
        }
        this._lastOpSeat = seat;

        if(seat){
            let cb = null;
            console.log("_askSeatOpBySeatId===>玩家操作：",askseatid,"-self-",server.seatid,"-最小下注-",minChip,"--myGold--",this._mySeat.getGold(),"--giveUp--",this._mySeat.hasGiveUp,"===visi===",this["sOrgGrp"].visible);
            if(askseatid == server.seatid){ 
                this._showGiveOrSkip(false);
                this._showFollowAll(false);
                if(this._myCTOptype == 6 || this._myCTOptype == 7){ //选择了让或弃 或则是跟任何注

                }else{
                    this._setMinChip(minChip);
                    this._showCanOpByMinScore(minChip);
                    let myHave = this._mySeat.getGold();
                    if(minChip >= myHave){ //如果玩家筹码不足要下注的最小筹码则不显示4个操作选项
                        this._showDeskOpot(false);
                    }else{
                        let hasOne = this._setDeskOptByTurn();
                        if(hasOne){
                            this._showDeskOpot(true);
                            this._initFourXPotsPos();
                        }
                    }
                    cb = this._onMyOveOpHideOpAndStopCd.bind(this);
                }
            }else{
                this._onMyOveOpHideOpAndStopCd();
                if(this._mySeat.inGame && !this._mySeat.hasGiveUp && !this["sOrgGrp"].visible && this._mySeat.getGold()>0){
                    this._showGiveOrSkip(true);
                    this._showFollowAll(true);
                    this._setSelGSOrFA();
                }else{
                    this._showGiveOrSkip(false);
                    this._showFollowAll(false);
                }
            }
            seat.startCD(timeout,cb);
        }
    }
    
    /**
     * 显示我当前的牌型
     */
    private _showMyCardType():void{
        let type = CARD_T_HIGH;
        let pCs = this._cards;
        let len = pCs.length;
        if(this._mySeat.inGame){
            if(len >= 3){
                let maxTypes = DzpkCardType.getMaxCardTypeFromPub(this._myCards,this._cards);
                type = maxTypes.type;
                if(len >= 4){
                    this._showMaxCardSelCards(maxTypes);
                }
            }else{
                if(DzpkCardType.isOnePair(this._myCards)){
                    type = CARD_T_ONEPAIR;
                }
            }
            this._mySeat.showCardTypeGrp(true);
            this._mySeat.setCardType(type);
        }
    }

    /**
     * 手牌发牌完毕
     */
    private _onHandSendOver(askseatid,timeout,minChip){  
        this._showSendCard(false);
        egret.Tween.removeTweens(this["sendCardImg"]);

        if(askseatid){
            this._askSeatOpBySeatId(askseatid,timeout,minChip);
        }
        this._showMyCardType();
    }

    /**
     * sendIdx 发牌第几轮
     * pIdx 当前发到的第几个玩家
     */
    private _onOneHandSendOver(info){
        let sendIdx = info.sendIdx
        let pIdx    = info.pIdx;
        //console.log("-_onOneHandSendOver-",sendIdx,"--pIdx--",pIdx);
        let cards = info.cards;
        let inGames = info.inGames;
        let len = cards.length;
        if(pIdx <= inGames.length){
            let seat:SeatDzpk = inGames[pIdx-1];
            if(seat == this._mySeat){
                seat.addCard(cards[sendIdx-1],true);
            }else{
                seat.showCardFlagByIdx(sendIdx,true);
            }
        }

        if(pIdx >= inGames.length){
            if(sendIdx < len){
                info.sendIdx += 1;
                info.pIdx = 1;
                this._playSendCardToSeat(info);
            }else if(sendIdx >= len){
                this._onHandSendOver(info.askseatid,info.timeout,info.minChip);
            }
        }else{
            info.pIdx += 1;
            this._playSendCardToSeat(info);
        }
    }

    /**
     * 充值发牌点的坐标
     */
    private _resetSendCardPos():void{
        let stage = alien.StageProxy;
        let img = this["sendCardImg"];
        let w = stage.width;
        let h = stage.height; 
        img.scaleX = 0.2;
        img.scaleY = 0.2;
        this["sendCardImg"].x = (w -img.width*img.scaleX) *0.5;
        this["sendCardImg"].y = (h -img.height*img.scaleY) *0.5;
    }
    /**
     * sendIdx 发牌第几轮
     * pIdx 当前发到的第几个玩家
     */
    private _playSendCardToSeat(info){
        let sendIdx = info.sendIdx;
        let pIdx= info.pIdx;
        let inGames = info.inGames;

        let seat:SeatDzpk = inGames[pIdx-1];
        let gPos = seat.getFlagCCGPosBtIdx(sendIdx);
        let scaleX = 0.2;
        let scaleY = 0.2;
        let img = this["sendCardImg"];
        let lPos = this.globalToLocal(gPos.x,gPos.y);
        let tX = lPos.x - img.width * scaleX * 0.5;
        let tY = lPos.y - img.height*img.scaleY*0.5;
        this._resetSendCardPos();
        let time = 200;
        //console.log("_playSendCardToSeat-->sendIdx",sendIdx,"pIdx",pIdx,"gPos--",gPos.x,gPos.y,"lPos--",lPos.x,lPos.y);
        egret.Tween.get(img).set({scaleX:0.2,scaleY:0.2}).to({x:tX,y:tY},time).call(this._onOneHandSendOver.bind(this,info));
    }

    /**
     * 发手牌动画
     */
    private _runSendHandCardAni(cards,askseatid,timeout,minChip):void{
        let inGames = [];
        let len = this._seats.length;
        let nCycle = cards.length;
        for(let i=0;i<len;++i){
            if(this._seats[i].inGame){
                inGames.push(this._seats[i]);
            }
        }
        if(inGames.length > 1){
            this._showSendCard(true);
            let info = {sendIdx:1,pIdx:1,cards,inGames,askseatid,timeout,minChip}
            this._playSendCardToSeat(info);
        }
    }

    /**
     * 添加牌到桌面的公共区域
     */
    private _addCardToDesk(cards,func:Function,ani:boolean):void{
        let len = cards.length;
        let hasCl = this._cards.length;
        let startIdx = 0;
        let endIdx = 0;
        let time = 300;
        if(hasCl == 3){
            if(len == 3){ //公共牌
                startIdx = 0;
                endIdx = 2;
            }
        }else if(hasCl == 4){
            if(len == 1){
                startIdx = 3;
                endIdx = 3;
            }else if(len == 4){ //断线重连
                startIdx = 0,
                endIdx = 3;
            }
        }else if(hasCl == 5){
            if(len == 1){
                startIdx = 4;
                endIdx = 4;
            }else if(len == 2){
                startIdx = 3;
                endIdx = 4;
            }else if(len ==5){
                startIdx = 0;
                endIdx = 4;
            }
        }
        
        if(endIdx == 0){
            console.error("error========_addCardToDesk==========>",cards,this._cards);
        }

        let deskGrp = this["deskCardGroup"];
        let nCurIdx = startIdx;
        let nInterval = null;
        let bAni = ani;
        let scale = 0.6;
        let padding = (deskGrp.width - GameConfig.CARD_WIDTH*scale * 5)/4;
        if(padding < 5){
            scale = 0.5;
            padding = (deskGrp.width - GameConfig.CARD_WIDTH*scale * 5)/4;
        }
        let oneOverFunc = function(){
            if(nCurIdx <= endIdx){
                let card:CardDzpk = CardDzpk.create({});
                card.pokerId = this._cards[nCurIdx];
                card.scaleX = card.scaleY = scale;
                card.x = nCurIdx * (GameConfig.CARD_WIDTH*scale + padding);
                card.y = (deskGrp.height - GameConfig.CARD_HEIGHT*card.scaleY)*0.5;
                card.showFront(bAni);
                deskGrp.addChild(card);
                if(bAni){
                    if(nCurIdx <= 2){
                        GameDZPKSoundManager.playPubThree();
                    }else if(nCurIdx == 3){
                        GameDZPKSoundManager.playPubFour();
                    }else if(nCurIdx == 4){
                        GameDZPKSoundManager.playPubFive();
                    }
                    if(startIdx == 0){
                        if(endIdx == 4){
                            if(nCurIdx == 2){
                                time = 600;
                            }else if(nCurIdx == 3){
                                time = 1000;
                            }
                        }
                    }else if(startIdx == 3 && endIdx == 4){
                        if(startIdx == 3){
                            time = 1000;
                        }
                    }

                    egret.setTimeout(()=>{
                        nCurIdx += 1;
                        oneOverFunc.call(this);
                    },this,time);
                }else{
                    nCurIdx += 1;
                    oneOverFunc.call(this);
                }
            }else{
                func();
            }
        }
        oneOverFunc.call(this);
    }

    /**
     * 调整边池的坐标
     */
    private _ajustSidePotsPos(len):void{
        if(len == 1){
            this["chipInfo0"].x = 65;
        }else if(len >= 2){
            this["chipInfo0"].x = 0;
        }
    }

    /**
     * 设置某个边池是否显示
     * idx 从0开始
     */
    private _showSidePotByIdx(idx,bShow:boolean):void{
        this["chipInfo" + idx].visible = bShow;
    }
 
    /**
     * 玩家本轮下注的筹码移动到底池位置
     */
    private _flyChipInfoToPublicPot(overFunc:Function):void{
        let seat:SeatDzpk;
        let willFlySeats = [];
        let len = this._seats.length;
        for(let i=0;i<len;++i){
            seat = this._seats[i];
            if(seat.inGame && seat.isChipedThisTurn()){
                willFlySeats.push(seat);
            }
        }

        let seatLen = willFlySeats.length;
        if(seatLen <= 0){
            overFunc();
        }else{
            let obj:any = null;
            let curOverFly = 0;
            let gPos:any = null;
            obj = this["publicChipInfo"];
            gPos = obj.localToGlobal(obj.width*0.5*obj.scaleX,obj.height*obj.scaleY*0.5);
            for(let i=0;i<seatLen;++i){
                seat = willFlySeats[i];
                seat.flyChipToPool(gPos.x,gPos.y,300,()=>{
                    curOverFly +=1;
                    if(curOverFly >= seatLen){
                        overFunc();
                    }
                });
            }
        }
    }

    /**
     * 更新边池
     */
    private _updateSidePots(sidePots:any):void{
        let len = sidePots.length;
        let obj:GoldDzpk;       
        for(let i=0;i<8;++i){
            obj = this["chipInfo" + i];
            if(i<len){
                obj.updateGold(sidePots[i]);
                this._showSidePotByIdx(i,true);
            }else{
                this._showSidePotByIdx(i,false);
            }
        }
    }


    /**
     * 更新底池
     */
    private _updatePublicPot(n:number){
        this["diLabel"].text = "底池： " + n;
        this["publicChipInfo"].updateGold(n);
    }
    
    /**
     * 更新底池的坐标
     * bHasSide:是否有边池
     */
    private _updatePubPotPosWithSidePot(bHasSide:boolean):void{
        let obj = this["publicChipInfo"];
        let x = this["sidePotsGrp"].x;;
        if(!bHasSide){
           let w = alien.StageProxy.width;
           let w1 = obj.width;
           x = (w - w1)*0.5;
        }
        obj.x = x;
    }

    /**
     * 本轮下注的筹码飞到底池执行完毕
     */
    private _onChipFlyPoolOver(pools:any,func):void{
        let sidePots = pools.slice(1) || [];
        this._showPublicPot(true);
        this._updatePublicPot(pools[0]);
        if(sidePots.length >0){
            this._updatePubPotPosWithSidePot(true);
            this._showSidePotsGroup(true);
            this._updateSidePots(sidePots);
        }else{
            this._updatePubPotPosWithSidePot(false);
            this._showSidePotsGroup(false);
        }
        func();
    }

    /**
     * 玩家下注的筹码飞入到底池和边池
     */
    private _runPlayersChipToPool(pools:any,func:Function,ani:boolean):void{
        if(pools && pools.length >=1){ //底池和边池
            if(ani){
                this._flyChipInfoToPublicPot(()=>{
                    this._onChipFlyPoolOver(pools,func);
                })
            }else{
                this._onChipFlyPoolOver(pools,func);
            }
        }else{
            func();
        }
    }

    /**
     * 新一轮下注要清空玩家上一轮的操作,设置昵称,并更新底池和边池
     * pools:底池和边池
     */
    private _newTurnChip(pools:any,func:Function,ani:boolean):void{
        let seat:SeatDzpk;
        let len = this._seats.length;
        let flyOver =  func;
        this._resetGiveOrSkipSel();   
        this._setMyThisTurnDefOp(0);            
        for(let i=0;i<len;++i){
            seat = this._seats[i];
            if(seat.inGame){
                if(!seat.hasGiveUp){
                    seat.setNickName();
                }
                if(seat != this._mySeat){
                    seat.showCardTypeGrp(false);
                }
            }
        }
        this._runPlayersChipToPool(pools,func,ani);
    }

    /**
     * 从已经发的牌中找到组成最大牌型的牌
     */
    private _showMaxCardSelCards(maxTypes):void{
        let five = maxTypes.five;
        if(five && five.length ==5){
            let grp = this["deskCardGroup"];
            let childs = grp.$children;
            let childNum = childs.length;
            let card:Card;
            let cardV;
            let hasCarV = {};
            for(let i=0;i<5;++i){
                cardV = five[i];
                hasCarV[cardV] = true;
            }

            for(let j=0;j<childNum;++j){
                card = childs[j];
                cardV = card.pokerId;
                if(!hasCarV[cardV]){
                    card.alpha = 0.5;
                }else{
                    card.alpha = 1;
                }
            }
        }else{
            console.error("_showMaxCardSelCards three error ",maxTypes);
        }
    }

    /**
     * 收到公共牌,发牌到桌面
     */
    private _onAddPublicCards(pools,pubCs,askseatid,timeout,minChip,ani):void{
        if(pubCs.length < 3){
            this._cards = this._cards.concat(pubCs);
        }else{
            this._cards = pubCs;
        }
        this._pools = pools;
        server.startCache(null,null,"_onAddPublicCards ");
        this._inTurnProc = true;
        this._newTurnChip(pools,()=>{
            this._addCardToDesk(pubCs,()=>{
                this._showMyCardType();
                this._inTurnProc = false;
                server.stopCache("_onAddPublicCards ");
                if(askseatid){
                    this._askSeatOpBySeatId(askseatid,timeout,minChip);
                }
            },ani);
        },ani);
    }
    /**
     * 发牌
     */
    private _onAddCard(event: egret.Event): void {
        let data = event.data;
        console.log("_onAddCard========>",data);
        if(data.cardids2&& data.cardids2.length >=1){ //公共牌||第四张||第五张
            let pools = data.params;
            let cardids2 = data.cardids2;
            let askseatid = data.askseatid;
            let timeout = (data.time||100)/100;
            this._onAddPublicCards(pools,cardids2,askseatid,timeout,0,true);
        }else if(data.cardids && data.cardids.length >=2){ //发我的牌
            let bigSeatId = data.bigblind;
            let smallSeatId = data.smallblind;
            let masterSeatId = data.mastersid;
            let minChip = data.minchip || 0 ;
            let cfgBigGold = this._roomInfo.bigblind;
            let cfgSmallGold = this._roomInfo.smallblind;
            let cfgBaseGold = this._roomInfo.baseScore;
            let smallHasChip = cfgSmallGold + cfgBaseGold;
            let bigHasChip = cfgBigGold + cfgBaseGold;
            let seat = this._getSeatById(masterSeatId);
            seat.showMaster(true);
            this._myCards = data.cardids;
            let len = this._seats.length;
            for(let i=0;i<len;++i){
                seat = this._seats[i];
                if(seat.inGame){
                    seat.showChipInfo(true);
                    if(seat.userInfoData.seatid == smallSeatId){
                        seat.setHasChipNum(smallHasChip);
                        seat.updateSeatGold(-smallHasChip,false);
                    }else if(seat.userInfoData.seatid == bigSeatId){
                        seat.setHasChipNum(bigHasChip);
                        seat.updateSeatGold(-bigHasChip,false);
                    }else{
                        seat.setHasChipNum(cfgBaseGold);
                        seat.updateSeatGold(-cfgBaseGold,false);
                    }
                }
            }
            this._runSendHandCardAni(data.cardids,data.askseatid,(data.time||100)/100,minChip);
        }
    }

    /**
     * 显示玩家的底牌
     */
    private _onShowCard(event: egret.Event): void {
        let data = event.data;
        let cards = data.cardids;
        let seatId = data.seatid;
        let seat = this._getSeatById(seatId);
        let maxTypes;
        if(seat && seat != this._mySeat){
            seat.cleanTwoFlag();
            for(let i=0;i<cards.length;++i){
                seat.addCard(cards[i],false);
            }
            if(this._cards.length >=3){
                maxTypes = DzpkCardType.getMaxCardTypeFromPub(cards,this._cards);
                seat.setCardType(maxTypes.type);
            }
        }
    }

    /**
     * 游戏结束
     */
    private _onGameEnd(event: egret.Event): void {
        let data = event.data;
        let change = data.chanage;
        let realkickback = data.realkickback;
        let hasGold = data.gold;
        let len = change.length;
        let has = 0;
        let seat:SeatDzpk;
        server.playing = false;
        for(let i=0;i<len;++i){
            has = hasGold[i] == null ? 0:hasGold[i];
            seat = this._getSeatById(i+1);
            seat.stopCD();
            seat.showChipInfo(false);
            if(seat.inGame){
                seat.updateSeatGold(has,true);
            }
            seat.inGame = false;
        }
        this._onMyOveOpHideOpAndStopCd();
        console.log("_onGameEnd--------------------->",data.rewardflag,this._hasDrop);
        if(data.rewardflag == server.uid){
            this._showDropGrp(true);
            this._hasDrop = true;
        }else{
            this._hasDrop = false;
        }
    }

    /**
     * 隐藏我所有的操作项
     */
    private _hideMyAllOps():void{
        this._showAddGrp(false);
        this._showAllInAddGrp(false);
        this._showAddChip(false);
        this._showSkipChip(false);
        this._showGiveupChip(false);
        this._showAllIn(false);
        this._showFollowChip(false,0);
    }

    /**
     * 显示跟注,必须带跟注的筹码
     */
    private _showFollowChip(bShow:boolean,chipNum:number):void{
        this["followGrp"].visible = bShow;
        if(bShow){
            this["followLabel"].text = "" + chipNum;
        }
    }

    /**
     * 显示加注
     */
    private _showAddChip(bShow:boolean):void{
        this["addChipImg"].visible = bShow;
    }

    /**
     * 显示让牌
     */
    private _showSkipChip(bShow:boolean):void{
        this["skipChipImg"].visible = bShow;
    }

    /**
     * 显示弃牌
     */
    private _showGiveupChip(bShow:boolean):void{
        this["giveUpChipImg"].visible = bShow;
    }

    /**
     * 显示all in
     */
    private _showAllIn(bShow:boolean):void{
        this["allInGrp"].visible = bShow;
    }

    /**
     * 显示和加注位置的allin 按钮 仅当玩家筹码小于大盲注的时候
     */
    private _showAllInAddGrp(bShow:boolean):void{
        this["allInAddGrp"].visible = bShow;
    }

    /**
     * 根据要下注的最小筹码显示我可以操作的选项
     */
    private _showCanOpByMinScore(minScore:number):void{
        this._onMyOveOpHideOpAndStopCd();
        let myHave = this._mySeat.getGold();
        let bigblind = this._roomInfo.bigblind;
        if(minScore > 0 ){//必须要下注
            if(minScore >= myHave){ //只能all in 或者是弃牌
                this._showGiveupChip(true);
                this._showAllIn(true);
            }else{
                if(myHave <= (bigblind + minScore)){
                    this._showAllInAddGrp(true);
                    this._showAddChip(false);
                }else{
                    this._showAddChip(true);
                    this._showAllInAddGrp(false);
                }
                this._showGiveupChip(true);
                this._showFollowChip(true,minScore);
            }
        }else{
            //本轮最小要下注的数量和本轮未下过注 则可弃牌 让牌 加注
            if(minScore == 0){
                if(myHave <= bigblind){
                    this._showAllInAddGrp(true);
                    this._showAddChip(false)
                }else{
                    this._showAddChip(true);
                    this._showAllInAddGrp(false);
                }

                this._showGiveupChip(true);
                this._showSkipChip(true);
            }
        }
        this._showMyOpGrp(true);  
    }

    //optype (1 加注 2 跟注 3 弃牌 4 过牌 5 allin, 6让或者是弃, 7跟所有注) params[1]该玩家此轮筹码 params[2]该玩家剩余筹码 params[3] 必须要跟的筹码 params[4] 加注金额
    private _onGameOperateRep(event: egret.Event): void {
        let data = event.data;
        let optype = data.optype;
        if(data.result  == null || data.result == 0) {
            if(optype >= 6){
                if(data.params && data.params.length >= 1){
                    if(data.params[0] == 0){
                        this._setMyThisTurnDefOp(optype);
                    }else{
                        this._setMyThisTurnDefOp(0);
                    }
                    this._setSelGSOrFA();
                }
                return;
            }

            let seat = this._getSeatById(data.seatid);
            if(seat){
                if(data.params && data.params.length >=1&&data.params[0] >= this._roomInfo.bigblind*2){
                    this._setFirstTurnHasAdd(true);
                }
                server.startCache(null,null,"_onGameOperateRep ");
                seat.setOperateByType(optype,data.params,()=>{
                    if(!this._inTurnProc){
                        server.stopCache("_onGameOperateRep ");
                    }
                },true);
            }
            let nextOpSeatId = data.askseatid;
            if(nextOpSeatId){
                let minChip = 0;
                if(data.params && data.params.length >=3){
                    minChip = data.params[2];;
                }
                this._askSeatOpBySeatId(nextOpSeatId,(data.timeout || 100)/100,minChip);
            }
        }
    }
    
    /**
     * 游戏结束执行飞金豆动画
     */
    private _runFlyGoldByInfo(pInfos:any,changes:any):void{
        let len = pInfos.length;
        let len1 = changes.length;
        let onePInfo = null;
        let seat:SeatDzpk;
        let goldInfo:GoldDzpk;
        let poolIdx:number;
        let change:number;

        
        for(let i=0;i<len1;++i){
            change = changes[i];
            seat = this._getSeatById(i+1);
            seat.stopCD();
            seat.showChipInfo(false);
            if(seat.inGame){
                if(seat == this._mySeat && change >=0){
                    this._showMyWinImg(true);
                    GameDZPKSoundManager.playMyWin();
                }
                seat.runChangeAni(change,0);
            }
            if(i<len){
                onePInfo = pInfos[i];
                poolIdx = onePInfo.poolid -1;
                seat = this._getSeatById(onePInfo.seatid);
                if(onePInfo.poolid>=1 && onePInfo.poolid<=9){
                    if(onePInfo.poolid <= 1){
                        goldInfo = this["publicChipInfo"];
                        
                    }else{
                        poolIdx = onePInfo.poolid -2;
                        goldInfo = this["chipInfo" + poolIdx];
                    }
                }
                if(seat && goldInfo && goldInfo.visible){
                    let flyGold:FlyGold;
                    let nGold = MathUtils.makeRandomInt(20,10);
                    let poolCGPos;
                    let headCGPos;
                    if(goldInfo == this["publicChipInfo"]){
                        this._showPublicPot(false);
                    }else{
                        this._showSidePotByIdx(poolIdx,false);
                    }
                    for(let j=0;j<nGold;++j){
                        flyGold = FlyGold.create({img:"play_chess",cb:(obj)=>{
                            this.removeChild(obj);
                            FlyGold.recycle(obj);
                        }});
                        poolCGPos = goldInfo.getCGPos();
                        headCGPos = seat.getHeadCGPos();
                        this.addChild(flyGold);
                        flyGold.x = poolCGPos.x;
                        flyGold.y = poolCGPos.y;
                        flyGold.fly(poolCGPos.x,poolCGPos.y,headCGPos.x,headCGPos.y,100 + j * 50 );
                    }
                }
            }
        }

    }

    private _onGameOperateRepEx(event:egret.Event):void{
        let data = event.data;
        let pools = data.params;
        let changes = data.goldchange;
        server.startCache(null,null,"_onGameOperateRepEx");
        this._runPlayersChipToPool(pools,()=>{
            egret.setTimeout(()=>{
                GameDZPKSoundManager.playWinGold();
                this._runFlyGoldByInfo(data.info,changes);
                this._showPublicPot(false);
                server.stopCache("_onGameOperateRepEx");
            },this,1000);
        },true);
    }

    private _onUserOperateRep(event: egret.Event): void {
        let data = event.data;

    }

    private _onReplenishFreezeGoldRep(event:egret.Event):void{
        let data = event.data;
        if(data.result ==0){
            let gold = data.gold;
            let uid = data.uid;
            if(gold >=0 && uid){
                let seat = this._getSeatByUId(uid);
                if(seat){
                    seat.updateSeatGold(gold,true);
                    if(seat == this._mySeat){
                        this._showMyReFull(gold);
                    }
                }
            }
        }
    }

    private _onUpdateGameInfo(event: egret.Event): void {
        let data = event.data;
        if(data.result != 0) {
        }
    }
    private _onEnterTable(event: egret.Event): void {
        let data = event.data;
        let seat:SeatDzpk = this._initSeatByInfo(data);
        seat.setAlphaJustSitDown(server.playing);
    }

    private _onLeaveTable(event: egret.Event): void {
        let data = event.data;
        let uid = data.uid;
        let seat:SeatDzpk = this._getSeatByUId(uid);
        if(seat){
            seat.inGame = false;
            if(data.reason == 4){ //金豆不足
                if(uid == server.uid){
                    this._inTable = false;
                    if(!server.playing){
                        if(!this._hasDrop){
                            this._showGoldNotEnough();
                        }
                    }
                    return;
                }
            }
            
            seat.setLeaveTable();
        }
    }

    private _onRecvTableInfo(event:egret.Event):void{
        let data = event.data;
        let players = data.players;
        this._initPlayersByTableInfo(players);
    }

    private _onAskReady(event: egret.Event): void {
        let data = event.data;
        if(data.result != 0) {
        }
    }
    private _onGetReadyRep(event: egret.Event): void {
        let data = event.data;
        if(data.result != 0) {
        }
    }
    private _onQuitRoomRep(event: egret.Event): void {
        let data = event.data;
        if(data.result != 0) {
        }
    }

    /**
     * 金豆不足，自动补到房间最低值
     * getGold 补的金额
     */
    private _showMyReFull(getGold):void{
        let str:string = "";
        if(getGold>0){
            let left = MainLogic.instance.selfData.gold;
            left -= getGold;
            str = "金豆不足" + this._roomInfo.minScore + "，自动补足。余额" + left;
        }else{
            str = "金豆已达10万，超出带入金自动存入个人金豆。";
        }
        Toast.show(str,-1,3000);
    }

    private _showGoldNotEnough(): void {
        Alert.show("金豆不足"+ this._roomInfo.minScore +"，是否前往商城购买？",1,(act)=>{
            if(act == "confirm"){
                this._onClickShop();
            }else{
                this.quitToLobby();
            }
        })
    }

    private quitToLobby():void{
        MainLogic.backToRoomScene();
    }

    /**
     * 玩家进入初始化作为信息
     */
    private _initSeatByInfo(data):any{
        let seat:SeatDzpk= this._getSeatById(data.seatid);
        if(seat){
            seat.userInfoData = data;
            seat.setInTable();
        } 
        return seat;
    }

    /**
     * 只有在
     */
    private _initPlayersByTableInfo(players: any){
        players.some((player: any) => {
            if(player.uid == server.uid) {
                server.seatid = player.seatid;
                return true;
            }
        });

        let len = players.length;
        let seat:SeatDzpk;
        for(let i=0;i<len;++i){
            seat = this._initSeatByInfo(players[i]);
            if(players[i].ingame == 1){
                seat.inGame = true;
            }
            if(server.playing){
                seat.setAlphaJustSitDown(!seat.inGame);
            }
        }
    }

	/**
	 * 根据uid获取座位
	 * @param uid
	 * @returns {Seat}
	 */
    private _getSeatByUId(uid: number): SeatDzpk {
        let seat: SeatDzpk = null;

        this._seats.some((s: SeatDzpk): boolean => {
            if(s.userInfoData && s.userInfoData.uid == uid) {
                seat = s;
                return true;
            }
        });
        return seat;
    }

    /**
	 * 根据座位号获取座位
	 * @param seatid
	 * @returns {Seat}
	 */
    private _getSeatById(seatid: number): SeatDzpk {
        let seat: SeatDzpk = null;
        if(seatid <=9 && seatid >0){
            let dSeatId = (seatid + 9 - server.seatid) % 9;
            seat = this._seats[dSeatId];
        }else{
            let sInfo = seatid + " |" + arguments.callee.caller;
            Reportor.instance.reportCodeError(sInfo);
        }
        return seat;
    }

    beforeHide(): void {
        this._initServerListen(false);
        server.stopCache();
    }

    /**
     * 商城
     */
    private _onClickShop():void{
        let _mainIns = MainLogic.instance;
        let self = this;
        PanelExchange2.instance.show(0,function(){
            _mainIns.setScreenPortrait(750,1334);
            if(!self._mySeat.inGame && !self._inTable){
                let _gold = MainLogic.instance.selfData.gold;
                if(self._roomInfo.baseScore <= _gold){//金豆不足
                    self._doGameInit();
                    self._cleanPlayers();
                    self._quickJoin();
                }else{
                    self._showGoldNotEnough();
                }
            }
        });
    }

    private _test():void{
        let func = "startCD"
        let cd = 7;
        server.seatid = 1;
        if(this["isTest"]){ 
            this["isTest"] = false;
        }else{
            func = "stopCD";
            this["isTest"] = true;
        }
        
        let pInfo = [];
        let seat:SeatDzpk;
        let len = this._seats.length;
        for(let i=0;i<len;++i){
            seat = this._seats[i];
            seat.inGame = true;
            seat.visible = true;
            seat.setHasChipNum(i+1);
            seat.showChipInfo(true);
            seat.showCardFlagByIdx(1,true);
            seat.showCardFlagByIdx(2,true);
            seat.setOperateByType(3,0,null,true);
            pInfo.push({seatid:i+1,poolid:i+1});
            //seat[func].call(seat,cd);
        }

        this._newTurnChip([100,200,300,400,500,600,700,800],function(){

        },true);
        /*if(!this["isTest"]){
            this._updateSidePots([10,20,30,40,50,60,70,80,90],()=>{
                this._runFlyGoldByInfo(pInfo)
                console.log("fly---------------over");
            })
        }*/
    }

    /**
     * 向下箭头
     */
    private _onClickDownArr():void{
        if(this._mySeat.inGame){
            Alert.show("牌局未结束，现在退出，已下注的筹码将不会返还，是否强行退出？", 1, (act)=>{
                if(act == "confirm"){
                    server.giveUpGame();
                    this.quitToLobby();
                }
            });
        }else{
            server.giveUpGame();
            this.quitToLobby();
        }
    }

    /**
     * 点击加注
     */
    private _onClickAddChip():void{
        this._setMaxChipVal();
        this._setMinChipVal();
        this._showAddGrp(true);
        this._showMaxChipGrp(true);
        this._showFloatChip(false);
        this._initFourAddChipPosAndVal();
        this._initFourAddChipTouch();
        if(this["deskXPotGrp"].visible){
            this._xPotShouldShow = true;
        }
        if(this["myOpGroup"].visible){
            this._myOpShouldShow = true;
        }
        this._showDeskOpot(false);
        this._showMyOpGrp(false);
    }

    /**
     * 我操作完，隐藏我的操作项，并结束我的操作cd
     */
    private _onMyOveOpHideOpAndStopCd():void{
        this._showGiveOrSkip(false);
        this._showFollowAll(false);
        this._showDeskOpot(false);
        this._hideMyAllOps();
        this._showAddGrp(false);
        this._mySeat.stopCD();
    }
    /**
     * 点击确定加注
     */
    private _onClickSureAddChip():void{
        if(this["chipSlider"].value >=10){
            this._allChipReq();
        }else{
            let value = this._getSelChip();            
            let minChip = this._getMinChip();
            value -= minChip;
            //加注条拖动到最低则认为加注一个大盲注
            if(value <= 0){
                value = minChip;
            }
            this._addChipReq(value);
        }
        this._onMyOveOpHideOpAndStopCd();
    }

    /**
     * 点击加注的背景
     */
    private _onClickAddGrpBg():void{
        this._showAddGrp(false);
        if(this._xPotShouldShow){
            this._showDeskOpot(true);
        }

        if(this._myOpShouldShow){
            this._showMyOpGrp(true);
        }
        this._myOpShouldShow = false;
        this._xPotShouldShow = false;
    }
    /**
     * 点击弃牌
     */
    private _onClickGiveupChip():void{
        this._giveUpChipReq();
        this._onMyOveOpHideOpAndStopCd();
    }

    /**
     * 点击让牌
     */
    private _onClickSkipChip():void{
        this._skipChipReq();
        this._onMyOveOpHideOpAndStopCd();
    }

    /**
     * 点击跟注
     */
    private _onClickFollowChip():void{
        this._followChipReq();
        this._onMyOveOpHideOpAndStopCd();
    }
    
    /**
     * 点击all in
     */
    private _onClickAllIn():void{
        this._allChipReq();
        this._onMyOveOpHideOpAndStopCd();
    }

    /**
     * 点击声音按钮
     */
    private _onClickSound():void{
        alien.SoundManager.instance.switchEffect();
        this._initSound();
    }

    /**
     * 加注按钮上方的快捷下注项
     */
    private _onClickDeskOptItem(idx:number):void{
        let val = this["xPot" + idx].chipNum;
        console.log("_onClickDeskOptItem---->",idx,val);
        this._addChipReq(val);
        this._onMyOveOpHideOpAndStopCd();
    }

    /**
     * 加注面板中的快捷加注项
     */
    private _onClickAddItem(idx:number):void{
        let val = this["addChip" + idx].chipNum;
        console.log("_onClickAddItem---->",idx,val);
        this._addChipReq(val);
        this._onMyOveOpHideOpAndStopCd();
    }

    /**
     * 弃或让
     */
    private _onClickGiveOrSkip():void{
        var msg: any = {};
        msg.optype = 6;
        server.send(EventNamesNiu.GAME_OPERATE_REQ,msg);
    }

    /**
     * 跟任何
     */
    private _onClickFollowAll():void{
        var msg: any = {};
        msg.optype = 7;
        server.send(EventNamesNiu.GAME_OPERATE_REQ,msg);
    }

    /**
     * 点击开宝箱
     */
    private _onClickOpenDrop():void{
        this._showDropGrp(false);
        this._openDropReq();
    }

    /**
     * 点击规则
     */
    private _onClickRule():void{
        PanelDzpkRule.instance.show();
    }

    /**
     * 显示历史记录
     */
    private _showDzpkHistoryByData(data:any):void{
        PanelDzpkHistory.instance.show(data);
    }
    /**
     * 点击牌局记录
     */
    private _onClickHistory():void{
        if((this._curGameIdx > this._getHistoryIdx)|| !this._historyData){
            this["historyImg"].touchEnabled = false;
            this._getHistoryIdx = this._curGameIdx;
            webService.getDzpkHistory((response)=>{
                this["historyImg"].touchEnabled = true;
                if(response.code == 0){
                    this._historyData = response.data;
                    this._showDzpkHistoryByData(response.data);
                }else{
                    Toast.show(response.message);
                }
            })
        }else{
            this._showDzpkHistoryByData(this._historyData);
        }
    }

    ////////////////////////Server//////////////////////////
    protected _openDropReq():void{
        let data = { optype: 1,roomid:this._roomInfo.roomID};
        server.send(EventNames.USER_LOTTERY_RED_COIN_REQ,data);
    }

    protected _quickJoin(gold: number = 0): void {
        var msg: any = {};
        msg.roomid = this._roomInfo.roomID;
        msg.clientid = server.uid;
        msg.gold = gold;
        server.send(EventNamesNiu.USER_QUICK_JOIN_REQUEST,msg);
    }

    /**
     * 加注
     */
    protected _addChipReq(chipNum): void {
        var msg: any = {};
        msg.optype = 1;
        msg.params = [chipNum];
        server.send(EventNamesNiu.GAME_OPERATE_REQ,msg);
    }

    /**
     * 跟注
     */
    protected _followChipReq(): void {
        var msg: any = {};
        msg.optype = 2;
        server.send(EventNamesNiu.GAME_OPERATE_REQ,msg);
    }

    /**
     * 弃牌
     */
    protected _giveUpChipReq(): void {
        var msg: any = {};
        msg.optype = 3;
        server.send(EventNamesNiu.GAME_OPERATE_REQ,msg);
    }

    /**
     * 让牌
     */
    protected _skipChipReq(): void {
        var msg: any = {};
        msg.optype = 4;
        server.send(EventNamesNiu.GAME_OPERATE_REQ,msg);
    }

    /**
     * all in
     */
    protected _allChipReq(): void {
        var msg: any = {};
        msg.optype = 5;
        msg.params = []
        server.send(EventNamesNiu.GAME_OPERATE_REQ,msg);
    }

    private _reconnectTableReq(): void {
        server.reconnect(0);
    }
}