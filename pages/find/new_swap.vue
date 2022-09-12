<!-- <template>
	<view>
		<web-view src="https://app.uniswap.org/#/swap"></web-view>
	</view>
</template>

<script>
	var wv;
	import { TrustWeb3Provider } from '@/common/dapp/hook.js'
	 export default {
		data() {
			return {
				windowInfo: null
			};
		},
		mounted() {
			this.dappProvider()
		},
	
		onLoad(options) {
			
		},
		
		onPullDownRefresh() {
			
		},
	
		onReachBottom() {
			
		},
		
		methods: {					
			dappProvider() {
				const trustwallet = window.trustwallet;
				var config = {
					chainId: 1,
					rpcUrl: "https://mainnet.infura.io/v3/b48b6387e66d4f3497245873747f6e4d",
					isDebug: true
				};
				window.ethereum = new trustwallet.Provider(config);
				window.web3 = new trustwallet.Web3(window.ethereum);
				const addresses = "0xcaaf133b00d04b964798f6aa040b445263b458b0";		
				ethereum.setAddress(addresses);
				WebView.window.ethereum = window.ethereum
				WebView.window.web3 = window.web3
				console.log("web3.currentProvider.constructor.name====", web3.currentProvider.constructor.name)
				web3.eth.getAccounts((error, accounts) => {
					console.log("accounts====", accounts)
				});
				
				ethereum.request({ method: "eth_accounts" }).then((accounts) => {
					console.log("accounts====", accounts)
				});
				
				// window.web3.currentProvider.sendAsync(
				//   { method: "eth_accounts" },
				//   (error, data) => {
				// 	  console.log("data.result====", data.result)
				//   }
				// );
				
				const currentAddress = "0xcaaf133b00d04b964798f6aa040b445263b458b0";
				ethereum.on('accountsChanged', (accounts) => {
					console.log("change account ===", accounts)
				});
				ethereum.onekeyChangeAddress(currentAddress);
			}
		}
	}
</script>


<style lang="scss">

</style>
 -->