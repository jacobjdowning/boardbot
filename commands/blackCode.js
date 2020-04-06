//TODO: consolidate into one decrypto command with arguments
const codeReveal = require('./common/codeReveals.js');
module.exports = {
    "name": "blackcode",
    "onlyGame": "decrypto",
    "execute": (msg, args, table) => {
        codeReveal(0, msg, table);
    }
}