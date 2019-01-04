/**
 * Created by angleqqs 2018/08/08
 *
 * 比赛赛况&排名
 */

class PanelMatchDetail extends alien.PanelBase {
	private static _instance: PanelMatchDetail;
	public static get instance(): PanelMatchDetail {
		if (this._instance == undefined) {
			this._instance = new PanelMatchDetail();
		}
		return this._instance;
	}

	static T_DETAIL = 0;
	static T_RANK = 1;
	static lastSelected = 0;
	static roundCount = 6;

	private roundList: eui.List;
	private _roundProvider: eui.ArrayCollection;
	private _roundData;

	private listDetailContainer: eui.Scroller;

	private roundDetailList: eui.List;
	private _rounddetailProvider: eui.ArrayCollection;
	private _rounddetailData;

	private listRankContainer: eui.Scroller;

	private rankDetailList: eui.List;
	private _rankdetailProvider: eui.ArrayCollection;
	private _rankdetailData;

	private _matchid: number = 303;
	private _curRound: number = 1;
	private _curSelectedRound: number = 1;
	private _roundSelectedIdx: number = -1;
	private _unicode: number = 0;
	private _getRrankingData: any;
	private _localData: any;

	protected init(): void {
		this.skinName = panels.PanelMatchDetailSkin;
	}

	constructor() {
		super();

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
	}

	createChildren(): void {
		super.createChildren();

		this.roundList.dataProvider = this._roundProvider = new eui.ArrayCollection();
		this.roundList.itemRenderer = IRPanelMatchRoundTitItem;

		this.roundDetailList.dataProvider = this._rounddetailProvider = new eui.ArrayCollection();
		this.roundDetailList.itemRenderer = IRPanelMatchRoundDetailItem;

		this.rankDetailList.dataProvider = this._rankdetailProvider = new eui.ArrayCollection();
		this.rankDetailList.itemRenderer = IRPanelMatchRankDetailItem;

		alien.Utils.adaptScreenWH(this, true, true);
	}

	private _addClickListener(): void {
		let func = "addClickListener";
		this["closeImg"][func](this.clickClose, this);
		this["btnReward"][func](this._onClickReward, this);
		this["btnRefresh"][func](this.clickRefresh, this);
	}

	private clickClose() {
		super.close();
		alien.Dispatcher.instance.dispatchEventWith(EventNames.SHOW_GRP_MATCH_DETAIL)
	}

	private _onClickReward() {
		let _matchid = this._matchid;
		let matchConfig = GameConfig.getMatchConfigById(_matchid);
		PanelMatchIntro.instance.show(lang.match_title_reward_intro, matchConfig.reward);
	}

	private clickRefresh(): void {
		let _event = new egret.Event(egret.Event.CHANGE);
		_event.data = { target: this.roundList }
		this._onSelRound(_event);
	}

	protected _onAddToStage(): void {
		this._enableListeners(true);
	}

	protected _onRemovedToStage(): void {
		this._enableListeners(false);
	}

	private _enableListeners(bEnable: boolean) {
		let _func = "addEventListener";
		if (!bEnable) {
			_func = "removeEventListener";
		}

		this["detailGroup"][_func](egret.TouchEvent.TOUCH_TAP, this._onSelTab, this);
		this["rankingGroup"][_func](egret.TouchEvent.TOUCH_TAP, this._onSelTab, this);
		this.roundList[_func](egret.Event.CHANGE, this._onSelRound, this);

		this.listDetailContainer[_func](egret.Event.CHANGE, this._onListDetailScroll, this)
		this.listRankContainer[_func](egret.Event.CHANGE, this._onListRankScroll, this)

		server[_func](EventNames.USER_REDCOIN_RANKING_LIST_REP, this._onUserRedCoinRankingRep, this);
		server[_func](EventNames.USER_MATCH_SING_UP_INFO_REP, this._onMatchSignUpInfoRep, this);
		alien.Dispatcher[_func](EventNames.UPDATE_SELF_MATCH_RANK, this._onUpdataSelfMatchRank, this);

		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
	}

	private _onSelTab(e: egret.Event): void {
		let _name = e.target.name;
		console.log("_onSelTab---------->", e.target);
		let _type = PanelMatchDetail.T_DETAIL;
		switch (_name) {
			case "detailGroup":
				_type = PanelMatchDetail.T_DETAIL;
				break;
			case "rankingGroup":
				_type = PanelMatchDetail.T_RANK;
				break;
			default:
				_type = PanelMatchDetail.T_DETAIL;
		}
		this._showTabByType(_type, this._curRound);
	}

	private _onSelRound(evt: egret.Event): void {
		let _target = null;
		if (!evt.target) {
			if (!evt.data) {

			}
			else {
				_target = evt.data.target
			}
		}
		else {
			_target = evt.target
		}
		let list: eui.List = _target;
		let val = list.selectedItem;
		let _round = 1;
		if (!val || !val.index) {
			_round = 100;
		}
		else {
			_round = val.index;
		}
		console.log("_onSelRound------->", _round)
		let _optype = 1;
		if (PanelMatchDetail.lastSelected == PanelMatchDetail.T_DETAIL) {
			_optype = 2;
		}

		this._curSelectedRound = _round;

		if (_optype == 1) {
			this._toRankTop();
		}
		else if (_optype == 2) {
			this._toDetailTop();
		}
		this._unicode = Math.floor(Math.random() * 100000000)
		this._getRrankingData = null;

		let _nowTs = server.tsServer;
		if (!this._localData || !this._localData[_optype] || !this._localData[_optype][_round] || (_nowTs - this._localData[_optype][_round].getDataTs) > 5) {
			if (_round <= this._curRound) {
				server.sendRedcoinRankingListReq(_optype, this._matchid, _round, this._unicode);
			}
			if (_optype == 1) {
				if (!this._rankdetailProvider.source.length && _round <= this._curRound) {
					if (!this._localData || !this._localData[_optype] || !this._localData[_optype][_round]) {
					}
					else {
						this._rankdetailProvider.source = [].concat(this._localData[_optype][_round].slice(0, 5));
					}
				}
			}
			else if (_optype == 2) {
				if (!this._rounddetailProvider.source.length && _round <= this._curRound) {
					if (!this._localData || !this._localData[_optype] || !this._localData[_optype][_round]) {
					}
					else {
						this._rounddetailProvider.source = [].concat(this._localData[_optype][_round].slice(0, 5));
					}
				}
			}
		} else {
			console.log("_nowTs------>", _nowTs, this._localData[_optype][_round].getDataTs)
			if (_optype == 1) {
				this._rankdetailProvider.source = [].concat(this._localData[_optype][_round].slice(0, 5));
			}
			else if (_optype == 2) {
				this._rounddetailProvider.source = [].concat(this._localData[_optype][_round].slice(0, 5));
			}
		}

		if (_round > this._curRound) {
			if (_optype == 1) {
				this._rankdetailProvider.source = [];
			}
			else if (_optype == 2) {
				this._rounddetailProvider.source = [];
			}
		}

		for (let i = 0; i < this._roundProvider.length; i++) {
			let item = this._roundProvider.getItemAt(i);
			if (item.index == _round) {
				item.sel = true;
			}
			else {
				item.sel = false;
			}
			this._roundProvider.itemUpdated(item);
		}

		if (_round == 100) {
			this._roundSelectedIdx = -1;
		}
		else {
			this._roundSelectedIdx = _round;
		}
	}

	private _toDetailTop(): void {
		this.listDetailContainer.stopAnimation();
		this.listDetailContainer.viewport.scrollV = 0;
	}

	private _onListDetailScroll(e: egret.Event): void {
		let offsetY = this.listDetailContainer.viewport.scrollV + this.listDetailContainer.height;
		if (offsetY >= this.listDetailContainer.viewport.contentHeight) {
			let hasLen = this._rounddetailProvider.source.length;
			let totLen = this._localData[2][this._curSelectedRound].length;
			if (hasLen < this._rounddetailData.length) {
				let _endIdx = hasLen + 4;
				if (_endIdx > totLen + 1) {
					_endIdx = totLen + 1;
				}
				this._rounddetailProvider.source = this._rounddetailProvider.source.concat(this._localData[2][this._curSelectedRound].slice(hasLen, _endIdx));
			}
		}
	}

	private _toRankTop(): void {
		this.listRankContainer.stopAnimation();
		this.listRankContainer.viewport.scrollV = 0;
	}

	private _onListRankScroll(e: egret.Event): void {
		let offsetY = this.listRankContainer.viewport.scrollV + this.listRankContainer.height;
		if (offsetY >= this.listRankContainer.viewport.contentHeight) {
			let hasLen = this._rankdetailProvider.source.length;
			// let totLen = this._rankdetailData.length;
			let totLen = this._localData[1][this._curSelectedRound].length;
			if (hasLen < this._rankdetailData.length) {
				let _endIdx = hasLen + 5;
				if (_endIdx > totLen + 1) {
					_endIdx = totLen + 1;
				}
				this._rankdetailProvider.source = this._rankdetailProvider.source.concat(this._localData[1][this._curSelectedRound].slice(hasLen, _endIdx));
			}
		}
	}

	private _onUserRedCoinRankingRep(evt: egret.Event): void {
		let _roundData = evt.data;
		let _idx = 1;
		let _unicode = _roundData.unicode;
		if (_unicode == this._unicode) {
			if (!this._getRrankingData) {
				this._getRrankingData = _roundData;
			}
			else {
				if (_roundData.optype == 1) {
					this._getRrankingData.list = this._getRrankingData.list.concat(_roundData.list);
				}
				else if (_roundData.optype == 2) {
					this._getRrankingData.glist = this._getRrankingData.glist.concat(_roundData.glist);
				}
			}
		}

		if (!_roundData || !_roundData.round) {

		}
		else {
			_idx = _roundData.round
		}

		let _optype = 1;
		if (!_roundData || !_roundData.optype) {

		}
		else {
			_optype = _roundData.optype;
		}

		if (_optype == 1) {
			if (_idx > 0 && _idx <= PanelMatchDetail.roundCount) {
				this._showRoundList(_idx, this._getRrankingData);
			}
		}
		else if (_optype == 2) {
			this._showRoundList(_idx, this._getRrankingData);
		}
	}

	private _onMatchSignUpInfoRep(evt: egret.Event): void {
		let data: any = evt.data;
		console.log("_onMatchSignUpInfoRep----------->", data);
		if (this._matchid != data.matchid) return;
		this._curRound = data.round;
		if (!this._curRound) this._curRound = 1;
		let type = PanelMatchDetail.T_DETAIL;
		this._showTabByType(type, this._curRound);
	}

	private _onUpdataSelfMatchRank(evt: egret.Event): void {
		this.refreshSelfInfo();
	}

	private _showTabByType(type, round) {
		let _ins = PanelMatchDetail;
		switch (type) {
			case _ins.T_DETAIL:
				this._showDetail(round);
				break;
			case _ins.T_RANK:
				this._showRank(round);
				break;
			default:
				this._showDetail(round);
		}
	}

	private _showDetail(round): void {
		PanelMatchDetail.lastSelected = PanelMatchDetail.T_DETAIL;
		this.currentState = "detail";
		this._toDetailTop();
		this.refreshRoundList(true, round);
	}

	private _showRank(round): void {
		PanelMatchDetail.lastSelected = PanelMatchDetail.T_RANK;
		this.currentState = "ranking";
		this._toRankTop();
		this.refreshRoundList(false, round);
	}

	private showFRBtn(bShow): void {
		this["btnFinalRank"].visible = bShow;
	}

	private refreshSelfInfo(_rankdata = null, _final: boolean = false): void {
		// { "uid": 107348, "score": -313, "ranking": 12, "nickname": "5qyn5rSy5bCP6ZWH", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa3923.jpg", "round": 2 }],
		let data = _rankdata;
		console.log("refreshSelfInfo------->", data);
		let _rank = GameConfig._curMatchRank;
		if (!_rank) {
			this['lblSelfRank'].text = ""
		}
		else {
			this['lblSelfRank'].text = "您已完成比赛，暂列" + GameConfig._curMatchRank + "名"
		}
	}

	private refreshRoundList(isRound: boolean = true, round) {
		this._roundData = [];
		let data = [];
		for (let i = 0; i < PanelMatchDetail.roundCount; i++) {
			let _idx = (i + 1);
			let _round = (i + 1);
			let item = { index: _idx, round: _round };
			data.push(item);
		}

		if (data) {
			for (var i = 0; i < data.length; i++) {
				if (i == 0 && (isRound || (!isRound && data.length < PanelMatchDetail.roundCount))) {
					data[i].sel = true;
				} else {
					data[i].sel = false;
				}
				this._roundData.push(data[i]);
			}
		}

		this._roundProvider.source = this._roundData;
		console.log("refreshRoundList--------->", round, data, isRound, data.length)

		let _event = new egret.Event(egret.Event.CHANGE);
		let selectedRound = (round - 1)
		if (!selectedRound) selectedRound = 0;
		this.roundList.selectedIndex = selectedRound;
		_event.data = { target: this.roundList }
		this._onSelRound(_event);
	}

	private _showRoundList(idx, rounddata): void {
		console.log("_showRoundList------->", idx, rounddata, this._getRrankingData)
		if (idx > 0) {
			if (PanelMatchDetail.lastSelected == PanelMatchDetail.T_DETAIL) {
				this._showRoundDetailList(idx, rounddata);
			}
			else if (PanelMatchDetail.lastSelected == PanelMatchDetail.T_RANK) {
				this._showRankDetailList(idx, rounddata);
			}
		}
	}

	private _showRoundDetailList(index = 1, rounddata = null) {
		console.log("_showRoundDetailList------------->", index, rounddata);
		if (!rounddata || index != this._curSelectedRound) return;
		this._rounddetailData = [];
		let data = [];
		let params = rounddata;
		/*
				params = {
					"optype": 2,
					"list": [],
					"glist": [
						{
							"round": "1",
							"players": [
								{ "uid": 107344, "score": -192, "ranking": null, "nickname": "6IyE5a2Q54Ok57Gz57KJ", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa5317.jpg", "round": 2 },
								{ "uid": 107347, "score": -195, "ranking": null, "nickname": "6aWt6I+cZmVs", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa3830.jpg", "round": 2 },
								{ "uid": 107345, "score": -213, "ranking": null, "nickname": "5rW35LiA55m9", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa665.jpg", "round": 2 }
							]
						},
						{
							"round": "1",
							"players": [
								{ "uid": 107357, "score": 9, "ranking": null, "nickname": "5qKm6JC96Jip6Iqx", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa677.jpg", "round": 2 },
								{ "uid": 107353, "score": 9, "ranking": null, "nickname": "5Yi35aSc", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa4573.jpg", "round": 2 },
								{ "uid": 120065, "score": -18, "ranking": null, "nickname": "MTIzMTI0", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/head2.png", "round": 2 }
							]
						},
						{
							"round": "1",
							"players": [
								{ "uid": 107343, "score": -277, "ranking": null, "nickname": "5oiR54ix5aaH5Lqn56eR", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa2085.jpg", "round": 2 },
								{ "uid": 107348, "score": -313, "ranking": null, "nickname": "5qyn5rSy5bCP6ZWH", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa3923.jpg", "round": 2 },
								{ "uid": 107349, "score": -310, "ranking": null, "nickname": "55av5YmR", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa5322.jpg", "round": 2 }
							]
						},
						{
							"round": "1",
							"players": [
								{ "uid": 107346, "score": -202, "ranking": null, "nickname": "5ra16I+xbw==", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa4950.jpg", "round": 2 },
								{ "uid": 107355, "score": -208, "ranking": null, "nickname": "5Yaw5b+D5b6u5bCY", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa5328.jpg", "round": 2 },
								{ "uid": 107351, "score": -190, "ranking": null, "nickname": "5LiD5a6X572qMTk=", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa2069.jpg", "round": 2 }
							]
						}],
					"round": 1,
					"matchid": 303
			}*/
		let _glistLen = 0;
		if (!params || !params.glist || !params.glist.length) {
			_glistLen = 0;
		}
		else {
			_glistLen = params.glist.length
		}
		this.refreshSelfInfo()
		for (let i = 0; i < _glistLen; i++) {
			let itemData = params.glist[i];
			let _players = [];
			let _round = 0;
			for (let j = 0; j < itemData.players.length; j++) {
				let playerdata = itemData.players[j];

				if (playerdata.uid == server.uid) {
					this.refreshSelfInfo(playerdata);
				}
				let _imgid = playerdata.imageid;
				let _nickName = playerdata.nickname;
				//  Base64.decode(playerdata.nickname)
				let _score = playerdata.score;
				let _uid = playerdata.uid;
				_round = playerdata.round;
				let _playrinfo = { imgid: _imgid, nickname: _nickName, score: _score, round: _round, uid: _uid }
				_players.push(_playrinfo);
			}

			let item = { players: _players, round: _round }
			data.push(item);
		}

		data.sort((r1: any, r2: any) => {
			return r1.round - r2.round;
		});

		if (data) {
			for (let i = 0; i < data.length; i++) {
				this._rounddetailData.push(data[i]);
			}
		}

		if (!this._localData) {
			this._localData = {
				1: [],
				2: []
			};
		}
		this._localData[2][index] = this._rounddetailData;
		this._localData[2][index].getDataTs = server.tsServer;

		// if (!this._rounddetailData.length && index <= this._curRound) {
		// 	this._rounddetailProvider.source = [];
		// }
		// else {
		console.log("_showRoundDetailList------sorted---data------->", data);
		this._rounddetailProvider.source = [].concat(this._rounddetailData.slice(0, 5));
		// }
	}

	private _showRankDetailList(index = 1, rounddata = null) {
		console.log("_showRankDetailList------------->", index, rounddata);
		if (!rounddata || index != this._curSelectedRound) return;
		this._rankdetailData = [];
		let data = [];

		let params = rounddata;
		/*
				let _fakeListData = [];
				for (let i = 0; i < 600 - index * 100 + 1; i++) {
					let _uid = (120065 + i);
					let _score = i;
					let _ranking = (i + 1);
					let _nickName = Base64.encode("test" + (65 + i));
					let _imageid = "https://pl-ddz.hztangyou.com/uploads/avatar/head2.png";
					let _round = (i % PanelMatchDetail.roundCount) + 1;
					let _item = { "uid": _uid, "score": _score, "ranking": _ranking, "nickname": _nickName, "imageid": _imageid, "round": _round };
					_fakeListData.push(_item);
				}
				params = {
					"optype": 1,
					"list": [
						{ "uid": 107353, "score": 9, "ranking": 1, "nickname": "5Yi35aSc", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa4573.jpg", "round": 2 },
						{ "uid": 107357, "score": 9, "ranking": 2, "nickname": "5qKm6JC96Jip6Iqx", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa677.jpg", "round": 2 },
						{ "uid": 120065, "score": -18, "ranking": 3, "nickname": "MTIzMTI0", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/head2.png", "round": 2 },
						{ "uid": 107351, "score": -190, "ranking": 4, "nickname": "5LiD5a6X572qMTk=", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa2069.jpg", "round": 2 },
						{ "uid": 107344, "score": -192, "ranking": 5, "nickname": "6IyE5a2Q54Ok57Gz57KJ", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa5317.jpg", "round": 2 },
						{ "uid": 107347, "score": -195, "ranking": 6, "nickname": "6aWt6I+cZmVs", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa3830.jpg", "round": 2 },
						{ "uid": 107346, "score": -202, "ranking": 7, "nickname": "5ra16I+xbw==", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa4950.jpg", "round": 2 },
						{ "uid": 107355, "score": -208, "ranking": 8, "nickname": "5Yaw5b+D5b6u5bCY", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa5328.jpg", "round": 2 },
						{ "uid": 107345, "score": -213, "ranking": 9, "nickname": "5rW35LiA55m9", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa665.jpg", "round": 2 },
						{ "uid": 107343, "score": -277, "ranking": 10, "nickname": "5oiR54ix5aaH5Lqn56eR", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa2085.jpg", "round": 2 },
						{ "uid": 107349, "score": -310, "ranking": 11, "nickname": "55av5YmR", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa5322.jpg", "round": 2 },
						{ "uid": 107348, "score": -313, "ranking": 12, "nickname": "5qyn5rSy5bCP6ZWH", "imageid": "https://pl-ddz.hztangyou.com/uploads/avatar/txa3923.jpg", "round": 2 }],
					"glist": [],
					"round": 1,
					"matchid": 303
				}
				params.list = _fakeListData;
				params.round = index;
		*/
		let rankdata = [];

		let _listLen = 0;
		if (!params || !params.list || !params.list.length) {
			_listLen = 0;
		}
		else {
			_listLen = params.list.length
		}

		for (let i = 0; i < _listLen; i++) {
			let item = params.list[i];
			if (params.round == index) {
				rankdata.push(item);
			}
		}
		this.refreshSelfInfo()
		for (let i = 0; i < rankdata.length; i++) {
			let itemdata = rankdata[i];
			if (itemdata.uid == server.uid) {
				this.refreshSelfInfo(itemdata);
			}
			let _rank = itemdata.ranking;
			let _imgid = itemdata.imageid
			let _nickname = itemdata.nickname
			// Base64.decode(itemdata.nickname)
			let _score = itemdata.score;
			if (!_score) _score = 0;
			let _round = itemdata.round;
			let item = { rank: _rank, imgid: _imgid, nickname: _nickname, score: _score, round: _round };
			data.push(item);
		}

		data.sort((r1: any, r2: any) => {
			return r1.rank - r2.rank;
		});

		if (data) {
			for (var i = 0; i < data.length; i++) {
				if (i % 2 == 1) {
					data[i].bgVisible = false;
				} else {
					data[i].bgVisible = true;
				}
				this._rankdetailData.push(data[i]);
			}
		}

		if (!this._localData) {
			this._localData = {
				1: [],
				2: []
			};
		}

		this._localData[1][index] = this._rankdetailData;
		this._localData[1][index].getDataTs = server.tsServer;

		// if (!this._rankdetailData.length && index <= this._curRound) {
		// 	this._rankdetailProvider.source = [];
		// } else {
		this._rankdetailProvider.source = [].concat(this._rankdetailData.slice(0, 5));
		// }
	}

	private getRewardData(rank, reward) {
		let data = reward;
		data.sort((r1: any, r2: any) => {
			return r1.rankstart - r2.rankstart;
		});

		for (let i = 0; i < data.length; i++) {
			if (rank >= data[i].rankstart && rank <= data[i].rankend) {
				let _reward = data[i].reward.split(":")
				return _reward;
			}
		}
		return null;
	}

	show(matchid: number = 303): void {
		// matchid = 303;
		console.log("PanelMatchDetail--------->", matchid, server.roomInfo);
		this.popup();
		this._addClickListener();
		this._matchid = matchid;
		this._unicode = 0;
		this._getRrankingData = null;
		server.getMatchSignUpInfo(this._matchid)

		let matchinfo = GameConfig.getRoomConfigByMatchId(matchid);
		if (!matchinfo || !matchinfo.stage || !matchinfo.stage.length || !matchinfo.stage[0].roundPlayer || !matchinfo.stage[0].roundPlayer.length) {

		}
		else {
			PanelMatchDetail.roundCount = matchinfo.stage[0].roundPlayer.length - 1;
		}
	}
}

/**
 * 赛况的每个标签
 */
class IRPanelMatchTabTitItem extends eui.ItemRenderer {
	private rootGrp: eui.Group;
	private radioBtn: eui.RadioButton;
	private iconCost: eui.Image;

	createChildren(): void {
		super.createChildren();
	}

	protected dataChanged(): void {
		super.dataChanged();
		let data = this.data;
		this.radioBtn.value = data.id;
		this.radioBtn.label = data.name;
		this.radioBtn.selected = data.sel;
	}
}
window["IRPanelMatchTabTitItem"] = IRPanelMatchTabTitItem;

/**
 * 轮次的每个标签
 */
class IRPanelMatchRoundTitItem extends eui.ItemRenderer {
	private lblRound: eui.Label;
	private imgSelect: eui.Image;

	createChildren(): void {
		super.createChildren();
	}

	protected dataChanged(): void {
		super.dataChanged();
		let _data = this.data;

		this.lblRound.text = (_data.round < PanelMatchDetail.roundCount ? _data.round + "轮" : "决赛");
		this.lblRound.textColor = (_data.sel ? 0xd5652e : 0x874a19);
		this.imgSelect.visible = (_data.sel ? true : false);
	}
}
window["IRPanelMatchRoundTitItem"] = IRPanelMatchRoundTitItem;


class IRPanelMatchRoundDetailItem extends eui.ItemRenderer {
	private imgBg: eui.Image;

	private player1: MatchDetailRoundAvatar;
	private player2: MatchDetailRoundAvatar;
	private player3: MatchDetailRoundAvatar;

	private lblPro: eui.Label;
	private lblStatus: eui.Label;

	private countDownTimer;

	createChildren(): void {
		super.createChildren();
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
	}

	private _onRemovedToStage(): void {
		this._clearInterval();
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
	}

	private _clearInterval() {
		if (this.countDownTimer) {
			egret.clearInterval(this.countDownTimer);
		}
		this.countDownTimer = null;
	}

	protected dataChanged(): void {
		super.dataChanged();
		let _data = this.data;
		// this.lblPro.text = (_data.pro < PanelMatchDetail.roundCount ? "第" + _data.pro + "/" + PanelMatchDetail.roundCount + "局" : "");
		let _round = _data.round;
		let _matchid = server.roomInfo.matchId;
		let _matchcfg = GameConfig.getRoomConfigByMatchId(_matchid);
		let _handCount = 0;
		if (!_matchcfg || !_matchcfg.stage || !_matchcfg.stage.length || !_matchcfg.stage[0].handCount) {
		}
		else {
			_handCount = _matchcfg.stage[0].handCount;
		}

		if (_data && _data.players.length) {
			for (let i = 0; i < _data.players.length; i++) {
				let _player = _data.players[i];
				this["player" + (i + 1)].imageId = _player.imgid;
				this["player" + (i + 1)].nickName = Base64.decode(_player.nickname);
				if (_round < _handCount) {
					this["player" + (i + 1)].score = "---"
				}
				else {
					let score = _player.score;
					if (!_player.score) score = 0;
					let value = (score > 0 ? "+" + Math.abs(score) : "-" + Math.abs(score));
					this["player" + (i + 1)].score = value;
				}
			}

			if (_data.players.length < 3) {
				for (let i = _data.players.length; i < 3; i++) {
					this["player" + (i + 1)].visible = false;
				}
			}
		}
		if (_round < _handCount) {
			this.lblStatus.text = "第" + _round + "/" + _handCount + "局"
		}
		else {
			this.lblStatus.text = "已结束";
		}
	}
}
window["IRPanelMatchRoundDetailItem"] = IRPanelMatchRoundDetailItem;

class IRPanelMatchRankDetailItem extends eui.ItemRenderer {

	private bgRect: eui.Image;
	private lblRank: eui.Label;
	private imgAvatar: eui.Image;
	private imgMask: eui.Image;
	private lblName: eui.Label;
	private lblScore: eui.BitmapLabel;
	private imgStatus: eui.Image;

	createChildren(): void {
		super.createChildren();
	}

	protected dataChanged(): void {
		super.dataChanged();
		let _data = this.data;
		this.bgRect.visible = _data.bgVisible;
		this.lblRank.text = _data.rank;
		this.imageId = _data.imgid;
		this.lblName.text = Base64.decode(_data.nickname);

		let _value = _data.score;

		let _matchid = server.roomInfo.matchId;
		let _matchcfg = GameConfig.getRoomConfigByMatchId(_matchid);
		let _handCount = 0;
		if (!_matchcfg || !_matchcfg.stage || !_matchcfg.stage.length || !_matchcfg.stage[0].handCount) {
		}
		else {
			_handCount = _matchcfg.stage[0].handCount;
		}

		if (_data.round < _handCount || Number(_value) <= 0) {
			this.lblScore.font = "font_match_2";
			if (_data.round < _handCount) {
				_value = "---";
			}
			else {
				_value = "-" + Math.abs(Number(_value));
			}
		}
		else {
			this.lblScore.font = "font_match_1";
			_value = "+" + Math.abs(Number(_value));
		}
		this.lblScore.text = _value;

		this.imgStatus.source = (_data.round < _handCount ? "match_result_playing" : "match_result_end");
		if (this.imgMask) {
			this.imgAvatar.mask = this.imgMask;
		}
	}

	set imageId(value: string) {
		let _url = value;
		if (!value) {
			this.imgAvatar.source = "common_avatar_mask";
		}
		else {
			if (value != this.imgAvatar.source) {
				this.imgAvatar.source = "common_avatar_mask";
				if (value.indexOf("http://") != -1) {
					_url = value.replace("http://", "https://");
				}
				let defaultAvatarsArr = [
					["https://pl-ddz.hztangyou.com/uploads/avatar/head1.png", "head1.png"],
					["https://pl-ddz.hztangyou.com/uploads/avatar/head2.png", "head2.png"],
					["https://pl-ddz.hztangyou.com/uploads/avatar/head3.png", "head3.png"],
					["https://pl-ddz.hztangyou.com/uploads/avatar/head4.png", "head4.png"],
					["https://pl-ddz.hztangyou.com/uploads/avatar/head5.png", "head5.png"],
					["https://pl-ddz.hztangyou.com/uploads/avatar/head6.png", "head6.png"],
					["https://pl-ddz.hztangyou.com/uploads/avatar/head7.png", "head7.png"],
					["https://pl-ddz.hztangyou.com/uploads/avatar/head8.png", "head8.png"],
				];
				for (var i = 0; i < defaultAvatarsArr.length; i++) {
					if (_url == defaultAvatarsArr[i][0]) {
						_url = defaultAvatarsArr[i][1];
						break;
					}
				}
				this.imgAvatar.source = _url;
			}
		}
	}
}
window["IRPanelMatchRankDetailItem"] = IRPanelMatchRankDetailItem;