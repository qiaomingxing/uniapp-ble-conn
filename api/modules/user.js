import request from '@/common/request';
import constant from '@/constant'

export default {
	/**
	 * 登录
	 * @method POST
	 * @param {Object}
	 */
	login: params => request.post(constant.user.login, params)
}
