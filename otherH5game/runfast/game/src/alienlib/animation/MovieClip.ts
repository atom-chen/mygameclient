/**
 * Created by rockyl on 16/6/7.
 *
 * 影片剪辑
 */

module PDKalien{
	export class MovieClip extends eui.Group {
		private _resName:string;
		private _aniName:string;
		private _autoPlay:boolean = true;

		private _mcDataFactory:egret.MovieClipDataFactory;
		movieClip:egret.MovieClip;

		createChildren():void {
			super.createChildren();

		}

		public get resName():string{
			return this._resName;
		}
		public set resName(value:string){
			if(this._resName != value){
				this.setResName(value);
			}
		}

		public get aniName():string {
			return this._aniName;
		}

		public set aniName(value:string) {
			if(this._aniName != value){
				this.setAniName(value);
			}
		}

		public get autoPlay():boolean {
			return this._autoPlay;
		}

		public set autoPlay(value:boolean) {
			this._autoPlay = value;
		}

		protected setResName(resName:string):void{
			this._resName = resName;

			if(this._resName){
				this._mcDataFactory = new egret.MovieClipDataFactory(RES.getRes(this._resName + '_json'), RES.getRes(this._resName + '_png'));
			}else{
				if(this._mcDataFactory){
					this._mcDataFactory.clearCache();
					this._mcDataFactory = null;
				}
			}

			this.setAniName(this._aniName);
		}

		protected setAniName(value:string):void{
			this._aniName = value;

			if(this._aniName){
				if(this._mcDataFactory){
					this.movieClip = new egret.MovieClip(this._mcDataFactory.generateMovieClipData(this._aniName));
					this.removeChildren();
					this.addChild(this.movieClip);

					if(this._autoPlay){
						this.movieClip.play();
					}
				}
			}
		}
	}
}
