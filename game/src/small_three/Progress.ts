
class Progress extends eui.Component{
    private bgImg:eui.Image;
    private maskImg:eui.Image;
    private proImg:eui.Image;
    private infoLabel:eui.Label;

    private _infoStr:string;
    private _time:number;
    private _leftTime:number; 
    private _timer:any;
    private _overFunc:any;
    private _oneAniStepLen:number;
    private _srcW:number;
    private _srcH:number;
    /**
     * 多少毫秒后进度条变化一次
     */
    private _ainStep:number;
    private _oneSecondsAniSteps:number;
    private _curAniStepNum:number = 0;
    /**
     * 开始的时间戳
     */
    private _startTimestamp:number;

	public constructor() {
    	super();
	}
	
	public init():void
	{     
	}
	
    protected createChildren(): void {
        super.createChildren();
        this.proImg.mask = this.maskImg;
    }

    private _calculateOneStepLen():void{
        this._oneAniStepLen = this._srcW / (1000 * this._time / this._ainStep);
        this._oneSecondsAniSteps =  1000 / this._ainStep;

    }

    /**
     * aniStep:多久之后进度条变化一次,必须能够整除1000
     */
	public startTimer(value:number,sInfo:string,overFunc:Function,aniStep:number = 500)
	{   
        this._ainStep = aniStep;
        this._srcW = this.width;
        this._srcH = this.height;
        this.maskImg.width = this.width;
        this._time = value;
        this._startTimestamp = new Date().getTime();
        this._leftTime = value;
        this._infoStr = sInfo || "剩余时间：{0} s";
        this._overFunc = overFunc;
        this._updateDesc();
        this._calculateOneStepLen();
        this._curAniStepNum = 0;
	    if (!this._timer){
            this._timer = egret.setInterval(()=>{
                this._curAniStepNum += 1;
                this.playOneStepAni();
                //console.log("time----->",curAniStepNum,this._leftTime,this._oneSecondsAniSteps);
                if(this._curAniStepNum >= this._oneSecondsAniSteps){
                    this._curAniStepNum = 0;
                    this.onOneSecond();
                }
            },this,aniStep); 
        }
	}
	
    private playOneStepAni():void{
        let curW = this.maskImg.width - this._oneAniStepLen;
        this.maskImg.width = curW;
    }

    private _updateDesc():void{
        this.infoLabel.text = this._infoStr.replace('{0}',"" + this._leftTime);
    }

	private onOneSecond():void
	{
        let curStamp = new Date().getTime();
        let diff = (curStamp - this._startTimestamp);
        let diffSec = Math.floor(diff / 1000);
        this._leftTime = this._time - diffSec;
        this._curAniStepNum = 0;
        this.maskImg.width = this._srcW * (this._leftTime/this._time);
        this._updateDesc();
        if(this._leftTime <=0){
            this.onComplete();
        }
	}
	
	private onComplete():void
	{
        if(this._overFunc){
            this._overFunc();
        }
	    this.stopTimer();
	}
    
    private clearTimer():void{
	    if (this._timer){
            egret.clearInterval(this._timer);
        }  
        this._timer = null;
    }
    
	public stopTimer():void
	{   
        this._overFunc = null;
        this.clearTimer();
	}
	
}

window["Progress"]=Progress;