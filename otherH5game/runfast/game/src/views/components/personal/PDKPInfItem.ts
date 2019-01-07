/**
 * 
 *
 * 
 */

class PDKIPInfItem extends eui.Component {
    private lbName: eui.Label;
    public setName(nickname:string): void {
        this.lbName.text = nickname;
    }
}