/**
 *
 * @author 
 *
 */
class Game2048 extends alien.SceneBase {
    private session: any;
    private _roomInfo: any;
    private _myInfo: UserInfoData;
    private MyHead1: Head;
    private MyHead2: Head;
    private MyHead3: Head;
    private _othersUid: number;
    private HisHead1: Head;
    private HisHead2: Head;
    private HisHead3: Head;
    private myScore: eui.Rect;
    private hisScore: eui.Rect;
    private Myseatid: any;

    private scoreArr = {};

    private arr: any;
    //等待倒计时
    private waitnum: number = 0;
    private _wIntervalId: number;
    //游戏倒计时
    private daonum: number = 0;
    private _dIntervalId: number;
    private Prog: Progress;
    //游戏得分
    private scorenum: number = 0;
    private per1: number = 0;
    private per2: number = 0;

    private step1Timeout: number;
    private step2Timeout: number;
    private step3Timeout: number;
    private step4Timeout: number;

    //所有图片位置
    private allidx = [];
    private maps = [];

    private isComplete: boolean;
    
	private isStart: boolean;
    private leftDiamond: number = 0;
    
    constructor() {
        super();
        this.init();
        this._myInfo = MainLogic.instance.selfData;
        this["ruleTips"].textFlow = Utils.getHtmlText("每次可以选择上下左右其中一个方向去滑动，每滑动一次，所有的数字方块都会往滑动的方向靠拢外，系统也会在空白的地方乱数出现一个数字方块，<font color=0x4452DA>相同</font>数字的方块在靠拢、相撞时会<font color=0x4452DA>相加</font>。不断的叠加最终拼凑出<font color=0x4452DA>2048</font>这个数字就算成功，分数大者奖励800金豆，失败不扣金豆");    
        this["playTips"].textFlow = Utils.getHtmlText("1、率先合出<font color=0x4452DA>2048</font>的一方立即获胜\n2、若游戏时间内双方都未合出2048则以最终<font color=0x4452DA>总分高者获胜</font>\n3、游戏未结束，率先退出游戏的人失败"); 
        this["tip2"].textFlow = Utils.getHtmlText("对方率先合成2048,<font color=0xCE1F69>对方获胜</font>"); 
    }

    private init(): void {
        this.skinName = scenes.Game2048Skin;
        this.arr = this.initArray();
    }
    //设置个人信息
    private initMyinfo(data: any): void {
        if (data.sex == 2) {
            this.MyHead1.currentState = "female";
            this.MyHead2.currentState = "female";
            this.MyHead3.currentState = "female";
        } else {
            this.MyHead1.currentState = "male";
            this.MyHead2.currentState = "male";
            this.MyHead3.currentState = "male";
        }
        console.log("=========================我的昵称", data.nickname, Base64.decode(data.nickname));
        this.MyHead1.imageId = data.imageid;
        this.MyHead1.nickName = Base64.decode(data.nickname);
        this.MyHead2.imageId = data.imageid;
        this.MyHead2.nickName = Base64.decode(data.nickname);
        this.MyHead3.imageId = data.imageid;
        this.MyHead3.nickName = Base64.decode(data.nickname);
    }
    private _setOthersInfo(data: any): void {
        if (data.sex == 2) {
            this.HisHead1.currentState = "female";
            this.HisHead2.currentState = "female";
            this.HisHead3.currentState = "female";
        } else {
            this.HisHead1.currentState = "male";
            this.HisHead2.currentState = "male";
            this.HisHead3.currentState = "male";
        }
        console.log("=========================对方昵称", data.nickname, Base64.decode(data.nickname));
        this.HisHead1.imageId = data.imageid;
        this.HisHead1.nickName = Base64.decode(data.nickname);
        this.HisHead2.imageId = data.imageid;
        this.HisHead2.nickName = Base64.decode(data.nickname);
        this.HisHead3.imageId = data.imageid;
        this.HisHead3.nickName = Base64.decode(data.nickname);
    }
    private initArray() {
        var arrayGame = new Array();
        for (var i = 0; i < 4; i++) {
            arrayGame[i] = new Array();
        }
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                arrayGame[i][j] = 0;
            }
        }
        return arrayGame;
    }
    //初始两个8
    private _init8Pic(): void {
        this.maps = [];
        this.allidx = [];
        this.arr = this.initArray();
        for (let i = 0; i < 16; ++i) {
            this.maps.push(0);
            let X = Math.floor(i / 4);
            let Y = i % 4;
            this.arr[X][Y] = 0;
            this["itemImg" + i].source = "lg_game_block";
        }
        let check = (idx) => {
            for (let j = 0; j < this.allidx.length; j++) {
                if (idx == this.allidx[j]) {
                    return true;
                }
            }
            return false;
        }
        let gridX, gridY;
        var isFull = false;
        while (!isFull) {
            let idx = MathUtils.makeRandomInt(15, 0);
            gridX = Math.floor(idx / 4);
            gridY = idx % 4;
            if (!check(idx)) {
                this.allidx.push(idx);
                this.maps[idx] = 8;
                this.arr[gridX][gridY] = 8;
                this["itemImg" + idx].source = "2048_number_8";
                if(this.allidx.length == 2){
                    isFull = true;
                }
            }
        }

        this.sendXY(this.maps);
    }
    //随机在空白处补充8
    private add8Pic() {
        var array = this.arr;
        var zeroArr = [];
        var isHasZero = false;
        for (var i = 0; i < 16; i++) {
            let X = Math.floor(i / 4);
            let Y = i % 4;
            if (array[X][Y] == 0) {
                zeroArr.push(i);
                isHasZero = true;
            }
        }
        if (isHasZero == false) return;
        let pos = MathUtils.makeRandomInt(zeroArr.length - 1, 0);
        let X1 = Math.floor(zeroArr[pos] / 4);
        let Y1 = zeroArr[pos] % 4;
        this.maps[zeroArr[pos]] = 8;
        this.arr[X1][Y1] = 8;
        this["itemImg" + zeroArr[pos]].source = "2048_number_8"
        // console.log("=============补充8随机位置",zeroArr[pos]);
    }
    //重连恢复地图
    private ReInitPic(data: any) {
        this.maps = [];
        this.arr = this.initArray();
        for (let i = 0; i < 16; ++i) {
            let X = Math.floor(i / 4);
            let Y = i % 4;
            this.maps[i] = data[i];
            this.arr[X][Y] = data[i];
            if (data[i] == 0) {
                this["itemImg" + i].source = "lg_game_block";
            }
            else {
                this["itemImg" + i].source = "2048_number_" + data[i];
            }
        }
    }
    

    protected createChildren(): void {
        super.createChildren();
    }

    beforeShow(params: any): void {
        this._roomInfo = server.roomInfo = params.roomInfo;
        alien.SoundManager.instance.enablePlayMusic(false);
        alien.SoundManager.instance.stopMusic();
        MainLogic.instance.setScreenPortrait(750, 1334);

        this._enableEvent(true);
        this._initServerListen(true);
        if (params.data.isReconnect) {            
            console.log("!!!!!!!!!!!!!!!!!!!!!!!重连加入游戏============");
            this.session = params.data.session;
            this.reconnectTableReq(params.data.session);    
        } else {
            console.log("!!!!!!!!!!!!!!!!!!!!!!!快速加入游戏============");
            this.quickJoin();
        }
    }

    beforeHide(): void {
        this._initServerListen(false);
    }
    /**
     * 使能事件
     */
    private _enableEvent(bEnable: boolean): void {
        let _func = "addEventListener";
        if (!bEnable) {
            _func = "removeEventListener"
        }
        this[_func](egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
        this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
        this["gameback"]["addClickListener"](this._onGameback, this);
        this["gamehelp"]["addClickListener"](this._onClickHelp, this);
        this["gameback0"]["addClickListener"](this._onGameExit, this);
        this["gamehelp0"]["addClickListener"](this._onClickHelp, this);
        this["gameback1"]["addClickListener"](this.quitToLobby, this);
        this["gamehelp1"]["addClickListener"](this._onClickHelp, this);
        this["againBtn"]["addClickListener"](this._onClickAgain, this);
        this["changeGame"]["addClickListener"](this._onchangeGame, this);
        this["changePerson"]["addClickListener"](this._onchangePerson, this);
        this["closeBtn"]["addClickListener"](this._onClickClose, this);
        this["goon"]["addClickListener"](this._onClickCancle, this);
        this["sure"]["addClickListener"](this._onClickSure, this);
        this["lab1"].touchEnabled = false;
        this["lab2"].touchEnabled = false;
        this["lab3"].touchEnabled = false;
        this["lab4"].touchEnabled = false;
        this["lab5"].touchEnabled = false;
        this._resetGameInfo();
    }
    //匹配倒计时
    private _GameAni(): void {
        this._wIntervalId = egret.setInterval(() => {
            this.waitnum += 1;
            this["timeCount"].text = this.waitnum + " s";
        }, this, 1000);
    }
    //游戏结束
    private _GameOver(data:any): void {
        if (!this.scoreArr[this._myInfo.uid]) this.scoreArr[this._myInfo.uid] = {};
        if (!this.scoreArr[this._myInfo.uid]["gameNum"]) this.scoreArr[this._myInfo.uid]["gameNum"] = 0;
        this.scoreArr[this._myInfo.uid]["gameNum"]++;
        this["Gnum"].text = "今日已对决" + this.scoreArr[this._myInfo.uid]["gameNum"] + "场";
        if (!this.scoreArr[this._myInfo.uid][this._othersUid]) this.scoreArr[this._myInfo.uid][this._othersUid] = [0, 0];
        this["resultScore"].text = this.scoreArr[this._myInfo.uid][this._othersUid][0] + " : " + this.scoreArr[this._myInfo.uid][this._othersUid][1];

        this["pipei"].visible = false;
        this["start"].visible = false;
        this["result"].visible = true;
        this["scorenNum"].text = this.scorenum;
        // this["lab1"].text = "不服！再来一局";

        let _myChangeGold = 0;
         for(var i = 0; i < 2; ++i){
            if(this.Myseatid == (i+1)) {
                _myChangeGold = data.chanage[i];
            }
        }
        this["GetNum"].visible = false;
        if(_myChangeGold>0){
            this["GetNum"].visible = true;
            this["GetNum"].text = "你获得" + _myChangeGold + "金豆";
        }else if(_myChangeGold=0){
            this["GetNum"].visible = false;
        }
    }
    //加入舞台
    private _onAddToStage(): void {
    }
    //从场景移除
    private _onRemovedToStage(): void {
        this._enableEvent(false);
    }
    //创建图片
    private createBitmapByName(name: string): eui.Image {
        let result = new eui.Image();
        result.source = name;
        return result;
    }
    //退出游戏,返回大厅
    private _onGameback(): void {
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~this.isStart",this.isStart);
        if(!this.isStart && this._roomInfo.style){
            console.log("===========================退出匹配");
            server.QuitWaitingQueueReq();
            this.quitToLobby();
        }else if(this.isStart && this._roomInfo.style){
            console.log("===========================认输退出");
            this["Exit"].visible = true;
        }
        else{
            this.giveUpGame(0);
            this.quitToLobby();
        }
    }
    private quitToLobby(): void {
        MainLogic.backToRoomScene({toSmall:true});
    }
    //退出游戏,提示确认
    private _onGameExit(): void {
        this["Exit"].visible = true;
    }
    //帮助
    private _onClickHelp(): void {
        this["help"].visible = true;
    }
    //再玩一次
    private _onClickAgain(): void {
        this._resetGameInfo();
        egret.setTimeout(() => {
            this.quickJoin();
        }, this, 500); 
    }
    protected GetReadyReq(session: number): void {
        var msg: any = {};
        msg.session = session;
        server.send(EventNames.GAME_GET_READY_REQ, msg);
    }
    private _onGetReadyRep(event: egret.Event): void {
        let data = event.data;
        if (data.result == 0) {//准备成功
            // if (data.seatid == this.Myseatid) {
            //     this["lab1"].text = "等待对方准备"
            // }
            // else {
            //     this["lab1"].text = "对方已准备，马上再战"
            // }
        }
    }
    //重置游戏
    private _resetGameInfo(): void {
        this._initStepTimeout();
        this["pipei"].visible = true;
        this["start"].visible = false;
        this["result"].visible = false;
        this["help"].visible = false;
        this["Exit"].visible = false;
        this.allidx = [];
        this.maps = [];

        this["gameback"].visible = true;
        this["gamehelp"].visible = true;

        this.scorenum = 0;
        this["score"].text = "当前得分：" + this.scorenum;
        this["title"].text = "正在匹配中";
        this["timeCount"].visible = true;
        this["large"].visible = true;
        this["big"].visible = true;
        this["small"].visible = true;
        this["MyHead1"].x = 290;
        this["tip"].visible = false;
        this["HisHead1"].visible = false;
        this["vs"].visible = false;

        //清除等待倒计时
        egret.clearInterval(this._wIntervalId);
        this.waitnum = 0;
        this["timeCount"].text = this.waitnum + " s";
        //清除游戏倒计时
        egret.clearInterval(this._dIntervalId);
        this.daonum = 0;

        this["myScore"].width = 250;
        this["hisScore"].width = 250;
        this["lab_11"].visible = true;


        this.Prog.visible = false;
        
        this["tip1"].visible = false;
        this["tip2"].visible = false;
        this["tip4"].visible = false;
    }
    //换游戏
    private _onchangeGame(): void {
        this.quitToLobby();
    }
    //换人
    private _onchangePerson(): void {
        this._resetGameInfo();
        egret.setTimeout(() => {
            this.quickJoin();
        }, this, 500); 
    }
    //关闭帮助
    private _onClickClose(): void {
        this["help"].visible = false;
    }
    //认输退出
    private _onClickSure(): void {
        this.giveUpGame(0);
    }
    protected giveUpGame(status: number): void {
        var msg: any = {};
        msg.status = status;
        msg.session = 0;
        server.send(EventNames.GAME_GIVE_UP_GAME_REQ, msg);
    }
    private _onGiveUpGameRep(event: egret.Event): void {
        let data = event.data;
        if (data.result != 0) {
            Alert.show("退出游戏失败", 0, (act) => {
            })
        }
    }
    //继续玩
    private _onClickCancle(): void {
        this["Exit"].visible = false;
    }


    //网格的移动方向
    private moveDirection(): void {
        //为 this["picGroup"] 添加touch事件
        this["picGroup"].addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onGamePanelTouchBegin, this);
    }
    private onGamePanelTouchBegin(event: egret.TouchEvent) {
        let target = event.currentTarget;
        target.touchX = event.stageX;
        target.touchY = event.stageY;
        this["picGroup"].addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onGamePanelTouchMove, this);
    }
    private onGamePanelTouchMove(event: egret.TouchEvent) {
        let target = event.currentTarget;
        let deltaX = event.stageX - target.touchX;
        let deltaY = event.stageY - target.touchY;
        if (Math.abs(deltaX - deltaY) <= 40) {
            //方向区分不太明确，忽略操作
            return;
        }
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
                if (this.checkLeft()) {
                    //移动音效
                    SoundManager.instance.playEffect("move_wav");
                    console.log("=============向左移动网格");
                    this.leftAction();
                } else {
                    //不能移动音效
                    SoundManager.instance.playEffect("no_move_mp3");
                    console.log("不能左移");
                }
            }
            else {
                if (this.checkRight()) {
                    //移动音效
                    SoundManager.instance.playEffect("move_wav");
                    console.log("=============向右移动网格");
                    this.rightAction();
                } else {
                    //不能移动音效
                    SoundManager.instance.playEffect("no_move_mp3");
                    console.log("不能右移");
                }
            }
        }
        else {
            if (deltaY < 0) {
                if (this.checkTop()) {
                    //移动音效
                    SoundManager.instance.playEffect("move_wav");
                    console.log("=============向上移动网格");
                    this.topAction();
                } else {
                    //不能移动音效
                    SoundManager.instance.playEffect("no_move_mp3");
                    console.log("不能上移");
                }
            }
            else {
                if (this.checkBottom()) {
                    //移动音效
                    SoundManager.instance.playEffect("move_wav");
                    console.log("=============向下移动网格");
                    this.bottomAction();
                } else {
                    //不能移动音效
                    SoundManager.instance.playEffect("no_move_mp3");
                    console.log("不能下移");
                }
            }
        }
        this.sendXY(this.maps);
        this["picGroup"].removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onGamePanelTouchMove, this);
        if (!this.checkNullPosition() && !this.checkSameNum()) {
            console.log("!!!!!!!!!!!!!!!!!!!!!!!不可移动，需要重置地图");
            this["tip1"].visible = true;
            this["tip4"].visible = true;
            egret.setTimeout(() => {
                this["tip1"].visible = false;
                this["tip4"].visible = false;
                this._init8Pic();
            }, this, 500);
        }
    }
    //检测空位置
    private checkNullPosition() {
        var array = this.arr;
        // console.log("===============================检查空位", this.arr);
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (array[i][j] == 0)
                    return true;
            }
        }
        return false;
    }
    private checkSameNum() {
        var array = this.arr;
        // console.log("=============================检查相同", this.arr);
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                if (array[i][j] == array[i][j + 1]) {
                    return true;
                }
            }
        }
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 4; j++) {
                if (array[i][j] == array[i + 1][j]) {
                    return true;
                }
            }
        }
        return false;
    }
    private topAction() {
        var array = this.arr;
        for (var j = 0; j < 4; j++) {//列循环
            for (var i = 0; i < 3; i++) {
                if (array[i][j] != 0) {
                    var tag = i + 1;
                    while (array[tag++][j] == 0 && tag < 4) { };//往下排除 0 元素
                    if (array[tag - 1][j] == array[i][j]) {
                        //合并音效
                        SoundManager.instance.playEffect("merge_wav");
                        array[i][j] = 2 * array[i][j];
                        this.maps[i * 4 + j] = array[i][j];
                        if (array[i][j] != 0) {
                            this["itemImg" + (i * 4 + j)].source = "2048_number_" + array[i][j];
                            //碰撞动画
                            egret.Tween.get(this["itemImg" + (i * 4 + j)]).to({ scaleX: 1.1, scaleY: 1.1 }, 20, egret.Ease.backIn)
                                .to({ scaleX: 1, scaleY: 1 }, 20, egret.Ease.backIn);
                            //移动动画
                            let pic: eui.Image = this.createBitmapByName("2048_number_"+array[i][j]);
                            this["picGroup"].addChild(pic);
                            pic.x = this["itemImg" + ((tag-1) * 4 + j)].$getX();
                            pic.y = this["itemImg" + ((tag-1) * 4 + j)].$getY();
                            egret.Tween.get(pic).to({ y:this["itemImg" + (i * 4 + j)].$getY()}, 40).call(()=>{
                                this["picGroup"].removeChild(pic);
                            });
                        }
                        this.scorenum += array[i][j];
                        array[tag - 1][j] = 0;
                        this.maps[(tag - 1) * 4 + j] = 0;
                        this["itemImg" + ((tag - 1) * 4 + j)].source = "lg_game_block";
                    }
                }
            }
        }

        
        for (var j = 0; j < 4; j++) {
            for (var i = 0; i < 4; i++) {
                var tag = i + 1;
                while (array[i][j] == 0 && tag < 4) {
                    array[i][j] = array[tag][j];
                    this.maps[i * 4 + j] = array[i][j];
                    if (array[i][j] != 0) {
                        //移动动画
                        let pic: eui.Image = this.createBitmapByName("2048_number_"+array[i][j]);
                        this["picGroup"].addChild(pic);
                        pic.x = this["itemImg" + (tag * 4 + j)].$getX();
                        pic.y = this["itemImg" + (tag * 4 + j)].$getY();
                        egret.Tween.get(pic).to({ y:this["itemImg" + (i * 4 + j)].$getY()}, 40).call(()=>{
                            this["picGroup"].removeChild(pic);
                        });
                        this["itemImg" + (i * 4 + j)].source = "2048_number_" + array[i][j];
                    }
                        
                    array[tag][j] = 0;
                    this.maps[tag * 4 + j] = 0;
                    this["itemImg" + (tag * 4 + j)].source = "lg_game_block";
                    tag++;
                }
            }
        }
        this.add8Pic();
    }
    private bottomAction() {
        var array = this.arr;
        for (var j = 0; j < 4; j++) {//列循环
            for (var i = 3; i > 0; i--) {
                if (array[i][j] != 0) {
                    var tag = i - 1;
                    while (array[tag--][j] == 0 && tag >= 0) { };//往下排除 0 元
                    if (array[tag + 1][j] == array[i][j]) {
                        //合并音效
                        SoundManager.instance.playEffect("merge_wav");
                        array[i][j] = 2 * array[i][j];
                        this.maps[i * 4 + j] = array[i][j];
                        if (array[i][j] != 0) {
                            this["itemImg" + (i * 4 + j)].source = "2048_number_" + array[i][j];
                            //碰撞动画
                            egret.Tween.get(this["itemImg" + (i * 4 + j)]).to({ scaleX: 1.1, scaleY: 1.1 }, 20, egret.Ease.backIn)
                                .to({ scaleX: 1, scaleY: 1 }, 20, egret.Ease.backIn);
                            //移动动画
                            let pic: eui.Image = this.createBitmapByName("2048_number_"+array[i][j]);
                            this["picGroup"].addChild(pic);
                            pic.x = this["itemImg" + ((tag+1) * 4 + j)].$getX();
                            pic.y = this["itemImg" + ((tag+1) * 4 + j)].$getY();
                            egret.Tween.get(pic).to({ y:this["itemImg" + (i * 4 + j)].$getY()}, 40).call(()=>{
                                this["picGroup"].removeChild(pic);
                            });
                        }
                        this.scorenum += array[i][j];
                        array[tag + 1][j] = 0;
                        this.maps[(tag + 1) * 4 + j] = 0;
                        this["itemImg" + ((tag + 1) * 4 + j)].source = "lg_game_block";
                    }
                }
            }
        }
        for (var j = 0; j < 4; j++) {
            for (var i = 3; i >= 0; i--) {
                var tag = i - 1;
                while (array[i][j] == 0 && tag >= 0) {
                    array[i][j] = array[tag][j];
                    this.maps[i * 4 + j] = array[i][j];
                    if (array[i][j] != 0) {
                        //移动动画
                        let pic: eui.Image = this.createBitmapByName("2048_number_"+array[i][j]);
                        this["picGroup"].addChild(pic);
                        pic.x = this["itemImg" + (tag * 4 + j)].$getX();
                        pic.y = this["itemImg" + (tag * 4 + j)].$getY();
                        egret.Tween.get(pic).to({ y:this["itemImg" + (i * 4 + j)].$getY()}, 40).call(()=>{
                            this["picGroup"].removeChild(pic);
                        });
                        this["itemImg" + (i * 4 + j)].source = "2048_number_" + array[i][j];
                    }
                    array[tag][j] = 0;
                    this.maps[tag * 4 + j] = 0;
                    this["itemImg" + (tag * 4 + j)].source = "lg_game_block";
                    tag--;
                }
            }
        }
        this.add8Pic();
    }
    private leftAction() {
        var array = this.arr;
        for (var i = 0; i < 4; i++) {//列循环X坐标
            for (var j = 0; j < 3; j++) {
                if (array[i][j] != 0) {
                    var tag = j + 1;
                    while (array[i][tag++] == 0 && tag < 4) { };//往下排除 0 元素
                    if (array[i][tag - 1] == array[i][j]) {
                        //合并音效
                        SoundManager.instance.playEffect("merge_wav");
                        array[i][j] = 2 * array[i][j];
                        this.maps[i * 4 + j] = array[i][j];
                        if (array[i][j] != 0) {
                            this["itemImg" + (i * 4 + j)].source = "2048_number_" + array[i][j];
                            //碰撞动画
                            egret.Tween.get(this["itemImg" + (i * 4 + j)]).to({ scaleX: 1.1, scaleY: 1.1 }, 20, egret.Ease.backIn)
                                .to({ scaleX: 1, scaleY: 1 }, 20, egret.Ease.backIn);
                            //移动动画
                            let pic: eui.Image = this.createBitmapByName("2048_number_"+array[i][j]);
                            this["picGroup"].addChild(pic);
                            pic.x = this["itemImg" + (i * 4 + tag - 1)].$getX();
                            pic.y = this["itemImg" + (i * 4 + tag - 1)].$getY();
                            egret.Tween.get(pic).to({ x:this["itemImg" + (i * 4 + j)].$getX()}, 40).call(()=>{
                                this["picGroup"].removeChild(pic);
                            });
                        }
                        this.scorenum += array[i][j];
                        array[i][tag - 1] = 0;
                        this.maps[i * 4 + tag - 1] = 0;
                        this["itemImg" + (i * 4 + tag - 1)].source = "lg_game_block";
                    }
                }
            }
        }
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                var tag = j + 1;
                while (array[i][j] == 0 && tag < 4) {
                    array[i][j] = array[i][tag];
                    this.maps[i * 4 + j] = array[i][j];
                    if (array[i][j] != 0) {
                        //移动动画
                        let pic: eui.Image = this.createBitmapByName("2048_number_"+array[i][j]);
                        this["picGroup"].addChild(pic);
                        pic.x = this["itemImg" + (i * 4 + tag)].$getX();
                        pic.y = this["itemImg" + (i * 4 + tag)].$getY();
                        egret.Tween.get(pic).to({ x:this["itemImg" + (i * 4 + j)].$getX()}, 40).call(()=>{
                            this["picGroup"].removeChild(pic);
                        });
                        this["itemImg" + (i * 4 + j)].source = "2048_number_" + array[i][j];
                    }
                    array[i][tag] = 0;
                    this.maps[i * 4 + tag] = 0;
                    this["itemImg" + (i * 4 + tag)].source = "lg_game_block";
                    tag++;
                }
            }
        }
        this.add8Pic();
    }
    private rightAction() {
        var array = this.arr;
        for (var i = 0; i < 4; i++) {//列循环
            for (var j = 3; j > 0; j--) {
                if (array[i][j] != 0) {
                    var tag = j - 1;
                    while (array[i][tag--] == 0 && tag >= 0) { };//往下排除 0 元素
                    if (array[i][tag + 1] == array[i][j]) {
                        //合并音效
                        SoundManager.instance.playEffect("merge_wav");
                        array[i][j] = 2 * array[i][j];
                        this.maps[i * 4 + j] = array[i][j];
                        if (array[i][j] != 0) {
                            this["itemImg" + (i * 4 + j)].source = "2048_number_" + array[i][j];
                            //碰撞动画
                            egret.Tween.get(this["itemImg" + (i * 4 + j)]).to({ scaleX: 1.1, scaleY: 1.1 }, 20, egret.Ease.backIn)
                                .to({ scaleX: 1, scaleY: 1 }, 20, egret.Ease.backIn);
                            //移动动画
                            let pic: eui.Image = this.createBitmapByName("2048_number_"+array[i][j]);
                            this["picGroup"].addChild(pic);
                            pic.x = this["itemImg" + (i * 4 + tag + 1)].$getX();
                            pic.y = this["itemImg" + (i * 4 + tag + 1)].$getY();
                            egret.Tween.get(pic).to({ x:this["itemImg" + (i * 4 + j)].$getX()}, 40).call(()=>{
                                this["picGroup"].removeChild(pic);
                            });
                        }
                        this.scorenum += array[i][j];
                        array[i][tag + 1] = 0;
                        this.maps[i * 4 + tag + 1] = 0;
                        this["itemImg" + (i * 4 + tag + 1)].source = "lg_game_block";
                    }
                }
            }
        }
        for (var i = 0; i < 4; i++) {
            for (var j = 3; j >= 0; j--) {
                var tag = j - 1;
                while (array[i][j] == 0 && tag >= 0) {
                    array[i][j] = array[i][tag];
                    this.maps[i * 4 + j] = array[i][j];
                    if (array[i][j] != 0) {
                        //移动动画
                        let pic: eui.Image = this.createBitmapByName("2048_number_"+array[i][j]);
                        this["picGroup"].addChild(pic);
                        pic.x = this["itemImg" + (i * 4 + tag)].$getX();
                        pic.y = this["itemImg" + (i * 4 + tag)].$getY();
                        egret.Tween.get(pic).to({ x:this["itemImg" + (i * 4 + j)].$getX()}, 40).call(()=>{
                            this["picGroup"].removeChild(pic);
                        });
                        this["itemImg" + (i * 4 + j)].source = "2048_number_" + array[i][j];
                    }
                    array[i][tag] = 0;
                    this.maps[i * 4 + tag] = 0;
                    this["itemImg" + (i * 4 + tag)].source = "lg_game_block";
                    tag--;
                }
            }
        }
        this.add8Pic();
    }
    private checkTop() {
        var array = this.arr;
        let tag;
        for (var j = 0; j < 4; j++) {
            for (var i = 3; i > 0; i--) {
                if (array[i][j] != 0) {
                    tag = i - 1;
                    while (tag >= 0) {
                        if (array[tag][j] == 0) {
                            // console.log("checkTop==========================当前哪个格子为空", tag * 4 + j);
                            return true;
                        }
                        tag--;
                    }
                    tag = i - 1;
                    while (tag >= 0 && array[tag][j] == 0) {
                        //用于寻找下一个非0数字
                        tag--;
                    }
                    if (array[tag][j] == array[i][j]) {
                        // console.log("checkTop==========================当前哪两个格子相等", tag * 4 + j, i * 4 + j);
                        return true;
                    }
                }
            }
        }
        return false;
    }
    private checkBottom() {
        var array = this.arr;
        let tag;
        for (var j = 0; j < 4; j++) {
            for (var i = 0; i < 3; i++) {
                if (array[i][j] != 0) {
                    tag = i + 1;
                    while (tag < 4) {
                        if (array[tag][j] == 0) {
                            // console.log("checkBottom==========================当前哪个格子为空", tag * 4 + j);
                            return true;
                        }
                        tag++;
                    }
                    //由于 相加判断只允许判断 一次 所以 必须写两个循环检查
                    tag = i + 1;
                    while (tag < 4 && array[tag][j] == 0) {
                        //用于寻找下一个非0数字
                        tag++;
                    }
                    if (array[tag][j] == array[i][j]) {
                        // console.log("checkTop==========================当前哪两个格子相等", tag * 4 + j, i * 4 + j);
                        return true;
                    }
                }
            }
        }
        return false;
    }
    private checkLeft() {
        var array = this.arr;
        for (var i = 0; i < 4; i++) {
            for (var j = 3; j > 0; j--) {
                if (array[i][j] != 0) {
                    var tag = j - 1;
                    while (tag >= 0) {
                        if (array[i][tag] == 0) {
                            // console.log("checkLeft==========================当前哪个格子为空或相等", tag * 4 + j, i * 4 + j);
                            return true;
                        }
                        tag--;
                    }
                    tag = j - 1;
                    while (tag >= 0 && array[i][tag] == 0) {
                        //用于寻找下一个非0数字
                        tag--;
                    }
                    if (array[i][tag] == array[i][j]) {
                        // console.log("checkLeft==========================当前哪两个格子相等", tag * 4 + j, i * 4 + j);
                        return true;
                    }
                }
            }
        }
        return false;
    }
    private checkRight() {
        var array = this.arr;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                if (array[i][j] != 0) {
                    var tag = j + 1;
                    while (tag < 4) {
                        if (array[i][tag] == 0) {
                            // console.log("checkRight==========================当前哪个格子为空或相等", tag * 4 + j, i * 4 + j);
                            return true;
                        }
                        tag++;
                    }
                    tag = j + 1;
                    while (tag < 4 && array[i][tag] == 0) {
                        //用于寻找下一个非0数字
                        tag++;
                    }
                    if (array[i][tag] == array[i][j]) {
                        // console.log("checkRight==========================当前哪两个格子相等", tag * 4 + j, i * 4 + j);
                        return true;
                    }
                }
            }
        }
        return false;
    }


    /**
     * 消息监听
     */
    private _initServerListen(bAdd: boolean): void {
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
    //快速加入游戏 
    protected quickJoin(gold: number = 0): void {
        this.isStart = false;
        var msg: any = {};
        msg.roomid = this._roomInfo.roomID;
        msg.clientid = server.uid;
        msg.gold = gold;
        server.send(EventNames.USER_QUICK_JOIN_REQUEST, msg);
    }
    private quickJoinResonpseHandle(e: egret.Event): void {
        var msg: any = e.data;
        console.log("快速加入游戏返回:" + msg);
        if (msg.result == 0) {
            this.per1 = 0;
            this.per2 = 0;
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
    private _onEnterTable(event: egret.Event): void {
        let data = event.data;
        console.log("=========================有人进入游戏", data.uid, data.sex, data.nickname, data.imageid);
        if(this["result"].visible == true){
            return;
        }
        if (data.uid == this._myInfo.uid) {
            this.Myseatid = data.seatid;
            this.leftDiamond = Number(data.diamond);
            this.initMyinfo(data);
        }
        else {
            this._othersUid = data.uid;
            this._setOthersInfo(data);
        }
    }
    //收到地图
    private _onAddCard(event: egret.Event): void {
        let data = event.data;
        if (data.cardids) {
            console.log("加入收到地图:" + data);
            this._resetGameInfo();
            this._init8Pic();
            this.daonum = Math.floor(data.time / 100);
            this.Prog.startTimer(this.daonum, "剩余时间：{0} s", function () { }, 1000);
            this.gameStart();
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

    private gameStart() {
        this["gameback"].visible = false;
        this["gamehelp"].visible = false;

        this["title"].text = "匹配成功";
        this["timeCount"].visible = false;
        this["large"].visible = false;
        this["big"].visible = false;
        this["small"].visible = false;

        this["MyHead1"].x = 90;
        this["tip"].visible = true;
        this["tip"].text = "率先拼出2048的人获胜";
        this["vs"].visible = true;
        this["HisHead1"].visible = true;

        this.step1Timeout = egret.setTimeout(() => {
            this["pipei"].visible = false;
            this["start"].visible = true;
            this["meng"].visible = true;
            //Ready Go
            this.step2Timeout = egret.setTimeout(() => {
                this["ready"].visible = true;
                //ReadyGo音效
                SoundManager.instance.playEffect("small_readyGo_mp3");

                this.step3Timeout = egret.setTimeout(() => {
                    this["ready"].visible = false;
                    this["go"].visible = true;
                    this.step4Timeout = egret.setTimeout(() => {
                        this["go"].visible = false;
                        this["meng"].visible = false;
                        this.Prog.visible = true;
                        this.moveDirection();
                    }, this, 1000);
                }, this, 1000);
            }, this, 1000);
        }, this, 2000);
    }
    protected sendXY(map: any): void {
        console.log("=========================发送当前地图:", map.length);
        let data = { optype: 1, params: map };
        server.send(EventNames.GAME_OPERATE_REQ, data);
    }
    private _onGameOperateRep(event: egret.Event): void {
        let data = event.data;
        console.log("=========================操作返回", data.params[0]);
        this.isComplete = false;
        //更新进度
        if (data.seatid == this.Myseatid) {
            this["score"].text = "当前得分：" + data.params[0];
            this.per1 = data.params[0];
        }
        else {
            this.per2 = data.params[0];
            if(data.params.length == 2 && data.params[1] == 1){
                this.isComplete = true;
                this["tip4"].visible = true;
                this["tip2"].visible = true;
            }
        }
        console.log("=========================per1,per2", this.per1,this.per2);
        if(this.per1 == this.per2){
            this["myScore"].width = 250;
            this["hisScore"].width = 250;
        }else{
            this["myScore"].width = this.per1 / (this.per1 + this.per2) * 500;
            this["hisScore"].width = this.per2 / (this.per1 + this.per2) * 500;
        }
        let sub = this.per1 - this.per2
        this.PlayProgress(sub);

        if (data.winsid != null) {
            this["againBtn"].source = "lg_result_btn_blue";
            this["againBtn"].touchEnabled = true;
            if (!this.scoreArr[this._myInfo.uid]) this.scoreArr[this._myInfo.uid] = {};
            if (data.winsid == -1) {
                this["Gresult"].source = "lg_result_draw";
                //平局音效
                SoundManager.instance.playEffect("small_draw_mp3");
                console.log("=========================平局");
            }
            else if (data.winsid == this.Myseatid) {
                this["Gresult"].source = "lg_result_win";
                if (!this.scoreArr[this._myInfo.uid][this._othersUid]) this.scoreArr[this._myInfo.uid][this._othersUid] = [0, 0];
                this.scoreArr[this._myInfo.uid][this._othersUid][0]++;
                //赢音效
                SoundManager.instance.playEffect("small_win_mp3");
                console.log("=========================自己赢");
            }
            else {
                this["Gresult"].source = "lg_result_lose";
                if (!this.scoreArr[this._myInfo.uid][this._othersUid]) this.scoreArr[this._myInfo.uid][this._othersUid] = [0, 0];
                this.scoreArr[this._myInfo.uid][this._othersUid][1]++;
                //输音效
                SoundManager.instance.playEffect("small_lose_mp3");
                console.log("=========================对手赢");
            }
        }
    }

    //游戏结束
    private _onGameEnd(event: egret.Event): void {
        let data = event.data;
        console.log("==============游戏结束==============", data);
        this._stopAllStep();
        this["Exit"].visible = false;
        this._GameOver(data);
    }
    //重连桌子
    private reconnectTableReq(session: any): void {
        console.log("发送重连桌子:");
        var msg: any = {};
        msg.session = session;
        msg.result = 0;
        msg.index = 0;
        server.send(EventNames.USER_RECONNECT_TABLE_REQ, msg);
    }
    private _onReconnectTableRep(event: egret.Event): void {
        var msg: any = event.data;
        console.log("返回重连桌子:", msg);
        if (msg) {
            if (msg.result == 0) {
                console.log("重连桌子成功:" + msg.result);
            }
            else {
                this.quickJoin();
            }
        }
    }
    private _onRecvTableInfo(event: egret.Event): void {
        let data = event.data;
        if (data.players.length == 2) {
            console.log("===============恢复桌子信息");
            for (var i = 0; i < data.players.length; i++) {
                if (data.players[i].uid != this._myInfo.uid) {
                    this._setOthersInfo(data.players[i]);
                    this._othersUid = data.players[i].uid
                } else {
                    this.initMyinfo(data.players[i]);
                    this.Myseatid = data.players[i].seatid;
                }
            }
        }
    }
    //重连收到地图
    private _onReconnectRep(event: egret.Event): void {
        var data: any = event.data;
        if (data.params1) {
            console.log("重连收到地图:" + data);
            if(data.params1.length != 0){
                this.ReInitPic(data.params1);
            }else{
                this._init8Pic();
            }
            
            this.daonum = Math.floor(data.time / 100);
            this["pipei"].visible = false;
            this["start"].visible = true;
            this.moveDirection();

            for (var i = 0; i < data.players.length; i++) {
                if (data.players[i].uid == this._myInfo.uid) {
                    this["score"].text = "当前得分：" + data.players[i].params[0];
                    this.per1 = data.players[i].params[0];
                }
                else {
                    this.per2 = data.players[i].params[0];
                }
            }
            //更新进度
            if(this.per1 == this.per2){
                this["myScore"].width = 250;
                this["hisScore"].width = 250;
            }else{
                this["myScore"].width = this.per1 / (this.per1 + this.per2) * 500;
                this["hisScore"].width = this.per2 / (this.per1 + this.per2) * 500;
            }
            let sub = this.per1 - this.per2;
            this.PlayProgress(sub);
            
            this.Prog.visible = true;
            this.Prog.startTimer(this.daonum, "剩余时间：{0} s", function () { }, 1000);
        }
    }
    //进度文字
    private PlayProgress(sub): void {
        if (sub > 0) {
            this["lab_11"].visible = false;
            this["lab_01"].visible = false;
            this["lab_10"].visible = true;
            this["lab_10"].text = "领先" + sub + "分";
        }
        else if (sub < 0) {
            this["lab_10"].visible = false;
            this["lab_11"].visible = false;
            this["lab_01"].visible = true;
            this["lab_01"].text = "落后" + Math.abs(sub) + "分";
        }
        else {
            this["lab_10"].visible = false;
            this["lab_01"].visible = false;
            this["lab_11"].visible = true;
        }
    }
    private _onLeaveTable(event: egret.Event): void {
        let data = event.data;
        console.log("===============有人离开房间", data.uid);
        // this["againBtn"].source = "lg_result_btn_gray";
        // this["againBtn"].touchEnabled = false;
        // this["lab1"].text = "对方已退出游戏";

        //三秒踢到大厅
        // egret.setTimeout(() => {
        //     if (this["result"].visible == true) {
        //         console.log("===============在结算界面");
        //         this.quitToLobby();
        //     }
        // }, this, 3000);
    }
    private _onAlmsResponse(event: egret.Event): void {
    }
    private _onUserInfoInGameResponse(event: egret.Event): void {
    }
    private _onGameStart(event: egret.Event): void {
        this.isStart = true;
        console.log("===============游戏开始",this._roomInfo.roomID);
        // let roominfo = GameConfig.getRoomConfigById(this._roomInfo.roomID);
        // console.log("================kickbacks",roominfo);
        // this.leftDiamond -= Number(roominfo.kickbacks);
    }
    private _onShowCard(event: egret.Event): void {
    }
    private _onReplenishFreezeGoldRep(event: egret.Event): void {
    }
    private _onGameOperateRepEx(event: egret.Event): void {
    }
    private _onUpdateGameInfo(event: egret.Event): void {
    }
    private _onAskReady(event: egret.Event): void {
    }
    private _onQuitRoomRep(event: egret.Event): void {
    }
    private reconnectTableRepHandle(e: egret.Event): void {
    }
    private _onUserInfoResponse(event: egret.Event): void {
    }
    private _onStartGameRep(event: egret.Event): void {
    }
    private _onUserOperateRep(event: egret.Event): void {
    }
}