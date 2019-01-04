<template>
	<div id="game-list">
		<div>
			<h2>选择游戏</h2>
			<div class="list">
				<div class="item" v-for="game in games">
					<a class="btn btn-block btn-default" v-on:click="onSelectGame(game.path)">{{game.alias}}</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {getGames} from '../actions/api'
	export default {
		data(){
			return {
				games: [],
			}
		},
		components: {

		},
		ready(){
			document.title = '选择游戏';
			getGames()
				.then(
					(response)=> {
						if(response.code == 0){
							this.games = response.data;
						}
					}
				);
		},
		methods:{
			onSelectGame(path){
				this.$router.go({
					path: '/play/' + path+'/'
				});
			},
			onBtnLoginTap(){
				this.$broadcast('showLogin');
			}
		}
	}
</script>

<style>
	#game-list{
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.list {
		align-items: stretch;
	}

	.item {
		padding: 5px;
	}
</style>
