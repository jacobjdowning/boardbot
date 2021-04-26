const mockery = require('mockery');
const mockDiscord = require('./mockDiscord.js');
const should = require('chai').should();
const { startWithRequests,  resetTableConnections} = require('./testHelpers.js');
let consolelog;

describe("Avalon", function(){
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

    context("Avalon game started with 7 players and one of every character", function(){
        beforeEach(async function(){
            const app = startWithRequests(
                require('./requests/avalonReq.js').slice(0,8)
            );
            this.currentTest.app = app;
            this.currentTest.logs = await app.client.login('fakeToken');
        })
        afterEach(function(){
            resetTableConnections()
        })
        it("should have one of every character in it", function(){
            const game = this.test.app.tables.values().next().value.game;
            const specials = game.players.map(player => player.special);
            
            specials.should.include('merlin');
            specials.should.include('percival');
            specials.should.include('oberon');
            specials.should.include('mordred');
            specials.should.include('morgana');
        })
        it("should pick someone as the captain for the next mission", function(){
            const test = this.test.logs;
            throw new Error("Unimplemented Test");
        })
        // it("should place enough emojis to pick a team from", function(){
        //   throw new Error("Unimplemented Test");
        // })
    })
})