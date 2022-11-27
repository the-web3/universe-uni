<template>
	<view class="token-coin-container">
		<navigator hover-class="none" open-type="switchTab" url="./home" class="list-item bg-white flex-between alcenter h120 plr40">
			<view class="ft32">首页资产</view>
			<image src="../../static/image/arrow-right.png" mode="" class="arrow"></image>
		</navigator>
		<navigator hover-class="none" url="/pages/my/property" class="list-item bg-white flex-between alcenter h120 plr40 mb10">
			<view class="ft32">我的资产</view>
			<image src="../../static/image/arrow-right.png" mode="" class="arrow"></image>
		</navigator>
		<view class="ft32 bg-white hot-title flex alcenter plr40 h100">热门代币</view>
		<view class="list-item bg-white flex-between alcenter h120 plr40" v-for="(item, index) in hotList" :key="index">
			<view class="flex alcenter" style="width: 500rpx;">
				<image :src="`${config.imgUrl + item.active_logo}`" mode="" class="mr20"></image>
				<view style="overflow: hidden;">
					<view class="ft32">{{item.token_symbol}}</view>
					<view class="c_9397AF line-one">{{item.contract_addr}}</view>
				</view>
			</view>
			<image v-if="allContractAddress.includes(item.contract_addr)" src="../../static/image/jinzhi@2x.png" mode="" class="arrow" @tap="handleDelete(item)"></image>
			<image v-else src="../../static/image/add.png" mode="" class="arrow" @tap="handleAdd(item)"></image>
		</view>
		<scroll-view v-if="list.length > 0" @scrolltolower="handleBottom" class="scroll-box" scroll-y="true" :style="{'height': scrollHeight + 'px'}">
			<view class="list-item bg-white flex-between alcenter h120 plr40" v-for="(item, index) in list" :key="index">
				<view class="flex alcenter" style="width: 500rpx;">
					<image :src="`${config.imgUrl + item.active_logo}`" mode="" class="mr20"></image>
					<view style="overflow: hidden;">
						<view class="ft32">{{item.token_symbol}}</view>
						<view class="c_9397AF">{{item.contract_addr}}</view>
					</view>
				</view>
				<image v-if="allContractAddress.includes(item.contract_addr)" src="../../static/image/jinzhi@2x.png" mode="" class="arrow" @tap="handleDelete(item)"></image>
				<image v-else src="../../static/image/add.png" mode="" class="arrow" @tap="handleAdd(item)"></image>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import config from '@/config'
	import DB from "@/common/utils/sqlite.js";
	import { postTokenInfo, getDeviceInfo, updateCurrentWallet } from '@/common/utils';
	export default {
		data() {
			return {
				config,
				deviceId: '',
				token_name: '',
				hotList: [],
				page: 1,
				page_size: 10,
				hasMore: false,
				list: [],
				scrollHeight: 0,
				currentMainCoin: {}, //当前主链币
				allContractAddress: [],
				chain: ''
			};
		},
		onNavigationBarButtonTap() {
			uni.navigateBack()
		},
		onNavigationBarSearchInputChanged(e) {
			this.token_name = e.text
			if(!this.token_name) {
				this.list = []
			}else{
				this.page = 1
				this.loadData()
			}
		},
		onNavigationBarSearchInputConfirmed(e) {
			this.token_name = e.text
			if(!this.token_name) {
				this.list = []
			}else{
				this.page = 1
				this.loadData()
			}
		},
		async onLoad(options) {
			this.chain = options.chain
			// 获取设备信息
			const deviceInfo = await getDeviceInfo()
			this.deviceId = deviceInfo.device_id
			this.scrollHeight = uni.getSystemInfoSync().windowHeight
			this.loadHotList()
			this.setAllContractAddress()
		},
		methods: {
			//热门代币
			loadHotList() {
				this.$api.hot_token_list({
					chain: this.chain,
				}).then(res => {
					this.hotList = res.result
				})
			},
			loadData() {
				this.$api.sourch_add_token({
					chain: this.chain,
					token_name: this.token_name,
					page: this.page,
					page_size: this.page_size
				}).then(res => {
					if(!res.result || res.result.length < this.page_size) {
						this.hasMore = false
					}else{
						this.hasMore = true
					}
					if(this.page == 1) {
						this.list = res.result || []
					}else{
						this.list = this.list.concat(res.result || [])
					}
				})
			},
			handleBottom() {
				console.log('handleBottom')
				if(this.hasMore) {
					this.page += 1
					this.loadData()
				}else{
					
				}
			},
			setAllContractAddress(){
				this.currentMainCoin = uni.getStorageSync('currentWallet')
				this.allContractAddress = (this.currentMainCoin.token_list||[]).filter(item => {
					return item.contract_addr.length > 0
				}).map(item => {
					return item.contract_addr
				})
			},
			handleDelete({contract_addr, token_symbol}) {
				const { wallet_uuid, chain_id } = this.currentMainCoin;
				this.$api.delete_wallet_token({
					chain: this.chain,
					device_id: this.deviceId, // 设备ID
					wallet_uuid: wallet_uuid,
					symbol: token_symbol,
					contract_addr,
				}).then(res => {
					this.currentMainCoin.token_list = this.currentMainCoin.token_list.filter(item => {
						return item.contract_addr !== contract_addr
					})
					updateCurrentWallet(this.currentMainCoin).then(async ()=>{
						await DB.updateTableData('asset', `is_del = '1'`, "chain_id", chain_id, "contract_addr", contract_addr)
						this.setAllContractAddress()
					})
				})
			},
			handleAdd(item) {
				const { wallet_uuid, chain, wallet_name, address } = this.currentMainCoin
				postTokenInfo({
					chain,
					wallet_uuid,
					symbol: item.token_symbol,
					wallet_name,
					address,
					contract_addr: item.contract_addr,
					unit: item.unit,
					token_name: item.token_name
				},()=>{
					this.$api.getWalletBalance({
						device_id: this.deviceId,
						wallet_uuid,
						chain
					}).then(res => {
						let { token_list, asset_cny, asset_usd } = res.result
						this.currentMainCoin.token_list = token_list;
						this.currentMainCoin.asset_cny = asset_cny;
						this.currentMainCoin.asset_usd = asset_usd;
						updateCurrentWallet(this.currentMainCoin).then(async ()=>{
							this.setAllContractAddress()
						})
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F7F8FC;
	}
	.token-coin-container{
		.list-item{
			image{
				width: 88rpx;
				height: 88rpx;
				flex-shrink: 0;
			}
			.arrow{
				width: 44rpx;
				height: 44rpx;
				flex-shrink: 0;
			}
		}
		.hot-title{
			position: sticky;
			top: 0;
			left: 0;
			z-index: 20;
		}
		.scroll-box{
			position: fixed;
			top: 0;
			/* #ifdef H5 */
			top: 44px;
			/* #endif */
			left: 0;
			z-index: 20;
			background-color: #ffffff;
		}
	}
</style>
