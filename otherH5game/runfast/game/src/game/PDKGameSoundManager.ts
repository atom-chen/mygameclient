/**
 * Created by rockyl on 16/1/6.
 *
 * 游戏音效管理
 */

class PDKGameSoundManager {
	static playCardType(sexVoice: string, type: number, pokerNum: number = 0): void {
		let needVibrate: boolean = false;
		let typeOfRes: string;
		switch (type) {
			case PDKBUYAO:
				// typeOfRes = 'buyao' + PDKalien.MathUtils.makeRandomInt(5, 1);
				typeOfRes = 'buyao4';
				break;
			case PDKSHUANGWANG:
				typeOfRes = 'wangzha';
				needVibrate = true;
				break;
			case PDKZHADAN:
			case PDKSANTIAOA:
				typeOfRes = 'zhadan';
				needVibrate = true;
				break;
			case PDKDAN:
				typeOfRes = '' + pokerNum;
				break;
			case PDKDUIZI:
				typeOfRes = 'dui' + pokerNum;
				break;
			case PDKSANZHANG:
				typeOfRes = 'tuple' + pokerNum;
				break;
			case PDKSANDAIER:
				typeOfRes = 'sandaier';
				break;
			case PDKSANDAIYI:
				typeOfRes = 'sandaiyi';
				break;
			case PDKSANDAIYIDUI:
				typeOfRes = 'sandaiyidui';
				break;
			case PDKSIDAIER:
				typeOfRes = 'sidaier';
				break;
			case PDKSIDAISAN:
				typeOfRes = 'sidaier';
				break;
			case PDKSIDAIERDUI:
				typeOfRes = 'sidailiangdui';
				break;
			case PDKFEIJI:
				typeOfRes = 'feiji';
				break;
			case PDKDANSHUN:
				typeOfRes = 'shunzi';
				break;
			case PDKSHUANGSHUN:
				typeOfRes = 'liandui';
				break;
			case PDKSANSHUN:
				typeOfRes = 'shunzi';
				break;
		}

		let resId: string = 'pdk_' + sexVoice + '_' + typeOfRes;

		PDKalien.PDKSoundManager.instance.playEffect(resId);
		if (needVibrate) {
			PDKSoundManager.instance.vibrate();
		}
	}

	static playScore(sexVoice: string, score: number): void {
		let resId: string = sexVoice + '_';

		if (score == 0) {
			resId += 'NoOrder';
		} else if (score < 0) {

			return;
		} else {
			resId += 'Order';
		}

		PDKalien.PDKSoundManager.instance.playEffect(resId);
	}

	/**
	 * 播放是否加倍
	 */
	static playDouble(sexVoice: string, bDouble: boolean): void {
		let resId: string = sexVoice + "_";
		if (!bDouble) {
			resId += "bujiabei";
		}
		else {
			resId += "jiabei";
		}
		PDKalien.PDKSoundManager.instance.playEffect(resId);
	}
}