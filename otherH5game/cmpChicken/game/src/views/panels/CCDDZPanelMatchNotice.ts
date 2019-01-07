/**
 * Created by rockyl on 16/4/6.
 *
 * 比赛30秒提示
 */

class CCDDZPanelMatchNotice extends CCalien.CCDDZPanelBase {
	private static _instance:CCDDZPanelMatchNotice;
	public static get instance():CCDDZPanelMatchNotice {
		if (this._instance == undefined) {
			this._instance = new CCDDZPanelMatchNotice();
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
		this.skinName = panels.CCDDZPanelMatchNoticeSkin;
	}

	constructor() {
		super(
			CCalien.CCDDZpopupEffect.Scale, {withFade: true, ease: egret.Ease.backOut},
			CCalien.CCDDZpopupEffect.Scale, {withFade: true, ease: egret.Ease.backIn}
		);

		this._matchTopNotify = CCalien.CCDDZUtils.parseColorTextFlow(lang.match_notice_alert);
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
		CCDDZMatchService.instance.cancelMatch(this.roomInfo);
		this.dealAction(event.target.name);
	}

	show(roomInfo:any, countDown:number = 30):void{
		this.popup();

		this.roomInfo = roomInfo;

		this._matchTopNotify[1].text = this.roomInfo.name;

		this._timer = CCDDZCountDownService.register(countDown, this.onTimer.bind(this));
	}

	close():void {
		super.close();

		CCDDZCountDownService.unregister(this._timer);
	}

	private onTimer(time:number):void{
		this._matchTopNotify[3].text = time.toString();
		this.labContent.textFlow = this._matchTopNotify;
	}
}