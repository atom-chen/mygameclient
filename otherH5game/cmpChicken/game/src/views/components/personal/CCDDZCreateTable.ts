/**
 *
 * @ cyj
 *
 */
class CCDDZCreateTable extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZCreateTable;
    public static get instance(): CCDDZCreateTable {
        if(this._instance == undefined) {
            this._instance = new CCDDZCreateTable();
        }
        return this._instance;
    }

    constructor() {
        super(
            CCalien.CCDDZpopupEffect.Scale,{ withFade: true,ease: egret.Ease.backOut },
            CCalien.CCDDZpopupEffect.Scale,{ withFade: true,ease: egret.Ease.backIn }
        );
    }

//    private rectMask: eui.Rect;
    private btnClose: eui.Button;
    private info1:CCDDZCreateTableInfo;
    private info2:CCDDZCreateTableInfo;
    private info3:CCDDZCreateTableInfo;
    private info4:CCDDZCreateTableInfo;

    private lbcreatecost: eui.Label;
    private infoList:Array<CCDDZCreateTableInfo> = [];
    private btnCreate: eui.Button;

    private basescore:Array<any> = [];
    private maxodd:Array<any> = [];
    private roundcnt:Array<any> = [];
    private scorelimit:Array<any> = [];
    
    private createcost:Array<any> = [];
	//kickback = {150, 1000, 2000, 5000},

    private enterTableData:any;
    protected init(): void {
        this.skinName = components.CCDDZCreateTableSkin;
        // this.infoList.push(this.info1);
        // this.infoList.push(this.info2);
        // this.infoList.push(this.info3);
        // this.infoList.push(this.info4);
    }

    createChildren(): void {
        super.createChildren();
        // this.list.itemRenderer = CCDDZInviteListItem;
		
        // this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnCloseClick, this);
        let e: CCalien.CCDDZEventManager = CCDDZEventManager.instance;
        // e.registerOnObject(this,this.btnClose,egret.TouchEvent.TOUCH_TAP,this.onBtnCloseClick,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtnCloseClick,this);
        this.btnCreate.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCreate,this);
        // this.scroller.addEventListener(eui.UIEvent.CHANGE_END,this.scroll2end,this);

        // CCDDZInviteService.instance.addEventListener(CCGlobalEventNames.INVITE_DATA_REFRESH,this.onInviteDataUpdate,this)
        // e.registerOnObject(this,CCDDZInviteService.instance,,this.onInviteDataUpdate,this);

        ccserver.addEventListener(CCGlobalEventNames.CREATE_PERSONAL_GAME_REP, this.onCreateRep, this);

        // ccserver.addEventListener(CCGlobalEventNames.GAME_ENTER_TABLE, this.onEnterTable, this);
        // let em: CCalien.CCDDZEventManager = CCalien.CCDDZEventManager.instance;
		// em.registerOnObject(this, ccserver, CCGlobalEventNames.USER_MODIFY_USER_INFO_REP, this.onModifyUserInfoRep, this);
    }

    public updateCreateCost(idx:number):void{
        var val = 0;
        if(idx && this.createcost && this.createcost[idx]){
            val = this.createcost[idx]
        }

        if(val && val > 0){
            this.lbcreatecost.text = '创建费用: ' + val;
        }else{
            this.lbcreatecost.text = '创建费用: 免费';
        }
    }

    private onCreateRep(event: egret.Event): void {
        let data: any = event.data;
        if(data.result != 0){
            //data.roomid
            // lang.createPGameErr[data.result];

            // CCDDZToast.show(lang.createPGameErr[data.result]);
            if(data.result == 7 || data.result == 11 ||  data.result == 4){
                CCDDZPanelRechargeTips.instance.show();
            }else{
                CCDDZImgToast.instance.show(this, lang.createPGameErr[data.result]);
            }
            // CCDDZPanelAlert.instance.show('错误编号'+ data.result, 0);
        }else{
            // this.basescore[this.info3.Index], this.roundcnt[this.info1.Index], 
            
            // this.maxodd[this.info2.Index], this.scorelimit[this.info4.Index]

            // var xx:any = {roomid:data.roomid, basescore:this.basescore[this.info3.Index], roundcnt:this.roundcnt[this.info1.Index], 
            // maxodd:this.maxodd[this.info2.Index], scorelimit:this.scorelimit[this.info4.Index]};

            // xx.owner = {imageId:CCDDZMainLogic.instance.selfData.imageid, nickname:CCDDZMainLogic.instance.selfData.nickname};
            // CCDDZTableInfo.instance.show(xx);
            // this.dealAction();


            var roominfo = {roomID: data.roomid, maxodd: this.maxodd[this.info2.Index], maxround: this.roundcnt[this.info1.Index], 
            baseScore:this.basescore[this.info3.Index], matchType:1, personalgame:true, enterTableData:this.enterTableData, owner:ccserver.uid};
            // ccserver.startCache();
            CCalien.CCDDZSceneManager.show(CCGlobalSceneNames.PLAY, roominfo, CCalien.CCDDZsceneEffect.CCDDFade);
            this.dealAction();
            
            // var xx:any = {roomid:data.roomid, basescore:{gg:11}, ss:22, ar:[12,22]};
            // xx.gfggd
        }
    }

    private onCreate(event: egret.TouchEvent): void {
        var gold = CCDDZMainLogic.instance.selfData.gold;
        if(gold < this.scorelimit[this.info4.Index]){
            // CCDDZImgToast.instance.show(this, '金豆不足，少于房间进入要求');
            CCDDZPanelRechargeTips.instance.show();
            return;
        }
        ccserver.CreatePersonalGameReq(1, this.basescore[this.info3.Index], this.roundcnt[this.info1.Index], 
        this.maxodd[this.info2.Index], this.scorelimit[this.info4.Index]);
    }

    show(callback: Function = null): void {
        if(!this.basescore || this.basescore.length < 1){
            let data = CCGlobalGameConfig.personalGameConfig.ddz;
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