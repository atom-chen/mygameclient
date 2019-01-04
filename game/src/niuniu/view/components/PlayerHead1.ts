/**
 *
 * @author zhanghaichuan
 *
 */
class PlayerHead1 extends eui.ItemRenderer{
	public constructor() {
    	super();
        	
        //this.addEventListener(egret.Event.ADDED_TO_STAGE,this._onAddStage,this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this._onRemoveStage,this);
	}
	
    createChildren(): void {
        super.createChildren();
        //this.head.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
        //this.head0.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
        this.myMaskR = new egret.Sprite();
        this.myMaskR.graphics.clear();
        this.myMaskR.graphics.beginFill(0x000000);
        this.myMaskR.graphics.drawRoundRect(1,1,89,89,40);
        this.myMaskR.graphics.endFill();
        this.myMaskR.x = 0;
        this.myMaskR.y = 0;
        this.addChild(this.myMaskR);
        this.myMaskR2 = new egret.Sprite();
        this.myMaskR2.graphics.clear();
        this.myMaskR2.graphics.beginFill(0x000000);
        this.myMaskR2.graphics.drawRoundRect(1,1,89,89,40);
        this.myMaskR2.graphics.endFill();
        this.myMaskR2.x = 0;
        this.myMaskR2.y = 0;
        this.addChild(this.myMaskR2);
        
        this.head.mask = this.myMaskR;
        this.head0.mask= this.myMaskR2;
        this.head0.source = Global.createTextureByName(GameConfigNiu.defaultHead);
        //this.head.addEventListener(egret.IOErrorEvent.COMPLETE,this.loadComplete,this);
       
        alien.Dispatcher.addEventListener(EventNamesNiu.CLEAR_HEAD,this.clearHead,this);
    }

    protected nickName:eui.Label;
	public set Nickname(val:string)
	{
	    this.nickName.text=val;
	}
	
    public get Nickname() :string{
        if(this.nickName)
            return this.nickName.text;
        else
            return null;
    }
    
    protected head:eui.Image;
    protected head0: eui.Image;
//    private maskImg:eui.Image;
    private myMaskR:egret.Sprite;
    private myMaskR2: egret.Sprite;
    private localHead: Array<string> = ["default.png","head1.png","head2.png","head3.png","head4.png","head5.png","head6.png","head7.png","head8.png"];
    private _headCGlobalPos:any;
    private onComplete(texture:egret.Texture):void
    {
        console.log("dd");
        this.head.source = texture;       
    }
    
    private _onRemoveStage():void{
        alien.Dispatcher.removeEventListener(EventNamesNiu.CLEAR_HEAD,this.clearHead,this);
    }

    public  checkIsLocalHead(val: string): boolean {
        if(val) {
            if(this.localHead.indexOf(val) != -1)
                return true;
            else
                return false;
        }
        else
            return false;
    }

    public set source(val:string)
    {
        if (val)
        {
            if (this.checkIsLocalHead(val))
            {
                this.head.source = Global.createTextureByName(val);
            }
            else
                this.head.source = val;
        }
        else if(!this.Nickname)
            this.head.source="";
        else
            this.head.source = Global.createTextureByName(GameConfigNiu.defaultHead);
            
        this.head0.visible=true;
//        this.maskImg.scaleX=0.5;
//        this.maskImg.scaleY=0.5;
//        this.head.mask=this.maskImg;
    }
    
    protected onTap(e:egret.TouchEvent):void
    {
       /* if(!GameLogic.isInGameRoom) {
            GameSoundManagerNiu.playTouchEffect();
            Dispatcher.dispatch(EventNamesNiu.SHOW_ROLE_INFO);
        }*/

    }


    public clear(needShowScore: boolean = false):void
    {
        this.Nickname="";
        this.source="";
        this.head.texture = null;
        this.head0.visible=false;
    }
    
    protected loadComplete():void
    {
//        console.log("image complete");
    }
    
    protected clearHead():void
    {
        this.head.source="";
        this.head.texture=null;
        this.head0.visible=true;
    }
    /**
	 * 获取头像中心的的坐标 zhu
	 */
	public getHeadCenGlobalPos():egret.Point{
		if(!this._headCGlobalPos){
			let x = this.head0.x;
			let y = this.head0.y;
			let width = this.head0.width;
			let height = this.head0.height;
			let pos = new egret.Point(0,0);
			this._headCGlobalPos= this.head0.localToGlobal(x + width * 0.5,y + height * 0.5);
		}
		return this._headCGlobalPos;
	}
}

window["PlayerHead1"]=PlayerHead1;