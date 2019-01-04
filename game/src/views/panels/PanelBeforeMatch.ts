/**
 * Created by rockyl on 16/3/31.
 *
 * 比赛场次前提示
 */

class PanelBeforeMatch extends alien.PanelBase {
	private static _instance:PanelBeforeMatch;
	public static get instance():PanelBeforeMatch {
		if (this._instance == undefined) {
			this._instance = new PanelBeforeMatch();
		}
		return this._instance;
	}

	public img:eui.Image;
	public labCount:eui.Label;
	public grpCount:eui.Group;

	protected init():void {
		this.skinName = panels.PanelBeforeMatchSkin;
	}

	constructor() {
		super(
			alien.popupEffect.Flew, {withFade: true, ease: egret.Ease.backOut, direction: 'up'},
			alien.popupEffect.Flew, {withFade: true, ease: egret.Ease.backIn, direction: 'up'}
		);
	}

	createChildren():void {
		super.createChildren();

	}

	show(stageCount:number, matchMode:number, turnCount:number = 0):void{
		this.popup();

		let res:string;
		if(stageCount == 1){
			res = ResNames.match_word_4;
		}else{
			if(matchMode == 3){ //新模式
				matchMode = 1;
			}
			res = matchMode > 1 ? ResNames.match_word_6 : ResNames.match_word_5;
		}

		if(turnCount > 1){
			this.labCount.text = turnCount.toString();
		}
		this.grpCount.visible = turnCount > 1;

		this.img.source = res;

		egret.setTimeout(this.dealAction, this, 2000);
	}
}