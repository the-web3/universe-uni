import { INIT_WALLET, INIT_TOKEN } from '@/common/constants';
import { getAllWalletData } from '@/common/utils/storage.js';
import api from '@/api';
export const postWalletInfo = (type, data, other) => {
    const walletsList = getAllWalletData();
    const currentWallet = walletsList ? walletsList.filter(item => {
        return item.type == type
    }): [{
        type,
        list: []
    }];
    
    const { device_id, uuid, chain, symbol, wallet_name, address, private_key, mnemonic_code,password, icon, contract_addr} = data;

    const currentWalletInfo = Object.assign({}, INIT_WALLET, data, {type});

    uni.showLoading({
        title: '提交中',
        mask: true
    })

    api.submitWalletInfo({
        chain,
        symbol,
        network: "mainnet",
        device_id,
        wallet_uuid: uuid,
        wallet_name,
        address,
        contract_addr,
    }).then(res => {
        currentWalletInfo.hasSubmit = true
        api.getAddressBalance({
            chain,
            symbol,
            network: "mainnet",
            address,
            contract_addr,
        }).then(res => {
            uni.hideLoading()
            if(!other || !other.in_token_list){
                currentWalletInfo.balance = res.result.balance
                currentWalletInfo.cny_price = res.result.cny_price
                currentWalletInfo.usdt_price = res.result.usdt_price
                currentWallet[0].list.push(currentWalletInfo)
                const currentWalletIndex = walletsList.findIndex(item=> item.type === type);
                const newWalletsList = currentWalletIndex !== -1 ? walletsList.map(item=> {
                    if(item.type === type ){
                        return currentWallet[0]
                    }else{
                        return item
                    }
                }) : [...walletsList,...currentWallet];
                uni.setStorageSync('currentWallet', currentWalletInfo)
                uni.setStorageSync('walletData', newWalletsList)
                uni.reLaunch({
                    url: '/pages/home/home'
                })
            }
            if(other && other.callback){
                other.callback()
            }
        }).catch(() => {
            uni.hideLoading()
        })
    }).catch(() => {
        uni.hideLoading()
    })
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