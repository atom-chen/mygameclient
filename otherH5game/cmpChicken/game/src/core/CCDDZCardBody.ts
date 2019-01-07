/**
 * Created by rockyl on 15/11/20.
 *
 * 牌体
 */

class CCDDZCardBody extends egret.DisplayObjectContainer {
	private _bg: egret.Bitmap;
	private _lab: egret.TextField;
	private _masterFlag: egret.Bitmap;

	private _poker: any;
	private _master: boolean;

	constructor() {
		super();

		this.init();
	}

	protected init(): void {
	}

	initData(pid): void {
		this._master = false;
		this.removeChildren();
		if (pid > 0) {
			this.addChild(this._bg = new egret.Bitmap(RES.getRes('cc_poker_broad')));

			let poker: any = this._poker = CCDDZUtils.pid2poker(pid);
			if (poker.num > 13) {
				let joker: egret.Bitmap = new egret.Bitmap(RES.getRes('cc_poker_' + poker.signColor + '_joker'));
				this.addChild(joker);

				let icon: egret.Bitmap = new egret.Bitmap(RES.getRes('cc_poker_' + poker.signColor + '_joker_ddz_icon'));
				icon.x = 0;
				icon.y = 0;
				this.addChild(icon);
			} else {
				let numStr: string;
				switch (poker.num) {
					case 1:
						numStr = 'a';
						break;
					case 11:
						numStr = 'j';
						break;
					case 12:
						numStr = 'q';
						break;
					case 13:
						numStr = 'k';
						break;
					default:
						numStr = poker.num.toString();
				}

				let num: egret.Bitmap = new egret.Bitmap(RES.getRes('cc_poker_' + poker.signColor + '_' + numStr));
				this.addChild(num);
				let signIcon: egret.Bitmap = new egret.Bitmap(RES.getRes('cc_poker_sign_' + poker.sign));
				this.addChild(signIcon);

				num = new egret.Bitmap(RES.getRes('cc_poker_' + poker.signColor + '_' + numStr));
				num.anchorOffsetX = num.x = num.width / 2;
				num.anchorOffsetY = num.y = num.height / 2;
				num.rotation = 180;
				this.addChild(num);
				signIcon = new egret.Bitmap(RES.getRes('cc_poker_sign_' + poker.sign));
				signIcon.anchorOffsetX = signIcon.x = signIcon.width / 2;
				signIcon.anchorOffsetY = signIcon.y = signIcon.height / 2;
				signIcon.rotation = 180;
				this.addChild(signIcon);
			}

			this._masterFlag = new egret.Bitmap(RES.getRes('cc_icon_master_card'));
			this._masterFlag.scaleX = 1.7;
			this._masterFlag.scaleY = 1.7;
			this._masterFlag.x = 50;//85;
			this._masterFlag.y = 2;//4;
			this.addChild(this._masterFlag);
		}

		this.showMasterFlag(false);

		/*if(pid){
			this.addChild(this._lab = new egret.TextField());
			this._lab.size = 18;
			this._lab.textColor = 0x444444;
			this._lab.x = 8;
			this._lab.y = 150;
			this._lab.text = pid.toString();
		}else{
			console.log('遇到空牌!!!');
		}*/

	}

	private _rollOver: boolean = false;
	/**
	 * 划过状态
	 * @returns {boolean}
	 */
	get rollOver(): boolean {
		return this._rollOver;
	}

	set rollOver(value: boolean) {
		//console.log(this._poker);
		if (this._rollOver != value) {
			this._rollOver = value;
			let card: CCDDZCard = <CCDDZCard>this.parent.parent;
			if (!this._rollOver && card.isGray()) {
				return;
			}
			if (!!this._bg)
				this._bg.texture = RES.getRes('cc_poker_broad' + (this._rollOver ? '_h' : ''));
		}
	}

	setBgGray(bGray): void {
		if (!!this._bg)
			this._bg.texture = RES.getRes('cc_poker_broad' + (bGray ? '_h' : ''));
	}

	/**
	 * 设置地主牌
	 * @param visible
	 */
	showMasterFlag(visible: boolean): void {
		this._master = visible;
		if (this._masterFlag) {
			this._masterFlag.visible = visible;
		}
	}
}