const codeReveal = require('./common/codeReveals.js');
module.exports = {
    "name": "whitecode",
    "onlyGame": "decrypto",
    "execute": (msg, args, table) => {
        codeReveal(1, msg, table)
    }
}