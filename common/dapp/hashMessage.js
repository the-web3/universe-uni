// import { Buffer } from "buffer";
// import ethUtil from "ethereumjs-util";
// import ethAbi from "ethereumjs-abi";

// const TYPED_MESSAGE_SCHEMA = {
//     type: 'object',
//     properties: {
//         types: {
//             type: 'object',
//             additionalProperties: {
//                 type: 'array',
//                 items: {
//                     type: 'object',
//                     properties: {
//                         name: { type: 'string' },
//                         type: { type: 'string' },
//                     },
//                     required: ['name', 'type'],
//                 },
//             },
//         },
//         primaryType: { type: 'string' },
//         domain: { type: 'object' },
//         message: { type: 'object' },
//     },
//     required: ['types', 'primaryType', 'domain', 'message'],
// }

// /**
//  * Hash and add same prefix to the hash that ganache use.
//  * @param {string} message the plaintext/ascii/original message
//  * @return {string} the hash of the message, prefixed, and then hashed again
//  */
// export const hashPersonalMessage = (message) => {
//     const messageBuffer = ethUtil.toBuffer(message)
//     const prefix = Buffer.from('\u0019Ethereum Signed Message:\n' + messageBuffer.length.toString());
//     // return ethUtil.bufferToHex(ethUtil.keccak256(Buffer.concat([prefix, messageBuffer])));
//     return ethUtil.bufferToHex(Buffer.concat([prefix, messageBuffer]));
// };

// export const hashMessage = (message) => {
//     const messageBuffer = ethUtil.toBuffer(message)
//     // return ethUtil.bufferToHex(ethUtil.keccak256(messageBuffer));
//     return ethUtil.bufferToHex(messageBuffer);
// };

// /**
//  * @param typedData - Array of data along with types, as per EIP712.
//  * @returns Buffer
//  */
// export const typedSignatureHash = (typedData) => {
//     const error = new Error('Expect argument to be non-empty array')
//     if (typeof typedData !== 'object' || !typedData.length) {
//         throw error
//     }

//     const data = typedData.map(function (e) {
//         return e.type === 'bytes' ? ethUtil.toBuffer(e.value) : e.value
//     })
//     const types = typedData.map(function (e) {
//         return e.type
//     })
//     const schema = typedData.map(function (e) {
//         if (!e.name) {
//             throw error
//         }
//         return `${e.type} ${e.name}`
//     })

//     // return ethAbi.soliditySHA3(
//     //     ['bytes32', 'bytes32'],
//     //     [
//     //         ethAbi.soliditySHA3(new Array(typedData.length).fill('string'), schema),
//     //         ethAbi.soliditySHA3(types, data),
//     //     ],
//     // )

//     return {
//         hex: ethUtil.bufferToHex(Buffer.concat([
//             ethAbi.soliditySHA3(new Array(typedData.length).fill('string'), schema),
//             ethAbi.soliditySHA3(types, data),
//         ])),
//         data: data
//     }
// }

// /**
//  * A collection of utility functions used for signing typed data
//  */
// export const TypedDataUtils = {

//     /**
//      * Encodes an object by encoding and concatenating each of its members
//      *
//      * @param {string} primaryType - Root type
//      * @param {Object} data - Object to encode
//      * @param {Object} types - Type definitions
//      * @returns {string} - Encoded representation of an object
//      */
//     encodeData(primaryType, data, types, useV4 = true) {
//         const encodedTypes = ['bytes32']
//         const encodedValues = [this.hashType(primaryType, types)]

//         if (useV4) {
//             const encodeField = (name, type, value) => {
//                 if (types[type] !== undefined) {
//                     return ['bytes32', value === null || value === undefined ?
//                         '0x0000000000000000000000000000000000000000000000000000000000000000' :
//                         ethUtil.keccak(this.encodeData(type, value, types, useV4))]
//                 }

//                 if (value === undefined) {
//                     throw new Error(`missing value for field ${name} of type ${type}`)
//                 }

//                 if (type === 'bytes') {
//                     return ['bytes32', ethUtil.keccak(value)]
//                 }

//                 if (type === 'string') {
//                     // convert string to buffer - prevents ethUtil from interpreting strings like '0xabcd' as hex
//                     if (typeof value === 'string') {
//                         value = Buffer.from(value, 'utf8')
//                     }
//                     return ['bytes32', ethUtil.keccak(value)]
//                 }

//                 if (type.lastIndexOf(']') === type.length - 1) {
//                     const parsedType = type.slice(0, type.lastIndexOf('['))
//                     const typeValuePairs = value.map((item) => encodeField(name, parsedType, item))
//                     return ['bytes32', ethUtil.keccak(ethAbi.rawEncode(
//                         typeValuePairs.map(([_type]) => _type),
//                         typeValuePairs.map(([, _value]) => _value),
//                     ))]
//                 }

//                 return [type, value]
//             }

//             for (const field of types[primaryType]) {
//                 const [type, value] = encodeField(field.name, field.type, data[field.name])
//                 encodedTypes.push(type)
//                 encodedValues.push(value)
//             }
//         } else {
//             for (const field of types[primaryType]) {
//                 let value = data[field.name]
//                 if (value !== undefined) {
//                     if (field.type === 'bytes') {
//                         encodedTypes.push('bytes32')
//                         value = ethUtil.keccak(value)
//                         encodedValues.push(value)
//                     } else if (field.type === 'string') {
//                         encodedTypes.push('bytes32')
//                         // convert string to buffer - prevents ethUtil from interpreting strings like '0xabcd' as hex
//                         if (typeof value === 'string') {
//                             value = Buffer.from(value, 'utf8')
//                         }
//                         value = ethUtil.keccak(value)
//                         encodedValues.push(value)
//                     } else if (types[field.type] !== undefined) {
//                         encodedTypes.push('bytes32')
//                         value = ethUtil.keccak(this.encodeData(field.type, value, types, useV4))
//                         encodedValues.push(value)
//                     } else if (field.type.lastIndexOf(']') === field.type.length - 1) {
//                         throw new Error('Arrays currently unimplemented in encodeData')
//                     } else {
//                         encodedTypes.push(field.type)
//                         encodedValues.push(value)
//                     }
//                 }
//             }
//         }

//         return ethAbi.rawEncode(encodedTypes, encodedValues)
//     },

//     /**
//      * Encodes the type of an object by encoding a comma delimited list of its members
//      *
//      * @param {string} primaryType - Root type to encode
//      * @param {Object} types - Type definitions
//      * @returns {string} - Encoded representation of the type of an object
//      */
//     encodeType(primaryType, types) {
//         let result = ''
//         let deps = this.findTypeDependencies(primaryType, types).filter((dep) => dep !== primaryType)
//         deps = [primaryType].concat(deps.sort())
//         for (const type of deps) {
//             const children = types[type]
//             if (!children) {
//                 throw new Error(`No type definition specified: ${type}`)
//             }
//             result += `${type}(${types[type].map(({ name, type: _type }) => `${_type} ${name}`).join(',')})`
//         }
//         return result
//     },

//     /**
//      * Finds all types within a type defintion object
//      *
//      * @param {string} primaryType - Root type
//      * @param {Object} types - Type definitions
//      * @param {Array} results - current set of accumulated types
//      * @returns {Array} - Set of all types found in the type definition
//      */
//     findTypeDependencies(primaryType, types, results = []) {
//         const [firstWord] = primaryType.match(/^\w*/u)
//         primaryType = firstWord
//         if (results.includes(primaryType) || types[primaryType] === undefined) {
//             return results
//         }
//         results.push(primaryType)
//         for (const field of types[primaryType]) {
//             for (const dep of this.findTypeDependencies(field.type, types, results)) {
//                 !results.includes(dep) && results.push(dep)
//             }
//         }
//         return results
//     },

//     /**
//      * Hashes an object
//      *
//      * @param {string} primaryType - Root type
//      * @param {Object} data - Object to hash
//      * @param {Object} types - Type definitions
//      * @returns {string} - Hash of an object
//      */
//     hashStruct(primaryType, data, types, useV4 = true) {
//         return ethUtil.keccak(this.encodeData(primaryType, data, types, useV4))
//     },

//     /**
//      * Hashes the type of an object
//      *
//      * @param {string} primaryType - Root type to hash
//      * @param {Object} types - Type definitions
//      * @returns {string} - Hash of an object
//      */
//     hashType(primaryType, types) {
//         return ethUtil.keccak(this.encodeType(primaryType, types))
//     },

//     /**
//      * Removes properties from a message object that are not defined per EIP-712
//      *
//      * @param {Object} data - typed message object
//      * @returns {Object} - typed message object with only allowed fields
//      */
//     sanitizeData(data) {
//         const sanitizedData = {}
//         for (const key of Object.keys(TYPED_MESSAGE_SCHEMA.properties)) {
//             data[key] && (sanitizedData[key] = data[key])
//         }
//         if (sanitizedData.types) {
//             sanitizedData.types = { EIP712Domain: [], ...sanitizedData.types }
//         }
//         return sanitizedData
//     },

//     /**
//      * Signs a typed message as per EIP-712 and returns its keccak hash
//      *
//      * @param {Object} typedData - Types message data to sign
//      * @returns {string} - keccak hash of the resulting signed message
//      */
//     sign(typedData, useV4 = true) {
//         const sanitizedData = this.sanitizeData(typedData)

//         const parts = [Buffer.from('1901', 'hex')]
//         parts.push(this.hashStruct('EIP712Domain', sanitizedData.domain, sanitizedData.types, useV4))
//         if (sanitizedData.primaryType !== 'EIP712Domain') {
//             parts.push(this.hashStruct(sanitizedData.primaryType, sanitizedData.message, sanitizedData.types, useV4))
//         }
//         // return ethUtil.keccak(Buffer.concat(parts))
//         return {
//             hex: ethUtil.bufferToHex(Buffer.concat(parts)),
//             data: sanitizedData.message
//         }
//     },
// }
