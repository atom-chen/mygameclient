/**
 *
 * @author 
 *
 */
class PDKDragonSignBtn extends PDKDragonBase {
    private armature: dragonBones.Armature;
    private rect: eui.Rect;
    public constructor() {
        super("signBtn");
        this.armature = this.addArmature("signBtn");
        this.touchChildren=false;
        this.touchEnabled=false;
        //        this.armature.animation.timeScale = 0.5;
    }

    protected addToStage(e: egret.Event): void {
        super.addToStage(e);
        this.play();
    }

    protected removeFromStage(e: egret.Event): void {
        super.removeFromStage(e);
        this.stop();
        if (this.parent)
            this.parent.removeChild(this);
    }

    public stop(): void {   
        this.armature.animation.gotoAndStop("signBtn");
    }

    public play(): void {      
        this.armature.animation.gotoAndPlayByFrame("signBtn",1,-1);
    }
}
