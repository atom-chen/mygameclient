/**
 * Created by rockyl on 16/5/16.
 *
 * 物品项
 */

class PDKGoodsItem extends eui.Component {
	/**
	 * 图标
	 */
	protected iconImg:eui.Image;
	/**
	 * 数量
	 */
	protected numLabel:eui.Label;

	setData(data:any):void{
		if(data.id == 1){
			this.numLabel.text = data.count;
		}else{
			this.numLabel.text = 'x' + data.count;
		}
		this.iconImg.source = "room_" + data.id;//PDKGoodsItem.parseUrl(data.id);
	}

	static parseUrl(id:number):string{
		return PDKGameConfig.RESOURCE_URL + 'goods-icon/goods_' + id + '.png';
	}
}