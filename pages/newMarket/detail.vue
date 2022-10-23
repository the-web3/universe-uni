<template>
	<view class="bybit-detial-container">
		<view class="bybit-detail-title-box">
			<view class="back-icon" @click="handleNavigatorBack">
				<image src="../../static/image/backIcon.png" mode="aspectFit"></image>
			</view>
			<view class="bybit-name-box">
				<image src="../../static/image/bitcoin.png" mode="aspectFit"></image>
				<text class="name">WBTC</text>
				<text class="desc">（wrapped BTC）</text>
			</view>
			<view class="follow-icon">
				<image src="../../static/image/follow.png" mode="aspectFit"></image>
				<text>favorites</text>
			</view>
		</view>
		<view class="bybit-detail-box">
			<view class="bybit-text-detail-box flex">
				<view class="left-text-box">
					<text class="surplus">128.12</text>
					<view class="flex-between alcenter">
						<text class="dollar-surplus">=$2800.12</text>
						<text class="dollar-profit">-0.75%</text>
					</view>
				</view>
				<view class="right-text-box flex-column flex-around">
					<view class="flex-between alcenter">
						<view class="flex-column">
							<text class="gray-label">24h High</text>
							<text class="black-number">20129.69</text>
						</view>
						<view class="flex-column">
							<text class="gray-label">TVL(USD)</text>
							<text class="black-number">20129.69</text>
						</view>
					</view>
					<view class="flex-between alcenter">
						<view class="flex-column">
							<text class="gray-label">24h Low</text>
							<text class="black-number">19532.75</text>
						</view>
						<view class="flex-column">
							<text class="gray-label">24h Vol(USD)</text>
							<text class="black-number">20129.69</text>
						</view>
					</view>
				</view>
			</view>
			<view class="bybit-chart-detail-box">
				<v-tabs
				  v-model="activeTab"
				  :scroll="tabs.length >= 6"
				  :tabs="tabs"
				  fontSize="30rpx"
				  color="#222222"
				  activeColor="#222222"
				></v-tabs>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeTab: 0,
				tabs: ["1日", "5m", "15m", "30m", "1h", "4h", "1d", "1w"],
			};
		},
		methods: {
			handleNavigatorBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	.bybit-detial-container{
		.bybit-detail-title-box{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10px 16px;
			.back-icon{
				width: 20px;
				image{
					width: 20px;
					height: 20px;
				}
			}
			.bybit-name-box{
				width: 70%;
				display: flex;
				align-items: center;
				image{
					width: 24px;
					height: 24px;
				}
				.name{
					font-size: 18px;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #222222;
					margin: 0 4px 0 15px;
				}
				.desc{
					font-size: 12px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #9397AF;
				}
			}
			.follow-icon{
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				image{
					width: 24px;
					height: 21px;
				}
				text{
					font-size: 10px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #222222;
				}
			}
		}
		.bybit-detail-box{
			.bybit-text-detail-box{
				padding: 20px;
				.left-text-box{
					width: 45%;
					.surplus{
						font-size: 50px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #222222;
					}
					.dollar-surplus{
						font-size: 14px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #222222;
					}
					.dollar-profit{
						font-size: 17px;
						font-family: DIMMed;
						color: #D82626;
					}
				}
				.right-text-box{
					width: 60%;
					padding-left: 20px;
					.gray-label{
						font-size: 12px;
						font-family: DIMMed;
						color: #9397AF;
						line-height: 15px;
					}
					.black-number{
						font-size: 16px;
						font-family: DIMMed;
						color: #222222;
						line-height: 19px;
					}
				}
			}
		}
	}
</style>
