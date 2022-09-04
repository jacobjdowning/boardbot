const mockery = require('mockery');
const mockDiscord = require('./mockDiscord.js');
const chai = require('chai');
const { startWithRequests, includeEvery } = require('./testHelpers.js');
let consolelog;

chai.should();
chai.use(includeEvery);

const fs = require('fs');


describe('Help Command', function(){
    before(function(){
        mockery.registerMock('discord.js', mockDiscord);
        mockery.enable({
            warnOnUnregistered: false
        });
        consolelog = console.log;
        console.log = () => {};
    })

    after(function(){
        console.log = consolelog;
        mockery.deregisterAll();
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
            const responses = this.test.logs.filter(e => e.from === 'boardbot');
            responses.should.not.be.empty;
        })
        it("boardbot\'s response should mention every command", function(){
            const response = this.test.logs.find(e => e.from === 'boardbot');

            const commandFiles = fs.readdirSync('./commands') .filter(file => {
                return file.endsWith('.js');
            });

            const names = commandFiles.map(file=>{
                const command = require(`../commands/${file}`);
                return command.name;
            })

            response.content.should.includeEvery(names);
        })
        it("boardbot\'s response should include each commands description "+
        "property, if it exists", function(){
            const response = this.test.logs.find(e => e.from === 'boardbot');

            const commandFiles = fs.readdirSync('./commands') .filter(file => {
                return file.endsWith('.js');
            });

            const descriptions = commandFiles.map(file=>{
                const command = require(`../commands/${file}`);
                return command.desc;
            }).filter(desc => desc);
            response.content.should.includeEvery(descriptions);
        })
    })
})