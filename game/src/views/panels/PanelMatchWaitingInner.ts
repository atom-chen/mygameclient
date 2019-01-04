/**
 * Created by rockyl on 16/3/31.
 *
 * 比赛中等待其他桌结束
 */

class PanelMatchWaitingInner extends alien.PanelBase {
	private static _instance: PanelMatchWaitingInner;
	public static get instance(): PanelMatchWaitingInner {
		if (this._instance == undefined) {
			this._instance = new PanelMatchWaitingInner();
		}
		return this._instance;
	}

	public lab: eui.Label;

	private _tf: any[];
	private _wave: alien.Wave;

	protected init(): void {
		this.skinName = panels.PanelMatchWaitingInnerSkin;

		this._tf = alien.Utils.parseColorTextFlow(lang.match_get_in);
	}

	constructor() {
		super();

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
	}

	protected childrenCreated(): void {
		super.childrenCreated();

		this._wave = new alien.Wave(this.lab, 2000, function (t): any { return { alpha: 0.3 + (Math.sin(t) + 1) * 0.5 * 0.7 } }, 0, false);
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

		alien.Dispatcher[_func](EventNames.UPDATE_MATCH_TURN_INFO, this._onUpdateMatchTurnTurnInfo, this);

		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
	}

	show(nextPlayerCount: number = -1, type: number = 0, notFinishTableCnt: number = 0, playerInMatch: number = 0): void {
		console.log('PanelMatchWaitingInner.show:' + nextPlayerCount, type, notFinishTableCnt, playerInMatch);

		this.popup(null, false, { alpha: 0 });
		this.refrehPanel(nextPlayerCount, type, notFinishTableCnt, playerInMatch)
	}

	private refrehPanel(nextPlayerCount: number = -1, type: number = 0, notFinishTableCnt: number = 0, playerInMatch: number = 0): void {
		this["bg"].visible = false;
		this["bg2"].visible = false;
		if (!type) {
			if (nextPlayerCount < 0) {
				this.lab.text = lang.match_waiting_other_desk_2;
			} else {
				if (nextPlayerCount == 0) {//决赛
					this.lab.text = lang.match_waiting_other_desk_1;
				} else {
					this._tf[1].text = nextPlayerCount + '';
					this.lab.textFlow = this._tf;
				}
			}
		}
		else if (type == 1) {
			let match: MatchService = MatchService.instance;

			let _matchid = server.roomInfo.matchId;
			let _matchcfg = GameConfig.getRoomConfigByMatchId(_matchid);
			let _handCount = 0;
			if (!_matchcfg || !_matchcfg.stage || !_matchcfg.stage.length || !_matchcfg.stage[0].handCount) {
			}
			else {
				_handCount = _matchcfg.stage[0].handCount;
			}

			if (!match.currentTurn || !match.currentPlay || match.currentPlay >= _handCount) {
				this.close();
				return;
			}
			let _str = "第" + match.currentTurn + "轮第" + (match.currentPlay + 1) + "局即将开始...";
			this.lab.textFlow = (new egret.HtmlTextParser).parser(_str);
			this["bg"].visible = true;
		}
		else if (type == 2) {
			if (nextPlayerCount < 0) {
				this.lab.text = lang.match_waiting_other_desk_2;
			} else {
				if (nextPlayerCount == 0) {//决赛
					this.lab.text = lang.match_waiting_other_desk_1;
				} else {
					this._tf = alien.Utils.parseColorTextFlow(lang.match_get_in2);
					this._tf[1].text = playerInMatch + '';
					this._tf[3].text = nextPlayerCount + '';
					this._tf[5].text = notFinishTableCnt + '';
					this.lab.textFlow = this._tf;
				}
			}
			this["bg2"].visible = true;
		}

		this._wave.play();
	}

	private _onUpdateMatchTurnTurnInfo(evt: egret.Event): void {
		let _data = evt.data;
		console.log("_onUpdateMatchTurnTurnInfo------>", _data);
		this.refrehPanel(_data.nextPlayerCount, _data.type, _data.notFinishTableCnt, _data.playerInMatch)
	}

	close(): void {
		super.close();

		if (this._wave) {
			this._wave.stop();
		}
	}
}