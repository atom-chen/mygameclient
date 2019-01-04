/**
 * Created by rockyl on 16/3/31.
 */

class PanelMatchResult extends alien.PanelBase {
	private static _instance:PanelMatchResult;
	public static get instance():PanelMatchResult {
		if (this._instance == undefined) {
			this._instance = new PanelMatchResult();
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
	private _switchTimer:number = null;

	private matchId: number;
	private rank: number;

	private rewardContent:any;
	protected init():void {
		this.skinName = panels.PanelMatchResultSkin;
		this.list.itemRenderer = RankItem;

		this.list.dataProvider = this._dataProvide = new eui.ArrayCollection();


		if(!this._switchTimer){
            this._switchTimer = alien.Schedule.setInterval(this.switchGroup, this,1000 * 2);
        }
	}

	constructor() {
		super(
			alien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backOut},
			alien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backIn}
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
		alien.Schedule.reset(this._switchTimer);
		alien.Schedule.start(this._switchTimer);
	}

	private switchGroup(event:egret.TouchEvent):void{
		this.grpRank.visible = !this.grpRank.visible;
		this.grpResult.visible = !this.grpResult.visible;
	}

	private onBtnCancelTap(event:egret.TouchEvent):void{
		if(this.rewardContent && this.rewardContent.length > 0) {
			if (alien.Native.instance.isNative) {
				Alert.show('领取奖励：'+this.rewardContent+' 成功')//zhu 暂时屏蔽, 2, this.onAlertBtn);
			} else {
				Alert.show('领取奖励：'+this.rewardContent+' 成功');
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
			let shareScene: number = ShareImageManager.instance.getShareScene(ShareImageManager.GAME_TYPE_MATCH, code);
			ShareImageManager.instance.start(server.uid, shareScene);
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

		let userInfoData:UserInfoData = MainLogic.instance.selfData;		
		this.labPlayerName.text = userInfoData.nickname + ':';
			
		this.labMatchName.text = lang.format(lang.id.match_result_match_name, server.roomInfo.name);
		let num:number = data.params[0];
		this.labNumber.text = num.toString();
		this.labPraise.text = lang.match_result_praise[num > 3 ? 2 : (num > 1 ? 1 : 0)];
		let reward = "";
		if(data.strreward){
			reward = this._formatRewInfo(data.strreward);
		}else{
			reward = MatchService.getRewardStringByRank(server.roomInfo, num, '\n');
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

class RankItem extends eui.ItemRenderer {
    private rank: eui.Label;
    private nickName: eui.Label;
    private score: eui.Label;
	private inmatch:eui.Label;
    createChildren(): void {
		// this.skinName = rankItemSkin;
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
		this.nickName.text = Base64.decode(this.data.nickname);
		

		if(MainLogic.instance.selfData.uid == this.data.uid){
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