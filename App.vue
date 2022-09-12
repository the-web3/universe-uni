<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import '@/common/common.css';
	
	page {
		color: #222222;
		font-size: 24rpx;
	}
	uni-checkbox .uni-checkbox-input {
		border-radius: 50%;
	}
</style>
