/**
 * Created by eric.liu on 17/12/28.
 *
 * 输入框
 */

class FishInput extends eui.TextInput {
    public promptDisplay:eui.Label;
    public textDisplay:eui.EditableText;
    constructor() {
        super();
        let self:FishInput = this;
        self.skinName = FishInputSkin;
    }

    createChildren(): void {
        super.createChildren();
        let self:FishInput = this;
    }

    public SetPlaceHolder(text:string):void {
        let self:FishInput = this;
        self.promptDisplay.text = text;
    }
}