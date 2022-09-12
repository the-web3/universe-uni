<template>
	<view class="export-container">
		<view class="fill-container flex flex-wrap">
			<view class="fill-item ft28 c_4C6EF5 flex-center" v-for="(item, index) in fillWords" :key="index">{{item}}</view>
		</view>
		<button type="default" class="share-btn" @tap="goBack">确定</button>
	</view>
</template>

<script>
	import * as base from '@/common/word/base';
	export default {
		data() {
			return {
				currentWallet: {},
				fillWords: []
			}
		},
		async onLoad() {
			this.currentWallet = uni.getStorageSync('currentWallet')
			this.fillWords = await base.EntropyToMnemonic(this.currentWallet.mnemonic_code, "english")
			this.fillWords = this.fillWords.split(' ')
		},
		methods: {
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	.export-container{
		.fill-container{
			width: 700rpx;
			height: 400rpx;
			background: #F7F8FC;
			border-radius: 30rpx;
			margin-left: 25rpx;
			padding: 14rpx 4rpx 14rpx 18rpx;
			margin-bottom: 92rpx;
			margin-top: 50rpx;
			box-sizing: border-box;
			.fill-item{
				width: 210rpx;
				height: 80rpx;
				background: #FFFFFF;
				border-radius: 30rpx;
				margin-right: 16rpx;
				margin-bottom: 16rpx;
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
			margin: 80rpx auto;
		}
	}
</style>
