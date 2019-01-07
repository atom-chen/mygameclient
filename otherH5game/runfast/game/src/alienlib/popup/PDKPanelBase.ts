/**
 * Created by rockyl on 16/3/9.
 */

module PDKalien {
	export class PDKPanelBase extends eui.Component {
		protected showEffect:any;
		protected showEffectParams:any;
		protected closeEffect:any;
		protected closeEffectParams:any;
		protected popupShowBanner:boolean;

		protected _callback:Function;
		protected _excludeActionsClose:string[] = [];

		constructor(showEffect:any = null, showEffectParams:any = null, closeEffect:any = null, closeEffectParams:any = null, popupShowBanner:boolean = false) {
			super();

			this.showEffect = showEffect || PDKalien.popupEffect.None;
			this.showEffectParams = showEffectParams;

			this.closeEffect = closeEffect || PDKalien.popupEffect.None;
			this.closeEffectParams = closeEffectParams;

			this.popupShowBanner = popupShowBanner;

			this._excludeActionsClose = [];
			this.init();
		}

		protected init():void {

		}

		/**
		 * 添加不用关闭的动作
		 * @param actions
		 */
		addExcludeForClose(actions:string[]):void {
			this._excludeActionsClose = this._excludeActionsClose.concat(actions);
		}

		dealAction(action:string = null, data:any = null):void {
			if (this._callback) {
				this._callback(action || 'close', data);
			}

			if (this._excludeActionsClose.indexOf(action) < 0) {
				this.close();
			}
		}

		popup(modalTouchFun:Function = null, modal:boolean = true, modalConfig:any = null):void {
			PDKalien.PopUpManager.addPopUp(this, this.showEffect, this.showEffectParams, modalTouchFun, modal, modalConfig);
		}

		close():void{
			PDKalien.PopUpManager.removePopUp(this, this.closeEffect, this.closeEffectParams);
		}
	}
}