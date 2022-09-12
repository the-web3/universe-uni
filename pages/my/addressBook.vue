<template>
	<view class="address-book-container">
		<view class="address-item flex-between alcenter plr40 h100 mt40 mb40" v-for="(item, index) in list" :key="index" @tap="checkDetail(itme)">
			<view>
				<view class="ft32">{{item.name}}</view>
				<view class="flex alcenter">
					<view class="c_9397AF ft26 mr40">{{item.addr}}</view>
					<image src="../../static/image/fuzhi-2@2x.png" mode="" @tap="handleCopy(item.addr)"></image>
				</view>
			</view>
			<image src="../../static/image/arrow-right.png" mode="" class="arrow-img"></image>
		</view>
		<button type="default" class="add-btn flex-center" @tap="handleAdd">添加地址</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deviceId: 'c3c0268fa44293f2',
				list: []
			};
		},
		onShow() {
			// #ifdef APP-PLUS
			plus.device.getInfo({
				success: (e) =>{
					this.deviceId = e.uuid
					this.loadData()
				},
				fail: (e) =>{
					console.log('getDeviceInfo failed: '+JSON.stringify(e));
				}
			});
			// #endif
			// #ifdef H5
			this.loadData()
			// #endif
		},
		onPullDownRefresh() {
			this.loadData().then(() =>{
				uni.stopPullDownRefresh()
			}).catch(() => {
				uni.stopPullDownRefresh()
			})
		},
		methods: {
			loadData() {
				return new Promise((resolve, reject) => {
					this.$api.get_note_book({
						device_id: this.deviceId
					}).then(res => {
						this.list = res.data
						resolve(res)
					}).catch(err => {
						reject(err)
					})					
				})
			},
			handleCopy(address) {
				uni.setClipboardData({
					data: address,
					success: () => {
						uni.showToast({
							title: '复制成功'
						})
					}
				})
			},
			checkDetail(item) {
					
			},
			handleAdd() {
				uni.navigateTo({
					url: './addAddress'
				})
			}
		}
	}
</script>

<style lang="scss">
	.address-book-container{
		padding-bottom: 130rpx;
		.address-item{
			image{
				width: 24rpx;
				height: 24rpx;
			}
			.arrow-img{
				width: 44rpx;
				height: 44rpx;
				flex-shrink: 0;
			}
		}
		.add-btn{
			position: fixed;
			bottom: 40rpx;
			right: 194rpx;
			left:194rpx;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 32rpx;
			color: #ffffff;
			background: #4C6EF5;
			border-radius: 38rpx;
		}
	}
</style>
