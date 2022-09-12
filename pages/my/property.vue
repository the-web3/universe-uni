<template>
	<view class="property-container">
		<view class="top-container flex-column flex-center c-white">
			<view class="flex alcenter">
				<view class="ft28">我的资产</view>
				<image src="../../static/image/eye.png" mode="" class="ml40"></image>
			</view>
			<view class="ft64 mt20">{{showNum ? `${assetDetail.total_asset && assetDetail.total_asset.toFixed(2)}` : '***'}}</view>
		</view>
		<view class="search-container flex alcenter">
			<image src="../../static/image/search.png" mode="" class="mr20"></image>
			<input class="ft26" type="text" v-model="searchName" />
		</view>
		<view class="single-list bg-white plr40 pb40 mb20" v-for="(item, index) in assetDetail.coin_asset" :key="index">
			<view class="item-title flex alcenter h100 ft32">{{item.wallet_name}}</view>
			<view class="list-item flex-between alcenter h80 mb40"  v-for="(wallet, walletIndex) in item.wallet_balance" :key="walletIndex">
				<view class="flex alcenter">
					<image :src="`${config.base_url + wallet.icon}`" mode="" class="mr40"></image>
					<view>
						<view class="ft36">{{wallet.name}}</view>
						<view class="c_9397AF">{{wallet.chain_name}}</view>
					</view>
				</view>
				<view>
					<view class="ft36 text-right">{{wallet.balance && wallet.balance.toFixed(4)}}</view>
					<view class="c_9397AF text-right">${{wallet.usdt_price && wallet.usdt_price.toFixed(2)}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import config from '@/config'
	export default {
		data() {
			return {
				config,
				deviceId: 'c3c0268fa44293f2',
				showNum: true,
				searchName: '',
				assetDetail: {
					total_asset: 0
				}
			};
		},
		onLoad() {
			this.loadData()
		},
		methods: {
			loadData() {
				// #ifdef APP-PLUS
				plus.device.getInfo({
					success: (e) =>{
						this.deviceId = e.uuid
						uni.showLoading({
							title: '加载中'
						})
						this.$api.get_wallet_asset({
							device_id: this.deviceId
						}).then(res => {
							uni.hideLoading()
							this.assetDetail = res.data
						}).catch(() => {
							uni.hideLoading()
						})
					},
					fail: (e) =>{
						console.log('getDeviceInfo failed: '+JSON.stringify(e));
					}
				});
				// #endif
				// #ifdef H5
				uni.showLoading({
					title: '加载中'
				})
				this.$api.get_wallet_asset({
					device_id: this.deviceId
				}).then(res => {
					uni.hideLoading()
					this.assetDetail = res.data
				}).catch(() => {
					uni.hideLoading()
				})
				// #endif
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F7F8FC;
	}
	.property-container{
		.top-container{
			height: 220rpx;
			background: #4C6EF5;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(76, 110, 245, 0.5);
			border-radius: 40rpx;
			margin: 20rpx 40rpx 46rpx;
			image{
				width: 44rpx;
				height: 44rpx;
			}
		}
		.search-container{
			height: 80rpx;
			background: #FFFFFF;
			border-radius: 20px;
			padding: 0 26rpx;
			margin: 0 40rpx 30rpx;
			image{
				width: 44rpx;
				height: 44rpx;
			}
			input{
				flex: 1;
				height: 44rpx;
			}
		}
		.single-list{
			.list-item{
				image{
					width: 80rpx;
					height: 80rpx;
				}
				&:last-child{
					margin-bottom: 0!important;
				}
			}
		}
	}
</style>
