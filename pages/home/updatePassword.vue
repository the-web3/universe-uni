<template>
	<view class="update-password-container">
		<view class="form-item">
			<view class="ft32 mb20">当前密码</view>
			<input class="h60 ft26" password v-model="password" placeholder="请输入当前密码" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<view class="form-item">
			<view class="ft32 mb20">新密码</view>
			<input class="h60 ft26" password v-model="newPassword" placeholder="密码不少于8位数" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<view class="form-item">
			<view class="ft32 mb20">确认密码</view>
			<input class="h60 ft26" password v-model="confirmPassword" placeholder="密码不少于8位数" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<button type="default" class="create-btn" @tap="handleSave">完成</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentWallet: {},
				password: '',
				newPassword: '',
				confirmPassword: '',
			};
		},
		onLoad() {
			this.currentWallet = uni.getStorageSync('currentWallet')
		},
		methods: {
			handleSave() {
				if(!this.password) {
					return this.$alert('请输入当前密码')
				}else if(this.password != this.currentWallet.password) {
					return this.$alert('当前密码错误')
				}else if(this.newPassword.length < 8) {
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
					this.currentWallet.password = this.newPassword
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
	.update-password-container{
		.form-item{
			padding: 34rpx 24rpx 0 38rpx;
			input{
				border-bottom: 1rpx solid #EBEBED;
			}
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
