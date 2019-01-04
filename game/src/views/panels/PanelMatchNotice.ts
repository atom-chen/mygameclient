/**
 * Created by rockyl on 16/4/6.
 *
 * 比赛30秒提示
 */

class PanelMatchNotice extends alien.PanelBase {
	private static _instance:PanelMatchNotice;
	public static get instance():PanelMatchNotice {
		if (this._instance == undefined) {
			this._instance = new PanelMatchNotice();
		}
		return this._instance;
	}

	private labContent:eui.Label;
	private grpButton:eui.Group;
	private btnCancelMatch:eui.Button;

	private roomInfo:any;
	private _timer:number;

	private _matchTopNotify:any[];

	protected init():void {
		this.skinName = panels.PanelMatchNoticeSkin;
	}

	constructor() {
		super(
			alien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backOut},
			alien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backIn}
		);

		this._matchTopNotify = alien.Utils.parseColorTextFlow(lang.match_notice_alert);
	}

	createChildren():void {
		super.createChildren();

		this.grpButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGrpButtonTap, this);
		this.btnCancelMatch.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnCancelMatchTap, this);
	}

	private onGrpButtonTap(event:egret.TouchEvent):void {
		this.dealAction(event.target.name);
	}

	private onBtnCancelMatchTap(event:egret.TouchEvent):void{
		MatchService.instance.cancelMatch(this.roomInfo);
		this.dealAction(event.target.name);
	}

	show(roomInfo:any, countDown:number = 30):void{
		this.popup();

		this.roomInfo = roomInfo;

		this._matchTopNotify[1].text = this.roomInfo.name;

		this._timer = CountDownService.register(countDown, this.onTimer.bind(this));
	}

	close():void {
		super.close();

		CountDownService.unregister(this._timer);
	}

	private onTimer(time:number):void{
		this._matchTopNotify[3].text = time.toString();
		this.labContent.textFlow = this._matchTopNotify;
	}
}