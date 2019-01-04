/**
 * Created by rockyl on 16/1/6.
 *
 * 游戏音效管理
 */

class GameSoundManager{
	static playCardType(sexVoice:string, type:number, pokerNum:number = 0):void{
		let needVibrate:boolean = false;
		let typeOfRes:string;
		switch(type){
			case BUYAO:
				typeOfRes = 'buyao' + alien.MathUtils.makeRandomInt(5, 1);
				break;
			case SHUANGWANG:
				typeOfRes = 'wangzha';
				needVibrate = true;
				break;
			case ZHADAN:
				typeOfRes = 'zhadan';
				needVibrate = true;
				break;
			case DAN:
				typeOfRes = '' + pokerNum;
				break;
			case DUIZI:
				typeOfRes = 'dui' + pokerNum;
				break;
			case SANZHANG:
				typeOfRes = 'tuple' + pokerNum;
				break;
			case SANDAIYI:
				typeOfRes = 'sandaiyi';
				break;
			case SANDAIYIDUI:
				typeOfRes = 'sandaiyidui';
				break;
			case SIDAIER:
				typeOfRes = 'sidaier';
				break;
			case SIDAIERDUI:
				typeOfRes = 'sidailiangdui';
				break;
			case FEIJI:
				typeOfRes = 'feiji';
				break;
			case DANSHUN:
				typeOfRes = 'shunzi';
				break;
			case SHUANGSHUN:
				typeOfRes = 'liandui';
				break;
			case SANSHUN:
				typeOfRes = 'shunzi';
				break;
		}

		let resId:string = sexVoice + '_' + typeOfRes;

		alien.SoundManager.instance.playEffect(resId);
		if(needVibrate){
			SoundManager.instance.vibrate();
		}
	}

	static playScore(sexVoice:string, score:number):void{
		let resId:string = sexVoice + '_';

		if (score == 0) {
			resId += 'NoOrder';
		} else if (score < 0) {

			return;
		} else {
			resId += 'Order';
		}

		alien.SoundManager.instance.playEffect(resId);
	}

	/**
	 * 播放是否加倍
	 */
	static playDouble(sexVoice:string,bDouble:boolean):void{
		let resId:string = sexVoice + "_";
		if(!bDouble){
			resId += "bujiabei";
		}
		else{
			resId += "jiabei";
		}
		alien.SoundManager.instance.playEffect(resId);
	}
}