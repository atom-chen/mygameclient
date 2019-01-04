<template>
	<!--zhu 不需要
	<authorize></authorize>
	-->
	<router-view></router-view>
	<spinner v-ref:spinner :size="(lg)" :fixed="(true)" text="Loading game..."></spinner>
	<div v-if="!errGameName" class="game-container">
		<iframe id="playerFrame" :src="game ? HOST + game.url : null"></iframe>
		<div v-show="!isFullScreen" class="mask" :style="iframeStyle">
			<div v-if="platform == 'iOS'" class="mask-content">
				<img src="../assets/swipe_up.png"/>
				<p class="mask-label">慢慢上滑</p>
			</div>
			<div v-else class="mask-content">
				<button class="btn btn-default" @click="fullScreen">全屏</button>
			</div>
		</div>
	</div>
	<div class="err-page" v-if="errGameName">
		<div>
			<h2>-_- 错误的游戏名!</h2>
			<button class="btn btn-success" @click="gotoList">返回列表</button>
		</div>
	</div>
</template>

<script>
	import {getGameByName} from '../actions/api'
	import {spinner} from 'vue-strap'
	import {screenfull} from '../third-part/screenfull'
	import {getBrowser, getPlatform} from '../third-part/browser'
	import Authorize from './Authorize.vue';
	import URLParamManager from '../thirdParts/URLParamManager'

	var platform = getPlatform();
	var browser = getBrowser();
	var onePixel = platform == 'iOS' ? 100 : 0;
	var needGoOnCheck=true;

	export default{
		data(){
			return {
				errGameName: false,
				game: null,
				HOST,
				touching: false,
				isFullScreen: true,
				platform,
				browser,
				iframeStyle: {
					height: document.documentElement.clientHeight + onePixel + 'px',
				},
			}
		},
		ready(){
			console.log(document.documentElement.clientHeight);
			var name = this.$route.params.name;
			postStep(3,"will get cfg ->" + name);
			this.$refs.spinner.show();
			getGameByName(name)
				.then(
					(response)=> {
						this.$refs.spinner.hide();
						if(response.code == 0){
							var game = this.game = response.data;
							postStep(4,"after get cfg ->" + HOST + game.url);

							document.title = game.alias;

							setTimeout(()=> {
								window.addEventListener("resize", ()=> {
									this.iframeStyle.height = document.documentElement.clientHeight + onePixel + 'px';
								});
							}, 500);

							var urlParams=URLParamManager.getUrlParams();	
							console.log('thirdPart:'+urlParams.thirdPart);
							// 群黑特殊处理，壳太逗
							if (urlParams.thirdPart && urlParams.thirdPart!='')
							{
								this.isFullScreen=true;
								needGoOnCheck=false;
							}							
							console.log("needGoOnCheck:"+needGoOnCheck);
							if (needGoOnCheck)
							{
								//zhu 暂时不需要 setInterval(()=>{	
									switch(this.platform){
										case 'iOS':
											if(this.browser == 'safari' && !this.touching){
												var isFullScreen = window.innerHeight >= document.documentElement.clientHeight;
												if(!this.isFullScreen && isFullScreen){
													this.isFullScreen = true;
												}else if(this.isFullScreen && !isFullScreen){
													this.isFullScreen = false;
												}												
												window.scrollTo(0, 0);
											}
											break;
										case 'Android':
											if(this.browser != 'wx'){
												var isFullScreen = screenfull.isFullscreen;
												if(!this.isFullScreen && isFullScreen){
													this.isFullScreen = true;
												}else if(this.isFullScreen && !isFullScreen){
													this.isFullScreen = false;
												}
											}
											break;
									}
								//}, 300);
							}
						}else{
							this.errGameName = true;
						}
					}
				)
		},
		components: {
			spinner,
			Authorize,
		},
		methods: {
			fullScreen(){				
				console.log('tap');
				screenfull.request(document.getElementById('container'));
			},

			gotoList(){
				this.$router.go({
					path: '/list'
				});
			},

			onTouchStart(){				
				this.touching = true;
			},

			onTouchEnd(){				
				this.touching = false;
			}
		}
	}


</script>

<style>
	.game-container, .mask, iframe, .err-page {
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
		border: 0;
		display: block;
	}

	.mask, .err-page {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.mask {
		position: absolute;
		top: 0;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.mask-content {

	}

	.mask-label {
		width: 100%;
		color: white;
		text-align: center;
	}


</style>
