/**
 *
 * @author zhanghaichuan
 *
 */
class PlayerHead2 extends PlayerHead1{
	public constructor() {
        super()
	}
	private goldIcon:eui.Image;
    private scoreBack:eui.Group;
    private gold1:eui.Label;
	
//    private nickName: eui.Label;
//    public set Nickname(val: string) {
//        this.nickName.text = val;
//    }
//    
//    public get Nickname():string
//    {
//        if (this.nickName)
//            return this.nickName.text;
//        else
//            return null;
//    }
    
    private gold: eui.Label;
    public set Gold(val:string){
        if(this.Nickname)
        {
            this.gold.text=GoldStr.GoldFormat(val);
            if (this.gold1)
                this.gold1.text = GoldStr.GoldFormat(val);
        }
        else
        {
            this.gold.text ="";
            if (this.gold1)
                this.gold1.text = "";
        }
    }
    
    public set Nickname(val: string) {
        this.nickName.text = val;
        this.checkShow();
    }
    
    public get Nickname(): string {
        if(this.nickName)
            return this.nickName.text;
        else
            return null;
    }
    
    private checkShow():void
    {
        if (this.needShowScore)
        {
            this.gold.visible=false;
            this.goldIcon.visible=false;
            if(this.Nickname == "" || this.Nickname==null) {
                if(this.scoreBack)
                    this.scoreBack.visible = false;
            }
            else {
                if(this.scoreBack)
                    this.scoreBack.visible = true;
            }
        }
        else
        {
            if(this.scoreBack)
                this.scoreBack.visible = false;
            if(this.Nickname == "") {
                if(this.goldIcon)
                    this.goldIcon.visible = false;   
                this.gold.visible = false;
            }
            else {
                if(this.goldIcon)
                    this.goldIcon.visible = true;
                this.gold.visible = true;
            }
        }
       
    }
    
    private needShowScore:boolean;
    public clear(needShowScore: boolean = false): void {
        this.needShowScore = needShowScore;
        super.clear(needShowScore);        
    }
    
}

window["PlayerHead2"]=PlayerHead2;