/*
Imports
*/
    const TournamentModel = require('../../models/tournament.model');
    const UserModel = require('../../models/user.model');
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
                author: userId
            }

            // Create new tournament
            TournamentModel.create(newTournament)
            .then( mongoResponse => resolve(mongoResponse) )
            .catch( mongoResponse => reject(mongoResponse) )
        });
    }

    const readItems = (body, userId) => {
        return new Promise( (resolve, reject) => {
            TournamentModel.find().populate({			
                populate: { 
                    path:  'modes',
                    model: 'game' 
                }
            }).exec((error, tournament) => {
                if(error) reject(error)
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
                    const author = {};

                    getTournamentAuthor(tournament.author)
                    .then(user => author = user);
                    
                    return resolve({ user: author, tournament: tournament });
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
        readOneItem
    }
//