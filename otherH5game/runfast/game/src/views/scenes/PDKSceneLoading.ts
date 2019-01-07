/**
 * Created by rockyl on 15/12/25.
 *
 * 加载场景
 */

class PDKSceneLoading extends PDKalien.SceneBase {
	/**
	 * 描述
	 */
	private descLabel: eui.Label;

	/**
	 * 健康游戏忠告
	 */
	private noticeImg: eui.Image;

	/**
	 * 版权信息
	 */
	private copyRightImg: eui.Image;

	private static _instance: PDKSceneLoading;

	public static setLoadingText(sText: string): void {
		if (PDKSceneLoading._instance) {
			PDKSceneLoading._instance.setDescText(sText);
		}
	}

	public constructor() {
		super();

		this.skinName = scenes.PDKSceneLoadingSkin;
	}

	protected createChildren(): void {
		super.createChildren();
		PDKSceneLoading._instance = this;
		this.showCopyRight(false);
	}

	/**
	 * 显示版号等信息
	 */
	public showCopyRight(bShow: boolean): void {
		this.copyRightImg.visible = bShow;
		this.noticeImg.visible = bShow;
	}

	/**
	 * 设置描述
	 */
	public setDescText(sText: string): void {
		this.descLabel.text = sText;
	}

	/**
	 * 重置描述
	 */
	public resetDesc(): void {
		this.setDescText("加载中...");
	}

	beforeShow(params: any): void {
		if (!params || !params.showCopyRight) {
			params = { showCopyRight: false }
		}
		this.showCopyRight(params.showCopyRight || false);
	}

	onHide(): void {
	}
}
