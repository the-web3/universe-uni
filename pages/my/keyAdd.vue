<template>
	<view class="import-wallet-container">
		<uni-nav-bar statusBar fixed left-icon="back" title="私钥导入" @clickLeft="goBack" @clickRight="handleRight">
			<view slot="right" class="flex-column flex-center">
				<image src="../../static/image/scan.png" mode="" class="nav-img"></image>
			</view>
		</uni-nav-bar>
		<textarea class="text-area ft26" v-model="privateKey" placeholder="输入明文私钥或扫描二维码，请注意大小写" placeholder-style="font-size: 26rpx;color: #9397AF;"/>
		<view class="form-item">
			<view class="ft32 mb20">设置身份钱包名</view>
			<input class="h60 ft26" type="text" v-model="walletName" placeholder="请输入名称" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<view class="form-item">
			<view class="ft32 mb20">设置密码</view>
			<input class="h60 ft26" password v-model="password" placeholder="密码不少于8位数" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<view class="form-item">
			<view class="ft32 mb20">确认密码</view>
			<input class="h60 ft26" password v-model="confirmPassword" placeholder="密码不少于8位数" placeholder-style="font-size: 26rpx;color: #9397AF;" />
		</view>
		<view class="flex alcenter pl40 mt40">
			<checkbox value="cb" :checked="checked" color="#94A9FF" @tap="handleCheck" style="border-radius: 50%;"/>
			<view>我已阅读并同意</view>
			<text class="c_4C6EF5">《用户协议》</text>
			<view>以及</view>
			<text class="c_4C6EF5">《隐私政策》</text>
		</view>
		<button type="default" class="create-btn" :class="{'active': isActive}" @tap="handleSave">导入钱包</button>
	</view>
</template>

<script>
	import * as address from '@/common/word/address';
	export default {
		data() {
			return {
				walletName: '',
				password: '',
				confirmPassword: '',
				checked: false,
				privateKey: '',
				address: '',
				deviceId: ''
			};
		},
		computed: {
			isActive() {
				return this.privateKey && this.walletName && this.password.length >= 8 && this.password == this.confirmPassword && this.checked
			}
		},
		onLoad() {
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
		},
		methods: {
			handleCheck() {
				this.checked = !this.checked
			},
			goBack() {
				uni.navigateBack()
			},
			handleRight() {
				// uni.scanCode({
				// 	success: (res) => {
						
				// 	}
				// })
			},
			async handleSave() {
				if(!this.isActive) return 
				try {
					var addr_pk = await address.CreateEthAddressByPk(this.privateKey)
					console.log(addr_pk)
					this.address = addr_pk.address
					
					let allWalletData = uni.getStorageSync('walletData')
					let ethData = {}
					let otherData = []
					if(allWalletData) {
						ethData = allWalletData.filter(item => {
							return item.type == 'ETH'
						})
						ethData ? ethData : [
							{
								type: 'ETH',
								list: []
							}
						],
						otherData = allWalletData.filter(item => {
							return item.type != 'ETH'
						})
						otherData ? otherData : []
					}else{
						allWalletData = []
						ethData = [
							{
								type: 'ETH',
								list: []
							}
						]
					}
					console.log(allWalletData, ethData)
					let uuid = Math.random().toString(36).substr(-10)
					let walletData = {
						device_id: this.deviceId, // 设备ID
						uuid: uuid,// 钱包ID
						chain_name: 'Ethereum',// 链名称
						asset_name: 'ETH',// 币种名称
						wallt_name: this.walletName,// 钱包名称
						address: this.address,// 地址
						private_key: this.privateKey,// 私钥
						mnemonic_code: '',// 助记词编码
						password: this.password,// 密码
						icon: '/static/image/ETH@2x.png',// 图标
						contract_address: '',// 合约地址
						balance: 0,// 余额
						cny_price: 0, //人民币
						usdt_price: 0,// 折合成 USDT
						del: 0, //是否删除 0：正常；1:删除
						hasSubmit: false
					}
					this.$api.submitWalletInfo({
						"device_id": this.deviceId,
						"wallet_uuid": uuid,
						"asset_name": "ETH",
						 "wallet_name": this.walletName,
						"chain_name": "Ethereum",
						"address": this.address,
						"contract_addr": "",
						"word_code": '',
						"private_key": this.privateKey
					}).then(res => {
						console.log(res)
						walletData.hasSubmit = true
						this.$api.getAddressBalance({
							"device_id": this.deviceId,
							"wallet_uuid": uuid,
							"asset_name": "ETH",
							"wallet_name": this.walletName,
							"chain_name": "Ethereum",
							"address": this.address,
							"contract_addr": ""
						}).then(res => {
							walletData.balance = res.data.balance
							walletData.cny_price = res.data.cny_price
							walletData.usdt_price = res.data.usdt_price
							ethData[0].list.push(walletData)
							uni.setStorageSync('walletData', [].concat(otherData).concat(ethData))
							uni.reLaunch({
								url: '/pages/home/home'
							})
						})
					})
				}catch(error) {
					console.log(error)
					return this.$alert('无效私钥')
				}
			}
		}
	}
</script>

<style lang="scss">
	.import-wallet-container{
		.nav-img{
			width: 44rpx;
			height: 44rpx;
		}
		.text-area{
			margin: 34rpx 24rpx 0 38rpx;
			width: 670rpx;
			height: 180rpx;
			padding: 24rpx 18rpx;
			background: #F8F8F7;
			border-radius: 20rpx;
			border: 1rpx solid #D9DDE1;
			box-sizing: border-box;
		}
		.form-item{
			padding: 34rpx 24rpx 0 38rpx;
			input{
				border-bottom: 1rpx solid #EBEBED;
			}
		}
		.create-btn{
			position: fixed;
			bottom: 160rpx;
			left: 30rpx;
			width: 686rpx;
			height: 96rpx;
			line-height: 96rpx;
			font-size: 32rpx;
			color: #ffffff;
			background: #94A9FF;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(76, 110, 245, 0.5);
			border-radius: 20rpx;
			&.active{
				background: #4C6EF5;
			}
			&:after{
				border: none;
			}
		}
	}
</style>
