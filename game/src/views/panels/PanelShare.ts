/**
 *
 * @author 
 *
 */
class PanelShare extends alien.PanelBase{
	public constructor() {
    	super();
	}
	
    protected init(): void {
        this.skinName = panels.PanelShareSkin;
    }
	/**
     * 分享描述文字
     */
    private desc_img:eui.Image;

    private static _instance: PanelShare;
    public static get instance(): PanelShare {
        if(this._instance == undefined) {
            this._instance = new PanelShare();
        }
        return this._instance;
    }
    
    createChildren(): void {
        super.createChildren();

        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
    }
    
    private onTap(e:egret.TouchEvent):void
    {
        if (this.parent)
            this.close();
    }
    
    show(): void {
        this.popup();
    }

    /**
     * zhu 显示邀请好友H5
     */
    public showInviteFriend():void{
        this.desc_img.source = "room_share2";
        this.show();
    }

    /**
     *zhu 发送牌局给好友H5
     */
    public sendGameToFriend():void{
        this.desc_img.source = "room_share1";
        this.show();
    }
}
