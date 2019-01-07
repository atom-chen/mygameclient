/**
 * Created by rockyl on 16/3/29.
 *
 * 赛事说明和帮助
 */

class PDKPanelMatchIntro extends PDKalien.PDKPanelBase {
	private static _instance:PDKPanelMatchIntro;
	public static get instance():PDKPanelMatchIntro {
		if (this._instance == undefined) {
			this._instance = new PDKPanelMatchIntro();
		}
		return this._instance;
	}

	public labTitle: eui.Label;
	public btnClose: eui.Button;
	public labContent: eui.Label;
	private info_scroller:eui.Scroller;

	protected init():void {
		this.skinName = panels.PDKPanelMatchIntroSkin;
	}

	constructor() {
		super(
			PDKalien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backOut},
			PDKalien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backIn}
		);
	}

	createChildren():void {
		super.createChildren();

		this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnCloseTap, this);
	}

	private onBtnCloseTap(event:egret.TouchEvent):void{
		this.dealAction();
	}

	show(title:string, content:any):void{
		this.popup(this.dealAction.bind(this));
		this.info_scroller.viewport.scrollV = 0;
    	this.info_scroller.viewport.validateNow();

		this.labTitle.text = title;
		if(typeof content == 'string'){
			this.labContent.text = content;
		}else{
			this.labContent.text = content.join('\n');
		}
	}
}