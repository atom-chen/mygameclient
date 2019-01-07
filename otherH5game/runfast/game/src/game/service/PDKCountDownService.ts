/**
 * Created by rockyl on 16/4/15.
 *
 * 倒计时管理
 */

class PDKCountDownService extends PDKService {
	private static _instance: PDKCountDownService;
	public static get instance(): PDKCountDownService {
		if (this._instance == undefined) {
			this._instance = new PDKCountDownService();
		}
		return this._instance;
	}

	private _timer: number;
	private _items: any[] = [];
	private _ids: number = 0;

	start(cb): void {
		this._items.splice(0);
		if (this._timer > 0) {
			egret.clearInterval(this._timer);
		}
		this._timer = egret.setInterval(this.onTimer.bind(this), this, 1000);

		super.start(cb);
	}

	stop(): void {
		super.stop();

		if (this._timer > 0) {
			egret.clearInterval(this._timer);
			this._timer = 0;
		}
	}

	register(second: number, onSecond: Function, onComplete: Function = null): number {
		let id: number = ++this._ids;
		if (!this._items) this._items = new Array()
		console.log("register-------->", pdkServer.tsServer, second);
		this._items.push({
			id: id,
			second,
			end: pdkServer.tsServer + second,
			onSecond,
			onComplete,
		});

		if (onSecond) {
			onSecond(second);
		}

		return id;
	}

	unregister(id: number): void {
		this._items.some((item: any, index: number): boolean => {
			if (item.id == id) {
				this._items.splice(index, 1);
				return true;
			}
		});
	}

	private onTimer(): void {
		if (this._items.length == 0) {
			return;
		}
		let removed: number[] = [];
		console.log(this._items.length, this._items.map((item) => item.id));
		this._items.forEach((item: any, index: number) => {
			let time: number = item.end - pdkServer.tsServer;

			let onSecond: Function = item.onSecond;
			if (onSecond) {
				onSecond(Math.max(0, time));
			}
			if (time <= 0) {
				removed.push(index);
				let onComplete: Function = item.onComplete;
				if (onComplete) {
					onComplete();
				}
			}
		});
		removed.forEach((index: number) => {
			this._items.splice(index, 1);
		});
	}

	static register(second: number, onSecond: Function, onComplete: Function = null): number {
		return PDKCountDownService.instance.register(second, onSecond, onComplete);
	}

	static unregister(id: number): void {
		PDKCountDownService.instance.unregister(id);
	}
}