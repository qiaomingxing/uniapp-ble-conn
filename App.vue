<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			this.$utils.checkLogin();
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		},
		onError(err) {
			console.log(err);
		}
	};
</script>

<style lang="scss">
	@import "assets/iconfont/iconfont.css";
	@import "uview-ui/index.scss";
	@import 'assets/style/index.scss';
	
	page {
		background-color: #ffffff;
		height: 100%;
	}
</style>
