/**
 *
 * @author 
 *
 */
class DragonManager {
    private dragonbonesFactory: dragonBones.EgretFactory
    public constructor() {
        this.dragonbonesFactory = new dragonBones.EgretFactory();
        this.register();
    }

    private static _instance: DragonManager;
    public static getInstance(): DragonManager {
        if(!this._instance)
            this._instance = new DragonManager();
        return this._instance;
    }

    public addDragon(dragonbonesData: any,texture: egret.Texture,textureData: any): void {
        if(!this.dragonbonesFactory.getDragonBonesData(dragonbonesData.name)) {
    	       this.dragonbonesFactory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(dragonbonesData));
            this.dragonbonesFactory.addTextureAtlasData(this.dragonbonesFactory.parseTextureAtlasData(textureData,texture));
        }
    }

    public getDragon(armature: string): dragonBones.Armature {
        return this.dragonbonesFactory.buildArmature(armature);
    }

    private register(): void {
        egret.Ticker.getInstance().register(
            function(frameTime: number) { dragonBones.WorldClock.clock.advanceTime(0.02) },//0.008
            this
        );
    }
}
