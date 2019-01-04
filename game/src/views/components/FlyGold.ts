/**
 *
 * @author 
 *
 */
class FlyGold extends eui.Component{
	public constructor() {
    	super();
    	this.skinName=components.FlyGoldSkin;
	}

	initData(data):void {
        let scale = 1;
		this.alpha = 1;
		this.touchEnabled = this.touchChildren = false;
        let obj = this["img"];
        if(data.img){
            obj.source = data.img;
        }else{
            obj.source = "icon_gold2";
        }
        if(data.scale){
            scale = data.scale;
        }
        this.scaleX = this.scaleY = scale;
        this.commitProperties();
        obj.x = obj.anchorOffsetX = obj.width * obj.scaleX * 0.5;
        obj.y = obj.anchorOffsetY = obj.height* obj.scaleY * 0.5;

        if(data.cb){
            this["flyOverCb"] = data.cb; 
        }else{
            this["flyOverCb"] = null;
        }
	}

    public fly(cx: number,cy: number,tx: number,ty: number,time:number=1000):void{
        this.visible = true;
        this.rotation = Math.random() * 360;
        // tx = tx+123;
        // ty = ty+68;
//        CurveModifiers.init();
        //0.5~1.5s
        var t: number = time;
        var bezier: Array<any> = this.getBezier(cx,cy,tx,ty);
        egret.Tween.get(this,null,null,null).to({ x: tx,y: ty,rotation: this.rotation + 180,_bezier: bezier},t).call(this.flyEnd,this);
    }
    
    private flyEnd(): void {
        this.visible = false;
        if(this["flyOverCb"]){
            this["flyOverCb"](this);
        }
    }
    
    /**
	 * 工厂方法，创建飞行金豆
	 * @param data
	 * @returns {FlyGold}
	 */
	static create(data):FlyGold {
		return <FlyGold>alien.ObjectPool.getObject('FlyGold', data);
	}

    /**
	 * 回收一飞行金豆
	 * @param instance
	 */
	static recycle(instance):void {
		alien.ObjectPool.recycleObject('FlyGold', instance);
	}


    private getBezier(cx: number,cy: number,tx: number,ty: number): Array<any> {
        //曲线参数0~30  baseDis~ranDis
        var baseDis: number = 15;
        var ranDis: number = 5;
        var mx: number;
        var my: number;
        var dir: number;
        var xDis: number = tx - cx;
        var yDis: number = ty - cy;
        var r: Number = Math.random();
        var arr: Array<any> = [];
    
        if(Math.abs(xDis) < Math.abs(yDis)) {
            if(r < 0.5)
                dir = 1;//横<---
            else
                dir = 2;//横--->
        }
        else {
            if(r < 0.5)
                dir = 3;//竖up
            else
                dir = 4;//竖down
        }
        var count: number = 2;
        var dis: number;
        for(var i: number = 1;i < count;i++) {
            dis = 0 + Math.random() * 50;
            if(dir == 1 || dir == 2) {
                my = cy + (ty - cy) / count * i;
                if(dir == 1)
                    mx = cx + (tx - cx) / count * i - baseDis - dis;
                else
                    mx = cx + (tx - cx) / count * i + baseDis + dis;
            }
            else {
                mx = cx + (tx - cx) / count * i;
                if(dir == 3)
                    my = cy + (ty - cy) / count * i + baseDis + dis;
                else
                    my = cy + (ty - cy) / count * i - baseDis - dis;
            }
            arr.push({ x: mx,y: my });
        }
        return arr;
    }
}

window["FlyGold"]=FlyGold;