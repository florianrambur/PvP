/*
Imports
*/
const TournamentModel = require('../../models/tournament.model');
const UserModel = require('../../models/user.model');
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
            rule: body.rule,
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
                        const user = await getTournamentAuthor(tournament[i].author);
                        tournamentArray.push({user: user, tournament: tournament[i]})
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
                let author = {};

                getTournamentAuthor(tournament.author)
                .then(user => author = user);
                
                return resolve({ user: author, tournament: tournament });
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
    
                    const nextRound = {
                        roundName: "Tour suivant",
                        nbPlayers: lastRound.nbPlayers / 2,
                        remainingPlayerList: remainingPlayersForNextRound
                    }
    
                    const progression = tournament.progression;
                    progression.push(nextRound);
    
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

const getTournamentAuthor = id => {
    return new Promise( (resolve, reject) => {
        UserModel.findById( id, { email:1, _id: 0 }, (error, user) => {
            if(error) return reject(error) // Mongo Error
            else {
                return resolve(user);
            }
        });
    })
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