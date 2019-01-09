/**
 * Created by eric.liu on 17/11/06.
 *
 * 金豆
 */

class FishCoin extends egret.DisplayObjectContainer {
    private mc:egret.MovieClip = null;
    private tween:egret.Tween = null;
    private mcs:Array<egret.MovieClip> = [];
    private static mcdatagold:egret.MovieClipData = null;
    private static mcdatasliver:egret.MovieClipData = null;
    private cointype:number = 0;
    private bg:egret.Bitmap = null;
    constructor(coinType:number, coinCount:number) {
        super();

        let self:FishCoin = this;
        self.touchChildren = false;
        self.touchEnabled = false;
        self.cointype = coinType;

        //创建大鱼背景效果
        self.bg = new egret.Bitmap();
        self.bg.texture = RES.getRes('fish_gold_fx');
        self.bg.anchorOffsetX = self.bg.width/2;
        self.bg.anchorOffsetY = self.bg.height/2;
        self.bg.visible = false;
        self.addChild(self.bg);

        //创建金豆动画
        if (null == FishCoin.mcdatagold || null == FishCoin.mcdatasliver) {
            var data = RES.getRes("fish_coin_json");
            var texture = RES.getRes("fish_coin_png");
            var mcDataFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, texture);
            FishCoin.mcdatagold = mcDataFactory.generateMovieClipData("gold");
            FishCoin.mcdatasliver = mcDataFactory.generateMovieClipData("sliver");
        }

        for (var i=0;i<coinCount;i++) {
            var mc = null;
            if (coinType == 1) {
                //金豆
                mc = new egret.MovieClip(FishCoin.mcdatagold)
            } else {
                //银币
                mc = new egret.MovieClip(FishCoin.mcdatasliver)
            }
            self.mcs.push(mc);
            self.addChild(mc);
        }

        self.width = self.mcs[0].width;
        self.height = self.mcs[0].height;
        self.anchorOffsetX = self.$getWidth()/2;
        self.anchorOffsetY = self.$getHeight()/2;
    }

    public ReuseCoin() {
        //null
    }

    public Move(time:number, start:egret.Point, end:egret.Point, goldNumber:number, bgEffect:boolean=false) {
        let self:FishCoin = this;
        //扩散效果
        var coinCount = self.mcs.length;
        var boundSize = 40;
        var arraySize = 2;
        if (coinCount >= 8) arraySize = 4;

        //大鱼背景效果
        if (bgEffect) {
            self.bg.x = start.x;
            self.bg.y = start.y;
            self.bg.scaleX = 0.5;
            self.bg.scaleY = 0.5;
            self.bg.alpha = 1.0;
            self.bg.visible = true;
            egret.Tween.get(self.bg, {loop:false}).to({scaleX:1.0, scaleY:1.0, alpha:0.2}, 600, egret.Ease.bounceIn).call(function(bg) {
                bg.visible = false;
            }, self, [self.bg]);
        }

        //创建数字
        var coinNumber = FishCoinNumberManager.GetInstance().BuildCoinNumber(goldNumber, self.cointype==0);
        coinNumber.x = start.x;
        coinNumber.y = start.y;
        coinNumber.scaleX = 0.5;
        coinNumber.scaleY = 0.5;
        self.addChild(coinNumber);
        egret.Tween.get(coinNumber).to({scaleX:1.0, scaleY:1.0}, 400, egret.Ease.bounceOut);

        for (var i=0;i<coinCount;i++) {
            //播放动作
            self.mcs[i].alpha = 0.1;
            self.mcs[i].x = start.x;
            self.mcs[i].y = start.y;
            self.mcs[i].gotoAndPlay("fly", -1)
            var targetx = start.x + Math.random()*(boundSize*2)-boundSize;
            var targety = start.y + Math.random()*(boundSize*2)-boundSize;
            egret.Tween.get(self.mcs[i])
                .to({x: targetx, y: targety, alpha:1}, 200, egret.Ease.cubicIn)
                .to({y: targety-60}, 200, egret.Ease.bounceOut)
                .wait(i*20)
                .call(function(obj:egret.MovieClip){
                    obj.gotoAndStop('fly');
                }, self, [self.mcs[i]])
                .to({x: start.x-(i%arraySize)*30, y: start.y-Math.floor((i/arraySize))*30}, 200, egret.Ease.bounceIn)
                .wait(coinCount*20+Math.floor((i/arraySize))*50)
                .to({x: start.x})
                .to({x: end.x, y: end.y}, 300, egret.Ease.bounceInOut)
                .call(function(arg, recycle, number) {
                    //最后一个金豆动作完成以后才回收
                    if (recycle) {
                        //回收数字
                        let __number:FishCoinNumber = <FishCoinNumber>number;
                        egret.Tween.removeTweens(__number);
                        FishCoinNumberManager.GetInstance().DestroyCoinNumber(__number);
                        //回收金豆
                        var __this:FishCoin = <FishCoin>arg;
                        FishCoinManager.GetInstance().DestroyCoin(__this);
                    }
                }, self, [self, i==coinCount-1, coinNumber]);
        }
    }

    public StopMove() {
        let self:FishCoin = this;
        var coinCount = self.mcs.length;
        for (var i=0;i<coinCount;i++) {
            egret.Tween.removeTweens(self.mcs[i]);
        }
    }

    public GetCoinCount():number {
        let self:FishCoin = this;
        return self.mcs.length;
    }

    public GetCoinType():number {
        let self:FishCoin = this;
        return self.cointype;
    }
}

//金豆管理
class FishCoinManager {
    //单例
    private static _instance = null;
    public static GetInstance() : FishCoinManager {
        if (FishCoinManager._instance == null){
            FishCoinManager._instance = new FishCoinManager();
            FishCoinManager.GetInstance().InitPool();
        }
        return FishCoinManager._instance;
    }

    private coins:Array<FishCoin> = [];

    protected InitPool() {
        let self:FishCoinManager = this;
        //根据币的类型和数量创建对象池
        for (var i=1;i<=4;i++) {
            FishObjectPool.registerPool('coins_pool_key_gold_'+i*4, function(type, count):FishCoin {
                return new FishCoin(type, count);
            }, function(coin:FishCoin, type, count):void {
                coin.ReuseCoin();
            });
            for (var j=0;j<10;j++) {
                //创建币对象缓存
                self.DestroyCoin(self.BuildCoin(1, i*4));
            }
        }
        for (var i=1;i<=4;i++) {
            FishObjectPool.registerPool('coins_pool_key_sliver_'+i*4, function(type, count):FishCoin {
                return new FishCoin(type, count);
            }, function(coin:FishCoin, type, count):void {
                coin.ReuseCoin();
            });
            for (var j=0;j<10;j++) {
                //创建币对象缓存
                self.DestroyCoin(self.BuildCoin(0, i*4));
            }
        }
    }

    public BuildCoin(type:number, count:number):FishCoin {
        let self:FishCoinManager = this;
        //最少为4个，最多为16个
        count = Math.floor(count/4)*4;
        if (count > 16) {
            count = 16;
        } else if (count < 4) {
            count = 4;
        }

        //制造币
        var coin = null;
        if (type == 1) {
            coin = <FishCoin>FishObjectPool.getObject('coins_pool_key_gold_'+count, type, count);
        } else {
            coin = <FishCoin>FishObjectPool.getObject('coins_pool_key_sliver_'+count, type, count);
        }
        self.coins.push(coin);
        return coin;
    }

    public DestroyCoin(coin:FishCoin) {
        let self:FishCoinManager = this;
        //销毁币
        coin.StopMove();
        if (coin && coin.parent) {
            coin.parent.removeChild(coin);
        }
        var index = self.coins.indexOf(coin, 0);
        if (index != -1) {
            self.coins.splice(index, 1);
        }
        if (coin.GetCoinType() == 1) {
            FishObjectPool.recycleObject('coins_pool_key_gold_'+coin.GetCoinCount(), coin);
        } else {
            FishObjectPool.recycleObject('coins_pool_key_sliver_'+coin.GetCoinCount(), coin);
        }
    }

    public ClearAllCoins() {
        let self:FishCoinManager = this;
        //清除所有币
        for (var i=0, length = self.coins.length;i<length;i++) {
            self.DestroyCoin(self.coins[i]);
        }
    }
}


class FishCoinNumber extends egret.DisplayObjectContainer {
    private bitmapLabel:eui.BitmapLabel = null;
    public static fontSelf:any = null;
    public static fontOther:any = null;
    constructor(number:number, other:boolean=true) {
        super();
        let self:FishCoinNumber = this;
        if (null == FishCoinNumber.fontSelf) {
            FishCoinNumber.fontSelf = RES.getRes('fish_font_2_fnt');
        }
        if (null == FishCoinNumber.fontOther) {
            FishCoinNumber.fontOther = RES.getRes('fish_font_3_fnt');
        }
        self.bitmapLabel = new eui.BitmapLabel('');
        self.addChild(self.bitmapLabel);
        self.ReuseCoinNumber(number, other);
    }

    public ReuseCoinNumber(number:number, other:boolean) {
        let self:FishCoinNumber = this;
        if (!other) {
            self.bitmapLabel.font = FishCoinNumber.fontSelf;
        } else {
            self.bitmapLabel.font = FishCoinNumber.fontOther;
        }
        self.bitmapLabel.text = '+'+number;
        self.bitmapLabel.anchorOffsetX = self.width/2;
        self.bitmapLabel.anchorOffsetY = self.height/2;
    }

    public Destroy() {
    }
}

class FishCoinNumberManager {
    //单例
    private static _instance = null;
    public static GetInstance() : FishCoinNumberManager {
        if (FishCoinNumberManager._instance == null){
            FishCoinNumberManager._instance = new FishCoinNumberManager();
            FishCoinNumberManager.GetInstance().InitPool();
        }
        return FishCoinNumberManager._instance;
    }

    private coinNumbers:Array<FishCoinNumber> = [];

    protected InitPool() {
        let self:FishCoinNumberManager = this;
        //根据币的类型和数量创建对象池
        FishObjectPool.registerPool('coinnumber_pool_key', function(number, other):FishCoinNumber {
            return new FishCoinNumber(number, other);
        }, function(coinnumber:FishCoinNumber, number, other):void {
            coinnumber.ReuseCoinNumber(number, other)
        });
    }

    public BuildCoinNumber(number:number, other:boolean):FishCoinNumber {
        let self:FishCoinNumberManager = this;
        //制造数字
        var coinNumber =  <FishCoinNumber>FishObjectPool.getObject('coinnumber_pool_key', number, other);
        self.coinNumbers.push(coinNumber);
        return coinNumber;
    }

    public DestroyCoinNumber(coinNumber:FishCoinNumber) {
        let self:FishCoinNumberManager = this;
        //销毁数字
        coinNumber.Destroy();
        if (coinNumber && coinNumber.parent) {
            coinNumber.parent.removeChild(coinNumber);
        }
        var index = self.coinNumbers.indexOf(coinNumber, 0);
        if (index != -1) {
            self.coinNumbers.splice(index, 1);
        }
        FishObjectPool.recycleObject('coinnumber_pool_key', coinNumber);
    }
}

class FishBingo extends egret.DisplayObjectContainer {
    private bitmapLabel:eui.BitmapLabel = null;
    private bg1:egret.Bitmap = null;
    private bg2:egret.Bitmap = null;
    private bg3:egret.Bitmap = null;
    public static fontSelf:any = null;
    public static fontOther:any = null;
    constructor(number:number, other:boolean=true) {
        super();
        let self:FishBingo = this;
        self.bg1 = self.loadBitmapFromRes('fx_02');
        self.bg1.anchorOffsetX = self.bg1.width/2;
        self.bg1.anchorOffsetY = self.bg1.height/2;
        self.addChild(self.bg1);
        self.bg2 = self.loadBitmapFromRes('fx_03');
        self.bg2.anchorOffsetX = self.bg2.width/2;
        self.bg2.anchorOffsetY = self.bg2.height/2;
        self.addChild(self.bg2);
        self.bg3 = self.loadBitmapFromRes('fx_01');
        self.bg3.anchorOffsetX = self.bg3.width/2;
        self.bg3.anchorOffsetY = self.bg3.height/2;
        self.addChild(self.bg3);
        if (null == FishCoinNumber.fontSelf) {
            FishCoinNumber.fontSelf = RES.getRes('fish_font_2_fnt');
        }
        if (null == FishCoinNumber.fontOther) {
            FishCoinNumber.fontOther = RES.getRes('fish_font_3_fnt');
        }
        self.bitmapLabel = new eui.BitmapLabel('');
        self.bitmapLabel.width = self.bg3.width;
        self.bitmapLabel.height = 30;
        self.bitmapLabel.anchorOffsetX = self.bitmapLabel.width/2;
        self.bitmapLabel.anchorOffsetY = self.bitmapLabel.height/2;
        self.addChild(self.bitmapLabel);
        self.ReuseFishBingo(number, other);
    }

    public ReuseFishBingo(number:number, other:boolean) {
        let self:FishBingo = this;
        if (!other) {
            self.bitmapLabel.font = FishCoinNumber.fontSelf;
        } else {
            self.bitmapLabel.font = FishCoinNumber.fontOther;
        }
        if (number < 10) {
            self.bitmapLabel.text = '     +'+number;
        } else if (number < 100) {
            self.bitmapLabel.text = '    +'+number;
        } else if (number < 1000) {
            self.bitmapLabel.text = '   +'+number;
        } else if (number < 10000) {
            self.bitmapLabel.text = '  +'+number;
        } else {
            self.bitmapLabel.text = '+'+number;
        }
        self.scaleX = 0.8;
        self.scaleY = 0.8;
        self.bg1.rotation = 0;
        self.bg2.rotation = 0;
        self.bg3.rotation = 0;
        self.bg1.alpha = 1;
        self.bg2.alpha = 1;
        self.bg3.alpha = 1;
        self.bg2.scaleX = 1.0;
        self.bg2.scaleY = 1.0;
        self.bitmapLabel.rotation = 0;
        self.bitmapLabel.alpha = 1;
    }

    public Destroy() {
    }

    public Fire() {
        let self:FishBingo = this;
        var time = 3000;
        egret.Tween.get(self)
            .to({scaleX:0.7, scaleY:0.7}, time/20, egret.Ease.bounceOut)
            .to({scaleX:1, scaleY:1}, time/10, egret.Ease.bounceIn);
        egret.Tween.get(self.bg1, {loop:true}).to({rotation:360, alpha:0}, time);
        egret.Tween.get(self.bg2).to({scaleX:1.2, scaleY:1.2, alpha:0.1}, time/2);
        egret.Tween.get(self.bg3, {loop:true}).to({rotation:360, alpha:0}, time);
        egret.Tween.get(self.bitmapLabel)
            .to({rotation:-30, alpha:0.8}, time/12)
            .to({rotation:60, alpha:0.6}, time/6)
            .to({rotation:-60, alpha:0.4}, time/6)
            .to({rotation:60, alpha:0.2}, time/6)
            .to({rotation:-60, alpha:0}, time/6)
            .call(function(arg) {
                let _self:FishBingo = arg;
                egret.Tween.removeTweens(_self.bg1);
                egret.Tween.removeTweens(_self.bg2);
                egret.Tween.removeTweens(_self.bg3);
                egret.Tween.removeTweens(_self.bitmapLabel);
                FishBingoManager.GetInstance().DestroyBingo(_self);
            }, self, [self]);
    }

    private loadBitmapFromRes(res:string):egret.Bitmap {
        var result:egret.Bitmap = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(res);
        result.texture = texture;
        return result;
    }
}

class FishBingoManager {
    //单例
    private static _instance = null;
    public static GetInstance() : FishBingoManager {
        if (FishBingoManager._instance == null){
            FishBingoManager._instance = new FishBingoManager();
            FishBingoManager.GetInstance().InitPool();
        }
        return FishBingoManager._instance;
    }

    private bingos:Array<FishBingo> = [];

    protected InitPool() {
        let self:FishBingoManager = this;
        //根据币的类型和数量创建对象池
        FishObjectPool.registerPool('bingo_pool_key', function(number, other):FishBingo {
            return new FishBingo(number, other);
        }, function(bingo:FishBingo, number, other):void {
            bingo.ReuseFishBingo(number, other)
        });
    }

    public BuildBingo(number:number, other:boolean):FishBingo {
        let self:FishBingoManager = this;
        //制造数字
        var bingo =  <FishBingo>FishObjectPool.getObject('bingo_pool_key', number, other);
        self.bingos.push(bingo);
        return bingo;
    }

    public DestroyBingo(bingo:FishBingo) {
        let self:FishBingoManager = this;
        if (!bingo) return;
        //销毁数字
        bingo.Destroy();
        if (bingo && bingo.parent) {
            bingo.parent.removeChild(bingo);
        }
        var index = self.bingos.indexOf(bingo, 0);
        if (index != -1) {
            self.bingos.splice(index, 1);
        }
        FishObjectPool.recycleObject('bingo_pool_key', bingo);
    }
}

class FishRedpacket extends egret.DisplayObjectContainer {
    private packet:egret.Bitmap = null;
    constructor() {
        super();
        let self:FishRedpacket = this;

        self.packet = self.loadBitmapFromRes('fish_jiangquan');
        self.packet.anchorOffsetX = self.packet.width/2;
        self.packet.anchorOffsetY = self.packet.height/2;
        self.addChild(self.packet);
    }

    public Fly(start:egret.Point, end:egret.Point) {
        let self:FishRedpacket = this;
        self.x = start.x;
        self.y = start.y;
        self.scaleX = 2;
        self.scaleY = 2;
        egret.Tween.get(self, {loop:true})
            .to({rotation:-30}, 200)
            .to({rotation:0}, 200)
            .to({rotation:30}, 200)
            .to({rotation:0}, 200);
        var deltay = -160;
        if (end.y < 50) {
            deltay = 160;
        }
        egret.Tween.get(self)
            .to({x:end.x, y:end.y+deltay, scaleX:1, scaleY:1}, 1000, egret.Ease.cubicInOut)
            .wait(1000, true)
            .to({x:end.x, y:end.y, scaleX:0.3, scaleY:0.3}, 500, egret.Ease.cubicInOut)
            .call(function(arg) {
                let self:FishRedpacket = arg;
                if (self.parent) self.parent.removeChild(self);
                egret.Tween.removeTweens(self);
            }, self, [self])
    }

    private loadBitmapFromRes(res:string):egret.Bitmap {
        var result:egret.Bitmap = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(res);
        result.texture = texture;
        return result;
    }
}