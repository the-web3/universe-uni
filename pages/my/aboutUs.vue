<template>
	<view class="about-us-container">
		<view class="top-container flex-column flex-center">
			<image src="http://image.wufazhuce.com/Fkpn4sSrpR7VDzPRfLNEFDLQJRk-" mode=""></image>
			<view class="ft36 mt10">软件名称</view>
			<view class="c_9397AF">当前版本：1.1.1</view>
		</view>
		<view class="list">
			<view class="list-item h120 flex-between alcenter plr40">
				<view class="ft32">版本更新</view>
				<image src="../../static/image/arrow-right.png" mode=""></image>
			</view>
			<view class="list-item h120 flex-between alcenter plr40">
				<view class="ft32">服务协议</view>
				<image src="../../static/image/arrow-right.png" mode=""></image>
			</view>
			<view class="list-item h120 flex-between alcenter plr40">
				<view class="ft32">隐私策略</view>
				<image src="../../static/image/arrow-right.png" mode=""></image>
			</view>
		</view>
		<view class="list">
			<view class="list-item h120 flex-between alcenter plr40">
				<view class="ft32">官方网站</view>
				<image src="../../static/image/arrow-right.png" mode=""></image>
			</view>
			<view class="list-item h120 flex-between alcenter plr40">
				<view class="ft32">微信公众号</view>
				<image src="../../static/image/arrow-right.png" mode=""></image>
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
	.about-us-container{
		.top-container{
			height: 340rpx;
			background-color: #F7F8FC;
			image{
				width: 110rpx;
				height: 110rpx;
				background: #4C6EF5;
				border-radius: 34rpx;
			}
		}
		.list{
			background-color: #ffffff;
			margin-bottom: 10rpx;
			.list-item{
				image{
					width: 44rpx;
					height: 44rpx;
				}
			}
		}
	}
</style>
