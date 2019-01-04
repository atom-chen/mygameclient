/**
 *
 * @author 
 *
 */
class BetBtn2 extends eui.Component {
    private gold: eui.BitmapLabel;
    private btn: eui.Button;
    public constructor() {
        super();
    }

    protected createChildren(): void {
        
    }

    public set Bet(value: string) {      
        this.gold.text = value + "倍";
    }
}

window["BetBtn2"]=BetBtn2;