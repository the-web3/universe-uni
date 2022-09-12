<template>
	<view class="record-detail-container plr40">
		<view class="flex-column flex-center top-detail">
			<image v-if="detail.is_error == 1" src="../../static/image/shibai@2x.png" mode=""></image>
			<image v-if="detail.is_error != 1 && detail.tx_in_out == 'to' && detail.txreceipt_status == 1" src="../../static/image/transfer.png" mode=""></image>
			<image v-if="detail.is_error != 1 && detail.tx_in_out == 'from' && detail.txreceipt_status == 1" src="../../static/image/zhuanchu@2x.png" mode=""></image>
			<image v-if="detail.is_error != 1 && detail.txreceipt_status != 1" src="../../static/image/deng@2x.png" mode=""></image>
			<view class="ft28 mt10">{{detail.is_error == 1 ? '转账失败' : detail.tx_in_out == 'from' && detail.txreceipt_status == 1 ?
			'转出成功' : detail.tx_in_out == 'from' && detail.txreceipt_status != 1 ? 
			'待转出' : detail.tx_in_out == 'to' && detail.txreceipt_status == 1 ? '收款成功' : '待收款'}}</view>
			<view class="ft40 mt20">{{detail.tx_in_out == 'from' ? '-' : '+'}}{{(detail.value / Math.pow(10, detail.unit)).toFixed(4)}}{{detail.asset_name}}</view>
		</view>
		<view class="form-item mb30">
			<view class="label ft28 c_9397AF">发款方</view>
			<view class="ft32 line-one mt10">{{detail.from}}</view>
		</view>
		<view class="form-item mb30">
			<view class="label ft28 c_9397AF">收款方</view>
			<view class="ft32 line-one mt10">{{detail.to}}</view>
		</view>
		<view class="form-item mb30">
			<view class="label ft28 c_9397AF">矿工费用</view>
			<view class="ft32 line-one mt10">{{(detail.gas_used * detail.gas_price / Math.pow(10, 18)).toFixed(4)}} ETH</view>
		</view>
		<view class="flex-between mt120">
			<view style="width: 380rpx;">
				<view class="form-item mb30">
					<view class="label ft28 c_9397AF">哈希值</view>
					<view class="flex alcenter mt10">
						<view class="ft32 line-one">{{detail.hash}}</view>
						<image src="../../static/image/fuzhi.png" mode="" class="copy-img ml10" @tap="handleCopy(detail.hash)"></image>
					</view>
				</view>
				<view class="form-item mb30">
					<view class="label ft28 c_9397AF">区块号</view>
					<view class="flex alcenter mt10">
						<view class="ft32 line-one">{{detail.block_number}}</view>
						<image src="../../static/image/fuzhi.png" mode="" class="copy-img ml10" @tap="handleCopy(detail.block_number)"></image>
					</view>
				</view>
				<view class="form-item mb30">
					<view class="label ft28 c_9397AF">交易时间</view>
					<view class="ft32 line-one mt10">{{detail.date_tine}}</view>
				</view>
			</view>
			<view>
				<uqrcode ref="uqrcode" class="code-img"/>
				<view class="flex-center mt10">
					<view class="ft28">查询链接</view>
					<image src="../../static/image/fuzhi.png" mode="" class="copy-img ml10" @tap="handleCopy(`https://etherscan.io/tx/${detail.hash}`)"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: {},
				qrcodeSrc: ''
			};
		},
		onLoad(options) {
			this.detail = JSON.parse(options.detail)
		},
		onReady() {
			uni.showLoading({
				mask: true,
				title: '生成中...'
			})
			this.$refs
				.uqrcode
				.make({
					size: 100,
					text: `https://etherscan.io/tx/${this.detail.hash}`,
					enableDelay: false // 启用延迟绘制
				})
				.then(res => {
					// 返回的res与uni.canvasToTempFilePath返回一致
					console.log(res)
					console.log(`生成二维码耗时：${res.time}ms`)
					this.qrcodeSrc = res.tempFilePath
				})
				.finally(() => {
					uni.hideLoading()
				})
		},
		methods: {
			handleCopy(data) {
				uni.setClipboardData({
					data: data,
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
	.record-detail-container{
		.top-detail{
			padding-top: 38rpx;
			padding-bottom: 38rpx;
			image{
				width: 80rpx;
				height: 80rpx;
			}
		}
		.copy-img{
			width: 24rpx;
			height: 24rpx;
			flex-shrink: 0;
		}
		.code-img{
			display: block;
			width: 200rpx;
			height: 200rpx;
		}
	}
</style>
