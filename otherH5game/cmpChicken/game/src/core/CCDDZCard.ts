/**
 * Created by rockyl on 15/11/20.
 *
 * 牌
 */

class CCDDZCard extends egret.DisplayObjectContainer {
	private _container:egret.DisplayObjectContainer;
	private _body:CCDDZCardBody;
	private _bg:egret.Bitmap;
	private _backRes:string;
	private _bGray:boolean = false;
	private _pokerId:number = 0;

	addPlaying:boolean;
	sending:boolean;

	constructor() {
		super();

		this.init();
	}

	private init():void {
		this.touchEnabled = true;

		this.addChild(this._container = new egret.DisplayObjectContainer());
		this._container.addChild(this._body = new CCDDZCardBody());
		this._body.scaleX = this._body.scaleY = CCGlobalGameConfig.CARD_SCALE;

		CCalien.CCDDZUtils.anchorCenter(this._container, CCGlobalGameConfig.CARD_WIDTH, CCGlobalGameConfig.CARD_HEIGHT);
	}

	initData(data):void {
		this._pokerId = 0
		this._body.y = 0;
		this._bGray = false;
		this.scaleX = this.scaleY = this.alpha = 1;
		this.touchEnabled = this.touchChildren = true;
		this._select = false;
		if(data.pid == 0){
			this.showBack();
		}else{
			this._body.initData(this._pokerId = data.pid);
			this.showFront();
		}
	}

	/**
	 * 扑克id
	 * @returns {number}
	 */
	get pokerId():number {
		return this._pokerId;
	}
	set pokerId(value:number){
		this._body.initData(this._pokerId = value);
	}

	/**
	 * 划过状态
	 * @returns {boolean}
	 */
	get rollOver():boolean {return this._body.rollOver;}
	set rollOver(value:boolean) {
		this._body.rollOver = value;
	}

	private _select:boolean = false;
	/**
	 * 选择状态
	 * @returns {boolean}
	 */
	get select():boolean {return this._select;}
	set select(value:boolean) {
		if (this._select != value) {
			this._select = value;

			let y:number = this._select ? -10 : 0;
			egret.Tween.get(this._body, null, null, true).to({y}, 80);
		}
	}

	/**
	 * 显示牌面
	 */
	showFront(animate:boolean = false):void{
		if(animate){
			egret.Tween.get(this._container, null, null, true)
				.to({scaleX: 0}, 100)
				.call(()=>{
					if(this._bg){
						this._bg.visible = false;
					}
					this._body.visible = true;
				})
				.to({scaleX: 1}, 100);
		}else{
			this._body.visible = true;
			if(this._bg){
				this._bg.visible = false;
			}
		}
	}

	/**
	 * 是否是灰掉的牌
	 */
	isGray():boolean{
		return this._bGray;
	}

	showGrayBg(bGray:boolean):void{
		this._bGray = bGray;
		if(this.pokerId != 0){
			this._body.setBgGray(bGray);
		}else{
			let png = bGray ? "gray" : "blue";
			this.showBack(png);
		}
	}

	/**
	 * 显示牌背
	 * @param backRes blue red gray
	 */
	showBack(backRes:string = 'blue'):void{
		if(!this._bg){
			this._container.addChild(this._bg = new egret.Bitmap());
			this._bg.scaleX = this._bg.scaleY = CCGlobalGameConfig.CARD_SCALE;
		}

		if(this._backRes != backRes){
			this._backRes = backRes;
			this._bg.texture = RES.getRes('cc_poker_' + backRes + '_back');
		}

		this._body.visible = false;
		this._bg.visible = true;
	}

	/**
	 * 播放动画
	 */
	animate(to:any, delay:number = 0, from:any = null, duration:number = 200, ease:Function = null):egret.Tween{
		return egret.Tween.get(this, null, null, true).to(from).wait(delay).to(to, duration, ease);
	}

	/**
	 * 工厂方法，创建一张牌
	 * @param data
	 * @returns {CCDDZCard}
	 */
	static create(data):CCDDZCard {
		return <CCDDZCard>CCalien.ObjectPool.getObject('CCDDZCard', data);
	}

	/**
	 * 回收一张牌
	 * @param instance
	 */
	static recycle(instance):void {
		CCalien.ObjectPool.recycleObject('CCDDZCard', instance);
	}

	/**
	 * 设置地主牌
	 * @param visible
	 */
	showMasterFlag(visible: boolean): void {
		this._body.showMasterFlag(visible);
	}
}