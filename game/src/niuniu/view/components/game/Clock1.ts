/**
 *
 * @author zhanghaichuan
 *
 */
class Clock1 extends eui.Component{
    private timeNum:eui.BitmapLabel;
    private circle:eui.Image;
    private shape:egret.Shape;
    private light:eui.Image;
    
    
    private r:number=42;
    private fullTime:number;
    private time:number;    
    private timerCount:number;
    private timer:any;
	public constructor() {
    	super();
	}
	
	public init():void
	{
        if(!this.shape)
        {
            this.shape = new egret.Shape();              
            this.shape.x=50;
            this.shape.y=50;
            this.addChild(this.shape);
            this.circle.mask = this.shape;
        }       
	}
	
	private timePer:number=50;
	private timePerCount:number=20;

	public set Num(value:number)
	{     
    	  if (value<0)
        	  value=0;
    	value=Math.floor(value);    	 
    	this.light.rotation=0;
        this.timerCount=0;
     	this.fullTime=value;
	    this.time=value;
	    this.timeNum.text=value.toString();
	    this.light.visible=true;

	    if (!this.timer){
            this.timer = egret.setInterval(()=>{
                this.onTimer();
            },this,1000); 
        }
	}
	
	private onTimer():void
	{
        this.time = this.time -1;
        this.timeNum.text =  "" + this.time;
        if(this.time <=0){
            this.onComplete();
            return;
        }
	}
	
	private onComplete():void
	{
	    this.stopTimer();
	}
    
    private clearTimer():void{
	    if (this.timer){
            egret.clearInterval(this.timer);
        }  
        this.timer = null;
    }
    
	public stopTimer():void
	{
        this.clearTimer();
	}
	
    private stepRotate(): void {
        if(this.time > 0) {
            this.timerCount++;   
            this.shape.graphics.clear();
            this.shape.graphics.beginFill(0x00ffff,1);
            this.shape.graphics.moveTo(0,0);
            this.shape.graphics.lineTo(0,53);
            this.shape.graphics.drawArc(0,0,53,-Math.PI /2+2 * Math.PI / (this.fullTime * this.timePerCount) * this.timerCount,Math.PI / 2 * 3);
            this.shape.graphics.lineTo(0,0);
            this.shape.graphics.endFill();
            
            
            this.light.rotation = 360 / (this.fullTime * this.timePerCount) * this.timerCount;
        }
        else {
            this.light.visible=false;
        }
    }
}

window["Clock1"]=Clock1;