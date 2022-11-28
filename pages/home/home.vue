<template>
	<view class="home-container">
		<view v-if="!hasWallet">
			<image src="../../static/image/pic_bj@2x.png" mode="" class="home-img"></image>
			<view class="plr40">
				<view class="ft36 mt30">数字资产钱包</view>
				<view class="ft28 c_9397AF mt10">支持BTC、ETH、EOS、TRON、波卡等主流公链</view>
			</view>
			<view hover-class="none" class="wallet-item flex-between alcenter h80 mt40 mb40 plr40" @tap="handleOpen">
				<view class="flex alcenter">
					<image src="../../static/image/haswallet.png" mode="" class="mr40"></image>
					<view>
						<view class="ft36">我有钱包</view>
						<view class="c_9397AF">导入钱包</view>
					</view>
				</view>
				<image src="../../static/image/arrow-right.png" mode="" class="arrow"></image>
			</view>
			<navigator hover-class="none" url="./addWallet" class="wallet-item flex-between alcenter h80 mt40 mb40 plr40">
				<view class="flex alcenter">
					<image src="../../static/image/tianjiaqianbao@2x.png" mode="" class="mr40"></image>
					<view>
						<view class="ft36">我没有钱包</view>
						<view class="c_9397AF">创建钱包</view>
					</view>
				</view>
				<image src="../../static/image/arrow-right.png" mode="" class="arrow"></image>
			</navigator>
		</view>
		<view v-if="hasWallet">
			<view class="status-bar"></view>
			<view class="top-fixed flex-between alcenter h100 plr40">
				<view class="flex-between alcenter left-container plr20" @tap="handleOpen">
					<view>{{currentWallet.wallet_name}}</view>
					<image src="../../static/image/triangle.png" mode=""></image>
				</view>
				<view class="flex alcenter">
					<navigator hover-class="none" url="/pages/my/myWallet">
						<image src="../../static/image/qianbao-3@2x.png" mode="" class="message-img mr40"></image>
					</navigator>
					<image src="../../static/image/scan.png" mode="" class="shou-img"></image>
				</view>
			</view>	
			<view class="operator-container flex-column flex-between ft28 pt40 mlr40">
				<view class="flex-between alcenter pl58 pr30">
					<view class="flex alcenter">
						<view>我的资产</view>
						<image src="../../static/image/eye.png" mode="" class="ml40" @tap="showMoney = !showMoney"></image>
					</view>
					<navigator hover-class="none" :url="`./walletDetail?`" class="flex alcenter">
						<view>详情</view>
						<image src="../../static/image/arrow-right.png" mode=""></image>
					</navigator>
				</view>
				<view class="money-num ft64 pl58" v-if="showMoney">{{currentWallet.asset_usd }}</view>
				<view class="money-num ft64 pl58" v-else>***</view>
				<view class="items flex">
					<navigator hover-class="none" :url="`./transfer?chain=${currentWallet.chain}`" class="item">
						<image src="../../static/image/zhuanzhang@2x.png" mode=""></image>
						<view>转账</view>
					</navigator>
					<navigator hover-class="none" :url="`./gather?address=${currentWallet.address}`" class="item">
						<image src="../../static/image/shoukuanguanli@2x.png" mode=""></image>
						<view>收款</view>
					</navigator>
					<view class="item" @tap="goPath('./flash')">
						<image src="../../static/image/shandui-2@2x.png" mode=""></image>
						<view>闪兑</view>
					</view>
				</view>
			</view>
			<view class="property-title flex-between alcenter h80 mt80 plr40">
				<view class="ft32">资产列表</view>
				<navigator hover-class="none" :url="`./tokenCoin?chain=${currentWallet.chain}`">
					<image src="../../static/image/add@2x.png" mode=""></image>
				</navigator>
			</view>
			<view class="property-item flex-between alcenter h80 mt40 mb40 plr40" v-for="(item, index) in currentWallet.token_list" :key="index" @click="goDetail(item)">
				<view class="flex alcenter">
					<image :src="`${config.imgUrl + item.logo}`" mode="" class="mr40"></image>
					<view>
						<view class="ft36">{{item.symbol}}</view>
						<view class="c_9397AF">{{currentWallet.chain}}</view>
					</view>
				</view>
				<view>
					<view class="ft36 text-right">{{item.balance }}</view>
					<view class="c_9397AF text-right">${{item.asset_usd }}</view>
				</view> 
			</view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="wallet-container flex-column">
				<view class="wallet-title flex-center relative">
					<view class="ft32">钱包列表</view>
					<image src="/static/image/guanbi-3@2x.png" mode="" @tap="handleClose"></image>
				</view>
				<wallet-list @changeWallet="handleSelectWallet"/>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import config from '@/config'
	import { CHAIN_LIST } from '@/common/constants';
	import walletList from '@/components/wallet-list/index.vue'
	import { hasWallet } from '@/common/utils/storage.js';
	import { updateCurrentWallet, getDeviceInfo, getWalletList } from '@/common/utils';
	export default {
		components: {
			walletList,
		},
		data() {
			return {
				config,
				showMoney: true,
				isConnected: true, //是否联网
				hasWallet: false,
				deviceId: '',
				currentWallet: {},
				propertyList: [],
			};
		},
		async onShow() {
			// 获取设备信息
			const deviceInfo = await getDeviceInfo()
			this.deviceId = deviceInfo.device_id
			this.hasWallet = hasWallet();
			await uni.getNetworkType({
				success: async res => {
					console.log('getNetworkType', res.networkType)
					if (res.networkType == 'none') {
						this.isConnected = false
						getWalletList()
					} else {
						this.isConnected = true
						this.initWalletInNetwork()
					}
				}
			});
			await uni.onNetworkStatusChange(async res => {
				console.log('onNetworkStatusChange', res)
				this.isConnected = res.isConnected
				if(this.isConnected) {
					await this.submitUnSubmitWallet()
					this.initWalletInNetwork()
				}else{
					getWalletList()
				}
			});
			this.currentWallet = uni.getStorageSync('currentWallet')
		},
		methods: {
			async initWalletInNetwork(){
				await this.submitUnSubmitWallet()
				this.hasWallet = hasWallet();
				if(this.hasWallet) {
					this.getWalletBalance()				
				}else{
					return
				}
			},
			async submitUnSubmitWallet() {
				let unSubmitWallet = []
				const allWalletData = uni.getStorageSync('walletData')
				for(let chainId of Object.keys(allWalletData)) {
					let unData = allWalletData[chainId].filter(item => {
						return !item.has_submit
					})
					unSubmitWallet = unSubmitWallet.concat(unData)
				}
				unSubmitWallet = unSubmitWallet.map(item => {
					const { chain_id, device_id, wallet_uuid, wallet_name, address } = item
					const { chain, symbol } = CHAIN_LIST.filter(item=> item.id === chain_id)[0];
					//TODO: index and contract_addr maybe from sqlite
					return {
						chain,
						symbol,
						network: "mainnet",
						device_id,
						wallet_uuid,
						wallet_name,
						index: '0', 
						address,
						contract_addr: "",
					}
				})
				if(unSubmitWallet.length > 0) {
					this.$api.batch_submit_wallet({
						batch_wallet: unSubmitWallet
					}).then(() => {
						const currentWallet = uni.getStorageSync('currentWallet')
						if(!currentWallet.has_submit){
							currentWallet.has_submit = 1
							uni.setStorageSync('currentWallet', currentWallet)	
						}
						for(let chainId of Object.keys(allWalletData)) {
							allWalletData[chainId] = allWalletData[chainId].map(item => {
								if(!item.has_submit){
									item.has_submit =1
								}
								return item
							})
						}	
						uni.setStorageSync('walletData', allWalletData)	
					})
				}
			},
			getWalletBalance(){
				this.currentWallet = uni.getStorageSync('currentWallet')
				const { wallet_uuid, chain="Arbitrum" } =  this.currentWallet
				this.$api.getWalletBalance({
					device_id: this.deviceId,
					wallet_uuid,
					chain
				}).then(res => {
					let { token_list, asset_cny, asset_usd } = res.result
					this.currentWallet.token_list = token_list;
					this.currentWallet.asset_cny = asset_cny;
					this.currentWallet.asset_usd = asset_usd;
					updateCurrentWallet(this.currentWallet)
				})
			},
			goPath() {
				this.$alert('暂不支持')
			},
			goDetail(item) {
				uni.navigateTo({
					url: `./propertyDetail?tokenData=${JSON.stringify(item)}`
				})
			},
			handleOpen() {
				this.$refs.popup.open()
			},
			handleClose() {
				this.$refs.popup.close()
			},
			handleSelectWallet(data) {
				this.currentWallet = data
				uni.setStorageSync('currentWallet', data)
				this.getWalletBalance()
				this.handleClose()
			},
		}
	}
</script>

<style lang="scss">
	$status_Height: var(--status-bar-height);
	.home-container{
		.home-img{
			width: 100%;
			height: 520rpx;
		}
		.status-bar{
			position: sticky;
			top: 0;
			z-index: 10;
			height: $status_Height;
			background-color: #ffffff;
		}
		.top-fixed{
			position: sticky;
			top: $status_Height;
			background-color: #ffffff;
			z-index: 10;
			image{
				width: 44rpx;
				height: 44rpx;
			}
			.left-container{
				min-width: 196rpx;
				height: 52rpx;
				font-size: 32rpx;
				color: #4C6EF5;
				background: #F1F3F5;
				border-radius: 30rpx;
				box-sizing: border-box;
				image{
					width: 44rpx;
					height: 44rpx;
				}
			}
		}
		.operator-container{
			height: 300rpx;
			color: #ffffff;
			background: #4C6EF5;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(76, 110, 245, 0.5);
			border-radius: 40rpx;
			box-sizing: border-box;
			image{
				width: 44rpx;
				height: 44rpx;
			}
			.items{
				height: 80rpx;
				background: rgba(255, 255, 255, 0.1);
				border-radius: 0rpx 0rpx 40rpx 40rpx;
				.item{
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					image{
						margin-right: 6rpx;
					}
				}
			}
		}
		.property-title{
			image{
				width: 60rpx;
				height: 60rpx;
			}
		}
		.property-item{
			image{
				width: 80rpx;
				height: 80rpx;
			}
		}
		.wallet-item{
			image{
				width: 80rpx;
				height: 80rpx;
			}
			.arrow{
				width: 44rpx;
				height: 44rpx;
			}
		}
		.wallet-container{
			height: 890rpx;
			background: #FFFFFF;
			.wallet-title{
				height: 88rpx;
				line-height: 88rpx;
				border-bottom: 1rpx solid #EBEBED;
				image{
					position: absolute;
					top: 50%;
					right: 32rpx;
					transform: translateY(-50%);
					width: 24rpx;
					height: 24rpx;
				}
			}
		}
	}
</style>
