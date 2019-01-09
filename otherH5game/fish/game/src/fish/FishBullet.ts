/**
 * Created by eric.liu on 17/11/06.
 *
 * 子弹
 */

class FishBullet extends FishObject {
    public startPoint:egret.Point;
    public endPoint:egret.Point;
    public explode:boolean = true;
    private lastTime:number = 0;
    private duration:number = 0;
    private speed:egret.Point;
    private fromCannon:number = 0;
    private lastDetectionIndex:number = 0;
    private p2Body:p2.Body = null;
    private bulletId:number = 0;

    public IsFish():boolean {return false;}
    public IsBullet():boolean {return true;}
    public Object():any {return this;}
    public P2Body():p2.Body {return this.p2Body;};
    public ResetP2Body() {this.p2Body = null;}

    constructor(type:number, id:number, cannonViewId:number) {
        super();

        let self:FishBullet = this;
        self.touchChildren = false;
        self.touchEnabled = false;
        self.bulletId = id;

        //来自哪个炮台
        self.fromCannon = cannonViewId;

        //创建子弹
        let bmp = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes("zidan");
        self.width = texture.textureWidth
        self.height = texture.textureHeight
        self.anchorOffsetX = self.width/2
        self.anchorOffsetY = self.height/2
        bmp.texture = texture;
        self.addChild(bmp);
        self.speed = egret.Point.create(0, 0);

        //创建物理
        self.p2Body = FishPhysics.GetInstance().AddPhysicalBodyForBullet(self);
    }

    public ReuseBullet(id:number, cannonViewId:number) {
        let self:FishBullet = this;
        self.duration = 0;
        self.lastTime = 0;
        self.fromCannon = cannonViewId;
        self.explode = true;
        self.bulletId = id;
    }

    private CalculateRotation(last:egret.Point, newp:egret.Point):number {
        //计算角度
        var rotat = -Math.atan2(newp.y - last.y, newp.x - last.x) * 180 / Math.PI + 90;
        return rotat;
    }

    public Move(start:egret.Point, end:egret.Point, speed:number=1200):void {
        let self:FishBullet = this;
        //保存信息
        self.startPoint = start;
        self.endPoint = end;
        self.x = start.x;
        self.y = start.y;
        self.lastTime = egret.getTimer();

        //计算角度
        var rotat = self.CalculateRotation(start, end);
        self.rotation = rotat + 90;

        //计算速度
        self.speed.x = Math.cos((90-rotat)*Math.PI/180) * speed / 1000;
        self.speed.y = Math.sin((90-rotat)*Math.PI/180) * speed / 1000;

        //开始定时器事件
        egret.startTick(self.moveBullet, self);
    }

    public MoveToAngle(start:egret.Point, angle:number, speed:number=1200):void {
        let self:FishBullet = this;

        //物理唤醒
        //self.explode = false;
        self.p2Body.wakeUp();
        self.p2Body.position = [start.x, start.y];

        //保存信息
        self.startPoint = start;
        self.x = start.x;
        self.y = start.y;
        self.lastTime = egret.getTimer();

        //计算角度
        self.rotation = angle + 90;

        //计算速度
        self.speed.x = Math.cos((angle)*Math.PI/180) * speed / 1000;
        self.speed.y = Math.sin((angle)*Math.PI/180) * speed / 1000;

        //开始定时器事件
        egret.startTick(self.moveBullet, self);
    }

    public StopMove() {
        let self:FishBullet = this;
        //停止移动
        self.explode = true;
        self.p2Body.sleep();
        egret.stopTick(self.moveBullet, self);
    }

    public Explode() {
        let self:FishBullet = this;

        //物理睡眠
        self.explode = true;
        self.p2Body.sleep();

        //创建爆破网
        var net = FishNetManager.GetInstance().BuildNet(1);
        net.Explode(egret.Point.create(self.x, self.y), self.parent);

        //移除子弹
        egret.stopTick(self.moveBullet, self);
        if (self.parent) self.parent.removeChild(self);

        //回收子弹
        FishBulletManager.GetInstance().DestroyBullet(self);
    }

    private moveBullet(timeStamp:number):boolean {
        let self:FishBullet = this;
        //退出游戏后销毁未爆破的子弹
        if (null == self.stage) {
            egret.stopTick(self.moveBullet, self);
            if (self.parent) {
                self.parent.removeChild(self);
            }
            return true;
        }

        //计算位置
        var now = timeStamp;
        var time = self.lastTime;
        var pass = now - time;
        //if (pass < 20) {
        //    return;
        //}
        if (self.lastTime != 0) {
            self.duration += pass;
        }
        var lastx = self.x;
        var lasty = self.y;
        self.x += self.speed.x * pass;
        self.y += self.speed.y * pass;

        //屏幕反弹
        var rebound:boolean = true;
        var bound:boolean = false;
        if (self.x > self.stage.stageWidth) {
            //碰到右边界
            self.speed.x *= -1;
            lastx = self.stage.stageWidth + (self.stage.stageWidth - lastx);
            self.x = self.stage.stageWidth - (self.x - self.stage.stageWidth);
            bound = rebound = true;
        }
        
        if (self.x < 0) {
            //碰到左边界
            self.speed.x *= -1;
            lastx *= -1;
            self.x *= -1;
            bound = rebound = true;
        }
        
        if (self.y > self.stage.stageHeight) {
            //碰到下边界
            self.speed.y *= -1;
            lasty = self.stage.stageHeight + (self.stage.stageHeight - lasty);
            self.y = self.stage.stageHeight - (self.y - self.stage.stageHeight);
            bound = rebound = true;
        }
        
        if (self.y < 0) {
            //碰到上边界
            self.speed.y *= -1;
            lasty *= -1;
            self.y *= -1;
            bound = rebound = true;
        }

        // //划线测试路线
        // var myShape:egret.Shape = new egret.Shape();
        // myShape.anchorOffsetX = myShape.width/2
        // myShape.anchorOffsetY = myShape.height/2
        // myShape.graphics.lineStyle(5, 0x00ff00, 1);
        // myShape.graphics.moveTo(lastx, lasty);
        // myShape.graphics.lineTo(this.x, this.y);
        // myShape.graphics.endFill();
        // this.parent.addChild(myShape);

        //反弹后重新计算角度
        if (rebound) {
            self.rotation = 90-self.CalculateRotation(egret.Point.create(lastx, lasty), egret.Point.create(self.x, self.y)) + 90;
        }

        //更新物理
        self.p2Body.position = [self.x, self.y];

        // if (bound) {
        //     //测试不反弹
        //     this.parent.removeChild(this);
        //     egret.stopTick(this.moveBullet, this);
        //     return true;
        // }

        //激活子弹
        if (self.duration > 100) {
            self.explode = false;
        }

        self.lastTime = now;
        return false;
    }

    public GetFromCannon():number {
        return this.fromCannon;
    }

    public GetBulletID():number {
        return this.bulletId;
    }
}

//子弹管理
class FishBulletManager {
    //单例
    private static _instance = null;
    public static GetInstance() : FishBulletManager{
        if (FishBulletManager._instance == null){
            FishBulletManager._instance = new FishBulletManager();
            FishBulletManager.GetInstance().InitPool();
        }
        return FishBulletManager._instance;
    }

    private bullets:Array<FishBullet> = [];

    protected InitPool() {
        let self:FishBulletManager = this;
        //初始化对象池
        FishObjectPool.registerPool('bullet_pool_key', function(type, id, cannon):FishBullet {
            return new FishBullet(type, id, cannon);
        }, function(bullet:FishBullet, type, id, cannon):void {
            bullet.ReuseBullet(id, cannon);
        });
        for (var i=0;i<10;i++) {
            //创建子弹对象缓存
            self.DestroyBullet(self.BuildBullet(0, 0, 0));
        }
    }

    public BuildBullet(type:number, id:number, cannon:number):FishBullet {
        let self:FishBulletManager = this;
        //制造子弹
        var bullet = <FishBullet>FishObjectPool.getObject('bullet_pool_key', type, id, cannon);
        self.bullets.push(bullet);
        return bullet;
    }

    public DestroyBullet(bullet:FishBullet) {
        let self:FishBulletManager = this;
        if (!bullet) return;
        //销毁子弹
        bullet.StopMove();
        if (bullet.parent) {
            bullet.parent.removeChild(bullet);
        }
        var index = self.bullets.indexOf(bullet, 0);
        if (index != -1) {
            self.bullets.splice(index, 1);
        }
        FishObjectPool.recycleObject('bullet_pool_key', bullet);
    }

    public ClearAllBullet() {
        let self:FishBulletManager = this;
        //清理所有子弹
        for (var i=0,length=self.bullets.length;i<length;i++) {
            self.DestroyBullet(self.bullets[i]);
        }
    }
}