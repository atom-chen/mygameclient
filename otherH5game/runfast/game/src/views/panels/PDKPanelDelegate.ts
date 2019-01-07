/**
 * Created by zhu on 2017/11/21.
 * 推广活动
 */

class PDKPanelDelegate extends PDKalien.PDKPanelBase {
    private static _instance: PDKPanelDelegate;

	/**
	 * 每个标签的内容
	 */
	private info_label:eui.Label;

	/**
	 * 滚动容器
	 */
	private content_scroller:eui.Scroller;

	/**
	 * 复制客服微信号
	 */
	private wxCp_img:eui.Image;
	
	/**
	 * 复制微信公众号
	 */
	private publicCp_img:eui.Image;

	/**
	 * 内容的标题
	 */
	private noticeFlag_img:eui.Image;

	

	/**
	 * 顶层的group
	 */
	private infoGroup:eui.Group;

	
	
	constructor() {
		super();
	}

    init():void {
		this.skinName = panels.PDKPanelDelegateSkin;
	}
	
	createChildren():void {
		super.createChildren();
		this._initUI();
		this._initEvent();
		this._showDelegate();
	}

	/**
	 * 初始化事件
	 */
	private _initEvent():void{
		this._enableEvent(true);
		this.wxCp_img["addClickListener"](this._onClickCopyKeFuWX,this);
		this.publicCp_img["addClickListener"](this._onClickCopyPublicWX,this);
	
        //let e: PDKalien.PDKEventManager = PDKalien.PDKEventManager.instance;
		//e.registerOnObject(this,PDKalien.Dispatcher,PDKEventNames.HORN_TALK_RECORDS_CHANGE,this._onHornRecChange,this);
	}

	/**
	 * 初始化界面
	 */
	private _initUI():void{
	
	}

	/**
	 * 点击复制客服微信
	 */
	private _onClickCopyKeFuWX():void{
		let _copyString = PDKGameConfig.extendWX;
		PDKGameConfig.copyText(this,_copyString,"微信号(" + _copyString +")");
	}
	/**
	 * 点击复制公众号微信 
	 */
	private _onClickCopyPublicWX():void{
		PDKGameConfig.copyText(this,"三桂跑得快","公众号(三桂跑得快)");
	}
	/**
	 * 滚动到最上面
	 */
	private _onScrollTop():void{
		this.content_scroller.stopAnimation();
		this.content_scroller.viewport.scrollV = 0;
		this.content_scroller.viewport.validateNow();
	}

	/**
	 * 显示代理赚钱
	 */
	private _showDelegate():void{
		this._onScrollTop();
		this.info_label.text = "一大波福利正在袭来！！！";
		if(PDKalien.Native.instance.isNative){
			this.info_label.text = "奖励规则：\n    每邀请1个好友赢5局，得1个高级奖杯(游戏内抽取)。\r\n \r微信号:" + PDKGameConfig.extendWX;
		}

		this.content_scroller.scrollPolicyV = "off";
		this._showCopyWX(true);
		
		this.noticeFlag_img.source = "notice_delegate_tit";
	}


	/**
	 * 是否显示复制微信和复制公众号
	 */
	private _showCopyWX(bShow:boolean):void{
		this.wxCp_img.visible = bShow;
		this.publicCp_img.visible = bShow;
	}

	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
        PDKalien.PDKEventManager.instance.disableOnObject(this);
		PDKPanelDelegate._instance = null;
	}
	/**
	 * 使能 事件
	 */
	private _enableEvent(bEnable:boolean):void{
		let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
	}
	
	/**
	 * 获取推广单例
	 */
    public static getInstance(): PDKPanelDelegate {
        if(!PDKPanelDelegate._instance) {
            PDKPanelDelegate._instance = new PDKPanelDelegate();
        }
        return PDKPanelDelegate._instance;
    }

	/**
	 * 移除推广面板
	 */
	public static remove():void{
		if(PDKPanelDelegate._instance){
			PDKPanelDelegate._instance.close();
		}
	}
}