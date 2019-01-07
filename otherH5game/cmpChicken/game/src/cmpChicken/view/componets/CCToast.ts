class CCToast extends eui.Component {
	private static _instance: CCToast;
	public static get instance(): CCToast {
		if (this._instance == undefined) {
			this._instance = new CCToast();
		}
		return this._instance;
	}

	private lblTips: eui.Label;

	protected init(): void {
		this.skinName = components.CCToastSKin;
	}

	constructor() {
		super();
		this.init();
	}

	createChildren(): void {
		super.createChildren();
	}

	// CCToast.instance.show(this, "道位摆放错误，系统已自动帮您调整。");

	show(parent, content, percent = null): void {
		if (parent.contains(this)) {
			parent.removeChild(this);
		}

		parent.addChild(this);
		this.x = parent.width / 2 - this.width / 2;
		this.y = parent.height / 2 - this.height / 2;
		if (percent) {
			this.x = parent.width * percent.x - this.width / 2;
			this.y = parent.height * percent.y - this.height / 2;
		}
		console.log("show--------->", parent.width, parent.height, this.width, this.height, this.x, this.y);

		this.lblTips.text = content;
		this.alpha = 0;
		egret.Tween.get(this, null, null, true).to({ alpha: 1 }, 300).wait(1500).to({ alpha: 0 }, 300).call(() => {
			if (parent.contains(this)) {
				parent.removeChild(this);
			}
		});
	}
}