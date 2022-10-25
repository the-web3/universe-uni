import { INIT_WALLET_DATA } from '@/common/constants';

export const getAllWalletData = () => {
    return uni.getStorageSync('walletData') || INIT_WALLET_DATA
}

export const hasWallet = () => {
    const allWalletData = getAllWalletData();
    return allWalletData.filter(item=> item.list.length >0).length > 0
}