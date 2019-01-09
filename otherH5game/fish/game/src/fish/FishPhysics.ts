/**
 * Created by eric.liu on 17/11/14.
 *
 * 物理
 */

class FishObject extends egret.DisplayObjectContainer {
    IsFish():boolean {return false;}
    IsBullet():boolean {return false;}
    Object():any {return null;}
    P2Body():p2.Body {return null;};
    ResetP2Body() {}
}

class FishPhysics {
    //单例
    private static _instance = null;
    public static GetInstance() : FishPhysics{
        if (FishPhysics._instance == null){
            FishPhysics._instance = new FishPhysics();
            FishPhysics._instance.CreateWorld();
        }
        return FishPhysics._instance;
    }

    private factor:number = 32.0;
    private world:p2.World = null;
    private debugDraw:FishPhysicsDraw = null;
    public selfViewId:number = 0;

    protected CreateWorld(): p2.World {
        let self:FishPhysics = this;
        //创建无重力世界
        var wrd: p2.World = new p2.World();
        wrd.sleepMode = p2.World.BODY_SLEEPING;
        wrd.gravity = [0, 0];
        self.world = wrd;
        //添加事件监听
        self.world.on('beginContact', function(event) {
            //发生碰撞后触发
            let bodyA:p2.Body = event.bodyA;
            let bodyB:p2.Body = event.bodyB;
            //获取绑定对象
            let objectA:FishObject = <FishObject>bodyA.displays[0];
            let objectB:FishObject = <FishObject>bodyB.displays[0];
            if (null == objectA || null == objectB) {
                return;
            }
            //同是鱼和子弹则不碰撞
            if ((objectA.IsFish() && objectB.IsFish()) || (objectA.IsBullet() && objectB.IsBullet())) {
                return;
            }
            //处理碰撞
            let fish:FishActor = null;
            let bullet:FishBullet = null;
            if (objectA.IsFish()) {
                fish = <FishActor>objectA;
                bullet = <FishBullet>objectB;
            } else {
                fish = <FishActor>objectB;
                bullet = <FishBullet>objectA;
            }
            //已经是死鱼或爆破的子弹不碰撞
            if (fish.explode || bullet.explode) {
                return;
            }
            //如果是自己发射的子弹
            if (bullet.GetFromCannon() == self.selfViewId) {
                //打中鱼效果
                fish.Beat();
                //发送打中鱼消息给服务端
                fishServer.catchFish(bullet.GetBulletID(), fish.GetFishID());
            }
            //子弹爆炸
            bullet.Explode();
        });
        return wrd;
    }

    public Wakeup() {
        let self:FishPhysics = this;
        //唤醒
        self.world.sleepMode = p2.World.NO_SLEEPING;
    }

    public Sleep() {
        let self:FishPhysics = this;
        //睡眠
        self.world.sleepMode = p2.World.BODY_SLEEPING;
    }

    public AddPhysicalBodyForFish(fish:FishActor):p2.Body {
        let self:FishPhysics = this;
        //为鱼添加物理body，缩小碰撞范围
        var boxShape: p2.Shape = new p2.Box({width: fish.width*0.9, height: fish.height*0.9});
        var boxBody: p2.Body = new p2.Body(
            {
                mass: 1,
                position: [fish.x, fish.y],
                fixedRotation: true,
                type: p2.Body.DYNAMIC,
                inertia: 0,
                angularForce: 0,
                force: 0
            });
        boxBody.addShape(boxShape);
        boxBody.displays = [fish];
        self.world.addBody(boxBody);
        return boxBody;
    }

    public RemovePhysicalBodyForFish(fish:FishActor) {
        let self:FishPhysics = this;
        //为鱼移除物理body
        self.world.removeBody(fish.P2Body());
        fish.ResetP2Body();
    }

    public AddPhysicalBodyForBullet(bullet:FishBullet):p2.Body {
        let self:FishPhysics = this;
        //为子弹添加物理body，以点为碰撞区域（1*1）
        var boxShape: p2.Shape = new p2.Box({width: 1/self.factor, height: 1/self.factor});
        var boxBody: p2.Body = new p2.Body(
            {
                mass: 1,
                position: [bullet.x, bullet.y],
                fixedRotation: true,
                type: p2.Body.DYNAMIC,
                inertia: 0,
                angularForce: 0,
                force: 0
            });
        boxBody.addShape(boxShape);
        boxBody.displays = [bullet];
        self.world.addBody(boxBody);
        return boxBody;
    }

    public RemovePhysicalBodyForBullet(bullet:FishBullet) {
        let self:FishPhysics = this;
        //为子弹移除物理body
        self.world.removeBody(bullet.P2Body());
        bullet.ResetP2Body();
    }

    public CreateDebugDraw(parent:egret.DisplayObjectContainer): void {
        let self:FishPhysics = this;
        //创建物理效果实时调试界面
        self.debugDraw = new FishPhysicsDraw(self.world);
        var sprite: egret.Sprite = new egret.Sprite();
        if (parent) parent.addChild(sprite);
        self.debugDraw.setSprite(sprite);
    }

    public Update(): void {
        let self:FishPhysics = this;
        //物理世界步进
        self.world.step(60/1000);
        if (self.debugDraw) self.debugDraw.drawDebug();
    }
}

class FishPhysicsDraw {
    private sprite: egret.Sprite;
    private world: p2.World;
    private COLOR_D_SLEEP: number = 0x999999;
    private COLOR_D_WAKE: number = 0xe5b2b2;
    private COLOR_K: number = 0x7f7fe5;
    private COLOR_S: number = 0x7fe57f;

    public constructor(world: p2.World) {
        this.world = world;
    }
    public setSprite(sprite: egret.Sprite) {
        this.sprite = sprite;
    }
    public drawDebug(): void {
        this.sprite.graphics.clear();

        var l: number = this.world.bodies.length;
        for (var i: number = 0; i < l; i++) {
            var body: p2.Body = this.world.bodies[i];
            if (body.sleepState == p2.Body.SLEEPING || body.sleepState == p2.Body.SLEEPY) {
                continue;
            }
            for (var j: number = 0; j < body.shapes.length; j++) {
                var shape: p2.Shape = body.shapes[j];
                if (shape instanceof p2.Convex) {
                    this.drawConvex(<p2.Convex>shape, body);
                } else if (shape instanceof p2.Circle) {
                    this.drawCircle(<p2.Circle>shape, body);
                } else if (shape instanceof p2.Line) {
                    this.drawLine(<p2.Line>shape, body);
                } else if (shape instanceof p2.Particle) {
                    this.drawParticle(<p2.Particle>shape, body);
                } else if (shape instanceof p2.Plane) {
                    this.drawPlane(<p2.Plane>shape, body);
                } else if (shape instanceof p2.Capsule) {
                    this.drawCapsule(<p2.Capsule>shape, body);
                }
            }
        }
    }
    private drawCircle(shape: p2.Circle, b: p2.Body): void {
        var color: number = this.getColor(b);

        var g: egret.Graphics = this.sprite.graphics;
        g.lineStyle(1, color);
        g.beginFill(color, 0.5);
        g.drawCircle(b.position[0], b.position[1], shape.radius);

        var edge: number[] = new Array();
        b.toWorldFrame(edge, [shape.radius, 0]);
        g.moveTo(b.position[0], b.position[1]);
        g.lineTo(edge[0], edge[1]);

        g.endFill();
    }
    private drawCapsule(shape: p2.Capsule, b: p2.Body): void {
        var color: number = this.getColor(b);

        var len: number = shape.length;
        var radius: number = shape.radius;

        var p1: number[] = new Array(), p2: number[] = new Array(), p3: number[] = new Array(), p4: number[] = new Array();
        var a1: number[] = new Array(), a2: number[] = new Array();

        b.toWorldFrame(p1, [-len / 2, -radius]);
        b.toWorldFrame(p2, [len / 2, -radius]);
        b.toWorldFrame(p3, [len / 2, radius]);
        b.toWorldFrame(p4, [-len / 2, radius]);
        b.toWorldFrame(a1, [len / 2, 0]);
        b.toWorldFrame(a2, [-len / 2, 0]);

        var g: egret.Graphics = this.sprite.graphics;
        g.lineStyle(1, color);
        g.beginFill(color, 0.5);
        g.drawCircle(a1[0], a1[1], radius);
        g.endFill();
        g.lineStyle(1, color);
        g.beginFill(color, 0.5);
        g.drawCircle(a2[0], a2[1], radius);
        g.endFill();

        g.lineStyle(1, color);
        g.beginFill(color, 0.5);
        g.moveTo(p1[0], p1[1]);
        g.lineTo(p2[0], p2[1]);
        g.lineTo(p3[0], p3[1]);
        g.lineTo(p4[0], p4[1]);

        g.endFill();
    }
    private drawLine(shape: p2.Line, b: p2.Body): void {
        var color: number = this.getColor(b);

        var len: number = shape.length;

        var p1: number[] = new Array(), p2: number[] = new Array();

        b.toWorldFrame(p1, [-len / 2, 0]);
        b.toWorldFrame(p2, [len / 2, 0]);

        var g: egret.Graphics = this.sprite.graphics;

        g.lineStyle(1, color);
        g.moveTo(p1[0], p1[1]);
        g.lineTo(p2[0], p2[1]);

        g.endFill();
    }
    private drawParticle(shape: p2.Particle, b: p2.Body): void {
        var color: number = this.getColor(b);

        var g: egret.Graphics = this.sprite.graphics;
        g.lineStyle(1, color);
        g.beginFill(color, 0.5);
        g.drawCircle(b.position[0], b.position[1], 1);
        g.endFill();

        g.lineStyle(1, color);
        g.drawCircle(b.position[0], b.position[1], 5);
        g.endFill();
    }
    private drawConvex(shape: p2.Convex, b: p2.Body): void {
        var color: number = this.getColor(b);

        var l: number = shape.vertices.length;
        var g: egret.Graphics = this.sprite.graphics;
        g.lineStyle(1, color);
        g.beginFill(color, 0.5);

        var worldPoint: number[] = new Array();
        b.toWorldFrame(worldPoint, shape.vertices[0]);
        //g.moveTo(worldPoint[0], worldPoint[1]);
        g.moveTo(b.position[0], b.position[1]);
        g.lineTo(worldPoint[0], worldPoint[1]);
        for (var i: number = 1; i <= l; i++) {
            b.toWorldFrame(worldPoint, shape.vertices[i % l]);
            g.lineTo(worldPoint[0], worldPoint[1]);
        }


        g.endFill();
    }

    private drawPlane(shape: p2.Plane, b: p2.Body): void {
        var color: number = this.COLOR_D_SLEEP;
        var g: egret.Graphics = this.sprite.graphics;
        g.lineStyle(1, color);
        g.beginFill(color, 1);

        var start: number[] = new Array();
        var end: number[] = new Array();
        b.toWorldFrame(start, [-1000, 0]);
        g.moveTo(start[0], start[1]);

        b.toWorldFrame(end, [1000, 0]);
        g.lineTo(end[0], end[1]);

        b.toWorldFrame(end, [1000, -1000]);
        g.lineTo(end[0], end[1]);

        b.toWorldFrame(end, [-1000, -1000]);
        g.lineTo(end[0], end[1]);

        b.toWorldFrame(end, [-1000, -0]);
        g.lineTo(end[0], end[1]);

        g.endFill();

    }

    private getColor(b: p2.Body): number {
        var color: number = this.COLOR_D_SLEEP;
        if (b.type == p2.Body.KINEMATIC) {
            color = this.COLOR_K;
        } else if (b.type == p2.Body.STATIC) {
            color = this.COLOR_S;
        } else if (b.sleepState == p2.Body.AWAKE) {
            color = this.COLOR_D_WAKE;
        }

        return color;
    }
}