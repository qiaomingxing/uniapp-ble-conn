### Utils 全局工具类使用

### 使用方式

在 ``script`` 中使用

#### 方式一

```javascript
// 两种导入方式
import utils from "@/common/utils"
import { getBaseUrl } from "@/common/utils"

export default {
	methods: {
		printUrl: function() {
			console.log(getBaseUrl())
			console.log(utils.getBaseUrl())
			console.log(this.$utils.getBaseUrl()) // 已挂载到prototype，全局使用
		}
	}
}
```
