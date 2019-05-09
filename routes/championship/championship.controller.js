/*
Imports
*/
    const ChampionshipModel = require('../../models/championship.model');
    const UserModel = require('../../models/user.model');
    const GameModel = require('../../models/game.model');
    const { arrayRemove, shuffleArray } = require('../../services/helpers');
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
                            const infos = await getChampionshipInfos(championship[i].author, championship[i].game, championship[i].platforms, championship[i].rules, championship[i].mode);
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
                    let author = {};  
                    console.log(championship.game);
                    getChampionshipInfos(championship.author, championship.game, championship.platforms, championship.rules, championship.mode, championship.registerList)
                    .then(infos => resolve({ infos: infos, championship: championship }));

                    return;
                }
            });
        });
    }

    const registerOrUnsubscribeToTheChampionship = (userId, itemId) => {
        return new Promise( (resolve, reject) => {
            ChampionshipModel.findById(itemId, (error, championship) => {
                if (error) return reject(error)
                else if (!championship) return reject('Championship not found');
                else {
                    let allPlayers = championship.registerList;
                    let ranking = championship.ranking;

                    let isInArray = allPlayers.some(function (player) {
                        return player.equals(userId);
                    });
    
                    // Si le joueur est déjà inscrit, l'action permet de le désinscrire
                    if (isInArray) {
                        allPlayers = arrayRemove(allPlayers, userId.toString());
                        ranking = arrayRemove(ranking, userId.toString());
                    } else {
                        if (allPlayers.length < championship.nbPlayers) {
                            allPlayers.push(userId);
                            ranking.push({
                                playerId: userId,
                                nbMatches: 0,
                                points: 0,
                                average: 0
                            });
                        } else {
                            return reject('This is championship is already full.');
                        }
                    }
    
                    const updatedData = {
                        registerList: allPlayers,
                        ranking: ranking
                    }
    
                    ChampionshipModel.updateOne({ "_id": itemId }, updatedData)
                    .then( mongoResponse => resolve(mongoResponse) )
                    .catch( mongoResponse => reject(mongoResponse) )
                }
            });
        });
    }

    const addScore = (itemId, body) => {
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

                    for (let i = 0; i < matches.length; i++) {
                        if (matches[i].playerA == playerA && matches[i].playerB == playerB) {
                            return reject('This match has already been added');
                        }
                    }

                    const newMatch = {
                        playerA: playerA,
                        scorePlayerA: scorePlayerA,
                        playerB: playerB,
                        scorePlayerB: scorePlayerB
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

                    matches.push(newMatch);

                    ChampionshipModel.updateOne({ "_id": itemId }, {
                        "matches": matches,
                        "ranking": ranking
                    })
                    .then( mongoResponse => resolve(mongoResponse) )
                    .catch( mongoResponse => reject(mongoResponse) )
                }
            });
        });
    }

    const getChampionshipInfos = (userId, gameId, platformId, ruleId, modeId, registerList) => {
        return new Promise( (resolve, reject) => {
    
            UserModel.findById( userId, { pseudo: 1, email: 1, _id: 0 }, (error, user) => {
                if (error) return reject(error)
                else {
    
                    GameModel.findById( gameId, { name: 1, platforms: 1, modes: 1, rules: 1, image: 1, _id: 0 }, (error, game) => {
                        if (error) return reject(error)
                        else {
                            let result = {};
                            // let registerArray = [];
    
                            // for (register in registerList) {
                            //     registerArray.push(UserModel.findById(register));
                            // }
    
                            UserModel.find( { _id: { $in: registerList }} , (error, registers) => {
                                result.game = game.name;
                                result.image = game.image;
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
        registerOrUnsubscribeToTheChampionship,
        addScore
    }
//