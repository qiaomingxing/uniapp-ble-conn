import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

// 遍历i18n配置语言文件
const modulesFiles = require.context("./modules", true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
	const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
	const value = modulesFiles(modulePath);
	modules[moduleName] = value;
	return modules;
}, {});

// 获取已选择语言标志，默认zh
const getLocale = () => {
	const chooseLanguage = uni.getStorageSync("locale"); // 语言标志
	if (chooseLanguage) {
		return chooseLanguage;
	}
	// if has not choose language
	// #ifdef H5
	const currentLanguage = (
		navigator.language || navigator.browserLanguage
	).toLowerCase();
	const locales = Object.keys(modules);
	for (const locale of locales) {
		if (currentLanguage.indexOf(locale) > -1) {
			return locale;
		}
	}
	// #endif
	return "zh";
}

const i18n = new VueI18n({
	locale: getLocale(),
	messages: modules
})

export default i18n;
