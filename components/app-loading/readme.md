### Loading 加载框

### 使用方式

在 ``script`` 中引用组件 

```javascript
import { AppLoading } from '@/components';
export default {
    components: { AppLoading },
	data() {
		return {
			loading: false
		};
	},
	methods: {
		show() {
			this.loading = true
			setTimeout(() => {
				this.loading = false
			}, 5000);
		}
	}
}
```

在 ``template`` 中使用组件

```html
<app-loading :visible="loading" text="自定义文字"></app-loading>

```
																		

### 属性说明

|属性名		|类型		|默认值		|说明	|
|---		|----		|---		|---	|
|visible	|Boolean	|false		|---	|
|test		|String		|loading	|---	|

### 事件说明

|事件名	    |事件说明		|返回参数		|
|---		|---			|---			|
