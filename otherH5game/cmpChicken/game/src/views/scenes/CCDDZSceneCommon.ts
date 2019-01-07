/**
 * Created by rockyl on 15/12/25.
 *
 * 通用场景
 */

class CCDDZSceneCommon extends CCalien.CCDDZSceneBase {
	private labLog:eui.Label;
	private scroller:eui.Scroller;
	private labVersion:eui.Label;
	private grpTopNotify:eui.Group;
	private labTopNotify:eui.Label;
	private btnTopNotify:eui.Button;
	private logBtn:eui.Button;

	constructor() {
		super();

		this.init();
	}

	private init():void {
		this.skinName = scenes.CCDDZSceneCommonSkin;
	}

	createChildren():void {
		super.createChildren();
		
		let params: any = CCalien.Native.instance.getUrlArg();
		if(params && params.showLog == '1'){
			//CCalien.CCDDZDispatcher.addEventListener(CCGlobalEventNames.LOG, this.onLog, this);
		}

		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLogTouchBegin, this);
		this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onLogTouchMove, this);
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.onLogTouchEnd, this);
		this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onLogTouchCancel, this);
		this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onLogTouchOutSide, this);

		CCalien.CCDDZDispatcher.addEventListener(CCGlobalEventNames.SHOW_TOP_NOTIFY, this.onShowTopNotify, this);
		CCalien.CCDDZDispatcher.addEventListener(CCGlobalEventNames.HIDE_TOP_NOTIFY, this.onHideTopNotify, this);

		// this.labVersion.text = 'v:' + version;
		//this.labVersion.text = 'v:' + this.makeVersionString(version);

		this.grpTopNotify.y = -50;
	}

	private onLogTouchBegin():void{
		let target:any = this.logBtn;
		target.touchBegin = true;
	}

	private onLogTouchMove():void{
		//target.touchBegin
	}
	private onLogTouchEnd():void{

	}

	private onLogTouchCancel():void{

	}

	private onLogTouchOutSide():void{

	}

	private onShowTopNotify(event:egret.Event):void{
		let data:any = event.data;

		this.grpTopNotify.visible = true;
		if(typeof data.content == 'string'){
			this.labTopNotify.text = data.content;
		}else{
			data.content(this.labTopNotify);
		}
		this.btnTopNotify.visible = data.showButton;
		if(data.showButton){
			this.btnTopNotify.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnTopNotifyTap.bind(this, data.onTap), this);
		}

		let tween:egret.Tween = egret.Tween.get(this.grpTopNotify, null, null, true).to({y: 0}, 200);
		if(data.delay && data.delay > 0){
			tween.wait(data.delay).call(this.hideTopNotify, this);
		}
	}

	private onHideTopNotify(event:egret.Event):void{
		this.hideTopNotify();
	}

	private hideTopNotify():void{
		egret.Tween.get(this.grpTopNotify, null, null, true).to({y: -this.grpTopNotify.height}, 200);
		this.btnTopNotify.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnTopNotifyTap, this);
	}

	private onBtnTopNotifyTap(onTap:Function, event:egret.TouchEvent):void{
		this.hideTopNotify();
		if(onTap){
			onTap();
		}
	}

	private onLog(event:egret.Event):void{
		this.labLog.appendText(event.data + '\n');
		let vp:eui.Group = <eui.Group>this.scroller.viewport;
		vp.scrollV = this.labLog.height - vp.height;
	}

	beforeShow(params:any):void {

	}
}