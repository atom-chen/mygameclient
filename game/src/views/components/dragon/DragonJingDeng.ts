/**
 *
 * @author 
 *
 */
class DragonJingDeng extends DragonBase {
    private armature: dragonBones.Armature;
    public constructor() {
        super("jingdeng");
        this.armature = this.addArmature("jingdeng");
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
        this.armature.animation.gotoAndStopByFrame("jingdeng",1);
    }

    public play(): void {
        this.armature.addEventListener(egret.Event.COMPLETE,this.onComplete.bind(this),this);
        this.armature.animation.gotoAndPlayByFrame("jingdeng",1,-1);
    }

    private onComplete(e: egret.Event): void {
        if(this.parent)
            this.parent.removeChild(this);
    }
}
