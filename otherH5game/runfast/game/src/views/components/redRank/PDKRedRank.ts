/**
 *
 * @author 
 *
 */
class PDKRedRank extends eui.Component{
	public constructor() {
    	super();
    	
    	this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
	}
	private list:eui.List;
	private myRank:PDKRedRankInfo;
	
    private dataProvider:eui.ArrayCollection;
	private arr:Array<any>;
	
    protected createChildren():void
	{
	    super.createChildren();
	    
	    this.arr=[];
	    this.dataProvider=new eui.ArrayCollection(this.arr);
	    this.list.itemRenderer=PDKRedRankInfo;
	    this.list.dataProvider=this.dataProvider;
	    
        let em: PDKalien.PDKEventManager = PDKalien.PDKEventManager.instance;
        em.registerOnObject(this,pdkServer,PDKEventNames.USER_REDCOIN_RANKING_LIST_REP,this.onRedcoinRankingListRep,this);
	}
	
	private onAddToStage(e:egret.Event):void
	{
        PDKalien.PDKEventManager.instance.enableOnObject(this);      
        pdkServer.getRedcoinRankingListReq();
	}
	
    private onRemoveFromStage(e: egret.Event): void {
        PDKalien.PDKEventManager.instance.disableOnObject(this);
    }
	
	/**
	 * 校验排行榜数据的完整性
	 */
	private _checkDataFormat():void{
		let _oneInfo = null;
		let _newInfo = {score:null,nickname:null,ranking:null,uid:0};
		let _newArr = [];
		for(let i=0;i<this.arr.length;++i){
			_oneInfo = this.arr[i];
			if(_oneInfo && _oneInfo.score && _oneInfo.ranking){
				_newInfo = _oneInfo;
				_newInfo.nickname = _newInfo.nickname || "";
				_newArr.push(_newInfo);
			}
		}
		this.arr = _newArr;
	}

    private onRedcoinRankingListRep(e:egret.Event):void
    {       
        this.arr=e.data.list;
        this.myRank.data=this.arr.shift();
		this._checkDataFormat();
        this.dataProvider.source=this.arr;
        this.dataProvider.refresh();
    }
	
	
}
