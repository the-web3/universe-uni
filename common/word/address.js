const wallet = import('ethereumjs-wallet/hdkey');
const util = import('ethereumjs-util');
const bip32  = import( 'bip32');
const constant = import('./constant');


export const  CreateEthAddressBySeed = async function(seed, number) {
    if(!seed && !number) {
        return constant.paramsErr;
    }
	let walletData = await wallet
	let utilData = await util
    var rootMasterKey = walletData.fromMasterSeed(seed);
    var childKey = rootMasterKey.derivePath("m/44'/60'/0'/0/" +  number + "");
    var address = utilData.pubToAddress(childKey._hdkey._publicKey, true).toString('hex');
    var privateKey = childKey._hdkey._privateKey.toString('hex');
    return { privateKey: privateKey, address: "0x" + address };
}

export const CreateEthAddressByPk = async function(private_key) {
	let utilData = await util
    let addr = utilData.privateToAddress(
        Buffer.from(private_key, "hex")
    ).toString('hex');
    return { privateKey: private_key, address: "0x" + addr };
}

// module.exports = {CreateEthAddressBySeed, CreateEthAddressByPk}