import {listenBridge} from '../../Bridge'
import hww_sdk_sub from './hww_sdk_sub'

export class HaiWanWan{
	constructor(){
		console.log('HaiWanWan init.');		
		listenBridge('HaiWanWanRecharge', this.recharge);
	}

	recharge(response) {		 
		Hwwsdk.pay(response.goodsName, response.amount, response.roleName, response.callBackInfo,response.sign);
	}

	static get instance(){
		if(!HaiWanWan._instance){
			HaiWanWan._instance = new HaiWanWan();
		}
		return HaiWanWan._instance;
	}
}

export default HaiWanWan.instance;