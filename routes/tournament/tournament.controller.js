/*
Imports
*/
const TournamentModel = require('../../models/tournament.model');
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
        const newTournament = {
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
            progression: [],
            author: userId
        }

        // Create new tournament
        TournamentModel.create(newTournament)
        .then( mongoResponse => resolve(mongoResponse) )
        .catch( mongoResponse => reject(mongoResponse) )
    });
}

const readItems = () => {
    return new Promise( (resolve, reject) => {
        TournamentModel.find((error, tournament) => {
            if(error) reject(error) // Mongo Error
            else {
                // resolve tournament
                let tournamentArray = [];
                ((async function loop() {
                    for (let i = 0; i < tournament.length; i++) {
                        const infos = await getTournamentInfos(tournament[i].author, tournament[i].game, tournament[i].platforms, tournament[i].rules, tournament[i].mode, tournament[i].registerList);
                        tournamentArray.push({ infos: infos, tournament: tournament[i]})
                    }

                    return resolve(tournamentArray);
                })());
            }
        });
    });
}

const readOneItem = (itemId) => {
    return new Promise( (resolve, reject) => {
        TournamentModel.findById(itemId, (error, tournament) => {
            if (error) return reject(error)
            else if (!tournament) return reject('Tournoi non trouvé');
            else {
                // getTournamentAuthor(tournament.author)
                // .then(author => resolve({ author: author, tournament: tournament }));
                
                getTournamentInfos(tournament.author, tournament.game, tournament.platforms, tournament.rules, tournament.mode, tournament.registerList)
                .then(infos => resolve({ infos: infos, tournament: tournament }))

                return;
            }
        });
    });
}

const registerOrUnsubscribeToTheTournament = (userId, itemId) => {
    return new Promise( (resolve, reject) => {
        TournamentModel.findById(itemId, (error, tournament) => {
            if (error) return reject(error)
            else if (!tournament) return reject('Tournoi non trouvé');
            else {
                let allPlayers = tournament.registerList;

                let isInArray = allPlayers.some(function (player) {
                    return player.equals(userId);
                });

                // Si le joueur est déjà inscrit, l'action permet de le désinscrire
                if (isInArray) {
                    allPlayers = arrayRemove(allPlayers, userId.toString());
                } else {
                    if (allPlayers.length < tournament.nbPlayers) {
                        allPlayers.push(userId);
                    } else {
                        return reject('This is tournament is already full.');
                    }
                }

                const updatedData = {
                    registerList: allPlayers
                }

                TournamentModel.updateOne({ "_id": itemId }, updatedData)
                .then( mongoResponse => resolve(mongoResponse) )
                .catch( mongoResponse => reject(mongoResponse) )
            }
        });
    });
}

const randomDrawing = (itemId) => {
    return new Promise( (resolve, reject) => {
        TournamentModel.findById(itemId, (error, tournament) => {
            if (error) return reject(error)
            else if (!tournament) return reject('Tournament not found')
            else {
                if (tournament.registerList.length < tournament.nbPlayers) {
                    return reject('The tournament is not full, please wait');
                }

                if (tournament.progression.length == 0) {
                    const allPlayers = shuffleArray(tournament.registerList);

                    const remainingPlayerList = [];
                    
                    for (let i = 0; i < allPlayers.length; i++) {
                        let onePlayer = {
                            playerId: allPlayers[i],
                            score: null
                        }

                        remainingPlayerList.push(onePlayer);
                    }

                    const firstRound = {
                        roundName: "Premier tour",
                        nbPlayers: tournament.nbPlayers,
                        remainingPlayerList: remainingPlayerList
                    }                    

                    const progression = tournament.progression;
                    progression.push(firstRound);

                    TournamentModel.update({ "_id": itemId }, {
                        "progression": progression
                    })
                    .then( mongoResponse => resolve(mongoResponse) )
                    .catch( mongoResponse => reject(mongoResponse) )
                } else {
                    return reject('First round has already been draw');
                }
                
            }
        });
    });
}

const updateScore = (itemId, userId, body) => {
    return new Promise( (resolve, reject) => {
        TournamentModel.findById(itemId, (error, tournament) => {
            if (error) return reject(error)
            else if (!tournament) return reject('Tournament not found :(');
            else {
                if (tournament.author == userId) {
                    const scorePlayer1 = body.scorePlayer1;
                    const scorePlayer2 = body.scorePlayer2;
                    const progression = tournament.progression;

                    for (let i = 0; i < progression.length; i++) {
                        if (body.roundId == progression[i]._id) {
                            const remainingPlayerList = progression[i].remainingPlayerList;
                            
                            Object.entries(remainingPlayerList).forEach(entry => {
                                let value = entry[1];
                                
                                if (scorePlayer1.playerId == value.playerId) {
                                    value.score = scorePlayer1.score;
                                } else if (scorePlayer2.playerId == value.playerId) {
                                    value.score = scorePlayer2.score;
                                }
                            });
                        }
                    }

                    TournamentModel.updateOne({ "_id": itemId }, {
                        "progression": progression
                    })
                    .then( mongoResponse => resolve(mongoResponse) )
                    .catch( mongoResponse => reject(mongoResponse) )
                } else {
                    return reject('Not allowed');
                }
            }
        });
    });
}

const nextRound = (itemId) => {
    return new Promise( (resolve, reject) => {
        TournamentModel.findById(itemId, (error, tournament) => {
            if (error) return reject(error);
            else if (!tournament) return reject('Tournament not found :(')
            else {
                const lastRound = tournament.progression[tournament.progression.length - 1];
                let remainingPlayersForNextRound = [];

                if (lastRound.remainingPlayerList.length >= 2) {
                    for (let key in lastRound.remainingPlayerList) {
                        if (lastRound.remainingPlayerList.hasOwnProperty(key)) {
                            if (key % 2) {
                                if (lastRound.remainingPlayerList[key-1].score == null || lastRound.remainingPlayerList[key].score == null) {
                                    return reject('Some results are missing');
                                } else {
                                    if (lastRound.remainingPlayerList[key-1].score > lastRound.remainingPlayerList[key].score) {
                                        remainingPlayersForNextRound.push(lastRound.remainingPlayerList[key-1]);
                                    } else {
                                        remainingPlayersForNextRound.push(lastRound.remainingPlayerList[key]);
                                    }
                                }
                            }
                        }
                    }
    
                    const nextRoundInfos = {
                        roundName: "Tour suivant",
                        nbPlayers: lastRound.nbPlayers / 2,
                        remainingPlayerList: remainingPlayersForNextRound
                    }

                    if (nextRoundInfos.nbPlayers == 1) {
                        winTournament(nextRoundInfos.remainingPlayerList[0].playerId);
                    }
    
                    const progression = tournament.progression;
                    progression.push(nextRoundInfos);
    
                    TournamentModel.updateOne({ "_id": itemId }, {
                        "progression": progression
                    })
                    .then( mongoResponse => resolve(mongoResponse) )
                    .catch( mongoResponse => reject(mongoResponse) )
                } else {
                    return reject('Remains only one player, he has already win !');
                }
            }
        });
    });
}

const winTournament = (userId) => {
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

const getTournamentInfos = (userId, gameId, platformId, ruleId, modeId, registerList) => {
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
    registerOrUnsubscribeToTheTournament,
    randomDrawing,
    updateScore,
    nextRound
}
//