/**
 * Created by rockyl on 16/3/30.
 *
 * 比赛倒计时面板
 */

class PDKPanelMatchCountDown extends PDKalien.PDKPanelBase {
	private static _instance:PDKPanelMatchCountDown;
	public static get instance():PDKPanelMatchCountDown {
		if (this._instance == undefined) {
			this._instance = new PDKPanelMatchCountDown();
		}
		return this._instance;
	}

	public labTitle: eui.Label;
	public labCD: eui.BitmapLabel;
	public labReward: eui.Label;
	public grpButtons: eui.Group;
	public labelDisplay: eui.Label;
	/**
	 * 报名人数
	 */
	public sign_label:eui.Label;
	/**
	 * 定时请求报名人数
	 */
	private matchinforeqTick:any;

	private roomInfo:any;
	private _timer:number;

	protected init():void {
		this.skinName = panels.PDKPanelMatchCountDownSkin;
	}

	constructor() {
		super(
			PDKalien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backOut},
			PDKalien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backIn}
		);
	}

	createChildren():void {
		super.createChildren();

		this.grpButtons.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGrpButtonsTap, this);
	}

	private onGrpButtonsTap(event:egret.TouchEvent):void{
		let matchConfig:any;
		switch(event.target.name){
			case 'reward_intro':
				matchConfig = PDKGameConfig.getMatchConfigById(this.roomInfo.matchId);
				PDKPanelMatchIntro.instance.show(PDKlang.match_title_reward_intro, matchConfig.reward);
				break;
			case 'match_intro':
				matchConfig = PDKGameConfig.getMatchConfigById(this.roomInfo.matchId);
				PDKPanelMatchIntro.instance.show(PDKlang.match_title_match_intro, matchConfig.des);
				break;
			case 'close':
				this.dealAction();
				break;
			case 'cancel':
				PDKMatchService.instance.cancelMatch(this.roomInfo);
				break;
		}
	}

	show(roomInfo:any):void{
		this.popup();

		this.roomInfo = roomInfo;

		this.labTitle.text = roomInfo.name;
		this.labReward.text = roomInfo.masterReward;

		//zhu PDKMatchService 里面取下一期的时间
		let tsNow:number = pdkServer.tsNow;
		/*let tsNext:number = 0;
		if(roomInfo.cycleTimeStamp){
			tsNext = roomInfo.cycleTimeStamp[roomInfo.nextIndex];
		}*/
		let nextTurn:any = PDKMatchService.getNextTurn(roomInfo);
		let tsNext = nextTurn.nextTs;

		this._updateSignNum(0);
		pdkServer.addEventListener(PDKEventNames.USER_MATCH_SING_UP_INFO_REP, this.onMatchSignUpInfoRep, this);
		pdkServer.getMatchSignUpInfo(roomInfo.matchId);

		this._timer = PDKCountDownService.register((tsNext - tsNow), this.onTimer.bind(this));
	}

	close():void {
		super.close();

		PDKCountDownService.unregister(this._timer);
		egret.clearTimeout(this.matchinforeqTick);
		pdkServer.removeEventListener(PDKEventNames.USER_MATCH_SING_UP_INFO_REP, this.onMatchSignUpInfoRep, this);
	}

	private onTimer(timer:number):void{
		this.labCD.text = PDKalien.TimeUtils.timeFormat(timer, '{2}:{1}:{0}');
	}
	/**
	 * 更新报名的玩家数
	 */
	private _updateSignNum(num:number):void{
		this.sign_label.text = "已报名人数：" + num + "人";
	}

	private onMatchSignUpInfoRep(event:egret.Event):void{
		let data:any = event.data;
		if(data && data.matchid == this.roomInfo.matchId && data.signup_cnt && data.signup_cnt > 0){
			if(data.is_signup == 1){ // 已报名
				this._updateSignNum(data.signup_cnt);
				this.matchinforeqTick = egret.setTimeout(function() {
					if(this.roomInfo && this.roomInfo.matchId){
						pdkServer.getMatchSignUpInfo(this.roomInfo.matchId);
					}
				}, this, 100000);
			}
		}
	}
}