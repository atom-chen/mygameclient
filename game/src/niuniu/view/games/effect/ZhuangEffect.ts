/**
 *
 * @author 
 *
 */
class ZhuangEffect extends egret.Sprite{
    
    private b1:egret.Bitmap;
    private b2:egret.Bitmap;
    private b3:egret.Bitmap;
	public constructor() {
    	super();
        this.b1 = Global.createBitmapByName("bg_57_1");
        this.b2 = Global.createBitmapByName("bg_57");
        this.b3 = Global.createBitmapByName("ExpParticle");
        
        this.addChild(this.b3);
        this.addChild(this.b2);
        this.addChild(this.b1);
	}
	
	public play():void
	{
        this.playB1();
        this.playB2();
        this.playB3(); 
	}
	
    private setBase(b: egret.Bitmap,x: number,y: number,scaleX: number,scaleY: number,alpha: number): void {
        egret.Tween.removeTweens(b);
        b.x = x;
        b.y = y;
        b.scaleX = scaleX;
        b.scaleY = scaleY;
        b.alpha = alpha;
        b.anchorOffsetX = b.width / 2;
        b.anchorOffsetY = b.height / 2;
    }
	
	private playB1():void
	{
    	 this.setBase(this.b1,0,0,1,1,0)
         egret.Tween.get(this.b1).wait(100).to({ alpha: 1 },200).wait(200).to({ alpha: 0 },200).call(this.end.bind(this),this);
	}
	
    private playB2(): void {
        this.setBase(this.b2,0,0,1,1,0)
        egret.Tween.get(this.b2).wait(300).to({ alpha: 1 },200);
    }
    
    private playB3(): void {
        this.setBase(this.b3,0,0,0,0,1)
        egret.Tween.get(this.b3).to({ scaleX: 2,scaleY: 2 },200).to({ scaleX: 0,scaleY: 0 },200);
    }
	
    private end():void
    {
        this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
    }
	
}
