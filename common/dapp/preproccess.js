import ethUtil from "ethereumjs-util";
import waterfall from "async/waterfall";
import parallel from "async/parallel";
import extend from "xtend";
import isUtf8 from "isutf8";
import Utils from "./utils.js";
import { TypedDataUtils, typedSignatureHash, hashPersonalMessage } from "./hashMessage"

class PreproccessHandle {
    constructor(postMessage, request, provider) {
        this.postMessage = {}
        this.emitPayload = request
        this.provider = provider

        // approval hooks
        this.postMessage.approveTransaction = (postMessage && postMessage.approveTransaction) || this.autoApprove
        this.postMessage.approveMessage = (postMessage && postMessage.approveMessage) || this.autoApprove
        this.postMessage.approvePersonalMessage = (postMessage && postMessage.approvePersonalMessage) || this.autoApprove
        this.postMessage.approveTypedMessage = (postMessage && postMessage.approveTypedMessage) || this.autoApprove

        if (!postMessage) {
            return
        }

        // high level override
        if (postMessage.processTransaction) this.processTransaction = postMessage.processTransaction
    }

    handler(method, id, data) {
        const self = this
        let callback = function (err) {
            if (err) self.provider.sendError(id, err)
        }

        if (window.trustwallet.customMethodMessage
            && window.trustwallet.customMethodMessage.signMessageHash
            && method === "signPersonalMessage") {
            this.handlerSignPersonalMessage(id, method, data, callback)
            return true;
        } else if (window.trustwallet.customMethodMessage
            && window.trustwallet.customMethodMessage.signMessageHash
            && method === "signMessage") {
            this.handlerSignMessage(id, method, data, callback)
            return true;
        } else if (window.trustwallet.customMethodMessage
            && window.trustwallet.customMethodMessage.signMessageHash
            && method === "signTypedMessage") {
            this.handlerSignTypedMessage(id, method, data, callback)
            return true;
        } else if (window.trustwallet.customMethodMessage
            && window.trustwallet.customMethodMessage.personalEcRecover
            && method === "ecRecover") {
            this.handlerEcRecover(id, method, data, callback)
            return true;
        }
        return false;
    }

    //
    // web3 function
    //
    handlerSignMessage(id, method, data, callback) {
        let message = data.object.data
        let address = data.object.from

        let msgParams = {
            from: address,
            data: message,
            params: message,
            rawMessage: message
        }

        let jsoRpcRequest = {
            id: id,
            name: method,
            object: msgParams,
        };

        waterfall([
            (cb) => this.validateMessage(msgParams, cb),
            () => window.trustwallet.customMethodMessage.signMessageHash.postMessage(jsoRpcRequest),
        ], callback)
        return
    }

    handlerSignPersonalMessage(id, method, data, callback) {
        let message = data.object.data
        let address = data.object.from
        
        let messageBuffer = Utils.toBuffer(message)
        if (isUtf8(messageBuffer)) {
            message = Buffer.from(messageBuffer).toString()
        }

        let hash = hashPersonalMessage(data.object.data)
        let msgParams = {
            from: address,
            data: hash,
            params: message,
            rawMessage: message
        }

        let jsoRpcRequest = {
            id: id,
            name: method,
            object: msgParams,
        };

        waterfall([
            (cb) => this.validatePersonalMessage(msgParams, cb),
            () => window.trustwallet.customMethodMessage.signMessageHash.postMessage(jsoRpcRequest),
        ], callback)
        return
    }

    handlerSignTypedMessage(id, method, data, callback) {
        let message = data.object.data
        let address = data.object.from

        if (typeof (message) == 'string') {
            message = JSON.parse(message)
        }

        let hashData;
        if (data.object.typeVersion === 'v1') {
            hashData = typedSignatureHash(message)
        } else if (data.object.typeVersion === 'v3') {
            hashData = TypedDataUtils.sign(message, false)
        } else if (data.object.typeVersion === 'v4') {
            hashData = TypedDataUtils.sign(message)
        }

        let hash = hashData.hex
        let messageData = hashData.data

        if (typeof (messageData) == 'object') {
            messageData = JSON.stringify(messageData)
        }

        let msgParams = {
            from: address,
            data: hash,
            params: messageData,
        }

        var methodVersion;
        if (data.object.typeVersion) {
            methodVersion = data.object.typeVersion.toUpperCase()
        } else {
            methodVersion = ''
        }
        let jsoRpcRequest = {
            id: id,
            name: method + methodVersion,
            object: msgParams,
        };

        waterfall([
            (cb) => this.validateMessage(msgParams, cb),
            () => window.trustwallet.customMethodMessage.signMessageHash.postMessage(jsoRpcRequest),
        ], callback)
        return
    }

    handlerEcRecover(id, method, data, callback) {
        const recoverParams = { data: data.object.message, sig: data.object.signature }
        let senderHex
        try {
            const message = Utils.toBuffer(recoverParams.data)
            const msgHash = ethUtil.hashPersonalMessage(message)

            const signature = Utils.toBuffer(recoverParams.sig)
            const sigParams = ethUtil.fromRpcSig(signature)
            const publicKey = ethUtil.ecrecover(msgHash, sigParams.v, sigParams.r, sigParams.s)

            const sender = ethUtil.publicToAddress(publicKey)
            senderHex = ethUtil.bufferToHex(sender)
        } catch (err) {
            return callback(err)
        }

        let msgParams = {
            data: senderHex,
            params: data.object.payload,
        }

        let jsoRpcRequest = {
            id: id,
            name: method,
            object: msgParams,
        };

        window.trustwallet.customMethodMessage.personalEcRecover.postMessage(jsoRpcRequest)
        return
    }

    //
    // "process" high level flow
    //
    processTransaction(txParams, callback) {
        const self = this
        waterfall([
            (cb) => self.approveTransaction(txParams, cb),
            (didApprove, cb) => self.checkApproval('transaction', didApprove, cb),
            (cb) => self.finalizeAndSubmitTx(txParams, cb),
        ], callback)
    }

    processSignTransaction(txParams, callback) {
        const self = this
        waterfall([
            (cb) => self.approveTransaction(txParams, cb),
            (didApprove, cb) => self.checkApproval('transaction', didApprove, cb),
            (cb) => self.finalizeTx(txParams, cb),
        ], callback)
    }

    //
    // approval
    //
    autoApprove(txParams, cb) {
        cb(null, true)
    }

    checkApproval(type, didApprove, cb) {
        cb(didApprove ? null : new Error('User denied ' + type + ' signature.'))
    }

    //
    // parity
    //

    parityPostTransaction(txParams, cb) {
        const self = this

        // get next id
        const count = self._parityRequestCount
        const reqId = `0x${count.toString(16)}`
        self._parityRequestCount++

        self.emitPayload({
            method: 'eth_sendTransaction',
            params: [txParams],
        }, function (error, res) {
            if (error) {
                self._parityRequests[reqId] = { error }
                return
            }
            const txHash = res.result
            self._parityRequests[reqId] = txHash
        })

        cb(null, reqId)
    }


    parityPostSign(address, message, cb) {
        const self = this

        // get next id
        const count = self._parityRequestCount
        const reqId = `0x${count.toString(16)}`
        self._parityRequestCount++

        self.emitPayload({
            method: 'eth_sign',
            params: [address, message],
        }, function (error, res) {
            if (error) {
                self._parityRequests[reqId] = { error }
                return
            }
            const result = res.result
            self._parityRequests[reqId] = result
        })

        cb(null, reqId)
    }

    parityCheckRequest(reqId, cb) {
        const self = this
        const result = self._parityRequests[reqId] || null
        // tx not handled yet
        if (!result) return cb(null, null)
        // tx was rejected (or other error)
        if (result.error) return cb(result.error)
        // tx sent
        cb(null, result)
    }

    //
    // signature and recovery
    //
    recoverPersonalSignature(msgParams, cb) {
        let senderHex
        try {
            senderHex = sigUtil.recoverPersonalSignature(msgParams)
        } catch (err) {
            return cb(err)
        }
        cb(null, senderHex)
    }

    //
    // validation
    //
    validateTransaction(txParams, cb) {
        const self = this
        // shortcut: undefined sender is invalid
        if (txParams.from === undefined) return cb(new Error(`Undefined address - from address required to sign transaction.`))
        self.validateSender(txParams.from, function (err, senderIsValid) {
            if (err) return cb(err)
            if (!senderIsValid) return cb(new Error(`Unknown address - unable to sign transaction for this address: "${txParams.from}"`))
            cb()
        })
    }

    validateMessage(msgParams, cb) {
        const self = this
        if (msgParams.from === undefined) return cb(new Error(`Undefined address - from address required to sign message.`))
        self.validateSender(msgParams.from, function (err, senderIsValid) {
            if (err) return cb(err)
            if (!senderIsValid) return cb(new Error(`Unknown address - unable to sign message for this address: "${msgParams.from}"`))
            cb()
        })
    }

    validatePersonalMessage(msgParams, cb) {
        const self = this
        if (msgParams.from === undefined) return cb(new Error(`Undefined address - from address required to sign personal message.`))
        if (msgParams.data === undefined) return cb(new Error(`Undefined message - message required to sign personal message.`))
        if (!Utils.isValidHex(msgParams.data)) return cb(new Error(`HookedWalletSubprovider - validateMessage - message was not encoded as hex.`))
        self.validateSender(msgParams.from, function (err, senderIsValid) {
            if (err) return cb(err)
            if (!senderIsValid) return cb(new Error(`Unknown address - unable to sign message for this address: "${msgParams.from}"`))
            cb()
        })
    }

    validateTypedMessage(msgParams, cb) {
        if (msgParams.from === undefined) return cb(new Error(`Undefined address - from address required to sign typed data.`))
        if (msgParams.data === undefined) return cb(new Error(`Undefined data - message required to sign typed data.`))
        this.validateSender(msgParams.from, function (err, senderIsValid) {
            if (err) return cb(err)
            if (!senderIsValid) return cb(new Error(`Unknown address - unable to sign message for this address: "${msgParams.from}"`))
            cb()
        })
    }

    validateSender(senderAddress, cb) {
        const self = this
        // shortcut: undefined sender is invalid
        if (!senderAddress) return cb(null, false)
        self.getAccounts(function (err, accounts) {
            if (err) return cb(err)
            const senderIsValid = (accounts.map(self.toLowerCase).indexOf(senderAddress.toLowerCase()) !== -1)
            cb(null, senderIsValid)
        })
    }

    getAccounts(cb) {
        cb(null, this.provider.eth_accounts())
    }

    //
    // tx helpers
    //

    finalizeAndSubmitTx(txParams, cb) {
        const self = this
        // can only allow one tx to pass through this flow at a time
        // so we can atomically consume a nonce
        self.nonceLock.take(function () {
            waterfall([
                self.fillInTxExtras.bind(self, txParams),
                self.signTransaction.bind(self),
                self.publishTransaction.bind(self),
            ], function (err, txHash) {
                self.nonceLock.leave()
                if (err) return cb(err)
                cb(null, txHash)
            })
        })
    }

    finalizeTx(txParams, cb) {
        const self = this
        // can only allow one tx to pass through this flow at a time
        // so we can atomically consume a nonce
        self.nonceLock.take(function () {
            waterfall([
                self.fillInTxExtras.bind(self, txParams),
                self.signTransaction.bind(self),
            ], function (err, signedTx) {
                self.nonceLock.leave()
                if (err) return cb(err)
                cb(null, { raw: signedTx, tx: txParams })
            })
        })
    }

    publishTransaction(rawTx, cb) {
        const self = this
        self.emitPayload({
            method: 'eth_sendRawTransaction',
            params: [rawTx],
        }, function (err, res) {
            if (err) return cb(err)
            cb(null, res.result)
        })
    }

    fillInTxExtras(txParams, cb) {
        const self = this
        const address = txParams.from
        // console.log('fillInTxExtras - address:', address)

        const reqs = {}

        if (txParams.gasPrice === undefined) {
            // console.log("need to get gasprice")
            reqs.gasPrice = self.emitPayload.bind(self, { method: 'eth_gasPrice', params: [] })
        }

        if (txParams.nonce === undefined) {
            // console.log("need to get nonce")
            reqs.nonce = self.emitPayload.bind(self, { method: 'eth_getTransactionCount', params: [address, 'pending'] })
        }

        if (txParams.gas === undefined) {
            // console.log("need to get gas")
            reqs.gas = estimateGas.bind(null, self.engine, cloneTxParams(txParams))
        }

        parallel(reqs, function (err, result) {
            if (err) return cb(err)
            // console.log('fillInTxExtras - result:', result)

            const res = {}
            if (result.gasPrice) res.gasPrice = result.gasPrice.result
            if (result.nonce) res.nonce = result.nonce.result
            if (result.gas) res.gas = result.gas

            cb(null, extend(txParams, res))
        })
    }

    // utils function
    // we use this to clean any custom params from the txParams
    cloneTxParams(txParams) {
        return {
            from: txParams.from,
            to: txParams.to,
            value: txParams.value,
            data: txParams.data,
            gas: txParams.gas,
            gasPrice: txParams.gasPrice,
            nonce: txParams.nonce,
        }
    }

    toLowerCase(string) {
        return string.toLowerCase()
    }

    resemblesAddress(string) {
        const fixed = Utils.addHexPrefix(string)
        return Utils.isValidAddress(fixed)
    }

    // Returns true if resembles hex data
    // but definitely not a valid address.
    resemblesData(string) {
        const fixed = Utils.addHexPrefix(string)
        const isValidAddress = Utils.isValidAddress(fixed)
        return !isValidAddress && (Utils.isValidHex(string) || typeof (string) == 'string')
    }

    mustProvideInConstructor(methodName) {
        return function (params, cb) {
            cb(new Error('ProviderEngine - HookedWalletSubprovider - Must provide "' + methodName + '" fn in constructor options'))
        }
    }
}

module.exports = PreproccessHandle;
