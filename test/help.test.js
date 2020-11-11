const mockery = require('mockery');
const mockDiscord = require('./mockDiscord.js');
const should = require('chai').should();
const { startWithRequests } = require('./testHelpers.js');
let consolelog;

describe('Help Command', function(){
    before(function(){
        mockery.registerMock('discord.js', mockDiscord);
        mockery.enable({
            warnOnUnregistered: false
        });
        consolelog = console.log;
        // console.log = () => {};
    })

    after(function(){
        // console.log = consolelog;
        mockery.disable();
    })

    afterEach(function(){
        mockDiscord.clearLogs();
    })

    context("When a user uses the help command outside a game", function(){
        this.beforeEach(async function(){
            const app = startWithRequests('./requests/helpReq.js');
            this.currentTest.logs = await app.client.login('fakeToken');
        })
        it("boardbot should respond", function(){
            const responses = this.test.logs.filter(e => e.from == 'boardbot');
            responses.should.not.be.empty;
            console.log(responses);
        })
    })
})