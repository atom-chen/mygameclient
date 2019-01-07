/**
 * Created by rockyl on 16/3/9.
 */


/*
 * Blind 刷出来
 * Bounce 跳动
 * Clip 横向收缩
 * Scale 纵向收缩
 * Drop 单向收缩+fade
 * Slide 单向收缩
 * Explode 八方向爆炸
 * CCDDFade 渐进
 * Fold 抽屉收缩
 * Puff 放大+CCDDFade
 * Pulsate 闪烁
 * Shake 抖动
 * */
module CCalien.CCDDZpopupEffect {
	export class CCDDZUtils {
		static centerPopUp(popUp:eui.Component):void {
			popUp.horizontalCenter = popUp.verticalCenter = 0;
		}

		static centerHorizontal(popUp:eui.Component):void {
			popUp.horizontalCenter = 0;
		}

		static centerVertical(popUp:eui.Component):void {
			popUp.verticalCenter = 0;
		}

		static notCenterPopUp(popUp:eui.Component):void {
			popUp.horizontalCenter = popUp.verticalCenter = NaN;
		}

		static getCenterPos(popUp:eui.Component):any {
			let x:number = 0;
			let y:number = 0;

			let parent:egret.DisplayObjectContainer = popUp.parent;
			if (parent) {
				x = (parent.width - popUp.width) * 0.5;
				y = (parent.height - popUp.height) * 0.5;
			}

			return {x: x, y: y};
		}

		static transDirection(dStr:string):number {
			let d:number;
			switch (dStr) {
				case "up":
					d = 0;
					break;
				case "right":
					d = 1;
					break;
				case "bottom":
					d = 2;
					break;
				case "left":
					d = 3;
					break;
			}

			return d;
		}
	}

	export interface IDialogEffect {
		show(target:eui.Component, parent:eui.Group, callback:Function, thisObj:any, params:any):void;
		hide(target:eui.Component, parent:eui.Group, callback:Function, thisObj:any, params:any):void;
	}

	export class None implements IDialogEffect {
		show(target:eui.Component, parent:eui.Group, callback:Function, thisObj:any, params:any):void {
			parent.addChild(target);
			CCDDZUtils.centerPopUp(target);
		}

		hide(target:eui.Component, parent:eui.Group, callback:Function, thisObj:any, params:any):void {
			parent.removeChild(target);
		}
	}

	/***
	 * 渐进渐出
	 */
	export class CCDDFade implements IDialogEffect {
		static DEFAULT_DURATION:number = 200;

		show(target:eui.Component, parent:eui.Group, callback:Function, thisObj:any, params:any):void {
			target.alpha = 0;
			parent.addChild(target);
			CCDDZUtils.centerPopUp(target);
			let duration:number = (params && params.duration) || CCDDFade.DEFAULT_DURATION;
			egret.Tween.get(target).to({alpha: 1}, duration);
		}

		hide(target:eui.Component, parent:eui.Group, callback:Function, thisObj:any, params:any):void {
			let duration:number = (params && params.duration) || CCDDFade.DEFAULT_DURATION;
			egret.Tween.get(target).to({alpha: 0}, duration).call(function ():void {
				parent.removeChild(target);
			}, this);
		}
	}

	/**
	 * 飞入
	 * duration: 时间
	 * direction: 方向(up, bottom, left, right)
	 * withFade: 是否伴随渐进渐出
	 * startPos:
	 * endPos:
	 */
	export class Flew implements IDialogEffect {
		static DEFAULT_DURATION:number = 300;
		static outPos:Array<any>;

		show(target:eui.Component, parent:eui.Group, callback:Function, thisObj:any, params:any):void {
			if (!Flew.outPos) {
				Flew.outPos = [
					{x: 0, y: -CCDDZStageProxy.height},
					{x: CCDDZStageProxy.width, y: 0},
					{x: 0, y: CCDDZStageProxy.height},
					{x: -CCDDZStageProxy.width, y: 0}
				];
			}

			parent.addChild(target);
			CCDDZUtils.notCenterPopUp(target);
			let startPos:any = params.startPos || Flew.outPos[CCDDZUtils.transDirection(params.direction)];
			let endPos:any = params.endPos || CCDDZUtils.getCenterPos(target);
			target.x = startPos.x || endPos.x;
			target.y = startPos.y || endPos.y;
			let duration:number = (params && params.duration) || Flew.DEFAULT_DURATION;
			let state:any = {x: endPos.x, y: endPos.y};
			egret.Tween.get(target).to(state, duration, params ? params.ease : null);
			if (params && params.withFade) {
				egret.Tween.get(target).to({alpha: 1}, duration);
			}
		}

		hide(target:eui.Component, parent:eui.Group, callback:Function, thisObj:any, params:any):void {
			let defaultPos:any = Flew.outPos[CCDDZUtils.transDirection(params.direction)];
			let endPos:any = params.endPos || CCDDZUtils.getCenterPos(target);
			let duration:number = (params && params.duration) || Flew.DEFAULT_DURATION;
			let state:any = {x: defaultPos.x || endPos.x, y: defaultPos.y || endPos.y};
			egret.Tween.get(target).to(state, duration, params ? params.ease : null).call(function ():void {
				parent.removeChild(target);
				CCDDZUtils.centerPopUp(target);
			}, this);
			if (params && params.withFade) {
				egret.Tween.get(target).to({alpha: 0}, duration);
			}
		}
	}

	/***
	 * 缩放
	 * duration: 时间
	 * withFade: 是否伴随渐进渐出
	 */
	export class Scale implements IDialogEffect {
		static DEFAULT_DURATION:number = 200;

		show(target:eui.Component, parent:eui.Group, callback:Function, thisObj:any, params:any):void {
			let duration:number = (params && params.duration) || Scale.DEFAULT_DURATION;
			target.scaleX = target.scaleY = 0;
			let state:any = {scaleX: 1, scaleY: 1};
			parent.addChild(target);
			CCDDZUtils.centerPopUp(target);
			egret.Tween.get(target).to(state, duration, params ? params.ease : null);
			if (params && params.withFade) {
				egret.Tween.get(target).to({alpha: 1}, duration);
			}
		}

		hide(target:eui.Component, parent:eui.Group, callback:Function, thisObj:any, params:any):void {
			let duration:number = (params && params.duration) || Scale.DEFAULT_DURATION;
			target.scaleX = target.scaleY = 1;
			let state:any = {scaleX: 0, scaleY: 0};
			egret.Tween.get(target).to(state, duration, params ? params.ease : null).call(function ():void {
				parent.removeChild(target);
				target.scaleX = target.scaleY = 1;
			}, this);
			if (params && params.withFade) {
				egret.Tween.get(target).to({alpha: 0}, duration);
			}
		}
	}
}