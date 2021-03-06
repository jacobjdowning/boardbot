class Resistance {
    constructor(table){
        let team = table.teams.get("unteamed");
        Resistance.shuffle(team);
        let goodPlayers = Resistance.goodPlayers(team.length);
        this._players = team.map((user, i) =>{
            return {
                "id": user.id,
                "name": user.name,
                "alignment": i<goodPlayers?"good":"evil",
                "special": i==0?"merlin":"",
            }
        });
        Resistance.shuffle(this._players);
        this.curQuest = 0;
        this.votes = new Map();
        this.voteState="none";
        this.failedVotes = 0;
    }

    setProposedTeam(team){
        if(this.voteState == "none"){
            this.proposedTeam = team;
            this.voteState = "team";
        }
    }

    isTeamProposed(){
        return this.proposedTeam || false;
    }

    safeVote(pass, playerid){ //Might want a rework
        if (this.voteState == "quest" && !this.isEvil(playerid)){
            return "Ineligable";
        }
        return this.vote(pass, playerid);
    }

    vote(pass, playerid){ //Returns true if last vote
        if (
            (this.voteState == "team") ||
            (
                this.voteState == "quest"
                && this.teamIncludes(playerid)
            )
        ){

            this.votes.set(playerid, pass);
            return this.votes.size == (this.voteState=="team"?
                this._players.length:this.proposedTeam.length);
        }
        return "Ineligable";
    }

    teamIncludes(playerid){
        for (let i = 0; i < this.proposedTeam.length; i++) {
            if(this.proposedTeam[i].id == playerid){
                return true;
            }   
        }
        return false;
    }

    isEvil(playerID){
        for (let i = 0; i < this._players.length; i++) {
            if(this._players[i].id == playerID &&
                 this._players[i].alignment == "evil"){
                return true;
            }
        }
        return false;
    }

    get currMissionCount(){
        const missionMatrix = //[playercount-5][quest]
            [ 
                [2, 3, 2, 3, 3],
                [2, 3, 4, 3, 4],
                [2, 3, 3, 4, 4],
                [3, 4, 4, 5, 5],
                [3, 4, 4, 5, 5],
                [3, 4, 4, 5, 5]
            ];
        return  missionMatrix[this._players.length-5][this.curQuest];
    }

    get nextLeader(){
        let leader = this._players.shift();
        this._players.push(leader);
        return leader;
    }

    get currLeader(){
        return this._players[this._players.length - 1];
    }

    get players(){
        return this._players.map((player) =>{ //deep copy
            return {
                "id": player.id,
                "name": player.name,
                "alignment": player.alignment,
                "special": player.special
            }
        });
    }

    static goodPlayers(total){
        return Math.floor(total/3.0*2.0);
    }

    static shuffle(array){ //maybe put this in a utilites area somewhere
        for(var i = array.length-1; i>=0; i--){
            let j = parseInt(Math.random() * i);
            let x = array[i];
            array[i] = array[j];
            array[j] = x;
        }
        return array
    }
}

module.exports = Resistance