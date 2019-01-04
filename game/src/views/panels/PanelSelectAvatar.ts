/**
 * Created by rockyl on 16/4/26.
 */

class PanelSelectAvatar extends alien.PanelBase {
	private static _instance:PanelSelectAvatar;
	public static get instance():PanelSelectAvatar {
		if (this._instance == undefined) {
			this._instance = new PanelSelectAvatar();
		}
		return this._instance;
	}

	protected btnUpload:eui.Button;
	protected list:eui.List;

	protected init():void {
		this.skinName = panels.PanelSelectAvatarSkin;
	}

	constructor() {
		super(
			alien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backOut},
			alien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backIn}
		);
	}

	createChildren():void {
		super.createChildren();

		this.list.itemRenderer = IRAvatar;
		let s:number[] = [];
		for(let i = 1; i <= 8; i++){
			s.push(i);
		}
		this.list.dataProvider = new eui.ArrayCollection(s);

		this.list.addEventListener(egret.Event.CHANGE, this.onSelectAvatar, this);
		this.btnUpload.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnUploadTap, this);
	}

	private onBtnUploadTap(event:egret.TouchEvent):void{
		/*alien.Native.instance.uploadImageFromDevice('选择头像', GameConfig.WEB_SERVICE_URL + 'upload', (args:any)=>{
			//console.log('选择头像' + JSON.stringify(args));
			let result:number = args.result;
			switch(result){
				case 0:
					let url:string = args.url;
					this.dealAction('select', {url: url});
					break;
			}
		});
		*/
	}

	private onSelectAvatar(event:egret.Event):void{
		this.dealAction('select', {url: 'head' + this.list.selectedItem + '.png'});

		egret.callLater(()=>{
			this.list.selectedIndex = -1;
		}, this);
	}

	show(callback:Function):void{
		this._callback = callback;

		this.popup(this.dealAction.bind(this));

		this.currentState = alien.Native.instance.isNative ? 'upload' : 'select';
	}
}

class IRAvatar extends eui.ItemRenderer{
	private imgAvatar:eui.Image;

	protected dataChanged():void {
		super.dataChanged();

		this.imgAvatar.source = 'icon_head' + this.data;
	}
}