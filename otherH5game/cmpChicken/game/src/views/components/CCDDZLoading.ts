/**
 * Created by rockyl on 16/1/25.
 *
 * 加载动画
 */

class CCDDZLoading extends eui.Group implements CCalien.ITicker{
	private _container:egret.DisplayObjectContainer;

	private _count:number = 8;
	private R:number = 50;

	createChildren():void{
		super.createChildren();

		this.addChild(this._container = new egret.DisplayObjectContainer());

		let perRadius:number = Math.PI * 2 / this._count;
		for(let i = 0; i < this._count; i++){
			let item:LoadingItem = new LoadingItem();
			item.play(perRadius * (this._count - i - 1));
			this._container.addChild(item);

			item.x = Math.cos(perRadius * i) * this.R;
			item.y = Math.sin(perRadius * i) * this.R;
		}
	}

	play():void{
		CCalien.CCDDZTickerManager.register(this);
	}

	stop():void{
		CCalien.CCDDZTickerManager.unregister(this);
	}

	update():void {
		CCalien.CCDDZUtils.enumChildren(this._container, (item:LoadingItem)=>{
			item.update();
		});
	}
}

class LoadingItem extends egret.Bitmap{
	private _offset:number;
	private _radius:number;

	constructor(){
		super(RES.getRes(CCGlobalResNames.loading_icon));

		this.init();
	}

	private init():void{
		this.anchorOffsetX = this.anchorOffsetY = this.width / 2;
	}

	update():void{
		this._radius += 0.08;

		this.alpha = this.scaleX = this.scaleY = (Math.sin(this._radius + this._offset) + 1) / 2;
	}

	play(offset:number):void{
		this._offset = offset;
		this._radius = 0;
	}
}
window["CCDDZLoading"]=CCDDZLoading;