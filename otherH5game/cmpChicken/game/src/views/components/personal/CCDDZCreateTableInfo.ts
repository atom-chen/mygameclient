/**
 *
 * @author 
 *
 */
class CCDDZCreateTableInfo extends eui.Component{
	public constructor() {
    	super();
	}
	
    // private btnLeft:eui.Button;
    // private btnRight:eui.Button;
    // private lb:eui.Label;
    
    private index:number;

    private data:Array<number> = [];
    private parent_view:any;
    protected createChildren(): void {
        super.createChildren();
        for(var i = 0; i < 4; ++i){
            this['img' + i].addEventListener(egret.TouchEvent.TOUCH_TAP,this.radioClicked,this);
        }
        // this.btnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onLeft,this);
        // this.btnRight.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onRight,this);
    }

    private radioClicked(event: egret.TouchEvent):void{
        var xx = Number(event.currentTarget.name);
        if(xx < 0 || xx > this.data.length){
            xx = 0;
        }
        // this.index = xx;
        // if(this.index < 0){
        //     this.index = this.data.length - 1;
        // }
        this.setIndex(xx);
    }
    
    public setData(data:Array<number>, parent_view:any = null):void{
        this.data = data;
        this.parent_view = parent_view;
        // this.index = 0;
        for(var i = 0; i < 4; ++i){
            if(i < data.length){
                this['img' + i].visible = true;
                this['lb' + i].visible = true;
                if(this.data[i].toString() == '0'){
                    this['lb' + i].text = '无限制';
                }else{
                    this['lb' + i].text = this.data[i].toString();
                }
            }else{
                this['img' + i].visible = false;
                this['lb' + i].visible = false;
            }
        }
        this.setIndex(0);
    }

    // private onLeft(e:egret.TouchEvent):void{
    //     --this.index;
    //     if(this.index < 0){
    //         this.index = this.data.length - 1;
    //     }
    //     this.setIndex(this.index);
    // }
    
    // private onRight(e: egret.TouchEvent): void {
    //     ++this.index;
    //     if(this.index >= this.data.length){
    //         this.index = 0;
    //     }
    //     this.setIndex(this.index);
    // }
    
    public setIndex(value:number){
        if (!value)
            value=0;
        // this.btnLeft.visible = this.data.length > 1;
        // this.btnRight.visible = this.data.length > 1;
        for(var i = 0; i < 4; ++i){
            if(i == value){
                this['img' + i].source = 'cc_personal_radio_c'

                this['lb' + i].textColor = 0xFFF600;
            }else{
                this['img' + i].source = 'cc_personal_radio_n'
                this['lb' + i].textColor = 0xFFFFFF;
            }
        }
        this.index=value;
        // if(this.index < 0 || this.index>=this.data.length){
        //     this.index=0;
        // }   
        // if(this.data[this.index].toString() == '0'){
        //     this.lb.text = '无限制';
        // }else{
        //     this.lb.text = this.data[this.index].toString();
        // }

        if(this.parent_view){
            this.parent_view.updateCreateCost(this.index)
        }
    }
    
    public get Index():number{
        return this.index;
    }
	
}

window["CCDDZCreateTableInfo"]=CCDDZCreateTableInfo;