/**
 *
 * @author 
 *
 */
class DragonHongBaoWarn extends DragonBase {
    private armature1: dragonBones.Armature;
    private armature2: dragonBones.Armature;
    private rect:eui.Rect;
    public constructor() {
        super("hongbaodonghua");
        this.armature1 = this.addArmature("hongbaodonghua");
        this.armature2 = this.addArmature("hongbaodonghua"); 
        this.stop1();
        this.stop2();
        
        //        this.armature.animation.timeScale = 0.5;
    }

    protected addToStage(e: egret.Event): void {
        super.addToStage(e);
        this.onResize(e);
    }

    protected removeFromStage(e: egret.Event): void {
        super.removeFromStage(e);
    }
    
    protected onResize(e: egret.Event): void {
        this.x = alien.StageProxy.stage.stageWidth *0.5+424;
        this.y = alien.StageProxy.stage.stageHeight *0.5 +16;
    }

    private stop1(): void {
        this.armature1.removeEventListener(egret.Event.COMPLETE,this.onComplete1.bind(this),this);
        this.armature1.animation.gotoAndStop("hongbaodonghua1",1);
        this.armature1.display.visible = false;
    }

    private stop2(): void {       
        this.armature2.animation.gotoAndStopByFrame("hongbaodonghua2",1);
        this.armature2.display.visible = false;
    }

    public play1(): void {       
        this.stop2();
        this.armature1.display.visible = true;
        this.armature1.animation.gotoAndPlayByFrame("hongbaodonghua1",1,1);
        this.armature1.addEventListener(egret.Event.COMPLETE,this.onComplete1.bind(this),this);
       
    }
    //    342 21
    public play2(): void {
        if(!this.rect) {
            this.rect = new eui.Rect(this.armature2.display.width,this.armature2.display.height);
            this.rect.x=-this.rect.width>>1;
            this.rect.y=-this.rect.height>>1;
            this.rect.alpha=0.01;
            this.rect.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
            this.addChild(this.rect);
        }
        this.stop1();
        this.armature2.display.visible = true;       
        this.armature2.animation.gotoAndPlayByFrame("hongbaodonghua2",1,-1);
    }

    private onComplete1(e: egret.Event): void {
        this.stop1();
        this.play2();
    }


    private onTap(e: egret.TouchEvent): void {       
        //PanelExchange1.instance.show();
    }
}
