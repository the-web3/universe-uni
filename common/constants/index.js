export const CRYPTOCURRENCY_TYPE = {
    BTC: {
        img: '/static/image/BTC_h@2x.png',
        activeImg: '/static/image/BTC@2x.png',
        name: 'BTC',//虚拟币名称
        chain: 'Bitcoin',// 链名称
        symbol: 'eBTC',// 币种名称  
        support: false
    },
    ETH: {
        img: '/static/image/ETH_h@2x.png',
        activeImg: '/static/image/ETH@2x.png',
        name: 'ETH',
        chain: 'Ethereum',
        symbol: 'ETH',
        support: true
    },
    EOS: {
        img: '/static/image/EOS_h@2x.png',
        activeImg: '/static/image/EOS@2x.png',
        name: 'EOS',
        chain: 'EOS',
        symbol: 'EOS',
        support: false
    },
    // CRT: {
    //     img: '/static/image/USDT-h@2x.png',
    //     activeImg: '/static/image/USDT@2x.png',
    //     name: 'CRT',
    //     chain: '',
    //     symbol: 'ETH',
    //     support: false
    // },
    ARBI: {
        img: '/static/image/ARBI-h@2x.png',
        activeImg: '/static/image/ARBI@2x.png',
        name: 'ARBI',
        chain: 'Arbitrum',
        symbol: 'ETH',
        support: true
    }
}
export const CRYPTOCURRENCY_MENU = Object.keys(CRYPTOCURRENCY_TYPE).map(item=>{
    return {...CRYPTOCURRENCY_TYPE[item], type: item}
})
export const INIT_WALLET_DATA = Object.keys(CRYPTOCURRENCY_TYPE).map(item =>{
    return {
        type: item,
        list: []
    }
})
