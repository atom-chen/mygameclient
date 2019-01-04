/**
 * Created by rockyl on 15/11/26.
 *
 * 座位
 */

class SeatDzpk extends eui.Component {
	protected handCardGroup:eui.Group;
	/**
	 * 输赢分
	 */
	protected _labChange:eui.Label;
	/**
	 * 倒计时的光圈
	 */
	private timeImg:eui.Image;
	/**
	 * 绘制倒计时
	 */
	private _timeShape:egret.Shape;
	/**
	 * 共倒计时多久
	 */
	private _srcTime:number;
	/**
	 * 倒计时当前的值
	 */
	private _timeValue:number;
	/**
	 * 倒计时的tween
	 */
	private _timeTween:egret.Tween;
	/**
	 * 倒计时绘制的每一次偏移
	 */
	private _timeOffset:number = -Math.PI / 2;
	/**
	 * 倒计时的绘制半径
	 */
	private _shapRadius:number;
	/**
	 * 倒计时的绘制中心点
	 */
	private _shapCenter:any;

	/**
	 * 玩家信息
	 */
	protected _userInfoData:UserInfoData;
	/**
	 * 离线图标
	 */
	_offlineImg:eui.Image;
	/**
	 * 图像中心点
	 */
	_avatarglobalPos:any;

	/**
	 * 倒计时的图片
	 */
	_timeTypes:any;

	/**
	 * 下注信息
	 */
	chipInfo:GoldDzpk;

	private _ops:any;

	/**
	 * 是否在游戏中
	 */
	private _inGame:boolean;

	/**
	 * 是否弃牌
	 */
	private _hasGiveUp:boolean;

	constructor() {
		super();

		this.init();
	}

	protected init():void {

	}

	protected createChildren(): void {
        super.createChildren();
		
		this._timeTypes={
			[1]:"common_green",
			[2]:"common_yellow",
			[3]:"common_red",
		}

		let w = this.timeImg.width;
		let h = this.timeImg.height;
		
		this._timeShape = new egret.Shape();
		this.addChild(this._timeShape);
		this.timeImg.mask = this._timeShape;
		this._shapRadius = Math.sqrt(w * w + h * h) * 0.5;
		this.commitProperties();
		this._shapCenter = {x: w  * 0.5 + this.timeImg.x, y: h  * 0.5 + this.timeImg.y};

		this._initSrcPos();
		this._ops = {
			[1]: {text:"加注",col:0xFFF300}, [2]: {text:"跟注",col:0x36C55C}, [3]: {text:"弃牌",col:0xFFFFFF}, [4]: {text:"让牌",col:0x00F6FF}, [5]: "allin"
		}
		this._userInfoData = new UserInfoData();
		this.clean(true);
    }

	/**
	 * 初始化控件的预案坐标
	 */
	private _initSrcPos():void{
		let grp = this["sendCardGroup"];
		grp["srcX"] = grp.x;
		grp["srcY"] = grp.y;

		let obj = this["changeLabel"];
		obj["srcY"] = obj.y;

		obj = this.chipInfo;
		obj["srcX"] = obj.x;
		obj["srcY"] = obj.y;
	}

	public set inGame(v){
		this._inGame = v;
	}
	
	public get inGame(){
		return this._inGame;
	}

	/**
	 * 是否已经弃牌
	 */
	public set hasGiveUp(v){
		this._hasGiveUp = v;
	}

	/**
	 * 是否已经弃牌
	 */
	public get hasGiveUp():boolean{
		return this._hasGiveUp;
	}
	/**
	 * 设置图像
	 */
	private _setHead(src=null):void{
		if(!src){
			src = this._userInfoData.imageid;
		}
		this["headImg"].source = src;
	}

	/**
	 * 显示玩家allIn
	 */
	private _showAllIn(bShow:boolean):void{
		this["allInImg"].visible = bShow;
	}

	/**
	 * 显示牌型
	 */
	public showCardTypeGrp(bShow:boolean):void{
		this["cardTypeGroup"].visible = bShow;
	}

	/**
	 * 显示光圈倒计时
	 */
	private _showTime(bShow):void{
		this.timeImg.visible = bShow;
	}
	/**
	 * 显示牌型
	 */
	private _showCardTypeLabel(sType):void{
		this["cardTypeLabel"].text = sType;
	}

	/**
	 * 清除两张牌标记
	 */
	public cleanTwoFlag():void{
		let obj = this["sendCardGroup"];
		egret.Tween.removeTweens(obj);
		obj.x = obj["srcX"];
		obj.y = obj["srcY"];

		this.showCardFlagByIdx(1,false);
		this.showCardFlagByIdx(2,false);
	}

	/**
	 * 如果弃牌或则是仅坐下未参入游戏则透明度设置为.35 否则设置为1
	 */
	private _setAlphaByGiveUp(bGiveup:boolean):void{
		let alpha = 1;
		if(bGiveup){
			alpha = 0.35
		}
		
		this["userInfoGroup"].alpha = alpha;
		this["sendCardGroup"].alpha = alpha;
		this["changeLabel"].alpha = alpha;
	}

	/**
	 * 显示弃牌动画,我自己不显示弃牌动画
	 */
	private _runGiveUpAni():void{
		if(server.seatid != this._userInfoData.seatid){
			let grp = this["sendCardGroup"];
			let srcX = grp["srcX"];
			let srcY = grp["srcY"];
			let stage = alien.StageProxy;
			let w = stage.width;
			let h = stage.height;
			let tx = (w - grp.width) * 0.5;
			let ty = (h - grp.height) * 0.5;
			let lPos = this["rootGrp"].globalToLocal(tx,ty);
			egret.Tween.get(grp).set({x:srcX,y:srcY}).to({x:lPos.x,y:lPos.y},500).call(()=>{
				this.cleanTwoFlag();
				this._setAlphaByGiveUp(true);
			});
		}else{
			this._setAlphaByGiveUp(true);
		}
	}

	/**
	 * 1 加注 2 跟注 3 弃牌 4 过牌 5 allin 6 让或弃 7 跟所有注
	 * allin 为动画
	 */
	private _setOp(op:number,ani:boolean):void{
		this._showAllIn(false);
		this._showOpLabel(false);
		let obj = this._ops[op];
		if(op != 5 && op >=1 && op <=4){
			this._setNick(obj.text);
			this._setNickCol(obj.col);
			if(op == 3){
				this.hasGiveUp = true;
				if(ani){
					this._runGiveUpAni();
				}else{
					this._setAlphaByGiveUp(true);
				}
			}
		}else if(op ==5){
			this._showAllIn(true);
		}

		if(ani && op <=5){
			let sexStr = this._userInfoData.sexVoiceStr;
			GameDZPKSoundManager.playOpType(sexStr,op);
		}
	}

	/**
	 * 显示玩家的操作
	 */
	private _showOpLabel(bShow:boolean):void{
		this["nameLabel"].visible = bShow;
	}

	/**
	 * 设置玩家的昵称
	 */
	private _setNick(nick:string=null):void{
		if(!nick){
			nick = this._userInfoData.nickname || "";
		}
		nick = nick.substr(0,4);
		this._showAllIn(false);
		this._showOpLabel(true);
		this["nameLabel"].text = nick;
	}

	/**
	 * 设置玩家的金豆信息
	 */
	private _setGold(num=null):void{
		if(!num){
			num = this._userInfoData.gold;
		}

		if(num>=0){
			this["goldLabel"].text = "" + num;
		}
	}

    /**
     * 显示加减分
     */
    private _showChange(bShow:boolean):void{
        this["changeLabel"].visible = bShow;
    }

	/**
	 * 设置加减分
	 */
	private _setChange(n:number):void{
		this["changeLabel"].text = (n > 0 ? '+' + n : '' + n);;
	}

	/**
	 * 播放加减分动画
	 * kb:台费
	 * c:输赢分
	 */
	public runChangeAni(kb:number,c:number):void{
		let n = kb + c;
		this._setChange(n);
		this._showChange(true);
		let obj = this["changeLabel"];
		let srcY = obj["srcY"];
		egret.Tween.get(obj).set({alpha:0,y:srcY}).to({y:srcY - 40,alpha:1},1000,egret.Ease.cubicOut).call(()=>{
			//this.updateSeatGold(hasGold,true);
		});
	}

	/**
	 * 播放下注动画
	 */
	private _runChipAni(cb:Function):void{
		let flyGold:FlyGold;
		let overCb = cb;
		flyGold = FlyGold.create({img:"play_chess",cb:(obj)=>{
			this.parent.removeChild(obj);
			FlyGold.recycle(obj);
			overCb();
		}});
		let chipCGPos = this.chipInfo.getICGPos();
		let headCGPos = this.getHeadCGPos();
		this.parent.addChild(flyGold);
		flyGold.x = headCGPos.x;
		flyGold.y = headCGPos.y
		flyGold.fly(headCGPos.x,headCGPos.y,chipCGPos.x,chipCGPos.y,200 );
	}

	/**
	 * 设置已下的筹码
	 */
	public setHasChipNum(num):void{
		let obj = this.chipInfo;
		obj.updateGold(num);
	}
	/**
	 * 获取已下的筹码
	 */
	public getHasChipNum():number{
		return this.chipInfo.getGold();
	}
	/**
	 * 显示庄家标志
	 */
	public showMaster(bShow:boolean):void{
		this["flagMasterImg"].visible = bShow;
	}

	/**
	 * 更新玩家身上的金豆
	 * bSet 直接使用传入的金豆作为玩家身上的金豆
	 */
	public updateSeatGold(n,bSet:boolean):void{
		let gold = this._userInfoData.gold;
		let dest = gold + n;
		if(bSet){
			dest = n;
		}
		if(dest <= 0){
			dest = 0;
		}
		this._userInfoData.gold = dest;
		this._setGold();
	}

	/**
	 * 显示玩家本轮下注的筹码
	 */
	public showChipInfo(bShow):void{
		let obj = this.chipInfo;
		obj.visible = bShow;
		if(bShow){
			egret.Tween.removeTweens(obj);
			obj.x = obj["srcX"];
			obj.y = obj["srcY"];
		}
	}
    
	/**
	 * 玩家操作
	 * optype (1 加注 2 跟注 3 弃牌 4 过牌 5 allin) params[1]该玩家此轮筹码 params[2]该玩家剩余筹码 params[3] 必须要跟的筹码 params[4] 加注金额
	 */
	public setOperateByType(op:number,params:any,ovcb:Function,ani:boolean):void{
		this.stopCD();
		this._setOp(op,ani);
		let param = params;
		let setOver = ()=>{
			this.setHasChipNum(param[0]);
			if(param.length >=2 && param[1] >=0){
				this._setGold();
			}
			if(ovcb){
				ovcb();
			}
		};

		if(param && param.length >= 1 && op != 4){
			GameDZPKSoundManager.playChipToTab();
			if(param[0] >0){
				this.showChipInfo(true);
			}
			if(param.length >=2 && param[1] >=0){
				this._userInfoData.gold = param[1];
			}

			if(ani){
				if(param[0] >0){
					this._runChipAni(setOver);
				}else{
					setOver();
				}
			}else{
				setOver();
			}
			
		}else if(ovcb){
			ovcb();
		}
	}

	public set userInfoData(v){
		this._userInfoData.initData(v);
		this._setHead();
		this.setNickName();
		this._setGold();
		this.showCardTypeGrp(false);
	}

	public get userInfoData():UserInfoData{
		return this._userInfoData;
	}

	/**
	 * 显示桌面上的两张牌标记
	 * idx 1,2
	 */
	public showCardFlagByIdx(idx,bShow):void{
		this["card" + idx + "Img"].visible = bShow;
	}

	/**
	 * 设置用户是否离线 
	 */
	public setUserOffline(bOffline:boolean):void{
		this._offlineImg.visible = bOffline;
	}

	/**
	 * 点击玩家头像回调 zhu
	 */
	private _onTouchHead():void{
		if(!this._userInfoData) return ;
		let _rate = (100* this._userInfoData.getWinRate()).toFixed(0) +"%"; 
		let _redBeg = this._userInfoData.redcoingot;
		let _nick = this._userInfoData.nickname;
		let _gold = this._userInfoData.gold;
		let _head = this._userInfoData.imageid;
		let _game = this._userInfoData.totalwincnt + this._userInfoData.totallosecnt + this._userInfoData.totaldrawcnt;
		let _seatId = this._userInfoData.seatid;
		let _uid = this._userInfoData.uid;
		let _praise = this._userInfoData.praise;
		let data = {nick:_nick,gold:_gold,head:_head,winRate:_rate,game:_game,redBeg:_redBeg,seatId:_seatId,uid:_uid,praise:_praise};
		PanelPlayerInfo.getInstance().show(data);
	}

	/**
	 * 设置头像是否可以点击 zhu
	 */
	public setHeadTouch(bEnable:boolean):void{
		//this.userInfoView.avatar.setHeadTouch(bEnable);
		//this.userInfoView.avatar.setHeadTouchFunc(this._onTouchHead.bind(this))
	}

	/**
	 * 仅仅围观未参加此局游戏
	 * bJust:true则设置透明35%否则是不透明
	 */
	public setAlphaJustSitDown(bJust:boolean):void{
		this._setAlphaByGiveUp(bJust)
	}

	/**
	 * 清空位子
	 */
	clean(cleanUserInfo:boolean = false):void {
		this.inGame = false;
		this.hasGiveUp = false;
		if(cleanUserInfo){
			this["goldLabel"].text = "";
			this["nameLabel"].text = "";
			this["headImg"].src = "";
			this.userInfoData.clean();
		}
		this._setAlphaByGiveUp(false);
		this._showChange(false);
		this._showAllIn(false);
		this.showCardTypeGrp(false);
		this._showTime(false);
		this.cleanTwoFlag();
		this.stopCD();
		this.showChipInfo(false);
		this.showMaster(false);
		this.cleanHand()
	}

	ajustCardPos():void{
		let width = this.handCardGroup.width;
		let height = this.handCardGroup.height;
		let grpChilds = this.handCardGroup.$children;
		let childlen = this.handCardGroup.numChildren;

		if(childlen ==1){
			let card = grpChilds[0];
			card.x = (width - card.width * card.scaleX) * 0.5;
			card.y = (height - card.height * card.scaleY) * 0.5;
		}else if(childlen ==2){
			grpChilds[0].x = -25;
			grpChilds[0].y = 0;
			grpChilds[1].x = 65;
			grpChilds[1].y = 0;
		}
	}
	/**
	 * 添加牌
	 * @param cardId
	 */
	addCard(cardId, showAni:boolean):void {
		GameDZPKSoundManager.playSendHand();
		let card:CardDzpk = CardDzpk.create({pid:0});
		card.pokerId = cardId;
		card.scaleX = card.scaleY = 0.55;
		this.handCardGroup.addChild(card);
		if(server.seatid == this._userInfoData.seatid){
			this.ajustCardPos();
		}else{
			let child = this.handCardGroup.$children;
			if(child.length == 2){
				child[0].x = -6;
				child[0].y = 0;
				child[1].x = 30;
				child[1].y = 0;
			}
		}
		card.showFront(showAni);
	}

	/**
	 * 设置牌型
	 */
	public setCardType(type):void{
		let sType = CARD_TYPE_INFO[type];
		if(this._userInfoData.seatid == server.seatid){
			this.showCardTypeGrp(true);
			this._showCardTypeLabel(sType);
		}else{
			this._setNick(sType);
		}
	}

	public get timeValue():number{return this._timeValue}

	public set timeValue(v:number){
		if(this._timeValue != v){
			this._timeValue = v;			
			if(v >= this._srcTime * 0.6){
				this.setCDType(3);
			}else if(v >= this._srcTime * 0.33){
				this.setCDType(2);
			}
			this._setTimeValue(v);
		}
	}

	/**
	 * 设置当前的倒计时的值
	 */
	private _setTimeValue(v:number):void{
		let g:egret.Graphics = this._timeShape.graphics;

		let beginR:number = v;

		let r = this._shapRadius;
		let bx:number = this._shapCenter.x;
		let by:number = this._shapCenter.y;

		g.clear();
		g.beginFill(0xFF0000);
		g.moveTo(bx, by);
		g.drawArc(bx, by, r, beginR, Math.PI * 2 + this._timeOffset);
		g.lineTo(bx, by);
		g.endFill();
	}

	/**
	 * 倒计时完成
	 */
	private _onCdEnd(cb):void{
		if(this._userInfoData.seatid == server.uid){
			GameDZPKSoundManager.playOpTimeout();
		}
		if(cb){
			cb();
		}
	}

	/**
	 * 设置cd的类型：1:绿色 2:黄色   3:橙色
	 */
	setCDType(type:number):void{
		let _name = this._timeTypes[1];
		if(this._timeTypes[type]){
			_name = this._timeTypes[type];
		}
		this.timeImg.source = _name;
	}

	/**
	 * 设置昵称的颜色
	 */
	private _setNickCol(col):void{
		this["nameLabel"].textColor = col;
	}

	/**
	 * 设置昵称
	 */
	setNickName(name:string = null):void{
		this._setNickCol(0xFFFFFF);
		this._setNick(name);
	}

	/**
	 * 获取玩家当前带入桌子剩余的金豆
	 */
	getGold():number{
		let gold = this._userInfoData.getGold();
		if(!gold ||gold<0){
			gold = 0;
		}
		return gold;
	}
	/**
	 * 开始CD 秒
	 * @param cd
	 */
	startCD(cd:number,cb:Function = null):void {
		//console.log('startCD==座位号=>',this._userInfoData.seatid,"时间:",cd);
		if(this._userInfoData.seatid == server.uid){
			GameDZPKSoundManager.playTurn();
		}
		this.stopCD();
		this.timeValue = this._timeOffset;
		let srcTime = Math.PI * 2 + this._timeOffset;
		this._srcTime = srcTime;
		this.setCDType(1);
		this._showTime(true);
		this._timeTween = egret.Tween.get(this).to({timeValue: srcTime}, cd*1000).call(this._onCdEnd.bind(this,cb));
	}

	/**
	 * 隐藏CD
	 */
	stopCD():void {
		//console.log('stopCD==座位号=>',this._userInfoData.seatid);
		this._showTime(false);
		if(this._timeTween){
			this._timeTween.setPaused(true);
		}
	}

	/**
	 * 清理手牌
	 */
	cleanHand():void {
		let card:CardDzpk;
		while(this.handCardGroup.numChildren > 0){
			card = <CardDzpk>this.handCardGroup.removeChildAt(0);
			CardDzpk.recycle(card);
		}
	}

	/**
	 * 获取桌子上两张牌的中心点坐标
	 * idx 1,2
	 */
	getFlagCCGPosBtIdx(idx):any{
		let img:any = this["card" + idx + "Img"];
		if(this.userInfoData.seatid == server.uid){
			img = this.handCardGroup;
		}
		let pos = img.localToGlobal(img.width*img.scaleX*0.5,img.height*img.scaleY*0.5);
		return pos;
	}
	
	/**
	 * 本轮下注的筹码飞到底池位置
	 */
	flyChipToPool(x,y,time:number,cb:Function):void{
		let obj = this.chipInfo;
		let w = obj.width;
		let h = obj.height;
		let srcX = obj["srcX"];
		let srcY = obj["srcY"];
		GameDZPKSoundManager.playChipToPool();
		let lPos = this["rootGrp"].globalToLocal(x - w*obj.scaleX*0.5,y - h *obj.scaleY* 0.5);
		egret.Tween.get(obj).set({x:srcX,y:srcY}).to({x:lPos.x,y:lPos.y},time).call(()=>{
			this.showChipInfo(false);
			this.setHasChipNum(0);
			cb(this);
		})
	}

	/**
	 * 本轮是否下过注
	 */
	isChipedThisTurn():boolean{
		if(this.chipInfo.visible && this.chipInfo.getGold() > 0){
			return true;
		}
		return false;
	}

	/**
	 * 获取玩家头像的中心点
	 */
	getHeadCGPos():egret.Point{
		if(!this._avatarglobalPos){
			let obj = this["headImg"];
			this._avatarglobalPos = obj.localToGlobal(obj.width *0.5,obj.height*0.5);
		}
		return this._avatarglobalPos;
	}	

	/**
	 * 离开桌子
	 */
	setLeaveTable():void{
		this.clean(true);
		this.visible = false;
	}

	/**
	 * 进入桌子
	 */
	setInTable():void{
		this.clean();
		this.visible = true;
	}
}