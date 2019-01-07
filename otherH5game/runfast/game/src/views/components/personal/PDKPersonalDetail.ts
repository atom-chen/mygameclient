/**
 *
 * @ cyj
 *
 */
class PDKPersonalDetail extends PDKalien.PDKPanelBase {
    private static _instance: PDKPersonalDetail;
    public static get instance(): PDKPersonalDetail {
        if(this._instance == undefined) {
            this._instance = new PDKPersonalDetail();
        }
        return this._instance;
    }

    constructor() {
        super(
            PDKalien.popupEffect.Scale,{ withFade: true,ease: egret.Ease.backOut },
            PDKalien.popupEffect.Scale,{ withFade: true,ease: egret.Ease.backIn }
        );
    }

    //    private rectMask: eui.Rect;
    private btnClose: eui.Button;
    
    private item1: PDKDetailItem;
    private item2: PDKDetailItem;
    private item3: PDKDetailItem;
    private imgPoint:eui.Image;
    private lbLeave:eui.Label;
    private btnLeave:eui.Button;

    protected init(): void {
       this.skinName = personal.PDKDetailSkin;
    }

    createChildren(): void {
        // this.lbLeave.visible = false;
        // this.imgPoint.visible = false;
        // this.btnLeave.visible = false;
        super.createChildren();
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtnCloseClick,this);
    }

    show(data: any, callback: Function = null, leave:boolean = false, quitPlayer:string = null): void {
        if(data && data.length > 0){
            for(var i = 0; i < 3; ++i){
                if(data[i]){
                    this['item' + (i + 1)].setData(data[i].nickname, data[i].gold);
                }
            }
        }
        this.lbLeave.visible = false;
        this.imgPoint.visible = false;
        this.btnLeave.visible = false;
        if(leave){
            this.btnLeave.visible = true;
            this.btnLeave.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtnCloseClick,this);
        }
        if(quitPlayer){
            this.lbLeave.visible = true;
            this.imgPoint.visible = true;
            this.lbLeave.text = '因' + quitPlayer + '中途退出，游戏终止';
        }
        this._callback = callback;
        this.popup();//this.dealAction.bind(this)
    }

    private onBtnCloseClick(event: egret.TouchEvent): void {
        if(this._callback){
            this._callback('confirm');
        }
        this.dealAction();
    }
}

class PDKDetailItem extends eui.Component {
    protected lbName: eui.Label;
    protected lbGold: eui.Label;

    protected setData(name:any, gold:any): void {
        this.lbName.text = name;
        if(!gold || gold == null){
            gold = 0;
        }
        if(gold >= 0 ){
            this.lbGold.text = '+' + gold;
            this.lbGold.textColor = 0x68eb0c
        }else{
            this.lbGold.text = gold;
            this.lbGold.textColor = 0xfd1717
        }
    }
}