/**
 *
 * @author 
 *
 */
class BaseParticle extends egret.Sprite {
    public constructor(particleName: string,pX:number,pY:number) {
        super();
        this.texture = Global.createTextureByName(particleName + "_png");
        this.config = Global.createJsonData(particleName + "_json");
        if(this.texture && this.config) {
            this.system = new particle.GravityParticleSystem(this.texture,this.config);
            this.addChild(this.system);
            this.system.start();
            this.system.x = pX;
            this.system.y = pY;
        }
    }

    protected texture: egret.Texture;
    protected config: any;
    protected system: particle.GravityParticleSystem;
    protected isPlaying:boolean;

}
