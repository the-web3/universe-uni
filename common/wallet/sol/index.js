const bs58 = require("bs58")
const { derivePath, getPublicKey } = require('ed25519-hd-key')
import * as SPLToken from "@solana/spl-token";
import { PublicKey, Keypair, Transaction, SystemProgram } from "@solana/web3.js";
const BigNumber = require("bignumber.js");


export function createSolAddress(seedHex, addressIndex) {
    const { key } = derivePath("m/44'/501'/1'/" + addressIndex + "'", seedHex);
    const publicKey = getPublicKey(new Uint8Array(key), false).toString("hex")
    const buffer = Buffer.from(getPublicKey(new Uint8Array(key), false).toString("hex"), "hex");
    const address = bs58.encode(buffer)
    const hdWallet = {
        "privateKey": key.toString("hex") + publicKey,
        "publicKey": publicKey,
        "address": address,
    }
    return JSON.stringify(hdWallet)
}


export async function signSolTransaction(params) {
    const { from, amount, to, mintAddress, nonce, decimal, privateKey } = params;
    const fromAccount = Keypair.fromSecretKey(new Uint8Array(Buffer.from(privateKey, "hex")), { skipValidation: true });
    const calcAmount = new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toString();
    if (calcAmount.indexOf(".") !== -1) throw new Error("decimal 无效");
    let tx = new Transaction();
    const toPubkey = new PublicKey(to);
    const fromPubkey = new PublicKey(from);
    tx.recentBlockhash = nonce;
    if(mintAddress){
        const mint = new PublicKey(mintAddress);
        const fromTokenAccount = await SPLToken.Token.getAssociatedTokenAddress(
            SPLToken.ASSOCIATED_TOKEN_PROGRAM_ID,
            SPLToken.TOKEN_PROGRAM_ID,
            mint,
            fromPubkey
        );
        const toTokenAccount = await SPLToken.Token.getAssociatedTokenAddress(
            SPLToken.ASSOCIATED_TOKEN_PROGRAM_ID,
            SPLToken.TOKEN_PROGRAM_ID,
            mint,
            toPubkey
        );
        tx.add(
            SPLToken.Token.createTransferInstruction(
                SPLToken.TOKEN_PROGRAM_ID,
                fromTokenAccount,
                toTokenAccount,
                fromPubkey,
                [fromAccount],
                calcAmount
            )
        );
    } else {
        tx.add(
            SystemProgram.transfer({
                fromPubkey: fromAccount.publicKey,
                toPubkey: new PublicKey(to),
                lamports: calcAmount,
            })
        );
    }
    tx.sign(fromAccount);
    return tx.serialize().toString("base64");
}

/**
 * address
 * network type
 * @param params
 */
export function verifySolAddress(params) {
    const { address } = params;
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}


export function importSolAddress(params) {
    const { privateKey } = params;
    const keyPairs = Keypair.fromSecretKey(Buffer.from(privateKey, "hex"));
    return bs58.encode(keyPairs.publicKey);
}