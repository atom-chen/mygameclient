/**
 * Created by rockyl on 16/6/7.
 *
 * 金豆雨动画
 */

class PDKGoldRainEffectLayer extends eui.Group {
	private _goldItems:GoldItem[];

	createChildren():void {
		super.createChildren();

	}

	play():void{
		if(!this._goldItems){
			this._goldItems = [];
			let factory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(RES.getRes(PDKResNames.pdk_ani_coin_json), RES.getRes(PDKResNames.pdk_ani_coin_png));
			for(let i = 0; i < 35; i++){
				let goldItem:GoldItem = new GoldItem(factory);
				this._goldItems.push(goldItem);
			}
		}

		this._goldItems.forEach((goldItem:GoldItem)=>{
			this.addChild(goldItem);
			goldItem.playFall();
		});

		PDKalien.PDKSoundManager.instance.playEffect(PDKResNames.pdk_effect_gold_rain);
	}
}

class GoldItem extends egret.DisplayObjectContainer{
	private _mc:egret.MovieClip;

	constructor(factory:egret.MovieClipDataFactory) {
		super();

		this._mc = new egret.MovieClip(factory.generateMovieClipData('coin'));
		this.addChild(this._mc);

		this._mc.scaleX = this._mc.scaleY = 0.8;
	}

	playFall():void{
		this.x = Math.random() * this.stage.stageWidth;
		this.y = -70;
		this.alpha = 1;
		this._mc.play(-1);
		//this.rotation = Math.random() * 360;

		egret.Tween.get(this, null, null, true).wait(Math.random() * 1000).to({y: this.stage.stageHeight - 53}, 1500, egret.Ease.bounceOut).to({alpha: 0}, 200).call(()=>{
			this.parent.removeChild(this);
		});
	}
}