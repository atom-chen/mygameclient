/**
 * Created by rockyl on 16/3/29.
 *
 * 等待开赛面板
 */

class PanelMatchWaiting extends alien.PanelBase {
	private static _instance:PanelMatchWaiting;
	public static get instance():PanelMatchWaiting {
		if (this._instance == undefined) {
			this._instance = new PanelMatchWaiting();
		}
		return this._instance;
	}

	public labReward: eui.Label;
	public labTitle: eui.Label;
	public btnCancelMath: eui.Button;
	public labelDisplay: eui.Label;
	public progressBar: QProgressBar;

	private roomInfo:any;
	private _timer:number;
	private fakeCount:number[];
	private matchinforeqTick:any;
	/**
	 * 比赛等待界面是否已经显示
	 */
	private _isShow:boolean;
	protected init():void {
		this.skinName = panels.PanelMatchWaitingSkin;
	}

	constructor() {
		super(
			alien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backOut},
			alien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backIn}
		);
	}

	createChildren():void {
		super.createChildren();
		this._isShow = false;
		this.btnCancelMath.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnCancelMatchTap, this);
	}

	private onMatchSignUpInfoRep(event:egret.Event):void{
		let data:any = event.data;

		if(data && data.matchid == this.roomInfo.matchId && data.signup_cnt && data.signup_cnt > 0){
			this.progressBar.value = data.signup_cnt

			if(data.is_signup == 1){ // 已报名
				this.matchinforeqTick = egret.setTimeout(function() {
					if(PanelMatchWaiting.instance.roomInfo && PanelMatchWaiting.instance.roomInfo.matchId){
						server.getMatchSignUpInfo(PanelMatchWaiting.instance.roomInfo.matchId);
					}
				}, this, 5000);
			}
		}
	}

	private onBtnCancelMatchTap(event:egret.TouchEvent):void{
		this.dealAction();
		MatchService.instance.cancelMatch(this.roomInfo);
	}

	show(roomInfo:any):void{
		this.popup();
		this.roomInfo = roomInfo;
		this._isShow = true;
		this.labReward.text = roomInfo.masterReward;
		this.progressBar.maximum = roomInfo.maxPlayer;

		this.labTitle.text = this.roomInfo.name;
		if(this.roomInfo.forbidRobot && this.roomInfo.forbidRobot == 1){
			this.progressBar.value = 1;
			server.addEventListener(EventNames.USER_MATCH_SING_UP_INFO_REP, this.onMatchSignUpInfoRep, this);
			server.getMatchSignUpInfo(roomInfo.matchId);
		}else{
			this.progressBar.value = 0;
			this.fakeCount = alien.MathUtils.split(roomInfo.maxPlayer, alien.MathUtils.makeRandomInt(roomInfo.startTimeout[1], roomInfo.startTimeout[0]));
			this._timer = egret.setInterval(()=>{
				this.progressBar.value += this.fakeCount.pop() || 0;
			}, this, 1000);
		}
	}

	close():void {
		super.close();
		this._isShow = false;
		egret.clearTimeout(this.matchinforeqTick);
		server.removeEventListener(EventNames.USER_MATCH_SING_UP_INFO_REP, this.onMatchSignUpInfoRep, this);
		if(this._timer > 0){
			egret.clearInterval(this._timer);
			this._timer = 0;
		}
	}

	/**
	 * 检查等待界面是否已经显示
	 */
	public isWaitingShow():boolean{
		return this._isShow;
	}
}