function startWithRequests(req){
    delete require.cache[require.resolve('../app.js')];
    const Table = require('../table.js');
    Table.playerConnections = new Map();
    const app = require('../app.js');
    const requests = require(req);
    app.client.setTest(requests);
    return app
}

module.exports = {
    "startWithRequests":startWithRequests
}