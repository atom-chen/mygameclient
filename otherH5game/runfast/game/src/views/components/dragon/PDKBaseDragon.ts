/**
 *
 * @author 
 *
 */
class PDKDragonBase extends egret.Sprite {
    public constructor(resName: string) {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this);

        var dragonbonesData = RES.getRes(resName);
        var textureData = RES.getRes(resName + "_texture_json");
        var texture = RES.getRes(resName + "_texture_png");
        // console.log("PDKDragonBase----->",resName,  dragonbonesData, textureData, texture);
        PDKDragonManager.getInstance().addDragon(dragonbonesData, texture, textureData);
    }

    protected addToStage(e: egret.Event): void {
        PDKalien.StageProxy.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
    }

    protected removeFromStage(e: egret.Event): void {
        PDKalien.StageProxy.stage.removeEventListener(egret.Event.RESIZE, this.onResize, this);
    }

    protected onResize(e: egret.Event): void {

    }

    protected addArmature(armatureName: string): dragonBones.Armature {
        var armature: dragonBones.Armature = PDKDragonManager.getInstance().getDragon(armatureName);
        this.addChild(armature.display);
        dragonBones.WorldClock.clock.add(armature);
        return armature;
    }
}
