/**
 * Created by rockyl on 15/12/25.
 */

class PDKRobot extends eui.Component {
	private eye:eui.Image;

	createChildren():void{
		super.createChildren();

		new PDKalien.Wave(this.eye, 1000, PDKRobot.eyeAni);
	}

	static eyeAni(t):any{
		return {alpha: (Math.sin(t) + 1) / 2};
	}
}