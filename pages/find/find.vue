<template>
	<view class="find-container">
		<view class="status-bar"></view>
		<view class="top-fixed flex-between alcenter h100 plr40">
			<view class="input-container flex alcenter plr20">
				<image src="../../static/image/search.png" mode=""></image>
				<input class="flex-one" type="text" v-model="searchkey" />
			</view>
			<image src="../../static/image/scan.png" mode="" class="scan-img"></image>
		</view>
		<view class="swiper-container mlr40">
			<swiper class="swiper" :indicator-dots="false" :autoplay="true" circular @change="swiperChange">
				<swiper-item class="swiper-item" v-for="(item, index) in swiperList" :key="index">
					<image :src="item" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
			<view class="swiper-dots flex-center h60">
				<view class="dot-item" :class="{'active': swiperIndex == index}" v-for="(item, index) in swiperList" :key="index"></view>
			</view>
		</view>
		<view class="app-title flex-between alcenter plr40 h80">
			<view class="ft32">热门应用</view>
			<view class="c_9397AF ft28">更多</view>
		</view>
		<view class="flex-between alcenter app-btns plr40">
			<image src="../../static/image/pic1@2x.png" mode=""></image>
			<image src="../../static/image/pic2@2x.png" mode=""></image>
		</view>
		<view class="flex flex-wrap app-list plr40 mt60">
			<navigator hover-class="none" url="./swap" class="app-item flex-column flex-center mb30" v-for="(item, index) in 10" :key="index">
				<image src="http://image.wufazhuce.com/FiHIrjKDFYrongr6RYOHs7mVqJ5f" mode=""></image>
				<view class="ft28 mt10">APP</view>
			</navigator>
		</view>
		<scroll-view scroll-x scroll-with-animation class="tab-box ml40 mb30" :scroll-left="scrollLeft">
			<view class="tab-item" v-for="(item, index) in tabs" :key="index" :class="{'active': selectedIndex == index}" :data-current="index" @tap="handleSelect">
				<text>{{item}}</text>
				<image v-show="selectedIndex == index" src="../../static/image/active.png" mode=""></image>
			</view>
		</scroll-view>
		<swiper :current="selectedIndex" @change="listChange" :style="{height: scrollHeight + 'px'}">
			<swiper-item v-for="(item, index) in tabs" :key="index">
				<mescroll-item :i="index" :index="selectedIndex"></mescroll-item>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import MescrollItem from "./mescroll-swiper-item.vue";
	export default {
		components: {
			MescrollItem
		},
		data() {
			return {
				searchkey: '',
				swiperList: ['http://image.wufazhuce.com/FiHIrjKDFYrongr6RYOHs7mVqJ5f', 'http://image.wufazhuce.com/Fn7g1GKNvdKFIog6zbFG-dlzgeKM',
				'http://image.wufazhuce.com/FvchqyP1RX2-6A_uudu8CsIoH01_'],
				swiperIndex: 0,
				scrollLeft: 0,
				tabs: [],
				selectedIndex: 0,
				scrollHeight: 0
			}
		},
		onLoad() {
			this.tabs = ['最新', 'Heco', 'BSC', 'OEC', 'ETH', 'Matic', 'TRON', 'TRON']
			let { statusBarHeight, windowHeight } = uni.getSystemInfoSync()
			this.scrollHeight = windowHeight - statusBarHeight - uni.upx2px(100) - uni.upx2px(100)
		},
		methods: {
			swiperChange(e) {
				this.swiperIndex = e.detail.current
			},
			handleSelect(e) {
				let cur = e.currentTarget.dataset.current;
				if (this.selectedIndex == cur) {
					return false;
				} else {
					this.selectedIndex = cur
				}
			},
			listChange(e) {
				this.selectedIndex = e.detail.current
				this.checkCor();
			},
			//判断当前滚动超过一屏时，设置tab标题滚动条。
			checkCor() {
				if (this.selectedIndex > 3) {
					//这里距离按实际计算
					this.scrollLeft = 300
				} else {
					this.scrollLeft = 0
				}
			},
		}
	}
</script>

<style lang="scss">
	$status_Height: var(--status-bar-height);
	.find-container{
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
			.input-container{
				width: 580rpx;
				height: 64rpx;
				background: #F4F7FD;
				border-radius: 64rpx;
				input{
					height: 64rpx;
				}
			}
		}
		.swiper-container{
			.swiper{
				height: 220rpx;
			}
			.swiper-item{
				width: 100%;
				height: 220rpx;
				image{
					width: 100%;
					height: 100%;
					border-radius: 40rpx;
				}
			}
			.swiper-dots{
				.dot-item{
					width: 20rpx;
					height: 8rpx;
					background: #D6D9E0;
					border-radius: 4rpx;
					margin-right: 20rpx;
					&.active{
						background: #4C6EF5;
					}
				}
			}
		}
		.app-btns{
			image{
				width: 322rpx;
				height: 112rpx;
			}
		}
		.app-list{
			.app-item{
				width: 20%;
				image{
					width: 92rpx;
					height: 92rpx;
					border-radius: 28rpx;
				}
			}
		}
		.tab-box{
			position: sticky;
			top: 100rpx;
			// top: calc(100rpx + var($status_Height));
			background-color: #ffffff;
			z-index: 10;
			display: flex;
			background: #ffffff;
			white-space: nowrap;
			.tab-item{
				display: inline-flex;
				flex-direction: column;
				line-height: 60rpx;
				color: #9397AF;
				font-size: 28upx;
				margin-right: 28rpx;
				image{
					width: 60rpx;
					height: 20rpx;
				}
				&.active{
					font-size: 32rpx;
					color: #222222;
				}
			}
		}
	}
</style>
