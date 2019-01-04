/**
 *
 * @author 
 *
 */
class QznnChooseCardInfo extends eui.Component{
	public constructor() {
    	super();
	}
	private card:CardUI;
	private light:eui.Image;
	private tweenTime:number=200;
    private moveTime: number = 200;
    private waitTime1:number=1500;
    private waitTime2: number = 1000;
//    private baseX:number;
//    private baseY: number;
	
	public play1(cardId:number):void
	{
    	egret.Tween.removeTweens(this);
    	this.scaleX=1;
    	this.light.visible=false;
	    egret.Tween.get(this).to({scaleX:0.01},this.tweenTime).call(()=>{
	       this.card.Card=cardId;
	       this.light.visible=true;
	    }).to({scaleX:1},this.tweenTime).wait(this.waitTime1).call(()=>{
	        this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
	    });
	}
	
    public play2(cardId: number): void {
        egret.Tween.removeTweens(this);
        this.scaleX = 1;
        this.light.visible = false;
        egret.Tween.get(this).wait(this.waitTime2).to({ scaleX: 0.01 },this.tweenTime).call(() => {
            this.card.Card = cardId;
//            this.light.visible = true;
        }).to({ scaleX: 1 },this.tweenTime);
    }
	
	public init(baseX:number,time:number):void
	{
    	this.light.visible=false;
        this.card.Card =0;
        this.x = baseX + 1170;
        this.alpha=0;
        egret.Tween.removeTweens(this);
        egret.Tween.get(this).to({x:baseX,alpha:1},time);
	}
}

window["QznnChooseCardInfo"]=QznnChooseCardInfo;