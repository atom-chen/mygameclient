/**
 *
 * @author 
 *
 */
class PlayerHead3 extends PlayerHead1{
	public constructor() {
        super();
	}
	
	private mask1:eui.Image;
    private mask2: eui.Image;
    private head4Bg1:eui.Image;
    private head4Bg2: eui.Image;
	
    createChildren(): void {
        
        //this.head.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
        //this.head0.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
        this.head.mask = this.mask1;
        this.head0.mask = this.mask2;
        this.head0.source = Global.createTextureByName(GameConfigNiu.defaultHead);
        //this.head.addEventListener(egret.IOErrorEvent.COMPLETE,this.loadComplete,this);

        //alien.Dispatcher.addEventListener(EventNamesNiu.CLEAR_HEAD,this.clearHead,this);
    }
    
    public hideHead():void
    {
        this.head.visible=false;
        this.head0.visible=false;
        this.head4Bg1.visible=false;        
        this.head4Bg2.visible=false;
    }
}
