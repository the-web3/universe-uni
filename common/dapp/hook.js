import Web3 from "web3";
import RPCServer from "./rpc.js";
import ProviderRpcError from "./error.js";
import Utils from "./utils.js";
import IdMapping from "./id_mapping.js";
import PreproccessHandle from "./preproccess.js";
import { EventEmitter } from "events";
import isUtf8 from "isutf8";

const isHexadecimal = str => /^0x[A-Fa-f0-9]+$/i.test(str)


class TrustWeb3Provider extends EventEmitter {
  constructor(config) {
    super();
    this.setConfig(config);

    this.idMapping = new IdMapping();
    this.callbacks = new Map();
    this.wrapResults = new Map();
    this.isTrust = true;
    this.isZilPocket = true;
    this.isDebug = !!config.isDebug;
    this.customHandler = new PreproccessHandle(window.trustwallet.customMethodMessage, this._request, this)

    this.emitConnect(config.chainId);

    // @deprecated Use ethereum.request({ method: 'eth_accounts' }) instead.
    this.selectedAddress = config.address
  }

  setAddress(address) {
    const lowerAddress = (address || "").toLowerCase();
    this.address = lowerAddress;
    this.ready = !!address;
    for (var i = 0; i < window.frames.length; i++) {
      const frame = window.frames[i];
      if (frame.ethereum && frame.ethereum.isTrust) {
        frame.ethereum.address = lowerAddress;
        frame.ethereum.ready = !!address;
      }
    }
  }

  setChainId(chainId) {
    let hexChainId
    let networkVersion
    if (isHexadecimal(chainId)) {
      hexChainId = chainId;
      networkVersion = parseInt(chainId, 16);
    } else {
      try {
        networkVersion = chainId
        hexChainId = "0x" + chainId.toString(16);
      } catch (error) {
        networkVersion = 1
        hexChainId = "0x1"
      }
    }
    this.networkVersion = networkVersion;
    this.chainId = hexChainId;
    for (var i = 0; i < window.frames.length; i++) {
      const frame = window.frames[i];
      if (frame.ethereum && frame.ethereum.isTrust) {
        frame.ethereum.chainId = hexChainId;
        frame.ethereum.networkVersion = networkVersion;
      }
    }
  }

  setConfig(config) {
    this.setAddress(config.address);
    this.setChainId(config.chainId);

    this.rpc = new RPCServer(config.rpcUrl);
    this.isDebug = !!config.isDebug;
  }

  onekeyChangeAddress(address) {
    this.setAddress(address);
    this.emit("accountsChanged", [address]);
  }

  onekeyChangeChainId(chainId, rpcUrl) {
    this.setChainId(chainId);
    this.onekeyChangeRpcUrl(rpcUrl)
    this.emit("chainChanged", this.chainId);
    this.emit("chainIdChanged", this.chainId);
    this.emit("networkChanged", this.chainId);
  }

  onekeyChangeRpcUrl(rpcUrl) {
    if (rpcUrl) {
      this.rpc = new RPCServer(rpcUrl);
    }
  }

  request(payload) {
    // this points to window in methods like web3.eth.getAccounts()
    var that = this;
    if (!(this instanceof TrustWeb3Provider)) {
      that = window.ethereum;
    }
    return that._request(payload, false);
  }

  /**
   * @deprecated Listen to "connect" event instead.
   */
  isConnected() {
    return true;
  }

  /**
   * @deprecated Use request({method: "eth_requestAccounts"}) instead.
   */
  enable() {
    console.log(
      'enable() is deprecated, please use window.ethereum.request({method: "eth_requestAccounts"}) instead.'
    );
    return this.request({ method: "eth_requestAccounts", params: [] });
  }

  /**
   * @deprecated Use request() method instead.
   */
  send(payload, params) {
    var that = this;
    if (!(this instanceof TrustWeb3Provider)) {
      that = window.ethereum;
    }

    if (typeof (payload) == 'string') {
      let request = { jsonrpc: "2.0", method: payload, params: params }
      console.log(
        "send(methed, params) is deprecated, please use window.ethereum.request(data) instead."
      );
      return that._request(request)
    }

    if ((typeof (params) == 'object' || Array.isArray(payload)) && params && typeof (params) == 'function') {
      // Params may be a callback
      var callback = params;
      console.log(
        "send(payload, callback) is deprecated, please use window.ethereum.request(data) instead."
      );
      if (Array.isArray(payload)) {
        Promise.all(payload.map(that._request.bind(that)))
          .then((data) => callback(null, data.result))
          .catch((error) => callback(error, null));
      } else {
        that
          ._request(payload)
          .then((data) => callback(null, data.result))
          .catch((error) => callback(error, null));
      }
      return;
    }

    let response = { jsonrpc: "2.0", id: payload.id };

    switch (payload.method) {
      case "eth_accounts":
        response.result = this.eth_accounts();
        break;
      case "eth_coinbase":
        response.result = this.eth_coinbase();
        break;
      case "net_version":
        response.result = this.net_version();
        break;
      case "eth_chainId":
        response.result = this.eth_chainId();
        break;
      default:
        throw new ProviderRpcError(
          4200,
          `Trust does not support calling ${payload.method} synchronously without a callback. Please provide a callback parameter to call ${payload.method} asynchronously.`
        );
    }

    console.log(
      "send(payload) is deprecated, please use window.ethereum.request(data) instead."
    );
    return response;
  }

  /**
   * @deprecated Use request() method instead.
   */
  sendAsync(payload, callback) {
    console.log(
      "sendAsync(data, callback) is deprecated, please use window.ethereum.request(data) instead."
    );
    // this points to window in methods like web3.eth.getAccounts()
    var that = this;
    if (!(this instanceof TrustWeb3Provider)) {
      that = window.ethereum;
    }
    if (Array.isArray(payload)) {
      Promise.all(payload.map(that._request.bind(that)))
        .then((data) => callback(null, data))
        .catch((error) => callback(error, null));
    } else {
      that
        ._request(payload)
        .then((data) => callback(null, data))
        .catch((error) => callback(error, null));
    }
  }

  /**
   * @private Internal rpc handler
   */
  _request(payload, wrapResult = true) {
    this.idMapping.tryIntifyId(payload);
    if (this.isDebug) {
      console.log(`==> _request payload ${JSON.stringify(payload)}`);
    }
    return new Promise((resolve, reject) => {
      if (!payload.id) {
        payload.id = Utils.genId();
      }
      this.callbacks.set(payload.id, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
      this.wrapResults.set(payload.id, wrapResult);

      switch (payload.method) {
        case "eth_accounts":
          return this.sendResponse(payload.id, this.eth_accounts());
        case "eth_coinbase":
          return this.sendResponse(payload.id, this.eth_coinbase());
        case "net_version":
          return this.sendResponse(payload.id, this.net_version());
        case "eth_chainId":
          return this.sendResponse(payload.id, this.eth_chainId());
        case "eth_sign":
          return this.eth_sign(payload);
        case "personal_sign":
          return this.personal_sign(payload);
        case "personal_ecRecover":
          return this.personal_ecRecover(payload);
        case "eth_signTypedData":
          return this.eth_signTypedData(payload, 'v1');
        case "eth_signTypedData_v1":
          return this.eth_signTypedData(payload, 'v1');
        case "eth_signTypedData_v3":
          return this.eth_signTypedData(payload, "v3");
        case "eth_signTypedData_v4":
          return this.eth_signTypedData(payload, 'v4');
        case "eth_sendTransaction":
          return this.eth_sendTransaction(payload);
        case "eth_requestAccounts":
          return this.eth_requestAccounts(payload);
        case "wallet_watchAsset":
          return this.wallet_watchAsset(payload);
        case "wallet_addEthereumChain":
          return this.wallet_addEthereumChain(payload);
        case "eth_newFilter":
        case "eth_newBlockFilter":
        case "eth_newPendingTransactionFilter":
        case "eth_uninstallFilter":
        case "eth_subscribe":
          throw new ProviderRpcError(
            4200,
            `Trust does not support calling ${payload.method}. Please use your own solution`
          );
        default:
          // call upstream rpc
          this.callbacks.delete(payload.id);
          this.wrapResults.delete(payload.id);
          return this.rpc
            .call(payload)
            .then((response) => {
              if (this.isDebug) {
                console.log(`<== rpc response ${JSON.stringify(response)}`);
              }
              wrapResult ? resolve(response) : resolve(response.result);
            })
            .catch(reject);
      }
    });
  }

  emitConnect(chainId) {
    this.emit("connect", { chainId: chainId });
  }

  eth_accounts() {
    return this.address ? [this.address] : [];
  }

  eth_coinbase() {
    return this.address;
  }

  net_version() {
    return this.chainId.toString(10) || null;
  }

  eth_chainId() {
    return this.chainId;
  }


  eth_sign(payload) {
    const params = payload.params

    const address = params[0]
    let message = params[1]

    const buffer = Utils.messageToBuffer(message);
    const hex = Utils.bufferToHex(buffer);

    if (isUtf8(buffer) && buffer.length != 32) {
      try {
        if (typeof message === "string" && message.startsWith("0x")) {
          const buffer = Buffer.from(message.replace("0x", ""), "hex")
          if (isUtf8(buffer) && buffer != 0) {
            message = buffer.toString('utf-8')
          }
        }
      } catch (error) {
        console.error(error)
      }

      this.postMessage("signPersonalMessage", payload.id, { data: message, from: address });
    } else {
      this.postMessage("signMessage", payload.id, { data: hex, from: address });
    }
  }

  personal_sign(payload) {
    const params = payload.params
    const first = params[0]
    const second = Utils.messageToBuffer(params[1]);

    let message, address;
    if ((this.customHandler.resemblesData(second) || isUtf8(second)) && this.customHandler.resemblesAddress(first)) {
      address = params[0]
      message = params[1]
    } else {
      message = params[0]
      address = params[1]
    }

    try {
      if (typeof message === "string" && message.startsWith("0x")) {
        const buffer = Buffer.from(message.replace("0x", ""), "hex")
        if (isUtf8(buffer) && buffer != 0) {
          message = buffer.toString('utf-8')
        }
      }
    } catch (error) {
      console.error(error)
    }

    this.postMessage("signPersonalMessage", payload.id, { data: message, from: address });
  }

  personal_ecRecover(payload) {
    this.postMessage("ecRecover", payload.id, {
      signature: payload.params[1],
      message: payload.params[0],
    });
  }

  eth_signTypedData(payload, version) {
    const params = payload.params
    const first = params[0]

    let message, address;
    if (this.customHandler.resemblesAddress(first)) {
      address = params[0]
      message = params[1]
    } else {
      message = params[0]
      address = params[1]
    }

    if (typeof (message) == 'object') {
      message = JSON.stringify(message)
    }

    this.postMessage("signTypedMessage", payload.id, {
      from: address,
      data: message,
      typeVersion: version,
    });
  }

  eth_sendTransaction(payload) {
    this.postMessage("signTransaction", payload.id, payload.params[0]);
  }

  eth_requestAccounts(payload) {
    this.postMessage("requestAccounts", payload.id, {});
  }

  wallet_watchAsset(payload) {
    let options = payload.params.options;
    this.postMessage("watchAsset", payload.id, {
      type: payload.type,
      contract: options.address,
      symbol: options.symbol,
      decimals: options.decimals || 0,
    });
  }

  wallet_addEthereumChain(payload) {
    this.postMessage("addEthereumChain", payload.id, payload.params[0]);
  }

  /**
   * @private Internal js -> native message handler
   */
  postMessage(handler, id, data) {
    if (this.ready || handler === "requestAccounts") {
      let object = {
        id: id,
        name: handler,
        object: data,
      };
      if (this.customHandler.handler(handler, id, object)) {
        return;
      }
      if (window.trustwallet.postMessage) {
        window.trustwallet.postMessage(object);
      } else {
        // old clients
        window.webkit.messageHandlers[handler].postMessage(object);
      }
    } else {
      // don't forget to verify in the app
      this.sendError(id, new ProviderRpcError(4100, "provider is not ready"));
    }
  }

  /**
   * @private Internal native result -> js
   */
  sendResponse(id, result) {
    let originId = this.idMapping.tryPopId(id) || id;
    let callback = this.callbacks.get(id);
    let wrapResult = this.wrapResults.get(id);
    let data = { jsonrpc: "2.0", id: originId };
    if (typeof result === "object" && result.jsonrpc && result.result) {
      data.result = result.result;
    } else {
      data.result = result;
    }
    if (this.isDebug) {
      console.log(
        `<== sendResponse id: ${id}, result: ${JSON.stringify(
          result
        )}, data: ${JSON.stringify(data)}`
      );
    }
    if (callback) {
      wrapResult ? callback(null, data) : callback(null, result);
      this.callbacks.delete(id);
    } else {
      console.log(`callback id: ${id} not found`);
      // check if it's iframe callback
      for (var i = 0; i < window.frames.length; i++) {
        const frame = window.frames[i];
        try {
          if (frame.ethereum.callbacks.has(id)) {
            frame.ethereum.sendResponse(id, result);
          }
        } catch (error) {
          console.log(`send response to frame error: ${error}`);
        }
      }
    }
  }

  /**
   * @private Internal native error -> js
   */
  sendError(id, error) {
    console.log(`<== ${id} sendError ${error}`);
    let callback = this.callbacks.get(id);
    if (callback) {
      callback(error instanceof Error ? error : new Error(error), null);
      this.callbacks.delete(id);
    }
  }
}

// window.trustwallet = {
//   Provider: TrustWeb3Provider,
//   Web3: Web3,
//   postMessage: null,
//   customMethodMessage: null
// };
