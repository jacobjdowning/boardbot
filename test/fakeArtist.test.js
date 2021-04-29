const mockery = require('mockery');
const mockDiscord = require('./mockDiscord.js');
const should = require('chai').should();
const { startWithRequests } = require('./testHelpers.js');
let consolelog;

describe('Fake Artist Goes to NY', function(){
    before(function(){
        mockery.registerMock('discord.js', mockDiscord);
        mockery.enable({
            warnOnUnregistered: false
        });
        consolelog = console.log;
        console.log = () => {};
    });

    context('Four users, 0u - 3u, join unteamed and u0 enters'+
        ' the !fakeartist command', function () {
        beforeEach(async function(){
            const app = startWithRequests('./requests/fakeArtistReq.js');
            this.currentTest.app = app;
            this.currentTest.log = await app.client.login('fakeToken');
        })
        
        it('should have told someone and only one they ' + 
            'were the fake artist', function(){

            console.log(this.test.log)

            const message="You are the Fake Artist!"
            const totalMatch = this.test.log.reduce((count, log) =>{
                return count + log.content.includes(message) ? 1 : 0
            }, 0);

            totalMatch.should.equal(1);
        })

        afterEach(function(){
            // this.currentTest.app.tables = new Map();
            mockDiscord.clearLogs();
        });
    });

    after(function(){
        console.log = consolelog;
        mockery.disable();
    });
})