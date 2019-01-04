/**
 * Created by rockyl on 15/11/22.
 */

class RunFastUtils {
	static sortCardIds(cards: any[]) {
		if (cards == null || cards.length < 1) return;
		let tmpArr2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//卡牌出现的次数
		let i: number;
		let j: number;
		for (i = 0; i < cards.length; ++i) {
			let num = Math.floor(cards[i] / 10);
			tmpArr2[num]++;
		}

		let tmp1Arr = [];
		let tmp2Arr = [];
		let tmp3Arr = [];
		let tmp3ArrX = [];
		let tmp4Arr = [];
		for (i = 0; i < tmpArr2.length; ++i) {
			if (tmpArr2[i] == 1) { //单
				tmp1Arr.push(i);
			} else if (tmpArr2[i] == 2) { //对
				tmp2Arr.push(i);
			}
			else if (tmpArr2[i] == 3) { //三带
				tmp3Arr.push(i);
				tmp3ArrX.push(i);
			}
			else if (tmpArr2[i] == 4) {//炸弹
				tmp4Arr.push(i);
				tmp3ArrX.push(i);
			}
		}

		//三带对
		if (tmp3Arr.length == 1 && tmp2Arr.length == 1 && cards.length == 5) {
			//return {ct:PDKSANDAIYIDUI, kv:tmp3Arr[0]};
			// console.log("PDKSANDAIER--对------>", tmp3Arr, tmp2Arr);
			// return { ct: PDKSANDAIER, kv: tmp3Arr[0] };
		}
		//三带二
		if (tmp3Arr.length == 1 && cards.length == 5) {
			// console.log("PDKSANDAIER--散------>", tmp3Arr, tmp1Arr);
			// return { ct: PDKSANDAIER, kv: tmp3Arr[0] };
		}
		//四带二
		if (tmp4Arr.length == 1 && cards.length == 6) {
			// console.log("PDKSIDAIER-------->", tmp4Arr, tmp1Arr, tmp2Arr, tmp3Arr);
			// return { ct: PDKSIDAIER, kv: tmp4Arr[0] };
		}

		if (tmp3ArrX.length > 1) {
			var tmp = RunFastCardsType.is_shun(tmp3ArrX, false);
			if (tmp.result) {
				if (cards.length == 4 * (tmp3ArrX.length)) { //飞机带单
					// console.log("PDKFEIJI--单------>", tmp3Arr, tmp1Arr, tmp2Arr);
				}
			}

			var tmp = RunFastCardsType.is_shun(tmp3ArrX);
			if (tmp.result && cards.length == 5 * tmp3ArrX.length) { //飞机带对
				// console.log("PDKFEIJI--二------>", tmp3Arr, tmp1Arr, tmp2Arr);
			}

			if (cards.length == 5 * tmp3ArrX.length) {
				var tmp = RunFastCardsType.is_shun(tmp3ArrX);
				if (tmp.result) {
					// console.log("PDKFEIJI--多1------>", tmp3Arr, tmp1Arr, tmp2Arr);
				}
			} else {
				var length = cards.length / 5;
				if (length > 1 && length % 1 == 0 && length != tmp3ArrX.length) {
					for (j = 0; j < tmp3ArrX.length - length + 1; j++) {
						let cardsTmp: number[] = [];
						for (var k = 0; k < length; k++) {
							cardsTmp.push(tmp3ArrX[k + j]);
						}
						var tmp = RunFastCardsType.is_shun(cardsTmp);
						if (tmp.result) {
							// console.log("PDKFEIJI--多2------>", tmp3Arr, tmp1Arr, tmp2Arr);
						}
					}
				}
			}
		}
		//飞机或三顺
		if (tmp3Arr.length > 1) {
			var tmp = RunFastCardsType.is_shun(tmp3Arr);
			if (tmp.result) {
				//飞机
				if (cards.length == 5 * tmp3Arr.length) {//3连飞机 333444555AABBCC						
					// console.log("PDKFEIJI--多3------>", tmp3Arr, tmp1Arr, tmp2Arr);
				}
			}
		}

		let orderIds = [];
		let needOrder = false;
		// for (i = 0; i < tmp4Arr.length; i++) {
		for (i = tmp4Arr.length - 1; i >= 0; i--) {
			for (j = 0; j < cards.length; j++) {
				let num = Math.floor(cards[j] / 10);
				if (tmp4Arr[i] == num) {
					orderIds.push(cards[j]);
					needOrder = true;
				}
			}
		}

		// for (i = 0; i < tmp3Arr.length; i++) {
		for (i = tmp3Arr.length - 1; i >= 0; i--) {
			for (j = 0; j < cards.length; j++) {
				let num = Math.floor(cards[j] / 10);
				if (tmp3Arr[i] == num) {
					orderIds.push(cards[j]);
					needOrder = true;
				}
			}
		}

		// for (i = 0; i < tmp2Arr.length; i++) {
		for (i = tmp2Arr.length - 1; i >= 0; i--) {
			for (j = 0; j < cards.length; j++) {
				let num = Math.floor(cards[j] / 10);
				if (tmp2Arr[i] == num) {
					orderIds.push(cards[j]);
				}
			}
		}

		// for (i = 0; i < tmp1Arr.length; i++) {
		for (i = tmp1Arr.length - 1; i >= 0; i--) {
			for (j = 0; j < cards.length; j++) {
				let num = Math.floor(cards[j] / 10);
				if (tmp1Arr[i] == num) {
					orderIds.push(cards[j]);
				}
			}
		}

		if (needOrder == false) {
			orderIds = cards;
			orderIds.sort((a: any, b: any): number => {
				return b - a;
			});
		}
		return orderIds;
	}
}