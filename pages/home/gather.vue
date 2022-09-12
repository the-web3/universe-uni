<template>
	<view class="gather-container">
		<uni-nav-bar statusBar fixed left-icon="back" title="收款" @clickLeft="goBack" @clickRight="handleRight">
			<view slot="right" class="flex-column flex-center">
				<image src="../../static/image/shou@2x.png" mode="" class="nav-img"></image>
			</view>
		</uni-nav-bar>
		<view class="gather-box">
			<view class="address-title ft32 relative mb10">收款地址</view>
			<view class="flex">
				<view class="fle-one address ft28">{{address}}</view>
				<image src="../../static/image/fuzhi-2@2x.png" mode="" class="copy-img" @tap="handleCopy"></image>
			</view>
			<!-- <image src="../../static/image/erweima@2x.png" mode="" class="code-img"></image> -->
			<uqrcode ref="uqrcode" class="code-img"/>
			<view class="ft28 flex-center mt20">扫一扫向我支付</view>
		</view>
		<button type="default" class="share-btn" @tap="handleSave">保存</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				address: '',
				qrcodeSrc: ''
			};
		},
		onLoad(options) {
			this.address = options.address
		},
		onReady() {
			uni.showLoading({
				mask: true,
				title: '生成中...'
			})
			this.$refs
				.uqrcode
				.make({
					size: 180,
					text: this.address,
					enableDelay: false // 启用延迟绘制
				})
				.then(res => {
					// 返回的res与uni.canvasToTempFilePath返回一致
					console.log(res)
					console.log(`生成二维码耗时：${res.time}ms`)
					this.qrcodeSrc = res.tempFilePath
				})
				.finally(() => {
					uni.hideLoading()
				})
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			handleRight() {
				uni.showActionSheet({
				    itemList: ['刷新地址', '地址管理'],
				    success: (res) => {
				        console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
						if(res.tapIndex == 0) {
							this.$alert('刷新成功')
						}else{
							uni.navigateTo({
								url: '/pages/my/addressBook'
							})
						}
				    },
				    fail: (res) => {
				        console.log(res.errMsg);
				    }
				});
			},
			handleCopy() {
				uni.setClipboardData({
					data: this.address,
					success: () => {
						uni.showToast({
							title: '复制成功',
							icon: 'none'
						})
					}
				})
			},
			handleSave() {
				// #ifdef H5
				uni.showToast({
					icon: 'none',
					title: '长按图片保存'
				})
				return
				// #endif
				
				uni.saveImageToPhotosAlbum({
					filePath: this.qrcodeSrc,
					success: (res) => {
						uni.showToast({
							icon: 'success',
							title: '保存成功'
						})
					},
					fail: (err) => {
						uni.showToast({
							icon: 'none',
							title: JSON.stringify(err)
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	$status_Height: var(--status-bar-height);
	.gather-container{
		.nav-img{
			width: 44rpx;
			height: 44rpx;
		}
		.gather-box{
			width: 670rpx;
			height: 834rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 20rpx 20rpx 0rpx rgba(76, 110, 245, 0.1);
			border-radius: 16rpx;
			padding: 32rpx 18rpx 0 54rpx;
			margin: 30rpx auto 86rpx;
			background-image: url(../../static/image/pic.png);
			background-size: 100% 308rpx;
			background-position: center bottom;
			background-repeat: no-repeat;
			box-sizing: border-box;
			.address-title{
				&:after{
					content: '';
					position: absolute;
					left: -20rpx;
					top: 50%;
					transform: translateY(-50%);
					width: 6rpx;
					height: 20rpx;
					background: #1878FF;
					border-radius: 4rpx;
				}
			}
			.address{
				word-break: break-word;
				color: #77818C;
			}
			.copy-img{
				width: 44rpx;				height: 44rpx;
				margin-left: 48rpx;
			}
			.code-img{
				display: block;
				width: 360rpx;
				height: 360rpx;
				margin: 56rpx auto 0;
			}
		}
		.share-btn{
			width: 686rpx;
			line-height: 96rpx;
			height: 96rpx;
			font-size: 32rpx;
			color: #ffffff;
			background: #4C6EF5;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(76, 110, 245, 0.5);
			border-radius: 20rpx;
			margin: 0 auto;
		}
	}
</style>
