/**
 * Created by rockyl on 15/12/15.
 */

let PDKBUYAO: number = 0;
let PDKSHUANGWANG: number = 1;
let PDKZHADAN: number = 2;
let PDKDAN: number = 4;
let PDKDUIZI: number = 5;
let PDKSANZHANG: number = 6;
let PDKSANDAIYI: number = 7;
let PDKSANDAIYIDUI: number = 13;
let PDKSIDAIER: number = 8;
let PDKSIDAIERDUI: number = 14;
let PDKFEIJI: number = 9;
let PDKDANSHUN: number = 10;
let PDKSHUANGSHUN: number = 11;
let PDKSANSHUN: number = 12;
let PDKSANDAIER: number = 15;//pdk
let PDKSANTIAOA: number = 16;//pdk
let PDKSIDAISAN: number = 17;

class PDKCardsType {
	static CheckType(cards: any[], targetCards: any[], totalCards: any[] = []): boolean {

		let result1 = this.GetType(cards);
		console.log("CheckType-----111------->", cards, result1)
		if (result1.ct == PDKSHUANGWANG) return true;
		if (result1.ct == PDKSANTIAOA) return true;
		if (targetCards == null || targetCards.length < 1) {
			//最后一把可以出三带一
			// if (result1.ct == PDKSANDAIYI && totalCards.length != 4) {
			// 	return false;
			// }
			return result1.ct != 0;
		}
		let result2 = this.GetType(targetCards);
		// //最后一轮才能出三带一
		// if ((result2.ct == PDKSANDAIYI || result2.ct == PDKSANDAIER) && result1.ct == PDKSANDAIYI) {
		// 	return result1.kv > result2.kv && totalCards.length == 4;
		// }		
		console.log("CheckType-------222----->", targetCards, result2);
		console.log("CheckType-------333----->", result1, result2);
		if (result1.ct == result2.ct) {
			if (cards.length == targetCards.length) {
				return result1.kv > result2.kv;
			}
		} else if (result2.ct != PDKSHUANGWANG) {
			if (result2.ct != PDKZHADAN && result1.ct == PDKZHADAN) {
				return true;
			}
		}

		return false;
	}

	static GetCards2(targetCards: any[], totalCards: any[]): any[] {
		let out1: any[] = [];
		let out2: any[] = [];
		let out3: any[] = [];
		let out4: any[] = [];
		// let type:number = this.GetType2(targetCards, out1, out2, out3, out4);
		var result = this.GetType(targetCards, out1, out2, out3, out4);
		let type = result.ct

		let targetType: number = type;

		if (type == 0) return null;

		let firstValue: any[] = [type, out1, out2, out3];

		let obj: Object = this.m_getCards(targetCards, type, out1, out2, out3, out4, totalCards, targetType);
		console.log("GetCards2-----------11--->", result, targetCards, totalCards);
		console.log("GetCards2-----------22--->", obj);
		let arr1: any[] = [];//不拆牌
		let arr2: any[] = [];//拆牌
		let nums: any[] = [];
		let lastCards: any[];
		while (obj != null && obj.hasOwnProperty("chai") && obj.hasOwnProperty("cards") && obj.hasOwnProperty("nums")) {
			lastCards = obj["cards"];
			let lastResult = this.GetType(lastCards);
			let canPush = true;
			if (lastResult.ct == result.ct) {
				if (lastCards.length == targetCards.length) {
					if (lastResult.kv <= result.kv) {
						canPush = false;
					}
				}
			}
			if (canPush) {
				if (obj["chai"] == false) {
					arr1.push(lastCards);
				}
				else {
					arr2.push(lastCards);
				}
			}

			nums.push(obj["nums"]);

			out1 = [];
			out2 = [];
			out3 = [];
			out4 = [];
			var _result = this.GetType(lastCards, out1, out2, out3, out4);
			type = _result.ct //this.GetType2(lastCards, out1, out2, out3, out4);
			obj = this.m_getCards(lastCards, type, out1, out2, out3, out4, totalCards, targetType);
			console.log("GetCards2----------33--->", obj);
			//				{chai:false,cards:GetCardsByNum([i],totalCards)};
		}
		let arr: any[] = arr1.concat(arr2);
		if (arr.length > 0) {
			firstValue.push(arr);
			firstValue.push(nums);
			return firstValue;
		}

		return null;
	}

	static m_getCards(targetCards: any[], type: number, out1Arr: any[], out2Arr: any[], out3Arr: any[], out4Arr: any[], totalCards: any[], targetType: number): Object {
		if (totalCards == null || totalCards.length < 1) return null;

		if (type == PDKSHUANGWANG || type == 0) return null;
		if (type == PDKSANTIAOA || type == 0) return null;
		// if (type == PDKSANDAIER && totalCards.length == 4) return null;
		let tmpArr2: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//卡牌出现的次数
		let i: number;
		let j: number;
		for (i = 0; i < totalCards.length; ++i) {
			let num: number = Math.floor(totalCards[i] / 10);
			tmpArr2[num]++;
		}

		let tmp1Arr: any[] = [];
		let tmp2Arr: any[] = [];
		let tmp3Arr: any[] = [];
		let tmp4Arr: any[] = [];
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

		if (type == PDKSANDAIER && totalCards.length == 4 && tmp4Arr.length < 1) return null;
		if (type == PDKDAN) {
			for (i = out1Arr[0] + 1; i < tmpArr2.length; ++i) {
				if (tmpArr2[i] == 1) {
					if ((i == 14 || i == 15) && tmpArr2[14] > 0 && tmpArr2[15] > 0) {
						return { chai: true, cards: this.GetCardsByNum([i], totalCards), nums: [i] };
					}
					else {
						return { chai: false, cards: this.GetCardsByNum([i], totalCards), nums: [i] };
					}
				}
				else if (tmpArr2[i] > 1) {
					return { chai: true, cards: this.GetCardsByNum([i], totalCards), nums: [i] };
				}
			}
		}
		if (type == PDKDUIZI) {
			for (i = out2Arr[0] + 1; i < tmpArr2.length; ++i) {
				if (tmpArr2[i] == 2) {
					return { chai: false, cards: this.GetCardsByNum([i, i], totalCards), nums: [i, i] };
				}
				else if (tmpArr2[i] > 2) {
					return { chai: true, cards: this.GetCardsByNum([i, i], totalCards), nums: [i, i] };
				}
			}
		}
		if (type == PDKSANZHANG) {
			for (i = out3Arr[0] + 1; i < tmpArr2.length; ++i) {
				if (tmpArr2[i] == 3) {
					return { chai: false, cards: this.GetCardsByNum([i, i, i], totalCards), nums: [i, i, i] };
				}
				else if (tmpArr2[i] > 3) {
					return { chai: true, cards: this.GetCardsByNum([i, i, i], totalCards), nums: [i, i, i] };
				}
			}
		}
		let tmp: any[];
		if (type == PDKSANDAIYI) {
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
							return { chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
						}
						else {
							return { chai: true, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
						}
					}
					break;
				}
			}
		}
		// if (type == PDKSANDAIYIDUI) {
		// 	for (i = out3Arr[0] + 1; i < tmpArr2.length; ++i) {
		// 		if (tmpArr2[i] > 2) {
		// 			tmp = [i, i, i];
		// 			if (tmp2Arr.length > 0) {
		// 				tmp.push(tmp2Arr[0], tmp2Arr[0]);
		// 			}
		// 			else {
		// 				for (j = 1; j < tmpArr2.length; ++j) {
		// 					if (tmpArr2[j] > 1 && j != i) {
		// 						tmp.push(j, j);
		// 						break;
		// 					}
		// 				}
		// 			}
		// 			if (tmp.length == 5) {
		// 				if (tmpArr2[i] == 3) {
		// 					return { chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
		// 				}
		// 				else {
		// 					return { chai: true, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
		// 				}
		// 			}
		// 			break;
		// 		}
		// 	}
		// }
		if (type == PDKSANDAIER) {
			for (i = out3Arr[0] + 1; i < tmpArr2.length; ++i) {
				if (tmpArr2[i] == 3) {
					tmp = [i, i, i];
					if (tmp1Arr.length > 1) {
						//两张单牌
						tmp.push(tmp1Arr[0], tmp1Arr[1]);
					} else if (tmp1Arr.length > 0) {
						//如果只有一张单牌，拆一对 or 拆三张 or拆炸弹
						if (tmp2Arr.length > 0) {
							tmp.push(tmp1Arr[0], tmp2Arr[0]);
						}
						else if (tmp3Arr.length > 1) {
							for (j = 0; j < tmp3Arr.length; ++j) {
								if (tmp3Arr[j] != i) {
									tmp.push(tmp1Arr[0], tmp3Arr[j]);
									break;
								}
							}
						}
						else if (tmp4Arr.length > 0) {
							for (j = 0; j < tmp4Arr.length; ++j) {
								if (tmp4Arr[j] != i) {
									tmp.push(tmp1Arr[0], tmp4Arr[j]);
									break;
								}
							}
						}
					}
					else {
						// for (j = 1; j < tmpArr2.length; ++j) {
						// 	if (tmpArr2[j] > 1 && j != i && tmpArr2[j] < 4) {
						// 		tmp.push(j, j);
						// 		break;
						// 	}
						// }
						let isPush = false;
						for (j = 1; j < tmpArr2.length; ++j) {
							if (tmpArr2[j] == 2 && j != i) {
								tmp.push(j, j);
								isPush = true;
								break;
							}
						}
						if (!isPush) {
							for (j = 1; j < tmpArr2.length; ++j) {
								if (tmpArr2[j] == 3 && j != i) {
									tmp.push(j, j);
									isPush = true;
									break;
								}
							}
						}
						if (!isPush) {
							for (j = 1; j < tmpArr2.length; ++j) {
								if (tmpArr2[j] == 4 && j != i) {
									tmp.push(j, j);
									break;
								}
							}
						}
					}
					if (tmp.length == 5) {
						let isHasNull = false;
						for (j = 0; j < tmp.length; j++) {
							if (!tmp[j]) {
								isHasNull = true;
							}
						}
						if (isHasNull == true) {
							break;
						}
						if (i == 12) {
							// tmp = [i, i, i];
							// return { chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
							break;
						}
						return { chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
					}
					break;
				}
			}

			for (i = out3Arr[0] + 1; i < tmpArr2.length; ++i) {
				if (tmpArr2[i] == 4) {
					tmp = [i, i, i];
					//如果最后一手牌，可以用三带一压三带二 pdk
					// if (totalCards.length == 4) {
					// 	let res: any = this.GetType(totalCards);
					// 	if (res.ct == PDKSANDAIYI) {
					// 		tmp = totalCards;
					// 		return { chai: false, cards: totalCards, nums: tmp };
					// 	}
					// }
					if (tmp1Arr.length > 1) {
						//两张单牌
						tmp.push(tmp1Arr[0], tmp1Arr[1]);
					} else if (tmp1Arr.length > 0) {
						//如果只有一张单牌，拆一对
						tmp.push(tmp1Arr[0], tmp2Arr[0]);
					}
					else {
						// for (j = 1; j < tmpArr2.length; ++j) {
						// 	if (tmpArr2[j] > 1 && j != i) {
						// 		tmp.push(j, j);
						// 		break;
						// 	}
						// }
						let isPush = false;
						for (j = 1; j < tmpArr2.length; ++j) {
							if (tmpArr2[j] == 2 && j != i) {
								tmp.push(j, j);
								isPush = true;
								break;
							}
						}
						if (!isPush) {
							for (j = 1; j < tmpArr2.length; ++j) {
								if (tmpArr2[j] == 3 && j != i) {
									tmp.push(j, j);
									isPush = true;
									break;
								}
							}
						}
						if (!isPush) {
							for (j = 1; j < tmpArr2.length; ++j) {
								if (tmpArr2[j] == 4 && j != i) {
									tmp.push(j, j);
									break;
								}
							}
						}
					}
					if (tmp.length == 5) {
						// if (tmpArr2[i] == 4) {
						// 	//优先炸弹
						// 	tmp = [i, i, i, i];
						// 	return { chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
						// } else if (tmpArr2[i] == 3) {
						// 	//优先三条A
						// 	if (i == 12) {
						// 		tmp = [i, i, i];
						// 		return { chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
						// 	}
						// 	return { chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
						// } else {
						// 	return { chai: true, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
						// }

						if (tmpArr2[i] == 4) {
							for (j = 0; j < tmpArr2.length; ++j) {
								if (tmpArr2[j] == 4) {
									tmp = [j, j, j, j];
									return { chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
								}
							}
						}
					}
					break;
				}
			}
		}
		if (type == PDKSIDAIER) {
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
							return { chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
						}
						break;
					}
				}
			}
		}
		if (type == PDKSIDAISAN) {
			if (tmp4Arr.length > 0) {
				for (i = 0; i < tmp4Arr.length; ++i) {
					if (tmp4Arr[i] > out4Arr[0]) {
						tmp = [tmp4Arr[i], tmp4Arr[i], tmp4Arr[i], tmp4Arr[i]];

						for (j = 0; j < tmp1Arr.length && tmp.length < 7; ++j) {
							tmp.push(tmp1Arr[j]);
						}
						if (tmp.length < 7) {
							for (j = 1; j < tmpArr2.length && tmp.length < 7; ++j) {
								if (tmpArr2[j] > 0 && tmp.indexOf(j) < 0) {
									tmp.push(j);
								}
							}
						}

						if (tmp.length == 7) {
							return { chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
						}
						break;
					}
				}
			}
		}
		if (type == PDKSIDAIERDUI) {
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
							return { chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
						}
						break;
					}
				}
			}
		}
		let count: number;
		let test: boolean;
		if (type == PDKFEIJI) {
			count = out3Arr.length;
			if (count >= 2) {
				if (targetCards.length == 8 || targetCards.length == 10) {
					count = 2;
				}
				else if (targetCards.length == 15 || targetCards.length == 12) {
					count = 3;
				}
				else if (targetCards.length == 16) {
					count = 4;
				}
				//普通飞机
				let targetType = this.GetType(targetCards);
				console.log("cnmde feiji-------->", targetCards, targetType);
				let startIndex = out3Arr[0] + 1;
				if(targetType && targetType.kv != 0) {
					startIndex = targetType.kv + 1;
				}
				if(count == 2) {
					startIndex = targetType.kv;
				}
				for (i = startIndex; i < tmpArr2.length - count + 1; ++i) {
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
						if (out1Arr.length > 0) {
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
								return { chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
							}
						}
						else if (out2Arr.length > 0) {
							for (j = 0; j < tmp2Arr.length && tmp.length < targetCards.length; ++j) {
								tmp.push(tmp2Arr[j], tmp2Arr[j]);
							}
							// if (tmp.length < targetCards.length) {
							// 	for (j = 0; j < tmpArr2.length && tmp.length < targetCards.length; ++j) {
							// 		if (tmpArr2[j] > 1 && tmp.indexOf(j) < 0) {
							// 			tmp.push(j, j);
							// 		}
							// 	}
							// }
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
								return { chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
							}
						}
						break;
					}
				}
			} else {
				//检查是否带炸弹的飞机
				let count1 = out3Arr.length + out4Arr.length;
				let targetCount = targetCards.length / 5;
				if (targetCount % 1 == 0) {
					if (count1 >= targetCount) {
						let tmpOut1Arr = out1Arr;
						let tmpOut3Arr = out3Arr;
						for (var z = 0; z < targetCount - out3Arr.length; z++) {
							if (Math.abs(tmpOut3Arr[0] - out4Arr[z]) == 1 || Math.abs(tmpOut3Arr[tmpOut3Arr.length - 1] - out4Arr[z]) == 1) {
								tmpOut3Arr.push(out4Arr[z]);
								tmpOut1Arr.push(out4Arr[z]);
							}
							tmpOut3Arr.sort((a: any, b: any): number => {
								return a - b;
							});
						}
						count1 = targetCount;
						for (i = tmpOut3Arr[0] + 1; i < tmpArr2.length - count1 + 1; ++i) {
							test = true;
							tmp = [];
							for (j = 0; j < count1; ++j) {
								tmp.push(i + j, i + j, i + j);
								if (tmpArr2[i + j] < 3 || i + j == 13 || i + j == 14 || i + j == 15) {
									test = false;
									break;
								}
							}
							if (test) {
								if (tmpOut1Arr.length > 0) {
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
										return { chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
									}
								}
								else if (out2Arr.length > 0) {
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
										return { chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
									}
								}
								break;
							}
						}
					}
				}
			}
		}
		if (type == PDKDANSHUN) {
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
					return { chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
				}
			}
		}
		if (type == PDKSHUANGSHUN) {
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
					return { chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
				}
			}
		}

		if (type == PDKSANSHUN) {
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
					return { chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
				}
			}
		}

		if (type == PDKZHADAN) {
			if (tmp4Arr.length > 0) {
				console.log("PDKZHADAN--------->", tmp4Arr, out4Arr);
				for (i = 0; i < tmp4Arr.length; ++i) {
					if (tmp4Arr[i] > out4Arr[0]) {
						tmp = [tmp4Arr[i], tmp4Arr[i], tmp4Arr[i], tmp4Arr[i]];
						if (type == targetType) {
							return { chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
						}
						else {
							return { chai: true, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
						}
					}
				}
			}
		}
		else if (tmp4Arr.length > 0) {
			tmp = [tmp4Arr[0], tmp4Arr[0], tmp4Arr[0], tmp4Arr[0]];
			return { chai: true, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
		}

		if (tmpArr2[14] > 0 && tmpArr2[15] > 0) {
			return { chai: true, cards: this.GetCardsByNum([14, 15], totalCards), nums: [14, 15] };
		}

		//跑得快 3个A最大
		if (tmpArr2[12] == 3) {
			tmp = [12, 12, 12];
			return { chai: false, cards: this.GetCardsByNum(tmp, totalCards), nums: tmp };
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

	static CheckShun(totalCards: any[]): any[] {
		let tmpArr2: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//卡牌出现的次数
		let i: number;
		let j: number;
		for (i = 0; i < totalCards.length; ++i) {
			let num: number = Math.floor(totalCards[i] / 10);
			if (num < tmpArr2.length) {
				tmpArr2[num]++;
			}
		}

		let test: boolean = true;
		let tmp: any[];

		i = 0;
		let out1: any[] = [];
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
		let out2: any[] = [];
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
		let out3: any[] = [];
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

		let out: any[] = out1;

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

	static CheckShun2(totalCards: any[]): any[] {
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

	static is_shun(cards: any[], keeptailhead: boolean = true): any {
		if (!cards || cards.length < 1) { return { result: false }; }
		var tailwrong = false
		var headwrong = false
		for (var i = 0; i < cards.length - 1; ++i) {
			if (cards[i] + 1 != cards[i + 1] || cards[i + 1] == 13 || cards[i + 1] == 14 || cards[i + 1] == 15) {
				if (keeptailhead) {
					return { result: false }
				}

				if (cards.length > 2) {
					if (i == 0) {
						headwrong = true
					} else if (i == cards.length - 2) {
						if (headwrong) {
							return { result: false }
						}
						tailwrong = true
					}
				} else {
					return { result: false }
				}
			}
		}

		if (!keeptailhead && tailwrong) {
			return { result: true, kv: cards[cards.length - 2] }
		} else {
			return { result: true, kv: cards[cards.length - 1] }
		}
	}

	static GetType(cards: any[], out1Arr: any[] = null, out2Arr: any[] = null, out3Arr: any[] = null, out4Arr: any[] = null): any {
		if (cards == null || cards.length < 1) return { ct: 0, kv: 0 };

		// let tmpArr = [];//记录卡牌数字
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
				if (out1Arr) {
					out1Arr.push(i);
				}
			} else if (tmpArr2[i] == 2) { //对
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

		//单牌
		if (cards.length == 1) {
			return { ct: PDKDAN, kv: tmp1Arr[0] };
		}
		//双王
		if (cards.length == 2 && cards.indexOf(140) >= 0 && cards.indexOf(150) >= 0) {
			return { ct: PDKSHUANGWANG, kv: 15 };
		}
		//炸弹
		if (tmp4Arr.length == 1 && cards.length == 4) {
			return { ct: PDKZHADAN, kv: tmp4Arr[0] };
		}
		//AAA炸弹
		if (tmp3Arr.length == 1 && cards.length == 3 && tmp3Arr[0] == 12) {
			return { ct: PDKSANTIAOA, kv: tmp3Arr[0] };
		}
		//对子
		if (tmp2Arr.length == 1 && cards.length == 2) {
			return { ct: PDKDUIZI, kv: tmp2Arr[0] };
		}
		//三张
		if (tmp3Arr.length == 1 && cards.length == 3) {
			return { ct: PDKSANZHANG, kv: tmp3Arr[0] };
		}
		//三带一
		if (tmp3Arr.length == 1 && cards.length == 4) {
			return { ct: PDKSANDAIYI, kv: tmp3Arr[0] };
		}
		//三带对
		if (tmp3Arr.length == 1 && tmp2Arr.length == 1 && cards.length == 5) {
			//return {ct:PDKSANDAIYIDUI, kv:tmp3Arr[0]};			
			return { ct: PDKSANDAIER, kv: tmp3Arr[0] };
		}
		//三带二
		if (tmp3Arr.length == 1 && cards.length == 5) {
			return { ct: PDKSANDAIER, kv: tmp3Arr[0] };
		}
		// //四带二
		// if (tmp4Arr.length == 1 && cards.length == 5) {
		// 	return { ct: PDKSIDAIER, kv: tmp4Arr[0] };
		// }
		//四带二
		if (tmp4Arr.length == 1 && cards.length == 6) {
			return { ct: PDKSIDAIER, kv: tmp4Arr[0] };
		}
		//四带三
		if (tmp4Arr.length == 1 && cards.length == 7) {
			return { ct: PDKSIDAISAN, kv: tmp4Arr[0] };
		}
		// //四带对
		// if(cards.length == 8){
		// 	if(tmp4Arr.length == 1 && tmp2Arr.length == 2){
		// 		return {ct:PDKSIDAIERDUI, kv:tmp4Arr[0]};
		// 	}else if(tmp4Arr.length == 2){
		// 		return {ct:PDKSIDAIERDUI, kv:tmp4Arr[1]};
		// 	}
		// }
		//飞机
		if (tmp3ArrX.length > 1) {
			// var tmp = this.is_shun(tmp3ArrX, false);			
			var tmp = this.is_shun(tmp3ArrX);
			if (tmp.result && cards.length == 5 * tmp3ArrX.length) { //飞机带对				
				return { ct: PDKFEIJI, kv: tmp.kv };
			}
			// 333 444 555 666 777 8
			//以下对 3/3/3/11/11/11/10/10/10/A 这种牌型做了适配，这种应该属于飞机
			if (cards.length == 5 * tmp3ArrX.length) {
				var tmp = this.is_shun(tmp3ArrX);
				if (tmp.result) {
					return { ct: PDKFEIJI, kv: tmp.kv };
				}
			} else {
				var length = cards.length / 5;
				if (length > 1 && length % 1 == 0 && length != tmp3ArrX.length) {
					for (j = 0; j < tmp3ArrX.length - length + 1; j++) {
						let cardsTmp: number[] = [];
						for (var k = 0; k < length; k++) {
							cardsTmp.push(tmp3ArrX[k + j]);
						}
						var tmp = this.is_shun(cardsTmp);
						if (tmp.result) {
							return { ct: PDKFEIJI, kv: tmp.kv };
						}
					}
				}
			}

			//以下对 333 444 555 666 + 999 10 / 9 10 J Q 这种牌型做了适配，这种应该属于飞机
			if (cards.length == 4 * tmp3ArrX.length) {
				var tmp = this.is_shun(tmp3ArrX);
				if (tmp.result) {
					return { ct: PDKFEIJI, kv: tmp.kv };
				}
			} else {
				var length = cards.length / 4;
				if (length > 1 && length % 1 == 0 && length != tmp3ArrX.length) {
					for (j = 0; j < tmp3ArrX.length - length + 1; j++) {
						let cardsTmp: number[] = [];
						for (var k = 0; k < length; k++) {
							cardsTmp.push(tmp3ArrX[k + j]);
						}
						var tmp = this.is_shun(cardsTmp);
						if (tmp.result) {
							return { ct: PDKFEIJI, kv: tmp.kv };
						}
					}
				}
			}

			var tmp = this.is_shun(tmp3ArrX);
			if (tmp.result) {
				// if (cards.length == 4 * (tmp3ArrX.length - 1)) { //飞机带单
				// 	return { ct: RunFastFEIJI, kv: tmp.kv };
				// }
				if (cards.length == 4 * (tmp3ArrX.length)) { //飞机带单					
					return { ct: PDKFEIJI, kv: tmp.kv };
				}
			}
		}
		//飞机或三顺
		if (tmp3Arr.length > 1) {
			var tmp = this.is_shun(tmp3Arr);
			if (tmp.result) {
				//飞机
				if (cards.length == 5 * tmp3Arr.length) {//3连飞机 333444555AABBCC
					//if((tmp3Arr.length == tmp2Arr.length + 2 * tmp4Arr.length)){//333444555AABBBB
					return { ct: PDKFEIJI, kv: tmp.kv };
					//}
				}
				//三顺
				if (tmp3Arr.length * 3 == cards.length) {
					return { ct: PDKSANSHUN, kv: tmp.kv };
				}
			}
		}
		//单顺
		if (tmp1Arr.length > 4 && cards.length == tmp1Arr.length) {
			var tmp = this.is_shun(tmp1Arr);
			console.log("PDKDANSHUN----tmp---111---->", tmp)
			if (tmp.result) {
				return { ct: PDKDANSHUN, kv: tmp.kv };
			}
			//特殊处理A2345
			// let indexOfA: number = tmp1Arr.indexOf(12);
			// let indexOf2: number = tmp1Arr.indexOf(13);
			// if (indexOfA != -1 && indexOf2 != -1) {
			// 	let tmpCards: number[] = tmp1Arr;
			// 	tmpCards.splice(indexOfA);
			// 	tmpCards.splice(indexOf2);
			// 	tmp = this.is_shun(tmpCards);
			// 	console.log("PDKDANSHUN----tmp---222---->", tmp)
			// 	if (tmp.result) {
			// 		if (tmp.kv - tmpCards.length == 0) {
			// 			return { ct: PDKDANSHUN, kv: tmp.kv };
			// 		}
			// 	}
			// }

			//特殊处理23456
			// if (indexOf2 != -1) {
			// 	let tmpCards: number[] = tmp1Arr;
			// 	tmpCards.splice(indexOf2);
			// 	tmp = this.is_shun(tmpCards);
			// 	console.log("PDKDANSHUN----tmp---333---->", tmp)
			// 	if (tmp.result) {
			// 		if (tmp.kv - tmpCards.length == 0) {
			// 			return { ct: PDKDANSHUN, kv: tmp.kv };;
			// 		}
			// 	}
			// }
		}

		//双顺
		if (tmp2Arr.length >= 2 && tmp2Arr.length * 2 == cards.length) {
			var tmp = this.is_shun(tmp2Arr);
			if (tmp.result) {
				return { ct: PDKSHUANGSHUN, kv: tmp.kv };
			}
		}

		return { ct: 0, kv: 0 };
	}

	/**
	 * 选出给定数量的牌中可以出最大数量的牌型
	 */
	static getMaxNumType(pokerIds: number[]): number[] {
		let _cards: number[] = [];

		return _cards;
	}

	public PDKCardsType() {
	}
}