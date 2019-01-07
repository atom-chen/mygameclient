/**
 *
 * @author 
 *
 */
class PDKExchangeShowInfo extends eui.Component {
    private _exservice: PDKMsgInfoService;
    private _timer: egret.Timer;
    private _exchageViews: Array<PDKExchangeShowInfoView> = [];
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this);
    }

    createChildren(): void {
        this._exservice = PDKMsgInfoService.instance;
        for (let i = 0; i < 3; i++) {
            let view = new PDKExchangeShowInfoView();
            view.touchChildren = false;
            view.touchEnabled = false;
            view.alpha = 0;
            this.addChild(view);
            this._exchageViews.push(view);
        }
    }

    protected addToStage(e: egret.Event): void {
        this.onShow();
    }

    protected removeFromStage(e: egret.Event): void {
        this.onHide();
    }

    onShow() {
        if (!this._timer) {
            this._timer = new egret.Timer(1000, 0);
        }
        //注册事件侦听器
        this._timer.addEventListener(egret.TimerEvent.TIMER, this.showing, this);
        //开始计时
        this._timer.start();
    }
    onHide() {
        if (this._timer != null) {
            this._timer.stop();
            this._timer.removeEventListener(egret.TimerEvent.TIMER, this.showing, this);
            this._timer = null;
        }
    }
    showing() {
        let showview = this._exchageViews.pop();

        if (showview) {
            let data = this._exservice._showInfoQueen.shift();//
            if (data) {
                showview.setData(data);
                showview.x = 0;
                showview.y = 0;
                showview.alpha = 1;
                egret.Tween.get(showview).to({ x: 0, y: -50 }, 1000).to({ x: 0, y: -150, alpha: 0 }, 2000).call(this.showend, this, [showview]);
            } else {
                // PDKMsgInfoService.instance.getRedCoinData();
                this._exchageViews.push(showview);
            }

        }
    }

    showend(view) {
        this._exchageViews.push(view);
    }
}

class PDKExchangeShowInfoView extends eui.Component {
    private lbl_name: eui.Label;
    private lbl_coin: eui.Label;
    createChildren(): void {
        super.createChildren();
        this.skinName = components.PDKExchangeShowInfoSkin;
    }
    setData(data) {
        if (data.hasOwnProperty('nickname')) {
            this.lbl_name.text = data.nickname;
        } else {
            this.lbl_name.text = '';
        }

        this.lbl_coin.textFlow = (new egret.HtmlTextParser).parser("抽得" + "<font color='#F0FF00'>" + PDKUtils.exchangeRatio(data.money, true) + "</font>" + " 奖杯");

    }

}