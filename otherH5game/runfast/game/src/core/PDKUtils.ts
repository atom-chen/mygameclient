/**
 * Created by rockyl on 15/11/22.
 */

class PDKUtils {
	static mapping: number[] = [1, 2, 14, 15];
	static _sensitive: string[];

	static pid2poker(pid) {
		let num = Math.floor(pid / 10);
		if (num <= 11) {
			num += 2;
		} else {
			num = this.mapping[num - 12];
		}
		let sign = pid % 10;
		let signColor;
		if (num == 14) {
			signColor = 'black';
		} else if (num == 15) {
			signColor = 'red';
		} else {
			signColor = pid % 2 == 0 ? 'red' : 'black';
		}

		return { num, sign, signColor };
	}

	static transformCards(cards: number[]): number[] {
		for (var i = 0, length = cards.length; i < length; i++) {
			if (cards[i] >= 30) {
				cards[i] -= 20;
			} else {
				cards[i] += 110;
			}
		}
		return cards;
	}

	static unTransformCards(cards: number[]): number[] {
		if (cards.length == 0) return [];
		for (var i = 0, length = cards.length; i < length; i++) {
			if (cards[i] < 120) {
				cards[i] += 20;
			} else {
				cards[i] -= 110;
			}
		}
		return cards;
	}


	/**
	 * 回收卡牌
	 * @param container
	 * @param removeFunc
	 */
	static recycleCards(container: egret.DisplayObjectContainer, removeFunc: Function = null): void {
		let card: PDKCard;
		if (removeFunc) {
			for (let i = 0, li = container.numChildren; i < li; i++) {
				card = <PDKCard>container.getChildAt(i);
				removeFunc(card);
			}
		} else {
			while (container.numChildren > 0) {
				card = <PDKCard>container.removeChildAt(0);
				PDKCard.recycle(card);
			}
		}
	}

	/**
	 * 排序
	 * @param pokers
	 */
	static order(pokers): void {
		pokers.sort((p1, p2): number => {
			return p2 - p1;
		});
	}

	/**
	 * 货币比率
	 * @param old
	 * @param putZero
	 */
	static currencyRatio(old: any, putZero: boolean = false): string {
		if (old === null) {
			return '';
		}
		let v: number = typeof old == 'string' ? parseInt(old) : old;
		v /= PDKGameConfig.currencyRatio;
		let ret: string = v.toString();
		let pIndex: number = ret.indexOf('.');

		if (putZero) {
			if (pIndex < 0) {
				ret += '.00';
			} else {
				if (ret.length - ret.indexOf('.') == 2) {
					ret += '0';
				}
			}
		}

		return ret;
	}
    /**
         * 红包兑换比率
         * @param old
         * @param putZero
         */
	static exchangeRatio(old: any, putZero: boolean = false): string {
		if (old === null) {
			return '';
		}
		let v: number = typeof old == 'string' ? parseInt(old) : old;
		v /= PDKGameConfig.exchangeRatio;
		let ret: string = v.toString();
		let pIndex: number = ret.indexOf('.');

		if (putZero) {
			if (pIndex < 0) {
				ret += '.00';
			} else {
				if (ret.length - ret.indexOf('.') == 2) {
					ret += '0';
				}
			}
		}

		return ret;
	}

	static roomScoreFormat(old: any): string {
		var t: number = Number(old);
		if (t > 9999) {
			t = Math.floor(t / 10000);
			var k: number = Math.floor((old - t * 10000) / 1000);
			if (k > 0)
				return t + "万" + k;
			else
				return t + "万";
		}
		else {
			return t.toString();
		}
	}

	static countDown(time: number, renderFunc: Function, onComplete: Function = null, step: number = 1000): number {
		let total: number = time;
		let repeat: number = Math.floor(time / step);
		return PDKalien.repeat(() => {
			total -= step;

			renderFunc(total / step);
		}, step, repeat, onComplete, true);
	}

	/**
	 * 物品列表转字符串s
	 * @param items
	 * @param countLimit
	 * @constructor
	 */
	static goodsListToString(items: any[], countLimit: number = 0): string {
		let arr: string[] = [];
		let len = countLimit == 0 ? items.length : Math.min(items.length, countLimit);
		for (let i = 0; i < len; i++) {
			let item = items[i];
			arr.push(PDKGoodsManager.instance.getGoodsById(item.id).name + 'x' + item.count);
		}

		return arr.join(' ');
	}

	/**
	 * 转换物品信息为物品数组
	 * @param str
	 * @returns {any[]}
	 */
	static parseGoodsString(str: string): any[] {
		let result: any[] = [];

		if (str) {
			let arr: string[] = str.split('|');
			arr.forEach((item: string) => {
				let arr2: string[] = item.split(':');
				let id: number = parseInt(arr2[0]);
				let count: number = parseInt(arr2[1]);
				if (id == 1) { count /= 100; }
				result.push({ id, count });
			});
		}

		return result;
	}

	static regNickname(nickname) {
		return !nickname.match(/^[0-9a-zA-Z\u4e00-\u9fa5_]*$/);
	}

	/**
	 * 判断是否是函数 zhu
	 */
	static isFunction(o: any): boolean {
		return Object.prototype.toString.call(o) === '[object Function]';
	}

	/**
	 * 判断是否是数组 zhu
	 */
	static isArray(o: any): boolean {
		return Object.prototype.toString.call(o) === '[object Array]';
	}

	/**
	 * 判断是否是对象 zhu
	 */
	static isObject(o: any): boolean {
		return Object.prototype.toString.call(o) === '[object Object]';
	}
	/* 
    * 获取时间戳差值对应的时间
    * 返回精度为：秒，分，小时，天
    */
	static getTimeStampDiff(startTimeStamp: number, endTimeStamp: number, diffType: string): number {
		let _startStmp = startTimeStamp;
		let _endStmp = endTimeStamp;
		diffType = diffType.toLowerCase();
		let sTime: Date = new Date(_startStmp);
		let eTime: Date = new Date(_endStmp);
		let divNum = 1;
		switch (diffType) {
			case "second":
				divNum = 1000;
				break;
			case "minute":
				divNum = 1000 * 60;
				break;
			case "hour":
				divNum = 1000 * 3600;
				break;
			case "day":
				divNum = 1000 * 3600 * 24;
				break;
			default:
				break;
		}
		return (eTime.getTime() - sTime.getTime()) / divNum;
	}

	/**
	 * 是否在某个时间周期内
	 * startTime:2017-10-15 00:00:00
	 * endTime:2017-10-15 00:00:00
	 * checkTimeStamp:xxxxx 单位毫秒的事件戳
	 */
	static isInTimeSection(startTime: string, endTime: string, checkTimeStamp: number): boolean {
		let startTimeStamp = new Date(Date.parse(startTime.replace(/-/g, "/"))).getTime();
		let endTimeStamp = new Date(Date.parse(endTime.replace(/-/g, "/"))).getTime();
		if (checkTimeStamp >= startTimeStamp && checkTimeStamp <= endTimeStamp) {
			return true;
		}
		return false;
	}

	/**
	 * 检查两个时间戳是否是同一天
	 */
	static isTwoStampSameDay(stamp1: number, stamp2: number): boolean {
		let date1: Date = new Date(stamp1);
		let date2: Date = new Date(stamp2);
		if ((date1.getFullYear() == date2.getFullYear()) && (date1.getMonth() == date2.getMonth()) && (date1.getDay() == date2.getDay())) {
			return true;
		}
		return false;
	}
	/**
	 * 设置敏感词
	 */
	static setSensitiveWord(_arr): void {
		PDKUtils._sensitive = _arr;
	}
	/**
	 * 获取敏感词
	 */
	static getSensitiveWord(): Array<any> {

		return PDKUtils._sensitive;
	}

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
			console.log("PDKSANDAIER--对------>", tmp3Arr, tmp2Arr);
			// return { ct: PDKSANDAIER, kv: tmp3Arr[0] };
		}
		//三带二
		if (tmp3Arr.length == 1 && cards.length == 5) {
			console.log("PDKSANDAIER--散------>", tmp3Arr, tmp1Arr);
			// return { ct: PDKSANDAIER, kv: tmp3Arr[0] };
		}
		//四带二
		if (tmp4Arr.length == 1 && cards.length == 6) {
			console.log("PDKSIDAIER-------->", tmp4Arr, tmp1Arr, tmp2Arr, tmp3Arr);
			// return { ct: PDKSIDAIER, kv: tmp4Arr[0] };
		}

		if (tmp3ArrX.length > 1) {
			var tmp = PDKCardsType.is_shun(tmp3ArrX, false);
			if (tmp.result) {
				if (cards.length == 4 * (tmp3ArrX.length)) { //飞机带单
					console.log("PDKFEIJI--单------>", tmp3Arr, tmp1Arr, tmp2Arr);
				}
			}

			var tmp = PDKCardsType.is_shun(tmp3ArrX);
			if (tmp.result && cards.length == 5 * tmp3ArrX.length) { //飞机带对
				console.log("PDKFEIJI--二------>", tmp3Arr, tmp1Arr, tmp2Arr);
			}

			if (cards.length == 5 * tmp3ArrX.length) {
				var tmp = PDKCardsType.is_shun(tmp3ArrX);
				if (tmp.result) {
					console.log("PDKFEIJI--多1------>", tmp3Arr, tmp1Arr, tmp2Arr);
				}
			} else {
				var length = cards.length / 5;
				if (length > 1 && length % 1 == 0 && length != tmp3ArrX.length) {
					for (j = 0; j < tmp3ArrX.length - length + 1; j++) {
						let cardsTmp: number[] = [];
						for (var k = 0; k < length; k++) {
							cardsTmp.push(tmp3ArrX[k + j]);
						}
						var tmp = PDKCardsType.is_shun(cardsTmp);
						if (tmp.result) {
							console.log("PDKFEIJI--多2------>", tmp3Arr, tmp1Arr, tmp2Arr);
						}
					}
				}
			}
		}
		//飞机或三顺
		if (tmp3Arr.length > 1) {
			var tmp = PDKCardsType.is_shun(tmp3Arr);
			if (tmp.result) {
				//飞机
				if (cards.length == 5 * tmp3Arr.length) {//3连飞机 333444555AABBCC						
					console.log("PDKFEIJI--多3------>", tmp3Arr, tmp1Arr, tmp2Arr);
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