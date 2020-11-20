### Updater 版本更新管理器-仅限在app中使用

### 使用方式

在 ``script`` 中引用组件 

```javascript
import { AppUpdater } from '@/components';
export default {
    components: { AppUpdater }
}
```

在 ``template`` 中使用组件

```html
<app-updater ref="updater" :auto="true"></app-updater>

```

### 属性说明

|属性名         |类型		 |默认值		|说明						|
|---            |----		|---		|---						|
|auto           |Boolean	|false		|是否自动检测版本更新			|
|checkUrl       |String	    |""			|检测更新接口地址				|
|appCode        |String	    |""			|检测更新接口参数，标志App	|

### 事件说明

|事件名		|事件说明			|返回参数	|
|---		|---				|---		|
