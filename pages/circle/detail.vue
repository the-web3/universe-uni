<template>
	<view class="article-detail-container">
		<view class="title-text border_bottom">
			{{ detail && detail.title }}
		</view>
		<view class="auth-info-box flex-between">
			<text>{{ detail && detail.author }}</text>
			<text>{{ detail && detail.created_at }}</text>
		</view>
		<view class="detail-box" v-html="detail&&detail.detail"></view>
	</view>
</template>

<script>
	import { getArcticleDetail } from '@/api/circle.js'
	export default {
		name: 'newsDetail',
		data () {
			return {
				id: null,
				type: null,
				detail: null
			}
		},
		onLoad (option) {
			console.log(option)
			this.id = +option.id
			this.type = +option.type
			this.getArcticleDetail()
		},
		methods: {
			async getArcticleDetail () {
				try {
					const res = await getArcticleDetail({ type: this.type, article_id: this.id })
					if (+res.code === 200) {
						this.detail = res.result || null
					}
				} catch (e) {
					console.log(e)
				}
			}
		}
	}
</script>

<style lang="scss">
	.article-detail-container{
		width: 100%;
		.title-text{
			font-size: 44rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #222222;
			line-height: 60rpx;
			width: 100%;
			box-sizing: border-box;
			padding: 0 48rpx;
		}
		.auth-info-box{
			width: 100%;
			border-bottom: 1px solid #F0F0F0;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #9397AF;
			line-height: 40rpx;
			width: 100%;
			box-sizing: border-box;
			padding: 20rpx 48rpx;
		}
		.detail-box{
			width: 100%;
			box-sizing: border-box;
			padding: 40rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #222222;
			line-height: 40rpx;
			text-align: justify;
		}
	}
</style>