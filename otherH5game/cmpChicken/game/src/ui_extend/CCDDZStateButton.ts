/**
 * Created by rockyl on 15/12/22.
 *
 * 状态按钮
 */

class CCDDZStateButton extends eui.Button {
	public get iconUp():string{
		if(this._labelIcon){
			return this._labelIcon + (RES.hasRes(this._labelIcon + '_n') ? '_n' : '');
		}
		return null;
	}

	public get iconDown():string{
		if(this._labelIcon){
			return this._labelIcon + (RES.hasRes(this._labelIcon + '_h') ? '_h' : '');
		}
		return null;
	}

	public get iconDisabled():string{
		if(this._labelIcon){
			return this._labelIcon + (RES.hasRes(this._labelIcon + '_d') ? '_d' : '');
		}
		return null;
	}
	
	public labelIconDisplay:eui.Image = null;
	private _labelIcon:string = "";
	public bgImg:eui.Image = null;
	public get labelIcon():string {
		return this._labelIcon;
	}
	public set labelIcon(value:string) {
		this._labelIcon = value;
		if (this.iconDisplay) {
			this.iconDisplay.source = this.iconUp;
		}
	}
}
window["CCDDZStateButton"]=CCDDZStateButton;