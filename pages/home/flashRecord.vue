<template>
	<view class="flash-record-container plr40">
		<view class="list-item flex-between h80 mt40 mb40" v-for="(item, index) in 10" :key="index">
			<view class="flex flex-one alcenter mr30">
				<image src="../../static/image/USDT@2x.png" mode="" class="mr30"></image>
				<view class="mr30">
					<view class="ft32">0.001</view>
					<view class="ft24 c_9397AF">CRT</view>
				</view>
				<image src="../../static/image/zhuanhuan@2x.png" mode="" class="exchange-img"></image>
			</view>
			<view class="flex flex-one alcenter">
				<image src="../../static/image/EOS@2x.png" mode="" class="mr30"></image>
				<view class="mr30">
					<view class="ft32">0.005</view>
					<view class="ft24 c_9397AF">以太网</view>
				</view>
				<view class="flex alcenter">
					<view class="ft28 c_9397AF">详情</view>
					<image src="../../static/image/arrow-right.png" mode="" class="arrow"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh()
		}
	}
</script>

<style lang="scss">
	.flash-record-container{
		.list-item{
			image{
				width: 80rpx;
				height: 80rpx;
			}
			.exchange-img{
				width: 60rpx;
				height: 60rpx;
				transform: rotate(-90deg);
			}
			.arrow{
				width: 44rpx;
				height: 44rpx;
			}
		}
	}
</style>
