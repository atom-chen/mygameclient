/**
 *
 * @author 
 *
 */
class CCDDZRedRank extends eui.Component{
	public constructor() {
    	super();
    	
    	this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    	this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemoveFromStage,this);
	}
	private list:eui.List;
	private myRank:CCDDZRedRankInfo;
	
    private dataProvider:eui.ArrayCollection;
	private arr:Array<any>;
	
    protected createChildren():void
	{
	    super.createChildren();
	    
	    this.arr=[];
	    this.dataProvider=new eui.ArrayCollection(this.arr);
	    this.list.itemRenderer=CCDDZRedRankInfo;
	    this.list.dataProvider=this.dataProvider;
	    
        let em: CCalien.CCDDZEventManager = CCalien.CCDDZEventManager.instance;
        em.registerOnObject(this,ccserver,CCGlobalEventNames.USER_REDCOIN_RANKING_LIST_REP,this.onRedcoinRankingListRep,this);
	}
	
	private onAddToStage(e:egret.Event):void
	{
        CCalien.CCDDZEventManager.instance.enableOnObject(this);      
        ccserver.getRedcoinRankingListReq();
	}
	
    private onRemoveFromStage(e: egret.Event): void {
        CCalien.CCDDZEventManager.instance.disableOnObject(this);
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
		let _myData = {ranking:0}
		/*this.arr = [];
		for(let i=0;i<11;++i){
			this.arr.push({score:1000*i+1,nickname:"tttt"+i,ranking:i,uid:1000000+i})
		}*/

		if (!this.arr || this.arr.length <1){
			return;
		}
		if(this.arr[0].uid == CCDDZMainLogic.instance.selfData.uid){
			_myData = this.arr.shift();
		}

		if(_myData.ranking == 0){
			this.myRank.visible = false;
			this["rankScroller"].height = 450;
			this["rankScroller"].y = 55;
		}else{
			this.myRank.visible = true;
        	this.myRank.data = _myData;
			this["rankScroller"].height = 400;
			this["rankScroller"].y = 100;
		}
		this.validateNow();
		this._checkDataFormat();
        this.dataProvider.source=this.arr;
        this.dataProvider.refresh();
    }
	
	
}

window["CCDDZRedRank"]=CCDDZRedRank;