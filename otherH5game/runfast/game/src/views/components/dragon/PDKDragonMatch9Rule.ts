/**
 * 9人钻石赛规则动画
 * @author 
 *
 */
class PDKDragonMatch9Rule extends PDKDragonBase {
    private guize: dragonBones.Armature;
    private callback:Function;
    // private maskrect:eui.Rect;
    public constructor() {
        super("guize");
        this.guize = this.addArmature("guize");
        this.touchEnabled = true;
        // if(!this.maskrect){
        //     var rec = this.getBounds();
        //     this.maskrect = new eui.Rect(rec.width, rec.height);
        //     // this.mask = new eui.Rect(900， 640);
        //     this.addChild(this.maskrect);
        // }
        // this.addChild(this.mask);
        //  this.getBounds().width;
//        this.guize.animation.timeScale = 0.75;
    }

    protected addToStage(e: egret.Event): void {
        super.addToStage(e);
        this.onResize(e);
//        this.play();
    }

    protected removeFromStage(e: egret.Event): void {
        super.removeFromStage(e);
        this.stop();
    }

    protected onResize(e: egret.Event): void {
        this.x = PDKalien.StageProxy.stage.stageWidth >> 1;
        this.y = PDKalien.StageProxy.stage.stageHeight >> 1;
    }

    public stop(): void {
        this.guize.animation.gotoAndStopByFrame("guize",1);
    }

    public play(callback:Function = null): void {
        this.callback = callback;
        this.guize.addEventListener(egret.Event.COMPLETE,this.onComplete.bind(this),this);
        this.guize.animation.gotoAndPlayByFrame("guize",1,1);
    }

    private onComplete(e: egret.Event): void {
        if(this.callback){
            this.callback();
        }
        if(this.parent)
            this.parent.removeChild(this);
        
    }
}
