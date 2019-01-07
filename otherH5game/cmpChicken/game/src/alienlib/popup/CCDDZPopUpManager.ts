/**
 * Created by rockyl on 16/3/9.
 */

module CCalien{
	export class CCDDZPopUpManager{
		private static _instance:CCDDZPopUpManager;
		public static get instance():CCDDZPopUpManager{
			if(CCDDZPopUpManager._instance == undefined){
				CCDDZPopUpManager._instance = new CCDDZPopUpManager();
			}
			return CCDDZPopUpManager._instance;
		}

		static defaultModalConfig:any = {
			color: 0,
			alpha: 0.5,
			duration: 200,
		};

		static addPopUp(target:eui.Component, effectClazz:any = null, effectParams:any = null, modalTouchFun:Function = null, modal:boolean=true, modalConfig:any = null):void{
			CCDDZPopUpManager.instance.addPopUp(target, effectClazz, effectParams, modalTouchFun, modal, modalConfig);
		}

		static removePopUp(target:eui.Component, effectClazz:any = null, effectParams:any = null,noEffect:boolean= false,func:Function = null):void{
			CCDDZPopUpManager.instance.removePopUp(target, effectClazz, effectParams,noEffect,func);
		}

		static removeTopPupUp():boolean{
			return CCDDZPopUpManager.instance.removeTopPupUp();
		}

		static removeAllPupUp():void{
			CCDDZPopUpManager.instance.removeAllPupUp();
		}

		private _modalMask:eui.Rect;
		private _pupUpStack:Array<any> = [];
		private _popLayer:eui.Group;
		private modalConfig:any;

		constructor(){
			this._popLayer = CCDDZSceneManager.instance.popLayer;
			this._popLayer.width = CCalien.CCDDZStageProxy.width;
			this._popLayer.height = CCalien.CCDDZStageProxy.height;

			CCalien.CCDDZStageProxy.stage.addEventListener(egret.Event.RESIZE, this.onStageResize, this);
		}

		private onStageResize(event:egret.Event = null):void{
			if(this._modalMask){
				this._modalMask.width = CCDDZStageProxy.stage.stageWidth;
				this._modalMask.height = CCDDZStageProxy.stage.stageHeight;
			}
		}

		addPopUp(target:eui.Component, effectClazz:any = null, effectParams:any = null, modalTouchFun:Function = null, modal:boolean=true, modalConfig:any = null):void{
			if(target.parent){
				return;
			}

			this.modalConfig = CCalien.CCDDZUtils.combineProp([modalConfig, CCDDZPopUpManager.defaultModalConfig]);

			this._pupUpStack.unshift({target: target, modalTouchFun: modalTouchFun, modal: modal});

			this.updateModalMask(this._pupUpStack[0]);

			let effect:CCDDZpopupEffect.IDialogEffect = this.createEffectInstance(effectClazz);
			effect.show(target, this._popLayer, function():void{

			}, this, effectParams);
		}

		removePopUp(target:eui.Component, effectClazz:any = null, effectParams:any = null,noEffect:boolean = false,func:Function):void{
			if(!target.parent){
				return;
			}
			if(!this.getInStack(target, true)){
				return;
			}
			let aimItem:any;
			this._pupUpStack.some(function(item:any):boolean{
				if(item.modal){
					aimItem = item;
					return true;
				}
			});

			if(aimItem){
				this.updateModalMask(aimItem);
			}else{
				this.setModalMaskVisible(false);
			}

			if(noEffect){
				this._popLayer.removeChild(target);
				if(func){
					func();
				}
			}else{
				let effect:CCDDZpopupEffect.IDialogEffect = this.createEffectInstance(effectClazz);
				effect.hide(target, this._popLayer, function():void{
					if(func){
						func();
					}
				}, this, effectParams);
			}
		}

		removeTopPupUp():boolean{
			if(this._popLayer.numChildren > 0){
				let top = this._popLayer.getChildAt(this._popLayer.numChildren - 1);
				top['close']();
				return true;
			}
			return false;
		}

		removeAllPupUp():void{
			CCalien.CCDDZUtils.enumChildren(this._popLayer, (popup:any)=>{
				if(popup != this._modalMask && popup && popup['close']){
					popup['close']();
				}
			});
		}

		getInStack(target:egret.DisplayObjectContainer, del:boolean = false):any{
			let data:any;
			this._pupUpStack.some(function(item:any, index:number):boolean{
				if(item.target == target){
					data = {item: item, index: index};
					return true;
				}
			});

			if(data && del){
				this._pupUpStack.splice(data.index, 1);
			}

			return data;
		}

		createEffectInstance(effectClazz:any = null):CCDDZpopupEffect.IDialogEffect{
			let effect:CCDDZpopupEffect.IDialogEffect;
			if(effectClazz){
				effect = new effectClazz();
			}else{
				effect = new CCalien.CCDDZpopupEffect.None();
			}

			return effect;
		}

		private onModalMaskTap(event:egret.TouchEvent):void{
			let item:any = this._pupUpStack[0];
			if(item && item.modal && item.modalTouchFun){
				item.modalTouchFun();
			}
		}

		updateModalMask(item:any):void{
			let maskIndex:number = this._popLayer.getChildIndex(this._modalMask);
			let index:number = this._popLayer.getChildIndex(item.target);
			if(maskIndex != index - 1){
				this.setModalMaskVisible(item.modal, index);
			}
		}

		setModalMaskVisible(visible:boolean, index:number = -1):void{
			if(visible){
				this.modalMask.fillColor = this.modalConfig.color;
				this.modalMask.fillAlpha = this.modalConfig.alpha;
				//this.modalMask.alpha = 0;
				if(index >= 0){
					this.setModalMaskVisible(true);
					this._popLayer.addChildAt(this.modalMask, index);
				}else{
					this._popLayer.addChild(this.modalMask);
				}
				egret.Tween.get(this.modalMask, null, null, true).to({alpha: 1}, this.modalConfig.duration);
			}else{
				if(this.modalMask.parent){
					egret.Tween.get(this.modalMask, null, null, true).to({alpha: 0}, this.modalConfig.duration).call(function(modalMask:eui.Rect):void{
						this._popLayer.removeChild(modalMask);
					}, this, [this.modalMask]);
				}
			}
		}

		get modalMask():eui.Rect{
			if(!this._modalMask){
				this._modalMask = new eui.Rect();
				this._modalMask.width = CCDDZStageProxy.width;
				this._modalMask.height = CCDDZStageProxy.height;
				this._modalMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onModalMaskTap, this);
			}

			return this._modalMask;
		}
	}
}