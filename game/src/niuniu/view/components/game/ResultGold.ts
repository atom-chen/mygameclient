/**
 *
 * @author 
 *
 */
class ResultGold extends eui.Component{
    private gold1:eui.BitmapLabel;
    private gold2: eui.BitmapLabel;
    private overFunc:any;
	public constructor() {
    	super();
	}
	
	public set Align(align:string)
	{
	    this.gold1.textAlign=align;
        this.gold2.textAlign = align;
	}
	
    public show(num: string,delay: number,overFunc:Function):void
	{
        this.overFunc = overFunc;
        if(Number(num) != 0)
        {
            var gold:eui.BitmapLabel;
        	  if (Number(num)>=0)
            {
                this.gold1.text =  "+" + num;
                gold=this.gold1;
            }
            else
            {
        	      this.gold2.text= num;
                  gold = this.gold2;
    	    }
        	  this.gold1.y=0;
        	  this.gold1.alpha=0;
            this.gold2.y = 0;
            this.gold2.alpha = 0;
        	egret.Tween.removeTweens(this.gold1);
            egret.Tween.removeTweens(this.gold2);
            
        	if (delay)
               egret.Tween.get(gold,null,null,null).wait(delay).to({y:-30, alpha: 1},1000).call(this.step1,this,[gold]);
           else 
               egret.Tween.get(gold,null,null,null).to({ y: -30,alpha: 1 },1000).call(this.step1,this,[gold]);
        }
	}
	
	private step1(gold:eui.BitmapLabel):void
	{
        egret.Tween.get(gold,null,null,null).wait(1000).to({ y: -60,alpha: 0 },500).call(this.step2,this);
	}
	
    private step2(): void {
        if (this.parent)
            this.parent.removeChild(this);
        if(this.overFunc){
            this.overFunc();
        }
    }
}

window["ResultGold"]=ResultGold;