class Table {
    constructor(name){
        this.name = name;
        this.teams = new Map();
    }

    addPlayer(id, name, team){
        if (team == null) {
            team = "unteamed";
        }
        if (!this.teams.has(team)){
            this.teams.set(team, []);
        }
        this.teams.get(team).push({
            "id": id,
            "name": name
        });
    }

    clearPlayers(){
        this.teams = new Map();
    }

    removePlayer(id){
        let team = null;
        let index = null;
        this.teams.forEach((v,k,m)=>{
            for (let i = 0; i < v.length; i++) {
                if (v[i].id == id) {
                    team = k
                    index = i;
                    break;
                }
            }
        })

        if (team) {
            this.teams.get(team).splice(index, 1);
        }
    }

    presentMembers(){
        let output = "";
        this.teams.forEach((v,  k, m) =>{
            output = output + "Team: " + k + "\n";
            v.forEach(player =>{
                output = output + "\t" + player.name;
            })
            output = output + "\n";
        });
        return output;
    }
}

module.exports = Table;