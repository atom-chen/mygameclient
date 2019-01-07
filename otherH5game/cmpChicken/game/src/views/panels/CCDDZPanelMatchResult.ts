/**
 * Created by rockyl on 16/3/31.
 */

class CCDDZPanelMatchResult extends CCalien.CCDDZPanelBase {
	private static _instance:CCDDZPanelMatchResult;
	public static get instance():CCDDZPanelMatchResult {
		if (this._instance == undefined) {
			this._instance = new CCDDZPanelMatchResult();
		}
		return this._instance;
	}

	private labPlayerName: eui.Label;
	private labMatchName: eui.Label;
	private labPraise: eui.Label;
	private labReward: eui.Label;
	private labNumber: eui.BitmapLabel;
	private btnConfirm: eui.Button;
	private grpReward:eui.Group;

	private btnGetReward:eui.Button;
	private list:eui.List;
	private _dataProvide:eui.ArrayCollection;

	private grpRank:eui.Group;
	private grpResult:eui.Group;
	private _switchTimer:egret.Timer;

	private matchId: number;
	private rank: number;

	private rewardContent:any;
	protected init():void {
		this.skinName = panels.CCDDZPanelMatchResultSkin;
		this.list.itemRenderer = CCDDZRankItem;

		this.list.dataProvider = this._dataProvide = new eui.ArrayCollection();


		if(!this._switchTimer){
            this._switchTimer = new egret.Timer(1000 * 2);
            this._switchTimer.addEventListener(egret.TimerEvent.TIMER, this.switchGroup, this);
            this._switchTimer.start();
        }
	}

	constructor() {
		super(
			CCalien.CCDDZpopupEffect.Scale, {withFade: true, ease: egret.Ease.backOut},
			CCalien.CCDDZpopupEffect.Scale, {withFade: true, ease: egret.Ease.backIn}
		);
	}

	createChildren():void {
		super.createChildren();

		this.btnConfirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnCancelTap, this);
		this.btnGetReward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnCancelTap, this);

		this.grpRank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickSwitch, this);
		this.grpResult.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickSwitch, this);
	}

	private clickSwitch():void{
		this.switchGroup(null);
		this._switchTimer.reset();
		this._switchTimer.start();
	}

	private switchGroup(event:egret.TouchEvent):void{
		this.grpRank.visible = !this.grpRank.visible;
		this.grpResult.visible = !this.grpResult.visible;
	}

	private onBtnCancelTap(event:egret.TouchEvent):void{
		if(this.rewardContent && this.rewardContent.length > 0) {
			if (CCalien.Native.instance.isNative) {
				CCDDZAlert.show('领取奖励：'+this.rewardContent+' 成功')//zhu 暂时屏蔽, 2, this.onAlertBtn);
			} else {
				CCDDZAlert.show('领取奖励：'+this.rewardContent+' 成功');
			}
		}
		this.dealAction();
	}

	private onAlertBtn(action: string, data: any): void {
		if (action == 'cancel') {
			let code: number = this.rank;
			if (this.matchId == 204) {	// 200元赛
				code += 200;
			} else if (this.matchId == 201) {	// 500元赛
				code += 500;
			}
			let shareScene: number = CCDDZShareImageManager.instance.getShareScene(CCDDZShareImageManager.GAME_TYPE_MATCH, code);
			CCDDZShareImageManager.instance.start(ccserver.uid, shareScene);
		}
	}

	/**
	 * 格式化奖励信息
	 */
	private _formatRewInfo(strRew:string):any{
		let _info= {
			[0]:"金豆:{0}",
			[1]:"奖杯:{0}",
			[2]:"记牌器:{0}小时",
			[101]:"表情免费次数:{0}次"
		}

		let _formatItem = function(_id:number,count:number):any{
			let _num = count;
			if(_info[_id]){
				if(_id == 1){
					_num = count / 100;
				}
				return _info[_id].replace("{0}",_num);
			}
		}

		let _array = strRew.split("|");
		let _sText = "";
		if(_array[0]){
			let _item = _array[0].split(":");
			if(_item){
				_sText = _formatItem(Number(_item[0]),Number(_item[1]));
			}
		}
		/*for(let i=0;i<_array.length;++i){
			if(_array[i]){
				let _item = _array[i].split(":");
				if(_item){
					let _str = _formatItem(Number(_item[0]),Number(_item[1]));
					_sText += _str + ",";
				}
			}
		}*/
		return _sText;
	}

	show(data:any, callback:Function):void{
		this._callback = callback;
		this.popup();

		this.grpRank.visible = false;
		this.grpResult.visible = true;

		this.matchId = data.matchid;
		this.rank = data.params[0];

		let userInfoData:CCGlobalUserInfoData = CCDDZMainLogic.instance.selfData;
		this.labPlayerName.text = userInfoData.nickname + ':';
		this.labMatchName.text = lang.format(lang.id.match_result_match_name, ccserver.roomInfo.name);
		let num:number = data.params[0];
		this.labNumber.text = num.toString();
		this.labPraise.text = lang.match_result_praise[num > 3 ? 2 : (num > 1 ? 1 : 0)];
		let reward = "";
		if(data.strreward){
			reward = this._formatRewInfo(data.strreward);
		}else{
			reward = CCDDZMatchService.getRewardStringByRank(ccserver.roomInfo, num, '\n');
		}
		this.rewardContent = reward;
		if(reward){
			this.labReward.text = reward;
			this.btnConfirm.visible = false;
			this.btnGetReward.visible = true;
		}else{
			this.btnConfirm.visible = true;
			this.btnGetReward.visible = false;
		}
		this.grpReward.visible = !!reward;

		this._dataProvide.source = data.rankInfo;
	}
}

class CCDDZRankItem extends eui.ItemRenderer {
    private rank: eui.Label;
    private nickName: eui.Label;
    private score: eui.Label;
	private inmatch:eui.Label;
    createChildren(): void {
		// this.skinName = CCDDZrankItemSkin;
        super.createChildren();
    }

    protected dataChanged(): void {
        super.dataChanged();
		
		this.rank.text = this.data.rank
		this.score.text = this.data.score == null ? 0 : this.data.score;
		if(this.data.inmatch && this.data.inmatch == 1){
			this.inmatch.visible = true;
			this.score.visible = false;
		}else{
			this.inmatch.visible = false;
			this.score.visible = true;
		}
		this.nickName.text = CCDDZBase64.decode(this.data.nickname);
		

		if(CCDDZMainLogic.instance.selfData.uid == this.data.uid){
			this.rank.textColor = 0xffe400;
			this.nickName.textColor = 0xffe400;
			this.score.textColor = 0xffe400;
		}else{
			this.rank.textColor = 0xffffff;
			this.nickName.textColor = 0xffffff;
			this.score.textColor = 0xffffff;
		}
    }
}