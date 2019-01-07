/**
 * Created by rockyl on 16/3/9.
 */

module PDKalien {
	export class SceneBase extends eui.Component {
		lastSceneName:string;

		constructor() {
			super();

			this.onStageResize();

			this.touchChildren = true;
			this.touchEnabled = false;

			PDKalien.StageProxy.stage.addEventListener(egret.Event.RESIZE, this.onStageResize, this);
		}

		private onStageResize(event:egret.Event = null):void{
			this.width = StageProxy.stage.stageWidth;
			this.height = StageProxy.stage.stageHeight;
		}

		_beforeShow(params:any = null, back:boolean = false):void {
			this.beforeShow(params, back);
		}

		_beforeHide(params:any = null, back:boolean = false):void {
			this.beforeHide(params, back);
		}

		_onShow(params:any = null, back:boolean = false):void {
			this.onShow(params, back);
		}

		_onHide(params:any = null, back:boolean = false):void {
			this.onHide(params, back);
		}

		protected beforeShow(params:any = null, back:boolean = false):void {

		}

		protected beforeHide(params:any = null, back:boolean = false):void {

		}

		protected onShow(params:any = null, back:boolean = false):void {

		}

		protected onHide(params:any = null, back:boolean = false):void {

		}
	}
}