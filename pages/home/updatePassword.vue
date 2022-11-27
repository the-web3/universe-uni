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
	import { rules } from '@/common/utils/validation.js';
	import { showToast, updateCurrentWallet } from '@/common/utils';
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
					return showToast('请输入当前密码')
				}else if(this.password != this.currentWallet.password) {
					return showToast('当前密码错误')
				}else if(this.newPassword.length < 8) {
					return showToast('密码不少于8位数')
				}else if(this.newPassword != this.confirmPassword){
					return showToast('密码不一致')
				}else if(!rules.password.isVaild(this.newPassword)){
					return showToast(rules.password.message)
				}else{
					this.currentWallet.password = this.newPassword
					updateCurrentWallet(this.currentWallet).then(res=>{
						uni.navigateBack()
					}).catch(e=>{
						showToast('修改密码失败, 请稍后再试')
					})
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
