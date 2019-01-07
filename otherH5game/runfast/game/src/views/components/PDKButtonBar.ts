/**
 * Created by rockyl on 15/12/1.
 *
 * 按钮栏
 */

class PDKButtonBar extends eui.Component {
	private grpButton:eui.Group;

	constructor() {
		super();

		this.init();
	}

	protected init():void {

	}

	createChildren():void {
		super.createChildren();

		this.grpButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGrpButtonTap, this);

	}

	private onGrpButtonTap(event:egret.TouchEvent):void {
		let data:any = {};
		let action:string = event.target.name;
		if(action.indexOf('score') >= 0){
			data.action = 'setScore';
			data.score = parseInt(action.substr(6, 1));
		}else{
			data.action = action;
		}
		this.dispatchEventWith(PDKEventNames.BUTTON_BAR_TAP, false, data);
	}

	/**
	 * 切换状态
	 * @param name
	 * @param score
	 */
	switchState(name:string, score:number = -1):void{
		this.currentState = name;
		if(score >= 0){
			for(let i = 1; i <= 3; i++){
				let btn:eui.Button = this['score_' + i];
				btn.enabled = i > score;
			}
		}
	}

	/**
	 * 修改按钮
	 * @param name
	 * @param enabled
	 */
	modifyButton(name:string, enabled:boolean):void{
		egret.callLater(()=>{
			let button:eui.Button = (<eui.Button>this.grpButton.getChildByName(name));
			if(button){
				button.enabled = enabled;
			}
		}, this);
	}

	hideButton(name:string, hide:boolean):void {
		egret.callLater(()=>{
			let button:eui.Button = (<eui.Button>this.grpButton.getChildByName(name));
			if(button){
				button.visible = !hide;
			}
		}, this);
	}
}