import { EOS_TRANS_ABI } from './transaction.abi';
import { EOS_TOKEN_ABI } from './eosio.token.abi';
const ecc = require("tiny-secp256k1");
const { BIP32Factory } = require("bip32");
const bip32 = BIP32Factory(ecc);
const eccEos = require("eosjs-ecc");
const crypto = require('crypto');
const { TextDecoder, TextEncoder } = require("text-encoding");
const { Serialize: {
    createInitialTypes,
    getTypesFromAbi,
    serializeActionData,
    getType,
    SerialBuffer,
    arrayToHex
}, JsSignatureProvider } = require("eosjs");

/**
 * Get address from seed
 * @param seedHex
 * @param addressIndex
 * @returns
 */
export function createEosAddress(seedHex, addressIndex) {
    const node = bip32.fromSeed(Buffer.from(seedHex, "hex"));
    const child = node.derivePath("m/44'/194'/0'/0/" + addressIndex + "");
    const privateKey = child.privateKey.toString('hex');
    const publickKey = child.publicKey.toString('hex');
    return JSON.stringify({
        privateKey: eccEos.PrivateKey.fromHex(privateKey).toString(),
        publickKey: eccEos.PublicKey.fromHex(publickKey).toString()
    });
}

/**
 * Eos Sign
 * @param signObj
 * @param privateKeyHex
 * @returns
 */
export async function signEosTransaction(params) {
    const { privateKey, chainId, from, to, quantity, memo, expiration, block, prefix } = params;
    const TRANSFER_ACTION_ACOUNT = "eosio.token";
    const TRANSFER_ACTION_NAME = "transfer";
    const TRANSFER_ROLE = "acitve";
    const TRANSFER_UNIT = "eos";
    // private key hex to wif
    const wifKey = eccEos.PrivateKey.fromWif(
        privateKey
    );
    const privKeys = [privateKey];
    const pubKeys = [wifKey.toPublic().toString()];
    //序列化交易对象
    const serdata = {
        max_net_usage_words: 0,
        max_cpu_usage_ms: 0,
        delay_sec: 0,
        context_free_actions: [],
        actions: [
            {
                account: TRANSFER_ACTION_ACOUNT,
                name: TRANSFER_ACTION_NAME,
                authorization: [{ actor: from, permission: TRANSFER_ROLE }],
                data: dataToAbiBinargs({
                    from: from,
                    to: to,
                    quantity: `${quantity} ${TRANSFER_UNIT}`,
                    memo: memo || ""
                }),
            },
        ],
        transaction_extensions: [],
        expiration: expiration,
        ref_block_num: block & 0xffff,
        ref_block_prefix: prefix,
    };
    let buffer = new SerialBuffer({
        textEncoder: TextEncoder,
        textDecoder: TextDecoder,
    });
    const transactionTypes = getTypesFromAbi(
        createInitialTypes(),
        EOS_TRANS_ABI
    );
    transactionTypes.get("transaction").serialize(buffer, serdata);
    // 构造签名
    const signatureProvider = new JsSignatureProvider(privKeys);
    // 签名
    const signature = await signatureProvider.sign({
        chainId: chainId,
        requiredKeys: pubKeys,
        serializedTransaction: buffer.asUint8Array(),
    });
    // 序列化签名交易hash
    const txid = crypto.createHash("sha256").update(buffer.asUint8Array()).digest("hex");
    // 返回交易报文
    const rawTx = {
        signatures: signature,
        compression: 0,
        packed_context_free_data: "",
        packed_trx: arrayToHex(buffer.asUint8Array()),
        txid: txid
    };
    return JSON.stringify(rawTx);
}

/**
 * address
 * network type
 * @param params 
 */
export function verifyEosAddress(params) {
    const { address } = params;
    return /^[a-z.1-5]{0,11}[a-z1-5]$/.test(address);
}

/**
 * 对签名data进行abi编码
 * @param data
 * @returns
 */
function dataToAbiBinargs(data) {
    const eosioContract = getContract(EOS_TOKEN_ABI);
    return serializeActionData(eosioContract, "eosio.token", "transfer", data)
}
/**
 * 获取eos.token合约
 * @param abi
 * @returns
 */
function getContract(abi) {
    const types = getTypesFromAbi(createInitialTypes(), abi);
    const actions = new Map();
    for (const { name, type } of abi.actions) {
        actions.set(name, getType(types, type));
    }
    return { types, actions };
}
