/**
 * Created by eric.liu on 17/11/22.
 *
 * 基础
 */

class FishPanelBase extends eui.Component {
    createChildren(): void {
        super.createChildren();
    }

    protected _show(parent:eui.Group): void {
        let self:FishPanelBase = this;

        parent.touchEnabled = true;
        self.x = parent.width/2;
        self.y = parent.height/2;
        parent.addChild(self);

        egret.Tween.get(self)
            .to({scaleX:1.1, scaleY:1.1}, 150, egret.Ease.backIn)
            .to({scaleX:1, scaleY:1}, 150, egret.Ease.backOut);
    }

    protected _hide(callback=null, obj=null): void {
        let self:FishPanelBase = this;
        egret.Tween.get(self)
            .to({scaleX:0.8, scaleY:0.8}, 80, egret.Ease.backIn)
            .to({scaleX:0.9, scaleY:0.9}, 80, egret.Ease.backOut)
            .call(function(arg, callback, obj) {
                let self:FishPanelBase = arg;
                let parent:eui.Group = <eui.Group>self.parent;
                parent.removeChild(self);
                if (parent.numChildren == 0) {
                    parent.touchEnabled = false;
                }
                if (callback) callback(obj);
            }, self, [self, callback, obj]);
    }
}