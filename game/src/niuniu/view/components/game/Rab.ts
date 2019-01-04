/**
 *
 * @author 
 *
 */
class Rab extends eui.Component{
    private rab: eui.Image;
    private notRab: eui.Image;
    private rabValue:number=0;
	public constructor() {
    	super();
	}
	
	public set Rab(value:number)
	{
    	  this.rabValue=value;
    	  this.notRab.visible=false;
    	  this.rab.visible=false;
	    if (value==0)
        {
             this.notRab.visible=true;
        }
        else
        {
            this.rab.visible=true;           
        }
	}
	
	public get Rab():number
	{
        if(!this.rabValue)
            this.rabValue=0;
	    return this.rabValue;
	}
	
    public initRabValue() {
        this.rabValue=0;
        this.notRab.visible = false;
        this.rab.visible = false;
    }
}

window["Rab"]=Rab;