<template>
	<view class="wallet-detail-container plr40">
		<view class="detail-container flex alcenter pl20 pr30 mt40">
			<image v-if="currentWallet.token_list" :src="`${config.imgUrl}${currentWallet.token_list[0] ? currentWallet.token_list[0].logo:''}`"  mode="" class="coin-img mr30"></image>
			<view>
				<view class="flex alcenter">
					<view class="ft28">{{currentWallet.wallet_name}}</view>
					<image src="../../static/image/xiepinglun@2x.png" mode="" class="ml40" @tap="handleOpenEdit"></image>
				</view>
				<view class="flex alcenter">
					<view class="c_9397AF address line-one">{{currentWallet.address}}</view>
					<image src="../../static/image/fuzhi-2@2x.png" mode="" class="ml20" @tap="handleCopy(currentWallet.address)"></image>
				</view>
			</view>
		</view>
		<view v-if="currentWallet.mnemonic_code" class="list-item flex-between alcenter h80 mt40 mb40" @tap="handleOpenValidate(1)">
			<view class="ft32 c_black">导出助记词</view>
			<image src="../../static/image/arrow-right.png" mode=""></image>
		</view>
		<view v-if="currentWallet.privateKey" class="list-item flex-between alcenter h80 mt40 mb40" @tap="handleOpenValidate(2)">
			<view class="ft32 c_black">导出私钥</view>
			<image src="../../static/image/arrow-right.png" mode=""></image>
		</view>
		<navigator hover-class="none" url="./updatePassword" class="list-item flex-between alcenter h80 mt40 mb40">
			<view class="ft32 c_black">修改密码</view>
			<image src="../../static/image/arrow-right.png" mode=""></image>
		</navigator>
		<navigator hover-class="none" url="./resetPssword" class="list-item flex-between alcenter h80 mt40 mb40">
			<view class="ft32 c_black">重置密码</view>
			<image src="../../static/image/arrow-right.png" mode=""></image>
		</navigator>
		<button type="default" class="del-btn" @tap="handleDelete">删除钱包</button>
		<!-- 编辑钱包名称弹窗 -->
		<uni-popup ref="editPopup" type="center" :mask-click="false">
			<view class="edit-container flex-column alcenter flex-between pt40">
				<view class="ft36">设置钱包名称</view>
				<input type="text" v-model="tempName" placeholder="请输入钱包名称" placeholder-style="font-size: 30rpx;color: #A1A9B3" />
				<view class="flex alcenter bottom ft32">
					<view class="flex-one flex-center close" @tap="handleCloseEdit">关闭</view>
					<view class="flex-one flex-center" @tap="handeleSubmitEdit">确定</view>
				</view>
			</view>
		</uni-popup>
		<!-- 验证密码弹窗 -->
		<uni-popup ref="validatePopup" type="center" :mask-click="false">
			<view class="edit-container flex-column alcenter flex-between pt40">
				<view class="ft36">验证密码</view>
				<input password v-model="validatePassword" placeholder="输入钱包密码" placeholder-style="font-size: 30rpx;color: #A1A9B3" />
				<view class="flex alcenter bottom ft32">
					<view class="flex-one flex-center close" @tap="handleCloseValidate">关闭</view>
					<view class="flex-one flex-center" @tap="handeleSubmitValidate">确定</view>
				</view>
			</view>
		</uni-popup>
		<!-- 私钥弹窗 -->
		<uni-popup ref="keyPopup" type="center">
			<view class="key-container flex-column alcenter pt40 pb40 plr30">
				<view class="ft36">私钥</view>
				<view class="key mt20 mb20">{{currentWallet.privateKey}}</view>
				<view class="copy-btn flex-center" @tap="handleCopy(currentWallet.privateKey)">点击复制</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import config from '@/config'
	import { deleteWallet } from "@/common/utils"
	import { showToast, updateCurrentWallet, getDeviceInfo } from '@/common/utils';
	import { rules } from '@/common/utils/validation.js';
	export default {
		data() {
			return {
				config,
				walletName: '',
				tempName: '',
				validatePassword: '',
				currentWallet: {},
				exportType: '', //1 助记词 2 私钥
			};
		},
		async onLoad() {
			this.currentWalletInfo()
			// 获取设备信息
			const deviceInfo = await getDeviceInfo()
			this.deviceId = deviceInfo.device_id
},
		onShow(){
			this.currentWalletInfo()
		},
		methods: {
			async currentWalletInfo(){
				this.currentWallet = uni.getStorageSync('currentWallet')
			}, 
			handleCopy(data) {
				uni.setClipboardData({
					data: data,
					success: () => {
						uni.showToast({
							title: '复制成功'
						})
					}
				})
			},
			handleDelete() {
				uni.showModal({
				    title: '提示',
				    content: '确定删除该钱包吗',
				    success: (res) => {
				        if (res.confirm) {
							const { wallet_uuid, chain } = this.currentWallet
				            this.$api.delete_wallet({
								device_id: this.deviceId,
								wallet_uuid,
								chain
							}).then( async (res) => {
								if(res.ok){
									this.currentWallet = await deleteWallet(this.currentWallet)
									uni.navigateBack()
								}else{
									showToast('删除失败')
								}
								
							})
				        } else if (res.cancel) {
				            
				        }
				    }
				});
			},
			handleOpenEdit() {
				this.$refs.editPopup.open()
				this.tempName = this.currentWallet.wallet_name
			},
			handleCloseEdit() {
				this.walletName = ''
				this.$refs.editPopup.close()
			},
			handeleSubmitEdit() {
				if(!rules.walletName.isVaild(this.tempName)){
					showToast(rules.walletName.message)
					return
				}
				this.$api.update_wallet_name({
					device_id: this.currentWallet.device_id,
					wallet_uuid: this.currentWallet.wallet_uuid,
					wallet_name: this.tempName
				}).then((res) => {
					if(res.ok){
						this.currentWallet.wallet_name = this.tempName;
						this.tempName = ''
						updateCurrentWallet(this.currentWallet).then(()=>{
							this.$refs.editPopup.close()
						}).catch(()=>{
							showToast('修改钱包名称失败, 请稍后再试')
						})
					}
				})
			},
			handleOpenValidate(exportType) {
				this.exportType = exportType
				this.$refs.validatePopup.open()
			},
			handleCloseValidate() {
				this.validatePassword = ''
				this.$refs.validatePopup.close()
			},
			handeleSubmitValidate() {
				if(this.validatePassword.length == 0) {
					return this.$alert('请输入密码')
				}else if(this.validatePassword != this.currentWallet.password){
					return this.$alert('密码错误')
				}else{
					this.$refs.validatePopup.close()
					this.validatePassword = ''
					if(this.exportType == 1) {
						uni.navigateTo({
							url: './exportWord'
						})
					}else{
						this.$refs.keyPopup.open()
					}
				}
			},
		}
	}
</script>

<style lang="scss">
	.wallet-detail-container{
		.detail-container{
			height: 160rpx;
			box-shadow: 0rpx 20rpx 20rpx 0rpx rgba(76, 110, 245, 0.1);
			border-radius: 20rpx;
			image{
				width: 24rpx;
				height: 24rpx;
			}
			.coin-img{
				min-width: 80rpx;
				height: 80rpx;
			}
			.address{
				max-width: 460rpx;
			}
		}
		.list-item{
			image{
				width: 44rpx;
				height: 44rpx;
			}
		}
		.del-btn{
			position: fixed;
			bottom: 58rpx;
			left: 30rpx;
			width: 686rpx;
			height: 96rpx;
			line-height: 96rpx;
			font-size: 32rpx;
			color: #E02020;
			background: #F3F3F4;
			border-radius: 20rpx;
			&:after{
				border: none;
			}
		}
		.edit-container{
			width: 600rpx;
			height: 320rpx;
			background: #FFFFFF;
			border-radius: 16rpx;
			box-sizing: border-box;
			input{
				width: 536rpx;
				height: 74rpx;
				background: #F2F2F4;
				border-radius: 36rpx;
				padding-left: 36rpx;
				box-sizing: border-box;
			}
			.bottom{
				width: 100%;
				height: 99rpx;
				color: #056EF7;
				border-top: 1rpx solid #EBEBED;
				view{
					height: 100%;
				}
				.close{
					color: #A1A9B3;
					border-right: 1rpx solid #EBEBED;
				}
			}
		}
		.key-container{
			width: 600rpx;
			background: #FFFFFF;
			border-radius: 16rpx;
			box-sizing: border-box;
			.key{
				word-break: break-word;
			}
			image{
				width: 44rpx;
				height: 44rpx;
			}
			.copy-btn{
				width: 300rpx;
				line-height: 60rpx;
				height: 60rpx;
				font-size: 28rpx;
				color: #ffffff;
				background: #4C6EF5;
				box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(76, 110, 245, 0.5);
				border-radius: 20rpx;
			}
		}
	}
</style>
