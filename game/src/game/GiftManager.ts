/**
 * Created by rockyl on 16/4/7.
 *
 * 物品管理
 */

class GiftManager{
	private static _instance:GiftManager;
	public static get instance():GiftManager {
		if (this._instance == undefined) {
			this._instance = new GiftManager();
		}
		return this._instance;
	}

	private icons = {
		[201]:"icon_gift_flower",
		[203]:"icon_gift_car",
		[202]:"icon_gift_crown",
		[204]:"icon_gift_plane",
		[205]:"icon_gift_rocket"
	}

	private giftArr:any = [];
	private giftMap:any = {};
	
	constructor(){
		this.init();
	}

	protected init():void{
		let cfg = GameConfig.getCfgByField('friends_cfg.item');
		this.giftMap = {};
		for(let id in cfg){
			let oneGift = cfg[id];
			oneGift.id = Number(id);
			oneGift.icon = this.icons[id];
			this.giftMap[id] = oneGift;
			this.giftArr.push(oneGift);
		}
	}

	getAllGifts():any{
		return this.giftArr.slice(0);
	}

	getGiftById(id:number):any{
		if(id == null) return;
		let gift:any = this.giftMap[id];
		if(!gift){
			console.warn('礼物不存在(id: %d)', id,arguments.callee.caller);
		}
		return gift;
	}
}
