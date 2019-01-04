/**
 * Created by rockyl on 15/11/20.
 *
 * 牌体
 */

class CardBodyDzpk extends egret.DisplayObjectContainer {
	private _bg:egret.Bitmap;
	private _lab:egret.TextField;
	private _masterFlag:egret.Bitmap;

	private _poker:any;
	private _master:boolean;

	constructor() {
		super();

		this.init();
	}

	protected init():void {
	}

	initDzpkData(pid):void{
		this._master = false;
		this.removeChildren();

		if (pid > 0) {
			this.addChild(this._bg = new egret.Bitmap(RES.getRes('poker_broad')));

			let poker:any = this._poker = Utils.pidDzpkpoker(pid);
	
			let numStr:string;
			switch (poker.num) {
				case 11:
					numStr = 'j';
					break;
				case 12:
					numStr = 'q';
					break;
				case 13:
					numStr = 'k';
					break;
				case 14:
					numStr = 'a';
					break;
				default:
					numStr = poker.num.toString();
			}
			let num:egret.Bitmap = new egret.Bitmap(RES.getRes('poker_' + poker.signColor + '_' + numStr));
			this.addChild(num);
			let signIcon:egret.Bitmap = new egret.Bitmap(RES.getRes('poker_sign_' + poker.sign));
			this.addChild(signIcon);

			num = new egret.Bitmap(RES.getRes('poker_' + poker.signColor + '_' + numStr));
			num.anchorOffsetX = num.x = num.width / 2;
			num.anchorOffsetY = num.y = num.height / 2;
			num.rotation = 180;
			this.addChild(num);
			signIcon = new egret.Bitmap(RES.getRes('poker_sign_' + poker.sign));
			signIcon.anchorOffsetX = signIcon.x = signIcon.width / 2;
			signIcon.anchorOffsetY = signIcon.y = signIcon.height / 2;
			signIcon.rotation = 180;
			this.addChild(signIcon);

			/*this._masterFlag = new egret.Bitmap(RES.getRes('icon_master_card'));
			this._masterFlag.scaleX = 1.7;
			this._masterFlag.scaleY = 1.7;
			this._masterFlag.x = 50;//85;
			this._masterFlag.y = 2;//4;
			this.addChild(this._masterFlag);
			*/
		}
	}

}