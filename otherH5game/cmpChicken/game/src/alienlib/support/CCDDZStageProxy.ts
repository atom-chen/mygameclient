/**
 * Created by rockyl on 16/3/9.
 */

module CCalien {
	export class CCDDZStageProxy {
		static stage: egret.Stage;
		static root: egret.DisplayObjectContainer;
		private static _isPause: boolean = false;

		static lastTouchPos: any = {};

		static init(stage: egret.Stage, root: egret.DisplayObjectContainer): void {
			this.stage = stage;
			this.root = root;
		}

		static addEvent(): void {
			let stage = this.stage;
			stage.addEventListener(egret.Event.DEACTIVATE, this.onPause, this);
			stage.addEventListener(egret.Event.ACTIVATE, this.onResume, this);
			stage.addEventListener(egret.TouchEvent.TOUCH_END, function (event: egret.TouchEvent): void {
				this.lastTouchPos.x = event.stageX;
				this.lastTouchPos.y = event.stageY;
			}, this);
		}

		private static onPause(): void {
			this._isPause = true;
			console.log("stage onPause--------->");
			CCDDZSoundManager.instance.onPause();
		}

		private static onResume(): void {
			this._isPause = false;
			console.log("stage onResume--------->");
			CCDDZSoundManager.instance.onResume();
			console.log(ccserver.checkEnterForegroundTimeLong());
			if (CCalien.CCDDZSceneManager.instance.currentSceneName == CCGlobalSceneNames.LOGIN) {
				return;
			}

			if (ccserver.kickOut) {
				return;
			}

			if (ccserver._isInDDZ) {
				if (ccserver.checkEnterForegroundTimeLong()) {
					
					CCalien.CCDDZSceneManager.show(CCGlobalSceneNames.ROOM, { jump2cc: true }, CCalien.CCDDZsceneEffect.CCDDFade);
				}
				return;
			}

			if (ccserver.checkEnterForegroundTimeOut()) {
				CCDDZMainLogic.instance.stop();
			} else if (ccserver.connected) {
				return;
			}
			CCLoginService.instance.showWaitAndTryConnect();
		}

		static enableToucn(bEnable: boolean): void {
			this.stage.touchEnabled = bEnable;
			this.stage.touchChildren = bEnable;
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