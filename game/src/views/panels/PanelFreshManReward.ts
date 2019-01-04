/**
 *
 * @ cyj
 *
 */

class PanelFreshManReward extends alien.PanelBase {
    private static _instance: PanelFreshManReward;
    public static get instance(): PanelFreshManReward {
        if(this._instance == undefined) {
            this._instance = new PanelFreshManReward();
        }
        return this._instance;
    }

    constructor() {
        super(
            alien.popupEffect.Scale,{ withFade: true,ease: egret.Ease.backOut },
            alien.popupEffect.Scale,{ withFade: true,ease: egret.Ease.backIn }
        );
    }

    
    private btnGet: eui.Button;
    
    protected init(): void {
        this.skinName =  panels.PanelFreshManRewardSkin;
    }

    createChildren(): void {
        super.createChildren();
        server.addEventListener(EventNames.GET_FRESHMAN_REWARD_REP,this.onGetRewardRep,this);
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGetClick,this);
        this["item2Num_label"].text = GameConfig.getCfgByField("dbs_config.freshman_gold_reward");
    }
    
    private onGetRewardRep(event: egret.Event): void {
        let data: any = event.data;
        if(data.result == 0){
            alien.Dispatcher.dispatch(EventNames.GOLD_RAIN_EFFECT);
            PanelAlert3.instance.show('成功领取新手奖励: ' + data.gold + '金豆,记牌器在游戏中开启');
            
            server.removeEventListener(EventNames.GET_FRESHMAN_REWARD_REP,this.onGetRewardRep,this);
            // this.dealAction();
            MainLogic.instance.selfData.freshrewardgot = 2;
            this.close();
        }else{
            Alert.show('领取失败，错误编号:' + data.result);
        }
    }

    show(data: any = null,callback: Function = null): void {
        this._callback = callback;
        this.popup();
    }

    private onGetClick(event: egret.TouchEvent): void {
        server.GetFreshManReward();
    }
}