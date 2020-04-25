class Table {
    static playerConnections = new Map();
    
    constructor(name){
        this.name = name;
        this.teams = new Map();
    }

    addPlayer(id, name, team){
        if (Table.playerConnections.has(id)){
            return false;
        }
        Table.playerConnections.set(id, this);
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
        return true;
    }

    get playerConnections(){
        return Table.playerConnections;
    }

    clearPlayers(){
        this.teams.forEach(team => {
           this.team.forEach(player =>{
               Table.playerConnections.delete(player.id);
           });
        });
        this.teams = new Map();
    }

    removePlayer(id){
        if(!Table.playerConnections.has(id)){
            return;
        }
        let table = Table.playerConnections.get(id);
        Table.playerConnections.delete(id);
        let team = null;
        let index = null;
        table.teams.forEach((v,k,m)=>{
            for (let i = 0; i < v.length; i++) {
                if (v[i].id == id) {
                    team = k
                    index = i;
                    break;
                }
            }
        });

        if (team) {
            table.teams.get(team).splice(index, 1);
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