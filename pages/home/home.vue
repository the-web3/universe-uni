<template>
	<view class="home-container">
		<view v-if="!hasWallet">
			<image src="../../static/image/pic_bj@2x.png" mode="" class="home-img"></image>
			<view class="plr40">
				<view class="ft36 mt30">数字资产钱包</view>
				<view class="ft28 c_9397AF mt10">支持BTC、ETH、EOS、TRON、波卡等主流公链</view>
			</view>
			<navigator hover-class="none" url="./importWallet" class="wallet-item flex-between alcenter h80 mt40 mb40 plr40">
				<view class="flex alcenter">
					<image src="../../static/image/haswallet.png" mode="" class="mr40"></image>
					<view>
						<view class="ft36">我有钱包</view>
						<view class="c_9397AF">导入钱包</view>
					</view>
				</view>
				<image src="../../static/image/arrow-right.png" mode="" class="arrow"></image>
			</navigator>
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
					<view>{{currentWallet.wallt_name}}</view>
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
				<view class="money-num ft64 pl58" v-if="showMoney">{{walletDetail.total_asset }}</view>
				<view class="money-num ft64 pl58" v-else>***</view>
				<view class="items flex">
					<navigator hover-class="none" :url="`./transfer?address=${currentWallet.address}&chainName=${currentWallet.chain_name}`" class="item">
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
				<navigator hover-class="none" url="./tokenCoin">
					<image src="../../static/image/add@2x.png" mode=""></image>
				</navigator>
			</view>
			<view class="property-item flex-between alcenter h80 mt40 mb40 plr40" v-for="(item, index) in walletDetail.coin_asset" :key="index" @click="goDetail(item)">
				<view class="flex alcenter">
					<image :src="item.icon" mode="" class="mr40"></image>
					<view>
						<view class="ft36">{{item.symbol}}</view>
						<view class="c_9397AF">{{item.chain}}</view>
					</view>
				</view>
				<view>
					<view class="ft36 text-right">{{item.balance }}</view>
					<view class="c_9397AF text-right">${{item.usdt_price }}</view>
				</view> 
			</view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="wallet-container flex-column">
				<view class="wallet-title flex-center relative">
					<view class="ft32">钱包列表</view>
					<image src="/static/image/guanbi-3@2x.png" mode="" @tap="handleClose"></image>
				</view>
				<view class="list-container flex flex-one">
					<view class="left-menu">
						<view class="menu-item flex-center" :class="{'active': menuIndex == index}" v-for="(item, index) in menus" :key="index" @tap="changeMenu(index)">
							<image :src="menuIndex == index ? item.activeImg : item.img" mode=""></image>
						</view>
					</view>
					<div class="right-container flex-one">
						<view class="flex-between alcenter pl10 pr40 h80">
							<view class="ft32">{{menus[menuIndex].name}}</view>
							<image src="/static/image/tianjia@2x.png" mode="" class="add-img" @tap="handleAdd"></image>
						</view>
						<view class="add-wallet flex-center" @tap="handleAdd" v-if="currentMenuData.length == 0">添加钱包</view>
						<view :class="[`wallet-${menuIndex}`, 'wallet-item flex-around flex-column c-white pl30 pr20']" v-for="(item, index) in currentMenuData" :key="index" @tap="handleSelectWallet(item)">
							<view class="flex alcenter">
								<view class="ft28">{{item.wallt_name}}</view>
								<view class="current ft22" v-if="item.address == currentWallet.address">当前</view>
							</view>
							<view class="flex-between alcenter">
								<view class="flex alcenter" style="overflow: hidden;">
									<view class="address pr20">{{item.address}}</view>
									<image src="/static/image/copy.png" mode="" class="copy-img" @tap="handleCopy(item.address)"></image>
								</view>
							</view>
						</view>
					</div>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import config from '@/config'
	export default {
		data() {
			return {
				config,
				showMoney: true,
				isConnected: true, //是否联网
				hasWallet: false,
				deviceId: 'c3c0268fa44293f2',
				currentWallet: {},
				propertyList: [],
				walletDetail: {
					total_asset: 0
				},
				menus: [
					{
						img: '/static/image/BTC_h@2x.png',
						activeImg: '/static/image/BTC@2x.png',
						name: '比特币'
					},
					{
						img: '/static/image/ETH_h@2x.png',
						activeImg: '/static/image/ETH@2x.png',
						name: '以太坊'
					},
					{
						img: '/static/image/EOS_h@2x.png',
						activeImg: '/static/image/EOS@2x.png',
						name: 'EOS'
					},
					{
						img: '/static/image/USDT-h@2x.png',
						activeImg: '/static/image/USDT@2x.png',
						name: 'CRT'
					}
				],
				menuIndex: 0,
				currentMenuData: []
			};
		},
		onShow() {
			this.hasWallet = uni.getStorageSync('walletData').length > 0
			if(!this.hasWallet) return 
			let walletData = uni.getStorageSync('walletData')			
			let unSubmitWallet = []
			for(let item of walletData) {
				
				let unData = item.list.filter(item => {
					return !item.hasSubmit
				})
				unSubmitWallet = unSubmitWallet.concat(unData)
			}
			unSubmitWallet = unSubmitWallet.map(item => {
				return {
					"chain": item.chain,
					"symbol": item.symbol,
					"network": "mainnet",
					"device_id": item.device_id,
					"wallet_uuid": item.wallet_uuid,
					"wallet_name": item.wallet_name,
					"address": item.address,
					"contract_addr": item.contract_addr,
				}
			})
			if(unSubmitWallet.length > 0) {
				this.$api.batch_submit_wallet(unSubmitWallet).then(() => {
					
				})
			}
			if(uni.getStorageSync('currentWallet')) {
				this.currentWallet = uni.getStorageSync('currentWallet')
			}else{
				this.currentWallet = walletData.find(item => {
					return item.type == 'ETH'
				}).list[0]
				uni.setStorageSync('currentWallet', this.currentWallet)				
			}
			uni.getNetworkType({
				success: res => {
					console.log(res.networkType)
					if (res.networkType == 'none') {
						this.isConnected = false
						if(this.hasWallet) {
							let nowWalletData = walletData.find(item => {
								return item.type == 'ETH'
							}).list.filter(item => {
								return item.wallt_name == this.currentWallet.wallt_name
							})
							let total_asset = nowWalletData.reduce((prev, next) => {
								return prev + next.usdt_price
							}, 0)
							let coin_asset = nowWalletData.map(item => {
								return {
									balance: item.balance,
									chain: item.chain,
									cny_price: item.cny_price || 0,
									icon: item.icon,
									id: 8,
									symbol: item.symbol,
									usdt_price: item.usdt_price,
								}
							})
							this.walletDetail = {
								total_asset,
								coin_asset
							}			
						}
					} else {
						this.isConnected = true
						if(this.hasWallet) {
							this.loadWalletBalance()				
						}
					}
				}
			});
			uni.onNetworkStatusChange(res => {
				console.log(res)
				this.isConnected = res.isConnected
				if(this.isConnected) {
					if(this.hasWallet) {
						this.loadWalletBalance()				
					}
				}else{
					if(this.hasWallet) {
						let walletData = uni.getStorageSync('walletData')
						let nowWalletData = walletData.find(item => {
							return item.type == 'ETH'
						}).list.filter(item => {
							return item.wallt_name == this.currentWallet.wallt_name
						})
						let total_asset = nowWalletData.reduce((prev, next) => {
							return prev + next.usdt_price
						}, 0)
						let coin_asset = nowWalletData.map(item => {
							return {
								balance: item.balance,
								chain: item.chain,
								cny_price: item.cny_price || 0,
								icon: item.icon,
								id: 8,
								symbol: item.symbol,
								usdt_price: item.usdt_price,
							}
						})
						this.walletDetail = {
							total_asset,
							coin_asset
						}			
					}
				}
			});
		},
		methods: {
			loadWalletBalance() {
				// #ifdef APP-PLUS
				plus.device.getInfo({
					success: (e) =>{
						this.deviceId = e.uuid
						this.$api.getWalletBalance({
							device_id: this.deviceId,
							wallet_uuid: this.currentWallet.uuid,
							chain: this.currentWallet.chain
						}).then(res => {
							this.walletDetail = res.result
							this.walletDetail.coin_asset = this.walletDetail.coin_asset.map(item => {
								return {
									...item,
									icon: config.imgUrl + item.icon
								}
							})
						})
					},
					fail: (e) =>{
						console.log('getDeviceInfo failed: '+JSON.stringify(e));
					}
				});
				// #endif
				// #ifdef H5
				this.$api.getWalletBalance({
					device_id: this.deviceId,
					wallet_uuid: this.currentWallet.uuid,
					chain: this.currentWallet.chain
				}).then(res => {
					this.walletDetail = res.result
					this.walletDetail.coin_asset = this.walletDetail.coin_asset.map(item => {
						return {
							...item,
							icon: config.imgUrl + item.icon
						}
					})
				})
				// #endif
			},
			goPath() {
				this.$alert('暂不支持')
			},
			goDetail(item) {
				uni.navigateTo({
					url: `./propertyDetail?walletData=${JSON.stringify(item)}`
				})
			},
			handleOpen() {
				this.$refs.popup.open()
				if(this.menuIndex == 1) {
					let walletData = uni.getStorageSync('walletData')
					this.currentMenuData = walletData.find(item => {
						return item.type == 'ETH'
					}).list.filter(item => {
						return !item.contract_address
					})
				}else{
					this.currentMenuData = []
				}
			},
			handleClose() {
				this.$refs.popup.close()
			},
			changeMenu(index) {
				this.menuIndex = index
				if(this.menuIndex == 1) {
					let walletData = uni.getStorageSync('walletData')
					this.currentMenuData = walletData.find(item => {
						return item.type == 'ETH'
					}).list.filter(item => {
						return !item.contract_address
					})
				}else{
					this.currentMenuData = []
				}
			},
			handleAdd() {
				if(this.menuIndex != 1) {
					return this.$alert('暂不支持')
				}
				uni.showActionSheet({
				    itemList: ['创建', '导入'],
				    success: (res) => {
				        if(res.tapIndex == 0) {
							uni.navigateTo({
								url: `/pages/my/createWallet?name=以太坊`
							})
							this.handleClose()
						}else{
							uni.navigateTo({
								// url: '/pages/my/addWallet'
								url: './importWallet'
							})
							this.handleClose()
						}
				    },
				    fail: (res) => {
				        console.log(res.errMsg);
				    }
				});
			},
			handleSelectWallet(data) {
				this.currentWallet = data
				uni.setStorageSync('currentWallet', this.currentWallet)
				this.loadWalletBalance()
				this.handleClose()
			},
			handleCopy(address) {
				uni.setClipboardData({
					data: address,
					success: () => {
						uni.showToast({
							title: '复制成功'
						})
					}
				})
			}
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
			.left-menu{
				width: 160rpx;
				background: #F1F3F5;
				height: 100%;
				overflow-y: scroll;
				.menu-item{
					width: 100%;
					height: 122rpx;
					&.active{
						background-color: #ffffff;
					}
					image{
						width: 80rpx;
						height: 80rpx;
						border-radius: 20rpx;
					}
				}
			}
			.right-container{
				.add-img{
					width: 44rpx;
					height: 44rpx;
				}
				.add-wallet{
					width: 520rpx;
					height: 86rpx;
					border-radius: 20rpx;
					border: 2rpx dashed #222222;
					margin:0 40rpx 20rpx 30rpx;
				}
				.wallet-item{
					width: 520rpx;
					height: 140rpx;
					background: #FF8E40;
					border-radius: 20rpx;
					margin:0 40rpx 20rpx 30rpx;
					box-sizing: border-box;
					.address{
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					.current{
						height: 32rpx;
						padding: 0 10rpx;
						background-color: #ffffff;
						color: #FF8E40;
						border-radius: 8rpx;
						margin-left: 16rpx;
					}
					&.wallet-1{
						background: #585757;
						.current{
							color: #585757;
						}
					}
					&.wallet-2{
						background: #21B67E;
						.current{
							color: #21B67E;
						}
					}
					&.wallet-3{
						background: #4F85E9;
						.current{
							color: #4F85E9;
						}
					}
					.copy-img{
						width: 24rpx;
						height: 24rpx;
						margin-left: 28rpx;
						flex-shrink: 0;
					}
				}
			}
		}
	}
</style>
