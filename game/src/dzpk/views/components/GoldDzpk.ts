/**
 * Created by rockyl on 15/12/30.
 *
 * 金豆展示类,自带金豆比率处理
 */

class GoldDzpk extends eui.Component {
    public imgIcon: eui.Image;
    public labGold: eui.Label;
    private bgImg:eui.Image;
    private _nGold:number;

    private _properties:any;

    private _updateProperties():void{
        if(this._properties){
            let p = this._properties;
            let priKey = "";
            for(let key in p){
                this[key] = p[key].v;
            }
        }
    }

    public set properties(arr){
        let objs = arr;
        if(typeof(arr) == "string"){
            let len = arr.length;
            if(arr["0"] == '[' && arr[len-1] == ']'){
                arr = arr.substr(1,len-2);
            }
            objs = JSON.parse(arr);
        }

        this._properties = objs;

        for(let key in objs){
            let info = objs[key];
            let attr = info.attr;
            let priKey = "_" + key;
            Object.defineProperty(this,key,{
                set:function(val){
                    this[priKey] = val;
                    if(this[info.obj]){
                        if(key == "scale"){
                            this[info.obj]["scaleX"] = this[info.obj]["scaleY"] = val;
                        }else{
                            this[info.obj][attr] = val;
                        }
                    }
                },
                get:function(){
                    return this[priKey]
                },
                enumerable: true,
                configurable: true
            });

            this[key] = info.v;
        }
    }

    createChildren(): void {
        super.createChildren();
        this._updateProperties();
        this._nGold = 0;
    }


    /**
     * 10万以内显示精确数字，100万以内显示xx.x万，大于等于100万显示x万
     */
    private _formatGold(nGold:number):string{
        let _str = "" + nGold;
        if (nGold >= 1000000){
            _str = _str.substring(0,_str.length - 4) + "万";
        }
        else if(nGold > 100000){
            _str = _str.substr(0,2) + "." + _str.substr(2,1) + "万";
        }
        return _str;
    }

    updateGold(gold: number): void {
        if(this.labGold) {
            if(gold == null){
                gold = 0;
            }else if(gold == undefined){
                return;
            }
            this._nGold = gold;
            this.labGold.text = this._formatGold(gold);
        }
    }

    getGold():number{
        return this._nGold || 0;
    }

    setEmpty(): void {
        this.labGold.text = '';
    }

    //显示钻石
    showDiamond():void{
        this.imgIcon.source = "icon_diamond";
    }

    /**
     * 获取中心点的世界坐标
     */
    getCGPos():any{
        let w = this.width;
        let h = this.height;
        return this.localToGlobal(w*0.5*this.scaleX,h*0.5*this.scaleY);
    }

    /**
     * 获取图标中心点的世界坐标
     */
    getICGPos():any{
        let obj = this.imgIcon;
        let w = obj.width;
        let h = obj.height;
        return this.localToGlobal(w*0.5*obj.scaleX,h*0.5*obj.scaleY);
    }

    setType(isMatch: boolean,matchType: number = 0): void {

    }
}
window["GoldDzpk"]=GoldDzpk;