/**
 *
 * @ cyj
 *
 */
class CreateTable extends alien.PanelBase {
    private static _instance: CreateTable;
    public static get instance(): CreateTable {
        if(this._instance == undefined) {
            this._instance = new CreateTable();
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
    private info1:CreateTableInfo;
    private info2:CreateTableInfo;
    private info3:CreateTableInfo;
    private info4:CreateTableInfo;

    private lbcreatecost: eui.Label;
    private infoList:Array<CreateTableInfo> = [];
    private btnCreate: eui.Button;

    private basescore:Array<any> = [];
    private maxodd:Array<any> = [];
    private roundcnt:Array<any> = [];
    private scorelimit:Array<any> = [];
    
    private createcost:Array<any> = [];
	//kickback = {150, 1000, 2000, 5000},

    private enterTableData:any;
    protected init(): void {
        this.skinName = components.CreateTableSkin;
        // this.infoList.push(this.info1);
        // this.infoList.push(this.info2);
        // this.infoList.push(this.info3);
        // this.infoList.push(this.info4);
    }

    createChildren(): void {
        super.createChildren();
        // this.list.itemRenderer = InviteListItem;
		
        // this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnCloseClick, this);
        let e: alien.EventManager = EventManager.instance;
        // e.registerOnObject(this,this.btnClose,egret.TouchEvent.TOUCH_TAP,this.onBtnCloseClick,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtnCloseClick,this);
        this.btnCreate.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCreate,this);
        // this.scroller.addEventListener(eui.UIEvent.CHANGE_END,this.scroll2end,this);

        // InviteService.instance.addEventListener(EventNames.INVITE_DATA_REFRESH,this.onInviteDataUpdate,this)
        // e.registerOnObject(this,InviteService.instance,,this.onInviteDataUpdate,this);

        server.addEventListener(EventNames.CREATE_PERSONAL_GAME_REP, this.onCreateRep, this);

        // server.addEventListener(EventNames.GAME_ENTER_TABLE, this.onEnterTable, this);
        // let em: alien.EventManager = alien.EventManager.instance;
		// em.registerOnObject(this, server, EventNames.USER_MODIFY_USER_INFO_REP, this.onModifyUserInfoRep, this);
    }

    public updateCreateCost(idx:number):void{
        var val = 0;
        if(idx && this.createcost && this.createcost[idx]){
            val = this.createcost[idx]
        }

        if(val && val > 0){
            this.lbcreatecost.text = '创建费用: ' + val + "钻石";
        }else{
            this.lbcreatecost.text = '创建费用: 免费';
        }
    }

    private onCreateRep(event: egret.Event): void {
        let data: any = event.data;
        if(data.result != 0){
            //data.roomid
            // lang.createPGameErr[data.result];

            // Toast.show(lang.createPGameErr[data.result]);
            if(data.result == 7 || data.result == 11 ||  data.result == 4){
                PanelRechargeTips.instance.show();
            }else{
                ImgToast.instance.show(this, lang.createPGameErr[data.result]);
            }
            // PanelAlert.instance.show('错误编号'+ data.result, 0);
        }else{
            var roominfo = {roomID: data.roomid, maxodd: this.maxodd[this.info2.Index], maxround: this.roundcnt[this.info1.Index], 
            baseScore:this.basescore[this.info3.Index], matchType:1, personalgame:true, enterTableData:this.enterTableData, owner:server.uid};
            alien.SceneManager.show(SceneNames.PLAY, roominfo, alien.sceneEffect.Fade);
            this.dealAction();
        }
    }

    private onCreate(event: egret.TouchEvent): void {
        var gold = MainLogic.instance.selfData.gold;
        if(gold < this.scorelimit[this.info4.Index]){
            // ImgToast.instance.show(this, '金豆不足，少于房间进入要求');
            PanelRechargeTips.instance.show();
            return;
        }
        server.CreatePersonalGameReq(1, this.basescore[this.info3.Index], this.roundcnt[this.info1.Index], 
        this.maxodd[this.info2.Index], this.scorelimit[this.info4.Index]);
    }

    show(callback: Function = null): void {
        if(!this.basescore || this.basescore.length < 1){
            let data = GameConfig.personalGameConfig.ddz;
            this.basescore = data.basescore;
            this.maxodd = data.maxodd;
            this.roundcnt = data.roundcnt;
            this.scorelimit = data.scorelimit;
            this.createcost = data.createcost;
            // for(var i = 0; i < this.maxodd.length; ++i){
            //     if(this.maxodd[i] == 0){
            //         this.maxodd[i] = '无限制';
            //         break;
            //     }
            // }
        }

        this.info1.setData(this.roundcnt);
        this.info2.setData(this.maxodd);
        this.info3.setData(this.basescore, this);
        this.info4.setData(this.scorelimit);
    
        this._callback = callback;
        this.popup();//this.dealAction.bind(this)
    }

    private onBtnCloseClick(event: egret.TouchEvent): void {
        this.dealAction();
    }
}