/**
 * Created by rockyl on 16/3/9.
 */

module alien {
	export class StageProxy {
		static stage:egret.Stage;
		static root:egret.DisplayObjectContainer;
		private static _isPause:boolean = false;
		static lastTouchPos:any = {};

		private static onPause():void {
			this._isPause = true;
			console.log("stage onPause--------->");
			SoundManager.instance.onPause();
		}

		private static onResume():void{
			this._isPause = false;
			console.log("stage onResume-----connected---->",server.connected);
			SoundManager.instance.onResume();
			if(alien.SceneManager.instance.currentSceneName == SceneNames.LOGIN){
				return;
			}

			if(server.kickOut){
				return;
			}

			if(server.checkEnterForegroundTimeOut()){
				MainLogic.instance.stop();
			}else if(server.connected){
				return;
			}
			LoginService.instance.showWaitAndTryConnect();
		}


		static init(stage:egret.Stage, root:egret.DisplayObjectContainer):void{
			this.stage = stage;
			this.root = root;
		}

		static addEvent():void{
			let stage = this.stage;
			stage.addEventListener(egret.Event.DEACTIVATE,this.onPause,this);
			stage.addEventListener(egret.Event.ACTIVATE,this.onResume,this);
			stage.addEventListener(egret.TouchEvent.TOUCH_END, function(event:egret.TouchEvent):void{
				this.lastTouchPos.x = event.stageX;
				this.lastTouchPos.y = event.stageY;
			}, this);
		}

		static enableToucn(bEnable:boolean):void{
			this.stage.touchEnabled = bEnable;
			this.stage.touchChildren = bEnable;
		}

		static isPause():boolean{
			return this._isPause;
		}
		static get width():number{
			return this.stage.stageWidth;
		}
		static get height():number{
			return this.stage.stageHeight;
		}
	}
}