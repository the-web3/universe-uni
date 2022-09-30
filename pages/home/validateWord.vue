<template>
	<view class="validate-word-container">
		<view class="ft28 pl40 mt20 mb50">请根据您抄写的助记词，按顺序选择填充</view>
		<view class="fill-container flex flex-wrap">
			<view class="fill-item ft28 c_4C6EF5 flex-center" v-for="(item, index) in fillWords" :key="index">{{item}}</view>
		</view>
		<view class="word-container flex flex-wrap">
			<view class="word-item ft28 flex-center" :class="{'active': fillWords.includes(item)}" 
			v-for="(item, index) in shuffleWords" :key="index" @tap="handleSelect(item, index)">{{item}}</view>
		</view>
		<button type="default" class="confirm-btn" @tap="handleConfirm">确认</button>
	</view>
</template>

<script>
	import * as base from '@/common/word/base';
	import * as address from '@/common/word/address';
	export default {
		data() {
			return {
				walletName: '',
				password: '',
				words: [],
				shuffleWords: [],
				fillWords: new Array(12).fill(''),
				deviceId: 'c3c0268fa44293f2',
				mnemonicCode: '',
				address: '',
				privateKey: ''
			}
		},
		async onLoad(options) {
			this.walletName = options.walletName
			this.password = options.password
			this.words = options.words.split(' ')
			this.shuffleWords = options.words.split(' ')
			this.shuffle(this.shuffleWords)
			
			//助记词编码
			this.mnemonicCode = await base.MnemonicToEntropy(options.words, "english")
			
			//助记词生成地址
			var seed_sync = await base.MnemonicToSeedSync(options.words, "")
			var addrs = await address.CreateEthAddressBySeed(seed_sync, 0)
			console.log(addrs)
			this.address = addrs.address
			this.privateKey = addrs.privateKey
			
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
			shuffle (array) {
				let len = array.length;
				for (let i = len - 1; i > 0; i--) {
					let j = Math.floor(Math.random() * (i + 1));
					[array[i], array[j]] = [array[j], array[i]];
				}
			},
			handleSelect(item) {
				if(this.fillWords.includes(item)) return
				let index = this.fillWords.findIndex(item => {
					return item.length == 0
				})
				if(index > -1) {
					this.fillWords.splice(index, 1, item)	
				}
			},
			handleConfirm() {
				let flag = this.fillWords.every(item => {
					return item
				})
				if(flag) {
					if(this.fillWords.toString() == this.words.toString()) {
						let allWalletData = uni.getStorageSync('walletData')
						let ethData = {}
						let otherData = []
						if(allWalletData) {
							ethData = allWalletData.filter(item => {
								return item.type == 'ETH'
							})
							ethData ? ethData : [
								{
									type: 'ETH',
									list: []
								}
							],
							otherData = allWalletData.filter(item => {
								return item.type != 'ETH'
							})
							otherData ? otherData : []
						}else{
							allWalletData = []
							ethData = [
								{
									type: 'ETH',
									list: []
								}
							]
						}
						console.log(allWalletData, ethData)
						let uuid = Math.random().toString(36).substr(-10)
						let walletData = {
							device_id: this.deviceId, // 设备ID
							uuid: uuid,// 钱包ID
							chain_name: 'Ethereum',// 链名称
							asset_name: 'ETH',// 币种名称
							wallt_name: this.walletName,// 钱包名称
							address: this.address,// 地址
							private_key: this.privateKey,// 私钥
							mnemonic_code: this.mnemonicCode,// 助记词编码
							password: this.password,// 密码
							icon: '/static/image/ETH@2x.png',// 图标
							contract_address: '',// 合约地址
							balance: 0,// 余额
							cny_price: 0, //人民币
							usdt_price: 0,// 折合成 USDT
							del: 0, //是否删除 0：正常；1:删除
							hasSubmit: false
						}
						uni.showLoading({
							title: '提交中',
							mask: true
						})
						this.$api.submitWalletInfo({
							"chain": "eth",
							"symbol": "eth",
							"network": "mainnet",
							"device_id": this.deviceId,
							"wallet_uuid": uuid,
							"wallet_name": this.walletName,
							"address": this.address,
							"contract_addr": "",
						}).then(res => {
							console.log(res)
							walletData.hasSubmit = true
							this.$api.getAddressBalance({
								"chain": "eth",
								"symbol": "eth",
								"network": "mainnet",
								"address": "0x98E9D288743839e96A8005a6B51C770Bbf7788C0",
								"contract_addr": "",
							}).then(res => {
								uni.hideLoading()
								walletData.balance = res.result.balance
								walletData.cny_price = 600
								walletData.usdt_price = 100
								ethData[0].list.push(walletData)
								uni.setStorageSync('walletData', [].concat(otherData).concat(ethData))
								uni.reLaunch({
									url: '/pages/home/home'
								})
							}).catch(() => {
								uni.hideLoading()
							})
						}).catch(() => {
							uni.hideLoading()
						})
					}else{
						uni.showToast({
							title: '助记词顺序有误',
							icon: 'error'
						})
					}
				}else{
					this.$alert('请选择助记词')
				}
			}
		}
	}
</script>

<style lang="scss">
	.validate-word-container{
		.fill-container{
			width: 700rpx;
			height: 400rpx;
			background: #F7F8FC;
			border-radius: 30rpx;
			margin-left: 25rpx;
			padding: 14rpx 4rpx 14rpx 18rpx;
			margin-bottom: 92rpx;
			box-sizing: border-box;
			.fill-item{
				width: 210rpx;
				height: 80rpx;
				background: #FFFFFF;
				border-radius: 30rpx;
				margin-right: 16rpx;
				margin-bottom: 16rpx;
			}
		}
		.word-container{
			margin: 0 44rpx 74rpx;
			.word-item{
				width: 210rpx;
				height: 80rpx;
				border-radius: 30rpx;
				border: 2rpx solid #D6D9E0;
				margin-right: 16rpx;
				margin-bottom: 16rpx;
				box-sizing: border-box;
				&:nth-child(3n) {
					margin-right: 0;
				}
				&.active{
					border-color: #4C6EF5;
					background-color: #4C6EF5;
					color: #ffffff;
				}
			}
		}
		.confirm-btn{
			margin: 0 auto;
			width: 686rpx;
			height: 96rpx;
			line-height: 96rpx;
			font-size: 32rpx;
			color: #ffffff;
			background: #4C6EF5;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(76, 110, 245, 0.5);
			border-radius: 20rpx;
			&:after{
				border: none;
			}
		}
	}
</style>
