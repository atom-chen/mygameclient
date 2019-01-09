/**
 * Created by eric.liu on 17/11/06.
 *
 * 网
 */

class FishNet extends egret.DisplayObjectContainer {
    private mc:egret.MovieClip = null;
    private netType:number = 0;
    private netBitmap:egret.Bitmap = null;
    constructor(netType:number) {
        super();

        let self:FishNet = this;
        self.touchChildren = false;
        self.touchEnabled = false;

        //创建网
        self.netType = netType;
        if (netType == 0) {
            //帧动画网
            var data = RES.getRes("net_json");
            var texture = RES.getRes("net_png");
            var mcDataFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, texture);
            var mcdata = mcDataFactory.generateMovieClipData("net")
            self.mc = new egret.MovieClip(mcdata);
            self.mc.anchorOffsetX = self.mc.$getWidth()/2;
            self.mc.anchorOffsetY = self.mc.$getHeight()/2;
            self.mc.frameRate = 9;
            self.mc.scaleX = 1.5;
            self.mc.scaleY = 1.5;
            self.mc.touchEnabled = false;
            self.mc.addEventListener(egret.Event.COMPLETE, (e:egret.Event)=>{
                if (self.parent) {
                    self.parent.removeChild(self);
                }
                FishNetManager.GetInstance().DestroyNet(self);
            }, self);
            self.mc.stop();
            self.addChild(self.mc);
        } else if (netType == 1) {
            //单图缓动网
            self.netBitmap = new egret.Bitmap();
            var texture = RES.getRes('wang');
            self.netBitmap.texture = texture;
            self.netBitmap.anchorOffsetX = self.netBitmap.width/2;
            self.netBitmap.anchorOffsetY = self.netBitmap.height/2;
            self.addChild(self.netBitmap);
        }
    }

    public ReuseNet() {
        
    }

    public Explode(pos:egret.Point, parent:egret.DisplayObjectContainer) {
        let self:FishNet = this;
        self.x = pos.x;
        self.y = pos.y;
        //爆破效果
        if (self.netType == 0) {
            self.mc.gotoAndPlay("explode", 1);
        } else if (self.netType == 1) {
            self.netBitmap.scaleX = 1;
            self.netBitmap.scaleY = 1;
            self.netBitmap.alpha = 1;
            egret.Tween.get(self.netBitmap)
                .to({scaleX:1.1, scaleY:1.1}, 200, egret.Ease.backInOut)
                .to({alpha:0}, 300)
                .call(function(arg) {
                    let self:FishNet = arg;
                    egret.Tween.removeTweens(self.netBitmap);
                    if (self.parent) {
                        self.parent.removeChild(self);
                    }
                    FishNetManager.GetInstance().DestroyNet(self);
                }, self, [self]);
        }
        if (parent) {
            parent.addChild(self);
        }
    }
}

//网管理
class FishNetManager {
    //单例
    private static _instance = null;
    public static GetInstance() : FishNetManager{
        if (FishNetManager._instance == null){
            FishNetManager._instance = new FishNetManager();
            FishNetManager.GetInstance().InitPool();
        }
        return FishNetManager._instance;
    }

    private nets:Array<FishNet> = [];

    protected InitPool() {
        let self:FishNetManager = this;
        //初始化对象池
        FishObjectPool.registerPool('net_pool_key', function(type):FishNet {
            return new FishNet(type);
        }, function(net:FishNet, type):void {
            net.ReuseNet();
        });
        for (var i=0;i<10;i++) {
            //创建币对象缓存
            self.DestroyNet(self.BuildNet(1));
        }
    }

    public BuildNet(type:number):FishNet {
        let self:FishNetManager = this;
        //制造网
        var net = <FishNet>FishObjectPool.getObject('net_pool_key', type);
        self.nets.push(net);
        return net;
    }

    public DestroyNet(net:FishNet) {
        let self:FishNetManager = this;
        if (!net) return;
        //销毁网
        if (net.parent) {
            net.parent.removeChild(net);
        }
        var index = self.nets.indexOf(net, 0);
        if (index != -1) {
            self.nets.splice(index, 1);
        }
        FishObjectPool.recycleObject('net_pool_key', net);
    }

    public ClearAllNets() {
        let self:FishNetManager = this;
        //清除所有网
        for (var i=0,length=self.nets.length;i<length;i++) {
            self.DestroyNet(self.nets[i]);
        }
    }
}