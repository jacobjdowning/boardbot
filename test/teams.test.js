const mockery = require('mockery');
const mockDiscord = require('./mockDiscord.js');
const should = require('chai').should();
const { startWithRequests } = require('./testHelpers.js');
let consolelog;

describe('Teams', function(){
    before(function(){
        mockery.registerMock('discord.js', mockDiscord);
        mockery.enable({
            warnOnUnregistered: false
        });
    });

    beforeEach(function(){
        consolelog = console.log;
        console.log = () => {};
    })

    context('When two users, u0 and u1, join team black and'+
     ' two users, u2 and u3, join team white', function () {
        it('should have placed the members at the table', async function() {
            const app = startWithRequests('./requests/teamsReq.js');
            
            await app.client.login('fakeToken');
            const teams = app.tables.values().next().value.teams;

            teams.should.have.all.keys('black','white');
        });

        it('should respond with a list of members on teams', async function() {
            const app = startWithRequests('./requests/teamsReq.js');

            const logs = await app.client.login('fakeToken');
            const lastLog = logs[logs.length-1];

            lastLog.content.should.have.string('black').and.string('white');
            lastLog.content.should.have.string('u0').and.string('u3');
        });
    });
    
    afterEach(function(){
        console.log = consolelog;
        mockDiscord.clearLogs();
    });

    after(function(){
        mockery.disable();
    });

});
