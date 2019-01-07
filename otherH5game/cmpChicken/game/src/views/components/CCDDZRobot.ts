/**
 * Created by rockyl on 15/12/25.
 */

class CCDDZRobot extends eui.Component {
	private eye:eui.Image;

	createChildren():void{
		super.createChildren();

		new CCalien.CCDDZWave(this.eye, 1000, CCDDZRobot.eyeAni);
	}

	static eyeAni(t):any{
		return {alpha: (Math.sin(t) + 1) / 2};
	}
}
window["CCDDZRobot"]=CCDDZRobot;