<template>
	<view @touchmove.stop.prevent>
		<view class="app-fab-box" :class="{'app-fab-right':!left || (left && right)}" :style="{left:getLeft(),right:getRight(),bottom:bottom+'rpx'}">
			<view class="app-fab-btn" :class="{'app-visible':isOpen,'app-fab-hidden':hidden}">
				<view class="app-fab-item-box" :class="{'app-fab-item-left':left && !right && item.imgUrl}" v-for="(item,index) in btnList"
				 :key="index" @tap.stop="handleClick(index)">
					<view :class="[left && !right?'app-text-left':'app-text-right']" v-if="item.imgUrl" :style="{fontSize:item.fontSize+'rpx',color:item.color}">{{item.text || ""}}</view>
					<view class="app-fab-item" :style="{width:width+'rpx',height:height+'rpx',background:item.bgColor || bgColor,borderRadius:radius}">
						<view class="app-fab-title" v-if="!item.imgUrl" :style="{fontSize:item.fontSize+'rpx',color:item.color}">{{item.text || ""}}</view>
						<image :src="item.imgUrl" class="app-fab-img" v-else :style="{width:item.imgWidth+'rpx',height:item.imgHeight+'rpx'}"></image>
					</view>
				</view>
			</view>
			<view class="app-fab-item" :class="{'app-active':isOpen}" :style="{width:width+'rpx',height:height+'rpx',borderRadius:radius,background:bgColor,color:color}"
			 @tap.stop="handleClick(-1)">
				<block v-if="$slots.default">
				  <slot />
				</block>
				<u-icon v-else name="plus" color="#fff" size="38"></u-icon>
			</view>
		</view>
		<view class="app-fab-mask" :class="{'app-visible':isOpen}" @tap="handleClickCancel"></view>
	</view>
</template>

<script>
	//拓展出来的按钮不应多于6个，否则违反了作为悬浮按钮的快速、高效的原则
	export default {
		name: "tuiFab",
		props: {
			//rpx 为0时值为auto
			left: {
				type: Number,
				default: 0
			},
			//rpx 当为0时且left不为0，值为auto
			right: {
				type: Number,
				default: 80
			},
			//rpx bottom值
			bottom: {
				type: Number,
				default: 100
			},
			//默认按钮 宽度 rpx
			width: {
				type: Number,
				default: 108
			},
			//默认按钮 高度 rpx
			height: {
				type: Number,
				default: 108
			},
			//圆角值
			radius: {
				type: String,
				default: "50%"
			},
			//默认按钮背景颜色
			bgColor: {
				type: String,
				default: "#5677fc"
			},
			//字体颜色
			color: {
				type: String,
				default: "#fff"
			},
			btnList: {
				type: Array,
				default () {
					return []
				}
			},
			//点击遮罩 是否可关闭
			maskClosable: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				isOpen: false,
				hidden: true,
				timer: null
			};
		},
		methods: {
			getLeft() {
				let val = "auto"
				if (this.left && !this.right) {
					val = this.left + 'rpx'
				}
				return val
			},
			getRight() {
				let val = this.right + 'rpx'
				if (this.left && !this.right) {
					val = "auto"
				}
				return val
			},
			handleClick: function(index) {
				this.hidden = false
				clearTimeout(this.timer)
				if (index == -1 && this.btnList.length) {
					this.isOpen = !this.isOpen
				} else {
					this.$emit("click", {
						index: index
					})
					this.isOpen = false
				}
				if (!this.isOpen) {
					this.timer = setTimeout(() => {
						this.hidden = true
					}, 200)
				}
			},
			handleClickCancel: function() {
				if (!this.maskClosable) return;
				this.isOpen = false
			}
		},
		beforeDestroy() {
			clearTimeout(this.timer)
			this.timer = null
		}
	}
</script>

<style scoped>
	.app-fab-box {
		display: flex;
		justify-content: center;
		flex-direction: column;
		position: fixed;
		z-index: 99997;
	}

	.app-fab-right {
		align-items: flex-end;
	}

	.app-fab-btn {
		transform: scale(0);
		transition: all 0.2s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}

	.app-fab-hidden {
		height: 0;
		width: 0;
	}


	.app-fab-item-box {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-bottom: 40rpx;
	}

	.app-fab-item-left {
		flex-flow: row-reverse;
	}

	.app-fab-title {
		width: 90%;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.app-text-left {
		padding-left: 28rpx;
	}

	.app-text-right {
		padding-right: 28rpx;
	}

	.app-fab-img {
		display: block;
	}

	.app-fab-item {
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);
		transition: all 0.2s linear;
	}

	.app-radius {
		border-radius: 50%;
	}

	.app-active {
		transform: rotate(135deg);
	}

	.app-fab-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.75);
		z-index: 99996;
		transition: all 0.2s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}

	.app-visible {
		visibility: visible;
		opacity: 1;
		transform: scale(1);
	}
</style>
