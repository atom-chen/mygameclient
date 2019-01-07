/**
 * Created by rockyl on 16/5/20.
 *
 * 服务基类
 */

class PDKService extends egret.EventDispatcher{
	constructor(){
		super();

		this.init();
	}

	protected init():void{

	}

	initData():void{

	}

	start(cb):void{
		cb();
	}

	stop():void{

	}
}