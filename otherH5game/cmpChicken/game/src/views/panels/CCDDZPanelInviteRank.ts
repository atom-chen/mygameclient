/**
 * 邀请排行榜
 */
class CCDDZPanelInviteRank extends CCalien.CCDDZPanelBase {
	private static _instance:CCDDZPanelInviteRank;
	public static get instance():CCDDZPanelInviteRank {
		if (this._instance == undefined) {
			this._instance = new CCDDZPanelInviteRank();
		}
		return this._instance;
	}

	constructor() {
		super(
			CCalien.CCDDZpopupEffect.Scale, {withFade: true, ease: egret.Ease.backOut},
			CCalien.CCDDZpopupEffect.Scale, {withFade: true, ease: egret.Ease.backIn}
		);
	}


	private btnClose: eui.Button;
	private lbCount: eui.Label;
	private scroller: eui.Scroller;
	private list:eui.List;
	private _dataProvide:eui.ArrayCollection;
	
	protected init():void {
        this.skinName =  panels.CCDDZPanelInviteRankSkin;
		this.list.itemRenderer = CCDDZInviteRankListItem;
		this._dataProvide=new eui.ArrayCollection([]);	
		this.list.dataProvider=this._dataProvide;
	}

	createChildren():void {
		super.createChildren();
		let e: CCalien.CCDDZEventManager = CCDDZEventManager.instance;
		this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtnCloseClick,this);
		this.scroller.addEventListener(eui.UIEvent.CHANGE_END, this.scroll2end, this);

		CCDDZInviteService.instance.addEventListener("INVITE_RANK_LIST", this.onInviteRankUpdate,this)
	}

	private onInviteRankUpdate(event: egret.Event):void{
		let data: any = event.data;
		this._dataProvide.source=data;
		this._dataProvide.refresh();
	}

	private scroll2end(event: egret.Event):void{
	}

	show():void{
		this.scroller.viewport.scrollV = 0;
        this.popup();
		CCDDZInviteService.instance.getInviteRankList();
	}

	private onBtnCloseClick(event:egret.TouchEvent):void{
		this.dealAction();
	}

}

class CCDDZInviteRankListItem extends eui.ItemRenderer {
	protected bg:eui.Image;
	protected redCoin:eui.Label;
	protected lbName:eui.Label;
    protected lbRed:eui.Label;
	protected rankIdxLabel:eui.Label;
	protected rankIdxImg:eui.Image;
	protected dataChanged():void{
		super.dataChanged();

		let _d = this.data;
		if(this.itemIndex %2 == 0){
			this.bg.visible = true;
		}else{
			this.bg.visible = false;
		}
		this.lbName.text = _d.nickname.substr(0,6);
		this.lbRed.text = _d.coin;//CCDDZUtils.exchangeRatio(_d.coin / 100,true);
		if(_d.ranking <= 3){
			this.rankIdxLabel.visible = false;
			this.rankIdxImg.source = "invite_" + _d.ranking;
		}else{
			this.rankIdxLabel.text = _d.ranking;
			this.rankIdxImg.visible = false;	
		}
	}
}