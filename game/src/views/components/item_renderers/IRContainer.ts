/**
 * Created by rockyl on 16/4/21.
 *
 * 简单的单项容器
 * 必须含有item
 */

class IRContainer extends eui.ItemRenderer{
	public item:any;

	protected dataChanged():void {
		super.dataChanged();

		this.item.setData(this.data);
	}
}