/**
 * Created by rockyl on 16/3/9.
 */


module CCalien.CCDDZsceneEffect{
	export interface ISceneEffect{
		handover(scene1:CCDDZSceneBase, scene2:CCDDZSceneBase, parent:eui.Group, effectParams:any, callback:Function):void;
	}

	export class None implements ISceneEffect{
		handover(scene1:CCDDZSceneBase, scene2:CCDDZSceneBase, parent:eui.Group, effectParams:any, callback:Function = null):void {
			if(scene1){
				scene1.visible = false;
				parent.removeChild(scene1);
			}
			scene2.visible = true;
			scene2.alpha = 1;
			parent.addChild(scene2);

			if(callback){
				callback();
			}
		}
	}

	export class CCDDFade implements ISceneEffect{
		handover(scene1:CCDDZSceneBase, scene2:CCDDZSceneBase, parent:eui.Group, effectParams:any, callback:Function = null):void {
			egret.Tween.get(scene1).to({alpha: 0}, 500);
			scene2.alpha = 0;
			scene2.visible = true;
			parent.addChild(scene2);
			egret.Tween.get(scene2).to({alpha: 1}, 500).call(function():void{
				parent.removeChild(scene1);
				if(callback){
					callback();
				}
			});
		}
	}

	export class FadeBlack implements ISceneEffect{
		handover(scene1:CCDDZSceneBase, scene2:CCDDZSceneBase, parent:eui.Group, effectParams:any, callback:Function = null):void {
			scene2.alpha = 0;
			scene2.visible = true;
			parent.addChild(scene2);
			if(scene1){
				egret.Tween.get(scene1).to({alpha: 0}, 500).call(function():void{
					parent.removeChild(scene1);
					showScene2();
				}, this);
			}else{
				showScene2();
			}

			function showScene2():void{
				egret.Tween.get(scene2).to({alpha: 1}, 500).call(function():void{
					if(callback){
						callback();
					}
				}, this);
			}
		}
	}

	/**
	 * 移动效果
	 * effectParams:{
	 *  direction: string(up, down, left, right),
	 *  withFade: boolean,
	 *  duration: number,
	 * }
	 */
	export class Flew implements ISceneEffect{
		handover(scene1:CCDDZSceneBase, scene2:CCDDZSceneBase, parent:eui.Group, effectParams:any, callback:Function = null):void {
			let duration:number = effectParams.duration || 500;

			let pos:number[][] = [[NaN, -CCDDZStageProxy.height], [CCDDZStageProxy.width, NaN], [NaN, CCDDZStageProxy.height], [-CCDDZStageProxy.width, NaN]];
			let startPos:number[] = pos[Flew.transDirection(effectParams.direction)];
			let target:any = {x: isNaN(startPos[0]) ? scene1.x : startPos[0], y: startPos[1] == 0 ? scene1.y : startPos[1]};
			egret.Tween.get(scene1).to(target, duration, egret.Ease.cubicOut);

			pos = [[NaN, CCDDZStageProxy.height], [-CCDDZStageProxy.width, NaN], [NaN, -CCDDZStageProxy.height], [CCDDZStageProxy.width, NaN]];
			startPos = pos[Flew.transDirection(effectParams.direction)];
			target = {x: 0, y: 0};
			scene2.x = startPos[0];
			scene2.y = startPos[1];
			scene2.alpha = 1;
			scene2.visible = true;
			parent.addChild(scene2);
			egret.Tween.get(scene2).to(target, duration, egret.Ease.cubicOut).call(function():void{
				parent.removeChild(scene1);
				if(callback){
					callback();
				}
			});
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

	/**
	 * Material风格特效
	 * effectParams:{
	 *  pos: {x, y},
	 *  duration: number,
	 * }
	 */
	export class Material implements ISceneEffect{
		private _r:number;
		private _mask:egret.Shape;
		private _pos:any;

		handover(scene1:CCalien.CCDDZSceneBase, scene2:CCalien.CCDDZSceneBase, parent:eui.Group, effectParams:any, callback:Function):void {
			scene1.cacheAsBitmap = scene2.cacheAsBitmap = true;

			scene2.alpha = 1;
			scene2.visible = true;
			parent.addChild(scene2);

			let s = CCalien.CCDDZStageProxy;

			effectParams = effectParams || {};

			let pos:any = this._pos = effectParams.pos || {x: s.width / 2, y: s.height / 2};
			let mask:egret.Shape = scene2.mask = this._mask = new egret.Shape();//
			mask.x = pos.x;
			mask.y = pos.y;
			CCalien.CCDDZStageProxy.root.addChild(mask);

			let x = pos.x / s.width < 0.5 ? s.width - pos.x : pos.x;
			let y = pos.y / s.height < 0.5 ? s.height - pos.y : pos.y;
			let distance:number = Math.sqrt(x * x + y * y) + 20;

			this.r = 0;
			egret.Tween.get(this).to({r: distance}, effectParams.duration || 1000, egret.Ease.quartOut).call(()=>{
				scene1.cacheAsBitmap = scene2.cacheAsBitmap = false;

				parent.removeChild(scene1);
				scene2.mask = null;
				CCalien.CCDDZStageProxy.root.removeChild(mask);

				if(callback){
					callback();
				}
			});
		}

		get r():number {
			return this._r;
		}

		set r(value:number) {
			this._r = value;

			let g:egret.Graphics = this._mask.graphics;
			g.beginFill(0xFF0000, 0.5);
			g.drawCircle(0, 0, this._r);
			g.endFill();
		}
	}
}