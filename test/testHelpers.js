module.exports.startWithRequests = (req) => {
    const app = require('../app.js');
    const requests = require(req);
    app.client.setTest(requests);
    return app
}

module.exports.includeEvery = (chai, utils) => {
    const Assertion = chai.Assertion;

    Assertion.addMethod('includeEvery', function(substrings){
        new Assertion(this._obj).to.be.a('string');

        const missing = substrings.filter(sub => !this._obj.includes(sub))

        this.assert(
            missing.length === 0,
            "expected #{this} to include every string in #{exp} but was missing #{act}",
            "expected #{this} to not include every string in #{exp} but did",
            substrings,
            missing
        )
    })
}