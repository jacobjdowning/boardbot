const fs = require('fs');
const { shuffle } = require("../utility.js");

const numWords = 4;
const wordsInCode = 3;

const wordlist = fs.readFileSync('./assets/wordlist.txt',{ 'encoding':'utf8'})
                .split('\n')
                .map((word) => {
                    return word.slice(0, -1)
                }); 
//maybe this^ should be async? probably lazily instantiated, maybe static? 
//maybe only when we need a new board

const categories = fs.readFileSync('./assets/laserDiskCategories.txt',{'encoding':'utf8'})
                    .split('\n')
                    .map((word) => {
                        return word.slice(0, -1)
                    });


class Decrypto {
    constructor(table, expansion){
        this.expansion = expansion;
        console.log(expansion);
        this.roundCount = 0;
        this.teams = [];
        this.teams.push(table.teams.get('black'));
        this.teams.push(table.teams.get('white'));
        this.board = [];
        let localwordlist = [...wordlist];
        for (let i = 0; i < numWords*2; i++) {
            this.board.push(localwordlist.splice(parseInt(Math.random()*wordlist.length), 1));
        }
        localwordlist = null;
        this.categories = shuffle([...categories]);
    }

    getType(){return "decrypto"}

    startGame(){
        let messages = [];
        for (let i = 0; i < this.teams.length; i++) {
            this.teams[i].forEach(player => {
                messages.push({
                    "id":player.id,
                    "content":this.presentBoard(i)
                });
            });
        }
        return messages;
    }

    sendBoard(playerID){
        for (let i = 0; i < 2; i++) {   
            for (let j = 0; j < this.teams.length; j++) {
                const player = this.teams[i][j];
                if (player.id == playerID) {
                    return this.presentBoard(i);
                }
            }
        }
        return "It does not look like you are on a team";
    }

    presentBoard(team){ //0 is black team, 1 is white team
        let output = "";
        for (let i = 0; i < numWords; i++) {
            output = output + `${i+1}: ${this.board[i+team*numWords]} `; 
        }
        return output;
    }

    startRound(){
        if(this.roundCount++ >= 6) return "Game's over! Time to score";
        let curCategory = this.categories.pop();
        let messages = [{
            "id": "channel",
            "content":`Starting round:${this.roundCount}` +
            (this.expansion?` with the category: ${curCategory}`:'')
        }];
        let encryptors = [];
        for (let i = 0; i < 2; i++) {
            let encryptor = this.teams[i].shift();
            encryptors.push(encryptor);
            this.teams[i].push(encryptor);
        }
        this.codes = [];
        for (let i = 0; i < 2; i++) {
            let code = this.generateCode();
            this.codes.push(code);
            messages.push({
                "id":encryptors[i].id,
                "content":`you have been chosen as an encryptor`+
                ` this round, your code is ${this.codes[i]}` +
                (this.expansion?` with the category: ${curCategory}`:'')
            });
        }
        return messages;
    }

    generateCode(){
        let numbers = [];
        let output = "";
        for (let i = 1; i <= numWords; i++) {
            numbers.push(i);
        }
        for (let i = 0; i < wordsInCode; i++) {
            output = output + numbers.splice(parseInt(Math.random()*(numWords-i)), 1).shift() + (i<wordsInCode-1?'.':'');
        }
        return output;
    }

    revealCode(team){ //0 is black team, 1 is white team
        return `The ${team?'white':'black'} team's code was ${this.codes[team]}`;        
    }
}

module.exports = Decrypto;