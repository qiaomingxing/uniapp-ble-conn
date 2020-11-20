### Tips 全局提示工具类使用

### 使用方式

在 ``script`` 中使用

#### 方式一

```javascript
// 两种导入方式
import tips from "@/common/tips"
import { loading } from "@/common/tips"

export default {
	methods: {
		openLoading: function() {
			loading()
			tips.loading()
			this.$tips.loading()) // 已挂载到prototype，全局使用
		}
	}
}
```
