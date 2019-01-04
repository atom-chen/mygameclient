/**
 *
 * @author 
 *
 */
class StatusLabel extends eui.Component{
    private timeTxt:eui.Label;
    private s1:eui.Image;
    private s2: eui.Image;
    private s3: eui.Image;
    private s4: eui.Image;
	public constructor() {
    	super();
	}
	
	public static GAME_START:number=1;
	public static RAB:number=2;
    public static BET: number = 3;
    public static WAIT_BET: number = 4;
    
    private interval:any;
    private time:number;
	public setStatus(val:number,leftTime:number)
	{
    	if (leftTime<0)
        	leftTime=0;
        this.s1.visible = false;
        this.s2.visible = false;
        this.s3.visible = false;
        this.s4.visible = false;
	    switch (val)
	    {
	        case StatusLabel.GAME_START:
	            this.timeTxt.x=202;
	            this.s1.visible=true;
	            break;
	            
            case StatusLabel.RAB:
                this.timeTxt.x = 157;
                this.s2.visible = true;
                break;
                
            case StatusLabel.BET:
                this.timeTxt.x = 204;
                this.s3.visible = true;
                break;
                
            case StatusLabel.WAIT_BET:
                this.timeTxt.x = 218;
                this.s4.visible = true;
                break;
	    }
	    this.timeTxt.text=""+leftTime;
	    this.time=leftTime;
        this.clearInterval();
        this.interval= egret.setInterval(()=>{
            this.onInterval();
        },this,1000);
	}
	
    private clearInterval():void{
        if(this.interval){
            egret.clearInterval(this.interval);
        }
        this.interval = null;
    }

	private onInterval():void
	{
        this.time--;
        if (this.time<=0){
            this.clearInterval();
        }
        else
        {
            this.timeTxt.text=""+this.time;
        }
	}
}

window["StatusLabel"]=StatusLabel;