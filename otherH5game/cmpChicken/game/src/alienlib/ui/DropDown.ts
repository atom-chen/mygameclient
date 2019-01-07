/**
 * Created by rockyl on 16/4/11.
 *
 * 下拉选择组件
 */
module CCalien{
	export class DropDown extends eui.Component {
		public grpPanel: eui.Group;
		public list: eui.List;
		public lab: eui.Label;
		public imgBg: eui.Image;
		public btn: eui.ToggleButton;

		private _index:number;
		private _items:eui.ArrayCollection;

		createChildren():void {
			super.createChildren();

			this.grpPanel.visible = false;
			this.grpPanel.alpha = 0;
			this.grpPanel.y = 0;

			this._index = -1;

			this.list.itemRenderer = CCDDZIRDropDownItem;
			this.list.dataProvider = this._items = new eui.ArrayCollection();
			this.list.addEventListener(egret.Event.CHANGE, this.onItemSelect, this);

			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		}

		private onTap(event:egret.TouchEvent):void{
			if(this.grpPanel.visible || !this._items || this._items.length == 0){
				return;
			}
			egret.setTimeout(()=>{
				this.show();
			}, this, 1);
		}

		private onItemSelect(event:egret.Event):void{
			this.index = this.list.selectedIndex;
			this.list.selectedIndex = -1;
		}

		private onStageTap(event:egret.TouchEvent):void{
			this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onStageTap, this);

			this.hide();
		}

		private show():void{
			if(this._items.length > 1){
				CCalien.CCDDZStageProxy.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStageTap, this);

				egret.Tween.get(this.grpPanel, null, null, true).set({visible: true}).to({y: this.imgBg.height, alpha: 1}, 100);
			}
		}

		private hide():void{
			this.btn.selected = false;
			egret.Tween.get(this.grpPanel, null, null, true).to({y: 0, alpha: 0}, 100).set({visible: false}).call(this.onResult.bind(this));
		}

		private onResult():void{
			this.dispatchEventWith(egret.Event.CHANGE, false, {index: this._index});
		}

		get items():any[]{return this._items ? this._items.source : null;}
		set items(value:any[]){
			this._items.source = value;
			this.index = 0;

			this.btn.visible = this._items.length > 1;
		}

		get index():number{return this._index;}
		set index(value:number){
			this._index = value;

			let item:any = this._items.getItemAt(this._index);
			this.lab.text = typeof item == 'string' ? item : item.text;
			this.lab.textColor = item.disable ? 0xCCCCCC : 0xFDEDAE;
		}
	}

	export class CCDDZIRDropDownItem extends eui.ItemRenderer{
		private lab:eui.Label;

		protected dataChanged():void {
			super.dataChanged();

			let item:any = this.data;
			this.lab.text = typeof item == 'string' ? item : item.text;
			this.lab.textColor = item.disable ? 0xCCCCCC : 0xFDEDAE;
		}
	}
}