
/**
 * 财运连连翻游戏场景
 */
class SceneFFFPlay extends alien.SceneBase {
    private _roomInfo:any;
    private _openRole:Array<egret.MovieClip> = [];
    /**
     * 当前下注的倍数
     */
    private _curMulti:number;
    /**
     * 当前点击开启的格子索引
     */
    private _curOpenIdx:number;

    /**
     * 本局游戏中开启的格子信息
     */
    private _hasOpenInfo:any = {
        openNum:0, //开启的格子数
        info:{}, //记录开启的同样图片的格子缩影
        pngId:[],//开启的格子中共有多个不同的图片
        grids:{} //开启后的格子的图片
    };

    /**
     * 总共可以赢
     */
    private _totWin:number = 0;
    /**
     * 等待显示结果的timeout
     */
    private _waitShowTimeout:number;

    /**
     * 翻牌结束后等待的timeout
     */
    private _openTimeout:number;

    private _okImg:any = {
        [1]:"fff_cherry",
        [2]:"fff_bell",
        [3]:"fff_seven"
    };

    constructor() {
        super();

        this.init();
    }

    private init(): void {
        this.skinName = scenes.SceneFffPlaySkin;
    }

    protected createChildren(): void {
        super.createChildren();
        this._setTotChip(0,true);
        this._setTotWinNum();
    }

    /**
     * 重置已开启的格子数据
     */
    private _resetGameInfo():void{
        this._curMulti = 1;
        this._hasOpenInfo = {
                openNum:0,
                info:{},
                pngId:[],
                grid:{}
            };
    }

    /**
     * 下注筹码变化要动态调整每个奖项的数值
     */
    private _onChipNumChange(chipNum:number):void{
        let multi = this._roomInfo.multip;
        let num1 = Math.ceil(multi["3"]*chipNum);
        let num2 = Math.ceil(multi["2"]*chipNum);
        let num3 = Math.ceil(multi["1"]*chipNum);

        //console.log("_onChipNumChange----------->",chipNum,num1,num2,num3);
        this._setItem0Rew(num1);
        this._setItem1Rew(num2);
        this._setItem2Rew(num3);
    }

    private _setItem0Rew(num:number):void{
        this["chipFnt0_0"].text = "=" + num;
    }

    private _setItem1Rew(num:number):void{
        this["chipFnt1_0"].text = "=" + num;
    }

    private _setItem2Rew(num:number):void{
        this["chipFnt2_0"].text = "=" + num;
    }

    /**
     * 获取下注的筹码
     */
    private _getChipNum():number{
        return Number(this["chipNumLabel"].text);
    }

    /**
     * 设置下注的筹码
     * bSet 为true则直接设置下注筹码，false则在下注的筹码基础上加num
     */
    private _setChipNum(num:number,bSet:boolean):void{
        let n = 0;
        if(bSet){
            n = num;
        }else{
            let chipNum = this._getChipNum();
            if(isNaN(chipNum)){
                chipNum = 0;
            }
            n = chipNum + num;
        }
        this["chipNumLabel"].text = n;
        this._onChipNumChange(n);
        this._setTotChip(n,true);
    }
    
    /**
     * 初始化点击事件
     */
    private _initClick():void{
        this["startImg"]["addClickListener"](this._onClickStart,this);
        this["chipSubImg"]["addClickListener"](this._onClickSubChip,this);
        this["chipAddImg"]["addClickListener"](this._onClickAddChip,this);
        this["ruleImg"]["addClickListener"](this._onClickRule,this);
        this["soundImg"]["addClickListener"](this._onClickSound,this);
        this["continueImg"]["addClickListener"](this._onClickContinue,this);
        this["ruleCloseImg"]["addClickListener"](this._onClickCloseRule,this);
        this["backImg"]["addClickListener"](this._onClickBack,this);
        let gridX,gridY;
        for(let i=0;i<9;++i){
            gridX = i % 3 + 1; 
            gridY = Math.floor(i / 3) + 1;
            this["itemImg" + i]["addClickListener"](this._onClickItem.bind(this,gridX,gridY),this);
        }
    }
        /**
     * 点击开始
     */
    private _onClickStart():void{
        let have = MainLogic.instance.selfData.getGold();
        if(have < this._roomInfo.price){
            this._showGoldNotEnough();
            return;
        }
        this._changeChipMultiReq(this._curMulti);
    }

    /**
     * 点击减注
     */
    private _onClickSubChip():void{
        if(this._curMulti <= 1){
            return;
        }
        this._curMulti -= 1;
        let chipNum = this._curMulti * this._roomInfo.price;
        this._setChipNum(chipNum,true);
    }

    /**
     * 点击加注
     */
    private _onClickAddChip():void{
        let chipNum = this._getChipNum();
        let stepChip = this._roomInfo.price;
        let maxMulti = this._roomInfo.topmultip;
        let destChipNum = chipNum + stepChip;
        let have = MainLogic.instance.selfData.getGold();
        if( destChipNum > have ){
            if(have < this._roomInfo.price){
                this._showGoldNotEnough();
            }
            return;
        }else if(this._curMulti >= maxMulti){
            return;
        }
        this._curMulti += 1;
        chipNum = this._curMulti * this._roomInfo.price;
        this._setChipNum(chipNum,true);
    }

    /**
     * 显示规则
     */
    private _showRuleGrp(bShow:boolean):void{
        this["ruleGrp"].visible = bShow;
    }

    /**
     * 点击关闭规则
     */
    private _onClickCloseRule():void{
        this._showRuleGrp(false);
    }

    /**
     * 点击规则
     */
    private _onClickRule():void{
        this._showRuleGrp(true);
    }

    /**
     * 点击声音
     */
    private _onClickSound():void{
        alien.SoundManager.instance.switchEffect();
        this._initSound();
    }

    /**
     * 9个格子的点击
     */
    private _onClickItem(gridX:number,gridY:number):void{
        console.log("_onClickItem=============>",gridY,gridX);
        //this._curOpenIdx = idx;
        let idx = (gridY - 1)* 3 + gridX - 1;
        this._enableItemImgTouch(idx,false);
        /*this._playOpenAni(idx,1,function(){

        });*/
        this._openItemReq(gridX,gridY);

    }

    /**
     * 点击在玩一次
     */
    private _onClickContinue():void{
        this._doGameInit(true,1.1,200);
    }

    /**
     * 如果未创建开启动画则创建
     */
    private _createOpenAni():void{
        if(this._openRole.length >= 9) return;
        this.validateNow();
        let mcData = RES.getRes("openAni_json");
        let pngData = RES.getRes("openAni_png");
        let grp:eui.Group = this["midGrp"];
        let tlayout:eui.TileLayout = <eui.TileLayout>grp.layout;
        let col,row;
        for(let i=0;i<9;++i){
            col = i % 3 + 1; 
            row = Math.floor(i / 3) + 1;
            let mcDataFactory = new egret.MovieClipDataFactory(mcData, pngData);
            let role:egret.MovieClip = new egret.MovieClip(mcDataFactory.generateMovieClipData("openAni"));
            this._openRole[i] = role;
            role.visible = false;
            let img:eui.Image = this["itemImg" + i];
            let x = tlayout.paddingLeft + tlayout.horizontalGap *(col - 1) + tlayout.columnWidth *(col - 1 + 0.5); 
            let y = tlayout.paddingTop + tlayout.verticalGap * (row - 1) + tlayout.rowHeight *(row - 1 + 0.5);
            let pos = grp.localToGlobal(x,y);
            let pos1 = this.globalToLocal(pos.x,pos.y);
            role.x = pos1.x-250;
            role.y = pos1.y-250;
            //console.log("img----->",i,pos.x,pos.y,pos1.x,pos1.y);
            this.addChild(role);
        }
    }

    /**
     * 显示某个格子
     */
    private _showItemImg(idx:number,bShow:boolean):void{
        this["itemImg" + idx].visible = bShow;
    }

    /**
     * 开启动画播放完毕
     */
    private _openAniOver(role:egret.MovieClip,idx:number,pngId:number,overFunc):void{
        role.visible = false;
        this._showItemImg(idx,true);
        this._clearOpenTimeout();
        if(this._hasOpenInfo.openNum >=5){ //操作完5次机会
            this._openTimeout = egret.setTimeout(function(){
                overFunc();
            },this,1000);
        }else{
            overFunc();
        }
    }

    /**
     * 播放开启动画
     */
    private _playOpenAni(idx:number,pngId:number,overFunc:Function):void{
        let role:egret.MovieClip = this._openRole[idx];
        role.visible = true;
        role.once(egret.Event.COMPLETE,this._openAniOver.bind(this,role,idx,pngId,overFunc),this);
        role.gotoAndPlay(1,1);
        GameFFFSoundManager.playFlip();
    }

    /**
     * 服务器返回开启操作成功
     * val 百位：行 十位：列 个位：值
     */
    private _openItemSucc(val:number,bAni:boolean,func:Function):void{
        let gridY = Math.floor(val/100);
        let gridX = Math.floor(val/10) %10;
        let pngId = (val % 100)%10;
        let idx = (gridY - 1)* 3 + gridX - 1;
        if(!this._hasOpenInfo.info[pngId]){
            this._hasOpenInfo.info[pngId] = [];
        }
        this._hasOpenInfo.pngId.push(pngId);
        this._hasOpenInfo.info[pngId].push(idx);
        this._hasOpenInfo.grid[idx] = pngId;
        this._enableItemImgTouch(idx,false);
        
        let pngPre = this._okImg[pngId];
        this["itemImg" + idx].source = pngPre + "320_3";
        this._showItemImg(idx,false);
        if(bAni){
            this._playOpenAni(idx,pngId,func);
        }else{
            this._showItemImg(idx,true);
            func();
        }
    }

    /**
     * 使能某个格子可以点击
     */
    private _enableItemImgTouch(idx:number,bEnable:boolean):void{
        this["itemImg" + idx].touchEnabled = bEnable;
    }

    /**
     * 显示游戏开始按钮
     */
    private _showStart(bShow:boolean):void{
        this["startImg"].visible = bShow;
    }

    /**
     * 显示输赢结果
     */
    private _showResult(bShow:boolean):void{
        this["resultGrp"].visible = bShow;
    }

    /**
     * 显示三个相同和奖励
     */
    private _showOkItemGrp(bShow:boolean):void{
        this["okItemGrp"].visible = bShow;
    }

    /**
     * 显示加减下注按钮
     */
    private _showAddAndSub(bShow:boolean):void{
        this["chipSubImg"].visible = bShow;
        this["chipAddImg"].visible = bShow;
    }

    /**
     * 游戏结束显示选中的三个一样的和奖励
     */
    private _onEndShowThreeItemAndRew(pngId:number,rewNum:number):void{
        if(pngId < 1 || pngId > 3 || rewNum <=0 ){
            console.error("_onEndShowThreeItemAndRew ==1======>",pngId,rewNum);
            return;
        }
        
        //console.log("_onEndShowThreeItemAndRew ===2=====>",pngId,rewNum);
        let png = this._okImg[pngId] + "216";
        this["okImg0"].source = png;
        this["okImg1"].source = png;
        this["okImg2"].source = png;
        this["winNumLabel"].text = rewNum;
        this._setResultBgImg("fff_getbg");
        this._showOkItemGrp(true);
        this._setTotWinNum();
        this._showResult(true);
    }

    /**
     * 设置下注倍数成功
     */
    private _onRecvMultSucc(multi:number):void{
        let base = this._roomInfo.price;
        let num = base * multi;
        server.playing = true;
        this._setChipNum(num,true);
        this._showStart(false);
        this._enableAllGridTouch(false);
        this._initItems(true,0.01,1,"fff_item1",300,true,()=>{
            this._enableAllGridTouch(true);
        });
        this._showAddAndSub(false);
        this._setTotChip(num,true);
        GameFFFSoundManager.playStart();
    }

    /**
     * 使能九个格子的点击
     */
    private _enableAllGridTouch(bEnable:boolean):void{
        for(let i=0;i<9;++i){
            this._enableItemImgTouch(i,bEnable);
        }
    }

    /**
     * 收到服务器下发的奖励
     */
    private _onRecvGameRew(rewNum:number):void{
        this._enableAllGridTouch(false);
        this._onEndRandomNotOpenItem((okPngId)=>{
            if(okPngId == -1){
                console.log("_onRecvGameRew error--1-->",this._hasOpenInfo);
            }else{
                this._onEndShowThreeItemAndRew(okPngId,rewNum);
            }
        });
        
        GameFFFSoundManager.playMyWin();
    }

    /**
     * 返回未结束的游戏
     */
    private _onRecvBackToGame(multi:number,opens:any):void{
        let base = this._roomInfo.price;
        let num = base * multi;
        this._setChipNum(num,true);
        this._showStart(false);
        this._enableAllGridTouch(false);
        this._initItems(false,1,1,"fff_item1",300,true,()=>{
            this._enableAllGridTouch(true);
        });
        this._showAddAndSub(false);
        this._setTotChip(num,true);
        if(opens && opens.length >= 1){
            let openLen = opens.length;
            this._hasOpenInfo.openNum = openLen;
            for(let i=0;i<openLen;++i){
                this._openItemSucc(opens[i],false,function(){

                })
            }
        }
        this._enableThisChildTouch(true);
    }

    private _onRecvNoGameRec():void{
        this._enableThisChildTouch(true);
    }

    /**
     * 使能其他的点击
     */
    private _enableThisChildTouch(bEnable:boolean):void{
        this.touchChildren = bEnable;
    }

    /**
     * 设置游戏结算的背景
     */
    private _setResultBgImg(png:string):void{
        this["resbgImg"].source = png;
    }

    /**
     * 翻牌满五次
     */
    private _onOperateMaxStep():void{
        this._enableAllGridTouch(false);
        this._onEndRandomNotOpenItem(()=>{
            this._setResultBgImg("fff_losebg");
            this._showResult(true);
            this._showOkItemGrp(false);
        });
    }

    /**
     * beforeSet:是否在动画之前设置图片
     */
    private _initItems(bAni:boolean,sScale:number,tScale:number,png:string,time:number,beforeSet:boolean = false,overFunc:Function = null):void{
        let img:eui.Image;
        let okNum = 0;
        for(let i = 0;i<9;++i){
            img = this["itemImg" + i];
            if(bAni){
                if(beforeSet){
                    img.source = png;
                }
                egret.Tween.get(img).set({scaleX:sScale,scaleY:sScale}).to({scaleX:tScale,scaleY:tScale},time).call(function(target,srcImg){
                    target.source = srcImg;
                    okNum++;
                    if(okNum >=9){
                        if(overFunc){
                            overFunc();
                        }
                    }
                }.bind(this,img,png));
            }else{
                img.scaleX = img.scaleY = tScale;
                img.source = png;
            }
        }
        
        if(!bAni && overFunc){
            overFunc();
        }
    }

    /**
     * 初始化新一轮的显示
     * bAni :9个格子是否有缩放效果
     * sScale：9个格子的原缩放系数
     * aniTime:缩放时间
     */
    private _doGameInit(bAni:boolean,sScale:number,aniTime:number):void{
        let base = this._roomInfo.price;
        server.playing = false
        this._resetGameInfo();
        this._showRuleGrp(false);
        this._setChipNum(base,true);
        this._showResult(false);
        this._enableAllGridTouch(false);
        this._setTotChip(0,true);
        this._stopGridsTween();
        this._setTotWinNum();
        this._initItems(bAni,sScale,0.5,"fff_item3",aniTime,false,()=>{
            this._showStart(true);
            this._showAddAndSub(true);
        });
    }

    /**
     * 游戏结束,显示未开启的格子
     * 并找出开启后三个相同格子的pngId
     */
    private _onEndRandomNotOpenItem(func:Function):void{
        let img:eui.Image;
        let pngId:number;
        let open = this._hasOpenInfo;
        let okPngId = -1;
        let openNum = 0;
        let overOpen = ()=>{
            openNum++;
            if(openNum >=9){
                this._clearWaitShowTimeout();
                this._waitShowTimeout = egret.setTimeout(func.bind(this,okPngId),this,2000);
            }
        }

        let pngId1N = 3;
        let pngId2N = 3;
        let pngId3N = 3;
        let pngIdsN = [0,3,3,3];
        let pngIds = this._hasOpenInfo.pngId;
        let notOpens = [];
        let len = pngIds.length;
        for(let i=0;i<len;++i){
            pngIdsN[pngIds[i]] -= 1;
        }

        let i = 1;
        while(i < 4){
            if(pngIdsN[i]>0){
                notOpens.push(i);
                pngIdsN[i] -= 1;
                console.log("",i);
            }else{
                i++;
            }
        }

        let idx = 0;
        for(let i=0;i<9;++i){
            img = this["itemImg" + i];
            if(img.source == "fff_item1"){
                let randomMax = notOpens.length - 1;
                idx = MathUtils.makeRandomInt(randomMax,0);
                pngId = notOpens[idx];
                notOpens.splice(idx,1);
			    egret.Tween.get(img)
				.to({scaleX: 0,scaleY:0}, 100)
                .call(function(target,pngId){
                    target.source = this._okImg[pngId] + "320_2";
				}.bind(this,img,pngId))
                .to({scaleX: 0.7,scaleY:0.7}, 100)
                .call(()=>{
                    overOpen();
                });

               //console.log("i--1--->",i,pngId,img.source);
            }else {
                pngId = open.grid[i];
                if(open.info[pngId] && open.info[pngId].length >= 3){
                    okPngId = pngId;
                }else{
                    img.source = this._okImg[pngId] + "320_1";
                    //console.log("i--2--->",i,pngId,img.source);
                }
                overOpen();
            }
        }
    }

    /**
     * 清除开启活格子后的timeout
     */
    private _clearOpenTimeout():void{
        egret.clearTimeout(this._openTimeout);
    }

    /**
     * 清除等待显示结果的timeout
     */
    private _clearWaitShowTimeout():void{
        egret.clearTimeout(this._waitShowTimeout);
    }

    /**
     * 结束9个格子的动画
     */
    private _stopGridsTween():void{
        for(let i=0;i<9;++i){
            egret.Tween.removeTweens(this["itemImg" + i]);
        }
    }

    private _initMyInfo():void{
        let data = MainLogic.instance.selfData;
        this["headImg"].source = data.imageid;
        this["headImg"].mask = this["maskImg"];
        this["nickLabel"].text = data.nickname;
        this._setHasGold(data.getGold());
    }

    /**
     * 设置剩余金豆
     */
    private _setHasGold(gold):void{
        this["totGoldLabel"].text = "剩余金豆:"+ gold;
    }

    /**
     * 设置总下注
     */
    private _setTotChip(gold,bSet:boolean):void{
        let num = Number(this["hasChipLabel"].text);
        if(isNaN(num)){
            num = 0;
        }
        if(bSet){
            num = gold;
        }else{
            num += gold;
        }
        this["hasChipLabel"].text = "已消耗金豆:" + num; 
    }

    /**
     * 设置总赢
     */
   private _setTotWinNum():void{
        this["totWinLabel"].text = "总赢金豆:" + this._totWin; 
    }
    
    private _initGridSize():void{
        let width = alien.StageProxy.width;
        if(width >=750) return;
        let tlayout:eui.TileLayout = <eui.TileLayout>this["midGrp"].layout;
        let columnWidth = tlayout.columnWidth;
        let rowHeight = tlayout.rowHeight;
        let scale = (width / 750);
        tlayout.columnWidth = columnWidth * scale;
        tlayout.rowHeight = rowHeight * scale;
    }

    beforeShow(params: any): void {
        this._roomInfo = server.roomInfo = params.roomInfo;
        alien.SoundManager.instance.enablePlayMusic(false);
        alien.SoundManager.instance.stopMusic();
        MainLogic.instance.setScreenPortrait(750,1334);
        this._initGridSize();
        this._initClick();
        this._initServerListen(true);
        this._doGameInit(false,0,0);
        this._initMyInfo();
        this._checkInGame();
        
        this._createOpenAni();
    }

    /**
     * 初始化音效的图标
     */
    private _initSound():void{
        let mute = alien.SoundManager.instance.effectMute;
        let src = "fff_sound_1";
        if(mute){
            src = "fff_sound_2";
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
        server[func](EventNames.USER_USER_INFO_RESPONSE,this._onUserInfoResponse,this);
    }

    private _onLotteryRedCoinRep():void{
        egret.setTimeout(()=>{
            this._checkGoldEnough();
        },this,1000);
    }

    public _checkGoldEnough():void{
        let myHave = 0;
        if(myHave < this._roomInfo.minScore){
            this._showGoldNotEnough();
        }
    }

    private _onStartGameRep(event: egret.Event): void {
        let data = event.data;
        if(data.result != 0) {
        }
    }

    private _onUserInfoResponse(event: egret.Event): void {
        let data = event.data;
        if(data.gold >=0){
            this._setHasGold(data.gold);
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
        
    }

    private _onGameEnd(event: egret.Event): void {
        let data = event.data;
        
    }

    private _onShowCard(event: egret.Event): void {
        let data = event.data;
        
    }

    private _onAddCard(event: egret.Event): void {
        let data = event.data;
        
    }

    /**
     * 断线重连
     */
    private _onReconnectRep(event: egret.Event): void {
        let data = event.data;
 
    }

   
    private _onGameOperateRep(event: egret.Event): void {
        
    }
    
    
    private _onGameOperateRepEx(event:egret.Event):void{
       
    }

    private _onUserOperateRep(event: egret.Event): void {
        let data = event.data;
        let optype = data.optype;
        if(optype != 15 && optype != 16 && optype != 17){
            return;
        }else if(optype == 15 && data.result == 3){
            Alert.show("金豆不足或者有游戏未结束",0,()=>{
                this.quitToLobby();
            });
            return;
        }

        if(data.result == null || data.result == 0){
            if(optype == 15){
                if(data.params && data.params.length >= 1){
                    let multi = data.params[0];
                    this._onRecvMultSucc(multi);
                }else{
                    //Alert.show("倍数操作失败,参数长度不足");
                }
            }else if(optype == 16){
                if(data.params && data.params.length >= 1){
                    let multi = data.params[0];
                    let opens = data.params1;
                    this._onRecvBackToGame(multi,opens);
                }else{
                   this._onRecvNoGameRec();
                }
            }else{
                if(data.params && data.params.length >= 1){
                    let val = data.params[0];
                    let rew = null;
                    if(data.params.length >=2){
                        rew = data.params[1];
                    }
                    //操作满5步或者是有奖励
                    if(this._hasOpenInfo.openNum >= 5 || rew){
                        this._enableAllGridTouch(false);
                        if(rew){
                            this._totWin += rew;
                        }
                    }

                    this._openItemSucc(val,true,()=>{
                        if(rew){
                            server.playing = false;
                            this._onRecvGameRew(rew);
                        }else if(this._hasOpenInfo.openNum >= 5){
                            server.playing = false;
                            this._onOperateMaxStep();
                        }
                    });
                }else{
                    //Alert.show("开启操作失败,参数长度不足");
                }
            }
        }else{
            //Alert.show("操作失败,result:" + data.result);
        }
    }

    private _onReplenishFreezeGoldRep(event:egret.Event):void{
        
    }

    private _onUpdateGameInfo(event: egret.Event): void {
        let data = event.data;
        if(data.result != 0) {
        }
    }
    private _onEnterTable(event: egret.Event): void {
        let data = event.data;
    }

    private _onLeaveTable(event: egret.Event): void {
        
    }

    private _onRecvTableInfo(event:egret.Event):void{
        let data = event.data;
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
            str = "金豆不足" + this._roomInfo.price + "，自动补足。余额" + left;
        }else{
            str = "金豆已达10万，超出带入金自动存入个人金豆。";
        }
        Toast.show(str,-1,3000);
    }

    private _showGoldNotEnough(): void {
        Alert.show("金豆不足"+ this._roomInfo.price +"，是否前往商城购买？",1,(act)=>{
            if(act == "confirm"){
                this._onClickShop();
            }else{
                this.quitToLobby();
            }
        })
    }

    private quitToLobby():void{
        MainLogic.backToRoomScene({toSmall:true});
    }

    beforeHide(): void {
        this._initServerListen(false);
        this._clearWaitShowTimeout();
        this._clearOpenTimeout();
        this._stopGridsTween();
    }

    /**
     * 商城
     */
    private _onClickShop():void{
        let _mainIns = MainLogic.instance;
        let self = this;
        PanelExchange2.instance.show(0,function(){
            _mainIns.setScreenPortrait(750,1334);
            /*if(!self._mySeat.inGame && !self._inTable){
                let _gold = MainLogic.instance.selfData.gold;
                if(self._roomInfo.baseScore <= _gold){//金豆不足
                    self._doGameInit();
                    self._cleanPlayers();
                    self._quickJoin();
                }else{
                    self._showGoldNotEnough();
                }
            }*/
        });
    }

    private _test():void{
      
    }

    /**
     * 向下箭头
     */
    private _onClickBack():void{
        if(server.playing){
            Alert.show("游戏未结束，现在退出，已消耗的金豆将不会返还，是否强行退出？", 1, (act)=>{
                if(act == "confirm"){
                    this.quitToLobby();
                }
            });
        }else{
            this.quitToLobby();
        }
    }


    ////////////////////////Server//////////////////////////
    protected _openItemReq(gridX:number,gridY:number):void{
        let data = { optype: 17,params:[gridY,gridX]};
        this._hasOpenInfo.openNum += 1;
        if(this._hasOpenInfo.openNum > 5){
            return;
        }
        server.send(EventNames.USER_OPERATE_REQ,data);
        /*let event = new egret.Event(EventNames.USER_OPERATE_REQ);
        event.data = data;
        let val = gridY * 100 + gridX * 10 + MathUtils.makeRandomInt(3,1);
        data["params"] = [val];
        this._onUserOperateRep(event);*/
    }

    /**
     * 是否有游戏未结束
     */
    private _checkInGame():void{
        this._enableThisChildTouch(false);
        let data = { optype: 16};
        server.send(EventNames.USER_OPERATE_REQ,data);
        /*let event = new egret.Event(EventNames.USER_OPERATE_REQ);
        event.data = data;
        this._onUserOperateRep(event);*/
    }

    protected _changeChipMultiReq(multi:number):void{
        let data = { optype: 15,params:[multi]};
        server.send(EventNames.USER_OPERATE_REQ,data);
        
        /*let event = new egret.Event(EventNames.USER_OPERATE_REQ);
        event.data = data;
        data["params"] = [1];
        this._onUserOperateRep(event);*/
    }
}