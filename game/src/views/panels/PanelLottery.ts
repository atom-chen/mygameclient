/**
 *
 * 夺宝
 *
 */
class PanelLottery extends alien.PanelBase {
    private static _instance: PanelLottery;
    public static get instance(): PanelLottery {
        if (this._instance == undefined)
        {
            this._instance = new PanelLottery();
        }
        return this._instance;
    }

    private close_group: eui.Group;

    private _self: UserInfoData;
    private gold: Gold;
	/**
	 * 钻石
	 */
	private diamond:Gold;
    private labNickName: eui.Label;
    private avatar: Avatar;
    //兑换按钮
    private redExchangeImg:eui.Image;
    private lbRedCoin:eui.Label;
    private ruleImg:eui.Image;

    /**
     * 购买记牌器
     */
    private btnMy:eui.Button;

    /**
     * 兑换话费，话费充值卡等记录
     */
    private itemScroller:eui.Scroller;
    private _dataProvide:eui.ArrayCollection;
    private itemList:eui.List;

    /**
     * 夺宝配置 也包括服务器返回的所有夺宝的状态数据 
     */
    private _allCfg:any = null;

    /**
     * 定期获取夺宝的状态
     */
    private _interReqStatus:any = null;

    /**
     * 客服特殊处理
     */
    private keFuBtn:eui.Button;

    protected init(): void {
        this.skinName = panels.PanelLotterySkin;

        this._self = MainLogic.instance.selfData;
    }

    constructor() {
        super(
            alien.popupEffect.Fade, {},
            alien.popupEffect.Fade, {}
        );
        
        this._formatLotteryCfg();
    	this.addEventListener(egret.Event.ADDED_TO_STAGE,this._onAddToStage,this);
    }

    createChildren(): void {
        super.createChildren();
        this._dataProvide = new eui.ArrayCollection();
        this.itemList.itemRenderer = LotteryItem;
        this.itemList.dataProvider = this._dataProvide;

        this.percentWidth = 100;
        this.percentHeight = 100;

        
        server.addEventListener(EventNames.USER_USER_INFO_RESPONSE,this.onMyUserInfoUpdate,this);
        let e: alien.EventManager = EventManager.instance;
        e.registerOnObject(this, this.close_group, egret.TouchEvent.TOUCH_TAP, this.dealAction, this);
        e.registerOnObject(this,this.ruleImg,egret.TouchEvent.TOUCH_TAP,this.onRuleClick,this);
        e.registerOnObject(this,this.btnMy,egret.TouchEvent.TOUCH_TAP,this.onMyClick,this);
        e.registerOnObject(this,this.redExchangeImg,egret.TouchEvent.TOUCH_TAP,this._onClickExchange,this);
		e.registerOnObject(this,alien.Dispatcher,EventNames.BAG_INFO_REFRESH,this._onBagRefresh,this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
    }

    /**
     * 清除定期请求
     */
    private _clearInternalReqStatus():void{
        if(this._interReqStatus){
            egret.clearInterval(this._interReqStatus);
        }
        this._interReqStatus = null;
    }

    /**
     * 定期请求
     */
    private _initInternalReqStatus():void{
        if(!this._interReqStatus){
            this._interReqStatus = egret.setInterval(()=>{
                server.reqAllLotteryStatus();
            },this,5000);
        }
    }
    

	private _onAddToStage(e:egret.Event):void{
		//this.itemList.addEventListener(egret.Event.CHANGE, this._onSelectItem, this);
        this.keFuBtn["addClickListener"](this._onClickKeFu,this,false);
        server.addEventListener(EventNames.USER_CoinLottery_REP,this.onLotteryStatusRep,this);
        alien.EventManager.instance.enableOnObject(this);
        server.reqAllLotteryStatus();
        this._clearInternalReqStatus();
        this._initInternalReqStatus();
	}

	private _onRemovedToStage():void{
        server.removeEventListener(EventNames.USER_CoinLottery_REP,this.onLotteryStatusRep,this);
        server.removeEventListener(EventNames.USER_USER_INFO_RESPONSE,this.onMyUserInfoUpdate,this);
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
        this._clearInternalReqStatus();
        alien.EventManager.instance.disableOnObject(this);
		PanelLottery._instance = null;
	}

    private _onClickKeFu():void{
        GameConfig.showKeFu();
    }

    /**
     * 选中某个夺宝
     */
	private _onSelectItem(event:egret.Event):void{
		//let data:any = this.itemList.selectedItem;
        //PanelLotteryDetail.getInstance().show(1,data);
        //this.itemList.selectedIndex = -1;
    }
    
    /**
     * 格式化服务器返回的夺宝状态的数组
     */
    private _formatServerLotteryStatus(_array:any):void{
        let _data = _array;
        let _len = _data.length;
        let _id = null;
        let _one:any = null;
        let _item:any = null;
        for(let i=0;i<_len;++i){
            _one = _data[i];
            _id = _one.id;
            this._allCfg[_id].title = _one.rewarddes; //奖励描述
            this._allCfg[_id].enddate = _one.enddate * 1000; //秒的时间戳
            if(_one.phase != this._allCfg[_id].phase){
                this._allCfg[_id].code = [];
                this._allCfg[_id].codeIdx = {};
                
                MailService.instance.getMailList();
                console.log("_formatServerLotteryStatus===>",_id,_one.phase,-1);
            }
            this._allCfg[_id].phase = _one.phase; //期数
            this._allCfg[_id].poll = _one.poll ||0; //所有人参加的次数;
            this._allCfg[_id].minpoll = _one.minpoll; //最小多少次数开奖;
            _item = _one.price.split(":");
            this._allCfg[_id].price = {id:_item[0],num:_item[1] / 100}; //目前只有奖券
            
            if(_one.reward && _one.reward != "" &&  _one.reward != "nil"){
                _item = _one.reward.split("|");
            }else{
                _item = _one.redreward.split("|");
            }

            this._allCfg[_id].reward = [];
            for(let j=0;j<_item.length;++j){
                let _tmp = _item[j].split(":")
                this._allCfg[_id].reward.push({id:_tmp[0],num:_tmp[1]});
            }
            
            if(_one.code){
                let _c = _one.code;
                let _l = _c.length;
                for(let j=0;j<_l;++j){
                    if(!this._allCfg[_id].codeIdx[_c[j]]){
                        this._allCfg[_id].codeIdx[_c[j]] = 1;
                        this._allCfg[_id].code.push(_c[j]);
                    }
                }
            }
        }
    }

    /**
     * 我参加夺宝成功后改变本地的夺宝状态数据
     */
    private _addLotteryCountByMyJoinSucc(id:number,num:number,code:any):void{
        let _code = this._allCfg[id].code;
        let _codeIdx = this._allCfg[id].codeIdx;
        for(let i=0;i<num;++i){
            if(!_codeIdx[code[i]]){
                this._allCfg[id].poll += 1;
                _codeIdx[code[i]] = 1;
                _code.push(code[i]);
            }
        }
        this._dataProvide.itemUpdated(this._allCfg[id]);
    }

    /**
     * 格式化夺宝配置
     */
    private _formatLotteryCfg():void{
        let _cfg:any = GameConfig.getCfgByField("red_coin_lottery_config");
        if(!_cfg){
            Reportor.instance.reportCodeError("red_coin_lottery_config null");
            return;
        }
        let _cfgs:any = null;
        if(!_cfg._formatData){
            let _len = _cfg.length;
            let _one = null;
            let _item = null;
            _cfgs = {"_arr_":[]} ;
            for(let i=0;i<_len;++i){
                _one = _cfg[i];
                _cfgs[_one.id] = _one;
                _cfgs[_one.id].codeIdx = {};
                _cfgs[_one.id].code = [];
                _cfgs["_arr_"].push(_one.id);  
            }
            _cfgs._formatData = true;
            GameConfig.setCfgByField("red_coin_lottery_config",_cfgs);
            _cfg = _cfgs;
        }
        this._allCfg = _cfg;
    }

    private onLotteryStatusRep(event: egret.Event): void {
        let data: any = event.data;
        if(data.result == null){
            if(data.optype == 1){ //查询
                if(data.lotteryinfo && data.lotteryinfo.length >0){
                    this._formatServerLotteryStatus(data.lotteryinfo);
                    this._updateUI();
                }
            }else if(data.optype ==2){ //参加夺宝
                if(!data.params || data.params.length < 2) return;
                Toast.show("参与成功");
                let id = data.params[0];
                let num = data.params[1];
                if(data.params.length >= 2 + num){
                    let code = data.params.slice(2,2+num);
                    this._addLotteryCountByMyJoinSucc(id,num,code);
                    
                    PanelLotteryDetail.updateDetail(4,this._allCfg[id]);
                }
            }
        }else if(data.result == 5){ //开奖中
            if(data.optype ==2){
                server.reqAllLotteryStatus();
            }
        }
    }

    /**
     * 当我的玩家信息
     * @param event
     */
    private onMyUserInfoUpdate(event: egret.Event = null): void {
        let _curInfo : UserInfoData = event ? event.data: this._self;
        let userInfoData: UserInfoData = this._self;
        let _nDiamond:any = BagService.instance.getItemCountById(3);
        this.gold.updateGold(userInfoData.gold);
        this.diamond.updateGold(_nDiamond);
        this.avatar.imageId = userInfoData.imageid;
        if(userInfoData.nickname) {
            let _nameStr = userInfoData.nickname.substr(0,10);
            this.labNickName.text =  _nameStr + "(" + userInfoData.fakeuid + ")";
         }
         this._self.redcoin = _curInfo.redcoin || 0;
         MainLogic.instance.selfData.redcoin = _curInfo.redcoin || 0;
        this.lbRedCoin.text = "" + Utils.exchangeRatio(this._self.redcoin/100,true);
    }

    show(): void {
        this.popup();
        this.onMyUserInfoUpdate();
    }

    private _updateUI():void{
        let _info = [];
        let _idArr = this._allCfg["_arr_"];
        let _len = _idArr.length;
        for(let i=0;i<_len;++i){
            _info.push(this._allCfg[_idArr[i]]);
        }

        console.log("_updateUI======>",_info.length);
        this._dataProvide.source = _info;
        this._dataProvide.refresh();
    }

    /**
	 * 背包更新
	*/
	private _onBagRefresh():void{
		let _nDiamond:any = BagService.instance.getItemCountById(3);
		this.diamond.updateGold(_nDiamond);
	}
    /**
     * 点击红包栏的兑
     */
    private _onClickExchange():void{
        PanelExchange2.instance.show(4);
    }
    /**
     * 我的夺宝记录
     */
    private onMyClick(event:egret.TouchEvent):void{
        PanelLotteryMyRec.getInstance().show();
	}

    /**
     * 规则
     */
    private onRuleClick():void{
        PanelLotteryCode.getInstance().show(2,null);
    }
}


class LotteryItem extends eui.ItemRenderer {
    static WIDTH:number = 218;
    /**
     * 背景
     */
    private itemBgImg:eui.Image;
    /**
     * 单次价格
     */
    private moneyLabel:eui.BitmapLabel;
    /**
     * 奖励标题
     */
    private titLabel:eui.Label;
    /**
     * 奖励物品
     */
    private itemImg:eui.Image;
    /**
     * 火爆等标示
     */
    private flagImg:eui.Image;
    /**
     * 汉字 时
     */
    private leftHLabel:eui.Label; 
    /**
     * 时间 时
     */
    private leftHLabel1:eui.Label;
    /**
     * 汉字 分
     */
    private leftMLabel:eui.Label; 
    /**
     * 时间 分
     */
    private leftMLabel1:eui.Label;
    /**
     * 汉字 秒
     */
    private leftSLabel:eui.Label; 
    /**
     * 时间 秒
     */
    private leftSLabel1:eui.Label;
    /**
     * 抢的次数/总需要的次数
     */
    private stateLabel:eui.Label; 

    /**
     * 我有多个夺宝码
     */
    private hasLabel:eui.Label;
    /**
     * 倒计时
     */
    private _interval:any;

    /**
     * 用于计算倒计时100毫秒了多少次
     */
    private count:number= 10;

    /**
     * 倒计时每个单位显示的ui控件
     */
    private showTimes:any;

    /**
     * 客户端结束时间比服务器给的结束时间提前多少秒
     */
    private _lessTime:number = 100;

    /**
     * 客户端倒计时结束后，等待多少秒去web请求开奖结果
     */
    private _endWaitTime:number = 100;

    /**
     * 是否正在请求开奖结果
     */
    private _isReqLuck:boolean = false;

    /**
     * 是否是倒计时完毕
     */
    private _tickOver:boolean = false;

    /**
     * 定时请求开奖
     */
    private _reqCurInter:any = null;

    /**
     * 上次更新的时间戳
     */
	private _lastUpStamp:number = 0;

    /**
     * 显示倒计时
     */
    private timeGroup:eui.Group;

    /**
     * 当前数据
     */
    private _curData:any = null;

    /**
     * 当天的状态
     */
    private _curStatusCode:number = -1;

    private _luckData:any;

    private _id :number;
    private _phase:number;

	createChildren():void {
		super.createChildren();
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
        this.itemBgImg["addClickListener"](this._onClickBgImg,this,false);
	}

    private _onClickBgImg():void{
        console.log("_onClickBgImg======>",this._curData.id,this._curData.phase ,this._curStatusCode);
        PanelLotteryDetail.getInstance().show(1,this._curData);
    }

    /**
     * 清除倒计时
     */
    private _clearInterval():void{
        if(this._interval){
            egret.clearInterval(this._interval);
        }
        this._interval = null;
    }

    /**
     * 清除定时请求开奖结果
     */
    private _clearReqCurInter():void{
        if(this._reqCurInter){
            egret.clearInterval(this._reqCurInter);
        }
        this._reqCurInter = null;
    }

    private _onRemovedToStage():void{
        this._clearInterval();
        this._clearReqCurInter();
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
    }

    private _initFlag():void{
        let _data = this._curData;
        if(_data.flag == 1){
            this.flagImg.source = "lotteryFlag";
            this.flagImg.visible = true;
        }else{
            this.flagImg.visible = false;
        }
    }

    /**
     * 倒计时结束
     */
    private _onIntervalOver():void{
        if(this._tickOver) return;
        this._tickOver = true;
        this._curStatusCode = 10;
        this._curData.statusCode = this._curStatusCode;
        this._clearInterval();
        this._onWaitLuck();
        console.log("_onIntervalOver==========>",this._curData.id,this._curData.phase,this._curStatusCode);
        let _waitTime = this._lessTime + this._endWaitTime;
        egret.setTimeout(()=>{
            this._reqCurLuck();
        },this,_waitTime)
    }

    /**
     * 等待开奖
     */
    private _onWaitLuck():void{
        this.stateLabel.text = "等待开奖"
        PanelLotteryDetail.updateDetail(1,this._curData);
    }

    /**
     * 查询本次开奖
     */
    private _reqCurLuck():void{
        if(this._isReqLuck) return;
          
        //console.log("_reqCurLuck---->当前时间:",alien.TimeUtils.timeFormatForEx(new Date(server.tsServer*1000),"-","-","",true,true),"|本期结束时间:",alien.TimeUtils.timeFormatForEx(new Date(this.data.enddate),"-","-","",true,true));
        
        this._isReqLuck = true;
        console.log("_reqCurLuck===============>",this._id,this._phase);
        webService.getLotteryCurLuck(this._id,this._phase,(response)=>{
            this._isReqLuck = false;
            //console.log("_reqCurLuck===========>",response);
            this._onGetLuck(response);
        });
    }

    /**
     * 开奖结果
     * code :1 流拍 10:进行中 0:已开奖
     */
    private _onGetLuck(response:any):void{
        let _data = response.data || {};
        _data.id = this._curData.id;
        if(response.code==1){ //流拍
            this._curStatusCode = 1;
            this._curData.statusCode = this._curStatusCode;
            this.stateLabel.text = response.message;
            this._clearReqCurInter();
            PanelLotteryDetail.updateDetail(2,_data);
            let _timeout = egret.setTimeout(()=>{
                if(this._curStatusCode == 1){
                    this._curStatusCode = -1;
                }
                egret.clearTimeout(_timeout);
            },this,1000);
        }else if(response.code == 0){
            this._curStatusCode = 0;
            this._curData.statusCode = this._curStatusCode;
            this._luckData = _data;
            this._curData.luckData = _data;
            let _timeout = egret.setTimeout(()=>{
                if(this._curStatusCode == 0){
                    this._curStatusCode = -1;
                }
                egret.clearTimeout(_timeout);
            },this,1000);

            this._clearReqCurInter();
            PanelLotteryDetail.updateDetail(3,_data);
        }else if(response.code == 10){ //进行中等待开奖
            if(!this._reqCurInter){
                this._reqCurInter = egret.setInterval(()=>{
                    this._reqCurLuck();
                },this,1000);
            }
        }
        
        console.log("_onGetLuck======>",this._id,this._phase ,this._curStatusCode);
        PanelLotteryMyRec.updateOneInfo(this._curData);
    }

    private _onIntervalEvent():void{
        this.count -= 1;
        let _times = this._curData.times;
        if(this.showTimes[4]){
            this.showTimes[4].text = "" + (this.count < 0?0:this.count);
        }
        if(this.count <= 0){
            this.count = 10;
            
            if(_times.seconds <= 0){
                _times.seconds = 59;
                if(_times.minutes <=0){
                    _times.minutes = 59;
                    if(_times.hours <=0){
                        _times.hours = 23;
                        if(_times.days <=0){
                            this._onIntervalOver();
                            return;
                        }else{
                            _times.days -= 1;
                        }
                        if(this.showTimes[0]){
                            this.showTimes[0].text = "" + _times.days;
                        }
                    }else{
                        _times.hours -= 1;
                    }
                    
                    if(this.showTimes[1]){
                        this.showTimes[1].text = "" + _times.hours;
                    }
                }else{
                    _times.minutes -= 1;
                }
                if(this.showTimes[2]){
                    this.showTimes[2].text = "" + _times.minutes;
                }
            }else{
                _times.seconds -= 1;
            }
            if(this.showTimes[3]){
                this.showTimes[3].text = "" + _times.seconds;
            }
        }
        //console.log("-----days:",_times.days,"|hours:",_times.hours,"|minutes:",_times.minutes,"|seconds:",_times.seconds,"|milliseconds:",_times.milliseconds,"|count:",this.count); 
    }

    protected dataChanged(): void {
        if(this._curStatusCode == 0 || this._curStatusCode == 10 || this._curStatusCode == 1){
            return;
        }

       if(!this._lastUpStamp){
			this._lastUpStamp = new Date().getTime();
		}else {
			let _curTime = new Date().getTime();
			if(_curTime - this._lastUpStamp < 1000 /this.stage.frameRate){
				return;
			}
			this._lastUpStamp = _curTime;
		}

        this._luckData = null;
        let _data = this.data;
        this._id = _data.id;
        this._phase = _data.phase;
        this._curData = _data;
        this._curData.statusCode = -1;
        console.log("dataChanged=====>",this._id,this._phase,this._curStatusCode);

        PanelLotteryDetail.updateDetail(5,_data);
        super.dataChanged();
        this._initFlag();
        let _val = _data.price.num;
        let _curStamp = server.tsServer * 1000;
        let _endStamp = _data.enddate; //在格式化时已经转为毫秒
        if(_curStamp > _endStamp){
            Reportor.instance.reportCodeError("lottery startTime > endTime id:" + this._id + "|phase:" + this._phase);
        }
        _endStamp -= this._lessTime;
        
        console.log("id:" + _data.id + "|phase:" + _data.phase,"|code:",this._curStatusCode,"--dataChanged---->当前时间:",alien.TimeUtils.timeFormatForEx(new Date(_curStamp),"-","-","",true,true),"|本期结束时间:",alien.TimeUtils.timeFormatForEx(new Date(_endStamp),"-","-","",true,true));

        let _ret:any = {days:0,hours:0,minutes:0,seconds:0,milliseconds:0}; 
        if(this._curData.poll >= this._curData.minpoll && this._curData.type == 1){ //人满即开,人数达到
            _endStamp = _curStamp;
        }

        if(_endStamp <= _curStamp){
            this.count = 0;
            if(this._curStatusCode == -1){
                this._onIntervalOver();
            }
        }else{
             _ret = alien.Utils.getTimeStampDiff(_curStamp,_endStamp,"all");
            if(!this._interval){
                this._interval = egret.setInterval(()=>{
                    this._onIntervalEvent();
                },this,100);
            }
            if(_data.type ==1){ //人满即可
                this.stateLabel.text = "已抢"+ _data.poll + "/"+ _data.minpoll+"次"; 
                this._lessTime = 100;
                this._endWaitTime = 100;
            }else if(_data.type ==2){ //定时
                this.stateLabel.text = "已抢"+ _data.poll + "次";
                this._lessTime = 10000;
                this._endWaitTime = 5000;
            }
        }
        this._curData.times = _ret; 
        //console.log("_ret -----days:",_ret.days,"|hours:",_ret.hours,"|minutes:",_ret.minutes,"|seconds:",_ret.seconds,"|milliseconds:",_ret.milliseconds);
        if(_ret.days > 0 || _ret.hours > 0){ //倒计时显示到秒
            if(_ret.days >0){
                this.leftHLabel.text = "天";
                this.leftHLabel1.text = _ret.days;
                this.leftMLabel.text = "时";
                this.leftMLabel1.text = _ret.minutes;
                this.leftSLabel.text = "分";
                this.showTimes = [this.leftHLabel1,this.leftMLabel1,this.leftSLabel1,null,null];
                this.leftSLabel.visible = true;
            }else{
                this.leftHLabel.text = "时";
                this.leftHLabel1.text = _ret.hours;
                this.leftMLabel.text = "分";
                this.leftMLabel1.text = _ret.minutes;
                this.leftSLabel.text = "秒";
                this.leftSLabel1.text = _ret.seconds;
                this.leftSLabel.visible = true;
                this.showTimes = [null,this.leftHLabel1,this.leftMLabel1,this.leftSLabel1,null];
            }
        }else{ //显示到毫秒
            this.leftHLabel.text = "分";
            this.leftHLabel1.text = _ret.minutes;
            this.leftMLabel.text = "秒";
            this.leftMLabel1.text = _ret.seconds;
            //this.leftSLabel.text = "秒";
            this.showTimes = [null,null,this.leftHLabel1,this.leftMLabel1,this.leftSLabel1];
            this.leftSLabel1.text = "" + this.count;
            this.leftSLabel.visible = false;
        }
        this.titLabel.text = _data.title;
        this.moneyLabel.text = alien.Utils.flatToString(_val,2);
        this.itemImg.source = GoodsItem.parseUrl(_data.reward[0].id);
        this._tickOver = false;
        let _codeLen = _data.code.length;
        if(_codeLen > 0){
            this.hasLabel.text = "我有" + _codeLen + "个夺宝码";
            this.hasLabel.visible = true;
        }else{
            this.hasLabel.visible = false;
        }
    }
}