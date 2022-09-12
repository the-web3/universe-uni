<template>
	<view class="setting-container">
		<view class="list mt10">
			<view class="list-item bg-white h120 flex-between alcenter">
				<view class="ft32">节点更新</view>
				<image src="../../static/image/arrow-right.png" mode=""></image>
			</view>
			<view class="list-item bg-white h120 flex-between alcenter">
				<view class="ft32">红涨绿跌</view>
				<switch checked="true" color="#00C28A"/>
			</view>
			<view class="list-item bg-white h120 flex-between alcenter">
				<view class="ft32">货币单位</view>
				<image src="../../static/image/arrow-right.png" mode=""></image>
			</view>
		</view>
		<view class="list mt10">
			<view class="list-item bg-white h120 flex-between alcenter">
				<view class="ft32">应用锁</view>
				<switch checked="true" color="#00C28A"/>
			</view>
			<view class="list-item bg-white h120 flex-between alcenter">
				<view class="ft32">白名单公能</view>
				<switch checked="true" color="#00C28A"/>
			</view>
			<view class="list-item bg-white h120 flex-between alcenter">
				<view class="ft32">矿工费模式</view>
				<switch checked="true" color="#00C28A"/>
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
	.setting-container{
		.list-item{
			padding: 0 34rpx 0 38rpx;
			image{
				width: 44rpx;
				height: 44rpx;
			}
		}
	}
</style>
