/**
 * Created by rockyl on 16/3/31.
 *
 * 比赛场次前提示
 */

class CCDDZPanelBeforeMatch extends CCalien.CCDDZPanelBase {
	private static _instance:CCDDZPanelBeforeMatch;
	public static get instance():CCDDZPanelBeforeMatch {
		if (this._instance == undefined) {
			this._instance = new CCDDZPanelBeforeMatch();
		}
		return this._instance;
	}

	public img:eui.Image;
	public labCount:eui.Label;
	public grpCount:eui.Group;

	protected init():void {
		this.skinName = panels.CCDDZPanelBeforeMatchSkin;
	}

	constructor() {
		super(
			CCalien.CCDDZpopupEffect.Flew, {withFade: true, ease: egret.Ease.backOut, direction: 'up'},
			CCalien.CCDDZpopupEffect.Flew, {withFade: true, ease: egret.Ease.backIn, direction: 'up'}
		);
	}

	createChildren():void {
		super.createChildren();

	}

	show(stageCount:number, matchMode:number, turnCount:number = 0):void{
		this.popup();

		let res:string;
		if(stageCount == 1){
			res = CCGlobalResNames.cc_match_word_4;
		}else{
			if(matchMode == 3){ //新模式
				matchMode = 1;
			}
			res = matchMode > 1 ? CCGlobalResNames.cc_match_word_6 : CCGlobalResNames.cc_match_word_5;
		}

		if(turnCount > 1){
			this.labCount.text = turnCount.toString();
		}
		this.grpCount.visible = turnCount > 1;

		this.img.source = res;

		egret.setTimeout(this.dealAction, this, 2000);
	}
}