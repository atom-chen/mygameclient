/**
 * Created by rockyl on 16/3/31.
 */

class PDKPanelNormalResult extends PDKalien.PDKPanelBase {
	private btnClose: eui.Button;
	private btnContinue: eui.Button;
	private labelFee: eui.Label;
	private imgWinBg: eui.Image;
	private imgWinFlag: eui.Image;
	private avatar1: PDKAvatar;
	private avatar2: PDKAvatar;
	private avatar3: PDKAvatar;
	private nick1: eui.Label;
	private nick2: eui.Label;
	private nick3: eui.Label;
	private lastcard1: eui.Label;
	private lastcard2: eui.Label;
	private lastcard3: eui.Label;
	private score1: eui.Label;
	private score2: eui.Label;
	private score3: eui.Label;
	private pochan1: eui.Image;
	private pochan2: eui.Image;
	private pochan3: eui.Image;

	private static _instance: PDKPanelNormalResult;
	public static get instance(): PDKPanelNormalResult {
		if (this._instance == undefined) {
			this._instance = new PDKPanelNormalResult();
		}
		return this._instance;
	}

	protected init(): void {
		this.skinName = panels.PanelNormalResultSkin;
	}

	constructor() {
		super(
			PDKalien.popupEffect.Scale, { withFade: true, ease: egret.Ease.backOut },
			PDKalien.popupEffect.Scale, { withFade: true, ease: egret.Ease.backIn }
		);
	}

	createChildren(): void {
		super.createChildren();
		this.scaleX = 0.8;
		this.scaleY = 0.8;
		this.verticalCenter = 40;
		this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnCloseTap, this);
		this.btnContinue.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnContinueTap, this);
	}

	private clickSwitch(): void {

	}

	private onBtnCloseTap(event: egret.TouchEvent): void {
		this.dealAction('close');
	}

	private onBtnContinueTap(event: egret.TouchEvent): void {
		this.dealAction('continue');
	}

	show(data: any, seats: any[], selfseat: number, callback: Function): void {
		this._callback = callback;
		for (var i = 0; i < 3; i++) {
			this["grpRank" + i].visible = false;
		}
		for (var i = 0, length = data.users.length; i < length; i++) {
			this["grpRank" + i].visible = true;
			let score: any = data.users[i];
			let seat: any = score.seatid;

			let ddzSeat: PDKDDZSeat = null;
			for (var j = 0; j < seats.length; j++) {
				if (seats[j].seatid == seat) {
					ddzSeat = seats[j];
				}
			}

			this['avatar' + (i + 1)].imageId = null;
			this['avatar' + (i + 1)].imageId = ddzSeat.userInfoData.imageid;
			this['nick' + (i + 1)].text = ddzSeat.userInfoData.nickname;
			this['lastcard' + (i + 1)].text = score.left_card + '';
			this['score' + (i + 1)].text = score.score + '';
			this.labelFee.text = '本局每人服务费' + score.table_fee;

			this['pochan' + (i + 1)].visible = (score.gold == '0');

			this['nick' + (i + 1)].textColor = (selfseat != seat ? 0x996600 : 0xFFE200);
			this['lastcard' + (i + 1)].textColor = (selfseat != seat ? 0x996600 : 0xFFE200);
			this['score' + (i + 1)].textColor = (selfseat != seat ? 0xFFFFFF : 0xFFE200);

			this['nick' + (i + 1)].stroke = (selfseat != seat ? 0 : 2);
			this['lastcard' + (i + 1)].stroke = (selfseat != seat ? 0 : 2);
			this['score' + (i + 1)].stroke = (selfseat != seat ? 0 : 2);

			if (selfseat == seat) {
				this.imgWinBg.source = score.score > 0 ? 'pdk_play_result_ying_bg' : 'pdk_play_result_shu_bg';
				if (score.is_outcard <= 0) {
					//被关
					this.imgWinFlag.source = 'pdk_play_result_beiguan';
				} else {
					if (score.score > 0) {
						//赢了
						let shuangguan: boolean = true;
						let guanpai: boolean = false;
						let fanguan: boolean = false;
						for (var k = 0; k < data.users.length; k++) {
							if (data.users[k].seatid == selfseat) continue;
							if (data.users[k].is_outcard <= 0) {
								if (data.users[k].seatid == data.first_out) {
									fanguan = true;
								} else {
									guanpai = true;
								}
							} else {
								shuangguan = false;
							}
						}
						if (shuangguan) {
							//双关
							this.imgWinFlag.source = 'pdk_play_result_shuangguan';
						} else if (fanguan) {
							//反关
							this.imgWinFlag.source = 'pdk_play_result_fanguan';
						} else if (guanpai) {
							//关牌
							this.imgWinFlag.source = 'pdk_play_result_guanpai';
						} else {
							if (score.left_card > 0) {
								//失败
								this.imgWinBg.source = 'pdk_play_result_shu_bg';
								this.imgWinFlag.source = 'pdk_play_result_shibai';
							} else {
								//胜利
								this.imgWinBg.source = 'pdk_play_result_ying_bg';
								this.imgWinFlag.source = 'pdk_play_result_shengli';
							}
						}
					} else {
						if (score.left_card > 0) {
							//失败
							this.imgWinBg.source = 'pdk_play_result_shu_bg';
							this.imgWinFlag.source = 'pdk_play_result_shibai';
						} else {
							//胜利
							this.imgWinBg.source = 'pdk_play_result_ying_bg';
							this.imgWinFlag.source = 'pdk_play_result_shengli';
						}
					}
				}
			}
		}

		this.popup();
	}
}