<template>
	<view><web-view :webview-styles="webviewStyles" :src="url"></web-view></view>
</template>

<script>
export default {
	data() {
		return {
			webviewStyles: {
				progress: {
					color: '#FF3333'
				}
			},
			url: ''
		};
	},
	onLoad(option) {
		console.log(option.url);
		this.url = decodeURIComponent(option.url);
		if (option.title) {
			uni.setNavigationBarTitle({
				title: option.title
			});
		}
	}
};
</script>

<style lang="scss"></style>
