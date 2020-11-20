### 统一接口调用

### 使用方式

在 ``script`` 中使用方法

```javascript

export default {
    methods: {
        // 请求接口 - 方式一
		doRequest(params) {
			this.api.user.login(params).then(res => {
				if (res.code == 1) {
					// 请求成功
				} else {
					// 请求异常
				}
			}).catch(err => {
				// 请求异常
			});
		},
		// 请求接口 - 方式二
		async doRequestAsync(params) {
			let res = await this.api.user.login(params)
			if(res.code == 1) {
				// 请求成功
			} else {
				// 请求异常
			}
		}
    }
}
```
