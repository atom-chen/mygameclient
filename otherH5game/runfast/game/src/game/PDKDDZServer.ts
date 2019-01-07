/**
 * Created by rockyl on 16/3/9.
 *
 * 继承的服务
 */

class PDKDDZServer extends PDKServer {
	protected beforeDispatchMessage(name: string, message: any): void {
		switch (name) {  //一些特殊处理的协议
			case PDKEventNames.GAME_SET_SESSION:
				if (this._session > 0 && this._session != message.session) {
					this.giveUpGame();
				}
				this.resetSession();
				break;
			case PDKEventNames.GAME_GAME_START_NTF:
				//PDKMainLogic.instance.alms();
				break;
		}

		super.beforeDispatchMessage(name, message);
	}

	/**
	 * @inheritDoc
	 */
	send(name: string, data: any): void {
		//如果协议名带有game,则会自动加上session字段
		if (!data.session && name.indexOf('game') >= 0) {
			// if (this._isInDDZ && this._isReconnected && this._reconnectedSession) {
			// 	data.session = this._reconnectedSession;
			// } else {
			data.session = this._session;
			// }
		}

		super.send(name, data);
	}

	setCards(cardids): void {
		this.send(PDKEventNames.GAME_SET_CARDS, {
			seatid: 0,
			cardids: cardids,
		});
	}

	/**
	 * 快速加入
	 */
	quickJoin(): void {
		this.send(PDKEventNames.USER_QUICK_JOIN_REQUEST, { roomid: this.roomInfo.roomID, clientid: this._clientId });
	}

	/**
	 * 快速加入withflag
	 */
	quickJoinWithFlag(): void {
		this.send(PDKEventNames.USER_QUICK_JOIN_REQUEST, { roomid: this.roomInfo.roomID, clientid: this._clientId, flag: 1 });
	}

	/**
	 * 请求玩家信息
	 * @param uid
	 */
	userInfoRequest(uid: number): void {
		this.send(PDKEventNames.USER_USER_INFO_REQUEST, { uid });
	}

	/**
	 * 请求游戏中的玩家信息
	 * @param uid
	 */
	getUserInfoInGame(uid: number): void {
		this.send(PDKEventNames.GAME_USER_INFO_IN_GAME_REQ, { uid });
	}

	CreatePersonalGameReq(gameid: number, bscore: number, maxround: number, maxodd: number, minscore: number, cost: number = 0): void {
		this.send(PDKEventNames.CREATE_PERSONAL_GAME_REQ, { gameid: gameid, bscore: bscore, maxround: maxround, maxodd: maxodd, minscore: minscore, cost: cost });
	}

	JoinPGameReq(roomid: number): void {
		this.send(PDKEventNames.JOIN_PGAME_REQ, { roomid: roomid });
	}

	StartPGameReq(roomid: number): void {
		this.send(PDKEventNames.START_PGAME_REQ, { roomid: roomid });
	}

	QueryRoomInfoReq(roomid: number): void {
		this.send(PDKEventNames.QUERY_ROOMINFO_REQ, { roomid: roomid });
	}

	QuitPGameReq(roomid: number): void {
		this.send(PDKEventNames.QUIT_PGAME_REQ, { roomid: roomid });
	}

	GameDissolve(roomid: number): void {
		this.send(PDKEventNames.GAME_DISSOLVE, { roomid: roomid });
	}

	ReconnectPGameReq(): void {
		this.send(PDKEventNames.RECONNECT_PGAME_REQ, {});
	}

	//    static CREATE_PERSONAL_GAME_REQ: string = "user.CreatePersonalGameReq";
	//    static JOIN_PGAME_REQ: string = "user.JoinPGameReq";
	//    static START_PGAME_REQ: string = "user.StartPGameReq";
	//    static QUERY_ROOMINFO_REQ: string = "user.QueryRoomInfoReq";
	//    static QUIT_PGAME_REQ: string = "user.QuitPGameReq";
	//    static GAME_DISSOLVE: string = "user.GameDissolve";
	//    static RECONNECT_PGAME_REQ: string = "user.ReconnectPGameReq";

	/**
	 * 地主叫分
	 * @param score
	 */
	answerMaster(score: number): void {
		this.send(PDKEventNames.GAME_ANSWER_MASTER, {
			score,
		})
	}

	/**
	 * 出牌
	 */
	useCardNtf(cardids: number[]): void {
		this.send(PDKEventNames.GAME_USE_CARD_NTF, {
			seatid: this.seatid,
			cardids,
			index: 0,
		});
	}

	/**
	 * 聊天
	 * @param content
	 */
	talk(content: string): void {
		this.send(PDKEventNames.GAME_TALK_NTF, {
			seatid: 0,
			msg: content
		});
	}

	/**
	 * 托管
	 * @param hang
	 */
	hang(hang: boolean): void {
		this.send(PDKEventNames.GAME_OPERATE_REQ, {
			optype: hang ? 1 : 0,
		});
	}

	gameOperate(optype: number, params: any = null): void {
		this.send(PDKEventNames.GAME_OPERATE_REQ, {
			optype: optype,
			params: params
		});
	}


	/**
	 * 请求房间人数
	 */
	getPlayersAmount(): void {
		this.send(PDKEventNames.USER_PLAYERS_AMOUNT_REQ, {
			game_id: PDKGameConfig.gameId,
		});
	}

	/**
	 * 修改用户信息
	 * @param data {nickname, sex, imageid}
	 */
	modifyUserInfo(data: any): void {
		this.send(PDKEventNames.USER_MODIFY_USER_INFO_REQ, data);
	}

	/**
	 * 离开房间
	 */
	giveUpGame(): void {
		this.send(PDKEventNames.GAME_GIVE_UP_GAME_REQ, {
			status: 0
		});
	}

	/**
	 * 退出匹配队列
	 */
	QuitWaitingQueueReq(): void {
		this.send(PDKEventNames.QUIT_WAITING_QUEUE_REQ, {});
	}

	/**
	 * 请求比赛报名状态
	 * @param matchid
	 */
	getMatchSignUpInfo(matchid: number): void {
		this.send(PDKEventNames.USER_MATCH_SING_UP_INFO_REQ, { matchid });
	}

	/**
	 * 比赛报名
	 * @param matchid
	 * @param optype 1:报名 2:取消报名
	 * @param itemid
	 */
	matchSignUp(matchid: number, optype: number, itemid: number = 0): void {
		this.send(PDKEventNames.USER_MATCH_SING_UP_REQ, { matchid, optype, itemid });
	}

	/**
	 * 进入比赛
	 */
	enterMatch(matchid: number): void {
		this.send(PDKEventNames.USER_ENTER_MATCH_REQ, {
			matchid,
			clientid: this._clientId,
		});
	}

	/**
	 * 放弃比赛
	 * @param matchid
	 */
	giveUpMatch(matchid: number): void {
		this.send(PDKEventNames.USER_GIVE_UP_MATCH_REQ, {
			matchid,
			clientid: this._clientId,
		});
	}

	/**
	 * 获取背包信息
	 */
	getBagInfo(): void {
		this.send(PDKEventNames.USER_BAG_INFO_REQ, {});
	}

	/**
	 * 请求救济金
	 */
	GetFreshManReward(): void {
		this.send(PDKEventNames.GET_FRESHMAN_REWARD_REQ, {});
	}


	/**
	 * 请求救济金
	 */
	alms(): void {
		this.send(PDKEventNames.USER_ALMS_REQ, {});
	}

	/**
	 * 发送准备请求
	 */
	getReady(): void {
		this.send(PDKEventNames.GAME_GET_READY_REQ, {});
	}
	/**
	 * 发送红包兑换请求
	 */
	redcoinExchangeGoodsReq(idx: number): void {
		this.send(PDKEventNames.USER_REDCOIN_EXCHANGE_GOODS_REQ, { index: idx });
	}
	/**
	 * 钻石兑换请求
	 */
	diamondExchangeGoodsReq(id: number): void {
		this.reqUserOperate(1, [id]);
	}

	/**
	 * 发送抽红包请求
	 */
	lotteryRedCoinReq(roomid: number): void {
		let roomCfg = PDKGameConfig.getRoomConfigById(roomid);
		console.log("lotteryRedCoinReq----------->", roomCfg);
		if (roomCfg.style == "diamond") {
			if (!roomCfg.rewardwinround) {
				this.send(PDKEventNames.USER_LOTTERY_RED_COIN_REQ, { roomid: roomid, optype: 2 });
			}
			else {
				this.send(PDKEventNames.USER_LOTTERY_RED_COIN_REQ, { roomid: roomid, optype: 4 });
			}
		}
		else {
			this.send(PDKEventNames.USER_LOTTERY_RED_COIN_REQ, { roomid: roomid });
		}
	}
    /**
	 * 签到
	 */
	getSignReward(): void {
		this.send(PDKEventNames.USER_DAY_SIGN_IN_REQ, { optype: 2 });
	}

    /**
	 * 获取签到信息
	 */
	getSignInInfo(): void {
		this.send(PDKEventNames.USER_DAY_SIGN_IN_REQ, { optype: 1 });
	}

    /**
     * 获取红包榜单
     */
	getRedcoinRankingListReq(): void {
		this.send(PDKEventNames.USER_REDCOIN_RANKING_LIST_REQ, {});
	}

	getCardsRecorderReward(): void {
		this.send(PDKEventNames.GET_CARDS_RECORDER_REWARD_REQ, {});
	}

	/**
	 * 发送喇叭消息
	 * // type 1 普通聊天 2 喇叭
	 */
	public sendHornMsg(_type: number, _msg: string): void {
		let type = _type;
		let msg = _msg;
		let data: any = { type, msg };
		this.send(PDKEventNames.USER_PAY_TO_CHAT_REQ, data);
	}

	/**
	 * 获取登录App的奖励
	 */
	public reqGetDownAppRew(): void {
		let data = { optype: 1 };
		pdkServer.send(PDKEventNames.USER_GET_REWARD_REQ, data);
	}

	/**
	 * 获取国庆登录奖励
	 */
	public reqNationalLoginRew(): void {
		let data = { optype: 2 };
		pdkServer.send(PDKEventNames.USER_GET_REWARD_REQ, data);
	}

	/**
	 * 获取国庆邀请玩家奖励
	 */
	public reqNationalInviteRew(): void {
		let data = { optype: 3 };
		pdkServer.send(PDKEventNames.USER_GET_REWARD_REQ, data);
	}

	/**
	 * 获取国庆活动的信息
	 */
	public reqNationalActInfo(): void {
		let data: any = { optype: 2 };
		this.send(PDKEventNames.USER_GET_ACTInfo_REQ, data);
	}

	/**
	 * 获取登录App奖励的信息
	 */
	public reqDownAppRewInfo(): void {
		let data = { optype: 1 };
		pdkServer.send(PDKEventNames.USER_GET_ACTInfo_REQ, data);
	}
	/**
	 * 加倍 1不加倍 2加倍
	 */
	public reqDouble(): void {
		let data = { optype: 7, params: [2] };
		pdkServer.send(PDKEventNames.GAME_OPERATE_REQ, data);

	}
	/**
	 * 不加倍 1不加倍 2加倍
	 */
	public reqNoDouble(): void {
		let data = { optype: 7, params: [1] };
		pdkServer.send(PDKEventNames.GAME_OPERATE_REQ, data);

	}
	/**
	 * 发送玩家没有在游戏中的一些操作（猜牌等）
	 */
	public reqUserOperate(optype, params): void {
		let data = { optype: optype, params: params }
		pdkServer.send(PDKEventNames.USER_OPERATE_REQ, data);
	}

	/**
	 * 玩家猜一局的地主牌
	 */
	public reqUserGuessNextCard(roomId, nOption): void {
		this.reqUserOperate(3, [nOption, roomId]);
	}

	/**
	 * 获取分享成功的奖励
	 */
	public reqShareSuccRew(): void {
		this.reqUserOperate(2, null);
	}

	/**
	 * 获取红包场抽红包剩余时间
	 */
	public reqRedNormalTime(): void {
		let data = { optype: 2 };
		pdkServer.send(PDKEventNames.USER_DiamondGame_REQ, data);
	}

	/**
	 * 获取红包场抽红包的金额
	 */
	public reqRedNormalMoney(): void {
		let data = { optype: 1 };
		pdkServer.send(PDKEventNames.USER_DiamondGame_REQ, data);
	}
	/**
	 * 领取新手红包奖励
	 */
	public reqNewPlayerGetDiamond(): void {
		let data = { optype: 3 };
		pdkServer.send(PDKEventNames.USER_DiamondGame_REQ, data);
	}

	/**
	 * 邮件的操作
	 * optype 0 获取邮件信息 1 获取奖励信息 2 修改邮件状态 (阅读) 3 获取未读邮件数量
	 */
	public reqMailOperate(optype: number, id: number): void {
		let data = { optype: optype, id: id };
		pdkServer.send(PDKEventNames.USER_MailOperate_REQ, data);
	}

	/**
	 * 获取邮件的附件奖励
	 */
	public reqMailGetRew(id: number): void {
		this.reqMailOperate(1, id);
	}

	/**
	 * 获取是否有感恩节活动资格
	 */
	public reqTanksQualifications(): void {
		this.reqUserOperate(4, null);
	}

	/**
	 * 比赛中的操作
	 */
	public reqMatchOperate(optype: number, matchid: number): void {
		let _data = { optype: optype, matchid: matchid };
		this.send(PDKEventNames.USER_MatchOperate_REQ, _data);
	}

	/**
	 * 比赛复活
	 */
	public reqMatchRevive(): void {
		this.reqMatchOperate(1, pdkServer.roomInfo.matchId);
	}

	//1任务 2首充 3 下载APP奖励 4 (感恩节)活动
	/**
	 * 新手玩家是点击任务
	 */
	public reqNewPlayerClickTask(): void {
		this.reqUserOperate(5, [1]);
	}

	/**
	 * 玩家是否点击过APP福利按钮
	 */
	public reqClickDownApp(): void {
		this.reqUserOperate(5, 3)
	}

	/**
	 * 玩家是否点击过首充活动按钮
	 */
	public reqClickFirstRecharge(): void {
		this.reqUserOperate(5, 2)
	}

	/**
	 * 玩家是否点击过感恩节活动按钮
	 */
	public reqClickThanksgiving(): void {
		this.reqUserOperate(5, 4)
	}

	/**
	 * 查询感恩节礼包购买次数
	 */
	public reqThanksBuyCounts(): void {
		this.reqUserOperate(4, null)
	}

	/**
	 * 查询感恩节活动签到信息
	 */
	public reqThanksSign(): void {
		this.reqUserOperate(6, null)
	}

	/**
	 * 获取每日福袋的奖励
	 */
	public reqGetDayFuDai(): void {
		this.reqUserOperate(7, null)
	}

	/**
	 * 通知服务器,由于服务器更新导致的充值失败
	 */
	public reqServerUpdateRechareErr(): void {
		this.reqUserOperate(8, null)
	}



	//跑得快协议 开始
	public sendPdkOutcard(cards: number[]): void {
		cards = PDKUtils.unTransformCards(cards);
		this.send(PDKEventNames.GAME_CTS_PDK_OUTCARD, {
			card: cards
		});
	}
	public sendPdkCardHolder(): void {
		this.send(PDKEventNames.GAME_CTS_PDK_CARD_HOLDER, {
		});
	}
	//跑得快协议 开始
}

let pdkServer = new PDKDDZServer();