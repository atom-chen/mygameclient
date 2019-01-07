/**
 * Created by rockyl on 16/1/6.
 *
 * 游戏音效管理
 */

class CCDDZGameSoundManager {
	static playCardType(sexVoice: string, type: number, pokerNum: number = 0): void {
		let needVibrate: boolean = false;
		let typeOfRes: string;
		switch (type) {
			case CCDDZBUYAO:
				typeOfRes = 'buyao' + CCalien.MathUtils.makeRandomInt(5, 1);
				break;
			case CCDDZSHUANGWANG:
				typeOfRes = 'wangzha';
				needVibrate = true;
				break;
			case CCDDZZHADAN:
				typeOfRes = 'zhadan';
				needVibrate = true;
				break;
			case CCDDZDAN:
				typeOfRes = '' + pokerNum;
				break;
			case CCDDZDUIZI:
				typeOfRes = 'dui' + pokerNum;
				break;
			case CCDDZSANZHANG:
				typeOfRes = 'tuple' + pokerNum;
				break;
			case CCDDZSANDAIYI:
				typeOfRes = 'sandaiyi';
				break;
			case CCDDZSANDAIYIDUI:
				typeOfRes = 'sandaiyidui';
				break;
			case CCDDZSIDAIER:
				typeOfRes = 'sidaier';
				break;
			case CCDDZSIDAIERDUI:
				typeOfRes = 'sidailiangdui';
				break;
			case CCDDZFEIJI:
				typeOfRes = 'feiji';
				break;
			case CCDDZDANSHUN:
				typeOfRes = 'shunzi';
				break;
			case CCDDZSHUANGSHUN:
				typeOfRes = 'liandui';
				break;
			case CCDDZSANSHUN:
				typeOfRes = 'shunzi';
				break;
		}

		let resId: string = "cc_" + sexVoice + '_' + typeOfRes + "_mp3";

		CCalien.CCDDZSoundManager.instance.playEffect(resId);
		if (needVibrate) {
			CCDDZSoundManager.instance.vibrate();
		}
	}

	static playScore(sexVoice: string, score: number): void {
		let resId: string = "cc_" + sexVoice + '_';

		if (score == 0) {
			resId += 'NoOrder';
		} else if (score < 0) {

			return;
		} else {
			resId += 'Order';
		}

		CCalien.CCDDZSoundManager.instance.playEffect(resId + "_mp3");
	}

	/**
	 * 播放是否加倍
	 */
	static playDouble(sexVoice: string, bDouble: boolean): void {
		let resId: string = "cc_" + sexVoice + "_";
		if (!bDouble) {
			resId += "bujiabei";
		}
		else {
			resId += "jiabei";
		}
		CCalien.CCDDZSoundManager.instance.playEffect(resId + "_mp3");
	}
}