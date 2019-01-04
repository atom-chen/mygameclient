/**
 *
 * @author 
 *
 */
class NiuUI extends eui.Component{
    private niuniu:eui.Group;
    private niux:eui.Group;
    private niupo:eui.Group;
    private num:eui.BitmapLabel;
    private niu11:eui.Image;
     private niu12:eui.Image;
     private niu13: eui.Image;
     private niu14: eui.Image;
     private extImg:eui.Image;

	public constructor() {
    	super();
	}
	
	public set Niu(value:number)
	{
        this.niuniu.visible = false;
        this.niupo.visible = false;
        this.niux.visible = false;
        this.niu11.visible = false;
        this.niu12.visible = false;
        this.niu13.visible = false;
        this.niu14.visible = false;
	    /*if (value==10)
    	     this.niuniu.visible=true;
        else if(value == 11)
            this.niu11.visible = true;
        else if(value == 12)
            this.niu12.visible = true;
        else if(value == 13)
            this.niu13.visible = true;
        else if(value == 14)
            this.niu14.visible = true;
    	else if (value==0)
            this.niupo.visible=true;
        else
        {
            this.niux.visible = true;
            this.num.text = (value % 10).toString();
        }*/

        //let _score = (value % 10);
        //this.niux.visible = true;
        //this.num.text = "" +  _score;
        this.extImg.source = CardTypeInfo[value].png;
        this.niux.visible = true;
	}
}

window["NiuUI"]=NiuUI;