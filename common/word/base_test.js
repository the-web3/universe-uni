const base = require('./base')

// 生成助记词测试案例
var word = base.GenerateMnemonic(12, "english")
console.log(word)

// 验证助记词是否有效
var word_vld = base.ValidateMnemonic(word, "english")
console.log(word_vld)

// 助记词编码案例
var mtt = base.MnemonicToEntropy(word, "english")
console.log(mtt)

// 编码到助记词
var ttm = base.EntropyToMnemonic(mtt, "english")
console.log(ttm)

// 助记词到随机种子
var seed = base.MnemonicToSeed(word, "")
console.log(seed)


var seed_sync = base.MnemonicToSeedSync(word, "")
console.log(seed_sync)