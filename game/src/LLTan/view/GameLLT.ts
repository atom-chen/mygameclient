/**
 *
 * @author 
 *
 */
class GameLLT extends alien.SceneBase {
    private _self: UserInfoData;
    private _roomInfo:any;
    /**
     * 当前下注的倍数
     */
    private _curMulti:number = 1;
    /**
     * 探索步数
     */
    private stepnum: number = 6;
    /**
     * 所有图片位置
     */
    private allidx = [];
    /**
     * 所有宝物图片编号
     */
    private pngid = [1,2,3,4,5,6];
    /**
     * 为挖出宝物图片编号
     */
    private noidxs = [];
    /**
     * Group
     */
	private touzhu:eui.Group;
	private help:eui.Group;
	private start:eui.Group;
	private win:eui.Group;
	private loser:eui.Group;
    private picGroup:eui.Group;
    /**
     * 本局游戏中开启的格子信息
     */
    private _hasOpenInfo:any = {
        openNum:0, //开启的格子数
        kulou:[], //开启的非宝物格子idx
        pngId:[],//所有开启的格子idx
        grids:[] //开启的格子图片序号
    };
    /**
     * 开启格子图片信息
     */
    private _okImg:any = {
        [0]:"skull",
        [1]:"Beatles_1",
        [2]:"Beatles_2",
        [3]:"Beatles_3",
        [4]:"Beatles_4",
        [5]:"Beatles_5",
        [6]:"Beatles_6",
    };

    constructor() {
        super();
        this.init();
    }

    private init(): void {
        this.skinName = scenes.GameLLTSkin;
        this._self = MainLogic.instance.selfData;
    }
    
    protected createChildren(): void {
        super.createChildren();
        this._setTotChip(0,true);
        this._setTotWinNum(0,true);
    }
    /**
     * 使能事件
     */
	private _enableEvent(bEnable:boolean):void{
		let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
		this[_func](egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
        this["subBtn"]["addClickListener"](this._onClickSub,this);
        this["addBtn"]["addClickListener"](this._onClickAdd,this);
        this["startBtn"]["addClickListener"](this._onClickStart,this);
        this["helpBtn"]["addClickListener"](this._onClickHelp,this);
        this["music"]["addClickListener"](this._onClickMusic,this);
        this["upsetBtn"]["addClickListener"](this._onClickUpset,this);
        this["againBtn"]["addClickListener"](this._onClickAgain,this);
        this["againBtn1"]["addClickListener"](this._onClickAgain,this);
        this["closeBtn"]["addClickListener"](this._onClickClose,this);
        this["gameback"]["addClickListener"](this._onClickBack,this);
        let gridX,gridY;
        for(let i=0;i<49;++i){
            gridX = i % 7 + 1; 
            gridY = Math.floor(i / 7) + 1;
            this["itemImg" + i]["addClickListener"](this._onClickItem.bind(this,gridX,gridY),this);
        }
	}
    /**
	 * 	加入舞台
	 */
	private _onAddToStage():void{
	}
	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
	}
    //
    private createBitmapByName(name: string): eui.Image {
        let result = new eui.Image();
        result.source = name;
        return result;
    }
    /**
     * 退出游戏
     */
    private _onClickBack():void{
        if(server.playing){
            Alert.show("游戏未结束，现在退出，已下注的筹码将不会返还，是否强行退出？", 1, (act)=>{
                if(act == "confirm"){
                    this.quitToLobby();
                }
            });
        }else{
            this.quitToLobby();
        }
    }
    
    /**
	 * 	初始所有图片位置
	 */
	private _initAllibx():void{
        this.allidx = [];
        for(let i=0;i<49;++i){
            this.allidx.push(i);
        }
	}
    /**
     * 49个格子的点击探索
     */
    private _onClickItem(gridX:number,gridY:number):void{
        //点击音效
        SoundManager.instance.playEffect("llt_bet_mp3");
        // console.log("=============点击网格坐标：>",gridY,gridX);
        //发送点击数据
        let data = { optype: 20,params:[gridY,gridX]};
        server.send(EventNames.USER_OPERATE_REQ,data);
    } 
    //游戏结束
     private gameover(data):void{
        console.log("游戏结束!!!!!!!!!!!!!!!!!!!!!");
        egret.setTimeout(()=>{
            //删除已有宝物编号
            for(let j=0; j<this._hasOpenInfo.grids.length; j++){
                for(let i=0; i<6; i++){
                    if(this._hasOpenInfo.grids[j] == this.pngid[i]){
                        this.pngid.splice(i,1)//删除指定下标元素
                    }
                }
            }
            // for(let i=0; i<this.pngid.length; i++){
            //     console.log("========删除已有宝物编号：",this.pngid.length,this.pngid[i]);
            // }

            // //删除已经显示图片位置
            // for(let j=0; j<this.allidx.length; j++){
            //     for(let i=0; i<this._hasOpenInfo.pngId.length; i++){
            //         if(this.allidx[j] == this._hasOpenInfo.pngId[i]){
            //             this.allidx.splice(j,1)//删除指定下标元素
            //         }
            //     }
            // }
            // console.log("删除已经显示图片位置",this.allidx.length);

            // //随机未挖出宝物位置
            // let shouldRandLen = this._hasOpenInfo.kulou.length;
            // let arr = []
            // for(let i=0;i<this.allidx.length;++i){
            //     arr.push(i);
            // }
            // while(shouldRandLen > 0){
            //     let idx = MathUtils.makeRandomIntArr(shouldRandLen,shouldRandLen,0);
            //     for(let i=0;i<idx.length;++i){
            //         let randIdx = arr[idx[i]];
            //         shouldRandLen -= 1;
            //         this.noidxs.push(randIdx);
            //     }
            // }
            // console.log("随机宝物位置的数量：",shouldRandLen,this.noidxs.length);

            //随机未挖出宝物位置
            let shouldRandLen = this._hasOpenInfo.kulou.length;
            console.log("=============游戏结束总显示图片数000000=============",this._hasOpenInfo.pngId.length);
            // console.log("=============1=============>",this._hasOpenInfo.pngId);
            let checkInOpen= (idx)=>{
                console.log("=============随机宝物后总显示图片数333333=============",this._hasOpenInfo.pngId.length);
                for(let j=0; j<this._hasOpenInfo.pngId.length ;j++){
                    if(idx == this._hasOpenInfo.pngId[j]){
                        return true;
                    }
                }
                return false;
            }
            let checkInRand= (idx)=>{
                for(let j=0; j<this.noidxs.length ;j++){
                    if(idx == this.noidxs[j]){
                        return true;
                    }
                }
                return false;
            }
            while(shouldRandLen > 0){
                let randIdx = MathUtils.makeRandomInt(48,0);
                if(!checkInOpen(randIdx) && !checkInRand(randIdx)){
                    shouldRandLen -= 1;
                    this.noidxs.push(randIdx);
                    
                    //排除宝物周边骷髅图片
                    let X = Math.floor(randIdx%7)+1;
                    let Y = Math.floor(randIdx/7)+1;
                    let kulou = this._askKeyofEight(7,7,X-1,Y-1,this._hasOpenInfo.pngId);
                    console.log("=============随机宝物周围骷髅数11111111=============",kulou.length,X,Y);
                    console.log("=============随机宝物后总显示图片数2222222=============",this._hasOpenInfo.pngId.length);
                }
            }

            // 展示未挖出宝物
            for(let j=0; j<this.noidxs.length; j++){
                let pngPre = this._okImg[this.pngid[j]];
                this["itemImg" + this.noidxs[j]].source = pngPre;
                this._showItemImg(this.noidxs[j],true);
                console.log("随机宝物位置和图片：",this.noidxs[j],this.pngid[j]);
            }
            //停留几秒，展示最终得分
            egret.setTimeout(()=>{
                this.start.visible = false;
                this["meng"].visible = true;
                if(data.params.length > 1){
                    this.win.visible = true;
                    this["getscore"].text = data.params[1];
                    this._setTotWinNum(data.params[1],false);
                    //胜利音效
                    SoundManager.instance.playEffect("llt_win_mp3");
                }
                if(data.params.length == 1){
                    this.loser.visible = true;
                    //播放失败音效
                    SoundManager.instance.playEffect("llt_fail_mp3");
                }
            },this,2000); 
        },this,1000);  
    }
    /**
     * 49个格子的点击
     */
    private _enableItemsTouch(bEnable:boolean):void{
        this["picGroup"].touchChildren = bEnable;
    }
    /**
     * 显示某个格子
     */
    private _showItemImg(idx:number,bShow:boolean):void{
        this["itemImg" + idx].visible = bShow;
    }
    /**
     * 使能某个格子可以点击
     */
    private _enableItemImgTouch(idx:number,bEnable:boolean):void{
        this["itemImg" + idx].touchEnabled = bEnable;
    }
    /**
     * 服务器返回开启操作成功
     * val 百位：行 十位：列 个位：值
     */
    private _openItemSucc(val:number,bAni:boolean,func:Function):void{
        let gridY = Math.floor(val/100);
        let gridX = Math.floor(val/10) %10;
        let pngId = (val % 100)%10;
        let idx = (gridY - 1)* 7 + gridX - 1;
        // console.log("=============================点击返回 ",gridY,gridX,pngId,idx);
        if(bAni){
            //更新步数
            if (this.stepnum > 0) {
                // console.log("=============================当前步数是： ",this.stepnum);
                this.stepnum -= 1
            }
            this["step"].text = "" + this.stepnum;
        }

        //展示挖宝结果
        let pngPre = this._okImg[pngId];
        this["itemImg" + idx].source = pngPre;
        this._showItemImg(idx,true);
        this._enableItemImgTouch(idx,false);
        this._hasOpenInfo.pngId.push(idx);
        func();

        if(pngId == 0){//统计未挖出宝物的数量
            this._hasOpenInfo.kulou.push(idx);
            // console.log("=============================未挖出宝物的数量",this._hasOpenInfo.kulou.length);
        }
        else{//记录挖出宝物的图片编号
            this._hasOpenInfo.grids.push(pngId);
            //展示宝物周边骷髅图片
            let kulou = this._askKeyofEight(7,7,gridX-1,gridY-1,this._hasOpenInfo.pngId);
            // console.log("=============================",kulou);
            for(let i=0; i<kulou.length; i++){
                this["itemImg" + kulou[i]].source = this._okImg[0];
                this._showItemImg(kulou[i],true);
                this._enableItemImgTouch(kulou[i],false);
                
                //避免重复添加已经显示的坐标
                let checkInOpen= (h)=>{
                    for(let j=0; j<this._hasOpenInfo.pngId.length ;j++){
                        if(h == this._hasOpenInfo.pngId[j]){
                            return true;
                        }
                    }
                    return false;
                }
                if(!checkInOpen(kulou[i])){
                    this._hasOpenInfo.pngId.push(kulou[i]);
                }
            }
        }
 
    }
    private _putKV(arr1:any,arr2:any,k:number):any{
        console.log("==========周围骷髅位置===================",k);
        arr1.push(k);
        arr2.push(k);
    }
    /**
     * 求周围8个方格问题
     */
    private _askKeyofEight(M:number,N:number,i:number,j:number,arr:any):any{
        let num = [];
        let xb = j* M + i;
        console.log("=============================",xb);
        if (i == 0 && j == 0){//左上
            //遍历 a[i+1][j], a[i][j+1], a[i+1][j+1]
            // console.log("=============================左上",xb);
            let idx1 = xb+1;
            let idx2 = xb+7;
            let idx3 = xb+8;
            this._putKV(num,arr,idx1);
            this._putKV(num,arr,idx2);
            this._putKV(num,arr,idx3);
        }
        else if (i == 0 && j == N-1){//左下
            //遍历 a[i][j-1], a[i+1][j], a[i-1][j-1]
            // console.log("=============================左下",xb);
            let idx1 = xb-7;
            let idx2 = xb-6;
            let idx3 = xb+1;
            this._putKV(num,arr,idx1);
            this._putKV(num,arr,idx2);
            this._putKV(num,arr,idx3);
        }
        else if (i == M-1 && j == 0){//右上
            //遍历 a[i-1][j], a[i][j+1], a[i-1][j+1]
            // console.log("=============================右上",xb);
            let idx1 = xb-1;
            let idx2 = xb+6;
            let idx3 = xb+7;
            this._putKV(num,arr,idx1);
            this._putKV(num,arr,idx2);
            this._putKV(num,arr,idx3);
        }
        else if (i == M-1 && j == N-1){//右下
            //遍历 a[i][j-1], a[i-1][j], a[i-1][j-1]
            // console.log("=============================右下",xb);
            let idx1 = xb-8;
            let idx2 = xb-7;
            let idx3 = xb-1;
            this._putKV(num,arr,idx1);
            this._putKV(num,arr,idx2);
            this._putKV(num,arr,idx3);
        }
        else if (i == 0 && j != 0 && j != N-1){//左边
            //遍历 a[i][j-1], a[i][j+1], a[i+1][j], a[i+1][j-1], a[i+1][j+1]
            // console.log("=============================左边",xb);
            let idx1 = xb-7;
            let idx2 = xb-6;
            let idx3 = xb+1;
            let idx4 = xb+8;
            let idx5 = xb+7;
            this._putKV(num,arr,idx1);
            this._putKV(num,arr,idx2);
            this._putKV(num,arr,idx3);
            this._putKV(num,arr,idx4);
            this._putKV(num,arr,idx5);
        }
        else if (i == M-1 && j != 0 && j != N-1){//右边
            //遍历 a[i][j-1], a[i][j+1], a[i-1][j], a[i-1][j-1], a[i-1][j+1]
            // console.log("=============================右边",xb);
            let idx1 = xb-8;
            let idx2 = xb-7;
            let idx3 = xb-1;
            let idx4 = xb+6;
            let idx5 = xb+7;
            this._putKV(num,arr,idx1);
            this._putKV(num,arr,idx2);
            this._putKV(num,arr,idx3);
            this._putKV(num,arr,idx4);
            this._putKV(num,arr,idx5);
        }
        else if (j == 0 && i != 0 && i != M-1){//上边
            //遍历 a[i-1][j], a[i+1][j], a[i][j+1], a[i-1][j+1], a[i+1][j+1]
            // console.log("=============================上边",xb);
            let idx1 = xb+8;
            let idx2 = xb+7;
            let idx3 = xb+6;
            let idx4 = xb+1;
            let idx5 = xb-1;
            this._putKV(num,arr,idx1);
            this._putKV(num,arr,idx2);
            this._putKV(num,arr,idx3);
            this._putKV(num,arr,idx4);
            this._putKV(num,arr,idx5);
        }
        else if (j == N-1 && i != 0 && i != M-1){//下边
            //遍历 a[i-1][j], a[i+1][j], a[i][j-1], a[i-1][j-1], a[i+1][j-1]
            // console.log("=============================下边",xb);
            let idx1 = xb-8;
            let idx2 = xb-7;
            let idx3 = xb-6;
            let idx4 = xb-1;
            let idx5 = xb+1;
            this._putKV(num,arr,idx1);
            this._putKV(num,arr,idx2);
            this._putKV(num,arr,idx3);
            this._putKV(num,arr,idx4);
            this._putKV(num,arr,idx5);
        }
        else{//中间
            //遍历 a[i-1][j], a[i+1][j], a[i][j-1], a[i][j+1], a[i-1][j-1], a[i+1][j-1], a[i-1][j+1], a[i+1][j+1]
            // console.log("=============================中间",xb);
            let idx1 = xb-8;
            let idx2 = xb-7;
            let idx3 = xb-6;
            let idx4 = xb-1;
            let idx5 = xb+1;
            let idx6 = xb+6;
            let idx7 = xb+7;
            let idx8 = xb+8;
            this._putKV(num,arr,idx1);
            this._putKV(num,arr,idx2);
            this._putKV(num,arr,idx3);
            this._putKV(num,arr,idx4);
            this._putKV(num,arr,idx5);
            this._putKV(num,arr,idx6);
            this._putKV(num,arr,idx7);
            this._putKV(num,arr,idx8);
        }
        // console.log("=============================周围方格的数量",num.length);
        return num;
    }
    
    private _initServerListen(bAdd:boolean):void{
        let func = "addEventListener";
        if(!bAdd){
            func = "removeEventListener";
        }
        server[func](EventNames.USER_RECONNECT_TABLE_REP,this._onReconnectTableRep,this);
        server[func](EventNames.GAME_GIVE_UP_GAME_REP,this._onGiveUpGameRep,this);
        server[func](EventNames.USER_ALMS_REP,this._onAlmsResponse,this);
        server[func](EventNames.GAME_USER_INFO_IN_GAME_REP,this._onUserInfoInGameResponse,this);
        server[func](EventNames.GAME_GAME_START_NTF,this._onGameStart,this);
        server[func](EventNames.GAME_RECONNECT_REP,this._onReconnectRep,this);
        server[func](EventNames.GAME_ADD_CARD,this._onAddCard,this);
        server[func](EventNames.GAME_SHOW_CARD,this._onShowCard,this);
        server[func](EventNames.GAME_GAME_END,this._onGameEnd,this);
        server[func](EventNames.GAME_REPLENISH_FREEZE_GOLD_REP,this._onReplenishFreezeGoldRep,this)
        server[func](EventNames.GAME_OPERATE_REP_EX,this._onGameOperateRepEx,this)
        server[func](EventNames.GAME_OPERATE_REP,this._onGameOperateRep,this);
        server[func](EventNames.GAME_UPDATE_GAME_INFO,this._onUpdateGameInfo,this);
        server[func](EventNames.GAME_ENTER_TABLE,this._onEnterTable,this);
        server[func](EventNames.GAME_LEAVE_TABLE,this._onLeaveTable,this);
        server[func](EventNames.GAME_TABLE_INFO,this._onRecvTableInfo,this);
        server[func](EventNames.GAME_ASK_READY,this._onAskReady,this);
        server[func](EventNames.GAME_GET_READY_REP,this._onGetReadyRep,this);
        server[func](EventNames.QUIT_PGAME_REP,this._onQuitRoomRep,this);
        server[func](EventNames.USER_QUICK_JOIN_RESPONSE,this._onQuickJoinResponse,this);
        server[func](EventNames.USER_USER_INFO_RESPONSE,this._onUserInfoResponse,this);
        server[func](EventNames.START_PGAME_REP,this._onStartGameRep,this);
        server[func](EventNames.USER_OPERATE_REP,this._onUserOperateRep,this);
    }
    private _onLotteryRedCoinRep():void{
        egret.setTimeout(()=>{
            this._checkGoldEnough();
        },this,1000);
    }

    public _checkGoldEnough():void{
        let myHave = 0;
        if(myHave < this._roomInfo.price){
            this._showGoldNotEnough();
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

    private _onQuickJoinResponse(event: egret.Event): void {
      var msg: any = event.data;
        // console.log("快速加入游戏返回:" + msg.result);
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
    /**
     * 金豆不足，自动补到房间最低值
     * getGold 补的金额
     */
    private _showMyReFull(getGold):void{
        let str:string = "";
        if(getGold>0){
            let left = MainLogic.instance.selfData.gold;
            left -= getGold;
            str = "金豆不足" + this._roomInfo.price + "，自动补足余额" + left;
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

    /**
     * 商城
     */
    private _onClickShop():void{
        this.quitToLobby();
        PanelExchange2.instance.show();
    }
    private _onUserOperateRep(event: egret.Event): void {
        let data = event.data;
        let optype = data.optype;
        if(optype != 18 && optype != 19 && optype != 20){
            return;
        }else if(optype == 18 && data.result == 3){
            Alert.show("金豆不足或者有游戏未结束",0,()=>{
                this.quitToLobby();
            });
            return;
        }

        if(data.result == null || data.result == 0){
            if(optype == 18){
                if(data.params && data.params.length >= 1){
                    this._onStartGameRep();
                }else{
                    Alert.show("倍数操作失败,参数长度不足");
                }
            }else if(optype == 19){
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
                    this._openItemSucc(val,true,()=>{
                        if(this.stepnum == 0){
                            server.playing = false;
                            this["meng1"].visible = true;
                            this.gameover(data);
                        }
                    });
                }else{
                    Alert.show("开启操作失败,参数长度不足");
                }
            }
        }else{
            // Alert.show("操作失败,result:" + data.result);
        }
    }
    //设置个人信息
    private _initMyInfo():void{
        let data = MainLogic.instance.selfData;
        this["headimg"].source = data.imageid;
        this["nickname"].text = data.nickname;
        this["tnum"].text = "剩余金豆:" + data.gold;
    }
    private _onUserInfoResponse(event: egret.Event): void {
        // console.log("=============================个人信息返回 ");
        let data = event.data;
        if(data.gold >=0){
            this["tnum"].text = "剩余金豆:" + data.gold;
        }
    }
    /**
     * 返回未结束的游戏
     */
    private _onRecvBackToGame(multi:number,opens:any):void{
        //设置下注倍数
        let base = this._roomInfo.price;
        let num = base * multi;
        this._setChipNum(num,true);

        this.touzhu.visible = false;
        this["meng"].visible = false;
        this["meng1"].visible = false;
        this.start.visible = true;
        
        // console.log("=============================已走步数,剩余步数",opens.length,(6-opens.length));
        this.stepnum = (6-opens.length);
        this["step"].text = "" + (6-opens.length);
        this._enableItemsTouch(false);
        this._initItems(false,0.01,0.7,"gezi",300,true,()=>{
              for(let i = 0;i<49;++i){
                  this._enableItemImgTouch(i,true);
              }
        });
        this._setTotChip(num,true);
        if(opens && opens.length >= 1){
            let openLen = opens.length;
            for(let i=0;i<openLen;++i){
                this._openItemSucc(opens[i],false,function(){

                })
            }
        }
        this._enableThisChildTouch(true);
        this._enableItemsTouch(true);
    }
    /**
     * beforeSet:是否在动画之前设置图片
     */
    private _initItems(bAni:boolean,sScale:number,tScale:number,png:string,time:number,beforeSet:boolean = false,overFunc:Function = null):void{
        let img:eui.Image;
        let okNum = 0;
        for(let i = 0;i<49;++i){
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
                if(overFunc){
                    overFunc();
                }
            }
        }
    }

    private _onRecvNoGameRec():void{
        this._enableThisChildTouch(true);
    }



    /**
     * 减注
     */
    private _onClickSub():void{
        if(this._curMulti <= 1){
            return;
        }
        this._curMulti -= 1;
        let chipNum = this._curMulti * this._roomInfo.price;
        this._setChipNum(chipNum,true);
    }
    /**
     * 加注
     */
    private _onClickAdd():void{
        let chipNum = this._getChipNum();
        // console.log("--加注-----chipNum---->",chipNum);
        let stepChip = this._roomInfo.price;
        let maxMulti = this._roomInfo.topmultip;
        let destChipNum = chipNum + stepChip;
        // console.log("--加注----destChipNum----->",destChipNum);
        let have = MainLogic.instance.selfData.getGold();
        if( destChipNum >have ){
            return;
        }else if(this._curMulti >= maxMulti){
            return;
        }
        this._curMulti += 1;
        chipNum = this._curMulti * this._roomInfo.price;
        this._setChipNum(chipNum,true);
    }
    /**
     * 获取下注的筹码
     */
    private _getChipNum():number{
        return Number(this["score"].text);
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
        this["score"].text = "" + n;
        this._onChipNumChange(n);
        this._setTotChip(n,true);
    }
    /**
     * 设置总下注
     */
    private _setTotChip(gold,bSet:boolean):void{
        let num = Number(this["score"].text);
        if(isNaN(num)){
            num = 0;
        }
        if(bSet){
            num = gold;
        }else{
            num += gold;
        }
        this["xnum"].text = "消耗金豆:" + num; 
    }
    /**
     * 设置总赢
     */
   private _setTotWinNum(gold,bSet:boolean):void{
        let num = Number(this["wnum"].text);
        if(isNaN(num)){
            num = 0;
        }
        if(bSet){
            num = gold;
        }else{
            num += gold;
        }
        this["wnum"].text = "" + num; 
    }
    /**
     * 下注筹码变化要动态调整每个奖项的数值
     */
    private _onChipNumChange(chipNum:number):void{
        let multi = this._roomInfo.multip;
        let num1 = Math.ceil(multi["1"]*chipNum);
        let num2 = Math.ceil(multi["2"]*chipNum);
        let num3 = Math.ceil(multi["3"]*chipNum);
        let num4 = Math.ceil(multi["4"]*chipNum);
        let num5 = Math.ceil(multi["5"]*chipNum);
        let num6 = Math.ceil(multi["6"]*chipNum);
        this["score1"].text = "" + num1; 
        this["score2"].text = "" + num2; 
        this["score3"].text = "" + num3; 
        this["score4"].text = "" + num4; 
        this["score5"].text = "" + num5; 
        this["score6"].text = "" + num6; 
    }
    /**
     * 开始游戏
     */
    private _onClickStart():void{
        let have = MainLogic.instance.selfData.getGold();
        console.log("=============================have",have);
        if(have < this._roomInfo.price){
            this._showGoldNotEnough();
            return;
        }

        //发送下注倍数
        let betNum:number = this._curMulti
        console.log("=============================开始游戏",betNum);
        let data = { optype: 18,params:[betNum]};
        server.send(EventNames.USER_OPERATE_REQ,data);
        
        //播放点击音效
        SoundManager.instance.playEffect("llt_bet_mp3");
    }
    /**
     * (设置下注倍数成功)开始游戏返回
     */
    private _onStartGameRep(): void {
        console.log("=============================开始游戏返回");
        this.touzhu.visible = false;
        this["meng"].visible = false;
        this["meng1"].visible = false;
        this.start.visible = true;
        this["step"].text = "" + this.stepnum;
    }

    // //移动动画
    // let i = 6;
    // let pic: eui.Image = this.createBitmapByName("eye_"+i+"");
    // // let pic: eui.Image = this.createBitmapByName("skull");
    // pic.width = 91;
    // pic.height = 91;
    // this.addChildAt(pic,6);
    // pic.x = e.$stageX;
    // pic.y = e.$stageY;
    // var tw = egret.Tween.get( pic );
    // tw.to( {x:this.eye_6.$getX(),y:this.eye_6.$getY()}, 1000 );
    
    /**
     * 帮助
     */
    private _onClickHelp():void{
		this.help.visible = true;
    }
    /**
     * 音效
     */
    private _onClickMusic():void{
        //静音操作
        alien.SoundManager.instance.switchEffect();
        //音效图标
        let mute = alien.SoundManager.instance.effectMute;
        let src = "sound_1";
        if(mute){
            src = "sound_2";
        }
        this["music"].source = src;
    }
    /**
     * 刷新
     */
    private _onClickUpset():void{
		let mcData = RES.getRes("WinMovie2_json");
		let pngData = RES.getRes("winMovie2");
		let mcDataFactory = new egret.MovieClipDataFactory(mcData, pngData);
		let winMc:egret.MovieClip = new egret.MovieClip(mcDataFactory.generateMovieClipData("WinMovie"));
        winMc.x = 375;
        winMc.y = 667;
        this.addChild(winMc);
        winMc.gotoAndPlay(-1);
    }
    /**
     * 再玩一次
     */
    private _onClickAgain():void{
        //点击音效
        SoundManager.instance.playEffect("llt_bet_mp3");

		this.loser.visible = false;
		this.win.visible = false;
		this.start.visible = false;
		this.touzhu.visible = true;
        this.stepnum = 6;

        //清除残局
        for(var t:number = 0; t<49; t++)
        {
            this["itemImg" + t].source = "gezi";
            this._enableItemImgTouch(t,true);
        }
        this._resetGameInfo();
        this._initAllibx();
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
        this._setChipNum(base,true);
        this._setTotChip(base,true);
    }
    /**
     * 重置已开启的格子数据
     */
    private _resetGameInfo():void{
        this._curMulti = 1;
        this["score"].text = "1000";
        this._hasOpenInfo = {
            openNum:0, //开启的格子数
            kulou:[], //开启的非宝物格子idx
            pngId:[],//所有开启的格子idx
            grids:[] //开启的格子图片序号
        };
        this.noidxs = [];
        this.pngid = [1,2,3,4,5,6];;
    }
    /**
     * 关闭帮助
     */
    private _onClickClose():void{
		this.help.visible = false;
    }

    
    beforeShow(params:any):void {
        this._roomInfo = server.roomInfo = params.roomInfo;
        alien.SoundManager.instance.enablePlayMusic(false);
        alien.SoundManager.instance.stopMusic();
        this._enableEvent(true);
        MainLogic.instance.setScreenPortrait(750,1334);

        this._initServerListen(true);
        this._initMyInfo();
        this._initAllibx();
        this._doGameInit(false,0,0);
        this._checkInGame();
	}

    beforeHide(): void {
        this._initServerListen(false);
    }

    /**
     * 是否有游戏未结束
     */
    private _checkInGame():void{
        this._enableThisChildTouch(false);
        let data = { optype: 19};
        server.send(EventNames.USER_OPERATE_REQ,data);
        /*let event = new egret.Event(EventNames.USER_OPERATE_REQ);
        event.data = data;
        this._onUserOperateRep(event);*/
    }
    /**
     * 使能其他的点击
     */
    private _enableThisChildTouch(bEnable:boolean):void{
        this.touchChildren = bEnable;
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
}
