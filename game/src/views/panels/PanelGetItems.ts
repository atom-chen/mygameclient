/**
 * Created by rockyl on 16/5/18.
 *
 * 恭喜获取到物品面板
 */

class PanelGetItems extends alien.PanelBase {
	private static _instance:PanelGetItems;
	public static get instance():PanelGetItems {
		if (this._instance == undefined) {
			this._instance = new PanelGetItems();
		}
		return this._instance;
	}

	
	public list:eui.List;
	private group:eui.Group;
	private msg:eui.Label;
	private _dataProvider:eui.ArrayCollection;
    private dragon: DragonSign;
	

	protected init():void {
		this.skinName = panels.PanelGetItemsSkin;
	}

	constructor() {
		super(
			alien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backOut},
			alien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backIn}
		);
		
	}

	createChildren():void {
		super.createChildren();
        if(!this.dragon) {
            this.dragon = new DragonSign();
            this.dragon.x=this.group.width>>1 ;
            this.dragon.y = this.group.height >> 1 ;
            this.dragon.stop();
        }
        
	

		this.list.itemRenderer = IRGoodsGet;
		this.list.dataProvider = this._dataProvider = new eui.ArrayCollection();

		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	}

	private onTap(event:egret.TouchEvent):void{
		this.dealAction();
	}

	show(data:any):void{
		this.popup(this.dealAction.bind(this));
        this.group.addChildAt(this.dragon,1);
		//zhu 签到是否有首充金豆加成
		let _gold = data.count;
		
		if(MainLogic.instance.selfData.isSignGoldAddByFRecharge()){
			_gold += _gold * 0.2;
		}
		let _nativeBridge = alien.Native.instance;
		//是否是APP登录 加成10%
		if (_nativeBridge.isNative || (!_nativeBridge.isWXMP && !_nativeBridge.isAli() && egret.Capabilities.os == "iOS")){
            _gold += _gold * 0.1; 
        }
        this.msg.text="×"+_gold;
        this.playMsg();
//		this._dataProvider.source = data;
//        this._dataProvider.refresh();
		
	}
	
	private playMsg():void
	{
    	egret.Tween.removeTweens(this.msg);
	    this.msg.alpha=0;
	    egret.Tween.get(this.msg).wait(300).to({alpha:1},300);
	}

	close():void {
		super.close();

		
	}

	static lightWave(t:number):any{
		return {
			r: 360 * t / Math.PI / 2,
		};
	}
}

class IRGoodsGet extends eui.ItemRenderer{
	public labGoodsName: eui.Label;
	public imgGoodsIcon: eui.Image;

	protected dataChanged():void {
		super.dataChanged();

		let goods:GoodsConfig = GoodsManager.instance.getGoodsById(this.data.id);
		this.labGoodsName.text = goods.name + 'x' + this.data.count;
		this.imgGoodsIcon.source = GoodsItem.parseUrl(this.data.id);
	}
}