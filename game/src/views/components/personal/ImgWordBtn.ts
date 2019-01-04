/**
 * 按钮用图片文字和背景图组合
 * 
 */

class ImgWordBtn extends eui.Component {
    /**
     * 背景图
     */
    private bgImg: eui.Image;
    /**
     * 标题文字
     */
    private titImg:eui.Image;

    /**
     * 新的文字标题
     */
    private newSrc:string;

    /**
     * 
     */
    private infoGroup:eui.Group;

    /**
     * 设置标题
     */
    public setTit(tit: string): void {
        this.titImg.source = tit;
        this.newSrc = tit;
    }

    /**
     * 如果修改过标题就用新标题
     */
    public useNewTit():void{
        if(this.newSrc){
            this.titImg.source = this.newSrc;
        }
    }
    /**
     * 禁止点击,并将图片置灰
     */
    public setDisable():void{
        this.infoGroup.touchEnabled = false;
        this.touchEnabled = false;
        this.bgImg.source = "common_btn_orange2_gray";
        this.useNewTit();
    }

    /**
     * 使能点击,回复图片高亮
     */
    public setEnable():void{
        this.bgImg.source = "common_btn_orange2_n";
        this.infoGroup.touchEnabled = true;
        this.touchEnabled = true;
        this.useNewTit();
    }
}
window["ImgWordBtn"]=ImgWordBtn;