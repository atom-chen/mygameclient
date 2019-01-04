/**
 *
 * @author 
 *
 */
class GameCWFD extends alien.SceneBase {
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
    private Myseatid: any;

    private scoreArr = {};

    //等待倒计时
    private waitnum: number = 0;
    private _wIntervalId: number;
    //游戏倒计时
    private daonum: number = 0;
    private _dIntervalId: number;
    private Prog: Progress;
    //游戏得分
    private per1: number = 0;
    private per2: number = 0;

    private step1Timeout: number;
    private step2Timeout: number;
    private step3Timeout: number;
    private step4Timeout: number;
    
    private stepNum = 0;
    private knifeStep = 0;
    private levelNum = 1;
    private _PIntervalId;
    
    private plantKnife = [];
    //设置关卡  knifeNum转动刀  waitNum等待刀  speed速度
    private levelArr =  [          
                        {"knifeNum":0, "waitKNum": 0, rota: 360, rota1: 0, "speed":5000},

                        {"knifeNum":0, "waitKNum": 6, rota: 360, rota1: 0, "speed":5000},
                        {"knifeNum":2, "waitKNum": 9, rota: 360, rota1: 0, "speed":5000},
                        {"knifeNum":1, "waitKNum": 8, rota:-360, rota1: 0, "speed":5000},
                        {"knifeNum":3, "waitKNum": 7, rota:-360, rota1: 0, "speed":5000},
                        {"knifeNum":3, "waitKNum": 8, rota: 360, rota1: 0, "speed":5000},
                        
                        {"knifeNum":4, "waitKNum": 8, rota:-360, rota1: 0, "speed":3000},
                        {"knifeNum":2, "waitKNum":10, rota: 360, rota1: 0, "speed":3000},
                        {"knifeNum":5, "waitKNum": 7, rota:-360, rota1: 0, "speed":3000},
                        {"knifeNum":1, "waitKNum": 9, rota: 360, rota1: 0, "speed":3000},
                        {"knifeNum":1, "waitKNum":12, rota:-360, rota1: 0, "speed":3000},

                        {"knifeNum":3, "waitKNum": 7, rota: 360, rota1: 0, "speed":1500},//
                        {"knifeNum":0, "waitKNum":12, rota:-360, rota1: 0, "speed":1500},//
                        {"knifeNum":2, "waitKNum":10, rota: 360, rota1: 0, "speed":1500},//
                        {"knifeNum":3, "waitKNum": 8, rota:-360, rota1: 0, "speed":1500},//
                        {"knifeNum":4, "waitKNum": 7, rota: 360, rota1: 0, "speed":1500},//
                        ];
    private knifeNum;
    private waitKNum;
    private rota;
    private rota1;
    private speed;

	private isStart: boolean;
    private leftDiamond: number = 0;

    constructor() {
        super();
        this.init();
        this._myInfo = MainLogic.instance.selfData;
    }

    private init(): void {
        this.skinName = scenes.GameCWFDSkin;
                    
		// let mcData = RES.getRes("bao_json");
		// let pngData = RES.getRes("bao_png");
		// let mcDataFactory = new egret.MovieClipDataFactory(mcData, pngData);
		// let winMc:egret.MovieClip = new egret.MovieClip(mcDataFactory.generateMovieClipData("1"));
        // winMc.x = 375;
        // winMc.y = 667;
        // this["plantGroup"].addChild(winMc);
        // winMc.gotoAndPlay(0,-1);
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
    
    private InitPic() {
        
        this.knifeNum = this.levelArr[this.levelNum].knifeNum;   //定义转动刀数量
        this.waitKNum  = this.levelArr[this.levelNum].waitKNum;    //定义等待刀数量
        this.rota     = this.levelArr[this.levelNum].rota;       //定义旋转方向
        this.rota1    = this.levelArr[this.levelNum].rota1;      //定义旋转方向
        this.speed    = this.levelArr[this.levelNum].speed;      //定义旋转速度

        //转盘上自带的刀
        for(var i=0; i<this.knifeNum; i++){
            var angle = (360 / this.knifeNum) * i;
            console.log("================InitPic===============转盘上自带的刀",angle); 
            let pic: eui.Image = this.createBitmapByName("cwfd_knife");
            this["knifeGroup"].addChild(pic);
            pic.anchorOffsetX = 20;
            pic.x = 170;
            pic.y = 170;
            pic.rotation = angle;
            this.plantKnife.push(angle);
        }
        //隐藏刀
        for(let i = 0; i<13; i++){
            this["knife" + i].visible = false;
        }
        //左下角显示刀数
        for(let i = 0; i<this.waitKNum; i++){
            this["knife" + i].visible = true;
            this["knife" + i].source = "cwfd_knife";
        }
        if(this.levelNum > 10 && this.levelNum != 14){
            egret.Tween.get(this["plantGroup"],{ loop:true}).to({rotation:this.rota},this.speed).wait(400).to({rotation:this.rota1},this.speed).wait(400);
        }else{
            egret.Tween.get(this["plantGroup"],{ loop:true}).to({rotation:this.rota},this.speed);
        }

        this.moveDirection();
        //同步关卡和刀位置
        this.sendLevel(this.levelNum, this.plantKnife);
    }

    private ThreeInSecond(TArr:any){
        if((TArr[2] - TArr[0]) <= 1000){
            return true;
        }
        return false;
    }
    private TimeArr = [];

    //重连恢复地图
    private ReInitPic(data: any) {
        this.levelNum = data[0];
        
        this.knifeNum = this.levelArr[this.levelNum].knifeNum;   //定义转动刀数量
        this.waitKNum  = this.levelArr[this.levelNum].waitKNum;    //定义等待刀数量
        this.rota     = this.levelArr[this.levelNum].rota;       //定义旋转方向
        this.rota1    = this.levelArr[this.levelNum].rota1;      //定义旋转方向
        this.speed    = this.levelArr[this.levelNum].speed;      //定义旋转速度

        data.shift();
        for(var i=0; i<data.length; i++){
            console.log("=================ReInitPic==============转盘上自带的刀",data[i]); 
            let pic: eui.Image = this.createBitmapByName("cwfd_knife");
            this["knifeGroup"].addChild(pic);
            pic.anchorOffsetX = 20;
            pic.x = 170;
            pic.y = 170;
            pic.rotation = data[i];
            this.plantKnife.push(data[i]);
        }
        this.stepNum = data.length - this.knifeNum;
        this.knifeStep = this.stepNum;

        //隐藏刀
        for(let i = 0; i<13; i++){
            this["knife" + i].visible = false;
        }
        //左下角显示刀数
        for(let i = 0; i<this.waitKNum; i++){
            this["knife" + i].visible = true;
            this["knife" + i].source = "cwfd_knife";
        }
        //飞出的刀
        for(let i = 0; i<=this.stepNum; i++){
            this["knife" + (this.waitKNum - i)].source = "cwfd_shadow";
        }
        console.log("=================ReInitPic==============",this.waitKNum,this.stepNum); 
        if(this.levelNum > 10 && this.levelNum != 14){
            egret.Tween.get(this["plantGroup"],{ loop:true}).to({rotation:this.rota},this.speed).wait(400).to({rotation:this.rota1},this.speed).wait(400);
        }else{
            egret.Tween.get(this["plantGroup"],{ loop:true}).to({rotation:this.rota},this.speed);
        }

        this.moveDirection();
    }

    //触屏事件
    private moveDirection(): void {
        //为 this["touch"] 添加touch事件
        this["touch"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGamePanelTouchTap, this);
    }
    private onGamePanelTouchTap(event: egret.TouchEvent) {
        //生成刀
        let pic: eui.Image = this.createBitmapByName("cwfd_knife");
        this["picGroup"].addChild(pic);
        pic.x = 336;
        pic.y = 639;
        //左下角刀数减少
        this.stepNum += 1;
        console.log("===================this.waitKNum , this.stepNum",this.waitKNum , this.stepNum);
        this["knife" + (this.waitKNum - this.stepNum)].source = "cwfd_shadow";
        if(this.stepNum == this.waitKNum){
            this["touch"].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGamePanelTouchTap, this);
        }
        
        //飞刀插入转盘
        let gPos = this["plantGroup"].localToGlobal(170,170);
        let lPos = this["picGroup"].globalToLocal(gPos.x,gPos.y);
        pic.anchorOffsetX = 20;
        egret.Tween.get(pic).to( {x:lPos.x, y:lPos.y}, 200 ).call(()=>{

            //1秒内3刀换方向
            // console.log("===================this.TimeArr",this.TimeArr);
            let time = egret.getTimer();
            if(this.TimeArr.length == 3){
                this.TimeArr.splice(0,1);
                this.TimeArr.push(time);
            }else{
                this.TimeArr.push(time);
            }
            if(this.ThreeInSecond(this.TimeArr)){
                egret.Tween.removeTweens(this["plantGroup"]);
                if(this["plantGroup"].rotation>0){
                    egret.Tween.get(this["plantGroup"],{ loop:true}).to({rotation:this["plantGroup"].rotation-360},this.speed);
                }else{
                    egret.Tween.get(this["plantGroup"],{ loop:true}).to({rotation:this["plantGroup"].rotation+360},this.speed);
                }
            }

            this["picGroup"].removeChild(pic);
            let rotation = this["plantGroup"].rotation;
            if(rotation <= 0){
                rotation = 360 + rotation;
            }
            let destRotation = rotation;
            this["knifeGroup"].addChild(pic);
            pic.x = 170;
            pic.y = 170;
            if(rotation != 0){
                destRotation = 0 - rotation;
            }
            pic.rotation = destRotation;
            // console.log("===============================添加刀",pic.rotation,Math.round(pic.rotation)); 
            this.plantKnife.push(Math.round(pic.rotation));
            // console.log("---------------------->",rotation,destRotation);
            //碰撞失败
            if(this.checkCrash(pic)){
                //击中刀把音效
                this.plantKnife = [];
                SoundManager.instance.playEffect("knife_hit_mp3");
                console.log("！！！===============================本关失败",this.levelNum); 
                this.levelOver();
            }else{
                //击中转盘音效
                SoundManager.instance.playEffect("knife_plant_mp3");
                //转盘抖一下
                egret.Tween.get(this["plantGroup"]).to({ scaleX: 1.05, scaleY: 1.05 }, 20, egret.Ease.backIn)
                                .to({ scaleX: 1, scaleY: 1 }, 20, egret.Ease.backIn);
                this.knifeStep += 1;
                //插入全部刀通关
                if(this.knifeStep == this.waitKNum){
                    console.log("！！！===============================本关通过",this.levelNum); 
                    this.levelNum += 1;
                    this.levelOver();
                }
            }
            //同步关卡和刀位置
            this.sendLevel(this.levelNum, this.plantKnife);
        });
    }
    
    protected sendLevel(level: any, rota: any): void {
        rota.unshift(level);
        console.log("=========================同步关卡和刀位置:", rota);
        let data = { optype: 1, params: rota };
        server.send(EventNames.GAME_OPERATE_REQ, data);
        rota.shift();
    }
    //碰撞检测
    private checkCrash(obj1:any) {
        let isHit = false;
        for(let i = 0; i<this.plantKnife.length -1; i++){
            let rota1 = this.plantKnife[i] - 11.5;
            let rota2 = this.plantKnife[i] + 11.5;
            let rota3 = obj1.rotation;
            console.log("===============================碰撞检测",i+1, rota1, rota3, rota2); 
            if(rota3 >= rota1 && rota3 <= rota2 ){
                console.log("》》》》===============================碰撞检测",i+1, rota1, rota3, rota2); 
                isHit = true;
            }
        }
        return isHit;
    }   
    //关卡结束
    private levelOver() {
        this.TimeArr = [];
        egret.Tween.removeTweens(this["plantGroup"]);
        this.plantKnife = [];
        this.stepNum = 0;
        this.knifeStep = 0;
        this["meng"].visible = true;
        egret.setTimeout(()=>{
            this["picGroup"].visible = false;
            this["plantGroup"].visible = false;
            this["levelGroup"].visible = true;
            this["level"].text = "第" + this.levelNum + "关";
            egret.setTimeout(()=>{
                this["levelGroup"].visible = false;
                this["meng"].visible = false;
                this["plantGroup"].rotation = 0;
                this["picGroup"].visible = true;
                this["plantGroup"].visible = true;
                this["score"].text = "当前关数：" + this.levelNum;
                this["myScore"].text = "第" + this.levelNum + "关";
                this["knifeGroup"].removeChildren();
                this.InitPic();
            },this,1000);
        },this,1000);
    }
    //两矩形碰撞检测 
    private hitTest(obj1:egret.DisplayObject,obj2:egret.DisplayObject) {  
        var Vector2 = function (x, y) {
            this.x = x || 0;
            this.y = y || 0;
        };
        Vector2.prototype = {
            sub: function (v) {
                return new Vector2(this.x - v.x, this.y - v.y)
            },
            dot: function (v) {
                return this.x * v.x + this.y * v.y;
            }
        };

        var OBB = function (centerPoint, width, height, rotation) {
            this.centerPoint = centerPoint;
            this.extents = [width / 2, height / 2];
            this.axes = [new Vector2(Math.cos(rotation), Math.sin(rotation)), new Vector2(-1 * Math.sin(rotation), Math.cos(rotation))];

            this._width = width;
            this._height = height;
            this._rotation = rotation;
        }
        OBB.prototype = {
            getProjectionRadius: function (axis) {
                return this.extents[0] * Math.abs(axis.dot(this.axes[0])) + this.extents[1] * Math.abs(axis.dot(this.axes[1]));
            }
        }

        var CollisionDetector = {
            detectorOBBvsOBB: function (OBB1, OBB2) {
                var nv = OBB1.centerPoint.sub(OBB2.centerPoint);
                var axisA1 = OBB1.axes[0];
                if (OBB1.getProjectionRadius(axisA1) + OBB2.getProjectionRadius(axisA1) <= Math.abs(nv.dot(axisA1))) return false;
                var axisA2 = OBB1.axes[1];
                if (OBB1.getProjectionRadius(axisA2) + OBB2.getProjectionRadius(axisA2) <= Math.abs(nv.dot(axisA2))) return false;
                var axisB1 = OBB2.axes[0];
                if (OBB1.getProjectionRadius(axisB1) + OBB2.getProjectionRadius(axisB1) <= Math.abs(nv.dot(axisB1))) return false;
                var axisB2 = OBB2.axes[1];
                if (OBB1.getProjectionRadius(axisB2) + OBB2.getProjectionRadius(axisB2) <= Math.abs(nv.dot(axisB2))) return false;
                return true;
            }
        }

        let OBB1 = new OBB(new Vector2(obj1.x,obj1.y), obj1.width,obj1.height, obj1.rotation * Math.PI / 180);
        let OBB2 = new OBB(new Vector2(obj2.x,obj2.y), obj2.width,obj2.height, obj2.rotation * Math.PI / 180);
        var r = CollisionDetector.detectorOBBvsOBB(OBB1, OBB2);
        return r;
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
        this["gameback1"]["addClickListener"](this.quitToLobby,this);
        this["gamehelp1"]["addClickListener"](this._onClickHelp,this);
        this["againBtn"]["addClickListener"](this._onClickAgain, this);
        this["changeGame"]["addClickListener"](this._onchangeGame, this);
        this["closeBtn"]["addClickListener"](this._onClickClose, this);
        this["goon"]["addClickListener"](this._onClickCancle, this);
        this["sure"]["addClickListener"](this._onClickSure, this);
        this["lab1"].touchEnabled = false;
        this["lab2"].touchEnabled = false;
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
        this._resetGameInfo();
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
    //重置游戏
    private _resetGameInfo(): void {
        this._initStepTimeout();
        this["pipei"].visible = true;
        this["start"].visible = false;
        this["result"].visible = false;
        this["help"].visible = false;
        this["Exit"].visible = false;

        this["gameback"].visible = true;
        this["gamehelp"].visible = true;

        this["score"].text = "当前关数：" + this.levelNum;
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

        this["myScore"].text = "第1关";
        this["hisScore"].text = "第1关";
        this.levelNum = 1;
        
        egret.Tween.removeTweens(this["plantGroup"]);
        this["plantGroup"].rotation = 0;
        this.plantKnife = [];
        this.stepNum = 0;
        this.knifeStep = 0;
        this["knifeGroup"].removeChildren();
    }
    //换游戏
    private _onchangeGame(): void {
        this.quitToLobby();
    }
    //关闭帮助
    private _onClickClose(): void {
        this["help"].visible = false;
    }
    //认输退出
    private _onClickSure(): void {
        let data = {optype: 2, params:[]};
        server.send(EventNames.GAME_OPERATE_REQ,data);
    }
    protected giveUpGame(status: number): void {
        var msg: any = {};
        msg.status = status;
        msg.session = 0;
        server.send(EventNames.GAME_GIVE_UP_GAME_REQ, msg);
    }
    private _onGiveUpGameRep(event: egret.Event): void {
    }
    //继续玩
    private _onClickCancle(): void {
        this["Exit"].visible = false;
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
    private quickJoinResonpseHandle(event: egret.Event): void {
        let data = event.data; 
        console.log("快速加入游戏返回:" + data);
        if(data.result == 0) {
            this._GameAni();
        }
        else if(data.result == 2) { //体力不足
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
    private _onLeaveTable(event: egret.Event): void {
    }
    //收到地图
    private _onAddCard(event: egret.Event): void {
        this.isStart = true;
        let data = event.data;
        if (data.cardids) {
            console.log("加入收到地图:" + data);
            this._resetGameInfo();
            this.daonum = Math.floor(data.time / 100) - 4;
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
        this["tip"].text = "最终闯关多的人获胜";
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
                        this.Prog.startTimer(60, "剩余时间：{0} s", function () { }, 1000);
                        this.InitPic();
                    }, this, 1000);
                }, this, 1000);
            }, this, 1000);
        }, this, 2000);
    }
    private _onGameOperateRep(event: egret.Event): void {
        let data = event.data;
        console.log("=========================操作返回", data.params[0]);
        // if(data.optype == null){
        //     return ;
        // }
        //更新进度
        if (data.seatid == this.Myseatid) {
            this["score"].text = "当前关数：" + data.params[0];
            if(data.params[0] != null){
                this["myScore"].text = "第" + data.params[0] + "关";
            }
        }
        else {
            if(data.params[0] != null){
                this["hisScore"].text = "第" + data.params[0] + "关";
            }
        }
        
        this["Gresult"].source = "lg_result_draw";
        if (data.winsid != null) {
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
        if (msg.result == 0) {
            console.log("重连桌子成功:" + msg.result);
        }
        else {
            console.log("重连桌子失败:" + msg.result);
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
            this.ReInitPic(data.params1);
            this.daonum = Math.floor(data.time / 100);
            this["pipei"].visible = false;
            this["start"].visible = true;

            for (var i = 0; i < data.players.length; i++) {
                if (data.players[i].uid == this._myInfo.uid) {
                    this["score"].text = "当前关数：" + data.players[i].params;
                    this["myScore"].text = "第" + data.players[i].params + "关";
                }else{
                    this["hisScore"].text = "第" + data.players[i].params + "关";
                }
            }

            this.Prog.startTimer(this.daonum, "剩余时间：{0} s", function () { }, 1000);
        }
    }
    private _onAlmsResponse(event: egret.Event): void {
    }
    private _onUserInfoInGameResponse(event: egret.Event): void {
    }
    private _onGameStart(event: egret.Event): void {
        this.isStart = true;
        console.log("===============游戏开始");
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
    private _onGetReadyRep(event: egret.Event): void {
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