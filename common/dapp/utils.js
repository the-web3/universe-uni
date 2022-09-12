import { Buffer } from "buffer";

class Utils {
  static genId() {
    return new Date().getTime() + Math.floor(Math.random() * 1000);
  }

  static flatMap(array, func) {
    return [].concat(...array.map(func));
  }

  static intRange(from, to) {
    if (from >= to) {
      return [];
    }
    return new Array(to - from).fill().map((_, i) => i + from);
  }

  static hexToInt(hexString) {
    if (hexString === undefined || hexString === null) {
      return hexString;
    }
    return Number.parseInt(hexString, 16);
  }

  static intToHex(int) {
    if (int === undefined || int === null) {
      return int;
    }
    let hexString = int.toString(16);
    return "0x" + hexString;
  }

  // message: Bytes | string
  static messageToBuffer(message) {
    var buffer = Buffer.from([]);
    try {
      if ((typeof (message) === "string")) {
        buffer = Buffer.from(message.replace("0x", ""), "hex");
      } else {
        buffer = Buffer.from(message);
      }
    } catch (err) {
      console.log(`messageToBuffer error: ${err}`);
    }
    return buffer;
  }

  static intToBuffer(i) {
    var hex = this.intToHex(i)
    return Buffer.from(hex.slice(2), 'hex')
  }

  static padToEven(a) {
    if (a.length % 2) a = '0' + a
    return a
  }

  static toBuffer(v) {
    if (!Buffer.isBuffer(v)) {
      if (Array.isArray(v)) {
        v = Buffer.from(v)
      } else if (typeof v === 'string') {
        if (this.isHexPrefixed(v)) {
          v = Buffer.from(this.padToEven(this.stripHexPrefix(v)), 'hex')
        } else {
          v = Buffer.from(v)
        }
      } else if (typeof v === 'number') {
        v = this.intToBuffer(v)
      } else if (v === null || v === undefined) {
        v = Buffer.from([])
      } else if (v.toArray) {
        // converts a BN to a Buffer
        v = Buffer.from(v.toArray())
      } else {
        throw new Error('invalid type')
      }
    }
    return v
  }

  static isValidAddress(hexAddress) {
    if (typeof (hexAddress) !== 'string') return false
    let isAddress = /^0x[0-9a-fA-F]{40}$/.test(hexAddress)
    return isAddress
  }

  static addHexPrefix(str) {
    if (typeof str !== 'string') {
      return str
    }

    return this.isHexPrefixed(str) ? str : '0x' + str
  }

  static stripHexPrefix(str) {
    if (typeof str !== 'string') {
      return str
    }
    return this.isHexPrefixed(str) ? str.slice(2) : str
  }

  static isHexPrefixed(str) {
    if (typeof str !== 'string') {
      throw new Error("[is-hex-prefixed] value must be type 'string', is currently type " + (typeof str) + ", while checking isHexPrefixed.");
    }

    return str.slice(0, 2) === '0x';
  }

  static isValidHex(data) {
    const hexRegex = /^[0-9A-Fa-f]+$/g
    const isString = typeof data === 'string'
    if (!isString) return false
    const isHexPrefixed = data.slice(0, 2) === '0x'
    if (!isHexPrefixed) return false
    const nonPrefixed = data.slice(2)
    const isValid = nonPrefixed.match(hexRegex)
    return isValid
  }

  static bufferToHex(buf) {
    return "0x" + Buffer.from(buf).toString("hex");
  }
}

module.exports = Utils;
