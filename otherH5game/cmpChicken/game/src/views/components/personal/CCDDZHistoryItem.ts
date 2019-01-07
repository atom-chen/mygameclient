class CCDDZHistoryItem extends eui.ItemRenderer {
    protected lbTime: eui.Label;
    protected lbOwner: eui.Label;
    protected lbCheck: eui.Label;

    protected dataChanged(): void {
        super.dataChanged();
        this.lbOwner.text = this.data.owner_cn;
        this.lbTime.text = this.data.createtime;
        this.lbCheck.addEventListener(egret.TouchEvent.TOUCH_TAP,this.CheckDetailClick,this);
    }

    private CheckDetailClick(event:egret.TouchEvent):void{
        CCDDZPersonalDetail.instance.show(this.data.gameinfo);
	}
}