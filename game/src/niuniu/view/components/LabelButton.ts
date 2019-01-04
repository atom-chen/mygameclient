/**
 *
 * @author 
 *
 */
class LabelButton extends eui.Button {
    private img:eui.Image;
    private normalSource:egret.Texture;
    private tapSource:egret.Texture;
    private disabledSource: egret.Texture;
    private currentSoucre:egret.Texture;
    
	public constructor() {
    	super();
    	this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onBegin,this);
        alien.StageProxy.stage.addEventListener(egret.TouchEvent.TOUCH_END,this.onEnd,this);
    	this.img=new eui.Image();
    	this.addChild(this.img);
	}
	
    public initSkin(normal: string,tap: string,disabled: string=null):void
	{
	   this.normalSource=Global.createTextureByName(normal);
       this.tapSource = Global.createTextureByName(tap);
       this.disabledSource = Global.createTextureByName(disabled);
      
       this.onEnd(null);
       this.img.x = this.width - this.img.width >> 1;
       this.img.y = this.height - this.img.height >> 1;
	}
	
    public set DisabledSkin(disabled:string)
    {
        this.disabledSource = Global.createTextureByName(disabled);
    }
	
    private onBegin(e:egret.TouchEvent):void
	{
	    if (this.enabled)
        {
            if (this.tapSource)
            {
                if (!this.currentSoucre || this.currentSoucre!=this.tapSource)
                {
                    this.img.source=this.tapSource;
                    this.currentSoucre=this.tapSource;
                }
            }
        }
	}
	
    private onEnd(e: egret.TouchEvent): void 
    {
         if (this.enabled)
        {
            if(!this.currentSoucre || this.currentSoucre != this.normalSource) 
            {
                this.img.source = this.normalSource; 
                this.currentSoucre = this.normalSource;
            }
        }
    }
    
    public set Enabled(value:boolean)
    {
        this.enabled=value;
        if (this.enabled)
        {
            this.onEnd(null);
        }
        else
        {
            if(!this.currentSoucre || this.currentSoucre != this.disabledSource) {
                this.img.source = this.disabledSource;
                this.currentSoucre = this.disabledSource;
            }
        }
    }
}

window["LabelButton"]=LabelButton;