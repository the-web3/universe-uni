import { INIT_WALLET, INIT_ACCOUNT } from '@/common/constants';
import { getChainInfo } from '@/common/utils/sqliteFun.js';
import DB from "@/common/utils/sqlite.js";
import * as base from '@/common/wallet';
import api from '@/api';

export const postWalletInfo = async (param) => {
 //    const {type, words, wallet_name, password} = param;
 //    const { chain, symbol, active_logo, id } = await getChainInfo(type)
 //    const word_vld = await base.ValidateMnemonic(words, "english")
 //    if(!word_vld) {
 //        return showToast('助记词无效')
 //    }
 //    //助记词编码
 //    const mnemonic_code = await base.EncodeMnemonic(words, "english")
 //    //助记词生成地址
 //    const seedHex = await base.MnemonicToSeed(words, "")
 //    const addrs = await base.CreateAddress({
 //        seedHex, 
 //        chain, 
 //        index: 0
 //    }, 0)
 //    // this.address = addrs.address
 //    // this.privateKey = addrs.privateKey
 //    const wallet_uuid = Math.random().toString(36).substr(-10)
	// const walletInfo = {
	// 	chain_id: id,//chain的ID
 //        device_id: '', // 设备ID
 //        wallet_name,// 钱包名称
 //        wallet_uuid,// 钱包ID
 //        mnemonic_code: Encrypt(mnemonic_code, password),// 助记词编码
 //        password,// 密码
 //        balance: 0,// 余额
 //        asset_usd: 0,  //资产usd
 //        asset_cny: 0, //资产人民币
 //        has_submit: false, //是否提交
 //        is_del: 0, //是否删除 0：正常；1:删除
	// }

	// const sql = `'${Object.values(walletInfo||[]).join("','")}'`
	// const condition = `'${Object.keys(walletInfo||[]).join("','")}'`
	// console.log(11111, walletInfo)
	// try{
	// await DB.insertTableData('wallet', sql , condition)
	//   .then((res) => {
	// 	console.log('wallet数据成功', res)
	//   })
	//   .catch((error) => {
	// 	console.log('wallet数据失败', error)
	//   })
	// }catch(e){
	// 	console.log(2222,e)
	// }
	// console.log(11111, accountInfo, walletInfo)
	// const [newWalletInfo] =  await DB.selectTableData('wallet', "wallet_uuid", wallet_uuid)
	// const accountInfo = formatInitObj(INIT_ACCOUNT, {
	// 	wallet_id: newWalletInfo.id,
	// 	address,
	// 	private_key: Encrypt(private_key, password),
	// });
	// console.log(11111, accountInfo, walletInfo)
	// await DB.insertTableData('account', `'${Object.values(accountInfo||[]).join("','")}'`, `'${Object.keys(accountInfo||[]).join("','")}'`)
	//   .then((res) => {
	// 	console.log('account数据成功')
	//   })
	//   .catch((error) => {
	// 	console.log('account数据失败', error)
	//   })
	
	// const [newAccountInfo] = await DB.selectTableData('account', "address", address)
	// console.log(22222, newAccountInfo)










    // uni.showLoading({
    //     title: '提交中',
    //     mask: true
    // })

    // api.submitWalletInfo({
    //     chain,
    //     symbol,
    //     network: "mainnet",
    //     device_id,
    //     wallet_uuid: uuid,
    //     wallet_name,
    //     address,
    // }).then(res => {
    //     currentWalletInfo.hasSubmit = true
    //     api.getAddressBalance({
    //         chain,
    //         symbol,
    //         network: "mainnet",
    //         address,
    //     }).then(res => {
    //         uni.hideLoading()
    //         if(!other || !other.in_token_list){
    //             currentWalletInfo.balance = res.result.balance
    //             currentWalletInfo.cny_price = res.result.cny_price
    //             currentWalletInfo.usdt_price = res.result.usdt_price
    //             currentWallet[0].list.push(currentWalletInfo)
    //             const currentWalletIndex = walletsList.findIndex(item=> item.type === type);
    //             const newWalletsList = currentWalletIndex !== -1 ? walletsList.map(item=> {
    //                 if(item.type === type ){
    //                     return currentWallet[0]
    //                 }else{
    //                     return item
    //                 }
    //             }) : [...walletsList,...currentWallet];
    //             uni.setStorageSync('currentWallet', currentWalletInfo)
    //             uni.setStorageSync('walletData', newWalletsList)
    //             uni.reLaunch({
    //                 url: '/pages/home/home'
    //             })
    //         }
    //         if(other && other.callback){
    //             other.callback()
    //         }
    //     }).catch(() => {
    //         uni.hideLoading()
    //     })
    // }).catch(() => {
    //     uni.hideLoading()
    // })
}
export const add_remove_token_list = (currentWallet) =>{
    let allWalletData = getAllWalletData();
    allWalletData = allWalletData.map(item=> {
        if(item.type === currentWallet.type){
            item.list = item.list.map(listItem =>{
                if(listItem.uuid === currentWallet.uuid){
                    listItem = currentWallet
                }
                return listItem
            })
        }
        return item
    })
    uni.setStorageSync('currentWallet', currentWallet)
    uni.setStorageSync('walletData', allWalletData)
}
export const showToast = (str) => {
	uni.showToast({
	  icon: 'none',
	  title: str,
	  mask: true
	})
}
export const formatInitObj = (initObj, dataObj) =>{
	const walletInfo = Object.keys(initObj).reduce((total, item)=>{
		total[item] = dataObj[item] || initObj[item]
		return total
	},{})
	return walletInfo
}
