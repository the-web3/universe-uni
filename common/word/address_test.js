const base = require('../../mnemonic/base')
const addr = require('./address')

// 测试生成地址案例
var word = base.GenerateMnemonic(12, "english")
var seed_sync = base.MnemonicToSeedSync(word, "")

// 助记词生成地址
addrs = addr.CreateEthAddressBySeed(seed_sync, 1)
console.log(addrs)

// 私钥生成地址
addr_pk = addr.CreateEthAddressByPk("4d0c1989ec6f8d783c81daaef621e288df98e97aff89b7fd6d7e9098f82828d2")
console.log(addr_pk)