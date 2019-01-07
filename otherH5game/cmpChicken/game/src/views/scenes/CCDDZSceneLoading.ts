/**
 * Created by rockyl on 15/12/25.
 *
 * 加载场景
 */

class CCDDZSceneLoading extends CCalien.CCDDZSceneBase {
	/**
	 * 描述
	 */
	private descLabel:eui.Label;

	/**
	 * 健康游戏忠告
	 */
	private noticeImg:eui.Image;

	/**
	 * 版权信息
	 */
	private copyRightImg:eui.Image;

	private static _instance:CCDDZSceneLoading;

	public static setLoadingText(sText:string):void{
		if(CCDDZSceneLoading._instance){
			CCDDZSceneLoading._instance.setDescText(sText);
		}
	}
	
	public constructor() {
		super();

		this.skinName = scenes.CCDDZSceneLoadingSkin;
	}
	
    protected createChildren():void
	{
	    super.createChildren();
	   	CCDDZSceneLoading._instance = this;
		this.showCopyRight(false);
	}

	/**
	 * 显示版号等信息
	 */
	public showCopyRight(bShow:boolean):void{
		this.copyRightImg.visible = bShow;
		this.noticeImg.visible = bShow;
	}

	/**
	 * 设置描述
	 */
	public setDescText(sText:string):void{
		this.descLabel.text = sText;
	}

	/**
	 * 重置描述
	 */
	public resetDesc():void{
		this.setDescText("加载中...");
	}

	beforeShow(params:any):void{
		this.showCopyRight(params.showCopyRight||false);
	}

	onHide():void{
	}
}
