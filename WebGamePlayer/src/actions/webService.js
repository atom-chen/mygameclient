/**
 * Created by rockyl on 2016/12/15.
 */

import 'es6-promise'
import 'whatwg-fetch'
import {encode, decode} from 'querystring';

export function callApi(module, action, params){
	let url = `${WEB_SERVICE}${module}/${action}`;

	let config = {
		method: 'post',
		body: encode(params),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	};
	return fetch(url, config)
		.then((response)=>response.json());
}

export function loginByInput(id, password){
	return callApi('index', 'login', {username: id, password});
}

export function loginByGuest(uuid){
	return callApi('index', 'guest', {device: uuid});
}

export function loginByWeiXinCode(code){
	return callApi('index', 'login', {code, type: 1, sub_type: 1});
}

export function bindByWeiXin(code, uuid){
	return callApi('user', 'bind', {wxcode: code, device_id: uuid, type: 1, sub_type: 1});
}