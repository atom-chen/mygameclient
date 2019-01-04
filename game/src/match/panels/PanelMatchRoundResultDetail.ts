/**
 * Created by angleqqs 2018/08/08
 *
 * 牌局结算详情
 */

class PanelMatchRoundResultDetail extends alien.PanelBase {
	private static _instance: PanelMatchRoundResultDetail;
	public static get instance(): PanelMatchRoundResultDetail {
		if (this._instance == undefined) {
			this._instance = new PanelMatchRoundResultDetail();
		}
		return this._instance;
	}

	private _detailList: eui.List;

	private _detailProvider: eui.ArrayCollection;
	private _detailData;

	protected init(): void {
		this.skinName = panels.PanelMatchRoundResultDetailSkin;
	}

	constructor() {
		super();

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
	}

	createChildren(): void {
		super.createChildren();
		this._detailList.dataProvider = this._detailProvider = new eui.ArrayCollection();
		this._detailList.itemRenderer = IRPanelMatchRoundResultDetailItem;
		// alien.Utils.adaptScreenWH(this, true, true);
	}

	private _addClickListener(): void {
		let _func = "addClickListener";
		this["closeImg"][_func](this.close, this);
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

		alien.Dispatcher[_func](EventNames.REFRESH_ROUNDSCORE_INFO, this.refresh, this);

		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
	}

	private refreshData(params): void {
		console.log("refreshData----------->", params)
		this._detailData = [];
		let data = [];
		let _roundData = params;
		if (!_roundData || !_roundData.length) return;
		for (let i = 0; i < _roundData.length; i++) {
			this["lblName" + (i + 1)].text = _roundData[i].nickname;
		}

		for (let i = _roundData.length; i < 3; i++) {
			this["lblName" + (i + 1)].text = "";
		}
		for (let i = 0; i < _roundData[0].scores.length; i++) {
			let _round = i + 1;
			let _score1 = _roundData[0].scores[i];
			let _score2 = _roundData[1].scores[i];
			let _score3 = 0;
			let _playerNum = _roundData.length;
			if (!_roundData[2]) {

			}
			else {
				_score3 = _roundData[2].scores[i];
			}
			let _bshow = (i % 2 == 0 ? true : false)
			let item = { round: _round, score1: _score1, score2: _score2, score3: _score3, bshow: _bshow, playernum: _playerNum };
			data.push(item);
		}
		if (data) {
			for (var i = 0; i < data.length; i++) {
				this._detailData.push(data[i]);
			}
		}

		this._detailProvider.source = this._detailData;
	}

	show(_data = null): void {
		this.popup();
		this._addClickListener();
		this.refreshData(_data);
	}

	refresh(evt: egret.Event): void {
		let _data = evt.data;
		console.log("refresh----------->", _data);
		this.refreshData(_data);
	}
}

class IRPanelMatchRoundResultDetailItem extends eui.ItemRenderer {

	private imgbg: eui.Image;
	private lblRound: eui.Label;
	private lblScore1: eui.Label;
	private lblScore2: eui.Label;
	private lblScore3: eui.Label;

	protected dataChanged(): void {
		super.dataChanged();
		let _data = this.data;
		this.imgbg.visible = _data.bshow;
		this.lblRound.text = _data.round;
		for (let i = 1; i <= _data.playernum; i++) {
			this["lblScore" + i].text = _data["score" + i];
		}
		for (let i = _data.playernum + 1; i <= 3; i++) {
			this["lblScore" + i].text = ""
		}
	}
}

window["IRPanelMatchRoundResultDetailItem"] = IRPanelMatchRoundResultDetailItem;