const {AES, enc} = require("crypto-js");

export function Encrypt(value, key){
    if (typeof (value) == 'string' && typeof (key) == 'string') {
        return AES.encrypt(value, key).toString();
    } else {
        throw new Error("do not support this type key and value");
    }
}

export function Decrypt(value, key){
    if (typeof (value) == 'string' && typeof (key) == 'string') {
        let bytes = AES.decrypt(value, key);
        return bytes.toString(enc.Utf8);
    } else {
        throw new Error("do not support this type key and value");
    }
}
