/**
 *
 * @author 
 *
 */
class ShopParticle1 extends BaseParticle{
    public constructor(particleName: string,pX: number,pY: number,w:number,h:number,time:number) {
        super(particleName,pX,pY);
        this.w=w;
        this.h=h;
        var temp:number=time/(w+h)*0.5;
        this.wTime=temp*w;
        this.hTime=temp*h;
    }
    
    private w:number;
    private h:number;
    private wTime:number;
    private hTime:number;
    
    public play ():void
    {       
        egret.Tween.removeTweens(this.system);
        this.system.emitterX=0;
        this.system.emitterY=0;
        egret.Tween.get(this.system).to({ emitterX: this.w },this.wTime).to({ emitterY:this.h},this.hTime)
            .to({ emitterX: 0 },this.wTime).to({ emitterY: 0 },this.hTime).call(this.play.bind(this));
    }
    
    public stop():void
    {
        this.system.emitterX = 0;
        this.system.emitterY = 0;
        egret.Tween.removeTweens(this.system);
    }
}
