const vote = require('./common/vote.js');
module.exports = {
    "name": "fail",
    "gameonly": "avalon",
    "execute": (msg, args, table) => {
        vote(false, table.game, msg.author.id, msg, table);
    }
}