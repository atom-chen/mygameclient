/**
 *
 * @author 
 *
 */
class RedRank extends eui.Component{
	public constructor() {
    	super();
    	
    	this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    	this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemoveFromStage,this);
	}
	private list:eui.List;
	private myRank:RedRankInfo;
	
    private dataProvider:eui.ArrayCollection;
	private arr:Array<any>;
	
    protected createChildren():void
	{
	    super.createChildren();
	    
	    this.arr=[];
	    this.dataProvider=new eui.ArrayCollection(this.arr);
	    this.list.itemRenderer=RedRankInfo;
	    this.list.dataProvider=this.dataProvider;
	    
        let em: alien.EventManager = alien.EventManager.instance;
        em.registerOnObject(this,server,EventNames.USER_REDCOIN_RANKING_LIST_REP,this.onRedcoinRankingListRep,this);
	}
	
	private onAddToStage(e:egret.Event):void
	{
        alien.EventManager.instance.enableOnObject(this);      
        server.getRedcoinRankingListReq();
	}
	
    private onRemoveFromStage(e: egret.Event): void {
        alien.EventManager.instance.disableOnObject(this);
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
		if(this.arr[0].uid == MainLogic.instance.selfData.uid){
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

window["RedRank"]=RedRank;