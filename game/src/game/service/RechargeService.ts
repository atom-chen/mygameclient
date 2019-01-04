/**
 * Created by rockyl on 16/5/11.
 *
 * 充值
 */

class RechargeService extends Service {
	private static _instance:RechargeService;
	private isWaitTipShowing: boolean = false;
	private _rechargeTit = {
		[10011]:"60钻石",
		[10012]:"180钻石",
		[10013]:"300钻石",
		[10014]:"525钻石",
		[10015]:"1100钻石",
		[10001]:"10000金豆",
		[10002]:"30000金豆",
		[10003]:"100000金豆",
		[10004]:"200000金豆",
		[10005]:"500000金豆",
		[10006]:"1100000金豆",
		[10007]:"首充礼包",
		[10042]:"钻石首充礼包",
		[10043]:"12元月卡",
		[10044]:"30元月卡",
		[80001]:"记牌器1天特权",
		[80002]:"记牌器3天特权",
		[80003]:"记牌器7天特权",
		[10009]:"复活礼包", //带记牌器
		[10016]:"复活礼包", //不带记牌器
		[10017]:"双11礼包",
		[10018]:"感恩节礼包",
		[10019]:"感恩节礼包",
		[10020]:"感恩节礼包",
		[10021]:"国庆礼盒",
		[10022]:"复活礼包", //带记牌器
		[10023]:"复活礼包", //不带记牌器
		[10024]:"复活礼包",
		[10025]:"复活礼包",
		[10026]:"复活礼包",
		[10027]:"复活礼包",
		[10028]:"复活礼包",
		[10032]:"复活礼包",
		[10033]:"复活礼包",
		[10029]:"复活礼包",
		[10030]:"复活礼包",
		[10031]:"复活礼包",
		[10034]:"复活礼包",
		[10035]:"复活礼包",
		[10036]:"复活礼包",
		[10037]:"复活礼包",
		[10038]:"复活礼包",
		[10039]:"复活礼包",
		[10040]:"复活礼包",
		[10041]:"复活礼包",
		[10045]:"3450钻石",
		[10050]:"复活礼包",
		[10051]:"复活礼包",
		[10059]:"每日特惠",
		[10055]:"每日特惠",
		[10056]:"每日特惠",
		[10057]:"每日特惠",
		[10058]:"每日特惠",
	}
	
	public static get instance():RechargeService {
		if (this._instance == undefined) {
			this._instance = new RechargeService();
		}
		return this._instance;
	}

	protected init():void{
		server.addEventListener(EventNames.USER_RECHARGE_RESULT_NOTIFY, this.onRechargeResultNotify, this);
	}

	private onRechargeResultNotify(event:egret.Event):void{
		let data:any = event.data;

		if(data.result == 0){
			let _productId = data.productid;
			if(this._rechargeTit[_productId]){
				Alert.show("购买"+ this._rechargeTit[_productId] +"成功!");
				if(_productId == 10042) { //钻石首充购买成功刷新活动界面
					PanelAct.getInstance().refreshActList();
					PanelDiaFirRecharge.nullInstance();
				}

				if(_productId == 10043 || _productId == 10044) {
					PanelMonthCard.instance._refreshMonthCardInfo();
				}
			}
			
			let ins = MainLogic.instance.selfData;
			if(_productId == 10059 || _productId == 10055 || _productId == 10056 || _productId == 10057 ||_productId == 10058){
				ins.setCanBuyDailyGift(false);
			}
			ins.addPayCount();
			ins.setHasPayToday(1);
			alien.Dispatcher.dispatch(EventNames.RECHARGE_ONE_SUCC);
		}
	}

	doRecharge(id:string):void{
        webService.rechagre(id);
	}
}