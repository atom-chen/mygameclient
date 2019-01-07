/**
 * zhu 2017/08/30
 * 每日任务中的单条任务ItemRender
 */
class PDKDayTaskItemInfo extends eui.ItemRenderer {
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
    private mDoTask_btn:PDKButtonDoTaskSkin;

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
        pdkServer[_func](PDKEventNames.USER_GET_TASKREW_REP,this._onRecvGetRewRep,this);
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
    protected dataChanged(): void {
        super.dataChanged();
        if(this.data) {
            this._initByData();
        }
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
        if(this.data.total <=0){
            this.data.total = 1;
        }
        if(this.data.rew && this.data.rew.length ==2){
            let _nPro = this.data.num;
            if(_nPro > this.data.total){
                _nPro = this.data.total;
            }

            this._nMinWidth = this.mPro_img.texture.textureWidth;
            this._fMinPro = this._nMinWidth/this.mProBg_img.width;
            this._initRewPng(this.data.rew);
            this._initProgress(_nPro,this.data.total);
            this._initTaskDesc(this.data.taskDesc1);
            this._initRewSucc();
            this._initDescExt(this.data.taskDesc2);
            this._initBtnAndFunc(this.data.status);

            //括号里面说明的位置
            this.mTaskDesc1_label.x = this.mTaskDesc_label.x + this.mTaskDesc_label.width;
        }
    }

    /**
     * 领取任务成功的提示
     */
    private _initRewSucc():void{
        let _tItem ={
            [0]:"金豆x{0}",
            [41003]:"高级奖杯x{0}个",
            [2]:"记牌器x{0}小时",
            [1]:"奖杯x{0}"
        }
        let _id1  = this.data.rew[0].id;
        let _num1 = this.data.rew[0].num;
        let _id2  = this.data.rew[1].id;
        let _num2 = this.data.rew[1].num;
           
        let _desc1 = _tItem[_id1];
        let _desc2 = _tItem[_id2];
        
        this.data.rewDesc = "\n1." + _desc1.replace("{0}",_num1) +"  2." +_desc2.replace("{0}",_num2) ;
    }
    /**
     * 初始化奖励0的图标和数量
     */
    private _initRew0ByIdAndNum(id:number,num:number){
        this.mReward0High_img.visible = true;
        if(id == 41003){ //高级红包次数
            this.mReward0_img.source = "task_red1";
            this.mReward0Num_label.text = "x" + num;
        }
        else if(id == 0){//金豆
            this.mReward0_img.source = "pdk_room_0";
            this.mReward0Num_label.text = "" + num;
             this.mReward0High_img.visible = false;
        }
    }
    /**
     * 初始化奖励1的图标和数量
     */
    private _initRew1ByIdAndNum(id:number,num:number){
        if(id == 1){ //红包余额
            this.mReward1_img.source = "task_re2";
            this.mReward1Num_label.text = num +"元";
        }
        else if(id == 2){ //记牌器
            this.mReward1_img.source = "pdk_room_2";
            this.mReward1Num_label.text = num +"小时";
        }
    }

    /**
     * 初始化奖励图标
     */
    private _initRewPng(rew:any):void{
        this._initRew0ByIdAndNum(rew[0].id,rew[0].num);
        this._initRew1ByIdAndNum(rew[1].id,rew[1].num);
    }

    /**
     * 初始化任务描述
     */
    private _initTaskDesc(desc:string):void{
        this.mTaskDesc_label.text = desc;
    }

    /**
     * 任务括号里面的描述
     */
    private _initDescExt(desc:string):void{
        this.mTaskDesc1_label.text = desc;
    }
    /**
     * 任务是赢多少局 
     */
    private _onPlayNormalMatch():void{
        PDKPanelDayTask.getInstance().close();
        PDKalien.Dispatcher.dispatch(PDKEventNames.TO_NORMAL_MATCH);
    }

    /**
     * 邀请好友
     */
    private _onInviteFriend():void{
        // PDKPanelShare.instance.show(); 
        // 测试
        // PDKAlert.show('领取奖励： 成功', 2, function(action: string) {
        //     console.log('action:' + action);
        //     let shareScene = PDKShareImageManager.instance.getShareScene(PDKShareImageManager.GAME_TYPE_MATCH, 2);
        //     PDKShareImageManager.instance.start(pdkServer.uid, shareScene);
        // });
        // 测试结束

        if (!PDKalien.Native.instance.isNative) {  // 非native 也就是web平台的 调起分享提示页面
            PDKPanelShare.instance.showInviteFriend();
        } else { // native端 直接调起分享 分享到朋友圈
            // this.onShareWx(); // 由于这个接口不对外开放 所以直接把内部实现提取出来 考虑后期整合  TODO
           PDKWxHelper.doNativeShare();
        }
    }   

    /**
     * 发送领取奖励
     */
    private _onGetRewardReq():void{
        let data = { taskid: this.data.id};
        pdkServer.send(PDKEventNames.USER_GET_TASKREW_REQ,data );
    }

    /**
     * 根据结果获取提示文字信息
     */
    private _getTextByResult(result:number):string{
        let _str = null;
        if(result ==0){
            _str = "领取以下奖励成功:" + this.data.rewDesc;
        }
        else{
            let _tArr = {
                /**
                 * 任务不存在
                 */
                ["1"] : PDKlang.taskNotExist,
                /**
                 * 任务未完成
                 */
                ["2"] : PDKlang.taskNotOver,
                /**
                 * 奖励已领取
                 */
                ["3"] : PDKlang.taskHasGetRew,
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
        if(e.data.taskid != this.data.id) return;

        let _str = this._getTextByResult(e.data.result);
        PDKAlert.show(_str,0,null,"left");
        //奖励领取成功，按钮状态设置为已领取
        if(e.data.result == 0){
           PDKMainLogic.instance.selfData.setTaskHasGetRew(e.data.taskid)
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
            PDKLogUtil.info("_initBtnAndFunc=====error=======>",status)
        }
    }

    /**
     * 未完成 status=0
     */
    private _onNotOverBtn():void{
        this.mDoTask_btn.setPngs("task_doTask_n","task_doTask_p");
        if(this.data.condition == 1){ //赢多少局
            this.mDoTask_btn.setClickFunc(this._onPlayNormalMatch.bind(this));
        }
        else{
            this.mDoTask_btn.setClickFunc(this._onInviteFriend.bind(this));
        }
         this.mDoTask_btn.enableTouch(true);
    }

    /**
     * 已完成未领取奖励 status=1
     */
    private _onHasOverBtn():void{
        this.mDoTask_btn.setPngs("task_getReward_n","task_getReward_p");
        this.mDoTask_btn.enableTouch(true);
        this.mDoTask_btn.setClickFunc(this._onGetRewardReq.bind(this));
    }

    /**
     * 已领取奖励 status=2
     */
    private _onHasGetRewardBtn():void{
        this.mDoTask_btn.setOnePngAndForbidTouch("task_get");
    }
}
