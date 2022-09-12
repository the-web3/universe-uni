<template>
	<view class="token-coin-container">
		<navigator hover-class="none" open-type="switchTab" url="./home" class="list-item bg-white flex-between alcenter h120 plr40">
			<view class="ft32">首页资产</view>
			<image src="../../static/image/arrow-right.png" mode="" class="arrow"></image>
		</navigator>
		<navigator hover-class="none" url="/pages/my/property" class="list-item bg-white flex-between alcenter h120 plr40 mb10">
			<view class="ft32">我的资产</view>
			<image src="../../static/image/arrow-right.png" mode="" class="arrow"></image>
		</navigator>
		<view class="ft32 bg-white hot-title flex alcenter plr40 h100">热门代币</view>
		<view class="list-item bg-white flex-between alcenter h120 plr40" v-for="(item, index) in hotList" :key="index">
			<view class="flex alcenter" style="width: 500rpx;">
				<image :src="`${config.imgUrl + item.icon}`" mode="" class="mr20"></image>
				<view style="overflow: hidden;">
					<view class="ft32">{{item.token_symbol}}</view>
					<view class="c_9397AF line-one">{{item.contract_addr}}</view>
				</view>
			</view>
			<image v-if="allContractAddress.includes(item.contract_addr)" src="../../static/image/jinzhi@2x.png" mode="" class="arrow" @tap="handleDelete(item)"></image>
			<image v-else src="../../static/image/add.png" mode="" class="arrow" @tap="handleAdd(item)"></image>
		</view>
		<scroll-view v-if="list.length > 0" @scrolltolower="handleBottom" class="scroll-box" scroll-y="true" :style="{'height': scrollHeight + 'px'}">
			<view class="list-item bg-white flex-between alcenter h120 plr40" v-for="(item, index) in list" :key="index">
				<view class="flex alcenter" style="width: 500rpx;">
					<image :src="`${config.imgUrl + item.icon}`" mode="" class="mr20"></image>
					<view style="overflow: hidden;">
						<view class="ft32">{{item.token_symbol}}</view>
						<view class="c_9397AF">{{item.contract_addr}}</view>
					</view>
				</view>
				<image v-if="allContractAddress.includes(item.contract_addr)" src="../../static/image/jinzhi@2x.png" mode="" class="arrow" @tap="handleDelete(item)"></image>
				<image v-else src="../../static/image/add.png" mode="" class="arrow" @tap="handleAdd(item)"></image>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import config from '@/config'
	export default {
		data() {
			return {
				config,
				deviceId: 'c3c0268fa44293f2',
				toke_name: '',
				hotList: [],
				page: 1,
				page_size: 10,
				hasMore: false,
				list: [],
				scrollHeight: 0,
				currentMainCoin: {}, //当前主链币
				currentWalletData: [],
				allContractAddress: []
			};
		},
		onNavigationBarButtonTap() {
			uni.navigateBack()
		},
		onNavigationBarSearchInputChanged(e) {
			this.toke_name = e.text
			if(!this.toke_name) {
				this.list = []
			}else{
				this.page = 1
				this.loadData()
			}
		},
		onNavigationBarSearchInputConfirmed(e) {
			console.log(e.text)
			this.toke_name = e.text
			if(!this.toke_name) {
				this.list = []
			}else{
				this.page = 1
				this.loadData()
			}
		},
		onLoad() {
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
			
			this.scrollHeight = uni.getSystemInfoSync().windowHeight
			this.loadHotList()
			this.currentMainCoin = uni.getStorageSync('currentWallet')
			let walletData = uni.getStorageSync('walletData')
			this.currentWalletData = walletData.filter(item => {
				return item.type == 'ETH'
			})
			let allContractData = this.currentWalletData[0].list.filter(item => {
				return item.contract_address.length > 0 && item.wallt_name == this.currentMainCoin.wallt_name
			})
			this.allContractAddress = allContractData.map(item => {
				return item.contract_address
			})
			console.log(this.currentWalletData, this.allContractAddress)
		},
		methods: {
			//热门代币
			loadHotList() {
				this.$api.hot_token_list().then(res => {
					this.hotList = res.data
				})
			},
			loadData() {
				this.$api.sourch_add_token({
					toke_name: this.toke_name,
					page: this.page,
					page_size: this.page_size
				}).then(res => {
					console.log(res)
					if(!res.data.gds_lst || res.data.gds_lst.length < this.page_size) {
						this.hasMore = false
					}else{
						this.hasMore = true
					}
					if(this.page == 1) {
						this.list = res.data.gds_lst || []
					}else{
						this.list = this.list.concat(res.data.gds_lst || [])
					}
				})
			},
			handleBottom() {
				console.log('handleBottom')
				if(this.hasMore) {
					this.page += 1
					this.loadData()
				}else{
					
				}
			},
			handleDelete({contract_addr}) {
				this.$api.delete_wallet_token({
					device_id: this.deviceId, // 设备ID
					wallet_uuid: this.currentMainCoin.uuid,
					contract_addr: contract_addr
				}).then(res => {
					console.log('handleDelete ' + JSON.stringify(res))
					let allWalletData = uni.getStorageSync('walletData')
					let otherData = []
					let walletIndex = 0
					otherData = allWalletData.filter(item => {
						return item.type != 'ETH'
					})
					otherData ? otherData : [],
					walletIndex = this.currentWalletData[0].list.findIndex(item => {
						return item.contract_address == contract_addr && item.wallt_name == this.currentMainCoin.wallt_name
					})
					this.currentWalletData[0].list.splice(walletIndex, 1)
					uni.setStorageSync('walletData', [].concat(otherData).concat(this.currentWalletData))
					let allContractData = this.currentWalletData[0].list.filter(item => {
						return item.contract_address.length > 0 && item.wallt_name == this.currentMainCoin.wallt_name
					})
					this.allContractAddress = allContractData.map(item => {
						return item.contract_address
					})
				})
			},
			handleAdd(item) {
				let allWalletData = uni.getStorageSync('walletData')
				let otherData = []
				otherData = allWalletData.filter(item => {
					return item.type != 'ETH'
				})
				otherData ? otherData : []
				let walletData = {
					device_id: this.deviceId, // 设备ID
					uuid: this.currentMainCoin.uuid,// 钱包ID
					chain_name: this.currentMainCoin.chain_name,// 链名称
					asset_name: item.token_symbol,// 币种名称
					wallt_name: this.currentMainCoin.wallt_name,// 钱包名称
					address: this.currentMainCoin.address,// 地址
					private_key: this.currentMainCoin.private_key,// 私钥
					mnemonic_code: this.currentMainCoin.mnemonic_code,// 助记词编码
					password: this.currentMainCoin.password,// 密码
					icon: `${config.imgUrl + item.icon}`,// 图标
					contract_address: item.contract_addr,// 合约地址
					balance: 0,// 余额
					cny_price: 0, //人民币
					usdt_price: 0,// 折合成 USDT
					del: 0, //是否删除 0：正常；1:删除
					hasSubmit: false
				}
				uni.showLoading({
					title: '添加中',
					mask: true
				})
				this.$api.submitWalletInfo({
					"device_id": this.deviceId,
					"wallet_uuid": this.currentMainCoin.uuid,
					"asset_name": item.token_symbol,
					"wallet_name": this.currentMainCoin.wallt_name,
					"chain_name": this.currentMainCoin.chain_name,
					"address": this.currentMainCoin.address,
					"contract_addr": item.contract_addr,
					"word_code": this.currentMainCoin.mnemonic_code,
					"private_key": this.currentMainCoin.private_key
				}).then(res => {
					console.log('submit ' + JSON.stringify(res))
					walletData.hasSubmit = true
					this.$api.getAddressBalance({
						"device_id": this.deviceId,
						"wallet_uuid": this.currentMainCoin.uuid,
						"asset_name": item.token_symbol,
						"wallet_name": this.currentMainCoin.wallt_name,
						"chain_name": this.currentMainCoin.chain_name,
						"address": this.currentMainCoin.address,
						"contract_addr": item.contract_addr,
					}).then(res => {
						console.log('balance ', JSON.stringify(res))
						uni.hideLoading()
						walletData.balance = res.data.balance
						walletData.cny_price = res.data.cny_price
						walletData.usdt_price = res.data.usdt_price
						this.currentWalletData[0].list.push(walletData)
						uni.setStorageSync('walletData', [].concat(otherData).concat(this.currentWalletData))
						let allContractData = this.currentWalletData[0].list.filter(item => {
							return item.contract_address.length > 0 && item.wallt_name == this.currentMainCoin.wallt_name
						})
						this.allContractAddress = allContractData.map(item => {
							return item.contract_address
						})
					}).catch(() => {
						uni.hideLoading()
					})
				}).catch(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F7F8FC;
	}
	.token-coin-container{
		.list-item{
			image{
				width: 88rpx;
				height: 88rpx;
				flex-shrink: 0;
			}
			.arrow{
				width: 44rpx;
				height: 44rpx;
				flex-shrink: 0;
			}
		}
		.hot-title{
			position: sticky;
			top: 0;
			left: 0;
			z-index: 20;
		}
		.scroll-box{
			position: fixed;
			top: 0;
			/* #ifdef H5 */
			top: 44px;
			/* #endif */
			left: 0;
			z-index: 20;
			background-color: #ffffff;
		}
	}
</style>
