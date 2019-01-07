/**
 *
 * @author 
 *
 */
class PDKDragonGameLianDui extends PDKDragonBase {
    private armature: dragonBones.Armature;
    private needMinnor:boolean;
    public constructor(needMinnor:boolean) {
        super("pdk_gm_shunziliandui");
        this.needMinnor=needMinnor;
        this.armature = this.addArmature("pdk_shunziliandui");
        this.armature.display.scaleX = 1.2;
        this.armature.display.scaleY = 1.2;
        this.armature.animation.timeScale=0.6;
    }

    protected addToStage(e: egret.Event): void {
        super.addToStage(e);
        this.onResize(e);
        this.play();
    }

    protected removeFromStage(e: egret.Event): void {
        super.removeFromStage(e);
        this.stop();
    }

    protected onResize(e: egret.Event): void {
        
    }

    public stop(): void {
        this.armature.animation.gotoAndStopByFrame("pdk_liandui",1);
    }

    public play(): void {        
       /* if(this.needMinnor)
        {
            this.armature.getBone("image_301").visible=true;
            this.armature.getBone("image_30").visible = false;
        }
        else
        {
            this.armature.getBone("image_301").visible = false;
            this.armature.getBone("image_30").visible = true;
        }*/
        this.armature.addEventListener(egret.Event.COMPLETE,this.onComplete.bind(this),this);
        this.armature.animation.gotoAndPlayByFrame("pdk_liandui",1,1);
    }

    private onComplete(e: egret.Event): void {
        if(this.parent)
            this.parent.removeChild(this);
    }
}
