/**
 * 公共提示Tips JS工具类
 */
import store from "@/store"
import i18n from '@/i18n'

module.exports = {
	/**
	 * 显示Loading加载框
	 * @param {String} 加载框id 和loaded保持一致
	 */
	loading: function(type = "app") {
		store.dispatch("app/loading", type)
	},
	/**
	 * 隐藏Loading加载框
	 * @param {String} 加载框id 和loading保持一致
	 */
	loaded: function(type = "app") {
		store.dispatch("app/loaded", type)
	},
	// 弹出确认框
	confirm(content, options = {
		showCancel: true
	}, payload = {}) {
		return new Promise((resolve, reject) => {
			uni.showModal({
				title: options.title || i18n.t('message.dialog_default_title'),
				content: content,
				showCancel: options.showCancel,
				confirmText: options.confirmText || i18n.t('message.confirm'),
				cancelText: options.cancelText || i18n.t('message.cancel'),
				success: res => {
					if (res.confirm) {
						resolve(payload)
					} else if (res.cancel) {
						reject(payload)
					}
				}
			});
		})
	}
}
