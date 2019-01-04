<template>
	<div>

	</div>
</template>
<style>

</style>
<script>
	export default{
		data(){
			return{
				msg:'hello vue'
			}
		},
		ready(){
			var token = this.$route.params.token;
			var uid = this.$route.params.uid;

			//{"uid":null,"username":"wu0xx4cxbjqrhtacdl9zr0z5lc3nkd4z","type":"0","token":null}
			var data = {
				uid, token, type: "0",
			};
			//localStorage.setItem('bode_user', JSON.stringify(data));
		},
		components:{
			
		}
	}

</script>
