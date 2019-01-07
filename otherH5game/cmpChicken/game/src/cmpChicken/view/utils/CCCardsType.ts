let CC_THREE = 6;
let CC_STRFLUSH = 5;
let CC_FLUSH = 4;
let CC_STRAIGHT = 3;
let CC_DOUBLE = 2;
let CC_SINGLE = 1;

class CCCardsType {
	static checkThree(cards: any[]) {
		let tmpArr2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//卡牌出现的次数
		let i: number;
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

		if (tmp3ArrX.length > 0) {
			return true;
		}
		if (tmp2Arr.length > 0 && (tmpArr2[14] > 0 || tmpArr2[15] > 0)) {
			return true;
		}
		if (tmp1Arr.length > 2 && tmpArr2[14] > 0 && tmpArr2[15] > 0) {
			return true;
		}
		return false;
	}

	static checkStrFlush(cards: any[]) {
		let _sortedCards = CCCardsType.sortCardsByColor(cards);
		let i: number;
		for (i = 0; i < _sortedCards.length - 2; ++i) {
			let id1 = _sortedCards[i];
			let id2 = _sortedCards[i + 1];
			let id3 = _sortedCards[i + 2];
			if ((id1 % 10 == id2 % 10 && id1 % 10 == id3 % 10) && (Math.floor(id1 / 10) - 1 == Math.floor(id2 / 10) && Math.floor(id2 / 10) - 1 == Math.floor(id3 / 10)) && (id1 != 140 && id1 != 150)) {
				// console.log("checkStrFlush------->11111");
				return true;
			}
		}

		let tmpArr2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//卡牌出现的次数		
		for (i = 0; i < cards.length; ++i) {
			let num = Math.floor(cards[i] / 10);
			tmpArr2[num]++;
		}

		for (i = 0; i < _sortedCards.length - 1; ++i) {
			let id1 = _sortedCards[i];
			let id2 = _sortedCards[i + 1];
			if (
				(id1 % 10 == id2 % 10)
				&& ((Math.floor(id1 / 10) - 1 == Math.floor(id2 / 10)) || (Math.floor(id1 / 10) - 2 == Math.floor(id2 / 10)))
				&& ((id1 % 2 == 1 && tmpArr2[14] > 0) || (id1 % 2 == 0 && tmpArr2[15] > 0))
				&& (id1 != 140 && id1 != 150)
			) {
				// console.log("checkStrFlush------->222222");
				return true;
			}
		}

		return false;
	}

	static checkFlush(cards: any[]) {
		let tmpArr2 = [0, 0, 0, 0];//花色出现的次数
		let i: number;
		for (i = 0; i < cards.length; ++i) {
			let num = cards[i] % 10;
			if (cards[i] != 140 && cards[i] != 150) {
				tmpArr2[num]++;
			}
			else {
				if (cards[i] == 140) {
					tmpArr2[1]++;
					tmpArr2[3]++;
				}
				else if (cards[i] == 150) {
					tmpArr2[0]++;
					tmpArr2[2]++;
				}
			}
		}
		for (i = 0; i < tmpArr2.length; ++i) {
			if (tmpArr2[i] > 2) {
				return true;
			}
		}
		return false;
	}

	static checkStraight(cards: any[]) {
		let tmpArr2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//卡牌出现的次数
		let i: number;
		let j: number;
		for (i = 0; i < cards.length; ++i) {
			let num = Math.floor(cards[i] / 10);
			tmpArr2[num]++;
		}

		for (i = tmpArr2.length - 1; i >= 2; --i) {
			let id1 = i;
			let id2 = i - 1;
			let id3 = i - 2;
			if ((tmpArr2[id1] > 0 && tmpArr2[id2] > 0 && tmpArr2[id3] > 0) && (id1 != 14 && id1 != 15)) {
				return true;
			}
			if ((id1 == 13 && tmpArr2[id1] > 0) && (tmpArr2[1] > 0) && (tmpArr2[2] > 0)) {
				return true;
			}
		}

		for (i = tmpArr2.length - 1; i >= 2; --i) {
			let id1 = i;
			let id2 = i - 1;
			let id3 = i - 2;
			if ((id1 != 14 && id1 != 15) && (tmpArr2[14] > 0 || tmpArr2[15] > 0)) {
				if (tmpArr2[id1] > 0 && tmpArr2[id2] > 0) {
					return true;
				}
				else if (tmpArr2[id1] > 0 && tmpArr2[id3] > 0) {
					return true;
				}
			}
		}
		return false;
	}

	static checkDouble(cards: any[]) {
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
			else if (tmpArr2[i] == 3) { //三
				tmp3Arr.push(i);
				tmp3ArrX.push(i);
			}
			else if (tmpArr2[i] == 4) {//炸弹
				tmp4Arr.push(i);
				tmp3ArrX.push(i);
			}
		}
		if ((tmp2Arr.length > 0 && tmp1Arr.length > 0) || (tmp2Arr.length > 1)) {
			return true;
		}
		return false;
	}

	static checkSingle(cards: any[]) {
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
			if (tmpArr2[i] == 1 && tmpArr2[i] != 14 && tmpArr2[i] != 15) { //单 不包括大小王
				tmp1Arr.push(i);
			} else if (tmpArr2[i] == 2) { //对
				tmp2Arr.push(i);
			}
			else if (tmpArr2[i] == 3) { //三
				tmp3Arr.push(i);
				tmp3ArrX.push(i);
			}
			else if (tmpArr2[i] == 4) {//炸弹
				tmp4Arr.push(i);
				tmp3ArrX.push(i);
			}
		}

		if (tmp1Arr.length >= 3) {
			return true;
		}
		return false;
	}

	static getThree(cards: any[]) {
		let _sortedCards = CCCardsType.sortCardsByValue(cards);
		let tmpArr2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//卡牌出现的次数
		let i: number;
		for (i = 0; i < _sortedCards.length; ++i) {
			let num = Math.floor(_sortedCards[i] / 10);
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
			else if (tmpArr2[i] == 3) { //三
				tmp3Arr.push(i);
				tmp3ArrX.push(i);
			}
			else if (tmpArr2[i] == 4) {//炸弹
				tmp4Arr.push(i);
				tmp3ArrX.push(i);
			}
		}

		let res1 = [];
		let res2 = [];
		let res3 = [];
		if (tmp3ArrX.length > 0) {
			let len = tmp3ArrX.length;
			let value = tmp3ArrX[len - 1];
			let tmp = [value, value, value];
			let totalCards = _sortedCards;
			// console.log("getThree--11--totalCards-->", totalCards);
			res1 = this.GetCardsByNum(tmp, totalCards);
			// return { type: CC_THREE, cards: this.GetCardsByNum(tmp, totalCards) };
		}

		if (tmp2Arr.length > 0 && (tmpArr2[14] > 0 || tmpArr2[15] > 0)) {
			let len = tmp2Arr.length;
			let value = tmp2Arr[len - 1];
			let tmp = [value, value];
			if (tmpArr2[14] > 0 && tmp.length < 3) {
				tmp.push(14);
			}
			else if (tmpArr2[15] > 0 && tmp.length < 3) {
				tmp.push(15);
			}
			let totalCards = _sortedCards;
			// console.log("getThree--22-33-totalCards-->", totalCards, tmp, tmpArr2[14], tmpArr2[15]);
			res2 = this.GetCardsByNum(tmp, totalCards)
			// return { type: CC_THREE, cards: this.GetCardsByNum(tmp, totalCards) };
		}

		if (tmp1Arr.length > 2 && tmpArr2[14] > 0 && tmpArr2[15] > 0) {
			let len = tmp1Arr.length;
			let value = tmp1Arr[len - 3];
			let tmp = [value, 14, 15];
			let totalCards = _sortedCards;
			// console.log("getThree--33--totalCards-->", totalCards);
			res3 = this.GetCardsByNum(tmp, totalCards);
			// return { type: CC_THREE, cards: this.GetCardsByNum(tmp, totalCards) };
		}
		if (res1.length > 0 || res2.length > 0 || res3.length > 0) {
			return { type: CC_THREE, cards: this.getMaxRes1(res1, res2, res3) };
		}
		return null;
	}

	static getStrFlush(cards: any[]) {
		let _sortedCards = CCCardsType.sortCardsByColor(cards);
		let i: number;

		let resAll = [];
		for (i = 0; i < _sortedCards.length - 2; ++i) {
			let id1 = _sortedCards[i];
			let id2 = _sortedCards[i + 1];
			let id3 = _sortedCards[i + 2];
			if ((id1 % 10 == id2 % 10 && id1 % 10 == id3 % 10) && (Math.floor(id1 / 10) - 1 == Math.floor(id2 / 10) && Math.floor(id2 / 10) - 1 == Math.floor(id3 / 10)) && (id1 != 140 && id1 != 150)) {
				let tmp = [id1, id2, id3];
				resAll.push(tmp);
				// return { type: CC_STRFLUSH, cards: tmp };
			}
		}

		let tmpArr2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//卡牌出现的次数		
		for (i = 0; i < cards.length; ++i) {
			let num = Math.floor(cards[i] / 10);
			tmpArr2[num]++;
		}

		for (i = 0; i < _sortedCards.length - 1; ++i) {
			let id1 = _sortedCards[i];
			let id2 = _sortedCards[i + 1];
			if (
				(id1 % 10 == id2 % 10)
				&& ((id1 % 2 == 1 && tmpArr2[14] > 0))
				&& (id1 != 140 && id1 != 150)
			) {
				if ((Math.floor(id1 / 10) - 1 == Math.floor(id2 / 10))) {
					let tmp = [id1, id2, 140];
					resAll.push(tmp);
					// return { type: CC_STRFLUSH, cards: tmp };
				}
				else if ((Math.floor(id1 / 10) - 2 == Math.floor(id2 / 10))) {
					let tmp = [id1, 140, id2];
					resAll.push(tmp);
					// return { type: CC_STRFLUSH, cards: tmp };
				}
			}
			else if ((id1 % 10 == id2 % 10)
				&& ((id1 % 2 == 0 && tmpArr2[15] > 0))
				&& (id1 != 140 && id1 != 150)) {
				if ((Math.floor(id1 / 10) - 2 == Math.floor(id2 / 10))) {
					let tmp = [id1, id2, 150];
					resAll.push(tmp);
					// return { type: CC_STRFLUSH, cards: tmp };
				}
				else if ((Math.floor(id1 / 10) - 1 == Math.floor(id2 / 10))) {
					let tmp = [id1, 150, id2];
					resAll.push(tmp);
					// return { type: CC_STRFLUSH, cards: tmp };
				}
			}
		}
		if (resAll.length > 0) {
			// console.log("getStrFlush------>", resAll, this.getMaxRes2(resAll));
			return { type: CC_STRFLUSH, cards: this.getMaxRes2(resAll) };
		}
		return null;
	}

	static getFlush(cards: any[]) {
		let _sortedCards = CCCardsType.sortCardsByColor(cards);
		let tmpArr2 = [0, 0, 0, 0];//花色出现的次数
		let i: number;
		let j: number;
		let k: number;
		let blackJoker: number = 0;
		let redJoker: number = 0;
		for (i = 0; i < _sortedCards.length; ++i) {
			let num = cards[i] % 10;
			if (cards[i] != 140 && cards[i] != 150) {
				tmpArr2[num]++;
			}
			else {
				if (cards[i] == 140) {
					blackJoker = 1;
				}
				else if (cards[i] == 150) {
					redJoker = 1;
				}
			}
		}
		let resAll = [];
		for (i = tmpArr2.length - 1; i >= 0; --i) {
			let res1 = [];
			let res2 = [];
			let res3 = [];
			if (tmpArr2[i] > 2) {
				let out: any[] = [];
				let tmp: any[] = _sortedCards.concat();
				let nums = [i, i, i];
				for (j = 0; j < nums.length; ++j) {
					for (k = 0; k < tmp.length; ++k) {
						let num = tmp[k] % 10;
						if (num == nums[j] && tmp[k] != 140 && tmp[k] != 150) {
							out.push(tmp[k]);
							tmp.splice(k, 1);
							break;
						}
					}
				}
				// console.log("getFlush----totalCards-->", i, tmpArr2[i], _sortedCards, out, tmp, nums);
				res1 = out;
				// return { type: CC_FLUSH, cards: out };
			}
			else if (tmpArr2[i] > 1) {
				if (i % 2 == 1 && blackJoker > 0) {
					let out: any[] = [];
					let tmp: any[] = _sortedCards.concat();
					let nums = [i, i];
					for (j = 0; j < nums.length; ++j) {
						for (k = 0; k < tmp.length; ++k) {
							let num = tmp[k] % 10;
							if (num == nums[j] && tmp[k] != 140 && tmp[k] != 150) {
								out.push(tmp[k]);
								tmp.splice(k, 1);
								break;
							}
						}
					}
					out.push(140);
					res2 = out;
					// return { type: CC_FLUSH, cards: out };
				}
				else if (i % 2 == 0 && redJoker > 0) {
					let out: any[] = [];
					let tmp: any[] = _sortedCards.concat();
					let nums = [i, i];
					for (j = 0; j < nums.length; ++j) {
						for (k = 0; k < tmp.length; ++k) {
							let num = tmp[k] % 10;
							if (num == nums[j] && tmp[k] != 140 && tmp[k] != 150) {
								out.push(tmp[k]);
								tmp.splice(k, 1);
								break;
							}
						}
					}
					out.push(150);
					res3 = out;
					// return { type: CC_FLUSH, cards: out };
				}
			}
			if (res1.length > 0 || res2.length > 0 || res3.length > 0) {
				resAll.push(this.getMaxRes1(res1, res2, res3));
			}
		}
		if (resAll.length > 0) {
			// console.log("getFlush------>", resAll, this.getMaxRes2(resAll));
			return { type: CC_FLUSH, cards: this.getMaxRes2(resAll) };
		}
		return null;
	}

	static getStraight(cards: any[]) {
		let tmpArr2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//卡牌出现的次数
		let i: number;
		let j: number;
		for (i = 0; i < cards.length; ++i) {
			let num = Math.floor(cards[i] / 10);
			tmpArr2[num]++;
		}
		let resAll = [];

		for (i = tmpArr2.length - 1; i >= 2; --i) {
			let id1 = i;
			let id2 = i - 1;
			let id3 = i - 2;
			if ((tmpArr2[id1] > 0 && tmpArr2[id2] > 0 && tmpArr2[id3] > 0) && (id1 != 14 && id1 != 15)) {
				let tmp = [id1, id2, id3];
				let totalCards = cards;
				let res = this.GetCardsByNum(tmp, totalCards);
				resAll.push(res);
			}
			if ((id1 == 13 && tmpArr2[id1] > 0) && (tmpArr2[1] > 0) && (tmpArr2[2] > 0)) {
				let tmp = [1, 2, 13];
				let totalCards = cards;
				let res = this.GetCardsByNum(tmp, totalCards);
				resAll.push(res);
			}
		}

		for (i = tmpArr2.length - 1; i >= 2; --i) {
			let id1 = i;
			let id2 = i - 1;
			let id3 = i - 2;
			if ((id1 != 14 && id1 != 15) && (tmpArr2[14] > 0 || tmpArr2[15] > 0)) {
				if (tmpArr2[id1] > 0 && tmpArr2[id2] > 0) {
					let tmp = [id1, id2];
					let totalCards = cards;
					if (tmpArr2[14] > 0) {
						tmp.push(14);
						let res = this.GetCardsByNum(tmp, totalCards);
						resAll.push(res);
					}
					else if (tmpArr2[15] > 0) {
						tmp.push(15);
						let res = this.GetCardsByNum(tmp, totalCards);
						resAll.push(res);
					}
				}
				else if (tmpArr2[id1] > 0 && tmpArr2[id3] > 0) {
					let tmp = [id1, id3];
					let totalCards = cards;
					if (tmpArr2[14] > 0) {
						tmp.push(14);
						let res = this.GetCardsByNum(tmp, totalCards);
						resAll.push(res);
					}
					else if (tmpArr2[15] > 0) {
						tmp.push(15);
						let res = this.GetCardsByNum(tmp, totalCards);
						resAll.push(res);
					}
				}
			}
		}
		if (resAll.length > 0) {
			return { type: CC_STRAIGHT, cards: this.getMaxRes2(resAll) };
		}
		return null;
	}

	static getDouble(cards: any[]) {
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
			else if (tmpArr2[i] == 3) { //三
				tmp3Arr.push(i);
				tmp3ArrX.push(i);
			}
			else if (tmpArr2[i] == 4) {//炸弹
				tmp4Arr.push(i);
				tmp3ArrX.push(i);
			}
		}

		if (tmp2Arr.length > 0 && tmp1Arr.length > 0) {
			let len2 = tmp2Arr.length;
			let value2 = tmp2Arr[len2 - 1];
			let len1 = tmp1Arr.length;
			let value1 = 0;
			for (i = 0; i < len1; i++) {
				if (tmp1Arr[i] != 140 && tmp1Arr[i] != 150) {
					value1 = tmp1Arr[i];
					break;
				}
			}
			if (!value1) {
				value1 = tmp1Arr[len1 - 1];
			}
			let tmp = [value2, value2, value1];
			let totalCards = cards;
			let res = this.GetCardsByNum(tmp, totalCards)
			// console.log("getDouble------>", res);
			return { type: CC_DOUBLE, cards: res };
		}

		if (tmp2Arr.length > 1) {
			let len2 = tmp2Arr.length;
			let value2 = tmp2Arr[len2 - 1];
			let value1 = tmp2Arr[0];
			let tmp = [value2, value2, value1];
			let totalCards = cards;
			let res = this.GetCardsByNum(tmp, totalCards)
			return { type: CC_DOUBLE, cards: res };
		}
		return null;
	}

	static getSingle(cards: any[]) {
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
			if (tmpArr2[i] == 1 && tmpArr2[i] != 14 && tmpArr2[i] != 15) { //单 不包括大小王
				tmp1Arr.push(i);
			} else if (tmpArr2[i] == 2) { //对
				tmp2Arr.push(i);
			}
			else if (tmpArr2[i] == 3) { //三
				tmp3Arr.push(i);
				tmp3ArrX.push(i);
			}
			else if (tmpArr2[i] == 4) {//炸弹
				tmp4Arr.push(i);
				tmp3ArrX.push(i);
			}
		}

		if (tmp1Arr.length >= 3) {
			let tmp = [];
			for (i = tmp1Arr.length - 1; i >= 2; --i) {
				tmp = [tmp1Arr[i], tmp1Arr[i - 1], tmp1Arr[i - 2]];
				let totalCards = cards;
				let res = this.GetCardsByNum(tmp, totalCards)
				// console.log("getSingle------>", res);
				return { type: CC_SINGLE, cards: res };

			}
		}
		return null;
	}

	static GetCardsByNum(nums: any[], totalCards: any[]): any[] {
		let out: any[] = [];
		let tmp: any[] = totalCards.concat();
		for (let i: number = 0; i < nums.length; ++i) {
			for (let j: number = 0; j < tmp.length; ++j) {
				let num: number = Math.floor(tmp[j] / 10);
				if (num == nums[i]) {
					out.push(tmp[j]);
					tmp.splice(j, 1);
					break;
				}
			}
		}
		return out;
	}

	static getMaxRes1(res1: number[] = null, res2: number[] = null, res3: number[] = null) {
		let value1 = 0;
		let value2 = 0;
		let value3 = 0;
		if (res1.length > 0) {
			value1 = res1[0];
		}

		if (res2.length > 0) {
			value2 = res2[0];
		}

		if (res3.length > 0) {
			value3 = res3[0];
		}

		let max = 0;
		if (value1 > max) {
			max = value1;
		}

		if (value2 > max) {
			max = value2;
		}

		if (value3 > max) {
			max = value3;
		}

		switch (max) {
			case value1:
				return res1;
			case value2:
				return res2;
			case value3:
				return res3;
		}
	}

	static getMaxRes2(resAll: number[][]) {
		let max = 0;
		let maxIndex = 0;
		for (let i = 0; i < resAll.length; i++) {
			if (resAll[i][0] > max) {
				max = resAll[i][0];
				maxIndex = i;
			}
		}
		return resAll[maxIndex];
	}

	static sortCardsByColor(cards) {
		let sortedCards = cards.sort((a, b) => {
			if (a % 10 != b % 10) {
				return b % 10 - a % 10;
			}
			else if (Math.floor(a / 10) != Math.floor(b / 10)) {
				return Math.floor(b / 10) - Math.floor(a / 10);
			}
			return b - a;
		})
		return sortedCards;
	}

	static sortCardsByValue(cards) {
		let sortedCards = cards.sort((a, b) => {
			return b - a;
		});
		return sortedCards;
	}

	static checkType(cards: number[]) {
		let tmpArr2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//卡牌出现的次数
		let i: number;
		let j: number;
		let flag: Boolean;
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
			else if (tmpArr2[i] == 3) { //三张
				tmp3Arr.push(i);
				tmp3ArrX.push(i);
			}
			else if (tmpArr2[i] == 4) {//炸弹
				tmp4Arr.push(i);
				tmp3ArrX.push(i);
			}
		}

		if (tmp3ArrX.length > 0) {
			let _cards = this.sortCardsByColor(cards);
			let _kv = this.GetCardsByNum([tmp3ArrX[0], tmp3ArrX[0], tmp3ArrX[0]], _cards)
			// console.log("checkType---CC_THREE--11-->", _cards, tmp3ArrX[0], _kv);
			return { ct: CC_THREE, kv: _kv[0], kv2: _kv[1], kv3: _kv[2] };
		}
		else if (tmp2Arr.length > 0 && (tmpArr2[14] > 0 || tmpArr2[15] > 0)) {
			let _cards = this.sortCardsByColor(cards);
			let _kv = this.GetCardsByNum([tmp2Arr[0], tmp2Arr[0]], _cards)
			// console.log("checkType---CC_THREE--22-->", _cards, tmp2Arr[0], _kv);
			let _kv1 = 0;
			if (tmpArr2[14] > 0) {
				// _kv1 = 140;
				_kv1 = tmp2Arr[0] * 10 + 3;
				_kv.push(_kv1)
			}
			if (tmpArr2[15] > 0 && _kv.length < 3) {
				// _kv1 = 150;
				_kv1 = tmp2Arr[0] * 10 + 2;
				_kv.push(_kv1)
			}
			_kv.sort((a, b) => {
				return b - a;
			})
			return { ct: CC_THREE, kv: _kv[0], kv2: _kv[1], kv3: _kv[2] };
		}
		else if (tmp1Arr.length > 2 && tmpArr2[14] > 0 && tmpArr2[15] > 0) {
			let _cards = this.sortCardsByColor(cards);
			let _kv = this.GetCardsByNum([tmp1Arr[0]], _cards)
			// console.log("checkType---CC_THREE--33-->", _cards, tmp1Arr[0], _kv);
			let _kv2 = tmp1Arr[0] * 10 + 3;
			let _kv3 = tmp1Arr[0] * 10 + 2;
			_kv.push(_kv2);
			_kv.push(_kv3);
			_kv.sort((a, b) => {
				return b - a;
			})
			return { ct: CC_THREE, kv: _kv[0], kv2: _kv[1], kv3: _kv[2] };
		}

		let _sortedCards = CCCardsType.sortCardsByColor(cards);
		for (i = 0; i < _sortedCards.length - 2; ++i) {
			let id1 = _sortedCards[i];
			let id2 = _sortedCards[i + 1];
			let id3 = _sortedCards[i + 2];
			if ((id1 % 10 == id2 % 10 && id1 % 10 == id3 % 10) && (Math.floor(id1 / 10) - 1 == Math.floor(id2 / 10) && Math.floor(id2 / 10) - 1 == Math.floor(id3 / 10)) && (id1 != 140 && id1 != 150)) {
				return { ct: CC_STRFLUSH, kv: id1, kv2: id2, kv3: id3 };
			}

			if ((id1 % 10 == id2 % 10 && id1 % 10 == id3 % 10) && (Math.floor(id1 / 10) == 13) && (Math.floor(id2 / 10) == 2) && (Math.floor(id3 / 10) == 1)) {
				return { ct: CC_STRFLUSH, kv: id2, kv2: id3, kv3: id1 };
			}
		}

		for (i = 0; i < _sortedCards.length - 1; ++i) {
			let id1 = _sortedCards[i];
			let id2 = _sortedCards[i + 1];
			if (
				(id1 % 10 == id2 % 10)
				&& ((id1 % 2 == 1 && tmpArr2[14] > 0))
				&& (id1 != 140 && id1 != 150)
			) {
				if ((Math.floor(id1 / 10) - 1 == Math.floor(id2 / 10))) {
					if (Math.floor(id1 / 10) != 13) {
						return { ct: CC_STRFLUSH, kv: id1 + 10, kv2: id1, kv3: id2 };
					}
					return { ct: CC_STRFLUSH, kv: id1, kv2: id2, kv3: id2 - 10 };
				}
				else if ((Math.floor(id1 / 10) - 2 == Math.floor(id2 / 10))) {
					return { ct: CC_STRFLUSH, kv: id1, kv2: id1 - 10, kv3: id2 };
				}
			}
			else if ((id1 % 10 == id2 % 10)
				&& ((id1 % 2 == 0 && tmpArr2[15] > 0))
				&& (id1 != 140 && id1 != 150)) {
				if ((Math.floor(id1 / 10) - 1 == Math.floor(id2 / 10))) {
					if (Math.floor(id1 / 10) != 13) {
						return { ct: CC_STRFLUSH, kv: id1 + 10, kv2: id1, kv3: id2 };
					}
					return { ct: CC_STRFLUSH, kv: id1, kv2: id2, kv3: id2 - 10 };
				}
				else if ((Math.floor(id1 / 10) - 2 == Math.floor(id2 / 10))) {
					return { ct: CC_STRFLUSH, kv: id1, kv2: id1 - 10, kv3: id2 };
				}
			}
		}

		let tmpArr3 = [0, 0, 0, 0];//花色出现的次数
		let k: number;
		let blackJoker: number = 0;
		let redJoker: number = 0;
		for (i = 0; i < _sortedCards.length; ++i) {
			let num = cards[i] % 10;
			if (cards[i] != 140 && cards[i] != 150) {
				tmpArr3[num]++;
			}
			else {
				if (cards[i] == 140) {
					blackJoker = 1;
				}
				else if (cards[i] == 150) {
					redJoker = 1;
				}
			}
		}
		for (i = tmpArr3.length - 1; i >= 0; --i) {
			let res1 = [];
			let res2 = [];
			let res3 = [];
			if (tmpArr3[i] > 2) {
				let out: any[] = [];
				let tmp: any[] = _sortedCards.concat();
				let nums = [i, i, i];
				for (j = 0; j < nums.length; ++j) {
					for (k = 0; k < tmp.length; ++k) {
						let num = tmp[k] % 10;
						if (num == nums[j] && tmp[k] != 140 && tmp[k] != 150) {
							out.push(tmp[k]);
							tmp.splice(k, 1);
							break;
						}
					}
				}
				return { ct: CC_FLUSH, kv: out[0], kv2: out[1], kv3: out[2] };
			}
			else if (tmpArr3[i] > 1) {
				if (i % 2 == 1 && blackJoker > 0) {
					let out: any[] = [];
					let tmp: any[] = _sortedCards.concat();
					let nums = [i, i];
					for (j = 0; j < nums.length; ++j) {
						for (k = 0; k < tmp.length; ++k) {
							let num = tmp[k] % 10;
							if (num == nums[j] && tmp[k] != 140 && tmp[k] != 150) {
								out.push(tmp[k]);
								tmp.splice(k, 1);
								break;
							}
						}
					}
					let _kv1 = 0;
					if (out[0] % 10 == 3) {
						_kv1 = 133;
					}
					else {
						_kv1 = 131;
					}
					return { ct: CC_FLUSH, kv: _kv1, kv2: out[0], kv3: out[1] };
				}
				else if (i % 2 == 0 && redJoker > 0) {
					let out: any[] = [];
					let tmp: any[] = _sortedCards.concat();
					let nums = [i, i];
					for (j = 0; j < nums.length; ++j) {
						for (k = 0; k < tmp.length; ++k) {
							let num = tmp[k] % 10;
							if (num == nums[j] && tmp[k] != 140 && tmp[k] != 150) {
								out.push(tmp[k]);
								tmp.splice(k, 1);
								break;
							}
						}
					}
					let _kv1 = 0;
					if (out[0] % 10 == 2) {
						_kv1 = 132;
					}
					else {
						_kv1 = 130;
					}
					return { ct: CC_FLUSH, kv: _kv1, kv2: out[0], kv3: out[1] };
				}
			}
		}

		_sortedCards = this.sortCardsByValue(cards);
		for (i = 0; i < _sortedCards.length - 2; ++i) {
			let id1 = _sortedCards[i];
			let id2 = _sortedCards[i + 1];
			let id3 = _sortedCards[i + 2];
			if ((Math.floor(id1 / 10) - 1 == Math.floor(id2 / 10) && Math.floor(id2 / 10) - 1 == Math.floor(id3 / 10)) && (id1 != 140 && id1 != 150)) {
				return { ct: CC_STRAIGHT, kv: id1, kv2: id2, kv3: id3 };
			}

			if ((Math.floor(id1 / 10) == 13) && (Math.floor(id2 / 10) == 2) && (Math.floor(id3 / 10) == 1)) {
				return { ct: CC_STRAIGHT, kv: id2, kv2: id3, kv3: id1 };
			}
		}

		for (i = 0; i < _sortedCards.length - 1; ++i) {
			let id1 = _sortedCards[i];
			let id2 = _sortedCards[i + 1];
			if (id1 != 140 && id1 != 150 && (tmpArr2[14] > 0 || tmpArr2[15] > 0)) {
				if ((Math.floor(id1 / 10) - 1 == Math.floor(id2 / 10))) {
					if (Math.floor(id1 / 10) != 13) {
						if (tmpArr2[14] > 0) {
							let _kv1 = Math.floor(id1 / 10) * 10 + 3 + 10;
							return { ct: CC_STRFLUSH, kv: _kv1, kv2: id1, kv3: id2 };
						}
						if (tmpArr2[15] > 0) {
							let _kv1 = Math.floor(id1 / 10) * 10 + 2 + 10;
							return { ct: CC_STRFLUSH, kv: _kv1, kv2: id1, kv3: id2 };
						}
					}
					else {
						// return { ct: CC_STRFLUSH, kv: id1, kv2: id2, kv3: id2 - 10 };
						if (tmpArr2[14] > 0) {
							let _kv3 = Math.floor(id2 / 10) * 10 + 3 - 10;
							return { ct: CC_STRAIGHT, kv: id1, kv2: id2, kv3: _kv3 };
						}
						if (tmpArr2[15] > 0) {
							let _kv3 = Math.floor(id2 / 10) * 10 + 2 - 10;
							return { ct: CC_STRAIGHT, kv: id1, kv2: id2, kv3: _kv3 };
						}
					}
				}
				else if ((Math.floor(id1 / 10) - 2 == Math.floor(id2 / 10))) {

					if (tmpArr2[14] > 0) {
						let _kv2 = Math.floor(id1 / 10) * 10 + 3 - 10;
						return { ct: CC_STRAIGHT, kv: id1, kv2: _kv2, kv3: id2 };
					}
					if (tmpArr2[15] > 0) {
						let _kv2 = Math.floor(id1 / 10) * 10 + 2 - 10;
						return { ct: CC_STRAIGHT, kv: id1, kv2: _kv2, kv3: id2 };
					}
				}
			}
		}

		if (tmp2Arr.length > 0 && tmp1Arr.length > 0) {
			let _cards = this.sortCardsByColor(cards);
			let _kv = this.GetCardsByNum([tmp2Arr[0], tmp2Arr[0], tmp1Arr[0]], _cards)
			return { ct: CC_DOUBLE, kv: _kv[0], kv2: _kv[1], kv3: _kv[2] };
		}

		if (tmp1Arr.length == 3) {
			let _cards = this.sortCardsByValue(cards);
			let _kv = this.GetCardsByNum([tmp1Arr[2], tmp1Arr[1], tmp1Arr[0]], _cards)
			return { ct: CC_SINGLE, kv: _kv[0], kv2: _kv[1], kv3: _kv[2] };
		}

		return { ct: 0, kv: 0, kv2: 0, kv3: 0 };
	}
}