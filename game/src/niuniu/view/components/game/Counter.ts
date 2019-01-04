/**
 *
 * @author zhanghaichuan
 *
 */
class Counter extends eui.Component{
    private warnBtn:LabelButton;
    private numT1:eui.Label;
    private numT2: eui.Label;
    private numT3: eui.Label;
    private sumT: eui.Label;
    
	public constructor() {
    	super(); 
	}
	
    public initSkin():void
	{
        this.warnBtn.initSkin("btn_word_ts_n","btn_word_ts_h");
        this.warnBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
	}
	
	private onTap(e:egret.TouchEvent):void
	{
        GameSoundManagerNiu.playTouchEffect();
	    this.dispatchEvent(new egret.Event(EventNamesNiu.AUTO_START));
	}
	
    public setNumText(data:any):void
	{
        var type: string = data[0];
        var cardValue: number = data[1];
        if(type == EventNamesNiu.NUM_TYPE_ADD) {
            if(this.numT1.text == "") {
                this.numT1.text = cardValue.toString();
            }
            else if(this.numT2.text == "") {
                this.numT2.text = cardValue.toString();
            }
            else if(this.numT3.text == "") {
                this.numT3.text = cardValue.toString();
            }
        }
        else if(type == EventNamesNiu.NUM_TYPE_DELETE) {
            if(this.numT1.text == cardValue.toString()) {
                this.numT1.text = this.numT2.text;
                this.numT2.text = this.numT3.text;
                this.numT3.text = "";
            }
            else if(this.numT2.text == cardValue.toString()) {
                this.numT2.text = this.numT3.text;
                this.numT3.text = "";
            }
            else if(this.numT3.text == cardValue.toString()) {
                this.numT3.text = "";
            }
            else {
                console.log("移除数字error");
            }
        }
        else if(type == EventNamesNiu.NUM_TYPE_INIT) {
            this.initNum();
        }
        this.sumT.text = (Number(this.numT1.text) + Number(this.numT2.text) + Number(this.numT3.text)).toString();
        if(this.sumT.text=="0")
            this.sumT.text="";
    }
    
    public initNum(): void {
        this.numT1.text = "";
        this.numT2.text = "";
        this.numT3.text = "";
        this.sumT.text = "";
    }
}

window["Counter"]=Counter;