<template>
	<view class="import-wallet-container">
		<uni-nav-bar statusBar fixed left-icon="back" :title="title" @clickLeft="goBack" @clickRight="handleRight">
			<view slot="right" class="flex-column flex-center">
				<image src="../../static/image/scan.png" mode="" class="nav-img"></image>
			</view>
		</uni-nav-bar>
		<textarea class="text-area ft26" v-model="words" @input="handleInput" placeholder="输入助记词，用空格做分隔" placeholder-style="font-size: 26rpx;color: #9397AF;"/>
		<view class="form-item">
			<view class="ft32 mb20">设置身份钱包名</view>
			<input class="h60 ft26" type="text" v-model="walletName" placeholder="请输入名称" placeholder-style="font-size: 26rpx;color: #9397AF;" />
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
		<button type="default" class="create-btn" :class="{'active': isActive}" @tap="handleSave">导入钱包</button>
		<scroll-view v-if="fixedBottom > 0 && tipWords.length > 0" scroll-x class="word-scroll" :style="{'bottom': fixedBottom + 'px'}">
			<view v-for="(item, index) in tipWords" :key="index" @tap="handleSelect(item)">{{item}}</view>
		</scroll-view>
	</view>
</template>

<script>
	import { allTipWords } from '@/common/word'
	const INIT_TITLE = '导入身份钱包'
	import { rules } from '@/common/utils/validation.js';
	import { showToast } from '@/common/utils';
	import { postWalletInfo, getDeviceInfo } from '@/common/utils';
	export default {
		data() {
			return {
				allTipWords: allTipWords,
				tipWords: [],
				// words: 'auto where claw holiday retire kingdom high pluck sad purpose brain pulse',
				words: '',
				walletName: '',
				password: '',
				confirmPassword: '',
				mnemonicCode: '',
				deviceId: '',
				checked: false,
				fixedBottom: 0,
				chain_name: '',
				title: INIT_TITLE,
			};
		},
		computed: {
			isActive() {
				return this.words && this.walletName && this.password.length >= 8 && this.password == this.confirmPassword && this.checked
			}
		},
		async onLoad(options) {
			if(options.chain_name) {
				this.chain_name = options.chain_name;
				this.title =  `导入${options.chain_name}钱包`
				uni.setNavigationBarTitle({
					title: `导入${options.chain_name}钱包`
				})
			}
			// 获取设备信息
			const deviceInfo = await getDeviceInfo()
			this.deviceId = deviceInfo.device_id
			uni.onKeyboardHeightChange((res) =>{
				if(res.height == 0) {
					this.tipWords = []
				}
				this.fixedBottom = res.height
			})
		},
		methods: {
			handleInput(e) {
				let list = e.detail.value.split(' ')
				this.tipWords = this.allTipWords.filter(item => {
					return item.indexOf(list[list.length - 1]) != -1
				})
			},
			handleSelect(word) {
				let wordList = this.words.split(' ')
				wordList.pop()
				if(this.words.length == 0) {
					this.words = this.words += `${word}`
				}else{
					this.words = wordList.join('') + ` ${word}`
				}
			},
			handleCheck() {
				this.checked = !this.checked
			},
			goBack() {
				uni.navigateBack()
			},
			handleRight() {
				// uni.scanCode({
				// 	success: (res) => {
						
				// 	}
				// })
			},
			async handleSave() {
				if(!this.isActive) return 
				if(!rules.password.isVaild(this.password)){
					showToast(rules.password.message)
					return
				}
				if(!rules.walletName.isVaild(this.walletName)){
					showToast(rules.walletName.message)
					return
				}
				postWalletInfo({
					chain_name: this.chain_name,
					words: this.words,
					wallet_name: this.walletName,
					password: this.password,
				})
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
			&.active{
				background: #4C6EF5;
			}
			&:after{
				border: none;
			}
		}
		.word-scroll{
			position: fixed;
			left: 0;
			background-color: #f8f8f7;
			z-index: 10;
			padding: 20rpx;
			display: flex;
			white-space: nowrap;
			box-sizing: border-box;
			view{
				display: inline-flex;
				flex-direction: column;
				height: 60rpx;
				line-height: 60rpx;
				background-color: #ffffff;
				padding: 0 20rpx;
				font-size: 28rpx;
				margin: 0 28rpx;
				border-radius: 8rpx;
			}
		}
	}
</style>
