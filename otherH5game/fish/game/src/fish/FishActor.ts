/**
 * Created by eric.liu on 17/11/06.
 *
 * 鱼
 */

class FishBezier {
    public time:number;
    public start:egret.Point;
    public p1:egret.Point;
    public p2:egret.Point;
    public end:egret.Point;
    constructor(time, start, p1, p2, end) {
        let self:FishBezier = this;
        self.ReuseBezier(time, start, p1, p2, end);
    }
    public ReuseBezier(time, start, p1, p2, end) {
        let self:FishBezier = this;
        self.time = time;
        self.start = start;
        self.p1 = p1;
        self.p2 = p2;
        self.end = end;
    }
}

class FishBezierManager {
    //单例
    private static _instance = null;
    public static GetInstance() : FishBezierManager {
        if (FishBezierManager._instance == null){
            FishBezierManager._instance = new FishBezierManager();
            FishBezierManager.GetInstance().InitPool();
        }
        return FishBezierManager._instance;
    }
    protected InitPool() {
        let self:FishBezierManager = this;
        FishObjectPool.registerPool('bezier_pool_key', function(time, start, p1, p2, end):FishBezier {
            return new FishBezier(time, start, p1, p2, end);
        }, function(bezier:FishBezier, time, start, p1, p2, end):void {
            bezier.ReuseBezier(time, start, p1, p2, end);
        });
    }
    public BuildBezier(time, start, p1, p2, end):FishBezier {
        return <FishBezier>FishObjectPool.getObject('bezier_pool_key', time, start, p1, p2, end);
    }
    public DestroyBezier(bezier:FishBezier) {
        FishObjectPool.recycleObject('bezier_pool_key', bezier);
    }
}

class FishActor extends FishObject {
    private static colorFlilter:egret.ColorMatrixFilter = null;
    private static grayFlilter:egret.ColorMatrixFilter = null;
    private static glowFilter:egret.GlowFilter = null;
    private static mcDataFactory0_7:egret.MovieClipDataFactory = null;
    private static mcDataFactory8_11:egret.MovieClipDataFactory = null;
    private static mcDataFactory12_14:egret.MovieClipDataFactory = null;
    private static mcDataFactory15:egret.MovieClipDataFactory = null;
    private static mcDataFactory16:egret.MovieClipDataFactory = null;
    private static mcDataFactory17_21:egret.MovieClipDataFactory = null;
    private fishType:number;
    private fishId:number;
    private fishMultiple:number;
    private mc:egret.MovieClip = null;
    private shadow:egret.MovieClip = null;
    private tween:egret.Tween = null;
    public explode:boolean = false;
    private timeoutId:number = 0;
    private enableShadow:boolean = true;
    private catchedByCanonViewId:number = 0;
    private goldNumber:number = 0;
    private redPacket:number = 0;
    private p2Body:p2.Body = null;
    private trace:Array<FishBezier> = [];
    private passTime:number = 0;

    public IsFish():boolean {return true;}
    public IsBullet():boolean {return false;}
    public Object():any {return this;}
    public P2Body():p2.Body {return this.p2Body;};
    public ResetP2Body() {this.p2Body = null;}

    constructor(fishType:number, fishId:number) {
        super();

        let self:FishActor = this;
        self.touchChildren = false;
        self.touchEnabled = false;

        //创建滤镜
        if (FishActor.colorFlilter == null) {
            //红色滤镜
            var colorMatrix = [
                1,0,0,0,0,
                0,0.5,0,0,0,    //设置绿色和蓝色减弱0.5，突出红色
                0,0,0.5,0,0,
                0,0,0,1,0
            ];
            FishActor.colorFlilter = new egret.ColorMatrixFilter(colorMatrix);

            //灰化滤镜
            colorMatrix = [
                0.3,0.6,0,0,0,
                0.3,0.6,0,0,0,
                0.3,0.6,0,0,0,
                0,0,0,1,0
            ];
            FishActor.grayFlilter = new egret.ColorMatrixFilter(colorMatrix);
        }

        //根据鱼的type创建鱼
        self.fishType = fishType;
        for (var i=0,length=FishTypes.typeConfigs.length;i<length;i++) {
            if (FishTypes.typeConfigs[i].typeid == self.fishType) {
                self.fishMultiple = FishTypes.typeConfigs[i].multiple;
            }
        }

        //创建鱼
        self.mc = self.makeMCByType(fishType);
        self.addChild(self.mc);
        self.mc.addEventListener(egret.Event.COMPLETE, (e:egret.Event)=>{
            //金豆动画
            var cannon = FishCannonManager.GetInstance().GetCannon(self.catchedByCanonViewId);
            if (cannon) {
                if (self.goldNumber > 0) {
                    //普通鱼
                    var cointype = 1;//金豆
                    if (self.catchedByCanonViewId != FishPhysics.GetInstance().selfViewId) {
                        cointype = 0;//银币
                    }
                    //大于30倍鱼出效果
                    var coin = FishCoinManager.GetInstance().BuildCoin(cointype, self.fishType);
                    coin.Move(500, egret.Point.create(self.x-(Math.random()*200-100), self.y-(Math.random()*200-100)), egret.Point.create(cannon.x, cannon.y), self.goldNumber, self.fishMultiple>=30);
                    if (self.parent) {
                        self.parent.addChild(coin);
                    }
                }
                if (self.redPacket != 0) {
                    //红包鱼
                    let redpacket:FishRedpacket = new FishRedpacket();
                    redpacket.x = self.x;
                    redpacket.y = self.y;
                    if (self.parent) {
                        self.parent.addChild(redpacket);
                        redpacket.Fly(egret.Point.create(self.x, self.y), egret.Point.create(cannon.x, cannon.y));
                    }
                }
            }

            //鱼死亡最后一帧延时500毫秒
            var idTimeout:number = egret.setTimeout(function(arg) {
                var __this = arg;
                if (__this.parent) {
                    if (__this.enableShadow) {
                        __this.parent.removeChild(__this.shadow);
                    }
                    __this.parent.removeChild(__this);
                }
                FishManager.GetInstance().DestroyFish(__this);
            }, self, 300, self);
        }, self);

        //创建阴影
        if (self.enableShadow) {
            self.shadow = self.makeMCByType(fishType, true);
            self.shadow.anchorOffsetX = self.shadow.$getWidth()/2;
            self.shadow.anchorOffsetY = self.shadow.$getHeight()/2;
            self.shadow.frameRate = 9;
        }

        //创建物理
        self.p2Body = FishPhysics.GetInstance().AddPhysicalBodyForFish(self);

        self.ReuseFish(fishId);
    }

    public ReuseFish(fishId:number) {
        let self:FishActor = this;
        self.fishId = fishId;
        self.trace = [];
        self.passTime = 0;
        self.explode = true;
        self.catchedByCanonViewId = 0;
        self.goldNumber = 0;
        self.redPacket = 0;
        self.filters = [];
        self.scaleX = 1.0;
        self.scaleY = 1.0;
        self.enableShadow = true;
        if (self.shadow) {
            self.shadow.x = -200;
            self.shadow.y = -200;
        }
    }

    public Destroy() {

    }

    public static InitStaticResource() {
        //预加载资源
        if (null == FishActor.mcDataFactory0_7) {
            var data = RES.getRes("fish0_7_json");
            var texture = RES.getRes("fish0_7_png");
            FishActor.mcDataFactory0_7 = new egret.MovieClipDataFactory(data, texture);
        }
        if (null == FishActor.mcDataFactory8_11) {
            var data = RES.getRes("fish8_11_json");
            var texture = RES.getRes("fish8_11_png");
            FishActor.mcDataFactory8_11 = new egret.MovieClipDataFactory(data, texture);
        }
        if (null == FishActor.mcDataFactory12_14) {
            var data = RES.getRes("fish12_14_json");
            var texture = RES.getRes("fish12_14_png");
            FishActor.mcDataFactory12_14 = new egret.MovieClipDataFactory(data, texture);
        }
        if (null == FishActor.mcDataFactory17_21) {
            var data = RES.getRes("fish17_21_json");
            var texture = RES.getRes("fish17_21_png");
            FishActor.mcDataFactory17_21 = new egret.MovieClipDataFactory(data, texture);
        }
        if (null == FishActor.mcDataFactory15) {
            var data = RES.getRes('fish15_json');
            var texture = RES.getRes('fish15_png');
            FishActor.mcDataFactory15 = new egret.MovieClipDataFactory(data, texture);
        }
        if (null == FishActor.mcDataFactory16) {
            var data = RES.getRes('fish16_json');
            var texture = RES.getRes('fish16_png');
            FishActor.mcDataFactory16 = new egret.MovieClipDataFactory(data, texture);
        }
    }

    private makeMCByType(type:number, shadow:boolean=false):egret.MovieClip {
        //通过类型创建鱼动画
        var mcDataFactory = null;
        if (type <= 7) {
            mcDataFactory = FishActor.mcDataFactory0_7;
        } else if (type <= 11) {
            mcDataFactory = FishActor.mcDataFactory8_11;
        } else if (type <= 14) {
            mcDataFactory = FishActor.mcDataFactory12_14;
        } else if (type >= 17) {
            mcDataFactory = FishActor.mcDataFactory17_21;
        } else if (type == 15) {
            mcDataFactory = FishActor.mcDataFactory15;
        } else if (type == 16) {
            mcDataFactory = FishActor.mcDataFactory16;
        }
        var key = '';
        if (type < 10) {
            key = 'fish_0' + type;
        } else {
            key = 'fish_' + type;
        }
        if (shadow) {
            key += '_shadow';
        }
        var mcdata = mcDataFactory.generateMovieClipData(key);
        var mc = new egret.MovieClip(mcdata);
        mc.anchorOffsetX = mc.$getWidth()/2;
        mc.anchorOffsetY = mc.$getHeight()/2;
        mc.frameRate = 9;
        mc.touchEnabled = false;
        return mc;
    }

    public Move(time:number, start:egret.Point, p1:egret.Point, p2:egret.Point, end:egret.Point) {
        let self:FishActor = this;
        //物理唤醒
        self.p2Body.wakeUp();
        self.p2Body.position = [p1.x, p1.y];
        //鱼的位置移动，三次贝塞尔曲线，需要4个点（起点，控制点1，控制点2，终点）
        self.explode = false;
        self.x = start.x;
        self.y = start.y;
        if (self.enableShadow && self.parent) {
            self.shadow.x = self.x;
            self.shadow.y = self.y;
            self.shadow.gotoAndPlay("move", -1)
            if (self.parent) {
                self.parent.addChildAt(self.shadow, 0);
            }
        }
        self.mc.gotoAndPlay("move", -1)
        //贝塞尔曲线
        self.trace.push(FishBezierManager.GetInstance().BuildBezier(time, start, p1, p2, end));
    }

    public MoveToTrace(data:any, passtime:number=0) {
        let self:FishActor = this;
        //根据路径游动
        self.trace = [];
        let types:Array<number> = data.fish_trace_type;
        let points:Array<egret.Point> = data.points;
        let times:Array<number> = data.fish_trace_time;
        self.passTime = passtime;
        var totalTime = 0;
        if (types.length > 0) {
            //多个路线组成，提取路线
            var pointIndex = 0;
            for (var i=0,length=types.length;i<length;i++) {
                if (types[i] == 1) {
                    //直线，两个点
                    var start = self.HandlePoint(points[pointIndex++]);
                    var end = self.HandlePoint(points[pointIndex++]);
                    self.trace.push(FishBezierManager.GetInstance().BuildBezier(times[i], start, start, end, end));
                } else if (types[i] == 2) {
                    //贝塞尔曲线
                    var start = self.HandlePoint(points[pointIndex++]);
                    var p1 = self.HandlePoint(points[pointIndex++]);
                    var p2 = self.HandlePoint(points[pointIndex++]);
                    var end = self.HandlePoint(points[pointIndex++]);
                    self.trace.push(FishBezierManager.GetInstance().BuildBezier(times[i], start, p1, p2, end));
                } else {
                    //其他无效
                    continue;
                }
                //路线总时间
                totalTime += times[i];
            }

            //路线已经走完
            if (passtime >= totalTime) {
                self.trace = [];
                self.passTime = 0;
                FishManager.GetInstance().DestroyFish(self);
                return;
            }

            //物理唤醒
            self.p2Body.wakeUp();
            //鱼的位置移动，三次贝塞尔曲线，需要4个点（起点，控制点1，控制点2，终点）
            self.explode = false;
            //设置鱼动作
            if (self.enableShadow && self.parent) {
                self.shadow.gotoAndPlay("move", -1)
                if (self.parent) {
                    self.parent.addChildAt(self.shadow, 0);
                }
            }
            self.mc.gotoAndPlay("move", -1)

            //根据路径游动
            self.MoveToTraceImpl();
            return;
        }

        FishManager.GetInstance().DestroyFish(self);
    }

    private MoveToTraceImpl() {
        let self:FishActor = this;
        //从路径中选出当前走到的路线
        if (self.trace.length == 0) {
            //路线为空释放鱼
            if (self.parent) {
                if (self.enableShadow) {
                    self.parent.removeChild(self.shadow);
                }
                self.parent.removeChild(self);
            }
            FishManager.GetInstance().DestroyFish(self);
            return;
        }

        //找到当前路径计算进度
        let path:FishBezier = self.trace.shift();
        if (self.passTime >= path.time) {
            self.passTime -= path.time;
            self.MoveToTraceImpl();
            return;
        }

        self.explode = false;
        self.x = path.start.x;
        self.y = path.start.y;

        if (path.start.x > 0 && path.start.x < self.stage.stageWidth && path.start.y > 0 && path.start.y < self.stage.stageHeight) {
            //开始点在屏幕中间
        }

        //使用GreenSock库来实现沿贝塞尔曲线运动
        //官方文档:https://greensock.com/docs/Plugins/BezierPlugin
        //PS:
        //.progress(x) 设置当前从多少进度开始
        //.eventCallback(...) 设置事件的回调 "onComplete", "onUpdate", "onStart" or "onRepeat"
        var tween = TweenMax
            .to(self, path.time, {
                bezier: {                                       //贝塞尔曲线
                    type:"cubic",                               //三阶曲线
                    values: [                                   //曲线上的点
                        { x:path.start.x, y:path.start.y },     //起点
                        { x:path.p1.x, y:path.p1.y },           //控制点1
                        { x:path.p2.x, y:path.p2.y },           //控制点2
                        { x:path.end.x, y:path.end.y }          //终点
                    ], autoRotate:90                            //根据运动路线，自动旋转，偏移90度
                },
                ease:Linear.easeNone                            //缓动效果，线性
            })
            .progress(self.passTime/path.time);                 //进度
        tween.eventCallback('onComplete', function(_self, _path) {     //完成事件
            let __self:FishActor = _self;
            //如果从中间开始的路线，第一次完成后清除
            __self.passTime = 0;
            //完成后事件
            FishBezierManager.GetInstance().DestroyBezier(_path);
            if (__self.trace.length > 0) {
                //开启新路径
                TweenMax.killTweensOf(__self);
                __self.MoveToTraceImpl();
            } else {
                //清理鱼
                __self.explode = true;
                if (__self.parent) {
                    if (__self.enableShadow) {
                        __self.parent.removeChild(__self.shadow);
                    }
                    __self.parent.removeChild(__self);
                }
                TweenMax.killTweensOf(__self);
                FishManager.GetInstance().DestroyFish(__self);
            }
        }, [self, path], self);
        tween.eventCallback('onUpdate', function(_self) {       //更新事件
            let __self:FishActor = _self;
            //更新物理位置和角度
            __self.p2Body.position = [__self.x, __self.y];
            __self.p2Body.angle = __self.rotation*Math.PI/180;
            //更新阴影位置
            if (__self.enableShadow) {
                //计算光源与鱼的角度，延伸段为阴影位置
                var rotat = -Math.atan2(__self.y - (-300), __self.x - (-300)) * 180 / Math.PI + 90;
                __self.shadow.rotation = __self.rotation;
                __self.shadow.x = __self.x + Math.cos((90-rotat)*Math.PI/180) * 50;
                __self.shadow.y = __self.y + Math.sin((90-rotat)*Math.PI/180) * 50;
            }
        }, [self], self);
    }

    public MoveOnly() {
        let self:FishActor = this;
        self.explode = false;
        self.enableShadow = false;
        self.mc.gotoAndPlay("move", -1);
    }

    public StopMove() {
        let self:FishActor = this;
        //停止移动
        self.explode = true;
        self.p2Body.sleep();
        TweenMax.killTweensOf(self);
        self.mc.stop();
        self.trace = [];
        self.passTime = 0;
        if (self.enableShadow) {
            self.shadow.stop();
            if (self.shadow.parent) {
                self.shadow.parent.removeChild(self.shadow);
            }
        }
    }

    public Beat() {
        let self:FishActor = this;
        //被打中效果
        self.filters = [FishActor.colorFlilter];
        if (self.timeoutId != 0) {
            egret.clearTimeout(self.timeoutId);
        }
        //滤镜显示500毫秒
        self.timeoutId = egret.setTimeout(function(arg){
            var __this = arg;
            __this.filters = [];
            __this.timeoutId = 0;
        }, self, 500, self);
    }

    public Explode(cannonViewId:number, goldNumber:number, redPacket:number=0) {
        let self:FishActor = this;
        //物理睡眠
        self.p2Body.sleep();
        //设置鱼死亡，设置该状态后鱼不再与子弹碰撞
        self.explode = true;
        egret.clearTimeout(self.timeoutId);
        self.timeoutId = 0;
        self.filters = [FishActor.grayFlilter];
        self.catchedByCanonViewId = cannonViewId;
        self.goldNumber = goldNumber;
        self.redPacket = redPacket;
        self.mc.gotoAndPlay("die", 2);
        if (self.enableShadow) {
            self.shadow.gotoAndPlay("die", 2);
        }
        TweenMax.killTweensOf(self);

        //声音
        FishSoundManager.GetInstance().PlayCatch(self.GetFishType());
        return;
    }

    public GetFishType():number {
        let self:FishActor = this;
        return self.fishType;
    }

    public GetFishID():number {
        let self:FishActor = this;
        return self.fishId;
    }

    private HandlePoint(p:egret.Point):egret.Point {
        let self:FishActor = this;
        //console.log('============================ ' + fishServer.seatid);
        //根据座位ID处理对面坐标，以座位ID 1/2 为标准视角， 3/4 需要转换
        let pr:egret.Point = p;
        if (fishServer.seatid > 2) {
            pr.x = self.stage.stageWidth - p.x;
            pr.y = self.stage.stageHeight - p.y;
        }
        return pr;
    }
};



//鱼管理
class FishManager {
    //单例
    private static _instance = null;
    public static GetInstance() : FishManager{
        if (FishManager._instance == null){
            FishManager._instance = new FishManager();
            FishManager.GetInstance().InitPool();
        }
        return FishManager._instance;
    }

    private fishes:Array<FishActor> = [];

    protected InitPool() {
        let self:FishManager = this;
        //根据鱼的类型创建对象池
        for (var i=0;i<=FISH_TYPE_COUNT;i++) {
            FishObjectPool.registerPool('fish_pool_key_'+i, function(type, id):FishActor {
                return new FishActor(type, id);
            }, function(fish:FishActor, type, id):void {
                fish.ReuseFish(id);
            });
            for (var j=0;j<10;j++) {
                //创建鱼对象缓存
                self.DestroyFish(self.BuildFish(i, 0));
            }
        }
    }

    public BuildFish(type:number, id:number):FishActor {
        let self:FishManager = this;
        //制造鱼
        var fish = <FishActor>FishObjectPool.getObject('fish_pool_key_'+type, type, id);
        self.AddFish(fish);
        return fish;
    }

    public DestroyFish(fish:FishActor) {
        let self:FishManager = this;
        if (!fish) return;
        //销毁鱼
        fish.StopMove();
        if (fish.parent) {
            fish.parent.removeChild(fish);
        }
        //将鱼放置到屏幕外
        fish.x = -200;
        fish.y = -200;
        self.RemoveFish(fish);
        FishObjectPool.recycleObject('fish_pool_key_'+fish.GetFishType(), fish);
    }

    private AddFish(fish:FishActor) {
        let self:FishManager = this;
        //添加鱼到管理器
        self.fishes.push(fish);
    }

    private RemoveFish(fish:FishActor) {
        let self:FishManager = this;
        //从管理器删除鱼
        var index = self.fishes.indexOf(fish, 0);
        if (index != -1) {
            self.fishes.splice(index, 1);
        }
    }

    public GetFishes():Array<FishActor> {
        let self:FishManager = this;
        //获得鱼
        return self.fishes;
    }

    public GetFishByID(fishid:number):FishActor {
        let self:FishManager = this;
        for (var i=0,length = self.fishes.length;i<length;i++) {
            var fish = self.fishes[i];
            if (fish.GetFishID() == fishid) {
                return fish;
            }
        }
        return null;
    }

    public ClearAllFishes() {
        let self:FishManager = this;
        //清除所有鱼
        for (var i=0,length = self.fishes.length;i<length;i++) {
            var fish = self.fishes[i];
            fish.StopMove();
            if (fish && fish.parent) {
                fish.parent.removeChild(fish);
            }
        }
        self.fishes.splice(0, self.fishes.length);
    }
};