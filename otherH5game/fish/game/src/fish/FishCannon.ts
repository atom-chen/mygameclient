/**
 * Created by eric.liu on 17/11/06.
 *
 * 炮台
 */

class FishCannon extends eui.Component {
    private fish_btn_cannon_up:eui.Button;
    private fish_btn_cannon_down:eui.Button;
    private fish_cannon_bg:eui.Image;
    private fish_label_cannon_level_other:eui.BitmapLabel;
    private fish_label_cannon_level_self:eui.BitmapLabel;
    private fish_label_cannon_wait:eui.Label;
    private fish_cannon_container:eui.Panel;
    private fish_img_self_flag:eui.Image;
    private fish_img_self_flag2:eui.Image;
    private viewID:number = 0;
    private mc:egret.MovieClip = null;
    private bulletId:number = 1;
    private fireAngle:number = 0;
    private mutilple:number = 0;
    private mutilples:Array<number> = [];
    constructor() {
        super();
        let self:FishCannon = this;
        self.touchEnabled = false;
        self.addEventListener(eui.UIEvent.COMPLETE, self.uiCompHandler, self);
        self.addEventListener(egret.Event.RESIZE, self.uiResizeHandler, self);
        self.skinName = FishCannonSkin;
    }

    private uiCompHandler():void {
        let self:FishCannon = this;
        self.currentState = "wait";
        switch(self.name) {
            case 'cannon1':self.SetViewID(1);break;
            case 'cannon2':self.SetViewID(2);break;
            case 'cannon3':self.SetViewID(3);break;
            case 'cannon4':self.SetViewID(4);break;
        }

        self.fish_btn_cannon_up.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_btn_cannon_down.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
    }

    private uiResizeHandler():void {
    }

    private btnTouchHandler(event:egret.TouchEvent):void {
        let self:FishCannon = this;
        switch(event.target) {
            case self.fish_btn_cannon_up:
                var length = self.mutilples.length;
                if (length == 0) return;
                var index = self.mutilples.indexOf(self.mutilple);
                if (index == -1 || index == length-1) {
                    self.SetMultiple(self.mutilples[0]);
                } else {
                    self.SetMultiple(self.mutilples[index+1]);
                }
                break;
            case self.fish_btn_cannon_down:
                var length = self.mutilples.length;
                if (length == 0) return;
                var index = self.mutilples.indexOf(self.mutilple);
                if (index == 0) {
                    self.SetMultiple(self.mutilples[length-1]);
                } else {
                    self.SetMultiple(self.mutilples[index-1]);
                }
                break;
        }
        egret.Tween.get(event.target)
            .to({scaleX:1.2, scaleY:1.2}, 150, egret.Ease.backIn)
            .to({scaleX:1, scaleY:1}, 150, egret.Ease.backOut);
    }

    protected createChildren():void {
        super.createChildren();
        let self:FishCannon = this;
        //动画
        var data = RES.getRes("gun_json");
        let texture:egret.Texture = RES.getRes("gun_png");
        var mcDataFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, texture);
        var mcdata = mcDataFactory.generateMovieClipData("pao")
        self.mc = new egret.MovieClip(mcdata);
        self.mc.anchorOffsetX = self.mc.width/2;
        self.mc.anchorOffsetY = 160;
        self.mc.frameRate = 9;
        self.mc.touchEnabled = false;
        self.mc.x = self.fish_cannon_container.width/2;
        self.mc.y = self.fish_cannon_container.height;
        self.fish_cannon_container.addChild(self.mc);
    }

    public FireTo(to:egret.Point):FishBullet {
        let self:FishCannon = this;
        //计算炮台角度
        var angle = -Math.atan2(to.y - self.y, to.x - self.x) * 180 / Math.PI;
        //限制自己的发炮角度
        if (angle < 10) {
            angle = 10;
        }
        if (angle > 170) {
            angle = 170;
        }
        return self.FireToAngle(angle);
    }

    public FireToAngle(angle:number):FishBullet {
        let self:FishCannon = this;
        self.fireAngle = angle;

        //纠正角度
        self.mc.rotation = 90 - angle;
        if (self.viewID > 2) {
            angle = 180 - angle;
        }

        //发射子弹
        self.mc.gotoAndPlay("fire", 1);
        var bullet = FishBulletManager.GetInstance().BuildBullet(0, self.bulletId++, self.viewID);
        bullet.MoveToAngle(egret.Point.create(self.x, self.y), angle)

        //声音
        FishSoundManager.GetInstance().PlayShot();
        return bullet;
    }

    public GetFireAngle():number {
        let self:FishCannon = this;
        return self.fireAngle;
    }

    public SetViewID(viewId:number) {
        let self:FishCannon = this;
        //设置炮台ID
        self.viewID = viewId;

        //对面玩家的信息旋转
        if (viewId > 2) {
            self.fish_label_cannon_wait.rotation = 180;
            self.fish_label_cannon_level_other.rotation = 180;
        }

        //将炮台加入管理器
        FishCannonManager.GetInstance().AddCannon(self);
    }

    public GetViewID():number {
        return this.viewID;
    }

    public ShowCannon(show:boolean, myself:boolean=false) {
        let self:FishCannon = this;
        self.fish_img_self_flag.visible = false;
        self.fish_img_self_flag2.visible = false;
        if (show) {
            if (myself) {
                self.currentState = "self";
                self.fish_img_self_flag.visible = true;
                self.fish_img_self_flag2.visible = true;
                egret.Tween.get(self.fish_img_self_flag, {loop:true})
                    .to({scaleX:1.0, scaleY:1.0}, 500)
                    .to({scaleX:0.7, scaleY:0.7}, 500);
                egret.setTimeout(function(arg:any) {
                    let __this:FishCannon = arg;
                    __this.fish_img_self_flag.visible = false;
                    __this.fish_img_self_flag2.visible = false;
                    egret.Tween.removeTweens(__this.fish_img_self_flag);
                }, self, 5000, self);
            } else {
                self.currentState = "other";
            }
        } else {
            self.currentState = "wait";
        }

        if (self.mutilple > 0) {
            self.SetMultiple(self.mutilple);
        }
    }

    public SetMultiples(mults:Array<number>) {
        let self:FishCannon = this;
        self.mutilples = mults;
        if (self.mutilples.length > 0 && (self.mutilple == 0 || self.mutilple < self.mutilples[0] || self.mutilple > self.mutilples[self.mutilples.length-1])) {
            self.SetMultiple(self.mutilples[0]);
        }
    }

    public SetMultiple(multi:number) {
        let self:FishCannon = this;
        if (self.mutilple == multi) {
            return;
        }
        if (self.mutilples.indexOf(multi) == -1) {
            return;
        }
        if (multi < 10) {
            self.fish_label_cannon_level_other.text = '   '+multi;
            self.fish_label_cannon_level_self.text = '   '+multi;
        } else if (multi < 100) {
            self.fish_label_cannon_level_other.text = '  '+multi;
            self.fish_label_cannon_level_self.text = '  '+multi;
        } else {
            self.fish_label_cannon_level_other.text = ' '+multi;
            self.fish_label_cannon_level_self.text = ' '+multi;
        }
        self.mutilple = multi;
    }

    public GetMultiple():number {
        let self:FishCannon = this;
        return self.mutilple;
    }

    public ShowBingo(number:number) {
        let self:FishCannon = this;
        if (null == FishScene.instance.GetFishGround()) return;
        var bingo = FishBingoManager.GetInstance().BuildBingo(number, self.viewID != FishPhysics.GetInstance().selfViewId);
        bingo.x = self.x;
        bingo.y = self.y-180;
        FishScene.instance.GetFishGround().addChild(bingo);
        bingo.Fire();
    }
}

//鱼管理
class FishCannonManager {
    //单例
    private static _instance = null;
    public static GetInstance() : FishCannonManager{
        if (FishCannonManager._instance == null){
            FishCannonManager._instance = new FishCannonManager();
        }
        return FishCannonManager._instance;
    }

    private cannons:Array<FishCannon> = [];

    public AddCannon(cannon:FishCannon) {
        let self:FishCannonManager = this;
        //添加炮台
        self.cannons.push(cannon);
    }

    public RemoveCannon(cannon:FishCannon) {
        let self:FishCannonManager = this;
        //删除炮台
        var index = self.cannons.indexOf(cannon, 0);
        if (index != -1) {
            self.cannons.splice(index, 1);
        }
    }

    public GetCannons():Array<FishCannon> {
        let self:FishCannonManager = this;
        //获得炮台
        return self.cannons;
    }

    public GetCannon(viewId:number):FishCannon {
        let self:FishCannonManager = this;
        //根据viewId获取炮台
        for (var i=0, length = self.cannons.length;i<length;i++) {
            if (self.cannons[i].GetViewID() == viewId) {
                return self.cannons[i];
            }
        }
        return null;
    }
};