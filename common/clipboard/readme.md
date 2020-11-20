### Clipboard 复制文本

### 使用方式

在 ``script`` 中使用

```javascript
const clipboard = require("@/common/clipboard/clipboard.thorui.js")
export default {
    methods: {
        getClipboardData: function() {
        	const that = this
        	clipboard.getClipboardData('test data', (res) => {
        		// #ifdef H5
        		if (res) {
        			// 链接复制成功
        		} else {
        			// 链接复制失败
        		}
        		// #endif
        	})
        },
    }
}
```
