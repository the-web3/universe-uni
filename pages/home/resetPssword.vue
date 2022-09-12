<template>
	<view class="reset-password-container">
		<textarea class="text-area ft26" v-model="word" placeholder="输入助记词，用空格做分隔" placeholder-style="font-size: 26rpx;color: #9397AF;"/>
		<view class="form-item">
			<view class="ft32 mb20">设置密码</view>
			<input class="h60 ft26" password v-model="password" placeholder="密码不少于8位数" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<view class="form-item">
			<view class="ft32 mb20">确认密码</view>
			<input class="h60 ft26" password v-model="confirmPassword" placeholder="密码不少于8位数" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<button type="default" class="create-btn" @tap="handleSave">完成</button>
	</view>
</template>

<script>
	import * as base from '@/common/word/base';
	export default {
		data() {
			return {
				currentWallet: {},
				words: '',
				word: '',
				password: '',
				confirmPassword: '',
			};
		},
		async onLoad() {
			this.currentWallet = uni.getStorageSync('currentWallet')
			this.words = await base.EntropyToMnemonic(this.currentWallet.mnemonic_code, "english")
		},
		methods: {
			handleSave() {
				if(this.word != this.words) {
					return this.$alert('助记词无效')
				}
				if(this.password.length < 8) {
					return this.$alert('密码不少于8位数')
				}else if(this.newPassword != this.confirmPassword){
					return this.$alert('密码不一致')
				}else{
					let allWalletData = uni.getStorageSync('walletData')
					let otherData = allWalletData.filter(item => {
						return item.type != 'ETH'
					})
					let ethWalletData = allWalletData.filter(item => {
						return item.type == 'ETH'
					})[0].list
					let walletIndex = ethWalletData.findIndex(item => {
						return item.address == this.currentWallet.address
					})
					this.currentWallet.password = this.password
					ethWalletData.splice(walletIndex, 1, this.currentWallet)
					uni.setStorageSync('currentWallet', ethWalletData[walletIndex])
					uni.setStorageSync('walletData', [].concat(otherData).concat([
						{
							type: 'ETH',
							list: ethWalletData
						}
					]))
					uni.navigateBack()
				}
			}
		}
	}
</script>

<style lang="scss">
	.reset-password-container{
		.form-item{
			padding: 34rpx 24rpx 0 38rpx;
			input{
				border-bottom: 1rpx solid #EBEBED;
			}
		}
		.text-area{
			margin: 34rpx 24rpx 0 38rpx;
			width: 670rpx;
			height: 180rpx;
			padding: 24rpx 18rpx;
			background: #F8F8F7;
			border-radius: 20rpx;
			border: 1rpx solid #D9DDE1;
			box-sizing: border-box;
		}
		.create-btn{
			position: fixed;
			bottom: 160rpx;
			left: 30rpx;
			width: 686rpx;
			height: 96rpx;
			line-height: 96rpx;
			font-size: 32rpx;
			color: #ffffff;
			background: #94A9FF;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(76, 110, 245, 0.5);
			border-radius: 20rpx;
			&:after{
				border: none;
			}
		}
	}
</style>
