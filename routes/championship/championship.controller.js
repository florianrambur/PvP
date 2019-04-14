/*
Imports
*/
    const ChampionshipModel = require('../../models/championship.model');
    const UserModel = require('../../models/user.model');
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
                            const user = await getChampionshipAuthor(championship[i].author);
                            championshipArray.push({user: user, championship: championship[i]})
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
    
                    getChampionshipAuthor(championship.author)
                    .then(user => author = user);
                    
                    return resolve({ user: author, championship: championship });
                }
            });
        });
    }

    const getChampionshipAuthor = (userId) => {
        return new Promise( (resolve, reject) => {
            UserModel.findById( userId, { email:1, _id: 0 }, (error, user) => {
                if(error) return reject(error) // Mongo Error
                else {
                    return resolve(user);
                }
            });
        })
    }

    const registerOrUnsubscribeToTheChampionship = (userId, itemId) => {
        return new Promise( (resolve, reject) => {
            ChampionshipModel.findById(itemId, (error, championship) => {
                if (error) return reject(error)
                else if (!championship) return reject('Championship not found');
                else {
                    let allPlayers = championship.registerList;
    
                    let isInArray = allPlayers.some(function (player) {
                        return player.equals(userId);
                    });
    
                    // Si le joueur est déjà inscrit, l'action permet de le désinscrire
                    if (isInArray) {
                        allPlayers = arrayRemove(allPlayers, userId.toString());
                    } else {
                        if (allPlayers.length < championship.nbPlayers) {
                            allPlayers.push(userId);
                        } else {
                            return reject('This is championship is already full.');
                        }
                    }
    
                    const updatedData = {
                        registerList: allPlayers
                    }
    
                    ChampionshipModel.updateOne({ "_id": itemId }, updatedData)
                    .then( mongoResponse => resolve(mongoResponse) )
                    .catch( mongoResponse => reject(mongoResponse) )
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
        registerOrUnsubscribeToTheChampionship
    }
//