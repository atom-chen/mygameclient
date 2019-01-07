/**
 *
 * @author 
 *
 */
class PDKFlyGold extends eui.Component{
	public constructor() {
    	super();
    	this.skinName=components.PDKFlyGoldSkin;
	}
	
    public fly(cx: number,cy: number,tx: number,ty: number,time:number=1000):void{
        this.visible = true;
        this.rotation = Math.random() * 360;
        // tx = tx+123;
        // ty = ty+68;
//        CurveModifiers.init();
        var rx: number = cx+123;//44*Math.random()+
        var ry: number = cy+68;//44*Math.random()+
        //0.5~1.5s
        var t: number = time;
        //			trace(t);
        this.x = rx;
        this.y = ry;
        var bezier: Array<any> = this.getBezier(cx,cy,tx,ty);
//        Tweener.addTween(this,{ x: tx,y: ty,time: t,onComplete: flyEnd,rotation: this.rotation + 180,_bezier: bezier,transition: "linear" });
        
        egret.Tween.get(this,null,null,null).to({ x: tx,y: ty,rotation: this.rotation + 180,_bezier: bezier},t).call(this.flyEnd,this);
    
    }
    
    private flyEnd(): void {
        // if(this.parent)
        //    this.parent.removeChild(this);
        this.visible = false;
        this.dispatchEvent(new egret.Event("flyComplete"));
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
        //			trace(dir);
        var count: number = 2;
        var dis: number;
        for(var i: number = 1;i < count;i++) {
            dis = 0 + Math.random() * 50;
            /*if (i<=((count+1)/2))
                dis=dis+baseDis+ranDis*Math.random();
            else
                dis=dis-baseDis-ranDis*Math.random();
            if (dis<0)
                dis=0;*/
            //				trace(dis);
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
            //				p=new Point(mx,my);
            arr.push({ x: mx,y: my });
            //				trace(mx+","+my);
        }
        return arr;
    }
}
