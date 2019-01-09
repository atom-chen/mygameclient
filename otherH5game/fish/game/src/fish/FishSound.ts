/**
 * Created by eric.liu on 17/11/06.
 *
 * 音频管理
 */

class FishSoundManager {
    //单例
    private static _instance = null;
    public static GetInstance() : FishSoundManager {
        if (FishSoundManager._instance == null){
            FishSoundManager._instance = new FishSoundManager();
        }
        return FishSoundManager._instance;
    }

    private scenes:Array<egret.Sound> = [];
    private catches:Array<egret.Sound> = [];
    private shejiang:egret.Sound;
    private bgmChannel:egret.SoundChannel = null;
    private mute:boolean = false;
    public Load() {
        let self:FishSoundManager = this;
        for (var i=0;i<1;i++) {
            self.scenes.push(RES.getRes(`scene${i}_mp3`));
        }
        for (var i=0;i<FISH_TYPE_COUNT;i++) {
            self.catches.push(RES.getRes(`catch${i}_mp3`));
        }
        self.shejiang = RES.getRes("shejiang_mp3");
    }

    public PlayShot() {
        let self:FishSoundManager = this;
        if (self.mute) return;
        if (self.shejiang) {
            var channel = self.shejiang.play(0, 1);
            channel.volume = 0.5;
        }
    }

    public PlayCatch(type:number) {
        let self:FishSoundManager = this;
        if (self.mute) return;
        if (type >= FISH_TYPE_COUNT) return;
        if (self.catches[type]) {
            var channel = self.catches[type].play(0, 1);
            channel.volume = 0.5;
        }
    }

    public PlayBGM(scene:number, play:boolean=true) {
        let self:FishSoundManager = this;
        if (self.mute && play) return;
        if (scene > 0 || scene < 0) return;
        if (play) {
            if (self.bgmChannel) {
                return;
            }
            if (self.scenes[scene]) {
                self.bgmChannel = self.scenes[scene].play(0, -1);
                self.bgmChannel.volume = 0.5;
            }
        } else {
            if (self.bgmChannel) {
                self.bgmChannel.stop();
                self.bgmChannel = null;
            }
        }
    }

    public Mute(mute:boolean=true) {
        let self:FishSoundManager = this;
        self.mute = mute;
        if (mute) {
            self.PlayBGM(0, false);
        } else {
            self.PlayBGM(0, true);
        }
    }
}