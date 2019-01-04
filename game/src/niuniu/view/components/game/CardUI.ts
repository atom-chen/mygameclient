/**
 *
 * @author 
 *
 */
class CardUI extends eui.Component{
    private num1:eui.Image;
    private num2:eui.Image;
    private flower1:eui.Image;
    private flower2:eui.Image;
    private back:eui.Image;
    
    private selected:Boolean;
    
	public constructor() {
    	super()
	}
	
	public set Selected(value:Boolean)
	{
	    this.selected=value;
        if(this.selected)
            this.Run(this.x,- 20,-1,-1,0.1);
        else
            this.Run(this.x,0,-1,-1,0.1);
	}
	
	public get Selected():Boolean
	{
	    return this.selected;
	}
	
    private endX:number;
    private sendCardTime:number = 0.4;
	public sendCard(t:number):void
    {
        var self:CardUI=this;
        var fun: Function = function(): void {
            self.visible = true;
            self.StopRun();

            self.endX = self.x;
            self.alpha = 1;    
            var p: egret.Point;
            p = self.parent.globalToLocal(alien.StageProxy.stage.stageWidth - self.width * self.scaleX >> 1,alien.StageProxy.stage.stageHeight - self.height * self.scaleY >> 1);
            self.x = p.x;
            self.y = p.y;
            //        this.width = cardWidth / 2;
            //        this.height = cardHeight / 2;
           
            self.Run(self.endX,0,-1,-1,self.sendCardTime,self.runCompleteHandler);
        }
        setTimeout(fun,t);
	}
	
	public qznnSendFifthCard():void
	{
        this.visible = true;
        this.StopRun();

        this.endX = this.x;
        this.alpha = 0;
        var p: egret.Point;        
        this.x = this.x+50;
     
        this.Run(this.endX,0,-1,-1,0.2,this.runCompleteHandler);
	}
	
    public qznnSendFifthCard2(startX:number,startY:number): void {
        this.visible = true;
        this.StopRun();
        this.endX = this.x;
        this.alpha = 1;        
        this.x = startX;
        this.y=startY;

        this.Run(this.endX,0,-1,-1,0.2,this.runCompleteHandler);
    }
	
    protected running:Boolean = false;
    public Run(x: number,y: number,w: number = -1,h: number = -1,time: number = 0.7,onComplete: Function = null,alpha: number = 1,onCompleteParams:Array<any>=null):void
	{
        if(w < 0) {
            w = this.width;
        }
        if(h < 0) {
            h = this.height;
        }
        if(this.running) {
            egret.Tween.removeTweens(this);
        }
        this.running = true;
//        if(!onComplete)
//            onComplete = this.runCompleteHandler;
        if (onComplete)
            egret.Tween.get(this,null,null,null).to({ x: x,y: y,width: w,height: h,onComplete: onComplete,alpha: alpha },time * 1000,null).call(onComplete,this,[onCompleteParams]);    
        else
            egret.Tween.get(this,null,null,null).to({ x: x,y: y,width: w,height: h,onComplete: onComplete,alpha: alpha },time * 1000,null);
    }
    
    public StopRun(): void {
        if(this.running) {          
            egret.Tween.removeTweens(this);
        }
        this.running = false;
    }
    
    private runCompleteHandler(): void {       
        if(this.running) {
            this.StopRun();
            this.running = false;
            this.dispatchEvent(new egret.Event("complete"));
        }
    }
	
    public sendCard2(): void {
        this.visible=true;
        this.running = false;
        this.dispatchEvent(new egret.Event("complete"));
    }
    
    private cardValue:number;
    public set CardValue(val: number) {
        if(val < 10)
            this.cardValue = val;
        else if(val >= 10 && val <= 13)
            this.cardValue = 10;
    }

    public get CardValue(): number {
        return this.cardValue;
    }
	
    private id:number;
	public set Card(value:number)
	{
        if (value)
        {
            this.id=value;
    	    var flower:number=value%10;
    	    var num:number=Math.floor(value/10);
    	    this.CardValue=num;
            //["fk","mh","hx","ht"];
            this.flower1.source = Global.createTextureByName("poker_sign_" + flower);
            this.flower2.source = Global.createTextureByName("poker_sign_" + flower);
            var str:string="poker_";
            if (flower==1 || flower==3)
                str+="black_";
            else
                str+="red_";
            switch (num)
            {
                case 9:
                    str+="j";
                    break;
                   
                case 10:
                    str+="q";
                    break;
                    
                case 11:
                    str+="k";
                    break;
                
                case 12:
                    str+="a";
                    break;
                    
                case 13:
                    str+="2";
                    break;
                    
                default:
                    str+= num + 2;
            }
            this.num1.source = Global.createTextureByName(str);
            this.num2.source = Global.createTextureByName(str);
            this.back.visible=false;
        }
        else
        {
            this.back.visible=true;
        }
	}
	
    public get Card(): number {
        return this.id;
    }
    
    public set CardId(value:number)
    {
        this.id=value;
        var num: number = Math.floor(value / 10);
        this.CardValue = num;
    }
    
    private index:number;
    public set Index(val: number){
        this.index = val;
    }

    public get Index(): number {
        return this.index;
    }
    
    private runTime1:number = 0.1;
    private runTime2:number = 0.2;
    private runTime3:number = 0.2;
    /**
     * 0 1
     *2 3 4
     * @param needNiu
     
     */		
    public finish1(needNiu:Boolean):void
	{			
        this.StopRun();
        if(needNiu) {
            this.Run(this.x,0,-1,-1,this.runTime1,this.step1);
        }
        else {
            this.Selected = false;
            this.comboComplete();
        }
    }
    
    private step1(): void {
        //组牛的3张牌不动
        if(this.Index == 2 || this.Index == 3 || this.Index == 4) {
            this.Run(this.x,this.y,-1,-1,this.runTime2,this.step2);
        }
        //不足牛的两张牌拔起
        else {
            var upDistance: number = GameConfigNiu.upDistance;
            this.Run(this.x,upDistance,-1,-1,this.runTime2,this.step2);
            
        }
    }
    
    private step2(): void {
        //			trace(GamePage.ROW1_Y);
        //这里处理层级关系
     
        this.dispatchEvent(new egret.Event(EventNamesNiu.RUN_STEP2));
        var downX:number;
        var upX:number;
        var cardDistance:number;
        var upDistance: number;
            downX = GameConfigNiu.downX;
            upX = GameConfigNiu.upX;
            cardDistance = GameConfigNiu.cardDistance;
            upDistance=GameConfigNiu.upDistance;
        if(this.Index == 2) {
            this.Run(downX,0,-1,-1,this.runTime3,this.comboComplete);
        }
        else if(this.Index == 3) {
            this.Run(downX + cardDistance,0,-1,-1,this.runTime3,this.comboComplete);
        }
        else if(this.Index == 4) {
            this.Run(downX + cardDistance * 2,0,-1,-1,this.runTime3,this.comboComplete);
        }
        else if(this.Index == 0) {
            
            this.Run(upX,upDistance,-1,-1,this.runTime3,this.comboComplete);
           
        }
        else if(this.Index == 1) {
           
            this.Run(upX + cardDistance,upDistance,-1,-1,this.runTime3,this.comboComplete);
           
        }
    }
    
    private comboComplete():void
    {
        this.dispatchEvent(new egret.Event(EventNamesNiu.COMBO_COMPLETE));
    }
    
    public finish2(needNiu:Boolean,playerIndex:number): void {	
        if (playerIndex==2)
        {
            this.Run(GameConfigNiu.armyCardDistance * 4,this.y,-1,-1,this.runTime2,this.stepHo1,1,[needNiu,playerIndex]);
        }
        else
        {
            this.Run(0,this.y,-1,-1,this.runTime2,this.stepHo1,1,[needNiu,playerIndex]);
        }
    }
    
    private stepHo1(params:Array<any>):void
    {
        this.Card=this.Card;
        var needNiu: Boolean=params[0];
        var playerIndex:number=params[1];
        var dis:number=0;
        if(playerIndex == 2) {            
            if (needNiu && this.Index<=2)
                dis=GameConfigNiu.niuCardDistance;
            this.Run(GameConfigNiu.armyCardDistance * this.Index - dis,this.y,-1,-1,this.runTime3,this.comboComplete);
        }
        else
        {
            if(needNiu && this.Index > 2)
                dis = GameConfigNiu.niuCardDistance;
            this.Run(GameConfigNiu.armyCardDistance * this.Index + dis,this.y,-1,-1,this.runTime3,this.comboComplete);
        }
    }
}

window["CardUI"]=CardUI;