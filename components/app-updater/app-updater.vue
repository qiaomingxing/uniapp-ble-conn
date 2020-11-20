<template>
	<view @touchmove.stop.prevent>
		<view class="app-updater-modal-box" :class="[modalVisible?'app-updater-modal-normal':'app-updater-modal-scale',modalVisible?'app-updater-modal-show':'']">
			<view>
				<view class="app-updater-modal-title">{{ i18n.str_version_update }}</view>
				<view class="app-updater-modal-content">
					<view class="is-text-left">
						<view v-for="(item, index) in contentList" :key="index">{{ item }}</view>
					</view>
				</view>
				<view class="app-updater-modalBtn-box">
					<button v-if="!g_isForceUpdate" class="app-updater-modal-btn app-updater-gray-outline" hover-class="app-updater-outline-hover" @tap="closeModal">{{ i18n.str_update_next_time }}</button>
					<button class="app-updater-modal-btn app-updater-primary" hover-class="app-updater-primary-hover" @tap="confirmModal">{{ i18n.str_update_at_once }}</button>
				</view>
			</view>
		</view>
		<view class="app-updater-modal-mask" :class="[modalVisible?'app-updater-mask-show':'']" @tap="maskClick"></view>
	</view>
</template>

<script>
	import api from '@/api';
	import request from '@/common/request';

	export default {
		name: 'AppUpdater',
		components: {},
		props: {
			// 是否自动检测更新
			auto: {
				required: false,
				type: Boolean,
				default: false
			},
			// 检测更新Url
			checkUrl: {
				required: false,
				type: String,
				default: 'http://update.haierbiomedical.com/api/appVersionInfo/getAppUpgradeInfo'
			},
			// App更新标志，接口请求参数
			appCode: {
				required: false,
				type: String,
				default: 'BiolinkApp'
			},
			//点击遮罩 是否可关闭
			maskClosable: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				modalVisible: false,
				downloadUrl: '',
				contentList: [],
				versionCode: ''
			};
		},
		mounted() {
			this.$store.dispatch('app/setIsForceUpdate', false);
			if (this.auto && !this.g_isCheckedUpdate) {
				this.checkUpdate();
			}
		},
		methods: {
			// 遮层点击事件
			maskClick() {
				if (!this.maskClosable) return;
				this.closeModal()
			},
			// 显示弹窗
			showModal() {
				this.modalVisible = true;
			},
			// 隐藏更新弹窗
			closeModal(skip = false) {
				this.modalVisible = false;
				this.$store.dispatch('app/setIsCheckedUpdate', true);
				if (skip) {
					uni.setStorageSync('skipVersion', this.versionCode);
				}
			},
			// 确定更新App
			confirmModal() {
				plus.runtime.openURL(this.downloadUrl);
			},
			// 检测更新
			checkUpdate(showtip = false) {
				// #ifdef APP-PLUS
				let skipVersion = uni.getStorageSync('skipVersion');
				let curVersion = plus.runtime.versionCode;
				let platform = 0; // 0:Android,1:ios
				if (uni.getSystemInfoSync().platform == "ios") {
					platform = 1;
				}
				this.checkVersion(curVersion, platform).then(res => {
					if (res.code == 200) {
						if (skipVersion == res.data.versionNum && !showtip) {
							return
						}
						this.versionCode = res.data.versionNum;
						this.downloadUrl = res.data.versionDownloadUrl;
						if (res.data.versionDesc) {
							this.contentList = res.data.versionDesc.split('|');
						} else {
							this.contentList = [`${this.i18n.str_new_version}${res.data.versionName}`]
						}
						this.$store.dispatch('app/setIsForceUpdate', res.data.isForceUpdate == 1 ? true : false);
						if(this.g_isForceUpdate) {
							uni.hideTabBar()
						}
						this.showModal();
					} else if (showtip) {
						this.$tips.toast(this.i18n.str_no_new_version)
					}
				});
				// #endif
			},
			// 检查版本更新
			checkVersion(versionCode, platform = 0) {
				let options = {
					header: {
						'Content-Type': 'application/json;charset=UTF-8'
					}
				}
				let params = {
					applicationCode: this.appCode,
					versionNum: versionCode,
					platformType: platform
				}
				return request.post(this.checkUrl, params, options)
			}
		}
	};
</script>

<style lang="scss">
	.app-updater-modal-box {
		position: fixed;
		left: 50%;
		top: 50%;
		margin: auto;
		background: #fff;
		z-index: 9999998;
		transition: all 0.3s ease-in-out;
		opacity: 0;
		width: 84%;
		padding: 40rpx 64rpx;
		border-radius: 24rpx;
		box-sizing: border-box;
		visibility: hidden;
	}

	.app-updater-modal-scale {
		transform: translate(-50%, -50%) scale(0);
	}

	.app-updater-modal-normal {
		transform: translate(-50%, -50%) scale(1);
	}

	.app-updater-modal-show {
		opacity: 1;
		visibility: visible;
	}

	.app-updater-modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 9999996;
		transition: all 0.3s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}

	.app-updater-mask-show {
		visibility: visible;
		opacity: 1;
	}

	.app-updater-modal-title {
		text-align: center;
		font-size: 34rpx;
		color: #333;
		padding: 10rpx 0;
		font-weight: bold;
	}

	.app-updater-modal-content {
		text-align: center;
		color: #999;
		font-size: 28rpx;
		padding-top: 20rpx;
		padding-bottom: 40rpx;
	}

	.app-updater-modalBtn-box {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between
	}

	.app-updater-flex-column {
		flex-direction: column;
	}

	.app-updater-modal-btn {
		flex: 1;
		width: 46%;
		height: 76rpx;
		line-height: 76rpx;
		position: relative;
		border-radius: 10rpx;
		font-size: 28rpx;
		overflow: visible;
		margin-left: 0;
		margin-right: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.app-updater-modal-btn + .app-updater-modal-btn {
		margin-left: 30rpx;
	}
		

	.app-updater-modal-btn::after {
		content: "";
		position: absolute;
		width: 200%;
		height: 200%;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scale(0.5, 0.5);
		transform: scale(0.5, 0.5);
		left: 0;
		top: 0;
		border-radius: 20rpx;
	}

	.app-updater-primary {
		background: #16a98c;
		color: #fff;
	}

	.app-updater-primary-hover {
		background: rgba(22, 169, 140, 0.7);
		color: #e5e5e5;
	}

	.app-updater-primary-outline {
		color: #16a98c;
		background: none;
	}

	.app-updater-primary-outline::after {
		border: 1px solid #16a98c;
	}

	.app-updater-danger {
		background: #ed3f14;
		color: #fff;
	}

	.app-updater-danger-hover {
		background: #d53912;
		color: #e5e5e5;
	}

	.app-updater-danger-outline {
		color: #ed3f14;
		background: none;
	}

	.app-updater-danger-outline::after {
		border: 1px solid #ed3f14;
	}

	.app-updater-red {
		background: #e41f19;
		color: #fff;
	}

	.app-updater-red-hover {
		background: #c51a15;
		color: #e5e5e5;
	}

	.app-updater-red-outline {
		color: #e41f19;
		background: none;
	}

	.app-updater-red-outline::after {
		border: 1px solid #e41f19;
	}

	.app-updater-warning {
		background: #ff7900;
		color: #fff;
	}

	.app-updater-warning-hover {
		background: #e56d00;
		color: #e5e5e5;
	}

	.app-updater-warning-outline {
		color: #ff7900;
		background: none;
	}

	.app-updater-warning-outline::after {
		border: 1px solid #ff7900;
	}

	.app-updater-green {
		background: #19be6b;
		color: #fff;
	}

	.app-updater-green-hover {
		background: #16ab60;
		color: #e5e5e5;
	}

	.app-updater-green-outline {
		color: #19be6b;
		background: none;
	}

	.app-updater-green-outline::after {
		border: 1px solid #19be6b;
	}

	.app-updater-white {
		background: #fff;
		color: #333;
	}

	.app-updater-white-hover {
		background: #f7f7f9;
		color: #666;
	}

	.app-updater-white-outline {
		color: #333;
		background: none;
	}

	.app-updater-white-outline::after {
		border: 1px solid #333;
	}

	.app-updater-gray {
		background: #ededed;
		color: #999;
	}

	.app-updater-gray-hover {
		background: #d5d5d5;
		color: #898989;
	}

	.app-updater-gray-outline {
		color: #999;
		background: none;
	}

	.app-updater-gray-outline::after {
		border: 1px solid #999;
	}

	.app-updater-outline-hover {
		opacity: 0.6;
	}

	.app-updater-circle-btn {
		border-radius: 40rpx !important;
	}

	.app-updater-circle-btn::after {
		border-radius: 80rpx !important;
	}
</style>
