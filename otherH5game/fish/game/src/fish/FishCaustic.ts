/**
 * Created by eric.liu on 17/12/1.
 *
 * 水波
 */

class FishCaustic extends egret.DisplayObjectContainer {
    private static mcdatacaustic:egret.MovieClipData = null;
    private mcs:Array<egret.MovieClip> = [];
    constructor() {
        super();
        let self:FishCaustic = this;
        self.touchChildren = false;
        self.touchEnabled = false;
        if (FishCaustic.mcdatacaustic == null) {
            var data = RES.getRes("caustic_json");
            var texture = RES.getRes("caustic_png");
            var mcDataFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, texture);
            FishCaustic.mcdatacaustic = mcDataFactory.generateMovieClipData("caustic");
        }

        for (var i=0;i<15;i++) {
            var mc = new egret.MovieClip(FishCaustic.mcdatacaustic);
            mc.frameRate = 5;
            self.mcs.push(mc);
        }
    }

    public Move() {
        let self:FishCaustic = this;
        self.width = self.stage.stageWidth;
        self.height = self.stage.stageHeight;
        self.x = 0;
        self.y = 0;
        for (var i=0,length=self.mcs.length;i<length;i++) {
            let mc:egret.MovieClip = self.mcs[i];
            mc.x = (i%5)*256;
            mc.y = Math.floor(i/5)*256;
            self.addChild(mc);
            var time = mc.totalFrames*(1000/5);
            mc.alpha = 0;
            egret.Tween.get(mc, {loop:true})
                .wait(Math.random()*2000)
                .call(function(_mc) {
                    _mc.gotoAndPlay('move');
                }, self, [mc])
                .to({alpha:1.0}, time/2)
                .to({alpha:0}, time/2);
        }
    }
}