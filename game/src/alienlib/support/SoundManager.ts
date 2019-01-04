/**
 * Created by rockyl on 16/3/9.
 */

module alien {
    export class SoundManager {
        private static _instance: SoundManager;
        public static get instance(): SoundManager {
            if(this._instance == undefined) {
                this._instance = new SoundManager();
            }
            return this._instance;
        }

        
        musicRes: string;
        musicChannel: egret.SoundChannel;
        musicPlaying: boolean;
        musicLoader:egret.URLLoader;
        musicData:any;
        private _enablePlay:boolean;
        private _hasTap:boolean;
        constructor(){
            this._enablePlay = true;
            this._hasTap = false;
            
            let mm: string = alien.localStorage.getItem('vibrateMute');
            if(mm == null){
                this.vibrateMute = true;
            }
        }

        public enablePlayMusic(bEnable:boolean):void{
            this._enablePlay = bEnable;
        }

        private loadMusic(key): void {
            if(!key) return;
            RES.getResAsync(key,this.onMusicLoadOver,this);
        }
        
        private onMusicLoadOver(music:egret.Sound):void
        {
            if(music){
                music.type = egret.Sound.MUSIC;
            }

            if(alien.Native.instance.isNative){
                this.playMusic(this.musicRes);
                return;
            }
            if(!this._hasTap){
                this._addH5ClickPlay();
            }else{
                this.playMusic(this.musicRes);
            }
        }
        
        private _addH5ClickPlay():void{
            if(alien.Native.instance.isNative || this._hasTap){
                return;
            }
            //safari 模拟点击无效
            if(egret.Capabilities.os != "iOS"){
                let btn = document.getElementById("ddzCopyBtn");
                btn.onclick = ()=>{
                    this._hasTap = true;
                    this.playMusic(this.musicRes);
                }

                var clickEvt = document.createEvent('MouseEvent');
                clickEvt.initEvent('click', true, true);
                btn.dispatchEvent(clickEvt); 
            }else{
                alien.StageProxy.stage.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onStageTap,this);
            }
        }

        private onStageTap():void
        {   
            this._hasTap = true;
            if(!alien.Native.instance.isNative){
                if(egret.Capabilities.os == "iOS"){
                    this.playMusic(this.musicRes);
                }
            }         
            alien.StageProxy.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onStageTap,this);
        }
        
        private onMusicLoadError():void
        {
            webService.postError(ErrorConfig.BMG_LOAD_ERROR,"");
            alien.StageProxy.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onStageTap,this);
        }

        onPause():void{
            this.stopMusic();
            this.stopEffect();
        }

        onResume():void{
            this.playMusic(this.musicRes);
        }

        
        playMusic(res: string): void {
            let _off = this.musicMute;
            let _stageHide = alien.StageProxy.isPause();
            this.musicRes = res;  
            if(_off || !this._enablePlay || _stageHide) {
                return;
            }
            this.stopMusic();
            let  music = RES.getRes(res);
            //alert("playMusic--->"+res+" notLoad:" +!music);
            if(!music){
                this.loadMusic(res);
                return;
            }else{
                this._addH5ClickPlay();
            }
            
            //console.log('playMusic' + ' mute:' + this.musicMute);
     
            music.type = egret.Sound.MUSIC;
            this.musicChannel = music.play();
            this.musicChannel.volume = 1;
            this.musicPlaying = true;
        }

        stopMusic(mute: boolean = false): void {
            //console.log('stopMusic' + ' mute:' + this.musicMute);
            if(this.musicChannel) {
                this.musicChannel.stop();
                this.musicChannel = null;
            }
            this.musicPlaying = false;
        }

        switchMusic(): void {
            //console.log('switchMusic' + ' mute:' + this.musicMute);
            this.musicMute = !this.musicMute;
            OtherGameManager.instance.onMusicEnableChange();
            if(this.musicRes) {
                if(this.musicMute) {
                    this.stopMusic(true)
                } else {
                    this.playMusic(this.musicRes);
                }
            }
        }
        get musicMute(): boolean {
            let mm: string = alien.localStorage.getItem('musicMute');
            return mm ? mm == '1' : false;
        }
        set musicMute(value: boolean) {
            alien.localStorage.setItem('musicMute',value ? '1' : '0');
        }

        effectRes: string;
        effectChannel: egret.SoundChannel;
        playEffect(res: string = null,loop: number = 1,musicConflict: boolean = false): void {
            //console.log('playEffect' + ' mute:' + this.effectMute);
            if(res) {
                this.effectRes = res;
            }
            let _stageHide = alien.StageProxy.isPause();
            if(this.effectMute || _stageHide) {
                return;
            }

            //console.log('>>>>>>>>>>load audio:' + res);
            RES.getResAsync(this.effectRes,(effect: egret.Sound) => {
                if(effect) {
                    //console.log('>>>>>>>>>>' + res + ' loaded' + ' type:' + effect.type);
                    effect.type = egret.Sound.EFFECT;
                    this.effectChannel = effect.play(0,loop);
                    if(false && musicConflict) {
                        if(this.musicChannel) {
                            //console.log('>>>>>>>>>> musicConflict');
                            //egret.Tween.get(this.musicChannel, null, null, true).to({volume: 0.1}, 500);
                            this.musicChannel.volume = 0;
                            this.effectChannel.addEventListener(egret.Event.SOUND_COMPLETE,this.onSoundComplete,this);
                        }
                    }
                } else {
                    console.log('>>>>>>>>>>' + res + ' can\'t loaded');
                }
            },this);
        }
        stopEffect(): void {
            //console.log('stopEffect' + ' mute:' + this.effectMute);
            if(this.effectChannel) {
                this.effectChannel.stop();
            }
        }
        private onSoundComplete(event: egret.Event): void {
            //console.log('onSoundComplete');
            if(this.musicChannel) {
                egret.Tween.get(this.musicChannel,null,null,true).to({ volume: 1 },500);
                //this.musicChannel.volume = 1;
                let effectChannel: egret.SoundChannel = event.target;
                effectChannel.removeEventListener(egret.Event.SOUND_COMPLETE,this.onSoundComplete,this);
            }
        }
        switchEffect(): void {
            //console.log('switchEffect' + ' mute:' + this.effectMute);
            this.effectMute = !this.effectMute;
            OtherGameManager.instance.onEffectEnableChange();
			/*if(this.effectRes){
				if(this.effectMute){
					this.stopEffect()
				}else{
					this.playEffect();
				}
			}*/
        }
        get effectMute(): boolean {
            let mm: string = alien.localStorage.getItem('effectMute');
            return mm ? mm == '1' : false;
        }
        set effectMute(value: boolean) {
            alien.localStorage.setItem('effectMute',value ? '1' : '0');
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
            if(this.vibrateMute) {
                return;
            }

            alien.Native.instance.vibrate();
        }

        get vibrateMute(): boolean {
            let mm: string = alien.localStorage.getItem('vibrateMute');
            return mm ? mm == '1' : false;
        }
        set vibrateMute(value: boolean) {
            alien.localStorage.setItem('vibrateMute',value ? '1' : '0');
        }
        switchVibrate(): void {
            this.vibrateMute = !this.vibrateMute;
            
            OtherGameManager.instance.onVibrateEnableChange();
        }
    }
}