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
	import { CRYPTOCURRENCY_TYPE } from '@/common/constants';
	// import { postWalletInfo } from '@/common/utils';
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
				privateKey: '',
				type: ''
			}
		},
		async onLoad(options) {
			this.type = options.type
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
			postWalletInfo (type, data, other) {
				//钱包提交数据
				// {
				// 	chain,
				// 	symbol,
				// 	network: "mainnet",
				// 	device_id,
				// 	wallet_uuid: uuid,
				// 	wallet_name,
				// 	address,
				// 	contract_addr,
				// }
				// 根据type拿链的内容 得到chain、symbol
				//拿到当前的device_id、wallet_uuid、wallet_name、address去生成钱包
				//获取balance、asset_usd、asset_cny 
				//存钱包表，然后拿到wallet的id存账户表

				// const walletsList = getAllWalletData();
				// const currentWallet = walletsList ? walletsList.filter(item => {
				// 	return item.type == type
				// }): [{
				// 	type,
				// 	list: []
				// }];
				
				// const { device_id, uuid, chain, symbol, wallet_name, address, private_key, mnemonic_code,password, icon, contract_addr} = data;

				// const currentWalletInfo = Object.assign({}, INIT_WALLET, data, {type});

				// uni.showLoading({
				// 	title: '提交中',
				// 	mask: true
				// })

				// api.submitWalletInfo({
				// 	chain,
				// 	symbol,
				// 	network: "mainnet",
				// 	device_id,
				// 	wallet_uuid: uuid,
				// 	wallet_name,
				// 	address,
				// 	contract_addr,
				// }).then(res => {
				// 	currentWalletInfo.hasSubmit = true
				// 	api.getAddressBalance({
				// 		chain,
				// 		symbol,
				// 		network: "mainnet",
				// 		address,
				// 		contract_addr,
				// 	}).then(res => {
				// 		uni.hideLoading()
				// 		if(!other || !other.in_token_list){
				// 			currentWalletInfo.balance = res.result.balance
				// 			currentWalletInfo.cny_price = res.result.cny_price
				// 			currentWalletInfo.usdt_price = res.result.usdt_price
				// 			currentWallet[0].list.push(currentWalletInfo)
				// 			const currentWalletIndex = walletsList.findIndex(item=> item.type === type);
				// 			const newWalletsList = currentWalletIndex !== -1 ? walletsList.map(item=> {
				// 				if(item.type === type ){
				// 					return currentWallet[0]
				// 				}else{
				// 					return item
				// 				}
				// 			}) : [...walletsList,...currentWallet];
				// 			uni.setStorageSync('currentWallet', currentWalletInfo)
				// 			uni.setStorageSync('walletData', newWalletsList)
				// 			uni.reLaunch({
				// 				url: '/pages/home/home'
				// 			})
				// 		}
				// 		if(other && other.callback){
				// 			other.callback()
				// 		}
				// 	}).catch(() => {
				// 		uni.hideLoading()
				// 	})
				// }).catch(() => {
				// 	uni.hideLoading()
				// })
			},
			handleConfirm() {
				let flag = this.fillWords.every(item => {
					return item
				})
				if(flag) {
					if(this.fillWords.toString() == this.words.toString()) {
						let uuid = Math.random().toString(36).substr(-10);
						const { chain, symbol, activeImg } = CRYPTOCURRENCY_TYPE[this.type] || {};
						this.postWalletInfo(this.type,{
							device_id: this.deviceId, // 设备ID
							uuid,// 钱包ID
							chain,// 链名称
							symbol,// 币种名称
							wallet_name: this.walletName,// 钱包名称
							address: this.address,// 地址
							private_key: this.privateKey,// 私钥
							mnemonic_code: this.mnemonicCode,// 助记词编码
							password: this.password,// 密码
							icon: activeImg,// 图标
							contract_addr: '',// 合约地址
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
