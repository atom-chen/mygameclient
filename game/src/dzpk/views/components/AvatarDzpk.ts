/**
 * Created by rockyl on 16/1/5.
 *
 * 头像
 */

class AvatarDzpk extends eui.Component {
	private imgMask:eui.Image;
	private imgAvatar:eui.Image;
	private bg_img:eui.Image; //背景
	private quitFlag:eui.Image;
	private ownerFlag:eui.Image;
	private _headTouchFunc:Function; //头像点击回调 目前用背景作为点击的对象
	private _headCGlobalPos :egret.Point;//玩家头像中心点全局坐标

	createChildren():void {
		super.createChildren();
		this._initDefault();
		this._initTouchEvent();
		this.imgAvatar.source = 'icon_head_default';

		if(this.imgMask){
			this.imgAvatar.mask = this.imgMask;
		}
	}
	/**
	 * 获取头像中心的的坐标 zhu
	 */
	public getHeadCenGlobalPos():egret.Point{
		if(!this._headCGlobalPos){
			let x = this.imgAvatar.x;
			let y = this.imgAvatar.y;
			let width = this.imgAvatar.width;
			let height = this.imgAvatar.height;
			let pos = new egret.Point(0,0);
			this._headCGlobalPos= this.imgAvatar.localToGlobal(x + width * 0.5,y + height * 0.5);
		}
		return this._headCGlobalPos;
	}
	/**
	 * 初始化默认数据 zhu
	 */
	private _initDefault():void{
		this._headTouchFunc = null;
		this.bg_img.touchEnabled = false;
	}

	/**
	 * 初始化点击事件 zhu
	 */
	private _initTouchEvent():void{
		this.bg_img.addEventListener(egret.TouchEvent.TOUCH_TAP,this._onTouchHead,this);
	}

	/**
	 * 点击头像 zhu
	 */
	private _onTouchHead():void{
		if(this._headTouchFunc){
			this._headTouchFunc();
		}
	}
	
	/**
	 * 头像点击回调 zhu
	 */
	public setHeadTouchFunc(func:Function):void{
		this._headTouchFunc = func;
	}

	/**
	 * 图像是否可以点击 zhu
	 */
	public setHeadTouch(bEnable:boolean):void{
		this.bg_img.touchEnabled = bEnable;
	}


	setQuitFlagVisible(v:boolean){
		this.quitFlag.visible = v;
	}

	setOwnerFlagVisible(v:boolean){
		this.ownerFlag.visible = v;
	}

	set imageId(value:string){
		let _url = value;
		if(value){
			if(value != this.imgAvatar.source){
				if(value.indexOf("http://") != -1){
					_url = value.replace("http://","https://");
				}
				this.imgAvatar.source = _url;//RES.getRes(defaultAvatar);
			}
		}

	}

	clean():void{
		this.imgAvatar.source = null;
	}
}
window["AvatarDzpk"]=AvatarDzpk;