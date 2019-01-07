/**
 *
 * @author 
 *
 */
class PDKDragonJingDeng extends PDKDragonBase {
    private armature: dragonBones.Armature;
    public constructor() {
        super("pdk_jingdeng");
        this.armature = this.addArmature("pdk_jingdeng");
    }

    protected addToStage(e: egret.Event): void {
        super.addToStage(e);
        this.play();
    }

    protected removeFromStage(e: egret.Event): void {
        super.removeFromStage(e);
        this.stop();
    }

    public stop(): void {
        this.armature.animation.gotoAndStopByFrame("pdk_jingdeng",1);
    }

    public play(): void {
        this.armature.addEventListener(egret.Event.COMPLETE,this.onComplete.bind(this),this);
        this.armature.animation.gotoAndPlayByFrame("pdk_jingdeng",1,-1);
    }

    private onComplete(e: egret.Event): void {
        if(this.parent)
            this.parent.removeChild(this);
    }
}
