/**
 * Created by rockyl on 16/8/4.
 */

module PDKalien{
	export class ViewStack extends eui.Group {
		private _viewDefs:any[];
		private _selectedIndex:number = -1;

		views:any[] = [];

		createChildren(): void {
			super.createChildren();

		}

		setup(...defs):void{
			this._viewDefs = defs;
			this.selectedIndex = 0;
		}

		public get selectedIndex():number{return this._selectedIndex}
		public set selectedIndex(value:number){
			if(this._selectedIndex != value){
				this._hideView(this._selectedIndex);
			}
			//if(this._selectedIndex != value){
				this._selectedIndex = value;

				if(this._viewDefs && this._selectedIndex >= 0 && this._selectedIndex < this._viewDefs.length){
					egret.callLater(()=>{
						this._showView(this._selectedIndex);
					}, this);
				}
			//}
		}

		public get selectedChild():egret.DisplayObject{
			return this.numChildren == 0 ? null : this.getChildAt(0);
		}

		private _hideView(index:number):void{
			let view:egret.DisplayObject = this.views[index];
			if(view && view['sleep']){
				view['sleep']();
			}
		}

		private _showView(index:number):void{
			let view:egret.DisplayObject = this.views[index];
			if(!view){
				view = this.views[index] = new this._viewDefs[index]();
				view.width = this.width;
				view.height = this.height;
			}
			this.removeChildren();
			this.addChild(view);

			if(view['activate']){
				view['activate']();
			}
		}
	}
}
