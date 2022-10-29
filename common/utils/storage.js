import { INIT_WALLET_DATA } from '@/common/constants';

export const getAllWalletData = () => {
    const allWalletData = uni.getStorageSync('walletData');
    if(allWalletData){
        return INIT_WALLET_DATA.map(item => allWalletData.filter( localitem => localitem.type === item.type)[0] || item)
    }
    return INIT_WALLET_DATA
}

export const hasWallet = () => {
    const allWalletData = getAllWalletData();
    return allWalletData.filter(item=> item.list.length >0).length > 0
}