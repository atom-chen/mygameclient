/**
 * Created by cyj on 17/11/06.
 */


class PDKCardsHint {

	static getCardLogicValue(card): number {
		return Math.floor(card / 10)
	}

	static getCardsHash(cards: Array<number>): {} {
		var hash: {} = {};
		var key;
		for (var i = 0; i < cards.length; ++i) {
			key = PDKCardsHint.getCardLogicValue(cards[i]);
			if (!hash[key]) {
				hash[key] = [cards[i]];
			} else {
				hash[key].push(cards[i]);
			}
		}
		return hash;
	}
	static getMinSingle(cards: Array<number>, amount: number, exCards: Array<number>) {
		cards.sort((c1: any, c2: any): number => {
			return c1 - c2;
		});

		var result = [];
		var notincards;
		for (var i = 0; i < cards.length; ++i) {
			notincards = true;
			for (var j = 0; j < exCards.length; ++j) {
				if (exCards[j] == cards[i]) {
					notincards = false;
					break;
				}
			}
			if (notincards && result.length < amount) {
				result.push(cards[i]);
				if (result.length >= amount) {
					return result;
				}
			}
		}
	}

	static getMinDouble(cards: Array<number>, amount: number, exCards: Array<number>) {
		var hash = this.getCardsHash(cards);
		var result = [];
		var notincards;
		for (var i in hash) {
			if (hash[i].length < 2) { continue; };
			notincards = true;
			for (var ii = 0; ii < hash[i].length; ++ii) {
				for (var j = 0; j < exCards.length; ++j) {
					if (exCards[j] == hash[i][ii]) {
						notincards = false;
						break;
					}
				}
				if (!notincards) break;
			}

			if (notincards && result.length < amount) {
				result = result.concat(hash[i]);
				if (result.length >= amount) {
					return result;
				}
			}
		}
	}

	static getAllFourCard(cards: Array<number>, max_amount: number = 0) {
		var boomList = {}
		var hasTab = this.getCardsHash(cards)
		var ans;
		for (var k in hasTab) {
			if (hasTab[k].length == 4) {
				if (max_amount < 7) {
					var combs = this.getMinSingle(cards, 3, hasTab[k])
					if (combs && combs.length == 3) {
						var tc = hasTab[k].concat(combs);
						ans = { node: PDKCardsType.GetType(tc), cards: tc };
						max_amount = tc.length;
					}
				}
				if (max_amount < 6) {
					var combs = this.getMinSingle(cards, 2, hasTab[k])
					if (combs && combs.length == 2) {
						var tc = hasTab[k].concat(combs);
						ans = { node: PDKCardsType.GetType(tc), cards: tc };
						max_amount = tc.length;
					}
				}
				if (max_amount < 4) {
					ans = { node: PDKCardsType.GetType(hasTab[k]), cards: hasTab[k] };
					max_amount = 4;
				}
			}
		}
		return ans;
	}

	static getAllLineCard(cards: Array<number>, max_amount: number = 0): any {
		if (cards.length < 5) return;
		var hasTab = this.getCardsHash(cards);
		var ans;
		var line;
		for (var i = 1; i < 9; ++i) {
			if (!hasTab[i]) continue;
			line = [hasTab[i][0]];
			for (var j = i + 1; j < 13; ++j) {
				if (hasTab[j]) {
					line.push(hasTab[j][0]);
					if (j == 12 && line.length > 4 && line.length > max_amount) {
						ans = { node: PDKCardsType.GetType(line), cards: line };
						max_amount = line.length;
					}
				} else {
					if (line.length > 4 && line.length > max_amount) {
						ans = { node: PDKCardsType.GetType(line), cards: line };
						max_amount = line.length;
					}
					break
				}
			}
		}
		return ans;
	}

	static getAllDoubleLineCard(cards: Array<number>, max_amount: number = 0): any {
		if (cards.length < 6) return;
		var hasTab = this.getCardsHash(cards);
		var ans;
		var line;
		for (var i = 1; i < 11; ++i) {
			if (!hasTab[i] || hasTab[i].length < 2) continue;
			line = [hasTab[i][0], hasTab[i][1]];
			for (var j = i + 1; j < 13; ++j) {
				if (hasTab[j] && hasTab[j].length > 1) {
					line.push(hasTab[j][0]);
					line.push(hasTab[j][1]);
					if (j == 12 && line.length > 5 && line.length > max_amount) {
						ans = { node: PDKCardsType.GetType(line), cards: line };
						max_amount = line.length;
					}
				} else {
					if (line.length > 5 && line.length > max_amount) {
						ans = { node: PDKCardsType.GetType(line), cards: line };
						max_amount = line.length;
					}
					break
				}
			}
		}
		return ans;
	}

	static getAllCardsPossible(cards: Array<number>): any {
		var hash: {} = {};
		var ct_amount: {} = {};
		var key;
		for (var i = 0; i < cards.length; ++i) {
			key = PDKCardsHint.getCardLogicValue(cards[i]);
			if (!hash[key]) {
				hash[key] = 1;
			} else {
				hash[key] = hash[key] + 1;
			}
		}

		for (var k in hash) {
			ct_amount[hash[k]] = (ct_amount[hash[k]] || 0) + 1;
		}

		var max_amount = 0;
		var result;
		if (ct_amount[3] > 0 || ct_amount[4] > 0) {
			var plane = this.getAllPlaneCard(cards, cards.length > 4 ? 4 : max_amount);//5张牌优先提三带二
			if (plane) {
				result = plane;
				max_amount = plane.cards.length;
			}
			if (ct_amount[4] > 0) {
				var fourc = this.getAllFourCard(cards, max_amount);
				if (fourc) {
					result = fourc;
					max_amount = fourc.cards.length;
				}
			}
		}

		var singleline = this.getAllLineCard(cards, max_amount)
		if (singleline) {
			result = singleline;
			max_amount = singleline.cards.length;
		}

		var doubleline = this.getAllDoubleLineCard(cards, max_amount)
		if (doubleline) {
			result = doubleline;
			max_amount = doubleline.cards.length;
		}

		return result;
	}

	static getAllPlaneCard(cards: Array<number>, max_amount: number = 0): any {
		if (cards.length < 3) return;
		var line;
		var tempTb = this.getCardsHash(cards);
		var v;
		var ki;
		var ans;
		for (var k in tempTb) {
			ki = parseInt(k);
			v = tempTb[k];
			if (v.length >= 3) {
				line = [v[0], v[1], v[2]];
				for (var j = ki + 1; j < 12; ++j) {
					if (tempTb[j] && tempTb[j].length >= 3) {
						for (var jj = 0; jj < 3; ++jj) {
							line.push(tempTb[j][jj]);
						}
						if (line.length >= 6) {
							if (max_amount < (line.length + line.length / 3 * 2)) {
								var combs = this.getMinDouble(cards, line.length / 3 * 2, line)
								if (combs && combs.length == line.length / 3 * 2) {
									var tc = line.concat(combs);
									ans = { node: PDKCardsType.GetType(tc), cards: tc };
									max_amount = tc.length;
								}
							}
							if (max_amount < (line.length + line.length / 3 * 2)) {
								var combs = this.getMinSingle(cards, line.length / 3 * 2, line)
								if (combs && combs.length == line.length / 3 * 2) {
									var tc = line.concat(combs);
									ans = { node: PDKCardsType.GetType(tc), cards: tc };
									max_amount = tc.length;
								}
							}
							if (max_amount < (line.length + line.length / 3)) {
								var combs = this.getMinSingle(cards, line.length / 3, line)
								if (combs && combs.length == line.length / 3) {
									var tc = line.concat(combs);
									ans = { node: PDKCardsType.GetType(tc), cards: tc };
									max_amount = tc.length;
								}
							}
							if (max_amount < line.length) {
								ans = { node: PDKCardsType.GetType(line), cards: line };
								max_amount = line.length;
							}
						}
					} else {
						break
					}
				}

				if (max_amount < (line.length + line.length / 3 * 2)) {
					var combs = this.getMinDouble(cards, line.length / 3 * 2, line)
					if (combs && combs.length == line.length / 3 * 2) {
						var tc = line.concat(combs);
						ans = { node: PDKCardsType.GetType(tc), cards: tc };
						max_amount = tc.length;
					}
				}
				if (max_amount < (line.length + line.length / 3 * 2)) {
								var combs = this.getMinSingle(cards, line.length / 3 * 2, line)
								if (combs && combs.length == line.length / 3 * 2) {
									var tc = line.concat(combs);
									ans = { node: PDKCardsType.GetType(tc), cards: tc };
									max_amount = tc.length;
								}
							}
				if (max_amount < (line.length + line.length / 3)) {
					var combs = this.getMinSingle(cards, line.length / 3, line)
					if (combs && combs.length == line.length / 3) {
						var tc = line.concat(combs);
						ans = { node: PDKCardsType.GetType(tc), cards: tc };
						max_amount = tc.length;
					}
				}
				if (max_amount < line.length) {
					ans = { node: PDKCardsType.GetType(line), cards: line };
					max_amount = line.length;
				}
			}
		}
		return ans;
	}

	static getMaxAmountCards(cards: Array<number>): any {
		if (!cards || cards.length < 1) { return; }
		var temp = PDKCardsType.GetType(cards)
		if (temp.ct > 0) {
			return cards;
		}

		temp = PDKCardsHint.getAllCardsPossible(cards);
		if (temp) return temp.cards;
		return cards;
	}

	// 	 let PDKBUYAO:number = 0;
	// let PDKSHUANGWANG:number = 1;
	// let PDKZHADAN:number = 2;
	// let PDKDAN:number = 4;
	// let PDKDUIZI:number = 5;
	// let PDKSANZHANG:number = 6;
	// let PDKSANDAIYI:number = 7;
	// let PDKSANDAIYIDUI:number = 13;
	// let PDKSIDAIER:number = 8;
	// let PDKSIDAIERDUI:number = 14;
	// let PDKFEIJI:number = 9;
	// let PDKDANSHUN:number = 10;
	// let PDKSHUANGSHUN:number = 11;
	// let PDKSANSHUN:number = 12;

	static getFitCards(cards: Array<number>, idx: number, precards: Array<number> = []): any {
		if (!cards || cards.length < 1 || idx >= cards.length) return;
		if (cards.length < precards.length) return;

		var prenode = { ct: 0, kv: 0 };
		if (precards.length > 0) {
			prenode = PDKCardsType.GetType(precards);
			if (!prenode || !prenode.ct) return;
		}


		var hash = this.getCardsHash(cards);

		var temp = PDKCardsType.GetType(cards);
		if ((precards.length > 0 && prenode.ct != 2 && prenode.ct != 4 && prenode.ct != 5 && prenode.ct != 6) || prenode.kv > temp.kv) {
			if (temp.ct == 2 || temp.ct == 1) {
				return cards;
			} else {
				return;
			}
		}
		if (prenode.ct == 1 || (prenode.ct == 2 && temp.kv <= prenode.kv)) return;
		if (temp.kv <= prenode.kv && temp.ct != 2 && temp.ct != 1) return;

		var result = [];

		// for(var i = 0; i < Math.ceil(cards.length / 2); ++i){
		// 	cards[i] = cards[i] + cards[cards.length - 1 - i];
		// 	cards[cards.length - 1 - i] = cards[i] - cards[cards.length - 1 - i];
		// 	cards[i] = cards[i] - cards[cards.length - 1 - i];
		// }
		if (precards.length == 0) {
			for (var i = 0; i <= idx; ++i) {
				result.push(cards[i]);
			}
		} else {
			if (idx + 1 > precards.length && (temp.ct == 2 || temp.ct == 1)) {
				result = cards;
			} else {
				for (var i = 0; i < precards.length; ++i) {
					result.push(cards[i]);
				}
			}
		}

		return result;
	}

	static getHumanVisible(card: number): string {
		var v = this.getCardLogicValue(card)

		v = v + 2
		var color
		if (card % 10 == 0) {
			color = '♥'
		} else if (card % 10 == 1) {
			color = '♠'
		} else if (card % 10 == 2) {
			color = '♣'
		} else if (card % 10 == 3) {
			color = '♦'
		}

		var str = ''
		if (v < 11) {
			str = v + color;
		} else if (v == 11) {
			str = 'J' + color
		} else if (v == 12) {
			str = 'Q' + color
		} else if (v == 13) {
			str = 'K' + color
		} else if (v == 14) {
			str = 'A' + color
		} else if (v == 15) {
			str = '2' + color
		} else if (v == 16) {
			str = 'JokerS'
		} else if (v == 17) {
			str = 'JokerB'
		}

		return str
	}

	static printCards(cards: Array<number>, tailStr: string = '') {
		if (!cards) return;
		var buff = ''
		for (var i = 0; i < cards.length; ++i) {
			buff = buff + this.getHumanVisible(cards[i]) + ' '
		}

		console.log(tailStr);
		console.log(buff);
	}
}