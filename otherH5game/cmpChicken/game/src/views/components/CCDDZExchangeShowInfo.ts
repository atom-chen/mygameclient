/**
 *
 * @author 
 *
 */
class CCDDZExchangeShowInfo extends eui.Component{
    private _exservice:CCDDZExchangeService;
    private _timer: egret.Timer;
    /**
     * 首次显示,则必须显示一条抽奖券信息
     */
    private _showOne:boolean; 
    private _exchageViews: Array<ExchangeShowInfoView> = [];
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.addToStage,this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.removeFromStage,this);
    }
    
    
    
    createChildren(): void { 
    
        this._exservice = CCDDZExchangeService.instance;
        for (let i = 0;i < 3;i++)
        {
            let view = new ExchangeShowInfoView();
            view.touchChildren=false;
            view.touchEnabled=false;
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
        this._showOne = true;
        //注册事件侦听器
        this._timer.addEventListener(egret.TimerEvent.TIMER, this.showing,this);
        //开始计时
        this._timer.start(); 
    }
    onHide() { 
        if (this._timer != null)
        {
            this._timer.stop();
            this._timer.removeEventListener(egret.TimerEvent.TIMER, this.showing, this);
            this._timer = null;
        }
    }
    showing() { 
        let showview = this._exchageViews.pop();
   
        if (showview){ 
            let _info = this._exservice.getOneChouInfoFromFront(true);
            if(!_info && this._showOne){
                this._showOne = false;
                _info = this._exservice.getOneChouMaxInfo();
            }

            if (_info)
            {
                showview.setData(_info);
                showview.x = 0;
                showview.y = 0;
                showview.alpha = 1;
                egret.Tween.get(showview).to({ x: 0, y: -50 }, 1000).to({ x: 0, y: -150, alpha: 0 }, 2000).call(this.showend, this, [showview]);
            } else {
                this._exchageViews.push(showview);
            }
           
        }
    }
    
    showend(view) { 
        this._exchageViews.push(view);
    }
}

class ExchangeShowInfoView extends eui.Component { 
    private lbl_name: eui.Label;
    private lbl_coin: eui.Label;
    createChildren(): void {
        super.createChildren();
        this.skinName = components.CCDDZExchangeShowInfoSkin;
    }
    setData(data) {
        if(data.hasOwnProperty('nickname')){
            this.lbl_name.text = data.nickname;
        }else{
            this.lbl_name.text = '';
        }
       
        this.lbl_coin.textFlow =(new egret.HtmlTextParser).parser("抽得" +"<font color='#F0FF00'>"+ CCDDZUtils.exchangeRatio(data.money,true)+"</font>"+" 奖杯");       
        
    }

}
window["CCDDZExchangeShowInfo"]=CCDDZExchangeShowInfo;