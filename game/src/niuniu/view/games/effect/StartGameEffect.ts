/**
 *
 * @author 
 *
 */
class StartGameEffect extends alien.PanelBase{
    private b1:egret.Bitmap;
    private b2: egret.Bitmap;
    private b3: egret.Bitmap;
    private b4: egret.Bitmap;
    private b5: egret.Bitmap;
    private b6: egret.Bitmap;
    private b7: egret.Bitmap;
    private b8: egret.Bitmap;
    private b9: egret.Bitmap;
    private b10: egret.Bitmap;
    private b11: egret.Bitmap;
    private back:egret.Sprite;
	public constructor() {
    	super();    	
    	this.back=new egret.Sprite();
    	this.back.graphics.clear();
        this.back.graphics.beginFill(0x000000);
        this.back.graphics.drawRect(0,0,1280,640);
        this.back.graphics.endFill();
        this.back.anchorOffsetX=this.back.width/2;
        this.back.anchorOffsetY=this.back.height/2;
     	this.b1=Global.createBitmapByName("bg_93");
        this.b2 = Global.createBitmapByName("texiao1");
        this.b3 = Global.createBitmapByName("guang2");
        this.b4 = Global.createBitmapByName("bg_98");
        this.b5 = Global.createBitmapByName("bg_97");
        this.b6 = Global.createBitmapByName("bg_96");
        this.b7 = Global.createBitmapByName("bg_91");
        this.b8 = Global.createBitmapByName("bg_90");
        this.b9 = Global.createBitmapByName("bg_92");
        this.b10 = Global.createBitmapByName("bg_94");
        this.b11 = Global.createBitmapByName("bg_95");
        
        this.addChild(this.back);
        this.addChild(this.b11);
        this.addChild(this.b10);
        this.addChild(this.b9);
        this.addChild(this.b8);
        this.addChild(this.b7);
        this.addChild(this.b6);
        this.addChild(this.b5);
        this.addChild(this.b4);
        this.addChild(this.b3);
        this.addChild(this.b2);
        this.addChild(this.b1);
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.addToStage,this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.removeFromStage,this);
	}
	
    private static instance: StartGameEffect;
    public static getInstance(): StartGameEffect {
        if(!this.instance)
            this.instance = new StartGameEffect();
        return this.instance;
    }

	private removeFromStage():void{
        if(!StartGameEffect.instance){
            this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.addToStage,this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE,this.removeFromStage,this);
        }
        StartGameEffect.instance = null;
    }

    protected addToStage(e: egret.Event): void {
        this.width = alien.StageProxy.stage.stageWidth;
        this.height = alien.StageProxy.stage.stageHeight;
        this.x=this.width/2;
        this.y=this.height/2;
        alien.StageProxy.stage.addEventListener(egret.Event.RESIZE,this.onResize,this);
        this.play();
    }
    
    protected onResize(e: egret.Event): void {
        this.width = alien.StageProxy.stage.stageWidth;
        this.height = alien.StageProxy.stage.stageHeight;
        this.x = this.width / 2;
        this.y = this.height / 2;
    }
    
    private setBase(b:egret.Bitmap,x:number,y:number,scaleX:number,scaleY:number,alpha:number):void
    {
        egret.Tween.removeTweens(b);
        b.x=x;
        b.y=y;
        b.scaleX=scaleX;
        b.scaleY=scaleY;
        b.alpha=alpha;
        b.anchorOffsetX=b.width/2;
        b.anchorOffsetY=b.height/2;
    }
    
    private play():void
    {   
        this.playB1();  
        this.playB2(); 
        this.playB3(); 
        this.playB4(); 
        this.playB5(); 
        this.playB6(); 
        this.playB7(); 
        this.playB8(); 
        this.playB9(); 
        this.playB10(); 
        this.playB11();
        this.playBack();
    }
    //bg93
    private playB1():void
    {
        this.setBase(this.b1,-15,-30,1,1,0);
        egret.Tween.get(this.b1).wait(750).to({ alpha:1},250).to({alpha:0},250);
    }
    //texiao1
    private playB2():void
    {
        this.setBase(this.b2,0,-30,1,0,0);
        egret.Tween.get(this.b2).wait(1600).to({ alpha: 1 },50).to({ x: 0,scaleY: 10 },100).to({ x: 0,scaleX:30,scaleY: 0 },150);
    }
    //guang2
    private playB3(): void {        
        this.setBase(this.b3,-17,-32,14,0,0);
        egret.Tween.get(this.b3).wait(1650).to({ alpha: 1,scaleY: 14 },100).to({ alpha: 0,scaleY:0},100);
    }
    //bg98
    private playB4(): void {        
        this.setBase(this.b4,568,-176,5,5,0);
        egret.Tween.get(this.b4).wait(700).to({ x: 310,y: -47,scaleX: 1,scaleY:1,alpha:1},150).wait(900).to({ alpha: 0 },100);
    }
	//bg97
    private playB5(): void {       
        this.setBase(this.b5,-247,225,6,6,0);
        egret.Tween.get(this.b5).wait(600).to({ x: -30,y: 53,scaleX: 1,scaleY: 0.5,alpha: 1 },150).wait(1000).to({ alpha: 0 },100);
    }
    //bg96
    private playB6(): void {
        this.setBase(this.b6,-600,-321,7,7,0);
        egret.Tween.get(this.b6).wait(500).to({ x: -323,y: -95,scaleX: 1,scaleY: 1,alpha: 1 },150).wait(1100).to({ alpha: 0 },100);
    }
    //bg91
    private playB7(): void {
        this.setBase(this.b7,650,-4,1,1,0);
        egret.Tween.get(this.b7).wait(400).to({ x: 145,alpha: 1 },100).wait(1250).to({alpha: 0 },100);
    }
    //bg90
    private playB8(): void {
        this.setBase(this.b8,-650,-52,1,1,0);
        egret.Tween.get(this.b8).wait(400).to({ x: -185,alpha: 1 },100).wait(1250).to({alpha: 0 },100);
    }
    //bg92
    private playB9(): void {
        this.setBase(this.b9,-15,-30,1,1,0);
        egret.Tween.get(this.b9).wait(950).to({ alpha: 1 },50).wait(650).to({ alpha: 0 },100);
    }
    
    private playB10(): void {
        this.setBase(this.b10,1025,0,1,1,0);255
        egret.Tween.get(this.b10).wait(250).to({ x: 625,alpha: 0.2 },100).to({ x: 255,alpha: 1 },100).to({ x: 275,alpha: 1 },100).to({ x: 255,alpha: 1 },100).wait(1100).to({ x: -1025,alpha: 0 },250);
    }
    
    private playB11(): void {
        this.setBase(this.b11,-1025,-50,1,1,0);
        egret.Tween.get(this.b11).wait(250).to({ x: -625,alpha: 0.2 },100).to({ x: -255,alpha: 1 },100).to({ x: -275,alpha: 1 },100).to({ x: -255,alpha: 1 },100).wait(1100).to({ x: 1025,alpha: 0 },250);
    }
    
    private playBack(): void {
        egret.Tween.removeTweens(this.back);        
        this.back.alpha = 0;
        egret.Tween.get(this.back).to({ alpha: 0.6 },150).wait(1600).to({ alpha: 0 },250).call(this.playComplete.bind(this));
    }
    
    private playComplete():void
    {
        this.dispatchEvent(new egret.Event("complete"))
    }
}
