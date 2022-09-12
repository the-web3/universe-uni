<template>
	<view class="add-wallet-container">
		<navigator hover-class="none" url="./keyAdd" class="add-item flex-between alcenter h88 plr40 mt40 mb70">
			<view class="flex alcenter">
				<image src="../../static/image/key.png" mode="" class="mr30"></image>
				<view class="">
					<view class="ft32">私钥导入</view>
					<view class="ft26 c_9397AF">通过输入明文私钥二维码进行导入</view>
				</view>
			</view>
			<image src="../../static/image/arrow-right.png" mode="" class="arrow-img"></image>
		</navigator>
		<navigator hover-class="none" url="/pages/home/importWallet" class="add-item flex-between alcenter h88 plr40 mt40 mb70">
			<view class="flex alcenter">
				<image src="../../static/image/word.png" mode="" class="mr30"></image>
				<view class="">
					<view class="ft32">助记词</view>
					<view class="ft26 c_9397AF">通过导入助记词添加钱包</view>
				</view>
			</view>
			<image src="../../static/image/arrow-right.png" mode="" class="arrow-img"></image>
		</navigator>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.add-wallet-container{
		.add-item{
			image{
				width: 80rpx;
				height: 80rpx;
			}
			.arrow-img{
				width: 44rpx;
				height: 44rpx;
			}
		}
	}
</style>
