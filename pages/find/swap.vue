<template>
 <view>
 </view>
</template>


<script>
 var wv;
 
 import { Web3, TrustWeb3Provider } from '@/common/dapp/hook.js'
  
  export default {
  data() {
	   return {
			windowInfo: null
	   };
  },
  props: {
		devinfo: {
			type: Object,
			default: function(){
				return {};
			}
		},
		cmuid: {
			type: Number,
			default: 0
		}
	},

  mounted() {
	uni.getSystemInfo({
		success: (res)=> {
		  this.windowInfo = res;
		  this.createWvAndLoadUrl("https://uniswap.tokenpocket.pro/?utm_source=tokenpocket#/swap");
		}
    });
  },
  
  beforeDestroy() {
		//关闭webview对象
		if(wv){
			wv.close()
			//wv.hide()
		}
	},
  onLoad(options) {
  
  },
  
  onPullDownRefresh() {
   
  },
 
  onReachBottom() {
   
  },
  
  methods: {
	   createWvAndLoadUrl(url){
		   // #ifdef APP-PLUS
				console.log("url=====", url)
				wv = plus.webview.create(url, "webview",{
					plusrequire: "none", 
					top: this.windowInfo.statusBarHeight + 20, 
					scalable: true,
					height: this.windowInfo.windowHeight - this.windowInfo.statusBarHeight - 20
				})
				console.log("wvwvwvwvwv===", wv)
				wv.addEventListener('loading', () => {
					console.log("enter ..........")
					// var config = {
					// 	chainId: 1,
					// 	rpcUrl: "https://mainnet.infura.io/v3/b48b6387e66d4f3497245873747f6e4d",
					// 	isDebug: true
					// };
					// console.log("enter ....11111......")
					// // window.ethereum = new TrustWeb3Provider(config);
					// web3 = new Web3(window.ethereum);
					wv.evalJS("window.aaa = 1");  
					console.log("enter ....22222222......")
					
					// const addresses = "0xcaaf133b00d04b964798f6aa040b445263b458b0";		
					// ethereum.setAddress(addresses);
					// WebView.window.ethereum = window.ethereum
					// WebView.window.web3 = window.web3
					// console.log("web3.currentProvider.constructor.name====", web3.currentProvider.constructor.name)
					// web3.eth.getAccounts((error, accounts) => {
					// 	console.log("accounts====", accounts)
					// });
					
					// ethereum.request({ method: "eth_accounts" }).then((accounts) => {
					// 	console.log("accounts====", accounts)
					// });
					
					// // window.web3.currentProvider.sendAsync(
					// //   { method: "eth_accounts" },
					// //   (error, data) => {
					// // 	  console.log("data.result====", data.result)
					// //   }
					// // );
					// const currentAddress = "0xcaaf133b00d04b964798f6aa040b445263b458b0";
					// ethereum.on('accountsChanged', (accounts) => {
					// 	console.log("change account ===", accounts)
					// });
					// ethereum.onekeyChangeAddress(currentAddress);
				}, false);
				wv.addEventListener('loaded', () => {
					console.log("loadedloadedloadedloadedloaded")
					wv.appendJsFile('alert("aaaaaaaaa")')
					
					// var config = {
					// 	chainId: 1,
					// 	rpcUrl: "https://mainnet.infura.io/v3/b48b6387e66d4f3497245873747f6e4d",
					// 	isDebug: true
					// };
					// window.ethereum = new TrustWeb3Provider(config);
					// window.web3 = new Web3(window.ethereum);
					// const addresses = "0xcaaf133b00d04b964798f6aa040b445263b458b0";		
					// ethereum.setAddress(addresses);
					// WebView.window.ethereum = window.ethereum
					// WebView.window.web3 = window.web3
					// console.log("web3.currentProvider.constructor.name====", web3.currentProvider.constructor.name)
					// web3.eth.getAccounts((error, accounts) => {
					// 	console.log("accounts====", accounts)
					// });
					
					// ethereum.request({ method: "eth_accounts" }).then((accounts) => {
					// 	console.log("accounts====", accounts)
					// });
					
					// // window.web3.currentProvider.sendAsync(
					// //   { method: "eth_accounts" },
					// //   (error, data) => {
					// // 	  console.log("data.result====", data.result)
					// //   }
					// // );
					
					// const currentAddress = "0xcaaf133b00d04b964798f6aa040b445263b458b0";
					// ethereum.on('accountsChanged', (accounts) => {
					// 	console.log("change account ===", accounts)
					// });
					// ethereum.onekeyChangeAddress(currentAddress);
				}, false);
				var currentWebview = this.$scope.$getAppWebview(); //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效，非v3编译模式使用this.$mp.page.$getAppWebview()
				currentWebview.append(wv);
			// #endif
		 }
    }
 }
</script>

<style lang="scss">
</style>