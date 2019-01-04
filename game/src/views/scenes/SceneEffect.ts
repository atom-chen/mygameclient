/**
 * Created by rockyl on 16/6/15.
 */

class SceneEffect extends alien.SceneBase {
    public goldRainEffectLayer: GoldRainEffectLayer;

    constructor() {
        super();

        this.init();
    }

    private init(): void {
        this.skinName = scenes.SceneEffectSkin;
    }

    createChildren(): void {
        super.createChildren();

        alien.Dispatcher.addEventListener(EventNames.GOLD_RAIN_EFFECT,this.onGoldRainEffect,this);
    }

    private onGoldRainEffect(event: egret.Event): void {
        this.goldRainEffectLayer.play();
    }

    beforeShow(params: any): void {

    }
}