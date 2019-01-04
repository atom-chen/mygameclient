/**
 * 
 *
 * 
 */

class GCardsGold extends eui.Component {
    // protected lbName: eui.Label;
    protected gold: eui.BitmapLabel;

    protected setData(gold:any): void {
        
        if(!gold || gold == null){
            gold = 0;
        }
        this.gold.text = gold;
    }
}
window["GCardsGold"]=GCardsGold;