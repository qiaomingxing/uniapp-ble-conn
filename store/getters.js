const getters = {
	// app
	g_locale: state => state.app.locale,
	g_result: state => state.app.result,
	g_bundle: state => state.app.bundle,
	g_network: state => state.app.network,
	g_loading: state => state.app.loading,
	g_isCheckedUpdate: state => state.app.isCheckedUpdate,
	g_isForceUpdate: state => state.app.isForceUpdate,
	g_devMode: state => state.app.devMode,
	// user
	g_token: state => state.user.token,
	g_loginInfo: state => state.user.loginInfo,
	g_userInfo: state => state.user.userInfo
}
export default getters
