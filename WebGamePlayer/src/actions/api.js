/**
 * Created by rockyl on 16/8/30.
 */

import 'es6-promise'
import 'whatwg-fetch'

const apiHost = HOST + 'api.php?';

export function getGames(){
	return fetch(apiHost + 'action=getGames')
		.then((response)=>response.json());
}

export function getGameByName(name){
	return fetch(apiHost + 'action=getGameByName&name=' + name)
		.then((response)=>response.json());
}