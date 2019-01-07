/**
 * Created by rockyl on 16/4/8.
 *
 * 背包逻辑
 */

class CCDDZBagService extends CCService{
	private static _instance:CCDDZBagService;
	public static get instance():CCDDZBagService {
		if (this._instance == undefined) {
			this._instance = new CCDDZBagService();
		}
		return this._instance;
	}

	bagItemMap:any;
	bagItemArray:CCDDZBagItemData[];

	private _refreshing:boolean;

	constructor(){
		super();

		this.init();
	}

	protected init():void{
		this.bagItemMap = {};
		this.bagItemArray = [];

	}

	start(cb):void {
		ccserver.addEventListener(CCGlobalEventNames.USER_BAG_INFO_REP, this.onBagInfoRep, this);
		this.refreshBagInfo();

		super.start(cb);
	}

	stop():void {
		super.stop();

		ccserver.removeEventListener(CCGlobalEventNames.USER_BAG_INFO_REP, this.onBagInfoRep, this);
	}

	/**
	 * 刷新背包数据
	 */
	refreshBagInfo(isForce: boolean = false):void{
		if(isForce || !this._refreshing){
			this._refreshing = true;
			ccserver.getBagInfo();
		}
	}

	/**
	 * 背包信息
	 * @param event
	 *
	 message item {
		required int32 id = 1;
		required int32 count = 2;
	 }
	 optional int32 result = 1;
	 repeated item items = 2;
	 */
	private onBagInfoRep(event:egret.Event):void{
		let data:any = event.data;
		this._refreshing = false;

		this.bagItemArray.forEach((item:CCDDZBagItemData)=>{
			item.count = 0;
		});
		//if(data.result == 0){
			data.items.forEach((item:any)=>{
				this.updateItemByData(item);
			});
		//}

		CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.BAG_INFO_REFRESH, false);
	}

	/**
	 * 根据id获取背包物品
	 * @param id
	 */
	getItemById(id:number):CCDDZBagItemData{
		return this.bagItemMap[id];
	}

	/**
	 * 根据id获取背包物品的数量
	 * @param id
	 */
	getItemCountById(id:number):number{
		let item:CCDDZBagItemData = this.getItemById(id);
		return item ? item.count : 0;
	}

	/**
	 * 更新单个背包物品信息
	 * @param data
	 * @returns {CCDDZBagItemData}
	 */
	updateItemByData(data:any):CCDDZBagItemData{
		let bagItemData:CCDDZBagItemData;

		if(CCDDZGoodsManager.instance.getGoodsById(data.id)){
			bagItemData = this.getItemById(data.id);
			if(!bagItemData){
				bagItemData = new CCDDZBagItemData();
				this.bagItemMap[data.id] = bagItemData;
				this.bagItemArray.push(bagItemData);
			}

			CCalien.CCDDZUtils.injectProp(bagItemData, data);
		}

		return bagItemData;
	}

	/**
	 * 更新背包物品数量
	 * @param id
	 * @param change
	 */
	updateItemCount(id:number, change:number):number{
		let bagItemData:CCDDZBagItemData = this.getItemById(id);
		if(bagItemData){
			let count:number = Math.max(bagItemData.count + change, 0);
			bagItemData.count = count;
			//this.dispatchEventWith(CCGlobalEventNames.BAG_COUNT_CHANGE, false, {id, count});
			CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.BAG_INFO_REFRESH, false);
			return count;
		}

		return 0;
	}
}

class CCDDZBagItemData{
	id:number;
	count:number;
}