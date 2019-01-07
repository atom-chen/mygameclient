/**
 * Created by rockyl on 15/11/26.
 *
 * 我的位置
 */

class PDKMySeat extends PDKDDZSeat {
	private imgBar: eui.Image;
	private imgNoMatchCards: eui.Image;

	public grpRedcoin: eui.Group;
	/**
	 * 红包栏的背景按钮
	 */
	public redBgImg: eui.Image;
	/**
	 * 红包栏的兑
	 */
	public redExchangeImg: eui.Image;

	public lbRedCoin: eui.Label;
	public grpRecorder: eui.Group;
	setRedcoin(rcstr: string, enable: boolean): void {
		if (this.lbRedCoin) {
			this.lbRedCoin.text = rcstr;
			this.redBgImg.touchEnabled = enable;
		}
	}

	protected init(): void {
		super.init();
	}

	createChildren(): void {
		super.createChildren();
	}

	/**
	 * 不清理自己的信息
	 */
	clean(keepCards: boolean = false, cleanUserInfo: boolean = true): PDKSeat {
		this.imgNoMatchCards.visible = false;
		return super.clean(keepCards, false);
	}

	addCards(cardids: number[], animation: boolean = true, cleancards: boolean = false): void {
		if (cleancards) {
			this.handCardGroup.clean();
			// super.setstatus();
		}
		super.addCards(cardids);
		this.handCardGroup.addCards(cardids, animation);
	}

	/**
	 * 取消选牌
	 */
	cancelSelect(): void {
		this.ddzHandCardGroup.cancelSelect();
	}

	/**
	 * 获取选中的牌组
	 */
	getSelectPokerIds(): number[] {
		return this.ddzHandCardGroup.getSelectedCards();
	}

	/**
	 * 提示出牌
	 */
	help(): boolean {
		let canUse: boolean = this.ddzHandCardGroup.help();
		return canUse;
	}

	/**
	 * 检查牌型
	 * @param pokeIds
	 */
	checkType(pokeIds: number[]): boolean {
		return this.ddzHandCardGroup.checkType(pokeIds);
	}

	private _tweenNoMathCards: egret.Tween;
	/**
	 * 显示没有大过上家的牌
	 */
	showNoMatchCards(duration: number = 2000): void {
		this.imgNoMatchCards.visible = true;
		// this.setShowCardShadow(true);
		//this.imgNoMatchCards.alpha = 0;
		this._tweenNoMathCards = egret.Tween.get(this.imgNoMatchCards, null, null, true).to({ alpha: 1 }, 100).wait(duration).call(this.hideNoMathCards, this);
	}

	/**
	 * 隐藏没有大过上家的牌
	 */
	hideNoMathCards(): void {
		if (this._tweenNoMathCards) {
			this._tweenNoMathCards = null;
			egret.Tween.get(this.imgNoMatchCards, null, null, true).to({ alpha: 0 }, 100).call(() => {
				this.imgNoMatchCards.visible = false;
				// this.setShowCardShadow(false);
			});
		}
	}

	checkCanUse(): void {
		this.ddzHandCardGroup.checkCanUse();
	}
}