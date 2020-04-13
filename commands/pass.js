const vote = require('./common/vote.js');
module.exports = {
    "name": "pass",
    "gameonly": "avalon",
    "execute": (msg, args, table) => {
        vote(true, table.game, msg.author.id, msg);
    }
}