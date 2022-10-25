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
		<button type="default" class="create-btn" :disabled="isDisabled" @tap="handleSave" >完成</button>
	</view>
</template>

<script>
	import { getAllWalletData } from '@/common/utils/storage.js';
	export default {
		data() {
			return {
				currentWallet: {},
				password: '',
				newPassword: '',
				confirmPassword: '',
			};
		},
		computed: {
			isDisabled() {
				return this.password === '' || this.newPassword === '' || this.confirmPassword === ''
			}
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
					let allWalletData = getAllWalletData();
					let walletIndex = 0;
					let walletType = Object.keys(allWalletData)[0];
					const currentTypeWallet = allWalletData.filter( item =>{
						const index = item.list.findIndex( cur =>{
							return cur.uuid == this.currentWallet.uuid
						})
						if(index !== -1){
							walletIndex = index
							walletType = item.type
							return true
						}
						return false
					})
					this.currentWallet.password = this.newPassword
					currentTypeWallet[0].list.splice(walletIndex, 1, this.currentWallet)
					allWalletData[walletType] = currentTypeWallet[0]
					uni.setStorageSync('currentWallet', this.currentWallet)
					uni.setStorageSync('walletData', allWalletData)
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
			background: #4C6EF5;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(76, 110, 245, 0.5);
			border-radius: 20rpx;
			&[disabled]{
				background: #94A9FF;
			}
			&:after{
				border: none;
			}
		}
	}
</style>
