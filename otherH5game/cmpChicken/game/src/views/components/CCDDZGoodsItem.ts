/**
 * Created by rockyl on 16/5/16.
 *
 * 物品项
 */

class CCDDZGoodsItem extends eui.Component {
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
			if(data.id == 2){ //记牌器
				this.numLabel.text = 'x' + data.count + "小时";
			}
		}
		this.iconImg.source = "room_" + data.id;//CCDDZGoodsItem.parseUrl(data.id);
	}

	static parseUrl(id:number):string{
		return CCGlobalGameConfig.RESOURCE_URL + 'goods-icon/goods_' + id + '.png';
	}
}
window["CCDDZGoodsItem"]=CCDDZGoodsItem;