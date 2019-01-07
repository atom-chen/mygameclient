/**
 * Created by rockyl on 16/5/11.
 *
 * 充值
 */

class PDKRechargeService extends PDKService {
	private static _instance: PDKRechargeService;
	private isWaitTipShowing: boolean = false;
	private _rechargeTit = {
		[10047]: "初级场复活礼包", // 不带记牌器
		[10048]: "中级场复活礼包", // old
		[10049]: "高级场复活礼包", // old
		[10052]: "中级场复活礼包", // new-20180828
		[10053]: "高级场复活礼包", // new-20180828
	}
	public static get instance(): PDKRechargeService {
		if (this._instance == undefined) {
			this._instance = new PDKRechargeService();
		}
		return this._instance;
	}

	protected init(): void {
		pdkServer.addEventListener(PDKEventNames.USER_RECHARGE_RESULT_NOTIFY, this.onRechargeResultNotify, this);
	}

	private onRechargeResultNotify(event: egret.Event): void {
		let data: any = event.data;

		if (data.result == 0) {
			let _productId = data.productid;
			if (this._rechargeTit[_productId]) {
				PDKAlert.show("购买" + this._rechargeTit[_productId] + "成功!");
			}
		}
	}

	doRecharge(id: string): void {
		PDKwebService.rechagre(id);
	}
}