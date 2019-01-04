/**
 *
 * @author 
 *
 */
class DragonGameFeiJi extends DragonBase{
    private armature: dragonBones.Armature;
	public constructor() {
        super("gm_feiji");
        this.armature = this.addArmature("gm_feiji");
        this.armature.animation.timeScale=0.75;
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
        this.x = alien.StageProxy.stage.stageWidth >> 1;
        this.y = alien.StageProxy.stage.stageHeight >> 1;
    }

    public stop(): void {        
        this.armature.animation.gotoAndStopByFrame("gm_feiji",1);
    }

    public play(): void {
        this.armature.addEventListener(egret.Event.COMPLETE,this.onComplete.bind(this),this);
        this.armature.animation.gotoAndPlayByFrame("gm_feiji",1,1);
    }
    
    private onComplete(e:egret.Event):void
    {
        if (this.parent)
            this.parent.removeChild(this);
    }
}
