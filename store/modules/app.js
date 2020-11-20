const state = {
	locale: uni.getStorageSync("locale") || 'zh', // 语言标志
	result: {}, // 页面返回信息
	bundle: "", // 页面携带信息
	network: {}, // 网络信息
	loading: {}, // 页面加载
	isCheckedUpdate: false, // App检测更新标记,false:未检测,true:已检测
	isForceUpdate: false, // App强制检测更新,false:不强制更新,true:强制更新
	devMode: { open: true } // 开发模式
};
const mutations = {
	// 语言信息
	SET_LOCALE: (state, value) => {
		state.locale = value;
	},
	// 返回信息
	SET_RESULT: (state, value) => {
		state.result = Object.assign({}, state.result, value);
	},
	// 删除信息
	REMOVE_RESULT: (state, key) => {
		if (state.result.hasOwnProperty(key)) {
			delete state.result[key];
		}
	},
	// 携带信息
	SET_BUNDLE: (state, value) => {
		state.bundle = value;
	},
	// 网络
	SET_NETWORK: (state, value) => {
		state.network = value;
	},
	// 加载框
	OPEN_LOADING: (state, type) => {
		state.loading[type] = true
		state.loading = { ...state.loading }
	},
	CLOSE_LOADING: (state, type) => {
		state.loading[type] = false
		state.loading = { ...state.loading }
	},
	// 更新标记
	SET_IS_CHECKED_UPDATE: (state, value) => {
		state.isCheckedUpdate = value;
	},
	// 强制检测更新
	SET_IS_FORCE_UPDATE: (state, value) => {
		state.isForceUpdate = value;
	},
	// 开发模式
	SET_DEV_MODE: (state, value) => {
		if(value.log && value.log.length > 0 && state.devMode.log) {
			value.log = [...value.log, ...state.devMode.log]
		}
		state.devMode = {...state.devMode, ...value }
	}
};
const actions = {
	// 设置语言标志信息
	setLocale({
		dispatch,
		commit
	}, value) {
		uni.setStorageSync("locale", value);
		commit("SET_LOCALE", value);
	},
	// 返回信息
	setResult({
		dispatch,
		commit
	}, value) {
		commit("SET_RESULT", value);
	},
	// 删除信息
	removeResult({
		dispatch,
		commit
	}, key) {
		commit("REMOVE_RESULT", key);
	},
	// 携带信息
	setBundle({
		dispatch,
		commit
	}, value) {
		commit("SET_BUNDLE", value);
	},
	// 设置网络
	setNetwork({
		dispatch,
		commit
	}, value) {
		commit("SET_NETWORK", value);
	},
	// 加载框
	loading({ commit }, loadingType = 'app') {
		commit('OPEN_LOADING', loadingType)
	},
	loaded({ commit }, loadingType = 'app') {
		commit('CLOSE_LOADING', loadingType)
	},
	// 更新标记
	setIsCheckedUpdate({
		dispatch,
		commit
	}, value) {
		commit("SET_IS_CHECKED_UPDATE", value);
	},
	// 强制检测更新
	setIsForceUpdate({
		dispatch,
		commit
	}, value) {
		commit("SET_IS_FORCE_UPDATE", value);
	},
	// 开发环境配置
	setDevMode({
		dispatch,
		commit
	}, value) {
		commit('SET_DEV_MODE', value || {});
	}
};

export default {
	namespaced: true,
	state,
	mutations,
	actions
};
