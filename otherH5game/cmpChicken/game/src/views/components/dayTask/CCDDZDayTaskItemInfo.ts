/**
 * zhu 2017/08/30
 * 每日任务中的单条任务ItemRender
 */
class CCDDZDayTaskItemInfo extends eui.Component {
    /**
     * 任务描述
     */
	private mTaskDesc_label:eui.Label;

    /**
     * 任务说明后的括号内容
     */
    private mTaskDesc1_label:eui.Label;

     /**
     * 奖励0的图片（计牌器等）
     */
	private mReward0_img:eui.Image;
    
     /**
     * 奖励0数量的文本
     */
	private mReward0Num_label:eui.Label;
    
    /**
     * 奖励1的图片（计牌器等）
     */
	private mReward1_img:eui.Image;
    
    /**
     * 奖励1数量的文本
     */
	private mReward1Num_label:eui.Label;
    
    /**
     * 任务进度的背景
     */
	private mProBg_img:eui.Image;
    /**
     * 任务进度的img(类似progressBar 功能)
     */
	private mPro_img:eui.Image;
    /**
     * 进度文本
     */
	private mPro_label:eui.Label;

    /**
     * 做任务 按钮
     */
    private mDoTask_btn:CCDDZButtonDoTaskSkin;

    /**
     * 任务信息的group
     */
    private info_group:eui.Group;
    
    /**
     * 任务的标题(每日任务，每周任务)
     */
    private mTaskTit_img:eui.Image;

    /**
     * 高级红包的标识 
     */
    private mReward0High_img:eui.Image;

    /**
     * 任务的各个状态的按钮初始化函数
     */
    private _tStatusFunc:{};

    /**
     * 最小进度(由于进度条两端带高光,所有有最小的进度（0.xx）)
     */
    private _fMinPro:number;

    /**
     * 进度条的最小宽度(由于进度条两端带高光,所有有最小的宽度)
     */
    private _nMinWidth:number;

    private _data:any;

	constructor() {
		super();
		this._enableEvent(true);
    }

    /**
     * 使能事件
     */
    private _enableEvent(bEnable:boolean):void{
        let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
        this[_func](egret.Event.REMOVED_FROM_STAGE,this._onRemoveFromStage,this);		
        this[_func](egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
    }
	/**
	 * 	加入舞台
	 */
	private _onAddToStage():void{
        ccserver.addEventListener(CCGlobalEventNames.USER_GET_TASKREW_REP,this._onRecvGetRewRep,this);
	}
    /**
     * 移除舞台
     */
    private _onRemoveFromStage(){
        this._enableEvent(false);
    }

    /**
     * 数据变化
     */
    protected setData(_data:any): void {
        this._data = _data;
        if(this._data) {
            this._initByData();
        }
    }

    public updateInfo(data:any):void{
        this._data = data;
        this._initByData();
    }

    /**
     * 初始化单条任务的数据
     */
    private _initByData():void{
        this.info_group.visible = true;
        this._tStatusFunc = {
            /**
             * 未完成
             */
            ["0"]: this._onNotOverBtn.bind(this),
            /**
             * 已完成，未领取奖励
             */
            ["1"]: this._onHasOverBtn.bind(this),
            /**
             * 已领取奖励
             */
            ["2"]: this._onHasGetRewardBtn.bind(this),
        }
        if(this._data.total <=0){
            this._data.total = 1;
        }
        let _data = this._data;
        if(_data.rew && (_data.rew.length ==1) || (_data.rew.length ==2)){
            let _nPro = _data.num;
            if(_nPro > _data.total){
                _nPro = _data.total;
            }

            if(_data.rew.length == 1){
                this.currentState = "one";
            }else {
                this.currentState = "two";
            }
            this.validateNow();
            this._nMinWidth = this.mPro_img.texture.textureWidth;
            this._fMinPro = this._nMinWidth/this.mProBg_img.width;
            this._initRewPng(_data.rew);
            this._initProgress(_nPro,_data.total);
            this._initTaskDesc(_data.taskDesc1);
            this._initRewSucc();
            this._initDescExt(_data.taskDesc2);
            this._initBtnAndFunc(_data.status);
            //console.log("_initByData===============>",_data.rewDesc);
        }
    }

    /**
     * 领取任务成功的提示
     */
    private _initRewSucc():void{
        let _tItem ={
            [0]:"金豆x{0}",
            [41003]:"奖杯x{0}个",
            [2]:"记牌器x{0}小时",
            [1]:"奖杯x{0}",
            [3]:"钻石x{0}"
        }
        let _id1  = this._data.rew[0].id;
        let _num1 = this._data.rew[0].num;
        let _desc1 = _tItem[_id1];
        if(this.currentState == "two"){
            let _id2  = this._data.rew[1].id;
            let _num2 = this._data.rew[1].num;
            let _desc2 = _tItem[_id2];
            let _info = "" ;
            if(_num1 != 0){
                _info = "\n1." + _desc1.replace("{0}",_num1) +"  2." + _desc2.replace("{0}",_num2);
            }else{
                _info = "" + _desc2.replace("{0}",_num2);
            }
            this._data.rewDesc = _info;
        }else{
            this._data.rewDesc = "" + _desc1.replace("{0}",_num1);
        }
        
    }
    /**
     * 初始化奖励0的图标和数量
     */
    private _initRew0ByIdAndNum(id:number,num:number){
        if(id == 41003){ //高级红包次数
            this.mReward0High_img.visible = true;
            this.mReward0_img.source = "cc_task_red1";
            this.mReward0Num_label.text = "x" + num;
        }
        else if(id == 0){//金豆
            this.mReward0_img.source = "cc_room_0";
            this.mReward0Num_label.text = "" + num;
             this.mReward0High_img.visible = false;
        }
    }
    /**
     * 初始化奖励1的图标和数量
     */
    private _initRew1ByIdAndNum(id:number,num:number){
        if(id == 1){ //红包余额
            this.mReward1_img.source = "cc_task_re2";
            this.mReward1Num_label.text = ""+ num;
        }
        else if(id == 2){ //记牌器
            this.mReward1_img.source = "cc_room_2";
            this.mReward1Num_label.text = num +"小时";
        }else if(id == 0){
            this.mReward1_img.source = "cc_room_0";
            this.mReward1Num_label.text = "" +num;
        }else if(id == 3){
            this.mReward1_img.source = "cc_room_3";
            this.mReward1Num_label.text = "" +num;
        }
    }

    /**
     * 初始化奖励图标
     */
    private _initRewPng(rew:any):void{
        if(rew.length ==1 ){
            this._initRew1ByIdAndNum(rew[0].id,rew[0].num);
        }else if(rew.length == 2){
            this._initRew0ByIdAndNum(rew[0].id,rew[0].num);
            this._initRew1ByIdAndNum(rew[1].id,rew[1].num);
        }
    }

    /**
     * 初始化任务描述
     */
    private _initTaskDesc(desc:string):void{
        this.mTaskDesc_label.text = desc;
        this.info_group.validateNow();
    }

    /**
     * 任务括号里面的描述
     */
    private _initDescExt(desc:string):void{
        this.mTaskDesc1_label.text = desc;
        this.mTaskDesc1_label.x = this.mTaskDesc_label.x + this.mTaskDesc_label.width + 5;
    }
    /**
     * 任务是赢多少局，玩多少局 
     */
    private _onPlayNormalMatch(roomIds:any):void{
        CCDDZPanelDayTask.getInstance().close();
        CCalien.CCDDZPopUpManager.instance.removeAllPupUp();
        let args = null;
        if(roomIds){
            if(roomIds[1000] ){
                args =  { toDiamond: true };
            }else if(roomIds[4001]){
                args =  { toNiu: true };
            }else if(roomIds[1001]||roomIds[1005]){
                args =  { toGold: true };
            }else if(roomIds[9000]||roomIds[9001]||roomIds[9002]){
                args = {toPdk:true};
            }else if(roomIds[3002]||roomIds[3003]||roomIds[3004]){
                args = {toFish:true};
            }
        }else{
            if(this._data.id == 14){
                args = {toFFF:true};
            }else if(this._data.id == 15){
                args = {toLLT:true};
            }
        }
        CCalien.CCDDZSceneManager.instance.show(CCGlobalSceneNames.ROOM,args);
    }

    /**
     * 邀请好友
     */
    private _onInviteFriend():void{
        if (!CCalien.Native.instance.isNative) {  // 非native 也就是web平台的 调起分享提示页面
                CCGlobalWxHelper.shareForPhone();
        } else { // native端 直接调起分享 分享到朋友圈
            let _helper = CCGlobalWxHelper;
            _helper.shareForAndroidApp();
        }
    }   

    /**
     * 发送领取奖励
     */
    private _onGetRewardReq():void{
        let data:any = { taskid: this._data.id};
        if(this._data.tp ==2){ //阶段性任务
            data.optype = 2;
        }else if(this._data.tp == 1 && this._data.id == 3){ //新年任务
		    ccserver.reqGetNewYearTaskRew(this._data.id,this._data.subId,this._data.type);
            return;
	    }

        ccserver.send(CCGlobalEventNames.USER_GET_TASKREW_REQ,data );
    }

    /**
     * 根据结果获取提示文字信息
     */
    private _getTextByResult(result:number):string{
        let _str = null;
        if(result ==0){
            _str = "领取以下奖励成功:" + this._data.rewDesc;
        }
        else{
            let _tArr = {
                /**
                 * 任务不存在
                 */
                ["1"] : lang.taskNotExist,
                /**
                 * 任务未完成
                 */
                ["2"] : lang.taskNotOver,
                /**
                 * 奖励已领取
                 */
                ["3"] : lang.taskHasGetRew,
            }
            if(_tArr[result]){
                _str = _tArr[result];//+ "id:" + this.data.id;
            }
            else{
                _str = "领取奖励失败 ";// + "id:" + this.data.id;
            }
        }
        return _str;
    }
    /**
     * 收到领取奖励的结果
     */
    private _onRecvGetRewRep(e: egret.Event):void{
        let data = e.data;
        if(data.taskid != this._data.id) return;


        let _str = this._getTextByResult(data.result);
        let _result = data.result;
        let _align = "center";
        if(_result==null){
            _align = "left";
        }
        
        //console.log("_onRecvGetRewRep===============>",e.data,_str);
        CCDDZAlert.show(_str,0,null,_align);
        let _type = this._data.tp ;
        let myData = CCDDZMainLogic.instance.selfData;
        //奖励领取成功，按钮状态设置为已领取
        if(e.data.result == 0){
            if(_type ==1 || _type == 3|| _type == 4||_type == 5||_type ==99){
                myData.setTaskHasGetRew(data.taskid)
            }else if(_type ==2){
                myData.setInviteTaskHasGetRew(data.taskid)
            }
            
           egret.setTimeout(function(){ //加个延时
                this._onHasGetRewardBtn();
           },this,200);
       }
    }

    /**
     * 初始化任务进度
     */
    private _initProgress(num:number,total:number):void{
        let _fPro  = num/total;
        this.mPro_label.text = num + "/" + total;
        if(_fPro < this._fMinPro){
            if(_fPro ==0){
                this.mPro_img.visible = false;
                return;
            }
            else{
                this.mPro_img.width = this._nMinWidth;
            }
        }
        else{
            if(_fPro >= 1){
                this.mPro_img.width = this.mProBg_img.width;
            }
            else{
                this.mPro_img.width = _fPro * this.mProBg_img.width;
            }
        }
        
        this.mPro_img.visible = true;
    }

    /**
     * 初始化按钮(做任务，领奖励，已领取)以及点击回调
     */
    private _initBtnAndFunc(status:number):void{
        if(this._tStatusFunc[status]){
            this._tStatusFunc[status]()
        }
        else{
            CCDDZLogUtil.info("_initBtnAndFunc=====error=======>",status)
        }
    }

    /**
     * 未完成 status=0
     */
    private _onNotOverBtn():void{
        this.mDoTask_btn.setPngs("cc_task_doTask_n","cc_task_doTask_p");
        if(this._data.tp == 1){ //赢多少局 斗地主
            this.mDoTask_btn.setClickFunc(this._onPlayNormalMatch.bind(this, { 1001:1,1005:1 }));
        }else if(this._data.tp == 2){
           this.mDoTask_btn.setClickFunc(this._onInviteFriend.bind(this));
        }else if(this._data.tp == 3){//游戏局数
           this.mDoTask_btn.setClickFunc(this._onPlayNormalMatch.bind(this,this._data.roomid));
        }else if(this._data.tp == 4){//胜利局数
           this.mDoTask_btn.setClickFunc(this._onPlayNormalMatch.bind(this,this._data.roomid));
        }else if(this._data.tp == 5){ //捕鱼
           this.mDoTask_btn.setClickFunc(this._onPlayNormalMatch.bind(this,this._data.roomid));
        }else if(this._data.tp == 99){//小游戏
           this.mDoTask_btn.setClickFunc(this._onPlayNormalMatch.bind(this));
        }
  
         this.mDoTask_btn.enableTouch(true);
    }

    /**
     * 已完成未领取奖励 status=1
     * 奖励钻石的需要在APP端领取
     */
    private _onHasOverBtn():void{
        this.mDoTask_btn.setPngs("cc_task_getReward_n","cc_task_getReward_p");
        this.mDoTask_btn.enableTouch(true);
        if(this._data.diamond){ 
            let cc_nativeBridge = CCalien.Native.instance;
            if(cc_nativeBridge.isNative|| (!cc_nativeBridge.isWXMP && !cc_nativeBridge.isAli() && egret.Capabilities.os == "iOS")){		
                this.mDoTask_btn.setClickFunc(this._onGetRewardReq.bind(this));
            }else {
                this.mDoTask_btn.setClickFunc(()=>{
                    let _ins = CCDDZPanelAlert.instance;
                    _ins.show("奖励需在APP端领取，是否下载APP？",0,function(act){
                        if(act == "confirm"){
                            CCGlobalGameConfig.downApp();
                        }
                    },"center");
                    _ins.btnConfirm.bgImg.visible = false;
                    _ins.btnConfirm.scaleX = 1.5;
                    _ins.btnConfirm.scaleY = 1.5;
                    _ins.btnConfirm.labelIcon = "cc_go_down";      
                });
            }    
        }else{
            this.mDoTask_btn.setClickFunc(this._onGetRewardReq.bind(this));
        }
    }

    /**
     * 已领取奖励 status=2
     */
    private _onHasGetRewardBtn():void{
        this.mDoTask_btn.setOnePngAndForbidTouch("cc_task_get");
    }
}

window["CCDDZDayTaskItemInfo"]=CCDDZDayTaskItemInfo;