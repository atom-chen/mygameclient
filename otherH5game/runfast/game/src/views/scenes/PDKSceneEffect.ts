/**
 * Created by rockyl on 16/6/15.
 */

class PDKSceneEffect extends PDKalien.SceneBase {
    public goldRainEffectLayer: PDKGoldRainEffectLayer;

    constructor() {
        super();

        this.init();
    }

    private init(): void {
        this.skinName = scenes.PDKSceneEffectSkin;
    }

    createChildren(): void {
        super.createChildren();

        PDKalien.Dispatcher.addEventListener(PDKEventNames.GOLD_RAIN_EFFECT,this.onGoldRainEffect,this);
    }

    private onGoldRainEffect(event: egret.Event): void {
        this.goldRainEffectLayer.play();
    }

    beforeShow(params: any): void {

    }
}