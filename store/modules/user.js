import api from "@/api";

const state = {
	token: '', // 登录token
	loginInfo: {}, // 登录信息
	userInfo: {} // 用户信息
};
const mutations = {
	// 用户登录token
	SET_TOKEN: (state, value) => {
		state.token = value;
	},
	// 用户登录信息
	SET_LOGININFO: (state, value) => {
		state.loginInfo = value;
	},
	// 用户信息
	SET_USERINFO: (state, value) => {
		state.userInfo = value;
	}
};
const actions = {
	setToken({
		dispatch,
		commit
	}, data) {
		commit("SET_TOKEN", data);
	},
	// 用户登录
	login({
		dispatch,
		commit
	}, data) {
		const username = data.loginName.trim();
		const password = data.password.trim();
		return new Promise((resolve, reject) => {
			api.user
				.login(data)
				.then(response => {
					if (response.code == 1) {
						uni.setStorageSync("loginInfo", response.data);
						uni.setStorageSync("token", response.data.token || '');
						uni.setStorageSync("username", username);
						if (data.remember) {
							uni.setStorageSync("password", password);
						} else {
							uni.setStorageSync("password", "");
						}
						dispatch("parseLoginInfo");
					}
					resolve(response);
				})
				.catch(error => {
					reject(error);
				});
		});
	},
	// 获取用户信息
	getUserInfo({
		dispatch,
		commit
	}) {
		return new Promise((resolve, reject) => {
			api.user
				.getUserInfo(this.state.loginInfo.mobile)
				.then(response => {
					if (response.status == 1) {
						uni.setStorageSync("userInfo", response.data);
						dispatch("parseUserInfo");
					}
					resolve(response);
				})
				.catch(error => {
					reject(error);
				});
		});
	},
	// 解析登录信息
	parseLoginInfo({
		dispatch,
		commit
	}) {
		const loginInfo = uni.getStorageSync("loginInfo") || {};
		commit("SET_LOGININFO", loginInfo);
		commit("SET_TOKEN", loginInfo.token || '');
	},
	// 解析用户信息
	parseUserInfo({
		dispatch,
		commit
	}) {
		const userInfo = uni.getStorageSync("userInfo") || {};
		commit("SET_USERINFO", userInfo);
	},
	// 退出登录
	logout({
		dispatch,
		commit
	}) {
		uni.clearStorageSync();
		dispatch("parseLoginInfo");
	}
};

export default {
	namespaced: true,
	state,
	mutations,
	actions
};
