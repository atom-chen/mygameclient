/**
 *
 * @author 
 *
 */
class Bubble extends eui.Component{
    private bubble:eui.Image;
    private text:eui.Label;
	public constructor() {
	    super();
	}
	
	public set Text(value:string)
	{
    	  var i:number=Number(value.substr(0,1));
        var j: number = Number(value.substr(1,1));
        var arr1: Array<any> = GameConfigNiu.language.chatList;
        if (arr1 && i<=arr1.length)
        {
            var arr2: Array<any> = GameConfigNiu.language.chatList[i-1].list;
            if (arr2 && j<=arr2.length)
            {
                if(j<arr2.length)
                    this.text.text = arr2[j];
                else
                    this.text.text = arr2[0];
             
                this.bubble.width=this.text.width+13;
                if(this.bubble.scaleX==-1)
                    this.text.x = -this.bubble.width + 13;
                else
                    this.text.x=7;
            }
        }
	}
	
	public set bubbleScaleX(value:number)
	{
	    this.bubble.scaleX=value;
	}
}

window["Bubble"]=Bubble;