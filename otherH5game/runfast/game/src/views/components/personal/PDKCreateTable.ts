/**
 *
 * @ cyj
 *
 */
class PDKCreateTable extends PDKalien.PDKPanelBase {
    private static _instance: PDKCreateTable;
    public static get instance(): PDKCreateTable {
        if(this._instance == undefined) {
            this._instance = new PDKCreateTable();
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
    private info1:PDKCreateTableInfo;
    private info2:PDKCreateTableInfo;
    private info3:PDKCreateTableInfo;
    private info4:PDKCreateTableInfo;

    private lbcreatecost: eui.Label;
    private infoList:Array<PDKCreateTableInfo> = [];
    private btnCreate: eui.Button;

    private basescore:Array<any> = [];
    private maxodd:Array<any> = [];
    private roundcnt:Array<any> = [];
    private scorelimit:Array<any> = [];
    
    private createcost:Array<any> = [];
	//kickback = {150, 1000, 2000, 5000},

    private enterTableData:any;
    protected init(): void {
        this.skinName = components.PDKCreateTableSkin;
        // this.infoList.push(this.info1);
        // this.infoList.push(this.info2);
        // this.infoList.push(this.info3);
        // this.infoList.push(this.info4);
    }

    createChildren(): void {
        super.createChildren();
        // this.list.itemRenderer = PDKInviteListItem;
		
        // this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnCloseClick, this);
        let e: PDKalien.PDKEventManager = PDKEventManager.instance;
        // e.registerOnObject(this,this.btnClose,egret.TouchEvent.TOUCH_TAP,this.onBtnCloseClick,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtnCloseClick,this);
        this.btnCreate.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCreate,this);
        // this.scroller.addEventListener(eui.UIEvent.CHANGE_END,this.scroll2end,this);

        // PDKInviteService.instance.addEventListener(PDKEventNames.INVITE_DATA_REFRESH,this.onInviteDataUpdate,this)
        // e.registerOnObject(this,PDKInviteService.instance,,this.onInviteDataUpdate,this);

        pdkServer.addEventListener(PDKEventNames.CREATE_PERSONAL_GAME_REP, this.onCreateRep, this);

        // pdkServer.addEventListener(PDKEventNames.GAME_ENTER_TABLE, this.onEnterTable, this);
        // let em: PDKalien.PDKEventManager = PDKalien.PDKEventManager.instance;
		// em.registerOnObject(this, pdkServer, PDKEventNames.USER_MODIFY_USER_INFO_REP, this.onModifyUserInfoRep, this);
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
            // PDKlang.createPGameErr[data.result];

            // PDKToast.show(PDKlang.createPGameErr[data.result]);
            if(data.result == 7 || data.result == 11 ||  data.result == 4){
                PDKPanelRechargeTips.instance.show();
            }else{
                PDKImgToast.instance.show(this, PDKlang.createPGameErr[data.result]);
            }
            // PDKPanelAlert.instance.show('错误编号'+ data.result, 0);
        }else{
            // this.basescore[this.info3.Index], this.roundcnt[this.info1.Index], 
            
            // this.maxodd[this.info2.Index], this.scorelimit[this.info4.Index]

            // var xx:any = {roomid:data.roomid, basescore:this.basescore[this.info3.Index], roundcnt:this.roundcnt[this.info1.Index], 
            // maxodd:this.maxodd[this.info2.Index], scorelimit:this.scorelimit[this.info4.Index]};

            // xx.owner = {imageId:PDKMainLogic.instance.selfData.imageid, nickname:PDKMainLogic.instance.selfData.nickname};
            // PDKTableInfo.instance.show(xx);
            // this.dealAction();


            var roominfo = {roomID: data.roomid, maxodd: this.maxodd[this.info2.Index], maxround: this.roundcnt[this.info1.Index], 
            baseScore:this.basescore[this.info3.Index], matchType:1, personalgame:true, enterTableData:this.enterTableData, owner:pdkServer.uid};
            // pdkServer.startCache();
            PDKalien.PDKSceneManager.show(PDKSceneNames.PLAY, roominfo, PDKalien.sceneEffect.Fade);
            this.dealAction();
            
            // var xx:any = {roomid:data.roomid, basescore:{gg:11}, ss:22, ar:[12,22]};
            // xx.gfggd
        }
    }

    private onCreate(event: egret.TouchEvent): void {
        var gold = PDKMainLogic.instance.selfData.gold;
        if(gold < this.scorelimit[this.info4.Index]){
            // PDKImgToast.instance.show(this, '金豆不足，少于房间进入要求');
            PDKPanelRechargeTips.instance.show();
            return;
        }
        pdkServer.CreatePersonalGameReq(1, this.basescore[this.info3.Index], this.roundcnt[this.info1.Index], 
        this.maxodd[this.info2.Index], this.scorelimit[this.info4.Index]);
    }

    show(callback: Function = null): void {
        if(!this.basescore || this.basescore.length < 1){
            let data = PDKGameConfig.personalGameConfig.ddz;
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