/**
 *
 * @author 
 *
 */
class QznnChooseCard extends eui.Component{
	public constructor() {
    	super();
	}
	
    protected createChildren(): void {
        super.createChildren();
        this.card1.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
        this.card2.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
        this.card3.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
        this.card1.addEventListener(egret.Event.COMPLETE,this.onComplete,this);
        this.card2.addEventListener(egret.Event.COMPLETE,this.onComplete,this);
        this.card3.addEventListener(egret.Event.COMPLETE,this.onComplete,this);
    }
	
	private card1:QznnChooseCardInfo;
    private card2: QznnChooseCardInfo;
    private card3: QznnChooseCardInfo;
    private lab:eui.Label;
    
    private canTap:boolean;
    private cards:Array<number>;
    private timer:egret.Timer;
    private time:number;
    private selectIdx:number;
    private endX:number;
    private endY:number;
    public setInfo(cards:Array<number>,time:number):void
    {
        this.selectIdx=0;
        this.card1.init(337,100);
        this.card2.init(337+143,200);
        this.card3.init(337+143*2,300);
        this.canTap=true;
        this.cards=cards;
        this.time=time-2;
        this.time=Math.floor(this.time);
        if (this.time<0)
            this.time=0;
        this.lab.text = this.time.toString();         
        if(!this.timer)
            this.timer = new egret.Timer(1000);
        else
            this.timer.stop();
        this.timer.addEventListener(egret.TimerEvent.TIMER,this.onTimer,this);
        this.timer.start();
    }
    
    private onTimer(e:egret.TouchEvent)
    {
        if(this.time > 0) {
            this.time--;
            this.lab.text = this.time.toString();           
        }
        else {
            this.timer.stop();
            this.timer.removeEventListener(egret.TimerEvent.TIMER,this.onTimer,this);
            if (this.canTap)
            {
                this.canTap = false;
                this.dispatchEvent(new egret.Event(EventNamesNiu.AUTO_START));
            }
        }
    }
    
    private onTap(e:egret.TouchEvent):void
    {
        if (this.canTap)
        {
            this.canTap=false;
            var p:egret.Point;
            switch(e.currentTarget)
            {
                case this.card1:
                    this.selectIdx=1;
                    p=this.localToGlobal(this.card1.x-this.card1.width/2,this.card1.y-this.card1.height/2);
                    break;
                    
                case this.card2:
                    this.selectIdx = 2;
                    p = this.localToGlobal(this.card2.x - this.card2.width / 2,this.card2.y - this.card2.height / 2);
                    break;
                    
                case this.card3:
                    this.selectIdx = 3;
                    p = this.localToGlobal(this.card3.x - this.card2.width / 2,this.card3.y - this.card3.height / 2);
                    break;
            }
          
            this.endX=p.x;
            this.endY=p.y;
            this.dispatchEvent(new egret.Event(EventNamesNiu.AUTO_START));
//            this.show();
        }
    }
    
    public show():void
    {
        if (this.selectIdx==0)
            this.selectIdx=1;
        if (this.selectIdx==1)
        {
            this.card1.play1(this.cards[0]);
            this.card2.play2(this.cards[1]);
            this.card3.play2(this.cards[2]);
        }
        else if(this.selectIdx == 2) {
            this.card2.play1(this.cards[0]);
            this.card1.play2(this.cards[1]);
            this.card3.play2(this.cards[2]);
        }
        else if(this.selectIdx == 3) {
            this.card3.play1(this.cards[0]);
            this.card1.play2(this.cards[1]);
            this.card2.play2(this.cards[2]);
        }
    }
    
    private onComplete(e:egret.Event):void
    {
       if (this.parent)
           this.parent.removeChild(this);
        this.dispatchEvent(new egret.Event(egret.Event.COMPLETE,false,false,[this.endX,this.endY]));
    }
    
}

window["QznnChooseCard"]=QznnChooseCard;