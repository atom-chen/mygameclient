/**
 * Created by rockyl on 16/8/30.
 */

export function configRouter (router) {
	router.map({
		'/list': {
			component: require('./components/GameList.vue')
		},

		'/play/:name': {
			component: require('./components/GamePlayer.vue'),
			subRoutes: {
				':token/:uid': {
					component: require('./components/SaveAuthData.vue')
				}
			}
		},
	});

	router.redirect({
		'/': '/list',
	});
}