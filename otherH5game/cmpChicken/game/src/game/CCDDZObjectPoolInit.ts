/**
 * Created by 20151016 on 2015/11/24.
 *
 * 对象池初始化
 */

class CCDDZObjectPoolInit {
	constructor() {
		this.init();
	}

	private init(): void {
		CCalien.ObjectPool.registerPool('CCDDZCard', function (data): CCDDZCard {
			return new CCDDZCard();
		}, function (card: CCDDZCard, data): void {
			card.initData(data);
		});

		CCalien.ObjectPool.registerPool('CCCard', function (data): CCCard {
			return new CCCard();
		}, function (ccCard: CCCard, data): void {
			ccCard.initData(data);
		});

		CCalien.ObjectPool.registerPool('CCDDZFlyGold', function (data): CCDDZFlyGold {
			return new CCDDZFlyGold();
		}, function (fly: CCDDZFlyGold, data): void {
			fly.initData(data);
		});
	}
}