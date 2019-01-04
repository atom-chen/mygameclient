import {listenBridge} from '../../Bridge'
import egamesdk from './egame-2.0'


export class AiYouXi{
	constructor(){
		console.log('AiYouXi init.');
		// import egamesdk from './egame-2.0'		
		// addScript("http://h5.play.cn/static/js/charge/egame-2.0.js");
		// import {addScript} from '../../third-part/loadJs'		
		listenBridge('AiYouXiGetCode', this.getCode);
		listenBridge('AiYouXiRecharge', this.recharge);
	}

	getCode(params,callBack){
		egame.init({chargeUse:true,userUse:true,toobarUse:true,share:{summary:'爱游戏',pic:'http://a.jpg'}});				
		var param=
		{
			client_id:57473111,
			service:params.url,//params.url, 
			redirect_uri:params.url,//params.url,
			app_callback:function(token){						
		    	callBack(token);
		    }
			
		}
		egame.userInit(param);
	}

	recharge(response) {
		var params = {
	        expired: response.expired,
	        pay_id: response.pay_id,
	        game_id:response.game_id,
	        game_code:response.game_code,
	        cp_order_id: response.cp_order_id,
	        redirect: response.redirect,
	        fee:response.fee,
	        subject: response.subject,
	        model:'',
	        auto:response.auto,
	        page_back_url:'',
	        rebound_url:'',
	        user_id:response.user_id,
	        sign:response.sign,
	        Channel_code:response.Channel_code
	    }
		H5_charge_wy(params);
	}

	static get instance(){
		if(!AiYouXi._instance){
			AiYouXi._instance = new AiYouXi();
		}
		return AiYouXi._instance;
	}
}

export default AiYouXi.instance;