<template>
	<view class="backup-step-container flex-column alcenter">
		<view class="ft28 tip">请安顺序写下12个单词并保存在安全的地方（安全起见，请不要截图形式）</view>
		<view class="word-container c_4C6EF5 relative mb30">
			<view class="step ft32">NO.{{stepIndex + 1}}/{{words.length}}</view>
			<view class="word ft60">{{words[stepIndex]}}</view>
		</view>
		<text class="ft28 c_D85151">
			注意：
			请勿将助记次透露给任何人
			助记词一旦丢失，资产将无法恢复
			请勿通过截、网络传输的方式进行备份保存
			遇到任何情况，请不要轻易卸载app
		</text>
		<view class="flex-between alcenter btns">
			<image src="../../static/image/button_f_l@2x.png" mode="" @tap="handlePrev"></image>
			<image src="../../static/image/button_f_rr@2x.png" mode="" @tap="handleNext"></image>
		</view>
	</view>
</template>

<script>
	import * as base from '@/common/word/base';
	export default {
		data() {
			return {
				walletName: '',
				password: '',
				words: [],
				stepIndex: 0,
				type: '',
			};
		},
		async onLoad(options) {
			this.walletName = options.walletName
			this.password = options.password
			let words = await base.GenerateMnemonic(12, "english")
			this.words = words.split(' ')
			this.type = options.type
		},
		methods: {
			handlePrev() {
				this.stepIndex == 0 ? 0 : this.stepIndex -= 1
			},
			handleNext() {
				this.stepIndex += 1
				if(this.stepIndex == this.words.length) {
					let words = this.words.join(' ')
					console.log(words)
					uni.navigateTo({
						url: `./validateWord?type=${this.type}&walletName=${this.walletName}&password=${this.password}&words=${words}`
					})
					this.stepIndex = 0
				}
			}
		}
	}
</script>

<style lang="scss">
	.backup-step-container{
		.tip{
			width: 534rpx;
			line-height: 40rpx;
			text-align: center;
			margin: 38rpx auto 26rpx;
		}
		.word-container{
			width: 540rpx;
			height: 474rpx;
			background-image: url(../../static/image/kuang@2x.png);
			background-repeat: no-repeat;
			background-size: 100% 100%;
			.step{
				position: absolute;
				top: 36rpx;
				left: 32rpx;
			}
			.word{
				position: absolute;
				top: 150rpx;
				left: 50%;
				transform: translateX(-50%);
			}
		}
		.btns{
			margin: 72rpx 117rpx;
			image{
				width: 220rpx;
				height: 220rpx;
			}
		}
	}
</style>
