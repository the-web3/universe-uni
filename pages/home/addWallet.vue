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
		<view hover-class="none" url="./createWallet" @tap="go(item)" class="flex-between alcenter h80 item mt40 mb40 mlr40" v-for="(item, index) in menus" :key="index">
			<view class="flex alcenter">
				<image :src="item.active_logo" mode="" class="mr30"></image>
				<view class="ft32">{{item.name}}</view>
			</view>
			<image src="../../static/image/arrow-right.png" mode="" class="arrow-img"></image>
		</view>
	</view>
</template>

<script>
	import { CHAIN_LIST } from '@/common/constants';
	export default {
		data() {
			return {
				menus: CHAIN_LIST,
			};
		},
		onLoad() {
		},
		methods: {
			go(currentCryptocurrency) {
				if(!currentCryptocurrency.support) {
					return this.$alert('暂不支持')
				}
				uni.navigateTo({
					url: `/pages/my/createWallet?chain_name=${currentCryptocurrency.name}`
				})
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