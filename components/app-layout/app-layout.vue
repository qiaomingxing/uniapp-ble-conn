<template>
	<view class="app-layout" :style="[customStyle]" @click="clickWrapper">
		<slot></slot>
		<!-- loading -->
		<app-loading :visible="g_loading.app"></app-loading>
		<!--toast提示-->
		<app-toast ref="toast"></app-toast>
		<!-- update版本更新 -->
		<app-updater ref="updater" v-if="isConfig('updater')" :auto="autoUpdate"></app-updater>
		<!-- 开发环境日志fab -->
		<app-fab v-if="!$env.isProd&&g_devMode.open" :left="10" :right="0" :bottom="115" bgColor="#dd6161" @click="show=true">
			<u-icon name="order" color="#fff" size="50"></u-icon>
		</app-fab>
		<!-- 开发环境日志弹窗 -->
		<u-popup v-model="show" mode="bottom" z-index="99998" :closeable="true" :safe-area-inset-bottom="true" border-radius="10">
			<view class="pop-wrap">
				<view class="pop-title">
					日志
					<u-icon @click="clearLog" class="icon-clear" name="trash" color="#dd6161" size="50"></u-icon>
				</view>
				<scroll-view scroll-y="true" style="height: 800rpx;">
					<view v-if="g_devMode.log&&g_devMode.log.length>0">
						<view class="log-item" v-for="(item, index) in g_devMode.log" :key="index">
							{{ item }}
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name: 'AppLayout',
		components: {},
		props: {
			// 自定义样式，对象形式
			customStyle: {
				type: Object,
				default() {
					return {};
				}
			},
			// 配置项 逗号分隔拼接字符串：networkbar,updater
			config: {
				type: String,
				default: ''
			},
			// 是否自动检测版本更新
			autoUpdate: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				imgUrl: '',
				show: false
			};
		},
		mounted() {},
		methods: {
			// 是否有此配置项
			isConfig(key) {
				return this.config.indexOf(key) > -1
			},
			// 检测版本更新
			checkUpdate(showtip = false) {
				if(this.isConfig('updater')) {
					this.$refs.updater.checkUpdate(showtip)
				}
			},
			/**
			 * toast提示
			 */
			toast(title, icon, options = {}) {
				let op = {
					title: title,
					icon: icon || false,
					imgUrl: icon ? `/static/images/toast/toast_${icon}.png` : '',
					content: options.content || '',
					duration: options.duration || 2000
				}
				this.$refs.toast.show(op)
			},
			clickWrapper: (function() {
				let times = 0
				let timeId = 0
				return function(e) {
					times++
					timeId && clearTimeout(timeId)
					if (times === 5 && !this.$env.isProd) {
						if (this.g_devMode.open) {
							this.$tips.confirm('您已经进入开发模式', { showCancel: false })
						} else {
							this.$tips.confirm('是否进入开发模式').then(() => {
								this.$store.dispatch('app/setDevMode', { open: true })
							}).catch(() => {
								times = 0
							})
						}
					}
					timeId = setTimeout(() => {
						times = 0
					}, 300)
				}
			})(),
			clearLog() {
				this.$store.dispatch('app/setDevMode', { log: [] })
			}
		}
	};
</script>

<style lang="scss">
	.app-layout {
		font-size: 28rpx;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		color: $uni-text-color;
		.pop-wrap {
			padding: 0 20rpx;
			text-align: left;
			position: relative;
		}

		.pop-title {
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 36rpx;
			font-weight: 500;
		}
		
		.icon-clear {
			position: absolute;
			left: 20rpx;
			top: 28rpx
		}
		
		.log-item {
			color: #666;
			padding: 10rpx 0;
			border-bottom: 1px solid #eee;
			word-break: break-all;
		}
	}
</style>
