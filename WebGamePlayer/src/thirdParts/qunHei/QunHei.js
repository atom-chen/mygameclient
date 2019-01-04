import {listenBridge} from '../../Bridge'
import qhgamesdk from './qhgamesdk'

export class QunHei{
	constructor(){
		console.log('QunHei init.');		
		listenBridge('QunHeiRecharge', this.recharge);
	}

	recharge(response) {
		// alert('recharge');
		var paydata = { 
			   "userId":response.userId,
			   "gid":response.gid,
			   "roleName":response.roleName,
			   'goodsId':response.goodsId,
			   "goodsName":response.goodsName, 
			   "money":response.money,
			   "ext":response.ext ,
			   "sign":response.sign
			};				
			qhsdk.pay(paydata,function(code,msg){
				//充值结果通知，code为编号，msg为信息。该结果不能作为发货依据。
				//code=1充值成功 ，其他为充值失败。
				alert(code+','+msg);
			});
	}

	static get instance(){
		if(!QunHei._instance){
			QunHei._instance = new QunHei();
		}
		return QunHei._instance;
	}
}

export default QunHei.instance;