/**
 * Created by rockyl on 15/12/30.
 *
 * 金豆展示类,自带金豆比率处理
 */

class Gold extends eui.Component {
    public imgIcon: eui.Image;
    private labGold: eui.Label;
    public btnRecharge: eui.Button;
    public nGold:number;
    public bgImg:eui.Image;
    private _isMatch: boolean;

    createChildren(): void {
        super.createChildren();

        this.btnRecharge.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtnRechargeTap,this);
    }

    private onBtnRechargeTap(event: egret.TouchEvent): void {
        if(this.currentState == "withButton"){//金豆
            PanelExchange2.instance.show();
        }
        else if(this.currentState == "diamondBuy"){ //钻石
            PanelExchange2.instance.show(1);
        }
    }

    /**
     * 10万以内显示精确数字，100万以内显示xx.x万，大于等于100万显示x万
     */
    private _formatGold(nGold:number):string{
        this.nGold = nGold;
        let _str = "" + nGold;
        if (nGold >= 1000000){
            _str = _str.substring(0,_str.length - 4) + "万";
        }
        else if(nGold > 100000){
            _str = _str.substr(0,2) + "." + _str.substr(2,1) + "万";
        }
        return _str;
    }

    updateGold(gold: number): void {
        if(this.labGold) {
            if(gold == null){
                gold = 0;
            }else if(gold == undefined){
                return;
            }

            this.labGold.text = this._formatGold(gold);
            this.commitProperties();
        }
    }   

    updateDiamondNum(nDiamond: number, self): void {
        if (!nDiamond) nDiamond = 0;
        if (this.labGold) {
            let oriGold = Number(this.nGold);
            let allGold = oriGold + nDiamond;
            console.log("updatenDiamond-------------》", oriGold, nDiamond, allGold);
            this.labGold.text = this._formatGold(allGold);
        }
    }

    getGold():number{
        return this.nGold;
    }

    setEmpty(): void {
        this.labGold.text = '';
        this.validateNow();
    }
    //显示钻石
    showDiamond():void{
        this.imgIcon.source = "icon_diamond";
    }

    setType(isMatch: boolean,matchType: number = 0): void {
        if(this._isMatch = isMatch) {
            switch(matchType) {
                case 0:   //积分赛
                    this.imgIcon.source = ResNames.icon_score;
                    break;
                case 1:   //金豆赛
                    this.imgIcon.source = ResNames.icon_gold;
                    break;
            }
        } else {
            this.imgIcon.source = ResNames.icon_gold;
        }

        this.btnRecharge.visible = !isMatch;
    }
}
window["Gold"]=Gold;