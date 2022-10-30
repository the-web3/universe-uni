<template>
	<view class="property-detail-container">
		<view class="top-container flex-column alcenter">
			<uni-nav-bar statusBar fixed left-icon="back" rightText="详情" :title="walletData.name" backgroundColor="#4C6EF5" color="#ffffff" @clickLeft="goBack" @clickRight="handleRight">
			</uni-nav-bar>
			<view class="flex c-white mt40">
				<view class="ft72">{{balanceData.balance }}</view>
				<view class="ft28" style="line-height: 130rpx;">{{balanceData.name}}</view>
			</view>
			<view class="c-white ft28" style="margin-top: -10px;">≈$ {{balanceData.usdt_price }}</view>
		</view>
		<view class="chart-container">
			<view class="flex-between alcenter chart-title plr40">
				<view class="flex alcenter">
					<view class="ft40 mr10">{{balanceData.balance}}</view>
					<view class="ft28 alself-end">=${{balanceData.usdt_price}}</view>
				</view>
				<view>价格USD</view>
			</view>
			<view class="charts-box">
				<qiun-data-charts type="area" :opts="opts" :chartData="chartsDataLine" :echartsH5="false" :echartsApp="false"/>
			</view>
		</view>
		<view class="plr40">
			<view class="ft32 mb50">交易记录</view>
			<view class="list-item flex-between alcenter h80" v-for="(item, index) in recordList" :key="index" @tap="goDetail(item)">
				<view class="flex alcenter">
					<image v-if="item.txreceipt_status != 2" src="../../static/image/shibai@2x.png" mode="" class="mr40"></image>
					<image v-if="item.txreceipt_status == 2 && item.tx_in_out == 'to' && item.txreceipt_status == 3" src="../../static/image/transfer.png" mode="" class="mr40"></image>
					<image v-if="item.txreceipt_status == 2 && item.tx_in_out == 'from' && item.txreceipt_status == 3" src="../../static/image/zhuanchu@2x.png" mode="" class="mr40"></image>
					<image v-if="item.txreceipt_status == 2 && item.txreceipt_status != 3" src="../../static/image/deng@2x.png" mode="" class="mr40"></image>
					<view style="width: 300rpx;">
						<view class="ft36">{{item.txreceipt_status == 2 ? '转账失败' : item.tx_in_out == 'from' && item.txreceipt_status == 3 ? 
						'转出' : item.tx_in_out == 'from' && item.txreceipt_status != 3 ? 
						'待转出' : item.tx_in_out == 'to' && item.txreceipt_status == 3 ? '收款' : '待收款'}}</view>
						<view class="c_9397AF line-one">{{item.from}}</view>
					</view>
				</view>
				<view class="flex-one" style="overflow: hidden;">
					<view class="ft36 line-one" style="text-align: right;">{{item.value}}</view>
					<view class="c_9397AF" style="text-align: right;">{{item.date_tine}}</view>
				</view>
			</view>
			<image v-if="recordList.length == 0" src="../../static/image/kong@2x.png" mode="" class="empty-img"></image>
		</view>
		<view class="fixed-bottom flex-between alcenter">
			<button type="default" class="transfer-btn" @tap="goTransfer">转账</button>
			<button type="default" class="gather-btn" @tap="goGather">收款</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				opts: {
					fontSize: 12,
					color: ['#F99B73'],
					dataLabel: false,
					legend:{show: false},
					yAxis:{
						data:[{min:0}],
						gridColor: "#F1F1F1",
					},
					extra:{area:{type:'curve',addLine:true,gradient:true}}
				},
				chartsDataLine: {},
				walletData: {},
				balanceData: {},
				recordList: [],
				page: 1,
				page_size: 10,
				hasMore: false
			};
		},
		onLoad(options) {
			this.walletData = JSON.parse(options.walletData || "{}")
			this.loadRecord()
			this.loadBalance()
			
		},
		onPullDownRefresh() {
			this.page = 1
			this.loadRecord().then(() => {
				uni.stopPullDownRefresh()
			}).catch(() => {
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			console.log('bottom')
			if(this.hasMore) {
				this.page += 1
				this.loadRecord()
			}else{
				
			}
		},
		methods: {
			loadBalance() {
				this.$api.getAddressBalance({
					"chain": this.walletData.chain,
					"symbol": this.walletData.symbol,
					"network": "mainnet",
					"address": this.walletData.address,
					"contract_addr": "",// item.contract_addr,
				}).then(res => {
					console.log("enter here now")
					this.balanceData = res.result
					console.log("res.result==", res.result)
					let categories = res.result.data_stat.map(item => {
						return item.time
					})
					let data = res.result.data_stat.map(item => {
						return item.amount
					})
					//渐变色区域图
					let linearareadata={
					  categories: categories,
					  series:[{
						name: "价格",
						smooth:false,
						areaStyle:{
						  color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [{
								offset: 0, color: '#F99B73' // 0% 处的颜色
							}, {
								offset: 1, color: '#FFFFFF' // 100% 处的颜色
							}],
							global: false // 缺省为 false
						  }
						},
						data: data
					  }]
					}
					this.chartsDataLine=linearareadata
				})
			},
			loadRecord() {
				return new Promise((resolve, reject) => {
					console.log("aaa=====", this.walletData.chain)
					this.$api.get_tx_by_address({
						network: "mainnet",
						chain: this.walletData.chain,
						symbol: this.walletData.symbol,
						address: this.walletData.address,
						contract_address: this.walletData.contract_addr,
						page: this.page.toString(),
						page_size: this.page_size.toString()
					}).then(res => {
						if(!res.data || res.data.length < this.page_size) {
							this.hasMore = false
						}else{
							this.hasMore = true
						}
						if(this.page == 1) {
							this.recordList = res.result || []
						}else{
							this.recordList = this.recordList.concat(res.result || [])
						}
						resolve(res)
					}).catch((err) => {
						reject(err)
					})
				})
			},
			goBack() {
				uni.navigateBack()
			},
			handleRight() {
				uni.navigateTo({
					url: './coinDetail'
				})
			},
			goTransfer() {
				uni.navigateTo({
					url: `./transfer?address=${this.walletData.address}&contractaddress=${this.walletData.contract_addr}`
				})
			},
			goGather() {
				uni.navigateTo({
					url: `./gather?address=${this.walletData.address}`
				})
			},
			goDetail(item) {
				uni.navigateTo({
					url: `./recordDetail?detail=${JSON.stringify(item)}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.property-detail-container{
		padding-bottom: 130rpx;
		.top-container{
			height: 586rpx;
			background: #4C6EF5;
			.nav-img{
				width: 44rpx;
				height: 44rpx;
			}			
		}
		.chart-container{
			width: 630rpx;
			height: 424rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 20rpx 20rpx 0rpx rgba(76, 110, 245, 0.1);
			border-radius: 40rpx;
			margin: -212rpx auto 56rpx;
			box-sizing: border-box;
			.chart-title{
				height: 112rpx;
			}
			.charts-box{
				width: 100%;
				height: 310rpx;
			}
		}
		.list-item{
			margin-bottom: 70rpx;
			image{
				width: 80rpx;
				height: 80rpx;
				flex-shrink: 0;
			}
		}
		.empty-img{
			display: block;
			width: 480rpx;
			height: 480rpx;
			margin: 0 auto;
		}
		.fixed-bottom{
			position: fixed;
			bottom: 30rpx;
			left: 0;
			width: 100%;
			z-index: 20;
			padding: 0 60rpx;
			box-sizing: border-box;
			.transfer-btn, .gather-btn{
				width: 300rpx;
				height: 96rpx;
				line-height: 96rpx;
				font-size: 32rpx;
				color: #ffffff;
				background: #376FFF;
				border-radius: 20rpx;
			}
			.gather-btn{
				background: #F68B40;
			}
		}
	}
</style>
