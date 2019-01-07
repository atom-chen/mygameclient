/**
 *
 * @author 
 *
 */
class CCDDZRedPacketProcess extends eui.ItemRenderer{
	public constructor() {
    	super();
	}
	
	private light:eui.Image;
	
    protected dataChanged():void
	{
	    super.dataChanged();
	    this.light.visible=this.data==1;
	}
	/**
	 * zhu 获取发光的星星
	 */
	public getLightImg():any{
		return this.light;
	}
}
