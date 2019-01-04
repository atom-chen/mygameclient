/**
 * Created by rockyl on 16/1/6.
 *
 * 游戏音效管理
 */

class RunFastGameSoundManager {
	static playCardType(sexVoice: string, type: number, pokerNum: number = 0): void {
		let needVibrate: boolean = false;
		let typeOfRes: string;
		switch (type) {
			case RunFastBUYAO:				
				typeOfRes = 'buyao4';
				break;
			case RunFastSHUANGWANG:
				typeOfRes = 'wangzha';
				needVibrate = true;
				break;
			case RunFastZHADAN:
			case RunFastSANTIAOA:
				typeOfRes = 'zhadan';
				needVibrate = true;
				break;
			case RunFastDAN:
				typeOfRes = '' + pokerNum;
				break;
			case RunFastDUIZI:
				typeOfRes = 'dui' + pokerNum;
				break;
			case RunFastSANZHANG:
				typeOfRes = 'tuple' + pokerNum;
				break;
			case RunFastSANDAIER:
				typeOfRes = 'sandaier';
				break;
			case RunFastSANDAIYI:
				typeOfRes = 'sandaiyi';
				break;
			case RunFastSANDAIYIDUI:
				typeOfRes = 'sandaiyidui';
				break;
			case RunFastSIDAIER:
				typeOfRes = 'sidaier';
				break;
			case RunFastSIDAISAN:
				typeOfRes = 'sidaier';
				break;
			case RunFastSIDAIERDUI:
				typeOfRes = 'sidailiangdui';
				break;
			case RunFastFEIJI:
				typeOfRes = 'feiji';
				break;
			case RunFastDANSHUN:
				typeOfRes = 'shunzi';
				break;
			case RunFastSHUANGSHUN:
				typeOfRes = 'liandui';
				break;
			case RunFastSANSHUN:
				typeOfRes = 'shunzi';
				break;
		}

		let resId: string = sexVoice + '_' + typeOfRes;

		alien.SoundManager.instance.playEffect(resId);
		if (needVibrate) {
			SoundManager.instance.vibrate();
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

		alien.SoundManager.instance.playEffect(resId);
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
		alien.SoundManager.instance.playEffect(resId);
	}
}