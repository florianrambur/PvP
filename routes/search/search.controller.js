/*
Imports
*/
const ChampionshipModel = require('../../models/championship.model');
const TournamentModel = require('../../models/tournament.model');
const UserModel = require('../../models/user.model');
const GameModel = require('../../models/game.model');
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
                        let championshipArray = [];
                        ((async function loop() {
                            for (let i = 0; i < championships.length; i++) {
                                const infos = await getChampionshipInfos(championships[i].author, championships[i].game);
                                championshipArray.push({ infos: infos, championship: championships[i]})
                            }
        
                            resolve(championshipArray);
                        })());
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

    const getChampionshipInfos = (userId, gameId) => {
        return new Promise( (resolve, reject) => {
    
            UserModel.findById( userId, { _id: 0, pseudo: 1, email: 1, _id: 0 }, (error, user) => {
                if (error) return reject(error)
                else {
    
                    GameModel.findById( gameId, { name: 1, image: 1, _id: 0 }, (error, game) => {
                        if (error) return reject(error)
                        else {
                            let result = {};
    
                            result.game = game.name;
                            result.image = game.image;
                            result.author = user;
                            
                            resolve(result);
                            
                        }
                    });
                }
            });
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