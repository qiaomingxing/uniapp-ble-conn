import { mapGetters } from 'vuex'
import store from "@/store"

// 尝试将用户在根目录中的store/getters.js的vuex变量，全部加载到全局变量中
let storeKeys = [];
try{
	storeKeys = store.getters ? Object.keys(store.getters) : []
}catch(e){
	storeKeys = []
}

export default {
	computed: {
		i18n() {
			return this.$t('message')
		},
		...mapGetters(storeKeys)
	}
}