/**
 * 高牌
 */
let CARD_T_HIGH = 1;
/**
 * 一对
 */
let CARD_T_ONEPAIR = 2;
/**
 * 两对
 */
let CARD_T_TWOPAIR = 3;
/**
 * 三条
 */
let CARD_T_THREEOFAKIND = 4;
/**
 * 顺子
 */
let CARD_T_STRAIGHT = 5;
/**
 * 同花
 */
let CARD_T_FLUSH = 6;
/**
 * 葫芦
 */
let CARD_T_FULLHOUSE = 7;
/**
 * 四条
 */
let CARD_T_FOUROFAKIND = 8;
/**
 * 同花顺
 */
let CARD_T_STRAIGHTFLUSH = 9;
/**
 * 皇家同花顺
 */
let CARD_T_ROYALFLUSH = 10;

/**
 * 花色
 */
let CARD_C_Diamond = 0; //方块♦
let CARD_C_Club = 1; //梅花♣
let CARD_C_Heart = 2; //红桃♥
let CARD_C_Spade = 3; //黑桃♠

let CARD_V_2 = 1;
let CARD_V_3 = 2;
let CARD_V_4 = 3;
let CARD_V_5 = 4;
let CARD_V_6 = 5;
let CARD_V_7 = 6;
let CARD_V_8 = 7;
let CARD_V_9 = 8;
let CARD_V_10 = 9;
let CARD_V_J = 10;
let CARD_V_Q = 11;
let CARD_V_K = 12;
let CARD_V_A = 13;

/**
 * 牌型
 */
let CARD_TYPE_INFO = {
	[CARD_T_HIGH]:"高牌",
	[CARD_T_ONEPAIR]:"对子",
	[CARD_T_TWOPAIR]:"两对",
	[CARD_T_THREEOFAKIND]:"三条",
	[CARD_T_STRAIGHT]:"顺子",
	[CARD_T_FLUSH]:"同花",
	[CARD_T_FULLHOUSE]:"葫芦",
	[CARD_T_FOUROFAKIND]:"四条",
	[CARD_T_STRAIGHTFLUSH]:"同花顺",
	[CARD_T_ROYALFLUSH]:"皇家同花顺",
}

/**
 * 花色
 */
let CARD_C_INFO = {
	[CARD_C_Diamond] : "♦",
	[CARD_C_Club] : "♣",
	[CARD_C_Heart] : "♥",
	[CARD_C_Spade] : "♠",
}
/**
 * 牌面值
 */
let CARD_V_INFO = {
	[CARD_V_2] : "2",
	[CARD_V_3] : "3",
	[CARD_V_4] : "4",
	[CARD_V_5] : "5",	
	[CARD_V_6] : "6",
	[CARD_V_7] : "7",
	[CARD_V_8] : "8",
	[CARD_V_9] : "9",	
	[CARD_V_10] : "10",
	[CARD_V_J] : "J",
	[CARD_V_Q] : "Q",
	[CARD_V_K] : "K",
	[CARD_V_A] : "A",
}

let OP_TYPE_ADD= 1;
let OP_TYPE_FOLLOW = 2;
let OP_TYPE_GIVEUP = 3;
let OP_TYPE_SKIP= 4;
let OP_TYPE_ALLIN = 5;

class DzpkCardType {
	/**
	 * 调用前要确保cards为数组
	 * 遍历牌,找出相同的牌
	 */
	private static _allCardsToEqualArray(cards:any):any{
		let ret = {equalObj:{},cardVs:[],hasFour:0,hasThree:0,hasTwo:0,flush:true};
		let len = cards.length;
		let cardV = 0; //牌值
		let cardC = 0; //花色
		let lastC = -1; //上一个牌的花色
		for(let i=0;i<len;++i){
			cardV = this.getCardV(cards[i]);
			cardC = this.getCardC(cards[i]);
			if(lastC == -1){
				lastC = cardC;
			}else if(lastC != cardC){
				ret.flush = false;
			}
			if(!ret.equalObj[cardV]){
				ret.equalObj[cardV] = {num:0,v:cardV,c:[]};
				ret.cardVs.push(cardV);
			}
			ret.equalObj[cardV].num += 1;
			let len1 = ret.equalObj[cardV].num;
			if(len1 == 4){
				ret.hasFour = 1;
				ret.hasThree -= 1;
			}else if(len1 == 3){
				ret.hasThree = 1;
				ret.hasTwo -= 1;
			}else if(len1 == 2){
				ret.hasTwo += 1;
			}
			ret.equalObj[cardV].c.push(cardC);
		}
		
		return ret;
	}

	/**
	 * 是否是顺子 同花顺 皇家同花顺
	 * equalCards 中的cardVs 长度必须是5
	 */
	static checkShunOrSameC(equalCards:any):any{
		let type = CARD_T_HIGH; 
		let cardVs = equalCards.cardVs;
		let cvsLen = cardVs.length;
		let bRoyalFlush = false;//皇家同花顺
		let bStraight = true; //顺子
		let equalObj = equalCards.equalObj;
		let beforeCardV = cardVs[0];
		let lastVIdx = cvsLen - 1;
		for(let i=1;i<lastVIdx;++i){
			if(beforeCardV + 1 != cardVs[i]){
				bStraight = false;
			}else{
				beforeCardV = cardVs[i];
			}
		}

		if(bStraight){
			if(cardVs[lastVIdx] == CARD_V_A){
				if(beforeCardV != CARD_V_K && beforeCardV != CARD_V_5){
					bStraight = false;
				}else{
					if(beforeCardV == CARD_V_K && equalCards.flush){
						bRoyalFlush = true;
					}
				}
			}else{
				if(beforeCardV + 1 != cardVs[lastVIdx]){
					bStraight = false;
				}
			}
		}

		if(bStraight){
			type = CARD_T_STRAIGHT;
			if(equalCards.flush){
				type = CARD_T_STRAIGHTFLUSH;
				if(bRoyalFlush){
					type = CARD_T_ROYALFLUSH;
				}
			}
		}else if(equalCards.flush){
			type = CARD_T_FLUSH;
		}
		return type;
	}

	/**
	 * 打印牌面值和牌型
	 */
	static printCardVAndType(cards:any,type:number = 0):void{
		let len = cards.length;
		let str = "";
		let cardV = 0;
		let cardC = 0;
		for(let i=0;i<len;++i){
			cardV = this.getCardV(cards[i]);
			cardC = this.getCardC(cards[i]);
			str += CARD_C_INFO[cardC] + CARD_V_INFO[cardV] +" ";
		}
		if(type != 0){
			str += " 牌型:" + CARD_TYPE_INFO[type];
		}
		console.log("printCardVAndType--->",str)
	}

	/**
	 * 获取给定的牌所组成的牌型
	 * 返回{t:xx,pokerId:[]}
	 */
	static getCardType(cardsArr:any):any{
		if(!cardsArr) {
			console.error("getCardType error cardsArr should not null");
			return -1;
		}
		let cards = cardsArr.sort(function(item1,item2){
			return item1 - item2;
		});

		let type = CARD_T_HIGH; 
		let equalCards = this._allCardsToEqualArray(cards);
		if(!equalCards){
			console.error("_allCardsToEqualArray error equalCards should not null");
			Reportor.instance.onWindowError(cards,"getCardType==1",0,0,null);
			return null;
		}

		let cardVs = equalCards.cardVs;
		let len1 = cardVs.length;
		if(len1 == 5){
			type = this.checkShunOrSameC(equalCards);
		}else if(len1 == 4){
			if(equalCards.hasTwo){
				type = CARD_T_ONEPAIR;
			}
		}else if(len1 == 3){
			if(equalCards.hasThree){
				type = CARD_T_THREEOFAKIND;
			}else if(equalCards.hasTwo){
				if(equalCards.hasTwo == 2){
					type = CARD_T_TWOPAIR;
				}else{
					type = CARD_T_ONEPAIR;
				}
			}
		}else if(len1 >= 1){
			if(equalCards.hasFour){
				type = CARD_T_FOUROFAKIND;
			}else if(equalCards.hasThree){
				type = CARD_T_THREEOFAKIND;
				if(equalCards.hasTwo){
					type = CARD_T_FULLHOUSE;
				}
			}else if(equalCards.hasTwo){
				if(equalCards.hasTwo == 2){
					type = CARD_T_TWOPAIR;
				}else{
					type = CARD_T_ONEPAIR;
				}
			}
		}else {
			Reportor.instance.onWindowError(equalCards,"getCardType==2",0,0,null);
			return null;
		}

		if(equalCards.flush && type != CARD_T_STRAIGHTFLUSH){
			if(type == CARD_T_HIGH || type == CARD_T_ONEPAIR || type == CARD_T_TWOPAIR || type == CARD_T_THREEOFAKIND){
				type = CARD_T_FLUSH;
			}
		}
		equalCards.type = type;
		if(DEBUG){
			//this.printCardVAndType(cards,type);
		}
		return equalCards;
	}

	/**
	 * 检测两张牌是否是一对
	 */
	static isOnePair(cards):boolean{
		let len = cards.length;
		let card1V = this.getCardV(cards[0])
		let card2V = this.getCardV(cards[1]);
		if(card1V == card2V){
			return true;
		}
		return false;
	}

	/**
	 * 获取牌的实际值
	 */
	static getCardV(val):any{
		return Math.floor(val / 10);
	}

	/**
	 * 获取牌的花色值
	 */
	static getCardC(val):any{
		return val % 10;
	}
	/**
	 * 打印组合的总数
	 */
	static debugAllTypeNum(_myCardids,pubCardids):void{
		let newCs = _myCardids.concat(pubCardids);
		let len = newCs.length;
		let sum = 1;
		let j = 1;
		for (let i=len,j=1;j<=5;i--,j++)  
		{  
			sum=sum*i/j;  
		}  
		console.log("debugAllTypeNum---->",len,sum);
	}

	/**
	 * 从桌面上的牌和我手中的牌中抽取最优的5张组成最大牌型
	 * hasConcat 是否已经将我的手牌和公共牌合并了
	 */
	static getMaxCardTypeFromPub(_myCardids,pubCardids,hasConcat:boolean = false):any{
		let newC = [];
		let allCs = pubCardids;
		if(!hasConcat){
			allCs = _myCardids.concat(pubCardids);
		}
		let len = allCs.length;
		let allTypes = [];
		let equalCards;
		//let n = 0;
		if(len >= 5){
			//this.debugAllTypeNum(_myCardids,pubCardids);
			for(let i=0;i<len-4;++i){
				for(let j=i+1;j<len-3;++j){
					for(let k=j+1;k<len-2;++k){
						for(let l=k+1;l<len-1;++l){
							for(let m=l+1;m<len;++m){
								//n += 1;
								//console.log("-----",allCs[i],allCs[j],allCs[k],allCs[l],allCs[m],n)
								newC = [allCs[i],allCs[j],allCs[k],allCs[l],allCs[m]];
								equalCards = this.getCardType(newC);
								equalCards.five = newC;
								allTypes.push(equalCards);
							}
						}
					}
				}
			}

			len = allTypes.length;
			let maxTypeObj = allTypes[0];
			for(let i=1;i<len;++i){
				if(allTypes[i].type >= maxTypeObj.type){
					if(allTypes[i].type == maxTypeObj.type){ //比较牌值
						let curFive = allTypes[i].five;
						let maxFive = maxTypeObj.five;
						let cutTot=0,maxTot=0;
						for(let j=0;j<5;++j){
							cutTot += this.getCardV(curFive[j]);
							maxTot += this.getCardV(maxFive[j]);
						}
						if(cutTot > maxTot){
							maxTypeObj = allTypes[i];
						}
					}else{
						maxTypeObj = allTypes[i];	
					}
				}
			}
			return maxTypeObj;
		}else{
			console.error("getMaxCardTypeFromPub pubCardids len 错误:" + len);
			return null;
		}
	}
}