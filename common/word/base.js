const bip39  = import('bip39');
const bip32  = import( 'bip32');
const constant = import('./constant');


/**
 * @param number: 助记词的个数
 * @param language: 语言选择
 */
export const GenerateMnemonic = async function(number, language) {
    if(!number && !language) {
        console.log("助记词个数和助记词语言选择错误");
        return constant.paramsErr;
    }
    var msg = "不支持这种场景的助记词个数"
	let bip39Data = await bip39
    switch (language) {
        case 'chinese_simplified':
            if(number === 12) {
                return bip39Data.generateMnemonic(128, null, bip39Data.wordlists.chinese_simplified);
            } else if(number === 15) {
                return bip39Data.generateMnemonic(160, null, bip39Data.wordlists.chinese_simplified);
            } else if(number === 18) {
                return bip39Data.generateMnemonic(192, null, bip39Data.wordlists.chinese_simplified);
            } else if(number === 21) {
                return bip39Data.generateMnemonic(224, null, bip39Data.wordlists.chinese_simplified);
            } else if(number === 24) {
                return bip39Data.generateMnemonic(256, null, bip39Data.wordlists.chinese_simplified);
            } else {
                console.log(msg)
                return constant.noWord;
            }
        case 'chinese_traditional':
            if(number === 12) {
                return bip39.generateMnemonic(128, null, bip39.wordlists.chinese_traditional);
            } else if(number === 15) {
                return bip39.generateMnemonic(160, null, bip39.wordlists.chinese_traditional);
            } else if(number === 18) {
                return bip39.generateMnemonic(192, null, bip39.wordlists.chinese_traditional);
            } else if(number === 21) {
                return bip39.generateMnemonic(224, null, bip39.wordlists.chinese_traditional);
            } else if(number === 24) {
                return bip39.generateMnemonic(256, null, bip39.wordlists.chinese_traditional);
            } else {
                console.log(msg)
                return constant.noWord;
            }
        case 'english':
            if(number === 12) {
                return bip39Data.generateMnemonic(128, null, bip39Data.wordlists.english);
            } else if(number === 15) {
                return bip39Data.generateMnemonic(160, null, bip39Data.wordlists.english);
            } else if(number === 18) {
                return bip39Data.generateMnemonic(192, null, bip39Data.wordlists.english);
            } else if(number === 21) {
                return bip39Data.generateMnemonic(224, null, bip39Data.wordlists.english);
            } else if(number === 24) {
                return bip39Data.generateMnemonic(256, null, bip39Data.wordlists.english);
            } else {
                console.log(msg)
                return constant.noWord;
            }
        case 'french':
            if(number === 12) {
                return bip39.generateMnemonic(128, null, bip39.wordlists.french);
            } else if(number === 15) {
                return bip39.generateMnemonic(160, null, bip39.wordlists.french);
            } else if(number === 18) {
                return bip39.generateMnemonic(192, null, bip39.wordlists.french);
            } else if(number === 21) {
                return bip39.generateMnemonic(224, null, bip39.wordlists.french);
            } else if(number === 24) {
                return bip39.generateMnemonic(256, null, bip39.wordlists.french);
            } else {
                console.log(msg)
                return constant.noWord;
            }
        case 'italian':
            if(number === 12) {
                return bip39.generateMnemonic(128, null, bip39.wordlists.italian);
            } else if(number === 15) {
                return bip39.generateMnemonic(160, null, bip39.wordlists.italian);
            } else if(number === 18) {
                return bip39.generateMnemonic(192, null, bip39.wordlists.italian);
            } else if(number === 21) {
                return bip39.generateMnemonic(224, null, bip39.wordlists.italian);
            } else if(number === 24) {
                return bip39.generateMnemonic(256, null, bip39.wordlists.italian);
            } else {
                console.log(msg)
                return constant.noWord;
            }
        case 'japanese':
            if(number === 12) {
                return bip39.generateMnemonic(128, null, bip39.wordlists.japanese);
            } else if(number === 15) {
                return bip39.generateMnemonic(160, null, bip39.wordlists.japanese);
            } else if(number === 18) {
                return bip39.generateMnemonic(192, null, bip39.wordlists.japanese);
            } else if(number === 21) {
                return bip39.generateMnemonic(224, null, bip39.wordlists.japanese);
            } else if(number === 24) {
                return bip39.generateMnemonic(256, null, bip39.wordlists.japanese);
            } else {
                console.log(msg)
                return constant.noWord;
            }
        case 'korean':
            if(number === 12) {
                return bip39.generateMnemonic(128, null, bip39.wordlists.korean);
            } else if(number === 15) {
                return bip39.generateMnemonic(160, null, bip39.wordlists.korean);
            } else if(number === 18) {
                return bip39.generateMnemonic(192, null, bip39.wordlists.korean);
            } else if(number === 21) {
                return bip39.generateMnemonic(224, null, bip39.wordlists.korean);
            } else if(number === 24) {
                return bip39.generateMnemonic(256, null, bip39.wordlists.korean);
            } else {
                console.log(msg)
                return constant.noWord;
            }
        case 'spanish':
            if(number === 12) {
                return bip39.generateMnemonic(128, null, bip39.wordlists.spanish);
            } else if(number === 15) {
                return bip39.generateMnemonic(160, null, bip39.wordlists.spanish);
            } else if(number === 18) {
                return bip39.generateMnemonic(192, null, bip39.wordlists.spanish);
            } else if(number === 21) {
                return bip39.generateMnemonic(224, null, bip39.wordlists.spanish);
            } else if(number === 24) {
                return bip39.generateMnemonic(256, null, bip39.wordlists.spanish);
            } else {
                console.log(msg)
                return constant.noWord;
            }
        default:
            console.log("不支持该语言的助记词");
            return constant.noSupport;
    }
}

export const MnemonicToEntropy = async function(mnemonic, language) {
    if(!mnemonic && !language) {
        console.log("助记词个数和助记词语言选择错误");
        return constant.paramsErr;
    }
	let bip39Data = await bip39
    switch (language) {
        case 'chinese_simplified':
            return bip39Data.mnemonicToEntropy(mnemonic, bip39Data.wordlists.chinese_simplified);
        case 'chinese_traditional':
            return bip39Data.mnemonicToEntropy(mnemonic, bip39Data.wordlists.chinese_traditional);
        case 'english':
            return bip39Data.mnemonicToEntropy(mnemonic, bip39Data.wordlists.english);
        case 'french':
            return bip39Data.mnemonicToEntropy(mnemonic, bip39Data.wordlists.french);
        case 'italian':
            return bip39Data.mnemonicToEntropy(mnemonic, bip39Data.wordlists.italian);
        case 'japanese':
            return bip39Data.mnemonicToEntropy(mnemonic, bip39Data.wordlists.japanese);
        case 'korean':
            return bip39Data.mnemonicToEntropy(mnemonic, bip39Data.wordlists.korean);
        case 'spanish':
            return bip39Data.mnemonicToEntropy(mnemonic, bip39Data.wordlists.spanish);
        default:
            console.log("不支持该语言的助记词");
            return constant.noSupport;
    }
}

export const EntropyToMnemonic = async function(encrytMnemonic, language) {
    if(!encrytMnemonic && !language) {
        console.log("encrytMnemonic 和 language 为空");
        return constant.paramsErr;
    }
	let bip39Data = await bip39
    switch (language) {
        case 'chinese_simplified':
            return bip39Data.entropyToMnemonic(encrytMnemonic, bip39Data.wordlists.chinese_simplified);
        case 'chinese_traditional':
            return bip39Data.entropyToMnemonic(encrytMnemonic, bip39Data.wordlists.chinese_traditional);
        case 'english':
            return bip39Data.entropyToMnemonic(encrytMnemonic, bip39Data.wordlists.english);
        case 'french':
            return bip39Data.entropyToMnemonic(encrytMnemonic, bip39Data.wordlists.french);
        case 'italian':
            return bip39Data.entropyToMnemonic(encrytMnemonic, bip39Data.wordlists.italian);
        case 'japanese':
            return bip39Data.entropyToMnemonic(encrytMnemonic, bip39Data.wordlists.japanese);
        case 'korean':
            return bip39Data.entropyToMnemonic(encrytMnemonic, bip39Data.wordlists.korean);
        case 'spanish':
            return bip39Data.entropyToMnemonic(encrytMnemonic, bip39Data.wordlists.spanish);
        default:
            console.log("不支持该语言的助记词");
            return constant.noSupport;
    }
}

export const MnemonicToSeed = function(mnemonic, password){
    if(!mnemonic ) {
        console.log("mnemonic 参数为空");
        return constant.paramsErr;
    }
    return bip39.mnemonicToSeed(mnemonic, password)
}

export const MnemonicToSeedSync = async function(mnemonic, password){
    if(!mnemonic) {
        console.log("参数为空");
        return constant.paramsErr;
    }
	let bip39Data = await bip39
    return bip39Data.mnemonicToSeedSync(mnemonic, password);
}

export const ValidateMnemonic = async function(mnemonic, language) {
    if(!mnemonic && !language) {
        console.log("助记词和语言不能为空");
        return constant.paramsErr;
    }
	let bip39Data = await bip39
    switch (language) {
        case 'chinese_simplified':
            return bip39Data.validateMnemonic(mnemonic, bip39Data.wordlists.chinese_simplified);
        case 'chinese_traditional':
            return bip39Data.validateMnemonic(mnemonic, bip39Data.wordlists.chinese_traditional);
        case 'english':
            return bip39Data.validateMnemonic(mnemonic, bip39Data.wordlists.english);
        case 'french':
            return bip39Data.validateMnemonic(mnemonic, bip39Data.wordlists.french);
        case 'italian':
            return bip39Data.validateMnemonic(mnemonic, bip39Data.wordlists.italian);
        case 'japanese':
            return bip39Data.validateMnemonic(mnemonic, bip39Data.wordlists.japanese);
        case 'korean':
            return bip39Data.validateMnemonic(mnemonic, bip39Data.wordlists.korean);
        case 'spanish':
            return bip39Data.validateMnemonic(mnemonic, bip39Data.wordlists.spanish);
        default:
            console.log("不支持该语言的助记词");
            return constant.noSupport;
    }
}

// module.exports = {
//     GenerateMnemonic,
//     MnemonicToEntropy,
//     EntropyToMnemonic,
//     MnemonicToSeed,
//     MnemonicToSeedSync,
//     ValidateMnemonic
// }