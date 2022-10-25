<template>
	<view class="flash-container">
		<view class="top-container">
			<view class="top-inner flex-column">
				<view class="flex-between alcenter">
					<view class="ft28 c_9397AF">BTC 余额</view>
					<view class="all c_4C6EF5 flex-center">全部兑换</view>
				</view>
				<view class="flex-between alcenter mt10">
					<view class="flex alcenter">
						<view class="ft40">302.00 BTC</view>
						<view class="ft28">≈$ 10000.00</view>
					</view>
					<image src="../../static/image/wenti-2@2x.png" mode="" class="question-img"></image>
				</view>
			</view>
		</view>
		<view class="exchange-box plr40">
			<view class="exchange-item mb10">
				<view class="flex-end mb20">转换数量</view>
				<view class="flex-between alcenter">
					<view class="single-item flex-between alcenter">
						<view class="flex alcenter">
							<image src="../../static/image/BTC@2x.png" mode="" class="coin-img mr20"></image>
							<view class="ft32">BTC</view>
						</view>
						<image src="../../static/image/down.png" mode="" class="down-img"></image>
					</view>
					<view class="single-item flex-between alcenter" style="padding-left: 44rpx;">
						<input class="fle-one ft32" type="number" v-model="num1" />
						<image src="../../static/image/guan@2x.png" mode="" class="down-img ml20"></image>
					</view>
				</view>
				<image src="../../static/image/zhuanhuan@2x.png" mode="" class="operator-img"></image>
			</view>
			<view class="exchange-item second">
				<view class="flex-end mb20">预计接受数量</view>
				<view class="flex-between alcenter">
					<view class="single-item flex-between alcenter">
						<!-- <view class="flex alcenter">
							<image src="../../static/image/BTC@2x.png" mode="" class="coin-img mr20"></image>
							<view class="ft32">BTC</view>
						</view>
						<image src="../../static/image/down.png" mode="" class="down-img"></image> -->
						<view class="ft28 c_9397AF flex-one flex-between alcenter pl20">
							<view>请选择</view>
							<image src="../../static/image/down.png" mode="" class="down-img"></image>
						</view>
					</view>
					<view class="single-item flex-between alcenter" style="padding-left: 44rpx;">
						<input class="fle-one ft32" type="number" v-model="num2" />
						<image src="../../static/image/guan@2x.png" mode="" class="down-img ml20"></image>
					</view>
				</view>
				<view class="flex-between alcenter receive-address mt30">
					<input class="flex-one ft32" type="number" v-model="address" placeholder="请输入接收地址" placeholder-style="font-size: 28rpx;color: #9397AF;"/>
					<view class="local-wallet ft20 flex-center ml20" @tap="handleOpen">本地钱包</view>
				</view>
			</view>
			<view class="exchange-detail-container plr40 flex-column mt20">
				<view class="item flex-between alcenter">
					<view class="c_9397AF">兑换路径</view>
					<view>BTC</view>
				</view>
				<view class="item flex-between alcenter">
					<view class="c_9397AF">兑换路径</view>
					<view>BTC</view>
				</view>
				<view class="item flex-between alcenter">
					<view class="c_9397AF">兑换路径</view>
					<view>BTC</view>
				</view>
				<view class="item flex-between alcenter">
					<view class="c_9397AF">兑换路径</view>
					<view>BTC</view>
				</view>
			</view>
			<button type="default" class="exchange-btn">兑换</button>
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
						<view :class="[`wallet-${menuIndex}`, 'wallet-item flex-around flex-column c-white pl30 pr20']" v-for="(item, index) in currentMenuData" :key="index">
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
	import { getAllWalletData } from '@/common/utils/storage.js';
	export default {
		data() {
			return {
				num1: 0.001,
				num2: '',
				address: '',
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
				currentWallet: {},
				currentMenuData: []
			};
		},
		onLoad() {
			this.currentWallet = uni.getStorageSync('currentWallet')
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: './flashRecord'
			})
		},
		methods: {
			handleOpen() {
				this.$refs.popup.open()
				if(this.menuIndex == 1) {
					let walletData = getAllWalletData()
					this.currentMenuData = walletData.find(item => {
						return item.type == 'ETH'
					}).list
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
					let walletData = getAllWalletData()
					this.currentMenuData = walletData.find(item => {
						return item.type == 'ETH'
					}).list
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
								url: '/pages/my/createWallet'
							})
						}else{
							uni.navigateTo({
								url: '/pages/my/addWallet'
							})
						}
				    },
				    fail: (res) => {
				        console.log(res.errMsg);
				    }
				});
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
	.flash-container{
		.top-container{
			height: 122rpx;
			padding-top: 22rpx;
			background-color: #4C6EF5;
			box-sizing: border-box;
			.top-inner{
				width: 670rpx;
				height: 160rpx;
				justify-content: center;
				background: #FFFFFF;
				box-shadow: 0rpx 20rpx 20rpx 0rpx rgba(76, 110, 245, 0.1);
				border-radius: 20rpx;
				margin: 0 auto;
				padding: 0 24rpx;
				box-sizing: border-box;
				.all{
					width: 134rpx;
					height: 44rpx;
					border-radius: 22rpx;
					border: 2rpx solid #4C6EF5;
				}
				.question-img{
					width: 30rpx;
					height: 30rpx;
				}
			}
		}
		.exchange-box{
			margin-top: 110rpx;
			.exchange-item{
				position: relative;
				height: 220rpx;
				padding: 24rpx;
				background-color: #F7F8FC;
				border-radius: 20rpx;
				box-sizing: border-box;
				&.second{
					height: 320rpx;
				}
				.single-item{
					width: 300rpx;
					height: 90rpx;
					background: #FFFFFF;
					padding: 0 18rpx 0 12rpx;
					border-radius: 20rpx;
					box-sizing: border-box;
					.coin-img{
						width: 80rpx;
						height: 80rpx;
						border-radius: 20rpx;
					}
					.down-img{
						flex-shrink: 0;
						width: 30rpx;
						height: 30rpx;
					}
					input{
						color: #4C6EF5;
					}
				}
				.receive-address{
					height: 90rpx;
					background: #FFFFFF;
					border-radius: 20rpx;
					padding: 0 26rpx 0 40rpx;
					box-sizing: border-box;
					.local-wallet{
						width: 140rpx;
						height: 40rpx;
						color: #ffffff;
						background: #4C6EF5;
						border-radius: 10rpx;
					}
				}
				.operator-img{
					position: absolute;
					bottom: -36rpx;
					left: 50%;
					transform: translateX(-50%);
					z-index: 10;
					width: 72rpx;
					height: 72rpx;
				}
			}
			.exchange-detail-container{
				height: 214rpx;
				background: #FAFBFA;
				border-radius: 20rpx;
				border: 2rpx solid #ECEEF0;
				.item{
					flex: 1;
				}
			}
			.exchange-btn{
				width: 686rpx;
				height: 96rpx;
				line-height: 96rpx;
				font-size: 32rpx;
				color: #ffffff;
				background: #94A9FF;
				box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(76, 110, 245, 0.5);
				border-radius: 20rpx;
				margin: 44rpx 0;
				&:after{
					border: none;
				}
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
					}
				}
			}
		}
	}
</style>
