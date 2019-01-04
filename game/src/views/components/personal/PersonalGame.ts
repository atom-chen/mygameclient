/**
 *
 * @author 
 *
 */
class PersonalGame extends alien.NavigationPage {
    
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
        this.skinName = personal.PersnalGameSkin;
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

        CreateTable.instance.show();//, this.onCloseInvite.bind(this));
        server.checkReconnect();
    }

    // protected onCloseInvite(e:egret.TouchEvent):void{
        
    // }

    protected onJoin(e:egret.TouchEvent):void{
        JoinTable.instance.show();
    }

    protected onHitory(e:egret.TouchEvent):void{
        PersonalGameHistory.instance.clearDataList();
        PersonalGameHistory.instance.getDataList();
        HistoryRecord.instance.show(PersonalGameHistory.instance.source);
    }
}
