<template>
	<spinner v-ref:spinner :size="(lg)" :fixed="(true)" :text="hudLabel"></spinner>
	<modal :show.sync="modal.visible" effect="fade">
		<div slot="modal-header" class="modal-header">
			<h4 class="modal-title center">登录</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div>
				<div class="row">
					<div class="col-xs-5">
						<bs-input required :value.sync="id" placeholder="ID" :clear-button="true"></bs-input>
					</div>
					<div class="col-xs-5">
						<bs-input required :value.sync="password" placeholder="Password" :clear-button="true" type="password"></bs-input>
					</div>
					<div class="col-xs-2">
						<button class="btn btn-success" @click="onConfirm">确定</button>
					</div>
				</div>

				<button class="btn btn-default" @click="onLoginByGuest">游客登录</button>
			</div>
			<div>
				<p class="line center">或者其他登录方式</p>
				<img src="../assets/weixin.png" @click="onThirdPartClick(1)"/>
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button class="btn btn-primary" @click="onClose">关闭</button>
		</div>
	</modal>
</template>
<style>
.line{
	border-bottom: 1px solid #e5e5e5
}
.center{
	text-align: center;
}
</style>
<script>
	import {modal, input, buttonGroup, radio, spinner} from 'vue-strap'
	import {loginByInput, loginByGuest, loginByWeiXinCode} from '../actions/webService'
	import {getDeviceUUID} from '../actions/browser'
	import {listenBridge} from '../Bridge'
	import WXApiManager from '../thirdParts/WXApiManager'

	export default{
		data(){
			return{
				id: '',
				password: '',
				hudLabel: '',
				modal: {
					visible: false,
				},
				callback: null,
				waitingForThirdPart: false,
			}
		},
		ready(){
			listenBridge('authenticate', (callback)=>{
				this.callback = callback;
				this.showModal.call(this);
			});
			listenBridge('weixinAuthCallback', (code, type)=>{
				if(type == 0){
					this.weixinAuthCallback(code);
				}
			});
		},
		components:{
			modal,
			'bs-input': input,
			buttonGroup,
			spinner,
		},
		methods:{
			onConfirm(){
				this.onLoginResult(loginByInput(this.id, this.password));
			},
			onClose(){
				if(this.callback){
					this.callback({code: 2});
				}
				this.hideModal();
			},
			onLoginByGuest(){
				this.onLoginResult(loginByGuest(getDeviceUUID()));
			},
			onThirdPartClick(type){
				this.waitingForThirdPart = true;
				this.showWaiting('请在跳转的页面里进行授权');
				switch(type){
					case 1:
						WXApiManager.doAuth(0);
						break;
				}
			},
			onLoginResult(p){
				this.showWaiting('等待中。。。');
				return p.then(
					(response)=>{

						let code = response.code;
						if(code == 0){
							response.data.autoLogin = true;
							if(this.callback){
								this.callback(response);
							}
							this.hideModal();
							this.hideWaiting();
						}else{
							this.hideWaiting(2000, response.message);
						}

					},
					(error)=>{
						this.hideWaiting(2000, '网络错误，请稍后再试。');
					}
				);
			},
			weixinAuthCallback(code){
				console.log('weixinAuthCallback code:' + code);
				if(code){
					this.waitingForThirdPart = false;
					this.onLoginResult(loginByWeiXinCode(code));
				}else{
					if(this.waitingForThirdPart){
						this.hideWaiting();
					}
				}
			},
			showModal(title){
				this.id = '';
				this.password = '';
				this.modal.visible = true;
			},
			hideModal(){
				this.modal.visible = false;
			},
			showWaiting(label){
				this.hudLabel = label;
				this.$refs.spinner.show();
			},
			hideWaiting(delay, label){
				if(label){
					this.hudLabel = label;
				}
				if(delay){
					setTimeout(()=>{
						this.$refs.spinner.hide();
					}, delay);
				}else{
					this.$refs.spinner.hide();
				}
			},
		},
		events: {
			showLogin(){
				this.showModal();
			},
			hideLogin(){
				this.hideModal();
			}
		}
	}

</script>
