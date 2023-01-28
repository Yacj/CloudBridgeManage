import CryptoJS from 'crypto-js'

export const encryptParam = {
    k: 'w3N3QpJHz2QrM19T',
    iv: 'DkZGisiQPmtwq5uX'
}

export const cryptoData = {
    encrypt: cipher => {
        const key = CryptoJS.enc.Latin1.parse(encryptParam.k)
        const iv = CryptoJS.enc.Latin1.parse(encryptParam.iv)
        const srcs = CryptoJS.enc.Utf8.parse(cipher)
        const encrypted = CryptoJS.AES.encrypt(srcs, key,
            {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        )
        return encrypted.toString()
    },
    decrypt: cipher => {
        const result = CryptoJS.AES.decrypt(cipher,
            CryptoJS.enc.Utf8.parse(encryptParam.k),
            {
                iv: CryptoJS.enc.Utf8.parse(encryptParam.iv || ''),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            })
        return CryptoJS.enc.Utf8.stringify(result)
    }
}
