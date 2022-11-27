<script>
	import DB from "@/common/utils/sqlite.js";
	import { CHAIN_LIST } from '@/common/constants';
	import { createTable } from "@/common/utils/sqliteFun.js"
	
	export default {
		onLaunch: async function() {
			console.log('App Launch')
			// #ifdef APP-PLUS
			this.openSQL()
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
		  openSQL() {
		    let open = DB.isOpen()
		    if (!open) {
		      DB.openSqlite()
		        .then((res) => {
					console.log('数据库已打开', res)
					this.setTableData()
		        })
		        .catch((error) => {
		          console.log('数据库开启失败', error)
		        })
		    }else{
				this.setTableData()
			}
		  },
		  async setTableData(){
			// this.resetInfo()
			createTable('chain').then(res => {
				CHAIN_LIST.map((item) => {
					DB.insertOrReplaceData('chain', `'${Object.values(item||[]).join("','")}'` , `'${Object.keys(item||[]).join("','")}'`)
					  .then((res2) => {
						console.log('新增数据成功', res2)
					  })
					  .catch((error) => {
						console.log('失败', error)
					  })
				})
				
			})
			createTable('asset')
			createTable('wallet')
			createTable('account')
			createTable('walletAsset')
			createTable('accountAsset')
		  },
		  async resetInfo(){
			DB.dropTable('chain')
			DB.dropTable('asset')
			DB.dropTable('wallet')
			DB.dropTable('account')
			DB.dropTable('walletAsset')
			DB.dropTable('accountAsset')
			uni.setStorageSync('currentWallet',{})
			uni.setStorageSync('walletData',{})
		  }
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
