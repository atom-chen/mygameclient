/**
 * Created by angleqqs 2018/08/08
 *
 * 牌局结算
 */

class PanelMatchRoundResult extends alien.PanelBase {
	private static _instance: PanelMatchRoundResult;
	public static get instance(): PanelMatchRoundResult {
		if (this._instance == undefined) {
			this._instance = new PanelMatchRoundResult();
		}
		return this._instance;
	}

	private _resultList: eui.List;

	private _resultProvider: eui.ArrayCollection;
	private _resultData;

	private _getUserinfoCnt: number = 0;

	protected init(): void {
		this.skinName = panels.PanelMatchRoundResultSkin;
	}

	constructor() {
		super();

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
	}

	createChildren(): void {
		super.createChildren();
		this._resultList.dataProvider = this._resultProvider = new eui.ArrayCollection();
		this._resultList.itemRenderer = IRPanelMatchRoundResultItem;
		alien.Utils.adaptScreenWH(this, true, true);
	}

	private _addClickListener(): void {
		let func = "addClickListener";
		this["closeImg"][func](this.clickclose, this);
		this["btnCheckDetail"][func](this._onClickCheckDetail, this);
		this["btnConfirm"][func](this.clickclose, this);
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

		server[_func](EventNames.USER_USER_INFO_RESPONSE, this.onUserInfoInGameResponse, this);

		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
	}

	private clickclose() {
		super.close();
		alien.Dispatcher.instance.dispatchEventWith(EventNames.PANEL_MATCH_ROUND_RESULT_CLOSE)
		// PanelMatchDetail.instance.show(303);
	}

	private _onClickCheckDetail(evt: egret.TouchEvent): void {
		PanelMatchRoundResultDetail.instance.show(this._resultProvider.source);
	}

	/**
	 * 当收到用户信息
	 * userInfo
	 * @param event
	 */
	private onUserInfoInGameResponse(event: egret.Event): void {
		let data = event.data;

		let _source = this._resultProvider.source;
		let _len = _source.length;
		for (let i = 0; i < _len; ++i) {
			if (_source[i].uid == data.uid) {
				_source[i].nickname = Base64.decode(data.nickname);
				_source[i].imgid = data.imageid;
				this._resultProvider.itemUpdated(_source[i]);
			}
		}
		this._getUserinfoCnt++;
		if (this._getUserinfoCnt <= 2) {
			alien.Dispatcher.instance.dispatchEventWith(EventNames.REFRESH_ROUNDSCORE_INFO, false, this._resultProvider.source)
		}
	}

	private refreshData(params): void {
		this._resultData = [];
		console.log("refreshData----PanelMatchRoundResult---->", params)
		/*
		{"matchid":101,"clientid":1,"optype":104,"timeout":null,"params":[3,6,3],"rankInfo":[],"roundInfo":[],"resultInfo":[],"strreward":null,
		"roundscore":
		[{"nickname":null,"uid":106903,"params":[4,-1]},
		{"nickname":null,"uid":106901,"params":[4,-1]},
		{"nickname":null,"uid":120065,"params":[-8,0]}]}*/
		// params =
		// 	[{ "nickname": null, "uid": 106903, "params": [4, -1, 3, 12, -6, -9] },
		// 	{ "nickname": null, "uid": 106901, "params": [4, -1, 3, 12, -6, -9] },
		// 	{ "nickname": null, "uid": 120065, "params": [-8, 2, -6, -24, 12, 18] }];

		// params =
		// 	[
		// 	{ "nickname": null, "uid": 106901, "params": [4, -1, 3, 12, -6, -9] },
		// 	{ "nickname": null, "uid": 120065, "params": [-8, 2, -6, -24, 12, 18] }];
		let _roundscore = params;
		let data = [];
		if (!_roundscore || !_roundscore.length) return;
		for (let i = 0; i < _roundscore.length; i++) {
			let _uid = _roundscore[i].uid;
			let _scores = _roundscore[i].params;

			let item = { uid: _uid, scores: _scores, nickname: "", imgid: "" }
			data.push(item);
		}

		if (data) {
			for (var i = 0; i < data.length; i++) {
				let _item = data[i];
				console.log("_item--PanelMatchRoundResult------>", _item)
				if (_item._uid != server.uid) {
					if (!_item.uid) {

					}
					else {
						server.userInfoRequest(_item.uid);
					}
				}
				else {
					let userdata = MainLogic.instance.selfData;
					_item.nickname = userdata.nickname;
					_item.imgid = userdata.imageid;
				}
				this._resultData.push(_item);
			}
		}

		this._resultProvider.source = this._resultData;
	}

	show(_data = null): void {
		this.popup();
		this._addClickListener();
		this._getUserinfoCnt = 0;
		this.refreshData(_data);
	}
}

class IRPanelMatchRoundResultItem extends eui.ItemRenderer {

	private imgBg: eui.Image;
	private imgAvatar: eui.Image;
	private imgMask: eui.Image;
	private lblName: eui.Label;
	private lblMax: eui.Label;
	private lblScore: eui.BitmapLabel;

	protected dataChanged(): void {
		super.dataChanged();
		let data = this.data;
		let _nickname = "玩家姓名";
		if (data.nickname == "") {
			_nickname = "玩家姓名";
		}
		else {
			_nickname = data.nickname
		}
		this.lblName.text = data.nickname;
		if (data.imaid != "") {
			this.imageId = data.imgid;
		}

		if (this.imgMask) {
			this.imgAvatar.mask = this.imgMask;
		}

		let maxScore = -9999;
		let totalScore = 0;
		for (let i = 0; i < data.scores.length; i++) {
			let score = data.scores[i];
			if (!score) score = 0;
			maxScore = (maxScore > score ? maxScore : score);
			totalScore += score;
		}
		if (!maxScore || maxScore == -9999) {
			maxScore = 0;
		}
		this.lblMax.text = "单局最高：" + maxScore;
		if (!totalScore) {
			totalScore = 0;
		}
		this.lblScore.font = (totalScore > 0 ? "font_match_1" : "font_match_2")
		this.lblScore.text = (totalScore > 0 ? ("+" + Math.abs(totalScore)) : ("-" + Math.abs(totalScore)))
	}

	set imageId(value: string) {
		let _url = value;
		if (!value) {
			this.imgAvatar.source = "common_avatar_mask";
		}
		else {
			if (value != this.imgAvatar.source) {
				this.imgAvatar.source = "common_avatar_mask"
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

window["IRPanelMatchRoundResultItem"] = IRPanelMatchRoundResultItem;