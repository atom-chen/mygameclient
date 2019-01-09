/**
 * Created by eric.liu on 17/11/18.
 *
 * 路径编辑器
 */

class FishPathEditor extends eui.Component {
    private editor_ground:egret.Shape;
    private fish_editor_btn_insert:eui.Button;
    private fish_editor_btn_delete:eui.Button;
    private fish_editor_btn_export:eui.Button;
    private fish_editor_btn_import:eui.Button;
    private fish_editor_btn_xmirr:eui.Button;
    private fish_editor_btn_ymirr:eui.Button;
    private fish_ground:eui.Group;
    private fish_editor_show_select_group:eui.Group;
    private fish_group_top:eui.Group;
    private fish_group_top_most:eui.Group;
    private fish_paths:Array<FishPathItem> = [];

    private fish_actor_show:FishActor = null;

    private static _instance = null;
    public static GetInstance() : FishPathEditor {
        if (FishPathEditor._instance == null){
            FishPathEditor._instance = new FishPathEditor();
        }
        return FishPathEditor._instance;
    }
    constructor() {
        super();
        let self:FishPathEditor = this;
        self.addEventListener(eui.UIEvent.COMPLETE, self.uiCompHandler, self);
        self.skinName = FishPathEditorSkin;
        FishActor.InitStaticResource();
    }

    createChildren(): void {
        super.createChildren();
        let self:FishPathEditor = this;

        var bg:egret.Shape = new egret.Shape();
        bg.graphics.beginFill(0x888888, 0.3);
        bg.graphics.drawRect(0, 0, self.stage.stageWidth, self.stage.stageHeight);
        bg.graphics.endFill();
        bg.touchEnabled = false;
        self.addChildAt(bg, 0);

        var hlayout:eui.HorizontalLayout = new eui.HorizontalLayout();
        hlayout.paddingLeft = 10;
        hlayout.gap = 10;
        hlayout.setTypicalSize(1280/21, 1280/21);
        self.fish_editor_show_select_group.layout = hlayout;

        for (var i=0;i<21;i++) {
            let item:FishShowItem = new FishShowItem();
            item.SetFishInfo(i);
            item.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showTouchHandler, self);
            self.fish_editor_show_select_group.addChild(item);
        }

        self.fish_editor_btn_insert.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_editor_btn_delete.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_editor_btn_export.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_editor_btn_import.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_editor_btn_xmirr.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_editor_btn_ymirr.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
    }

    private uiCompHandler():void {
        let self:FishPathEditor = this;
    }

    private showTouchHandler(event:egret.TouchEvent):void {
        let self:FishPathEditor = this;
        let showItem:FishShowItem = <FishShowItem>event.target;
        showItem.Select(true);

        //预览
        fishServer.seatid = 1;
        var length = self.fish_paths.length;
        if (length == 0) {
            return;
        }

        //如果已经在预览中，删除之前的对象
        if (self.fish_actor_show) {
            FishManager.GetInstance().DestroyFish(self.fish_actor_show);
            self.fish_actor_show = null;
        }

        //创建鱼
        self.fish_actor_show = FishManager.GetInstance().BuildFish(showItem.fishType, 0);
        self.fish_actor_show.x = self.fish_paths[0].pstart.x;
        self.fish_actor_show.y = self.fish_paths[0].pstart.y;

        //构造游动路线
        var data:any = {};
        data.points = [];
        data.fish_trace_type = [];
        data.fish_trace_time = [];
        for (var i=0;i<length;i++) {
            data.fish_trace_type.push(2);
            data.fish_trace_time.push(self.fish_paths[i].time);
            data.points.push(self.fish_paths[i].pstart.GetGlobalPos());
            data.points.push(self.fish_paths[i].pp1.GetGlobalPos());
            data.points.push(self.fish_paths[i].pp2.GetGlobalPos());
            data.points.push(self.fish_paths[i].pend.GetGlobalPos());
        }
        self.fish_ground.addChildAt(self.fish_actor_show, 20);
        self.fish_actor_show.MoveToTrace(data);
    }

    private btnTouchHandler(event:egret.TouchEvent):void {
        let self:FishPathEditor = this;
        switch(event.target) {
            case self.fish_editor_btn_insert:
                //找到上一条路径的终点
                var length = self.fish_paths.length;
                var path = new FishPathItem(10,
                                            '路径'+(length+1),
                                            egret.Point.create(100, 300),
                                            egret.Point.create(200, 100),
                                            egret.Point.create(400, 100),
                                            egret.Point.create(500, 300));
                self.fish_paths.push(path);
                self.fish_ground.addChild(path);
                for (var i=0;i<self.fish_paths.length;i++) {
                    self.fish_paths[i].SetPathName('路径'+(i+1));
                }
                break;
            case self.fish_editor_btn_delete:
                //删除路径
                if (null != FishPathItem.lastSelected) {
                    var index = self.fish_paths.indexOf(FishPathItem.lastSelected, 0);
                    if (index != -1) {
                        self.fish_paths.splice(index, 1);
                    }
                    self.fish_ground.removeChild(FishPathItem.lastSelected);
                    FishPathItem.lastSelected = null;
                }
                for (var i=0;i<self.fish_paths.length;i++) {
                    self.fish_paths[i].SetPathName('路径'+(i+1));
                }
                break;
            case self.fish_editor_btn_export:
                //导出
                var length = self.fish_paths.length;
                var data:any = {};
                data.points = [];
                data.fish_trace_type = [];
                data.fish_trace_time = [];
                for (var i=0;i<length;i++) {
                    data.fish_trace_type.push(2);
                    data.fish_trace_time.push(self.fish_paths[i].time);
                    var x = data.points.push(self.fish_paths[i].pstart.GetGlobalPosForExport());
                    Object.defineProperty(data.points[x-1], "$hashCode", { enumerable: false });
                    x = data.points.push(self.fish_paths[i].pp1.GetGlobalPosForExport());
                    Object.defineProperty(data.points[x-1], "$hashCode", { enumerable: false });
                    x = data.points.push(self.fish_paths[i].pp2.GetGlobalPosForExport());
                    Object.defineProperty(data.points[x-1], "$hashCode", { enumerable: false });
                    x = data.points.push(self.fish_paths[i].pend.GetGlobalPosForExport());
                    Object.defineProperty(data.points[x-1], "$hashCode", { enumerable: false });
                }
                Object.defineProperty(data, "$hashCode", { enumerable: false })
                FishJsBridge.getInstance().tsCallJsFunc('savejsonfile', JSON.stringify(data));
                break;
            case self.fish_editor_btn_import:
                //导入路线
                let _input:HTMLElement = document.getElementById("file-input");
                var callback = (content) => {
                    var data = JSON.parse(content);
                    let types:Array<number> = data.fish_trace_type;
                    let points:Array<egret.Point> = data.points;
                    let times:Array<number> = data.fish_trace_time;
                    if (types.length > 0) {
                        //清除屏幕
                        self.fish_ground.removeChildren();
                        self.fish_paths = [];
                        //多个路线组成，提取路线
                        var pointIndex = 0;
                        for (var i=0,length=types.length;i<length;i++) {
                            var start, p1, p2, end;
                            if (types[i] == 1) {
                                //直线，两个点
                                start = self.HandlePoint(points[pointIndex++]);
                                p1 = start;
                                end = self.HandlePoint(points[pointIndex++]);
                                p2 = end;
                            } else if (types[i] == 2) {
                                //贝塞尔曲线
                                start = self.HandlePoint(points[pointIndex++]);
                                p1 = self.HandlePoint(points[pointIndex++]);
                                p2 = self.HandlePoint(points[pointIndex++]);
                                end = self.HandlePoint(points[pointIndex++]);
                            }
                            var path = new FishPathItem(times[i], '', start, p1, p2, end);
                            self.fish_paths.push(path);
                            self.fish_ground.addChild(path);
                        }
                    }

                    for (var i=0;i<self.fish_paths.length;i++) {
                        self.fish_paths[i].SetPathName('路径'+(i+1));
                    }
                };
                var listener = (e) => {
                    FishJsBridge.getInstance().tsCallJsFunc('getselectfilecontent', '', callback);
                };
                _input.addEventListener('change', listener, false);
                _input.click();
                break;
            case self.fish_editor_btn_xmirr:
                //水平镜像
                self.MirrorPath(true, false);
                break;
            case self.fish_editor_btn_ymirr:
                //垂直镜像
                self.MirrorPath(false, true);
                break;
        }
    }

    private HandlePoint(pt:egret.Point):egret.Point {
        pt.x /= 2;
        pt.x += 1280/4;
        pt.y /= 2;
        pt.y += 640/4;
        return pt;
    }

    private MirrorPath(x:boolean, y:boolean) {
        let self:FishPathEditor = this;
        //垂直或水平镜像
        if (FishPathItem.lastSelected) {
            FishPathItem.lastSelected.Select(false);
            FishPathItem.lastSelected = null;
        }
        var stageWidth = self.stage.stageWidth;
        var stageHeight = self.stage.stageHeight;
        let newpaths:Array<FishPathItem> = [];
        for (var i=0,length=self.fish_paths.length;i<length;i++) {
            let path:FishPathItem = self.fish_paths[i];
            let pathWidth:number = path.width;
            let pathHeight:number = path.height;
            if (x) {
                path.x = stageWidth - path.x - pathWidth;
                path.pstart.x = path.x + pathWidth - path.pstart.x;
                path.pstart.y = path.y + path.pstart.y;
                path.pp1.x = path.x + pathWidth - path.pp1.x;
                path.pp1.y = path.y + path.pp1.y;
                path.pp2.x = path.x + pathWidth - path.pp2.x;
                path.pp2.y = path.y + path.pp2.y;
                path.pend.x = path.x + pathWidth - path.pend.x;
                path.pend.y = path.y + path.pend.y;
            }
            if (y) {
                path.y = stageHeight - path.y - pathHeight;
                path.pstart.y = path.y + pathHeight - path.pstart.y;
                path.pstart.x = path.x + path.pstart.x;
                path.pp1.y = path.y + pathHeight - path.pp1.y;
                path.pp1.x = path.x + path.pp1.x;
                path.pp2.y = path.y + pathHeight - path.pp2.y;
                path.pp2.x = path.x + path.pp2.x;
                path.pend.y = path.y + pathHeight - path.pend.y;
                path.pend.x = path.x + path.pend.x;
            }
            var newpath = new FishPathItem(path.time, path.pathName, path.pstart.GetPos(), path.pp1.GetPos(), path.pp2.GetPos(), path.pend.GetPos());
            newpaths.push(newpath);
            self.fish_ground.removeChild(path);
        }
        self.fish_paths.splice(0, self.fish_paths.length);
        self.fish_paths = newpaths;
        for (var i=0,length=self.fish_paths.length;i<length;i++) {
            let path:FishPathItem = self.fish_paths[i];
            self.fish_ground.addChild(path);
            path.Update();
        }
    }
}