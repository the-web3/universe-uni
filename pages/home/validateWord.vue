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
	import { postWalletInfo } from '@/common/utils';
	export default {
		data() {
			return {
				walletName: '',
				password: '',
				words: [],
				shuffleWords: [],
				fillWords: new Array(12).fill(''),
				address: '',
				privateKey: '',
				chain_name: ''
			}
		},
		async onLoad(options) {
			this.chain_name = options.chain_name
			this.walletName = options.walletName
			this.password = options.password
			this.words = options.words.split(' ')
			this.shuffleWords = options.words.split(' ')
			this.shuffle(this.shuffleWords)
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
						postWalletInfo({
							chain_name: this.chain_name,
							words: this.words.join(' '),
							wallet_name: this.walletName,
							password: this.password,
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
