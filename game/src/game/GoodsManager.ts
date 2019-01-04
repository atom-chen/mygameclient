/**
 * Created by rockyl on 16/4/7.
 *
 * 物品管理
 */

class GoodsManager{
	private static _instance:GoodsManager;
	public static get instance():GoodsManager {
		if (this._instance == undefined) {
			this._instance = new GoodsManager();
		}
		return this._instance;
	}

	goodsArray:any[];
	goodsMap:any;

	constructor(){
		this.init();
	}

	protected init():void{
		this.goodsMap = {};
		this.goodsArray = GameConfig.goodsConfig.map((config:any):GoodsConfig=>{
			let goodsConfig:GoodsConfig = GoodsConfig.create(config);
			this.goodsMap[goodsConfig.id] = goodsConfig;

			return goodsConfig;
		});
	}

	getGoodsById(id:number):GoodsConfig{
		if(id == null) return;
		let goods:GoodsConfig = this.goodsMap[id];
		if(!goods){
			console.warn('物品不存在(id: %d)', id);
		}else{
			return goods;
		}
	}
}

class GoodsConfig{
	id:number;
	name:string;
	describe:string;
	getWay:string;

	static create(config:any):GoodsConfig{
		let instance:GoodsConfig = new GoodsConfig();
		alien.Utils.injectProp(instance, config);
		return instance;
	}
}