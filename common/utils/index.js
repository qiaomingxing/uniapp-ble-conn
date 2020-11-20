/**
 * 公共Utils JS工具类
 */
import store from '@/store'
import env from '@/constant/env'

module.exports = {
	/**
	 * 判断用户是否登录，已登录将会自动解析登录信息
	 * @return {Boolean} 是否已经登录
	 */
	checkLogin: function() {
		if (uni.getStorageSync("token", '')) {
			store.dispatch('user/parseLoginInfo')
			return true
		}
		return false
	},
	/**
	 * 获取登录信息
	 * @param {String} 登录信息键值对
	 * @return {Boolean} 是否已经登录
	 */
	getLoginInfo: function(value = '') {
		if (value) {
			return store.getters.g_loginInfo[value]
		}
		return store.getters.g_loginInfo
	},
	/**
	 * 根据key获取result
	 * @param {String} key 获取的key，默认'result'
	 * @param {Boolean} remove 是否清除掉当前所获取的值，默认清除
	 */
	getResult: function(key = 'result', remove = true) {
		let result = store.getters.g_result[key]
		if (remove) {
			module.exports.removeResult(key)
		}
		return result
	},
	/**
	 * 根据key保存result
	 * @param {String} key 存储的key
	 * @param {any} value 存储的value
	 */
	setResult: function(key = 'result', value = true) {
		let obj = {}
		obj[key] = value
		store.dispatch('app/setResult', obj)
	},
	/**
	 * 根据key清除对应result
	 * @param {String} key 要清除键key
	 */
	removeResult: function(key) {
		store.dispatch('app/removeResult', key)
	},
	/**
	 * 获取页面传递的值
	 * @param {Boolean} remove 是否清除
	 */
	getBundle: function(remove = true) {
		let bundle = store.getters.g_bundle
		if (remove && bundle) {
			store.dispatch('app/setBundle', '')
		}
		return bundle
	},
	/**
	 * 保存页面传递数据
	 * @param {any} value 
	 */
	setBundle: function(value) {
		store.dispatch('app/setBundle', value)
	},
	/**
	 * 清除页面传递数据
	 */
	removeBundle: function() {
		store.dispatch('app/setBundle', '')
	},
	/**
	 * 深拷贝
	 * @param {Object} value 
	 */
	deepClone: function(value) {
		return JSON.parse(JSON.stringify(value))
	},
	/**
	 * 获取环境变量，baseUrl
	 * @param {env} 环境变量 
	 */
	getBaseUrl: function() {
		if (env.isProd) {
			return env.prod
		} else {
			return env.dev
		}
	},
	/**
	 * 获取App设备唯一cid
	 */
	getClientId: function() {
		let info = plus.push.getClientInfo();
		return info.clientid == 'null' ? '' : info.clientid
	},
	/**
	 * uCharts 曲线配置
	 * @param {Array} categories 横轴
	 * @param {Array} series 数据轴
	 * @param {Number} ymin y轴最小值
	 * @param {Number} ymax y轴最大值
	 * @param {Number} low 预警线最低值
	 * @param {Number} high 预警线最高值
	 */
	getOpts: function(categories, series, ymin, ymax, low, high) {
		let enableMarkLine = isEmpty(low) || isEmpty(high);
		let markLine = {
			type: 'dash',
			dashLength: 5,
			data: [{
				value: high || 0,
				lineColor: '#f04864',
				showLabel: false,
				labelBgOpacity: 0.3
			}, {
				value: low || 0,
				lineColor: '#f04864',
				showLabel: false,
				labelBgOpacity: 0.3
			}]
		}
		let opts = {
			show: categories && categories.length > 0,
			categories: categories,
			series: series,
			xAxis: {
				scrollAlign: 'right'
			},
			yAxis: {
				min: ymin,
				max: ymax
			},
			enableMarkLine: enableMarkLine,
			extra: {
				markLine: enableMarkLine ? markLine : {}
			}
		}
		return module.exports.deepClone(opts);
	},
	/**
	 * 判读是否为空
	 * @param {any} v 
	 * isEmpty()              //true
	 * isEmpty([])            //true
	 * isEmpty({})            //true
	 * isEmpty(0)             //true
	 * isEmpty(Number("abc")) //true
	 * isEmpty("")            //true
	 * isEmpty("   ")         //true
	 * isEmpty(false)         //true
	 * isEmpty(null)          //true
	 * isEmpty(undefined)     //true
	 */
	isEmpty: function(v) {
		switch (typeof v) {
			case 'undefined':
				return true;
			case 'string':
				if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
				break;
			case 'boolean':
				if (!v) return true;
				break;
			case 'number':
				if (0 === v || isNaN(v)) return true;
				break;
			case 'object':
				if (null === v || v.length === 0) return true;
				for (var i in v) {
					return false;
				}
				return true;
		}
		return false;
	},
	/**
	 * 是否为空
	 * @param {*} value 
	 */
	isNullOrEmpty: function(value) {
		return (value === null || value === '' || value === undefined) ? true : false;
	},
	/**
	 * 去空格
	 * @param {String} value 
	 */
	trim: function(value) {
		return value.replace(/(^\s*)|(\s*$)/g, "");
	},
	/**
	 * 验证是否为手机号
	 * @param {String} value 
	 */
	isMobile: function(value) {
		return /^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/.test(value);
	},
	/**
	 * 金额，只允许保留两位小数
	 * @param {Number} value 
	 */
	isFloat: function(value) {
		return /^([0-9]*[.]?[0-9])[0-9]{0,1}$/.test(value);
	},
	/**
	 * 是否全为数字
	 * @param {Number} value 
	 */
	isNum: function(value) {
		return /^[0-9]+$/.test(value);
	},
	/**
	 * 密码为8~20位数字和字母组合
	 * @param {String} value 
	 */
	checkPwd: function(value) {
		return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test(value);
	},
	/**
	 * 格式化手机号码
	 * @param {String} 
	 * @return 133*****9999
	 */
	formatMobile: function(num) {
		if (utils.isMobile(num)) {
			num = num.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
		}
		return num;
	},
	/**
	 * 金额格式化
	 * @return 86,117.00
	 */
	formatMoney: function(money) {
		return parseFloat(money).toFixed(2).toString().split('').reverse().join('').replace(/(\d{3})/g, '$1,').replace(
			/\,$/, '').split('').reverse().join('');
	},
	/**
	 * 格式化时间
	 * @param {date} date Date
	 * @param {string} fmt yyyy-MM-dd hh:mm:ss
	 */
	formatDate: function(date = new Date(), fmt = 'yyyy-MM-dd hh:mm:ss') {
		let o = {
			"M+": date.getMonth() + 1, //月份 
			"d+": date.getDate(), //日 
			"h+": date.getHours(), //小时 
			"m+": date.getMinutes(), //分 
			"s+": date.getSeconds(), //秒 
			"q+": Math.floor(((date.getMonth() + 3) / 3)), //季度 
			"S": date.getMilliseconds() //毫秒 
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (let k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" +
				o[
					k]).substr(("" + o[k]).length)));
		return fmt;
	},
	/**
	 * 添加日志
	 * @param {date} date Date
	 * @param {string} fmt yyyy-MM-dd hh:mm:ss
	 */
	addLog(log) {
		if(store.getters.g_devMode.open) {
			store.dispatch('app/setDevMode', { log : [log] });
		}
	}
}
