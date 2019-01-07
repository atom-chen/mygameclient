/**
 * Created by rockyl on 15/12/25.
 *
 * 通用场景
 */

class PDKSceneCommon extends PDKalien.SceneBase {
	private labLog:eui.Label;
	private scroller:eui.Scroller;
	private labVersion:eui.Label;
	private grpTopNotify:eui.Group;
	private labTopNotify:eui.Label;
	private btnTopNotify:eui.Button;

	constructor() {
		super();

		this.init();
	}

	private init():void {
		this.skinName = scenes.PDKSceneCommonSkin;
	}

	createChildren():void {
		super.createChildren();

		if(PDKGameConfig.DEBUG){
			PDKalien.Dispatcher.addEventListener(PDKEventNames.LOG, this.onLog, this);
		}

		PDKalien.Dispatcher.addEventListener(PDKEventNames.SHOW_TOP_NOTIFY, this.onShowTopNotify, this);
		PDKalien.Dispatcher.addEventListener(PDKEventNames.HIDE_TOP_NOTIFY, this.onHideTopNotify, this);

		// this.labVersion.text = 'v:' + version;
		this.labVersion.text = 'v:' + this.makeVersionString(PDKversion);

		this.grpTopNotify.y = -50;
	}

	private makeVersionString(ver) {
		let verString = ver;
		if (PDKalien.Native.instance.isNative) {
			if (egret.Capabilities.os == "iOS") {   // ios
				verString = verString + 'i';
			} else if (egret.Capabilities.os == "Android") { // android
				verString = verString + 'a';
			} else {    // native
				verString = verString + 'n';
			}
		}

		return verString;
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