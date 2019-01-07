/**
 *
 * @ cyj
 *
 */

class CCDDZPanelFreshManReward extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelFreshManReward;
    public static get instance(): CCDDZPanelFreshManReward {
        if(this._instance == undefined) {
            this._instance = new CCDDZPanelFreshManReward();
        }
        return this._instance;
    }

    constructor() {
        super(
            CCalien.CCDDZpopupEffect.Scale,{ withFade: true,ease: egret.Ease.backOut },
            CCalien.CCDDZpopupEffect.Scale,{ withFade: true,ease: egret.Ease.backIn }
        );
    }

    
    private btnGet: eui.Button;
    
    protected init(): void {
        this.skinName =  panels.CCDDZPanelFreshManRewardSkin;
    }

    createChildren(): void {
        super.createChildren();
        ccserver.addEventListener(CCGlobalEventNames.GET_FRESHMAN_REWARD_REP,this.onGetRewardRep,this);
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGetClick,this);
        this["item2Num_label"].text = CCGlobalGameConfig.getCfgByField("dbs_config.freshman_gold_reward");
    }
    
    private onGetRewardRep(event: egret.Event): void {
        let data: any = event.data;
        if(data.result == 0){
            CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.GOLD_RAIN_EFFECT);
            CCDDZPanelAlert3.instance.show('成功领取新手奖励: ' + data.gold + '金豆,记牌器在游戏中开启');
            
            ccserver.removeEventListener(CCGlobalEventNames.GET_FRESHMAN_REWARD_REP,this.onGetRewardRep,this);
            // this.dealAction();
            CCDDZMainLogic.instance.selfData.freshrewardgot = 2;
            this.close();
        }else{
            CCDDZAlert.show('领取失败，错误编号:' + data.result);
        }
    }

    show(data: any = null,callback: Function = null): void {
        this._callback = callback;
        this.popup();
    }

    private onGetClick(event: egret.TouchEvent): void {
        ccserver.GetFreshManReward();
    }
}