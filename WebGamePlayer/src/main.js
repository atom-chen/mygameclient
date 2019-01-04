import './util'
postStep(1,"start->"+window.location.href);

import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import { configRouter } from './route-config'
import './Bridge'
import WXApiManager from './thirdParts/WXApiManager'
import URLParamManager from './thirdParts/URLParamManager'

postStep(2,"initOver->");
/*zhu 目前仅微信，不需要
import QunHei from './thirdParts/qunHei/QunHei'
import HaiWanWan from './thirdParts/haiWanWan/HaiWanWan'
import AiYouXi from './thirdParts/aiYouXi/AiYouXi'
*/

Vue.use(VueRouter);

const router = new VueRouter();
configRouter(router);

router.start(App, '#container');
