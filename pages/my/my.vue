<template>
	<view class="my-container">
		<view class="top-fixed flex-between alcenter h100">
			<image src="../../static/image/shezhi-3@2x.png" mode="" @tap="goPath('./setting')"></image>
			<image src="../../static/image/scan.png" mode=""></image>
		</view>
		<view class="invite-container flex-between alcenter mt20 mb40">
			<view>邀请好友</view>
			<view class="invite-btn ft24 c_383A50">立即前往</view>
		</view>
		<view class="list-item flex-between alcenter mb30" @tap="goPath('./property')">
			<view class="flex alcenter">
				<image src="../../static/image/zichan@2x.png" mode="" class="mr20"></image>
				<view>资产总览</view>
			</view>
			<image src="../../static/image/arrow-right.png" mode="" class="arrow"></image>
		</view>
		<view class="list-item flex-between alcenter mb30" @tap="goPath('./myWallet')">
			<view class="flex alcenter">
				<image src="../../static/image/qianbao-3@2x.png" mode="" class="mr20"></image>
				<view>我的钱包</view>
			</view>
			<image src="../../static/image/arrow-right.png" mode="" class="arrow"></image>
		</view>
		<!-- <view class="list-item flex-between alcenter mb30" @tap="goPath('./tradingRecord')">
			<view class="flex alcenter">
				<image src="../../static/image/jiaoyi-2@2x.png" mode="" class="mr20"></image>
				<view>交易记录</view>
			</view>
			<image src="../../static/image/arrow-right.png" mode="" class="arrow"></image>
		</view> -->
		<view class="list-item flex-between alcenter mb30" @tap="goPath('./addressBook')">
			<view class="flex alcenter">
				<image src="../../static/image/dizhibu@2x.png" mode="" class="mr20"></image>
				<view>地址簿</view>
			</view>
			<image src="../../static/image/arrow-right.png" mode="" class="arrow"></image>
		</view>
		<navigator hover-class="none" url="./aboutUs" class="list-item flex-between alcenter mb30" @tap="goPath('./aboutUs')">
			<view class="flex alcenter">
				<image src="../../static/image/guanyuwomen-3@2x.png" mode="" class="mr20"></image>
				<view>关于我们</view>
			</view>
			<image src="../../static/image/arrow-right.png" mode="" class="arrow"></image>
		</navigator>
		<navigator hover-class="none" url="./helpCenter" class="list-item flex-between alcenter mb30">
			<view class="flex alcenter">
				<image src="../../static/image/bangzhuzhongxin@2x.png" mode="" class="mr20"></image>
				<view>帮助中心</view>
			</view>
			<image src="../../static/image/arrow-right.png" mode="" class="arrow"></image>
		</navigator>
	</view>
</template>

<script>
	import { hasWallet } from '@/common/utils/storage.js';
	export default {
		data() {
			return {
				hasWallet: false,
			};
		},
		onShow() {
			this.hasWallet = hasWallet()
		},
		methods: {
			goPath(url) {
				if(!this.hasWallet) return this.$alert('无钱包信息')
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="scss">
	.my-container{
		$status_Height: var(--status-bar-height);
		padding: 0 40rpx;
		padding-top: $status_Height;
		.top-fixed{
			position: sticky;
			top: 0;
			background-color: #ffffff;
			z-index: 10;
			image{
				width: 44rpx;
				height: 44rpx;
			}
		}
		.invite-container{
			height: 120rpx;
			padding: 0 32rpx 0 42rpx;
			font-size: 32rpx;
			color: #F0D6B7;
			background: linear-gradient(90deg, #454A5D 0%, #32324A 100%);
			border-radius: 40rpx;
			.invite-btn{
				padding: 8rpx 18rpx;
				background: #F2DAB8;
				border-radius: 48rpx;
			}
		}
		.list-item{
			height: 80rpx;
			font-size: 32rpx;
			color: #000000;
			image{
				width: 44rpx;
				height: 44rpx;
			}
		}
	}
</style>
