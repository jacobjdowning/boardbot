function startWithRequests(req){
    const app = require('../app.js');
    const requests = require(req);
    app.client.setTest(requests);
    return app
}

module.exports = {
    "startWithRequests":startWithRequests
}