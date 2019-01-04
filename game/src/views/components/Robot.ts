/**
 * Created by rockyl on 15/12/25.
 */

class Robot extends eui.Component {
	private eye:eui.Image;

	createChildren():void{
		super.createChildren();

		new alien.Wave(this.eye, 1000, Robot.eyeAni);
	}

	static eyeAni(t):any{
		return {alpha: (Math.sin(t) + 1) / 2};
	}
}
window["Robot"]=Robot;