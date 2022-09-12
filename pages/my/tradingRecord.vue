<template>
	<mescroll-uni :fixed="false" top="0" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" @init="mescrollInit">
		<!-- 数据列表 -->
		<view class="ft32 flex alcenter h120 plr40">交易记录</view>
		<view class="list-item flex-between alcenter h80 plr40" v-for="(itme, index) in list" :key="index">
			<view class="flex alcenter">
				<!-- <image src="../../static/image/btc.png" mode="" class="mr40"></image> -->
				<image src="../../static/image/deng@2x.png" mode="" class="mr40"></image>
				<!-- <image src="../../static/image/transfer.png" mode="" class="mr40"></image> -->
				<view>
					<view class="ft36">转账</view>
					<view class="c_9397AF">dizhi827jsi</view>
				</view>
			</view>
			<view>
				<view class="ft36" style="text-align: right;">0.89</view>
				<view class="c_9397AF">2021-09-12</view>
			</view>
		</view>
	</mescroll-uni>
</template>

<script>
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	export default {
		components: {
			MescrollUni
		},
		data() {
			return {
				mescroll: null, //mescroll实例对象
				downOption:{
					use: true,
					auto:false, // 不自动加载
				},
				upOption:{
					auto:true, // 不自动加载
					noMoreSize: 4, 
					empty:{
						tip: '~ 空空如也 ~'
					}
				},
				list: []
			};
		},
		methods: {
			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			/*下拉刷新的回调 */
			downCallback(mescroll) {
				mescroll.resetUpScroll()
			},
			/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
			upCallback(mescroll) {
				//联网加载数据
				this.getListDataFromNet(mescroll.num, mescroll.size, (curPageData)=>{
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					mescroll.endSuccess(curPageData.length);
					//设置列表数据
					if(mescroll.num == 1) this.list = []; //如果是第一页需手动制空列表
					this.list = this.list.concat(curPageData); //追加新数据
				}, () => {
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				})
			},
			getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
				successCallback && successCallback(new Array(10).fill(0));
				// this.$api.homeDownData({
				// 	page: pageNum,
				// 	page_size: pageSize,
				// 	index_cat_id: this.i
				// }).then(res => {
				// 	successCallback && successCallback(res.data.gds_lst);
				// }).catch(err => {
				// 	errorCallback && errorCallback();
				// })
			}
		}
	}
</script>

<style lang="scss">
	.list-item{
		margin-bottom: 70rpx;
		image{
			width: 80rpx;
			height: 80rpx;
		}
	}
</style>
