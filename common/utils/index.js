import { CHAIN_LIST } from '@/common/constants';
import { insertOrReplaceTableData } from '@/common/utils/sqliteFun.js';
import DB from "@/common/utils/sqlite.js";
import * as base from '@/common/wallet';
import { v4 as uuidv4 } from 'uuid';
import api from '@/api';


export const postWalletInfo = async (param) => {
    const { chain_name, words, wallet_name, password, contract_addr="", index = 0, unit = "6" } = param;
    const { chain, symbol, logo, active_logo, id } = CHAIN_LIST.filter(item=> item.name === chain_name)[0];
    const walletList =  await DB.selectTableData('wallet', "chain_id", id)
    for(let item of walletList){
        const { mnemonic_code, password} = item
        const curWords =  await base.DecodeMnemonic({encrytMnemonic: base.AesDecrypt(mnemonic_code, password), language:"english"})
        if(curWords === words){
            return showToast('当前链已存在此助记词钱包')
        }
    }
    const { device_id } = await getDeviceInfo()
    const word_vld = await base.ValidateMnemonic({mnemonic: words,language:"english"})
    if(!word_vld) {
        return showToast('助记词无效')
    }
    //助记词编码
    const mnemonic_code = await base.EncodeMnemonic({mnemonic: words,language:"english"})

    //助记词生成地址
    const seedHex = await base.MnemonicToSeed({mnemonic: words, password})
    const addrs = await base.CreateAddress({
        seedHex, 
        chain: chain.toLowerCase(), 
        index
    }, 0)
    const {address, privateKey, publicKey} = JSON.parse(addrs||'')

    const wallet_uuid = uuidv4()

    const walletInfo = {
        chain_id: id,//chain的ID
        wallet_name,// 钱包名称
        device_id, // 设备ID
        wallet_uuid,// 钱包ID
        mnemonic_code: base.AesEncrypt(mnemonic_code, password),// 助记词编码
        password,// 密码
        asset_usd: 0,  //资产usd
        asset_cny: 0, //资产人民币
        has_submit: 0, //是否提交
        is_del: 0, //是否删除 0：正常；1:删除
    }
    let isConnected = false
    await uni.getNetworkType({
        success: res => {
            if (res.networkType == 'none') {
                isConnected = false
            } else {
                isConnected = true
            }
        }
    });
    uni.showLoading({
        title: '提交中',
        mask: true
    })
    let submitWalletRes = null;
    let submitAddressRes = null;
    try {
        // submit wallet or asset info
        submitWalletRes = await api.submitWalletInfo({
            chain,
            symbol,
            network: "mainnet",
            device_id,
            wallet_uuid,
            wallet_name,
            index,
            address,
            contract_addr
        })
        walletInfo.has_submit = 1
        //get wallet or asset balance
        submitAddressRes = await api.getAddressBalance({
            chain,
            symbol,
            network: "mainnet",
            address,
            wallet_uuid,
            device_id,
            contract_addr
        })
    } finally {
        const { balance = '0.000000', asset_cny = '0.000000', asset_usd = '0.000000' } = submitAddressRes?.result || {}
        // walletInfo.balance = balance
        walletInfo.asset_cny  = asset_cny
        walletInfo.asset_usd = asset_usd
        //insert asset table
        let [ assetInfo = {} ] =  await DB.selectTableData('asset', "chain_id", id, "contract_addr", contract_addr)
        if( JSON.stringify(assetInfo) === '{}'){
            insertOrReplaceTableData('asset', {
                chain_id: id,//链ID
                name: chain_name,//资产名称=>主币的名字
                logo: logo,//币Logo
                active_logo: active_logo,//币Logo
                contract_addr,//合约地址
                unit,//精度
                is_del: 0,//状态 0正常 1删除
            })
            const newAssetList =  await DB.selectTableData('asset', "name", chain_name, "contract_addr", contract_addr)
            assetInfo = newAssetList[newAssetList.length-1]
        }
        // console.log('asset success', assetInfo)
        //insert wallet table
        insertOrReplaceTableData('wallet', walletInfo)
        const [newWalletInfo = {}] =  await DB.selectTableData('wallet', "wallet_uuid", wallet_uuid)
        // console.log('wallet success', newWalletInfo)
        //insert walletAsset table
        insertOrReplaceTableData('walletAsset', {
            wallet_id: newWalletInfo.id, //钱包ID
            asset_id:  assetInfo.id,//资产ID
            balance:  balance,//余额
            asset_usd:  asset_usd,//USD 资产
            asset_cny:  asset_cny,//CNY 资产
            is_del:  0,//状态 0正常 1删除
        })
        // console.log('walletAsset success')
        //insert account table
        await insertOrReplaceTableData('account', {
            wallet_id: newWalletInfo.id, //钱包ID
            index,//Bip地址索引
            address,//地址
            pub_key: publicKey,//公钥
            priv_key: base.AesEncrypt(privateKey, password),//加密的私钥
            is_del: 0, //删除
        })
        //insert accountAsset table
        const [newAccountInfo = {}] =  await DB.selectTableData('account', "address", address)
        // console.log('account success', newAccountInfo)
        insertOrReplaceTableData('accountAsset', {
            address_id:  newAccountInfo.id,//账户ID
            asset_id:  assetInfo.id,//资产ID
            balance:  balance,//余额
            asset_usd:  asset_usd,//USD 资产
            asset_cny: asset_cny,//CNY 资产
            is_del:  0,//状态 0正常 1删除
        })
        const currentWallet= {
            ...walletInfo,
            logo,
            chain,
            address,
            publicKey,
            privateKey,
            token_list:[]
        }
        uni.setStorageSync('currentWallet',currentWallet)
        const historyWalletList = uni.getStorageSync('walletData') || {};
        historyWalletList[id] = [
            ...historyWalletList[id]||[],
            currentWallet
        ] 
        uni.setStorageSync('walletData',historyWalletList)
        uni.reLaunch({
            url: '/pages/home/home'
        })
        uni.hideLoading()
    }
}
export const postTokenInfo = async (param,callback) => {
    const { chain, token_name, wallet_uuid, wallet_name, symbol, address, contract_addr="", index = 0, unit = "6" } = param;
    const { logo, active_logo, id } = CHAIN_LIST.filter(item=> item.chain === chain)[0];
    const { device_id } = await getDeviceInfo()
    uni.showLoading({
        title: '提交中',
        mask: true
    })
    // submit wallet or asset info
    api.submitWalletInfo({
        chain,
        symbol,
        network: "mainnet",
        device_id,
        wallet_uuid,
        wallet_name,
        index,
        address,
        contract_addr
    }).then(res => {
        //get wallet or asset balance
        api.getAddressBalance({
            chain,
            symbol,
            network: "mainnet",
            address,
            wallet_uuid,
            device_id,
            contract_addr
        }).then(async (res) => {
            uni.hideLoading()
            const { balance, asset_cny, asset_usd } = res.result
            let [ assetInfo = {} ] =  await DB.selectTableData('asset', "chain_id", id, "contract_addr", contract_addr)
            if( JSON.stringify(assetInfo) === '{}'){
                //insert asset table
                await insertOrReplaceTableData('asset', {
                    chain_id: id,//链ID
                    name: token_name,//资产名称=>代币的名字
                    logo: logo,//币Logo
                    active_logo: active_logo,//币Logo
                    contract_addr,//合约地址
                    unit,//精度
                    is_del: 0,//状态 0正常 1删除
                })
                const newAssetList =  await DB.selectTableData('asset', "name", token_name, 'contract_addr', contract_addr)
                assetInfo = newAssetList[newAssetList.length-1]
            }else{
                await DB.updateTableData('asset', `is_del = '0'`, "chain_id", id, "contract_addr", contract_addr)
            }
            // console.log('asset success', assetInfo)
			const [newWalletInfo = {}] =  await DB.selectTableData('wallet', "wallet_uuid", wallet_uuid)
            // console.log('wallet success', newWalletInfo)
            //insert walletAsset table
            const walletAssetInsert = await insertOrReplaceTableData('walletAsset', {
                wallet_id: newWalletInfo.id, //钱包ID
                asset_id:  assetInfo.id,//资产ID
                balance:  balance,//余额
                asset_usd:  asset_usd,//USD 资产
                asset_cny:  asset_cny,//CNY 资产
                is_del:  0,//状态 0正常 1删除
            })
            // console.log(456, walletAssetInsert)
            if( assetInfo && walletAssetInsert && callback){
                callback()
            }
        }).catch(() => {
            uni.hideLoading()
        })
    }).catch(() => {
        uni.hideLoading()
    })
}
export const updateCurrentWallet = async (currentWallet) =>{
    // update wallet
    const {chain_id, asset_usd, asset_cny, password, wallet_name, has_submit} = currentWallet;
    let res  = await DB.updateTableData('wallet', `asset_usd = '${asset_usd}',asset_cny = '${asset_cny}',password = '${password}',wallet_name = '${wallet_name}',has_submit = '${has_submit}'`, "chain_id", chain_id)
    if(res){
        uni.setStorageSync('currentWallet', currentWallet)
        const allWalletData = uni.getStorageSync('walletData') || {};
        const currentChainWalletList = allWalletData[chain_id] ||[];
        for(let i in currentChainWalletList){
            if(currentChainWalletList[i].wallet_uuid === currentWallet.wallet_uuid){
                currentChainWalletList[i] = currentWallet
                break;
            }
        }
        uni.setStorageSync('walletData', allWalletData)
    }
    return res
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

export const getDeviceInfo = async (initObj, dataObj) =>{
	let info = {
		device_id: 'c3c0268fa44293f2'
	}
    // #ifdef APP-PLUS
    info = await new Promise((succ, error) => {
        plus.device.getInfo({
            success: function(e) {
                info.device_id = e.uuid
                succ(info)
            },
            fail: function(e) {
                error(e)
            }
        });
    })
    // #endif
	return info
}

export const deleteWallet = async (currentWallet) =>{
    const {chain_id, wallet_uuid} = currentWallet;
    const [newWalletInfo] =  await DB.selectTableData('wallet', "wallet_uuid", wallet_uuid)
    await DB.updateTableData('wallet', `is_del = '1'`, "id", newWalletInfo.id)
    const walletAssetList =  await DB.selectTableData('walletAsset', "wallet_id", newWalletInfo.id)
    for(let item of walletAssetList){
        DB.updateTableData('walletAsset', `is_del = '1'`, "id", item.id)
    }
    const newAccountList =  await DB.selectTableData('account', "wallet_id", newWalletInfo.id)
    for(let item of newAccountList){
        DB.updateTableData('account', `is_del = '1'`, "id", item.id)
    }
    const newAccountAssetList =  await DB.selectTableData('accountAsset', "address_id", newAccountList[0].id)
    for(let item of newAccountAssetList){
        DB.updateTableData('accountAsset', `is_del = '1'`, "id", item.id)
    }
    // console.log('newWalletInfo', newWalletInfo)
    // console.log('walletAssetList', walletAssetList)
    // console.log('accountList', newAccountList, newAccountList[0].id)
    // console.log('newAccountAssetList', newAccountAssetList)
    const allWalletData = uni.getStorageSync('walletData') || {};
    const currentChainWalletList = allWalletData[chain_id] ||[];
    for(let i in currentChainWalletList){
        if(currentChainWalletList[i].wallet_uuid === currentWallet.wallet_uuid){
            currentChainWalletList.splice(i,1)
            break;
        }
    }
    let newCurrentWallet = {}
    if(currentChainWalletList.length >0){
        newCurrentWallet = currentChainWalletList[0]
    }else{
        const chainIds = Object.keys(allWalletData)
        for(let item of chainIds){
            if(allWalletData[item].length >0){
                newCurrentWallet = allWalletData[item][0]
                break;
            }
        }
    }
    uni.setStorageSync('currentWallet', newCurrentWallet)
    uni.setStorageSync('walletData', allWalletData)
    return newCurrentWallet
    
}

export const getWalletList = async () =>{
    const newWalletList =  await DB.selectTableData('wallet')
    const newAccountList =  await DB.selectTableData('account')
    let newCurrentWallet = {}
    const allWalletData = (newWalletList||[]).map(item =>{
        const {id , ...restItem} = item;
        const [curAccountInfo = {}] = newAccountList.filter(item=> item.wallet_id ===id)
        const { chain, logo } = CHAIN_LIST.filter(item=> item.id === restItem.chain_id)[0];
        const walletItem = {
            ...restItem,
            mnemonic_code: base.AesDecrypt(restItem.mnemonic_code,item.password),
            logo,
            chain,
            address: curAccountInfo.address,
            publicKey: curAccountInfo.pub_key,
            privateKey: base.AesDecrypt(curAccountInfo.priv_key,item.password),
            token_list:[]
        }
        if(JSON.stringify(newCurrentWallet) === '{}'){
            newCurrentWallet = walletItem
        }
        return walletItem
    }).reduce((total,item)=>{
        total[item.chain_id] = [...total[item.chain_id]||[], item]
        return total
    },{})
    uni.setStorageSync('currentWallet', newCurrentWallet)
    uni.setStorageSync('walletData', allWalletData)
    return newCurrentWallet
    
}