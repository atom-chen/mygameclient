/**
 * 
 *
 * 
 */

class DetailItem extends eui.Component {
    protected lbName: eui.Label;
    protected lbGold: eui.Label;

    protected setData(name:any, gold:any): void {
        this.lbName.text = name;
        if(!gold || gold == null){
            gold = 0;
        }
        if(gold >= 0 ){
            this.lbGold.text = '+' + gold;
            this.lbGold.textColor = 0x68eb0c
        }else{
            this.lbGold.text = gold;
            this.lbGold.textColor = 0xfd1717
        }
    }
}
window["DetailItem"]=DetailItem;