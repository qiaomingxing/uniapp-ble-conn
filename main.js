import Vue from 'vue'
import App from './App'
import i18n from './i18n'
import store from './store'
import api from '@/api'
import tips from '@/common/tips'
import utils from '@/common/utils'
import env from '@/constant/env'

import uView from "uview-ui"
Vue.use(uView)

import mixins from '@/mixins/index.js'
Vue.mixin(mixins)

Vue.config.productionTip = false

Vue.prototype._i18n = i18n;
Vue.prototype.$store = store
Vue.prototype.$api = api;
Vue.prototype.$tips = tips;
Vue.prototype.$utils = utils;
Vue.prototype.$env = env;

App.mpType = 'app'

const app = new Vue({
	i18n,
	store,
	...App
})
app.$mount()
