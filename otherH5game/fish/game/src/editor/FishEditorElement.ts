/**
 * Created by eric.liu on 17/11/18.
 *
 * 编辑器元素，包括点,线,面等
 */

class FishEditorElement extends egret.DisplayObjectContainer {
    public type:number;//0点 1线 2面
    constructor(type:number) {
        super();
        this.type = type;
        this.touchChildren = false;
        switch(type) {
            case 0:
            case 2:
                this.touchEnabled = true;
                break;
            case 1:
                this.touchEnabled = false;
                break;
        }
    }
}

//点
class FishEditorPoint extends FishEditorElement {
    private label:eui.Label;
    constructor(pointName:string, pos:egret.Point, radius:number=10) {
        super(0);
        let self:FishEditorPoint = this;

        //创建标签
        self.label = new eui.Label(pointName+'(0,0)');
        self.label.size = 16;
        self.label.textColor = 0xA98765;
        self.label.anchorOffsetX = self.label.width/2;
        self.label.anchorOffsetY = self.label.height/2;
        self.label.y = 20;
        self.addChild(self.label);

        //创建圆形点
        var s:egret.Shape = new egret.Shape();
        s.graphics.beginFill(0xff0000, 1);
        s.graphics.drawCircle(0, 0, radius);
        s.graphics.endFill();
        self.addChild(s);

        //位置
        self.x = pos.x;
        self.y = pos.y;

        //更新坐标
        egret.setInterval(function(arg, name, pos) {
            let self:FishEditorPoint = arg;
            var point = self.GetGlobalPos();
            self.label.text = `${name}(${point.x},${point.y})`;
        }, self, 500, self, pointName, pos);
    }

    public GetPos():egret.Point {
        let self:FishEditorPoint = this;
        var point = new egret.Point(self.x, self.y);
        return point;
    }

    public GetGlobalPos():egret.Point {
        let self:FishEditorPoint = this;
        var point = self.localToGlobal(self.parent.x+self.x, self.parent.y+self.y);
        point.x /= 2;
        point.y /= 2;
        return point;
    }

    public GetGlobalPosForExport():egret.Point {
        let self:FishEditorPoint = this;
        let point:egret.Point = self.GetGlobalPos();
        point.x -= 1280/4;
        point.y -= 720/4;
        point.x *= 2;
        point.y *= 2;
        return point;
    }

    public SetByGlobalPos(pos:egret.Point) {
        let self:FishEditorPoint = this;
        self.x = pos.x - self.parent.x;
        self.y = pos.y - self.parent.y;
    }
}

//直线
class FishEditorLine extends FishEditorElement {
    constructor(start:egret.Point, end:egret.Point) {
        super(1);
        let self:FishEditorLine = this;

        //绘制直线
        var shp:egret.Shape = new egret.Shape();
        shp.graphics.lineStyle(2, 0x000055);
        shp.graphics.moveTo(start.x, start.y);
        shp.graphics.lineTo(end.x, end.y);
        shp.graphics.endFill();
        this.addChild(shp);
    }
}

//曲线
class FishEditorBezier extends FishEditorElement {
    private label:eui.Label;
    constructor(bezierName:string, start:egret.Point, p1:egret.Point, p2:egret.Point, end:egret.Point) {
        super(1);
        let self:FishEditorBezier = this;

        //创建标签
        self.label = new eui.Label(bezierName);
        self.label.size = 16;
        self.label.anchorOffsetX = self.label.width/2;
        self.label.anchorOffsetY = self.label.height/2;
        self.label.x = start.x;
        self.label.y = start.y+20;
        self.addChild(self.label);

        //绘制曲线
        var shp:egret.Shape = new egret.Shape();
        shp.graphics.lineStyle(5, 0x00ff00);
        shp.graphics.moveTo(start.x, start.y);
        shp.graphics.cubicCurveTo(p1.x, p1.y, p2.x, p2.y, end.x, end.y);
        shp.graphics.endFill();
        this.addChild(shp);
    }
}

//面
class FishEditorSurface extends FishEditorElement {
    private label:eui.Label;
    constructor(surfaceName:string, rect:egret.Rectangle, color:number=0xffffff) {
        super(2);
        let self:FishEditorSurface = this;

        //创建矩形
        var bg:egret.Shape = new egret.Shape();
        bg.graphics.beginFill(color, 0.1);
        bg.graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
        bg.graphics.endFill();
        self.addChild(bg);

        //创建标签
        self.label = new eui.Label(surfaceName);
        self.label.size = 16;
        self.label.anchorOffsetX = self.label.width/2;
        self.label.anchorOffsetY = self.label.height/2;
        self.label.x = rect.x+rect.width/2;
        self.label.y = rect.y+rect.height-20;
        self.addChild(self.label);

        self.anchorOffsetX = 0;
        self.anchorOffsetY = 0;
    }

    public SetSurfaceName(name:string) {
        let self:FishEditorSurface = this;
        self.label.text = name;
    }
}