/**
 *
 * @author 
 *
 */
class CCDDZDragonJingDeng extends CCDDZDragonBase {
    private armature: dragonBones.Armature;
    public constructor() {
        super("cc_jingdeng");
        this.armature = this.addArmature("cc_jingdeng");
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
        this.armature.animation.gotoAndStopByFrame("cc_jingdeng",1);
    }

    public play(): void {
        this.armature.addEventListener(egret.Event.COMPLETE,this.onComplete.bind(this),this);
        this.armature.animation.gotoAndPlayByFrame("cc_jingdeng",1,-1);
    }

    private onComplete(e: egret.Event): void {
        if(this.parent)
            this.parent.removeChild(this);
    }
}
