/**
 *
 * @author 
 *
 */
class CCDDZRedRankInfo extends eui.ItemRenderer {
    public constructor() {
        super();
    }

    private rank1: eui.Image;
    private rank2: eui.Image;
    private rank3: eui.Image;
    private back: eui.Image;
    private back1: eui.Image;
    private back2: eui.Image;
    private back3: eui.Image;
    private score: eui.Label;
    private rank: eui.Label;
    private nickname: eui.Label;

    protected dataChanged(): void {
        super.dataChanged();
        if(this.data) {
            this.data.score = this.data.score || 0;
            this.data.ranking = this.data.ranking || 0;
            var uid: number = this.data.uid;
            var rank: number = this.data.ranking;
            if(uid == CCDDZMainLogic.instance.selfData.uid) {
                this.score.textColor = 0xF1FF00;
                this.nickname.textColor = 0xF1FF00;
                this.rank.textColor = 0xF1FF00;
            }
            else {
                this.score.textColor = 0xffffff;
                this.nickname.textColor = 0xffffff;
                this.rank.textColor = 0xffffff;
            }
            this.score.text = CCDDZUtils.exchangeRatio(this.data.score/100,true);
            this.nickname.text = this.data.nickname;
            this.nickname.text =  this.nickname.text.substr(0,10);
            this.rank1.visible = rank == 1;
            this.rank2.visible = rank == 2;
            this.rank3.visible = rank == 3;
            this.back1.visible = rank == 1;
            this.back2.visible = rank == 2;
            this.back3.visible = rank == 3;
            if (rank==0)
                this.rank.text = "--"
            else
                this.rank.text = rank + "";
            this.rank.visible = (rank > 3 || rank<1);
            this.back.visible = (rank > 3 || rank < 1);
        }
    }
}

window["CCDDZRedRankInfo"]=CCDDZRedRankInfo;