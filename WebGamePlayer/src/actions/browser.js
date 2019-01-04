/**
 * Created by rockyl on 2016/12/15.
 */

export function getDeviceUUID(){
	let uuid = localStorage.getItem('bode_uuid');
	if(!uuid){
		uuid = makeRandomString(32);
		localStorage.setItem('bode_uuid', uuid);
	}

	return uuid;
}

let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
export function makeRandomString(len) {
	let s = "";
	let cl = chars.length;
	for (let i = 0; i < len; i++) {
		s += chars.charAt(makeRandomInt(cl));
	}

	return s;
}

export function makeRandomInt(max, min) {
	min = min || 0;
	return Math.floor(Math.random() * (max - min)) + min;
}