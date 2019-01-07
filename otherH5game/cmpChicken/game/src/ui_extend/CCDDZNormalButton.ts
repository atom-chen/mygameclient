/**
 * Created by rockyl on 15/12/22.
 *
 * 状态按钮
 */

class CCDDZNormalButton extends eui.Button {
	public bgDisplay: eui.Image;

	public get bgUp(): string {
		if (this._bgRes) {
			return this._bgRes + (RES.hasRes(this._bgRes + '_n') ? '_n' : '');
		}
		return null;
	}

	public get bgDown(): string {
		if (this._bgRes) {
			return this._bgRes + (RES.hasRes(this._bgRes + '_h') ? '_h' : '');
		}
		return null;
	}

	public get bgDisabled(): string {
		if (this._bgRes) {
			return this._bgRes + (RES.hasRes(this._bgRes + '_d') ? '_d' : '');
		}
		return null;
	}

	private _bgRes: string = "";
	public get bgRes(): string {
		return this._bgRes;
	}
	public set bgRes(value: string) {
		this._bgRes = value;
		if (this.bgDisplay) {
			this.bgDisplay.source = this.bgUp;
		}
	}
}
window["CCDDZNormalButton"] = CCDDZNormalButton;