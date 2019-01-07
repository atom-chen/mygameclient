/**
 * Created by NGames on 2015/3/24.
 */

module CCalien{
	export class CCDDZVector2D{
		x:number;
		y:number;

		constructor(x:number = 0, y:number = 0){
			this.setXY(x, y);
		}

		setXY(x:number = 0, y:number = 0):void{
			this.x = x;
			this.y = y;
		}

		copyFrom(v2:CCDDZVector2D):CCDDZVector2D {
			this.x = v2.x;
			this.y = v2.y;
			return this;
		}

		clone():CCDDZVector2D{
			return new CCDDZVector2D(this.x, this.y);
		}

		zero():CCDDZVector2D{
			this.x = 0;
			this.y = 0;

			return this;
		}

		get isZero():boolean{
			return this.x == 0 && this.y == 0;
		}

		normalize():CCDDZVector2D {
			let len:number = this.length;
			if (len == 0) {
				this.x = 1;
				return this;
			}
			this.x /= len;
			this.y /= len;
			return this;
		}

		get isNormalized():boolean {
			return this.length == 1.0;
		}

		truncate(max:number):CCDDZVector2D {
			this.length = Math.min(max, this.length);
			return this;
		}

		reverse():CCDDZVector2D {
			this.x = -this.x;
			this.y = -this.y;
			return this;
		}

		dotProd(v2:CCDDZVector2D):number {
			return this.x * v2.x + this.y * v2.y;
		}

		crossProd(v2:CCDDZVector2D):number {
			return this.x * v2.y - this.y * v2.x;
		}

		distSQ(v2:CCDDZVector2D):number {
			let dx:number = v2.x - this.x;
			let dy:number = v2.y - this.y;
			return dx * dx + dy * dy;
		}

		distance(v2:CCDDZVector2D):number {
			return Math.sqrt(this.distSQ(v2));
		}

		add(v2:CCDDZVector2D):CCDDZVector2D {
			this.x += v2.x;
			this.y += v2.y;
			return this;
		}

		subtract(v2:CCDDZVector2D):CCDDZVector2D {
			this.x -= v2.x;
			this.y -= v2.y;
			return this;
		}

		multiply(value:number):CCDDZVector2D {
			this.x *= value;
			this.y *= value;
			return this;
		}

		divide(value:number):CCDDZVector2D {
			this.x /= value;
			this.y /= value;
			return this;
		}

		set angle(value:number){
			this.radian = value * Math.PI / 180;
		}

		get angle():number{
			return this.radian * 180 / Math.PI;
		}

		set radian(value:number) {
			let len:number = this.length;
			this.setXY(Math.cos(value) * len, Math.sin(value) * len);
		}

		get radian():number {
			return Math.atan2(this.y, this.x);
		}

		equals(v2:CCDDZVector2D):boolean {
			return this.x == v2.x && this.y == v2.y;
		}

		set length(value:number) {
			let a:number = this.radian;
			this.setXY(Math.cos(a) * value, Math.sin(a) * value);
		}

		get length():number {
			return Math.sqrt(this.lengthSQ);
		}

		get lengthSQ():number {
			return this.x * this.x + this.y * this.y;
		}

		toString():string {
			return "[CCDDZVector2D (x:" + this.x + ", y:" + this.y + ")]";
		}
	}
}