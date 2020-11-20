### CustomIcon 扩展自定义图标库

> 说明
> 基于uView [Icon图标](https://uviewui.com/components/icon.html)和[阿里字体图标库](https://www.iconfont.cn/)，扩展自定义图标库

### 使用流程

1. 在iconfont后台创建图标项目并修改图标的前缀，这样以后有新图标加入的时候，不用每次频繁修改前缀
2. 修改"FontClass/Symbol 前缀"项为"custom-icon-"，修改"Font Family"为"custom-icon"
3. 下载项目至本地，复制"iconfont.css"文件到uni-app目根目录的static或assets目录
4. 修改iconfont.css

```css
@font-face {
	/* 声明"custom-icon"字体 */
	font-family: "custom-icon";
	src: url('data:application/x-font-woff2;charset=utf-8;base64,xxxxxxxx') format('woff2'); // 末位改为英文分号
}
.custom-icon {
	font-family: "custom-icon" !important;
	font-size: 16px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.custom-icon-home:before {
	content: "\e656";
}
```

5. 在项目根目录的"App.vue"中，引入上述的"iconfont.css"，注意自己存放的路径，且通过"@import"引入的外部样式，为了兼容性建议使用相对路径， 且引入的样式，需要写在style标签有效内容中的最前面，如下：

```css
/* App.vue */
<style>
/* 此处为style标签内容的最前面 */
@import "assets/iconfont/iconfont.css";

.view {
	......
}

</style>

```

6. 通过如下方式引用：通过custom-prefix指定类名为custom-icon

```html

<u-icon name="home" custom-prefix="custom-icon" size="40" color="#5677fc"></u-icon>

```