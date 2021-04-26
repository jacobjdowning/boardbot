const MockDiscord = require('../test/mockDiscord')
const Table = require('../table');

function startWithRequests(req){
    delete require.cache[require.resolve('../app.js')];
    const app = require('../app.js');
    let requests
    if (Array.isArray(req)){
        requests = req;
    }else if ((typeof req) === 'string'){
        const oreq = require(req)

        requests = [...oreq];
    }else{
        throw new Error("startWithRequests requires a stirng or an array")
    }
    app.client.setTest(requests);
    return app
}

function resetTableConnections(){
    Table.playerConnections = new Map();
}

module.exports = {
    "startWithRequests":startWithRequests,
    "resetTableConnections":resetTableConnections
}