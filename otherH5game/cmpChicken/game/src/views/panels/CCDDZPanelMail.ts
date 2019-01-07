/**
 * Created by zhu on 17/11/02
 *
 * 邮箱面板
 */

class CCDDZPanelMail extends CCalien.CCDDZPanelBase{
	private static _instance:CCDDZPanelMail;

	public static getInstance():CCDDZPanelMail {
		if (this._instance == undefined) {
			this._instance = new CCDDZPanelMail();
		}
		return this._instance;
	}

	public btnLoadMore:eui.Button;
	public list:eui.List;
	private _dataProvider:eui.ArrayCollection;
	/**
	 * 关闭按钮
	 */
	private closeImg:eui.Image;

	/**
	 * 没有邮件的提示
	 */
	private noMailGroup:eui.Group;

	/**
	 * 邮件滚动容器
	 */
	private mailScroller:eui.Scroller;


	constructor(){
		super(CCalien.CCDDZpopupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, CCalien.CCDDZpopupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});
		this.skinName = panels.CCDDZPanelMailSkin;
	}

	createChildren():void{
		super.createChildren();
		this.list.itemRenderer = CCDDZIRContainer;
		this.list.dataProvider = this._dataProvider = new eui.ArrayCollection(CCDDZMailService.instance.source);
		this._initEvent();
	}

	addListener():void{
		this.list.addEventListener(egret.Event.CHANGE, this.onSelectItem, this);
		this.mailScroller.addEventListener(egret.Event.CHANGE,this._onListScroll,this)
		CCDDZMailService.instance.addEventListener(CCGlobalEventNames.MAIL_LIST_REFRESH, this.onMailListRefresh, this);
	}

	removeListener():void{
		this.list.removeEventListener(egret.Event.CHANGE, this.onSelectItem, this);
		CCDDZMailService.instance.removeEventListener(CCGlobalEventNames.MAIL_LIST_REFRESH, this.onMailListRefresh, this);
	}

    /**
     * 邮件列表滚动
     */
    private _onListScroll(e:egret.Event):void{
        if(this.mailScroller.viewport.scrollV >= this.mailScroller.height){
			CCDDZMailService.instance.shouldLoadMore();
        }
    }

	private onSelectItem(event:egret.Event):void{
		let mailData:any = this.list.selectedItem;
		this.tipOpenMailItem(mailData);
		egret.callLater(()=>{
			this.list.selectedIndex = -1;
		}, this);
	}

	/**
	 * 弹出邮件内容
	 */
	public tipOpenMailItem(mailData:any):void{
		CCDDZPanelMailDetails.getInstance().show(mailData);
		if(mailData.status == 0){
			if(mailData.attachment &&mailData.attachment.length > 0){
				return;
			}
			CCDDZMailService.instance.openMail(mailData.id);
		}
	}

	private onMailListRefresh(event:egret.Event):void{
		let _service = CCDDZMailService.instance;
		this._dataProvider.source = _service.source;
		this._dataProvider.refresh();
		
		if(_service.source.length<=0){
			this._showNoMail(true);
		}else{
			this._showNoMail(false);
		}
	}

	/**
	 * 是否显示没有邮件
	 */
	private _showNoMail(bShow:boolean):void{
		this.noMailGroup.visible = bShow;
	}

	/**
	 * 点击关闭
	 */
	private _onClickClose():void{
		this.dealAction();
	}

	/**
	 * 初始化事件
	 */
	private _initEvent():void{
		this._enableEvent(true);
		this.closeImg["addClickListener"](this._onClickClose, this);
	}

	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
		CCDDZPanelMail._instance = null;
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

	show():void {
		this.popup();
		this.addListener();
		this._dataProvider.refresh();
		if(CCDDZMailService.instance.source.length<=0){
			this._showNoMail(true);
		}else{
			this._showNoMail(false);
		}
		//this.btnLoadMore.visible = CCDDZMailService.instance.haveMore;
	}
}

/**
 * Created by zhu on 17/11/02.
 *
 * 邮件单项
 */

class CCDDZMailItem extends eui.Component {
	private static states:string[] = ['new', 'read'];

	private _data:any;

	public imgIcon: eui.Image;
	/**
	 * 标题
	 */
	public title_label: eui.Label;
	/**
	 * 发送者
	 */
	public sender_label: eui.Label;
	/**
	 * 发送时间
	 */
	public time_label: eui.Label;

	setData(data:any):void{
		this._data = data;
		if(data.status == 0){ //未读
			this.currentState = "new";
		}else{
			this.currentState = "read";
		}
		
		this.title_label.text = data.title;
		//this.sender_label.text = "发件人" + ':' + data.from;
		this.time_label.text = CCalien.TimeUtils.tsToDateString(data.sendtime);
	}
}
window["CCDDZMailItem"]=CCDDZMailItem;