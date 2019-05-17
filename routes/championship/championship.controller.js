/*
Imports
*/
    const ChampionshipModel = require('../../models/championship.model');
    const UserModel = require('../../models/user.model');
    const GameModel = require('../../models/game.model');
    const { arrayRemove, arrayRemoveForRanking, shuffleArray, arrayRemoveForPlayerA, arrayRemoveForPlayerB } = require('../../services/helpers');
//

/*
Methods
*/
    const createItem = (body, userId) => {
        return new Promise( (resolve, reject) => {
            // Définition de l'objet à enregistrer

            const newChampionship = {
                game: body.game,
                name: body.name,
                description: body.description,
                mode: body.mode,
                rules: body.rules,
                platforms: body.platforms,
                online: body.online,
                isPrivate: body.isPrivate,
                nbPlayers: body.nbPlayers,
                startDate: body.startDate,
                place: body.place,
                dateCreation: new Date(),
                status: 0,
                registerList: [],
                matches: [],
                ranking: [],
                author: userId
            }

            // Create this object
            ChampionshipModel.create(newChampionship)
            .then( mongoResponse => resolve(mongoResponse) )
            .catch( mongoResponse => reject(mongoResponse) )
        });
    }

    const readItems = () => {
        return new Promise( (resolve, reject) => {
            ChampionshipModel.find((error, championship) => {
                if(error) reject(error) // Mongo Error
                else {
                    // resolve championship
                    let championshipArray = [];
                    ((async function loop() {
                        for (let i = 0; i < championship.length; i++) {
                            const infos = await getChampionshipInfos(championship[i].author, championship[i].game, championship[i].platforms, championship[i].rules, championship[i].mode, championship[i].registerList);
                            championshipArray.push({ infos: infos, championship: championship[i]})
                        }
    
                        return resolve(championshipArray);
                    })());
                }
            });
        });
    }
    
    const readOneItem = (itemId) => {
        return new Promise( (resolve, reject) => {
            ChampionshipModel.findById(itemId, (error, championship) => {
                if (error) return reject(error)
                else if (!championship) return reject('Tournoi non trouvé');
                else {
                    const ranking = championship.ranking;
                    let MVP = {
                        _id: null,
                        playerId: null,
                        points: 0,
                        average: null
                    }

                    ranking.forEach(function(player) {
                        if (player.points > MVP.points) {
                            MVP = player;
                        }
                    });

                    getChampionshipInfos(championship.author, championship.game, championship.platforms, championship.rules, championship.mode, championship.registerList)
                    .then(infos => resolve({ MVP: MVP, infos: infos, championship: championship }));

                    return;
                }
            });
        });
    }

    const registerToTheChampionship = (userId, itemId) => {
        return new Promise( (resolve, reject) => {
            ChampionshipModel.findById(itemId, (error, championship) => {
                if (error) return reject(error)
                else if (!championship) return reject('Championship not found');
                else {
                    let allPlayers = championship.registerList;
                    let ranking = championship.ranking;
                    let matches = championship.matches;

                    let isInArray = allPlayers.some(function (player) {
                        return player.equals(userId);
                    });
                    
                    if (isInArray == false) {
                        if (allPlayers.length < championship.nbPlayers) {
                            allPlayers.push(userId);
                            ranking.push({
                                playerId: userId,
                                nbMatches: 0,
                                points: 0,
                                average: 0
                            });

                            if (allPlayers.length > 1) {
                                championship.registerList.forEach(function(register) {
                                    if (register != userId) {
                                        matches.push({
                                            playerA: userId,
                                            scorePlayerA: null,
                                            playerB: register,
                                            scorePlayerB: null
                                        });
                                    }
                                });
                            }
                        } else {
                            return reject('This is championship is already full.');
                        }
                    } else {
                        return reject('User is already registered');
                    }
    
                    const updatedData = {
                        registerList: allPlayers,
                        ranking: ranking,
                        matches: matches
                    }

                    ChampionshipModel.updateOne({ "_id": itemId }, updatedData)
                    .then( mongoResponse => resolve(mongoResponse) )
                    .catch( mongoResponse => reject(mongoResponse) )
                }
            });
        });
    }

    const unsubscribeToTheChampionship = (userId, itemId) => {
        return new Promise( (resolve, reject) => {
            ChampionshipModel.findById(itemId, (error, championship) => {
                if (error) return reject(error)
                else if (!championship) return reject('Championship not found');
                else {
                    let allPlayers = championship.registerList;
                    let ranking = championship.ranking;
                    let matchesUpdated = championship.matches;

                    let isInArray = allPlayers.some(function (player) {
                        return player.equals(userId);
                    });
                    
                    if (isInArray == true) {
                        allPlayers = arrayRemove(allPlayers, userId.toString());
                        ranking = arrayRemoveForRanking(ranking, userId.toString());

                        matchesUpdated = arrayRemoveForPlayerA(matchesUpdated, userId.toString());
                        matchesUpdated = arrayRemoveForPlayerB(matchesUpdated, userId.toString());
                    } else {
                        return reject('User is not in this championship');
                    }
    
                    const updatedData = {
                        registerList: allPlayers,
                        ranking: ranking,
                        matches: matchesUpdated
                    }                    

                    ChampionshipModel.updateOne({ "_id": itemId }, updatedData)
                    .then( mongoResponse => resolve(mongoResponse) )
                    .catch( mongoResponse => reject(mongoResponse) )
                }
            });
        });
    }

    const updateScore = (itemId, body) => {
        return new Promise( (resolve, reject) => {
            ChampionshipModel.findById(itemId, (error, championship) => {
                if (error) return reject(error);
                else if (!championship) return reject('Championship not found');
                else {
                    const playerA = body.playerA;
                    const playerB = body.playerB;
                    const scorePlayerA = body.scorePlayerA;
                    const scorePlayerB = body.scorePlayerB;
                    const matches = championship.matches;
                    const ranking = championship.ranking;

                    if (championship.matches.id(body.idMatch).scorePlayerB != null && championship.matches.id(body.idMatch).scorePlayerA != null) {
                        for (let i = 0; i < ranking.length; i++) {
                            if (ranking[i].playerId == playerA) {

                                let points;
                                let average = championship.matches.id(body.idMatch).scorePlayerA - championship.matches.id(body.idMatch).scorePlayerB;
                                if (championship.matches.id(body.idMatch).scorePlayerA > championship.matches.id(body.idMatch).scorePlayerB) {
                                    points = ranking[i].points - 3;
                                } else {
                                    points = 0;
                                }

                                ranking[i] = {
                                    playerId: playerA,
                                    nbMatches: ranking[i].nbMatches - 1,
                                    points: points,
                                    average: ranking[i].average - average
                                }
                            }

                            if (ranking[i].playerId == playerB) {

                                let points;
                                let average = championship.matches.id(body.idMatch).scorePlayerB - championship.matches.id(body.idMatch).scorePlayerA;
                                if (championship.matches.id(body.idMatch).scorePlayerB > championship.matches.id(body.idMatch).scorePlayerA) {
                                    points = ranking[i].points - 3;
                                } else {
                                    points = 0;
                                }

                                ranking[i] = {
                                    playerId: playerB,
                                    nbMatches: ranking[i].nbMatches - 1,
                                    points: points,
                                    average: ranking[i].average - average
                                }
                            }
                        }
                    }
                    
                    if (championship.matches.id(body.idMatch).playerA == body.playerA) {
                        championship.matches.id(body.idMatch).scorePlayerA = body.scorePlayerA;
                    } else {
                        championship.matches.id(body.idMatch).scorePlayerA = body.scorePlayerB;
                    }

                    if (championship.matches.id(body.idMatch).playerB == body.playerB) {
                        championship.matches.id(body.idMatch).scorePlayerB = body.scorePlayerB;
                    } else {
                        championship.matches.id(body.idMatch).scorePlayerB = body.scorePlayerA;
                    }


                    for (let i = 0; i < ranking.length; i++) {
                        if (ranking[i].playerId == playerA) {
                            let points;
                            let average = scorePlayerA - scorePlayerB;
                            if (scorePlayerA > scorePlayerB) {
                                points = 3;
                            } else {
                                points = 0;
                            }

                            ranking[i] = {
                                playerId: playerA,
                                nbMatches: ranking[i].nbMatches + 1,
                                points: ranking[i].points + points,
                                average: ranking[i].average + average
                            }
                        }

                        if (ranking[i].playerId == playerB) {
                            let points;
                            let average = scorePlayerB - scorePlayerA;
                            if (scorePlayerB > scorePlayerA) {
                                points = 3;
                            } else {
                                points = 0;
                            }

                            ranking[i] = {
                                playerId: playerB,
                                nbMatches: ranking[i].nbMatches + 1,
                                points: ranking[i].points + points,
                                average: ranking[i].average + average
                            }
                        }
                    }

                    ChampionshipModel.updateOne({ "_id": itemId }, {
                        "matches": matches,
                        "ranking": ranking,
                        "status": 1
                    })
                    .then( mongoResponse => resolve(mongoResponse) )
                    .catch( mongoResponse => reject(mongoResponse) )
                }
            });
        });
    }

    const closeChampionship = (championshipId) => {
        return new Promise( (resolve, reject) => {
            ChampionshipModel.findById( championshipId, (error, championship) => {
                if (error) return reject(error)
                else if (!championship) {
                    return reject('Championship not found');
                } else {
                    const ranking = championship.ranking;
                    let MVP = {
                        _id: null,
                        playerId: null,
                        points: 0,
                        average: null
                    }

                    ranking.forEach(function(player) {
                        if (player.points > MVP.points) {
                            MVP = player;
                        }
                    });

                    winChampionship(MVP.playerId);

                    ChampionshipModel.updateOne({ "_id": championshipId }, {
                        "status": 2     
                    })
                    .then( mongoResponse => resolve(mongoResponse) )
                    .catch( mongoResponse => reject(mongoResponse) );
                }
            });
        });
    }

    const winChampionship = (userId) => {
        return new Promise( (resolve, reject) => {
            UserModel.findById( userId, (error, user) => {
                if (error) return reject(error)
                else if (!user) return reject('User not found')
                else {
                    let countWin = user.countWin;

                    UserModel.updateOne({ "_id": userId}, {
                        "countWin": countWin + 1
                    })
                    .then( mongoResponse => resolve(mongoResponse) )
                    .catch( mongoResponse => reject(mongoResponse) )
                }
            });
        });
    }

    const getChampionshipInfos = (userId, gameId, platformId, ruleId, modeId, registerList) => {
        return new Promise( (resolve, reject) => {
    
            UserModel.findById( userId, { _id: 0, pseudo: 1, email: 1, _id: 0 }, (error, user) => {
                if (error) return reject(error)
                else {
    
                    GameModel.findById( gameId, { name: 1, platforms: 1, modes: 1, rules: 1, image: 1, banner: 1,  _id: 0 }, (error, game) => {
                        if (error) return reject(error)
                        else {
                            let result = {};
    
                            UserModel.find( { _id: { $in: registerList }} , (error, registers) => {
                                result.game = game.name;
                                result.image = game.image;
                                result.banner = game.banner;
                                result.platform = game.platforms.id(platformId).name;
                                result.mode = game.modes.id(modeId);
                                result.rule = game.rules.id(ruleId);
                                result.registerList = registers;
                                result.author = user;
                                
                                resolve(result);
                            });
                            
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
        createItem,
        readItems,
        readOneItem,
        registerToTheChampionship,
        unsubscribeToTheChampionship,
        updateScore,
        closeChampionship
    }
//