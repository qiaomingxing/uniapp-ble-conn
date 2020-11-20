### vue-i18n 国际化

### 使用方式

在 ``script`` 中使用方法

```javascript

export default {
	computed: {
		i18n() {
			return this.$t('message');
		}
	},
    methods: {
        // 修改语言 locale：zh,en
		changeLanguage: function(locale) {
			this.$i18n.locale = locale;
			this.$store.dispatch('app/setLocale', locale)
		}
    }
}
```
在 ``template`` 中使用

```html
	<view>{{ i18n.str_login }}</view>

```

在 ``JavaScript`` 中使用

```javascript

import i18n from './i18n'
i18n.t('message.hello')

```

在 ``modules -> zh.js`` 中追加翻译字段，需同步追加其他国家翻译

```javascript
	module.exports = {
		message: {
			str_login: "登录"
		}
	};

```
