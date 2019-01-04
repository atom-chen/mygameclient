/**
 *
 * @author 
 *
 */
class PlayerUI extends eui.Component{
	public constructor() {
    	super();
        
	}
	private p1:PlayerHead1;
	private p2:PlayerHead2;
	private ready:eui.Image;
	private master:eui.Image;
	private winMc:egret.MovieClip;
	private masterMc:ZhuangEffect;
    private multiple:eui.BitmapLabel;
    private bubble:Bubble;
    private askMaster:eui.Image;
    private notAskMaster:eui.Image;
    private isQiangZhuang:boolean;
	
	public init(idx:number=0,needShowScore:boolean=false):void
	{
        if(this.ready.parent)
            this.ready.parent.removeChild(this.ready);
        if(this.askMaster.parent)
            this.askMaster.parent.removeChild(this.askMaster);
        if(this.notAskMaster.parent)
            this.notAskMaster.parent.removeChild(this.notAskMaster);
        this.p1.clear();
        this.p2.clear(needShowScore);
        this.p2.Gold="";
        this.IsQiangZhuang=false;
        this.Master=false;
        this.Multiple=0;
        this.initRank();
        if(this.bubble.parent)
            this.bubble.parent.removeChild(this.bubble);
        if (idx)
        {
            this.Index=idx;            
        }
        
        if (!this.winMc)
        {
            var date: any = Global.createJsonData("WinMovie_json");
            var txtr: egret.Texture = Global.createTextureByName("winMovie_png");
            var mcFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(date,txtr);
            this.winMc = new egret.MovieClip(mcFactory.generateMovieClipData("WinMovie"));
            this.winMc.x = this.p2.x + 46;
            this.winMc.y = this.p2.y + 59;
            //        this.addChild(this.winMc);
            this.winMc.gotoAndStop(1);    
        }
        if(this.winMc.parent)
            this.removeChild(this.winMc);
            
        if(!this.masterMc) {
            this.masterMc=new ZhuangEffect();
            this.masterMc.x=this.master.x+this.master.width/2;
            this.masterMc.y = this.master.y + this.master.height / 2;
        }
        if(this.masterMc.parent)
            this.removeChild(this.masterMc);   
//        if(this.rank.parent)
//            this.removeChild(this.rank);   
	}
	
	private index:number;
	public set Index(value:number)
	{
	    this.index=value;
        this.setQZNNIndex();
	}
	
    private setQZNNIndex(): void {
        if(this.index == 1) {
            if(!this.p1.parent)
                this.addChild(this.p1);
            if(this.p2.parent)
                this.p2.parent.removeChild(this.p2);
            this.ready.scaleX = 1;
            this.ready.x = 173;
//            this.multiple.x=120;
            this.bubble.bubbleScaleX = 1;
            this.ready.y = 10;
            this.askMaster.y = 13;
            this.notAskMaster.y = 13;
        }
        else if(this.index == 2 || this.index == 3) {
            if(this.p1.parent)
                this.p1.parent.removeChild(this.p1);
            if(!this.p2.parent)
                this.addChild(this.p2);
            this.ready.scaleX = -1;
            this.ready.x = 70;
//            this.multiple.x = 120;
            this.bubble.bubbleScaleX = -1;
            this.ready.y = 54;
            this.askMaster.y = 57;
            this.notAskMaster.y = 57;
        }
        else if(this.index == 4 || this.index == 5) {
            if(this.p1.parent)
                this.p1.parent.removeChild(this.p1);
            if(!this.p2.parent)
                this.addChild(this.p2);
            this.ready.scaleX = 1;
            this.ready.x = 173;
//            this.multiple.x = 120;
            this.bubble.bubbleScaleX = 1;
            this.ready.y = 54;
            this.askMaster.y = 57;
            this.notAskMaster.y = 57;
        }
    }

    private setTBNNIndex(): void {
        if(this.index == 1) {
            if(!this.p1.parent)
                this.addChild(this.p1);
            if(this.p2.parent)
                this.p2.parent.removeChild(this.p2);
            this.ready.scaleX = 1;
            this.ready.x = 173;
            this.bubble.bubbleScaleX = 1;
            this.ready.y = 10;
            this.askMaster.y = 13;
            this.notAskMaster.y = 13;
        }
        else if(this.index == 2 || this.index == 3) {
            if(this.p1.parent)
                this.p1.parent.removeChild(this.p1);
            if(!this.p2.parent)
                this.addChild(this.p2);
            this.ready.scaleX = -1;
            this.ready.x = 70;
            this.bubble.bubbleScaleX=-1;
            this.ready.y = 54;
            this.askMaster.y = 57;
            this.notAskMaster.y = 57;
        }
        else if(this.index == 4) {
            if(this.p1.parent)
                this.p1.parent.removeChild(this.p1);
            if(!this.p2.parent)
                this.addChild(this.p2);
            this.ready.scaleX = 1;
            this.ready.x = 173;
            this.bubble.bubbleScaleX = 1;
            this.ready.y = 54;
            this.askMaster.y = 57;
            this.notAskMaster.y = 57;
        }
    }
	
	private setDZNNIndex():void
	{
        if(this.index == 1) {
            if(!this.p1.parent)
                this.addChild(this.p1);
            if(this.p2.parent)
                this.p2.parent.removeChild(this.p2);
            this.ready.scaleX = 1;
            this.ready.x = 173;            
            this.bubble.bubbleScaleX = 1;
            this.askMaster.x=146;
            this.notAskMaster.x=146;
            this.ready.y = 10;
            this.askMaster.y = 13;
            this.notAskMaster.y = 13;
        }
        else if(this.index == 2) {
            if(this.p1.parent)
                this.p1.parent.removeChild(this.p1);
            if(!this.p2.parent)
                this.addChild(this.p2);
            this.ready.scaleX = -1;
            this.ready.x = 70;           
            this.bubble.bubbleScaleX = -1;
            this.askMaster.x = -50;
            this.notAskMaster.x = -50;
            this.ready.y = 54;
            this.askMaster.y = 57;
            this.notAskMaster.y = 57;
        }
	}
	
    public getHeadCenterPos():any{
        if(this.index == 1){
            return this.p1.getHeadCenGlobalPos();
        }else{
            return this.p2.getHeadCenGlobalPos();
        }
    }

	public get Index():number
	{
	    return this.index;
	}
	
	public set Nickname(value:string)
	{
	    if (this.index==1)
            this.p1.Nickname=value; 
        else
            this.p2.Nickname = value; 
	}
	
	public get Nickname():string
	{
    	  if (this.p1)
       {
            if(this.index == 1)
                return this.p1.Nickname;
            else
                return this.p2.Nickname;
        }
        else
            return null;
	}
	
    public set ImgId(value: string) {
        if(!value) return;

        if(value.indexOf("http://") != -1){
            value = value.replace("http://","https://");
        }

        if(this.index == 1)
            this.p1.source = value;
        else
            this.p2.source = value;
    }
	
	public set Gold(value:string)
	{
	    if (this.index!=1)
        {
            this.p2.Gold=value;    
        }
	}
	
	public set Ready(value:number)
	{
	    if (value==0)
        {
            if (this.ready.parent)
                this.ready.parent.removeChild(this.ready);
        }
        else
        {
            if (!this.ready.parent)
                this.addChild(this.ready);
        }
	}
	
	private changeGold:string;
	public set ChangeGold(val:string)
	{
	    this.changeGold=val;   
	}
	
    public get ChangeGold():string
    {
        return this.changeGold;
    }
    
	
    public set Master(value: boolean) {
        if(value && !this.master.visible)
        {
            GameSoundManagerNiu.playSoundMasterEffect();
            this.showMaster();
        }
        else if (!value)
        {
            this.master.visible = value;
            if(this.masterMc)
            {                
                this.masterMc.removeEventListener(egret.Event.COMPLETE,this.onMasterComplete,this);
                if(this.masterMc.parent)
                    this.removeChild(this.masterMc);
            }
        }
        
    }
    
    public get Master():boolean
    {
        if (this.master)
            return this.master.visible;
        else 
            return false;
    }
    
    private showMaster():void
    {
        if(this.masterMc) {
            if(!this.masterMc.parent)
                this.addChild(this.masterMc);
            this.masterMc.play();
            this.masterMc.addEventListener(egret.Event.COMPLETE,this.onMasterComplete,this);
        }
    }
    
    private onMasterComplete(): void {
        this.master.visible=true;
        this.masterMc.removeEventListener(egret.Event.COMPLETE,this.onMasterComplete,this);
        this.dispatchEvent(new egret.Event("masterOver"));
//        if(this.masterMc.parent)
//            this.removeChild(this.masterMc);
    }
    
    public showWin():void
    {
        GameSoundManagerNiu.playSoundWinEffect();
        if (!this.winMc.parent)
            this.addChild(this.winMc);
        this.winMc.gotoAndPlay(1);
        this.winMc.addEventListener(egret.Event.COMPLETE,this.onWinComplete,this);
    }
    
    private onWinComplete():void
    {
        this.winMc.removeEventListener(egret.Event.COMPLETE,this.onWinComplete,this);
        if(this.winMc.parent)
            this.removeChild(this.winMc);
        this.dispatchEvent(new egret.Event("complete"));
    }
    
    private _multiple:number;
    public set Multiple(value:number)
    {
        this._multiple=value;
        if (value)
        {
            this.multiple.text="*"+value+"";
            this.multiple.visible=true;
        }
        else
        {
            this.multiple.visible = false;
            this.multiple.text="";
        }
    }
    
    public get Multiple():number
    {
        if(this.multiple)
            return this._multiple;
        else
            return 0;
    }
    
    public chat(value:string):void
    {       
        this.bubble.alpha=1;
        this.bubble.Text=value;
        egret.Tween.removeTweens(this.bubble);
        egret.Tween.get(this.bubble,null,null,null).wait(1000).to({ alpha: 0 },1000,null).call(this.chatStep1,this);    
    }
    
    private chatStep1():void
    {
        if(this.bubble.parent)
            this.bubble.parent.removeChild(this.bubble);
    }
    
    public get chatBubble():Bubble
    {
        return this.bubble;
    }
    
    public set AskMaster(value:boolean)
    {
        if (value)
        {
            if(!this.notAskMaster.parent)
            {
                if (!this.askMaster.parent)
                    this.addChild(this.askMaster);
            }
        }
        else
        {
            if(!this.notAskMaster.parent)
                this.addChild(this.notAskMaster);
        }
    }
    
    public removeAskMaster():void
    {
        if(this.askMaster.parent)
            this.removeChild(this.askMaster);
        if(this.notAskMaster.parent)
            this.removeChild(this.notAskMaster);
    }
    
    public set IsQiangZhuang(value:boolean)
    {
        this.isQiangZhuang=value;
    }
    
    public get IsQiangZhuang():boolean
    {
        return this.isQiangZhuang;
    }
    
    public set Rank(value:number)
    {
    }
    
    public showLight():void
    {
    }
    
    private onComplete(): void {
    }
    
    public showBack(): void {
    }
    
    public get RankBack(): boolean {
        return true;
    }
    
    public initRank():void
    {
    }
}

window["PlayerUI"]=PlayerUI;