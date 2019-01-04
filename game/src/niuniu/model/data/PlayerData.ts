/**
 *
 * @author 
 *
 */
class PlayerData {
	public constructor() {
	}
    public nickname: string = "";
    public gold: string = "";
    public ready: number = 0;
    public fakeuid:number = 0;
    public seatid: number = 0;
    public uid: number = 0;
    public imageid:string="";
    public isMaster:Boolean;
    public isInGame:Boolean;
    public winCount:number=0;
    public lastWinCount:number = 0;
    public sex:number = 0;
    public redcoingot:number = 0;
    public totalwincnt:number = 0;
    public totallosecnt:number = 0;
    public totaldrawcnt:number = 0;
    public gifts:any = [];
}
