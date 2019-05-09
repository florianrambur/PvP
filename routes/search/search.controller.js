/*
Imports
*/
const ChampionshipModel = require('../../models/championship.model');
const TournamentModel = require('../../models/tournament.model');
//

/*
Methods
*/

    const searchCompetition = (body) => {
        let query = {};
        if (body.hasOwnProperty("game") && body.game != null) {
            query["game"] = body.game;
        }
        if (body.hasOwnProperty("nbPlayers") && body.nbPlayers != null) {
            query["nbPlayers"] = body.nbPlayers;
        }
        if (body.hasOwnProperty("online") && body.online != null) {
            query["online"] = body.online;
        }
        if (body.hasOwnProperty("platforms") && body.platforms != null) {
            query["platforms"] = body.platforms;
        }
        if (body.hasOwnProperty("startDate") && body.startDate != null) {
            query["startDate"] = body.startDate;
        }
        if (body.hasOwnProperty("place") && body.place != null) {
            query["place"] = new RegExp(body.place, "i");
        }
        
        return new Promise( (resolve, reject) => {
            if (body.competition == 'championship') {
                ChampionshipModel.find(
                    query,
                    (error, championships) => {
                    if (error) return reject(error)
                    else {
                        resolve(championships);
                    }
                });
            } else if (body.competition == 'tournament') {
                TournamentModel.find(
                    query,
                    (error, tournaments) => {
                    if (error) return reject(error)
                    else {
                        resolve(tournaments);
                    }
                });
            }

        });
    }
//

/*
Exports
*/
module.exports = {
    searchCompetition
}
//