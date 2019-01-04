/**
 * Created by rockyl on 16/4/8.
 *
 * 背包逻辑
 */

class BagService extends Service{
	private static _instance:BagService;
	public static get instance():BagService {
		if (this._instance == undefined) {
			this._instance = new BagService();
		}
		return this._instance;
	}

	bagItemMap:any;
	bagItemArray:BagItemData[];

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
		this.addEventListener();
		this.refreshBagInfo();

		super.start(cb);
	}

	stop():void {
		super.stop();

		server.removeEventListener(EventNames.USER_BAG_INFO_REP, this.onBagInfoRep, this);
	}

	addEventListener():void{
		server.addEventListener(EventNames.USER_BAG_INFO_REP, this.onBagInfoRep, this);
	}
	/**
	 * 刷新背包数据
	 */
	refreshBagInfo(isForce: boolean = false):void{
		if(isForce || !this._refreshing){
			this._refreshing = true;
			if(!server.hasEventListener(EventNames.USER_BAG_INFO_REP)){
				this.addEventListener();
			}
			server.getBagInfo();
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

		this.bagItemArray.forEach((item:BagItemData)=>{
			item.count = 0;
		});
		//if(data.result == 0){
			data.items.forEach((item:any)=>{
				this.updateItemByData(item);
			});
		//}

		alien.Dispatcher.dispatch(EventNames.BAG_INFO_REFRESH, false);
	}

	/**
	 * 根据id获取背包物品
	 * @param id
	 */
	getItemById(id:number):BagItemData{
		return this.bagItemMap[id];
	}

	/**
	 * 根据id获取背包物品的数量
	 * @param id
	 */
	getItemCountById(id:number):number{
		let item:BagItemData = this.getItemById(id);
		return item ? item.count : 0;
	}

	/**
	 * 更新单个背包物品信息
	 * @param data
	 * @returns {BagItemData}
	 */
	updateItemByData(data:any):BagItemData{
		let bagItemData:BagItemData;

		if(GoodsManager.instance.getGoodsById(data.id)){
			bagItemData = this.getItemById(data.id);
			if(!bagItemData){
				bagItemData = new BagItemData();
				this.bagItemMap[data.id] = bagItemData;
				this.bagItemArray.push(bagItemData);
			}

			alien.Utils.injectProp(bagItemData, data);
		}else if(data.id >= 200 && data.id <= 300) {
			this.bagItemMap[data.id] = data;
			bagItemData = data;
		}

		return bagItemData;
	}

	/**
	 * 更新背包物品数量
	 * @param id
	 * @param change
	 */
	updateItemCount(id:number, change:number):number{
		let bagItemData:BagItemData = this.getItemById(id);
		if(bagItemData){
			let count:number = Math.max(bagItemData.count + change, 0);
			bagItemData.count = count;
			//this.dispatchEventWith(EventNames.BAG_COUNT_CHANGE, false, {id, count});
			alien.Dispatcher.dispatch(EventNames.BAG_INFO_REFRESH, false);
			return count;
		}

		return 0;
	}
}

class BagItemData{
	id:number;
	count:number;
}