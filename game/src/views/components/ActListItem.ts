/**
 * 活动标签页的按钮 17/11/20 zhu
 */

class ActListItem extends eui.ItemRenderer {
	/**
	 * 背景
	 */
	protected bgImg:eui.Image;

	/**
	 * 文字
	 */
	private titLabel:eui.Label;

	/**
	 * 小红点
	 */
	private flagImg:eui.Image;

	/**
	 * 正常的颜色值
	 */
	private normalColor:number = 0x874A19;
	/**
	 * 选中的颜色值
	 */
	private selColor:number = 0xE16233;

	/**
	 * 活动标志
	 */
	private actImg:eui.Image;

	/**
	 * 正常的背景
	 */
	private normalBg:string  = "common_btn1_n"
	/**
	 * 选中后的背景
	 */
	private selBg:string  = "common_btn1_h"
	/**
	 * 是否显示小红点
	 */
	private _showFlagImg(bShow:boolean):void{
		this.flagImg.visible = bShow;
	}

	/**
	 * 设置显示文字
	 */
	private _setTit(sTit:string):void{
		this.titLabel.text = sTit;
	}

	/**
	 * 设置选中
	 */
	private _setSelect():void{
		this.bgImg.source = this.selBg;
		this.titLabel.textColor = this.selColor;
	}

	/**
	 * 设置正常
	 */
	private _setNormal():void{
		this.bgImg.source = this.normalBg;
		this.titLabel.textColor = this.normalColor;
	}

	/**
	 * 设置活动
	 */
	private _setActFlag():void{
		if(this.data.act){
			this.actImg.visible = true;
		}else{
			this.actImg.visible = false;
		}
	}

	dataChanged():void{
		super.dataChanged();
		this._setTit(this.data.tit);
		if(this.data.sel){
			this._setSelect();
		}else{
			this._setNormal();
		}

		this._setActFlag();
		if(this.data.new){
			this._showFlagImg(true);
		}else{
			this._showFlagImg(false);
		}
	}
}