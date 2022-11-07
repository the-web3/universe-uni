<template>
	<view class="create-wallet-container">
		<view class="form-item">
			<view class="ft32 mb20">设置身份钱包名</view>
			<input class="h60 ft26" type="text" v-model="walletName" placeholder="请输入名称" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<view class="form-item">
			<view class="ft32 mb20">设置密码</view>
			<input class="h60 ft26" password v-model="password" placeholder="密码不少于8位,至少包含1个字母和一个数字" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<view class="form-item">
			<view class="ft32 mb20">确认密码</view>
			<input class="h60 ft26" password v-model="confirmPassword" placeholder="密码不少于8位,至少包含1个字母和一个数字" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<view class="flex alcenter pl40 mt40">
			<checkbox value="cb" :checked="checked" color="#94A9FF" @tap="handleCheck" style="border-radius: 50%;"/>
			<view>我已阅读并同意</view>
			<text class="c_4C6EF5">《用户协议》</text>
			<view>以及</view>
			<text class="c_4C6EF5">《隐私政策》</text>
		</view>
		<button type="default" class="create-btn" :class="{'active': isActive}" @tap="handleSave">创建钱包</button>
	</view>
</template>

<script>
	import { rules } from '@/common/utils/validation.js';
	import { showToast } from '@/common/utils';
	
	export default {
		data() {
			return {
				walletName: '',
				password: '',
				confirmPassword: '',
				checked: false,
				type: ''
			};
		},
		computed: {
			isActive() {
				return this.walletName && this.password.length >= 8 && this.password == this.confirmPassword && this.checked
			}
		},
		onLoad(options) {
			if(options.type) {
				this.type = options.type;
				uni.setNavigationBarTitle({
					title: `创建${options.type}钱包`
				})
			}
		},
		methods: {
			handleCheck() {
				this.checked = !this.checked
			},
			handleSave() {
				if(!this.isActive) return
				if(!rules.password.isVaild(this.password)){
					showToast(rules.password.message)
					return
				}
				uni.navigateTo({
					url: `/pages/home/backupWord?type=${this.type}&walletName=${this.walletName}&password=${this.password}`
				})
				
			}
		}
	}
</script>

<style lang="scss">
	.create-wallet-container{
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
			&.active{
				background: #4C6EF5;
			}
			&:after{
				border: none;
			}
		}
	}
</style>
