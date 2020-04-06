const RedEmoji = ":red_square:";
const BlueEmoji = ":blue_square:";
const CitizenEmoji = ":white_large_square:"
const CounterAgentEmoji = ":negative_squared_cross_mark:"
const numCitizens = 7;
const numStartingAgents = 9;
const numSecondAgents = 8;
const numCounterAgents = 1;
const boardSize = 5;

class Codenames {
    constructor(){
        let redStarts = Math.random() > 0.5;
        this.startingTeam = redStarts ? RedEmoji : BlueEmoji;
        this.secondTeam = redStarts ? BlueEmoji : RedEmoji;
        this.keyCard = []
        for (let i = 0; i < numCitizens; i++) {
            this.keyCard.push(CitizenEmoji);
        }
        for (let i = 0; i < numStartingAgents; i++) {
            this.keyCard.push(this.startingTeam)         
        }
        for (let i = 0; i < numSecondAgents; i++) {
            this.keyCard.push(this.secondTeam)           
        }
        for (let i = 0; i < numCounterAgents; i++) {
            this.keyCard.push(CounterAgentEmoji)
        }
        this.shuffle(this.keyCard);

    }

    shuffle(keyCard){
        for(var i = keyCard.length-1; i>=0; i--){
            let j = parseInt(Math.random() * i);
            let x = keyCard[i];
            keyCard[i] = keyCard[j];
            keyCard[j] = x;
        }
        return keyCard
    }

    presentKeyCard(){
        let output="";
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                output = output + this.keyCard[j+i*boardSize];
            }        
            output = output + "\n";
        }
        output = output + "Starting Team is:" + this.startingTeam;
        return output;
    }
}

module.exports = Codenames;