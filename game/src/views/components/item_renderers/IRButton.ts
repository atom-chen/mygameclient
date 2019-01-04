/**
 * Created by rockyl on 16/4/21.
 *
 * 带有up和down的项渲染按钮
 */

class IRButton extends eui.ItemRenderer{
	private imgIcon:eui.Image;
	private imgBg:eui.Image;

	dataChanged():void{
		super.dataChanged();

		this.imgIcon.source = this.iconUp;
		this.imgBg.source = this.bgUp;
	}

	get iconUp():string{
		return this.data ? this.data.icon + '_n' : '';
	}

	get iconDown():string{
		return this.data ? this.data.icon + '_h' : '';
	}

	get bgUp():string{
		return this.data ? this.data.bg + '_n' : '';
	}

	get bgDown():string{
		return this.data ? this.data.bg + '_h' : '';
	}
}