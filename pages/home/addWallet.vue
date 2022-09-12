<template>
	<view class="add-wallet-container">
		<view @tap="go" class="flex-between alcenter h80 item mt40 mb40 mlr40">
			<view class="flex alcenter">
				<image src="../../static/image/identify.png" mode="" class="mr30"></image>
				<view>
					<view class="ft28">身份钱包(HD)</view>
					<image src="../../static/image/wenti-2@2x.png" mode="" class="question-img mt10"></image>
				</view>
			</view>
			<image src="../../static/image/arrow-right.png" mode="" class="arrow-img"></image>
		</view>
		<view class="ft32 c_9397AF mlr40 ">单网络钱包</view>
		<view hover-class="none" url="./createWallet" @tap="go" class="flex-between alcenter h80 item mt40 mb40 mlr40">
			<view class="flex alcenter">
				<image src="../../static/image/BTC@2x.png" mode="" class="mr30"></image>
				<view class="ft32">比特币</view>
			</view>
			<image src="../../static/image/arrow-right.png" mode="" class="arrow-img"></image>
		</view>
		<navigator hover-class="none" url="./createWallet?name=以太坊" class="flex-between alcenter h80 item mt40 mb40 mlr40">
			<view class="flex alcenter">
				<image src="../../static/image/ETH@2x.png" mode="" class="mr30"></image>
				<view class="ft32">以太坊</view>
			</view>
			<image src="../../static/image/arrow-right.png" mode="" class="arrow-img"></image>
		</navigator>
		<view hover-class="none" url="./createWallet" @tap="go" class="flex-between alcenter h80 item mt40 mb40 mlr40">
			<view class="flex alcenter">
				<image src="../../static/image/huobi@2x.png" mode="" class="mr30"></image>
				<view class="ft32">火币生态链</view>
			</view>
			<image src="../../static/image/arrow-right.png" mode="" class="arrow-img"></image>
		</view>
		<view class="flex-between alcenter h80 item mt40 mb40 mlr40" @tap="go">
			<view class="flex alcenter">
				<image src="../../static/image/bian.png" mode="" class="mr30"></image>
				<view class="ft32">币安智能链</view>
			</view>
			<image src="../../static/image/arrow-right.png" mode="" class="arrow-img"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deviceId: ''
			};
		},
		onLoad() {
			// #ifndef H5
			plus.device.getInfo({
				success: (e) =>{
					this.deviceId = e.uuid
					console.log('getDeviceInfo success: '+JSON.stringify(e));
				},
				fail:(e) =>{
					console.log('getDeviceInfo failed: '+JSON.stringify(e));
				}
			});			
			// #endif
		},
		methods: {
			go() {
				this.$alert('暂不支持')
			}
		}
	}
</script>

<style lang="scss">
	.add-wallet-container{
		.item{
			image{
				width: 80rpx;
				height: 80rpx;
			}
			.question-img{
				width: 30rpx;
				height: 30rpx;
			}
			.arrow-img{
				width: 44rpx;
				height: 44rpx;
			}
		}
	}
</style>