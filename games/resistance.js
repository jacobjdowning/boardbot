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
    }

    get players(){
        return this._players.map((player) =>{ //smart deep copy
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