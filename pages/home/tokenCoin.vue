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
				<image :src="`${config.imgUrl + item.icon}`" mode="" class="mr20"></image>
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
					<image :src="`${config.imgUrl + item.icon}`" mode="" class="mr20"></image>
					<view style="overflow: hidden;">
						<view class="ft32">{{item.token_symbol}}</view>
						<view class="c_9397AF">{{item.contract_addr}}</view>
					</view>
				</view>
				<image v-if="allContractAddress.includes(item.contract_addr)" src="../../static/image/jinzhi@2x.png" mode="" class="arrow" @tap="handleDelete(item.contract_addr)"></image>
				<image v-else src="../../static/image/add.png" mode="" class="arrow" @tap="handleAdd(item)"></image>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import config from '@/config'
	import { postWalletInfo, add_remove_token_list } from '@/common/utils';
	export default {
		data() {
			return {
				config,
				deviceId: 'c3c0268fa44293f2',
				token_name: '',
				hotList: [],
				page: 1,
				page_size: 10,
				hasMore: false,
				list: [],
				scrollHeight: 0,
				currentMainCoin: {}, //当前主链币
				allContractAddress: [],
				type: ''
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
			console.log(e.text)
			this.token_name = e.text
			if(!this.token_name) {
				this.list = []
			}else{
				this.page = 1
				this.loadData()
			}
		},
		onLoad(options) {
			this.type = options.type
			// 获取设备信息
			// #ifdef APP-PLUS
			plus.device.getInfo({
				success: (e) =>{
					this.deviceId = e.uuid
					console.log('getDeviceInfo success: '+JSON.stringify(e));
				},
				fail: (e) =>{
					console.log('getDeviceInfo failed: '+JSON.stringify(e));
				}
			});
			// #endif
			
			this.scrollHeight = uni.getSystemInfoSync().windowHeight
			this.loadHotList()
			this.currentMainCoin = uni.getStorageSync('currentWallet')
			this.setAllContractAddress()
		},
		methods: {
			//热门代币
			loadHotList() {
				this.$api.hot_token_list().then(res => {
					this.hotList = res.result
				})
			},
			loadData() {
				this.$api.sourch_add_token({
					token_name: this.token_name,
					page: this.page,
					page_size: this.page_size
				}).then(res => {
					console.log(res)
					if(!res.data.gds_lst || res.data.gds_lst.length < this.page_size) {
						this.hasMore = false
					}else{
						this.hasMore = true
					}
					if(this.page == 1) {
						this.list = res.data.gds_lst || []
					}else{
						this.list = this.list.concat(res.data.gds_lst || [])
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
				let allContractData = this.currentMainCoin.token_list.filter(item => {
					return item.contract_addr.length > 0 && item.wallet_name == this.currentMainCoin.wallet_name
				})
				this.allContractAddress = allContractData.map(item => {
					return item.contract_addr
				})
			},
			handleDelete({contract_addr}) {
				this.$api.delete_wallet_token({
					device_id: this.deviceId, // 设备ID
					wallet_uuid: this.currentMainCoin.uuid,
					contract_addr
				}).then(res => {
					this.currentMainCoin.token_list = this.currentMainCoin.token_list.filter(item => {
						return item.contract_addr !== contract_addr
					})
					add_remove_token_list(this.currentMainCoin)
					this.setAllContractAddress()
				})
			},
			handleAdd(item) {
				const { uuid, chain, wallet_name, address, private_key, mnemonic_code, password } = this.currentMainCoin
				postWalletInfo(this.type, {
					device_id: this.deviceId, // 设备ID
					uuid,// 钱包ID
					chain,// 链名称
					symbol: item.token_symbol,// 币种名称
					wallet_name,// 钱包名称
					address,// 地址
					private_key,// 私钥
					mnemonic_code,// 助记词编码
					password,// 密码
					icon: `${item.icon}`,// 图标
					contract_addr: item.contract_addr,// 合约地址(eth 空)
				}, { 
					in_token_list: true,
					callback: ()=>{
						this.$api.getWalletBalance({
							device_id: this.deviceId,
							wallet_uuid: this.currentMainCoin.uuid,
							chain: this.currentMainCoin.chain
						}).then(res => {
							let { token_list, total_asset_cny, total_asset_usd } = res.result;
							this.currentMainCoin.token_list = token_list;
							this.currentMainCoin.total_asset_cny = total_asset_cny;
							this.currentMainCoin.total_asset_usd = total_asset_usd;
							add_remove_token_list(this.currentMainCoin)
							this.setAllContractAddress()
						})
					}
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
