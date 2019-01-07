/**
 * Created by rockyl on 15/12/2.
 */

class CCDDZMasterCards extends eui.Component {
	private container:eui.Group;
	private labBase:eui.Label;
	private labMultiple:eui.Label;

	constructor() {
		super();

		this.init();
	}

	protected init():void {

	}

	createChildren():void {
		super.createChildren();

		for(let i = 0; i < 3; i++){
			let card:CCDDZCard = CCDDZCard.create({pid: 0});
			card.scaleX = card.scaleY = 0.4;
			card.x = i * 62;
			this.container.addChild(card);
		}
	}

	/**
	 * 初始化,显示3张牌背
	 */
	initData():void{
		[0,0,0].forEach((pid, i)=>{
			let card:CCDDZCard = <CCDDZCard>this.container.getChildAt(i);
			card.showBack();
		});

		this.updateScore(0, 1);
	}

	/**
	 * 显示地主牌
	 * @param pokerIds
	 * @param reconnect
	 */
	showCards(pokerIds:number[], reconnect:boolean):void{
		pokerIds.forEach((pid, i)=>{
			let card:CCDDZCard = <CCDDZCard>this.container.getChildAt(i);
			card.pokerId = pid;
			card.showFront(!reconnect);
		});
	}

	updateScore(base:number, multiple:number):void{
		let _score:string = "" + base;
		if(base >=10000){
			_score = "" + base /10000 + "万";
		}
		this.labBase.text = _score

		this.labMultiple.text = multiple.toString();
	}

	/**
	 * 更新倍数
	 */
	updateMultiple(multiple:number):void{
		if(multiple < 0) return;

		this.labMultiple.text = "" + multiple;
	}
}
window["CCDDZMasterCards"]=CCDDZMasterCards;