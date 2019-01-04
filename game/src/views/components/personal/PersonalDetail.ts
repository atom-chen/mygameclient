/**
 *
 * @ cyj
 *
 */
class PersonalDetail extends alien.PanelBase {
    private static _instance: PersonalDetail;
    public static get instance(): PersonalDetail {
        if(this._instance == undefined) {
            this._instance = new PersonalDetail();
        }
        return this._instance;
    }

    constructor() {
        super(
            alien.popupEffect.Scale,{ withFade: true,ease: egret.Ease.backOut },
            alien.popupEffect.Scale,{ withFade: true,ease: egret.Ease.backIn }
        );
    }

    //    private rectMask: eui.Rect;
    private btnClose: eui.Button;
    
    private item1: DetailItem;
    private item2: DetailItem;
    private item3: DetailItem;
    private imgPoint:eui.Image;
    private lbLeave:eui.Label;
    private btnLeave:eui.Button;

    protected init(): void {
       this.skinName = personal.DetailSkin;
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