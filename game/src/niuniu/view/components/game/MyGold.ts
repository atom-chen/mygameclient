/**
 *
 * @author 
 *
 */
class MyGold extends eui.Component {
    private addBtn:eui.Button;
	public constructor() {
    	super();
    	
	}
	
	private mc:egret.MovieClip;
    protected childrenCreated():void
    {
        super.childrenCreated();
        this.addBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
        /*
        var date: any = Global.createJsonData("goldEffect_json");
        var txtr: egret.Texture = Global.createTextureByName("goldEffect_png");
        var mcFactory:egret.MovieClipDataFactory=new egret.MovieClipDataFactory(date,txtr);
        this.mc = new egret.MovieClip(mcFactory.generateMovieClipData("GoldEffect"));
        this.mc.x=22;
        this.mc.y=25;
        this.addChild(this.mc);
        this.mc.gotoAndPlay(1,-1);    
        
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAdd,this);*/
    }
	
    private labGold:eui.Label;
    updateGold(gold: string): void {
        if(this.labGold) {
            this.labGold.text = GoldStr.GoldFormat(gold);
        }
    }
    
    private onTap(e:egret.TouchEvent):void
    {        
        GameSoundManagerNiu.playTouchEffect();
        PanelExchange2.instance.show(0);
    }
    
    private onAdd(e:egret.Event):void
    {      
        this.mc.gotoAndPlay(1,-1);    
    }
    
    public set AddBtnVisible(val:boolean)
    {
        this.addBtn.visible=val;
    }
}

window["MyGold"]=MyGold;