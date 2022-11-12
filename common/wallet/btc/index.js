import BIP32Factory from 'bip32';
// import * as ecc from 'tiny-secp256k1';
// const bip32 = BIP32Factory(ecc);
import bitcoin from 'bitcoinjs-lib';
import bitcore from 'bitcore-lib';
// bitcoin.initEccLib(ecc); // NEED THIS FOR TAPROOT

export function createBtcAddress(seedHex, receiveOrChange, addresIndex, network) {
    const root = bip32.fromSeed(Buffer.from(seedHex, "hex"));
    let path = "m/44'/0'/0'/0/" + addresIndex + "";
    if (receiveOrChange === '1') {
        path = "m/44'/0'/0'/1/" + addresIndex + "";
    }
    const child = root.derivePath(path);
    const { address } = bitcoin.payments.p2pkh({
        pubkey: child.publicKey,
        network: bitcoin.networks[network],
    });
    return JSON.stringify({
        privateKey: Buffer.from(child.privateKey).toString("hex"),
        publicKey: Buffer.from(child.publicKey).toString("hex"),
        address,
    })
}

/**
 * 暂不支持taproot签名
 * @returns
 * @param params
 */
export function signBtcTransaction(params) {
    const { privateKey, signObj, network } = params
    const net = bitcore.Networks[network];
    const inputs = signObj.inputs.map(input => {
        return {
            address: input.address,
            txId: input.txid,
            outputIndex: input.vout,
            script: new bitcore.Script.fromAddress(input.address).toHex(),
            satoshis: input.amount
        }
    });
    const outputs = signObj.outputs.map(output => {
        return {
            address: output.address,
            satoshis: output.amount
        };
    });
    const transaction = new bitcore.Transaction(net).from(inputs).to(outputs);
    transaction.version = 2;
    transaction.sign(privateKey);
    return transaction.toString();
}

/**
 * address
 * network type
 * @param params
 */
export function verifyBtcAddress(params) {
    const { address, network } = params;
    const net = bitcore.Networks[network];
    return bitcore.Address.isValid(address, net);
}

/**
 * import address
 * private key
 * network
 * @param params
 */
export function importBtcAddress(params) {
    const { privateKey, network } = params;
    const net = bitcore.Networks[network];
    if (!bitcore.PrivateKey.isValid(privateKey)) {
        throw new Error("PrivateKey is not valid.");
    }
    const address = bitcore.PrivateKey(privateKey, net).toAddress().toString("hex")
    return address;
}