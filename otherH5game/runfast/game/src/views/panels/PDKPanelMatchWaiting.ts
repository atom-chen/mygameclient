/**
 * Created by rockyl on 16/3/29.
 *
 * 等待开赛面板
 */

class PDKPanelMatchWaiting extends PDKalien.PDKPanelBase {
	private static _instance:PDKPanelMatchWaiting;
	public static get instance():PDKPanelMatchWaiting {
		if (this._instance == undefined) {
			this._instance = new PDKPanelMatchWaiting();
		}
		return this._instance;
	}

	public labReward: eui.Label;
	public labTitle: eui.Label;
	public btnCancelMath: eui.Button;
	public labelDisplay: eui.Label;
	public progressBar: PDKQProgressBar;

	private roomInfo:any;
	private _timer:number;
	private fakeCount:number[];
	private matchinforeqTick:any;
	/**
	 * 比赛等待界面是否已经显示
	 */
	private _isShow:boolean;
	protected init():void {
		this.skinName = panels.PDKPanelMatchWaitingSkin;
	}

	constructor() {
		super(
			PDKalien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backOut},
			PDKalien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backIn}
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
					if(PDKPanelMatchWaiting.instance.roomInfo && PDKPanelMatchWaiting.instance.roomInfo.matchId){
						pdkServer.getMatchSignUpInfo(PDKPanelMatchWaiting.instance.roomInfo.matchId);
					}
				}, this, 5000);
			}
		}
	}

	private onBtnCancelMatchTap(event:egret.TouchEvent):void{
		this.dealAction();
		PDKMatchService.instance.cancelMatch(this.roomInfo);
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
			pdkServer.addEventListener(PDKEventNames.USER_MATCH_SING_UP_INFO_REP, this.onMatchSignUpInfoRep, this);
			pdkServer.getMatchSignUpInfo(roomInfo.matchId);
		}else{
			this.progressBar.value = 0;
			this.fakeCount = PDKalien.MathUtils.split(roomInfo.maxPlayer, PDKalien.MathUtils.makeRandomInt(roomInfo.startTimeout[1], roomInfo.startTimeout[0]));
			this._timer = egret.setInterval(()=>{
				this.progressBar.value += this.fakeCount.pop() || 0;
			}, this, 1000);
		}
	}

	close():void {
		super.close();
		this._isShow = false;
		egret.clearTimeout(this.matchinforeqTick);
		pdkServer.removeEventListener(PDKEventNames.USER_MATCH_SING_UP_INFO_REP, this.onMatchSignUpInfoRep, this);
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