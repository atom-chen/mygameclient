/**
 * Created by 20151016 on 2015/11/24.
 *
 * 对象池初始化
 */

class PDKObjectPoolInit {
	constructor() {
		this.init();
	}

	private init(): void {
		PDKalien.ObjectPool.registerPool('PDKCard', function (data): PDKCard {
			return new PDKCard();
		}, function (card: PDKCard, data): void {
			card.initData(data);
		});
	}
}