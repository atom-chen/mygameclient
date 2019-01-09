/**
 * Created by eric.liu on 17/11/18.
 *
 * 路径
 */

class FishPathItem extends egret.DisplayObjectContainer {
    //保存当前选中的item
    static lastSelected:FishPathItem = null;

    public time:number=10000;
    public pathName:string;

    public pstart:FishEditorPoint;
    public pp1:FishEditorPoint;
    public pp2:FishEditorPoint;
    public pend:FishEditorPoint;

    private s:FishEditorSurface;
    private l1:FishEditorLine;
    private l2:FishEditorLine;
    private b:FishEditorBezier;

    private selected:boolean = false;

    private movingSurface:boolean = false;
    private movingPoint:boolean = false;
    private movingObject:FishEditorElement = null;
    private moveLocalX:number = 0;
    private moveLocalY:number = 0;

    private offsetLeft:number = 0;
    private offsetTop:number = 0;

    private timeInput:eui.TextInput;
    private timeLabel:eui.Label;

    //链表
    private prev:FishPathItem = null;
    private next:FishPathItem = null;

    constructor(time:number, name:string, start:egret.Point, p1:egret.Point, p2:egret.Point, end:egret.Point, prev:FishPathItem=null, next:FishPathItem=null) {
        super();
        let self:FishPathItem = this;
        //锚点
        self.x = 0;
        self.y = 0;
        self.anchorOffsetX = 0;
        self.anchorOffsetY = 0;
        self.prev = prev;
        self.next = next;
        //保存信息
        self.time = time;
        self.pathName = name;

        //前后的点
        if (prev) {
            //TODO:
        }
        if (next) {
            //TODO:
        }

        //创建4个点
        self.pstart = new FishEditorPoint('起点', start);
        self.pstart.addEventListener(egret.TouchEvent.TOUCH_BEGIN, self.touchBegin, self);
        self.pstart.addEventListener(egret.TouchEvent.TOUCH_MOVE, self.touchMove, self);
        self.pstart.addEventListener(egret.TouchEvent.TOUCH_END, self.touchEnd, self);
        self.addChildAt(self.pstart, 3);
        self.pp1 = new FishEditorPoint('控制点1', p1);
        self.pp1.addEventListener(egret.TouchEvent.TOUCH_BEGIN, self.touchBegin, self);
        self.pp1.addEventListener(egret.TouchEvent.TOUCH_MOVE, self.touchMove, self);
        self.pp1.addEventListener(egret.TouchEvent.TOUCH_END, self.touchEnd, self);
        self.addChildAt(self.pp1, 3);
        self.pp2 = new FishEditorPoint('控制点2', p2);
        self.pp2.addEventListener(egret.TouchEvent.TOUCH_BEGIN, self.touchBegin, self);
        self.pp2.addEventListener(egret.TouchEvent.TOUCH_MOVE, self.touchMove, self);
        self.pp2.addEventListener(egret.TouchEvent.TOUCH_END, self.touchEnd, self);
        self.addChildAt(self.pp2, 3);
        self.pend = new FishEditorPoint('终点', end);
        self.pend.addEventListener(egret.TouchEvent.TOUCH_BEGIN, self.touchBegin, self);
        self.pend.addEventListener(egret.TouchEvent.TOUCH_MOVE, self.touchMove, self);
        self.pend.addEventListener(egret.TouchEvent.TOUCH_END, self.touchEnd, self);
        self.addChildAt(self.pend, 3);
        
        //绘制
        self.Redraw();

        //创建编辑器
        var textInputSkin = `
            <e:Skin class="skins.TextInputSkin" minHeight="40" minWidth="300" states="normal,disabled,normalWithPrompt,disabledWithPrompt" xmlns:e="http://ns.egret.com/eui">
                <e:Rect height="100%" width="100%" fillColor="0xffffff" bottom="3"/>
                <e:EditableText id="textDisplay" verticalCenter="0" left="0" right="0"
                                textColor="0x000000" textColor.disabled="0xff0000" width="100%" height="24" size="16" />
            </e:Skin>
        `;
        self.timeInput = new eui.TextInput();
        self.timeInput.skinName = textInputSkin;
        self.addChild(self.timeInput);
        self.timeInput.width = 50;
        self.timeInput.height = 20;
        self.timeInput.text = ''+time;
        self.timeInput.anchorOffsetX = 0;
        self.timeInput.anchorOffsetY = self.timeInput.height/2;

        //创建标签
        self.timeLabel = new eui.Label('秒');
        self.timeLabel.size = 16;
        self.timeLabel.anchorOffsetX = 0;
        self.timeLabel.anchorOffsetY = self.timeLabel.height/2;
        self.addChild(self.timeLabel);
    }

    private touchBegin(e: egret.TouchEvent) {
        let self:FishPathItem = this;
        //开始拖拽
        let o:FishEditorElement = e.target;
        self.moveLocalX = e.localX;
        self.moveLocalY = e.localY;
        if (o.type == 2) {
            self.movingPoint = false;
            self.movingSurface = true;
        } else if (o.type == 0) {
            self.movingPoint = true;
            self.movingSurface = false;
        }
        self.movingObject = o;
        self.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, self.touchMove, self);

        //选中
        if (null != FishPathItem.lastSelected) {
            FishPathItem.lastSelected.Select(false);
            FishPathItem.lastSelected.parent.setChildIndex(FishPathItem.lastSelected, 10);
        }
        FishPathItem.lastSelected = self;
        self.parent.setChildIndex(self, 11);
        self.Select(true);

        //更新时间
        self.time = +self.timeInput.text;
    }

    private touchMove(e: egret.TouchEvent) {
        let self:FishPathItem = this;
        let o:FishEditorElement = self.movingObject;
        if (self.movingSurface && o.type == 2) {
            //拖动整体移动
            self.x = e.stageX-self.moveLocalX;
            self.y = e.stageY-self.moveLocalY;
        } else if (self.movingPoint && o.type == 0) {
            //拖动改变单个点的位置
            o.x = e.stageX - self.x;
            o.y = e.stageY - self.y;
            self.Redraw();
        }
    }

    private touchEnd(e: egret.TouchEvent) {
        let self:FishPathItem = this;
        //停止拖拽
        let o:FishEditorElement = self.movingObject;
        self.moveLocalX = 0;
        self.moveLocalY = 0;
        self.movingSurface = false;
        self.movingPoint = false;
        self.movingObject = null;
        self.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, self.touchMove, self);
        if (o && o.type == 0) self.Redraw();
        if (o && o.type == 2) {
        }
    }

    private Redraw() {
        let self:FishPathItem = this;

        //获取最新的点位置
        var start = new egret.Point(self.pstart.x, self.pstart.y);
        var p1 = new egret.Point(self.pp1.x, self.pp1.y);
        var p2 = new egret.Point(self.pp2.x, self.pp2.y);
        var end = new egret.Point(self.pend.x, self.pend.y);

        //根据4个点获取最大矩形
        var left = Math.min(start.x, p1.x, p2.x, end.x);
        var right = Math.max(start.x, p1.x, p2.x, end.x);
        var top = Math.min(start.y, p1.y, p2.y, end.y);
        var bottom = Math.max(start.y, p1.y, p2.y, end.y);

        //设置尺寸
        self.width = right-left;
        self.height = bottom-top;
        self.offsetLeft = left;
        self.offsetTop = top;

        //创建一个矩形
        if (self.s) {
            self.removeChild(self.s);
        }
        self.s = new FishEditorSurface(self.pathName, new egret.Rectangle(left, top, self.width, self.height), self.selected?0xff0000:0xffffff);
        self.addChildAt(self.s, 0);
        self.s.addEventListener(egret.TouchEvent.TOUCH_BEGIN, self.touchBegin, self);
        self.s.addEventListener(egret.TouchEvent.TOUCH_MOVE, self.touchMove, self);
        self.s.addEventListener(egret.TouchEvent.TOUCH_END, self.touchEnd, self);
        self.s.addEventListener(egret.TouchEvent.TOUCH_CANCEL, self.touchEnd, self);
        self.s.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, self.touchEnd, self);

        //连接起点终点和控制点
        if (self.l1) {
            self.removeChild(self.l1);
        }
        self.l1 = new FishEditorLine(start, p1);
        self.addChildAt(self.l1, 1);
        if (self.l2) {
            self.removeChild(self.l2);
        }
        self.l2 = new FishEditorLine(end, p2);
        self.addChildAt(self.l2, 1);

        //绘制曲线
        if (self.b) {
            self.removeChild(self.b);
        }
        self.b = new FishEditorBezier('', start, p1, p2, end);
        self.addChildAt(self.b, 1);

        //重置输入框位置
        if (self.timeInput) {
            self.timeInput.x = left+self.width/2+50;
            self.timeInput.y = top+self.height-18;
        }

        //重置标签位置
        if (self.timeLabel) {
            self.timeLabel.x = self.timeInput.x+self.timeInput.width+5;
            self.timeLabel.y = top+self.height-20;
        }
    }

    public Update() {
        let self:FishPathItem = this;
        self.Redraw();
    }

    public Select(select:boolean) {
        let self:FishPathItem = this;
        self.selected = select;
        self.Redraw();
        
        //更新时间
        self.time = +self.timeInput.text;
    }

    public LockStart(lock:boolean) {
        let self:FishPathItem = this;
    }

    public SetPathName(name:string) {
        let self:FishPathItem = this;
        self.pathName = name;
        self.Redraw();
    }
}