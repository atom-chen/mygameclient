/**
 * Created by rockyl on 15/12/15.
 */

let BUYAO:number = 0;
let SHUANGWANG:number = 1;
let ZHADAN:number = 2;
let DAN:number = 4;
let DUIZI:number = 5;
let SANZHANG:number = 6;
let SANDAIYI:number = 7;
let SANDAIYIDUI:number = 13;
let SIDAIER:number = 8;
let SIDAIERDUI:number = 14;
let FEIJI:number = 9;
let DANSHUN:number = 10;
let SHUANGSHUN:number = 11;
let SANSHUN:number = 12;

class CardsType {
	static CheckType(cards:any[], targetCards:any[]):boolean {
		
		let result1 = this.GetType(cards);
		if (result1.ct == SHUANGWANG) return true;
		if (targetCards == null || targetCards.length < 1) {
			return result1.ct != 0;
		}
		let result2 = this.GetType(targetCards);
		if (result1.ct == result2.ct) {
			if (cards.length == targetCards.length) {
				return result1.kv > result2.kv;
			}
		}else if(result2.ct != SHUANGWANG){
			if(result2.ct != ZHADAN && result1.ct == ZHADAN){
				return true;
			}
		}
		
		return false;
	}

	static GetCards2(targetCards:any[], totalCards:any[]):any[] {
		let out1:any[] = [];
		let out2:any[] = [];
		let out3:any[] = [];
		let out4:any[] = [];
		// let type:number = this.GetType2(targetCards, out1, out2, out3, out4);
		var result = this.GetType(targetCards, out1, out2, out3, out4);
		let type = result.ct

		let targetType:number = type;

		if (type == 0) return null;

		let firstValue:any[] = [type, out1, out2, out3];

		let obj:Object = this.m_getCards(targetCards, type, out1, out2, out3, out4, totalCards, targetType);
		let arr1:any[] = [];//不拆牌
		let arr2:any[] = [];//拆牌
		let nums:any[] = [];
		let lastCards:any[];
		while (obj != null && obj.hasOwnProperty("chai") && obj.hasOwnProperty("cards") && obj.hasOwnProperty("nums")) {
			lastCards = obj["cards"];
			if (obj["chai"] == false) {
				arr1.push(lastCards);
			}
			else {
				arr2.push(lastCards);
			}

			nums.push(obj["nums"]);

			out1 = [];
			out2 = [];
			out3 = [];
			out4 = [];
			var result = this.GetType(lastCards, out1, out2, out3, out4);
			type = result.ct //this.GetType2(lastCards, out1, out2, out3, out4);
			obj = this.m_getCards(lastCards, type, out1, out2, out3, out4, totalCards, targetType);
//				{chai:false,cards:GetCardsByNum([i],totalCards)};
		}
		let arr:any[] = arr1.concat(arr2);
		if (arr.length > 0) {
			firstValue.push(arr);
			firstValue.push(nums);
			return firstValue;
		}

		return null;
	}

	static m_getCards(targetCards:any[], type:number, out1Arr:any[], out2Arr:any[], out3Arr:any[], out4Arr:any[], totalCards:any[], targetType:number):Object {
		if (totalCards == null || totalCards.length < 1) return null;

		if (type == SHUANGWANG || type == 0) return null;

		let tmpArr2:any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//卡牌出现的次数
		let i:number;
		let j:number;
		for (i = 0; i < totalCards.length; ++i) {
			let num:number = Math.floor(totalCards[i] / 10);
			tmpArr2[num]++;
		}

		let tmp1Arr:any[] = [];
		let tmp2Arr:any[] = [];
		let tmp3Arr:any[] = [];
		let tmp4Arr:any[] = [];
		for (i = 0; i < tmpArr2.length; ++i) {
			if (tmpArr2[i] == 1) {
				tmp1Arr.push(i);
			}
			else if (tmpArr2[i] == 2) {
				tmp2Arr.push(i);
			}
			else if (tmpArr2[i] == 3) {
				tmp3Arr.push(i);
			}
			else if (tmpArr2[i] == 4) {
				tmp4Arr.push(i);
			}
		}
		if (type == DAN) {
			for (i = out1Arr[0] + 1; i < tmpArr2.length; ++i) {
				if (tmpArr2[i] == 1) {
					if ((i == 14 || i == 15) && tmpArr2[14] > 0 && tmpArr2[15] > 0) {
						return {chai: true, cards: this.GetCardsByNum([i], totalCards), nums: [i]};
					}
					else {
						return {chai: false, cards: this.GetCardsByNum([i], totalCards), nums: [i]};
					}
				}
				else if (tmpArr2[i] > 1) {
					return {chai: true, cards: this.GetCardsByNum([i], totalCards), nums: [i]};
				}
			}
		}
		if (type == DUIZI) {
			for (i = out2Arr[0] + 1; i < tmpArr2.length; ++i) {
				if (tmpArr2[i] == 2) {
					return {chai: false, cards: this.GetCardsByNum([i, i], totalCards), nums: [i, i]};
				}
				else if (tmpArr2[i] > 2) {
					return {chai: true, cards: this.GetCardsByNum([i, i], totalCards), nums: [i, i]};
				}
			}
		}
		if (type == SANZHANG) {
			for (i = out3Arr[0] + 1; i < tmpArr2.length; ++i) {
				if (tmpArr2[i] == 3) {
					return {chai: false, cards: this.GetCardsByNum([i, i, i], totalCards), nums: [i, i, i]};
				}
				else if (tmpArr2[i] > 3) {
					return {chai: true, cards: this.GetCardsByNum([i, i, i], totalCards), nums: [i, i, i]};
				}
			}
		}
		let tmp:any[];
		if (type == SANDAIYI) {
			for (i = out3Arr[0] + 1; i < tmpArr2.length; ++i) {
				if (tmpArr2[i] > 2) {
					tmp = [i, i, i];
					if (tmp1Arr.length > 0) {
						tmp.push(tmp1Arr[0]);
					}
					else {
						for (j = 1; j < tmpArr2.length; ++j) {
							if (tmpArr2[j] > 0 && j != i) {
								tmp.push(j);
								break;
							}
						}
					}
					if (tmp.length == 4) {
						if (tmpArr2[i] == 3) {
							return {chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp};
						}
						else {
							return {chai: true, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp};
						}
					}
					break;
				}
			}
		}
		if (type == SANDAIYIDUI) {
			for (i = out3Arr[0] + 1; i < tmpArr2.length; ++i) {
				if (tmpArr2[i] > 2) {
					tmp = [i, i, i];
					if (tmp2Arr.length > 0) {
						tmp.push(tmp2Arr[0], tmp2Arr[0]);
					}
					else {
						for (j = 1; j < tmpArr2.length; ++j) {
							if (tmpArr2[j] > 1 && j != i) {
								tmp.push(j, j);
								break;
							}
						}
					}
					if (tmp.length == 5) {
						if (tmpArr2[i] == 3) {
							return {chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp};
						}
						else {
							return {chai: true, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp};
						}
					}
					break;
				}
			}
		}
		if (type == SIDAIER) {
			if (tmp4Arr.length > 0) {
				for (i = 0; i < tmp4Arr.length; ++i) {
					if (tmp4Arr[i] > out4Arr[0]) {
						tmp = [tmp4Arr[i], tmp4Arr[i], tmp4Arr[i], tmp4Arr[i]];
						for (j = 0; j < tmp1Arr.length && tmp.length < 6; ++j) {
							tmp.push(tmp1Arr[j]);
						}
						if (tmp.length < 6) {
							for (j = 1; j < tmpArr2.length && tmp.length < 6; ++j) {
								if (tmpArr2[j] > 0 && tmp.indexOf(j) < 0) {
									tmp.push(j);
								}
							}
						}

						if (tmp.length == 6) {
							return {chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp};
						}
						break;
					}
				}
			}
		}
		if (type == SIDAIERDUI) {
			if (tmp4Arr.length > 0) {
				for (i = 0; i < tmp4Arr.length; ++i) {
					if (tmp4Arr[i] > out4Arr[0]) {
						tmp = [tmp4Arr[i], tmp4Arr[i], tmp4Arr[i], tmp4Arr[i]];
						for (j = 0; j < tmp2Arr.length && tmp.length < 8; ++j) {
							tmp.push(tmp2Arr[j], tmp2Arr[j]);
						}
						if (tmp.length < 8) {
							for (j = 1; j < tmpArr2.length && tmp.length < 8; ++j) {
								if (tmpArr2[j] > 1 && tmp.indexOf(j) < 0) {
									tmp.push(j, j);
								}
							}
						}
						if (tmp.length == 8) {
							return {chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp};
						}
						break;
					}
				}
			}
		}
		let count:number;
		let test:boolean;
		if (type == FEIJI) {
			count = out3Arr.length;
			for (i = out3Arr[0] + 1; i < tmpArr2.length - count + 1; ++i) {
				test = true;
				tmp = [];
				for (j = 0; j < count; ++j) {
					tmp.push(i + j, i + j, i + j);
					if (tmpArr2[i + j] < 3 || i + j == 13 || i + j == 14 || i + j == 15) {
						test = false;
						break;
					}
				}
				if (test) {
					if (out3Arr.length * 4 == targetCards.length ) {
						for (j = 0; j < tmp1Arr.length && tmp.length < targetCards.length; ++j) {
							tmp.push(tmp1Arr[j]);
						}
						if (tmp.length < targetCards.length) {
							for (j = 1; j < tmpArr2.length && tmp.length < targetCards.length; ++j) {
								if (tmpArr2[j] > 0 && tmp.indexOf(j) < 0) {
									for (var jx = 0; jx < tmpArr2[j] && tmp.length < targetCards.length; ++jx) {
										tmp.push(j);
									}
								}
							}
						}

						if (tmp.length == targetCards.length) {
							return {chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp};
						}
					}
					else if (out2Arr.length == out3Arr.length) {
						for (j = 0; j < tmp2Arr.length && tmp.length < targetCards.length; ++j) {
							tmp.push(tmp2Arr[j], tmp2Arr[j]);
						}
						if (tmp.length < targetCards.length) {
							for (j = 0; j < tmpArr2.length && tmp.length < targetCards.length; ++j) {
								if (tmpArr2[j] > 1 && tmp.indexOf(j) < 0) {
									tmp.push(j, j);
								}
							}
						}

						if (tmp.length == targetCards.length) {
							return {chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp};
						}
					}
					break;
				}
			}
		}
		if (type == DANSHUN) {
			count = out1Arr.length;
			for (i = out1Arr[0] + 1; i < tmpArr2.length - count + 1; ++i) {
				test = true;
				tmp = [];
				for (j = 0; j < count; ++j) {
					tmp.push(i + j);
					if (tmpArr2[i + j] < 1 || i + j == 13 || i + j == 14 || i + j == 15) {
						test = false;
						break;
					}
				}
				if (test) {
					return {chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp};
				}
			}
		}
		if (type == SHUANGSHUN) {
			count = out2Arr.length;
			for (i = out2Arr[0] + 1; i < tmpArr2.length - count + 1; ++i) {
				test = true;
				tmp = [];
				for (j = 0; j < count; ++j) {
					tmp.push(i + j, i + j);
					if (tmpArr2[i + j] < 2 || i + j == 13 || i + j == 14 || i + j == 15) {
						test = false;
						break;
					}
				}
				if (test) {
					return {chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp};
				}
			}
		}

		if (type == SANSHUN) {
			count = out3Arr.length;
			for (i = out3Arr[0] + 1; i < tmpArr2.length - count + 1; ++i) {
				test = true;
				tmp = [];
				for (j = 0; j < count; ++j) {
					tmp.push(i + j, i + j, i + j);
					if (tmpArr2[i + j] < 3 || i + j == 13 || i + j == 14 || i + j == 15) {
						test = false;
						break;
					}
				}
				if (test) {
					return {chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp};
				}
			}
		}

		if (type == ZHADAN) {
			if (tmp4Arr.length > 0) {
				for (i = 0; i < tmp4Arr.length; ++i) {
					if (tmp4Arr[i] > out4Arr[0]) {
						tmp = [tmp4Arr[i], tmp4Arr[i], tmp4Arr[i], tmp4Arr[i]];
						if (type == targetType) {
							return {chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp};
						}
						else {
							return {chai: true, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp};
						}
					}
				}
			}
		}
		else if (tmp4Arr.length > 0) {
			tmp = [tmp4Arr[0], tmp4Arr[0], tmp4Arr[0], tmp4Arr[0]];
			return {chai: true, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp};
		}

		if (tmpArr2[14] > 0 && tmpArr2[15] > 0) {
			return {chai: true, cards: this.GetCardsByNum([14, 15], totalCards), nums: [14, 15]};
		}

		return null;
	}

	static GetCardsByNum(nums:any[], totalCards:any[]):any[] {
		let out:any[] = [];
		let tmp:any[] = totalCards.concat();
		for (let i:number = 0; i < nums.length; ++i) {
			for (let j:number = 0; j < tmp.length; ++j) {
				let num:number = Math.floor(tmp[j] / 10);
				if (num == nums[i]) {
					out.push(tmp[j]);
					tmp.splice(j, 1);
					break;
				}
			}
		}
		return out;
	}

	static  CheckShun(totalCards:any[]):any[] {
		let tmpArr2:any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//卡牌出现的次数
		let i:number;
		let j:number;
		for (i = 0; i < totalCards.length; ++i) {
			let num:number = Math.floor(totalCards[i] / 10);
			if (num < tmpArr2.length) {
				tmpArr2[num]++;
			}
		}

		let test:boolean = true;
		let tmp:any[];

		i = 0;
		let out1:any[] = [];
		while (i < tmpArr2.length) {
			tmp = [];
			if (tmpArr2[i] > 2) {
				tmp.push(i, i, i);
				for (j = i + 1; j < tmpArr2.length; ++j) {
					i = j;
					if (tmpArr2[j] > 2) {
						tmp.push(j, j, j);
					}
					else {
						if (tmp.length > out1.length) {
							out1 = tmp;
						}
						break;
					}
				}
			}
			++i;
		}

		if (tmp && tmp.length > out1.length) {
			out1 = tmp;
		}

		if (!out1 || out1.length < 6) {
			out1 = null;
		}

		i = 0;
		let out2:any[] = [];
		while (i < tmpArr2.length) {
			tmp = [];
			if (tmpArr2[i] > 1) {
				tmp.push(i, i);
				for (j = i + 1; j < tmpArr2.length; ++j) {
					i = j;
					if (tmpArr2[j] > 1) {
						tmp.push(j, j);
					}
					else {
						if (tmp.length > out2.length) {
							out2 = tmp;
						}
						break;
					}
				}
			}
			++i;
		}

		if (tmp && tmp.length > out2.length) {
			out2 = tmp;
		}

		if (!out2 || out2.length < 6) {
			out2 = null;
		}

		i = 0;
		let out3:any[] = [];
		while (i < tmpArr2.length) {
			tmp = [];
			if (tmpArr2[i] > 0) {
				tmp.push(i);
				for (j = i + 1; j < tmpArr2.length; ++j) {
					i = j;
					if (tmpArr2[j] > 0) {
						tmp.push(j);
					}
					else {
						if (tmp.length > out3.length) {
							out3 = tmp;
						}
						break;
					}
				}
			}
			++i;
		}

		if (tmp && tmp.length > out3.length) {
			out3 = tmp;
		}

		if (!out3 || out3.length < 5) {
			out3 = null;
		}

		let out:any[] = out1;

		if (out2) {
			if (!out || out2[0] < out[0]) {
				out = out2;
			}
		}

		if (out3) {
			if (!out || out3[0] < out[0]) {
				out = out3;
			}
		}

		if (out && out.length > 0) {
			return this.GetCardsByNum(out, totalCards);
		}

		return null;
	}

	static CheckShun2(totalCards:any[]):any[] {
		let tmpArr2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//卡牌出现的次数
		let i;
		let j;
		let e = Math.floor(totalCards[0] / 10);
		let b = Math.floor(totalCards[totalCards.length - 1] / 10);
		for (i = 0; i < totalCards.length; ++i) {
			let num = Math.floor(totalCards[i] / 10);
			if (num < tmpArr2.length) {
				tmpArr2[num]++;
			}
		}

		let out = [];
		if (tmpArr2[b] > 2 && tmpArr2[e] > 2) {
			out.push(b, b, b);
			for (i = b + 1; i < e; ++i) {
				if (tmpArr2[i] > 2) {
					out.push(i, i, i);
				}
				else {
					out = [];
					break;
				}
			}
			if (out.length)
				out.push(e, e, e);
		}
		if (!out.length) {
			if (tmpArr2[b] > 1 && tmpArr2[e] > 1 && (e - b) > 1) {
				out.push(b, b);
				for (i = b + 1; i < e; ++i) {
					if (tmpArr2[i] > 1) {
						out.push(i, i);
					}
					else {
						out = [];
						break;
					}
				}
				if (out.length)
					out.push(e, e);
			}
		}
		if (!out.length) {
			if (tmpArr2[b] > 0 && tmpArr2[e] > 0 && (e - b) > 3) {
				out.push(b);
				for (i = b + 1; i < e; ++i) {
					if (tmpArr2[i] > 0) {
						out.push(i);
					}
					else {
						out = [];
						break;
					}
				}
				if (out.length)
					out.push(e);
			}
		}
		if (out.length)
			return this.GetCardsByNum(out, totalCards);
		return null;
	}

	static is_shun(cards:any[], keeptailhead:boolean = true):any{
		if(!cards || cards.length < 1){ return {result:false}; }
		var tailwrong = false
		var headwrong = false
		for(var i = 0; i < cards.length - 1; ++i){
			if(cards[i] + 1 != cards[i+1] || cards[i+1] == 13 || cards[i+1] == 14 || cards[i+1] == 15){
				if(keeptailhead){
					return {result:false}
				}

				if(cards.length > 2){
					if(i == 0){
						headwrong = true
					}else if(i == cards.length - 2){
						if(headwrong){
							return {result:false}
						}
						tailwrong = true
					}else{
						return {result:false};
					}
				}else{
					return {result:false}
				}
			}
		}

		if(!keeptailhead && tailwrong){
			return {result:true, kv:cards[cards.length - 2]}
		}else{
			return {result:true, kv:cards[cards.length - 1]}
		}
	 }

	static  GetType(cards:any[], out1Arr:any[] = null, out2Arr:any[] = null, out3Arr:any[] = null, out4Arr:any[] = null):any {
		if (cards == null || cards.length < 1) return {ct:0, kv:0};

		// let tmpArr = [];//记录卡牌数字
		let tmpArr2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//卡牌出现的次数
		let i:number;
		let j:number;
		let flag:Boolean;
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
              	if (out1Arr) {
                    out1Arr.push(i);
                }
			}else if (tmpArr2[i] == 2) { //对
				tmp2Arr.push(i);
				if (out2Arr) {
                    out2Arr.push(i);
                }
			}
			else if (tmpArr2[i] == 3) { //三带
				tmp3Arr.push(i);
				tmp3ArrX.push(i);
				if (out3Arr) {
                    out3Arr.push(i);
                }
			}
			else if (tmpArr2[i] == 4) {//炸弹
				tmp4Arr.push(i);
				tmp3ArrX.push(i);
				if (out4Arr) {
                    out4Arr.push(i);
                }
			}
		}

		if (cards.length == 1) {
			return {ct:DAN, kv:tmp1Arr[0]};
		}
		if (cards.length == 2 && cards.indexOf(140) >= 0 && cards.indexOf(150) >= 0) {
			return {ct:SHUANGWANG, kv:15};
		}

		//炸弹
		if (tmp4Arr.length == 1 && cards.length == 4) {
			return {ct:ZHADAN, kv:tmp4Arr[0]};
		}
		//对子
		if (tmp2Arr.length == 1 && cards.length == 2) {
			return {ct:DUIZI, kv:tmp2Arr[0]};
		}
		//三张
		if (tmp3Arr.length == 1 && cards.length == 3) {
			return {ct:SANZHANG, kv:tmp3Arr[0]};
		}
		//三带一
		if (tmp3Arr.length == 1 && cards.length == 4) {
			return {ct:SANDAIYI, kv:tmp3Arr[0]};
		}
		//三带对
		if (tmp3Arr.length == 1 && tmp2Arr.length == 1 && cards.length == 5) {
			return {ct:SANDAIYIDUI, kv:tmp3Arr[0]};
		}
		//四带二
		if (tmp4Arr.length == 1 && cards.length == 6){
			return {ct:SIDAIER, kv:tmp4Arr[0]};
		}
		//四带对
		if(cards.length == 8){
			if(tmp4Arr.length == 1 && tmp2Arr.length == 2){
				return {ct:SIDAIERDUI, kv:tmp4Arr[0]};
			}else if(tmp4Arr.length == 2){
				return {ct:SIDAIERDUI, kv:tmp4Arr[1]};
			}
		}
		//飞机
		if(tmp3ArrX.length > 1){
			var tmp = this.is_shun(tmp3ArrX, false);
			if(tmp.result){
				if(cards.length == 4 * (tmp3ArrX.length - 1)){ //飞机带单
					return {ct:FEIJI, kv:tmp.kv};
				}
			}
			tmp = this.is_shun(tmp3ArrX);
			if(tmp.result && cards.length == 4 * tmp3ArrX.length){ //飞机带单
				return {ct:FEIJI, kv:tmp.kv};
			}
		}

		if(tmp3Arr.length > 1){
			var tmp = this.is_shun(tmp3Arr);
			if(tmp.result){
				if(cards.length == 5 * tmp3Arr.length){
					if((tmp3Arr.length == tmp2Arr.length + 2 * tmp4Arr.length)){
						return {ct:FEIJI, kv:tmp.kv};
					}
				}
				//三顺
				if(tmp3Arr.length * 3 == cards.length){
					return {ct:SANSHUN, kv:tmp.kv};
				}
			}
		}
		//单顺
		if(tmp1Arr.length > 4 && cards.length == tmp1Arr.length) {
			var tmp = this.is_shun(tmp1Arr);
			if(tmp.result){
				return {ct:DANSHUN, kv:tmp.kv};
			}
		}

		//双顺
		if(tmp2Arr.length > 2 && tmp2Arr.length * 2 == cards.length) {
			var tmp = this.is_shun(tmp2Arr);
			if(tmp.result){
				return {ct:SHUANGSHUN, kv:tmp.kv};
			}
		}
		
		return {ct:0, kv:0};
	}

	/**
	 * 选出给定数量的牌中可以出最大数量的牌型
	 */
	static getMaxNumType(pokerIds:number[]):number[]{
		let _cards:number[] = [];
		
		return _cards;
	}

	public CardsType() {
	}
}