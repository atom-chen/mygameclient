/**
 * Created by rockyl on 16/4/21.
 *
 * 带有up和down的项渲染器
 * 必须含有img
 */

class PDKIRUpDownIcon extends eui.ItemRenderer{
	private img:eui.Image;

	dataChanged():void{
		super.dataChanged();

		this.img.source = this.iconUp;
	}

	get iconUp():string{
		return this.data ? this.data.icon + '_n' : '';
	}

	get iconDown():string{
		return this.data ? this.data.icon + '_h' : '';
	}
}