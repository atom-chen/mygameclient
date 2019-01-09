/**
 * Created by eric.liu on 17/11/15.
 *
 * loading
 */

class FishLoading extends eui.Component {
    private fish_loading_progress:eui.Label;
    private fish_loading_bg:eui.Image;
    private callback:Function = null;
    private callbackParam:any = null;
    constructor(callback, obj) {
        super();
        let self:FishLoading = this;
        self.callback = callback;
        self.callbackParam = obj;
        self.createView();
    }

    private createView():void {
        let self:FishLoading = this;
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, self.onConfigComplete, self);
        RES.loadConfig("resource/fish.loading.res.json", "resource/");
    }

    protected createChildren(): void {
        super.createChildren();
        let self:FishLoading = this;
    }

    private onThemeLoadComplete(): void {
        let self:FishLoading = this;
        self.skinName = FishLoadingSkin;
        RES.loadGroup("loading", 1);
    }

    private onConfigComplete(event:RES.ResourceEvent):void {
        let self:FishLoading = this;
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, self.onConfigComplete, self);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, self.onResourceLoadComplete, self);
        let theme = new eui.Theme("resource/fish.loading.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
    }

    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        let self:FishLoading = this;
        if (event.groupName == "loading") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, self.onResourceLoadComplete, self);
            //设置logo
            self.fish_loading_bg.source = 'loading_png';
            if (self.callback) {
                self.callback(self.callbackParam);
            }
        }
    }

    public setProgress(current:number, total:number):void {
        let self:FishLoading = this;
        if (self.fish_loading_progress) {
            let progress:number = current/total * 100;
            var text = progress.toFixed(0);
            self.fish_loading_progress.text = `正在加载(${text}%)...`;
        }
    }

    public setLoadingText(text:string):void {
        let self:FishLoading = this;
        if (self.fish_loading_progress) {
            self.fish_loading_progress.text = text;
        }
    }
}
