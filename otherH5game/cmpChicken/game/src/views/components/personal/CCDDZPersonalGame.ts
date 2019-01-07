/**
 *
 * @author 
 *
 */
class CCDDZPersonalGame extends CCalien.NavigationPage {
    
    private btnCreate: eui.Button;
	private btnJoin: eui.Button;
    private btnHistory: eui.Button;
	
	private backBtn:eui.Button;
    // private teamBuildTable:TeamBuildTable;
    // private teamCreateTable: TeamCreateTable;
    // private teamTable: TeamTable;
    // private teamJoinTable: TeamJoinTable;
    private titleBuildTable:eui.Image;
    private titleCreateTable:eui.Image;
    private titleJoinTable:eui.Image;
    
    constructor() {
		super();

		this.init();
	}

    protected init():void {
        this.skinName = personal.CCDDZPersnalGameSkin;
	}

    protected createChildren(): void {
        super.createChildren();

        this.btnCreate.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCreate,this);
        this.btnJoin.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onJoin,this);
        this.btnHistory.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onHitory,this);
    }
    /**
     * zhu
     */
    public beforeShow(params:any):void{
        super.beforeShow(params);
    }
    protected onCreate(e:egret.TouchEvent):void{
        // var data:Array<any> = new Array<any>();
		// data.push(
		// 	{roundcnt:[3, 6, 9, 15], basescore:[1, 500, 1000, 2000, 5000, 10000], maxodd:[12, 24, 0], scorelimit:[1000, 10000, 100000]}
        // )

        CCDDZCreateTable.instance.show();//, this.onCloseInvite.bind(this));
    }

    // protected onCloseInvite(e:egret.TouchEvent):void{
        
    // }

    protected onJoin(e:egret.TouchEvent):void{
        CCDDZJoinTable.instance.show();
    }

    protected onHitory(e:egret.TouchEvent):void{
        CCDDZPersonalGameHistory.instance.clearDataList();
        CCDDZPersonalGameHistory.instance.getDataList();
        CCDDZHistoryRecord.instance.show(CCDDZPersonalGameHistory.instance.source);
    }
}
