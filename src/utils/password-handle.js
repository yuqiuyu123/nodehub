const crypto = require('crypto');

const md5password = (password) => {
    const md5 = crypto.createHash('md5')
    const result = md5.update(password).digest('hex')
    return result; // 返回16进制的MD5哈希值
}

module.exports = md5password;