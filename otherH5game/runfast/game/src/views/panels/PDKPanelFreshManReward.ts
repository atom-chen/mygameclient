/**
 *
 * @ cyj
 *
 */

class PDKPanelFreshManReward extends PDKalien.PDKPanelBase {
    private static _instance: PDKPanelFreshManReward;
    public static get instance(): PDKPanelFreshManReward {
        if(this._instance == undefined) {
            this._instance = new PDKPanelFreshManReward();
        }
        return this._instance;
    }

    constructor() {
        super(
            PDKalien.popupEffect.Scale,{ withFade: true,ease: egret.Ease.backOut },
            PDKalien.popupEffect.Scale,{ withFade: true,ease: egret.Ease.backIn }
        );
    }

    
    private btnGet: eui.Button;
    
    protected init(): void {
        this.skinName =  panels.PDKPanelFreshManRewardSkin;
    }

    createChildren(): void {
        super.createChildren();
        pdkServer.addEventListener(PDKEventNames.GET_FRESHMAN_REWARD_REP,this.onGetRewardRep,this);
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGetClick,this);
    }
    
    private onGetRewardRep(event: egret.Event): void {
        let data: any = event.data;
        if(data.result == 0){
            PDKalien.Dispatcher.dispatch(PDKEventNames.GOLD_RAIN_EFFECT);
            PDKPanelAlert3.instance.show('成功领取新手奖励: ' + data.gold + '金豆,记牌器在游戏中开启');
            
            pdkServer.removeEventListener(PDKEventNames.GET_FRESHMAN_REWARD_REP,this.onGetRewardRep,this);
            // this.dealAction();
            PDKMainLogic.instance.selfData.freshrewardgot = 2;
            this.close();
        }else{
            PDKAlert.show('领取失败，错误编号:' + data.result);
        }
    }

    show(data: any = null,callback: Function = null): void {
        this._callback = callback;
        this.popup();
    }

    private onGetClick(event: egret.TouchEvent): void {
        pdkServer.GetFreshManReward();
    }
}