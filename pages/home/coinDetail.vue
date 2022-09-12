<template>
	<view class="coin-detail-container">
		<view class="flex-column flex-center top-container">
			<image src="../../static/image/ETH@2x.png" mode=""></image>
			<view class="ft36 mt20">ETH</view>
		</view>
		<view class="list bg-white mb50">
			<view class="title ft36 flex-center h100">基本信息</view>
			<view class="list-item flex-between alcenter h100 plr40">
				<view class="ft32">项目名称</view>
				<view class="f32 c_9397AF">ETH</view>
			</view>
			<view class="list-item flex-between alcenter h100 plr40">
				<view class="ft32">官网</view>
			</view>
			<view class="list-item flex-between alcenter h100 plr40">
				<view class="ft32">合约地址</view>
			</view>
			<view class="list-item flex-between alcenter h100 plr40">
				<view class="ft32">第三方评级</view>
			</view>
		</view>
		<view class="list bg-white mb50">
			<view class="title ft36 flex-center h100">发行信息</view>
			<view class="list-item flex-between alcenter h100 plr40">
				<view class="ft32">发行时间</view>
			</view>
			<view class="list-item flex-between alcenter h100 plr40">
				<view class="ft32">发行总量</view>
				<view class="f32 c_9397AF">100000</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F7F8FC;
	}
	.coin-detail-container{
		.top-container{
			height: 248rpx;
			image{
				width: 80rpx;
				height: 80rpx;
			}
		}
	}
</style>
