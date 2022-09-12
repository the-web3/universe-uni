<template>
	<view class="import-wallet-container">
		<uni-nav-bar statusBar fixed left-icon="back" title="助记词" @clickLeft="goBack" @clickRight="handleRight">
			<view slot="right" class="flex-column flex-center">
				<image src="../../static/image/scan.png" mode="" class="nav-img"></image>
			</view>
		</uni-nav-bar>
		<textarea class="text-area ft26" v-model="key" placeholder="输入助记词，用空格做分隔" placeholder-style="font-size: 26rpx;color: #9397AF;"/>
		<view class="form-item">
			<view class="ft32 mb20">设置身份钱包名</view>
			<input class="h60 ft26" type="text" v-model="name" placeholder="请输入名称" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<view class="form-item">
			<view class="ft32 mb20">设置密码</view>
			<input class="h60 ft26" password v-model="password" placeholder="密码不少于8位数" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<view class="form-item">
			<view class="ft32 mb20">确认密码</view>
			<input class="h60 ft26" password v-model="confirmPassword" placeholder="密码不少于8位数" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<view class="flex alcenter pl40 mt40">
			<checkbox value="cb" :checked="checked" color="#94A9FF" @tap="handleCheck" style="border-radius: 50%;"/>
			<view>我已阅读并同意</view>
			<text class="c_4C6EF5">《用户协议》</text>
			<view>以及</view>
			<text class="c_4C6EF5">《隐私政策》</text>
		</view>
		<button type="default" class="create-btn" @tap="handleSave">导入钱包</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				name: '',
				password: '',
				confirmPassword: '',
				checked: false
			};
		},
		methods: {
			handleCheck() {
				this.checked = !this.checked
			},
			goBack() {
				uni.navigateBack()
			},
			handleRight() {
				uni.scanCode({
					success: (res) => {
						
					}
				})
			},
			handleSave() {
				if(!this.key) {
					return this.$alert('请输入助记词')
				}
				if(!this.name) {
					return this.$alert('请输入名称')
				}else if(this.password.length < 8) {
					return this.$alert('密码不少于8位数')
				}else if(this.password != this.confirmPassword){
					return this.$alert('密码不一致')
				}else if(!this.checked) {
					return this.$alert('请勾选')
				}
			}
		}
	}
</script>

<style lang="scss">
	.import-wallet-container{
		.nav-img{
			width: 44rpx;
			height: 44rpx;
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
