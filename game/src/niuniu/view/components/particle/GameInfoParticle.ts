/**
 *
 * @author 
 *
 */
class GameInfoParticle extends BaseParticle{
    public constructor(particleName: string,pX: number,pY: number,w: number,h: number,time: number,oX:number,oY:number) {
        super(particleName,pX,pY);
        this.w = w;
        this.h = h;
        var temp: number = time / (w + h) * 0.5;
        this.wTime = temp * w;
        this.hTime = temp * h;
        this.oX=oX;
        this.oY=oY;
        this.system.emitterX = this.oX;
        this.system.emitterY = this.oY;
    }

    private w: number;
    private h: number;
    private wTime: number;
    private hTime: number;
    private oX:number;
    private oY:number;

    public play(): void {       
        egret.Tween.removeTweens(this.system);
        this.system.emitterX = this.oX;
        this.system.emitterY = this.oY;
        egret.Tween.get(this.system).to({ emitterX: this.w },this.wTime).to({ emitterX: this.w-this.oX,emitterY: this.h-this.oY },this.hTime)
            .to({ emitterX: 0 },this.wTime).to({ emitterX: this.oX,emitterY: this.oY },this.hTime).call(this.play.bind(this));
    }

    public stop(): void {       
        this.system.emitterX = 0;
        this.system.emitterY = 0;
        egret.Tween.removeTweens(this.system);
    }
}
