/**
 * Created by rockyl on 16/3/9.
 */

module PDKalien {
	export class StageProxy {
		static stage: egret.Stage;
		static root: egret.DisplayObjectContainer;
		private static _isPause: boolean = false;

		static lastTouchPos: any = {};

		static init(stage: egret.Stage, root: egret.DisplayObjectContainer): void {
			this.stage = stage;
			this.root = root;

			// stage.addEventListener(egret.TouchEvent.TOUCH_END, function (event: egret.TouchEvent): void {
			// 	this.lastTouchPos.x = event.stageX;
			// 	this.lastTouchPos.y = event.stageY;
			// }, this);
		}

		static addEvent(): void {
			let stage = this.stage;
			stage.addEventListener(egret.Event.DEACTIVATE, this.onPDKPause, this);
			stage.addEventListener(egret.Event.ACTIVATE, this.onPDKResume, this);
			stage.addEventListener(egret.TouchEvent.TOUCH_END, function (event: egret.TouchEvent): void {
				this.lastTouchPos.x = event.stageX;
				this.lastTouchPos.y = event.stageY;
			}, this);
		}

		static removeEvent(): void {
			let stage = this.stage;
			stage.removeEventListener(egret.Event.DEACTIVATE, this.onPDKPause, this);
			stage.removeEventListener(egret.Event.ACTIVATE, this.onPDKResume, this);
			stage.removeEventListener(egret.TouchEvent.TOUCH_END, function (event: egret.TouchEvent): void {
				this.lastTouchPos.x = event.stageX;
				this.lastTouchPos.y = event.stageY;
			}, this);
		}
		
		private static onPDKPause(): void {
			this._isPause = true;
			console.log("stage onPDKPause--------->");
			PDKSoundManager.instance.onPause();
		}

		private static onPDKResume(): void {
			this._isPause = false;
			console.log("stage onPDKResume-----connected---->", pdkServer.connected);
			PDKSoundManager.instance.onResume();
		}

		static isPause(): boolean {
			return this._isPause;
		}

		static get width(): number {
			return this.stage.stageWidth;
		}
		static get height(): number {
			return this.stage.stageHeight;
		}
	}
}