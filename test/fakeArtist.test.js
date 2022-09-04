const mockery = require('mockery');
const mockDiscord = require('./mockDiscord.js');
const chai = require('chai')
const should = chai.should();
const chaiEach = require('chai-each');
chai.use(chaiEach);
const { startWithRequests } = require('./testHelpers.js');
const monikersCards = require('../assets/moinkersCards.json');
let consolelog;

describe('Fake Artist Goes to NY', function(){
    before(function(){
        mockery.registerMock('discord.js', mockDiscord);
        mockery.enable({
            warnOnUnregistered: false
        });
        // consolelog = console.log;
        // console.log = () => {};
    });

    context('Four users, 0u - 3u, join unteamed and u0 enters'+
        ' the !fakeartist command', function () {
        before(function(){
            this.numUsers = 4;
        })
        beforeEach(async function(){
            const app = startWithRequests('./requests/fakeArtistReq.js');
            this.currentTest.app = app;
            this.currentTest.log = await app.client.login('fakeToken');
        })
        
        it('should have told someone and only one they ' + 
            'were the fake artist', function(){

            // console.log(this.test.log)

            const message="You are the Fake Artist!"
            const totalMatch = this.test.log.reduce((count, log) =>{
                return count + log.content.includes(message) ? 1 : 0
            }, 0);

            totalMatch.should.equal(1);
        })

        it('should send all other artists a prompt and a category', function(){
            //every user that is not the fake artist gets the same prompt
            const commandLogIndex = this.test.log.find(log=>log.content === '!fakeartist');
            const artistInforms = this.test.log.slice(commandLogIndex+1);
            const message="You are the Fake Artist!"
            const prompts = artistInforms.filter(log => (
                !(log.content.includes(message))
            ));
            prompts.length.should.be.equal(this.numUsers - 1);
            const promptsConent = prompts.map(log => log.content);
            promptsContent.should.each.be.equal(promptsConent[0]);

            //the description is a monikers card
            const splitPrompt = promptsContent[0].slipt(" ");
            const titleIndex = splitPrompt.findIndex(str => str === "Prompt:");
            const prompt  = splitPrompt[titleIndex + 1];
            const card = monikersCards.find(card => card.Person === prompt);
            card.should.not.be.undefined();
        })

        afterEach(function(){
            mockDiscord.clearLogs();
        });
    });

    after(function(){
        // console.log = consolelog;
        mockery.disable();
    });
})