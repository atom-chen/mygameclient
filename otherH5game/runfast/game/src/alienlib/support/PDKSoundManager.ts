/**
 * Created by rockyl on 16/3/9.
 */

module PDKalien {
    export class PDKSoundManager {
        private static _instance: PDKSoundManager;
        public static get instance(): PDKSoundManager {
            if (this._instance == undefined) {
                this._instance = new PDKSoundManager();
            }
            return this._instance;
        }

        musicRes: string;
        musicChannel: egret.SoundChannel;
        musicPlaying: boolean;
        isMusicLoaded: boolean;
        musicLoader: egret.URLLoader;
        private _hasTap: boolean;

        constructor(){            
            this._hasTap = false;
            
            let mm: string = PDKalien.localStorage.getItem('vibrateMute');
            if(mm == null){
                this.vibrateMute = true;
            }
        }

        private loadMusic(key): void {
            if (!key) return;
            RES.getResAsync(key, this.onMusicLoadOver, this);
        }

        private onMusicLoadOver(music: egret.Sound): void {
            if (pdkServer._isInDDZ) {
                console.log("onMusicLoadOver-------------->")
                pdkServer.ddzDispatchEvent(4, '', { type: 4, soundType: 1, soundRes: "pdk_bgm" });
                return;
            }

            if (music) {
                music.type = egret.Sound.MUSIC;
            }

            if (PDKalien.Native.instance.isNative) {
                this.playMusic(this.musicRes);
                return;
            }

            //safari 模拟点击无效
            if (egret.Capabilities.os != "iOS") {
                let btn1 = document.createElement("runfastClickBtn");
                btn1.hidden = true;
                btn1.onclick = () => {
                    this.playMusic(this.musicRes);
                }

                var clickEvt = document.createEvent('PDKMouseEvent');
                clickEvt.initEvent('click', true, true);
                btn1.dispatchEvent(clickEvt);
            } else {
                if (!this._hasTap) {
                    PDKalien.StageProxy.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStageTap, this);
                }
            }
        }

        private onStageTap(): void {
            this._hasTap = true;
            if (!PDKalien.Native.instance.isNative) {
                if (egret.Capabilities.os == "iOS") {
                    this.playMusic(this.musicRes);
                }
            }
            PDKalien.StageProxy.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onStageTap, this);
        }

        private onMusicLoadError(): void {
            PDKwebService.postError(PDKErrorConfig.BMG_LOAD_ERROR, "");
            PDKalien.StageProxy.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onStageTap, this);
        }

        onPause(): void {
            this.stopMusic();
            this.stopEffect();
        }

        onResume(): void {
            this.playMusic(this.musicRes);
        }

        playMusic(res: string = null, goon: boolean = false, isFirst: boolean = false): void {
            if (pdkServer._isInDDZ) {
                console.log("playMusic----inddz------->")
                pdkServer.ddzDispatchEvent(4, '', { type: 4, soundType: 1, soundRes: "pdk_bgm" });
                return;
            }
            let _off = this.musicMute;
            let _stageHide = PDKalien.StageProxy.isPause();
            this.musicRes = res;
            if (_off || _stageHide) {
                return;
            }
            this.stopMusic();
            let music = RES.getRes(res);
            if (!music) {
                this.loadMusic(res);
                return;
            }

            //console.log('playMusic' + ' mute:' + this.musicMute);

            music.type = egret.Sound.MUSIC;
            this.musicChannel = music.play();
            this.musicChannel.volume = 1;
            this.musicPlaying = true;
        }

        playMusicNative(res: string = null, goon: boolean = false, isFirst: boolean = false): void {
            //console.log('playMusic' + ' mute:' + this.musicMute);
            console.log('sound res:' + res);
            if (this.musicRes == res) {
                return;
            }

            if (!goon) {
                this.musicRes = res;
            }

            this.musicPlaying = true;
            if (this.musicMute) {
                return;
            }

            if (this.musicChannel) {
                this.musicChannel.stop();
            }

            console.log('sound res:' + res);
            console.log('sound musicRes:' + this.musicRes);

            RES.getResAsync(this.musicRes, (music: egret.Sound) => {
                if (music) {
                    this.musicChannel = music.play();
                    this.musicChannel.volume = 1;
                } else {
                    console.log('>>>>>>>>>>' + this.musicRes + ' can\'t loaded');
                }
            }, this);
        }

        stopMusic(mute: boolean = false): void {
            if (this.musicChannel) {
                this.musicChannel.stop();
                this.musicChannel = null;
            }
            this.musicPlaying = false;
        }
        switchMusic(): void {
            //console.log('switchMusic' + ' mute:' + this.musicMute);
            this.musicMute = !this.musicMute;
            PDKOtherGameManager.instance.onMusicEnableChange();
            if (this.musicRes) {
                if (this.musicMute) {
                    this.stopMusic(true)
                } else {
                    // if (this.musicPlaying) {
                    // this.playMusic(null, true);
                    this.playMusic(this.musicRes);
                    // }
                }
            }
        }
        get musicMute(): boolean {
            let mm: string = PDKalien.localStorage.getItem('musicMute');
            return mm ? mm == '1' : false;
        }
        set musicMute(value: boolean) {
            PDKalien.localStorage.setItem('musicMute', value ? '1' : '0');
        }

        effectRes: string;
        effectChannel: egret.SoundChannel;
        playEffect(res: string = null, loop: number = 1, musicConflict: boolean = false): void {
            //console.log('playEffect' + ' mute:' + this.effectMute);
            if (pdkServer._isInDDZ) {
                console.log("playMusic----inddz------->")
                pdkServer.ddzDispatchEvent(4, '', { type: 4, soundType: 2, soundRes: res });
                return;
            }
            if (res) {
                this.effectRes = res;
            }
            if (this.effectMute) {
                return;
            }

            //console.log('>>>>>>>>>>load audio:' + res);
            RES.getResAsync(this.effectRes, (effect: egret.Sound) => {
                if (effect) {
                    //console.log('>>>>>>>>>>' + res + ' loaded' + ' type:' + effect.type);
                    effect.type = egret.Sound.EFFECT;
                    this.effectChannel = effect.play(0, loop);
                    if (false && musicConflict) {
                        if (this.musicChannel) {
                            //console.log('>>>>>>>>>> musicConflict');
                            //egret.Tween.get(this.musicChannel, null, null, true).to({volume: 0.1}, 500);
                            this.musicChannel.volume = 0;
                            this.effectChannel.addEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this);
                        }
                    }
                } else {
                    console.log('>>>>>>>>>>' + res + ' can\'t loaded');
                }
            }, this);
        }
        stopEffect(): void {
            //console.log('stopEffect' + ' mute:' + this.effectMute);
            if (this.effectChannel) {
                this.effectChannel.stop();
            }
        }
        private onSoundComplete(event: egret.Event): void {
            //console.log('onSoundComplete');
            if (this.musicChannel) {
                egret.Tween.get(this.musicChannel, null, null, true).to({ volume: 1 }, 500);
                //this.musicChannel.volume = 1;
                let effectChannel: egret.SoundChannel = event.target;
                effectChannel.removeEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this);
            }
        }
        switchEffect(): void {
            //console.log('switchEffect' + ' mute:' + this.effectMute);
            this.effectMute = !this.effectMute;
            PDKOtherGameManager.instance.onEffectEnableChange();
			/*if(this.effectRes){
				if(this.effectMute){
					this.stopEffect()
				}else{
					this.playEffect();
				}
			}*/
        }
        get effectMute(): boolean {
            let mm: string = PDKalien.localStorage.getItem('effectMute');
            return mm ? mm == '1' : false;
        }
        set effectMute(value: boolean) {
            PDKalien.localStorage.setItem('effectMute', value ? '1' : '0');
        }

        get allMute(): boolean {
            return this.musicMute
        }
        switchAll(): void {
            this.switchEffect();
            this.switchMusic();
        }

		/**
		 * 震动
		 */
        vibrate(): void {
            if (this.vibrateMute) {
                return;
            }

            PDKalien.Native.instance.vibrate();
        }

        get vibrateMute(): boolean {
            let mm: string = PDKalien.localStorage.getItem('vibrateMute');
            return mm ? mm == '1' : false;
        }
        set vibrateMute(value: boolean) {
            PDKalien.localStorage.setItem('vibrateMute', value ? '1' : '0');
        }
        switchVibrate(): void {
            this.vibrateMute = !this.vibrateMute;

            PDKOtherGameManager.instance.onVibrateEnableChange();
        }
    }
}