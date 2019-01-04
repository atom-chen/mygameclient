/**
 *
 * @author 
 *
 */
class GameLLK extends alien.SceneBase {
    private session:any;
    private _roomInfo:any;
    private _myInfo:UserInfoData;
    private MyHead1: Head;
    private MyHead2: Head;
    private MyHead3: Head;
    private _othersUid: number;
    private HisHead1: Head;
    private HisHead2: Head;
    private HisHead3: Head;
    private myScore:eui.Rect;
    private hisScore:eui.Rect;
    private Myseatid:any;
    
    private arr:any;
    private scoreArr = {};
    //等待倒计时
    private waitnum: number = 0;
	private _wIntervalId:number;
    //游戏倒计时
    private daonum: number = 0;
	private _dIntervalId:number;
    
    private step1Timeout:number;
    private step2Timeout:number;
    private step3Timeout:number;
    private step4Timeout:number;

    //每个格子的信息
    private _XCInfo:any = {
        zuobiao:[]  //格子的坐标
    };
    //原始格子图片
    private _okImg:any = {
        [1]:"llk_icon1",
        [2]:"llk_icon2",
        [3]:"llk_icon3",
        [4]:"llk_icon4",
        [5]:"llk_icon5",
        [6]:"llk_icon6",
        [7]:"llk_icon7",
        [8]:"llk_icon8",
    };
    //选中格子图片
    private _pressImg:any = {
        [1]:"llk_icon_s1",
        [2]:"llk_icon_s2",
        [3]:"llk_icon_s3",
        [4]:"llk_icon_s4",
        [5]:"llk_icon_s5",
        [6]:"llk_icon_s6",
        [7]:"llk_icon_s7",
        [8]:"llk_icon_s8",
    };

	private isStart: boolean;
    private leftDiamond: number = 0;

    private myBeanNum:number = 0;
    private hisBeanNum:number = 0;

    constructor() {
        super();    
        this._myInfo = MainLogic.instance.selfData;    
        this.init();    
        this["ruleTips"].textFlow = Utils.getHtmlText("1、点击两个相同的动物进行消除\n2、两个相同的动物之间的<font color=0x4452DA>连线，最多只能拐两个弯</font>\n3、消除一次获得1积分，游戏结束后比较积分差，1积分20金豆。获取别人金豆或输金豆。");    
        this["playTips"].textFlow = Utils.getHtmlText("点击链接<font color=0x4452DA>两个相同的动物</font>");  
    }

    private init(): void {
        this.skinName = scenes.GameLLKSkin;
        this.arr = this.initArray();
    }   
    //设置个人信息
    private initMyinfo(data:any): void {
        if(data.sex == 2){
            this.MyHead1.currentState = "female";
            this.MyHead2.currentState = "female";
            this.MyHead3.currentState = "female";
        }else{
            this.MyHead1.currentState = "male";
            this.MyHead2.currentState = "male";
            this.MyHead3.currentState = "male";
        }
        console.log("=========================我的昵称",data.nickname,Base64.decode(data.nickname));
        this.MyHead1.imageId = data.imageid;
        this.MyHead1.nickName = Base64.decode(data.nickname);
        this.MyHead2.imageId = data.imageid;
        this.MyHead2.nickName = Base64.decode(data.nickname);
        this.MyHead3.imageId = data.imageid;
        this.MyHead3.nickName = Base64.decode(data.nickname);
    } 
    private _setOthersInfo(data:any): void {
        if(data.sex == 2){
            this.HisHead1.currentState = "female";
            this.HisHead2.currentState = "female";
            this.HisHead3.currentState = "female";
        }else{
            this.HisHead1.currentState = "male";
            this.HisHead2.currentState = "male";
            this.HisHead3.currentState = "male";
        }
        console.log("=========================对方昵称",data.nickname,Base64.decode(data.nickname));
        this.HisHead1.imageId = data.imageid;
        this.HisHead1.nickName = Base64.decode(data.nickname);
        this.HisHead2.imageId = data.imageid;
        this.HisHead2.nickName = Base64.decode(data.nickname);
        this.HisHead3.imageId = data.imageid;
        this.HisHead3.nickName = Base64.decode(data.nickname);
    } 
    private initArray(){
        var arrayGame = new Array();
        for(var i=0 ; i<10 ; i++){
            arrayGame[i] = new Array();
        }
        for(var i=0 ; i<10 ;i++){
            for(var j=0 ; j<7 ;j++){
                arrayGame[i][j] = 0;
            }
        }
        return arrayGame;
    }
    //初始化所有格子图片
	private _initAllpic(data:any):void{ 
        let gridX,gridY;
        for(let i=0; i<70; ++i){
            gridX = Math.floor(i / 7); 
            gridY = i % 7;
            this["itemImg" + i].source = this._okImg[data[i]];
            if(data[i] == 0){
                this._showItemImg(i,false);
            }else{
                this._showItemImg(i,true);
            }
            this["itemImg" + i]["addClickListener"](this._onClickItem.bind(this,gridX,gridY,i),this);
            //添加格子属性
            this["itemImg" + i].png = data[i];
            this.arr[gridX][gridY] = data[i];
        }
	}
    
    protected createChildren(): void {
        super.createChildren();
    }
    
    beforeShow(params:any):void {
        this._roomInfo = server.roomInfo = params.roomInfo;
        alien.SoundManager.instance.enablePlayMusic(false);
        alien.SoundManager.instance.stopMusic();
        MainLogic.instance.setScreenPortrait(750,1334);
        this._initServerListen(true);
        this._enableEvent(true);
        // console.log("======================LLK->params",params);
        if(params.data.isReconnect){           
            console.log("!!!!!!!!!!!!!!!!!!!!!!!重连加入游戏============");
            this.session = params.data.session;
            this.reconnectTableReq(params.data.session);            
        }else{
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
	private _enableEvent(bEnable:boolean):void{        
		let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
		this[_func](egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
        this["gameback"]["addClickListener"](this._onGameback,this);
        this["gamehelp"]["addClickListener"](this._onClickHelp,this);
        this["gameExit"]["addClickListener"](this._onGameExit,this);
        this["helpBtn"]["addClickListener"](this._onClickHelp,this);
        this["gameback0"]["addClickListener"](this.quitToLobby,this);
        this["gamehelp0"]["addClickListener"](this._onClickHelp,this);
        this["againBtn"]["addClickListener"](this._onClickAgain,this);
        this["changeGame"]["addClickListener"](this._onchangeGame,this);
        this["changePerson"]["addClickListener"](this._onchangePerson,this);
        this["closeBtn"]["addClickListener"](this._onClickClose,this);
        this["sure"]["addClickListener"](this._onClickSure,this);
        this["goon"]["addClickListener"](this._onClickCancle,this); 
        this["lab1"].touchEnabled = false;
        this["lab2"].touchEnabled = false;
        this["lab3"].touchEnabled = false;
        this["lab4"].touchEnabled = false;
        this["lab5"].touchEnabled = false;
        this._resetGameInfo();
	}
	//匹配倒计时
	private _GameAni():void{
        this._wIntervalId = egret.setInterval(()=>{
            this.waitnum += 1;
            this["timeCount"].text = this.waitnum + " s";
        },this,1000);
	}
	//游戏倒计时
	private _Gametime():void{
        this._dIntervalId = egret.setInterval(()=>{
            this.daonum -= 1;
            this["timeCount1"].text = "倒计时" + this.daonum + "秒";
        },this,1000);
	}
	//游戏结束
	private _GameOver(data:any):void{
        // if (!this.scoreArr[this._myInfo.uid]) this.scoreArr[this._myInfo.uid] = {};
        // if (!this.scoreArr[this._myInfo.uid]["gameNum"]) this.scoreArr[this._myInfo.uid]["gameNum"] = 0;
        // this.scoreArr[this._myInfo.uid]["gameNum"]++;
        // this["Gnum"].text = "今日已对决" + this.scoreArr[this._myInfo.uid]["gameNum"] + "场";
        // if (!this.scoreArr[this._myInfo.uid][this._othersUid]) this.scoreArr[this._myInfo.uid][this._othersUid] = [0, 0];
        // this["resultScore"].text = this.scoreArr[this._myInfo.uid][this._othersUid][0] + " : " + this.scoreArr[this._myInfo.uid][this._othersUid][1];
        
        this["pipei"].visible = false; 
        this["start"].visible = false; 
        this["result"].visible = true;
        // this["lab1"].text = "不服！再来一局"; 

        this["resultScore"].text = this.myBeanNum + " : " + this.hisBeanNum;
        let _myChangeGold = 0;
         for(var i = 0; i < 2; ++i){
            // let seat: DDZSeat = this.getSeatById(i + 1);
            // console.log("===============seat",seat);
            // if(!seat) break;
            if(this.Myseatid == (i+1)) {
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
	/**
	 * 根据座位号获取座位
	 * @param seatid
	 * @returns {Seat}
	 */
    
    private _seats: DDZSeat[] = [];
    private getSeatById(seatid: number): DDZSeat {
        let seat: DDZSeat = null;
        this._seats.some((s: DDZSeat): boolean => {
            if(s.userInfoData && s.userInfoData.seatid == seatid) {
                seat = s;
                return true;
            }
        });
        return seat;
    }
    //加入舞台
	private _onAddToStage():void{
	}
	//从场景移除
	private _onRemovedToStage():void{
		this._enableEvent(false);
	}
    //创建图片
    private createBitmapByName(name: string): eui.Image {
        let result = new eui.Image();
        result.source = name;
        return result;
    }
    //退出游戏,返回大厅
    private _onGameback():void{
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
    private quitToLobby():void{        
        MainLogic.backToRoomScene({toSmall:true});
        this._resetGameInfo();
    }
    //退出游戏，提示确认
    private _onGameExit():void{
        this["Exit"].visible = true;
    }
    //帮助
    private _onClickHelp():void{
        this["help"].visible = true;
    }
    //再玩一次
    private _onClickAgain():void{
        // let dimond = this.leftDiamond;
        // let roomCfg = GameConfig.getRoomConfigById(this._roomInfo.roomID);
        // if (roomCfg.minScore > dimond) {
        //     console.log("=================客户端提示体力不足",dimond,roomCfg.minScore);
        //     this.quitToLobby();
        //     PanelAlert4.instance.show("您可以通过以下方式获取", 1, function (act) {
        //         if (act == "confirm") {
        //             alien.SceneManager.show(SceneNames.LOBBY, { pageType: PanelLobby.T_GAME_SHOP, data: { type: PageShop.T_GOLD } }, alien.sceneEffect.Fade, null, null, false, SceneNames.LOADING);
        //         } else {
        //             alien.SceneManager.show(SceneNames.LOBBY, { pageType: PanelLobby.T_GAME_KF }, alien.sceneEffect.Fade, null, null, false, SceneNames.LOADING);
        //         }
        //     });
        // }
        // else { 
        // }
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
        if(data.result == 0) {//准备成功
            // if(data.seatid == this.Myseatid){
            //     this["lab1"].text = "等待对方准备"
            // }
            // else{
            //     this["lab1"].text = "对方已准备，马上再战"
            // }
        }
    }
    //重置游戏
    private _resetGameInfo():void{
        this._initStepTimeout();
        this["pipei"].visible = true;
        this["start"].visible = false;
        this["result"].visible = false;
        this["help"].visible = false;
        this["Exit"].visible = false;

        this["gameback"].visible = true;
        this["gamehelp"].visible = true;
        
        this["large"].visible = true;
        this["big"].visible = true; 
        this["small"].visible = true;
        this["title"].text = "正在匹配中";
        this["MyHead1"].x = 290;
        this["vs"].visible = false;
        this["HisHead1"].visible = false
        this["tip"].text = "两个图案之间的连线不能超过2个弯";
        this["timeCount"].visible = true; 
        this._XCInfo = {
            zuobiao:[] //格子的坐标
        };
        //清除等待倒计时
        egret.clearInterval(this._wIntervalId);
        this.waitnum = 0;
        this["timeCount"].text = this.waitnum + " s";
        //清除游戏倒计时
        egret.clearInterval(this._dIntervalId);
        this.daonum = 60;
        this["timeCount1"].text = "倒计时" + this.daonum + "秒";
        this["myScore"].width = 0;
        this["hisScore"].width = 0;
        this.myBeanNum = 0;
        this.hisBeanNum = 0;

        // this["lab1"].text == "不服！再来一局"
        // this["againBtn"].source = "lg_result_btn_blue";
        // this["againBtn"].touchEnabled = true;

        this["lab2"].text = "换个游戏";
    }
    //换游戏
    private _onchangeGame():void{
        this.quitToLobby();
    }
    //换人
    private _onchangePerson():void{
        this._resetGameInfo();
        egret.setTimeout(() => {
            this.quickJoin();
        }, this, 500);     
    }
    //关闭帮助
    private _onClickClose():void{
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
    private _onClickCancle():void{
		this["Exit"].visible = false;
    }
    //70个格子的点击
    private _onClickItem(gridX:number,gridY:number,idx:number):void{
        //点击音效
        alien.SoundManager.instance.playEffect("link_click_mp3");

        //搜集选中坐标
        this._XCInfo.zuobiao.push(gridX);
        this._XCInfo.zuobiao.push(gridY);
        this._XCInfo.zuobiao.push(this["itemImg" + idx].png);
        let src = this._okImg[this["itemImg" + idx].png];
        
        //选中状态，更换显示图片
        if (this._XCInfo.zuobiao.length == 3) {
            src = this._pressImg[this["itemImg" + idx].png];
        }
        this["itemImg" + idx].source = src;
        this["itemImg" + idx].scaleX = 0.54;
        this["itemImg" + idx].scaleY = 0.54;
        this._showItemImg(idx, true);
        //两个坐标点触发寻路判定
        if(this._XCInfo.zuobiao.length == 6){
            let num1 = this._XCInfo.zuobiao[0];
            let num2 = this._XCInfo.zuobiao[1];
            let num3 = this._XCInfo.zuobiao[2];
            let num4 = this._XCInfo.zuobiao[3];
            let num5 = this._XCInfo.zuobiao[4];
            let num6 = this._XCInfo.zuobiao[5];
            this._lookForRole({x:num1, y:num2, png:num3, isvi:true},{x:num4, y:num5, png:num6, isvi:true});
        }
    } 
    //70个格子的点击
    private _enableItemsTouch(bEnable:boolean):void{
        this["picGroup"].touchChildren = bEnable;
    }
    // 显示某个格子
    private _showItemImg(idx:number,bShow:boolean):void{
        this["itemImg" + idx].visible = bShow;
        this["itemImg" + idx].isvi = bShow;
    }
    //使能某个格子可以点击
    private _enableItemImgTouch(idx:number,bEnable:boolean):void{
        this["itemImg" + idx].touchEnabled = bEnable;
    }

    
    /**
     * 两点之间寻路问题
     */
    //全局变量  
    private X = 10; //总列数
    private Y = 7;//总行数 
    
    private getPath(p1:any,p2:any){  
        let state;
        //开始搜索前对p1,p2排序，使p2尽可能的在p1的右下方,这样做可以简化算法  
        if(p1.x>p2.x){  
            var t = p1;   
            p1 = p2;  
            p2 = t;   
        }  
        else if(p1.x==p2.x){  
            if(p1.y>p2.y){  
                var t = p1;   
                p1 = p2;  
                p2 = t;   
            }  
        }  
        if(this.equal(p1,p2)){
            return null;
        }   
        //第一种类型， 两点是否在一条直线上，而且两点之间可直线连通  
        if( (this.onlineY(p1, p2) || this.onlineX(p1, p2))  && this.hasLine(p1, p2)){
            state = "第一种";
            return [p1,p2];  
        }  
        //第二种类型， 如果两点中任何一个点被全包围，则不通  
        if( this.isEmpty({x:p1.x, y:p1.y+1}) && this.isEmpty({x:p1.x, y:p1.y-1}) && this.isEmpty({x:p1.x-1, y:p1.y}) && this.isEmpty({x:p1.x+1, y:p1.y}) ){  
            return null;  
        } 
        if( this.isEmpty({x:p2.x, y:p2.y+1}) && this.isEmpty({x:p2.x, y:p2.y-1}) && this.isEmpty({x:p2.x-1, y:p2.y}) && this.isEmpty({x:p2.x+1, y:p2.y}) ){ 
            return null;  
        }
        //第三种类型， 两点在一条直线上，但是不能直线连接  
        var pt0, pt1, pt2, pt3;  
        //如果都在x轴，则自左至右扫描可能的路径，  
        //每次构造4个顶点pt0, pt1, pt2, pt3，然后看他们两两之间是否连通  
        if(this.onlineX(p1, p2)){  
            for(var i=0; i<this.Y; i++){  
                if(i==p1.y){  
                    continue;  
                }  
                pt0 = p1;  
                pt1 = {x: p1.x, y: i};  
                pt2 = {x: p2.x, y: i};  
                pt3 = p2;  
                //如果顶点不为空，则该路不通。  
                if(this.isEmpty(pt1) || this.isEmpty(pt2)){  
                    continue;  
                }  
                if( this.hasLine(pt0, pt1) && this.hasLine(pt1, pt2) && this.hasLine(pt2, pt3) ){ 
                    state = "第三种X"; 
                    return [pt0, pt1, pt2, pt3];  
                }  
            }  
        }  
        //如果都在y轴，则自上至下扫描可能的路径，  
        //每次构造4个顶点pt0, pt1, pt2, pt3，然后看他们两两之间是否连通  
        if(this.onlineY(p1, p2)){  
            for(var j=0; j<this.X; j++){  
                if(j==p1.x){  
                    continue;     
                }  
                pt0 = p1;  
                pt1 = {x:j, y:p1.y};  
                pt2 = {x:j, y:p2.y};  
                pt3 = p2;  
                //如果顶点不为空，则该路不通。  
                if(this.isEmpty(pt1) || this.isEmpty(pt2)){  
                    continue;  
                }  
                if( this.hasLine(pt0, pt1) && this.hasLine(pt1, pt2) && this.hasLine(pt2, pt3) ){   
                    state = "第三种Y";
                    return [pt0, pt1, pt2, pt3];  
                }  
            }  
        }  

        //第四种类型， 两点不在一条直线上。  
        //先纵向扫描可能的路径  
        //同样，每次构造4个顶点，看是否可通  
        for(var k=0; k<this.Y; k++){  
                pt0 = p1;  
                pt1 = {x:p1.x, y:k};  
                pt2 = {x:p2.x, y:k};  
                pt3 = p2;  
                //特殊情况，如果pt0和pt1重合   
                if(this.equal(pt0,pt1)){  
                    //如果pt2不为空，则此路不通  
                    if(this.isEmpty(pt2)){ 
                        continue;  
                    }  
                    if( this.hasLine(pt1, pt2) && this.hasLine(pt2, pt3) ){  
                        state = "第四种X1";
                        return [pt1, pt2, pt3];  
                    }  
                    else{  
                        continue;  
                    }  
                }  
                //特殊情况，如果pt2和pt3重合  
                else if(this.equal(pt2,pt3)){  
                    // 如果pt1不为空，则此路不通  
                    if(this.isEmpty(pt1)){  
                        continue;  
                    } 
                    if( this.hasLine(pt0, pt1) && this.hasLine(pt1, pt2) ){ 
                        state = "第四种X2"; 
                        return [pt0, pt1, pt2];  
                    }  
                    else{  
                        continue;  
                    }  
                }  
                //如果pt1, pt2都不为空,则不通  
                if(this.isEmpty(pt1) || this.isEmpty(pt2)){   
                    continue;  
                }  
                else{
                }
                if( this.hasLine(pt0, pt1) && this.hasLine(pt1, pt2) && this.hasLine(pt2, pt3) ){  
                    state = "第四种X3";
                    return [pt0, pt1, pt2, pt3];  
                }  
        }  
        //横向扫描可能的路径  
        for(var k=0; k<this.X; k++){  
                pt0 = p1;  
                pt1 = {x:k, y:p1.y};  
                pt2 = {x:k, y:p2.y};  
                pt3 = p2;    
                if(this.equal(pt0,pt1)){  
                    if(this.isEmpty(pt2)){  
                        continue;  
                    }  
                    if( this.hasLine(pt1, pt2) && this.hasLine(pt2, pt3) ){ 
                        state = "第四种Y1"; 
                        return [pt1, pt2, pt3];  
                    }  
                }  
                if(this.equal(pt2,pt3)){  
                    if(this.isEmpty(pt1)){  
                        continue;  
                    }  
                    if( this.hasLine(pt0, pt1) && this.hasLine(pt1, pt2) ){ 
                        state = "第四种Y2"; 
                        return [pt0, pt1, pt2];  
                    }  
                }  
                if(this.isEmpty(pt1) || this.isEmpty(pt2)){   
                    continue;  
                }  
                if( this.hasLine(pt0, pt1) && this.hasLine(pt1, pt2) && this.hasLine(pt2, pt3) ){  
                    state = "第四种Y3";
                    return [pt0, pt1, pt2, pt3];  
                }  
        }
        return null;  
    }  
    private equal(p1:any,p2:any){
        return ((p1.x==p2.x)&&(p1.y==p2.y));  
    }  
    private onlineX(p1:any,p2:any){  
        return p1.y==p2.y;  
    }  
    private onlineY(p1:any,p2:any){  
        return p1.x==p2.x;    
    }  
    private isEmpty(p:any){   
        let idx1 = p.x* 7 + p.y;
        if(idx1 < 0 || idx1 >= 70){
            return true
        }else{
            return  this["itemImg" + idx1].isvi;
        }
    }  
    
    private hasLine(p1:any,p2:any){   
        if(p1.x==p2.x && p1.y==p2.y){  
            return true;      
        } 
        if(p1.x==p2.x){  
            var i = p1.y>p2.y?p2.y:p1.y;  
            i = i+1;  
            var max = p1.y>p2.y?p1.y:p2.y;  
            for(; i<max; i++){  
                var p = {x: p1.x, y: i};  
                let id = p1.x*7+i;
                if(this.isEmpty(p)){  
                    break  
                }  
            }  
            if(i==max){  
                return true;  
            }  
            return false;  
        }  
        else if(p1.y==p2.y){  
            var j = p1.x>p2.x?p2.x:p1.x;  
            j = j+1;  
            var max = p1.x>p2.x?p1.x:p2.x;  
            for(; j<max; j++){  
                var p = {x: j, y: p1.y}; 
                let id = p1.x*7+i;
                if(this.isEmpty(p)){  
                    break  
                }  
            }  
            if(j==max){  
                return true;  
            }  
            return false;  
        }  
    } 
    private Displayline(path: any) {
        let idx1 = path[0].x * 7 + path[0].y;
        let idx2 = path[1].x * 7 + path[1].y;
        let pts1 = this.localToGlobal(this["itemImg" + idx1].x, this["itemImg" + idx1].y);
        let pts2 = this.localToGlobal(this["itemImg" + idx2].x, this["itemImg" + idx2].y);
        if (path.length == 2) {
            if (path[0].x == path[1].x) {
                let line = new DrawLineUtils().drawLines([pts1, pts2]);
                this.addChild(line);
                egret.setTimeout(() => {
                    this.removeChild(line);
                }, this, 100);
            }
            else if (path[0].y == path[1].y) {
                let line = new DrawLineUtils().drawLines([pts1, pts2]);
                this.addChild(line);
                egret.setTimeout(() => {
                    this.removeChild(line);
                }, this, 100);
            }            
        }
        if (path.length == 3) {
            let idx3 = path[2].x * 7 + path[2].y;
            let pts3 = this.localToGlobal(this["itemImg" + idx3].x, this["itemImg" + idx3].y);
            let line = new DrawLineUtils().drawLines([pts1, pts2, pts3]);            
            this.addChild(line);
            egret.setTimeout(() => {
                this.removeChild(line);
            }, this, 100);            
        }
        if (path.length == 4) {
            let idx3 = path[2].x * 7 + path[2].y;
            let idx4 = path[3].x * 7 + path[3].y;
            let pts3 = this.localToGlobal(this["itemImg" + idx3].x, this["itemImg" + idx3].y);
            let pts4 = this.localToGlobal(this["itemImg" + idx4].x, this["itemImg" + idx4].y);
            let line = new DrawLineUtils().drawLines([pts1, pts2, pts3, pts4]);            
            this.addChild(line);
            egret.setTimeout(() => {
                this.removeChild(line);
            }, this, 100);            
        }
    }
    private _isSamePoint(p1: any, p2: any): boolean {
        if (p1.png == p2.png && p1.x == p2.x && p1.y == p2.y) {
            this._XCInfo.zuobiao = []              
            //取消1
            let idx1 = p1.x * 7 + p1.y;
            this["itemImg" + idx1].source = this._okImg[p1.png];
            return true;
        }
        return false
    }
    private _lookForRole(p1:any,p2:any):void{
        console.log("=========================================图片",p1.png,p2.png);
        if(this._isSamePoint(p1, p2)) return ;
        if(p1.png == p2.png){//图片相同，做寻路
            var path = this.getPath(p1, p2);  
            if(path!=null){  
                let idx1 = p1.x* 7 + p1.y;
                let idx2 = p2.x* 7 + p2.y ;
                console.log("=========================================寻路算法完成",p1.x,p1.y,p2.x,p2.y,path);
                this.Displayline(path);
                this._showItemImg(idx1,false);
                this._showItemImg(idx2,false);
                this.arr[p1.x][p1.y] = 0;
                this.arr[p2.x][p2.y] = 0;
                //消除成功音效
                alien.SoundManager.instance.playEffect("link_win_mp3");

                //发送p1,p2
                this.sendXY(p1,p2);

                //重置坐标搜集器
                this._XCInfo.zuobiao = []; 
            }
            else{     
                //消除失败音效
                alien.SoundManager.instance.playEffect("link_fail_mp3");

                //重置坐标搜集器                
                this._XCInfo.zuobiao.splice(0, 3)//删除前3元素                
                //取消1
                let idx1 = p1.x * 7 + p1.y;
                this["itemImg" + idx1].source = this._okImg[p1.png];
                //选中2
                let idx2 = p2.x * 7 + p2.y;
                this["itemImg" + idx2].source = this._pressImg[p2.png];  
            }
        }
        else{//图片不同，取消1，选中2
            this._XCInfo.zuobiao.splice(0,3)//删除指定下标元素
            //取消1
            let idx1 = p1.x* 7 + p1.y;
            this["itemImg" + idx1].source = this._okImg[p1.png];
            //选中2
            let idx2 = p2.x * 7 + p2.y;
            this["itemImg" + idx2].source = this._pressImg[p2.png];
        }
    } 

    private _shuffle(arr) {
        var input = arr;
        for (var i = input.length - 1; i >= 0; i--) {
            var randomIndex = Math.floor(Math.random() * (i + 1));
            var itemAtIndex = input[randomIndex];
            input[randomIndex] = input[i];
            input[i] = itemAtIndex;
        }
        return input;
    }
    
    /**
     * 消息监听
     */
    private _initServerListen(bAdd:boolean):void{
        let func = "addEventListener";
        if(!bAdd){
            func = "removeEventListener";
        }
        server[func](EventNames.USER_RECONNECT_TABLE_REP,this._onReconnectTableRep,this);
        server[func](EventNames.USER_ALMS_REP,this._onAlmsResponse,this);
        server[func](EventNames.GAME_GIVE_UP_GAME_REP,this._onGiveUpGameRep,this);
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
        server[func](EventNames.USER_QUICK_JOIN_RESPONSE,this.quickJoinResonpseHandle,this);
        server[func](EventNames.USER_USER_INFO_RESPONSE,this._onUserInfoResponse,this);
        server[func](EventNames.START_PGAME_REP,this._onStartGameRep,this);
        server[func](EventNames.USER_OPERATE_REP,this._onUserOperateRep,this);

    }
    //快速加入游戏 
    protected quickJoin(gold: number = 0): void {
        this.isStart = false;
        var msg: any = {};
        msg.roomid = this._roomInfo.roomID;
        msg.clientid = server.uid;
        msg.gold = gold;
        server.send(EventNames.USER_QUICK_JOIN_REQUEST,msg);
    }
    private quickJoinResonpseHandle(e: egret.Event): void {
        var msg: any = e.data;
        console.log("快速加入游戏返回:" + msg);
        if(msg.result == 0) {
            this._GameAni();
        }
        else if(msg.result == 2) { //体力不足
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
        console.log("=========================有人进入游戏",data.uid,data.seatid,);
        if(this["result"].visible == true){
            return;
        }
        if(data.uid == this._myInfo.uid){
            this.Myseatid = data.seatid;
            this.leftDiamond = Number(data.diamond);
            console.log("=========================我的座位号",this.Myseatid);
            this.initMyinfo(data);
        }
        else{
            this._othersUid = data.uid;
            this._setOthersInfo(data);
        }
    }
    //收到地图
    private _onAddCard(event: egret.Event): void {
        let data = event.data;
        if(data.cardids){
            console.log("加入收到地图:" + data.cardids);
            this._resetGameInfo();
            this._initAllpic(data.cardids);
            this.daonum = Math.floor(data.time/100)-4;
            this.gameStart();
        }
    }

    private changeOne(data:any){
        var arrayGame = new Array();
        for(var i=0 ; i<10 ;i++){
            for(var j=0 ; j<7 ;j++){
                arrayGame[i*7+j] = data[i][j];
            }
        }
        return arrayGame;
    }
    private changeTwo(data:any){
        var arrayGame = this.initArray();
        for(var i=0 ; i<70 ;i++){
            let x = Math.floor(i / 7);
            let y = i % 7;
            arrayGame[x][y] = data[i];
        }
        return arrayGame;
    }
    //检测死锁自动刷新
    private checkRefresh(){
        var array = this.arr;
        for(var i=0 ; i <10 ;i++){//列循环X坐标
            for(var j=0 ; j<7 ;j++){
                if(array[i][j] != 0){
                    for(var m=0 ; m <10 ;m++){
                        for(var n=0 ; n<7 ;n++){
                            if(array[i][j] == array[m][n]){
                                var path = this.getPath({x:i, y:j, png:array[i][j]},{x:m, y:n, png:array[m][n]});
                                if(path!=null){  
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
         return false;
    } 
    private _initStepTimeout():void{
        this.step1Timeout = 0;
        this.step2Timeout = 0;
        this.step3Timeout = 0;
        this.step4Timeout = 0;
    }

    private _stopAllStep():void{
        if(this.step1Timeout){
            egret.clearTimeout(this.step1Timeout);
        }
        if(this.step2Timeout){
            egret.clearTimeout(this.step2Timeout);
        }
        if(this.step3Timeout){
            egret.clearTimeout(this.step3Timeout);
        }
        if(this.step4Timeout){
            egret.clearTimeout(this.step4Timeout);
        }
        this._initStepTimeout();
    }

    private gameStart(){ 

        this["gameback"].visible = false;
        this["gamehelp"].visible = false; 

        this["title"].text = "匹配成功";
        this["timeCount"].visible = false; 
        this["large"].visible = false;
        this["big"].visible = false; 
        this["small"].visible = false;
        this["MyHead1"].x = 90;
        this["tip"].text = "先将全部图案消除的人获胜";
        this["vs"].visible = true;
        this["HisHead1"].visible = true;

        this.step1Timeout = egret.setTimeout(()=>{
            this["pipei"].visible = false;
            this["start"].visible = true;
            this["meng"].visible = true;
            //Ready Go
            this.step2Timeout = egret.setTimeout(()=>{
                this["ready"].visible = true;
                //ReadyGo音效
                alien.SoundManager.instance.playEffect("small_readyGo_mp3");

                this.step3Timeout =  egret.setTimeout(()=>{
                    this["ready"].visible = false;
                    this["go"].visible = true;
                    this.step4Timeout = egret.setTimeout(()=>{
                        this["go"].visible = false;
                        this["meng"].visible = false;
                        // this._Gametime();
                    },this,1000); 
                },this,1000); 
            },this,1000);
        },this,2000); 
    }
    protected sendXY(p1:any,p2:any): void {
        console.log("发送已经消除的坐标:");
        let data = {optype: 1, params:[p1.x+1,p1.y+1,p2.x+1,p2.y+1]};
        server.send(EventNames.GAME_OPERATE_REQ,data);
    }
    private _onGameOperateRep(event: egret.Event): void {
        let data = event.data;
        if(data.optype == 2){
            console.log("===================================================重置地图",data.params);
            this._initAllpic(data.params);
        }
        // console.log("=========================操作返回",data.params[0]);
        //更新进度
        if(data.seatid == this.Myseatid){
            // console.log("=========================自己进度");
            this["myScore"].width = data.params[0]/70 * 260;
            if(data.params[0] != null){
                this.myBeanNum = data.params[0]/2;
            }
        }
        else{
            // console.log("=========================对手进度");
            this["hisScore"].width = data.params[0]/70 * 260;
            if(data.params[0] != null){
                this.hisBeanNum = data.params[0]/2;
            }
        }
        if(data.winsid != null){
            this["againBtn"].source = "lg_result_btn_blue";
            this["againBtn"].touchEnabled = true;
            if (!this.scoreArr[this._myInfo.uid]) this.scoreArr[this._myInfo.uid] = {};
            if(data.winsid == -1){
                this["Gresult"].source = "lg_result_draw"; 
                //平局音效
                alien.SoundManager.instance.playEffect("small_draw_mp3");
                console.log("=========================平局");
            }
            else if(data.winsid == this.Myseatid){
                if (!this.scoreArr[this._myInfo.uid][this._othersUid]) this.scoreArr[this._myInfo.uid][this._othersUid] = [0, 0];
                this.scoreArr[this._myInfo.uid][this._othersUid][0]++;
                this["Gresult"].source = "lg_result_win"; 
                //赢音效
                alien.SoundManager.instance.playEffect("small_win_mp3");
                console.log("=========================自己赢");
            }
            else{
                if (!this.scoreArr[this._myInfo.uid][this._othersUid]) this.scoreArr[this._myInfo.uid][this._othersUid] = [0, 0];
                this.scoreArr[this._myInfo.uid][this._othersUid][1]++;
                this["Gresult"].source = "lg_result_lose"; 
                //输音效
                alien.SoundManager.instance.playEffect("small_lose_mp3");
                console.log("=========================对手赢");
            }
        }
    }

    //游戏结束
    private _onGameEnd(event: egret.Event): void {
        let data = event.data;
        console.log("==============游戏结束==============",data);
        this._stopAllStep();
        this["Exit"].visible = false; 
        this._GameOver(data);
    }

    //重连桌子
    private reconnectTableReq(session:any): void {
        console.log("发送重连桌子:");
        var msg: any = {};
        msg.session = session;
        msg.result = 0;
        msg.index = 0;
        server.send(EventNames.USER_RECONNECT_TABLE_REQ,msg);
    }
    private _onReconnectTableRep(event: egret.Event): void {
        var msg: any = event.data;
        console.log("返回重连桌子:",msg);
        if(msg) {
            if(msg.result == 0) {
                console.log("重连桌子成功:" + msg.result);
            }
            else {
                this.quickJoin();
            }
        }
    }
    private _onRecvTableInfo(event:egret.Event):void{
        let data = event.data;
        if(data.players.length == 2){
            console.log("===============恢复桌子信息",data);
            for (var i = 0; i < data.players.length; i++) {
                if (data.players[i].uid != this._myInfo.uid) {
                    this._setOthersInfo(data.players[i]);
                    this._othersUid = data.players[i].uid
                }else{
                    this.initMyinfo(data.players[i]);
                    this.Myseatid = data.players[i].seatid
                }
            }
        }
    }
    //重连收到地图
    private _onReconnectRep(event: egret.Event): void {
        var msg: any = event.data;
        //更新进度
        for(let i=0; i<msg.players.length; i++){
            if(msg.players[i].seatid == this.Myseatid){
                this["myScore"].width = msg.players[i].params[0]/70 * 260;
                this.myBeanNum = msg.players[i].params[0]/2;
            }
            else{
                this["hisScore"].width = msg.players[i].params[0]/70 * 260;
                this.hisBeanNum = msg.players[i].params[0]/2;
            }
        }
        if(msg.params1){
            console.log("重连收到地图:" + msg);
            this._initAllpic(msg.params1);
            this.daonum = Math.floor(msg.time/100);
            this["pipei"].visible = false;
            this["start"].visible = true;
        }
    }
    private _onLeaveTable(event: egret.Event): void { 
        let data = event.data;
        console.log("===============有人离开房间",data.uid);
        // this["againBtn"].source = "lg_result_btn_gray";
        // this["againBtn"].touchEnabled = false;
        // this["lab1"].text = "对方已退出游戏"; 

        //三秒踢到大厅
        // let countDown = 3;
        // var leaveTableTimer: egret.Timer = new egret.Timer(1000, 4);
        // leaveTableTimer.addEventListener(egret.TimerEvent.TIMER, () => {
        //     this["lab2"].text = "换个游戏(" + countDown + ")";
        //     countDown--;
        //     if (countDown < 0) countDown = 0;
        // }, this);
        // leaveTableTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
        //     leaveTableTimer = null;
        //     if (this["result"].visible == true) {
        //         this.quitToLobby();
        //     }
        // }, this);
        // leaveTableTimer.start();
        
    }
    private _onAlmsResponse(event: egret.Event): void {
    }
    private _onUserInfoInGameResponse(event: egret.Event): void {
    }
    private _onGameStart(event: egret.Event): void {
        // let roominfo = GameConfig.getRoomConfigById(this._roomInfo.roomID);
        // this.leftDiamond -= Number(roominfo.kickbacks);
        this.isStart = true;
        console.log("===============游戏开始");
    }
    private _onShowCard(event: egret.Event): void {
    }
    private _onReplenishFreezeGoldRep(event:egret.Event):void{ 
    }
    private _onGameOperateRepEx(event:egret.Event):void{
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