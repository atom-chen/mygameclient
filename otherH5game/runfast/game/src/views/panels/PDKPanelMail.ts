/**
 * Created by zhu on 17/11/02
 *
 * 邮箱面板
 */

class PDKPanelMail extends PDKalien.PDKPanelBase{
	private static _instance:PDKPanelMail;

	public static getInstance():PDKPanelMail {
		if (this._instance == undefined) {
			this._instance = new PDKPanelMail();
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
	constructor(){
		super(PDKalien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, PDKalien.popupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});
		this.skinName = panels.PDKPanelMailSkin;
	}

	createChildren():void{
		super.createChildren();

		this.list.itemRenderer = PDKIRContainer;
		this.list.dataProvider = this._dataProvider = new eui.ArrayCollection(PDKMailService.instance.source);
		this._initEvent();
	}

	addListener():void{
		this.list.addEventListener(egret.Event.CHANGE, this.onSelectItem, this);
		PDKMailService.instance.addEventListener(PDKEventNames.MAIL_LIST_REFRESH, this.onMailListRefresh, this);
	}

	removeListener():void{
		this.list.removeEventListener(egret.Event.CHANGE, this.onSelectItem, this);
		PDKMailService.instance.removeEventListener(PDKEventNames.MAIL_LIST_REFRESH, this.onMailListRefresh, this);
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
		PDKPanelMailDetails.getInstance().show(mailData);
		if(mailData.status == 0){
			PDKMailService.instance.openMail(mailData.id);
		}
	}

	private onMailListRefresh(event:egret.Event):void{
		if(event.data){
			if(event.data.mailData){
				this._dataProvider.itemUpdated(event.data.mailData);
			}else{
				this._dataProvider.refresh();
			}
			//this.btnLoadMore.visible = PDKMailService.instance.haveMore;
		}else{
			this._dataProvider.refresh();
		}
		
		if(PDKMailService.instance.source.length<=0){
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
		PDKPanelMail._instance = null;
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
		if(PDKMailService.instance.source.length<=0){
			this._showNoMail(true);
		}else{
			this._showNoMail(false);
		}
		//this.btnLoadMore.visible = PDKMailService.instance.haveMore;
	}
}

/**
 * Created by zhu on 17/11/02.
 *
 * 邮件单项
 */

class PDKMailItem extends eui.Component {
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
		this.time_label.text = PDKalien.TimeUtils.tsToDateString(data.sendtime);
	}
}