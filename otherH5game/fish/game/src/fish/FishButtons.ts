/**
 * Created by eric.liu on 17/11/22.
 *
 * 按钮们
 */

class FishBtnRedpacket extends eui.Button {
    private fish_redpacket:eui.Label;
    private redGrp:eui.Group;
    
    createChildren(): void {
        super.createChildren();
        this.showRedGrp(false);
    }

    private showRedGrp(bShow:boolean):void{
        this.redGrp.visible = bShow;
    }

    private setNum(num:number):void{
        this.fish_redpacket.text = "" + num;
    }

    public getNum():number{
        return Number(this.fish_redpacket.text);
    }
    
    public updateNum(num:number):void{
        let v = true;
        if(num <=0){
            v = false;
        }
        this.setNum(num);
        this.showRedGrp(v);
    }

    constructor() {
        super();
        let self:FishBtnRedpacket = this;
        self.skinName = FishRedPacketButtonSkin;
    }
}

class FishBtnShopType extends eui.Button {
    public fish_shoptype_label:eui.Label;
    constructor() {
        super();
        let self:FishBtnShopType = this;
        self.skinName = FishShopTypeButtonSkin;
    }
}

class FishBtnCaptcha extends eui.Button {
    public fish_btn_captcha_title:eui.Label;
    constructor() {
        super();
        let self:FishBtnCaptcha = this;
        self.skinName = FishCaptchaButtonSkin;
    }
}