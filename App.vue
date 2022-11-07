<script>
	import DB from "@/common/utils/sqlite.js";
	import { CRYPTOCURRENCY_TYPE } from '@/common/constants';
	import { showToast } from "@/common/utils"
	export default {
		onLaunch: function() {
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
		  // 打开数据库
		  openSQL() {
		    // 这个是查询有没有打开数据库
		    let open = DB.isOpen()
		    console.log('数据库状态',open ? '开启' : '关闭')
		    if (!open) {
		      DB.openSqlite()
		        .then((res) => {
					console.log('数据库已打开')
					this.setTableData()
		        })
		        .catch((error) => {
		          console.log('数据库开启失败')
		        })
		    }else{
				this.setTableData()
			}
		  },
		  setTableData(){
			this.createTable('chain').then(res => {
				Object.keys(CRYPTOCURRENCY_TYPE).map((item) => {
					const { name, symbol, chain, img, activeImg, support } = CRYPTOCURRENCY_TYPE[item];
					let sql = `'${name}','${symbol}','${chain}','${img}','${activeImg}','${0}','${support}'`
					let condition = "'name', 'symbol', 'chain', 'logo', 'active_logo', 'is_del', 'support'"
					DB.insertTableData('chain', sql, condition)
					  .then((res) => {
						console.log('新增数据成功')
					  })
					  .catch((error) => {
						console.log('失败', error)
					  })
				})
			})
			this.createTable('wallet')
			this.createTable('asset')
			this.createTable('account')
			// DB.selectTableData('chain')
			// 	.then((res) => {
			// 	console.log('contact表数据',res)
			// 	})
			// 	.catch((error) => {
			// 	console.log('查询失败',error)
			// 	})
		  },
		  createTable(type){
			const TABLE_MAP = {
				//链表
				chain: '"id" INTEGER PRIMARY KEY AUTOINCREMENT, "name" varchar, "symbol" varchar, "chain" varchar, "logo" varchar, "active_logo" varchar, "is_del" int, "support" boolean',
				//钱包表
				wallet: '"id" INTEGER PRIMARY KEY AUTOINCREMENT, "chain_id" bigInt, "wallet_name" varchar, "device_id" varchar, "wallet_uuid" varchar, "mnemonic_code" varchar, "password" varchar, "balance" decimal, "asset_usd" decimal, "asset_cny" decimal, "has_sumbit" boolean, "is_del" int',
				// 资产表
				asset: '"id" INTEGER PRIMARY KEY AUTOINCREMENT, "wallet_id" bigInt, "logo" varchar, "name" varchar, "contract_addr" varchar, "unit" int, "balance" decimal, "asset_usd" decimal, "is_del" decimal',
				//账户表
				account: '"id" INTEGER PRIMARY KEY AUTOINCREMENT, "wallet_id" bigInt, "index" int, "address" varchar, "pub_key" varchar, "priv_key" varchar, "is_del" int',
			}
			return DB.createTable(type,TABLE_MAP[type])
			  .then((res) => {
				console.log(`创建${type}表成功`)
				return res
			  })
			  .catch((error) => {
				console.log(`创建${type}表失败`,error)
			    showToast(`创建${type}表失败`)
				return error
			})  
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
