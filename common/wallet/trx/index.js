const ecc = require("tiny-secp256k1");
const { BIP32Factory } = require("bip32");
const bip32 = BIP32Factory(ecc);
import { signTransaction as cryptoSignTransaction, decode58Check, isAddressValid ,pkToAddress} from "@tronscan/client/src/utils/crypto";
import { byteArray2hexStr } from "@tronscan/client/src/utils/bytes";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { buildTransferContract } from "@tronscan/client/src/utils/transactionBuilder";
import {
    TriggerSmartContract,
    TransferContract,
    TransferAssetContract,
} from "@tronscan/client/src/protocol/core/Contract_pb";
import {
    Transaction
} from "@tronscan/client/src/protocol/core/Tron_pb";
import { encodeString } from "@tronscan/client/src/lib/code";
BigNumber.config({
    EXPONENTIAL_AT: 1e+9
});
const NULLTOKENADDR = "T000000000000000000000000000000000";
const EXPIRATIONMS = 7200000; // 2 hours by default // 60000 * 60 * 2
const MAX_AMOUNT_SAFE = Number.MAX_SAFE_INTEGER;
/**
 * Get address from seed
 * @param seedHex
 * @param addressIndex
 * @returns
 */
export function createTrxAddress(seedHex, addressIndex) {
    const node = bip32.fromSeed(Buffer.from(seedHex, "hex"));
    const child = node.derivePath("m/44'/195'/0'/0/" + addressIndex + "");
    const privateKey = child.privateKey.toString('hex');
    const publickKey = child.publicKey.toString('hex');
    const address = pkToAddress(privateKey).toString("hex");
    return JSON.stringify({
        privateKey,
        publickKey,
        address
    });
}

/**
 * sign transaction
 * @param privateKeyHex
 * @param tx
 * @returns
 */
export async function signTrxTransaction(params) {
    const { privateKey, from, to, amount, energyLimit, energyPrice, refBlock, tokenAddress, tokenTRC10, expiration } = params;
    const time = Date.now();
    const feeLimit = energyLimit * energyPrice; // SUN
    let rawTx = buildTronTransaction({
        from,
        to: to,
        amount: amount,
        feeLimit: feeLimit,
        refBlock: refBlock,
        tokenAddress: tokenAddress || NULLTOKENADDR,
        tokenTRC10: tokenTRC10,
        expiration: expiration,
        permissionId: 0,
        time
    });
    let signedTx = signTx(privateKey, rawTx);
    return signedTx.hex;
}

/**
 * address
 * network type
 * @param params 
 */
export function verifyTrxAddress(params) {
    const { address } = params;
    return isAddressValid(address);
}

/**
 * import address
 * private key
 * network
 * @param params 
 */
 export function importTrxAddress(params) {
    const { privateKey } = params;
    const address = pkToAddress(privateKey).toString("hex");
    return address;
}


function signTx(privateKey, transaction) {
    let signedTx = cryptoSignTransaction(privateKey, transaction);
    return {
        signedTx,
        hex: signedTx.hex,
        sig: byteArray2hexStr(
            signedTx.transaction.getSignatureList()[0]
        ),
    };
}

function buildTronTransaction(params) {
    const { from, to, amount, feeLimit, refBlock, tokenAddress, tokenTRC10, expiration, permissionId, time } = params;
    if (tokenAddress === NULLTOKENADDR && tokenTRC10 === undefined) {
        return createTx({ from, to, amount, refBlock, expiration, permissionId, time });
    } else if (tokenAddress !== NULLTOKENADDR && tokenTRC10 === undefined) {
        return createTRC20Tx({
            from, to, amount, tokenAddress, feeLimit,
            refBlock, expiration, permissionId, time
        });
    } else {
        return createTRC10Tx({ from, to, amount, refBlock, tokenTRC10, expiration, permissionId, time });
    }
}

function createTx(params) {
    const { from, to, amount, refBlock, expiration, permissionId, time } = params;
    if (refBlock && refBlock.blockHash) {
        const parameter = {
            owner_address: decode58ToHex(from),
            to_address: decode58ToHex(to),
            amount: amount,
            ref_blockBytes: fromHexString(
                refBlock.blockHash.substring(12, 16)
            ),
            ref_blockHash: fromHexString(
                refBlock.blockHash.substring(16, 32)
            ),
            timeStamp: time || Date.now(),
            expiration: expiration,
            permission_id: permissionId || 0,
        };

        return createTransaction(parameter);
    }
    throw new Error(`参数错误: refBlock无效`);
}

function createTRC20Tx(params) {
    const { from, to, amount, tokenAddress, feeLimit,
        refBlock, expiration, permissionId, time } = params;
    const amountBig = new BigNumber(amount);
    const feeLimitBig = new BigNumber(feeLimit); // SUN
    if (feeLimitBig.toString().indexOf(".") != -1 ||
        feeLimitBig.comparedTo(new BigNumber(MAX_AMOUNT_SAFE)) > 0 ||
        feeLimitBig.comparedTo(new BigNumber(0)) <= 0) {
        throw new Error(`参数错误: feeLimit无效(${feeLimitBig.toString()})`);
    }

    let toAddressHex = decode58ToHex(to);
    const dataHexEncoded = encodeData(toAddressHex, amountBig);
    return createTRC20TxByData(from, tokenAddress, feeLimit,
        refBlock, dataHexEncoded, expiration, permissionId, time);
}

function createTRC10Tx(params) {
    const { from, to, amount, refBlock, tokenTRC10, expiration, permissionId, time } = params;
    if (tokenTRC10 === undefined) {
        throw new Error(`参数错误: 缺少TRC10通证参数`);
    }
    if (refBlock && refBlock.blockHash) {
        const parameter = {
            owner_address: decode58ToHex(from),
            to_address: decode58ToHex(to),
            amount: amount,
            token: tokenTRC10,
            ref_blockBytes: fromHexString(
                refBlock.blockHash.substring(12, 16)
            ),
            ref_blockHash: fromHexString(
                refBlock.blockHash.substring(16, 32)
            ),
            timeStamp: time || Date.now(),
            expiration: expiration,
            permission_id: permissionId || 0,
        };
        return triggerAssetContract(parameter);
    }
    throw new Error(`参数错误: refBlock无效`);
}

function createTransaction(params) {
    let transferContract = new TransferContract();
    transferContract.setToAddress(fromHexString(params.to_address));
    transferContract.setOwnerAddress(
        fromHexString(params.owner_address)
    );
    transferContract.setAmount(params.amount);
    let transferContractTx = buildTransferContract(
        transferContract,
        Transaction.Contract.ContractType.TRANSFERCONTRACT,
        "TransferContract"
    );
    if (params.ref_blockBytes) {
        transferContractTx
            .getRawData()
            .setRefBlockBytes(params.ref_blockBytes);
    }
    if (params.ref_blockHash) {
        transferContractTx
            .getRawData()
            .setRefBlockHash(params.ref_blockHash);
    }
    let timeStamp = params.timeStamp || Date.now();
    transferContractTx.getRawData().setTimestamp(timeStamp);
    transferContractTx.getRawData().setExpiration(params.expiration || timeStamp + EXPIRATIONMS);
    return transferContractTx;
}

function createTRC20TxByData(from, contract, feeLimit: number, refBlock,
    dataHex, expiration?: number, permissionId?: number, time?) {
    if (refBlock && refBlock.blockHash) {
        const parameter = {
            owner_address: decode58ToHex(from),
            contract_address: decode58ToHex(contract),
            data: dataHex,
            fee_limit: feeLimit,
            ref_blockBytes: fromHexString(
                refBlock.blockHash.substring(12, 16)
            ),
            ref_blockHash: fromHexString(
                refBlock.blockHash.substring(16, 32)
            ),
            timeStamp: time || Date.now(),
            expiration: expiration,
            permission_id: permissionId || 0,
        };

        return triggerSmartContract(parameter);
    }
    throw new Error(`参数错误: refBlock无效`);
}

function triggerSmartContract(params) {
    let contract = new TriggerSmartContract();
    contract.setOwnerAddress(fromHexString(params.owner_address));
    contract.setContractAddress(
        fromHexString(params.contract_address)
    );
    contract.setData(fromHexString(params.data));
    let smartContractTx = buildTransferContract(
        contract,
        Transaction.Contract.ContractType.TRIGGERSMARTCONTRACT,
        "TriggerSmartContract"
    );
    if (params.fee_limit) {
        smartContractTx.getRawData().setFeeLimit(params.fee_limit);
    }
    if (params.ref_blockBytes) {
        smartContractTx
            .getRawData()
            .setRefBlockBytes(params.ref_blockBytes);
    }
    if (params.ref_blockHash) {
        smartContractTx.getRawData().setRefBlockHash(params.ref_blockHash);
    }
    let timeStamp = params.timeStamp || Date.now();
    smartContractTx.getRawData().setTimestamp(timeStamp);
    smartContractTx.getRawData().setExpiration(params.expiration || timeStamp + EXPIRATIONMS);
    return smartContractTx;
}

function triggerAssetContract(params) {
    let assetContract = new TransferAssetContract();
    assetContract.setToAddress(fromHexString(params.to_address));
    assetContract.setOwnerAddress(
        fromHexString(params.owner_address)
    );
    assetContract.setAssetName(encodeString(params.token));
    assetContract.setAmount(params.amount);
    let assetContractTx = buildTransferContract(
        assetContract,
        Transaction.Contract.ContractType.TRANSFERASSETCONTRACT,
        "TransferAssetContract"
    );
    if (params.ref_blockBytes) {
        assetContractTx
            .getRawData()
            .setRefBlockBytes(params.ref_blockBytes);
    }
    if (params.ref_blockHash) {
        assetContractTx.getRawData().setRefBlockHash(params.ref_blockHash);
    }
    let timeStamp = params.timeStamp || Date.now();
    assetContractTx.getRawData().setTimestamp(timeStamp);
    assetContractTx.getRawData().setExpiration(params.expiration || timeStamp + EXPIRATIONMS);
    return assetContractTx;
}

function encodeData(to, amountBig: BigNumber) {
    const ABI = [
        "function transfer(address to, uint amount)"
    ];
    const iface = new ethers.utils.Interface(ABI);
    return iface.encodeFunctionData("transfer",
        ["0x" + to.substring(2), "0x" + amountBig.toString(16)]).substring(2);
}

const fromHexString = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

function decode58ToHex(addressBase58) {
    return byteArray2hexStr(decode58Check(addressBase58));
}