/**
 * 德州扑克规则
 */

class PanelDzpkRule extends alien.PanelBase {
	private static _instance:PanelDzpkRule;
	private _cards = [
		[{v:CARD_V_10,c:CARD_C_Heart},{v:CARD_V_J,c:CARD_C_Heart},{v:CARD_V_Q,c:CARD_C_Heart},{v:CARD_V_K,c:CARD_C_Heart},{v:CARD_V_A,c:CARD_C_Heart}],
		[{v:CARD_V_3,c:CARD_C_Club},{v:CARD_V_4,c:CARD_C_Club},{v:CARD_V_5,c:CARD_C_Club},{v:CARD_V_6,c:CARD_C_Club},{v:CARD_V_7,c:CARD_C_Club}],
		[{v:CARD_V_J,c:CARD_C_Spade},{v:CARD_V_J,c:CARD_C_Club},{v:CARD_V_J,c:CARD_C_Diamond},{v:CARD_V_J,c:CARD_C_Heart},{v:CARD_V_3,c:CARD_C_Club}],
		[{v:CARD_V_K,c:CARD_C_Spade},{v:CARD_V_K,c:CARD_C_Club},{v:CARD_V_K,c:CARD_C_Diamond},{v:CARD_V_8,c:CARD_C_Club},{v:CARD_V_8,c:CARD_C_Heart}],
		[{v:CARD_V_Q,c:CARD_C_Heart},{v:CARD_V_J,c:CARD_C_Heart},{v:CARD_V_9,c:CARD_C_Heart},{v:CARD_V_7,c:CARD_C_Heart},{v:CARD_V_5,c:CARD_C_Heart}],
		[{v:CARD_V_3,c:CARD_C_Diamond},{v:CARD_V_4,c:CARD_C_Heart},{v:CARD_V_5,c:CARD_C_Spade},{v:CARD_V_6,c:CARD_C_Heart},{v:CARD_V_7,c:CARD_C_Spade}],
		[{v:CARD_V_Q,c:CARD_C_Heart},{v:CARD_V_Q,c:CARD_C_Spade},{v:CARD_V_Q,c:CARD_C_Diamond},{v:CARD_V_4,c:CARD_C_Diamond},{v:CARD_V_6,c:CARD_C_Spade}],
		[{v:CARD_V_J,c:CARD_C_Club},{v:CARD_V_J,c:CARD_C_Diamond},{v:CARD_V_7,c:CARD_C_Diamond},{v:CARD_V_7,c:CARD_C_Heart},{v:CARD_V_4,c:CARD_C_Spade}],
		[{v:CARD_V_J,c:CARD_C_Spade},{v:CARD_V_J,c:CARD_C_Heart},{v:CARD_V_3,c:CARD_C_Spade},{v:CARD_V_9,c:CARD_C_Diamond},{v:CARD_V_5,c:CARD_C_Diamond}],
		[{v:CARD_V_Q,c:CARD_C_Club},{v:CARD_V_10,c:CARD_C_Diamond},{v:CARD_V_8,c:CARD_C_Spade},{v:CARD_V_3,c:CARD_C_Heart},{v:CARD_V_2,c:CARD_C_Spade}],	
	]

	public static get instance():PanelDzpkRule {
		if (this._instance == undefined) {
			this._instance = new PanelDzpkRule();
		}
		return this._instance;
	}


	protected init():void {
		this.skinName = panels.PanelDzpkRule;
	}

	constructor() {
		/*super(alien.popupEffect.Flew, {withFade: true,  direction: 'left',duration:200},
		alien.popupEffect.Flew, {withFade: true, direction: 'left',duration:200});*/
		super();
	}

	createChildren():void {
		super.createChildren();
		this["typeRootGrp"].addEventListener(egret.TouchEvent.TOUCH_TAP, this._touchContent, this);
		this["touchGrp"].addEventListener(egret.TouchEvent.TOUCH_TAP, this._touchEmpty, this);
		this.initCards();
		this.percentWidth = 100;
		this.percentHeight = 100;

	}

	private _touchContent():void{
	}

	private _touchEmpty():void{
		this.close();
	}

	initCards():void{
		let obj;
		let info;
		let padding = 2;
		let scale = 0.45;
		let cfgW  = GameConfig.CARD_WIDTH;
		let cfgH = GameConfig.CARD_HEIGHT;
		for(let i=0;i<10;++i){
			obj = this["type"+ (i+1)+"Grp"];
			for(let j=0;j<5;++j){
				let card:CardDzpk = CardDzpk.create({});
				info = this._cards[i][j];
				card.pokerId = info.v * 10 + info.c;
                card.scaleX = card.scaleY = scale;
				obj.y = 20+i*(padding+cfgH*card.scaleY);
                card.x = 20+ j * (cfgW*scale );
                card.showFront(false);
                obj.addChild(card);
			}
		}
		this["bgImg"].height = 10 * (cfgH*scale + padding) + 40;
	}

	show():void {
		this.popup();
	}
	
	static getInstance():PanelDzpkRule{
		return this._instance;
	}
}
