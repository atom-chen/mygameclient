/**
 * Created by 20151016 on 2015/11/24.
 *
 * 对象池初始化
 */

class ObjectPoolInit{
	constructor(){
		this.init();
	}

	private init():void{
		alien.ObjectPool.registerPool('Card', function(data):Card{
			return new Card();
		}, function(card:Card, data):void{
			card.initData(data);
		});

		alien.ObjectPool.registerPool('CardDzpk', function(data):CardDzpk{
			return new CardDzpk();
		}, function(card:CardDzpk, data):void{
			card.initData(data);
		});

		alien.ObjectPool.registerPool('FlyGold', function(data):FlyGold{
			return new FlyGold();
		}, function(fly:FlyGold, data):void{
			fly.initData(data);
		});
	}
}