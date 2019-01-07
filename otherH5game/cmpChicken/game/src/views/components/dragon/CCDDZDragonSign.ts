/**
 *
 * @author 
 *
 */
class CCDDZDragonSign extends CCDDZDragonBase {
    private armature: dragonBones.Armature;
    private rect: eui.Rect;
    public constructor() {
        super("cc_sign");
        this.armature = this.addArmature("cc_sign");
        
        //        this.armature.animation.timeScale = 0.5;
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
        if(this.timeOutId)
            egret.clearTimeout(this.timeOutId);
        this.armature.removeEventListener(egret.Event.COMPLETE,this.onComplete.bind(this),this);
        this.armature.animation.gotoAndStop("cc_sign");
    }

    public play(): void {
        this.armature.addEventListener(egret.Event.COMPLETE,this.onComplete.bind(this),this);
        this.armature.animation.gotoAndPlayByFrame("cc_sign",1,1);
    }

    private timeOutId: number;
    private onComplete(e: egret.Event): void {
//        this.timeOutId = setTimeout(() => {
        this.armature.animation.gotoAndPlayByFrame("cc_sign",30,1);
//        },2000);

    }
}
