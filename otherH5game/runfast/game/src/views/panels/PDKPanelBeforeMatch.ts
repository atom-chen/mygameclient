/**
 * Created by rockyl on 16/3/31.
 *
 * 比赛场次前提示
 */

class PDKPanelBeforeMatch extends PDKalien.PDKPanelBase {
	private static _instance:PDKPanelBeforeMatch;
	public static get instance():PDKPanelBeforeMatch {
		if (this._instance == undefined) {
			this._instance = new PDKPanelBeforeMatch();
		}
		return this._instance;
	}

	public img:eui.Image;
	public labCount:eui.Label;
	public grpCount:eui.Group;

	protected init():void {
		this.skinName = panels.PDKPanelBeforeMatchSkin;
	}

	constructor() {
		super(
			PDKalien.popupEffect.Flew, {withFade: true, ease: egret.Ease.backOut, direction: 'up'},
			PDKalien.popupEffect.Flew, {withFade: true, ease: egret.Ease.backIn, direction: 'up'}
		);
	}

	createChildren():void {
		super.createChildren();

	}

	show(stageCount:number, matchMode:number, turnCount:number = 0):void{
		this.popup();

		let res:string;
		if(stageCount == 1){
			res = PDKResNames.match_word_4;
		}else{
			res = matchMode > 1 ? PDKResNames.match_word_6 : PDKResNames.match_word_5;
		}

		if(turnCount > 1){
			this.labCount.text = turnCount.toString();
		}
		this.grpCount.visible = turnCount > 1;

		this.img.source = res;

		egret.setTimeout(this.dealAction, this, 2000);
	}
}