/**
 * Created by rockyl on 16/6/15.
 */

class CCDDZSceneEffect extends CCalien.CCDDZSceneBase {
    public goldRainEffectLayer: CCDDZGoldRainEffectLayer;

    constructor() {
        super();

        this.init();
    }

    private init(): void {
        this.skinName = scenes.CCDDZSceneEffectSkin;
    }

    createChildren(): void {
        super.createChildren();

        CCalien.CCDDZDispatcher.addEventListener(CCGlobalEventNames.GOLD_RAIN_EFFECT,this.onGoldRainEffect,this);
    }

    private onGoldRainEffect(event: egret.Event): void {
        this.goldRainEffectLayer.play();
    }

    beforeShow(params: any): void {

    }
}